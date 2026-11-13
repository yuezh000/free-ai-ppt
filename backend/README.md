# FreeAIPPT API

The Rust API stores authentication, generation tasks, attachment metadata, and trial candidates in SQLite. File bodies live in a private Vercel Blob store and never pass through this API.

## Direct file flow

- A browser creates a job, then calls `POST /api/v1/jobs/:id/files/authorize` for each attachment.
- The API authenticates the job, reserves an exact Blob pathname, and returns a private, size/type-scoped PUT URL valid for 15 minutes.
- The browser uploads directly to Vercel Blob and calls `POST /api/v1/jobs/:id/files` with only the reservation ID and Blob URL.
- The API verifies the object with Blob metadata before recording it in SQLite.
- Downloads return a private GET URL valid for 10 minutes. The file is served by Blob, not by the API.
- A PPT agent uses the same pattern through `POST /api/v1/agent/jobs/:id/outputs/:kind/authorize` and completes the job with JSON metadata.
- The WisPaper worker polls the queue, creates or resumes an upstream Universal Agent workflow, renews the job lease, and uploads both final artifacts directly to Blob.

## Page allowance

- Each account receives 10 free generated slides in total. Historical jobs created before the page allowance migration do not consume it.
- The generator can prepend a selected count to the brief. Otherwise, the API infers a requested slide count from an explicit count in the brief (for example, `6 slides` or `六页`). Without an explicit count, a short brief gets 6 slides, a medium brief 8, and a long brief 10. The worker asks WisPaper for exactly that many slides in both output formats.
- Pages are reserved when a job enters the queue. A failed job releases its reservation. A second submission is checked atomically so concurrent requests cannot exceed the account's allowance.
- A signed-in user may retry a failed task with the same brief, template, and attachments. Retry reserves its pages again, resets attempts and upstream workflow state, and starts a new generation run.
- Administrators may grant additional pages to a registered account. Each grant records the administrator, page count, optional note, and time. The allowance endpoint includes these grants in `total` and `remaining`.
- Paid page credits are not available until payments launch. The API returns HTTP 402 when the remaining allowance is insufficient. Pricing is $1 per 10 pages, $8 per 100 pages (20% off), or $15 per 250 pages (40% off).

`BLOB_READ_WRITE_TOKEN` is server-only. Never expose it to the frontend or an agent. The returned upload/download URLs are restricted to one pathname and one operation.

## Feature flags

- `WAITLIST=true`: enables trial registration and disables task submission.
- `WAITLIST=false`: disables trial registration and enables authenticated task submission.
- `ADMIN_EMAILS`: comma-separated, case-insensitive emails allowed to call `/api/v1/admin/*`.

The public `GET /api/v1/features` endpoint derives and returns both capabilities for the static frontend. The write endpoints enforce the same mutually exclusive mode, so hiding a frontend control cannot bypass it.

## User endpoints

- `POST /api/v1/jobs`: create a task owned by the signed-in user, optionally with `template_slug`.
- `POST /api/v1/jobs/:id/files/authorize`: authorize one direct Blob attachment upload.
- `POST /api/v1/jobs/:id/files`: register a completed direct upload using the returned reservation ID.
- `POST /api/v1/jobs/:id/submit`: make the task claimable by a presentation agent.
- `POST /api/v1/jobs/:id/retry`: requeue an owned failed task when enough pages remain.
- `GET /api/v1/jobs`: list the signed-in user's tasks.
- `GET /api/v1/account/allowance`: return the account's total, used, and remaining pages.
- Worker error details are omitted from user task responses and remain visible in `GET /api/v1/admin/jobs`.
- `GET /api/v1/jobs/:id/downloads/:kind`: get a short-lived direct Blob download URL for a completed `pptx` or `html` result.
- `POST /api/v1/waitlist`: register or refresh a trial candidate by email.
- `GET /api/v1/auth/me`: return the current account and server-authoritative administrator flag.

## Admin endpoints

These endpoints require a valid user bearer token whose email is in `ADMIN_EMAILS`:

- `GET /api/v1/admin/jobs`
- `GET /api/v1/admin/waitlist`
- `GET /api/v1/admin/users?q=member&page=1`: search registered email addresses; results are paginated 50 per page.
- `POST /api/v1/admin/users/:id/page-grants`: add 1–1000 pages with an optional `note`; grants are recorded in the database.

## WisPaper generation worker

The `wispaper_worker` binary is the queue consumer. It authenticates with WisPaper, claims one ready FreeAIPPT job at a time, uploads user attachments and the selected template, requests an editable PPTX plus a self-contained HTML presentation, then registers both outputs through the API's signed Blob flow. It consumes the WisPaper activity SSE stream and treats the final `result` plus `file_card` events as authoritative; activity-history polling recovers missed events after a disconnect. A previously registered `upstream_workflow_id` is resumed after a lease recovery so the worker does not create a duplicate WisPaper run.

Agent-only endpoints used by the worker:

- `POST /api/v1/agent/jobs/claim`
- `POST /api/v1/agent/jobs/:id/upstream`
- `POST /api/v1/agent/jobs/:id/heartbeat`
- `POST /api/v1/agent/jobs/:id/outputs/:kind/authorize`
- `POST /api/v1/agent/jobs/:id/complete`
- `POST /api/v1/agent/jobs/:id/fail`

Copy `wispaper-worker.env.example` to `/etc/freeppt-wispaper-worker.env`, set mode `0600`, and fill the credentials and queue API token. Do not expose this file to the frontend or commit it. `FREEPPT_AGENT_API_TOKEN` must equal the API service's `AGENT_API_TOKEN`. Use `cargo run --bin wispaper_worker -- --once` for a one-poll health check. The production service definition is in `deploy/freeppt-wispaper-worker.service`.
