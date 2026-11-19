#!/usr/bin/env bash
set -euo pipefail

project_root="/home/yue/private/freeppt"
runtime_dir="/tmp/codex"
report_file="${runtime_dir}/freeaippt-daily-template-last-message.txt"

mkdir -p "${runtime_dir}"
rm -f "${report_file}"

if ! access_check="$(/usr/bin/python3 "${project_root}/scripts/check-vercel-access.py" 2>&1)"; then
  printf 'Vercel project access is unavailable: %s\nDAILY_TEMPLATE_RUN_STATUS: blocked\n' \
    "${access_check}" | tee "${report_file}"
  exit 0
fi

prompt=$(cat <<'EOF'
Use $freeaippt-daily-templates to run today's complete FreeAIPPT template research, original template creation, SEO integration, validation, production deployment, and Git publication workflow. Follow the repository instructions and CREAT-TEMPLATE.md. Stop without changing anything if the repository has unrelated uncommitted changes. The runner has already verified project access with the Vercel personal access token. For Vercel commands on aibox, mount /home/yue/.local/share/freeaippt-vercel read-only at /vercel-auth and use scripts/vercel-ci.sh for all Vercel build, deploy, alias, and verification commands. Team-scoped tokens may not support vercel whoami; verify project access with scripts/check-vercel-access.py instead. Do not use interactive vercel login or copy the token into the repository or temporary build directory. Never publish or push when a required check fails. Include the complete final report required by the skill. End the final report with exactly one line: DAILY_TEMPLATE_RUN_STATUS: published, no_changes, blocked, or failed. Use published only after production verification and Git push both succeed.
EOF
)

exec /usr/bin/flock --nonblock "${runtime_dir}/freeaippt-daily-templates.lock" \
  /home/yue/.local/bin/codex exec \
  --approve-for-me \
  --add-dir "${runtime_dir}" \
  --config 'sandbox_workspace_write.network_access=true' \
  --cd "${project_root}" \
  --color never \
  --output-last-message "${report_file}" \
  "${prompt}"
