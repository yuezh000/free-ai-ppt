# FreeAIPPT API

The Rust API stores authentication, generation tasks, attachment metadata, and trial candidates in SQLite. File bodies live in a private Vercel Blob store and never pass through this API.

## Direct file flow

- A browser creates a job, then calls `POST /api/v1/jobs/:id/files/authorize` for each attachment.
- The API authenticates the job, reserves an exact Blob pathname, and returns a private, size/type-scoped PUT URL valid for 15 minutes.
- The browser uploads directly to Vercel Blob and calls `POST /api/v1/jobs/:id/files` with only the reservation ID and Blob URL.
- The API verifies the object with Blob metadata before recording it in SQLite.
- Downloads return a private GET URL valid for 10 minutes. The file is served by Blob, not by the API.
- A PPT agent uses the same pattern through `POST /api/v1/agent/jobs/:id/outputs/:kind/authorize` and completes the job with JSON metadata.

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
- `GET /api/v1/jobs`: list the signed-in user's tasks.
- `GET /api/v1/jobs/:id/downloads/:kind`: get a short-lived direct Blob download URL for a completed `pptx` or `html` result.
- `POST /api/v1/waitlist`: register or refresh a trial candidate by email.
- `GET /api/v1/auth/me`: return the current account and server-authoritative administrator flag.

## Admin endpoints

Both endpoints require a valid user bearer token whose email is in `ADMIN_EMAILS`:

- `GET /api/v1/admin/jobs`
- `GET /api/v1/admin/waitlist`
