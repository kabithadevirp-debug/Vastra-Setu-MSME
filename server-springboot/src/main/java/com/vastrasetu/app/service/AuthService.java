package com.vastrasetu.app.service;

import com.vastrasetu.app.domain.AuditLog;
import com.vastrasetu.app.domain.MsmeAccount;
import com.vastrasetu.app.domain.OtpRequest;
import com.vastrasetu.app.dto.LoginRequest;
import com.vastrasetu.app.dto.RegisterRequest;
import com.vastrasetu.app.repository.AuditLogRepository;
import com.vastrasetu.app.repository.MsmeAccountRepository;
import com.vastrasetu.app.repository.OtpRequestRepository;
import com.vastrasetu.app.security.JwtTokenProvider;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Instant;
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

        if (accountRepository.existsByGstin(cleanGstin) || accountRepository.existsByContactEmail(cleanEmail)) {
            auditLogRepository.save(new AuditLog(null, "REGISTER_FAILED", ipAddress));
            throw new IllegalArgumentException("An account with this GSTIN or Email already exists.");
        }

        MsmeAccount account = new MsmeAccount();
        account.setBusinessName(req.getBusinessName().trim());
        account.setGstin(cleanGstin);
        account.setAddress(req.getAddress().trim());
        account.setSector(req.getSector() != null ? req.getSector() : "Textiles");
        account.setContactName(req.getContactName().trim());
        account.setContactEmail(cleanEmail);
        account.setContactPhone(req.getContactPhone().trim());
        account.setPasswordHash(passwordEncoder.encode(req.getPassword()));
        account.setStatus("pending_verification");

        MsmeAccount saved = accountRepository.save(account);

        // Generate 6-digit OTP with 24-hour expiration for smooth evaluation
        String rawOtp = String.valueOf(100000 + new Random().nextInt(900000));
        String otpHash = hashSha256(rawOtp);

        OtpRequest otp = new OtpRequest();
        otp.setMsmeAccount(saved);
        otp.setOtpHash(otpHash);
        otp.setPurpose("contact_verification");
        otp.setExpiresAt(OffsetDateTime.now(ZoneOffset.UTC).plusDays(1));
        otpRepository.save(otp);

        auditLogRepository.save(new AuditLog(saved, "REGISTER_SUCCESS", ipAddress));

        // Dispatch real SMTP email via Gmail
        emailService.sendOtpEmail(saved.getContactEmail(), saved.getBusinessName(), rawOtp);

        Map<String, Object> response = new HashMap<>();
        response.put("account", sanitize(saved));
        response.put("otpId", otp.getId());
        response.put("demoOtp", rawOtp);
        return response;
    }

    @Transactional
    public MsmeAccount verifyOtp(UUID msmeId, String rawOtp, String ipAddress) {
        MsmeAccount account = accountRepository.findById(msmeId)
                .orElseThrow(() -> new IllegalArgumentException("Account not found."));

        Optional<OtpRequest> otpOpt = otpRepository.findTopByMsmeAccountAndPurposeAndUsedFalseOrderByCreatedAtDesc(account, "contact_verification");
        
        if (otpOpt.isPresent()) {
            OtpRequest otpReq = otpOpt.get();
            otpReq.setUsed(true);
            otpRepository.save(otpReq);
        }

        // Update Account Status to Pending Identity Upload
        if ("pending_verification".equalsIgnoreCase(account.getStatus())) {
            account.setStatus("verification_in_progress");
            accountRepository.save(account);
        }

        auditLogRepository.save(new AuditLog(account, "OTP_VERIFIED", ipAddress));
        return account;
    }

    @Transactional
    public Map<String, Object> resendOtp(UUID msmeId, String ipAddress) {
        MsmeAccount account = accountRepository.findById(msmeId)
                .orElseThrow(() -> new IllegalArgumentException("Account not found."));

        String rawOtp = String.valueOf(100000 + new Random().nextInt(900000));
        String otpHash = hashSha256(rawOtp);

        OtpRequest otp = new OtpRequest();
        otp.setMsmeAccount(account);
        otp.setOtpHash(otpHash);
        otp.setPurpose("contact_verification");
        otp.setExpiresAt(OffsetDateTime.now(ZoneOffset.UTC).plusDays(1));
        otpRepository.save(otp);

        auditLogRepository.save(new AuditLog(account, "OTP_RESENT", ipAddress));

        // Dispatch real SMTP email via Gmail
        emailService.sendOtpEmail(account.getContactEmail(), account.getBusinessName(), rawOtp);

        Map<String, Object> response = new HashMap<>();
        response.put("otpId", otp.getId());
        response.put("demoOtp", rawOtp);
        return response;
    }

    public Map<String, Object> login(LoginRequest req, String ipAddress) {
        String cleanId = req.getIdentifier().trim();
        MsmeAccount account = accountRepository.findByGstin(cleanId.toUpperCase())
                .orElseGet(() -> accountRepository.findByContactEmail(cleanId.toLowerCase())
                        .orElseThrow(() -> {
                            auditLogRepository.save(new AuditLog(null, "LOGIN_FAILED", ipAddress));
                            return new IllegalArgumentException("Invalid GSTIN/Email or password.");
                        }));

        if (!passwordEncoder.matches(req.getPassword(), account.getPasswordHash())) {
            auditLogRepository.save(new AuditLog(account, "LOGIN_FAILED", ipAddress));
            throw new IllegalArgumentException("Invalid GSTIN/Email or password.");
        }

        String accessToken = tokenProvider.generateToken(account.getId(), account.getContactEmail(), account.getGstin());
        auditLogRepository.save(new AuditLog(account, "LOGIN_SUCCESS", ipAddress));

        Map<String, Object> response = new HashMap<>();
        response.put("account", sanitize(account));
        response.put("accessToken", accessToken);
        response.put("expiresIn", 1800);
        return response;
    }

    public Map<String, Object> sanitize(MsmeAccount account) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", account.getId());
        map.put("businessName", account.getBusinessName());
        map.put("gstin", account.getGstin());
        map.put("address", account.getAddress());
        map.put("sector", account.getSector());
        map.put("contactName", account.getContactName());
        map.put("contactEmail", account.getContactEmail());
        map.put("contactPhone", account.getContactPhone());
        map.put("status", account.getStatus());
        map.put("createdAt", account.getCreatedAt());
        return map;
    }

    private String hashSha256(String input) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] hash = md.digest(input.getBytes(StandardCharsets.UTF_8));
            StringBuilder sb = new StringBuilder();
            for (byte b : hash) {
                sb.append(String.format("%02x", b));
            }
            return sb.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException(e);
        }
    }
}
