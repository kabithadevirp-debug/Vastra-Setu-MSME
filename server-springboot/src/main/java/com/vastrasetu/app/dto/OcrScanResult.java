package com.vastrasetu.app.dto;

public class OcrScanResult {

    private String rawText;
    private double ocrConfidence; // 0.0 - 100.0%

    public OcrScanResult(String rawText, double ocrConfidence) {
        this.rawText = rawText;
        this.ocrConfidence = ocrConfidence;
    }

    public String getRawText() { return rawText; }
    public void setRawText(String rawText) { this.rawText = rawText; }

    public double getOcrConfidence() { return ocrConfidence; }
    public void setOcrConfidence(double ocrConfidence) { this.ocrConfidence = ocrConfidence; }
}
