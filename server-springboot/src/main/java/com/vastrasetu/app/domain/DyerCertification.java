package com.vastrasetu.app.domain;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "dyer_certifications")
public class DyerCertification {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(name = "dyer_id", nullable = false)
    private String dyerId;

    @Column(name = "cert_type", nullable = false)
    private String certType; // OEKO_TEX_STANDARD_100, ZDHC_MRSL, TNPCB_CTO, GOTS_WET_PROCESSING

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "cert_number", nullable = false)
    private String certNumber;

    @Column(name = "cert_class_or_level")
    private String certClassOrLevel; // Class I (Baby Safe), Level 3, Red Category

    @Column(name = "issuing_body", nullable = false)
    private String issuingBody; // TESTEX AG Zurich, ZDHC Foundation, TNPCB

    @Column(name = "issue_date")
    private LocalDate issueDate;

    @Column(name = "expiry_date")
    private LocalDate expiryDate;

    @Column(name = "document_url")
    private String documentUrl;

    @Column(name = "status")
    private String status; // VALID, EXPIRING_SOON, EXPIRED

    @Column(name = "created_at")
    private OffsetDateTime createdAt;

    @PrePersist
    public void prePersist() {
        if (this.createdAt == null) {
            this.createdAt = OffsetDateTime.now();
        }
    }

    // Getters and Setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getDyerId() {
        return dyerId;
    }

    public void setDyerId(String dyerId) {
        this.dyerId = dyerId;
    }

    public String getCertType() {
        return certType;
    }

    public void setCertType(String certType) {
        this.certType = certType;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getCertNumber() {
        return certNumber;
    }

    public void setCertNumber(String certNumber) {
        this.certNumber = certNumber;
    }

    public String getCertClassOrLevel() {
        return certClassOrLevel;
    }

    public void setCertClassOrLevel(String certClassOrLevel) {
        this.certClassOrLevel = certClassOrLevel;
    }

    public String getIssuingBody() {
        return issuingBody;
    }

    public void setIssuingBody(String issuingBody) {
        this.issuingBody = issuingBody;
    }

    public LocalDate getIssueDate() {
        return issueDate;
    }

    public void setIssueDate(LocalDate issueDate) {
        this.issueDate = issueDate;
    }

    public LocalDate getExpiryDate() {
        return expiryDate;
    }

    public void setExpiryDate(LocalDate expiryDate) {
        this.expiryDate = expiryDate;
    }

    public String getDocumentUrl() {
        return documentUrl;
    }

    public void setDocumentUrl(String documentUrl) {
        this.documentUrl = documentUrl;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(OffsetDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
