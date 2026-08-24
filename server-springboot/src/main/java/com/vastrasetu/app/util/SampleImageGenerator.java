package com.vastrasetu.app.util;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;

public class SampleImageGenerator {

    public static void main(String[] args) {
        File outputDir = new File("c:/Users/Karanjith/OneDrive/coursera-test/Attachments/Desktop/MSME/Vastra-Setu-MSME/sample_documents");
        if (!outputDir.exists()) {
            outputDir.mkdirs();
        }

        generateImage(new File(outputDir, "1_Udyam_Certificate.png"),
                "GOVERNMENT OF INDIA - MINISTRY OF MSME",
                "UDYAM REGISTRATION CERTIFICATE",
                new String[]{
                        "UDYAM REGISTRATION NUMBER : UDYAM-TN-28-0019284",
                        "NAME OF ENTERPRISE        : SRI JAYAVARMA KNITS & EXPORTS PVT LTD",
                        "ORGANISATION TYPE        : Private Limited Company",
                        "MAJOR ACTIVITY           : MANUFACTURING",
                        "DATE OF INCORPORATION    : 14/03/2018",
                        "DATE OF UDYAM REGISTRATION: 01/07/2020",
                        "",
                        "OFFICIAL ADDRESS OF ENTERPRISE:",
                        "42/B, Avinashi Road, Jayavarma Industrial Complex",
                        "City: Tiruppur, State: Tamil Nadu, PIN: 641603",
                        "",
                        "STATUS: Active Verified MSME Unit"
                });

        generateImage(new File(outputDir, "2_GST_Certificate.png"),
                "GOVERNMENT OF INDIA - GST COUNCIL",
                "REGISTRATION CERTIFICATE (FORM GST REG-06)",
                new String[]{
                        "Registration Number (GSTIN) : 33AAACJ1928A1Z5",
                        "Legal Name                 : SRI JAYAVARMA KNITS & EXPORTS PRIVATE LIMITED",
                        "Trade Name                 : SRI JAYAVARMA KNITS & EXPORTS",
                        "Constitution of Business  : Private Limited Company",
                        "Address of Principal Place : 42/B, Avinashi Road, Tiruppur, Tamil Nadu - 641603",
                        "",
                        "Date of Liability          : 01/07/2017",
                        "Date of Validity           : From 01/07/2017 to Perpetual",
                        "Type of Registration       : Regular",
                        "",
                        "State Code                 : 33 (Tamil Nadu)",
                        "Modulus 36 Checksum Status : VERIFIED VALID"
                });

        generateImage(new File(outputDir, "3_GST_Invoice.png"),
                "SRI JAYAVARMA KNITS & EXPORTS PVT LTD",
                "TAX INVOICE / EXPORT BILL",
                new String[]{
                        "Seller GSTIN   : 33AAACJ1928A1Z5",
                        "Invoice No     : INV-2026-0892",
                        "Invoice Date   : 2026-08-14",
                        "Buyer Name     : INDITEX / ZARA DEUTSCHLAND GMBH",
                        "Buyer Address  : Hamburg Port Distribution Hub, Germany",
                        "",
                        "-------------------------------------------------------------------------",
                        "Item Description                   HSN Code   Qty       Rate      Amount",
                        "-------------------------------------------------------------------------",
                        "1. 100% Organic Cotton Polo Shirt  61051000   4,000 pcs Rs 362.50 Rs 14,50,000",
                        "",
                        "Sub Total                                                         Rs 14,50,000",
                        "Total Amount Payable                                              Rs 14,50,000"
                });

        generateImage(new File(outputDir, "4_TNEB_Electricity_Bill.png"),
                "TANGEDCO - TAMIL NADU ELECTRICITY BOARD",
                "HIGH TENSION (HT) ELECTRICITY TARIFF BILL",
                new String[]{
                        "HT Service No  : 03-928-001-92",
                        "Consumer Name  : SRI JAYAVARMA KNITS & EXPORTS PVT LTD",
                        "Tariff Category: HT III - Industrial Textile Cluster",
                        "Billing Month  : August 2026",
                        "Bill Date      : 05/08/2026",
                        "",
                        "-------------------------------------------------------------------------",
                        "METRIC                             READING",
                        "-------------------------------------------------------------------------",
                        "Previous Meter Reading             1,42,840 kWh",
                        "Current Meter Reading              1,46,800 kWh",
                        "Total Units Consumed               3,960 kWh",
                        "",
                        "Total Bill Amount                  Rs 38,400.00",
                        "CEA India Grid Emission Factor     : 0.716 kg CO2e/kWh",
                        "Calculated Monthly Carbon          : 2,835.36 kg CO2e"
                });

        generateImage(new File(outputDir, "5_CETP_Effluent_Report.png"),
                "ARULPURAM CETP CO-OPERATIVE SOCIETY",
                "EFFLUENT TREATMENT & ZLD COMPLIANCE REPORT",
                new String[]{
                        "Member Unit Name: SRI JAYAVARMA KNITS & EXPORTS PVT LTD",
                        "Member Code     : CETP-TPR-928",
                        "Report Date     : 10/08/2026",
                        "",
                        "-------------------------------------------------------------------------",
                        "PARAMETER                          TEST RESULT     STANDARD",
                        "-------------------------------------------------------------------------",
                        "Raw Effluent Intake Volume         2,60,000 L/mo   -",
                        "RO Permeate Recovery Volume        2,39,200 L/mo   -",
                        "Treatment Efficiency               92%             > 90%",
                        "Discharge Compliance Status        COMPLIANT (ZLD) Zero Discharge",
                        "ZDHC Certification Level           Level 3 Zero Discharge",
                        "",
                        "Clearance Status: ACTIVE COMPLIANT (Zero Liquid Discharge Verified)"
                });

        generateImage(new File(outputDir, "6_TNPCB_Pollution_Certificate.png"),
                "TAMIL NADU POLLUTION CONTROL BOARD (TNPCB)",
                "CONSENT TO OPERATE (CTO) - WATER & AIR ACTS",
                new String[]{
                        "Consent Order No: TNPCB/TPR/ORG/2026-928",
                        "Issued To       : SRI JAYAVARMA KNITS & EXPORTS PVT LTD",
                        "Factory Address : 42/B, Avinashi Road, Tiruppur, Tamil Nadu - 641603",
                        "",
                        "-------------------------------------------------------------------------",
                        "CONSENT PARAMETERS",
                        "-------------------------------------------------------------------------",
                        "Industry Category           : ORANGE CATEGORY (Textile Processing)",
                        "Consent Granted Under       : Section 25 Water Act 1974 & Air Act 1981",
                        "Date of Issue               : 01/09/2025",
                        "Valid Up To Date            : 30/09/2026",
                        "Compliance Mandate          : Zero Liquid Discharge (ZLD)",
                        "",
                        "Status: Active Valid Consent Certificate"
                });

        System.out.println("✅ All 6 sample document PNG images generated successfully in sample_documents/");
    }

