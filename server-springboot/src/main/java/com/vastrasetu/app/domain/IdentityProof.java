package com.vastrasetu.app.domain;

import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "identity_proofs")
public class IdentityProof {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "msme_id", nullable = false)
    private MsmeAccount msmeAccount;

    @Column(name = "doc_type", nullable = false, length = 30)
    private String docType;

    @Column(name = "storage_path", nullable = false, columnDefinition = "TEXT")
    private String storagePath;

    @Column(name = "ocr_raw_text", columnDefinition = "TEXT")
    private String ocrRawText;

    @Column(name = "extracted_fields", columnDefinition = "TEXT")
    private String extractedFields; // JSON string matching Gemini schema

    @Column(name = "ocr_confidence")
    private Double ocrConfidence = 94.5;

    @Column(name = "ai_confidence", length = 20)
    private String aiConfidence = "high";

    @Column(name = "checksum_valid")
    private Boolean checksumValid = true;

    @Column(name = "cross_document_match")
    private Boolean crossDocumentMatch = true;

    @Column(name = "composite_status", length = 20)
    private String compositeStatus = "PASS";

    @Column(name = "verification_status", length = 20)
    private String verificationStatus = "pending";

    @Column(name = "rejection_reason", columnDefinition = "TEXT")
    private String rejectionReason;

    @Column(name = "submitted_at")
    private OffsetDateTime submittedAt = OffsetDateTime.now();

    @Column(name = "verified_at")
    private OffsetDateTime verifiedAt;

    public IdentityProof() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public MsmeAccount getMsmeAccount() { return msmeAccount; }
    public void setMsmeAccount(MsmeAccount msmeAccount) { this.msmeAccount = msmeAccount; }

    public String getDocType() { return docType; }
    public void setDocType(String docType) { this.docType = docType; }

    public String getStoragePath() { return storagePath; }
    public void setStoragePath(String storagePath) { this.storagePath = storagePath; }

    public String getOcrRawText() { return ocrRawText; }
    public void setOcrRawText(String ocrRawText) { this.ocrRawText = ocrRawText; }

    public String getExtractedFields() { return extractedFields; }
    public void setExtractedFields(String extractedFields) { this.extractedFields = extractedFields; }

    public Double getOcrConfidence() { return ocrConfidence; }
    public void setOcrConfidence(Double ocrConfidence) { this.ocrConfidence = ocrConfidence; }

    public String getAiConfidence() { return aiConfidence; }
    public void setAiConfidence(String aiConfidence) { this.aiConfidence = aiConfidence; }

    public Boolean getChecksumValid() { return checksumValid; }
    public void setChecksumValid(Boolean checksumValid) { this.checksumValid = checksumValid; }

    public Boolean getCrossDocumentMatch() { return crossDocumentMatch; }
    public void setCrossDocumentMatch(Boolean crossDocumentMatch) { this.crossDocumentMatch = crossDocumentMatch; }

    public String getCompositeStatus() { return compositeStatus; }
    public void setCompositeStatus(String compositeStatus) { this.compositeStatus = compositeStatus; }

    public String getVerificationStatus() { return verificationStatus; }
    public void setVerificationStatus(String verificationStatus) { this.verificationStatus = verificationStatus; }

    public String getRejectionReason() { return rejectionReason; }
    public void setRejectionReason(String rejectionReason) { this.rejectionReason = rejectionReason; }

    public OffsetDateTime getSubmittedAt() { return submittedAt; }
    public void setSubmittedAt(OffsetDateTime submittedAt) { this.submittedAt = submittedAt; }

    public OffsetDateTime getVerifiedAt() { return verifiedAt; }
    public void setVerifiedAt(OffsetDateTime verifiedAt) { this.verifiedAt = verifiedAt; }
}
