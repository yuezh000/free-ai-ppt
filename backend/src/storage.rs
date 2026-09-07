use crate::{config::Config, error::ApiError, models::UploadAuthorization};
use chrono::{Duration, Utc};
use reqwest::Url;
use serde::{Deserialize, Serialize};
use sha2::{Digest, Sha256};
use std::collections::BTreeMap;
use uuid::Uuid;

const BLOB_API_URL: &str = "https://vercel.com/api/blob";
const BLOB_API_VERSION: &str = "12";
const UPLOAD_LIFETIME_MINUTES: i64 = 15;
const DOWNLOAD_LIFETIME_MINUTES: i64 = 10;

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct IssuedSignedToken {
    delegation_token: String,
    client_signing_token: String,
    valid_until: i64,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct BlobMetadata {
    pub size: i64,
    pub pathname: String,
    pub content_type: String,
    pub url: String,
    pub etag: String,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct SignedTokenRequest<'a> {
    pathname: &'a str,
    operations: [&'a str; 1],
    valid_until: i64,
    #[serde(skip_serializing_if = "Option::is_none")]
    allowed_content_types: Option<[&'a str; 1]>,
    #[serde(skip_serializing_if = "Option::is_none")]
    maximum_size_in_bytes: Option<i64>,
}

pub fn safe_name(name: &str) -> String {
    let cleaned: String = name
        .chars()
        .map(|character| {
            if character.is_ascii_alphanumeric() || matches!(character, '.' | '-' | '_') {
                character
            } else {
                '_'
            }
        })
        .collect();
    let cleaned = cleaned
        .trim_matches('.')
        .chars()
        .take(120)
        .collect::<String>();
    if cleaned.is_empty() {
        "attachment".into()
    } else {
        cleaned
    }
}

pub fn blob_enabled(config: &Config) -> bool {
    config.blob_read_write_token.is_some() && config.blob_store_id.is_some()
}

fn credentials(config: &Config) -> Result<(&str, &str), ApiError> {
    let token = config
        .blob_read_write_token
        .as_deref()
        .ok_or_else(|| ApiError::unavailable("file storage is not configured"))?;
    let store_id = config
        .blob_store_id
        .as_deref()
        .ok_or_else(|| ApiError::unavailable("file storage is not configured"))?;
    Ok((token, store_id.trim_start_matches("store_")))
}

async fn issue_signed_token(
    config: &Config,
    pathname: &str,
    operation: &str,
    valid_until: i64,
    content_type: Option<&str>,
    maximum_size: Option<i64>,
) -> Result<IssuedSignedToken, ApiError> {
    let (token, store_id) = credentials(config)?;
    let request_id = format!(
        "{}:{}:{}",
        store_id,
        Utc::now().timestamp_millis(),
        Uuid::new_v4()
    );
    let response = reqwest::Client::new()
        .post(format!("{BLOB_API_URL}/signed-token"))
        .bearer_auth(token)
        .header("x-vercel-blob-store-id", store_id)
        .header("x-api-version", BLOB_API_VERSION)
        .header("x-api-blob-request-id", request_id)
        .header("x-api-blob-request-attempt", "0")
        .json(&SignedTokenRequest {
            pathname,
            operations: [operation],
            valid_until,
            allowed_content_types: content_type.map(|value| [value]),
            maximum_size_in_bytes: maximum_size,
        })
        .send()
        .await
        .map_err(ApiError::internal)?;
    let status = response.status();
    if !status.is_success() {
        let excerpt: String = response
            .text()
            .await
            .unwrap_or_default()
            .chars()
            .take(500)
            .collect();
        return Err(ApiError::internal(format!(
            "Vercel Blob signed-token returned {status}: {excerpt}"
        )));
    }
    response.json().await.map_err(ApiError::internal)
}

pub async fn authorize_put(
    config: &Config,
    reservation_id: String,
    pathname: String,
    content_type: String,
    maximum_size: i64,
) -> Result<UploadAuthorization, ApiError> {
    let (_, store_id) = credentials(config)?;
    let valid_until = (Utc::now() + Duration::minutes(UPLOAD_LIFETIME_MINUTES)).timestamp_millis();
    let token = issue_signed_token(
        config,
        &pathname,
        "put",
        valid_until,
        Some(&content_type),
        Some(maximum_size),
    )
    .await?;
    let signature = sign(&token.client_signing_token, &canonical("put", &pathname));
    let mut url = Url::parse(&format!("{BLOB_API_URL}/")).map_err(ApiError::internal)?;
    url.query_pairs_mut()
        .append_pair("pathname", &pathname)
        .append_pair("vercel-blob-delegation", &token.delegation_token)
        .append_pair("vercel-blob-signature", &signature);
    let request_id = format!(
        "{}:{}:{}",
        store_id,
        Utc::now().timestamp_millis(),
        Uuid::new_v4()
    );
    let headers = BTreeMap::from([
        ("x-api-version".into(), BLOB_API_VERSION.into()),
        ("x-api-blob-request-id".into(), request_id),
        ("x-api-blob-request-attempt".into(), "0".into()),
        ("x-vercel-blob-store-id".into(), store_id.into()),
        ("x-vercel-blob-access".into(), "private".into()),
        ("x-content-type".into(), content_type),
        ("x-add-random-suffix".into(), "0".into()),
        ("x-allow-overwrite".into(), "0".into()),
    ]);
    Ok(UploadAuthorization {
        reservation_id,
        pathname,
        upload_url: url.to_string(),
        method: "PUT".into(),
        headers,
        expires_at: token.valid_until,
    })
}

pub async fn authorize_get(config: &Config, pathname: &str) -> Result<(String, i64), ApiError> {
    let (_, store_id) = credentials(config)?;
    let valid_until =
        (Utc::now() + Duration::minutes(DOWNLOAD_LIFETIME_MINUTES)).timestamp_millis();
    let token = issue_signed_token(config, pathname, "get", valid_until, None, None).await?;
    let signature = sign(&token.client_signing_token, &canonical("get", pathname));
    let mut url = Url::parse(&format!(
        "https://{store_id}.private.blob.vercel-storage.com/"
    ))
    .map_err(ApiError::internal)?;
    {
        let mut segments = url
            .path_segments_mut()
            .map_err(|_| ApiError::internal("invalid Blob URL"))?;
        segments.pop_if_empty();
        for segment in pathname.split('/') {
            segments.push(segment);
        }
    }
    url.query_pairs_mut()
        .append_pair("vercel-blob-delegation", &token.delegation_token)
        .append_pair("vercel-blob-signature", &signature);
    Ok((url.to_string(), token.valid_until))
}

pub async fn head_blob(config: &Config, blob_url: &str) -> Result<BlobMetadata, ApiError> {
    let (token, store_id) = credentials(config)?;
    validate_blob_url(blob_url, store_id)?;
    let mut url = Url::parse(BLOB_API_URL).map_err(ApiError::internal)?;
    url.query_pairs_mut().append_pair("url", blob_url);
    let response = reqwest::Client::new()
        .get(url)
        .bearer_auth(token)
        .header("x-vercel-blob-store-id", store_id)
        .header("x-api-version", BLOB_API_VERSION)
        .header(
            "x-api-blob-request-id",
            format!(
                "{}:{}:{}",
                store_id,
                Utc::now().timestamp_millis(),
                Uuid::new_v4()
            ),
        )
        .header("x-api-blob-request-attempt", "0")
        .send()
        .await
        .map_err(ApiError::internal)?;
    let status = response.status();
    if !status.is_success() {
        let excerpt: String = response
            .text()
            .await
            .unwrap_or_default()
            .chars()
            .take(500)
            .collect();
        tracing::warn!(%status, response = %excerpt, "Vercel Blob metadata verification failed");
        return Err(ApiError::bad_request("uploaded Blob could not be verified"));
    }
    let metadata: BlobMetadata = response.json().await.map_err(ApiError::internal)?;
    validate_blob_url(&metadata.url, store_id)?;
    Ok(metadata)
}

pub fn pathname_from_blob_url(config: &Config, blob_url: &str) -> Result<String, ApiError> {
    let (_, store_id) = credentials(config)?;
    let url = validate_blob_url(blob_url, store_id)?;
    Ok(url.path().trim_start_matches('/').to_string())
}

fn validate_blob_url(value: &str, store_id: &str) -> Result<Url, ApiError> {
    let url = Url::parse(value).map_err(|_| ApiError::bad_request("invalid Blob URL"))?;
    let expected_host = format!(
        "{}.private.blob.vercel-storage.com",
        store_id.to_ascii_lowercase()
    );
    if url.scheme() != "https" || url.host_str() != Some(expected_host.as_str()) {
        return Err(ApiError::bad_request(
            "Blob URL does not belong to the configured private store",
        ));
    }
    Ok(url)
}

fn canonical(operation: &str, pathname: &str) -> String {
    let mut lines = [
        format!("operation={operation}"),
        format!("pathname={pathname}"),
    ];
    lines.sort();
    lines.join("\n")
}

fn sign(key: &str, data: &str) -> String {
    base64_url(&hmac_sha256(key.as_bytes(), data.as_bytes()))
}

fn hmac_sha256(key: &[u8], data: &[u8]) -> [u8; 32] {
    const BLOCK: usize = 64;
    let mut normalized = [0u8; BLOCK];
    if key.len() > BLOCK {
        normalized[..32].copy_from_slice(&Sha256::digest(key));
    } else {
        normalized[..key.len()].copy_from_slice(key);
    }
    let mut inner_pad = [0x36u8; BLOCK];
    let mut outer_pad = [0x5cu8; BLOCK];
    for index in 0..BLOCK {
        inner_pad[index] ^= normalized[index];
        outer_pad[index] ^= normalized[index];
    }
    let mut inner = Sha256::new();
    inner.update(inner_pad);
    inner.update(data);
    let inner_hash = inner.finalize();
    let mut outer = Sha256::new();
    outer.update(outer_pad);
    outer.update(inner_hash);
    outer.finalize().into()
}

fn base64_url(bytes: &[u8]) -> String {
    const TABLE: &[u8; 64] = b"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
    let mut result = String::with_capacity((bytes.len() * 4).div_ceil(3));
    for chunk in bytes.chunks(3) {
        let value = ((chunk[0] as u32) << 16)
            | ((chunk.get(1).copied().unwrap_or(0) as u32) << 8)
            | chunk.get(2).copied().unwrap_or(0) as u32;
        result.push(TABLE[((value >> 18) & 63) as usize] as char);
        result.push(TABLE[((value >> 12) & 63) as usize] as char);
        if chunk.len() > 1 {
            result.push(TABLE[((value >> 6) & 63) as usize] as char);
        }
        if chunk.len() > 2 {
            result.push(TABLE[(value & 63) as usize] as char);
        }
    }
    result
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::{collections::HashSet, net::SocketAddr};

    #[test]
    fn hmac_matches_rfc_4231_vector() {
        let key = [0x0b; 20];
        assert_eq!(
            hex::encode(hmac_sha256(&key, b"Hi There")),
            "b0344c61d8db38535ca8afceaf0bf12b881dc200c9833da726e9376c2e32cff7"
        );
    }

    #[test]
    fn pathname_and_names_are_safe() {
        assert_eq!(safe_name("../brief 中文.pdf"), "_brief___.pdf");
        assert_eq!(
            canonical("put", "inputs/a.pdf"),
            "operation=put\npathname=inputs/a.pdf"
        );
    }

    #[tokio::test]
    #[ignore = "requires a real private Vercel Blob store"]
    async fn private_blob_signed_urls_round_trip() {
        let _ = tracing_subscriber::fmt()
            .with_env_filter("freeppt_api=debug")
            .try_init();
        let token = std::env::var("BLOB_READ_WRITE_TOKEN").expect("BLOB_READ_WRITE_TOKEN");
        let store_id = std::env::var("BLOB_STORE_ID").expect("BLOB_STORE_ID");
        let config = Config {
            bind: "127.0.0.1:0".parse::<SocketAddr>().unwrap(),
            database_url: "sqlite::memory:".into(),
            agent_api_token: "test".into(),
            frontend_origin: "http://localhost".into(),
            public_base_url: "http://localhost".into(),
            lease_seconds: 900,
            max_upload_bytes: 1024,
            resend_api_key: "test".into(),
            resend_from: "test@example.com".into(),
            auth_pepper: "test".into(),
            admin_emails: HashSet::new(),
            waitlist: false,
            blob_read_write_token: Some(token.clone()),
            blob_store_id: Some(store_id.clone()),
        };
        let reservation_id = Uuid::new_v4().to_string();
        let pathname = format!("smoke-tests/{reservation_id}/hello.txt");
        let authorization = authorize_put(
            &config,
            reservation_id,
            pathname.clone(),
            "text/plain".into(),
            5,
        )
        .await
        .unwrap();
        let mut upload = reqwest::Client::new().put(&authorization.upload_url);
        for (name, value) in &authorization.headers {
            upload = upload.header(name, value);
        }
        let response = upload.body("hello").send().await.unwrap();
        assert!(response.status().is_success(), "upload returned {}", response.status());
        let blob_url = response.json::<serde_json::Value>().await.unwrap()["url"]
            .as_str()
            .unwrap()
            .to_string();
        let metadata = head_blob(&config, &blob_url).await.unwrap();
        assert_eq!(metadata.pathname, pathname);
        assert_eq!(metadata.size, 5);
        let (download_url, _) = authorize_get(&config, &pathname).await.unwrap();
        let download = reqwest::get(download_url).await.unwrap();
        assert!(download.status().is_success());
        assert_eq!(download.bytes().await.unwrap().as_ref(), b"hello");

        let (_, bare_store_id) = credentials(&config).unwrap();
        let response = reqwest::Client::new()
            .post(format!("{BLOB_API_URL}/delete"))
            .bearer_auth(token)
            .header("x-vercel-blob-store-id", bare_store_id)
            .header("x-api-version", BLOB_API_VERSION)
            .header("content-type", "application/json")
            .json(&serde_json::json!({"urls": [blob_url]}))
            .send()
            .await
            .unwrap();
        assert!(response.status().is_success(), "cleanup returned {}", response.status());
    }
}
