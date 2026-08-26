package com.vastrasetu.app.service;

import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class ExportChecklistRulesEngine {

    public Map<String, Object> generateShipmentChecklist(
            String destinationCountry,
            String transportMode,
            String incoterm,
            boolean preferentialOrigin,
            boolean lutApplicable,
            List<Map<String, Object>> attachedDocs) {

        String dest = destinationCountry != null ? destinationCountry : "Germany";
        String transport = transportMode != null ? transportMode.toUpperCase() : "SEA";
        String terms = incoterm != null ? incoterm.toUpperCase() : "CIF";

        Set<String> attachedDocTypes = new HashSet<>();
        if (attachedDocs != null) {
            for (Map<String, Object> doc : attachedDocs) {
                if (doc.containsKey("documentType")) {
                    attachedDocTypes.add(doc.get("documentType").toString());
                }
            }
        }

        List<Map<String, Object>> checklist = new ArrayList<>();

        // 1. COMMERCIAL INVOICE
        checklist.add(createChecklistItem(
                "COMMERCIAL_INVOICE",
                "COMMERCIAL",
                "Commercial Export Invoice",
                "REQUIRED",
                "Primary legal and commercial transaction document specifying itemized value, HS codes, and payment terms.",
                attachedDocTypes.contains("COMMERCIAL_INVOICE")
        ));

        // 2. PACKING LIST
        checklist.add(createChecklistItem(
                "PACKING_LIST",
                "COMMERCIAL",
                "Export Packing List",
                "REQUIRED",
                "Itemizes cartons, gross/net weights, and dimensions required for customs examination and container stuffing.",
                attachedDocTypes.contains("PACKING_LIST")
        ));

        // 3. SHIPPING BILL
        checklist.add(createChecklistItem(
                "SHIPPING_BILL",
                "CUSTOMS",
                "Shipping Bill / Export Declaration",
                "REQUIRED",
                "Mandatory export declaration filed with Indian Customs. (Manual document upload / External ICEGATE status not connected).",
                attachedDocTypes.contains("SHIPPING_BILL")
        ));

        // 4. TRANSPORT DOCUMENT (B/L vs AWB)
        if ("SEA".equalsIgnoreCase(transport)) {
            checklist.add(createChecklistItem(
                    "BILL_OF_LADING",
                    "TRANSPORT",
                    "Bill of Lading (B/L)",
                    "REQUIRED",
                    "Negotiable maritime transport document and title of goods for ocean freight dispatch to " + dest + ".",
                    attachedDocTypes.contains("BILL_OF_LADING")
            ));
            checklist.add(createChecklistItem(
                    "AIRWAY_BILL",
                    "TRANSPORT",
                    "Airway Bill (AWB)",
                    "NOT_APPLICABLE",
                    "Not applicable for sea cargo freight.",
                    false
            ));
        } else {
            checklist.add(createChecklistItem(
                    "AIRWAY_BILL",
                    "TRANSPORT",
                    "Airway Bill (AWB)",
                    "REQUIRED",
                    "Air cargo consignment note for air freight dispatch to " + dest + ".",
                    attachedDocTypes.contains("AIRWAY_BILL")
            ));
            checklist.add(createChecklistItem(
                    "BILL_OF_LADING",
                    "TRANSPORT",
                    "Bill of Lading (B/L)",
                    "NOT_APPLICABLE",
                    "Not applicable for air freight cargo.",
                    false
            ));
        }

        // 5. CERTIFICATE OF ORIGIN
        if (preferentialOrigin) {
            checklist.add(createChecklistItem(
                    "PREFERENTIAL_CERTIFICATE_OF_ORIGIN",
                    "ORIGIN",
                    "Preferential Certificate of Origin",
                    "REQUIRED",
                    "Required by importer in " + dest + " to claim preferential duty concessions under applicable trade agreements.",
                    attachedDocTypes.contains("PREFERENTIAL_CERTIFICATE_OF_ORIGIN") || attachedDocTypes.contains("CERTIFICATE_OF_ORIGIN")
            ));
        } else {
            checklist.add(createChecklistItem(
                    "CERTIFICATE_OF_ORIGIN",
                    "ORIGIN",
                    "Non-Preferential Certificate of Origin",
                    "CONDITIONAL",
                    "Conditionally requested depending on buyer's bank LC or importing customs verification requirements.",
                    attachedDocTypes.contains("CERTIFICATE_OF_ORIGIN")
            ));
        }

        // 6. CARGO INSURANCE CERTIFICATE
        if ("CIF".equalsIgnoreCase(terms) || "CIP".equalsIgnoreCase(terms)) {
            checklist.add(createChecklistItem(
                    "INSURANCE_CERTIFICATE",
                    "INSURANCE",
                    "Marine / Cargo Insurance Certificate",
                    "REQUIRED",
                    "Mandatory seller responsibility under Incoterm " + terms + " to provide minimum Institute Cargo Clauses (C) coverage.",
                    attachedDocTypes.contains("INSURANCE_CERTIFICATE")
            ));
        } else {
            checklist.add(createChecklistItem(
                    "INSURANCE_CERTIFICATE",
                    "INSURANCE",
                    "Marine / Cargo Insurance Certificate",
                    "OPTIONAL",
                    "Optional for exporter under Incoterm " + terms + " (transit insurance arranged by buyer/consignee).",
                    attachedDocTypes.contains("INSURANCE_CERTIFICATE")
            ));
        }

        // 7. TAX / LUT DOCUMENT
        if (lutApplicable) {
            checklist.add(createChecklistItem(
                    "LUT",
                    "TAX",
                    "Letter of Undertaking (LUT - Form GST RFD-11)",
                    "REQUIRED",
                    "Enables zero-rated export of garments without upfront payment of Integrated GST (IGST).",
                    attachedDocTypes.contains("LUT")
            ));
        } else {
            checklist.add(createChecklistItem(
                    "GST_EXPORT_DOCUMENT",
                    "TAX",
                    "GST Tax Invoice with IGST Payment",
                    "REQUIRED",
                    "Tax invoice showing IGST payment with export refund claim.",
                    attachedDocTypes.contains("GST_EXPORT_DOCUMENT")
            ));
        }

        // 8. PRODUCT COMPLIANCE / LAB REPORT
        checklist.add(createChecklistItem(
                "QUALITY_CERTIFICATE",
                "PRODUCT_COMPLIANCE",
                "Garment Quality & Chemical Compliance Test Report",
                "SUPPORTING",
                "Buyer-specified test certificate (e.g. OEKO-TEX Standard 100 / Azo-free chemical testing) supporting product safety.",
                attachedDocTypes.contains("QUALITY_CERTIFICATE") || attachedDocTypes.contains("OEKOTEX_STANDARD_100") || attachedDocTypes.contains("GOTS_FIBER_CERTIFICATE")
        ));

        // CALCULATE EXPORT DOCUMENT READINESS SCORE (0-100%)
        long totalRequiredOrConditional = checklist.stream()
                .filter(item -> "REQUIRED".equals(item.get("requirementStatus")) || "CONDITIONAL".equals(item.get("requirementStatus")))
                .count();

        long uploadedRequiredOrConditional = checklist.stream()
                .filter(item -> ("REQUIRED".equals(item.get("requirementStatus")) || "CONDITIONAL".equals(item.get("requirementStatus"))) && Boolean.TRUE.equals(item.get("isUploaded")))
                .count();

        int score = totalRequiredOrConditional > 0 
                ? (int) Math.round(((double) uploadedRequiredOrConditional / totalRequiredOrConditional) * 100) 
                : 100;

        Map<String, Object> result = new HashMap<>();
        result.put("exportReadinessScore", score);
        result.put("readinessStatus", score >= 80 ? "READY" : "ACTION_REQUIRED");
        result.put("checklist", checklist);
        result.put("summary", Map.of(
                "totalDocuments", checklist.size(),
                "requiredCount", checklist.stream().filter(c -> "REQUIRED".equals(c.get("requirementStatus"))).count(),
                "uploadedCount", checklist.stream().filter(c -> Boolean.TRUE.equals(c.get("isUploaded"))).count(),
                "pendingRequiredCount", checklist.stream().filter(c -> "REQUIRED".equals(c.get("requirementStatus")) && !Boolean.TRUE.equals(c.get("isUploaded"))).count()
        ));

        return result;
    }

    private Map<String, Object> createChecklistItem(
            String docType,
            String category,
            String title,
            String requirementStatus,
            String reason,
            boolean isUploaded) {
        Map<String, Object> item = new HashMap<>();
        item.put("documentType", docType);
        item.put("category", category);
        item.put("title", title);
        item.put("requirementStatus", requirementStatus);
        item.put("applicabilityReason", reason);
        item.put("isUploaded", isUploaded);
        return item;
    }
}
