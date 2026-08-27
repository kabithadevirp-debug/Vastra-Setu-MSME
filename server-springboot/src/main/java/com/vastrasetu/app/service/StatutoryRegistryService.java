package com.vastrasetu.app.service;

import com.vastrasetu.app.domain.StatutoryRegistryEntry;
import com.vastrasetu.app.repository.StatutoryRegistryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.List;

@Service
public class StatutoryRegistryService {

    private final StatutoryRegistryRepository repository;

    public StatutoryRegistryService(StatutoryRegistryRepository repository) {
        this.repository = repository;
    }

    public List<StatutoryRegistryEntry> searchRegistry(String query) {
        List<StatutoryRegistryEntry> list;
        if (query != null && !query.trim().isEmpty()) {
            list = repository.findByMsmeNameContainingIgnoreCaseOrGstinContainingIgnoreCaseOrIecNumberContainingIgnoreCase(query, query, query);
        } else {
            list = repository.findAll();
        }

        if (list.isEmpty()) {
            seedDefaultEntries();
            list = repository.findAll();
        }
        return list;
    }

    @Transactional
    public StatutoryRegistryEntry registerOrUpdate(StatutoryRegistryEntry entry) {
        entry.setLastVerifiedAt(OffsetDateTime.now());
        return repository.save(entry);
    }

    private void seedDefaultEntries() {
        StatutoryRegistryEntry e1 = new StatutoryRegistryEntry();
        e1.setMsmeId("e1a2b3c4-d5e6-7f8a-9b0c-1d2e3f4a5b6c");
        e1.setMsmeName("Sri Jayavarma Knits & Exports Pvt Ltd");
        e1.setGstin("33AAACJ1928A1Z5");
        e1.setIecNumber("0492819284");
        e1.setPcbConsentNumber("TNPCB/CTO/DYE/2024/091");
        e1.setUdyamNumber("UDYAM-TN-28-0019284");
        e1.setIssuingAuthority("DGFT Coimbatore / TNPCB");
        e1.setStatus("ACTIVE");
        e1.setLastVerifiedAt(OffsetDateTime.now().minusDays(3));
        repository.save(e1);

        StatutoryRegistryEntry e2 = new StatutoryRegistryEntry();
        e2.setMsmeId("00000000-0000-0000-0000-000000000002");
        e2.setMsmeName("Coimbatore Processing Mills Ltd");
        e2.setGstin("33AABCC4412B1Z9");
        e2.setIecNumber("0488192019");
        e2.setPcbConsentNumber("TNPCB/CTO/TEX/2023/118");
        e2.setUdyamNumber("UDYAM-TN-03-0088192");
        e2.setIssuingAuthority("DGFT Chennai / TNPCB");
        e2.setStatus("ACTIVE");
        e2.setLastVerifiedAt(OffsetDateTime.now().minusDays(5));
        repository.save(e2);

        StatutoryRegistryEntry e3 = new StatutoryRegistryEntry();
        e3.setMsmeId("00000000-0000-0000-0000-000000000003");
        e3.setMsmeName("Kaveri Eco Dyers & Processors");
        e3.setGstin("33AABCK1029C1Z1");
        e3.setIecNumber("0477192843");
        e3.setPcbConsentNumber("TNPCB/CTO/DYE/2022/044");
        e3.setUdyamNumber("UDYAM-TN-11-0077192");
        e3.setIssuingAuthority("DGFT Madurai / TNPCB");
        e3.setStatus("UNDER_REVIEW");
        e3.setLastVerifiedAt(OffsetDateTime.now().minusDays(10));
        repository.save(e3);
    }
}
