#!/usr/bin/env bash
set -euo pipefail

project_root="/home/yue/private/freeppt"
runtime_dir="/tmp/codex"

mkdir -p "${runtime_dir}"

prompt=$(cat <<'EOF'
Use $freeaippt-daily-templates to run today's complete FreeAIPPT template research, original template creation, SEO integration, validation, production deployment, and Git publication workflow. Follow the repository instructions and CREAT-TEMPLATE.md. Stop without changing anything if the repository has unrelated uncommitted changes. Never publish or push when a required check fails. Include the complete final report required by the skill.
EOF
)

exec /usr/bin/flock --nonblock "${runtime_dir}/freeaippt-daily-templates.lock" \
  /home/yue/.local/bin/codex exec \
  --approve-for-me \
  --add-dir "${runtime_dir}" \
  --config 'sandbox_workspace_write.network_access=true' \
  --cd "${project_root}" \
  --color never \
  "${prompt}"
