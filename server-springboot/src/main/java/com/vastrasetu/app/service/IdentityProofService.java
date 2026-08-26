package com.vastrasetu.app.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.vastrasetu.app.domain.AuditLog;
import com.vastrasetu.app.domain.IdentityProof;
import com.vastrasetu.app.domain.MsmeAccount;
import com.vastrasetu.app.dto.GeminiExtractionResult;
import com.vastrasetu.app.dto.OcrScanResult;
import com.vastrasetu.app.repository.AuditLogRepository;
import com.vastrasetu.app.repository.IdentityProofRepository;
import com.vastrasetu.app.repository.MsmeAccountRepository;
import com.vastrasetu.app.util.GstinValidator;
import com.vastrasetu.app.util.UdyamValidator;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.time.OffsetDateTime;
import java.util.*;

@Service
public class IdentityProofService {

    private final IdentityProofRepository proofRepository;
    private final MsmeAccountRepository accountRepository;
    private final AuditLogRepository auditLogRepository;
    private final GoogleVisionOcrService ocrService;
    private final GeminiAiExtractionService geminiService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public IdentityProofService(IdentityProofRepository proofRepository,
                                MsmeAccountRepository accountRepository,
                                AuditLogRepository auditLogRepository,
                                GoogleVisionOcrService ocrService,
                                GeminiAiExtractionService geminiService) {
        this.proofRepository = proofRepository;
        this.accountRepository = accountRepository;
        this.auditLogRepository = auditLogRepository;
        this.ocrService = ocrService;
        this.geminiService = geminiService;
    }

