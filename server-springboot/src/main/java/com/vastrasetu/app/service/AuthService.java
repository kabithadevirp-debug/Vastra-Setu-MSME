package com.vastrasetu.app.service;

import com.vastrasetu.app.domain.*;
import com.vastrasetu.app.dto.*;
import com.vastrasetu.app.repository.*;
import com.vastrasetu.app.security.JwtTokenProvider;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.*;

@Service
public class AuthService {

    private final MsmeAccountRepository accountRepository;
    private final OtpRequestRepository otpRepository;
    private final AuditLogRepository auditLogRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;
    private final EmailService emailService;

    public AuthService(MsmeAccountRepository accountRepository,
                       OtpRequestRepository otpRepository,
                       AuditLogRepository auditLogRepository,
                       PasswordEncoder passwordEncoder,
                       JwtTokenProvider tokenProvider,
                       EmailService emailService) {
        this.accountRepository = accountRepository;
        this.otpRepository = otpRepository;
        this.auditLogRepository = auditLogRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenProvider = tokenProvider;
        this.emailService = emailService;
    }

    @Transactional
    public Map<String, Object> register(RegisterRequest req, String ipAddress) {
        String cleanGstin = req.getGstin().trim().toUpperCase();
        String cleanEmail = req.getContactEmail().trim().toLowerCase();

        // If duplicate GSTIN or Email exists, update existing pending account or reuse smoothly
        MsmeAccount existingByGstin = accountRepository.findByGstin(cleanGstin).orElse(null);
        MsmeAccount existingByEmail = accountRepository.findByContactEmail(cleanEmail).orElse(null);

        MsmeAccount account;
        if (existingByGstin != null) {
            account = existingByGstin;
        } else if (existingByEmail != null) {
            account = existingByEmail;
        } else {
            account = new MsmeAccount();
            account.setGstin(cleanGstin);
            account.setContactEmail(cleanEmail);
        }

        account.setBusinessName(req.getBusinessName().trim());
        account.setAddress(req.getAddress() != null && !req.getAddress().isBlank() ? req.getAddress().trim() : "Tiruppur Textile Cluster");
        account.setSector(req.getSector() != null ? req.getSector() : "Textiles");
        account.setContactName(req.getContactName().trim());
        account.setContactPhone(req.getContactPhone().trim());
        account.setPasswordHash(passwordEncoder.encode(req.getPassword()));
        account.setStatus("pending_verification");

        MsmeAccount saved = accountRepository.save(account);

        // Generate 6-digit OTP with 24-hour expiration
        String rawOtp = String.valueOf(100000 + new Random().nextInt(900000));
        String otpHash = hashSha256(rawOtp);

        OtpRequest otp = new OtpRequest();
        otp.setMsmeAccount(saved);
        otp.setOtpHash(otpHash);
        otp.setPurpose("contact_verification");
        otp.setExpiresAt(OffsetDateTime.now(ZoneOffset.UTC).plusDays(1));
        otpRepository.save(otp);

        auditLogRepository.save(new AuditLog(saved, "REGISTER_SUCCESS", ipAddress));

        // Print OTP clearly in terminal logs
        System.out.println("\n====================================================================");
        System.out.println("🔑 VastraSetu MSME Registration OTP Code for " + saved.getContactEmail() + ": [" + rawOtp + "]");
        System.out.println("====================================================================\n");

        // Dispatch SMTP email asynchronously so network delays never block HTTP response
        new Thread(() -> {
            try {
                emailService.sendOtpEmail(saved.getContactEmail(), saved.getBusinessName(), rawOtp);
            } catch (Exception ex) {
                System.err.println("⚠️ Asynchronous SMTP notification skipped: " + ex.getMessage());
            }
        }).start();

        Map<String, Object> response = new HashMap<>();
        response.put("account", sanitize(saved));
        response.put("otpId", otp.getId());
        response.put("demoOtp", rawOtp);
        return response;
    }

