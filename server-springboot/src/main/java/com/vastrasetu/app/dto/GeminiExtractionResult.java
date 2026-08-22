package com.vastrasetu.app.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class GeminiExtractionResult {

    @JsonProperty("document_type")
    private String documentType;

    @JsonProperty("udyam_registration_number")
    private String udyamRegistrationNumber;

    @JsonProperty("gstin")
    private String gstin;

    @JsonProperty("business_name")
    private String businessName;

    @JsonProperty("registration_date")
    private String registrationDate;

    @JsonProperty("confidence")
    private String confidence; // high | medium | low

    public GeminiExtractionResult() {}

    public GeminiExtractionResult(String documentType, String udyamRegistrationNumber, String gstin, String businessName, String registrationDate, String confidence) {
        this.documentType = documentType;
        this.udyamRegistrationNumber = udyamRegistrationNumber;
        this.gstin = gstin;
        this.businessName = businessName;
        this.registrationDate = registrationDate;
        this.confidence = confidence;
    }

    public String getDocumentType() { return documentType; }
    public void setDocumentType(String documentType) { this.documentType = documentType; }

    public String getUdyamRegistrationNumber() { return udyamRegistrationNumber; }
    public void setUdyamRegistrationNumber(String udyamRegistrationNumber) { this.udyamRegistrationNumber = udyamRegistrationNumber; }

    public String getGstin() { return gstin; }
    public void setGstin(String gstin) { this.gstin = gstin; }

    public String getBusinessName() { return businessName; }
    public void setBusinessName(String businessName) { this.businessName = businessName; }

    public String getRegistrationDate() { return registrationDate; }
    public void setRegistrationDate(String registrationDate) { this.registrationDate = registrationDate; }

    public String getConfidence() { return confidence; }
    public void setConfidence(String confidence) { this.confidence = confidence; }
}
