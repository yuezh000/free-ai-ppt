ALTER TABLE job_inputs ADD COLUMN etag TEXT;
ALTER TABLE job_outputs ADD COLUMN etag TEXT;

CREATE TABLE IF NOT EXISTS blob_upload_reservations (
    id TEXT PRIMARY KEY NOT NULL,
    job_id TEXT NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    purpose TEXT NOT NULL CHECK (purpose IN ('input', 'output')),
    kind TEXT CHECK (kind IS NULL OR kind IN ('pptx', 'html')),
    original_name TEXT NOT NULL,
    pathname TEXT NOT NULL UNIQUE,
    content_type TEXT NOT NULL,
    maximum_size_bytes INTEGER NOT NULL,
    expires_at TEXT NOT NULL,
    completed_at TEXT,
    created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_blob_upload_reservations_job
ON blob_upload_reservations(job_id, purpose, created_at);

CREATE INDEX IF NOT EXISTS idx_blob_upload_reservations_expiry
ON blob_upload_reservations(completed_at, expires_at);
