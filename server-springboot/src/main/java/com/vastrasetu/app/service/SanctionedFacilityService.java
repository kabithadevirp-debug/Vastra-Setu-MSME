package com.vastrasetu.app.service;

import com.vastrasetu.app.domain.SanctionedFacility;
import com.vastrasetu.app.repository.SanctionedFacilityRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class SanctionedFacilityService {

    private final SanctionedFacilityRepository repository;

    public SanctionedFacilityService(SanctionedFacilityRepository repository) {
        this.repository = repository;
    }

    public List<SanctionedFacility> getFacilitiesForBank(String bankId) {
        String effectiveBankId = (bankId == null || bankId.trim().isEmpty()) ? "State Bank of India - Green Lending Desk" : bankId;
        List<SanctionedFacility> list = repository.findByBankIdOrderBySanctionDateDesc(effectiveBankId);

        if (list.isEmpty()) {
            seedDefaultFacilities(effectiveBankId);
            list = repository.findByBankIdOrderBySanctionDateDesc(effectiveBankId);
        }
        return list;
    }

    @Transactional
    public SanctionedFacility sanctionNewFacility(String bankId, SanctionedFacility facility) {
        if (facility.getBankId() == null || facility.getBankId().trim().isEmpty()) {
            facility.setBankId(bankId != null && !bankId.trim().isEmpty() ? bankId : "State Bank of India - Green Lending Desk");
        }
        if (facility.getSanctionDate() == null) {
            facility.setSanctionDate(LocalDate.now());
        }
        if (facility.getEffectiveInterestRate() == null) {
            double base = facility.getBaseInterestRate() != null ? facility.getBaseInterestRate() : 9.50;
            double disc = facility.getGreenDiscountApplied() != null ? facility.getGreenDiscountApplied() : 1.25;
            facility.setEffectiveInterestRate(Math.max(0.0, base - disc));
        }
        if (facility.getSanctionLetterRef() == null || facility.getSanctionLetterRef().trim().isEmpty()) {
            facility.setSanctionLetterRef("SBI/GRN/" + LocalDate.now().getYear() + "/" + (1000 + (int)(Math.random() * 9000)));
        }
        facility.setStatus("ACTIVE");
        facility.setCreatedAt(OffsetDateTime.now());
        return repository.save(facility);
    }

    public double getTotalSanctionedAmount(String bankId) {
        List<SanctionedFacility> list = getFacilitiesForBank(bankId);
        return list.stream().mapToDouble(SanctionedFacility::getSanctionedAmount).sum();
    }

    private void seedDefaultFacilities(String bankId) {
        SanctionedFacility f1 = new SanctionedFacility();
        f1.setMsmeId("e1a2b3c4-d5e6-7f8a-9b0c-1d2e3f4a5b6c");
        f1.setMsmeName("Sri Jayavarma Knits & Exports Pvt Ltd");
        f1.setGstin("33AAACJ1928A1Z5");
        f1.setBankId(bankId);
        f1.setFacilityType("WORKING_CAPITAL_EXPORT_CREDIT");
        f1.setSanctionedAmount(25000000.0); // Rs. 2.50 Cr
        f1.setBaseInterestRate(9.50);
        f1.setGreenDiscountApplied(1.25);
        f1.setEffectiveInterestRate(8.25);
        f1.setTrustScoreAtSanction(94);
        f1.setTenureMonths(36);
        f1.setSanctionDate(LocalDate.now().minusMonths(2));
        f1.setSanctionLetterRef("SBI/GRN/2026/0912");
        f1.setStatus("ACTIVE");
        repository.save(f1);

        SanctionedFacility f2 = new SanctionedFacility();
        f2.setMsmeId("00000000-0000-0000-0000-000000000002");
        f2.setMsmeName("Coimbatore Processing Mills Ltd");
        f2.setGstin("33AABCC4412B1Z9");
        f2.setBankId(bankId);
        f2.setFacilityType("SOLAR_ROOFTOP_EQUIPMENT_FINANCING");
        f2.setSanctionedAmount(18000000.0); // Rs. 1.80 Cr
        f2.setBaseInterestRate(9.50);
        f2.setGreenDiscountApplied(1.00);
        f2.setEffectiveInterestRate(8.50);
        f2.setTrustScoreAtSanction(88);
        f2.setTenureMonths(48);
        f2.setSanctionDate(LocalDate.now().minusMonths(4));
        f2.setSanctionLetterRef("SBI/GRN/2026/0441");
        f2.setStatus("ACTIVE");
        repository.save(f2);
    }
}
