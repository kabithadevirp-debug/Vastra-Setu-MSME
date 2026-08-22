package com.vastrasetu.app.service;

import jakarta.mail.internet.MimeMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendOtpEmail(String recipientEmail, String businessName, String otpCode) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom("727724eucy040@skcet.ac.in", "VastraSetu Platform");
            helper.setTo(recipientEmail);
            helper.setSubject("🔒 VastraSetu — Your MSME Contact Verification OTP Code: " + otpCode);

            String htmlBody = """
                <!DOCTYPE html>
                <html>
                <head>
                  <style>
                    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; margin: 0; padding: 20px; }
                    .card { max-width: 520px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; padding: 32px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
                    .logo { font-size: 20px; font-weight: 800; color: #047857; margin-bottom: 20px; display: flex; align-items: center; gap: 8px; }
                    .otp-box { background-color: #ecfdf5; border: 2px dashed #059669; border-radius: 12px; padding: 18px; text-align: center; margin: 24px 0; }
                    .otp-code { font-size: 32px; font-weight: 800; font-family: monospace; letter-spacing: 8px; color: #065f46; }
                    .footer { font-size: 11px; color: #94a3b8; text-align: center; margin-top: 24px; border-t: 1px solid #f1f5f9; padding-top: 16px; }
                  </style>
                </head>
                <body>
                  <div class="card">
                    <div class="logo">◈ VastraSetu <span style="font-size:12px; background:#dcfce7; color:#15803d; padding:2px 8px; border-radius:6px;">DPI Verified</span></div>
                    <h2 style="font-size: 18px; color: #0f172a; margin-top:0;">Contact Verification OTP</h2>
                    <p style="font-size: 13px; color: #475569; line-height: 1.6;">
                      Hello <strong>%s</strong>,<br/>
                      Thank you for registering on VastraSetu. Use the 6-digit verification code below to confirm your contact details and proceed with document submission:
                    </p>
                    
                    <div class="otp-box">
                      <div style="font-size:11px; font-weight:700; text-transform:uppercase; color:#047857; margin-bottom:6px;">Single-Use Verification Code</div>
                      <div class="otp-code">%s</div>
                      <div style="font-size:11px; color:#059669; margin-top:6px;">Expires in 15 minutes</div>
                    </div>

                    <p style="font-size: 12px; color: #64748b;">
                      If you did not request this verification code, please ignore this email or contact support@vastrasetu.in.
                    </p>
                    
                    <div class="footer">
                      VastraSetu — India's Sustainability Passport & Digital Product Passport Platform for MSME Textile Manufacturers.<br/>
                      RBI-Grade DPI + DPDP Consent Framework Enabled.
                    </div>
                  </div>
                </body>
                </html>
                """.formatted(businessName, otpCode);

            helper.setText(htmlBody, true);
            mailSender.send(message);
            System.out.println("✅ SMTP OTP Email sent successfully to " + recipientEmail);
        } catch (Exception ex) {
            System.err.println("⚠️ Email sending failed: " + ex.getMessage());
        }
    }
}
