#!/usr/bin/env bash
set -euo pipefail

project_root="/home/yue/private/freeppt"
runtime_dir="/tmp/codex"
report_file="${runtime_dir}/freeaippt-daily-template-last-message.txt"

mkdir -p "${runtime_dir}"
exec 9>"${runtime_dir}/freeaippt-daily-templates.lock"
if ! /usr/bin/flock --nonblock 9; then
  printf 'A daily template run is already in progress.\n' >&2
  exit 1
fi
rm -f "${report_file}"

if ! access_check="$(/usr/bin/python3 "${project_root}/scripts/check-vercel-access.py" 2>&1)"; then
  printf 'Vercel project access is unavailable: %s\nDAILY_TEMPLATE_RUN_STATUS: blocked\n' \
    "${access_check}" | tee "${report_file}"
  exit 0
fi

if ! worktree_dir="$("${project_root}/scripts/prepare-daily-template-worktree.sh")"; then
  printf 'Could not prepare a clean worktree from origin/main.\nDAILY_TEMPLATE_RUN_STATUS: blocked\n' \
    | tee "${report_file}"
  exit 0
fi

prompt=$(cat <<'EOF'
Use $freeaippt-daily-templates to run today's complete FreeAIPPT template research, original template creation, SEO integration, validation, production deployment, and Git publication workflow. The current directory is a fresh, detached worktree of the FreeAIPPT repository, created from the latest origin/main specifically for this run. The user explicitly requested isolation: unrelated uncommitted changes in the main checkout must be left alone and must not block this run. Read CREAT-TEMPLATE.md in this worktree; check only this worktree for changes before editing. Do not pull, reset, merge, or edit the main checkout. Make all source edits in this worktree on the VPS, then sync this worktree to aibox for Docker generation, compilation, testing, and deployment. The runner has already verified project access with the Vercel personal access token. For Vercel commands on aibox, mount /home/yue/.local/share/freeaippt-vercel read-only at /vercel-auth and use scripts/vercel-ci.sh for all Vercel build, deploy, alias, and verification commands. Team-scoped tokens may not support vercel whoami; verify project access with scripts/check-vercel-access.py instead. Do not use interactive vercel login or copy the token into the repository or temporary build directory. Never publish or push when a required check fails. After production verification, commit in this worktree and push with git push origin HEAD:main; do not force push. If the remote main advanced, stop and report instead of rebasing or overwriting. Include the complete final report required by the skill and the worktree path if unfinished. End the final report with exactly one line: DAILY_TEMPLATE_RUN_STATUS: published, no_changes, blocked, or failed. Use published only after production verification and Git push both succeed.
EOF
)

set +e
/home/yue/.local/bin/codex exec \
  --approve-for-me \
  --add-dir "${runtime_dir}" \
  --config 'sandbox_workspace_write.network_access=true' \
  --cd "${worktree_dir}" \
  --color never \
  --output-last-message "${report_file}" \
  "${prompt}"
agent_status=$?
set -e

if [[ ${agent_status} -eq 0 ]] && \
  grep -Eq '^DAILY_TEMPLATE_RUN_STATUS: (published|no_changes)$' "${report_file}" && \
  [[ -z "$(git -C "${worktree_dir}" status --porcelain --untracked-files=all)" ]]; then
  git -C "${project_root}" worktree remove "${worktree_dir}"
else
  printf 'Daily template worktree retained for review: %s\n' "${worktree_dir}" >&2
  if ! grep -q '^DAILY_TEMPLATE_RUN_STATUS:' "${report_file}" 2>/dev/null; then
    printf '\nWorktree retained for review: %s\nDAILY_TEMPLATE_RUN_STATUS: failed\n' \
      "${worktree_dir}" >>"${report_file}"
  fi
fi

exit "${agent_status}"
