package com.vastrasetu.app.repository;

import com.vastrasetu.app.domain.MsmeAccount;
import com.vastrasetu.app.domain.TrustScore;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface TrustScoreRepository extends JpaRepository<TrustScore, UUID> {
    Optional<TrustScore> findFirstByMsmeAccountOrderByCalculatedAtDesc(MsmeAccount msmeAccount);
}
