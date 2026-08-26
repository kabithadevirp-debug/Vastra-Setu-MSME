package com.vastrasetu.app.domain;

import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "garment_batches")
public class GarmentBatch {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(name = "batch_number", unique = true, nullable = false, length = 80)
    private String batchNumber; // e.g. VS-2026-B00041

    @Column(name = "product_name", nullable = false)
    private String productName; // e.g. Organic Cotton T-Shirt

    @Column(name = "style_code", length = 80)
    private String styleCode; // e.g. TS-26-ORG-01

    @Column(name = "quantity", nullable = false)
    private Integer quantity; // e.g. 5000

    @Column(name = "fabric_composition", length = 255)
    private String fabricComposition = "100% Organic Cotton (180 GSM)";

    @Column(name = "buyer_name", length = 150)
    private String buyerName = "ABC Fashion GmbH";

    @Column(name = "target_country", length = 100)
    private String targetCountry = "Germany";

    @Column(name = "destination_port", length = 100)
    private String destinationPort = "Hamburg Port";

    @Column(name = "manufacturer_name", length = 150)
    private String manufacturerName = "Sri Jayavarma Knits & Exports Pvt Ltd";

    @Column(name = "manufacturer_gstin", length = 20)
    private String manufacturerGstin = "33AAACJ1928A1Z5";

    @Column(name = "manufacturer_location", length = 150)
    private String manufacturerLocation = "Tiruppur Textile Cluster, Tamil Nadu, India";

    // Configurable Garment Production Journey (JSON array of stages)
    @Column(name = "journey_stages", columnDefinition = "TEXT")
    private String journeyStages;

    // Attached Supporting Evidence & Extracted Fields (JSON array of documents)
    @Column(name = "evidence_list", columnDefinition = "TEXT")
    private String evidenceList;

    // Consistency & Traceability Anomaly Evaluation (JSON)
    @Column(name = "consistency_report", columnDefinition = "TEXT")
    private String consistencyReport;

    // Traceability Readiness Score (0-100)
    @Column(name = "readiness_score")
    private Integer readinessScore = 86;

    @Column(name = "readiness_status", length = 30)
    private String readinessStatus = "READY"; // READY, ACTION_REQUIRED

    // Environmental Footprint Indicators
    @Column(name = "carbon_kg_per_piece")
    private Double carbonKgPerPiece = 2.45;

    @Column(name = "water_litres_per_piece")
    private Double waterLitresPerPiece = 142.0;

    @Column(name = "water_recycled_percent")
    private Double waterRecycledPercent = 94.2;

    // Passport & Versioning
    @Column(name = "passport_version")
    private Integer passportVersion = 1;

    @Column(name = "passport_hash", length = 100)
    private String passportHash;

    @Column(name = "merkle_root", length = 100)
    private String merkleRoot;

    @Column(name = "polygon_tx_hash", length = 120)
    private String polygonTxHash;

    @Column(name = "qr_code_url", columnDefinition = "TEXT")
    private String qrCodeUrl;

    @Column(name = "status", length = 30)
    private String status = "PASSPORT_READY"; // DRAFT, PASSPORT_READY, ISSUED, SHIPPED, RECEIVED, DISPUTED

    @Column(name = "created_at")
    private OffsetDateTime createdAt = OffsetDateTime.now();

    @Column(name = "updated_at")
    private OffsetDateTime updatedAt = OffsetDateTime.now();

    public GarmentBatch() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getBatchNumber() { return batchNumber; }
    public void setBatchNumber(String batchNumber) { this.batchNumber = batchNumber; }

    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }

    public String getStyleCode() { return styleCode; }
    public void setStyleCode(String styleCode) { this.styleCode = styleCode; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public String getFabricComposition() { return fabricComposition; }
    public void setFabricComposition(String fabricComposition) { this.fabricComposition = fabricComposition; }

    public String getBuyerName() { return buyerName; }
    public void setBuyerName(String buyerName) { this.buyerName = buyerName; }

    public String getTargetCountry() { return targetCountry; }
    public void setTargetCountry(String targetCountry) { this.targetCountry = targetCountry; }

    public String getDestinationPort() { return destinationPort; }
    public void setDestinationPort(String destinationPort) { this.destinationPort = destinationPort; }

    public String getManufacturerName() { return manufacturerName; }
    public void setManufacturerName(String manufacturerName) { this.manufacturerName = manufacturerName; }

    public String getManufacturerGstin() { return manufacturerGstin; }
    public void setManufacturerGstin(String manufacturerGstin) { this.manufacturerGstin = manufacturerGstin; }

    public String getManufacturerLocation() { return manufacturerLocation; }
    public void setManufacturerLocation(String manufacturerLocation) { this.manufacturerLocation = manufacturerLocation; }

    public String getJourneyStages() { return journeyStages; }
    public void setJourneyStages(String journeyStages) { this.journeyStages = journeyStages; }

    public String getEvidenceList() { return evidenceList; }
    public void setEvidenceList(String evidenceList) { this.evidenceList = evidenceList; }

    public String getConsistencyReport() { return consistencyReport; }
    public void setConsistencyReport(String consistencyReport) { this.consistencyReport = consistencyReport; }

    public Integer getReadinessScore() { return readinessScore; }
    public void setReadinessScore(Integer readinessScore) { this.readinessScore = readinessScore; }

    public String getReadinessStatus() { return readinessStatus; }
    public void setReadinessStatus(String readinessStatus) { this.readinessStatus = readinessStatus; }

    public Double getCarbonKgPerPiece() { return carbonKgPerPiece; }
    public void setCarbonKgPerPiece(Double carbonKgPerPiece) { this.carbonKgPerPiece = carbonKgPerPiece; }

    public Double getWaterLitresPerPiece() { return waterLitresPerPiece; }
    public void setWaterLitresPerPiece(Double waterLitresPerPiece) { this.waterLitresPerPiece = waterLitresPerPiece; }

    public Double getWaterRecycledPercent() { return waterRecycledPercent; }
    public void setWaterRecycledPercent(Double waterRecycledPercent) { this.waterRecycledPercent = waterRecycledPercent; }

    public Integer getPassportVersion() { return passportVersion; }
    public void setPassportVersion(Integer passportVersion) { this.passportVersion = passportVersion; }

    public String getPassportHash() { return passportHash; }
    public void setPassportHash(String passportHash) { this.passportHash = passportHash; }

    public String getMerkleRoot() { return merkleRoot; }
    public void setMerkleRoot(String merkleRoot) { this.merkleRoot = merkleRoot; }

    public String getPolygonTxHash() { return polygonTxHash; }
    public void setPolygonTxHash(String polygonTxHash) { this.polygonTxHash = polygonTxHash; }

    public String getQrCodeUrl() { return qrCodeUrl; }
    public void setQrCodeUrl(String qrCodeUrl) { this.qrCodeUrl = qrCodeUrl; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public OffsetDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }

    public OffsetDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(OffsetDateTime updatedAt) { this.updatedAt = updatedAt; }
}
