package com.vastrasetu.app.controller;

import com.vastrasetu.app.dto.ApiResponse;
import com.vastrasetu.app.service.IdentityProofService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class IdentityProofController {

    private final IdentityProofService proofService;

    public IdentityProofController(IdentityProofService proofService) {
        this.proofService = proofService;
    }

    @PostMapping("/identity-proof")
    public ResponseEntity<ApiResponse<Map<String, Object>>> uploadIdentityProof(
            @RequestParam("msmeId") String msmeId,
            @RequestParam("docType") String docType,
            @RequestParam(value = "document", required = false) MultipartFile file,
            @RequestParam(value = "gstin", required = false) String gstin,
            HttpServletRequest request) {

        try {
            UUID id = UUID.fromString(msmeId);
            Map<String, Object> result = proofService.processIdentityProof(id, docType, file, gstin, request.getRemoteAddr());
            return ResponseEntity.ok(ApiResponse.ok("Document processed via Tesseract OCR & OpenRouter AI pipeline.", result));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(ApiResponse.error(ex.getMessage()));
        } catch (IOException ex) {
            return ResponseEntity.internalServerError().body(ApiResponse.error("Failed to process file upload."));
        }
    }

    @GetMapping("/identity-proof/status")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getStatus(@RequestParam("msmeId") String msmeId) {
        try {
            UUID id = UUID.fromString(msmeId);
            Map<String, Object> data = proofService.getVerificationStatus(id);
            return ResponseEntity.ok(ApiResponse.ok("Verification status retrieved.", data));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(ApiResponse.error(ex.getMessage()));
        }
    }
}
