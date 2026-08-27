package com.vastrasetu.app.service;

import com.vastrasetu.app.domain.FraudFlag;
import com.vastrasetu.app.domain.InspectionOrder;
import com.vastrasetu.app.repository.FraudFlagRepository;
import com.vastrasetu.app.repository.InspectionOrderRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class FraudDetectionService {

    private final FraudFlagRepository fraudFlagRepository;
    private final InspectionOrderRepository inspectionOrderRepository;

    public FraudDetectionService(FraudFlagRepository fraudFlagRepository,
                                 InspectionOrderRepository inspectionOrderRepository) {
        this.fraudFlagRepository = fraudFlagRepository;
        this.inspectionOrderRepository = inspectionOrderRepository;
    }

    public List<FraudFlag> getAllFlags(String status) {
        List<FraudFlag> flags;
        if (status != null && !status.trim().isEmpty() && !"ALL".equalsIgnoreCase(status)) {
            flags = fraudFlagRepository.findByStatusOrderByDetectedAtDesc(status.toUpperCase());
        } else {
            flags = fraudFlagRepository.findAllByOrderByDetectedAtDesc();
        }

        if (flags.isEmpty()) {
            seedDefaultFraudFlags();
            flags = fraudFlagRepository.findAllByOrderByDetectedAtDesc();
        }
        return flags;
    }

    public long getOpenFlagCount() {
        long count = fraudFlagRepository.countByStatus("OPEN");
        if (count == 0 && fraudFlagRepository.count() == 0) {
            seedDefaultFraudFlags();
            count = fraudFlagRepository.countByStatus("OPEN");
        }
        return count;
    }

    @Transactional
    public FraudFlag updateStatus(UUID id, String newStatus) {
        FraudFlag flag = fraudFlagRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Fraud flag not found: " + id));
        flag.setStatus(newStatus.toUpperCase());
        return fraudFlagRepository.save(flag);
    }

    @Transactional
    public InspectionOrder escalateFlag(UUID flagId, String auditorId, String customReason) {
        FraudFlag flag = fraudFlagRepository.findById(flagId)
                .orElseThrow(() -> new IllegalArgumentException("Fraud flag not found: " + flagId));

        flag.setStatus("ESCALATED");
        fraudFlagRepository.save(flag);

        InspectionOrder order = new InspectionOrder();
        order.setOrderNumber("TNPCB/INS/" + LocalDate.now().getYear() + "/" + (1000 + (int)(Math.random() * 9000)));
        order.setMsmeId(flag.getMsmeId());
        order.setMsmeName(flag.getMsmeName());
        order.setGstin(flag.getGstin());
        order.setRelatedFraudFlagId(flag.getId());
        order.setAuditorId(auditorId != null ? auditorId : "Dr. V. Rajeshwaran (Chief Environmental Auditor)");
        order.setReason(customReason != null && !customReason.trim().isEmpty() ? customReason : flag.getDescription());
        order.setStatus("ISSUED");
        order.setIssuedAt(OffsetDateTime.now());

        return inspectionOrderRepository.save(order);
    }

    private void seedDefaultFraudFlags() {
        FraudFlag f1 = new FraudFlag();
        f1.setMsmeId("00000000-0000-0000-0000-000000000009");
        f1.setMsmeName("Balaji Tex Processors");
        f1.setGstin("33AABCB9182C1Z4");
        f1.setFlagType("ELECTRICITY_PRODUCTION_MISMATCH");
        f1.setSeverity("HIGH");
        f1.setDescription("TANGEDCO electricity bill shows 1,200 kWh consumption while declared wet processing output is 12,000 kg fabric. Physics ratio violated (> 80% power deficit).");
        f1.setTriggerData("Power Deficit: 83.4% • Invoiced vs Measured Power Anomaly");
        f1.setStatus("OPEN");
        f1.setDetectedAt(OffsetDateTime.now().minusHours(4));
        fraudFlagRepository.save(f1);

        FraudFlag f2 = new FraudFlag();
        f2.setMsmeId("00000000-0000-0000-0000-000000000008");
        f2.setMsmeName("Annamalai Garment Dyeing");
        f2.setGstin("33AABCA4410A1Z2");
        f2.setFlagType("MISSING_CETP_DISCHARGE_CORRELATION");
        f2.setSeverity("HIGH");
        f2.setDescription("Logged batch #VS-2026-B00019 (6,500 L wash) lacks matching effluent intake receipt at Arulpuram CETP intake manifold.");
        f2.setTriggerData("Intake Flow Discrepancy: 6,500 Litres Unaccounted");
        f2.setStatus("OPEN");
        f2.setDetectedAt(OffsetDateTime.now().minusHours(18));
        fraudFlagRepository.save(f2);
    }
}
