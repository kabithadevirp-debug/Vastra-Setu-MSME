package com.vastrasetu.app.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.InputStream;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.*;

@Service
public class TwinNarrativeService {

    @Value("${vastrasetu.ai.openrouter.api-key:}")
    private String openRouterApiKey;

    @Value("${vastrasetu.ai.openrouter.model:google/gemini-2.5-flash}")
    private String openRouterModel;

    private final ObjectMapper objectMapper = new ObjectMapper();

    /**
     * Generates a plain-language explanation and next-step recommendation using OpenRouter AI (google/gemini-2.5-flash).
     * The AI is provided ALREADY-COMPUTED deterministic numbers and is explicitly instructed NOT to alter or re-calculate them.
     */
    public Map<String, String> generateNarrative(UUID msmeId, Map<String, Object> inputParams, Map<String, Object> simResult) {
        try {
            if (openRouterApiKey != null && !openRouterApiKey.trim().isEmpty()) {
                Map<String, String> aiNarrative = callOpenRouterForNarrative(inputParams, simResult);
                if (aiNarrative != null && aiNarrative.containsKey("explanation")) {
                    return aiNarrative;
                }
            }
        } catch (Exception ex) {
            System.err.println("⚠️ OpenRouter AI Narrative call failed, using template fallback: " + ex.getMessage());
        }

        return generateFallbackNarrative(inputParams, simResult);
    }

    private Map<String, String> callOpenRouterForNarrative(Map<String, Object> inputParams, Map<String, Object> simResult) throws Exception {
        double baselineCarbon = getDouble(simResult, "baselineCarbonKg", 0.0);
        double projectedCarbon = getDouble(simResult, "projectedCarbonKg", 0.0);
        double pctReduction = getDouble(simResult, "percentageReduction", 0.0);
        int projectedTrustScore = getInt(simResult, "projectedTrustScore", 86);

        boolean solar = Boolean.TRUE.equals(inputParams.get("solarAdoption"));
        boolean led = Boolean.TRUE.equals(inputParams.get("ledUpgrade"));
        boolean zld = Boolean.TRUE.equals(inputParams.get("zldWaterRecycle"));

        List<String> activeMeasures = new ArrayList<>();
        if (solar) activeMeasures.add("50 kW Rooftop Solar PV Installation");
        if (led) activeMeasures.add("Factory Floor High-Bay LED Retrofit");
        if (zld) activeMeasures.add("Closed-Loop RO Water Recirculation");

        String scenarioDesc = activeMeasures.isEmpty() ? "No sustainability upgrades selected (Current Baseline)" : String.join(", ", activeMeasures);

        String promptText = String.format(
                "You are an expert sustainability advisor for an Indian textile MSME exporter in Tiruppur. " +
                "You are given a what-if simulation scenario and its ALREADY CALCULATED result. " +
                "Do not recalculate, alter, or invent any numbers — only explain the given pre-calculated numbers in plain, encouraging language for a business owner.\n\n" +
                "Current Baseline Carbon: %.2f kg CO2e/month\n" +
                "Scenario Applied: %s\n" +
                "Calculated Results (TREAT AS FACT, DO NOT ALTER):\n" +
                "- New Projected Carbon: %.2f kg CO2e/month\n" +
                "- Carbon Reduction: %.1f%%\n" +
                "- Projected Trust Score: %d/100\n\n" +
                "Respond strictly in JSON format matching this schema:\n" +
                "{\n" +
                "  \"explanation\": \"2-3 sentence explanation of what this carbon and trust score change means for the MSME's export competitiveness.\",\n" +
                "  \"nextStep\": \"One practical, high-value priority action for the factory manager.\"\n" +
                "}",
                baselineCarbon, scenarioDesc, projectedCarbon, pctReduction, projectedTrustScore
        );

        URL url = new URL("https://openrouter.ai/api/v1/chat/completions");
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod("POST");
        conn.setRequestProperty("Authorization", "Bearer " + openRouterApiKey.trim());
        conn.setRequestProperty("Content-Type", "application/json");
        conn.setConnectTimeout(8000);
        conn.setReadTimeout(12000);
        conn.setDoOutput(true);

        Map<String, Object> bodyMap = new LinkedHashMap<>();
        bodyMap.put("model", openRouterModel);
        bodyMap.put("temperature", 0.3);

        List<Map<String, String>> messages = new ArrayList<>();
        messages.add(Map.of("role", "system", "content", "You are a concise, helpful textile ESG advisor. Respond strictly with valid JSON."));
        messages.add(Map.of("role", "user", "content", promptText));
        bodyMap.put("messages", messages);

        String jsonPayload = objectMapper.writeValueAsString(bodyMap);
        try (OutputStream os = conn.getOutputStream()) {
            os.write(jsonPayload.getBytes(StandardCharsets.UTF_8));
        }

        int statusCode = conn.getResponseCode();
        if (statusCode == 200) {
            try (InputStream is = conn.getInputStream()) {
                JsonNode rootNode = objectMapper.readTree(is);
                JsonNode choices = rootNode.path("choices");
                if (choices.isArray() && !choices.isEmpty()) {
                    String content = choices.get(0).path("message").path("content").asText();
                    String cleanJson = cleanJsonContent(content);
                    JsonNode parsed = objectMapper.readTree(cleanJson);
                    
                    Map<String, String> res = new LinkedHashMap<>();
                    res.put("explanation", parsed.path("explanation").asText("Projections show noticeable carbon intensity reduction across Scope 1 & 2 emissions."));
                    res.put("nextStep", parsed.path("nextStep").asText("Proceed with vendor quotes and schedule factory technical audit."));
                    return res;
                }
            }
        }

        return generateFallbackNarrative(inputParams, simResult);
    }

