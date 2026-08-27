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

    /**
     * Retrieves ONLY real monthly sustainability snapshots for the specified MSME, ordered by month ascending.
     * ZERO fake seed or mock fallback arrays are generated.
     */
    @Transactional(readOnly = true)
    public List<MonthlySustainabilitySnapshot> getOrGenerateSnapshots(UUID msmeId) {
        if (msmeId == null) {
            return List.of();
        }
        MsmeAccount account = accountRepository.findById(msmeId).orElse(null);
        if (account == null) {
            return List.of();
        }

        return snapshotRepository.findByMsmeAccountOrderBySnapshotMonthAsc(account);
    }

    /**
     * Upserts a real MonthlySustainabilitySnapshot when an OperationalDocument (TNEB_BILL, CETP_REPORT, GST_INVOICE)
     * reaches VERIFIED status.
     */
    @Transactional
    public MonthlySustainabilitySnapshot upsertSnapshotFromDocument(UUID msmeId, LocalDate snapshotMonth, Double kwh, Double waterLitres, Double productionUnits, UUID docId) {
        MsmeAccount account = accountRepository.findById(msmeId).orElse(null);
        if (account == null) {
            return null;
        }

        LocalDate normalizedMonth = snapshotMonth != null ? snapshotMonth.withDayOfMonth(1) : LocalDate.now().withDayOfMonth(1);
        List<MonthlySustainabilitySnapshot> existingList = snapshotRepository.findByMsmeAccountOrderBySnapshotMonthAsc(account);
        MonthlySustainabilitySnapshot snapshot = existingList.stream()
                .filter(s -> s.getSnapshotMonth() != null && s.getSnapshotMonth().equals(normalizedMonth))
                .findFirst()
                .orElse(null);

        if (snapshot == null) {
            snapshot = new MonthlySustainabilitySnapshot();
            snapshot.setMsmeAccount(account);
            snapshot.setSnapshotMonth(normalizedMonth);
        }

        if (kwh != null && kwh > 0) {
            snapshot.setElectricityKwh(kwh);
        }
        if (waterLitres != null && waterLitres > 0) {
            snapshot.setWaterLitres(waterLitres);
        }
        if (productionUnits != null && productionUnits > 0) {
            snapshot.setProductionUnits(productionUnits);
        }

        // Carbon estimated using CEA India Central Electricity Authority baseline emission factor (0.716 kg CO2e / kWh)
        double currentKwh = snapshot.getElectricityKwh() != null ? snapshot.getElectricityKwh() : 0.0;
        snapshot.setCarbonKgEstimated(currentKwh * 0.716);

        if (docId != null) {
            String docStr = docId.toString();
            String existing = snapshot.getSourceDocumentIds();
            if (existing == null || existing.isBlank()) {
                snapshot.setSourceDocumentIds(docStr);
            } else if (!existing.contains(docStr)) {
                snapshot.setSourceDocumentIds(existing + "," + docStr);
            }
        }

        return snapshotRepository.save(snapshot);
    }
}
