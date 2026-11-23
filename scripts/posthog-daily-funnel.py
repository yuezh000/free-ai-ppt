#!/usr/bin/env python3
"""Summarize the FreeAIPPT visitor-to-purchase-click funnel from PostHog."""

from __future__ import annotations

import argparse
import json
import os
import time
import uuid
from collections import defaultdict
from dataclasses import dataclass
from datetime import date, datetime, time as midnight, timedelta, timezone
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen
from zoneinfo import ZoneInfo


PROJECT_ID = 593673
API_URL = f"https://us.posthog.com/api/projects/{PROJECT_ID}/query/"
TOKEN_FILE = Path(
    os.environ.get(
        "FREEAIPPT_POSTHOG_TOKEN_FILE", "/home/yue/.local/share/freeaippt-posthog/token"
    )
)
SITE_URL = "https://freeaippt.space"
TIME_ZONE = ZoneInfo("Asia/Shanghai")
STEPS = (
    "$pageview",
    "signup_completed",
    "deck_task_submitted",
    "pricing_page_viewed",
    "pricing_payment_clicked",
)
STEP_LABELS = ("UV", "注册", "试用受理", "价格页", "购买点击")
PAGE_SIZE = 2000
MAX_EVENTS = 100_000


@dataclass(frozen=True)
class FunnelEvent:
    timestamp: datetime
    event_id: str
    name: str
    person_id: str
    payment_status: str | None = None


def local_midnight(day: date) -> datetime:
    return datetime.combine(day, midnight.min, TIME_ZONE).astimezone(timezone.utc)


def hogql_time(value: datetime) -> str:
    return value.astimezone(timezone.utc).strftime("%Y-%m-%d %H:%M:%S.%f")