    private Map<String, String> generateFallbackNarrative(Map<String, Object> inputParams, Map<String, Object> simResult) {
        double pctReduction = getDouble(simResult, "percentageReduction", 0.0);
        int projectedTrustScore = getInt(simResult, "projectedTrustScore", 86);
        boolean solar = Boolean.TRUE.equals(inputParams.get("solarAdoption"));
        boolean led = Boolean.TRUE.equals(inputParams.get("ledUpgrade"));

        String explanation;
        String nextStep;

        if (pctReduction > 0) {
            explanation = String.format("Adopting these green upgrades reduces monthly carbon emissions by %.1f%% and increases your VastraSetu Trust Score to %d/100, unlocking lower interest rates on bank green credit lines.", pctReduction, projectedTrustScore);
            if (solar && led) {
                nextStep = "Apply for Ministry of Textiles & SIDBI green technology subsidy for rooftop solar and LED retrofits.";
            } else if (solar) {
                nextStep = "Obtain net-metering approval from TNEB for the proposed 50 kW solar rooftop installation.";
            } else {
                nextStep = "Audit factory lighting layout to replace metal-halide fixtures with high-efficiency LEDs.";
            }
        } else {
            explanation = "Currently showing your baseline operational footprint. Selecting solar or LED upgrades will simulate carbon savings and credit score improvements.";
            nextStep = "Toggle solar PV or LED lighting controls above to model operational improvements.";
        }

        Map<String, String> res = new LinkedHashMap<>();
        res.put("explanation", explanation);
        res.put("nextStep", nextStep);
        return res;
    }

    private String cleanJsonContent(String content) {
        String trimmed = content.trim();
        if (trimmed.startsWith("```json")) {
            trimmed = trimmed.substring(7);
        } else if (trimmed.startsWith("```")) {
            trimmed = trimmed.substring(3);
        }
        if (trimmed.endsWith("```")) {
            trimmed = trimmed.substring(0, trimmed.length() - 3);
        }
        return trimmed.trim();
    }

    private double getDouble(Map<String, Object> map, String key, double defaultVal) {
        if (map == null || !map.containsKey(key) || map.get(key) == null) return defaultVal;
        Object val = map.get(key);
        if (val instanceof Number) return ((Number) val).doubleValue();
        try {
            return Double.parseDouble(val.toString());
        } catch (Exception e) {
            return defaultVal;
        }
    }

    private int getInt(Map<String, Object> map, String key, int defaultVal) {
        if (map == null || !map.containsKey(key) || map.get(key) == null) return defaultVal;
        Object val = map.get(key);
        if (val instanceof Number) return ((Number) val).intValue();
        try {
            return Integer.parseInt(val.toString());
        } catch (Exception e) {
            return defaultVal;
        }
    }
}
