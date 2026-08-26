package com.vastrasetu.app.domain;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.time.temporal.ChronoUnit;
import java.util.UUID;

@Entity
@Table(name = "vault_documents")
public class VaultDocument {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(name = "scope_type", nullable = false, length = 50)
    private String scopeType; // ORGANIZATION, FACILITY_DYEING, FACILITY_CETP, FACILITY_KNITTING, FACILITY_QA

    @Column(name = "document_type", nullable = false, length = 80)
    private String documentType; // IEC, PAN, GST_CERTIFICATE, UDYAM, TNPCB_ZLD_CONSENT, GOTS_SCOPE_CERTIFICATE, OEKO_TEX_FACILITY_CERTIFICATE, FACTORY_REGISTRATION

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "document_number", length = 100)
    private String documentNumber; // e.g. 0305012984, 33AAACJ1928A1Z5, TNPCB-ZLD-2026-8812

    @Column(name = "issuer", length = 150)
    private String issuer;

    @Column(name = "issue_date", length = 30)
    private String issueDate;

    @Column(name = "expiry_date", length = 30)
    private String expiryDate; // null or YYYY-MM-DD

    @Column(name = "file_url", columnDefinition = "TEXT")
    private String fileUrl;

    @Column(name = "file_hash", length = 100)
    private String fileHash; // SHA-256

    @Column(name = "authenticity_status", length = 40)
    private String authenticityStatus = "DOCUMENT_STRUCTURE_CHECKED"; // DOCUMENT_STRUCTURE_CHECKED, ISSUER_VERIFIED, DOCUMENT_PROVIDED, MANUAL_REVIEW, EXPIRING_SOON, EXPIRED

    @Column(name = "extracted_fields", columnDefinition = "TEXT")
    private String extractedFields; // JSON fields

    @Column(name = "verification_details", columnDefinition = "TEXT")
    private String verificationDetails; // JSON verification metadata

    @Column(name = "uploaded_by", length = 100)
    private String uploadedBy = "Compliance Desk";

    @Column(name = "created_at")
    private OffsetDateTime createdAt = OffsetDateTime.now();

    @Column(name = "updated_at")
    private OffsetDateTime updatedAt = OffsetDateTime.now();

    @Transient
    private Long daysUntilExpiry;

    @Transient
    private String expiryAlertLevel; // ACTIVE, NOTICE (<=90d), WARNING (<=30d), URGENT (<=7d), EXPIRED

    public VaultDocument() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getScopeType() { return scopeType; }
    public void setScopeType(String scopeType) { this.scopeType = scopeType; }

    public String getDocumentType() { return documentType; }
    public void setDocumentType(String documentType) { this.documentType = documentType; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDocumentNumber() { return documentNumber; }
    public void setDocumentNumber(String documentNumber) { this.documentNumber = documentNumber; }

    public String getIssuer() { return issuer; }
    public void setIssuer(String issuer) { this.issuer = issuer; }

    public String getIssueDate() { return issueDate; }
    public void setIssueDate(String issueDate) { this.issueDate = issueDate; }

    public String getExpiryDate() { return expiryDate; }
    public void setExpiryDate(String expiryDate) { this.expiryDate = expiryDate; }

    public String getFileUrl() { return fileUrl; }
    public void setFileUrl(String fileUrl) { this.fileUrl = fileUrl; }

    public String getFileHash() { return fileHash; }
    public void setFileHash(String fileHash) { this.fileHash = fileHash; }

    public String getAuthenticityStatus() { return authenticityStatus; }
    public void setAuthenticityStatus(String authenticityStatus) { this.authenticityStatus = authenticityStatus; }

    public String getExtractedFields() { return extractedFields; }
    public void setExtractedFields(String extractedFields) { this.extractedFields = extractedFields; }

    public String getVerificationDetails() { return verificationDetails; }
    public void setVerificationDetails(String verificationDetails) { this.verificationDetails = verificationDetails; }

    public String getUploadedBy() { return uploadedBy; }
    public void setUploadedBy(String uploadedBy) { this.uploadedBy = uploadedBy; }

    public OffsetDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }

    public OffsetDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(OffsetDateTime updatedAt) { this.updatedAt = updatedAt; }

    public Long getDaysUntilExpiry() {
        if (expiryDate == null || expiryDate.trim().isEmpty()) {
            return null;
        }
        try {
            LocalDate exp = LocalDate.parse(expiryDate.trim());
            return ChronoUnit.DAYS.between(LocalDate.now(), exp);
        } catch (Exception e) {
            return null;
        }
    }

    public String getExpiryAlertLevel() {
        Long days = getDaysUntilExpiry();
        if (days == null) {
            return "ACTIVE";
        }
        if (days < 0) {
            return "EXPIRED";
        } else if (days <= 7) {
            return "URGENT";
        } else if (days <= 30) {
            return "WARNING";
        } else if (days <= 90) {
            return "NOTICE";
        }
        return "ACTIVE";
    }
}
