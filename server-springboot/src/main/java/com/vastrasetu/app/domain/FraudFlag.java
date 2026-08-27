package com.vastrasetu.app.domain;

import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "fraud_flags")
public class FraudFlag {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(name = "msme_id", nullable = false)
    private String msmeId;

    @Column(name = "msme_name", nullable = false)
    private String msmeName;

    @Column(name = "gstin", nullable = false)
    private String gstin;

    @Column(name = "flag_type", nullable = false)
    private String flagType; // ELECTRICITY_PRODUCTION_MISMATCH, MISSING_CETP_DISCHARGE_CORRELATION, GSTIN_INVOICE_MISMATCH

    @Column(name = "severity", nullable = false)
    private String severity; // HIGH, MEDIUM, LOW

    @Column(name = "description", nullable = false, length = 1000)
    private String description;

    @Column(name = "trigger_data", length = 1000)
    private String triggerData;

    @Column(name = "status", nullable = false)
    private String status; // OPEN, REVIEWED, DISMISSED, ESCALATED

    @Column(name = "detected_at")
    private OffsetDateTime detectedAt;

    @PrePersist
    public void prePersist() {
        if (this.detectedAt == null) {
            this.detectedAt = OffsetDateTime.now();
        }
        if (this.status == null) {
            this.status = "OPEN";
        }
    }

    // Getters and Setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
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

    public String getFlagType() {
        return flagType;
    }

    public void setFlagType(String flagType) {
        this.flagType = flagType;
    }

    public String getSeverity() {
        return severity;
    }

    public void setSeverity(String severity) {
        this.severity = severity;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getTriggerData() {
        return triggerData;
    }

    public void setTriggerData(String triggerData) {
        this.triggerData = triggerData;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public OffsetDateTime getDetectedAt() {
        return detectedAt;
    }

    public void setDetectedAt(OffsetDateTime detectedAt) {
        this.detectedAt = detectedAt;
    }
}
