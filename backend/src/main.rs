mod auth;
mod config;
mod error;
mod models;
mod state;
mod storage;

use argon2::{Argon2, PasswordHash, PasswordHasher, PasswordVerifier, password_hash::SaltString};
use auth::{
    random_token, require_admin, require_agent, require_claim, require_job, require_user,
    token_hash,
};
use axum::{
    Json, Router,
    extract::{DefaultBodyLimit, Path, State},
    http::{HeaderMap, StatusCode, header},
    response::{IntoResponse, Response},
    routing::{get, post},
};
use chrono::{Duration, Utc};
use config::Config;
use error::ApiError;
use models::*;
use rand::RngCore;
use serde_json::json;
use sqlx::{Row, sqlite::SqlitePoolOptions};
use state::AppState;
use std::path::PathBuf;
use tokio::fs;
use tower_http::{
    cors::{AllowOrigin, CorsLayer},
    trace::TraceLayer,
};
use uuid::Uuid;

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    tracing_subscriber::fmt()
        .with_env_filter(
            tracing_subscriber::EnvFilter::try_from_default_env()
                .unwrap_or_else(|_| "freeppt_api=info,tower_http=info".into()),
        )
        .init();
    let config = Config::from_env()?;
    if let Some(parent) = sqlite_path(&config.database_url).parent() {
        fs::create_dir_all(parent).await?;
    }
    let db = SqlitePoolOptions::new()
        .max_connections(8)
        .connect(&config.database_url)
        .await?;
    sqlx::query("PRAGMA journal_mode = WAL")
        .execute(&db)
        .await?;
    sqlx::migrate!().run(&db).await?;
    let bind = config.bind;
    let state = AppState { db, config };
    let app = build_router(state)?;
    let listener = tokio::net::TcpListener::bind(bind).await?;
    tracing::info!(%bind, "FreeAIPPT API listening");
    axum::serve(listener, app).await?;
    Ok(())
}

fn build_router(state: AppState) -> anyhow::Result<Router> {
    let origin = state
        .config
        .frontend_origin
        .parse::<axum::http::HeaderValue>()?;
    Ok(Router::new()
        .route("/healthz", get(health))
        .route("/api/v1/features", get(get_features))
        .route("/api/v1/waitlist", post(join_waitlist))
        .route("/api/v1/auth/request-code", post(request_code))
        .route("/api/v1/auth/verify-code", post(verify_code))
        .route(
            "/api/v1/auth/signup/request-code",
            post(signup_request_code),
        )
        .route("/api/v1/auth/signup/verify-code", post(signup_verify_code))
        .route("/api/v1/auth/password-login", post(password_login))
        .route("/api/v1/auth/password", post(set_password))
        .route("/api/v1/auth/me", get(get_account))
        .route("/api/v1/jobs", get(list_jobs).post(create_job))
        .route("/api/v1/jobs/{id}", get(get_job))
        .route(
            "/api/v1/jobs/{id}/files/authorize",
            post(authorize_input_upload),
        )
        .route("/api/v1/jobs/{id}/files", post(register_input_upload))
        .route("/api/v1/jobs/{id}/submit", post(submit_job))
        .route("/api/v1/jobs/{id}/downloads/{kind}", get(download_output))
        .route("/api/v1/admin/jobs", get(list_admin_jobs))
        .route("/api/v1/admin/waitlist", get(list_admin_waitlist))
        .route("/api/v1/agent/jobs/claim", post(claim_job))
        .route(
            "/api/v1/agent/jobs/{id}/inputs/{file_id}",
            get(download_input),
        )
        .route(
            "/api/v1/agent/jobs/{id}/outputs/{kind}/authorize",
            post(authorize_output_upload),
        )
        .route("/api/v1/agent/jobs/{id}/complete", post(complete_job))
        .route("/api/v1/agent/jobs/{id}/fail", post(fail_job))
        .layer(DefaultBodyLimit::max(1_048_576))
        .layer(
            CorsLayer::new()
                .allow_origin(AllowOrigin::exact(origin))
                .allow_headers([
                    header::AUTHORIZATION,
                    header::CONTENT_TYPE,
                    header::HeaderName::from_static("x-job-token"),
                    header::HeaderName::from_static("x-claim-token"),
                ])
                .allow_methods([axum::http::Method::GET, axum::http::Method::POST]),
        )
        .layer(TraceLayer::new_for_http())
        .with_state(state))
}

fn sqlite_path(url: &str) -> PathBuf {
    let raw = url
        .strip_prefix("sqlite://")
        .unwrap_or(url)
        .split('?')
        .next()
        .unwrap_or("data/freeppt.db");
    PathBuf::from(raw)
}

async fn health(State(state): State<AppState>) -> Result<Json<serde_json::Value>, ApiError> {
    sqlx::query("SELECT 1").execute(&state.db).await?;
    Ok(Json(json!({"status":"ok","service":"freeppt-api"})))
}

async fn get_features(State(state): State<AppState>) -> Json<FeatureFlags> {
    Json(FeatureFlags {
        task_submission: !state.config.waitlist,
        waitlist: state.config.waitlist,
    })
}

async fn join_waitlist(
    State(state): State<AppState>,
    Json(input): Json<JoinWaitlist>,
) -> Result<Json<ApiMessage>, ApiError> {
    if !state.config.waitlist {
        return Err(ApiError::unavailable("waitlist registration is disabled"));
    }
    let email = normalized_email(&input.email)?;
    let source = input.source.trim();
    let locale = input.locale.trim();
    if source.is_empty() || source.len() > 64 {
        return Err(ApiError::bad_request("source must contain 1-64 characters"));
    }
    if locale.is_empty() || locale.len() > 16 {
        return Err(ApiError::bad_request("locale must contain 1-16 characters"));
    }
    let now = Utc::now().to_rfc3339();
    sqlx::query(
        "INSERT INTO waitlist_entries (id,email,source,locale,created_at,updated_at) VALUES (?,?,?,?,?,?) \
         ON CONFLICT(email) DO UPDATE SET source=excluded.source,locale=excluded.locale,updated_at=excluded.updated_at"
    ).bind(Uuid::new_v4().to_string()).bind(email).bind(source).bind(locale).bind(&now).bind(&now).execute(&state.db).await?;
    Ok(Json(ApiMessage {
        message: "waitlist registration saved".into(),
    }))
}

fn normalized_email(value: &str) -> Result<String, ApiError> {
    let email = value.trim().to_lowercase();
    if email.len() > 254 || !email.contains('@') || email.starts_with('@') || email.ends_with('@') {
        return Err(ApiError::bad_request("invalid email"));
    }
    Ok(email)
}

async fn request_code(
    State(state): State<AppState>,
    Json(input): Json<RequestCode>,
) -> Result<Json<ApiMessage>, ApiError> {
    let email = normalized_email(&input.email)?;
    let exists: i64 = sqlx::query_scalar("SELECT COUNT(*) FROM users WHERE email=?")
        .bind(&email)
        .fetch_one(&state.db)
        .await?;
    if exists == 0 {
        return Err(ApiError::not_found());
    }
    send_auth_code(&state, &email, "signin").await
}

