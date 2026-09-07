CREATE TABLE IF NOT EXISTS waitlist_entries (
    id TEXT PRIMARY KEY NOT NULL,
    email TEXT NOT NULL UNIQUE COLLATE NOCASE,
    source TEXT NOT NULL,
    locale TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_waitlist_entries_created
ON waitlist_entries(created_at DESC);
