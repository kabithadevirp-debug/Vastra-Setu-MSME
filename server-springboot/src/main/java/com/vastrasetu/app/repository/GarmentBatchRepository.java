package com.vastrasetu.app.repository;

import com.vastrasetu.app.domain.GarmentBatch;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface GarmentBatchRepository extends JpaRepository<GarmentBatch, UUID> {
    Optional<GarmentBatch> findByBatchNumber(String batchNumber);
    List<GarmentBatch> findAllByOrderByCreatedAtDesc();
}