    @Transactional
    public Map<String, Object> processIdentityProof(UUID msmeId, String docType, MultipartFile file, String manualGstin, String ipAddress) throws IOException {
        MsmeAccount account = accountRepository.findById(msmeId)
                .orElseThrow(() -> new IllegalArgumentException("MSME Account not found."));

        // 1. Store File (Local Uploads directory)
        String uploadDir = System.getProperty("user.dir") + File.separator + "uploads" + File.separator + "proofs";
        File dir = new File(uploadDir);
        if (!dir.exists()) dir.mkdirs();

        String fileName = "proof_" + System.currentTimeMillis() + "_" + (file != null ? file.getOriginalFilename() : docType + ".pdf");
        File destFile = new File(uploadDir + File.separator + fileName);
        if (file != null && !file.isEmpty()) {
            file.transferTo(destFile);
        }

        String storagePath = "/uploads/proofs/" + fileName;

        // 2. SIGNAL 1: Tesseract OCR v5.5 preprocessed scan + numerical OCR confidence
        OcrScanResult ocrResult = ocrService.extractOcrResult(destFile, docType);
        String rawOcrText = ocrResult.getRawText();
        double ocrConfidence = ocrResult.getOcrConfidence();

        // 3. SIGNAL 2: OpenRouter AI (google/gemini-2.5-flash) structured JSON extraction
        String targetGstin = manualGstin != null && !manualGstin.isBlank() ? manualGstin.trim().toUpperCase() : account.getGstin();
        GeminiExtractionResult geminiResult = geminiService.parseOcrTextWithGeminiPrompt(rawOcrText, docType, targetGstin);
        String jsonFields = objectMapper.writeValueAsString(geminiResult);
        String aiConfidence = geminiResult.getConfidence() != null ? geminiResult.getConfidence() : "high";

        // 4. SIGNAL 3: Deterministic Checksum & Regex Validation
        boolean checksumValid = true;
        if ("gst_certificate".equalsIgnoreCase(docType)) {
            String extractedGstin = geminiResult.getGstin();
            checksumValid = GstinValidator.isValidGstin(extractedGstin != null ? extractedGstin : targetGstin);
        } else if ("udyam_certificate".equalsIgnoreCase(docType)) {
            String extractedUdyam = geminiResult.getUdyamRegistrationNumber();
            checksumValid = UdyamValidator.isValidUdyamNumber(extractedUdyam);
        }

        // 5. SIGNAL 4: Cross-Document & Registered GSTIN Match Check
        boolean crossDocumentMatch = true;
        String extractedGstin = geminiResult.getGstin();
        if ("gst_certificate".equalsIgnoreCase(docType)) {
            if (extractedGstin == null || !extractedGstin.equalsIgnoreCase(account.getGstin())) {
                crossDocumentMatch = false;
            }
        }

        // 6. COMPOSITE TWO-SIGNAL DECISION MATRIX
        String compositeStatus = "PASS";
        String verificationStatus = "verified";
        String rejectionReason = null;

        if (!checksumValid) {
            compositeStatus = "FAILED";
            verificationStatus = "rejected";
            rejectionReason = "Deterministic Checksum Failure: Invalid GSTIN Modulus 36 checksum format.";
        } else if (!crossDocumentMatch) {
            compositeStatus = "FAILED";
            verificationStatus = "rejected";
            rejectionReason = String.format("Cross-Document Mismatch: Extracted GSTIN (%s) does not match registered MSME GSTIN (%s).",
                    extractedGstin, account.getGstin());
        } else if (ocrConfidence < 60.0 || "low".equalsIgnoreCase(aiConfidence)) {
            compositeStatus = "NEEDS_REVIEW";
            verificationStatus = "needs_review";
            rejectionReason = "Low OCR Image Contrast: Needs human confirmation of extracted document fields.";
        }

        // 7. Save Identity Proof Entity with 4 Signals
        IdentityProof proof = proofRepository.findByMsmeAccountAndDocType(account, docType)
                .orElse(new IdentityProof());

        proof.setMsmeAccount(account);
        proof.setDocType(docType);
        proof.setStoragePath(storagePath);
        proof.setOcrRawText(rawOcrText);
        proof.setExtractedFields(jsonFields);
        proof.setOcrConfidence(ocrConfidence);
        proof.setAiConfidence(aiConfidence);
        proof.setChecksumValid(checksumValid);
        proof.setCrossDocumentMatch(crossDocumentMatch);
        proof.setCompositeStatus(compositeStatus);
        proof.setVerificationStatus(verificationStatus);
        proof.setRejectionReason(rejectionReason);
        proof.setSubmittedAt(OffsetDateTime.now());
        if ("verified".equalsIgnoreCase(verificationStatus)) {
            proof.setVerifiedAt(OffsetDateTime.now());
        }

        IdentityProof savedProof = proofRepository.save(proof);

        // 8. Update Account Overall Verification Status
        List<IdentityProof> proofs = proofRepository.findByMsmeAccount(account);
        boolean anyRejected = proofs.stream().anyMatch(p -> "rejected".equalsIgnoreCase(p.getVerificationStatus()));
        boolean allVerified = proofs.size() >= 2 && proofs.stream().allMatch(p -> "verified".equalsIgnoreCase(p.getVerificationStatus()));

        if (anyRejected) {
            account.setStatus("verification_failed");
            auditLogRepository.save(new AuditLog(account, "VERIFICATION_FAILED", ipAddress));
        } else if (allVerified) {
            account.setStatus("active");
            auditLogRepository.save(new AuditLog(account, "VERIFICATION_PASSED", ipAddress));
        } else {
            account.setStatus("verification_in_progress");
        }
        accountRepository.save(account);

        Map<String, Object> response = new HashMap<>();
        response.put("proofId", savedProof.getId());
        response.put("docType", savedProof.getDocType());
        response.put("verificationStatus", savedProof.getVerificationStatus());
        response.put("compositeStatus", compositeStatus);
        response.put("ocrConfidence", ocrConfidence);
        response.put("aiConfidence", aiConfidence);
        response.put("checksumValid", checksumValid);
        response.put("crossDocumentMatch", crossDocumentMatch);
        response.put("extractedFields", geminiResult);
        response.put("accountStatus", account.getStatus());
        response.put("rejectionReason", rejectionReason);
        return response;
    }

    public Map<String, Object> getVerificationStatus(UUID msmeId) {
        MsmeAccount account = accountRepository.findById(msmeId)
                .orElseThrow(() -> new IllegalArgumentException("Account not found."));

        List<IdentityProof> proofs = proofRepository.findByMsmeAccount(account);
        List<AuditLog> auditLogs = auditLogRepository.findTop20ByMsmeAccountOrderByTimestampDesc(account);

        Map<String, Object> response = new HashMap<>();
        response.put("accountStatus", account.getStatus());
        response.put("gstin", account.getGstin());
        response.put("businessName", account.getBusinessName());
        response.put("proofs", proofs);
        response.put("auditLogs", auditLogs);
        return response;
    }
}
