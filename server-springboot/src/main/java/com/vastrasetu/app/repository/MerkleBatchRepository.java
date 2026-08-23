package com.vastrasetu.app.repository;

import com.vastrasetu.app.domain.MerkleBatch;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface MerkleBatchRepository extends JpaRepository<MerkleBatch, UUID> {
    Optional<MerkleBatch> findFirstByStatusOrderByCreatedAtDesc(String status);
}
