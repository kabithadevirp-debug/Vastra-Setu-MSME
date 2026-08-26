package com.vastrasetu.app.controller;

import com.vastrasetu.app.domain.ProductPassport;
import com.vastrasetu.app.dto.ApiResponse;
import com.vastrasetu.app.service.ProductPassportService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping
public class ProductPassportController {

    private final ProductPassportService passportService;

    public ProductPassportController(ProductPassportService passportService) {
        this.passportService = passportService;
    }

    @PostMapping("/api/passports")
    public ResponseEntity<ApiResponse<ProductPassport>> createPassport(
            @RequestParam("msmeId") String msmeId,
            @RequestBody Map<String, Object> wizardData) {
        try {
            UUID id = UUID.fromString(msmeId);
            ProductPassport passport = passportService.createPassport(id, wizardData);
            return ResponseEntity.ok(ApiResponse.ok("Digital Product Passport created & anchored on Polygon.", passport));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(ApiResponse.error(ex.getMessage()));
        }
    }

    @GetMapping("/api/passports")
    public ResponseEntity<ApiResponse<List<ProductPassport>>> getPassports(@RequestParam("msmeId") String msmeId) {
        try {
            UUID id = UUID.fromString(msmeId);
            List<ProductPassport> passports = passportService.getPassportsForMsme(id);
            return ResponseEntity.ok(ApiResponse.ok("Passports retrieved successfully.", passports));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(ApiResponse.error(ex.getMessage()));
        }
    }

    @GetMapping("/api/passports/{id}")
    public ResponseEntity<ApiResponse<ProductPassport>> getPassportById(@PathVariable("id") String id) {
        try {
            UUID uuid = UUID.fromString(id);
            return passportService.getPassportById(uuid)
                    .map(p -> ResponseEntity.ok(ApiResponse.ok("Passport details retrieved.", p)))
                    .orElseGet(() -> ResponseEntity.notFound().build());
        } catch (Exception ex) {
            return passportService.getPassportByBatchId(id)
                    .map(p -> ResponseEntity.ok(ApiResponse.ok("Passport details retrieved.", p)))
                    .orElseGet(() -> ResponseEntity.notFound().build());
        }
    }

    @GetMapping("/api/public/verify/{passportId}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> verifyPublicPassport(@PathVariable("passportId") String passportId) {
        Map<String, Object> audit = passportService.getPublicVerificationData(passportId);
        return ResponseEntity.ok(ApiResponse.ok("Public Merkle & Polygon verification audit retrieved.", audit));
    }
}
