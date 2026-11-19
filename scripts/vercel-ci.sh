#!/usr/bin/env bash
set -euo pipefail

token_file="${VERCEL_TOKEN_FILE:-/vercel-auth/token}"
if [[ ! -r "${token_file}" ]]; then
  echo "Vercel CI token is missing: ${token_file}" >&2
  exit 1
fi

token="$(tr -d '\r\n' < "${token_file}")"
if [[ ! "${token}" =~ ^vcp_[A-Za-z0-9_-]+$ ]]; then
  echo "Vercel CI token must be a personal access token (vcp_ prefix)." >&2
  exit 1
fi

export NO_COLOR=1
export npm_config_loglevel=error
exec npx --yes vercel@65.15.0 "$@" --token "${token}"