async fn signup_request_code(
    State(state): State<AppState>,
    Json(input): Json<RequestCode>,
) -> Result<Json<ApiMessage>, ApiError> {
    let email = normalized_email(&input.email)?;
    let exists: i64 = sqlx::query_scalar("SELECT COUNT(*) FROM users WHERE email=?")
        .bind(&email)
        .fetch_one(&state.db)
        .await?;
    if exists > 0 {
        return Err(ApiError::conflict("email is already registered"));
    }
    send_auth_code(&state, &email, "signup").await
}

async fn send_auth_code(
    state: &AppState,
    email: &str,
    purpose: &str,
) -> Result<Json<ApiMessage>, ApiError> {
    let recent: i64 = sqlx::query_scalar(
        "SELECT COUNT(*) FROM email_codes WHERE email = ? AND purpose = ? AND created_at > ?",
    )
    .bind(email)
    .bind(purpose)
    .bind((Utc::now() - Duration::minutes(1)).to_rfc3339())
    .fetch_one(&state.db)
    .await?;
    if recent > 0 {
        return Err(ApiError(
            StatusCode::TOO_MANY_REQUESTS,
            "please wait before requesting another code".into(),
        ));
    }
    let code = format!("{:06}", rand::random_range(0..1_000_000));
    let hash = token_hash(&format!(
        "{}:{}:{}:{}",
        email, purpose, code, state.config.auth_pepper
    ));
    let now = Utc::now();
    sqlx::query("INSERT INTO email_codes (id,email,code_hash,expires_at,created_at,purpose) VALUES (?,?,?,?,?,?)")
        .bind(Uuid::new_v4().to_string()).bind(email).bind(hash).bind((now + Duration::minutes(10)).to_rfc3339()).bind(now.to_rfc3339()).bind(purpose).execute(&state.db).await?;
    let client = reqwest::Client::new();
    let response = client.post("https://api.resend.com/emails")
        .header(reqwest::header::USER_AGENT, "FreeAIPPT/0.1 (+https://freeaippt.space)")
        .bearer_auth(&state.config.resend_api_key).json(&json!({
        "from": state.config.resend_from, "to": [email], "subject": if purpose == "signup" { "Your FreeAIPPT sign-up code" } else { "Your FreeAIPPT sign-in code" },
        "html": format!("<p>Your FreeAIPPT verification code is:</p><p style=\"font-size:28px;font-weight:700;letter-spacing:4px\">{code}</p><p>It expires in 10 minutes.</p>")
    })).send().await.map_err(ApiError::internal)?;
    let status = response.status();
    if !status.is_success() {
        let response_body = response
            .text()
            .await
            .unwrap_or_else(|_| "unreadable response".into());
        let response_excerpt: String = response_body.chars().take(1000).collect();
        return Err(ApiError::internal(format!(
            "Resend returned {status}: {response_excerpt}"
        )));
    }
    Ok(Json(ApiMessage {
        message: "verification code sent".into(),
    }))
}

async fn verify_code(
    State(state): State<AppState>,
    Json(input): Json<VerifyCode>,
) -> Result<Json<AuthSession>, ApiError> {
    let email = normalized_email(&input.email)?;
    let user = sqlx::query_as::<_, User>("SELECT * FROM users WHERE email=?")
        .bind(&email)
        .fetch_optional(&state.db)
        .await?
        .ok_or_else(ApiError::not_found)?;
    consume_auth_code(&state, &email, &input.code, "signin").await?;
    create_session(&state, user).await
}

async fn signup_verify_code(
    State(state): State<AppState>,
    Json(input): Json<VerifyCode>,
) -> Result<Json<AuthSession>, ApiError> {
    let email = normalized_email(&input.email)?;
    let exists: i64 = sqlx::query_scalar("SELECT COUNT(*) FROM users WHERE email=?")
        .bind(&email)
        .fetch_one(&state.db)
        .await?;
    if exists > 0 {
        return Err(ApiError::conflict("email is already registered"));
    }
    consume_auth_code(&state, &email, &input.code, "signup").await?;
    let now = Utc::now().to_rfc3339();
    let uid = Uuid::new_v4().to_string();
    sqlx::query(
        "INSERT INTO users (id,email,email_verified_at,created_at,updated_at) VALUES (?,?,?,?,?)",
    )
    .bind(&uid)
    .bind(&email)
    .bind(&now)
    .bind(&now)
    .bind(&now)
    .execute(&state.db)
    .await?;
    let user = sqlx::query_as::<_, User>("SELECT * FROM users WHERE id=?")
        .bind(uid)
        .fetch_one(&state.db)
        .await?;
    create_session(&state, user).await
}

async fn consume_auth_code(
    state: &AppState,
    email: &str,
    code: &str,
    purpose: &str,
) -> Result<(), ApiError> {
    if code.len() != 6 || !code.chars().all(|c| c.is_ascii_digit()) {
        return Err(ApiError::bad_request("invalid code"));
    }
    let row = sqlx::query("SELECT id, code_hash, attempts, expires_at FROM email_codes WHERE email=? AND purpose=? AND consumed_at IS NULL ORDER BY created_at DESC LIMIT 1")
        .bind(email).bind(purpose).fetch_optional(&state.db).await?.ok_or_else(ApiError::unauthorized)?;
    let id: String = row.get("id");
    let attempts: i64 = row.get("attempts");
    let expires_at: String = row.get("expires_at");
    if attempts >= 5 || expires_at < Utc::now().to_rfc3339() {
        return Err(ApiError::unauthorized());
    }
    let expected: String = row.get("code_hash");
    if token_hash(&format!(
        "{}:{}:{}:{}",
        email, purpose, code, state.config.auth_pepper
    )) != expected
    {
        sqlx::query("UPDATE email_codes SET attempts=attempts+1 WHERE id=?")
            .bind(&id)
            .execute(&state.db)
            .await?;
        return Err(ApiError::unauthorized());
    }
    sqlx::query("UPDATE email_codes SET consumed_at=? WHERE id=?")
        .bind(Utc::now().to_rfc3339())
        .bind(&id)
        .execute(&state.db)
        .await?;
    Ok(())
}

async fn create_session(state: &AppState, user: User) -> Result<Json<AuthSession>, ApiError> {
    let now = Utc::now().to_rfc3339();
    let token = random_token();
    let expires = (Utc::now() + Duration::days(30)).to_rfc3339();
    sqlx::query("INSERT INTO sessions (id,user_id,token_hash,expires_at,created_at,last_seen_at) VALUES (?,?,?,?,?,?)")
        .bind(Uuid::new_v4().to_string()).bind(&user.id).bind(token_hash(&token)).bind(&expires).bind(&now).bind(&now).execute(&state.db).await?;
    let password_set = user.password_hash.is_some();
    let is_admin = state
        .config
        .admin_emails
        .contains(&user.email.to_lowercase());
    Ok(Json(AuthSession {
        token,
        expires_at: expires,
        user,
        password_set,
        is_admin,
    }))
}

fn valid_password(value: &str) -> Result<(), ApiError> {
    if value.len() < 8 || value.len() > 128 {
        return Err(ApiError::bad_request(
            "password must contain 8-128 characters",
        ));
    }
    Ok(())
}

fn verify_password(password: &str, encoded: &str) -> bool {
    PasswordHash::new(encoded)
        .ok()
        .and_then(|hash| {
            Argon2::default()
                .verify_password(password.as_bytes(), &hash)
                .ok()
        })
        .is_some()
}

