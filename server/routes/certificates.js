import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { extractTextFromFile } from '../utils/ocrService.js';
import { verifyCertificate } from '../utils/certificateVerifier.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Ensure uploads directory exists
const uploadsDir = path.resolve(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9-_]/g, '_');
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E6);
    cb(null, `${baseName}-${uniqueSuffix}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB limit
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      'application/pdf',
      'image/png',
      'image/jpeg',
      'image/jpg',
      'image/webp',
      'image/tiff',
    ];
    if (allowedMimes.includes(file.mimetype) || file.originalname.match(/\.(pdf|png|jpe?g|webp|tiff)$/i)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and image files (PNG, JPG, WEBP, TIFF) are supported.'));
    }
  }
});

/**
 * POST /api/certificates/verify-ocr
 * Uploads a certificate and performs OCR & rule-based verification
 */
router.post('/verify-ocr', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No certificate file was uploaded.',
      });
    }

    const { certificateType = 'gots', expectedEntity = '', batchId = '' } = req.body;
    const filePath = req.file.path;
    const mimeType = req.file.mimetype;

    // Run OCR / PDF text extraction
    const ocrResult = await extractTextFromFile(filePath, mimeType);

    // Run verification heuristic
    const verification = verifyCertificate(certificateType, ocrResult.text, {
      expectedEntity,
      batchId,
      originalFilename: req.file.originalname,
    });

    const fileUrl = `/uploads/${path.basename(filePath)}`;

    res.json({
      success: true,
      data: {
        fileUrl,
        fileName: req.file.originalname,
        fileSizeBytes: req.file.size,
        mimeType: req.file.mimetype,
        uploadedAt: new Date().toISOString(),
        ocr: {
          engine: ocrResult.engine,
          durationMs: ocrResult.durationMs,
          extractedText: ocrResult.text,
          characterCount: ocrResult.text.length,
          pageCount: ocrResult.pageCount || 1,
        },
        verification,
      }
    });
  } catch (err) {
    console.error('Certificate verification error:', err);
    res.status(500).json({
      success: false,
      message: err.message || 'Failed to process and verify certificate with OCR.',
    });
  }
});

/**
 * GET /api/certificates/samples
 * Returns pre-built sample certificates for instant demo testing
 */
router.get('/samples', (req, res) => {
  const samples = [
    {
      id: 'sample-gots',
      type: 'gots',
      title: 'GOTS v7.0 Scope Certificate',
      issuer: 'Control Union Certifications B.V.',
      licenseNo: 'CU-841920',
      description: 'Scope Certificate for GOTS 7.0 Organic Combed Cotton Yarn from Coimbatore Heritage Cotton Mills.',
      rawText: `SCOPE CERTIFICATE
Certificate No: CU-841920-GOTS-2026-01
Control Union Certifications B.V. declares that
COIMBATORE HERITAGE COTTON MILLS PVT LTD
Avinashi Road, Coimbatore, Tamil Nadu, India
has been inspected and assessed according to the
GLOBAL ORGANIC TEXTILE STANDARD (GOTS) Version 7.0
Product categories: Combed Yarns (95% Organic Raw Cotton / 5% Elastane)
Processing steps / activities carried out: Spinning, Combing, Bio-polishing
This certificate is valid until: 2026-12-31
Standard: GOTS Version 7.0 (Certified by Control Union)`,
    },
    {
      id: 'sample-oeko-tex',
      type: 'oeko_tex',
      title: 'OEKO-TEX® Standard 100 Certificate',
      issuer: 'Hohenstein Textile Testing Institute',
      licenseNo: 'OEKO-2026-TX-98442',
      description: 'Standard 100 Class I & ZDHC MRSL Level 3 test report for Rainbow Eco-Dyers CPB reactive dyes.',
      rawText: `OEKO-TEX® CONFIDENCE IN TEXTILES
STANDARD 100
Certificate No: OEKO-2026-TX-98442
The company:
RAINBOW ECO-DYERS TIRUPPUR
Veerapandi Industrial Estate, Tiruppur, India
is granted authorisation according to STANDARD 100 by OEKO-TEX®
Product Class: Class I (Baby articles & direct skin contact)
Testing for harmful substances according to STANDARD 100 Annex 4 & Annex 6
ZDHC MRSL Level 3 Conformance: VERIFIED AZO-FREE
Valid until: 2026-12-31
Hohenstein Textile Testing Institute GmbH & Co. KG`,
    },
    {
      id: 'sample-tnpcb-zld',
      type: 'tnpcb_zld',
      title: 'TNPCB Zero Liquid Discharge (ZLD) Consent Order',
      issuer: 'Tamil Nadu Pollution Control Board',
      licenseNo: 'TNPCB-CETP-ZLD-2024-88',
      description: 'Official TNPCB environmental consent order verifying 94% water recovery and 100% ZLD.',
      rawText: `TAMIL NADU POLLUTION CONTROL BOARD (TNPCB)
CONSENT ORDER NO: TNPCB-CETP-ZLD-2024-88
Consent to Operate under Section 25 of Water (Prevention and Control of Pollution) Act
Issued to: ARULPURAM COMMON EFFLUENT TREATMENT PLANT (UNIT 3)
Arulpuram Industrial Area, Tiruppur, Tamil Nadu
STATUS: 100% ZERO LIQUID DISCHARGE (ZLD) OPERATIONAL
Process: MBR + Reverse Osmosis (RO 3-stage) + Multi-Effect Evaporator (MEE) + Centrifuge
Average Water Recovery: 94.0% Recycled Process Water recirculated to dye houses
BOD/COD Reduction: 98.5%
Brine Salt Recovery: 96.0% industrial grade sodium sulfate
Zero Effluent Discharge into Noyyal River Basin confirmed.`,
    }
  ];

  res.json({
    success: true,
    data: samples,
  });
});

export default router;
