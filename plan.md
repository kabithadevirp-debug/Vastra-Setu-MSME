# VastraSetu — Comprehensive Master Plan & Architecture Reference

## 1. Executive Summary & Core Pitch

**VastraSetu** is a Digital Public Infrastructure (DPI)-first, government-verified, tamper-evident Digital Product Passport (DPP) and decision-support platform engineered specifically for Textile MSME Exporters (e.g., in the Tiruppur textile hub).

By turning real operational documents (GST invoices, TNEB electricity bills, CETP effluent treatment reports, PCB certificates) into a **Living Digital Product Passport**, VastraSetu establishes instant, verifiable trust across international export buyers, green-loan providers (banks/NBFCs), and environmental regulators.

> 🎯 **The One-Line Pitch:**  
> *"VastraSetu turns an MSME's own operational documents into a government-verified, tamper-proof, continuously-updated sustainability passport — trusted equally by export buyers, banks, and regulators — without requiring new hardware or unproven infrastructure."*

---

## 2. Problem Statement & Market Context

### The MSME Reality in Tiruppur
Textile MSMEs face urgent pressure from three distinct stakeholders:
1. **Export Buyers (EU / US):** EU Digital Product Passport (DPP) regulations require verifiable proof of carbon footprint, water usage, chemical safety, and ethical sourcing before placing orders.
2. **Banks & NBFCs:** Financial institutions offer low-interest green loans and sustainability-linked credit, but lack low-cost tools to verify an MSME's ESG credentials.
3. **Government & Environmental Regulators:** Pollution control boards (PCB) and CETPs (Common Effluent Treatment Plants) struggle with manual compliance monitoring across thousands of small units.

### Existing Deficiencies
* **Document Falsification:** PDF certificates, GST invoices, and utility bills can easily be altered in minutes using desktop tools.
* **Slow & Costly Manual Audits:** Buyers and banks waste weeks manually cross-referencing documents.
* **Static Snapshots:** A PDF certificate only reflects compliance on its issue date, failing to track ongoing operational performance or expiring permits.

---

## 3. Core Architectural Concept

```
[MSME Producer] Uploads Operational Docs 
(GST Invoices, TNEB Electricity Bills, CETP Reports, PCB Certificates)
                 │
                 ▼
[Government API Verification Layer (DPI)]
  ↳ Validates authenticity against GSTN / Utility / PCB databases
                 │
                 ▼
[Living Digital Product Passport (DPP) & Trust Score (0–100)]
  ↳ Computes carbon footprint, water metrics, validity status, and overall Trust Score
                 │
                 ▼
[Blockchain Integrity Layer (Polygon + Merkle Tree)]
  ↳ Hashes passports → Builds batch Merkle Tree → Stores ONLY Merkle Root on Polygon
                 │
                 ▼
[Multi-Stakeholder Shared Trust Portals]
  ↳ Export Buyers: Scan QR → Instant anti-tamper proof & sustainability breakdown
  ↳ Banks & NBFCs: Evaluate Green Loan eligibility & ESG credit risk
  ↳ Regulators & Auditors: Monitor regional compliance & detect fraud anomalies
```

### DPI-First, Blockchain-Optional Strategy
* **Why DPI First?** Leading with Digital Public Infrastructure (verified government data via RBI-grade DPDP consent) ensures immediate real-world adoption with no expensive hardware or infrastructure changes.
* **Why Blockchain?** Used strictly as a **cryptographic integrity layer** on top of DPI. It answers the buyer question: *"How do I know this passport wasn't edited in a database yesterday?"*

---

## 4. Blockchain & Cryptographic Merkle Tree Architecture

### The Cost Challenge
Storing 100,000 garment passports per day individually on a blockchain incurs 100,000 gas transactions, making it prohibitively expensive and unscalable.

### The Merkle Tree Solution
Instead of storing every passport on-chain, VastraSetu hashes all passports in a production batch into a Merkle Tree structure and anchors **only the single Merkle Root** on the Polygon blockchain.

```
                  ┌──────────────────────────────┐
                  │    Merkle Root (On Polygon)   │
                  └──────────────┬───────────────┘
                                 │
                   ┌─────────────┴─────────────┐
                   │                           │
              Node AB (Hash)              Node CD (Hash)
             /              \            /              \
       Passport 1       Passport 2   Passport 3     Passport 4
        (Hash A)         (Hash B)     (Hash C)       (Hash D)
```

### How Verification Works During a QR Scan
1. Buyer scans QR on a garment tag ➔ System retrieves **Passport Hash (C)**.
2. System fetches the sibling proof hash **(D)** and parent node **(AB)**.
3. System recomputes the Merkle Root locally.
4. System compares the calculated root against the **On-Chain Merkle Root on Polygon**:
   - ✅ **Match:** 100% Authentic, verified untampered.
   - ❌ **Mismatch:** Data was altered in database or PDF.

---

## 5. Comprehensive Feature & Novelty Index