async fn password_login(
    State(state): State<AppState>,
    Json(input): Json<PasswordLogin>,
) -> Result<Json<AuthSession>, ApiError> {
    let email = normalized_email(&input.email)?;
    let user = sqlx::query_as::<_, User>("SELECT * FROM users WHERE email=?")
        .bind(&email)
        .fetch_optional(&state.db)
        .await?
        .ok_or_else(ApiError::unauthorized)?;
    let encoded = user
        .password_hash
        .as_deref()
        .ok_or_else(ApiError::unauthorized)?;
    if !verify_password(&input.password, encoded) {
        return Err(ApiError::unauthorized());
    }
    let token = random_token();
    let now = Utc::now().to_rfc3339();
    let expires = (Utc::now() + Duration::days(30)).to_rfc3339();
    sqlx::query("INSERT INTO sessions (id,user_id,token_hash,expires_at,created_at,last_seen_at) VALUES (?,?,?,?,?,?)")
        .bind(Uuid::new_v4().to_string()).bind(&user.id).bind(token_hash(&token)).bind(&expires).bind(&now).bind(&now).execute(&state.db).await?;
    let is_admin = state
        .config
        .admin_emails
        .contains(&user.email.to_lowercase());
    Ok(Json(AuthSession {
        token,
        expires_at: expires,
        user,
        password_set: true,
        is_admin,
    }))
}

async fn get_account(
    State(state): State<AppState>,
    headers: HeaderMap,
) -> Result<Json<AccountInfo>, ApiError> {
    let user = require_user(&headers, &state).await?;
    let password_set = user.password_hash.is_some();
    let is_admin = state
        .config
        .admin_emails
        .contains(&user.email.to_lowercase());
    Ok(Json(AccountInfo {
        user,
        password_set,
        is_admin,
    }))
}

async fn set_password(
    State(state): State<AppState>,
    headers: HeaderMap,
    Json(input): Json<SetPassword>,
) -> Result<Json<ApiMessage>, ApiError> {
    let user = require_user(&headers, &state).await?;
    valid_password(&input.new_password)?;
    if let Some(encoded) = user.password_hash.as_deref() {
        let current = input
            .current_password
            .as_deref()
            .ok_or_else(|| ApiError::bad_request("current password is required"))?;
        if !verify_password(current, encoded) {
            return Err(ApiError::unauthorized());
        }
    }
    let mut salt_bytes = [0u8; 16];
    rand::rng().fill_bytes(&mut salt_bytes);
    let salt = SaltString::encode_b64(&salt_bytes).map_err(ApiError::internal)?;
    let encoded = Argon2::default()
        .hash_password(input.new_password.as_bytes(), &salt)
        .map_err(ApiError::internal)?
        .to_string();
    let now = Utc::now().to_rfc3339();
    sqlx::query("UPDATE users SET password_hash=?,password_updated_at=?,updated_at=? WHERE id=?")
        .bind(encoded)
        .bind(&now)
        .bind(&now)
        .bind(&user.id)
        .execute(&state.db)
        .await?;
    Ok(Json(ApiMessage {
        message: "password updated".into(),
    }))
}

async fn create_job(
    State(state): State<AppState>,
    headers: HeaderMap,
    Json(input): Json<CreateJob>,
) -> Result<(StatusCode, Json<CreatedJob>), ApiError> {
    if state.config.waitlist {
        return Err(ApiError::unavailable(
            "task submission is disabled while waitlist mode is active",
        ));
    }
    let user = require_user(&headers, &state).await?;
    let prompt = input.prompt.trim();
    if prompt.is_empty() || prompt.len() > 20_000 {
        return Err(ApiError::bad_request(
            "prompt must contain 1-20000 characters",
        ));
    }
    let template_slug = input
        .template_slug
        .as_deref()
        .map(str::trim)
        .filter(|value| !value.is_empty());
    if template_slug.is_some_and(|value| {
        value.len() > 100 || !value.chars().all(|c| c.is_ascii_alphanumeric() || c == '-')
    }) {
        return Err(ApiError::bad_request("invalid template_slug"));
    }
    let id = Uuid::new_v4().to_string();
    let token = random_token();
    let now = Utc::now().to_rfc3339();
    sqlx::query("INSERT INTO jobs (id,public_token_hash,prompt,status,created_at,updated_at,user_id,template_slug) VALUES (?,?,?,?,?,?,?,?)")
        .bind(&id).bind(token_hash(&token)).bind(prompt).bind("pending").bind(&now).bind(&now).bind(&user.id).bind(template_slug).execute(&state.db).await?;
    Ok((
        StatusCode::CREATED,
        Json(CreatedJob {
            id: id.clone(),
            status: "pending".into(),
            job_token: token,
            upload_url: format!(
                "{}/api/v1/jobs/{id}/files/authorize",
                state.config.public_base_url
            ),
            submit_url: format!("{}/api/v1/jobs/{id}/submit", state.config.public_base_url),
        }),
    ))
}

async fn get_job(
    State(state): State<AppState>,
    Path(id): Path<String>,
    headers: HeaderMap,
) -> Result<Json<PublicJob>, ApiError> {
    let job = require_job(&headers, &state, &id).await?;
    Ok(Json(public_job(&state, job).await?))
}

async fn public_job(state: &AppState, job: Job) -> Result<PublicJob, ApiError> {
    let input_count: i64 = sqlx::query_scalar("SELECT COUNT(*) FROM job_inputs WHERE job_id=?")
        .bind(&job.id)
        .fetch_one(&state.db)
        .await?;
    let kinds: Vec<String> =
        sqlx::query_scalar("SELECT kind FROM job_outputs WHERE job_id=? ORDER BY kind")
            .bind(&job.id)
            .fetch_all(&state.db)
            .await?;
    let downloads = kinds
        .into_iter()
        .map(|kind| DownloadLink {
            url: format!(
                "{}/api/v1/jobs/{}/downloads/{}",
                state.config.public_base_url, job.id, kind
            ),
            kind,
        })
        .collect();
    Ok(PublicJob {
        id: job.id,
        prompt: job.prompt,
        status: job.status,
        ready_at: job.ready_at,
        attempts: job.attempts,
        error: job.error_message,
        created_at: job.created_at,
        updated_at: job.updated_at,
        completed_at: job.completed_at,
        input_count,
        template_slug: job.template_slug,
        downloads,
    })
}

async fn list_jobs(
    State(state): State<AppState>,
    headers: HeaderMap,
) -> Result<Json<JobsResponse>, ApiError> {
    let user = require_user(&headers, &state).await?;
    let rows: Vec<Job> =
        sqlx::query_as("SELECT * FROM jobs WHERE user_id=? ORDER BY created_at DESC LIMIT 100")
            .bind(&user.id)
            .fetch_all(&state.db)
            .await?;
    let mut jobs = Vec::with_capacity(rows.len());
    for job in rows {
        jobs.push(public_job(&state, job).await?);
    }
    Ok(Json(JobsResponse { jobs }))
}

