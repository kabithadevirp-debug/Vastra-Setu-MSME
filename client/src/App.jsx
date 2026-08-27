import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider, useApp } from './context/AppContext';
import { AppLayout } from './components/AppLayout';
import { Toast } from './components/Toast';

import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { OtpVerifyPage } from './pages/OtpVerifyPage';
import { ProfilePage } from './pages/ProfilePage';
import { DashboardPage } from './pages/DashboardPage';
import { BatchesPage } from './pages/BatchesPage';
import { BatchDetailPage } from './pages/BatchDetailPage';
import { CreateBatchPage } from './pages/CreateBatchPage';
import { PublicVerifyPage } from './pages/PublicVerifyPage';
import { ReceiverConfirmationPage } from './pages/ReceiverConfirmationPage';
import { DocumentVaultPage } from './pages/DocumentVaultPage';
import { BankSnapshotPage } from './pages/BankSnapshotPage';
import { GovernmentAuditPage } from './pages/GovernmentAuditPage';
import { DyerPortalPage } from './pages/DyerPortalPage';
import { CetpPortalPage } from './pages/CetpPortalPage';
import { BankPortalPage } from './pages/BankPortalPage';
import { AuditorPortalPage } from './pages/AuditorPortalPage';
import { AdminPortalPage } from './pages/AdminPortalPage';
import { GreenGrowthTwinPage } from './pages/GreenGrowthTwinPage';
import { IdentityUploadPage } from './pages/IdentityUploadPage';
import { DocumentUploadPage } from './pages/DocumentUploadPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { PassportViewPage } from './pages/PassportViewPage';

