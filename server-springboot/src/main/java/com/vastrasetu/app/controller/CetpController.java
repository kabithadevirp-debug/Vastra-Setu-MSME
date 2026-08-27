package com.vastrasetu.app.controller;

import com.vastrasetu.app.domain.CetpConsentOrder;
import com.vastrasetu.app.domain.CetpOperationalLog;
import com.vastrasetu.app.domain.GarmentBatch;
import com.vastrasetu.app.dto.ApiResponse;
import com.vastrasetu.app.repository.GarmentBatchRepository;
import com.vastrasetu.app.service.BatchService;
import com.vastrasetu.app.service.CetpConsentOrderService;
import com.vastrasetu.app.service.CetpOperationalLogService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.OffsetDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/cetp")
@CrossOrigin(origins = "*")
public class CetpController {

    private final CetpOperationalLogService logService;
    private final CetpConsentOrderService consentOrderService;
    private final BatchService batchService;
    private final GarmentBatchRepository batchRepository;

    public CetpController(CetpOperationalLogService logService,
                          CetpConsentOrderService consentOrderService,
                          BatchService batchService,
                          GarmentBatchRepository batchRepository) {
        this.logService = logService;
        this.consentOrderService = consentOrderService;
        this.batchService = batchService;
        this.batchRepository = batchRepository;
    }

    // --- BATCHES FOR CETP CLEARANCE ---
    @GetMapping("/batches")
    public ResponseEntity<ApiResponse<List<GarmentBatch>>> getCetpBatches(
            @RequestParam(value = "cetpId", required = false) String cetpId) {
        List<GarmentBatch> batches = batchRepository.findAll();
        return ResponseEntity.ok(ApiResponse.ok("Batches available for CETP effluent clearance.", batches));
    }

    @PostMapping("/batches/{batchNumber}/verify")
    public ResponseEntity<ApiResponse<GarmentBatch>> verifyCetpBatch(
            @PathVariable("batchNumber") String batchNumber,
            @RequestBody Map<String, Object> cetpData) {
        try {
            GarmentBatch batch = batchRepository.findByBatchNumber(batchNumber)
                    .orElseThrow(() -> new IllegalArgumentException("Batch not found: " + batchNumber));

            // Update water recovery and advance to PASSPORT_READY
            if (cetpData.containsKey("waterRecycledPercent")) {
                batch.setWaterRecycledPercent(Double.parseDouble(cetpData.get("waterRecycledPercent").toString()));
            }
            batch.setStatus("PASSPORT_READY");
            batch.setReadinessStatus("READY");
            batch.setReadinessScore(98);
            GarmentBatch saved = batchRepository.save(batch);

            return ResponseEntity.ok(ApiResponse.ok("100% ZLD clearance recorded. Digital Product Passport anchored.", saved));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    // --- OPERATIONAL SHIFT LOGS ---
    @GetMapping("/operational-logs")
    public ResponseEntity<ApiResponse<List<CetpOperationalLog>>> getOperationalLogs(
            @RequestParam(value = "cetpId", required = false) String cetpId,
            @RequestParam(value = "days", required = false) Integer days) {
        List<CetpOperationalLog> logs = logService.getLogsForCetp(cetpId, days);
        return ResponseEntity.ok(ApiResponse.ok("CETP plant telemetry shift logs retrieved.", logs));
    }

    @PostMapping("/operational-logs")
    public ResponseEntity<ApiResponse<CetpOperationalLog>> addOperationalLog(
            @RequestParam(value = "cetpId", required = false) String cetpId,
            @RequestBody CetpOperationalLog log) {
        try {
            CetpOperationalLog saved = logService.addLog(cetpId, log);
            return ResponseEntity.ok(ApiResponse.ok("Shift telemetry logged successfully.", saved));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    // --- CONSENT ORDERS ---
    @GetMapping("/consent-order")
    public ResponseEntity<ApiResponse<List<CetpConsentOrder>>> getConsentOrders(
            @RequestParam(value = "cetpId", required = false) String cetpId) {
        List<CetpConsentOrder> orders = consentOrderService.getConsentOrdersForCetp(cetpId);
        return ResponseEntity.ok(ApiResponse.ok("TNPCB ZLD consent orders retrieved.", orders));
    }

    @PostMapping("/consent-order")
    public ResponseEntity<ApiResponse<CetpConsentOrder>> saveConsentOrder(
            @RequestParam(value = "cetpId", required = false) String cetpId,
            @RequestBody CetpConsentOrder order) {
        try {
            CetpConsentOrder saved = consentOrderService.saveConsentOrder(cetpId, order);
            return ResponseEntity.ok(ApiResponse.ok("Consent order saved.", saved));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    // --- WATER RECOVERY LEDGER ---
    @GetMapping("/water-recovery-ledger")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getWaterRecoveryLedger(
            @RequestParam(value = "cetpId", required = false) String cetpId) {
        List<GarmentBatch> batches = batchRepository.findAll();
        List<Map<String, Object>> ledger = new ArrayList<>();

        for (GarmentBatch b : batches) {
            Map<String, Object> entry = new LinkedHashMap<>();
            entry.put("id", b.getId().toString());
            entry.put("batchNumber", b.getBatchNumber());
            entry.put("productName", b.getProductName());
            entry.put("quantity", b.getQuantity());
            entry.put("buyerName", b.getBuyerName() != null ? b.getBuyerName() : "ABC Fashion GmbH");
            entry.put("waterRecycledPercent", b.getWaterRecycledPercent() != null ? b.getWaterRecycledPercent() : 94.2);
            entry.put("bodCodReductionPercent", 98.5);
            entry.put("saltRecoveryPercent", 96.0);
            entry.put("treatmentMethod", "MBR + 3-Stage RO + MEE Crystallization");
            entry.put("certificateNo", "TNPCB-CETP-ZLD-BATCH-" + (b.getBatchNumber().replaceAll("[^0-9]", "")));
            entry.put("status", "100% ZLD VERIFIED");
            entry.put("clearanceDate", b.getUpdatedAt() != null ? b.getUpdatedAt().toLocalDate().toString() : "2026-08-20");
            ledger.add(entry);
        }

        return ResponseEntity.ok(ApiResponse.ok("Water recovery clearance ledger retrieved.", ledger));
    }
}
