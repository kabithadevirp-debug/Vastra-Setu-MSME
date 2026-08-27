package com.vastrasetu.app.repository;

import com.vastrasetu.app.domain.DyerCertification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface DyerCertificationRepository extends JpaRepository<DyerCertification, UUID> {
    List<DyerCertification> findByDyerIdOrderByExpiryDateAsc(String dyerId);
}
