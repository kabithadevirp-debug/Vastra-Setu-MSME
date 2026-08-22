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

    @Column(name = "action", nullable = false, length = 50)
    private String action;

    @Column(name = "ip_address", length = 45)
    private String ipAddress;

    @Column(name = "timestamp")
    private OffsetDateTime timestamp = OffsetDateTime.now();

    public AuditLog() {}

    public AuditLog(MsmeAccount msmeAccount, String action, String ipAddress) {
        this.msmeAccount = msmeAccount;
        this.action = action;
        this.ipAddress = ipAddress;
        this.timestamp = OffsetDateTime.now();
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public MsmeAccount getMsmeAccount() { return msmeAccount; }
    public void setMsmeAccount(MsmeAccount msmeAccount) { this.msmeAccount = msmeAccount; }

    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }

    public String getIpAddress() { return ipAddress; }
    public void setIpAddress(String ipAddress) { this.ipAddress = ipAddress; }

    public OffsetDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(OffsetDateTime timestamp) { this.timestamp = timestamp; }
}