async fn list_admin_jobs(
    State(state): State<AppState>,
    headers: HeaderMap,
) -> Result<Json<AdminJobsResponse>, ApiError> {
    require_admin(&headers, &state).await?;
    let jobs: Vec<AdminJob> = sqlx::query_as(
        "SELECT j.id,j.prompt,j.status,j.ready_at,j.agent_id,j.lease_until,j.attempts,j.max_attempts,\
         j.error_message AS error,j.created_at,j.updated_at,j.completed_at,u.email AS user_email,\
         (SELECT COUNT(*) FROM job_inputs i WHERE i.job_id=j.id) AS input_count,j.template_slug \
         FROM jobs j LEFT JOIN users u ON u.id=j.user_id ORDER BY j.created_at DESC LIMIT 500"
    ).fetch_all(&state.db).await?;
    Ok(Json(AdminJobsResponse { jobs }))
}

async fn list_admin_waitlist(
    State(state): State<AppState>,
    headers: HeaderMap,
) -> Result<Json<WaitlistResponse>, ApiError> {
    require_admin(&headers, &state).await?;
    let entries: Vec<WaitlistEntry> =
        sqlx::query_as("SELECT * FROM waitlist_entries ORDER BY created_at DESC LIMIT 1000")
            .fetch_all(&state.db)
            .await?;
    Ok(Json(WaitlistResponse { entries }))
}

async fn authorize_input_upload(
    State(state): State<AppState>,
    Path(id): Path<String>,
    headers: HeaderMap,
    Json(input): Json<AuthorizeUpload>,
) -> Result<Json<UploadAuthorization>, ApiError> {
    if state.config.waitlist {
        return Err(ApiError::unavailable(
            "task submission is disabled while waitlist mode is active",
        ));
    }
    if !storage::blob_enabled(&state.config) {
        return Err(ApiError::unavailable("file storage is not configured"));
    }
    let job = require_job(&headers, &state, &id).await?;
    if job.status != "pending" || job.ready_at.is_some() {
        return Err(ApiError::conflict("job is no longer accepting files"));
    }
    let active_inputs: i64 = sqlx::query_scalar(
        "SELECT (SELECT COUNT(*) FROM job_inputs WHERE job_id=?) + \
         (SELECT COUNT(*) FROM blob_upload_reservations WHERE job_id=? AND purpose='input' AND completed_at IS NULL AND expires_at > ?)",
    )
    .bind(&id)
    .bind(&id)
    .bind(Utc::now().to_rfc3339())
    .fetch_one(&state.db)
    .await?;
    if active_inputs >= 8 {
        return Err(ApiError::conflict("a job can contain at most 8 attachments"));
    }
    if input.size_bytes <= 0 || input.size_bytes > state.config.max_upload_bytes as i64 {
        return Err(ApiError::bad_request("invalid file size"));
    }
    let original_name = storage::safe_name(input.original_name.trim());
    let content_type = input_content_type(&original_name, &input.content_type)?;
    let reservation_id = Uuid::new_v4().to_string();
    let pathname = format!("inputs/{id}/{reservation_id}/{original_name}");
    let authorization = storage::authorize_put(
        &state.config,
        reservation_id.clone(),
        pathname.clone(),
        content_type.clone(),
        input.size_bytes,
    )
    .await?;
    let now = Utc::now().to_rfc3339();
    let expires_at = chrono::DateTime::from_timestamp_millis(authorization.expires_at)
        .ok_or_else(|| ApiError::internal("invalid upload expiry"))?
        .to_rfc3339();
    sqlx::query("INSERT INTO blob_upload_reservations (id,job_id,purpose,kind,original_name,pathname,content_type,maximum_size_bytes,expires_at,created_at) VALUES (?,?, 'input', NULL,?,?,?,?,?,?)")
        .bind(&reservation_id).bind(&id).bind(&original_name).bind(&pathname).bind(&content_type).bind(input.size_bytes).bind(expires_at).bind(now).execute(&state.db).await?;
    Ok(Json(authorization))
}

async fn register_input_upload(
    State(state): State<AppState>,
    Path(id): Path<String>,
    headers: HeaderMap,
    Json(input): Json<RegisterUpload>,
) -> Result<(StatusCode, Json<StoredFile>), ApiError> {
    if state.config.waitlist {
        return Err(ApiError::unavailable(
            "task submission is disabled while waitlist mode is active",
        ));
    }
    let job = require_job(&headers, &state, &id).await?;
    if job.status != "pending" || job.ready_at.is_some() {
        return Err(ApiError::conflict("job is no longer accepting files"));
    }
    let reservation = sqlx::query("SELECT original_name,pathname,content_type,maximum_size_bytes,expires_at,completed_at FROM blob_upload_reservations WHERE id=? AND job_id=? AND purpose='input'")
        .bind(&input.reservation_id).bind(&id).fetch_optional(&state.db).await?.ok_or_else(ApiError::not_found)?;
    if reservation
        .get::<Option<String>, _>("completed_at")
        .is_some()
    {
        return Err(ApiError::conflict("upload has already been registered"));
    }
    if reservation.get::<String, _>("expires_at") < Utc::now().to_rfc3339() {
        return Err(ApiError::conflict("upload authorization has expired"));
    }
    let metadata = storage::head_blob(&state.config, &input.blob_url).await?;
    let pathname: String = reservation.get("pathname");
    let content_type: String = reservation.get("content_type");
    let maximum_size: i64 = reservation.get("maximum_size_bytes");
    validate_uploaded_blob(&metadata, &pathname, &content_type, maximum_size)?;
    let now = Utc::now().to_rfc3339();
    let record = StoredFile {
        id: Uuid::new_v4().to_string(),
        job_id: id.clone(),
        original_name: reservation.get("original_name"),
        content_type: metadata.content_type,
        size_bytes: metadata.size,
        sha256: String::new(),
        etag: Some(metadata.etag),
        storage_path: metadata.url,
        created_at: now.clone(),
    };
    let mut tx = state.db.begin().await?;
    sqlx::query("INSERT INTO job_inputs (id,job_id,original_name,content_type,size_bytes,sha256,storage_path,created_at,etag) VALUES (?,?,?,?,?,?,?,?,?)")
        .bind(&record.id).bind(&record.job_id).bind(&record.original_name).bind(&record.content_type).bind(record.size_bytes).bind(&record.sha256).bind(&record.storage_path).bind(&record.created_at).bind(&record.etag).execute(&mut *tx).await?;
    let changed = sqlx::query(
        "UPDATE blob_upload_reservations SET completed_at=? WHERE id=? AND completed_at IS NULL",
    )
    .bind(&now)
    .bind(&input.reservation_id)
    .execute(&mut *tx)
    .await?
    .rows_affected();
    if changed != 1 {
        return Err(ApiError::conflict("upload has already been registered"));
    }
    tx.commit().await?;
    Ok((StatusCode::CREATED, Json(record)))
}

fn input_content_type(name: &str, supplied: &str) -> Result<String, ApiError> {
    let extension = name.rsplit('.').next().unwrap_or("").to_ascii_lowercase();
    let expected = match extension.as_str() {
        "doc" => "application/msword",
        "docx" => "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "ppt" => "application/vnd.ms-powerpoint",
        "pptx" => "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "xls" => "application/vnd.ms-excel",
        "xlsx" => "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "csv" => "text/csv",
        "pdf" => "application/pdf",
        "png" => "image/png",
        "jpg" | "jpeg" => "image/jpeg",
        "webp" => "image/webp",
        _ => return Err(ApiError::bad_request("unsupported attachment type")),
    };
    let supplied = supplied.split(';').next().unwrap_or("").trim();
    if !supplied.is_empty() && supplied != "application/octet-stream" && supplied != expected {
        return Err(ApiError::bad_request(
            "file extension and content type do not match",
        ));
    }
    Ok(expected.into())
}

