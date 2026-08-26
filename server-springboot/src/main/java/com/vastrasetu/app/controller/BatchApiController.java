package com.vastrasetu.app.controller;

import com.vastrasetu.app.domain.ExportDocument;
import com.vastrasetu.app.domain.GarmentBatch;
import com.vastrasetu.app.domain.ShipmentAcknowledgement;
import com.vastrasetu.app.domain.VaultDocument;
import com.vastrasetu.app.dto.ApiResponse;
import com.vastrasetu.app.service.BatchService;
import com.vastrasetu.app.service.DocumentExtractionService;
import com.vastrasetu.app.service.DocumentVaultService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v2")
@CrossOrigin(origins = "*")
public class BatchApiController {

    private final BatchService batchService;
    private final DocumentExtractionService extractionService;
    private final DocumentVaultService vaultService;

    public BatchApiController(BatchService batchService,
                              DocumentExtractionService extractionService,
                              DocumentVaultService vaultService) {
        this.batchService = batchService;
        this.extractionService = extractionService;
        this.vaultService = vaultService;
    }

    @GetMapping("/dashboard/summary")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getDashboardSummary() {
        Map<String, Object> summary = batchService.getDashboardSummary();
        return ResponseEntity.ok(ApiResponse.ok("Dashboard summary retrieved successfully.", summary));
    }

    @GetMapping("/exporter/profile")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getExporterProfile() {
        Map<String, Object> profile = batchService.getExporterProfile();
        return ResponseEntity.ok(ApiResponse.ok("Exporter identity profile retrieved.", profile));
    }

    // DOCUMENT VAULT ENDPOINTS
    @GetMapping("/vault/documents")
    public ResponseEntity<ApiResponse<List<VaultDocument>>> getVaultDocuments(
            @RequestParam(value = "scope", required = false) String scope) {
        List<VaultDocument> docs = scope != null && !scope.isEmpty()
                ? vaultService.getDocumentsByScope(scope)
                : vaultService.getAllVaultDocuments();
        return ResponseEntity.ok(ApiResponse.ok("Vault documents retrieved.", docs));
    }

