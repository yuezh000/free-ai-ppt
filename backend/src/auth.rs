use crate::{
    error::ApiError,
    models::{Job, User},
    state::AppState,
};
use axum::http::HeaderMap;
use sha2::{Digest, Sha256};

pub fn token_hash(value: &str) -> String {
    hex::encode(Sha256::digest(value.as_bytes()))
}

pub fn random_token() -> String {
    use rand::RngCore;
    let mut bytes = [0u8; 32];
    rand::rng().fill_bytes(&mut bytes);
    hex::encode(bytes)
}

pub fn require_agent(headers: &HeaderMap, state: &AppState) -> Result<(), ApiError> {
    let supplied = headers
        .get("authorization")
        .and_then(|v| v.to_str().ok())
        .and_then(|v| v.strip_prefix("Bearer "))
        .ok_or_else(ApiError::unauthorized)?;
    if token_hash(supplied) != token_hash(&state.config.agent_api_token) {
        return Err(ApiError::unauthorized());
    }
    Ok(())
}

pub async fn require_job(headers: &HeaderMap, state: &AppState, id: &str) -> Result<Job, ApiError> {
    let job = sqlx::query_as::<_, Job>("SELECT * FROM jobs WHERE id = ?")
        .bind(id)
        .fetch_optional(&state.db)
        .await?
        .ok_or_else(ApiError::not_found)?;
    if let Some(token) = headers.get("x-job-token").and_then(|v| v.to_str().ok()) {
        if token_hash(token) == job.public_token_hash {
            return Ok(job);
        }
    }
    let user = require_user(headers, state).await?;
    if job.user_id.as_deref() == Some(user.id.as_str()) {
        return Ok(job);
    }
    Err(ApiError::forbidden())
}

pub fn require_claim(headers: &HeaderMap, job: &Job) -> Result<(), ApiError> {
    let token = headers
        .get("x-claim-token")
        .and_then(|v| v.to_str().ok())
        .ok_or_else(ApiError::unauthorized)?;
    if job.claim_token_hash.as_deref() != Some(token_hash(token).as_str()) {
        return Err(ApiError::unauthorized());
    }
    Ok(())
}

pub async fn require_user(headers: &HeaderMap, state: &AppState) -> Result<User, ApiError> {
    let supplied = headers
        .get("authorization")
        .and_then(|v| v.to_str().ok())
        .and_then(|v| v.strip_prefix("Bearer "))
        .ok_or_else(ApiError::unauthorized)?;
    sqlx::query_as::<_, User>("SELECT u.* FROM sessions s JOIN users u ON u.id=s.user_id WHERE s.token_hash=? AND s.revoked_at IS NULL AND s.expires_at > ?")
        .bind(token_hash(supplied)).bind(chrono::Utc::now().to_rfc3339()).fetch_optional(&state.db).await?.ok_or_else(ApiError::unauthorized)
}

pub async fn require_admin(headers: &HeaderMap, state: &AppState) -> Result<User, ApiError> {
    let user = require_user(headers, state).await?;
    if state
        .config
        .admin_emails
        .contains(&user.email.to_lowercase())
    {
        return Ok(user);
    }
    Err(ApiError::forbidden())
}
