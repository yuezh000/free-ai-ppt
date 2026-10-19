ALTER TABLE jobs ADD COLUMN upstream_provider TEXT;
ALTER TABLE jobs ADD COLUMN upstream_workflow_id TEXT;
ALTER TABLE jobs ADD COLUMN upstream_task_id TEXT;
ALTER TABLE jobs ADD COLUMN upstream_status TEXT;

CREATE INDEX IF NOT EXISTS idx_jobs_upstream_workflow
ON jobs(upstream_provider, upstream_workflow_id);
