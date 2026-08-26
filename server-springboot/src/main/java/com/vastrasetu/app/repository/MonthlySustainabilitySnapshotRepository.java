package com.vastrasetu.app.repository;

import com.vastrasetu.app.domain.MonthlySustainabilitySnapshot;
import com.vastrasetu.app.domain.MsmeAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface MonthlySustainabilitySnapshotRepository extends JpaRepository<MonthlySustainabilitySnapshot, UUID> {
    List<MonthlySustainabilitySnapshot> findByMsmeAccountOrderBySnapshotMonthAsc(MsmeAccount msmeAccount);
    Optional<MonthlySustainabilitySnapshot> findByMsmeAccountAndSnapshotMonth(MsmeAccount msmeAccount, LocalDate snapshotMonth);
}
