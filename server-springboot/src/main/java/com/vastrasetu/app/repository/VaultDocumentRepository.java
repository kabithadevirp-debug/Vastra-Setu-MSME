package com.vastrasetu.app.repository;

import com.vastrasetu.app.domain.VaultDocument;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface VaultDocumentRepository extends JpaRepository<VaultDocument, UUID> {
    List<VaultDocument> findByScopeType(String scopeType);
    Optional<VaultDocument> findByDocumentType(String documentType);
    List<VaultDocument> findAllByOrderByCreatedAtDesc();
}
