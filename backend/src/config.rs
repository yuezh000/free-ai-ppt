use anyhow::{Context, Result};
use std::{collections::HashSet, env, net::SocketAddr};

#[derive(Clone)]
pub struct Config {
    pub bind: SocketAddr,
    pub database_url: String,
    pub agent_api_token: String,
    pub frontend_origin: String,
    pub public_base_url: String,
    pub lease_seconds: i64,
    pub max_upload_bytes: usize,
    pub resend_api_key: String,
    pub resend_from: String,
    pub auth_pepper: String,
    pub admin_emails: HashSet<String>,
    pub waitlist: bool,
    pub blob_read_write_token: Option<String>,
    pub blob_store_id: Option<String>,
}

impl Config {
    pub fn from_env() -> Result<Self> {
        Ok(Self {
            bind: env::var("FREEPPT_BIND")
                .unwrap_or_else(|_| "127.0.0.1:8080".into())
                .parse()
                .context("invalid FREEPPT_BIND")?,
            database_url: env::var("DATABASE_URL")
                .unwrap_or_else(|_| "sqlite://data/freeppt.db?mode=rwc".into()),
            agent_api_token: env::var("AGENT_API_TOKEN").context("AGENT_API_TOKEN is required")?,
            frontend_origin: env::var("FRONTEND_ORIGIN")
                .unwrap_or_else(|_| "https://freeaippt.space".into()),
            public_base_url: env::var("PUBLIC_BASE_URL")
                .unwrap_or_else(|_| "https://api.freeaippt.space".into()),
            lease_seconds: env::var("CLAIM_LEASE_SECONDS")
                .unwrap_or_else(|_| "900".into())
                .parse()
                .context("invalid CLAIM_LEASE_SECONDS")?,
            max_upload_bytes: env::var("MAX_UPLOAD_BYTES")
                .unwrap_or_else(|_| "104857600".into())
                .parse()
                .context("invalid MAX_UPLOAD_BYTES")?,
            resend_api_key: env::var("RESEND_API_KEY").context("RESEND_API_KEY is required")?,
            resend_from: env::var("RESEND_FROM")
                .unwrap_or_else(|_| "FreeAIPPT <noreply@mail.freeaippt.space>".into()),
            auth_pepper: env::var("AUTH_PEPPER").context("AUTH_PEPPER is required")?,
            admin_emails: env::var("ADMIN_EMAILS")
                .unwrap_or_default()
                .split(',')
                .map(|email| email.trim().to_lowercase())
                .filter(|email| !email.is_empty())
                .collect(),
            waitlist: feature_flag("WAITLIST", true)?,
            blob_read_write_token: optional_env("BLOB_READ_WRITE_TOKEN"),
            blob_store_id: optional_env("BLOB_STORE_ID"),
        })
    }
}

fn optional_env(name: &str) -> Option<String> {
    env::var(name)
        .ok()
        .map(|value| value.trim().to_string())
        .filter(|value| !value.is_empty())
}

fn feature_flag(name: &str, default: bool) -> Result<bool> {
    let Ok(raw) = env::var(name) else {
        return Ok(default);
    };
    match raw.trim().to_lowercase().as_str() {
        "1" | "true" | "yes" | "on" => Ok(true),
        "0" | "false" | "no" | "off" => Ok(false),
        _ => anyhow::bail!("invalid {name}; expected true or false"),
    }
}
