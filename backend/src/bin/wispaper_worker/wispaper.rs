use crate::config::WorkerConfig;
use crate::freeppt::InputFile;
use anyhow::{Context, Result, bail};
use reqwest::{Client, Method, StatusCode, Url};
use serde::{Deserialize, Serialize, de::DeserializeOwned};
use serde_json::{Value, json};
use std::time::Instant;

const PROVIDER: &str = "WisPaper";

pub struct WisPaperClient {
    http: Client,
    gateway_url: String,
    auth_url: String,
    client_id: String,
    redirect_uri: String,
    email: Option<String>,
    password: Option<String>,
    token: Option<String>,
    authenticated_at: Option<Instant>,
    reauth_interval: std::time::Duration,
    language: String,
    tier: String,
    max_file_bytes: usize,
}

#[derive(Debug, Clone, Serialize)]
pub struct Attachment {
    path: String,
    format: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    bucket: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    source_id: Option<String>,
}

#[derive(Debug, Clone, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CreatedWorkflow {
    pub workflow_id: String,
    pub task_id: String,
    pub status: String,
}

#[derive(Debug, Clone, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Workflow {
    pub run_task: Option<RunTask>,
}

#[derive(Debug, Clone, Deserialize)]
pub struct RunTask {
    pub id: String,
    pub status: String,
    #[serde(default)]
    pub context: Option<ArtifactPhase>,
    #[serde(default)]
    pub output: Option<ArtifactPhase>,
    pub error: Option<Value>,
}

#[derive(Debug, Clone, Default, Deserialize)]
pub struct ArtifactPhase {
    #[serde(default)]
    pub artifacts: Vec<Artifact>,
}

#[derive(Debug, Clone, Deserialize)]
pub struct Artifact {
    pub path: Option<String>,
    pub url: Option<String>,
    #[serde(alias = "fileType", alias = "format")]
    pub file_type: Option<String>,
    #[serde(alias = "sourceId")]
    pub source_id: Option<String>,
    #[serde(alias = "bucket", alias = "bucketName")]
    pub bucket_name: Option<String>,
    pub name: Option<String>,
    pub label: Option<String>,
}

pub struct OutputArtifacts<'a> {
    pub pptx: &'a Artifact,
    pub html: &'a Artifact,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct ActivityHistory {
    #[serde(default)]
    events: Vec<ActivityEvent>,
}

#[derive(Debug, Deserialize)]
struct ActivityEvent {
    #[serde(default)]
    data: ActivityData,
}

#[derive(Debug, Default, Deserialize)]
struct ActivityData {
    #[serde(rename = "type")]
    kind: Option<String>,
    status: Option<String>,
    #[serde(default, alias = "isError")]
    is_error: bool,
    path: Option<String>,
    name: Option<String>,
    #[serde(alias = "sourceId")]
    source_id: Option<String>,
    #[serde(alias = "bucket", alias = "bucketName")]
    bucket_name: Option<String>,
}

#[derive(Debug, Default)]
pub struct ActivitySnapshot {
    pub completed: bool,
    pub failed: bool,
    pub artifacts: Vec<Artifact>,
}

pub struct WisPaperEventStream {
    response: reqwest::Response,
    buffer: Vec<u8>,
}

#[derive(Debug)]
pub enum StreamUpdate {
    Artifact(Artifact),
    Completed,
    Failed,
    StreamEnded,
}

#[derive(Debug, Deserialize)]
struct CommonUpload {
    upload_url: String,
    #[serde(default = "put_method")]
    method: String,
    #[serde(default)]
    headers: std::collections::BTreeMap<String, String>,
    path: String,
    format: String,
    bucket: Option<String>,
    source_id: Option<String>,
}

#[derive(Debug, Deserialize)]
struct ArtifactDownload {
    download_url: String,
}

