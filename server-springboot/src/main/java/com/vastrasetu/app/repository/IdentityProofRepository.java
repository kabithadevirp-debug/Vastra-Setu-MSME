package com.vastrasetu.app.repository;

import com.vastrasetu.app.domain.IdentityProof;
import com.vastrasetu.app.domain.MsmeAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface IdentityProofRepository extends JpaRepository<IdentityProof, UUID> {
    List<IdentityProof> findByMsmeAccount(MsmeAccount msmeAccount);
    Optional<IdentityProof> findByMsmeAccountAndDocType(MsmeAccount msmeAccount, String docType);
}
