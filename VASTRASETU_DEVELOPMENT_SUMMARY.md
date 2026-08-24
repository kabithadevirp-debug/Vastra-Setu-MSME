# VastraSetu — Production Implementation & Strict Access Control Report

**Project Title:** VastraSetu — Digital Product Passport (DPP) & Sustainability DPI Platform  
**Mode:** **STRICT PRODUCTION MODE (100% REAL DATA & STRICT RBAC ACCESS CONTROL)**  
**Date:** August 24, 2026  
**Target Environment:** Spring Boot 3.3 (Java 21) on Port 8085 + React Vite on Port 5173 + PostgreSQL (`vastrasetu_db`)  

---

## 🔒 1. Strict Role-Based Access Control (RBAC) Implementation

- **Sidebar & Navigation Lockdown ([`AppLayout.jsx`](file:///c:/Users/Karanjith/OneDrive/coursera-test/Attachments/Desktop/MSME/Vastra-Setu-MSME/client/src/components/AppLayout.jsx) & [`Navbar.jsx`](file:///c:/Users/Karanjith/OneDrive/coursera-test/Attachments/Desktop/MSME/Vastra-Setu-MSME/client/src/components/Navbar.jsx)):**
  - **Removed all cross-role demo shortcuts** (`Role 3 Bank`, `Role 4 Auditor`, `Role 5 Admin`) from the MSME sidebar.
  - Logged-in MSME accounts now **strictly see only MSME links** (`Dashboard`, `Document Upload`, `Passports`, `Trust & Compliance`, `Green Growth Twin`).
- **HTTP 403 Forbidden Route Protection ([`App.jsx`](file:///c:/Users/Karanjith/OneDrive/coursera-test/Attachments/Desktop/MSME/Vastra-Setu-MSME/client/src/App.jsx) & [`AccessDeniedPage.jsx`](file:///c:/Users/Karanjith/OneDrive/coursera-test/Attachments/Desktop/MSME/Vastra-Setu-MSME/client/src/pages/AccessDeniedPage.jsx)):**
  - If a logged-in MSME account attempts to manually enter URLs like `/portal/bank`, `/portal/auditor`, `/portal/admin`, `/portal/dyer`, or `/portal/cetp`, the router blocks them with an explicit **HTTP 403 Forbidden Access Denied** screen requiring proper authorized portal credentials.

---

## 🗄️ 2. Real Database Enforcement (Zero Fake Fallbacks)

- **Strict Database Queries ([`DashboardController.java`](file:///c:/Users/Karanjith/OneDrive/coursera-test/Attachments/Desktop/MSME/Vastra-Setu-MSME/server-springboot/src/main/java/com/vastrasetu/app/controller/DashboardController.java)):**
  - All endpoints (`/api/batches`, `/api/batches/{id}`, `/api/passports/summary`, `/api/analytics`) now query live PostgreSQL database tables directly via `ProductPassportRepository`, `MerkleBatchRepository`, `MsmeAccountRepository`, and `IdentityProofRepository`.
  - If a batch or passport ID does not exist in PostgreSQL, the backend returns a legitimate **HTTP 404 Not Found** response (`Batch not found in database for ID: {id}`). Hardcoded dummy maps have been completely eliminated.

---

## 🚀 3. How to Test Authorized Access for Each Role

To access non-MSME dashboards, users must log in with authorized role credentials via **`http://localhost:5173/login`**:

1. **Dyeing Partner Facility:** Select `Dyeing Partner Facility` on login ➔ Authorized for `/portal/dyer`.
2. **CETP Plant Operator:** Select `CETP ZLD Plant Operator` on login ➔ Authorized for `/portal/cetp`.
3. **Bank / NBFC Underwriter:** Select `Bank / NBFC Financier` on login ➔ Authorized for `/portal/bank`.
4. **Government Auditor:** Select `Government Regulatory Auditor` on login ➔ Authorized for `/portal/auditor`.
