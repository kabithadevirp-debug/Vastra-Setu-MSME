package com.vastrasetu.app.controller;

import com.vastrasetu.app.dto.ApiResponse;
import com.vastrasetu.app.service.OperationalDocumentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/documents")
public class OperationalDocumentController {

    private final OperationalDocumentService documentService;

    public OperationalDocumentController(OperationalDocumentService documentService) {
        this.documentService = documentService;
    }

    @PostMapping("/upload")
    public ResponseEntity<ApiResponse<Map<String, Object>>> uploadDocument(
            @RequestParam("msmeId") String msmeId,
            @RequestParam("docType") String docType,
            @RequestParam(value = "file", required = false) MultipartFile file) {
        try {
            UUID id = UUID.fromString(msmeId);
            Map<String, Object> result = documentService.uploadDocument(id, docType, file);
            return ResponseEntity.ok(ApiResponse.ok("Operational document processed successfully.", result));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(ApiResponse.error(ex.getMessage()));
        } catch (IOException ex) {
            return ResponseEntity.internalServerError().body(ApiResponse.error("File processing failed: " + ex.getMessage()));
        }
    }

    @GetMapping("/status")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getDocumentStatus(@RequestParam("msmeId") String msmeId) {
        try {
            UUID id = UUID.fromString(msmeId);
            Map<String, Object> status = documentService.getDocumentStatus(id);
            return ResponseEntity.ok(ApiResponse.ok("Operational documents status retrieved.", status));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(ApiResponse.error(ex.getMessage()));
        }
    }

    @PostMapping("/{id}/confirm")
    public ResponseEntity<ApiResponse<Map<String, Object>>> confirmExtractedFields(
            @PathVariable("id") String documentId,
            @RequestBody Map<String, Object> correctedFields) {
        try {
            UUID id = UUID.fromString(documentId);
            Map<String, Object> result = documentService.confirmExtractedFields(id, correctedFields);
            return ResponseEntity.ok(ApiResponse.ok("Extracted fields confirmed.", result));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(ApiResponse.error(ex.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteDocument(@PathVariable("id") String documentId) {
        try {
            UUID id = UUID.fromString(documentId);
            documentService.deleteDocument(id);
            return ResponseEntity.ok(ApiResponse.ok("Document deleted successfully.", "DELETED"));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(ApiResponse.error(ex.getMessage()));
        }
    }
}
