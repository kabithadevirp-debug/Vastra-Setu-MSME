package com.vastrasetu.app.repository;

import com.vastrasetu.app.domain.AuditLog;
import com.vastrasetu.app.domain.MsmeAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, UUID> {
    List<AuditLog> findByMsmeAccountOrderByTimestampDesc(MsmeAccount msmeAccount);
    List<AuditLog> findTop20ByMsmeAccountOrderByTimestampDesc(MsmeAccount msmeAccount);
    List<AuditLog> findByMsmeAccountAndActionTypeOrderByTimestampDesc(MsmeAccount msmeAccount, String actionType);
}
