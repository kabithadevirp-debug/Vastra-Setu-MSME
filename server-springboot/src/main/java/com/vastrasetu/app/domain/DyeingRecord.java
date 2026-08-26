package com.vastrasetu.app.domain;

import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "dyeing_records")
public class DyeingRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(name = "batch_id", nullable = false, length = 80)
    private String batchId;

    @Column(name = "passport_id")
    private UUID passportId;

    @Column(name = "dye_house", length = 150)
    private String dyeHouse;

    @Column(name = "recipe", length = 200)
    private String recipe;

    @Column(name = "dye_type", length = 100)
    private String dyeType;

    @Column(name = "dye_process_name", length = 100)
    private String dyeProcessName;

    @Column(name = "temperature_c")
    private Integer temperatureC;

    @Column(name = "oeko_tex_cert_no", length = 100)
    private String oekoTexCertNo;

    @Column(name = "chemical_compliance", length = 200)
    private String chemicalCompliance;

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

    public DyeingRecord() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getBatchId() { return batchId; }
    public void setBatchId(String batchId) { this.batchId = batchId; }

    public UUID getPassportId() { return passportId; }
    public void setPassportId(UUID passportId) { this.passportId = passportId; }

    public String getDyeHouse() { return dyeHouse; }
    public void setDyeHouse(String dyeHouse) { this.dyeHouse = dyeHouse; }

    public String getRecipe() { return recipe; }
    public void setRecipe(String recipe) { this.recipe = recipe; }

    public String getDyeType() { return dyeType; }
    public void setDyeType(String dyeType) { this.dyeType = dyeType; }

    public String getDyeProcessName() { return dyeProcessName; }
    public void setDyeProcessName(String dyeProcessName) { this.dyeProcessName = dyeProcessName; }

    public Integer getTemperatureC() { return temperatureC; }
    public void setTemperatureC(Integer temperatureC) { this.temperatureC = temperatureC; }

    public String getOekoTexCertNo() { return oekoTexCertNo; }
    public void setOekoTexCertNo(String oekoTexCertNo) { this.oekoTexCertNo = oekoTexCertNo; }

    public String getChemicalCompliance() { return chemicalCompliance; }
    public void setChemicalCompliance(String chemicalCompliance) { this.chemicalCompliance = chemicalCompliance; }

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
