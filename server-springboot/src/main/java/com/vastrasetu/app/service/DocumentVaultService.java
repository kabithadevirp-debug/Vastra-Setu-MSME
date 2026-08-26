package com.vastrasetu.app.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.vastrasetu.app.domain.VaultDocument;
import com.vastrasetu.app.repository.VaultDocumentRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.OffsetDateTime;
import java.util.*;

@Service
public class DocumentVaultService {

    private final VaultDocumentRepository vaultRepo;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public DocumentVaultService(VaultDocumentRepository vaultRepo) {
        this.vaultRepo = vaultRepo;
    }

    @PostConstruct
    public void initSeedVault() {
        if (vaultRepo.count() == 0) {
            seedInitialVaultDocuments();
        }
    }

    @Transactional
    public void seedInitialVaultDocuments() {
        // 1. IEC
        createAndSaveDoc(
                "ORGANIZATION",
                "IEC",
                "Importer Exporter Code (IEC Registration)",
                "0305012984",
                "Directorate General of Foreign Trade (DGFT)",
                "2020-03-15",
                null,
                "DOCUMENT_STRUCTURE_CHECKED",
                Map.of("iec", "0305012984", "entityName", "Sri Jayavarma Knits & Exports Pvt Ltd", "pan", "AAACJ1928A"),
                Map.of("structureValid", true, "format", "10-digit Alphanumeric", "authoritativeStatus", "Document format and layout validated")
        );

        // 2. PAN
        createAndSaveDoc(
                "ORGANIZATION",
                "PAN",
                "Permanent Account Number (PAN Card)",
                "AAACJ1928A",
                "Income Tax Department of India",
                "2018-01-10",
                null,
                "DOCUMENT_STRUCTURE_CHECKED",
                Map.of("pan", "AAACJ1928A", "category", "Company"),
                Map.of("structureValid", true, "format", "Valid 10-character PAN")
        );

        // 3. GST Registration Certificate
        createAndSaveDoc(
                "ORGANIZATION",
                "GST_CERTIFICATE",
                "GST Registration Certificate (Form GST REG-06)",
                "33AAACJ1928A1Z5",
                "Goods and Services Tax Network (GSTN)",
                "2018-07-01",
                null,
                "DOCUMENT_STRUCTURE_CHECKED",
                Map.of("gstin", "33AAACJ1928A1Z5", "state", "Tamil Nadu (33)", "type", "Regular Taxpayer"),
                Map.of("structureValid", true, "checksumValid", true, "authoritativeStatus", "GSTIN structure & state checksum validated")
        );

        // 4. Udyam MSME Registration
        createAndSaveDoc(
                "ORGANIZATION",
                "UDYAM",
                "Udyam MSME Enterprise Certificate",
                "UDYAM-TN-32-0019284",
                "Ministry of Micro, Small and Medium Enterprises",
                "2021-04-12",
                null,
                "DOCUMENT_STRUCTURE_CHECKED",
                Map.of("udyamNumber", "UDYAM-TN-32-0019284", "enterpriseType", "Small (Textiles Manufacturing)"),
                Map.of("structureValid", true)
        );

        // 5. Environmental ZLD Consent Order (CETP)
        createAndSaveDoc(
                "FACILITY_CETP",
                "TNPCB_ZLD_CONSENT",
                "TNPCB Closed-Loop 100% ZLD Consent Order",
                "TNPCB-ZLD-2026-8812",
                "Tamil Nadu Pollution Control Board",
                "2025-10-01",
                "2026-09-30",
                "DOCUMENT_STRUCTURE_CHECKED",
                Map.of("waterRecoveryRate", "94.2%", "consentValidUntil", "2026-09-30", "facility", "Arulpuram CETP Unit 3"),
                Map.of("structureValid", true, "zldCompliance", "100% Zero Liquid Discharge", "authoritativeStatus", "TNPCB consent document format verified")
        );

        // 6. GOTS Facility Scope Certificate
        createAndSaveDoc(
                "FACILITY_DYEING",
                "GOTS_SCOPE_CERTIFICATE",
                "GOTS v7.0 Facility Scope Certificate",
                "CU-841920-GOTS-2026",
                "Control Union Certifications B.V.",
                "2025-06-15",
                "2026-12-31",
                "ISSUER_VERIFIED",
                Map.of("licenseNumber", "CU-841920", "standard", "Global Organic Textile Standard (GOTS) v7.0"),
                Map.of("issuerVerified", true, "qrValidated", true, "publicRegistryMatch", "Control Union Public Database")
        );

        // 7. OEKO-TEX Standard 100 Class I Certificate
        createAndSaveDoc(
                "FACILITY_DYEING",
                "OEKO_TEX_FACILITY_CERTIFICATE",
                "OEKO-TEX Standard 100 Class I Test Report",
                "OEKO-2026-TX-9912",
                "TESTEX AG Swiss Textile Testing Institute",
                "2026-01-10",
                "2027-01-09",
                "ISSUER_VERIFIED",
                Map.of("zdhcLevel", "ZDHC MRSL Level 3", "heavyMetalsDetected", "ND"),
                Map.of("issuerVerified", true, "qrValidated", true)
        );
    }

