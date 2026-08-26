package com.vastrasetu.app.util;

import java.util.regex.Pattern;

public class UdyamValidator {

    private static final String UDYAM_REGEX = "^UDYAM-[A-Z]{2}-[0-9]{2}-[0-9]{7}$";
    private static final Pattern UDYAM_PATTERN = Pattern.compile(UDYAM_REGEX);

    /**
     * Validates Udyam Registration Number format (e.g. UDYAM-TN-28-0019284).
     */
    public static boolean isValidUdyamNumber(String udyamNo) {
        if (udyamNo == null) return false;
        String clean = udyamNo.trim().toUpperCase();
        return UDYAM_PATTERN.matcher(clean).matches();
    }
}
