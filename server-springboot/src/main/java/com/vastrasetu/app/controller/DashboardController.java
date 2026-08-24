package com.vastrasetu.app.controller;

import com.vastrasetu.app.dto.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.OffsetDateTime;
import java.util.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class DashboardController {

    @GetMapping("/passports/summary")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getPassportsSummary() {
        List<Map<String, Object>> recentPassports = List.of(
                Map.of(
                        "id", "DPP-VS-2026-00892",
                        "productName", "EcoWear Polo T-Shirt",
                        "quantity", "4,000 pcs",
                        "buyer", "Inditex / Zara (Germany)",
                        "date", "2026-08-14",
                        "status", "ISSUED",
                        "trustScore", 94
                ),
                Map.of(
                        "id", "DPP-VS-2026-00741",
                        "productName", "Knitted Fleece Crewneck Hoodie",
                        "quantity", "2,500 pcs",
                        "buyer", "H&M Global (Sweden)",
                        "date", "2026-08-02",
                        "status", "ISSUED",
                        "trustScore", 94
                )
        );

        Map<String, Object> data = Map.of(
                "totalGenerated", 14,
                "activeBatches", 3,
                "recentPassports", recentPassports
        );

        return ResponseEntity.ok(ApiResponse.ok("Passports summary fetched.", data));
    }

    @GetMapping("/batches")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getBatches() {
        List<Map<String, Object>> batches = List.of(
                Map.of(
                        "id", "BATCH-01",
                        "batchNumber", "BATCH-2026-0892",
                        "garmentTitle", "EcoWear Polo T-Shirt",
                        "quantity", 4000,
                        "buyerName", "Inditex / Zara Germany",
                        "targetCountry", "Germany",
                        "status", "ISSUED",
                        "dyeingRecord", Map.of("dyeProcessName", "Energy-Efficient CPB Eco-Dyeing", "chemicalCompliance", "Azo-free ✓", "certificateNo", "OEKO-2026-TX-98442"),
                        "cetpRecord", Map.of("waterRecycledPercent", 94, "certificateNo", "TNPCB-CETP-ZLD-8842"),
                        "passport", Map.of("id", "BATCH-01", "polygonTxHash", "0x7f3a9c218842109284102984")
                ),
                Map.of(
                        "id", "BATCH-02",
                        "batchNumber", "BATCH-2026-0741",
                        "garmentTitle", "Knitted Fleece Crewneck Hoodie",
                        "quantity", 2500,
                        "buyerName", "H&M Global Sweden",
                        "targetCountry", "Sweden",
                        "status", "ISSUED",
                        "dyeingRecord", Map.of("dyeProcessName", "Reactive Bio-Dyeing", "chemicalCompliance", "Azo-free ✓", "certificateNo", "OEKO-2026-TX-98442"),
                        "cetpRecord", Map.of("waterRecycledPercent", 94, "certificateNo", "TNPCB-CETP-ZLD-8842"),
                        "passport", Map.of("id", "BATCH-02", "polygonTxHash", "0x7f28a4c1992b8842109284102984")
                )
        );
        return ResponseEntity.ok(ApiResponse.ok("Batches retrieved.", batches));
    }

    @GetMapping("/batches/{id}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getBatchById(@PathVariable("id") String id) {
        Map<String, Object> batch = new HashMap<>();
        batch.put("id", id);
        batch.put("batchNumber", id);
        batch.put("garmentTitle", "EcoWear Polo T-Shirt");
        batch.put("quantity", 4000);
        batch.put("buyerName", "Inditex / Zara Germany");
        batch.put("targetCountry", "Germany");
        batch.put("destinationPort", "Hamburg");
        batch.put("freightMode", "sea");
        batch.put("styleCode", "POLO-2026-ORG");
        batch.put("orderRef", "PO-ZARA-EU-8842");
        batch.put("fabricDescription", "100% Organic Cotton (220 GSM)");
        batch.put("weightGsm", 220);
        batch.put("yarnSpinningMill", "Lakshmi Spinners Tiruppur");
        batch.put("status", "ISSUED");

        batch.put("dyeingRecord", Map.of(
                "dyeProcessName", "Energy-Efficient Cold Pad Batch (CPB) Eco-Dyeing",
                "chemicalCompliance", "Azo-free ✓ • OEKO-TEX Standard 100 Class I & ZDHC MRSL Level 3",
                "certificateNo", "OEKO-2026-TX-98442",
                "completedAt", OffsetDateTime.now().toString(),
                "verifiedBy", "Dr. K. Senthil Kumar (Quality Head, Rainbow Eco-Dyers)"
        ));

        batch.put("cetpRecord", Map.of(
                "waterRecycledPercent", 94,
                "certificateNo", "TNPCB-CETP-ZLD-8842",
                "completedAt", OffsetDateTime.now().toString(),
                "verifiedBy", "Er. R. Vadivelu (Chief Environmental Engineer, Arulpuram CETP)"
        ));

        batch.put("passport", Map.of(
                "id", id,
                "polygonTxHash", "0x7f3a9c218842109284102984",
                "qrCodeData", "http://localhost:5173/verify/" + id
        ));

        return ResponseEntity.ok(ApiResponse.ok("Batch details retrieved.", batch));
    }

    @PostMapping("/batches/{id}/dyeing")
    public ResponseEntity<ApiResponse<Map<String, Object>>> submitDyeing(
            @PathVariable("id") String id,
            @RequestBody Map<String, Object> dyeingData) {

        Map<String, Object> record = new HashMap<>(dyeingData);
        record.put("completedAt", OffsetDateTime.now().toString());
        record.put("verifiedBy", "Dr. K. Senthil Kumar (Rainbow Eco-Dyers)");

        Map<String, Object> updatedBatch = new HashMap<>();
        updatedBatch.put("id", id);
        updatedBatch.put("batchNumber", id);
        updatedBatch.put("garmentTitle", "EcoWear Polo T-Shirt");
        updatedBatch.put("quantity", 4000);
        updatedBatch.put("status", "PENDING_CETP");
        updatedBatch.put("dyeingRecord", record);

        return ResponseEntity.ok(ApiResponse.ok("Dyeing verification recorded successfully.", updatedBatch));
    }

    @PostMapping("/batches/{id}/cetp")
    public ResponseEntity<ApiResponse<Map<String, Object>>> submitCetp(
            @PathVariable("id") String id,
            @RequestBody Map<String, Object> cetpData) {

        Map<String, Object> record = new HashMap<>(cetpData);
        record.put("completedAt", OffsetDateTime.now().toString());
        record.put("verifiedBy", "Er. R. Vadivelu (Arulpuram CETP)");

        Map<String, Object> updatedBatch = new HashMap<>();
        updatedBatch.put("id", id);
        updatedBatch.put("batchNumber", id);
        updatedBatch.put("garmentTitle", "EcoWear Polo T-Shirt");
        updatedBatch.put("quantity", 4000);
        updatedBatch.put("status", "ISSUED");
        updatedBatch.put("cetpRecord", record);
        updatedBatch.put("passport", Map.of(
                "id", id,
                "polygonTxHash", "0x7f3a9c218842109284102984",
                "qrCodeData", "http://localhost:5173/verify/" + id
        ));

        return ResponseEntity.ok(ApiResponse.ok("CETP ZLD clearance recorded & passport issued.", updatedBatch));
    }

    @PostMapping("/batches")
    public ResponseEntity<ApiResponse<Map<String, Object>>> createBatch(@RequestBody(required = false) Map<String, Object> body) {
        String batchId = "BATCH-" + System.currentTimeMillis();
        Map<String, Object> data = Map.of(
                "id", batchId,
                "batchNumber", batchId,
                "status", "ISSUED",
                "merkleRoot", "0x889163A0F124017dB32A4f912B9D9063",
                "polygonTxHash", "0x7f3a9c218842109284102984"
        );
        return ResponseEntity.ok(ApiResponse.ok("Garment batch created and anchored.", data));
    }

    @RequestMapping(value = "/batches/preview-footprint", method = {RequestMethod.GET, RequestMethod.POST})
    public ResponseEntity<ApiResponse<Map<String, Object>>> previewFootprint(@RequestBody(required = false) Map<String, Object> body) {
        Map<String, Object> data = Map.of(
                "carbonKg", 12.4,
                "waterLitres", 56.2,
                "energyKwh", 2.8,
                "sustainableMatPct", 85,
                "carbonBaselineDiff", "-18%",
                "waterRecycledPct", "94%"
        );
        return ResponseEntity.ok(ApiResponse.ok("LCA Footprint preview calculated.", data));
    }

    @GetMapping("/analytics")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getAnalytics() {
        Map<String, Object> data = Map.of(
                "totalPassports", 14,
                "verifiedMSMEs", 1,
                "avgTrustScore", 94,
                "scope2CarbonSaved", "18%"
        );
        return ResponseEntity.ok(ApiResponse.ok("Analytics retrieved.", data));
    }

    @GetMapping("/twin/summary")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getTwinSummary() {
        List<Map<String, Object>> trendData = List.of(
                Map.of("month", "Mar", "carbon", 15.2, "water", 72.0),
                Map.of("month", "Apr", "carbon", 14.5, "water", 68.0),
                Map.of("month", "May", "carbon", 13.8, "water", 64.0),
                Map.of("month", "Jun", "carbon", 13.1, "water", 60.0),
                Map.of("month", "Jul", "carbon", 12.7, "water", 58.0),
                Map.of("month", "Aug", "carbon", 12.4, "water", 56.2)
        );

        Map<String, Object> data = Map.of(
                "currentCarbonLca", "12.4 kg CO₂e",
                "carbonBaselineDiff", "-18%",
                "currentWaterLca", "56.2 L",
                "waterRecycledPct", "94%",
                "recommendation", "Switching 10% more grid electricity to solar rooftop will increase your Trust Score to 98/100.",
                "monthlyTrend", trendData
        );
        return ResponseEntity.ok(ApiResponse.ok("Green Growth Twin summary fetched.", data));
    }
}
