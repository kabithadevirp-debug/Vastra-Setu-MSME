package com.vastrasetu.app.repository;

import com.vastrasetu.app.domain.DyestuffInventory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface DyestuffInventoryRepository extends JpaRepository<DyestuffInventory, UUID> {
    List<DyestuffInventory> findByDyerIdOrderByChemicalNameAsc(String dyerId);
    List<DyestuffInventory> findByDyerIdAndChemicalTypeOrderByChemicalNameAsc(String dyerId, String chemicalType);
}
