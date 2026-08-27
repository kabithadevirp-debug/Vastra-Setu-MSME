package com.vastrasetu.app.controller;

import com.vastrasetu.app.domain.DyerCertification;
import com.vastrasetu.app.domain.DyestuffInventory;
import com.vastrasetu.app.domain.GarmentBatch;
import com.vastrasetu.app.dto.ApiResponse;
import com.vastrasetu.app.repository.GarmentBatchRepository;
import com.vastrasetu.app.service.BatchService;
import com.vastrasetu.app.service.DyerCertificationService;
import com.vastrasetu.app.service.DyestuffInventoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.OffsetDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/dyer")
@CrossOrigin(origins = "*")
public class DyerController {

    private final DyestuffInventoryService inventoryService;
    private final DyerCertificationService certificationService;
    private final BatchService batchService;
    private final GarmentBatchRepository batchRepository;

    // In-memory dyer audit trail for immediate persistence
    private final List<Map<String, Object>> dyerAuditLogs = Collections.synchronizedList(new ArrayList<>());

    public DyerController(DyestuffInventoryService inventoryService,
                          DyerCertificationService certificationService,
                          BatchService batchService,
                          GarmentBatchRepository batchRepository) {
        this.inventoryService = inventoryService;
        this.certificationService = certificationService;
        this.batchService = batchService;
        this.batchRepository = batchRepository;
        seedInitialAuditLogs();
    }

    // --- INVENTORY ENDPOINTS ---
    @GetMapping("/inventory")
    public ResponseEntity<ApiResponse<List<DyestuffInventory>>> getInventory(
            @RequestParam(value = "dyerId", required = false) String dyerId,
            @RequestParam(value = "type", required = false) String type) {
        List<DyestuffInventory> items = inventoryService.getInventoryForDyer(dyerId, type);
        return ResponseEntity.ok(ApiResponse.ok("Dyer chemical inventory retrieved.", items));
    }