impl WisPaperClient {
    pub fn new(config: &WorkerConfig) -> Result<Self> {
        Ok(Self {
            http: Client::builder()
                .cookie_store(true)
                .user_agent("FreeAIPPT-WisPaper-Worker/0.1")
                .build()?,
            gateway_url: config.wispaper_gateway_url.clone(),
            auth_url: config.wispaper_auth_url.clone(),
            client_id: config.wispaper_client_id.clone(),
            redirect_uri: config.wispaper_redirect_uri.clone(),
            email: config.wispaper_email.clone(),
            password: config.wispaper_password.clone(),
            token: config.wispaper_access_token.clone(),
            authenticated_at: config
                .wispaper_access_token
                .as_ref()
                .map(|_| Instant::now()),
            reauth_interval: config.wispaper_reauth_interval,
            language: config.wispaper_language.clone(),
            tier: config.wispaper_tier.clone(),
            max_file_bytes: config.max_file_bytes,
        })
    }

    pub async fn authenticate(&mut self) -> Result<()> {
        self.ensure_authenticated(true).await
    }

    pub async fn upload_attachment(&mut self, file: &InputFile) -> Result<Attachment> {
        if file.bytes.is_empty() || file.bytes.len() > self.max_file_bytes {
            bail!("attachment {} has an invalid size", file.name);
        }
        let grant: CommonUpload = self
            .gateway_json(
                Method::POST,
                "/kb/common-uploads/upload-url",
                Some(json!({
                    "file_name": file.name,
                    "content_type": file.content_type,
                    "expire_secs": 900
                })),
            )
            .await
            .with_context(|| format!("authorize {PROVIDER} attachment {}", file.name))?;
        if !grant.method.eq_ignore_ascii_case("PUT") {
            bail!("unsupported {PROVIDER} upload method {}", grant.method);
        }
        let mut request = self.http.put(&grant.upload_url);
        for (name, value) in &grant.headers {
            request = request.header(name, value);
        }
        let response = request
            .body(file.bytes.clone())
            .send()
            .await
            .with_context(|| format!("upload {PROVIDER} attachment {}", file.name))?;
        ensure_success(response, "upload WisPaper attachment").await?;
        Ok(Attachment {
            path: grant.path,
            format: grant.format,
            bucket: grant.bucket,
            source_id: grant.source_id,
        })
    }

    pub async fn create_workflow(
        &mut self,
        prompt: &str,
        attachments: &[Attachment],
    ) -> Result<CreatedWorkflow> {
        let mut body = json!({
            "type": "universal_agent",
            "language": self.language,
            "documentUrls": [],
            "tier": self.tier,
            "userPrompt": prompt
        });
        if !attachments.is_empty() {
            body["attachments"] = serde_json::to_value(attachments)?;
        }
        self.gateway_json(Method::POST, "/paperbypass/workflows", Some(body))
            .await
            .context("create WisPaper workflow")
    }

    pub async fn get_workflow(&mut self, workflow_id: &str) -> Result<Workflow> {
        self.gateway_json(
            Method::GET,
            &format!("/paperbypass/workflows/{workflow_id}"),
            None,
        )
        .await
        .context("get WisPaper workflow")
    }

    pub async fn get_activity_snapshot(&mut self, task_id: &str) -> Result<ActivitySnapshot> {
        let history: ActivityHistory = self
            .gateway_json(
                Method::GET,
                &format!("/paperbypass/tasks/{task_id}/activities/history?limit=20"),
                None,
            )
            .await
            .context("get WisPaper activity history")?;
        let mut snapshot = ActivitySnapshot::default();
        for event in history.events {
            let kind = event.data.kind.as_deref().unwrap_or_default();
            let status = event.data.status.as_deref().unwrap_or_default();
            if kind == "result" && status.eq_ignore_ascii_case("completed") {
                snapshot.completed = !event.data.is_error;
                snapshot.failed = event.data.is_error;
            }
            if kind == "result" && matches!(status, "failed" | "error") {
                snapshot.failed = true;
            }
            if kind == "file_card" && event.data.path.is_some() {
                snapshot.artifacts.push(Artifact {
                    path: event.data.path,
                    url: None,
                    file_type: None,
                    source_id: event.data.source_id,
                    bucket_name: event.data.bucket_name,
                    name: event.data.name,
                    label: None,
                });
            }
        }
        Ok(snapshot)
    }

