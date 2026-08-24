-- VastraSetu PostgreSQL Relational Schema

CREATE TABLE IF NOT EXISTS msme_accounts (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_name   VARCHAR(255) NOT NULL,
  gstin           VARCHAR(15) UNIQUE NOT NULL,
  address         TEXT NOT NULL,
  sector          VARCHAR(50) DEFAULT 'Textiles',
  contact_name    VARCHAR(100) NOT NULL,
  contact_email   VARCHAR(100) UNIQUE NOT NULL,
  contact_phone   VARCHAR(20) NOT NULL,
  password_hash   TEXT NOT NULL,
  status          VARCHAR(30) DEFAULT 'pending_verification',
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS otp_requests (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  msme_id       UUID REFERENCES msme_accounts(id) ON DELETE CASCADE,
  otp_hash      TEXT NOT NULL,
  purpose       VARCHAR(30) DEFAULT 'contact_verification',
  expires_at    TIMESTAMPTZ NOT NULL,
  is_used       BOOLEAN DEFAULT FALSE,
  created_at    TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS identity_proofs (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  msme_id             UUID REFERENCES msme_accounts(id) ON DELETE CASCADE,
  doc_type            VARCHAR(30) NOT NULL,
  storage_path        TEXT NOT NULL,
  ocr_raw_text        TEXT,
  extracted_fields    TEXT,
  ocr_confidence      DOUBLE PRECISION,
  ai_confidence       DOUBLE PRECISION,
  checksum_valid      BOOLEAN,
  cross_doc_valid     BOOLEAN,
  composite_status    VARCHAR(20) DEFAULT 'PENDING',
  rejection_reason    TEXT,
  created_at          TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS auth_sessions (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  msme_id            UUID REFERENCES msme_accounts(id) ON DELETE CASCADE,
  refresh_token_hash TEXT NOT NULL,
  device_info        VARCHAR(100),
  ip_address         VARCHAR(45),
  expires_at         TIMESTAMPTZ NOT NULL,
  created_at         TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS audit_log (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  msme_id       UUID REFERENCES msme_accounts(id) ON DELETE CASCADE,
  action        VARCHAR(100),
  action_type   VARCHAR(100),
  description   TEXT,
  ip_address    VARCHAR(45),
  user_agent    TEXT,
  timestamp     TIMESTAMPTZ DEFAULT now()
);

-- Migration safety for existing tables
ALTER TABLE audit_log ADD COLUMN IF NOT EXISTS action_type VARCHAR(100);
ALTER TABLE audit_log ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE audit_log ADD COLUMN IF NOT EXISTS user_agent TEXT;
