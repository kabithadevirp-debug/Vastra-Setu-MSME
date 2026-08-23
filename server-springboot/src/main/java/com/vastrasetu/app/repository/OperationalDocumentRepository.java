package com.vastrasetu.app.repository;

import com.vastrasetu.app.domain.MsmeAccount;
import com.vastrasetu.app.domain.OperationalDocument;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface OperationalDocumentRepository extends JpaRepository<OperationalDocument, UUID> {
    List<OperationalDocument> findByMsmeAccount(MsmeAccount msmeAccount);
    Optional<OperationalDocument> findByMsmeAccountAndDocType(MsmeAccount msmeAccount, String docType);
}