    pub async fn open_activity_stream(&mut self, workflow_id: &str) -> Result<WisPaperEventStream> {
        for attempt in 0..2 {
            self.ensure_authenticated(false).await?;
            let token = self.token.as_deref().context("WisPaper token is missing")?;
            let response = self
                .http
                .get(format!(
                    "{}/paperbypass/workflows/{workflow_id}/universal-agent/activities/stream?historyLimit=20",
                    self.gateway_url
                ))
                .bearer_auth(token)
                .header(reqwest::header::ACCEPT, "text/event-stream")
                .send()
                .await
                .context("open WisPaper activity stream")?;
            if response.status() == StatusCode::UNAUTHORIZED && attempt == 0 {
                self.ensure_authenticated(true).await?;
                continue;
            }
            return Ok(WisPaperEventStream {
                response: ensure_success(response, "open WisPaper activity stream").await?,
                buffer: Vec::new(),
            });
        }
        bail!("WisPaper activity stream authentication retry failed")
    }

    pub async fn download_artifact(&mut self, artifact: &Artifact) -> Result<Vec<u8>> {
        let url = if let Some(url) = artifact.url.as_deref().filter(|url| !url.is_empty()) {
            url.to_string()
        } else {
            let path = artifact
                .path
                .as_deref()
                .filter(|path| !path.is_empty())
                .context("WisPaper artifact path is missing")?;
            let mut body = json!({
                "path": path,
                "expire_secs": 900,
                "disposition": "attachment"
            });
            if let Some(source_id) = artifact.source_id.as_deref() {
                body["agent_id"] = Value::String(source_id.to_string());
            }
            if let Some(bucket_name) = artifact.bucket_name.as_deref() {
                body["bucket_name"] = Value::String(bucket_name.to_string());
            }
            let signed: ArtifactDownload = self
                .gateway_json(Method::POST, "/kb/library/storage/download-url", Some(body))
                .await
                .context("authorize WisPaper artifact download")?;
            signed.download_url
        };
        let response = self
            .http
            .get(url)
            .send()
            .await
            .context("download WisPaper artifact")?;
        let response = ensure_success(response, "download WisPaper artifact").await?;
        if response
            .content_length()
            .is_some_and(|size| size as usize > self.max_file_bytes)
        {
            bail!("WisPaper artifact is larger than the configured limit");
        }
        let bytes = response.bytes().await?.to_vec();
        if bytes.is_empty() || bytes.len() > self.max_file_bytes {
            bail!("WisPaper artifact has an invalid size");
        }
        Ok(bytes)
    }

    async fn gateway_json<T: DeserializeOwned>(
        &mut self,
        method: Method,
        path: &str,
        body: Option<Value>,
    ) -> Result<T> {
        for attempt in 0..2 {
            self.ensure_authenticated(false).await?;
            let token = self.token.as_deref().context("WisPaper token is missing")?;
            let mut request = self
                .http
                .request(method.clone(), format!("{}{}", self.gateway_url, path))
                .bearer_auth(token);
            if let Some(body) = &body {
                request = request.json(body);
            }
            let response = request.send().await.context("call WisPaper API")?;
            if response.status() == StatusCode::UNAUTHORIZED && attempt == 0 {
                self.ensure_authenticated(true).await?;
                continue;
            }
            let response = ensure_success(response, "call WisPaper API").await?;
            let value: Value = response
                .json()
                .await
                .context("parse WisPaper API response")?;
            return decode_data(value);
        }
        bail!("WisPaper authentication retry failed")
    }

