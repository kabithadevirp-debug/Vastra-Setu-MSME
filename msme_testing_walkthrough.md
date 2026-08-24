# VastraSetu — MSME Role Complete Step-by-Step Testing Guide

This guide walks you through testing the entire **MSME / Producer Role** end-to-end on your local system (`http://localhost:5173`).

---

## 🚀 Pre-flight System Check

1. Run the project launcher script in your terminal:
   ```cmd
   .\start-project.bat
   ```
2. Verify all 3 services are running:
   - **React Vite Frontend:** `http://localhost:5173`
   - **Spring Boot API (Java 21):** `http://localhost:8085`
   - **Express Node API:** `http://localhost:5000`
   - **PostgreSQL Database:** `localhost:5432` (`vastrasetu_db`)

---

## 📋 Step-by-Step Complete MSME Flow Test

### Step 1: Account Registration & Email OTP (`/register` → `/verify-otp`)
1. Open `http://localhost:5173/register` in your browser.
2. Fill in the business registration details:
   - **Business Name:** `Sri Jayavarma Knits & Exports Pvt Ltd`
   - **GSTIN:** `33AAACJ1928A1Z5`
   - **Email:** `727724eucy040@skcet.ac.in`
   - **Mobile:** `9842101928`
   - **Password:** `VastraSetu@2026`
3. Click **"Register MSME Account"**.
4. Check your email or check the Spring Boot server log for the 6-digit OTP code.
5. Enter the OTP at `http://localhost:5173/verify-otp` and click **"Verify Email & Continue"**.

---

### Step 2: Government DPI Identity Verification (`/identity-proof`)
1. Navigate to **Identity Upload** (`/identity-proof`).
2. Upload `sample_documents/1_Udyam_Certificate.png` into the Udyam slot.
3. Upload `sample_documents/2_GST_Certificate.png` into the GST Certificate slot.
4. Click **"Verify Identity Proofs"**.
5. **Behind the scenes execution:**
   - Preprocessing thresholding + local Tesseract OCR v5.5 text extraction.
   - OpenRouter API (`google/gemini-2.5-flash`, `max_tokens: 1000`) field parsing.
   - ISO 7064 Modulus 36 GSTIN character 15 checksum verification.
   - Cross-document GSTIN consistency check.
6. Observe redirect to `/verification-status` displaying **"4-Signal Independent Audit Trail Passed ✓"**.

---

### Step 3: Operational Document Upload (`/documents`)
1. Navigate to **Document Upload** (`/documents`).
2. Upload the 4 sample PNG certificates from `sample_documents/`:
   - 📄 **GST Sales Invoice:** `sample_documents/3_GST_Invoice.png`
   - ⚡ **TNEB Electricity Bill:** `sample_documents/4_TNEB_Electricity_Bill.png`
   - 💧 **CETP Effluent Report:** `sample_documents/5_CETP_Effluent_Report.png`
   - 🍃 **TNPCB Consent Certificate:** `sample_documents/6_TNPCB_Pollution_Certificate.png`
3. Observe real-time pipeline status (`OCR Preprocessing` ➔ `OpenRouter AI Parsing` ➔ `Plausibility Check` ➔ `VERIFIED`).
4. Confirm progress bar updates to **"4 of 4 Operational Documents Verified"**.
5. The gated CTA **"Generate Digital Product Passport"** becomes active!

---

### Step 4: Digital Product Passport Generation & Polygon Anchoring (`/create-batch`)
1. Click **"Generate Digital Product Passport"** or navigate to `/create-batch`.
2. Step through the Export Batch Wizard:
   - **Step 1:** Product Title (`100% Organic Cotton Polo Shirt`), PO Reference (`PO-ZARA-EU-8842`), Quantity (`4,000 pcs`).
   - **Step 2 (Yarn & Dyeing):** Spinning Mill (`Lakshmi Mills Tiruppur`), Dyer (`Arulpuram Eco-Dyers`), CETP Facility (`Arulpuram CETP`).
   - **Step 3 (Buyer & Port):** Buyer (`Inditex / Zara Germany`), Destination Port (`Hamburg Port, Germany`).
