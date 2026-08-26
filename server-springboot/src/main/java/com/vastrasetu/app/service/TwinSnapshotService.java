package com.vastrasetu.app.service;

import com.vastrasetu.app.domain.*;
import com.vastrasetu.app.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;

@Service
public class TwinSnapshotService {

    private final MonthlySustainabilitySnapshotRepository snapshotRepository;
    private final MsmeAccountRepository accountRepository;
    private final OperationalDocumentRepository opDocRepository;

    public TwinSnapshotService(MonthlySustainabilitySnapshotRepository snapshotRepository,
                               MsmeAccountRepository accountRepository,
                               OperationalDocumentRepository opDocRepository) {
        this.snapshotRepository = snapshotRepository;
        this.accountRepository = accountRepository;
        this.opDocRepository = opDocRepository;
    }

    @Transactional
    public List<MonthlySustainabilitySnapshot> getOrGenerateSnapshots(UUID msmeId) {
        MsmeAccount account = accountRepository.findById(msmeId).orElse(null);
        if (account == null) {
            return generateMockSnapshots();
        }

        List<MonthlySustainabilitySnapshot> snapshots = snapshotRepository.findByMsmeAccountOrderBySnapshotMonthAsc(account);

        if (snapshots.isEmpty()) {
            // Seed 6 months of historical baseline data for Tiruppur cluster
            LocalDate currentMonth = LocalDate.now().withDayOfMonth(1);
            double[] electricity = {4776.0, 4539.0, 4329.0, 4162.0, 4036.0, 3960.0};
            double[] water = {312000.0, 298000.0, 285000.0, 274000.0, 268000.0, 260000.0};
            double[] production = {1400.0, 1400.0, 1400.0, 1400.0, 1400.0, 1400.0};

            for (int i = 5; i >= 0; i--) {
                LocalDate m = currentMonth.minusMonths(i);
                MonthlySustainabilitySnapshot snap = new MonthlySustainabilitySnapshot();
                snap.setMsmeAccount(account);
                snap.setSnapshotMonth(m);
                snap.setElectricityKwh(electricity[5 - i]);
                snap.setWaterLitres(water[5 - i]);
                snap.setProductionUnits(production[5 - i]);
                snapshotRepository.save(snap);
            }
            snapshots = snapshotRepository.findByMsmeAccountOrderBySnapshotMonthAsc(account);
        }

        return snapshots;
    }

    private List<MonthlySustainabilitySnapshot> generateMockSnapshots() {
        List<MonthlySustainabilitySnapshot> list = new ArrayList<>();
        LocalDate currentMonth = LocalDate.now().withDayOfMonth(1);
        double[] electricity = {4776.0, 4539.0, 4329.0, 4162.0, 4036.0, 3960.0};
        double[] water = {312000.0, 298000.0, 285000.0, 274000.0, 268000.0, 260000.0};

        for (int i = 5; i >= 0; i--) {
            LocalDate m = currentMonth.minusMonths(i);
            MonthlySustainabilitySnapshot snap = new MonthlySustainabilitySnapshot();
            snap.setSnapshotMonth(m);
            snap.setElectricityKwh(electricity[5 - i]);
            snap.setWaterLitres(water[5 - i]);
            snap.setProductionUnits(1400.0);
            list.add(snap);
        }
        return list;
    }
}
