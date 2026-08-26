package com.vastrasetu.app.domain;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "monthly_sustainability_snapshots")
public class MonthlySustainabilitySnapshot {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "msme_id", nullable = false)
    private MsmeAccount msmeAccount;

    @Column(name = "snapshot_month", nullable = false)
    private LocalDate snapshotMonth;

    @Column(name = "electricity_kwh")
    private Double electricityKwh = 3960.0;

    @Column(name = "water_litres")
    private Double waterLitres = 260000.0;

    @Column(name = "production_units")
    private Double productionUnits = 1400.0;

    @Column(name = "carbon_kg_estimated")
    private Double carbonKgEstimated = 2835.36; // electricity_kwh * 0.716 (CEA India Grid Emission Factor)

    @Column(name = "source_document_ids", columnDefinition = "TEXT")
    private String sourceDocumentIds;

    @Column(name = "created_at")
    private OffsetDateTime createdAt = OffsetDateTime.now();

    public MonthlySustainabilitySnapshot() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public MsmeAccount getMsmeAccount() { return msmeAccount; }
    public void setMsmeAccount(MsmeAccount msmeAccount) { this.msmeAccount = msmeAccount; }

    public LocalDate getSnapshotMonth() { return snapshotMonth; }
    public void setSnapshotMonth(LocalDate snapshotMonth) { this.snapshotMonth = snapshotMonth; }

    public Double getElectricityKwh() { return electricityKwh; }
    public void setElectricityKwh(Double electricityKwh) { 
        this.electricityKwh = electricityKwh;
        this.carbonKgEstimated = electricityKwh != null ? electricityKwh * 0.716 : 0.0;
    }

    public Double getWaterLitres() { return waterLitres; }
    public void setWaterLitres(Double waterLitres) { this.waterLitres = waterLitres; }

    public Double getProductionUnits() { return productionUnits; }
    public void setProductionUnits(Double productionUnits) { this.productionUnits = productionUnits; }

    public Double getCarbonKgEstimated() { return carbonKgEstimated; }
    public void setCarbonKgEstimated(Double carbonKgEstimated) { this.carbonKgEstimated = carbonKgEstimated; }

    public String getSourceDocumentIds() { return sourceDocumentIds; }
    public void setSourceDocumentIds(String sourceDocumentIds) { this.sourceDocumentIds = sourceDocumentIds; }

    public OffsetDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }
}
