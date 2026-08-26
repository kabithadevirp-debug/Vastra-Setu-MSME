import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { authStore } from '../data/authStore.js';
import { 
  isValidGstin, 
  validatePasswordStrength, 
  hashPassword, 
  comparePassword, 
  generateTokens, 
  verifyAccessToken, 
  generateOtp, 
  verifyOtpCode, 
  sanitizeAccount 
} from '../utils/security.js';
import { processDpiVerification } from '../utils/mockDpiVerifier.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Ensure upload directory exists for identity proofs
const uploadDir = path.resolve(__dirname, '../uploads/proofs');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer Storage configuration with sanitized randomized filenames
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const randomName = `proof_${Date.now()}_${Math.floor(100000 + Math.random() * 900000)}${ext}`;
    cb(null, randomName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB Limit
  fileFilter: (req, file, cb) => {
    const allowedExts = ['.pdf', '.jpg', '.jpeg', '.png'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (!allowedExts.includes(ext)) {
      return cb(new Error('Invalid file type. Only PDF, JPG, JPEG, and PNG files are allowed.'));
    }
    cb(null, true);
  }
});

// 1. REGISTER MSME ACCOUNT
router.post('/register', async (req, res) => {
  try {
    const { businessName, gstin, address, sector, contactName, contactEmail, contactPhone, password } = req.body;

    if (!businessName || !gstin || !address || !contactName || !contactEmail || !contactPhone || !password) {
      return res.status(400).json({ success: false, message: 'All required fields must be provided.' });
    }

    // GSTIN format check
    const formattedGstin = gstin.trim().toUpperCase();
    if (!isValidGstin(formattedGstin)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid GSTIN format. Please provide a valid 15-character GSTIN (e.g., 33AAACJ1928A1Z5).'
      });
    }

    // Password strength check
    const pwCheck = validatePasswordStrength(password);
    if (!pwCheck.valid) {
      return res.status(400).json({ success: false, message: pwCheck.message });
    }

    // Duplicate check in MySQL
    const existingGstin = await authStore.findAccountByGstin(formattedGstin);
    const existingEmail = await authStore.findAccountByEmail(contactEmail);
    if (existingGstin || existingEmail) {
      await authStore.addAuditLog(null, 'REGISTER_FAILED', req.ip, `Duplicate registration attempt for GSTIN ${formattedGstin} / ${contactEmail}`);
      return res.status(400).json({
        success: false,
        message: 'An account with this GSTIN or email address already exists. Please login.'
      });
    }

    // Hash password & save account in MySQL
    const passwordHash = await hashPassword(password);
    const account = await authStore.createAccount({
      businessName,
      gstin: formattedGstin,
      address,
      sector: sector || 'Textiles & Apparel',
      contactName,
      contactEmail,
      contactPhone,
      passwordHash,
    });

    // Generate single-use OTP
    const { rawOtp, otpId, expiresAt } = await generateOtp(account.id, 'contact_verification');

    await authStore.addAuditLog(account.id, 'REGISTER_SUCCESS', req.ip, `Account registered in MySQL with status PENDING_VERIFICATION. OTP issued.`);

    res.status(201).json({
      success: true,
      message: 'Account registered successfully in MySQL database. Please verify your contact with the OTP.',
      data: {
        account: sanitizeAccount(account),
        otpId,
        expiresAt,
        demoOtp: rawOtp,
      }
    });

  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ success: false, message: 'Server error during registration.' });
  }
});

// 2. VERIFY CONTACT OTP
router.post('/verify-otp', async (req, res) => {
  try {
    const { msmeId, otp } = req.body;

    if (!msmeId || !otp) {
      return res.status(400).json({ success: false, message: 'MSME ID and OTP are required.' });
    }

    const verification = await verifyOtpCode(msmeId, otp, 'contact_verification');
    if (!verification.valid) {
      await authStore.addAuditLog(msmeId, 'OTP_FAILED', req.ip, verification.message);
      return res.status(400).json({ success: false, message: verification.message });
    }

    await authStore.addAuditLog(msmeId, 'OTP_VERIFIED', req.ip, 'Contact email/phone verified successfully.');
    const account = await authStore.findAccountById(msmeId);

    res.json({
      success: true,
      message: 'Contact verified successfully. Please proceed to upload your Identity & Trust Proof documents.',
      data: {
        account: sanitizeAccount(account),
      }
    });

  } catch (err) {
    console.error('OTP verification error:', err);
    res.status(500).json({ success: false, message: 'Server error during OTP verification.' });
  }
});

// 3. RESEND OTP
router.post('/resend-otp', async (req, res) => {
  try {
    const { msmeId } = req.body;
    const account = await authStore.findAccountById(msmeId);
    if (!account) {
      return res.status(404).json({ success: false, message: 'Account not found.' });
    }

    const { rawOtp, otpId, expiresAt } = await generateOtp(msmeId, 'contact_verification');
    await authStore.addAuditLog(msmeId, 'OTP_RESENT', req.ip, 'New contact verification OTP issued.');

    res.json({
      success: true,
      message: 'A new single-use OTP has been sent to your registered contact.',
      data: {
        otpId,
        expiresAt,
        demoOtp: rawOtp,
      }
    });

  } catch (err) {
    console.error('Resend OTP error:', err);
    res.status(500).json({ success: false, message: 'Server error during OTP resend.' });
  }
});

