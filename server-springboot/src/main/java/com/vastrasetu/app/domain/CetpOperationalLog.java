package com.vastrasetu.app.domain;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "cetp_operational_logs")
public class CetpOperationalLog {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(name = "cetp_id", nullable = false)
    private String cetpId;

    @Column(name = "log_date", nullable = false)
    private LocalDate logDate;

    @Column(name = "shift", nullable = false)
    private String shift; // MORNING, EVENING, NIGHT

    @Column(name = "ro_permeate_flow_kld", nullable = false)
    private Double roPermeateFlowKld; // e.g. 1178.0 m3/day

    @Column(name = "ro_recovery_percent", nullable = false)
    private Double roRecoveryPercent; // e.g. 94.2 %

    @Column(name = "bod_cod_reduction_percent", nullable = false)
    private Double bodCodReductionPercent; // e.g. 98.5 %

    @Column(name = "mee_crystallization_rate", nullable = false)
    private Double meeCrystallizationRate; // e.g. 8.4 Tons/day

    @Column(name = "salt_recovered_kg", nullable = false)
    private Double saltRecoveredKg; // e.g. 8400 kg

    @Column(name = "inlet_tds_ppm")
    private Double inletTdsPpm; // e.g. 6800 ppm

    @Column(name = "permeate_tds_ppm")
    private Double permeateTdsPpm; // e.g. 120 ppm

    @Column(name = "logged_by")
    private String loggedBy;

    @Column(name = "logged_at")
    private OffsetDateTime loggedAt;

    @PrePersist
    public void prePersist() {
        if (this.loggedAt == null) {
            this.loggedAt = OffsetDateTime.now();
        }
        if (this.logDate == null) {
            this.logDate = LocalDate.now();
        }
    }

    // Getters and Setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getCetpId() {
        return cetpId;
    }

    public void setCetpId(String cetpId) {
        this.cetpId = cetpId;
    }

    public LocalDate getLogDate() {
        return logDate;
    }

    public void setLogDate(LocalDate logDate) {
        this.logDate = logDate;
    }

    public String getShift() {
        return shift;
    }

    public void setShift(String shift) {
        this.shift = shift;
    }

    public Double getRoPermeateFlowKld() {
        return roPermeateFlowKld;
    }

    public void setRoPermeateFlowKld(Double roPermeateFlowKld) {
        this.roPermeateFlowKld = roPermeateFlowKld;
    }

    public Double getRoRecoveryPercent() {
        return roRecoveryPercent;
    }

    public void setRoRecoveryPercent(Double roRecoveryPercent) {
        this.roRecoveryPercent = roRecoveryPercent;
    }

    public Double getBodCodReductionPercent() {
        return bodCodReductionPercent;
    }

    public void setBodCodReductionPercent(Double bodCodReductionPercent) {
        this.bodCodReductionPercent = bodCodReductionPercent;
    }

    public Double getMeeCrystallizationRate() {
        return meeCrystallizationRate;
    }

    public void setMeeCrystallizationRate(Double meeCrystallizationRate) {
        this.meeCrystallizationRate = meeCrystallizationRate;
    }

    public Double getSaltRecoveredKg() {
        return saltRecoveredKg;
    }

    public void setSaltRecoveredKg(Double saltRecoveredKg) {
        this.saltRecoveredKg = saltRecoveredKg;
    }

    public Double getInletTdsPpm() {
        return inletTdsPpm;
    }

    public void setInletTdsPpm(Double inletTdsPpm) {
        this.inletTdsPpm = inletTdsPpm;
    }

    public Double getPermeateTdsPpm() {
        return permeateTdsPpm;
    }

    public void setPermeateTdsPpm(Double permeateTdsPpm) {
        this.permeateTdsPpm = permeateTdsPpm;
    }

    public String getLoggedBy() {
        return loggedBy;
    }

    public void setLoggedBy(String loggedBy) {
        this.loggedBy = loggedBy;
    }

    public OffsetDateTime getLoggedAt() {
        return loggedAt;
    }

    public void setLoggedAt(OffsetDateTime loggedAt) {
        this.loggedAt = loggedAt;
    }
}
