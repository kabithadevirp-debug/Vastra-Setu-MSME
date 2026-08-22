-- PostgreSQL Schema Definition for VastraSetu Phase 1

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS msme_accounts (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_name     VARCHAR(255) NOT NULL,
  gstin             VARCHAR(15) UNIQUE NOT NULL,
  address           TEXT,
  sector            VARCHAR(100) DEFAULT 'Textiles',
  contact_name      VARCHAR(255),
  contact_email     VARCHAR(255) UNIQUE NOT NULL,
  contact_phone     VARCHAR(20),
  password_hash     TEXT NOT NULL,
  status            VARCHAR(30) NOT NULL DEFAULT 'pending_verification',
  created_at        TIMESTAMPTZ DEFAULT now(),
  updated_at        TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS identity_proofs (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  msme_id               UUID REFERENCES msme_accounts(id) ON DELETE CASCADE,
  doc_type              VARCHAR(30) NOT NULL,
  storage_path          TEXT NOT NULL,
  ocr_raw_text          TEXT,
  extracted_fields       JSONB,
  verification_status   VARCHAR(20) DEFAULT 'pending',
  rejection_reason      TEXT,
  submitted_at          TIMESTAMPTZ DEFAULT now(),
  verified_at           TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS auth_sessions (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  msme_id               UUID REFERENCES msme_accounts(id) ON DELETE CASCADE,
  refresh_token_hash    TEXT NOT NULL,
  issued_at             TIMESTAMPTZ DEFAULT now(),
  expires_at            TIMESTAMPTZ NOT NULL,
  revoked               BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS otp_requests (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  msme_id       UUID REFERENCES msme_accounts(id) ON DELETE CASCADE,
  otp_hash      TEXT NOT NULL,
  purpose       VARCHAR(30) NOT NULL,
  expires_at    TIMESTAMPTZ NOT NULL,
  used          BOOLEAN DEFAULT false,
  created_at    TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS audit_log (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  msme_id       UUID REFERENCES msme_accounts(id) ON DELETE CASCADE,
  action        VARCHAR(50) NOT NULL,
  ip_address    VARCHAR(45),
  timestamp     TIMESTAMPTZ DEFAULT now()
);
