# VastraSetu — MSME Side Build Specification (Phase 1)

## 1. Overview & Objectives

The **MSME Producer** is the foundational primary user of VastraSetu. They generate the core operational data upon which export buyer trust, bank green lending, and government compliance monitoring depend. 

This document defines the **Phase 1 MSME Build Specification** covering all 7 core pages, end-to-end data flows, priority tiers, database schemas, and existing UI route mappings.

---

## 2. Page Breakdown (Build Order & UI Flow)

```
[Page 1: Onboarding / Auth]
          │
          ▼
[Page 2: Document Upload] ◄──► [Page 3: DPI Verification Engine (Backend Mock)]
          │
          ▼ (All Docs Verified)
[Page 4: Passport Generation & Status]
          │
          ▼
┌─────────┴──────────────────────────────────────────────┐
│                                                        │
▼                                                        ▼
[Page 5: Passport History]            [Page 6: Trust Score & Compliance Copilot]
                                                         │
                                                         ▼
                                      [Page 7: Green Growth Twin Dashboard]
```

### Page 1 — Onboarding / Registration (`/onboarding` or Modal)
- **Purpose:** Creates the MSME's identity and factory base profile that every subsequent document, batch, and DPP links back to.
- **Fields:** Business Name, GSTIN (e.g. `33AAAAA0000A1Z5`), Industrial Sector (Textiles/Dyeing/Garments), Factory Address (Tiruppur Hub), Authorized Contact Person, Email/Password Credentials.

### Page 2 — Document Upload (`/upload` / step inside `/create-batch`)
- **Uploads Required:**
  1. **GST Invoice** (Proof of raw material/yarn procurement)
  2. **TNEB Electricity Bill** (Tamil Nadu Electricity Board - energy consumption proof)
  3. **CETP Effluent Report** (Common Effluent Treatment Plant - wastewater parameters)
  4. **PCB Certificate** (Pollution Control Board - environmental operating consent)
- **Behavior & Status:**
  - Status pipeline: `Not Uploaded → Uploaded → Verifying → Verified / Failed`
  - Automated field extraction (OCR) with manual correction fallback form.
  - "Generate Passport" button activates **only** when all 4 required documents reach `Verified` status.

### Page 3 — DPI Verification (Backend Service / Status Badges)
- **What happens:** Extracted document fields are dispatched to a verification engine (mocked API for GSTN, TNEB, and PCB source registries).
- **Output:** `Pass/Fail` status + unique `DPI Verification Reference ID` (e.g. `DPI-GST-2026-8891`).
- **UI Element:** Rendered as live status pill indicators on Page 2 (no separate screen needed).

### Page 4 — Passport Generation & Status (`/create-batch` / `/batch/:id`)
- **Shows:**
  - Production batch metadata (Garment Type, Order Quantity, Color/Dye details).
  - One-click **Generate Digital Product Passport** action.
  - Generated Passport ID, SHA-256 Hash, and downloadable/printable **QR Code**.
  - Lifecycle state: `Draft → Verified → Anchored on Blockchain`.
- **Backend Mechanics:** Passport hash is added to the active batch's **Merkle Tree**. Upon batch closure, the **Merkle Root** is anchored to Polygon.

### Page 5 — Passport History (`/batches`)
- **Shows:** Searchable/filterable list of all generated DPPs for this MSME:
  - Batch ID & Product Name
  - Generation Date
  - Verification Status Badge (`Anchored on Polygon`)
  - Trust Score at generation time
  - Interactive QR Code modal & printable hangtag link

### Page 6 — Trust Score & Compliance (`/compliance` or integrated tab)
- **Shows:**
  - **Overall Trust Score (0–100):** Built from Document Verification Depth (30%), Certificate Validity (25%), Energy Metrics (25%), and Supply Chain Traceability (20%).
  - **Compliance Checklist:** Document checklist vs uploaded records.
  - **AI Compliance Copilot:** Warning banners for expiring certificates (e.g. *"PCB Consent expires in 14 days — renew now to prevent export blockage"*).

### Page 7 — Green Growth Twin Dashboard (`/analytics`)
- **Shows:**
  - **Monthly Operational Trends:** 6-month historical table/chart for Electricity (kWh), Water (L), Production (Pcs), and Carbon Footprint (kg CO₂e).
  - **Predictive Trend Line:** Simple linear regression forecasting next month's emissions.
  - **Actionable Recommendations:** Rule-based AI tips (e.g. *"Electricity usage +12% ➔ Inspect dye house pumps for 7% carbon reduction"*).
  - **What-If Sustainability Simulator:** Interactive toggle/slider (e.g. *"Add Rooftop Solar: Yes/No"*) showing instant projected drop in carbon and Trust Score jump.

---

## 3. Data Flow Architecture

```
Register / Login (MSME Account created)
     │
     ▼
Upload Operational Documents (GST, TNEB, CETP, PCB)
     │
     ▼
DPI API Verification Engine ──► Marks status (Verified / Failed per doc)
     │
     ├── If Failed/Missing ──► Highlight in AI Compliance Copilot
     │
     └── If All Verified ──► Enable "Generate Passport"
                                 │
                                 ▼
                     Calculate Carbon & Water Footprint
                                 │
                                 ▼
                     Generate Passport SHA-256 Hash
                                 │
                                 ▼
                     Append Hash to Batch Merkle Tree
                                 │
                                 ▼
                     Anchor Batch Merkle Root on Polygon
                                 │
                                 ▼
                     Generate QR Code & Passport Record
                                 │
                                 ├── Feed data to Green Growth Twin
                                 └── Recalculate MSME Trust Score (0–100)
```

