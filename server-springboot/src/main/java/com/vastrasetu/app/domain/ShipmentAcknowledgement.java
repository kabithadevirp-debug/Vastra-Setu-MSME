package com.vastrasetu.app.domain;

import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "shipment_acknowledgements")
public class ShipmentAcknowledgement {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(name = "shipment_number", unique = true, nullable = false, length = 80)
    private String shipmentNumber; // e.g. SHIP-2026-0087

    @Column(name = "batch_number", nullable = false, length = 80)
    private String batchNumber; // e.g. VS-2026-B00041

    @Column(name = "passport_id", length = 80)
    private String passportId;

    @Column(name = "receiver_name", nullable = false, length = 150)
    private String receiverName; // e.g. ABC Fashion GmbH

    @Column(name = "receiver_email", length = 100)
    private String receiverEmail = "imports@abcfashion.de";

    @Column(name = "destination_country", length = 100)
    private String destinationCountry = "Germany";

    @Column(name = "destination_port", length = 100)
    private String destinationPort = "Hamburg Port";

    @Column(name = "transport_mode", length = 30)
    private String transportMode = "SEA"; // SEA, AIR, ROAD

    @Column(name = "incoterm", length = 30)
    private String incoterm = "CIF"; // CIF, FOB, CFR, EXW, DDP

    @Column(name = "preferential_origin_claim")
    private Boolean preferentialOriginClaim = true;

    @Column(name = "lut_applicable")
    private Boolean lutApplicable = true;

    @Column(name = "export_readiness_score")
    private Integer exportReadinessScore = 92;

    @Column(name = "readiness_breakdown", columnDefinition = "TEXT")
    private String readinessBreakdown;

    @Column(name = "document_checklist", columnDefinition = "TEXT")
    private String documentChecklist;

    @Column(name = "expected_quantity", nullable = false)
    private Integer expectedQuantity; // e.g. 5000

    @Column(name = "received_quantity")
    private Integer receivedQuantity; // e.g. 5000 or 4950

    @Column(name = "discrepancy_difference")
    private Integer discrepancyDifference = 0; // expected - received

    @Column(name = "confirmation_token", unique = true, nullable = false, length = 100)
    private String confirmationToken; // Secure URL token for zero-login confirmation

    @Column(name = "status", length = 30)
    private String status = "PENDING"; // PENDING, RECEIVED, PARTIALLY_RECEIVED, DISPUTED

    @Column(name = "discrepancy_remarks", columnDefinition = "TEXT")
    private String discrepancyRemarks;

    @Column(name = "acknowledged_by", length = 100)
    private String acknowledgedBy;

    @Column(name = "acknowledged_at")
    private OffsetDateTime acknowledgedAt;

    @Column(name = "created_at")
    private OffsetDateTime createdAt = OffsetDateTime.now();

    public ShipmentAcknowledgement() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getShipmentNumber() { return shipmentNumber; }
    public void setShipmentNumber(String shipmentNumber) { this.shipmentNumber = shipmentNumber; }

    public String getBatchNumber() { return batchNumber; }
    public void setBatchNumber(String batchNumber) { this.batchNumber = batchNumber; }

    public String getPassportId() { return passportId; }
    public void setPassportId(String passportId) { this.passportId = passportId; }

    public String getReceiverName() { return receiverName; }
    public void setReceiverName(String receiverName) { this.receiverName = receiverName; }

    public String getReceiverEmail() { return receiverEmail; }
    public void setReceiverEmail(String receiverEmail) { this.receiverEmail = receiverEmail; }

    public String getDestinationCountry() { return destinationCountry; }
    public void setDestinationCountry(String destinationCountry) { this.destinationCountry = destinationCountry; }

    public String getDestinationPort() { return destinationPort; }
    public void setDestinationPort(String destinationPort) { this.destinationPort = destinationPort; }

    public String getTransportMode() { return transportMode; }
    public void setTransportMode(String transportMode) { this.transportMode = transportMode; }

    public String getIncoterm() { return incoterm; }
    public void setIncoterm(String incoterm) { this.incoterm = incoterm; }

    public Boolean getPreferentialOriginClaim() { return preferentialOriginClaim; }
    public void setPreferentialOriginClaim(Boolean preferentialOriginClaim) { this.preferentialOriginClaim = preferentialOriginClaim; }

    public Boolean getLutApplicable() { return lutApplicable; }
    public void setLutApplicable(Boolean lutApplicable) { this.lutApplicable = lutApplicable; }

    public Integer getExportReadinessScore() { return exportReadinessScore; }
    public void setExportReadinessScore(Integer exportReadinessScore) { this.exportReadinessScore = exportReadinessScore; }

    public String getReadinessBreakdown() { return readinessBreakdown; }
    public void setReadinessBreakdown(String readinessBreakdown) { this.readinessBreakdown = readinessBreakdown; }

    public String getDocumentChecklist() { return documentChecklist; }
    public void setDocumentChecklist(String documentChecklist) { this.documentChecklist = documentChecklist; }

    public Integer getExpectedQuantity() { return expectedQuantity; }
    public void setExpectedQuantity(Integer expectedQuantity) { this.expectedQuantity = expectedQuantity; }

    public Integer getReceivedQuantity() { return receivedQuantity; }
    public void setReceivedQuantity(Integer receivedQuantity) { this.receivedQuantity = receivedQuantity; }

    public Integer getDiscrepancyDifference() { return discrepancyDifference; }
    public void setDiscrepancyDifference(Integer discrepancyDifference) { this.discrepancyDifference = discrepancyDifference; }

    public String getConfirmationToken() { return confirmationToken; }
    public void setConfirmationToken(String confirmationToken) { this.confirmationToken = confirmationToken; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getDiscrepancyRemarks() { return discrepancyRemarks; }
    public void setDiscrepancyRemarks(String discrepancyRemarks) { this.discrepancyRemarks = discrepancyRemarks; }

    public String getAcknowledgedBy() { return acknowledgedBy; }
    public void setAcknowledgedBy(String acknowledgedBy) { this.acknowledgedBy = acknowledgedBy; }

    public OffsetDateTime getAcknowledgedAt() { return acknowledgedAt; }
    public void setAcknowledgedAt(OffsetDateTime acknowledgedAt) { this.acknowledgedAt = acknowledgedAt; }

    public OffsetDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }
}
