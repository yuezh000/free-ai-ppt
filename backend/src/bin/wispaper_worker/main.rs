mod config;
mod freeppt;
mod wispaper;

use anyhow::{Context, Result, bail};
use config::WorkerConfig;
use freeppt::{ClaimedJob, FreePptClient, InputFile};
use std::time::Instant;
use tokio::time::{MissedTickBehavior, interval, sleep};
use tracing::{error, info, warn};
use wispaper::{ActivitySnapshot, Artifact, CreatedWorkflow, StreamUpdate, WisPaperClient};

#[tokio::main]
async fn main() -> Result<()> {
    tracing_subscriber::fmt()
        .with_env_filter(
            tracing_subscriber::EnvFilter::try_from_default_env()
                .unwrap_or_else(|_| "wispaper_worker=info".into()),
        )
        .init();
    let once = std::env::args().any(|argument| argument == "--once");
    let config = WorkerConfig::from_env()?;
    let freeppt = FreePptClient::new(
        config.freeppt_api_base_url.clone(),
        config.freeppt_agent_api_token.clone(),
        config.freeppt_agent_id.clone(),
        config.max_file_bytes,
    )?;
    let mut wispaper = WisPaperClient::new(&config)?;
    wispaper
        .authenticate()
        .await
        .context("authenticate worker with WisPaper")?;
    if std::env::args().any(|argument| argument == "--check-auth") {
        info!("WisPaper authentication check succeeded");
        return Ok(());
    }
    info!(agent_id = %config.freeppt_agent_id, "worker authenticated and ready");

    loop {
        match freeppt.claim().await {
            Ok(Some(claimed)) => {
                let job_id = claimed.job.id.clone();
                info!(job_id = %job_id, "claimed presentation job");
                if let Err(cause) = process_job(&config, &freeppt, &mut wispaper, &claimed).await {
                    error!(job_id = %job_id, error = %cause, "presentation job failed");
                    let message = public_error(&cause);
                    if let Err(report_error) = freeppt
                        .fail(&job_id, &claimed.claim_token, &message, true)
                        .await
                    {
                        error!(job_id = %job_id, error = %report_error, "could not report job failure");
                    }
                }
            }
            Ok(None) => {
                if once {
                    info!("no queued presentation jobs");
                    return Ok(());
                }
                sleep(config.queue_poll_interval).await;
            }
            Err(cause) => {
                warn!(error = %cause, "could not poll FreeAIPPT queue");
                if once {
                    return Err(cause);
                }
                sleep(config.queue_poll_interval).await;
            }
        }
        if once {
            return Ok(());
        }
    }
}

async fn process_job(
    config: &WorkerConfig,
    freeppt: &FreePptClient,
    wispaper: &mut WisPaperClient,
    claimed: &ClaimedJob,
) -> Result<()> {
    let (workflow_id, mut task_id) = if let Some(workflow_id) =
        claimed.job.upstream_workflow_id.as_deref()
    {
        if claimed.job.upstream_provider.as_deref() != Some("wispaper") {
            bail!("job has an unsupported upstream provider");
        }
        info!(job_id = %claimed.job.id, workflow_id, "resuming existing WisPaper workflow");
        (
            workflow_id.to_string(),
            claimed.job.upstream_task_id.clone(),
        )
    } else {
        let mut inputs = Vec::with_capacity(claimed.inputs.len() + 1);
        for input in &claimed.inputs {
            inputs.push(freeppt.download_input(input).await?);
        }
        if let Some(template_slug) = claimed.job.template_slug.as_deref() {
            inputs.push(download_template(config, template_slug).await?);
        }
        let mut attachments = Vec::with_capacity(inputs.len());
        for input in &inputs {
            attachments.push(wispaper.upload_attachment(input).await?);
        }
        let prompt = generation_prompt(claimed);
        let CreatedWorkflow {
            workflow_id,
            task_id,
            status,
        } = wispaper.create_workflow(&prompt, &attachments).await?;
        freeppt
            .register_upstream(
                &claimed.job.id,
                &claimed.claim_token,
                &workflow_id,
                &task_id,
            )
            .await?;
        freeppt
            .heartbeat(&claimed.job.id, &claimed.claim_token, Some(&status))
            .await?;
        info!(job_id = %claimed.job.id, workflow_id = %workflow_id, "created WisPaper workflow");
        (workflow_id, Some(task_id))
    };

    let (pptx_artifact, html_artifact) = wait_for_outputs(
        config,
        freeppt,
        wispaper,
        claimed,
        &workflow_id,
        &mut task_id,
    )
    .await?;

    let pptx = wispaper.download_artifact(&pptx_artifact).await?;
    let html = wispaper.download_artifact(&html_artifact).await?;
    freeppt
        .complete(&claimed.job.id, &claimed.claim_token, pptx, html)
        .await?;
    info!(job_id = %claimed.job.id, workflow_id = %workflow_id, "uploaded presentation outputs and completed job");
    Ok(())
}

