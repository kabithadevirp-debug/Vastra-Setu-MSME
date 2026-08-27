package com.vastrasetu.app.domain;

import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "dyestuff_inventory")
public class DyestuffInventory {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(name = "dyer_id", nullable = false)
    private String dyerId;

    @Column(name = "chemical_name", nullable = false)
    private String chemicalName;

    @Column(name = "chemical_type", nullable = false)
    private String chemicalType; // REACTIVE, NATURAL, AZO_FREE, AUXILIARY

    @Column(name = "oeko_tex_class")
    private String oekoTexClass; // CLASS_I, CLASS_II, CLASS_III

    @Column(name = "zdhc_mrsl_level")
    private String zdhcMrslLevel; // LEVEL_1, LEVEL_2, LEVEL_3

    @Column(name = "quantity_available", nullable = false)
    private Double quantityAvailable;

    @Column(name = "unit", nullable = false)
    private String unit; // KG, LITERS

    @Column(name = "supplier_name")
    private String supplierName;

    @Column(name = "batch_lot_number")
    private String batchLotNumber;

    @Column(name = "last_restocked_at")
    private OffsetDateTime lastRestockedAt;

    @Column(name = "created_at")
    private OffsetDateTime createdAt;

    @PrePersist
    public void prePersist() {
        if (this.createdAt == null) {
            this.createdAt = OffsetDateTime.now();
        }
        if (this.lastRestockedAt == null) {
            this.lastRestockedAt = OffsetDateTime.now();
        }
    }

    // Getters and Setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getDyerId() {
        return dyerId;
    }

    public void setDyerId(String dyerId) {
        this.dyerId = dyerId;
    }

    public String getChemicalName() {
        return chemicalName;
    }

    public void setChemicalName(String chemicalName) {
        this.chemicalName = chemicalName;
    }

    public String getChemicalType() {
        return chemicalType;
    }

    public void setChemicalType(String chemicalType) {
        this.chemicalType = chemicalType;
    }

    public String getOekoTexClass() {
        return oekoTexClass;
    }

    public void setOekoTexClass(String oekoTexClass) {
        this.oekoTexClass = oekoTexClass;
    }

    public String getZdhcMrslLevel() {
        return zdhcMrslLevel;
    }

    public void setZdhcMrslLevel(String zdhcMrslLevel) {
        this.zdhcMrslLevel = zdhcMrslLevel;
    }

    public Double getQuantityAvailable() {
        return quantityAvailable;
    }

    public void setQuantityAvailable(Double quantityAvailable) {
        this.quantityAvailable = quantityAvailable;
    }

    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }

    public String getSupplierName() {
        return supplierName;
    }

    public void setSupplierName(String supplierName) {
        this.supplierName = supplierName;
    }

    public String getBatchLotNumber() {
        return batchLotNumber;
    }

    public void setBatchLotNumber(String batchLotNumber) {
        this.batchLotNumber = batchLotNumber;
    }

    public OffsetDateTime getLastRestockedAt() {
        return lastRestockedAt;
    }

    public void setLastRestockedAt(OffsetDateTime lastRestockedAt) {
        this.lastRestockedAt = lastRestockedAt;
    }

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(OffsetDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
