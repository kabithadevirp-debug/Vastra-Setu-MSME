package com.vastrasetu.app.domain;

import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "export_documents")
public class ExportDocument {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(name = "shipment_number", length = 80)
    private String shipmentNumber; // e.g. SHIP-2026-0087

    @Column(name = "batch_number", length = 80)
    private String batchNumber; // e.g. VS-2026-B00041

    @Column(name = "document_type", nullable = false, length = 80)
    private String documentType; // COMMERCIAL_INVOICE, PACKING_LIST, SHIPPING_BILL, BILL_OF_LADING, AIRWAY_BILL, etc.

    @Column(name = "category", nullable = false, length = 50)
    private String category; // EXPORTER_IDENTITY, CUSTOMS, COMMERCIAL, ORIGIN, TRANSPORT, INSURANCE, TAX, PRODUCT_COMPLIANCE, QUALITY, BUYER_REQUIREMENT, OTHER

    @Column(name = "title", nullable = false)
    private String title; // e.g. Commercial Export Invoice

    @Column(name = "requirement_status", length = 30)
    private String requirementStatus = "REQUIRED"; // REQUIRED, CONDITIONAL, SUPPORTING, OPTIONAL, NOT_APPLICABLE

    @Column(name = "applicability_reason", columnDefinition = "TEXT")
    private String applicabilityReason;

    @Column(name = "document_number", length = 100)
    private String documentNumber; // e.g. INV-2026-0892

    @Column(name = "issuer", length = 150)
    private String issuer;

    @Column(name = "issue_date", length = 30)
    private String issueDate;

    @Column(name = "expiry_date", length = 30)
    private String expiryDate;

    @Column(name = "file_url", columnDefinition = "TEXT")
    private String fileUrl;

    @Column(name = "file_hash", length = 100)
    private String fileHash;

    @Column(name = "extracted_fields", columnDefinition = "TEXT")
    private String extractedFields; // JSON map of invoice value, HS code, quantity, packages, carrier, etc.

    @Column(name = "verification_status", length = 40)
    private String verificationStatus = "DOCUMENT_SUPPORTED"; // UPLOADED, OCR_PROCESSED, SELF_CONFIRMED, DOCUMENT_SUPPORTED, DIGITALLY_VALIDATED, VERIFIED, REJECTED, EXPIRED

    @Column(name = "uploaded_by", length = 100)
    private String uploadedBy = "Exporter Documentation Team";

    @Column(name = "created_at")
    private OffsetDateTime createdAt = OffsetDateTime.now();

    @Column(name = "updated_at")
    private OffsetDateTime updatedAt = OffsetDateTime.now();

    public ExportDocument() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getShipmentNumber() { return shipmentNumber; }
    public void setShipmentNumber(String shipmentNumber) { this.shipmentNumber = shipmentNumber; }

    public String getBatchNumber() { return batchNumber; }
    public void setBatchNumber(String batchNumber) { this.batchNumber = batchNumber; }

    public String getDocumentType() { return documentType; }
    public void setDocumentType(String documentType) { this.documentType = documentType; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getRequirementStatus() { return requirementStatus; }
    public void setRequirementStatus(String requirementStatus) { this.requirementStatus = requirementStatus; }

    public String getApplicabilityReason() { return applicabilityReason; }
    public void setApplicabilityReason(String applicabilityReason) { this.applicabilityReason = applicabilityReason; }

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

    public String getExtractedFields() { return extractedFields; }
    public void setExtractedFields(String extractedFields) { this.extractedFields = extractedFields; }

    public String getVerificationStatus() { return verificationStatus; }
    public void setVerificationStatus(String verificationStatus) { this.verificationStatus = verificationStatus; }

    public String getUploadedBy() { return uploadedBy; }
    public void setUploadedBy(String uploadedBy) { this.uploadedBy = uploadedBy; }

    public OffsetDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }

    public OffsetDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(OffsetDateTime updatedAt) { this.updatedAt = updatedAt; }
}
