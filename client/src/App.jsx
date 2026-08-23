import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { AppLayout } from './components/AppLayout';
import { Toast } from './components/Toast';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { BatchesPage } from './pages/BatchesPage';
import { BatchDetailPage } from './pages/BatchDetailPage';
import { CreateBatchPage } from './pages/CreateBatchPage';
import { DyerPortalPage } from './pages/DyerPortalPage';
import { CetpPortalPage } from './pages/CetpPortalPage';
import { PassportViewPage } from './pages/PassportViewPage';
import { PublicVerifyPage } from './pages/PublicVerifyPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { RegisterPage } from './pages/RegisterPage';
import { OtpVerifyPage } from './pages/OtpVerifyPage';
import { IdentityUploadPage } from './pages/IdentityUploadPage';
import { DocumentUploadPage } from './pages/DocumentUploadPage';
import { VerificationStatusPage } from './pages/VerificationStatusPage';
import { ProfilePage } from './pages/ProfilePage';
import { LoginPage } from './pages/LoginPage';
import { BankPortalPage } from './pages/BankPortalPage';
import { AuditorPortalPage } from './pages/AuditorPortalPage';
import { AdminPortalPage } from './pages/AdminPortalPage';

function AppContent() {
  const { toast } = useApp();
  const { msme } = useAuth();
  const [currentPath, setCurrentPath] = useState(window.location.pathname || '/');

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path, state) => {
    window.history.pushState(state || {}, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderCurrentPage = () => {
    // 1. PUBLIC UNAUTHENTICATED ROUTES
    if (currentPath === '/login') {
      return (
        <div className="min-h-screen flex flex-col bg-[#FAFAFC]">
          <Navbar currentPath={currentPath} navigate={navigate} />
          <LoginPage navigate={navigate} />
        </div>
      );
    }
    if (currentPath === '/register') {
      return (
        <div className="min-h-screen flex flex-col bg-[#FAFAFC]">
          <Navbar currentPath={currentPath} navigate={navigate} />
          <RegisterPage navigate={navigate} />
        </div>
      );
    }
    if (currentPath === '/' || currentPath === '/landing') {
      return (
        <div className="min-h-screen flex flex-col bg-[#FAFAFC]">
          <Navbar currentPath={currentPath} navigate={navigate} />
          <LandingPage navigate={navigate} />
        </div>
      );
    }
    // ROLE 2: BUYER PUBLIC VERIFY ROUTE (No login required)
    if (currentPath.startsWith('/verify/') || currentPath === '/verify') {
      const passportId = currentPath.startsWith('/verify/') ? currentPath.replace('/verify/', '') : 'BATCH-9942-01';
      return (
        <div className="min-h-screen flex flex-col bg-[#FAFAFC]">
          <Navbar currentPath={currentPath} navigate={navigate} />
          <PublicVerifyPage passportId={passportId} navigate={navigate} />
        </div>
      );
    }

    // 2. ROUTE PROTECTION: Require Authentication
    if (!msme) {
      return (
        <div className="min-h-screen flex flex-col bg-[#FAFAFC]">
          <Navbar currentPath={currentPath} navigate={navigate} />
          <LoginPage navigate={navigate} />
        </div>
      );
    }

    // 3. AUTHENTICATED ONBOARDING & SPECIAL FLOWS
    if (currentPath === '/verify-otp') {
      return (
        <div className="min-h-screen flex flex-col bg-[#FAFAFC]">
          <Navbar currentPath={currentPath} navigate={navigate} />
          <OtpVerifyPage navigate={navigate} />
        </div>
      );
    }

    // 4. ROLE 1: MSME / PRODUCER DASHBOARD SHELL ROUTES (<AppLayout>)
    if (currentPath === '/documents' || currentPath === '/op-docs' || currentPath === '/upload-documents') {
      return (
        <AppLayout currentPath="/documents" navigate={navigate}>
          <DocumentUploadPage navigate={navigate} />
        </AppLayout>
      );
    }
    if (currentPath === '/identity-proof' || currentPath === '/upload-proofs') {
      return (
        <AppLayout currentPath="/documents" navigate={navigate}>
          <IdentityUploadPage navigate={navigate} />
        </AppLayout>
      );
    }
    if (currentPath === '/passports' || currentPath === '/batches') {
      return (
        <AppLayout currentPath="/passports" navigate={navigate}>
          <BatchesPage navigate={navigate} />
        </AppLayout>
      );
    }
    if (currentPath.startsWith('/batches/')) {
      const batchId = currentPath.replace('/batches/', '');
      return (
        <AppLayout currentPath="/passports" navigate={navigate}>
          <BatchDetailPage batchId={batchId} navigate={navigate} />
        </AppLayout>
      );
    }
    if (currentPath.startsWith('/passport/')) {
      const batchId = currentPath.replace('/passport/', '');
      return (
        <AppLayout currentPath="/passports" navigate={navigate}>
          <PassportViewPage batchId={batchId} navigate={navigate} />
        </AppLayout>
      );
    }
    if (currentPath === '/compliance' || currentPath === '/verification-status') {
      return (
        <AppLayout currentPath="/compliance" navigate={navigate}>
          <VerificationStatusPage navigate={navigate} />
        </AppLayout>
      );
    }
    if (currentPath === '/twin' || currentPath === '/analytics' || currentPath === '/sustainability') {
      return (
        <AppLayout currentPath="/twin" navigate={navigate}>
          <AnalyticsPage navigate={navigate} />
        </AppLayout>
      );
    }
    if (currentPath === '/profile') {
      return (
        <AppLayout currentPath="/profile" navigate={navigate}>
          <ProfilePage navigate={navigate} />
        </AppLayout>
      );
    }
    if (currentPath === '/create-batch') {
      return (
        <AppLayout currentPath="/passports" navigate={navigate}>
          <CreateBatchPage navigate={navigate} />
        </AppLayout>
      );
    }

    // 5. ROLE 3: BANK / NBFC PORTAL
    if (currentPath === '/portal/bank' || currentPath === '/bank') {
      return (
        <AppLayout currentPath="/portal/bank" navigate={navigate}>
          <BankPortalPage navigate={navigate} />
        </AppLayout>
      );
    }

    // 6. ROLE 4: GOVERNMENT / AUDITOR PORTAL
    if (currentPath === '/portal/auditor' || currentPath === '/auditor' || currentPath === '/government') {
      return (
        <AppLayout currentPath="/portal/auditor" navigate={navigate}>
          <AuditorPortalPage navigate={navigate} />
        </AppLayout>
      );
    }

    // 7. ROLE 5: SYSTEM ADMIN PORTAL
    if (currentPath === '/portal/admin' || currentPath === '/admin') {
      return (
        <AppLayout currentPath="/portal/admin" navigate={navigate}>
          <AdminPortalPage navigate={navigate} />
        </AppLayout>
      );
    }

    if (currentPath === '/portal/dyer') {
      return (
        <AppLayout currentPath="/dashboard" navigate={navigate}>
          <DyerPortalPage navigate={navigate} />
        </AppLayout>
      );
    }
    if (currentPath === '/portal/cetp') {
      return (
        <AppLayout currentPath="/dashboard" navigate={navigate}>
          <CetpPortalPage navigate={navigate} />
        </AppLayout>
      );
    }

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

export function App() {
  return (
    <AppProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </AppProvider>
  );
}

export default App;