async fn wait_for_outputs(
    config: &WorkerConfig,
    freeppt: &FreePptClient,
    wispaper: &mut WisPaperClient,
    claimed: &ClaimedJob,
    workflow_id: &str,
    task_id: &mut Option<String>,
) -> Result<(Artifact, Artifact)> {
    let started = Instant::now();
    let mut artifacts = Vec::new();
    let mut completed = false;
    loop {
        if started.elapsed() > config.max_job_duration {
            bail!("WisPaper workflow exceeded the configured time limit");
        }
        let workflow = wispaper.get_workflow(workflow_id).await?;
        if task_id.is_none() {
            *task_id = workflow.run_task.as_ref().map(|task| task.id.clone());
        }
        let status = workflow.status().to_ascii_lowercase();
        freeppt
            .heartbeat(&claimed.job.id, &claimed.claim_token, Some(&status))
            .await?;
        match status.as_str() {
            "completed" | "complete" | "done" | "success" | "succeeded" => {
                let outputs = workflow.output_artifacts()?;
                return Ok((outputs.pptx.clone(), outputs.html.clone()));
            }
            "failed" | "error" | "cancelled" | "canceled" | "paused" | "terminated" => {
                bail!(
                    "WisPaper workflow ended with status {status}: {}",
                    workflow
                        .failure_message()
                        .unwrap_or_else(|| "no diagnostic was returned".into())
                )
            }
            _ => {}
        }
        if let Some(task_id) = task_id.as_deref() {
            match wispaper.get_activity_snapshot(task_id).await {
                Ok(snapshot) if snapshot.failed => {
                    bail!("WisPaper activity stream reported a failed result")
                }
                Ok(snapshot) => {
                    completed |= snapshot.completed;
                    merge_artifacts(&mut artifacts, snapshot.artifacts);
                }
                Err(cause) => {
                    warn!(job_id = %claimed.job.id, error = %cause, "could not read WisPaper activity history");
                }
            }
        }
        if completed && let Some(outputs) = collected_outputs(&artifacts) {
            return Ok(outputs);
        }

        let mut stream = match wispaper.open_activity_stream(workflow_id).await {
            Ok(stream) => stream,
            Err(cause) => {
                warn!(job_id = %claimed.job.id, error = %cause, "could not open WisPaper SSE stream");
                sleep(config.wispaper_poll_interval).await;
                continue;
            }
        };
        info!(job_id = %claimed.job.id, workflow_id, "following WisPaper SSE activity stream");
        let mut heartbeat = interval(config.heartbeat_interval);
        heartbeat.set_missed_tick_behavior(MissedTickBehavior::Delay);
        heartbeat.tick().await;
        loop {
            tokio::select! {
                _ = heartbeat.tick() => {
                    if started.elapsed() > config.max_job_duration {
                        bail!("WisPaper workflow exceeded the configured time limit");
                    }
                    freeppt
                        .heartbeat(&claimed.job.id, &claimed.claim_token, Some("streaming"))
                        .await?;
                }
                update = stream.next_update() => {
                    match update {
                        Ok(Some(StreamUpdate::Artifact(artifact))) => {
                            merge_artifacts(&mut artifacts, vec![artifact]);
                            if completed && let Some(outputs) = collected_outputs(&artifacts) {
                                return Ok(outputs);
                            }
                        }
                        Ok(Some(StreamUpdate::Completed)) => {
                            completed = true;
                            if let Some(outputs) = collected_outputs(&artifacts) {
                                return Ok(outputs);
                            }
                        }
                        Ok(Some(StreamUpdate::Failed)) => {
                            bail!("WisPaper SSE activity stream reported a failed result")
                        }
                        Ok(Some(StreamUpdate::StreamEnded)) | Ok(None) => break,
                        Err(cause) => {
                            warn!(job_id = %claimed.job.id, error = %cause, "WisPaper SSE stream disconnected");
                            break;
                        }
                    }
                }
            }
        }
        sleep(config.wispaper_poll_interval).await;
    }
}

