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
                      Thank you for registering on VastraSetu. Use the 6-digit verification code below to confirm your contact details:
                    </p>
                    
                    <div class="otp-box">
                      <div style="font-size:11px; font-weight:700; text-transform:uppercase; color:#047857; margin-bottom:6px;">Single-Use Verification Code</div>
                      <div class="otp-code">%s</div>
                      <div style="font-size:11px; color:#059669; margin-top:6px;">Expires in 15 minutes</div>
                    </div>

                    <div class="footer">
                      VastraSetu — India's Sustainability Passport & Digital Product Passport Platform for MSME Textile Manufacturers.
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

    public void sendDyerAssignmentNotification(String recipientEmail, String dyerName, String batchNumber, String garmentTitle, Integer quantity, String msmeName) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom("727724eucy040@skcet.ac.in", "VastraSetu Supply Chain");
            helper.setTo(recipientEmail);
            helper.setSubject("🧪 Action Required: New Garment Batch Assigned for Dyeing Verification [" + batchNumber + "]");

            String htmlBody = """
                <!DOCTYPE html>
                <html>
                <head>
                  <style>
                    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; margin: 0; padding: 20px; }
                    .card { max-width: 520px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; padding: 32px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
                    .badge { display: inline-block; font-size:11px; font-weight:700; background:#fef3c7; color:#92400e; padding:4px 10px; border-radius:9999px; margin-bottom:12px; }
                    .details-box { background:#f1f5f9; border-radius:8px; padding:14px; margin:16px 0; font-size:13px; color:#334155; line-height:1.6; }
                  </style>
                </head>
                <body>
                  <div class="card">
                    <div class="badge">Stage 2: Dyeing & Chemical Safety</div>
                    <h2 style="font-size: 18px; color: #0f172a; margin-top:0;">New Batch Assigned: %s</h2>
                    <p style="font-size: 13px; color: #475569; line-height: 1.6;">
                      Hello <strong>%s</strong>,<br/>
                      <strong>%s</strong> has initiated an export batch and designated your facility as the wet processing partner.
                    </p>
                    <div class="details-box">
                      <strong>Garment:</strong> %s<br/>
                      <strong>Batch / Order Ref:</strong> %s<br/>
                      <strong>Batch Quantity:</strong> %d pcs<br/>
                      <strong>Next Step:</strong> Input recipe & upload OEKO-TEX Standard 100 / ZDHC certificate in the Dyer Portal.
                    </div>
                    <p style="font-size:12px; color:#64748b;">
                      Access your portal at <a href="http://localhost:5173/portal/dyer" style="color:#0284c7; font-weight:600;">http://localhost:5173/portal/dyer</a>
                    </p>
                  </div>
                </body>
                </html>
                """.formatted(batchNumber, dyerName, msmeName, garmentTitle, batchNumber, quantity != null ? quantity : 4000);

            helper.setText(htmlBody, true);
            mailSender.send(message);
            System.out.println("✅ Dyer Assignment Email sent successfully to " + recipientEmail);
        } catch (Exception ex) {
            System.err.println("⚠️ Dyer Assignment Email failed: " + ex.getMessage());
        }
    }

    public void sendCetpClearanceRequestNotification(String recipientEmail, String cetpName, String batchNumber, String garmentTitle, String dyerVerifiedBy) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom("727724eucy040@skcet.ac.in", "VastraSetu Supply Chain");
            helper.setTo(recipientEmail);
            helper.setSubject("💧 Action Required: Effluent ZLD Clearance Inspection [" + batchNumber + "]");

            String htmlBody = """
                <!DOCTYPE html>
                <html>
                <head>
                  <style>
                    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; margin: 0; padding: 20px; }
                    .card { max-width: 520px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; padding: 32px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
                    .badge { display: inline-block; font-size:11px; font-weight:700; background:#e0f2fe; color:#0369a1; padding:4px 10px; border-radius:9999px; margin-bottom:12px; }
                    .details-box { background:#f1f5f9; border-radius:8px; padding:14px; margin:16px 0; font-size:13px; color:#334155; line-height:1.6; }
                  </style>
                </head>
                <body>
                  <div class="card">
                    <div class="badge">Stage 3: Effluent Treatment & ZLD</div>
                    <h2 style="font-size: 18px; color: #0f172a; margin-top:0;">Effluent Treatment Clearance: %s</h2>
                    <p style="font-size: 13px; color: #475569; line-height: 1.6;">
                      Hello <strong>%s</strong>,<br/>
                      Dyeing verification for <strong>%s</strong> has been completed by <em>%s</em>.
                    </p>
                    <div class="details-box">
                      <strong>Batch Number:</strong> %s<br/>
                      <strong>Required Action:</strong> Record closed-loop water recovery %% and upload TNPCB ZLD clearance certificate to issue the Digital Product Passport.
                    </div>
                    <p style="font-size:12px; color:#64748b;">
                      Access your portal at <a href="http://localhost:5173/portal/cetp" style="color:#0284c7; font-weight:600;">http://localhost:5173/portal/cetp</a>
                    </p>
                  </div>
                </body>
                </html>
                """.formatted(batchNumber, cetpName, garmentTitle, dyerVerifiedBy, batchNumber);

            helper.setText(htmlBody, true);
            mailSender.send(message);
            System.out.println("✅ CETP Clearance Request Email sent successfully to " + recipientEmail);
        } catch (Exception ex) {
            System.err.println("⚠️ CETP Clearance Request Email failed: " + ex.getMessage());
        }
    }

    public void sendPassportIssuedNotification(String recipientEmail, String msmeName, String batchNumber, String passportId, String polygonTxHash) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom("727724eucy040@skcet.ac.in", "VastraSetu Platform");
            helper.setTo(recipientEmail);
            helper.setSubject("🎉 Digital Product Passport Minted & Anchored on Polygon [" + batchNumber + "]");

            String htmlBody = """
                <!DOCTYPE html>
                <html>
                <head>
                  <style>
                    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; margin: 0; padding: 20px; }
                    .card { max-width: 520px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; padding: 32px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
                    .badge { display: inline-block; font-size:11px; font-weight:700; background:#dcfce7; color:#15803d; padding:4px 10px; border-radius:9999px; margin-bottom:12px; }
                    .hash-box { background:#0f172a; color:#38bdf8; font-family:monospace; font-size:11px; word-break:break-all; padding:12px; border-radius:8px; margin:16px 0; }
                  </style>
                </head>
                <body>
                  <div class="card">
                    <div class="badge">EU ESPR 2026 Ready ✓</div>
                    <h2 style="font-size: 18px; color: #0f172a; margin-top:0;">Passport Generated for %s</h2>
                    <p style="font-size: 13px; color: #475569; line-height: 1.6;">
                      Congratulations <strong>%s</strong>,<br/>
                      Your garment export batch has completed all verification gates and is now officially anchored on Polygon Amoy.
                    </p>
                    <div class="hash-box">
                      Polygon Tx Hash: %s
                    </div>
                    <p style="font-size:12px; color:#64748b;">
                      View Public Buyer Trust Page: <a href="http://localhost:5173/verify/%s" style="color:#0284c7; font-weight:600;">http://localhost:5173/verify/%s</a>
                    </p>
                  </div>
                </body>
                </html>
                """.formatted(batchNumber, msmeName, polygonTxHash, batchNumber, batchNumber);

            helper.setText(htmlBody, true);
            mailSender.send(message);
            System.out.println("✅ Passport Issued Email sent successfully to " + recipientEmail);
        } catch (Exception ex) {
            System.err.println("⚠️ Passport Issued Email failed: " + ex.getMessage());
        }
    }
}
