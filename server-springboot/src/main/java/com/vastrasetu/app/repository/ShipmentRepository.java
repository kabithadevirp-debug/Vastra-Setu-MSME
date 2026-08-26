package com.vastrasetu.app.repository;

import com.vastrasetu.app.domain.ShipmentAcknowledgement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ShipmentRepository extends JpaRepository<ShipmentAcknowledgement, UUID> {
    Optional<ShipmentAcknowledgement> findByShipmentNumber(String shipmentNumber);
    Optional<ShipmentAcknowledgement> findByConfirmationToken(String confirmationToken);
    List<ShipmentAcknowledgement> findByBatchNumber(String batchNumber);
    List<ShipmentAcknowledgement> findAllByOrderByCreatedAtDesc();
}