def fetch_events(start: datetime, end: datetime, token: str) -> list[FunnelEvent]:
    events: list[FunnelEvent] = []
    cursor: tuple[datetime, str] | None = None
    names = ",".join(f"'{name}'" for name in STEPS)
    for _ in range(MAX_EVENTS // PAGE_SIZE + 1):
        after = ""
        if cursor is not None:
            stamp, event_id = cursor
            after = (
                f"AND (timestamp > toDateTime64('{hogql_time(stamp)}',6,'UTC') "
                f"OR (timestamp = toDateTime64('{hogql_time(stamp)}',6,'UTC') "
                f"AND uuid > toUUID('{event_id}')))"
            )
        query = f"""
            SELECT timestamp, uuid, event, person_id, distinct_id, properties['payment_status']
            FROM events
            WHERE timestamp >= toDateTime64('{hogql_time(start)}',6,'UTC')
              AND timestamp < toDateTime64('{hogql_time(end)}',6,'UTC')
              AND event IN ({names})
              AND (properties['$current_url'] = '{SITE_URL}'
                   OR startsWith(properties['$current_url'], '{SITE_URL}/'))
              {after}
            ORDER BY timestamp, uuid
            LIMIT {PAGE_SIZE}
        """
        payload = json.dumps({"query": {"kind": "HogQLQuery", "query": query}}).encode()
        request = Request(
            API_URL,
            data=payload,
            headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json"},
            method="POST",
        )
        for attempt in range(3):
            try:
                with urlopen(request, timeout=45) as response:
                    rows = json.load(response)["results"]
                break
            except HTTPError as error:
                if error.code not in (429, 500, 502, 503, 504) or attempt == 2:
                    raise RuntimeError(f"PostHog query failed: HTTP {error.code}") from error
            except (URLError, TimeoutError) as error:
                if attempt == 2:
                    raise RuntimeError(f"PostHog query failed: {type(error).__name__}") from error
            time.sleep(2 ** attempt)
        if not rows:
            return events
        for row in rows:
            timestamp = datetime.fromisoformat(row[0].replace("Z", "+00:00"))
            event_id = str(uuid.UUID(row[1]))
            if not (row[3] or row[4]):
                raise RuntimeError("PostHog returned an event without a visitor identity")
            person_id = str(row[3] or row[4])
            events.append(FunnelEvent(timestamp, event_id, row[2], person_id, row[5]))
        next_cursor = (events[-1].timestamp, events[-1].event_id)
        if cursor is not None and next_cursor <= cursor:
            raise RuntimeError("PostHog pagination did not advance")
        cursor = next_cursor
        if len(rows) < PAGE_SIZE:
            return events
    raise RuntimeError(f"PostHog returned more than {MAX_EVENTS} events; report withheld")


def summarize(events: list[FunnelEvent], start: datetime, end: datetime) -> dict:
    selected = sorted(
        (event for event in events if start <= event.timestamp < end),
        key=lambda event: (event.timestamp, event.event_id),
    )
    activity: dict[str, set[str]] = {name: set() for name in STEPS}
    by_person: dict[str, list[str]] = defaultdict(list)
    for event in selected:
        activity[event.name].add(event.person_id)
        by_person[event.person_id].append(event.name)

    reached = [0] * len(STEPS)
    for names in by_person.values():
        next_step = 0
        for name in names:
            if name == STEPS[next_step]:
                next_step += 1
                if next_step == len(STEPS):
                    break
        for index in range(next_step):
            reached[index] += 1

    return {
        "activity_users": [len(activity[name]) for name in STEPS],
        "ordered_users": reached,
        "events_scanned": len(selected),
    }


def path(values: list[int]) -> str:
    return " → ".join(str(value) for value in values)


def rate(numerator: int, denominator: int) -> str:
    return "—" if denominator == 0 else f"{100 * numerator / denominator:.1f}%"


def render(report: dict) -> str:
    day = report["day"]
    week = report["last_7_days"]
    previous = report["previous_7_days"]
    ordered = week["ordered_users"]
    step_rates = "，".join(
        f"{STEP_LABELS[i + 1]}/{STEP_LABELS[i]} {rate(ordered[i + 1], ordered[i])}"
        for i in range(len(STEPS) - 1)
    )
    losses = [(ordered[i] - ordered[i + 1], i) for i in range(len(STEPS) - 1)]
    largest_loss, largest_index = max(losses)
    if ordered[0] == 0:
        observation = "近7日没有可观测的站点 UV，无法判断漏斗流失。"
    elif largest_loss == 0:
        observation = "近7日有序漏斗未观察到阶段流失。"
    else:
        observation = (
            f"近7日最大流失：{STEP_LABELS[largest_index]}→{STEP_LABELS[largest_index + 1]}，"
            f"减少 {largest_loss} 人，阶段转化率 {rate(ordered[largest_index + 1], ordered[largest_index])}。"
        )
    return "\n".join(
        [
            f"PostHog 漏斗日报｜{report['date']}（北京时间，生产域名）",
            f"阶段：{' → '.join(STEP_LABELS)}",
            f"昨日独立人数：{path(day['activity_users'])}",
            f"昨日同用户有序：{path(day['ordered_users'])}",
            f"近7日同用户有序：{path(ordered)}；总转化 {rate(ordered[-1], ordered[0])}",
            f"近7日阶段转化：{step_rates}",
            f"前7日同用户有序：{path(previous['ordered_users'])}",
            f"较前7日人数变化：UV {ordered[0] - previous['ordered_users'][0]:+d}，注册 {ordered[1] - previous['ordered_users'][1]:+d}，试用 {ordered[2] - previous['ordered_users'][2]:+d}，价格页 {ordered[3] - previous['ordered_users'][3]:+d}，购买点击 {ordered[4] - previous['ordered_users'][4]:+d}",
            f"近7日独立人数：{path(week['activity_users'])}",
            observation,
            "口径：同窗口内按 person_id 和事件时间排序；试用受理=生成任务提交成功（未区分赠送额度）；购买点击仅表示意愿，当前付款仍为 coming_soon；未标记的线上测试流量也会计入。",
        ]
    )


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--date", type=date.fromisoformat, help="completed Asia/Shanghai calendar day")
    parser.add_argument("--output", type=Path, help="aggregate JSON report path")
    args = parser.parse_args()
    report_date = args.date or (datetime.now(TIME_ZONE).date() - timedelta(days=1))
    end = local_midnight(report_date + timedelta(days=1))
    day_start = local_midnight(report_date)
    week_start = local_midnight(report_date - timedelta(days=6))
    previous_start = local_midnight(report_date - timedelta(days=13))
    try:
        token = TOKEN_FILE.read_text(encoding="utf-8").strip()
        if not token.startswith("phx_"):
            raise RuntimeError("a PostHog personal API key is required")
        events = fetch_events(previous_start, end, token)
    except (OSError, RuntimeError, ValueError, KeyError) as error:
        print(f"PostHog analysis failed: {error}")
        return 1

    report = {
        "date": report_date.isoformat(),
        "timezone": "Asia/Shanghai",
        "site": SITE_URL,
        "stages": list(STEP_LABELS),
        "event_names": list(STEPS),
        "day": summarize(events, day_start, end),
        "last_7_days": summarize(events, week_start, end),
        "previous_7_days": summarize(events, previous_start, week_start),
    }
    output = args.output or Path(f"/tmp/codex/freeaippt-posthog-{report_date.isoformat()}.json")
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(render(report))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
