-- Historical jobs predate page metering and do not consume the new free allowance.
ALTER TABLE jobs ADD COLUMN requested_slides INTEGER NOT NULL DEFAULT 0 CHECK (requested_slides BETWEEN 0 AND 100);

CREATE INDEX IF NOT EXISTS idx_jobs_user_allowance ON jobs(user_id, ready_at, status);
