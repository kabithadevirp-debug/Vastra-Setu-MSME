package com.vastrasetu.app.service;

import com.vastrasetu.app.domain.DyerCertification;
import com.vastrasetu.app.repository.DyerCertificationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class DyerCertificationService {

    private final DyerCertificationRepository repository;

    public DyerCertificationService(DyerCertificationRepository repository) {
        this.repository = repository;
    }

    public List<DyerCertification> getCertificationsForDyer(String dyerId) {
        String effectiveDyerId = (dyerId == null || dyerId.trim().isEmpty()) ? "Rainbow Eco-Dyers" : dyerId;
        List<DyerCertification> list = repository.findByDyerIdOrderByExpiryDateAsc(effectiveDyerId);

        if (list.isEmpty()) {
            seedDefaultCertifications(effectiveDyerId);
            list = repository.findByDyerIdOrderByExpiryDateAsc(effectiveDyerId);
        }

        // Recalculate status dynamically
        LocalDate now = LocalDate.now();
        for (DyerCertification cert : list) {
            if (cert.getExpiryDate() != null) {
                long daysUntilExpiry = ChronoUnit.DAYS.between(now, cert.getExpiryDate());
                if (daysUntilExpiry < 0) {
                    cert.setStatus("EXPIRED");
                } else if (daysUntilExpiry <= 30) {
                    cert.setStatus("EXPIRING_SOON");
                } else {
                    cert.setStatus("VALID");
                }
            }
        }
        return list;
    }

    public List<DyerCertification> getExpiringCertifications(String dyerId, int daysThreshold) {
        List<DyerCertification> all = getCertificationsForDyer(dyerId);
        LocalDate now = LocalDate.now();
        return all.stream()
                .filter(c -> c.getExpiryDate() != null &&
                        ChronoUnit.DAYS.between(now, c.getExpiryDate()) >= 0 &&
                        ChronoUnit.DAYS.between(now, c.getExpiryDate()) <= daysThreshold)
                .collect(Collectors.toList());
    }

    @Transactional
    public DyerCertification saveCertification(String dyerId, DyerCertification cert) {
        if (cert.getDyerId() == null || cert.getDyerId().trim().isEmpty()) {
            cert.setDyerId(dyerId != null && !dyerId.trim().isEmpty() ? dyerId : "Rainbow Eco-Dyers");
        }
        cert.setCreatedAt(OffsetDateTime.now());
        
        LocalDate now = LocalDate.now();
        if (cert.getExpiryDate() != null) {
            long days = ChronoUnit.DAYS.between(now, cert.getExpiryDate());
            if (days < 0) cert.setStatus("EXPIRED");
            else if (days <= 30) cert.setStatus("EXPIRING_SOON");
            else cert.setStatus("VALID");
        } else {
            cert.setStatus("VALID");
        }
        return repository.save(cert);
    }

    private void seedDefaultCertifications(String dyerId) {
        DyerCertification c1 = new DyerCertification();
        c1.setDyerId(dyerId);
        c1.setCertType("OEKO_TEX_STANDARD_100");
        c1.setTitle("OEKO-TEX Standard 100 Class I (Baby Safe)");
        c1.setCertNumber("OEKO-2026-TX-98442");
        c1.setCertClassOrLevel("Class I - Organic Baby Safe");
        c1.setIssuingBody("TESTEX AG, Swiss Textile Testing Institute");
        c1.setIssueDate(LocalDate.now().minusMonths(6));
        c1.setExpiryDate(LocalDate.now().plusMonths(6));
        c1.setDocumentUrl("/sample-certs/oeko-tex-certificate.pdf");
        c1.setStatus("VALID");
        repository.save(c1);

        DyerCertification c2 = new DyerCertification();
        c2.setDyerId(dyerId);
        c2.setCertType("ZDHC_MRSL");
        c2.setTitle("ZDHC Manufacturing Restricted Substances List (MRSL)");
        c2.setCertNumber("ZDHC-GATEWAY-2026-091");
        c2.setCertClassOrLevel("Level 3 Conformance");
        c2.setIssuingBody("ZDHC Foundation Amsterdam");
        c2.setIssueDate(LocalDate.now().minusMonths(8));
        c2.setExpiryDate(LocalDate.now().plusDays(22)); // Trigger 30-day alert!
        c2.setDocumentUrl("/sample-certs/zdhc-conformance.pdf");
        c2.setStatus("EXPIRING_SOON");
        repository.save(c2);

        DyerCertification c3 = new DyerCertification();
        c3.setDyerId(dyerId);
        c3.setCertType("TNPCB_CTO");
        c3.setTitle("TNPCB Consent to Operate (CTO) Wet Processing");
        c3.setCertNumber("TNPCB/DYE/2024/091");
        c3.setCertClassOrLevel("Orange Category Eco-Dyeing");
        c3.setIssuingBody("Tamil Nadu Pollution Control Board");
        c3.setIssueDate(LocalDate.now().minusMonths(12));
        c3.setExpiryDate(LocalDate.now().plusYears(2));
        c3.setDocumentUrl("/sample-certs/tnpcb-dyeing-cto.pdf");
        c3.setStatus("VALID");
        repository.save(c3);
    }
}