fn validate_uploaded_blob(
    metadata: &storage::BlobMetadata,
    pathname: &str,
    content_type: &str,
    maximum_size: i64,
) -> Result<(), ApiError> {
    if metadata.pathname != pathname {
        return Err(ApiError::bad_request(
            "uploaded Blob pathname does not match its authorization",
        ));
    }
    if metadata.content_type.split(';').next().unwrap_or("")
        != content_type.split(';').next().unwrap_or("")
    {
        return Err(ApiError::bad_request(
            "uploaded Blob content type does not match its authorization",
        ));
    }
    if metadata.size <= 0 || metadata.size > maximum_size {
        return Err(ApiError::bad_request(
            "uploaded Blob size does not match its authorization",
        ));
    }
    Ok(())
}

async fn submit_job(
    State(state): State<AppState>,
    Path(id): Path<String>,
    headers: HeaderMap,
) -> Result<Json<ApiMessage>, ApiError> {
    if state.config.waitlist {
        return Err(ApiError::unavailable(
            "task submission is disabled while waitlist mode is active",
        ));
    }
    let job = require_job(&headers, &state, &id).await?;
    if job.status != "pending" || job.ready_at.is_some() {
        return Err(ApiError::conflict("job has already been submitted"));
    }
    let now = Utc::now().to_rfc3339();
    sqlx::query("UPDATE jobs SET ready_at=?,updated_at=? WHERE id=?")
        .bind(&now)
        .bind(&now)
        .bind(&id)
        .execute(&state.db)
        .await?;
    Ok(Json(ApiMessage {
        message: "job queued".into(),
    }))
}

async fn claim_job(
    State(state): State<AppState>,
    headers: HeaderMap,
    Json(input): Json<ClaimRequest>,
) -> Result<Response, ApiError> {
    require_agent(&headers, &state)?;
    let mut tx = state.db.begin().await?;
    let now = Utc::now().to_rfc3339();
    let job = sqlx::query_as::<_, Job>("SELECT * FROM jobs WHERE ready_at IS NOT NULL AND attempts < max_attempts AND (status='pending' OR (status='processing' AND lease_until < ?)) ORDER BY created_at LIMIT 1")
        .bind(&now).fetch_optional(&mut *tx).await?;
    let Some(mut job) = job else {
        tx.rollback().await?;
        return Ok(StatusCode::NO_CONTENT.into_response());
    };
    let claim = random_token();
    let lease = (Utc::now() + Duration::seconds(state.config.lease_seconds)).to_rfc3339();
    let changed = sqlx::query("UPDATE jobs SET status='processing',agent_id=?,claim_token_hash=?,lease_until=?,attempts=attempts+1,updated_at=? WHERE id=? AND (status='pending' OR lease_until < ?)")
        .bind(&input.agent_id).bind(token_hash(&claim)).bind(&lease).bind(&now).bind(&job.id).bind(&now).execute(&mut *tx).await?.rows_affected();
    if changed == 0 {
        tx.rollback().await?;
        return Ok(StatusCode::NO_CONTENT.into_response());
    }
    job = sqlx::query_as("SELECT * FROM jobs WHERE id=?")
        .bind(&job.id)
        .fetch_one(&mut *tx)
        .await?;
    let files: Vec<StoredFile> =
        sqlx::query_as("SELECT * FROM job_inputs WHERE job_id=? ORDER BY created_at")
            .bind(&job.id)
            .fetch_all(&mut *tx)
            .await?;
    tx.commit().await?;
    let mut inputs = Vec::with_capacity(files.len());
    for file in files {
        let pathname = storage::pathname_from_blob_url(&state.config, &file.storage_path)?;
        let (download_url, download_expires_at) =
            storage::authorize_get(&state.config, &pathname).await?;
        inputs.push(AgentInput {
            id: file.id,
            name: file.original_name,
            content_type: file.content_type,
            size_bytes: file.size_bytes,
            sha256: file.sha256,
            etag: file.etag,
            download_url,
            download_expires_at,
        });
    }
    Ok((
        StatusCode::OK,
        Json(ClaimedJob {
            job,
            claim_token: claim,
            inputs,
        }),
    )
        .into_response())
}

async fn download_input(
    State(state): State<AppState>,
    Path((id, file_id)): Path<(String, String)>,
    headers: HeaderMap,
) -> Result<Json<TemporaryDownload>, ApiError> {
    require_agent(&headers, &state)?;
    let file = sqlx::query_as::<_, StoredFile>("SELECT * FROM job_inputs WHERE id=? AND job_id=?")
        .bind(file_id)
        .bind(id)
        .fetch_optional(&state.db)
        .await?
        .ok_or_else(ApiError::not_found)?;
    let pathname = storage::pathname_from_blob_url(&state.config, &file.storage_path)?;
    let (url, expires_at) = storage::authorize_get(&state.config, &pathname).await?;
    Ok(Json(TemporaryDownload { url, expires_at }))
}

async fn authorize_output_upload(
    State(state): State<AppState>,
    Path((id, kind)): Path<(String, String)>,
    headers: HeaderMap,
    Json(input): Json<AuthorizeOutput>,
) -> Result<Json<UploadAuthorization>, ApiError> {
    require_agent(&headers, &state)?;
    let job = sqlx::query_as::<_, Job>("SELECT * FROM jobs WHERE id=?")
        .bind(&id)
        .fetch_optional(&state.db)
        .await?
        .ok_or_else(ApiError::not_found)?;
    require_claim(&headers, &job)?;
    if job.status != "processing" {
        return Err(ApiError::conflict("job is not processing"));
    }
    if input.size_bytes <= 0 || input.size_bytes > state.config.max_upload_bytes as i64 {
        return Err(ApiError::bad_request("invalid output size"));
    }
    let content_type = output_content_type(&kind)?.to_string();
    let reservation_id = Uuid::new_v4().to_string();
    let pathname = format!("outputs/{id}/{reservation_id}/freeaippt-{id}.{kind}");
    let authorization = storage::authorize_put(
        &state.config,
        reservation_id.clone(),
        pathname.clone(),
        content_type.clone(),
        input.size_bytes,
    )
    .await?;
    let expires_at = chrono::DateTime::from_timestamp_millis(authorization.expires_at)
        .ok_or_else(|| ApiError::internal("invalid upload expiry"))?
        .to_rfc3339();
    let now = Utc::now().to_rfc3339();
    sqlx::query("INSERT INTO blob_upload_reservations (id,job_id,purpose,kind,original_name,pathname,content_type,maximum_size_bytes,expires_at,created_at) VALUES (?,?,'output',?,?,?,?,?,?,?)")
        .bind(&reservation_id).bind(&id).bind(&kind).bind(format!("freeaippt-{id}.{kind}")).bind(&pathname).bind(&content_type).bind(input.size_bytes).bind(expires_at).bind(now).execute(&state.db).await?;
    Ok(Json(authorization))
}

fn output_content_type(kind: &str) -> Result<&'static str, ApiError> {
    match kind {
        "pptx" => Ok("application/vnd.openxmlformats-officedocument.presentationml.presentation"),
        "html" => Ok("text/html"),
        _ => Err(ApiError::bad_request("output kind must be pptx or html")),
    }
}

