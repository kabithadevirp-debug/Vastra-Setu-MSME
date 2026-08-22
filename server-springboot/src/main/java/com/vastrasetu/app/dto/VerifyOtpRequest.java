package com.vastrasetu.app.dto;

import jakarta.validation.constraints.NotBlank;

public class VerifyOtpRequest {

    @NotBlank(message = "MSME ID is required")
    private String msmeId;

    @NotBlank(message = "OTP is required")
    private String otp;

    public VerifyOtpRequest() {}

    public String getMsmeId() { return msmeId; }
    public void setMsmeId(String msmeId) { this.msmeId = msmeId; }

    public String getOtp() { return otp; }
    public void setOtp(String otp) { this.otp = otp; }
}
