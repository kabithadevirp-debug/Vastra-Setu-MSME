import { pool } from '../config/db.js';

export const authStore = {
  // Account Operations
  findAccountById: async (id) => {
    try {
      const [rows] = await pool.query(`SELECT * FROM msme_accounts WHERE id = ?`, [id]);
      if (rows.length === 0) return null;
      const r = rows[0];
      return {
        id: r.id,
        businessName: r.business_name,
        gstin: r.gstin,
        address: r.address,
        sector: r.sector,
        contactName: r.contact_name,
        contactEmail: r.contact_email,
        contactPhone: r.contact_phone,
        passwordHash: r.password_hash,
        status: r.status,
        udyamNumber: r.udyam_number,
        createdAt: r.created_at,
        updatedAt: r.updated_at,
      };
    } catch (err) {
      console.error('MySQL Error findAccountById:', err);
      return null;
    }
  },

  findAccountByGstin: async (gstin) => {
    try {
      const [rows] = await pool.query(`SELECT * FROM msme_accounts WHERE UPPER(gstin) = UPPER(?)`, [gstin]);
      if (rows.length === 0) return null;
      const r = rows[0];
      return {
        id: r.id,
        businessName: r.business_name,
        gstin: r.gstin,
        address: r.address,
        sector: r.sector,
        contactName: r.contact_name,
        contactEmail: r.contact_email,
        contactPhone: r.contact_phone,
        passwordHash: r.password_hash,
        status: r.status,
        udyamNumber: r.udyam_number,
        createdAt: r.created_at,
        updatedAt: r.updated_at,
      };
    } catch (err) {
      console.error('MySQL Error findAccountByGstin:', err);
      return null;
    }
  },

  findAccountByEmail: async (email) => {
    try {
      const [rows] = await pool.query(`SELECT * FROM msme_accounts WHERE LOWER(contact_email) = LOWER(?)`, [email]);
      if (rows.length === 0) return null;
      const r = rows[0];
      return {
        id: r.id,
        businessName: r.business_name,
        gstin: r.gstin,
        address: r.address,
        sector: r.sector,
        contactName: r.contact_name,
        contactEmail: r.contact_email,
        contactPhone: r.contact_phone,
        passwordHash: r.password_hash,
        status: r.status,
        udyamNumber: r.udyam_number,
        createdAt: r.created_at,
        updatedAt: r.updated_at,
      };
    } catch (err) {
      console.error('MySQL Error findAccountByEmail:', err);
      return null;
    }
  },

  createAccount: async (data) => {
    try {
      const [countRows] = await pool.query(`SELECT COUNT(*) AS total FROM msme_accounts`);
      const nextNum = (countRows[0]?.total || 0) + 1;
      const id = `MSME-TPR-${String(nextNum).padStart(3, '0')}`;
      const now = new Date();

      await pool.query(
        `INSERT INTO msme_accounts 
         (id, business_name, gstin, address, sector, contact_name, contact_email, contact_phone, password_hash, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'PENDING_VERIFICATION')`,
        [
          id,
          data.businessName.trim(),
          data.gstin.toUpperCase().trim(),
          data.address.trim(),
          data.sector || 'Textiles & Apparel',
          data.contactName.trim(),
          data.contactEmail.toLowerCase().trim(),
          data.contactPhone.trim(),
          data.passwordHash,
        ]
      );

      return await authStore.findAccountById(id);
    } catch (err) {
      console.error('MySQL Error createAccount:', err);
      throw err;
    }
  },

  updateAccountStatus: async (id, status, udyamNumber = null) => {
    try {
      if (udyamNumber) {
        await pool.query(`UPDATE msme_accounts SET status = ?, udyam_number = ? WHERE id = ?`, [status, udyamNumber, id]);
      } else {
        await pool.query(`UPDATE msme_accounts SET status = ? WHERE id = ?`, [status, id]);
      }
      return await authStore.findAccountById(id);
    } catch (err) {
      console.error('MySQL Error updateAccountStatus:', err);
      return null;
    }
  },

  updateAccountProfile: async (id, data) => {
    try {
      await pool.query(
        `UPDATE msme_accounts 
         SET business_name = COALESCE(?, business_name),
             address = COALESCE(?, address),
             contact_name = COALESCE(?, contact_name),
             contact_phone = COALESCE(?, contact_phone)
         WHERE id = ?`,
        [data.businessName, data.address, data.contactName, data.contactPhone, id]
      );
      return await authStore.findAccountById(id);
    } catch (err) {
      console.error('MySQL Error updateAccountProfile:', err);
      return null;
    }
  },

  // Identity Proof Operations
  getIdentityProofsByMsmeId: async (msmeId) => {
    try {
      const [rows] = await pool.query(`SELECT * FROM identity_proofs WHERE msme_id = ? ORDER BY submitted_at DESC`, [msmeId]);
      return rows.map(r => ({
        id: r.id,
        msmeId: r.msme_id,
        docType: r.doc_type,
        filePath: r.file_path,
        extractedFields: typeof r.extracted_fields === 'string' ? JSON.parse(r.extracted_fields) : (r.extracted_fields || {}),
        verificationStatus: r.verification_status,
        rejectionReason: r.rejection_reason,
        dpiRefId: r.dpi_ref_id,
        submittedAt: r.submitted_at,
        verifiedAt: r.verified_at,
      }));
    } catch (err) {
      console.error('MySQL Error getIdentityProofsByMsmeId:', err);
      return [];
    }
  },

  saveIdentityProof: async (proofData) => {
    try {
      const proofId = proofData.id || `PROOF-${Date.now().toString().slice(-6)}`;
      const fieldsJson = JSON.stringify(proofData.extractedFields || {});
      const submittedAt = proofData.submittedAt ? new Date(proofData.submittedAt) : new Date();
      const verifiedAt = proofData.verifiedAt ? new Date(proofData.verifiedAt) : (proofData.verificationStatus === 'verified' ? new Date() : null);

      await pool.query(
        `INSERT INTO identity_proofs 
         (id, msme_id, doc_type, file_path, extracted_fields, verification_status, rejection_reason, dpi_ref_id, submitted_at, verified_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE 
         file_path = VALUES(file_path),
         extracted_fields = VALUES(extracted_fields),
         verification_status = VALUES(verification_status),
         rejection_reason = VALUES(rejection_reason),
         dpi_ref_id = VALUES(dpi_ref_id),
         verified_at = VALUES(verified_at)`,
        [
          proofId,
          proofData.msmeId,
          proofData.docType,
          proofData.filePath,
          fieldsJson,
          proofData.verificationStatus || 'pending',
          proofData.rejectionReason || null,
          proofData.dpiRefId || null,
          submittedAt,
          verifiedAt,
        ]
      );

      return {
        id: proofId,
        msmeId: proofData.msmeId,
        docType: proofData.docType,
        filePath: proofData.filePath,
        extractedFields: proofData.extractedFields || {},
        verificationStatus: proofData.verificationStatus || 'pending',
        rejectionReason: proofData.rejectionReason || null,
        dpiRefId: proofData.dpiRefId || null,
        submittedAt,
        verifiedAt,
      };
    } catch (err) {
      console.error('MySQL Error saveIdentityProof:', err);
      throw err;
    }
  },

  // Auth Sessions
  saveSession: async (msmeId, refreshTokenHash, expiresAt) => {
    try {
      const id = `SESS-${Date.now()}-${Math.floor(Math.random()*1000)}`;
      await pool.query(
        `INSERT INTO auth_sessions (id, msme_id, refresh_token_hash, expires_at) VALUES (?, ?, ?, ?)`,
        [id, msmeId, refreshTokenHash, new Date(expiresAt)]
      );
      return { id, msmeId, refreshTokenHash, expiresAt };
    } catch (err) {
      console.error('MySQL Error saveSession:', err);
      return null;
    }
  },

  findSession: async (refreshTokenHash) => {
    try {
      const [rows] = await pool.query(
        `SELECT * FROM auth_sessions WHERE refresh_token_hash = ? AND revoked = FALSE AND expires_at > NOW()`,
        [refreshTokenHash]
      );
      if (rows.length === 0) return null;
      return rows[0];
    } catch (err) {
      console.error('MySQL Error findSession:', err);
      return null;
    }
  },

  revokeSession: async (refreshTokenHash) => {
    try {
      await pool.query(`UPDATE auth_sessions SET revoked = TRUE WHERE refresh_token_hash = ?`, [refreshTokenHash]);
      return true;
    } catch (err) {
      console.error('MySQL Error revokeSession:', err);
      return false;
    }
  },

  // OTP Operations
  saveOtp: async (msmeId, otpHash, purpose, expiresAtMs = 300000) => {
    try {
      await pool.query(
        `UPDATE otp_requests SET used = TRUE WHERE msme_id = ? AND purpose = ?`,
        [msmeId, purpose]
      );

      const id = `OTP-${Date.now()}`;
      const expiresAt = new Date(Date.now() + expiresAtMs);

      await pool.query(
        `INSERT INTO otp_requests (id, msme_id, otp_hash, purpose, expires_at) VALUES (?, ?, ?, ?, ?)`,
        [id, msmeId, otpHash, purpose, expiresAt]
      );

      return { id, msmeId, otpHash, purpose, expiresAt: expiresAt.toISOString() };
    } catch (err) {
      console.error('MySQL Error saveOtp:', err);
      throw err;
    }
  },

  getLatestOtp: async (msmeId, purpose) => {
    try {
      const [rows] = await pool.query(
        `SELECT * FROM otp_requests 
         WHERE msme_id = ? AND purpose = ? AND used = FALSE 
         ORDER BY created_at DESC LIMIT 1`,
        [msmeId, purpose]
      );
      if (rows.length === 0) return null;
      const r = rows[0];
      return {
        id: r.id,
        msmeId: r.msme_id,
        otpHash: r.otp_hash,
        purpose: r.purpose,
        attempts: r.attempts,
        expiresAt: r.expires_at,
        used: r.used,
      };
    } catch (err) {
      console.error('MySQL Error getLatestOtp:', err);
      return null;
    }
  },

  incrementOtpAttempts: async (otpId) => {
    try {
      await pool.query(`UPDATE otp_requests SET attempts = attempts + 1 WHERE id = ?`, [otpId]);
      const [rows] = await pool.query(`SELECT attempts FROM otp_requests WHERE id = ?`, [otpId]);
      return rows[0]?.attempts || 0;
    } catch (err) {
      console.error('MySQL Error incrementOtpAttempts:', err);
      return 0;
    }
  },

  markOtpUsed: async (otpId) => {
    try {
      await pool.query(`UPDATE otp_requests SET used = TRUE WHERE id = ?`, [otpId]);
    } catch (err) {
      console.error('MySQL Error markOtpUsed:', err);
    }
  },

  // Audit Logs
  addAuditLog: async (msmeId, action, ipAddress, details = '') => {
    try {
      const id = `LOG-${Date.now()}-${Math.floor(Math.random()*1000)}`;
      await pool.query(
        `INSERT INTO audit_log (id, msme_id, action, ip_address, details) VALUES (?, ?, ?, ?, ?)`,
        [id, msmeId || null, action, ipAddress || '127.0.0.1', details]
      );
      return { id, msmeId, action, ipAddress, details };
    } catch (err) {
      console.error('MySQL Error addAuditLog:', err);
      return null;
    }
  },

  getAuditLogs: async (msmeId = null) => {
    try {
      let query = `SELECT * FROM audit_log ORDER BY timestamp DESC LIMIT 50`;
      let params = [];
      if (msmeId) {
        query = `SELECT * FROM audit_log WHERE msme_id = ? ORDER BY timestamp DESC LIMIT 50`;
        params = [msmeId];
      }
      const [rows] = await pool.query(query, params);
      return rows;
    } catch (err) {
      console.error('MySQL Error getAuditLogs:', err);
      return [];
    }
  }
};