fn merge_artifacts(target: &mut Vec<Artifact>, incoming: Vec<Artifact>) {
    for artifact in incoming {
        let duplicate = target.iter().any(|existing| {
            (artifact.path.is_some() && artifact.path == existing.path)
                || (artifact.name.is_some() && artifact.name == existing.name)
        });
        if !duplicate {
            target.push(artifact);
        }
    }
}

fn collected_outputs(artifacts: &[Artifact]) -> Option<(Artifact, Artifact)> {
    let snapshot = ActivitySnapshot {
        completed: true,
        failed: false,
        artifacts: artifacts.to_vec(),
    };
    snapshot
        .output_artifacts()
        .ok()
        .map(|outputs| (outputs.pptx.clone(), outputs.html.clone()))
}

async fn download_template(config: &WorkerConfig, slug: &str) -> Result<InputFile> {
    if !slug.chars().all(|character| {
        character.is_ascii_lowercase() || character.is_ascii_digit() || character == '-'
    }) {
        bail!("template slug is invalid");
    }
    let name = format!("{slug}.pptx");
    let url = format!("{}/{}", config.freeppt_template_base_url, name);
    let response = reqwest::get(url)
        .await
        .context("download selected FreeAIPPT template")?;
    if !response.status().is_success() {
        bail!("selected FreeAIPPT template returned {}", response.status());
    }
    if response
        .content_length()
        .is_some_and(|size| size as usize > config.max_file_bytes)
    {
        bail!("selected FreeAIPPT template is too large");
    }
    let bytes = response.bytes().await?.to_vec();
    if bytes.is_empty() || bytes.len() > config.max_file_bytes || !bytes.starts_with(b"PK") {
        bail!("selected FreeAIPPT template is not a valid PPTX file");
    }
    Ok(InputFile {
        name,
        content_type: "application/vnd.openxmlformats-officedocument.presentationml.presentation"
            .into(),
        bytes,
    })
}

fn generation_prompt(claimed: &ClaimedJob) -> String {
    let pptx_name = format!("freeaippt-{}.pptx", claimed.job.id);
    let html_name = format!("freeaippt-{}.html", claimed.job.id);
    let template = claimed
        .job
        .template_slug
        .as_deref()
        .map(|slug| {
            format!(
                "Use the attached {slug}.pptx only as the selected editable visual starting point."
            )
        })
        .unwrap_or_else(|| "Create an original visual system suited to the request.".into());
    format!(
        "You are the dedicated FreeAIPPT presentation generation agent. Work autonomously and do not ask follow-up questions.\n\nUser request:\n{}\n\n{}\nTreat every other attachment as source material supplied by the user. Do not invent factual claims; label sample figures as illustrative placeholders.\n\nCreate exactly two final downloadable artifacts:\n1. {pptx_name} — an editable 16:9 PowerPoint presentation with 8–12 concise slides, native editable text and shapes, system fonts, coherent hierarchy, and no broken or clipped content.\n2. {html_name} — a self-contained HTML presentation containing the same slides, embedded CSS, keyboard navigation, responsive 16:9 rendering, and no external assets.\n\nValidate that both files open successfully. The final response must expose both artifacts as downloadable files and must not substitute PDF, Markdown, or a textual outline.",
        claimed.job.prompt, template
    )
}

fn public_error(error: &anyhow::Error) -> String {
    let message = format!("{error:#}");
    message
        .replace(['\r', '\n'], " ")
        .chars()
        .take(1000)
        .collect()
}

#[cfg(test)]
mod tests {
    use super::*;
    use freeppt::{Job, JobInput};

    #[test]
    fn prompt_requires_both_named_outputs() {
        let claimed = ClaimedJob {
            job: Job {
                id: "job-1".into(),
                prompt: "Create a launch presentation".into(),
                template_slug: Some("startup-pitch-deck".into()),
                upstream_provider: None,
                upstream_workflow_id: None,
                upstream_task_id: None,
            },
            claim_token: "claim".into(),
            inputs: Vec::<JobInput>::new(),
        };
        let prompt = generation_prompt(&claimed);
        assert!(prompt.contains("freeaippt-job-1.pptx"));
        assert!(prompt.contains("freeaippt-job-1.html"));
        assert!(prompt.contains("startup-pitch-deck.pptx"));
    }
}
