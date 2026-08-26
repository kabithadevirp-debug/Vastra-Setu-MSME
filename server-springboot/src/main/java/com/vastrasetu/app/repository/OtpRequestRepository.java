package com.vastrasetu.app.repository;

import com.vastrasetu.app.domain.MsmeAccount;
import com.vastrasetu.app.domain.OtpRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface OtpRequestRepository extends JpaRepository<OtpRequest, UUID> {
    Optional<OtpRequest> findTopByMsmeAccountAndPurposeAndUsedFalseOrderByCreatedAtDesc(MsmeAccount msmeAccount, String purpose);
}
