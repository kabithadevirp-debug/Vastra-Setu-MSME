package com.vastrasetu.app.controller;

import com.vastrasetu.app.dto.ApiResponse;
import com.vastrasetu.app.service.TwinAnalyticsService;
import com.vastrasetu.app.service.TwinNarrativeService;
import com.vastrasetu.app.service.TwinSimulationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping
public class TwinController {

    private final TwinAnalyticsService analyticsService;
    private final TwinSimulationService simulationService;
    private final TwinNarrativeService narrativeService;

    public TwinController(TwinAnalyticsService analyticsService,
                          TwinSimulationService simulationService,
                          TwinNarrativeService narrativeService) {
        this.analyticsService = analyticsService;
        this.simulationService = simulationService;
        this.narrativeService = narrativeService;
    }

    @GetMapping("/api/twin/trend")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getTrend(@RequestParam(value = "msmeId", required = false) String msmeIdStr) {
        try {
            UUID msmeId = parseMsmeId(msmeIdStr);
            List<Map<String, Object>> trend = analyticsService.getTrendData(msmeId);
            return ResponseEntity.ok(ApiResponse.ok("Twin trend history retrieved.", trend));
        } catch (Exception ex) {
            return ResponseEntity.ok(ApiResponse.ok("Twin trend history retrieved.", List.of()));
        }
    }

    @GetMapping("/api/twin/prediction")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getPrediction(@RequestParam(value = "msmeId", required = false) String msmeIdStr) {
        try {
            UUID msmeId = parseMsmeId(msmeIdStr);
            Map<String, Object> pred = analyticsService.predictNextMonth(msmeId);
            return ResponseEntity.ok(ApiResponse.ok("Twin regression prediction retrieved.", pred));
        } catch (Exception ex) {
            return ResponseEntity.ok(ApiResponse.ok("Twin regression prediction retrieved.", Map.of("hasEnoughData", false, "message", "Insufficient data")));
        }
    }

    @GetMapping("/api/twin/recommendations")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getRecommendations(@RequestParam(value = "msmeId", required = false) String msmeIdStr) {
        try {
            UUID msmeId = parseMsmeId(msmeIdStr);
            List<Map<String, Object>> recs = analyticsService.generateRecommendations(msmeId);
            return ResponseEntity.ok(ApiResponse.ok("Twin recommendations retrieved.", recs));
        } catch (Exception ex) {
            return ResponseEntity.ok(ApiResponse.ok("Twin recommendations retrieved.", List.of()));
        }
    }

    @PostMapping("/api/twin/simulate")
    public ResponseEntity<ApiResponse<Map<String, Object>>> simulate(
            @RequestParam(value = "msmeId", required = false) String msmeIdStr,
            @RequestBody Map<String, Object> params) {
        try {
            UUID msmeId = parseMsmeId(msmeIdStr);
            Map<String, Object> result = simulationService.simulate(msmeId, params);
            return ResponseEntity.ok(ApiResponse.ok("What-if simulation completed.", result));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ApiResponse.error(ex.getMessage()));
        }
    }

    @PostMapping("/api/twin/simulate-with-narrative")
    public ResponseEntity<ApiResponse<Map<String, Object>>> simulateWithNarrative(
            @RequestParam(value = "msmeId", required = false) String msmeIdStr,
            @RequestBody Map<String, Object> params) {
        try {
            UUID msmeId = parseMsmeId(msmeIdStr);
            Map<String, Object> simResult = simulationService.simulate(msmeId, params);
            Map<String, String> narrative = narrativeService.generateNarrative(msmeId, params, simResult);

            Map<String, Object> response = new LinkedHashMap<>();
            response.put("simulationResult", simResult);
            response.put("narrative", narrative);

            return ResponseEntity.ok(ApiResponse.ok("Simulation and AI narrative completed.", response));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ApiResponse.error(ex.getMessage()));
        }
    }

    private UUID parseMsmeId(String msmeIdStr) {
        if (msmeIdStr != null && !msmeIdStr.trim().isEmpty()) {
            try {
                return UUID.fromString(msmeIdStr.trim());
            } catch (Exception ignored) {}
        }
        return UUID.fromString("00000000-0000-0000-0000-000000000000");
    }
}
