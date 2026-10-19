use anyhow::{Context, Result, bail};
use reqwest::{Client, StatusCode};
use serde::{Deserialize, Serialize};
use std::collections::BTreeMap;

#[derive(Clone)]
pub struct FreePptClient {
    http: Client,
    base_url: String,
    agent_token: String,
    agent_id: String,
    max_file_bytes: usize,
}

#[derive(Debug, Deserialize)]
pub struct ClaimedJob {
    pub job: Job,
    pub claim_token: String,
    pub inputs: Vec<JobInput>,
}

#[derive(Debug, Deserialize)]
pub struct Job {
    pub id: String,
    pub prompt: String,
    pub template_slug: Option<String>,
    pub upstream_provider: Option<String>,
    pub upstream_workflow_id: Option<String>,
    pub upstream_task_id: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct JobInput {
    pub name: String,
    pub content_type: String,
    pub size_bytes: i64,
    pub download_url: String,
}

#[derive(Debug)]
pub struct InputFile {
    pub name: String,
    pub content_type: String,
    pub bytes: Vec<u8>,
}

#[derive(Debug, Serialize)]
struct ClaimRequest<'a> {
    agent_id: &'a str,
}

#[derive(Debug, Serialize)]
struct RegisterUpstream<'a> {
    provider: &'a str,
    workflow_id: &'a str,
    task_id: &'a str,
}

#[derive(Debug, Serialize)]
struct Heartbeat<'a> {
    upstream_status: Option<&'a str>,
}

#[derive(Debug, Serialize)]
struct AuthorizeOutput {
    size_bytes: usize,
}

#[derive(Debug, Deserialize)]
struct UploadAuthorization {
    reservation_id: String,
    upload_url: String,
    method: String,
    headers: BTreeMap<String, String>,
}

#[derive(Debug, Deserialize)]
struct BlobUploadResult {
    url: String,
}

#[derive(Debug, Serialize)]
struct CompleteJob<'a> {
    outputs: Vec<CompletedOutput<'a>>,
}

#[derive(Debug, Serialize)]
struct CompletedOutput<'a> {
    kind: &'a str,
    reservation_id: &'a str,
    blob_url: &'a str,
}

#[derive(Debug, Serialize)]
struct FailJob<'a> {
    claim_token: &'a str,
    error: &'a str,
    retryable: bool,
}

struct UploadedOutput {
    kind: &'static str,
    reservation_id: String,
    blob_url: String,
}

impl FreePptClient {
    pub fn new(
        base_url: String,
        agent_token: String,
        agent_id: String,
        max_file_bytes: usize,
    ) -> Result<Self> {
        Ok(Self {
            http: Client::builder()
                .user_agent("FreeAIPPT-WisPaper-Worker/0.1")
                .build()?,
            base_url,
            agent_token,
            agent_id,
            max_file_bytes,
        })
    }

    pub async fn claim(&self) -> Result<Option<ClaimedJob>> {
        let response = self
            .http
            .post(self.url("/api/v1/agent/jobs/claim"))
            .bearer_auth(&self.agent_token)
            .json(&ClaimRequest {
                agent_id: &self.agent_id,
            })
            .send()
            .await
            .context("claim FreeAIPPT job")?;
        if response.status() == StatusCode::NO_CONTENT {
            return Ok(None);
        }
        parse_json(response, "claim FreeAIPPT job").await.map(Some)
    }

    pub async fn download_input(&self, input: &JobInput) -> Result<InputFile> {
        if input.size_bytes <= 0 || input.size_bytes as usize > self.max_file_bytes {
            bail!("input {} has an invalid size", input.name);
        }
        let response = self
            .http
            .get(&input.download_url)
            .send()
            .await
            .with_context(|| format!("download input {}", input.name))?;
        let response = ensure_success(response, "download FreeAIPPT input").await?;
        let bytes = response.bytes().await?.to_vec();
        if bytes.is_empty() || bytes.len() > self.max_file_bytes {
            bail!("downloaded input {} has an invalid size", input.name);
        }
        Ok(InputFile {
            name: input.name.clone(),
            content_type: input.content_type.clone(),
            bytes,
        })
    }

    pub async fn register_upstream(
        &self,
        job_id: &str,
        claim_token: &str,
        workflow_id: &str,
        task_id: &str,
    ) -> Result<()> {
        let response = self
            .claimed_post(job_id, claim_token, "upstream")
            .json(&RegisterUpstream {
                provider: "wispaper",
                workflow_id,
                task_id,
            })
            .send()
            .await?;
        ensure_success(response, "register WisPaper workflow").await?;
        Ok(())
    }

    pub async fn heartbeat(
        &self,
        job_id: &str,
        claim_token: &str,
        upstream_status: Option<&str>,
    ) -> Result<()> {
        let response = self
            .claimed_post(job_id, claim_token, "heartbeat")
            .json(&Heartbeat { upstream_status })
            .send()
            .await?;
        ensure_success(response, "renew FreeAIPPT job lease").await?;
        Ok(())
    }

