package com.vastrasetu.app.util;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;

public class GenerateGotsCert {

    public static void main(String[] args) {
        File outputDir = new File("c:/Users/Karanjith/OneDrive/coursera-test/Attachments/Desktop/MSME/Vastra-Setu-MSME/sample_documents");
        if (!outputDir.exists()) {
            outputDir.mkdirs();
        }

        File outputFile = new File(outputDir, "7_GOTS_Organic_Fiber_Certificate.png");

        int width = 1000;
        int height = 1200;
        BufferedImage image = new BufferedImage(width, height, BufferedImage.TYPE_INT_RGB);
        Graphics2D g = image.createGraphics();

        g.setRenderingHint(RenderingHints.KEY_TEXT_ANTIALIASING, RenderingHints.VALUE_TEXT_ANTIALIAS_ON);

        // Background
        g.setColor(Color.WHITE);
        g.fillRect(0, 0, width, height);

        // Border
        g.setColor(new Color(4, 120, 87));
        g.setStroke(new BasicStroke(6));
        g.drawRect(20, 20, width - 40, height - 40);

        // Header Background
        g.setColor(new Color(236, 253, 245));
        g.fillRect(26, 26, width - 52, 110);
        g.setColor(new Color(4, 120, 87));
        g.drawRect(26, 26, width - 52, 110);

        // Header Text
        g.setFont(new Font("Serif", Font.BOLD, 24));
        g.drawString("GLOBAL ORGANIC TEXTILE STANDARD (GOTS)", 200, 70);

        g.setFont(new Font("SansSerif", Font.BOLD, 18));
        g.drawString("ORGANIC FIBER SCOPE CERTIFICATE (GOTS v6.0)", 260, 105);

        // Content
        g.setColor(Color.BLACK);
        g.setFont(new Font("Monospaced", Font.PLAIN, 18));

        String[] lines = new String[]{
                "Scope Certificate No   : GOTS-CU-884210-2026",
                "Licensing Body         : Control Union Certifications B.V.",
                "Licensee / Producer    : Lakshmi Spinners & Textiles Pvt Ltd",
                "Facility Address       : Avinashi Road, Tiruppur, Tamil Nadu 641603",
                "Date of Issue          : 15/01/2026",
                "Valid Up To Date       : 14/01/2027",
                "",
                "-------------------------------------------------------------------------",
                "CERTIFIED ORGANIC PRODUCTS & COMPOSITION",
                "-------------------------------------------------------------------------",
                "Product Category       : 100% Organic Raw Cotton Fiber / Yarn",
                "Organic Content        : 100% Organic Cotton (GOTS Version 6.0)",
                "Standard               : Global Organic Textile Standard (GOTS)",
                "Verification Method    : Transaction Certificate (TC) Verified",
                "",
                "Certification Status   : ACTIVE VALID SCOPE CERTIFICATE"
        };

        int startY = 190;
        for (String line : lines) {
            g.drawString(line, 60, startY);
            startY += 32;
        }

        // Footer Stamp
        g.setColor(new Color(6, 95, 70));
        g.setStroke(new BasicStroke(3));
        g.drawOval(width - 250, height - 220, 180, 180);
        g.setFont(new Font("SansSerif", Font.BOLD, 14));
        g.drawString("GOTS ORGANIC", width - 225, height - 135);
        g.drawString("CERTIFIED ✓", width - 215, height - 110);

        g.dispose();

        try {
            ImageIO.write(image, "png", outputFile);
            System.out.println("✅ Generated 7_GOTS_Organic_Fiber_Certificate.png successfully!");
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
