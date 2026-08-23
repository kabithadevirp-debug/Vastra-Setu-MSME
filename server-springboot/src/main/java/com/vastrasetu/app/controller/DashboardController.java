package com.vastrasetu.app.controller;

import com.vastrasetu.app.dto.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
                        "productName", "Organic Cotton Polo Shirt",
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
                ),
                Map.of(
                        "id", "DPP-VS-2026-00619",
                        "productName", "Zero-Dye Recycled Cotton T-Shirt",
                        "quantity", "5,000 pcs",
                        "buyer", "C&A Exporters (Netherlands)",
                        "date", "2026-07-28",
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

    @GetMapping("/twin/summary")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getTwinSummary() {
        List<Map<String, Object>> trendData = List.of(
                Map.of("month", "Mar", "carbon", 3.42, "water", 210000),
                Map.of("month", "Apr", "carbon", 3.25, "water", 202000),
                Map.of("month", "May", "carbon", 3.10, "water", 195000),
                Map.of("month", "Jun", "carbon", 2.98, "water", 190000),
                Map.of("month", "Jul", "carbon", 2.89, "water", 188000),
                Map.of("month", "Aug", "carbon", 2.84, "water", 186400)
        );

        Map<String, Object> data = Map.of(
                "currentCarbonLca", "2.84 t CO₂e",
                "carbonBaselineDiff", "-18%",
                "currentWaterLca", "186,400 L",
                "waterRecycledPct", "92%",
                "recommendation", "Switching 10% more grid electricity to solar rooftop will increase your Trust Score to 98/100.",
                "monthlyTrend", trendData
        );
        return ResponseEntity.ok(ApiResponse.ok("Green Growth Twin summary fetched.", data));
    }
}