| Novelty | Feature Name | Technical Implementation | Business & Hackathon Value |
|---|---|---|---|
| 🏆 **1** | **Living Digital Product Passport (LDPP)** | Dynamic data schema tied to real-time utility bills, certificate validity timers, and live carbon metrics. | Replaces static, easily forged PDFs with a continuous record of truth. |
| 🏆 **2** | **Green Growth Twin (GGT)** | Historical trend engine + Linear Regression/ML carbon predictor + **"What-If" Solar/Efficiency Simulator**. | Shifts product from documenting past data to driving future MSME sustainability decisions. |
| 🏆 **3** | **Blockchain Integrity Layer** | SHA-256 Merkle Tree batch aggregator anchoring single Merkle Root to Polygon. | Mathematical anti-tamper proof without high gas fees or exposing sensitive business data. |
| 🏆 **4** | **Unified Trust Score (0–100)** | Weighted composite algorithm evaluating document verification depth, certificate validity, and utility consistency. | Instant green credit rating for buyers and lenders in one glance. |
| 🏆 **5** | **AI Compliance Copilot** | Rule-based engine monitoring regulatory changes (EU DPP) and flagging missing/expiring documents. | Saves MSMEs from audit failures and export rejections. |
| 🏆 **6** | **Operational Fraud Detection** | Ratio analysis engine cross-checking claimed production volume against TNEB electricity & CETP water consumption. | Protects banks & buyers against greenwashing and fake claims. |
| 🏆 **7** | **Multi-Stakeholder Shared Trust** | Tailored viewports for MSME Producers, Export Buyers, Green Loan Banks, and Government Auditors. | Repositions platform as core industry infrastructure. |
| 🏆 **8** | **MSME Green Leaderboard** | Anonymized peer ranking of MSME sustainability metrics across industrial clusters (e.g. Tiruppur). | Gamifies environmental performance and competitive motivation. |

---

## 6. System Roles & User Interfaces

```
                    ┌───────────────────────────────────────┐
                    │          VastraSetu Platform          │
                    └───────────────────┬───────────────────┘
                                        │
     ┌──────────────────┬───────────────┴───────────────┬──────────────────┐
     ▼                  ▼                               ▼                  ▼
[MSME Producer]   [Export Buyer]                [Bank / NBFC]      [Govt / Auditor]
• Doc Upload      • QR Verification Screen      • MSME Profile     • Compliance Grid
• GGT Dashboard   • Merkle Anti-Tamper Check    • Green Loan Score • Fraud Anomaly Feed
• Trust Score     • Sustainability Breakdown    • Credit Readiness • CETP/PCB Monitor
• Passports List  • ESG Report Download
```

---

## 7. Current Codebase Audit & Mapping

