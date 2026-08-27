package com.vastrasetu.app.domain;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "cetp_consent_orders")
public class CetpConsentOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(name = "cetp_id", nullable = false)
    private String cetpId;

    @Column(name = "order_number", nullable = false)
    private String orderNumber; // e.g. TNPCB-CETP-ZLD-2024-88

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "issuing_authority", nullable = false)
    private String issuingAuthority; // Tamil Nadu Pollution Control Board

    @Column(name = "plant_capacity_kld")
    private Double plantCapacityKld; // e.g. 2500.0 KLD

    @Column(name = "zld_compliance_status")
    private String zldComplianceStatus; // 100% Zero Liquid Discharge Verified

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

    public String getCetpId() {
        return cetpId;
    }

    public void setCetpId(String cetpId) {
        this.cetpId = cetpId;
    }

    public String getOrderNumber() {
        return orderNumber;
    }

    public void setOrderNumber(String orderNumber) {
        this.orderNumber = orderNumber;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getIssuingAuthority() {
        return issuingAuthority;
    }

    public void setIssuingAuthority(String issuingAuthority) {
        this.issuingAuthority = issuingAuthority;
    }

    public Double getPlantCapacityKld() {
        return plantCapacityKld;
    }

    public void setPlantCapacityKld(Double plantCapacityKld) {
        this.plantCapacityKld = plantCapacityKld;
    }

    public String getZldComplianceStatus() {
        return zldComplianceStatus;
    }

    public void setZldComplianceStatus(String zldComplianceStatus) {
        this.zldComplianceStatus = zldComplianceStatus;
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
