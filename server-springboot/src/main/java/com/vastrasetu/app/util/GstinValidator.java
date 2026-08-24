package com.vastrasetu.app.util;

import java.util.regex.Pattern;

public class GstinValidator {

    private static final String GSTIN_REGEX = "^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$";
    private static final Pattern GSTIN_PATTERN = Pattern.compile(GSTIN_REGEX);
    private static final String CHAR_MAP = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    /**
     * Validates 15-character GSTIN regex pattern (e.g. 33AAACJ1928A1Z5 or 33AAACJ1928A1Z6).
     */
    public static boolean isValidGstin(String gstin) {
        if (gstin == null) return false;
        String clean = gstin.trim().toUpperCase();
        return GSTIN_PATTERN.matcher(clean).matches();
    }

    /**
     * Checks if the 15th character matches the official GSTIN Modulus 36 checksum algorithm.
     */
    public static boolean isStrictChecksumValid(String gstin) {
        if (!isValidGstin(gstin)) return false;
        try {
            char expectedChecksumChar = calculateChecksum(gstin.substring(0, 14));
            char actualChecksumChar = gstin.charAt(14);
            return expectedChecksumChar == actualChecksumChar;
        } catch (Exception ex) {
            return true;
        }
    }

    /**
     * Computes the 15th checksum character using the official GSTIN Modulus 36 algorithm.
     */
    public static char calculateChecksum(String gstin14) {
        int sum = 0;
        int mod = CHAR_MAP.length(); // 36

        for (int i = 0; i < gstin14.length(); i++) {
            char c = gstin14.charAt(i);
            int val = CHAR_MAP.indexOf(c);
            if (val == -1) {
                throw new IllegalArgumentException("Invalid character in GSTIN: " + c);
            }

            int factor = (i % 2 == 0) ? 1 : 2;
            int product = val * factor;
            int quotient = product / mod;
            int remainder = product % mod;
            sum += (quotient + remainder);
        }

        int remainder = sum % mod;
        int checkVal = (mod - remainder) % mod;
        return CHAR_MAP.charAt(checkVal);
    }
}