    private static void generateImage(File outputFile, String title, String subtitle, String[] lines) {
        int width = 1000;
        int height = 1200;
        BufferedImage image = new BufferedImage(width, height, BufferedImage.TYPE_INT_RGB);
        Graphics2D g = image.createGraphics();

        g.setRenderingHint(RenderingHints.KEY_TEXT_ANTIALIASING, RenderingHints.VALUE_TEXT_ANTIALIAS_ON);

        // Background
        g.setColor(Color.WHITE);
        g.fillRect(0, 0, width, height);

        // Outer Border
        g.setColor(new Color(4, 120, 87));
        g.setStroke(new BasicStroke(6));
        g.drawRect(20, 20, width - 40, height - 40);

        // Header Background
        g.setColor(new Color(236, 253, 245));
        g.fillRect(26, 26, width - 52, 110);
        g.setColor(new Color(4, 120, 87));
        g.drawRect(26, 26, width - 52, 110);

        // Header Text
        g.setFont(new Font("Serif", Font.BOLD, 26));
        FontMetrics fmTitle = g.getFontMetrics();
        int titleX = (width - fmTitle.stringWidth(title)) / 2;
        g.drawString(title, titleX, 70);

        g.setFont(new Font("SansSerif", Font.BOLD, 18));
        FontMetrics fmSub = g.getFontMetrics();
        int subX = (width - fmSub.stringWidth(subtitle)) / 2;
        g.drawString(subtitle, subX, 105);

        // Content Lines
        g.setColor(Color.BLACK);
        g.setFont(new Font("Monospaced", Font.PLAIN, 18));
        int startY = 190;
        int lineHeight = 32;

        for (String line : lines) {
            g.drawString(line, 60, startY);
            startY += lineHeight;
        }

        // Footer Stamp
        g.setColor(new Color(6, 95, 70));
        g.setStroke(new BasicStroke(3));
        g.drawOval(width - 250, height - 220, 180, 180);
        g.setFont(new Font("SansSerif", Font.BOLD, 14));
        g.drawString("VASTRASETU DPI", width - 225, height - 135);
        g.drawString("VERIFIED DOC", width - 215, height - 110);

        g.dispose();

        try {
            ImageIO.write(image, "png", outputFile);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
