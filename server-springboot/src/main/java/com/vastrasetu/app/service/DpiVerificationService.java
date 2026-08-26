package com.vastrasetu.app.service;

import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class DpiVerificationService {

    /**
     * Simulates live GSTN DPI lookup & ISO 7064 Modulus 36 checksum verification.
     */
    public Map<String, Object> verifyGstinWithGstnSandbox(String gstin) {
        Map<String, Object> result = new HashMap<>();
        if (gstin == null || gstin.trim().length() != 15) {
            result.put("valid", false);
            result.put("error", "Invalid GSTIN length. Must be exactly 15 alphanumeric characters.");
            return result;
        }

        String cleaned = gstin.trim().toUpperCase();
        String stateCode = cleaned.substring(0, 2);
        String pan = cleaned.substring(2, 12);
        char entityCode = cleaned.charAt(12);
        char checksumChar = cleaned.charAt(14);

        // ISO 7064 Mod 36, 10 calculation check
        boolean checksumValid = calculateMod36Checksum(cleaned.substring(0, 14)) == checksumChar;

        result.put("valid", true);
        result.put("gstin", cleaned);
        result.put("stateCode", stateCode);
        result.put("stateName", getStateName(stateCode));
        result.put("pan", pan);
        result.put("taxpayerStatus", "ACTIVE");
        result.put("taxpayerType", "Regular");
        result.put("checksumValid", checksumValid);
        result.put("dpiRegistry", "GSTN Live Registry (Simulated DPI)");
        result.put("trustFactor", 100);

        return result;
    }

    /**
     * Cross-verifies TNEB electricity consumption plausibility against production batch quantity.
     * Standard textile garment benchmark: 0.4 to 1.5 kWh per piece.
     */
    public Map<String, Object> verifyTnebMeterConsumption(String consumerNumber, Double reportedKwh, Integer garmentQuantity) {
        Map<String, Object> result = new HashMap<>();
        if (reportedKwh == null || reportedKwh <= 0 || garmentQuantity == null || garmentQuantity <= 0) {
            result.put("valid", false);
            result.put("error", "Invalid consumption or quantity parameters.");
            return result;
        }

        double kwhPerPiece = reportedKwh / garmentQuantity;
        boolean plausible = kwhPerPiece >= 0.25 && kwhPerPiece <= 2.5;
        String anomalyRisk = "LOW";
        if (kwhPerPiece < 0.25) {
            anomalyRisk = "HIGH_UNDER_REPORTING"; // Possible unrecorded grid or generator power
        } else if (kwhPerPiece > 2.5) {
            anomalyRisk = "HIGH_INEFFICIENCY"; // Significant thermal/motor leakage
        }

        result.put("valid", true);
        result.put("consumerNumber", consumerNumber != null ? consumerNumber : "TNEB-HT-03-9941");
        result.put("reportedKwh", reportedKwh);
        result.put("garmentQuantity", garmentQuantity);
        result.put("kwhPerPiece", Math.round(kwhPerPiece * 100.0) / 100.0);
        result.put("plausible", plausible);
        result.put("anomalyRisk", anomalyRisk);
        result.put("gridCarbonFactor", "0.82 kg CO2e / kWh (CEA India)");
        result.put("scope2CarbonKg", Math.round(reportedKwh * 0.82 * 100.0) / 100.0);

        return result;
    }

    /**
     * Simulates TNPCB (Tamil Nadu Pollution Control Board) online registry validation.
     */
    public Map<String, Object> verifyTnpcbConsentStatus(String consentOrderNo, String category) {
        Map<String, Object> result = new HashMap<>();
        String consent = consentOrderNo != null && !consentOrderNo.isEmpty() ? consentOrderNo : "TNPCB-ZLD-2026-8812";
        String cat = category != null ? category : "ORANGE_TEXTILE_PROCESSING";

        result.put("valid", true);
        result.put("consentOrderNo", consent);
        result.put("category", cat);
        result.put("zldMandated", true);
        result.put("zldStatus", "COMPLIANT_100_PERCENT");
        result.put("status", "ACTIVE_CONSENT");
        result.put("renewalDueDays", 24);
        result.put("authority", "Tamil Nadu Pollution Control Board (TNPCB Tiruppur South)");

        return result;
    }

    private char calculateMod36Checksum(String input) {
        String chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        int factor = 2;
        int sum = 0;
        int n = chars.length();

        for (int i = input.length() - 1; i >= 0; i--) {
            int codePoint = chars.indexOf(input.charAt(i));
            int addend = factor * codePoint;
            factor = (factor == 2) ? 1 : 2;
            addend = (addend / n) + (addend % n);
            sum += addend;
        }

        int remainder = sum % n;
        int checkCodePoint = (n - remainder) % n;
        return chars.charAt(checkCodePoint);
    }

    private String getStateName(String code) {
        return switch (code) {
            case "33" -> "Tamil Nadu";
            case "29" -> "Karnataka";
            case "27" -> "Maharashtra";
            case "24" -> "Gujarat";
            case "07" -> "Delhi";
            default -> "State (" + code + ")";
        };
    }
}
