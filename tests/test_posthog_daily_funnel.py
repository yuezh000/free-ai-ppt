"""Check ordered funnel counting without calling PostHog."""

from __future__ import annotations

import importlib.util
import sys
import unittest
from datetime import date, datetime, timedelta, timezone
from pathlib import Path


SCRIPT = Path(__file__).resolve().parents[1] / "scripts/posthog-daily-funnel.py"
SPEC = importlib.util.spec_from_file_location("posthog_daily_funnel", SCRIPT)
assert SPEC and SPEC.loader
funnel = importlib.util.module_from_spec(SPEC)
sys.modules[SPEC.name] = funnel
SPEC.loader.exec_module(funnel)


class FunnelCountingTest(unittest.TestCase):
    def test_china_calendar_day_uses_utc_plus_eight(self) -> None:
        self.assertEqual(
            funnel.local_midnight(date(2026, 11, 22)),
            datetime(2026, 11, 21, 16, tzinfo=timezone.utc),
        )

    def test_counts_repeated_and_out_of_order_events_by_person(self) -> None:
        start = datetime(2026, 11, 22, tzinfo=timezone.utc)
        names = funnel.STEPS
        sequence = [
            ("a", names[0]), ("a", names[1]), ("a", names[2]),
            ("a", names[3]), ("a", names[4]),
            ("b", names[0]), ("b", names[3]), ("b", names[1]),
            ("b", names[2]), ("b", names[3]), ("b", names[4]),
            ("c", names[0]), ("c", names[2]), ("c", names[1]),
            ("c", names[3]), ("c", names[4]),
            ("d", names[1]), ("d", names[2]), ("d", names[3]), ("d", names[4]),
        ]
        events = [
            funnel.FunnelEvent(start + timedelta(seconds=index), f"{index:032x}", name, person)
            for index, (person, name) in enumerate(sequence)
        ]
        result = funnel.summarize(events, start, start + timedelta(days=1))
        self.assertEqual(result["activity_users"], [3, 4, 4, 4, 4])
        self.assertEqual(result["ordered_users"], [3, 3, 2, 2, 2])

    def test_window_excludes_events_outside_completed_day(self) -> None:
        start = datetime(2026, 11, 22, tzinfo=timezone.utc)
        events = [
            funnel.FunnelEvent(start - timedelta(seconds=1), "0" * 32, funnel.STEPS[0], "a"),
            funnel.FunnelEvent(start, "1" * 32, funnel.STEPS[1], "a"),
        ]
        result = funnel.summarize(events, start, start + timedelta(days=1))
        self.assertEqual(result["activity_users"], [0, 1, 0, 0, 0])
        self.assertEqual(result["ordered_users"], [0, 0, 0, 0, 0])


if __name__ == "__main__":
    unittest.main()
