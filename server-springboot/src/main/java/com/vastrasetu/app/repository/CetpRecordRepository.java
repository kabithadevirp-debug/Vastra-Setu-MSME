package com.vastrasetu.app.repository;

import com.vastrasetu.app.domain.CetpRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface CetpRecordRepository extends JpaRepository<CetpRecord, UUID> {
    Optional<CetpRecord> findByBatchId(String batchId);
    List<CetpRecord> findAllByOrderByCreatedAtDesc();
}
