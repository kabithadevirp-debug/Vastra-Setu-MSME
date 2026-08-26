package com.vastrasetu.app.util;

import java.util.Map;

public class TnebBillValidator {

    public static ValidationResult validate(Map<String, Object> fields, Double priorMonthUnitsKwh) {
        boolean plausibilityValid = true;
        StringBuilder reason = new StringBuilder();

        Object unitsObj = fields.get("units_consumed_kwh");
        double unitsKwh = 0;
        if (unitsObj != null) {
            try {
                unitsKwh = Double.parseDouble(unitsObj.toString());
            } catch (NumberFormatException ignored) {}
        }

        // 1. Positive kWh Check
        if (unitsKwh <= 0) {
            plausibilityValid = false;
            reason.append("Units consumed (").append(unitsKwh).append(" kWh) must be a positive number. ");
        }

        // 2. Variance Check against prior month (±50% threshold flag for review)
        if (priorMonthUnitsKwh != null && priorMonthUnitsKwh > 0 && unitsKwh > 0) {
            double diffRatio = Math.abs(unitsKwh - priorMonthUnitsKwh) / priorMonthUnitsKwh;
            if (diffRatio > 0.50) {
                plausibilityValid = false;
                reason.append("Electricity usage variance (").append(Math.round(diffRatio * 100)).append("%) exceeds 50% vs prior month. Needs review. ");
            }
        }

        return new ValidationResult(true, plausibilityValid, reason.toString().trim());
    }

    public record ValidationResult(boolean checksumValid, boolean plausibilityValid, String reason) {}
}