    pub async fn complete(
        &self,
        job_id: &str,
        claim_token: &str,
        pptx: Vec<u8>,
        html: Vec<u8>,
    ) -> Result<()> {
        validate_output("pptx", &pptx, self.max_file_bytes)?;
        validate_output("html", &html, self.max_file_bytes)?;
        let pptx = self
            .upload_output(job_id, claim_token, "pptx", pptx)
            .await?;
        let html = self
            .upload_output(job_id, claim_token, "html", html)
            .await?;
        let body = CompleteJob {
            outputs: vec![
                CompletedOutput {
                    kind: pptx.kind,
                    reservation_id: &pptx.reservation_id,
                    blob_url: &pptx.blob_url,
                },
                CompletedOutput {
                    kind: html.kind,
                    reservation_id: &html.reservation_id,
                    blob_url: &html.blob_url,
                },
            ],
        };
        let response = self
            .claimed_post(job_id, claim_token, "complete")
            .json(&body)
            .send()
            .await?;
        ensure_success(response, "complete FreeAIPPT job").await?;
        Ok(())
    }

    pub async fn fail(
        &self,
        job_id: &str,
        claim_token: &str,
        error: &str,
        retryable: bool,
    ) -> Result<()> {
        let error: String = error.chars().take(1000).collect();
        let response = self
            .http
            .post(self.url(&format!("/api/v1/agent/jobs/{job_id}/fail")))
            .bearer_auth(&self.agent_token)
            .json(&FailJob {
                claim_token,
                error: &error,
                retryable,
            })
            .send()
            .await?;
        ensure_success(response, "report FreeAIPPT job failure").await?;
        Ok(())
    }

    async fn upload_output(
        &self,
        job_id: &str,
        claim_token: &str,
        kind: &'static str,
        bytes: Vec<u8>,
    ) -> Result<UploadedOutput> {
        let response = self
            .claimed_post(job_id, claim_token, &format!("outputs/{kind}/authorize"))
            .json(&AuthorizeOutput {
                size_bytes: bytes.len(),
            })
            .send()
            .await?;
        let authorization: UploadAuthorization =
            parse_json(response, "authorize FreeAIPPT output upload").await?;
        if !authorization.method.eq_ignore_ascii_case("PUT") {
            bail!("unsupported output upload method {}", authorization.method);
        }
        let mut request = self.http.put(&authorization.upload_url);
        for (name, value) in &authorization.headers {
            request = request.header(name, value);
        }
        let upload = request.body(bytes).send().await?;
        let uploaded: BlobUploadResult = parse_json(upload, "upload FreeAIPPT output").await?;
        Ok(UploadedOutput {
            kind,
            reservation_id: authorization.reservation_id,
            blob_url: uploaded.url,
        })
    }

    fn claimed_post(
        &self,
        job_id: &str,
        claim_token: &str,
        suffix: &str,
    ) -> reqwest::RequestBuilder {
        self.http
            .post(self.url(&format!("/api/v1/agent/jobs/{job_id}/{suffix}")))
            .bearer_auth(&self.agent_token)
            .header("x-claim-token", claim_token)
    }

    fn url(&self, path: &str) -> String {
        format!("{}{}", self.base_url, path)
    }
}

fn validate_output(kind: &str, bytes: &[u8], maximum: usize) -> Result<()> {
    if bytes.is_empty() || bytes.len() > maximum {
        bail!("{kind} output has an invalid size");
    }
    if kind == "pptx" && !bytes.starts_with(b"PK") {
        bail!("pptx output is not a ZIP-based PowerPoint file");
    }
    if kind == "html" {
        let prefix = String::from_utf8_lossy(&bytes[..bytes.len().min(2048)]).to_lowercase();
        if !prefix.contains("<html") && !prefix.contains("<!doctype html") {
            bail!("html output does not contain an HTML document");
        }
    }
    Ok(())
}

async fn parse_json<T: for<'de> Deserialize<'de>>(
    response: reqwest::Response,
    action: &str,
) -> Result<T> {
    let response = ensure_success(response, action).await?;
    response
        .json()
        .await
        .with_context(|| format!("parse response for {action}"))
}

async fn ensure_success(response: reqwest::Response, action: &str) -> Result<reqwest::Response> {
    if response.status().is_success() {
        return Ok(response);
    }
    let status = response.status();
    let excerpt: String = response
        .text()
        .await
        .unwrap_or_default()
        .chars()
        .take(500)
        .collect();
    bail!("{action} returned {status}: {excerpt}")
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn generated_files_are_validated_before_upload() {
        assert!(validate_output("pptx", b"PK\x03\x04pptx", 100).is_ok());
        assert!(validate_output("pptx", b"not-pptx", 100).is_err());
        assert!(validate_output("html", b"<!doctype html><html></html>", 100).is_ok());
        assert!(validate_output("html", b"plain text", 100).is_err());
    }
}