---

## 4. Build Priority Order

### Tier 1: Core Loop (Must-Have First)
1. **Onboarding / Authentication & MSME Profile**
2. **Document Upload Zone + Mocked DPI Verification**
3. **Passport Generator (SHA-256 Hash + QR Code)**
4. **Merkle Tree Aggregator & Polygon Root Anchor**
5. **Passport History Dashboard**

### Tier 2: Novelty & Intelligence (Should-Have Next)
6. **Trust Score Engine (0–100 Calculation)**
7. **Compliance Checklist & AI Copilot Warning System**
8. **Green Growth Twin (Trends + Regression Prediction + Tips)**

### Tier 3: High-Impact Enhancements (Nice-to-Have Stretch)
9. **What-If Solar & Efficiency Simulator**
10. **Volume vs Electricity Fraud Detection Flag**

---

## 5. Technology Stack & Database Schemas

- **Frontend:** React, Tailwind CSS, Lucide Icons, Recharts (for GGT charts), `qrcode.react`, `canvas-confetti`.
- **Backend:** Node.js / Express (or Spring Boot/FastAPI equivalent endpoints), `crypto` module (SHA-256 & Merkle Tree math).
- **Blockchain:** Polygon Amoy testnet contract (`storeRoot`, `getRoot`) / Ethers.js integration.

### Database Schemas (JSON / Relational)

```sql
-- MSME Account & Profile
msmes (
  id VARCHAR PRIMARY KEY,
  name VARCHAR,
  gstin VARCHAR UNIQUE,
  sector VARCHAR,
  address TEXT,
  contact_email VARCHAR,
  trust_score INT DEFAULT 85
);

-- Operational Uploaded Documents
documents (
  id VARCHAR PRIMARY KEY,
  msme_id VARCHAR REFERENCES msmes(id),
  type ENUM('GST_INVOICE', 'TNEB_BILL', 'CETP_REPORT', 'PCB_CERT'),
  file_url VARCHAR,
  status ENUM('UPLOADED', 'VERIFYING', 'VERIFIED', 'FAILED'),
  dpi_ref_id VARCHAR,
  extracted_fields JSONB,
  uploaded_at TIMESTAMP
);

-- Production Passports & Batches
passports (
  id VARCHAR PRIMARY KEY,
  msme_id VARCHAR REFERENCES msmes(id),
  batch_number VARCHAR,
  product_name VARCHAR,
  quantity INT,
  passport_hash VARCHAR,
  merkle_root VARCHAR,
  merkle_proof JSONB,
  qr_code_url VARCHAR,
  status ENUM('DRAFT', 'VERIFIED', 'ANCHORED_ON_POLYGON'),
  created_at TIMESTAMP
);

-- Green Growth Twin Monthly Aggregates
monthly_metrics (
  id VARCHAR PRIMARY KEY,
  msme_id VARCHAR REFERENCES msmes(id),
  month VARCHAR, -- e.g. "2026-03"
  electricity_kwh NUMERIC,
  water_liters NUMERIC,
  production_pcs NUMERIC,
  carbon_kg_co2e NUMERIC
);
```

---

## 6. Codebase Component & Route Mapping

| Page Spec | Existing Route / Component | Action Needed |
|---|---|---|
| Page 1: Onboarding | `Navbar.jsx` / New `OnboardingModal.jsx` | Add MSME register/profile creation modal. |
| Page 2: Document Upload | [`CreateBatchPage.jsx`](file:///c:/Users/Karanjith/OneDrive/coursera-test/Attachments/Desktop/MSME/Vastra-Setu-MSME/client/src/pages/CreateBatchPage.jsx) (`CertificateUploadZone.jsx`) | Polish 4-doc upload pipeline & OCR status feedback. |
| Page 3: DPI Verification | [`server/utils/certificateVerifier.js`](file:///c:/Users/Karanjith/OneDrive/coursera-test/Attachments/Desktop/MSME/Vastra-Setu-MSME/server/utils/certificateVerifier.js) | Ensure DPI ref IDs & pass/fail statuses return cleanly. |
| Page 4: Passport Gen | [`BatchDetailPage.jsx`](file:///c:/Users/Karanjith/OneDrive/coursera-test/Attachments/Desktop/MSME/Vastra-Setu-MSME/client/src/pages/BatchDetailPage.jsx) | Display SHA-256, Merkle Proof, Polygon Root, QR code. |
| Page 5: History | [`BatchesPage.jsx`](file:///c:/Users/Karanjith/OneDrive/coursera-test/Attachments/Desktop/MSME/Vastra-Setu-MSME/client/src/pages/BatchesPage.jsx) | Render table of generated DPPs with quick QR view. |
| Page 6: Trust Score & Copilot | [`DashboardPage.jsx`](file:///c:/Users/Karanjith/OneDrive/coursera-test/Attachments/Desktop/MSME/Vastra-Setu-MSME/client/src/pages/DashboardPage.jsx) | Add Trust Score breakdown & Copilot alert feed. |
| Page 7: Green Growth Twin | [`AnalyticsPage.jsx`](file:///c:/Users/Karanjith/OneDrive/coursera-test/Attachments/Desktop/MSME/Vastra-Setu-MSME/client/src/pages/AnalyticsPage.jsx) | Add trend charts, regression line, solar simulator. |
