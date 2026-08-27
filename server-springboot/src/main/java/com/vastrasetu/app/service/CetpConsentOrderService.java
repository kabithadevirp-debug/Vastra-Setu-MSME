package com.vastrasetu.app.service;

import com.vastrasetu.app.domain.CetpConsentOrder;
import com.vastrasetu.app.repository.CetpConsentOrderRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class CetpConsentOrderService {

    private final CetpConsentOrderRepository repository;

    public CetpConsentOrderService(CetpConsentOrderRepository repository) {
        this.repository = repository;
    }

    public List<CetpConsentOrder> getConsentOrdersForCetp(String cetpId) {
        String effectiveId = (cetpId == null || cetpId.trim().isEmpty()) ? "Arulpuram CETP Unit 3" : cetpId;
        List<CetpConsentOrder> list = repository.findByCetpIdOrderByExpiryDateAsc(effectiveId);

        if (list.isEmpty()) {
            seedDefaultConsentOrder(effectiveId);
            list = repository.findByCetpIdOrderByExpiryDateAsc(effectiveId);
        }

        LocalDate now = LocalDate.now();
        for (CetpConsentOrder order : list) {
            if (order.getExpiryDate() != null) {
                long days = ChronoUnit.DAYS.between(now, order.getExpiryDate());
                if (days < 0) order.setStatus("EXPIRED");
                else if (days <= 30) order.setStatus("EXPIRING_SOON");
                else order.setStatus("VALID");
            }
        }
        return list;
    }

    @Transactional
    public CetpConsentOrder saveConsentOrder(String cetpId, CetpConsentOrder order) {
        if (order.getCetpId() == null || order.getCetpId().trim().isEmpty()) {
            order.setCetpId(cetpId != null && !cetpId.trim().isEmpty() ? cetpId : "Arulpuram CETP Unit 3");
        }
        order.setCreatedAt(OffsetDateTime.now());

        LocalDate now = LocalDate.now();
        if (order.getExpiryDate() != null) {
            long days = ChronoUnit.DAYS.between(now, order.getExpiryDate());
            if (days < 0) order.setStatus("EXPIRED");
            else if (days <= 30) order.setStatus("EXPIRING_SOON");
            else order.setStatus("VALID");
        } else {
            order.setStatus("VALID");
        }
        return repository.save(order);
    }

    private void seedDefaultConsentOrder(String cetpId) {
        CetpConsentOrder order = new CetpConsentOrder();
        order.setCetpId(cetpId);
        order.setOrderNumber("TNPCB-CETP-ZLD-2024-88");
        order.setTitle("Tamil Nadu Pollution Control Board 100% ZLD Consent Order");
        order.setIssuingAuthority("Tamil Nadu Pollution Control Board (TNPCB)");
        order.setPlantCapacityKld(2500.0);
        order.setZldComplianceStatus("100% Zero Liquid Discharge Verified (MBR + RO + MEE)");
        order.setIssueDate(LocalDate.now().minusMonths(10));
        order.setExpiryDate(LocalDate.now().plusYears(3));
        order.setDocumentUrl("/sample-certs/tnpcb-zld-certificate.pdf");
        order.setStatus("VALID");
        repository.save(order);
    }
}
