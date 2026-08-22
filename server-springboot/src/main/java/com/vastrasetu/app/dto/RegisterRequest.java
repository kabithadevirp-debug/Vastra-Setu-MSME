package com.vastrasetu.app.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class RegisterRequest {

    @NotBlank(message = "Business name is required")
    private String businessName;

    @NotBlank(message = "GSTIN is required")
    @Size(min = 15, max = 15, message = "GSTIN must be exactly 15 characters")
    private String gstin;

    @NotBlank(message = "Address is required")
    private String address;

    private String sector = "Textiles";

    @NotBlank(message = "Contact name is required")
    private String contactName;

    @NotBlank(message = "Contact email is required")
    @Email(message = "Invalid email format")
    private String contactEmail;

    @NotBlank(message = "Contact phone is required")
    private String contactPhone;

    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must be at least 8 characters")
    private String password;

    public RegisterRequest() {}

    public String getBusinessName() { return businessName; }
    public void setBusinessName(String businessName) { this.businessName = businessName; }

    public String getGstin() { return gstin; }
    public void setGstin(String gstin) { this.gstin = gstin; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getSector() { return sector; }
    public void setSector(String sector) { this.sector = sector; }

    public String getContactName() { return contactName; }
    public void setContactName(String contactName) { this.contactName = contactName; }

    public String getContactEmail() { return contactEmail; }
    public void setContactEmail(String contactEmail) { this.contactEmail = contactEmail; }

    public String getContactPhone() { return contactPhone; }
    public void setContactPhone(String contactPhone) { this.contactPhone = contactPhone; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}
