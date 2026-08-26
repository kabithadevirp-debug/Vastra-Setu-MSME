package com.vastrasetu.app.repository;

import com.vastrasetu.app.domain.AuthSession;
import com.vastrasetu.app.domain.MsmeAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface AuthSessionRepository extends JpaRepository<AuthSession, UUID> {
    Optional<AuthSession> findByRefreshTokenHashAndRevokedFalse(String refreshTokenHash);
}