function AppContent() {
  const { msme, isAuthenticated, loading } = useAuth();
  const { toast } = useApp() || {};
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path, options = {}) => {
    window.history.pushState(options.state || {}, '', path);
    setCurrentPath(path);
    window.scrollTo(0, 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // 1. PUBLIC BUYER QR VERIFICATION (No Auth Required)
  if (currentPath.startsWith('/verify/')) {
    const passportId = currentPath.replace('/verify/', '');
    return <PublicVerifyPage passportId={passportId} navigate={navigate} />;
  }

  // 2. ZERO-LOGIN RECEIVER SHIPMENT CONFIRMATION (No Auth Required)
  if (currentPath.startsWith('/confirm-shipment/') || currentPath.startsWith('/receiver/')) {
    const token = currentPath.replace('/confirm-shipment/', '').replace('/receiver/', '');
    return <ReceiverConfirmationPage token={token} navigate={navigate} />;
  }

  // 3. LANDING PAGE & PUBLIC ENTRY (Always render Landing Page on /)
  if (currentPath === '/' || currentPath === '/landing' || currentPath === '/home') {
    return <LandingPage navigate={navigate} />;
  }

  // 4. AUTH FLOWS (Login, Register, OTP)
  if (currentPath === '/login') {
    return <LoginPage navigate={navigate} />;
  }
  if (currentPath === '/register') {
    return <RegisterPage navigate={navigate} />;
  }
  if (currentPath === '/verify-otp') {
    return <OtpVerifyPage navigate={navigate} />;
  }

  // 5. UNAUTHENTICATED USERS REDIRECT TO LANDING
  if (!isAuthenticated || !msme) {
    return <LandingPage navigate={navigate} />;
  }

  // 4. AUTHENTICATED EXPORTER ROUTE SWITCHER
  const renderCurrentPage = () => {
    // Profile
    if (currentPath === '/profile') {
      return (
        <AppLayout currentPath="/profile" navigate={navigate}>
          <ProfilePage navigate={navigate} />
        </AppLayout>
      );
    }

    // Create Garment Batch
    if (currentPath === '/create-batch') {
      return (
        <AppLayout currentPath="/create-batch" navigate={navigate}>
          <CreateBatchPage navigate={navigate} />
        </AppLayout>
      );
    }

    // Batches List
    if (currentPath === '/batches' || currentPath === '/passports') {
      return (
        <AppLayout currentPath="/batches" navigate={navigate}>
          <BatchesPage navigate={navigate} />
        </AppLayout>
      );
    }

    // Document Vault
    if (currentPath === '/vault' || currentPath === '/documents') {
      return (
        <AppLayout currentPath="/vault" navigate={navigate}>
          <DocumentVaultPage navigate={navigate} />
        </AppLayout>
      );
    }

    // Bank Operational Snapshot
    if (currentPath === '/bank-snapshot' || currentPath === '/bank') {
      return (
        <AppLayout currentPath="/bank-snapshot" navigate={navigate}>
          <BankSnapshotPage navigate={navigate} />
        </AppLayout>
      );
    }

    // Government Compliance Audit View
    if (currentPath === '/govt-audit' || currentPath === '/audit') {
      return (
        <AppLayout currentPath="/govt-audit" navigate={navigate}>
          <GovernmentAuditPage navigate={navigate} />
        </AppLayout>
      );
    }

    // Dyeing Partner Facility Portal
    if (currentPath === '/portal/dyer' || currentPath === '/dyer') {
      return (
        <AppLayout currentPath="/portal/dyer" navigate={navigate}>
          <DyerPortalPage navigate={navigate} />
        </AppLayout>
      );
    }

    // CETP ZLD Plant Operator Portal
    if (currentPath === '/portal/cetp' || currentPath === '/cetp') {
      return (
        <AppLayout currentPath="/portal/cetp" navigate={navigate}>
          <CetpPortalPage navigate={navigate} />
        </AppLayout>
      );
    }

    // Bank / NBFC Financial Portal
    if (currentPath === '/portal/bank') {
      return (
        <AppLayout currentPath="/portal/bank" navigate={navigate}>
          <BankPortalPage navigate={navigate} />
        </AppLayout>
      );
    }

    // Government & Regulatory Auditor Portal
    if (currentPath === '/portal/auditor') {
      return (
        <AppLayout currentPath="/portal/auditor" navigate={navigate}>
          <AuditorPortalPage navigate={navigate} />
        </AppLayout>
      );
    }

    // Platform Admin Portal
    if (currentPath === '/portal/admin' || currentPath === '/admin') {
      return (
        <AppLayout currentPath="/portal/admin" navigate={navigate}>
          <AdminPortalPage navigate={navigate} />
        </AppLayout>
      );
    }

    // Green Growth Twin Intelligence & Simulator
    if (currentPath === '/twin' || currentPath === '/green-twin') {
      return (
        <AppLayout currentPath="/twin" navigate={navigate}>
          <GreenGrowthTwinPage navigate={navigate} />
        </AppLayout>
      );
    }

    // Document Upload Desk
    if (currentPath === '/document-upload' || currentPath === '/upload-doc') {
      return (
        <AppLayout currentPath="/document-upload" navigate={navigate}>
          <DocumentUploadPage navigate={navigate} />
        </AppLayout>
      );
    }

    // Identity Verification Desk
    if (currentPath === '/identity-upload' || currentPath === '/identity') {
      return (
        <AppLayout currentPath="/identity-upload" navigate={navigate}>
          <IdentityUploadPage navigate={navigate} />
        </AppLayout>
      );
    }

    // Sustainability Analytics
    if (currentPath === '/analytics') {
      return (
        <AppLayout currentPath="/analytics" navigate={navigate}>
          <AnalyticsPage navigate={navigate} />
        </AppLayout>
      );
    }

    // Digital Product Passport View
    if (currentPath.startsWith('/passport/') || currentPath.startsWith('/passports/')) {
      const passportId = currentPath.replace('/passport/', '').replace('/passports/', '');
      return (
        <AppLayout currentPath="/passports" navigate={navigate}>
          <PassportViewPage batchId={passportId} navigate={navigate} />
        </AppLayout>
      );
    }

    // Single Batch Command Center
    if (currentPath.startsWith('/batches/')) {
      const batchId = currentPath.replace('/batches/', '');
      return (
        <AppLayout currentPath="/batches" navigate={navigate}>
          <BatchDetailPage batchId={batchId} navigate={navigate} />
        </AppLayout>
      );
    }

    // Exporter Dashboard (Default)
    return (
      <AppLayout currentPath="/dashboard" navigate={navigate}>
        <DashboardPage navigate={navigate} />
      </AppLayout>
    );
  };

  return (
    <>
      {renderCurrentPage()}
      <Toast toast={toast} onClose={() => {}} />
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </AppProvider>
  );
}
