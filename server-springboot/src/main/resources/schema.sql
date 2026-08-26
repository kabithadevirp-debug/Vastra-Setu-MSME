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

CREATE TABLE IF NOT EXISTS vault_documents (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scope_type            VARCHAR(50) NOT NULL,
  document_type         VARCHAR(80) NOT NULL,
  title                 VARCHAR(255) NOT NULL,
  document_number       VARCHAR(100),
  issuer                VARCHAR(150),
  issue_date            VARCHAR(30),
  expiry_date           VARCHAR(30),
  file_url              TEXT,
  file_hash             VARCHAR(100),
  authenticity_status   VARCHAR(40) DEFAULT 'DOCUMENT_STRUCTURE_CHECKED',
  extracted_fields      TEXT,
  verification_details  TEXT,
  uploaded_by           VARCHAR(100) DEFAULT 'Compliance Desk',
  created_at            TIMESTAMPTZ DEFAULT now(),
  updated_at            TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS garment_batches (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_number            VARCHAR(80) UNIQUE NOT NULL,
  product_name            VARCHAR(255) NOT NULL,
  style_code              VARCHAR(80),
  quantity                INT NOT NULL,
  fabric_composition      VARCHAR(255),
  buyer_name              VARCHAR(150),
  target_country          VARCHAR(100),
  destination_port        VARCHAR(100),
  manufacturer_name       VARCHAR(150),
  manufacturer_gstin      VARCHAR(20),
  manufacturer_location   VARCHAR(150),
  journey_stages          TEXT,
  evidence_list           TEXT,
  consistency_report      TEXT,
  readiness_score         INT DEFAULT 86,
  readiness_status        VARCHAR(30) DEFAULT 'READY',
  carbon_kg_per_piece     DOUBLE PRECISION DEFAULT 2.45,
  water_litres_per_piece  DOUBLE PRECISION DEFAULT 142.0,
  water_recycled_percent  DOUBLE PRECISION DEFAULT 94.2,
  passport_version        INT DEFAULT 1,
  passport_hash           VARCHAR(100),
  merkle_root             VARCHAR(100),
  polygon_tx_hash         VARCHAR(120),
  qr_code_url             TEXT,
  status                  VARCHAR(30) DEFAULT 'PASSPORT_READY',
  created_at              TIMESTAMPTZ DEFAULT now(),
  updated_at              TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS shipment_acknowledgements (
  id                        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shipment_number           VARCHAR(80) UNIQUE NOT NULL,
  batch_number              VARCHAR(80) NOT NULL,
  passport_id               VARCHAR(80),
  receiver_name             VARCHAR(150) NOT NULL,
  receiver_email            VARCHAR(100),
  destination_country       VARCHAR(100) DEFAULT 'Germany',
  destination_port          VARCHAR(100) DEFAULT 'Hamburg Port',
  transport_mode            VARCHAR(30) DEFAULT 'SEA',
  incoterm                  VARCHAR(30) DEFAULT 'CIF',
  preferential_origin_claim BOOLEAN DEFAULT TRUE,
  lut_applicable            BOOLEAN DEFAULT TRUE,
  export_readiness_score    INT DEFAULT 92,
  readiness_breakdown       TEXT,
  document_checklist        TEXT,
  expected_quantity         INT NOT NULL,
  received_quantity         INT,
  discrepancy_difference    INT DEFAULT 0,
  confirmation_token        VARCHAR(100) UNIQUE NOT NULL,
  status                    VARCHAR(30) DEFAULT 'PENDING',
  discrepancy_remarks       TEXT,
  acknowledged_by           VARCHAR(100),
  acknowledged_at           TIMESTAMPTZ,
  created_at                TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS export_documents (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shipment_number       VARCHAR(80),
  batch_number          VARCHAR(80),
  document_type         VARCHAR(80) NOT NULL,
  category              VARCHAR(50) NOT NULL,
  title                 VARCHAR(255) NOT NULL,
  requirement_status    VARCHAR(30) DEFAULT 'REQUIRED',
  applicability_reason  TEXT,
  document_number       VARCHAR(100),
  issuer                VARCHAR(150),
  issue_date            VARCHAR(30),
  expiry_date           VARCHAR(30),
  file_url              TEXT,
  file_hash             VARCHAR(100),
  extracted_fields      TEXT,
  verification_status   VARCHAR(40) DEFAULT 'DOCUMENT_SUPPORTED',
  uploaded_by           VARCHAR(100) DEFAULT 'Exporter Documentation Team',
  created_at            TIMESTAMPTZ DEFAULT now(),
  updated_at            TIMESTAMPTZ DEFAULT now()
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

CREATE TABLE IF NOT EXISTS operational_documents (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  msme_id             UUID REFERENCES msme_accounts(id) ON DELETE CASCADE,
  doc_type            VARCHAR(40) NOT NULL,
  storage_path        TEXT NOT NULL,
  ocr_raw_text        TEXT,
  extracted_fields    TEXT,
  ocr_confidence      DOUBLE PRECISION,
  ai_confidence       DOUBLE PRECISION,
  plausibility_valid  BOOLEAN DEFAULT TRUE,
  composite_status    VARCHAR(20) DEFAULT 'PENDING',
  created_at          TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS merkle_batches (
  id                        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_id                  VARCHAR(80),
  batch_date                TIMESTAMPTZ DEFAULT now(),
  passport_ids              TEXT,
  merkle_root               VARCHAR(100),
  polygon_tx_hash           VARCHAR(120),
  polygon_contract_address  VARCHAR(120) DEFAULT '0x8891A9280192841920D91C28192819203819284F',
  status                    VARCHAR(30) DEFAULT 'OPEN',
  created_at                TIMESTAMPTZ DEFAULT now(),
  anchored_at               TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS product_passports (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  msme_id             UUID REFERENCES msme_accounts(id) ON DELETE CASCADE,
  product_name        VARCHAR(255) NOT NULL,
  batch_id            VARCHAR(80) NOT NULL,
  stage_details       TEXT,
  carbon_kg           DOUBLE PRECISION DEFAULT 2.84,
  water_litres        DOUBLE PRECISION DEFAULT 186.4,
  source_document_ids TEXT,
  passport_hash       VARCHAR(100),
  merkle_batch_id     UUID REFERENCES merkle_batches(id) ON DELETE SET NULL,
  merkle_proof        TEXT,
  status              VARCHAR(30) DEFAULT 'DRAFT',
  qr_code_url         TEXT,
  created_at          TIMESTAMPTZ DEFAULT now(),
  anchored_at         TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS dyeing_records (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_id            VARCHAR(80) NOT NULL,
  passport_id         UUID,
  dye_house           VARCHAR(150),
  recipe              VARCHAR(200),
  dye_type            VARCHAR(100),
  dye_process_name    VARCHAR(100),
  temperature_c       INT,
  oeko_tex_cert_no    VARCHAR(100),
  chemical_compliance VARCHAR(200),
  certificate_url     TEXT,
  ocr_verified        BOOLEAN DEFAULT TRUE,
  verified_by         VARCHAR(150),
  completed_at        TIMESTAMPTZ DEFAULT now(),
  created_at          TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS cetp_records (
  id                          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_id                    VARCHAR(80) NOT NULL,
  passport_id                 UUID,
  cetp_facility               VARCHAR(150),
  treatment_method            VARCHAR(150),
  zld_status                  VARCHAR(100),
  water_recycled_percent      DOUBLE PRECISION DEFAULT 94.2,
  bod_cod_reduction_percent   DOUBLE PRECISION DEFAULT 98.5,
  brine_recovery_percent      DOUBLE PRECISION DEFAULT 95.0,
  tnpcb_consent_no            VARCHAR(100),
  certificate_no              VARCHAR(100),
  certificate_url             TEXT,
  ocr_verified                BOOLEAN DEFAULT TRUE,
  verified_by                 VARCHAR(150),
  completed_at                TIMESTAMPTZ DEFAULT now(),
  created_at                  TIMESTAMPTZ DEFAULT now()
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