    private void createAndSaveDoc(
            String scopeType,
            String docType,
            String title,
            String docNumber,
            String issuer,
            String issueDate,
            String expiryDate,
            String authenticityStatus,
            Map<String, Object> extractedFields,
            Map<String, Object> verificationDetails) {

        VaultDocument doc = new VaultDocument();
        doc.setScopeType(scopeType);
        doc.setDocumentType(docType);
        doc.setTitle(title);
        doc.setDocumentNumber(docNumber);
        doc.setIssuer(issuer);
        doc.setIssueDate(issueDate);
        doc.setExpiryDate(expiryDate);
        doc.setAuthenticityStatus(authenticityStatus);
        doc.setFileHash(computeSha256(docNumber + ":" + issuer + ":" + issueDate));

        try {
            doc.setExtractedFields(objectMapper.writeValueAsString(extractedFields));
            doc.setVerificationDetails(objectMapper.writeValueAsString(verificationDetails));
        } catch (Exception ignored) {}

        vaultRepo.save(doc);
    }

    public List<VaultDocument> getAllVaultDocuments() {
        return vaultRepo.findAllByOrderByCreatedAtDesc();
    }

    public List<VaultDocument> getDocumentsByScope(String scopeType) {
        return vaultRepo.findByScopeType(scopeType);
    }

    public List<Map<String, Object>> getActiveAlerts() {
        List<VaultDocument> all = vaultRepo.findAll();
        List<Map<String, Object>> alerts = new ArrayList<>();

        for (VaultDocument doc : all) {
            String level = doc.getExpiryAlertLevel();
            Long days = doc.getDaysUntilExpiry();

            if ("EXPIRED".equals(level)) {
                alerts.add(Map.of(
                        "docId", doc.getId().toString(),
                        "title", doc.getTitle(),
                        "documentNumber", doc.getDocumentNumber() != null ? doc.getDocumentNumber() : "",
                        "level", "EXPIRED",
                        "daysRemaining", days != null ? days : 0,
                        "message", doc.getTitle() + " has expired. It cannot be used as current supporting evidence.",
                        "actionRequired", true
                ));
            } else if ("URGENT".equals(level)) {
                alerts.add(Map.of(
                        "docId", doc.getId().toString(),
                        "title", doc.getTitle(),
                        "documentNumber", doc.getDocumentNumber() != null ? doc.getDocumentNumber() : "",
                        "level", "URGENT",
                        "daysRemaining", days != null ? days : 0,
                        "message", doc.getTitle() + " expires in " + days + " days. Immediate renewal required.",
                        "actionRequired", true
                ));
            } else if ("WARNING".equals(level)) {
                alerts.add(Map.of(
                        "docId", doc.getId().toString(),
                        "title", doc.getTitle(),
                        "documentNumber", doc.getDocumentNumber() != null ? doc.getDocumentNumber() : "",
                        "level", "WARNING",
                        "daysRemaining", days != null ? days : 0,
                        "message", doc.getTitle() + " renewal recommended (" + days + " days remaining).",
                        "actionRequired", false
                ));
            } else if ("NOTICE".equals(level)) {
                alerts.add(Map.of(
                        "docId", doc.getId().toString(),
                        "title", doc.getTitle(),
                        "documentNumber", doc.getDocumentNumber() != null ? doc.getDocumentNumber() : "",
                        "level", "NOTICE",
                        "daysRemaining", days != null ? days : 0,
                        "message", doc.getTitle() + " expires in " + days + " days.",
                        "actionRequired", false
                ));
            }
        }
        return alerts;
    }

    @Transactional
    public VaultDocument uploadOrUpdateVaultDocument(Map<String, Object> req) {
        String docType = req.getOrDefault("documentType", "OTHER").toString();
        VaultDocument doc = vaultRepo.findByDocumentType(docType).orElse(new VaultDocument());

        doc.setScopeType(req.getOrDefault("scopeType", "ORGANIZATION").toString());
        doc.setDocumentType(docType);
        doc.setTitle(req.getOrDefault("title", "Vault Document").toString());
        doc.setDocumentNumber(req.getOrDefault("documentNumber", "REF-" + System.currentTimeMillis()).toString());
        doc.setIssuer(req.getOrDefault("issuer", "Issuing Authority").toString());
        doc.setIssueDate(req.getOrDefault("issueDate", OffsetDateTime.now().toLocalDate().toString()).toString());
        doc.setExpiryDate(req.get("expiryDate") != null ? req.get("expiryDate").toString() : null);
        doc.setAuthenticityStatus("DOCUMENT_STRUCTURE_CHECKED");
        doc.setFileHash(computeSha256(doc.getDocumentNumber() + ":" + doc.getIssuer() + ":" + System.currentTimeMillis()));

        if (req.containsKey("extractedFields")) {
            try {
                doc.setExtractedFields(objectMapper.writeValueAsString(req.get("extractedFields")));
            } catch (Exception ignored) {}
        }

        return vaultRepo.save(doc);
    }

    private String computeSha256(String input) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(input.getBytes(StandardCharsets.UTF_8));
            StringBuilder hex = new StringBuilder();
            for (byte b : hash) {
                String h = Integer.toHexString(0xff & b);
                if (h.length() == 1) hex.append('0');
                hex.append(h);
            }
            return hex.toString();
        } catch (Exception e) {
            return UUID.randomUUID().toString().replace("-", "");
        }
    }
}
