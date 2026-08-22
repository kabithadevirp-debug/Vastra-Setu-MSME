import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { authStore } from '../data/authStore.js';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'vastrasetu_jwt_secret_key_production_2026_super_secure';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'vastrasetu_refresh_token_secret_key_2026_super_secure';

// Standard 15-character GSTIN Regex: 2 digit state code + 10 char PAN + 1 entity char + 'Z' + 1 checksum digit
const GSTIN_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

export function isValidGstin(gstin) {
  if (!gstin || typeof gstin !== 'string') return false;
  const formatted = gstin.trim().toUpperCase();
  return GSTIN_REGEX.test(formatted);
}

// Password strength validation: min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
export function validatePasswordStrength(password) {
  if (!password || typeof password !== 'string' || password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters long.' };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one uppercase letter.' };
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one lowercase letter.' };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one number.' };
  }
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one special character (!@#$%^&*).' };
  }
  return { valid: true };
}

// Hash password
export async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}

// Compare password
export async function comparePassword(password, hash) {
  return await bcrypt.compare(password, hash);
}

// Generate JWT Tokens
export function generateTokens(msmeAccount) {
  const payload = {
    id: msmeAccount.id,
    businessName: msmeAccount.businessName,
    gstin: msmeAccount.gstin,
    status: msmeAccount.status,
  };

  const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '30m' });
  const refreshToken = jwt.sign({ id: msmeAccount.id }, REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
  const refreshTokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');

  // Save session
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  authStore.saveSession(msmeAccount.id, refreshTokenHash, expiresAt);

  return { accessToken, refreshToken, expiresIn: 1800 };
}

// Verify Access Token middleware helper
export function verifyAccessToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Access token required.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid or expired access token.' });
  }
}

// Generate secure 6-digit OTP and store its hash in MySQL
export async function generateOtp(msmeId, purpose = 'contact_verification') {
  const rawOtp = String(Math.floor(100000 + Math.random() * 900000));
  const otpHash = crypto.createHash('sha256').update(rawOtp).digest('hex');
  
  const otpRecord = await authStore.saveOtp(msmeId, otpHash, purpose, 300000);
  
  return { rawOtp, otpId: otpRecord.id, expiresAt: otpRecord.expiresAt };
}

// Verify OTP against MySQL
export async function verifyOtpCode(msmeId, rawOtp, purpose = 'contact_verification') {
  const otpRecord = await authStore.getLatestOtp(msmeId, purpose);
  if (!otpRecord) {
    return { valid: false, message: 'No pending OTP request found. Please request a new OTP.' };
  }

  if (new Date(otpRecord.expiresAt) < new Date()) {
    return { valid: false, message: 'OTP has expired. Please request a new OTP.' };
  }

  if (otpRecord.attempts >= 3) {
    await authStore.markOtpUsed(otpRecord.id);
    return { valid: false, message: 'Maximum OTP attempts exceeded. Please request a new OTP.' };
  }

  const incomingHash = crypto.createHash('sha256').update(String(rawOtp).trim()).digest('hex');
  if (incomingHash !== otpRecord.otpHash) {
    const attempts = await authStore.incrementOtpAttempts(otpRecord.id);
    return { valid: false, message: `Invalid OTP. ${3 - attempts} attempt(s) remaining.` };
  }

  await authStore.markOtpUsed(otpRecord.id);
  return { valid: true };
}

// Sanitize user output
export function sanitizeAccount(account) {
  if (!account) return null;
  const { passwordHash, ...sanitized } = account;
  return sanitized;
}