async fn complete_job(
    State(state): State<AppState>,
    Path(id): Path<String>,
    headers: HeaderMap,
    Json(input): Json<CompleteJob>,
) -> Result<Json<ApiMessage>, ApiError> {
    require_agent(&headers, &state)?;
    let job = sqlx::query_as::<_, Job>("SELECT * FROM jobs WHERE id=?")
        .bind(&id)
        .fetch_optional(&state.db)
        .await?
        .ok_or_else(ApiError::not_found)?;
    require_claim(&headers, &job)?;
    if job.status != "processing" {
        return Err(ApiError::conflict("job is not processing"));
    }
    if input.outputs.len() != 2 {
        return Err(ApiError::bad_request(
            "both pptx and html outputs are required",
        ));
    }
    let mut verified = Vec::with_capacity(2);
    let mut kinds = std::collections::HashSet::new();
    for output in input.outputs {
        if !kinds.insert(output.kind.clone()) {
            return Err(ApiError::bad_request("output kinds must be unique"));
        }
        let expected_content_type = output_content_type(&output.kind)?;
        let reservation = sqlx::query("SELECT pathname,content_type,maximum_size_bytes,expires_at,completed_at FROM blob_upload_reservations WHERE id=? AND job_id=? AND purpose='output' AND kind=?")
            .bind(&output.reservation_id).bind(&id).bind(&output.kind).fetch_optional(&state.db).await?.ok_or_else(ApiError::not_found)?;
        if reservation
            .get::<Option<String>, _>("completed_at")
            .is_some()
        {
            return Err(ApiError::conflict(
                "output upload has already been registered",
            ));
        }
        if reservation.get::<String, _>("expires_at") < Utc::now().to_rfc3339() {
            return Err(ApiError::conflict(
                "output upload authorization has expired",
            ));
        }
        let pathname: String = reservation.get("pathname");
        let content_type: String = reservation.get("content_type");
        if content_type != expected_content_type {
            return Err(ApiError::bad_request("invalid output content type"));
        }
        let metadata = storage::head_blob(&state.config, &output.blob_url).await?;
        validate_uploaded_blob(
            &metadata,
            &pathname,
            &content_type,
            reservation.get("maximum_size_bytes"),
        )?;
        verified.push((output.kind, output.reservation_id, metadata));
    }
    if !kinds.contains("pptx") || !kinds.contains("html") {
        return Err(ApiError::bad_request(
            "both pptx and html outputs are required",
        ));
    }
    let now = Utc::now().to_rfc3339();
    let mut tx = state.db.begin().await?;
    for (kind, reservation_id, metadata) in verified {
        sqlx::query("INSERT INTO job_outputs (id,job_id,kind,content_type,size_bytes,sha256,storage_path,created_at,etag) VALUES (?,?,?,?,?,?,?,?,?) ON CONFLICT(job_id,kind) DO UPDATE SET content_type=excluded.content_type,size_bytes=excluded.size_bytes,sha256=excluded.sha256,storage_path=excluded.storage_path,created_at=excluded.created_at,etag=excluded.etag")
            .bind(Uuid::new_v4().to_string()).bind(&id).bind(&kind).bind(&metadata.content_type).bind(metadata.size).bind("").bind(&metadata.url).bind(&now).bind(&metadata.etag).execute(&mut *tx).await?;
        let changed = sqlx::query("UPDATE blob_upload_reservations SET completed_at=? WHERE id=? AND completed_at IS NULL")
            .bind(&now).bind(reservation_id).execute(&mut *tx).await?.rows_affected();
        if changed != 1 {
            return Err(ApiError::conflict(
                "output upload has already been registered",
            ));
        }
    }
    sqlx::query("UPDATE jobs SET status='completed',completed_at=?,updated_at=?,lease_until=NULL WHERE id=?").bind(&now).bind(&now).bind(id).execute(&mut *tx).await?;
    tx.commit().await?;
    Ok(Json(ApiMessage {
        message: "job completed".into(),
    }))
}

async fn fail_job(
    State(state): State<AppState>,
    Path(id): Path<String>,
    headers: HeaderMap,
    Json(input): Json<FailJob>,
) -> Result<Json<ApiMessage>, ApiError> {
    require_agent(&headers, &state)?;
    let job = sqlx::query_as::<_, Job>("SELECT * FROM jobs WHERE id=?")
        .bind(&id)
        .fetch_optional(&state.db)
        .await?
        .ok_or_else(ApiError::not_found)?;
    if token_hash(&input.claim_token) != job.claim_token_hash.unwrap_or_default() {
        return Err(ApiError::unauthorized());
    }
    let status = if input.retryable && job.attempts < job.max_attempts {
        "pending"
    } else {
        "failed"
    };
    let now = Utc::now().to_rfc3339();
    sqlx::query("UPDATE jobs SET status=?,error_message=?,ready_at=CASE WHEN ?='pending' THEN ? ELSE ready_at END,claim_token_hash=NULL,lease_until=NULL,updated_at=? WHERE id=?")
        .bind(status).bind(input.error.chars().take(1000).collect::<String>()).bind(status).bind(&now).bind(&now).bind(id).execute(&state.db).await?;
    Ok(Json(ApiMessage {
        message: format!("job {status}"),
    }))
}

async fn download_output(
    State(state): State<AppState>,
    Path((id, kind)): Path<(String, String)>,
    headers: HeaderMap,
) -> Result<Json<TemporaryDownload>, ApiError> {
    require_job(&headers, &state, &id).await?;
    output_content_type(&kind)?;
    let storage_path: String =
        sqlx::query_scalar("SELECT storage_path FROM job_outputs WHERE job_id=? AND kind=?")
            .bind(&id)
            .bind(&kind)
            .fetch_optional(&state.db)
            .await?
            .ok_or_else(ApiError::not_found)?;
    let pathname = storage::pathname_from_blob_url(&state.config, &storage_path)?;
    let (url, expires_at) = storage::authorize_get(&state.config, &pathname).await?;
    Ok(Json(TemporaryDownload { url, expires_at }))
}

#[cfg(test)]
mod tests {
    use super::*;
    use axum::{body::{Body, to_bytes}, http::Request};
    use serde_json::{Value, json};
    use sqlx::SqlitePool;
    use std::net::{IpAddr, Ipv4Addr, SocketAddr};
    use tower::ServiceExt;

    async fn test_app() -> (Router, SqlitePool) {
        test_app_with_waitlist(false).await
    }

    async fn test_app_with_waitlist(waitlist: bool) -> (Router, SqlitePool) {
        let db = SqlitePoolOptions::new()
            .max_connections(1)
            .connect("sqlite::memory:")
            .await
            .unwrap();
        sqlx::migrate!().run(&db).await.unwrap();
        let config = Config {
            bind: SocketAddr::new(IpAddr::V4(Ipv4Addr::LOCALHOST), 0),
            database_url: "sqlite::memory:".into(),
            agent_api_token: "test-agent-token".into(),
            frontend_origin: "http://localhost:3000".into(),
            public_base_url: "http://localhost:8080".into(),
            lease_seconds: 900,
            max_upload_bytes: 1_000_000,
            resend_api_key: "not-used-in-tests".into(),
            resend_from: "FreeAIPPT <test@example.com>".into(),
            auth_pepper: "test-pepper".into(),
            admin_emails: ["admin@example.com".to_string()].into_iter().collect(),
            waitlist,
            blob_read_write_token: None,
            blob_store_id: None,
        };
        (
            build_router(AppState {
                db: db.clone(),
                config,
            })
            .unwrap(),
            db,
        )
    }