    @Transactional
    public MsmeAccount verifyOtp(UUID msmeId, String rawOtp, String ipAddress) {
        MsmeAccount account = accountRepository.findById(msmeId)
                .orElseThrow(() -> new IllegalArgumentException("MSME Account not found."));

        String inputHash = hashSha256(rawOtp.trim());
        OtpRequest otpRequest = otpRepository.findTopByMsmeAccountAndPurposeAndUsedFalseOrderByCreatedAtDesc(account, "contact_verification")
                .orElseThrow(() -> new IllegalArgumentException("No active OTP request found for this account."));

        if (otpRequest.getExpiresAt().isBefore(OffsetDateTime.now(ZoneOffset.UTC))) {
            auditLogRepository.save(new AuditLog(account, "OTP_EXPIRED", ipAddress));
            throw new IllegalArgumentException("OTP code has expired. Please request a new code.");
        }

        if (!otpRequest.getOtpHash().equalsIgnoreCase(inputHash)) {
            auditLogRepository.save(new AuditLog(account, "OTP_FAILED", ipAddress));
            throw new IllegalArgumentException("Invalid OTP verification code.");
        }

        otpRequest.setUsed(true);
        otpRepository.save(otpRequest);

        account.setStatus("verified_active");
        MsmeAccount updated = accountRepository.save(account);

        auditLogRepository.save(new AuditLog(updated, "OTP_VERIFIED", ipAddress));
        return updated;
    }

    @Transactional
    public Map<String, Object> resendOtp(UUID msmeId, String ipAddress) {
        MsmeAccount account = accountRepository.findById(msmeId)
                .orElseThrow(() -> new IllegalArgumentException("MSME Account not found."));

        String rawOtp = String.valueOf(100000 + new Random().nextInt(900000));
        String otpHash = hashSha256(rawOtp);

        OtpRequest otp = new OtpRequest();
        otp.setMsmeAccount(account);
        otp.setOtpHash(otpHash);
        otp.setPurpose("contact_verification");
        otp.setExpiresAt(OffsetDateTime.now(ZoneOffset.UTC).plusDays(1));
        otpRepository.save(otp);

        auditLogRepository.save(new AuditLog(account, "OTP_RESENT", ipAddress));

        System.out.println("\n====================================================================");
        System.out.println("🔑 Resent VastraSetu OTP Code for " + account.getContactEmail() + ": [" + rawOtp + "]");
        System.out.println("====================================================================\n");

        new Thread(() -> {
            try {
                emailService.sendOtpEmail(account.getContactEmail(), account.getBusinessName(), rawOtp);
            } catch (Exception ex) {
                System.err.println("⚠️ Asynchronous SMTP notification skipped: " + ex.getMessage());
            }
        }).start();

        Map<String, Object> response = new HashMap<>();
        response.put("otpId", otp.getId());
        response.put("demoOtp", rawOtp);
        return response;
    }

    public Map<String, Object> login(LoginRequest req, String ipAddress) {
        String identifier = req.getIdentifier().trim();
        MsmeAccount account = accountRepository.findByGstin(identifier.toUpperCase())
                .or(() -> accountRepository.findByContactEmail(identifier.toLowerCase()))
                .orElseThrow(() -> new IllegalArgumentException("Invalid GSTIN/Email or password."));

        if (!passwordEncoder.matches(req.getPassword(), account.getPasswordHash())) {
            auditLogRepository.save(new AuditLog(account, "LOGIN_FAILED", ipAddress));
            throw new IllegalArgumentException("Invalid GSTIN/Email or password.");
        }

        auditLogRepository.save(new AuditLog(account, "LOGIN_SUCCESS", ipAddress));

        String accessToken = tokenProvider.generateToken(account.getId(), account.getContactEmail(), account.getGstin());

        Map<String, Object> data = new HashMap<>();
        data.put("account", sanitize(account));
        data.put("accessToken", accessToken);
        return data;
    }

    public Map<String, Object> sanitize(MsmeAccount account) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", account.getId().toString());
        map.put("businessName", account.getBusinessName());
        map.put("gstin", account.getGstin());
        map.put("udyamNumber", "UDYAM-TN-28-0019284");
        map.put("address", account.getAddress());
        map.put("sector", account.getSector());
        map.put("contactName", account.getContactName());
        map.put("contactEmail", account.getContactEmail());
        map.put("contactPhone", account.getContactPhone());
        map.put("status", account.getStatus());
        map.put("trustScore", 94);
        map.put("badge", "PLATINUM GREEN");
        return map;
    }

    private String hashSha256(String input) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(input.getBytes());
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("SHA-256 algorithm unavailable", e);
        }
    }
}
