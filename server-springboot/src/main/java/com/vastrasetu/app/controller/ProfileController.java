package com.vastrasetu.app.controller;

import com.vastrasetu.app.domain.MsmeAccount;
import com.vastrasetu.app.dto.ApiResponse;
import com.vastrasetu.app.repository.MsmeAccountRepository;
import com.vastrasetu.app.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class ProfileController {

    private final MsmeAccountRepository accountRepository;
    private final AuthService authService;

    public ProfileController(MsmeAccountRepository accountRepository, AuthService authService) {
        this.accountRepository = accountRepository;
        this.authService = authService;
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

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> healthCheck() {
        return ResponseEntity.ok(Map.of(
                "status", "ok",
                "service", "VastraSetu Spring Boot + PostgreSQL + OpenRouter AI Backend",
                "timestamp", java.time.Instant.now().toString()
        ));
    }
}