3. Click **"Generate & Anchor Digital Passport"**.
4. **Behind the scenes execution:**
   - Canonical JSON field sorting & SHA-256 passport hash computation.
   - Merkle Tree construction & proof path generation.
   - Polygon Amoy testnet Merkle Root anchoring (`0x8891...`).
   - GS1 Digital Link QR code generation.
5. Confetti animation triggers, and you are redirected to the **Passports List** (`/passports`).

---

### Step 5: Public Buyer QR Code Verification (`/verify/:passportId`)
1. Click any passport item in `/passports` or open `http://localhost:5173/verify/PO-ZARA-EU-8842` in an incognito window (no login required).
2. **Observe Public Verdict Screen:**
   - 🟢 **Verdict Banner:** "Polygon Amoy Blockchain Verified ✓" (Authentic & Verified).
   - 📊 **Product Summary:** Garment Title, Exporter Business Name, PO Reference.
   - 🍃 **LCA Footprints:** Carbon Footprint (`2.84 kg CO₂e / garment`), Water Footprint (`186.4 L / garment`, `Level 3 ZLD`).
   - 🛡️ **MSME Trust Score:** `94 / 100`.
   - 🔗 **Polygon Proof:** Live SHA-256 Hash, Merkle Root, and direct link to **PolygonScan Explorer** (`https://amoy.polygonscan.com/tx/0x7f28a...`).

---

### Step 6: Trust Score & Compliance Hub (`/compliance`)
1. Log back into the MSME dashboard and navigate to **Trust Score & Compliance** (`/compliance`).
2. **Inspect 4-Pillar Algorithmic Breakdown (25% each):**
   - **Identity Verification (25%):** Udyam & GST Modulus 36 checksum score.
   - **Document Completeness (25%):** 4/4 operational documents verified.
   - **Compliance Validity (25%):** TNPCB consent & ZLD status.
   - **Production Consistency (25%):** TNEB kWh vs invoice volume plausibility.
3. **Review Compliance Alerts:** Check active warnings (e.g. "PCB Consent Renewal Due in 24 days").
4. **Certificate Renewal Manager:** Inspect renewal date tracking table.
5. Click **"Print / Export Trust Certificate"** to generate printable PDF summary for banks and buyers.

---

### Step 7: Green Growth Twin & Simulator (`/twin`)
1. Navigate to **Green Growth Twin** (`/twin`).
2. **Inspect 6-Month Trend Charts:** Scope 2 CO₂e, TNEB Electricity (kWh), CETP Water (L).
3. **Inspect Next-Month Prediction:** Least-squares linear regression projection ($y = mx + b$) for September 2026 with CEA India grid emission factor note (`0.716 kg CO₂e / kWh`).
4. **Test Interactive What-If Simulator:**
   - Toggle **50 kW Solar Rooftop PV** ➔ Observe instant 30% carbon drop & +4 Trust Score points preview.
   - Toggle **LED Retrofit** ➔ Observe instant 10% electricity savings & +2 Trust Score points preview.
   - Toggle **ZLD Water Recirculation** ➔ Observe instant 25% fresh water savings & +3 Trust Score points preview.

---

### Step 8: Profile & Security Audit Log (`/profile`)
1. Navigate to **Profile & Security** (`/profile`).
2. **Business Profile Tab:**
   - Observe read-only GSTIN & Udyam fields locked with "Verified ✓" badges.
   - Test editing business address or contact phone number and click **Save Profile Changes**.
3. **Password & Security Tab:**
   - Test password change form with current password re-entry.
4. **Security Audit Log Tab:**
   - Filter logs by `LOGIN`, `DOCUMENT_UPLOAD`, `VERIFICATION_OUTCOME`, `PROFILE_CHANGE`.
   - Observe real-time audit trail with masked IPs (`106.210.xx.xx`) and timestamps.
5. **Active Sessions Tab:**
   - Inspect active device list and test **"Terminate All Other Sessions"**.

---

## 🎯 Completion Status Summary

All 8 MSME operational modules are 100% complete, compiled, and verified! You are ready to present the entire producer lifecycle demo.
