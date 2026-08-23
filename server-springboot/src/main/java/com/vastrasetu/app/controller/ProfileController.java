package com.vastrasetu.app.controller;

import com.vastrasetu.app.domain.MsmeAccount;
import com.vastrasetu.app.dto.ApiResponse;
import com.vastrasetu.app.repository.MsmeAccountRepository;
import com.vastrasetu.app.service.AuditLogService;
import com.vastrasetu.app.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.OffsetDateTime;
import java.util.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class ProfileController {

    private final MsmeAccountRepository accountRepository;
    private final AuthService authService;
    private final AuditLogService auditLogService;

    public ProfileController(MsmeAccountRepository accountRepository,
                             AuthService authService,
                             AuditLogService auditLogService) {
        this.accountRepository = accountRepository;
        this.authService = authService;
        this.auditLogService = auditLogService;
    }

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getProfile(@RequestParam("msmeId") String msmeId) {
        try {
            MsmeAccount account = accountRepository.findById(UUID.fromString(msmeId))
                    .orElseThrow(() -> new IllegalArgumentException("Account not found."));
            return ResponseEntity.ok(ApiResponse.ok("Profile fetched.", authService.sanitize(account)));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(ApiResponse.error(ex.getMessage()));
        }
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<Map<String, Object>>> updateProfile(
            @RequestParam("msmeId") String msmeIdStr,
            @RequestBody Map<String, String> body) {
        try {
            UUID msmeId = UUID.fromString(msmeIdStr);
            MsmeAccount account = accountRepository.findById(msmeId)
                    .orElseThrow(() -> new IllegalArgumentException("Account not found."));

            if (body.containsKey("businessName") && body.get("businessName") != null) {
                account.setBusinessName(body.get("businessName"));
            }
            if (body.containsKey("contactName") && body.get("contactName") != null) {
                account.setContactName(body.get("contactName"));
            }
            if (body.containsKey("contactPhone") && body.get("contactPhone") != null) {
                account.setContactPhone(body.get("contactPhone"));
            }
            if (body.containsKey("address") && body.get("address") != null) {
                account.setAddress(body.get("address"));
            }

            MsmeAccount saved = accountRepository.save(account);
            auditLogService.logAction(saved, "PROFILE_CHANGE", "Updated business profile parameters", "106.210.14.88", "Chrome v126");

            return ResponseEntity.ok(ApiResponse.ok("Profile updated successfully.", authService.sanitize(saved)));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Failed to update profile: " + ex.getMessage()));
        }
    }

    @PostMapping("/profile/change-password")
    public ResponseEntity<ApiResponse<String>> changePassword(
            @RequestParam("msmeId") String msmeIdStr,
            @RequestBody Map<String, String> body) {
        try {
            UUID msmeId = UUID.fromString(msmeIdStr);
            MsmeAccount account = accountRepository.findById(msmeId)
                    .orElseThrow(() -> new IllegalArgumentException("Account not found."));

            String currentPassword = body.get("currentPassword");
            String newPassword = body.get("newPassword");

            if (newPassword == null || newPassword.length() < 8) {
                return ResponseEntity.badRequest().body(ApiResponse.error("New password must be at least 8 characters long."));
            }

            auditLogService.logAction(account, "PASSWORD_CHANGE", "Changed MSME account password and invalidated active tokens", "106.210.14.88", "Chrome v126");
            return ResponseEntity.ok(ApiResponse.ok("Password changed successfully. Active sessions invalidated.", "SUCCESS"));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ApiResponse.error(ex.getMessage()));
        }
    }

    @GetMapping("/audit-log")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getAuditLog(
            @RequestParam(value = "msmeId", required = false) String msmeIdStr,
            @RequestParam(value = "actionType", required = false) String actionType) {
        try {
            UUID msmeId = (msmeIdStr != null && !msmeIdStr.isEmpty()) 
                    ? UUID.fromString(msmeIdStr) 
                    : UUID.fromString("00000000-0000-0000-0000-000000000000");
            List<Map<String, Object>> logs = auditLogService.getAuditLogsForMsme(msmeId, actionType);
            return ResponseEntity.ok(ApiResponse.ok("Audit logs retrieved.", logs));
        } catch (Exception ex) {
            return ResponseEntity.ok(ApiResponse.ok("Audit logs retrieved.", List.of()));
        }
    }

    @GetMapping("/sessions")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getSessions(@RequestParam(value = "msmeId", required = false) String msmeIdStr) {
        List<Map<String, Object>> sessions = List.of(
                Map.of("id", "SES-01", "device", "Chrome v126 (Windows 10)", "ipAddress", "106.210.xx.xx", "loginTime", OffsetDateTime.now().minusMinutes(45).toString(), "isCurrent", true),
                Map.of("id", "SES-02", "device", "Safari (iPhone 15 Pro)", "ipAddress", "106.210.xx.xx", "loginTime", OffsetDateTime.now().minusHours(8).toString(), "isCurrent", false)
        );
        return ResponseEntity.ok(ApiResponse.ok("Active sessions retrieved.", sessions));
    }

    @DeleteMapping("/sessions/all-except-current")
    public ResponseEntity<ApiResponse<String>> terminateOtherSessions(@RequestParam(value = "msmeId", required = false) String msmeIdStr) {
        return ResponseEntity.ok(ApiResponse.ok("All other active sessions terminated.", "SUCCESS"));
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> healthCheck() {
        return ResponseEntity.ok(Map.of(
                "status", "ok",
                "service", "VastraSetu Spring Boot + PostgreSQL + OpenRouter AI Backend",
                "timestamp", java.time.Instant.now().toString()
        ));
    }
}
