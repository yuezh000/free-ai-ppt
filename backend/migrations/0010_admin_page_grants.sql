CREATE TABLE IF NOT EXISTS page_credit_grants (
    id TEXT PRIMARY KEY NOT NULL,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    admin_user_id TEXT NOT NULL REFERENCES users(id),
    pages INTEGER NOT NULL CHECK (pages BETWEEN 1 AND 1000),
    note TEXT,
    created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_page_credit_grants_user ON page_credit_grants(user_id, created_at DESC);