// 4. LOGIN
router.post('/login', async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({ success: false, message: 'Please provide valid credentials.' });
    }

    const cleanId = identifier.trim();
    let account = await authStore.findAccountByGstin(cleanId);
    if (!account) {
      account = await authStore.findAccountByEmail(cleanId);
    }

    if (!account) {
      await authStore.addAuditLog(null, 'LOGIN_FAILED', req.ip, `Failed login attempt for identifier: ${cleanId}`);
      return res.status(401).json({ success: false, message: 'Invalid GSTIN/Email or password.' });
    }

    const isMatch = await comparePassword(password, account.passwordHash);
    if (!isMatch) {
      await authStore.addAuditLog(account.id, 'LOGIN_FAILED', req.ip, 'Invalid password attempt.');
      return res.status(401).json({ success: false, message: 'Invalid GSTIN/Email or password.' });
    }

    const tokens = generateTokens(account);
    await authStore.addAuditLog(account.id, 'LOGIN_SUCCESS', req.ip, `MSME logged in successfully from MySQL. Status: ${account.status}`);

    res.json({
      success: true,
      message: 'Login successful.',
      data: {
        account: sanitizeAccount(account),
        ...tokens,
      }
    });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, message: 'Server error during login.' });
  }
});

// 5. UPLOAD IDENTITY PROOF (UDYAM & GST CERTIFICATES)
router.post('/identity-proof', upload.single('document'), async (req, res) => {
  try {
    const { msmeId, docType, gstin, udyamNumber, businessName } = req.body;

    if (!msmeId || !docType) {
      return res.status(400).json({ success: false, message: 'MSME ID and Document Type (udyam_certificate or gst_certificate) are required.' });
    }

    const account = await authStore.findAccountById(msmeId);
    if (!account) {
      return res.status(404).json({ success: false, message: 'Account not found.' });
    }

    const filePath = req.file ? `/uploads/proofs/${req.file.filename}` : `/uploads/proofs/sample_${docType}.pdf`;

    const extractedFields = {
      gstin: gstin ? gstin.trim().toUpperCase() : account.gstin,
      udyamNumber: udyamNumber ? udyamNumber.trim().toUpperCase() : account.udyamNumber,
      businessName: businessName ? businessName.trim() : account.businessName,
    };

    const result = await processDpiVerification(msmeId, docType, extractedFields, filePath);

    res.json({
      success: true,
      message: result.reason || 'Document submitted and verified via Government DPI API service.',
      data: {
        proof: result.proof,
        accountStatus: result.accountStatus,
        reason: result.reason,
      }
    });

  } catch (err) {
    console.error('Identity proof upload error:', err);
    res.status(500).json({ success: false, message: err.message || 'Server error during identity document processing.' });
  }
});

// 6. GET IDENTITY PROOF STATUS
router.get('/identity-proof/status', verifyAccessToken, async (req, res) => {
  try {
    const msmeId = req.user.id;
    const account = await authStore.findAccountById(msmeId);
    if (!account) {
      return res.status(404).json({ success: false, message: 'Account not found.' });
    }

    const proofs = await authStore.getIdentityProofsByMsmeId(msmeId);
    const audit = await authStore.getAuditLogs(msmeId);

    res.json({
      success: true,
      data: {
        accountStatus: account.status,
        proofs,
        auditLogs: audit.slice(0, 10),
      }
    });

  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error retrieving verification status.' });
  }
});

// 7. GET PROFILE
router.get('/profile', verifyAccessToken, async (req, res) => {
  try {
    const account = await authStore.findAccountById(req.user.id);
    if (!account) {
      return res.status(404).json({ success: false, message: 'Account not found.' });
    }

    const proofs = await authStore.getIdentityProofsByMsmeId(req.user.id);

    res.json({
      success: true,
      data: {
        account: sanitizeAccount(account),
        identityProofs: proofs,
      }
    });

  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error fetching profile.' });
  }
});

// 8. UPDATE PROFILE (Non-Identity Fields Only)
router.put('/profile', verifyAccessToken, async (req, res) => {
  try {
    const { businessName, address, contactName, contactPhone } = req.body;
    const updated = await authStore.updateAccountProfile(req.user.id, {
      businessName,
      address,
      contactName,
      contactPhone,
    });

    await authStore.addAuditLog(req.user.id, 'PROFILE_UPDATED', req.ip, 'Updated non-identity profile details.');

    res.json({
      success: true,
      message: 'Profile updated successfully.',
      data: {
        account: sanitizeAccount(updated),
      }
    });

  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error updating profile.' });
  }
});

export default router;