    async fn ensure_authenticated(&mut self, force: bool) -> Result<()> {
        let fresh = self.token.is_some()
            && self
                .authenticated_at
                .is_some_and(|time| time.elapsed() < self.reauth_interval);
        if !force && fresh {
            return Ok(());
        }
        let (email, password) = match (&self.email, &self.password) {
            (Some(email), Some(password)) => (email.clone(), password.clone()),
            _ if self.token.is_some() && !force => return Ok(()),
            _ if self.token.is_some() => {
                self.authenticated_at = Some(Instant::now());
                return Ok(());
            }
            _ => bail!("WisPaper credentials are unavailable"),
        };

        let response = self
            .http
            .get(format!("{}/oidc/auth", self.auth_url))
            .query(&[
                ("response_type", "code"),
                ("client_id", self.client_id.as_str()),
                ("redirect_uri", self.redirect_uri.as_str()),
                ("scope", "openid email profile"),
            ])
            .send()
            .await
            .context("initialize WisPaper sign-in")?;
        ensure_success(response, "initialize WisPaper sign-in").await?;

        let response = self
            .http
            .put(format!("{}/api/experience", self.auth_url))
            .json(&json!({"interactionEvent": "SignIn"}))
            .send()
            .await
            .context("start WisPaper sign-in")?;
        ensure_success(response, "start WisPaper sign-in").await?;

        let response = self
            .http
            .post(format!(
                "{}/api/experience/verification/password",
                self.auth_url
            ))
            .json(&json!({
                "identifier": {"type": "email", "value": email},
                "password": password
            }))
            .send()
            .await
            .context("verify WisPaper credentials")?;
        let value: Value = ensure_success(response, "verify WisPaper credentials")
            .await?
            .json()
            .await
            .context("parse WisPaper credential verification")?;
        let verification_id = find_string(&value, &["verificationId", "verification_id"])
            .context("WisPaper verification ID is missing")?;

        let response = self
            .http
            .post(format!("{}/api/experience/identification", self.auth_url))
            .json(&json!({"verificationId": verification_id}))
            .send()
            .await
            .context("identify WisPaper account")?;
        ensure_success(response, "identify WisPaper account").await?;

        let response = self
            .http
            .post(format!("{}/api/experience/submit", self.auth_url))
            .json(&json!({}))
            .send()
            .await
            .context("submit WisPaper sign-in")?;
        let value: Value = ensure_success(response, "submit WisPaper sign-in")
            .await?
            .json()
            .await
            .context("parse WisPaper sign-in submission")?;
        let redirect_to = find_string(&value, &["redirectTo", "redirect_to"])
            .context("WisPaper sign-in redirect is missing")?;

        let response = self
            .http
            .get(&redirect_to)
            .send()
            .await
            .context("follow WisPaper sign-in redirect")?;
        let callback_url = response.url().clone();
        ensure_success(response, "follow WisPaper sign-in redirect").await?;
        let code =
            query_value(&callback_url, "code").context("WisPaper authorization code is missing")?;

        let response = self
            .http
            .get(format!("{}/auth/user/callback", self.gateway_url))
            .query(&[
                ("code", code.as_str()),
                ("redirect_uri", self.redirect_uri.as_str()),
            ])
            .send()
            .await
            .context("exchange WisPaper authorization code")?;
        let value: Value = ensure_success(response, "exchange WisPaper authorization code")
            .await?
            .json()
            .await
            .context("parse WisPaper sign-in result")?;
        let token = find_string(&value, &["token", "accessToken", "access_token"])
            .filter(|token| token.len() >= 20)
            .context("WisPaper access token is missing")?;
        self.token = Some(token);
        self.authenticated_at = Some(Instant::now());
        Ok(())
    }
}

impl WisPaperEventStream {
    pub async fn next_update(&mut self) -> Result<Option<StreamUpdate>> {
        loop {
            if let Some(block) = take_sse_block(&mut self.buffer) {
                if let Some(update) = parse_sse_block(&block)? {
                    return Ok(Some(update));
                }
                continue;
            }
            match self
                .response
                .chunk()
                .await
                .context("read WisPaper activity stream")?
            {
                Some(chunk) => self.buffer.extend_from_slice(&chunk),
                None => return Ok(None),
            }
        }
    }
}

impl Workflow {
    pub fn status(&self) -> &str {
        self.run_task
            .as_ref()
            .map(|task| task.status.as_str())
            .unwrap_or("pending")
    }

    pub fn failure_message(&self) -> Option<String> {
        self.run_task.as_ref().and_then(|task| {
            task.error.as_ref().map(|error| {
                error
                    .as_str()
                    .map(ToOwned::to_owned)
                    .unwrap_or_else(|| error.to_string())
                    .chars()
                    .take(500)
                    .collect()
            })
        })
    }

    pub fn output_artifacts(&self) -> Result<OutputArtifacts<'_>> {
        let task = self
            .run_task
            .as_ref()
            .context("WisPaper run task is missing")?;
        select_output_artifacts(
            task.output
                .iter()
                .flat_map(|phase| phase.artifacts.iter())
                .chain(task.context.iter().flat_map(|phase| phase.artifacts.iter())),
        )
    }
}