### Backend (`/server`)
- [`server/index.js`](file:///c:/Users/Karanjith/OneDrive/coursera-test/Attachments/Desktop/MSME/Vastra-Setu-MSME/server/index.js) — Express entry point, routes registration, CORS, middleware.
- [`server/routes/batches.js`](file:///c:/Users/Karanjith/OneDrive/coursera-test/Attachments/Desktop/MSME/Vastra-Setu-MSME/server/routes/batches.js) — Production batch creation, passport JSON generation, Merkle tree calculation, Polygon root anchoring.
- [`server/routes/certificates.js`](file:///c:/Users/Karanjith/OneDrive/coursera-test/Attachments/Desktop/MSME/Vastra-Setu-MSME/server/routes/certificates.js) — Document upload handling, DPI verification simulation, OCR extraction.
- [`server/routes/analytics.js`](file:///c:/Users/Karanjith/OneDrive/coursera-test/Attachments/Desktop/MSME/Vastra-Setu-MSME/server/routes/analytics.js) — Aggregated MSME metrics, Trust Score components, Green Growth Twin trend data.
- [`server/utils/certificateVerifier.js`](file:///c:/Users/Karanjith/OneDrive/coursera-test/Attachments/Desktop/MSME/Vastra-Setu-MSME/server/utils/certificateVerifier.js) — SHA-256 hashing algorithms and DPI cross-validation rules.
- [`server/utils/carbonCalculator.js`](file:///c:/Users/Karanjith/OneDrive/coursera-test/Attachments/Desktop/MSME/Vastra-Setu-MSME/server/utils/carbonCalculator.js) — Emission calculations based on electricity (TNEB kWh), water (L), and yarn type.
- [`server/utils/ocrService.js`](file:///c:/Users/Karanjith/OneDrive/coursera-test/Attachments/Desktop/MSME/Vastra-Setu-MSME/server/utils/ocrService.js) — PDF/Image parsing logic for GST invoices, TNEB bills, and PCB certificates.

### Frontend (`/client/src`)
- [`client/src/App.jsx`](file:///c:/Users/Karanjith/OneDrive/coursera-test/Attachments/Desktop/MSME/Vastra-Setu-MSME/client/src/App.jsx) — React Router configuration for all portals and views.
- [`client/src/pages/LandingPage.jsx`](file:///c:/Users/Karanjith/OneDrive/coursera-test/Attachments/Desktop/MSME/Vastra-Setu-MSME/client/src/pages/LandingPage.jsx) — High-impact landing page highlighting value propositions and role entry points.
- [`client/src/pages/DashboardPage.jsx`](file:///c:/Users/Karanjith/OneDrive/coursera-test/Attachments/Desktop/MSME/Vastra-Setu-MSME/client/src/pages/DashboardPage.jsx) — MSME Producer command center (Trust score, active batches, quick upload).
- [`client/src/pages/CreateBatchPage.jsx`](file:///c:/Users/Karanjith/OneDrive/coursera-test/Attachments/Desktop/MSME/Vastra-Setu-MSME/client/src/pages/CreateBatchPage.jsx) — Multi-step wizard for document attachment, DPI verification, and passport creation.
- [`client/src/pages/BatchesPage.jsx`](file:///c:/Users/Karanjith/OneDrive/coursera-test/Attachments/Desktop/MSME/Vastra-Setu-MSME/client/src/pages/BatchesPage.jsx) & [`BatchDetailPage.jsx`](file:///c:/Users/Karanjith/OneDrive/coursera-test/Attachments/Desktop/MSME/Vastra-Setu-MSME/client/src/pages/BatchDetailPage.jsx) — Batch history, Merkle tree visualizations, and QR code print actions.
- [`client/src/pages/PublicVerifyPage.jsx`](file:///c:/Users/Karanjith/OneDrive/coursera-test/Attachments/Desktop/MSME/Vastra-Setu-MSME/client/src/pages/PublicVerifyPage.jsx) & [`PassportViewPage.jsx`](file:///c:/Users/Karanjith/OneDrive/coursera-test/Attachments/Desktop/MSME/Vastra-Setu-MSME/client/src/pages/PassportViewPage.jsx) — Public buyer verification portal (Merkle verification badge, carbon breakdown, raw certificate modal).
- [`client/src/pages/AnalyticsPage.jsx`](file:///c:/Users/Karanjith/OneDrive/coursera-test/Attachments/Desktop/MSME/Vastra-Setu-MSME/client/src/pages/AnalyticsPage.jsx) — Green Growth Twin analytics dashboard (historical trends, carbon predictions, recommendations).
- [`client/src/pages/CetpPortalPage.jsx`](file:///c:/Users/Karanjith/OneDrive/coursera-test/Attachments/Desktop/MSME/Vastra-Setu-MSME/client/src/pages/CetpPortalPage.jsx) & [`DyerPortalPage.jsx`](file:///c:/Users/Karanjith/OneDrive/coursera-test/Attachments/Desktop/MSME/Vastra-Setu-MSME/client/src/pages/DyerPortalPage.jsx) — Supply chain partner verification portals.

---

## 8. Implementation & Verification Roadmap

### Phase 1: Core DPP Loop Verification (Completed / In-Progress)
- [x] Document upload wizard with OCR extraction
- [x] DPI API verification simulation (GSTN, TNEB, PCB)
- [x] SHA-256 hashing & batch Merkle Tree root creation
- [x] QR code generation & public verification view (`/verify/:id`)

### Phase 2: Green Growth Twin & Intelligence Layer (Focus Area)
- [ ] Refine **Trust Score Algorithm (0–100)**:
  - Document Authenticity (30%)
  - Certificate Expiry Status (25%)
  - Carbon & Water Intensity (25%)
  - Supply Chain Traceability (20%)
- [ ] Build **"What-If" Sustainability Simulator** in Green Growth Twin (Solar installation slider, LED lighting impact on Trust Score).
- [ ] Implement **AI Compliance Copilot Widget**: Warning banners for soon-to-expire PCB/CETP certificates.

### Phase 3: Bank & Auditor Ecosystem Views (Focus Area)
- [ ] Build dedicated **Bank / NBFC Green Loan Portal**: Scorecard view for loan eligibility.
- [ ] Implement **Operational Fraud Detector**: Alert badge when claimed production volume (e.g. 50,000 shirts) contradicts low TNEB electricity usage (<1,000 kWh).
- [ ] Add **Hangtag PDF Print Generator**: Printable QR hangtags for physical garments.

---

## 9. Verification & Testing Procedures

1. **Server Verification:** Ensure Express API (`http://localhost:5000/api/health` or `/api/batches`) returns HTTP 200 with valid JSON response.
2. **Client Verification:** Ensure Vite React application (`http://localhost:5173`) builds cleanly without console errors or broken state.
3. **End-to-End Test Workflow:**
   - Create a new batch in `CreateBatchPage`.
   - Upload GST invoice + TNEB bill + PCB certificate.
   - Generate batch DPP & verify SHA-256 Merkle root creation.
   - Navigate to `/verify/:batchId` to confirm Merkle proof badge shows **"✅ 100% Authentic & Untampered"**.
