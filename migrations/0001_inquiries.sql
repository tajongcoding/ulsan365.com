CREATE TABLE IF NOT EXISTS inquiries (
 id TEXT PRIMARY KEY, visibility TEXT NOT NULL CHECK (visibility IN ('public','private')), message TEXT NOT NULL, email TEXT, phone TEXT, contact_delete_at TEXT NOT NULL, delete_code_hash TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'received', response TEXT, published INTEGER NOT NULL DEFAULT 0, created_at TEXT NOT NULL, updated_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_inquiries_public ON inquiries (visibility,status,published,created_at DESC);
