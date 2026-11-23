#!/usr/bin/env python3
"""Notify the Feishu group when the daily template service finishes."""

from __future__ import annotations

import argparse
import os
import re
import subprocess
from datetime import datetime, timezone
from pathlib import Path


REPORT_FILE = Path("/tmp/codex/freeaippt-daily-template-last-message.txt")
SENDER = Path("/home/yue/.codex/skills/feishu-notify/scripts/send.py")
ANALYTICS_SCRIPT = Path(__file__).with_name("posthog-daily-funnel.py")
OUTCOMES = {
    "published": "已发布并推送",
    "no_changes": "未新增模板",
    "blocked": "执行受阻",
    "failed": "执行失败",
}


def message_for_run(
    report: str,
    service_result: str,
    exit_status: str,
    analytics_summary: str = "",
    analytics_failed: bool = False,
) -> str:
    marker = re.search(
        r"^DAILY_TEMPLATE_RUN_STATUS:\s*(published|no_changes|blocked|failed)\s*$",
        report,
        re.MULTILINE,
    )
    outcome = OUTCOMES[marker.group(1)] if marker else "未确认，请查看完整日志"
    if service_result != "success":
        outcome = "执行失败或超时"
    if analytics_failed:
        outcome += "；漏斗分析失败"

    # The agent's final answer is untrusted and can be long. Keep the notice short.
    lines = [
        line.strip()
        for line in report.splitlines()
        if line.strip() and not line.startswith("DAILY_TEMPLATE_RUN_STATUS:")
    ]
    excerpt = "\n".join(lines[:8])[:900] if lines else "未生成最终报告，请查看服务日志。"
    timestamp = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M UTC")
    message = (
        f"FreeAIPPT 每日模板任务已结束\n"
        f"时间：{timestamp}\n"
        f"结果：{outcome}\n"
        f"服务状态：{service_result or '未知'}（退出状态：{exit_status or '未知'}）\n"
        f"报告摘要：\n{excerpt}"
    )
    return f"{message}\n\n{analytics_summary}" if analytics_summary else message


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--report-file", type=Path, default=REPORT_FILE)
    parser.add_argument("--analytics-text-file", type=Path)
    args = parser.parse_args()

    try:
        report = args.report_file.read_text(encoding="utf-8")
    except OSError:
        report = ""

    analytics_failed = False
    if args.analytics_text_file is not None:
        analytics_summary = args.analytics_text_file.read_text(encoding="utf-8").strip()
    else:
        try:
            analytics = subprocess.run(
                ["/usr/bin/python3", str(ANALYTICS_SCRIPT)],
                capture_output=True,
                text=True,
                check=False,
                timeout=75,
            )
            analytics_failed = analytics.returncode != 0
            analytics_summary = analytics.stdout.strip() if not analytics_failed else (
                "PostHog 漏斗分析失败：" + (analytics.stdout.strip() or analytics.stderr.strip())[:300]
            )
        except subprocess.TimeoutExpired:
            analytics_failed = True
            analytics_summary = "PostHog 漏斗分析失败：查询超时。"

    message = message_for_run(
        report,
        os.environ.get("SERVICE_RESULT", "unknown"),
        os.environ.get("EXIT_STATUS", "unknown"),
        analytics_summary,
        analytics_failed,
    )
    command = ["/usr/bin/python3", str(SENDER), "--title", "每日模板任务"]
    if args.dry_run:
        command.append("--dry-run")
    result = subprocess.run(command, input=message, text=True, check=False)
    return result.returncode or int(analytics_failed)


if __name__ == "__main__":
    raise SystemExit(main())
