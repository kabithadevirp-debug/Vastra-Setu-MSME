package com.vastrasetu.app.domain;

import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "audit_log")
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "msme_id")
    private MsmeAccount msmeAccount;

    @Column(name = "action", length = 100)
    private String action = "REGISTER_SUCCESS";

    @Column(name = "action_type", length = 100)
    private String actionType = "REGISTER_SUCCESS";

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "ip_address", length = 50)
    private String ipAddress = "106.210.xx.xx";

    @Column(name = "user_agent", columnDefinition = "TEXT")
    private String userAgent = "Chrome v126.0 (Windows NT 10.0)";

    @Column(name = "timestamp", nullable = false)
    private OffsetDateTime timestamp = OffsetDateTime.now();

    public AuditLog() {}

    public AuditLog(MsmeAccount msmeAccount, String actionType, String description) {
        this.msmeAccount = msmeAccount;
        this.action = actionType;
        this.actionType = actionType;
        this.description = description;
        this.timestamp = OffsetDateTime.now();
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public MsmeAccount getMsmeAccount() { return msmeAccount; }
    public void setMsmeAccount(MsmeAccount msmeAccount) { this.msmeAccount = msmeAccount; }

    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }

    public String getActionType() { 
        return actionType != null ? actionType : action; 
    }
    public void setActionType(String actionType) { 
        this.actionType = actionType;
        this.action = actionType;
    }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getIpAddress() { return ipAddress; }
    public void setIpAddress(String ipAddress) { this.ipAddress = ipAddress; }

    public String getUserAgent() { return userAgent; }
    public void setUserAgent(String userAgent) { this.userAgent = userAgent; }

    public OffsetDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(OffsetDateTime timestamp) { this.timestamp = timestamp; }
}
