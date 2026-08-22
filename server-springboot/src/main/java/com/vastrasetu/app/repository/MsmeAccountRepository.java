package com.vastrasetu.app.repository;

import com.vastrasetu.app.domain.MsmeAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface MsmeAccountRepository extends JpaRepository<MsmeAccount, UUID> {
    Optional<MsmeAccount> findByGstin(String gstin);
    Optional<MsmeAccount> findByContactEmail(String contactEmail);
    boolean existsByGstin(String gstin);
    boolean existsByContactEmail(String contactEmail);
}
