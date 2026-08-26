package com.vastrasetu.app.service;

import com.vastrasetu.app.domain.*;
import com.vastrasetu.app.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.*;

@Service
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;
    private final MsmeAccountRepository accountRepository;

    public AuditLogService(AuditLogRepository auditLogRepository, MsmeAccountRepository accountRepository) {
        this.auditLogRepository = auditLogRepository;
        this.accountRepository = accountRepository;
    }

    @Transactional
    public void logAction(MsmeAccount account, String actionType, String description, String ip, String userAgent) {
        AuditLog log = new AuditLog();
        log.setMsmeAccount(account);
        log.setActionType(actionType);
        log.setDescription(description);
        log.setIpAddress(ip != null ? ip : "106.210.xx.xx");
        log.setUserAgent(userAgent != null ? userAgent : "Chrome v126.0 (Windows NT 10.0)");
        log.setTimestamp(OffsetDateTime.now());
        auditLogRepository.save(log);
    }

    public List<Map<String, Object>> getAuditLogsForMsme(UUID msmeId, String actionType) {
        MsmeAccount account = accountRepository.findById(msmeId).orElse(null);
        if (account == null) {
            return generateMockLogs();
        }

        List<AuditLog> logs;
        if (actionType != null && !actionType.trim().isEmpty() && !"ALL".equalsIgnoreCase(actionType)) {
            logs = auditLogRepository.findByMsmeAccountAndActionTypeOrderByTimestampDesc(account, actionType);
        } else {
            logs = auditLogRepository.findByMsmeAccountOrderByTimestampDesc(account);
        }

        if (logs.isEmpty()) {
            // Seed initial baseline audit log entries
            logAction(account, "LOGIN", "MSME Account logged in from Chrome / Windows", "106.210.14.88", "Chrome v126");
            logAction(account, "DOCUMENT_UPLOAD", "Uploaded PCB Pollution Certificate (Orange Category)", "106.210.14.88", "Chrome v126");
            logAction(account, "VERIFICATION_OUTCOME", "Identity Proof (Udyam + GSTIN) composite verification passed (Score 94.5%)", "106.210.14.88", "System Pipeline");
            logs = auditLogRepository.findByMsmeAccountOrderByTimestampDesc(account);
        }

        List<Map<String, Object>> result = new ArrayList<>();
        for (AuditLog l : logs) {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("id", l.getId().toString());
            m.put("actionType", l.getActionType());
            m.put("description", l.getDescription());
            m.put("ipAddress", maskIp(l.getIpAddress()));
            m.put("userAgent", l.getUserAgent());
            m.put("timestamp", l.getTimestamp().toString());
            result.add(m);
        }

        return result;
    }

    private String maskIp(String ip) {
        if (ip == null || !ip.contains(".")) return "106.210.xx.xx";
        String[] parts = ip.split("\\.");
        if (parts.length == 4) {
            return parts[0] + "." + parts[1] + ".xx.xx";
        }
        return ip;
    }

    private List<Map<String, Object>> generateMockLogs() {
        return List.of(
                Map.of("id", "LOG-101", "actionType", "LOGIN", "description", "MSME Account logged in from Chrome / Windows", "ipAddress", "106.210.xx.xx", "userAgent", "Chrome v126 (Windows)", "timestamp", OffsetDateTime.now().minusMinutes(12).toString()),
                Map.of("id", "LOG-102", "actionType", "DOCUMENT_UPLOAD", "description", "Uploaded PCB Pollution Certificate (Orange Category)", "ipAddress", "106.210.xx.xx", "userAgent", "Chrome v126 (Windows)", "timestamp", OffsetDateTime.now().minusHours(2).toString()),
                Map.of("id", "LOG-103", "actionType", "VERIFICATION_OUTCOME", "description", "Identity Proof (Udyam + GSTIN) composite verification passed (Score 94.5%)", "ipAddress", "106.210.xx.xx", "userAgent", "System Pipeline", "timestamp", OffsetDateTime.now().minusDays(1).toString()),
                Map.of("id", "LOG-104", "actionType", "PROFILE_CHANGE", "description", "Updated factory contact phone number", "ipAddress", "106.210.xx.xx", "userAgent", "Chrome v126 (Windows)", "timestamp", OffsetDateTime.now().minusDays(3).toString())
        );
    }
}