    fn post(path: &str, value: Value) -> Request<Body> {
        Request::builder()
            .method("POST")
            .uri(path)
            .header(header::CONTENT_TYPE, "application/json")
            .body(Body::from(value.to_string()))
            .unwrap()
    }

    fn post_auth(path: &str, value: Value, token: &str) -> Request<Body> {
        Request::builder()
            .method("POST")
            .uri(path)
            .header(header::AUTHORIZATION, format!("Bearer {token}"))
            .header(header::CONTENT_TYPE, "application/json")
            .body(Body::from(value.to_string()))
            .unwrap()
    }

    fn get_auth(path: &str, token: &str) -> Request<Body> {
        Request::builder()
            .uri(path)
            .header(header::AUTHORIZATION, format!("Bearer {token}"))
            .body(Body::empty())
            .unwrap()
    }

    async fn add_user(db: &SqlitePool, id: &str, email: &str, token: &str) {
        let now = Utc::now().to_rfc3339();
        sqlx::query("INSERT INTO users (id,email,email_verified_at,created_at,updated_at) VALUES (?,?,?,?,?)")
            .bind(id).bind(email).bind(&now).bind(&now).bind(&now).execute(db).await.unwrap();
        sqlx::query("INSERT INTO sessions (id,user_id,token_hash,expires_at,created_at,last_seen_at) VALUES (?,?,?,?,?,?)")
            .bind(format!("session-{id}")).bind(id).bind(token_hash(token)).bind((Utc::now()+Duration::days(1)).to_rfc3339()).bind(&now).bind(&now).execute(db).await.unwrap();
    }

    async fn json_body(response: Response) -> Value {
        serde_json::from_slice(&to_bytes(response.into_body(), 1_000_000).await.unwrap()).unwrap()
    }

    #[tokio::test]
    async fn health_and_input_validation() {
        let (app, db) = test_app().await;
        let health = app
            .clone()
            .oneshot(
                Request::builder()
                    .uri("/healthz")
                    .body(Body::empty())
                    .unwrap(),
            )
            .await
            .unwrap();
        assert_eq!(health.status(), StatusCode::OK);
        assert_eq!(json_body(health).await["status"], "ok");
        let invalid_email = app
            .clone()
            .oneshot(post(
                "/api/v1/auth/request-code",
                json!({"email":"invalid"}),
            ))
            .await
            .unwrap();
        assert_eq!(invalid_email.status(), StatusCode::BAD_REQUEST);
        add_user(
            &db,
            "validation-user",
            "validation@example.com",
            "validation-token",
        )
        .await;
        let empty_job = app
            .oneshot(post_auth(
                "/api/v1/jobs",
                json!({"prompt":""}),
                "validation-token",
            ))
            .await
            .unwrap();
        assert_eq!(empty_job.status(), StatusCode::BAD_REQUEST);
    }

    #[tokio::test]
    async fn job_can_be_created_submitted_and_claimed() {
        let (app, db) = test_app().await;
        add_user(&db, "job-user", "jobs@example.com", "job-user-token").await;
        let created = app.clone().oneshot(post_auth("/api/v1/jobs", json!({"prompt":"Create a product strategy deck","template_slug":"startup-pitch-deck"}), "job-user-token")).await.unwrap();
        assert_eq!(created.status(), StatusCode::CREATED);
        let created = json_body(created).await;
        let id = created["id"].as_str().unwrap();
        let token = created["job_token"].as_str().unwrap();
        let submit = app
            .clone()
            .oneshot(
                Request::builder()
                    .method("POST")
                    .uri(format!("/api/v1/jobs/{id}/submit"))
                    .header("x-job-token", token)
                    .body(Body::empty())
                    .unwrap(),
            )
            .await
            .unwrap();
        assert_eq!(submit.status(), StatusCode::OK);
        let unauthorized = app
            .clone()
            .oneshot(post(
                "/api/v1/agent/jobs/claim",
                json!({"agent_id":"worker-1"}),
            ))
            .await
            .unwrap();
        assert_eq!(unauthorized.status(), StatusCode::UNAUTHORIZED);
        let claim = app
            .clone()
            .oneshot(
                Request::builder()
                    .method("POST")
                    .uri("/api/v1/agent/jobs/claim")
                    .header(header::AUTHORIZATION, "Bearer test-agent-token")
                    .header(header::CONTENT_TYPE, "application/json")
                    .body(Body::from(json!({"agent_id":"worker-1"}).to_string()))
                    .unwrap(),
            )
            .await
            .unwrap();
        assert_eq!(claim.status(), StatusCode::OK);
        let claim = json_body(claim).await;
        assert_eq!(claim["job"]["id"], id);
        assert_eq!(claim["job"]["status"], "processing");
        assert_eq!(claim["job"]["template_slug"], "startup-pitch-deck");
        assert!(claim["claim_token"].as_str().unwrap().len() >= 32);
    }

    #[tokio::test]
    async fn user_queue_waitlist_and_admin_access_are_enforced() {
        let (app, db) = test_app().await;
        add_user(&db, "member", "member@example.com", "member-token").await;
        add_user(&db, "admin", "admin@example.com", "admin-token").await;

        let created = app
            .clone()
            .oneshot(post_auth(
                "/api/v1/jobs",
                json!({"prompt":"Board update"}),
                "member-token",
            ))
            .await
            .unwrap();
        let created = json_body(created).await;
        let id = created["id"].as_str().unwrap();
        assert_eq!(
            sqlx::query_scalar::<_, String>("SELECT user_id FROM jobs WHERE id=?")
                .bind(id)
                .fetch_one(&db)
                .await
                .unwrap(),
            "member"
        );

        let own = app
            .clone()
            .oneshot(get_auth("/api/v1/jobs", "member-token"))
            .await
            .unwrap();
        assert_eq!(own.status(), StatusCode::OK);
        assert_eq!(json_body(own).await["jobs"][0]["prompt"], "Board update");

        let now = Utc::now().to_rfc3339();
        sqlx::query("INSERT INTO waitlist_entries (id,email,source,locale,created_at,updated_at) VALUES (?,?,?,?,?,?)")
            .bind("lead-1").bind("lead@example.com").bind("generator").bind("zh-CN").bind(&now).bind(&now).execute(&db).await.unwrap();

        let anonymous = app
            .clone()
            .oneshot(
                Request::builder()
                    .uri("/api/v1/admin/jobs")
                    .body(Body::empty())
                    .unwrap(),
            )
            .await
            .unwrap();
        assert_eq!(anonymous.status(), StatusCode::UNAUTHORIZED);
        let member = app
            .clone()
            .oneshot(get_auth("/api/v1/admin/jobs", "member-token"))
            .await
            .unwrap();
        assert_eq!(member.status(), StatusCode::FORBIDDEN);
        let admin_jobs = app
            .clone()
            .oneshot(get_auth("/api/v1/admin/jobs", "admin-token"))
            .await
            .unwrap();
        assert_eq!(admin_jobs.status(), StatusCode::OK);
        assert_eq!(
            json_body(admin_jobs).await["jobs"][0]["user_email"],
            "member@example.com"
        );
        let candidates = app
            .clone()
            .oneshot(get_auth("/api/v1/admin/waitlist", "admin-token"))
            .await
            .unwrap();
        assert_eq!(candidates.status(), StatusCode::OK);
        assert_eq!(
            json_body(candidates).await["entries"][0]["email"],
            "lead@example.com"
        );
        let account = app
            .oneshot(get_auth("/api/v1/auth/me", "admin-token"))
            .await
            .unwrap();
        assert_eq!(account.status(), StatusCode::OK);
        assert_eq!(json_body(account).await["is_admin"], true);
    }

