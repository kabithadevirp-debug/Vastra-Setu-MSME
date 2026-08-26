package com.vastrasetu.app.repository;

import com.vastrasetu.app.domain.DyeingRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface DyeingRecordRepository extends JpaRepository<DyeingRecord, UUID> {
    Optional<DyeingRecord> findByBatchId(String batchId);
    List<DyeingRecord> findAllByOrderByCreatedAtDesc();
}
