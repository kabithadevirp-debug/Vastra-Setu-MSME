package com.vastrasetu.app.service;

import com.fasterxml.jackson.databind.MapperFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.vastrasetu.app.domain.ProductPassport;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Map;
import java.util.TreeMap;

@Service
public class PassportHashService {

    private final ObjectMapper objectMapper;

    public PassportHashService() {
        this.objectMapper = new ObjectMapper();
        this.objectMapper.configure(MapperFeature.SORT_PROPERTIES_ALPHABETICALLY, true);
        this.objectMapper.configure(SerializationFeature.ORDER_MAP_ENTRIES_BY_KEYS, true);
    }

    public String computeHash(ProductPassport passport) {
        try {
            Map<String, Object> canonicalMap = new TreeMap<>();
            canonicalMap.put("id", passport.getId() != null ? passport.getId().toString() : "");
            canonicalMap.put("msmeId", passport.getMsmeAccount() != null ? passport.getMsmeAccount().getId().toString() : "");
            canonicalMap.put("productName", passport.getProductName() != null ? passport.getProductName() : "");
            canonicalMap.put("batchId", passport.getBatchId() != null ? passport.getBatchId() : "");
            canonicalMap.put("carbonKg", passport.getCarbonKg() != null ? passport.getCarbonKg() : 0.0);
            canonicalMap.put("waterLitres", passport.getWaterLitres() != null ? passport.getWaterLitres() : 0.0);
            canonicalMap.put("stageDetails", passport.getStageDetails() != null ? passport.getStageDetails() : "");
            canonicalMap.put("sourceDocumentIds", passport.getSourceDocumentIds() != null ? passport.getSourceDocumentIds() : "");

            String canonicalJson = objectMapper.writeValueAsString(canonicalMap);

            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] encodedhash = digest.digest(canonicalJson.getBytes(StandardCharsets.UTF_8));
            return bytesToHex(encodedhash);
        } catch (Exception e) {
            throw new RuntimeException("Failed to compute canonical passport SHA-256 hash", e);
        }
    }

    private String bytesToHex(byte[] hash) {
        StringBuilder hexString = new StringBuilder(2 * hash.length);
        for (byte b : hash) {
            String hex = Integer.toHexString(0xff & b);
            if (hex.length() == 1) {
                hexString.append('0');
            }
            hexString.append(hex);
        }
        return hexString.toString();
    }
}
