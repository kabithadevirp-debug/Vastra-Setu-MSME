package com.vastrasetu.app.domain;

import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "cetp_records")
public class CetpRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(name = "batch_id", nullable = false, length = 80)
    private String batchId;

    @Column(name = "passport_id")
    private UUID passportId;

    @Column(name = "cetp_facility", length = 150)
    private String cetpFacility;

    @Column(name = "treatment_method", length = 150)
    private String treatmentMethod;

    @Column(name = "zld_status", length = 100)
    private String zldStatus;

    @Column(name = "water_recycled_percent")
    private Double waterRecycledPercent = 94.2;

    @Column(name = "bod_cod_reduction_percent")
    private Double bodCodReductionPercent = 98.5;

    @Column(name = "brine_recovery_percent")
    private Double brineRecoveryPercent = 95.0;

    @Column(name = "tnpcb_consent_no", length = 100)
    private String tnpcbConsentNo;

    @Column(name = "certificate_no", length = 100)
    private String certificateNo;

    @Column(name = "certificate_url", columnDefinition = "TEXT")
    private String certificateUrl;

    @Column(name = "ocr_verified")
    private Boolean ocrVerified = true;

    @Column(name = "verified_by", length = 150)
    private String verifiedBy;

    @Column(name = "completed_at")
    private OffsetDateTime completedAt = OffsetDateTime.now();

    @Column(name = "created_at")
    private OffsetDateTime createdAt = OffsetDateTime.now();

    public CetpRecord() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getBatchId() { return batchId; }
    public void setBatchId(String batchId) { this.batchId = batchId; }

    public UUID getPassportId() { return passportId; }
    public void setPassportId(UUID passportId) { this.passportId = passportId; }

    public String getCetpFacility() { return cetpFacility; }
    public void setCetpFacility(String cetpFacility) { this.cetpFacility = cetpFacility; }

    public String getTreatmentMethod() { return treatmentMethod; }
    public void setTreatmentMethod(String treatmentMethod) { this.treatmentMethod = treatmentMethod; }

    public String getZldStatus() { return zldStatus; }
    public void setZldStatus(String zldStatus) { this.zldStatus = zldStatus; }

    public Double getWaterRecycledPercent() { return waterRecycledPercent; }
    public void setWaterRecycledPercent(Double waterRecycledPercent) { this.waterRecycledPercent = waterRecycledPercent; }

    public Double getBodCodReductionPercent() { return bodCodReductionPercent; }
    public void setBodCodReductionPercent(Double bodCodReductionPercent) { this.bodCodReductionPercent = bodCodReductionPercent; }

    public Double getBrineRecoveryPercent() { return brineRecoveryPercent; }
    public void setBrineRecoveryPercent(Double brineRecoveryPercent) { this.brineRecoveryPercent = brineRecoveryPercent; }

    public String getTnpcbConsentNo() { return tnpcbConsentNo; }
    public void setTnpcbConsentNo(String tnpcbConsentNo) { this.tnpcbConsentNo = tnpcbConsentNo; }

    public String getCertificateNo() { return certificateNo; }
    public void setCertificateNo(String certificateNo) { this.certificateNo = certificateNo; }

    public String getCertificateUrl() { return certificateUrl; }
    public void setCertificateUrl(String certificateUrl) { this.certificateUrl = certificateUrl; }

    public Boolean getOcrVerified() { return ocrVerified; }
    public void setOcrVerified(Boolean ocrVerified) { this.ocrVerified = ocrVerified; }

    public String getVerifiedBy() { return verifiedBy; }
    public void setVerifiedBy(String verifiedBy) { this.verifiedBy = verifiedBy; }

    public OffsetDateTime getCompletedAt() { return completedAt; }
    public void setCompletedAt(OffsetDateTime completedAt) { this.completedAt = completedAt; }

    public OffsetDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }
}
