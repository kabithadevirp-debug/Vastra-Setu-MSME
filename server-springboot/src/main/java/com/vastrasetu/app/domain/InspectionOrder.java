package com.vastrasetu.app.domain;

import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "inspection_orders")
public class InspectionOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(name = "order_number", nullable = false)
    private String orderNumber; // e.g. TNPCB/INS/2026/0842

    @Column(name = "msme_id", nullable = false)
    private String msmeId;

    @Column(name = "msme_name", nullable = false)
    private String msmeName;

    @Column(name = "gstin", nullable = false)
    private String gstin;

    @Column(name = "related_fraud_flag_id")
    private UUID relatedFraudFlagId;

    @Column(name = "auditor_id")
    private String auditorId;

    @Column(name = "reason", nullable = false, length = 1000)
    private String reason;

    @Column(name = "status", nullable = false)
    private String status; // ISSUED, IN_PROGRESS, RESOLVED

    @Column(name = "issued_at")
    private OffsetDateTime issuedAt;

    @Column(name = "resolved_at")
    private OffsetDateTime resolvedAt;

    @Column(name = "resolution_notes", length = 1000)
    private String resolutionNotes;

    @PrePersist
    public void prePersist() {
        if (this.issuedAt == null) {
            this.issuedAt = OffsetDateTime.now();
        }
        if (this.status == null) {
            this.status = "ISSUED";
        }
    }

    // Getters and Setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getOrderNumber() {
        return orderNumber;
    }

    public void setOrderNumber(String orderNumber) {
        this.orderNumber = orderNumber;
    }

    public String getMsmeId() {
        return msmeId;
    }

    public void setMsmeId(String msmeId) {
        this.msmeId = msmeId;
    }

    public String getMsmeName() {
        return msmeName;
    }

    public void setMsmeName(String msmeName) {
        this.msmeName = msmeName;
    }

    public String getGstin() {
        return gstin;
    }

    public void setGstin(String gstin) {
        this.gstin = gstin;
    }

    public UUID getRelatedFraudFlagId() {
        return relatedFraudFlagId;
    }

    public void setRelatedFraudFlagId(UUID relatedFraudFlagId) {
        this.relatedFraudFlagId = relatedFraudFlagId;
    }

    public String getAuditorId() {
        return auditorId;
    }

    public void setAuditorId(String auditorId) {
        this.auditorId = auditorId;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public OffsetDateTime getIssuedAt() {
        return issuedAt;
    }

    public void setIssuedAt(OffsetDateTime issuedAt) {
        this.issuedAt = issuedAt;
    }

    public OffsetDateTime getResolvedAt() {
        return resolvedAt;
    }

    public void setResolvedAt(OffsetDateTime resolvedAt) {
        this.resolvedAt = resolvedAt;
    }

    public String getResolutionNotes() {
        return resolutionNotes;
    }

    public void setResolutionNotes(String resolutionNotes) {
        this.resolutionNotes = resolutionNotes;
    }
}
