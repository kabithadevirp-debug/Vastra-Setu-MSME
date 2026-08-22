import { authStore } from '../data/authStore.js';

/**
 * Mock Government DPI Verification Service using MySQL Storage
 */
export async function processDpiVerification(msmeId, docType, extractedFields, filePath) {
  const account = await authStore.findAccountById(msmeId);
  if (!account) {
    throw new Error('MSME Account not found.');
  }

  const timestamp = new Date().toISOString();
  let verificationStatus = 'pending';
  let rejectionReason = null;
  let dpiRefId = null;
  let updatedFields = { ...extractedFields };

  if (docType === 'udyam_certificate') {
    const udyamNo = extractedFields.udyamNumber || `UDYAM-TN-${Math.floor(10 + Math.random()*89)}-${Math.floor(1000000 + Math.random()*9000000)}`;
    updatedFields.udyamNumber = udyamNo;
    updatedFields.businessName = extractedFields.businessName || account.businessName;
    updatedFields.enterpriseType = extractedFields.enterpriseType || 'Micro Enterprise';
    updatedFields.majorActivity = 'Manufacturing - Textile Apparel';
    updatedFields.nicCode = '13911 - Manufacture of knitted and crocheted fabrics';

    verificationStatus = 'verified';
    dpiRefId = `DPI-UDYAM-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    await authStore.addAuditLog(
      msmeId,
      'UDYAM_DOC_VERIFIED',
      '127.0.0.1',
      `Udyam Registration Certificate verified via DPI. Ref: ${dpiRefId}`
    );
  } else if (docType === 'gst_certificate') {
    const certificateGstin = (extractedFields.gstin || account.gstin).toUpperCase().trim();
    const registrationGstin = account.gstin.toUpperCase().trim();

    updatedFields.gstin = certificateGstin;
    updatedFields.legalName = extractedFields.legalName || account.businessName;
    updatedFields.tradeName = extractedFields.tradeName || account.businessName;
    updatedFields.constitution = extractedFields.constitution || 'Private Limited Company';

    // Cross-check: Certificate GSTIN must match Registration GSTIN
    if (certificateGstin !== registrationGstin) {
      verificationStatus = 'rejected';
      rejectionReason = `GSTIN Mismatch: The GSTIN on the uploaded certificate (${certificateGstin}) does not match the GSTIN entered during registration (${registrationGstin}).`;
      
      await authStore.addAuditLog(
        msmeId,
        'VERIFICATION_FAILED',
        '127.0.0.1',
        `GST Certificate cross-check failed: GSTIN mismatch (${certificateGstin} vs ${registrationGstin}).`
      );
    } else {
      verificationStatus = 'verified';
      dpiRefId = `DPI-GSTN-2026-${Math.floor(1000 + Math.random() * 9000)}`;

      await authStore.addAuditLog(
        msmeId,
        'GST_DOC_VERIFIED',
        '127.0.0.1',
        `GST Certificate verified via GSTN DPI Service. Ref: ${dpiRefId}`
      );
    }
  }

  // Save Identity Proof record in MySQL
  const savedProof = await authStore.saveIdentityProof({
    msmeId,
    docType,
    filePath,
    extractedFields: updatedFields,
    verificationStatus,
    rejectionReason,
    dpiRefId,
    submittedAt: timestamp,
    verifiedAt: verificationStatus === 'verified' ? timestamp : null,
  });

  // Evaluate overall MSME Account status from MySQL
  const msmeProofs = await authStore.getIdentityProofsByMsmeId(msmeId);
  const udyamProof = msmeProofs.find(p => p.docType === 'udyam_certificate');
  const gstProof = msmeProofs.find(p => p.docType === 'gst_certificate');

  if (udyamProof?.verificationStatus === 'rejected' || gstProof?.verificationStatus === 'rejected') {
    await authStore.updateAccountStatus(msmeId, 'VERIFICATION_FAILED');
  } else if (udyamProof?.verificationStatus === 'verified' && gstProof?.verificationStatus === 'verified') {
    const finalUdyamNo = udyamProof.extractedFields?.udyamNumber || 'UDYAM-TN-28-0019284';
    await authStore.updateAccountStatus(msmeId, 'ACTIVE', finalUdyamNo);
    
    await authStore.addAuditLog(
      msmeId,
      'VERIFICATION_PASSED',
      '127.0.0.1',
      `All identity & trust proofs verified in MySQL. Account status updated to ACTIVE.`
    );
  } else {
    await authStore.updateAccountStatus(msmeId, 'VERIFICATION_IN_PROGRESS');
  }

  const updatedAcc = await authStore.findAccountById(msmeId);
  return {
    proof: savedProof,
    accountStatus: updatedAcc ? updatedAcc.status : 'PENDING_VERIFICATION',
    reason: rejectionReason,
  };
}