impl ActivitySnapshot {
    pub fn output_artifacts(&self) -> Result<OutputArtifacts<'_>> {
        select_output_artifacts(self.artifacts.iter())
    }
}

fn select_output_artifacts<'a>(
    artifacts: impl Iterator<Item = &'a Artifact>,
) -> Result<OutputArtifacts<'a>> {
    let mut pptx = None;
    let mut html = None;
    for artifact in artifacts {
        match artifact_kind(artifact) {
            Some("pptx") if pptx.is_none() => pptx = Some(artifact),
            Some("html") if html.is_none() => html = Some(artifact),
            _ => {}
        }
    }
    Ok(OutputArtifacts {
        pptx: pptx.context("WisPaper workflow did not produce a PPTX artifact")?,
        html: html.context("WisPaper workflow did not produce an HTML artifact")?,
    })
}

fn artifact_kind(artifact: &Artifact) -> Option<&'static str> {
    let candidates = [
        artifact.path.as_deref(),
        artifact.name.as_deref(),
        artifact.label.as_deref(),
        artifact.file_type.as_deref(),
    ];
    for value in candidates.into_iter().flatten() {
        let value = value.to_ascii_lowercase();
        if value.ends_with(".pptx") || value == "pptx" || value.contains("powerpoint") {
            return Some("pptx");
        }
        if value.ends_with(".html") || value.ends_with(".htm") || value == "html" {
            return Some("html");
        }
    }
    None
}

fn take_sse_block(buffer: &mut Vec<u8>) -> Option<Vec<u8>> {
    let lf = buffer.windows(2).position(|window| window == b"\n\n");
    let crlf = buffer.windows(4).position(|window| window == b"\r\n\r\n");
    let (position, separator_length) = match (lf, crlf) {
        (Some(left), Some(right)) if left <= right => (left, 2),
        (Some(_), Some(right)) => (right, 4),
        (Some(position), None) => (position, 2),
        (None, Some(position)) => (position, 4),
        (None, None) => return None,
    };
    let block = buffer[..position].to_vec();
    buffer.drain(..position + separator_length);
    Some(block)
}

fn parse_sse_block(block: &[u8]) -> Result<Option<StreamUpdate>> {
    let text = String::from_utf8_lossy(block);
    let mut event = None;
    let mut data = Vec::new();
    for line in text.lines() {
        if let Some(value) = line.strip_prefix("event:") {
            event = Some(value.trim());
        } else if let Some(value) = line.strip_prefix("data:") {
            data.push(value.trim());
        }
    }
    if event == Some("done") || data.iter().any(|value| value.starts_with("[DONE]")) {
        return Ok(Some(StreamUpdate::StreamEnded));
    }
    if !matches!(event, Some("message") | Some("task") | None) || data.is_empty() {
        return Ok(None);
    }
    let Ok(value) = serde_json::from_str::<Value>(&data.join("\n")) else {
        return Ok(None);
    };
    let activity_value = value.get("task").cloned().unwrap_or(value);
    let activity: ActivityData =
        serde_json::from_value(activity_value).context("decode WisPaper SSE activity")?;
    let kind = activity.kind.as_deref().unwrap_or_default();
    let status = activity.status.as_deref().unwrap_or_default();
    if kind == "result" && status.eq_ignore_ascii_case("completed") {
        return Ok(Some(if activity.is_error {
            StreamUpdate::Failed
        } else {
            StreamUpdate::Completed
        }));
    }
    if kind == "result" && matches!(status, "failed" | "error") {
        return Ok(Some(StreamUpdate::Failed));
    }
    if kind == "file_card" && activity.path.is_some() {
        return Ok(Some(StreamUpdate::Artifact(Artifact {
            path: activity.path,
            url: None,
            file_type: None,
            source_id: activity.source_id,
            bucket_name: activity.bucket_name,
            name: activity.name,
            label: None,
        })));
    }
    Ok(None)
}

fn decode_data<T: DeserializeOwned>(value: Value) -> Result<T> {
    if value.get("success") == Some(&Value::Bool(false)) {
        let message = find_string(&value, &["message", "error", "detail"])
            .unwrap_or_else(|| "WisPaper API reported failure".into());
        bail!("{message}");
    }
    let data = value.get("data").cloned().unwrap_or(value);
    serde_json::from_value(data).context("decode WisPaper API response")
}

