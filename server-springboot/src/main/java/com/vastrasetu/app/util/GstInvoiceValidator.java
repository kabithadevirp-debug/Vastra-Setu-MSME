package com.vastrasetu.app.util;

import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.Map;

public class GstInvoiceValidator {

    public static ValidationResult validate(Map<String, Object> fields, String registeredGstin) {
        String gstin = fields.get("gstin") != null ? fields.get("gstin").toString().trim().toUpperCase() : null;
        String invoiceDateStr = fields.get("invoice_date") != null ? fields.get("invoice_date").toString().trim() : null;

        boolean checksumValid = true;
        boolean plausibilityValid = true;
        StringBuilder reason = new StringBuilder();

        // 1. Modulus 36 GSTIN Checksum
        if (gstin != null && !gstin.isBlank()) {
            checksumValid = GstinValidator.isValidGstin(gstin);
            if (!checksumValid) {
                reason.append("Invalid GSTIN Modulus 36 checksum. ");
            }

            // Cross-document match against MSME registered GSTIN
            if (registeredGstin != null && !gstin.equalsIgnoreCase(registeredGstin)) {
                checksumValid = false;
                reason.append("Extracted invoice GSTIN (").append(gstin).append(") does not match registered GSTIN (").append(registeredGstin).append("). ");
            }
        }

        // 2. Invoice Date Non-Future Check
        if (invoiceDateStr != null && !invoiceDateStr.isBlank()) {
            try {
                LocalDate invoiceDate = LocalDate.parse(invoiceDateStr);
                if (invoiceDate.isAfter(LocalDate.now())) {
                    plausibilityValid = false;
                    reason.append("Invoice date (").append(invoiceDateStr).append(") cannot be in the future. ");
                }
            } catch (DateTimeParseException ignored) {
                // Keep default
            }
        }

        return new ValidationResult(checksumValid, plausibilityValid, reason.toString().trim());
    }

    public record ValidationResult(boolean checksumValid, boolean plausibilityValid, String reason) {}
}
