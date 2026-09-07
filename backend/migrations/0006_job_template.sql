ALTER TABLE jobs ADD COLUMN template_slug TEXT;

CREATE INDEX IF NOT EXISTS idx_jobs_template
ON jobs(template_slug, created_at DESC);
