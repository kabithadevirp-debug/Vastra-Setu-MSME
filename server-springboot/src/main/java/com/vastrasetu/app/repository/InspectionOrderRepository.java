package com.vastrasetu.app.repository;

import com.vastrasetu.app.domain.InspectionOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface InspectionOrderRepository extends JpaRepository<InspectionOrder, UUID> {
    List<InspectionOrder> findAllByOrderByIssuedAtDesc();
}
