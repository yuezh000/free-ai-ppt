use serde::{Deserialize, Serialize};
use sqlx::FromRow;

#[derive(Debug, Clone, FromRow, Serialize)]
pub struct Job {
    pub id: String,
    #[serde(skip_serializing)]
    pub public_token_hash: String,
    pub prompt: String,
    pub status: String,
    pub ready_at: Option<String>,
    pub agent_id: Option<String>,
    #[serde(skip_serializing)]
    pub claim_token_hash: Option<String>,
    pub lease_until: Option<String>,
    pub attempts: i64,
    pub max_attempts: i64,
    pub error_message: Option<String>,
    pub created_at: String,
    pub updated_at: String,
    pub completed_at: Option<String>,
    pub user_id: Option<String>,
    pub template_slug: Option<String>,
}

#[derive(Debug, Clone, FromRow, Serialize)]
pub struct StoredFile {
    pub id: String,
    pub job_id: String,
    pub original_name: String,
    pub content_type: String,
    pub size_bytes: i64,
    pub sha256: String,
    pub etag: Option<String>,
    #[serde(skip_serializing)]
    pub storage_path: String,
    pub created_at: String,
}

#[derive(Deserialize)]
pub struct CreateJob {
    pub prompt: String,
    #[serde(default)]
    pub template_slug: Option<String>,
}

#[derive(Serialize)]
pub struct CreatedJob {
    pub id: String,
    pub status: String,
    pub job_token: String,
    pub upload_url: String,
    pub submit_url: String,
}

#[derive(Deserialize)]
pub struct AuthorizeUpload {
    pub original_name: String,
    pub content_type: String,
    pub size_bytes: i64,
}

#[derive(Serialize)]
pub struct UploadAuthorization {
    pub reservation_id: String,
    pub pathname: String,
    pub upload_url: String,
    pub method: String,
    pub headers: std::collections::BTreeMap<String, String>,
    pub expires_at: i64,
}

#[derive(Deserialize)]
pub struct RegisterUpload {
    pub reservation_id: String,
    pub blob_url: String,
}

#[derive(Deserialize)]
pub struct AuthorizeOutput {
    pub size_bytes: i64,
}

#[derive(Deserialize)]
pub struct CompleteJob {
    pub outputs: Vec<CompletedOutput>,
}

#[derive(Deserialize)]
pub struct CompletedOutput {
    pub kind: String,
    pub reservation_id: String,
    pub blob_url: String,
}

#[derive(Serialize)]
pub struct TemporaryDownload {
    pub url: String,
    pub expires_at: i64,
}

#[derive(Serialize)]
pub struct PublicJob {
    pub id: String,
    pub prompt: String,
    pub status: String,
    pub ready_at: Option<String>,
    pub attempts: i64,
    pub error: Option<String>,
    pub created_at: String,
    pub updated_at: String,
    pub completed_at: Option<String>,
    pub input_count: i64,
    pub template_slug: Option<String>,
    pub downloads: Vec<DownloadLink>,
}

#[derive(Serialize)]
pub struct JobsResponse {
    pub jobs: Vec<PublicJob>,
}

#[derive(Debug, FromRow, Serialize)]
pub struct AdminJob {
    pub id: String,
    pub prompt: String,
    pub status: String,
    pub ready_at: Option<String>,
    pub agent_id: Option<String>,
    pub lease_until: Option<String>,
    pub attempts: i64,
    pub max_attempts: i64,
    pub error: Option<String>,
    pub created_at: String,
    pub updated_at: String,
    pub completed_at: Option<String>,
    pub user_email: Option<String>,
    pub input_count: i64,
    pub template_slug: Option<String>,
}

#[derive(Serialize)]
pub struct AdminJobsResponse {
    pub jobs: Vec<AdminJob>,
}

#[derive(Serialize)]
pub struct DownloadLink {
    pub kind: String,
    pub url: String,
}

#[derive(Deserialize)]
pub struct ClaimRequest {
    pub agent_id: String,
}

#[derive(Serialize)]
pub struct ClaimedJob {
    pub job: Job,
    pub claim_token: String,
    pub inputs: Vec<AgentInput>,
}

#[derive(Serialize)]
pub struct AgentInput {
    pub id: String,
    pub name: String,
    pub content_type: String,
    pub size_bytes: i64,
    pub sha256: String,
    pub etag: Option<String>,
    pub download_url: String,
    pub download_expires_at: i64,
}

#[derive(Deserialize)]
pub struct FailJob {
    pub claim_token: String,
    pub error: String,
    #[serde(default)]
    pub retryable: bool,
}

#[derive(Serialize)]
pub struct ApiMessage {
    pub message: String,
}

#[derive(Serialize)]
pub struct FeatureFlags {
    pub task_submission: bool,
    pub waitlist: bool,
}

#[derive(Deserialize)]
pub struct JoinWaitlist {
    pub email: String,
    #[serde(default = "default_waitlist_source")]
    pub source: String,
    #[serde(default = "default_waitlist_locale")]
    pub locale: String,
}

fn default_waitlist_source() -> String {
    "unknown".into()
}
fn default_waitlist_locale() -> String {
    "en".into()
}

#[derive(Debug, FromRow, Serialize)]
pub struct WaitlistEntry {
    pub id: String,
    pub email: String,
    pub source: String,
    pub locale: String,
    pub created_at: String,
    pub updated_at: String,
}

#[derive(Serialize)]
pub struct WaitlistResponse {
    pub entries: Vec<WaitlistEntry>,
}

#[derive(Debug, Clone, FromRow, Serialize)]
pub struct User {
    pub id: String,
    pub email: String,
    pub email_verified_at: String,
    pub created_at: String,
    pub updated_at: String,
    #[serde(skip_serializing)]
    pub password_hash: Option<String>,
    #[serde(skip_serializing)]
    #[allow(dead_code)]
    pub password_updated_at: Option<String>,
}

#[derive(Deserialize)]
pub struct RequestCode {
    pub email: String,
}

#[derive(Deserialize)]
pub struct VerifyCode {
    pub email: String,
    pub code: String,
}

#[derive(Deserialize)]
pub struct PasswordLogin {
    pub email: String,
    pub password: String,
}

#[derive(Deserialize)]
pub struct SetPassword {
    pub current_password: Option<String>,
    pub new_password: String,
}

#[derive(Serialize)]
pub struct AuthSession {
    pub token: String,
    pub expires_at: String,
    pub user: User,
    pub password_set: bool,
    pub is_admin: bool,
}

#[derive(Serialize)]
pub struct AccountInfo {
    pub user: User,
    pub password_set: bool,
    pub is_admin: bool,
}