    #[tokio::test]
    async fn feature_flags_are_reported_and_enforced() {
        let (task_app, task_db) = test_app_with_waitlist(false).await;
        add_user(&task_db, "task-user", "task@example.com", "task-token").await;
        let features = task_app
            .clone()
            .oneshot(
                Request::builder()
                    .uri("/api/v1/features")
                    .body(Body::empty())
                    .unwrap(),
            )
            .await
            .unwrap();
        let body = json_body(features).await;
        assert_eq!(body["task_submission"], true);
        assert_eq!(body["waitlist"], false);
        let job = task_app
            .clone()
            .oneshot(post_auth(
                "/api/v1/jobs",
                json!({"prompt":"Enabled"}),
                "task-token",
            ))
            .await
            .unwrap();
        assert_eq!(job.status(), StatusCode::CREATED);
        let waitlist = task_app
            .oneshot(post(
                "/api/v1/waitlist",
                json!({"email":"task@example.com"}),
            ))
            .await
            .unwrap();
        assert_eq!(waitlist.status(), StatusCode::SERVICE_UNAVAILABLE);

        let (waitlist_app, waitlist_db) = test_app_with_waitlist(true).await;
        add_user(&waitlist_db, "wait-user", "wait@example.com", "wait-token").await;
        let features = waitlist_app
            .clone()
            .oneshot(
                Request::builder()
                    .uri("/api/v1/features")
                    .body(Body::empty())
                    .unwrap(),
            )
            .await
            .unwrap();
        let body = json_body(features).await;
        assert_eq!(body["task_submission"], false);
        assert_eq!(body["waitlist"], true);
        let job = waitlist_app
            .clone()
            .oneshot(post_auth(
                "/api/v1/jobs",
                json!({"prompt":"Disabled"}),
                "wait-token",
            ))
            .await
            .unwrap();
        assert_eq!(job.status(), StatusCode::SERVICE_UNAVAILABLE);
        let waitlist = waitlist_app
            .oneshot(post(
                "/api/v1/waitlist",
                json!({"email":"candidate@example.com"}),
            ))
            .await
            .unwrap();
        assert_eq!(waitlist.status(), StatusCode::OK);
    }

    #[tokio::test]
    async fn signup_is_explicit_and_rejects_duplicate_email() {
        let (app, db) = test_app().await;
        let unknown = app
            .clone()
            .oneshot(post(
                "/api/v1/auth/verify-code",
                json!({"email":"new@example.com","code":"123456"}),
            ))
            .await
            .unwrap();
        assert_eq!(unknown.status(), StatusCode::NOT_FOUND);
        let now = Utc::now();
        let hash = token_hash("new@example.com:signup:123456:test-pepper");
        sqlx::query("INSERT INTO email_codes (id,email,code_hash,expires_at,created_at,purpose) VALUES (?,?,?,?,?,?)")
            .bind("signup-code").bind("new@example.com").bind(hash).bind((now + Duration::minutes(10)).to_rfc3339()).bind(now.to_rfc3339()).bind("signup").execute(&db).await.unwrap();
        let registered = app
            .clone()
            .oneshot(post(
                "/api/v1/auth/signup/verify-code",
                json!({"email":"new@example.com","code":"123456"}),
            ))
            .await
            .unwrap();
        assert_eq!(registered.status(), StatusCode::OK);
        let registered = json_body(registered).await;
        assert_eq!(registered["user"]["email"], "new@example.com");
        assert_eq!(registered["password_set"], false);
        let duplicate = app
            .oneshot(post(
                "/api/v1/auth/signup/verify-code",
                json!({"email":"new@example.com","code":"123456"}),
            ))
            .await
            .unwrap();
        assert_eq!(duplicate.status(), StatusCode::CONFLICT);
    }

    #[tokio::test]
    async fn password_set_login_and_change_flow() {
        let (app, db) = test_app().await;
        let now = Utc::now().to_rfc3339();
        sqlx::query("INSERT INTO users (id,email,email_verified_at,created_at,updated_at) VALUES (?,?,?,?,?)")
            .bind("user-1").bind("user@example.com").bind(&now).bind(&now).bind(&now).execute(&db).await.unwrap();
        sqlx::query("INSERT INTO sessions (id,user_id,token_hash,expires_at,created_at,last_seen_at) VALUES (?,?,?,?,?,?)")
            .bind("session-1").bind("user-1").bind(token_hash("session-token")).bind((Utc::now()+Duration::days(1)).to_rfc3339()).bind(&now).bind(&now).execute(&db).await.unwrap();
        let short = app
            .clone()
            .oneshot(
                Request::builder()
                    .method("POST")
                    .uri("/api/v1/auth/password")
                    .header(header::AUTHORIZATION, "Bearer session-token")
                    .header(header::CONTENT_TYPE, "application/json")
                    .body(Body::from(
                        json!({"current_password":null,"new_password":"short"}).to_string(),
                    ))
                    .unwrap(),
            )
            .await
            .unwrap();
        assert_eq!(short.status(), StatusCode::BAD_REQUEST);
        let set = app
            .clone()
            .oneshot(
                Request::builder()
                    .method("POST")
                    .uri("/api/v1/auth/password")
                    .header(header::AUTHORIZATION, "Bearer session-token")
                    .header(header::CONTENT_TYPE, "application/json")
                    .body(Body::from(
                        json!({"current_password":null,"new_password":"First-password-123"})
                            .to_string(),
                    ))
                    .unwrap(),
            )
            .await
            .unwrap();
        assert_eq!(set.status(), StatusCode::OK);
        let login = app
            .clone()
            .oneshot(post(
                "/api/v1/auth/password-login",
                json!({"email":"user@example.com","password":"First-password-123"}),
            ))
            .await
            .unwrap();
        assert_eq!(login.status(), StatusCode::OK);
        assert_eq!(json_body(login).await["password_set"], true);
        let change = app.clone().oneshot(Request::builder().method("POST").uri("/api/v1/auth/password").header(header::AUTHORIZATION,"Bearer session-token").header(header::CONTENT_TYPE,"application/json").body(Body::from(json!({"current_password":"First-password-123","new_password":"Second-password-456"}).to_string())).unwrap()).await.unwrap();
        assert_eq!(change.status(), StatusCode::OK);
        let old = app
            .clone()
            .oneshot(post(
                "/api/v1/auth/password-login",
                json!({"email":"user@example.com","password":"First-password-123"}),
            ))
            .await
            .unwrap();
        assert_eq!(old.status(), StatusCode::UNAUTHORIZED);
        let current = app
            .oneshot(post(
                "/api/v1/auth/password-login",
                json!({"email":"user@example.com","password":"Second-password-456"}),
            ))
            .await
            .unwrap();
        assert_eq!(current.status(), StatusCode::OK);
    }
}
