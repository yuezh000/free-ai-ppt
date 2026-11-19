#!/usr/bin/env python3
"""Verify the CI token can access this repository's linked Vercel project."""

from __future__ import annotations

import json
import os
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen


ROOT = Path(__file__).resolve().parents[1]
TOKEN_FILE = Path(
    os.environ.get(
        "FREEAIPPT_VERCEL_TOKEN_FILE", "/home/yue/.local/share/freeaippt-vercel/token"
    )
)


def main() -> int:
    try:
        token = TOKEN_FILE.read_text(encoding="utf-8").strip()
        project = json.loads((ROOT / ".vercel/project.json").read_text(encoding="utf-8"))
    except (OSError, ValueError) as error:
        print(f"Vercel access check unavailable: {type(error).__name__}")
        return 1

    if not token.startswith("vcp_"):
        print("Vercel access check failed: a personal access token is required")
        return 1

    project_id = project["projectId"]
    team_id = project["orgId"]
    url = f"https://api.vercel.com/v9/projects/{project_id}?teamId={team_id}"
    try:
        with urlopen(Request(url, headers={"Authorization": f"Bearer {token}"}), timeout=20) as response:
            data = json.load(response)
    except HTTPError as error:
        print(f"Vercel access check failed: HTTP {error.code}")
        return 1
    except (URLError, TimeoutError, ValueError) as error:
        print(f"Vercel access check failed: {type(error).__name__}")
        return 1

    if data.get("id") != project_id or data.get("name") != project.get("projectName"):
        print("Vercel access check failed: linked project mismatch")
        return 1

    print(f"Vercel project access verified: {data['name']}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
