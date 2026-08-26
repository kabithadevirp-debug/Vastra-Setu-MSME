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

  // 3. UNAUTHENTICATED USERS (Auth Flows)
  if (!isAuthenticated || !msme) {
    if (currentPath === '/login') {
      return <LoginPage navigate={navigate} />;
    }
    if (currentPath === '/register') {
      return <RegisterPage navigate={navigate} />;
    }
    if (currentPath === '/verify-otp') {
      return <OtpVerifyPage navigate={navigate} />;
    }
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
