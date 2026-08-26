package com.vastrasetu.app.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;

@Service
public class TraceabilityConsistencyEngine {

    private final ObjectMapper objectMapper = new ObjectMapper();

    public Map<String, Object> evaluateConsistency(
            int productionQuantity,
            String fabricComposition,
            List<Map<String, Object>> journeyStages,
            List<Map<String, Object>> evidenceList,
            Integer shipmentQuantity) {

        List<Map<String, Object>> warnings = new ArrayList<>();
        int productDataScore = 20;
        int journeyScore = 0;
        int evidenceScore = 0;
        int consistencyScore = 30;

        // 1. Evaluate Journey Stages Completeness (Max 25 pts)
        if (journeyStages != null && !journeyStages.isEmpty()) {
            int stagesCount = journeyStages.size();
            journeyScore = Math.min(25, stagesCount * 4 + 5); // 5 stages = 25 pts
        }

        // 2. Evaluate Evidence Quality (Max 25 pts)
        double totalMaterialInputKg = 0.0;
        boolean hasFiberDoc = false;
        boolean hasDyeingDoc = false;

        if (evidenceList != null && !evidenceList.isEmpty()) {
            int supportedDocs = 0;
            for (Map<String, Object> doc : evidenceList) {
                String status = (String) doc.getOrDefault("status", "DECLARED");
                if ("DOCUMENT_SUPPORTED".equals(status) || "VALIDATED".equals(status)) {
                    supportedDocs++;
                }

                String docType = (String) doc.getOrDefault("docType", "");
                if (docType.contains("GOTS") || docType.contains("FIBER") || docType.contains("ORGANIC")) {
                    hasFiberDoc = true;
                }
                if (docType.contains("OEKO") || docType.contains("DYE") || docType.contains("CHEMICAL")) {
                    hasDyeingDoc = true;
                }

                // Check certificate expiration dates
                if (doc.containsKey("expiryDate")) {
                    try {
                        String expiryStr = (String) doc.get("expiryDate");
                        LocalDate expiryDate = LocalDate.parse(expiryStr);
                        if (expiryDate.isBefore(LocalDate.now())) {
                            warnings.add(Map.of(
                                    "code", "CERTIFICATE_EXPIRED",
                                    "severity", "WARNING",
                                    "title", "Supporting Evidence Expired",
                                    "reason", "Certificate " + doc.getOrDefault("certificateNo", "REF") + " expired on " + expiryStr + " prior to batch completion.",
                                    "stage", doc.getOrDefault("stageKey", "GENERAL")
                            ));
                            consistencyScore = Math.max(10, consistencyScore - 8);
                        }
                    } catch (Exception ignored) {}
                }
            }
            evidenceScore = Math.min(25, supportedDocs * 6 + 7);
        } else {
            evidenceScore = 5;
            warnings.add(Map.of(
                    "code", "EVIDENCE_MISSING",
                    "severity", "WARNING",
                    "title", "Supporting Evidence Incomplete",
                    "reason", "No verified supplier test certificates or invoices attached.",
                    "stage", "ALL"
            ));
            consistencyScore = Math.max(10, consistencyScore - 10);
        }

        // Calculate material kg across journey stages
        if (journeyStages != null) {
            for (Map<String, Object> stage : journeyStages) {
                if (stage.containsKey("quantityKg")) {
                    try {
                        totalMaterialInputKg += Double.parseDouble(stage.get("quantityKg").toString());
                    } catch (Exception ignored) {}
                }
            }
        }

        // 3. Rule 1: Material Balance Check (Piece count vs. fabric kg input)
        // Standard knitted T-shirt / polo consumes approx 0.20 - 0.24 kg fabric
        if (totalMaterialInputKg > 0) {
            double avgPieceWeightKg = 0.22;
            long expectedCapacityPieces = Math.round(totalMaterialInputKg / avgPieceWeightKg);

            if (productionQuantity > expectedCapacityPieces * 1.20) {
                // Discrepancy: More garments claimed than material input supports
                warnings.add(Map.of(
                        "code", "MATERIAL_QUANTITY_MISMATCH",
                        "severity", "WARNING",
                        "title", "Traceability Anomaly: Material Volume Discrepancy",
                        "reason", String.format("Production quantity (%d units) exceeds supported material input (%.1f kg = approx %d units capacity).",
                                productionQuantity, totalMaterialInputKg, expectedCapacityPieces),
                        "suggestedAction", "Reconcile raw material input weight or adjust production batch quantity."
                ));
                consistencyScore = Math.max(10, consistencyScore - 12);
            }
        }

        // 4. Rule 2: Critical Stage Missing Evidence Check
        if (!hasFiberDoc) {
            warnings.add(Map.of(
                    "code", "STAGE_EVIDENCE_PENDING",
                    "severity", "INFO",
                    "title", "Fiber Origin Evidence Pending",
                    "reason", "GOTS Fiber Scope Certificate has not been attached to Stage 1.",
                    "stage", "RAW_MATERIAL"
            ));
        }

        // 5. Rule 3: Shipment vs Production Volume Check
        if (shipmentQuantity != null && shipmentQuantity > productionQuantity) {
            warnings.add(Map.of(
                    "code", "SHIPMENT_EXCEEDS_PRODUCTION",
                    "severity", "ERROR",
                    "title", "Shipment Volume Conflict",
                    "reason", String.format("Shipment quantity (%d units) exceeds recorded batch production volume (%d units).",
                            shipmentQuantity, productionQuantity),
                    "suggestedAction", "Reduce export shipment dispatch quantity to match production records."
            ));
            consistencyScore = Math.max(0, consistencyScore - 20);
        }

        int totalReadiness = productDataScore + journeyScore + evidenceScore + consistencyScore;
        totalReadiness = Math.min(100, Math.max(0, totalReadiness));
        String readinessStatus = (totalReadiness >= 80 && warnings.stream().noneMatch(w -> "ERROR".equals(w.get("severity"))))
                ? "READY"
                : "ACTION_REQUIRED";

        Map<String, Object> result = new HashMap<>();
        result.put("readinessScore", totalReadiness);
        result.put("readinessStatus", readinessStatus);
        result.put("breakdown", Map.of(
                "productData", Map.of("score", productDataScore, "max", 20, "label", "Product Specification"),
                "productionJourney", Map.of("score", journeyScore, "max", 25, "label", "Production Journey Stages"),
                "evidence", Map.of("score", evidenceScore, "max", 25, "label", "Supporting Evidence"),
                "consistency", Map.of("score", consistencyScore, "max", 30, "label", "Cross-Record Consistency")
        ));
        result.put("warningsCount", warnings.size());
        result.put("warnings", warnings);
        result.put("anomalyStatus", warnings.isEmpty() ? "CONSISTENT" : (warnings.stream().anyMatch(w -> "ERROR".equals(w.get("severity"))) ? "ERROR_DETECTED" : "ANOMALIES_FLAGGED"));
        result.put("evaluationTimestamp", LocalDate.now().toString());

        return result;
    }
}
