#!/usr/bin/env bash
set -euo pipefail

project_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
runtime_dir="/tmp/codex"
mkdir -p "${runtime_dir}"

# Refresh the remote snapshot without touching the branch or files in the main checkout.
git -C "${project_root}" fetch --no-tags origin main >&2
commit="$(git -C "${project_root}" rev-parse --verify 'FETCH_HEAD^{commit}')"
git -C "${project_root}" worktree prune

worktree_dir="${runtime_dir}/freeaippt-seo-$(date -u +%Y%m%dT%H%M%SZ)-$$"
git -C "${project_root}" worktree add --detach "${worktree_dir}" "${commit}" >&2

# Vercel's local project link is ignored by Git, so each worktree needs its own copy.
if ! install -D -m 600 "${project_root}/.vercel/project.json" \
  "${worktree_dir}/.vercel/project.json"; then
  git -C "${project_root}" worktree remove "${worktree_dir}" >&2
  exit 1
fi

printf '%s\n' "${worktree_dir}"
