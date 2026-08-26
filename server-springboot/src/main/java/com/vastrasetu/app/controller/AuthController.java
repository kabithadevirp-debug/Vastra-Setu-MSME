package com.vastrasetu.app.controller;

import com.vastrasetu.app.domain.MsmeAccount;
import com.vastrasetu.app.dto.*;
import com.vastrasetu.app.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<Map<String, Object>>> register(@Valid @RequestBody RegisterRequest req, HttpServletRequest request) {
        try {
            Map<String, Object> data = authService.register(req, request.getRemoteAddr());
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.ok("Account registered successfully in Spring Boot + PostgreSQL. Please verify OTP.", data));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ApiResponse.error(ex.getMessage()));
        }
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<ApiResponse<Map<String, Object>>> verifyOtp(@Valid @RequestBody VerifyOtpRequest req, HttpServletRequest request) {
        try {
            UUID msmeId = UUID.fromString(req.getMsmeId());
            MsmeAccount account = authService.verifyOtp(msmeId, req.getOtp(), request.getRemoteAddr());
            return ResponseEntity.ok(ApiResponse.ok("Contact verified successfully.", Map.of("account", authService.sanitize(account))));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ApiResponse.error(ex.getMessage()));
        }
    }

    @PostMapping("/resend-otp")
    public ResponseEntity<ApiResponse<Map<String, Object>>> resendOtp(@RequestBody Map<String, String> body, HttpServletRequest request) {
        try {
            String msmeIdStr = body.get("msmeId");
            if (msmeIdStr == null || msmeIdStr.isBlank()) {
                return ResponseEntity.badRequest().body(ApiResponse.error("MSME ID is required."));
            }
            UUID msmeId = UUID.fromString(msmeIdStr);
            Map<String, Object> data = authService.resendOtp(msmeId, request.getRemoteAddr());
            return ResponseEntity.ok(ApiResponse.ok("New OTP sent successfully.", data));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ApiResponse.error(ex.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<Map<String, Object>>> login(@Valid @RequestBody LoginRequest req, HttpServletRequest request) {
        try {
            Map<String, Object> data = authService.login(req, request.getRemoteAddr());
            return ResponseEntity.ok(ApiResponse.ok("Login successful.", data));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ApiResponse.error(ex.getMessage()));
        }
    }
}
