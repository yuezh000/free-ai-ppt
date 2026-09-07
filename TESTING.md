# Automated tests

All project compilation and test execution runs on `aibox` in Docker.

## API tests

```bash
docker run --rm \
  -v "$PWD/backend:/src" -w /src \
  rust:1-bookworm cargo test
```

The API suite uses an in-memory SQLite database and never calls Resend. It covers task ownership and claiming, user queues, admin authorization, waitlist persistence, feature-flag enforcement, sign-up, and password authentication.

## UI tests

```bash
docker run --rm --ipc=host \
  -v "$PWD:/app" -w /app \
  mcr.microsoft.com/playwright:v1.63.0-noble \
  sh -lc "npm config set registry https://registry.npmmirror.com && npm ci && npm run test:ui"
```

`npm run test:ui` first checks that every native button has a stable `data-testid`, then runs Playwright. Browser-side API calls are intercepted with mocks, so UI tests never send email or write to the backend database.

Playwright intercepts authentication, task, feature-flag, waitlist, and admin endpoints with mock responses. It does not send email or write to the deployed API/database.