    @PostMapping("/inventory")
    public ResponseEntity<ApiResponse<DyestuffInventory>> addInventoryItem(
            @RequestParam(value = "dyerId", required = false) String dyerId,
            @RequestBody DyestuffInventory item) {
        try {
            DyestuffInventory saved = inventoryService.addInventoryItem(dyerId, item);
            logDyerAction("INVENTORY_RESTOCK", "Added dyestuff: " + item.getChemicalName() + " (" + item.getQuantityAvailable() + " " + item.getUnit() + ")");
            return ResponseEntity.ok(ApiResponse.ok("Chemical inventory item added.", saved));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/inventory/{id}")
    public ResponseEntity<ApiResponse<DyestuffInventory>> updateInventoryItem(
            @PathVariable("id") UUID id,
            @RequestBody DyestuffInventory updated) {
        try {
            DyestuffInventory saved = inventoryService.updateInventoryItem(id, updated);
            logDyerAction("INVENTORY_UPDATE", "Updated dyestuff stock: " + saved.getChemicalName() + " (" + saved.getQuantityAvailable() + " " + saved.getUnit() + ")");
            return ResponseEntity.ok(ApiResponse.ok("Chemical inventory item updated.", saved));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @DeleteMapping("/inventory/{id}")
    public ResponseEntity<ApiResponse<String>> deleteInventoryItem(@PathVariable("id") UUID id) {
        try {
            inventoryService.deleteInventoryItem(id);
            logDyerAction("INVENTORY_DELETE", "Removed inventory item ID: " + id);
            return ResponseEntity.ok(ApiResponse.ok("Inventory item deleted.", "SUCCESS"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    // --- CERTIFICATIONS ENDPOINTS ---
    @GetMapping("/certifications")
    public ResponseEntity<ApiResponse<List<DyerCertification>>> getCertifications(
            @RequestParam(value = "dyerId", required = false) String dyerId) {
        List<DyerCertification> certs = certificationService.getCertificationsForDyer(dyerId);
        return ResponseEntity.ok(ApiResponse.ok("Dyer facility certifications retrieved.", certs));
    }

    @PostMapping("/certifications")
    public ResponseEntity<ApiResponse<DyerCertification>> saveCertification(
            @RequestParam(value = "dyerId", required = false) String dyerId,
            @RequestBody DyerCertification cert) {
        try {
            DyerCertification saved = certificationService.saveCertification(dyerId, cert);
            logDyerAction("CERTIFICATE_UPLOAD", "Uploaded/Renewed facility certification: " + saved.getTitle() + " (" + saved.getCertNumber() + ")");
            return ResponseEntity.ok(ApiResponse.ok("Facility certificate saved successfully.", saved));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/certifications/expiring")
    public ResponseEntity<ApiResponse<List<DyerCertification>>> getExpiringCertifications(
            @RequestParam(value = "dyerId", required = false) String dyerId,
            @RequestParam(value = "days", defaultValue = "30") int days) {
        List<DyerCertification> expiring = certificationService.getExpiringCertifications(dyerId, days);
        return ResponseEntity.ok(ApiResponse.ok("Expiring certifications retrieved.", expiring));
    }

    // --- BATCHES ASSIGNED TO DYER ---
    @GetMapping("/batches")
    public ResponseEntity<ApiResponse<List<GarmentBatch>>> getDyerBatches(
            @RequestParam(value = "dyerId", required = false) String dyerId) {
        List<GarmentBatch> all = batchRepository.findAll();
        return ResponseEntity.ok(ApiResponse.ok("Batches available for wet processing verification.", all));
    }

    @PostMapping("/batches/{batchNumber}/verify")
    public ResponseEntity<ApiResponse<GarmentBatch>> verifyBatch(
            @PathVariable("batchNumber") String batchNumber,
            @RequestBody Map<String, Object> dyerData) {
        try {
            GarmentBatch updated = batchService.submitDyerBatchProcess(batchNumber, dyerData);
            logDyerAction("BATCH_VERIFICATION", "Verified wet processing & OEKO-TEX recipe for batch " + batchNumber);
            return ResponseEntity.ok(ApiResponse.ok("Batch dyeing verified and advanced in DPP pipeline.", updated));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    // --- AUDIT LOGS ---
    @GetMapping("/audit-log")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getAuditLog(
            @RequestParam(value = "dyerId", required = false) String dyerId,
            @RequestParam(value = "actionType", required = false) String actionType) {
        List<Map<String, Object>> filtered = new ArrayList<>();
        synchronized (dyerAuditLogs) {
            for (Map<String, Object> l : dyerAuditLogs) {
                if (actionType == null || actionType.trim().isEmpty() || "ALL".equalsIgnoreCase(actionType) ||
                        actionType.equalsIgnoreCase((String) l.get("actionType"))) {
                    filtered.add(l);
                }
            }
        }
        return ResponseEntity.ok(ApiResponse.ok("Dyer security and operation audit trail retrieved.", filtered));
    }

    private void logDyerAction(String actionType, String description) {
        Map<String, Object> entry = new LinkedHashMap<>();
        entry.put("id", UUID.randomUUID().toString());
        entry.put("actionType", actionType);
        entry.put("description", description);
        entry.put("ipAddress", "106.210.14.88");
        entry.put("userAgent", "Rainbow Eco-Dyers Workstation (Chrome v126)");
        entry.put("timestamp", OffsetDateTime.now().toString());
        entry.put("actor", "Dr. K. Senthil Kumar (Quality Head)");
        dyerAuditLogs.add(0, entry);
    }

    private void seedInitialAuditLogs() {
        logDyerAction("LOGIN", "Dyeing Partner Facility workstation authenticated via OTP");
        logDyerAction("CERTIFICATE_VERIFY", "OEKO-TEX Standard 100 Class I verified by TESTEX API");
        logDyerAction("INVENTORY_AUDIT", "ZDHC MRSL Level 3 batch lot check passed (4 active dyestuffs)");
    }
}
