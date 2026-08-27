package com.vastrasetu.app.service;

import com.vastrasetu.app.domain.DyestuffInventory;
import com.vastrasetu.app.repository.DyestuffInventoryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class DyestuffInventoryService {

    private final DyestuffInventoryRepository repository;

    public DyestuffInventoryService(DyestuffInventoryRepository repository) {
        this.repository = repository;
    }

    public List<DyestuffInventory> getInventoryForDyer(String dyerId, String type) {
        String effectiveDyerId = (dyerId == null || dyerId.trim().isEmpty()) ? "Rainbow Eco-Dyers" : dyerId;
        List<DyestuffInventory> list;
        if (type != null && !type.trim().isEmpty() && !"ALL".equalsIgnoreCase(type)) {
            list = repository.findByDyerIdAndChemicalTypeOrderByChemicalNameAsc(effectiveDyerId, type.toUpperCase());
        } else {
            list = repository.findByDyerIdOrderByChemicalNameAsc(effectiveDyerId);
        }

        if (list.isEmpty()) {
            seedDefaultInventory(effectiveDyerId);
            list = repository.findByDyerIdOrderByChemicalNameAsc(effectiveDyerId);
        }
        return list;
    }

    @Transactional
    public DyestuffInventory addInventoryItem(String dyerId, DyestuffInventory item) {
        if (item.getDyerId() == null || item.getDyerId().trim().isEmpty()) {
            item.setDyerId(dyerId != null && !dyerId.trim().isEmpty() ? dyerId : "Rainbow Eco-Dyers");
        }
        item.setCreatedAt(OffsetDateTime.now());
        item.setLastRestockedAt(OffsetDateTime.now());
        return repository.save(item);
    }

    @Transactional
    public DyestuffInventory updateInventoryItem(UUID id, DyestuffInventory updated) {
        DyestuffInventory existing = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Inventory item not found: " + id));

        if (updated.getChemicalName() != null) existing.setChemicalName(updated.getChemicalName());
        if (updated.getChemicalType() != null) existing.setChemicalType(updated.getChemicalType());
        if (updated.getOekoTexClass() != null) existing.setOekoTexClass(updated.getOekoTexClass());
        if (updated.getZdhcMrslLevel() != null) existing.setZdhcMrslLevel(updated.getZdhcMrslLevel());
        if (updated.getQuantityAvailable() != null) existing.setQuantityAvailable(updated.getQuantityAvailable());
        if (updated.getUnit() != null) existing.setUnit(updated.getUnit());
        if (updated.getSupplierName() != null) existing.setSupplierName(updated.getSupplierName());
        if (updated.getBatchLotNumber() != null) existing.setBatchLotNumber(updated.getBatchLotNumber());
        existing.setLastRestockedAt(OffsetDateTime.now());

        return repository.save(existing);
    }

    @Transactional
    public void deleteInventoryItem(UUID id) {
        repository.deleteById(id);
    }

    private void seedDefaultInventory(String dyerId) {
        DyestuffInventory i1 = new DyestuffInventory();
        i1.setDyerId(dyerId);
        i1.setChemicalName("Novacron Blue C-R Reactive Dye");
        i1.setChemicalType("REACTIVE");
        i1.setOekoTexClass("CLASS_I");
        i1.setZdhcMrslLevel("LEVEL_3");
        i1.setQuantityAvailable(450.0);
        i1.setUnit("KG");
        i1.setSupplierName("Huntsman Textile Effects");
        i1.setBatchLotNumber("LOT-HN-2026-881");
        repository.save(i1);

        DyestuffInventory i2 = new DyestuffInventory();
        i2.setDyerId(dyerId);
        i2.setChemicalName("Remazol Deep Black RGB");
        i2.setChemicalType("AZO_FREE");
        i2.setOekoTexClass("CLASS_I");
        i2.setZdhcMrslLevel("LEVEL_3");
        i2.setQuantityAvailable(680.0);
        i2.setUnit("KG");
        i2.setSupplierName("Dystar India Pvt Ltd");
        i2.setBatchLotNumber("LOT-DY-2026-102");
        repository.save(i2);

        DyestuffInventory i3 = new DyestuffInventory();
        i3.setDyerId(dyerId);
        i3.setChemicalName("Bio-Scour Pectate Lyase Enzyme");
        i3.setChemicalType("AUXILIARY");
        i3.setOekoTexClass("CLASS_I");
        i3.setZdhcMrslLevel("LEVEL_3");
        i3.setQuantityAvailable(320.0);
        i3.setUnit("LITERS");
        i3.setSupplierName("Novozymes Bio-Solutions");
        i3.setBatchLotNumber("LOT-NZ-2026-440");
        repository.save(i3);

        DyestuffInventory i4 = new DyestuffInventory();
        i4.setDyerId(dyerId);
        i4.setChemicalName("Natural Indigofera Plant Extract");
        i4.setChemicalType("NATURAL");
        i4.setOekoTexClass("CLASS_I");
        i4.setZdhcMrslLevel("LEVEL_3");
        i4.setQuantityAvailable(150.0);
        i4.setUnit("KG");
        i4.setSupplierName("Kaveri Organics Tiruppur");
        i4.setBatchLotNumber("LOT-KO-2026-019");
        repository.save(i4);
    }
}
