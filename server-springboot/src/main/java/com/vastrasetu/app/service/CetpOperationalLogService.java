package com.vastrasetu.app.service;

import com.vastrasetu.app.domain.CetpOperationalLog;
import com.vastrasetu.app.repository.CetpOperationalLogRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class CetpOperationalLogService {

    private final CetpOperationalLogRepository repository;

    public CetpOperationalLogService(CetpOperationalLogRepository repository) {
        this.repository = repository;
    }

    public List<CetpOperationalLog> getLogsForCetp(String cetpId, Integer days) {
        String effectiveId = (cetpId == null || cetpId.trim().isEmpty()) ? "Arulpuram CETP Unit 3" : cetpId;
        List<CetpOperationalLog> list = repository.findByCetpIdOrderByLogDateDescLoggedAtDesc(effectiveId);

        if (list.isEmpty()) {
            seedDefaultLogs(effectiveId);
            list = repository.findByCetpIdOrderByLogDateDescLoggedAtDesc(effectiveId);
        }

        if (days != null && days > 0 && list.size() > days) {
            return list.subList(0, days);
        }
        return list;
    }

    @Transactional
    public CetpOperationalLog addLog(String cetpId, CetpOperationalLog log) {
        if (log.getCetpId() == null || log.getCetpId().trim().isEmpty()) {
            log.setCetpId(cetpId != null && !cetpId.trim().isEmpty() ? cetpId : "Arulpuram CETP Unit 3");
        }
        if (log.getLogDate() == null) {
            log.setLogDate(LocalDate.now());
        }
        log.setLoggedAt(OffsetDateTime.now());
        return repository.save(log);
    }

    private void seedDefaultLogs(String cetpId) {
        LocalDate today = LocalDate.now();
        
        // 7 days of shift entries
        double[] flows = { 1178.0, 1185.0, 1160.0, 1192.0, 1175.0, 1180.0, 1190.0 };
        double[] roRecs = { 94.2, 94.5, 93.8, 94.6, 94.1, 94.3, 94.8 };
        double[] bodReds = { 98.5, 98.7, 98.2, 98.6, 98.4, 98.8, 98.9 };
        double[] meeRates = { 8.4, 8.6, 8.2, 8.5, 8.3, 8.4, 8.7 };
        double[] salts = { 8400.0, 8600.0, 8200.0, 8500.0, 8300.0, 8400.0, 8700.0 };

        for (int i = 0; i < 7; i++) {
            CetpOperationalLog l = new CetpOperationalLog();
            l.setCetpId(cetpId);
            l.setLogDate(today.minusDays(i));
            l.setShift(i % 2 == 0 ? "MORNING" : "EVENING");
            l.setRoPermeateFlowKld(flows[i]);
            l.setRoRecoveryPercent(roRecs[i]);
            l.setBodCodReductionPercent(bodReds[i]);
            l.setMeeCrystallizationRate(meeRates[i]);
            l.setSaltRecoveredKg(salts[i]);
            l.setInletTdsPpm(6800.0 + (i * 45));
            l.setPermeateTdsPpm(120.0 + (i * 5));
            l.setLoggedBy("M. Anandhan (Chief Environmental Engineer)");
            l.setLoggedAt(OffsetDateTime.now().minusDays(i).minusHours(2 + i));
            repository.save(l);
        }
    }
}
