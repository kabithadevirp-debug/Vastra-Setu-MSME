package com.vastrasetu.app.repository;

import com.vastrasetu.app.domain.ExportDocument;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ExportDocumentRepository extends JpaRepository<ExportDocument, UUID> {
    List<ExportDocument> findByShipmentNumber(String shipmentNumber);
    List<ExportDocument> findByBatchNumber(String batchNumber);
    Optional<ExportDocument> findByShipmentNumberAndDocumentType(String shipmentNumber, String documentType);
}
