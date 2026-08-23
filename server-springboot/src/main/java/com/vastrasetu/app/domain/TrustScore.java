package com.vastrasetu.app.domain;

import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "trust_scores")
public class TrustScore {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "msme_id", nullable = false)
    private MsmeAccount msmeAccount;

    @Column(name = "composite_score")
    private Integer compositeScore = 94;

    @Column(name = "identity_pillar")
    private Integer identityPillar = 100; // 25% weight

    @Column(name = "document_pillar")
    private Integer documentPillar = 92; // 25% weight

    @Column(name = "compliance_pillar")
    private Integer compliancePillar = 95; // 25% weight

    @Column(name = "consistency_pillar")
    private Integer consistencyPillar = 90; // 25% weight

    @Column(name = "calculated_at")
    private OffsetDateTime calculatedAt = OffsetDateTime.now();

    public TrustScore() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public MsmeAccount getMsmeAccount() { return msmeAccount; }
    public void setMsmeAccount(MsmeAccount msmeAccount) { this.msmeAccount = msmeAccount; }

    public Integer getCompositeScore() { return compositeScore; }
    public void setCompositeScore(Integer compositeScore) { this.compositeScore = compositeScore; }

    public Integer getIdentityPillar() { return identityPillar; }
    public void setIdentityPillar(Integer identityPillar) { this.identityPillar = identityPillar; }

    public Integer getDocumentPillar() { return documentPillar; }
    public void setDocumentPillar(Integer documentPillar) { this.documentPillar = documentPillar; }

    public Integer getCompliancePillar() { return compliancePillar; }
    public void setCompliancePillar(Integer compliancePillar) { this.compliancePillar = compliancePillar; }

    public Integer getConsistencyPillar() { return consistencyPillar; }
    public void setConsistencyPillar(Integer consistencyPillar) { this.consistencyPillar = consistencyPillar; }

    public OffsetDateTime getCalculatedAt() { return calculatedAt; }
    public void setCalculatedAt(OffsetDateTime calculatedAt) { this.calculatedAt = calculatedAt; }
}
