use anyhow::{Context, Result, bail};
use std::{env, time::Duration};

#[derive(Clone)]
pub struct WorkerConfig {
    pub freeppt_api_base_url: String,
    pub freeppt_agent_api_token: String,
    pub freeppt_agent_id: String,
    pub freeppt_template_base_url: String,
    pub queue_poll_interval: Duration,
    pub heartbeat_interval: Duration,
    pub wispaper_gateway_url: String,
    pub wispaper_auth_url: String,
    pub wispaper_client_id: String,
    pub wispaper_redirect_uri: String,
    pub wispaper_email: Option<String>,
    pub wispaper_password: Option<String>,
    pub wispaper_access_token: Option<String>,
    pub wispaper_language: String,
    pub wispaper_tier: String,
    pub wispaper_poll_interval: Duration,
    pub wispaper_reauth_interval: Duration,
    pub max_job_duration: Duration,
    pub max_file_bytes: usize,
}

impl WorkerConfig {
    pub fn from_env() -> Result<Self> {
        let wispaper_email = optional_env("WISPAPER_EMAIL");
        let wispaper_password = optional_env("WISPAPER_PASSWORD");
        let wispaper_access_token = optional_env("WISPAPER_ACCESS_TOKEN");
        if wispaper_access_token.is_none()
            && (wispaper_email.is_none() || wispaper_password.is_none())
        {
            bail!("set WISPAPER_ACCESS_TOKEN or both WISPAPER_EMAIL and WISPAPER_PASSWORD");
        }
        let wispaper_tier = env::var("WISPAPER_TIER").unwrap_or_else(|_| "pro".into());
        if !matches!(wispaper_tier.as_str(), "pro" | "lite") {
            bail!("WISPAPER_TIER must be pro or lite");
        }
        Ok(Self {
            freeppt_api_base_url: clean_url(required_env("FREEPPT_API_BASE_URL")?),
            freeppt_agent_api_token: required_env("FREEPPT_AGENT_API_TOKEN")?,
            freeppt_agent_id: env::var("FREEPPT_AGENT_ID")
                .unwrap_or_else(|_| "freeaippt-wispaper-worker".into()),
            freeppt_template_base_url: clean_url(
                env::var("FREEPPT_TEMPLATE_BASE_URL")
                    .unwrap_or_else(|_| "https://freeaippt.space/templates/files".into()),
            ),
            queue_poll_interval: seconds("FREEPPT_POLL_INTERVAL_SECONDS", 10)?,
            heartbeat_interval: seconds("FREEPPT_HEARTBEAT_INTERVAL_SECONDS", 60)?,
            wispaper_gateway_url: clean_url(
                env::var("WISPAPER_GATEWAY_URL")
                    .unwrap_or_else(|_| "https://gateway.wispaper.ai/api/v1".into()),
            ),
            wispaper_auth_url: clean_url(
                env::var("WISPAPER_AUTH_URL").unwrap_or_else(|_| "https://auth.wispaper.ai".into()),
            ),
            wispaper_client_id: env::var("WISPAPER_CLIENT_ID")
                .unwrap_or_else(|_| "i9au2rbqzktme4runr9gy".into()),
            wispaper_redirect_uri: env::var("WISPAPER_REDIRECT_URI")
                .unwrap_or_else(|_| "https://www.wispaper.ai/".into()),
            wispaper_email,
            wispaper_password,
            wispaper_access_token,
            wispaper_language: env::var("WISPAPER_LANGUAGE").unwrap_or_else(|_| "en".into()),
            wispaper_tier,
            wispaper_poll_interval: seconds("WISPAPER_POLL_INTERVAL_SECONDS", 15)?,
            wispaper_reauth_interval: seconds("WISPAPER_REAUTH_INTERVAL_SECONDS", 43_200)?,
            max_job_duration: seconds("WISPAPER_MAX_JOB_SECONDS", 7_200)?,
            max_file_bytes: usize_value("FREEPPT_MAX_FILE_BYTES", 104_857_600)?,
        })
    }
}

fn required_env(name: &str) -> Result<String> {
    optional_env(name).with_context(|| format!("{name} is required"))
}

fn optional_env(name: &str) -> Option<String> {
    env::var(name)
        .ok()
        .map(|value| value.trim().to_string())
        .filter(|value| !value.is_empty())
}

fn seconds(name: &str, default: u64) -> Result<Duration> {
    let value = env::var(name)
        .unwrap_or_else(|_| default.to_string())
        .parse::<u64>()
        .with_context(|| format!("invalid {name}"))?;
    if value == 0 {
        bail!("{name} must be greater than zero");
    }
    Ok(Duration::from_secs(value))
}

fn usize_value(name: &str, default: usize) -> Result<usize> {
    env::var(name)
        .unwrap_or_else(|_| default.to_string())
        .parse::<usize>()
        .with_context(|| format!("invalid {name}"))
}

fn clean_url(value: String) -> String {
    value.trim_end_matches('/').to_string()
}
