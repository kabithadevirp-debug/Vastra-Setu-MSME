package com.vastrasetu.app.util;

import java.util.Map;

public class CetpReportValidator {

    public static ValidationResult validate(Map<String, Object> fields) {
        boolean plausibilityValid = true;
        StringBuilder reason = new StringBuilder();

        Object efficiencyObj = fields.get("treatment_efficiency_percent");
        double efficiency = 95.0;
        if (efficiencyObj != null) {
            try {
                efficiency = Double.parseDouble(efficiencyObj.toString());
            } catch (NumberFormatException ignored) {}
        }

        // 1. Treatment efficiency 0-100% check
        if (efficiency < 0 || efficiency > 100) {
            plausibilityValid = false;
            reason.append("Treatment efficiency (").append(efficiency).append("%) out of range 0-100%. ");
        }

        // 2. Discharge compliance check
        Object complianceObj = fields.get("discharge_compliance");
        if (complianceObj != null) {
            String complianceStr = complianceObj.toString().trim().toLowerCase();
            if (complianceStr.contains("non_compliant") || complianceStr.contains("fail") || complianceStr.contains("breach")) {
                plausibilityValid = false;
                reason.append("CETP effluent discharge report flagged as non-compliant. ");
            }
        }

        return new ValidationResult(true, plausibilityValid, reason.toString().trim());
    }

    public record ValidationResult(boolean checksumValid, boolean plausibilityValid, String reason) {}
}
