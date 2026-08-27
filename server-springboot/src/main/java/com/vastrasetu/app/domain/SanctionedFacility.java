package com.vastrasetu.app.domain;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "sanctioned_facilities")
public class SanctionedFacility {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(name = "msme_id", nullable = false)
    private String msmeId;

    @Column(name = "msme_name", nullable = false)
    private String msmeName;

    @Column(name = "gstin", nullable = false)
    private String gstin;

    @Column(name = "bank_id", nullable = false)
    private String bankId; // e.g. State Bank of India - Green Lending Desk

    @Column(name = "facility_type", nullable = false)
    private String facilityType; // TERM_LOAN, WORKING_CAPITAL_EXPORT_CREDIT, SOLAR_ROOFTOP_EQUIPMENT_FINANCING

    @Column(name = "sanctioned_amount", nullable = false)
    private Double sanctionedAmount; // e.g. 25000000.0 (Rs. 2.50 Cr)

    @Column(name = "base_interest_rate", nullable = false)
    private Double baseInterestRate; // e.g. 9.50%

    @Column(name = "green_discount_applied", nullable = false)
    private Double greenDiscountApplied; // e.g. 1.25%

    @Column(name = "effective_interest_rate", nullable = false)
    private Double effectiveInterestRate; // e.g. 8.25%

    @Column(name = "trust_score_at_sanction", nullable = false)
    private Integer trustScoreAtSanction; // e.g. 94

    @Column(name = "tenure_months", nullable = false)
    private Integer tenureMonths; // e.g. 36

    @Column(name = "sanction_date", nullable = false)
    private LocalDate sanctionDate;

    @Column(name = "sanction_letter_ref", nullable = false)
    private String sanctionLetterRef; // e.g. SBI/GRN/2026/0912

    @Column(name = "status")
    private String status; // ACTIVE, DISBURSED, CLOSED

    @Column(name = "created_at")
    private OffsetDateTime createdAt;

    @PrePersist
    public void prePersist() {
        if (this.createdAt == null) {
            this.createdAt = OffsetDateTime.now();
        }
        if (this.sanctionDate == null) {
            this.sanctionDate = LocalDate.now();
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

    public String getBankId() {
        return bankId;
    }

    public void setBankId(String bankId) {
        this.bankId = bankId;
    }

    public String getFacilityType() {
        return facilityType;
    }

    public void setFacilityType(String facilityType) {
        this.facilityType = facilityType;
    }

    public Double getSanctionedAmount() {
        return sanctionedAmount;
    }

    public void setSanctionedAmount(Double sanctionedAmount) {
        this.sanctionedAmount = sanctionedAmount;
    }

    public Double getBaseInterestRate() {
        return baseInterestRate;
    }

    public void setBaseInterestRate(Double baseInterestRate) {
        this.baseInterestRate = baseInterestRate;
    }

    public Double getGreenDiscountApplied() {
        return greenDiscountApplied;
    }

    public void setGreenDiscountApplied(Double greenDiscountApplied) {
        this.greenDiscountApplied = greenDiscountApplied;
    }

    public Double getEffectiveInterestRate() {
        return effectiveInterestRate;
    }

    public void setEffectiveInterestRate(Double effectiveInterestRate) {
        this.effectiveInterestRate = effectiveInterestRate;
    }

    public Integer getTrustScoreAtSanction() {
        return trustScoreAtSanction;
    }

    public void setTrustScoreAtSanction(Integer trustScoreAtSanction) {
        this.trustScoreAtSanction = trustScoreAtSanction;
    }

    public Integer getTenureMonths() {
        return tenureMonths;
    }

    public void setTenureMonths(Integer tenureMonths) {
        this.tenureMonths = tenureMonths;
    }

    public LocalDate getSanctionDate() {
        return sanctionDate;
    }

    public void setSanctionDate(LocalDate sanctionDate) {
        this.sanctionDate = sanctionDate;
    }

    public String getSanctionLetterRef() {
        return sanctionLetterRef;
    }

    public void setSanctionLetterRef(String sanctionLetterRef) {
        this.sanctionLetterRef = sanctionLetterRef;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(OffsetDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
