package com.vastrasetu.app.domain;

import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "merkle_batches")
public class MerkleBatch {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(name = "batch_id", length = 80)
    private String batchId;

    @Column(name = "batch_date")
    private OffsetDateTime batchDate = OffsetDateTime.now();

    @Column(name = "passport_ids", columnDefinition = "TEXT")
    private String passportIds; // JSON ordered list of passport UUIDs

    @Column(name = "merkle_root", length = 100)
    private String merkleRoot; // SHA-256 hex string

    @Column(name = "polygon_tx_hash", length = 120)
    private String polygonTxHash;

    @Column(name = "polygon_contract_address", length = 120)
    private String polygonContractAddress = "0x8891A9280192841920D91C28192819203819284F";

    @Column(name = "status", length = 30)
    private String status = "OPEN"; // OPEN, ROOT_COMPUTED, ANCHORED_ON_CHAIN

    @Column(name = "created_at")
    private OffsetDateTime createdAt = OffsetDateTime.now();

    @Column(name = "anchored_at")
    private OffsetDateTime anchoredAt;

    public MerkleBatch() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getBatchId() { return batchId; }
    public void setBatchId(String batchId) { this.batchId = batchId; }

    public OffsetDateTime getBatchDate() { return batchDate; }
    public void setBatchDate(OffsetDateTime batchDate) { this.batchDate = batchDate; }

    public String getPassportIds() { return passportIds; }
    public void setPassportIds(String passportIds) { this.passportIds = passportIds; }

    public String getMerkleRoot() { return merkleRoot; }
    public void setMerkleRoot(String merkleRoot) { this.merkleRoot = merkleRoot; }

    public String getPolygonTxHash() { return polygonTxHash; }
    public void setPolygonTxHash(String polygonTxHash) { this.polygonTxHash = polygonTxHash; }

    public String getPolygonContractAddress() { return polygonContractAddress; }
    public void setPolygonContractAddress(String polygonContractAddress) { this.polygonContractAddress = polygonContractAddress; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public OffsetDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }

    public OffsetDateTime getAnchoredAt() { return anchoredAt; }
    public void setAnchoredAt(OffsetDateTime anchoredAt) { this.anchoredAt = anchoredAt; }
}