    @PostMapping("/vault/documents")
    public ResponseEntity<ApiResponse<VaultDocument>> uploadVaultDocument(@RequestBody Map<String, Object> req) {
        try {
            VaultDocument doc = vaultService.uploadOrUpdateVaultDocument(req);
            return ResponseEntity.ok(ApiResponse.ok("Organization/facility document stored in Vault.", doc));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/vault/alerts")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getVaultAlerts() {
        List<Map<String, Object>> alerts = vaultService.getActiveAlerts();
        return ResponseEntity.ok(ApiResponse.ok("Active expiry and renewal alerts retrieved.", alerts));
    }

    // BANK OPERATIONAL SNAPSHOT
    @GetMapping("/bank/snapshot")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getBankSnapshot() {
        Map<String, Object> snapshot = batchService.getBankOperationalSnapshot();
        return ResponseEntity.ok(ApiResponse.ok("Bank operational business snapshot generated.", snapshot));
    }

    // GOVERNMENT AUTHORIZED AUDIT VIEW
    @GetMapping("/government/audit-view")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getGovernmentAuditView() {
        Map<String, Object> audit = batchService.getGovernmentAuditView();
        return ResponseEntity.ok(ApiResponse.ok("Government regulatory compliance audit view generated.", audit));
    }

    // LIGHTWEIGHT DYER BATCH SUBMISSION
    @PostMapping("/dyer/batches/{batchNumber}/submit")
    public ResponseEntity<ApiResponse<GarmentBatch>> submitDyerBatch(
            @PathVariable("batchNumber") String batchNumber,
            @RequestBody Map<String, Object> dyerData) {
        try {
            GarmentBatch updated = batchService.submitDyerBatchProcess(batchNumber, dyerData);
            return ResponseEntity.ok(ApiResponse.ok("Dyeing batch processing record attached to garment batch.", updated));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/batches")
    public ResponseEntity<ApiResponse<List<GarmentBatch>>> getAllBatches() {
        List<GarmentBatch> batches = batchService.getAllBatches();
        return ResponseEntity.ok(ApiResponse.ok("Garment batches retrieved.", batches));
    }

    @GetMapping("/batches/{batchNumber}")
    public ResponseEntity<ApiResponse<GarmentBatch>> getBatch(@PathVariable("batchNumber") String batchNumber) {
        return batchService.getBatchByNumber(batchNumber)
                .map(b -> ResponseEntity.ok(ApiResponse.ok("Batch details retrieved.", b)))
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("Batch not found for: " + batchNumber)));
    }

    @PostMapping("/batches")
    public ResponseEntity<ApiResponse<GarmentBatch>> createBatch(@RequestBody Map<String, Object> req) {
        try {
            GarmentBatch batch = batchService.createBatch(req);
            return ResponseEntity.ok(ApiResponse.ok("Export garment batch created successfully.", batch));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/batches/from-invoice")
    public ResponseEntity<ApiResponse<GarmentBatch>> createBatchFromInvoice(@RequestBody Map<String, Object> invoiceData) {
        try {
            GarmentBatch batch = batchService.createBatchFromInvoice(invoiceData);
            return ResponseEntity.ok(ApiResponse.ok("Garment batch automatically created from Commercial Invoice and Document Vault.", batch));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/batches/{batchNumber}/stages")
    public ResponseEntity<ApiResponse<GarmentBatch>> updateStages(
            @PathVariable("batchNumber") String batchNumber,
            @RequestBody List<Map<String, Object>> newStages) {
        try {
            GarmentBatch updated = batchService.updateJourneyStages(batchNumber, newStages);
            return ResponseEntity.ok(ApiResponse.ok("Production journey stages updated and consistency recalculated.", updated));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/extract-invoice")
    public ResponseEntity<ApiResponse<Map<String, Object>>> extractInvoice(
            @RequestParam(value = "file", required = false) MultipartFile file) {
        Map<String, Object> extracted = extractionService.extractInvoiceFields(file);
        return ResponseEntity.ok(ApiResponse.ok("Commercial Invoice parsed and structured fields extracted.", extracted));
    }

    @PostMapping("/extract-document")
    public ResponseEntity<ApiResponse<Map<String, Object>>> extractDocument(
            @RequestParam(value = "file", required = false) MultipartFile file,
            @RequestParam(value = "docType", required = false) String docType,
            @RequestParam(value = "stageKey", required = false) String stageKey) {
        Map<String, Object> extracted = extractionService.extractDocumentFields(file, docType, stageKey);
        return ResponseEntity.ok(ApiResponse.ok("Document fields extracted for exporter confirmation.", extracted));
    }

    @PostMapping("/batches/{batchNumber}/evidence")
    public ResponseEntity<ApiResponse<GarmentBatch>> attachEvidence(
            @PathVariable("batchNumber") String batchNumber,
            @RequestBody Map<String, Object> evidenceDoc) {
        try {
            GarmentBatch updated = batchService.attachEvidence(batchNumber, evidenceDoc);
            return ResponseEntity.ok(ApiResponse.ok("Supporting evidence attached and consistency verified.", updated));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/batches/{batchNumber}/passport")
    public ResponseEntity<ApiResponse<GarmentBatch>> generatePassport(
            @PathVariable("batchNumber") String batchNumber,
            @RequestBody(required = false) Map<String, String> body) {
        try {
            String reason = body != null ? body.getOrDefault("reason", "Initial Passport Publishing") : "Initial Passport Publishing";
            GarmentBatch updated = batchService.generatePassportVersion(batchNumber, reason);
            return ResponseEntity.ok(ApiResponse.ok("Digital Product Passport generated and anchored on Polygon.", updated));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/batches/{batchNumber}/shipment")
    public ResponseEntity<ApiResponse<ShipmentAcknowledgement>> createShipment(
            @PathVariable("batchNumber") String batchNumber,
            @RequestBody Map<String, Object> req) {
        try {
            ShipmentAcknowledgement shipment = batchService.createShipment(batchNumber, req);
            return ResponseEntity.ok(ApiResponse.ok("Export shipment created and receiver confirmation link generated.", shipment));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/batches/{batchNumber}/shipments")
    public ResponseEntity<ApiResponse<List<ShipmentAcknowledgement>>> getShipments(@PathVariable("batchNumber") String batchNumber) {
        List<ShipmentAcknowledgement> shipments = batchService.getShipmentsForBatch(batchNumber);
        return ResponseEntity.ok(ApiResponse.ok("Shipments retrieved.", shipments));
    }

    // EXPORT DOCUMENTATION & READINESS CHECKLIST ENDPOINTS
    @GetMapping("/shipments/{shipmentNumber}/checklist")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getShipmentChecklist(@PathVariable("shipmentNumber") String shipmentNumber) {
        try {
            Map<String, Object> checklist = batchService.getShipmentChecklist(shipmentNumber);
            return ResponseEntity.ok(ApiResponse.ok("Export documentation checklist retrieved.", checklist));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/shipments/{shipmentNumber}/documents")
    public ResponseEntity<ApiResponse<List<ExportDocument>>> getShipmentDocuments(@PathVariable("shipmentNumber") String shipmentNumber) {
        List<ExportDocument> docs = batchService.getShipmentDocuments(shipmentNumber);
        return ResponseEntity.ok(ApiResponse.ok("Export documents retrieved.", docs));
    }

    @PostMapping("/shipments/{shipmentNumber}/documents")
    public ResponseEntity<ApiResponse<ExportDocument>> attachExportDocument(
            @PathVariable("shipmentNumber") String shipmentNumber,
            @RequestBody Map<String, Object> req) {
        try {
            ExportDocument doc = batchService.attachExportDocument(shipmentNumber, req);
            return ResponseEntity.ok(ApiResponse.ok("Export document attached and readiness score updated.", doc));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/public/verify/{batchNumber}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> verifyPublicPassport(@PathVariable("batchNumber") String batchNumber) {
        Map<String, Object> data = batchService.getPublicVerificationData(batchNumber);
        return ResponseEntity.ok(ApiResponse.ok("Public passport verification data retrieved.", data));
    }

    @GetMapping("/receiver/shipment/{token}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getReceiverShipment(@PathVariable("token") String token) {
        return batchService.getShipmentByToken(token)
                .map(s -> {
                    GarmentBatch batch = batchService.getBatchByNumber(s.getBatchNumber()).orElse(null);
                    Map<String, Object> data = Map.of(
                            "shipment", s,
                            "batch", batch != null ? batch : Map.of()
                    );
                    return ResponseEntity.ok(ApiResponse.ok("Shipment details retrieved for receiver confirmation.", data));
                })
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("Shipment confirmation link is invalid or expired.")));
    }

    @PostMapping("/receiver/shipment/{token}/confirm")
    public ResponseEntity<ApiResponse<ShipmentAcknowledgement>> confirmShipment(
            @PathVariable("token") String token,
            @RequestBody Map<String, Object> req) {
        try {
            int receivedQty = Integer.parseInt(req.getOrDefault("receivedQuantity", "0").toString());
            String remarks = req.getOrDefault("remarks", "").toString();
            String acknowledgedBy = req.getOrDefault("acknowledgedBy", "Buyer QC Team").toString();

            ShipmentAcknowledgement ack = batchService.confirmShipmentReceipt(token, receivedQty, remarks, acknowledgedBy);
            return ResponseEntity.ok(ApiResponse.ok("Receiver acknowledgement recorded successfully.", ack));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}
