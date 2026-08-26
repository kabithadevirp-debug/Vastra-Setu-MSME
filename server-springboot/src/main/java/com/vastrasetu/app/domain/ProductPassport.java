package com.vastrasetu.app.domain;

import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "product_passports")
public class ProductPassport {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "msme_id", nullable = false)
    private MsmeAccount msmeAccount;

    @Column(name = "product_name", nullable = false)
    private String productName;

    @Column(name = "batch_id", nullable = false, length = 80)
    private String batchId;

    @Column(name = "stage_details", columnDefinition = "TEXT")
    private String stageDetails; // JSON: yarn, dyeing, weaving, garmenting details

    @Column(name = "carbon_kg")
    private Double carbonKg = 2.84;

    @Column(name = "water_litres")
    private Double waterLitres = 186.4;

    @Column(name = "source_document_ids", columnDefinition = "TEXT")
    private String sourceDocumentIds; // JSON array of verified OperationalDocument IDs

    @Column(name = "passport_hash", length = 100)
    private String passportHash; // SHA-256 hex string

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "merkle_batch_id")
    private MerkleBatch merkleBatch;

    @Column(name = "merkle_proof", columnDefinition = "TEXT")
    private String merkleProof; // JSON sibling path for Buyer verification

    @Column(name = "status", length = 30)
    private String status = "DRAFT"; // DRAFT, HASHED, ANCHORED

    @Column(name = "qr_code_url", columnDefinition = "TEXT")
    private String qrCodeUrl;

    @Column(name = "created_at")
    private OffsetDateTime createdAt = OffsetDateTime.now();

    @Column(name = "anchored_at")
    private OffsetDateTime anchoredAt;

    public ProductPassport() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public MsmeAccount getMsmeAccount() { return msmeAccount; }
    public void setMsmeAccount(MsmeAccount msmeAccount) { this.msmeAccount = msmeAccount; }

    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }

    public String getBatchId() { return batchId; }
    public void setBatchId(String batchId) { this.batchId = batchId; }

    public String getStageDetails() { return stageDetails; }
    public void setStageDetails(String stageDetails) { this.stageDetails = stageDetails; }

    public Double getCarbonKg() { return carbonKg; }
    public void setCarbonKg(Double carbonKg) { this.carbonKg = carbonKg; }

    public Double getWaterLitres() { return waterLitres; }
    public void setWaterLitres(Double waterLitres) { this.waterLitres = waterLitres; }

    public String getSourceDocumentIds() { return sourceDocumentIds; }
    public void setSourceDocumentIds(String sourceDocumentIds) { this.sourceDocumentIds = sourceDocumentIds; }

    public String getPassportHash() { return passportHash; }
    public void setPassportHash(String passportHash) { this.passportHash = passportHash; }

    public MerkleBatch getMerkleBatch() { return merkleBatch; }
    public void setMerkleBatch(MerkleBatch merkleBatch) { this.merkleBatch = merkleBatch; }

    public String getMerkleProof() { return merkleProof; }
    public void setMerkleProof(String merkleProof) { this.merkleProof = merkleProof; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getQrCodeUrl() { return qrCodeUrl; }
    public void setQrCodeUrl(String qrCodeUrl) { this.qrCodeUrl = qrCodeUrl; }

    public OffsetDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }

    public OffsetDateTime getAnchoredAt() { return anchoredAt; }
    public void setAnchoredAt(OffsetDateTime anchoredAt) { this.anchoredAt = anchoredAt; }
}
