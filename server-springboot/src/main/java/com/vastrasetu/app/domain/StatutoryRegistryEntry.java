package com.vastrasetu.app.domain;

import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "statutory_registry_entries")
public class StatutoryRegistryEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(name = "msme_id", nullable = false)
    private String msmeId;

    @Column(name = "msme_name", nullable = false)
    private String msmeName;

    @Column(name = "gstin", nullable = false)
    private String gstin;

    @Column(name = "iec_number", nullable = false)
    private String iecNumber; // 10-char Import Export Code

    @Column(name = "pcb_consent_number")
    private String pcbConsentNumber; // TNPCB/CTO/DYE/2024/091

    @Column(name = "udyam_number")
    private String udyamNumber; // UDYAM-TN-28-0019284

    @Column(name = "issuing_authority")
    private String issuingAuthority; // DGFT / TNPCB / Ministry of MSME

    @Column(name = "status")
    private String status; // ACTIVE, LAPSED, UNDER_REVIEW

    @Column(name = "last_verified_at")
    private OffsetDateTime lastVerifiedAt;

    @PrePersist
    public void prePersist() {
        if (this.lastVerifiedAt == null) {
            this.lastVerifiedAt = OffsetDateTime.now();
        }
        if (this.status == null) {
            this.status = "ACTIVE";
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

    public String getIecNumber() {
        return iecNumber;
    }

    public void setIecNumber(String iecNumber) {
        this.iecNumber = iecNumber;
    }

    public String getPcbConsentNumber() {
        return pcbConsentNumber;
    }

    public void setPcbConsentNumber(String pcbConsentNumber) {
        this.pcbConsentNumber = pcbConsentNumber;
    }

    public String getUdyamNumber() {
        return udyamNumber;
    }

    public void setUdyamNumber(String udyamNumber) {
        this.udyamNumber = udyamNumber;
    }

    public String getIssuingAuthority() {
        return issuingAuthority;
    }

    public void setIssuingAuthority(String issuingAuthority) {
        this.issuingAuthority = issuingAuthority;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public OffsetDateTime getLastVerifiedAt() {
        return lastVerifiedAt;
    }

    public void setLastVerifiedAt(OffsetDateTime lastVerifiedAt) {
        this.lastVerifiedAt = lastVerifiedAt;
    }
}
