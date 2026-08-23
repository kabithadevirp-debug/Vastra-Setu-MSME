package com.vastrasetu.app.util;

import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.Map;

public class PcbCertificateValidator {

    public static ValidationResult validate(Map<String, Object> fields) {
        boolean plausibilityValid = true;
        StringBuilder reason = new StringBuilder();

        Object expiryObj = fields.get("expiry_date");
        if (expiryObj != null && !expiryObj.toString().isBlank()) {
            try {
                LocalDate expiryDate = LocalDate.parse(expiryObj.toString().trim());
                if (expiryDate.isBefore(LocalDate.now())) {
                    plausibilityValid = false;
                    reason.append("Pollution Control Board (PCB) Certificate expired on ").append(expiryDate).append(". ");
                }
            } catch (DateTimeParseException ignored) {}
        }

        return new ValidationResult(true, plausibilityValid, reason.toString().trim());
    }

    public record ValidationResult(boolean checksumValid, boolean plausibilityValid, String reason) {}
}
