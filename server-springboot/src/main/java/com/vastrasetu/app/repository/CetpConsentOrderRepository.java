package com.vastrasetu.app.repository;

import com.vastrasetu.app.domain.CetpConsentOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface CetpConsentOrderRepository extends JpaRepository<CetpConsentOrder, UUID> {
    List<CetpConsentOrder> findByCetpIdOrderByExpiryDateAsc(String cetpId);
}
