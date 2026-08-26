package com.vastrasetu.app.repository;

import com.vastrasetu.app.domain.MsmeAccount;
import com.vastrasetu.app.domain.ProductPassport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ProductPassportRepository extends JpaRepository<ProductPassport, UUID> {
    List<ProductPassport> findByMsmeAccount(MsmeAccount msmeAccount);
    Optional<ProductPassport> findByBatchId(String batchId);
    List<ProductPassport> findByStatus(String status);
}
