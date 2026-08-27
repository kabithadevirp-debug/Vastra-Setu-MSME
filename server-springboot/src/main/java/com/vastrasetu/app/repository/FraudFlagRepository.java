package com.vastrasetu.app.repository;

import com.vastrasetu.app.domain.FraudFlag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface FraudFlagRepository extends JpaRepository<FraudFlag, UUID> {
    List<FraudFlag> findByStatusOrderByDetectedAtDesc(String status);
    List<FraudFlag> findAllByOrderByDetectedAtDesc();
    long countByStatus(String status);
}
