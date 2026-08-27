package com.vastrasetu.app.repository;

import com.vastrasetu.app.domain.SanctionedFacility;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface SanctionedFacilityRepository extends JpaRepository<SanctionedFacility, UUID> {
    List<SanctionedFacility> findByBankIdOrderBySanctionDateDesc(String bankId);
}