fn find_string(value: &Value, keys: &[&str]) -> Option<String> {
    match value {
        Value::Object(object) => {
            for key in keys {
                if let Some(value) = object.get(*key).and_then(Value::as_str) {
                    return Some(value.to_string());
                }
            }
            object.values().find_map(|value| find_string(value, keys))
        }
        Value::Array(array) => array.iter().find_map(|value| find_string(value, keys)),
        _ => None,
    }
}

fn query_value(url: &Url, name: &str) -> Option<String> {
    url.query_pairs()
        .find_map(|(key, value)| (key == name).then(|| value.into_owned()))
}

fn put_method() -> String {
    "PUT".into()
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
    fn selects_pptx_and_html_outputs() {
        let workflow: Workflow = serde_json::from_value(json!({
            "workflowId": "workflow-1",
            "runTask": {
                "id": "task-1",
                "status": "completed",
                "context": {"artifacts": [{"path": "draft.txt"}]},
                "output": {"artifacts": [
                    {"path": "results/deck.pptx", "file_type": "pptx"},
                    {"path": "results/deck.html", "file_type": "html"}
                ]},
                "error": null
            }
        }))
        .unwrap();
        let outputs = workflow.output_artifacts().unwrap();
        assert_eq!(artifact_kind(outputs.pptx), Some("pptx"));
        assert_eq!(artifact_kind(outputs.html), Some("html"));
    }

    #[test]
    fn accepts_null_artifact_phases_while_workflow_is_running() {
        let workflow: Workflow = serde_json::from_value(json!({
            "runTask": {
                "id": "task-1",
                "status": "running",
                "context": null,
                "output": null,
                "error": null
            }
        }))
        .unwrap();
        assert_eq!(workflow.status(), "running");
    }

    #[test]
    fn unwraps_gateway_data() {
        let workflow: CreatedWorkflow = decode_data(json!({
            "success": true,
            "data": {"workflowId": "w-1", "taskId": "t-1", "status": "pending"}
        }))
        .unwrap();
        assert_eq!(workflow.workflow_id, "w-1");
    }

    #[test]
    fn activity_history_recovers_file_card_outputs() {
        let history: ActivityHistory = decode_data(json!({
            "success": true,
            "data": {
                "events": [
                    {"event": "message", "data": {"type": "file_card", "name": "deck.pptx", "path": "run/artifacts/deck.pptx", "source_id": "task-1"}},
                    {"event": "message", "data": {"type": "file_card", "name": "deck.html", "path": "run/artifacts/deck.html", "source_id": "task-1"}},
                    {"event": "message", "data": {"type": "result", "status": "completed", "isError": false}}
                ]
            }
        }))
        .unwrap();
        let mut snapshot = ActivitySnapshot::default();
        for event in history.events {
            if event.data.kind.as_deref() == Some("result") {
                snapshot.completed = event.data.status.as_deref() == Some("completed");
            }
            if event.data.kind.as_deref() == Some("file_card") {
                snapshot.artifacts.push(Artifact {
                    path: event.data.path,
                    url: None,
                    file_type: None,
                    source_id: event.data.source_id,
                    bucket_name: None,
                    name: event.data.name,
                    label: None,
                });
            }
        }
        assert!(snapshot.completed);
        assert!(snapshot.output_artifacts().is_ok());
    }

    #[test]
    fn parses_sse_file_and_completion_events() {
        let file = parse_sse_block(
            b"event: message\ndata: {\"type\":\"file_card\",\"name\":\"deck.pptx\",\"path\":\"artifacts/deck.pptx\",\"source_id\":\"task-1\"}\n",
        )
        .unwrap();
        assert!(matches!(file, Some(StreamUpdate::Artifact(_))));
        let completed = parse_sse_block(
            b"event: message\ndata: {\"type\":\"result\",\"status\":\"completed\",\"isError\":false}\n",
        )
        .unwrap();
        assert!(matches!(completed, Some(StreamUpdate::Completed)));

        let mut buffer = b"event: message\r\ndata: {}\r\n\r\nremaining".to_vec();
        assert!(take_sse_block(&mut buffer).is_some());
        assert_eq!(buffer, b"remaining");
    }
}
