package com.vastrasetu.app.repository;

import com.vastrasetu.app.domain.CetpOperationalLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface CetpOperationalLogRepository extends JpaRepository<CetpOperationalLog, UUID> {
    List<CetpOperationalLog> findByCetpIdOrderByLogDateDescLoggedAtDesc(String cetpId);
}
