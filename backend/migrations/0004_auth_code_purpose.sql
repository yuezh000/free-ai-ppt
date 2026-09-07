ALTER TABLE email_codes ADD COLUMN purpose TEXT NOT NULL DEFAULT 'signin'
    CHECK (purpose IN ('signin', 'signup'));

CREATE INDEX IF NOT EXISTS idx_email_codes_purpose
ON email_codes(email, purpose, created_at DESC);
