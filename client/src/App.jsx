import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { AppLayout } from './components/AppLayout';
import { Toast } from './components/Toast';

import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { OtpVerifyPage } from './pages/OtpVerifyPage';
import { IdentityUploadPage } from './pages/IdentityUploadPage';
import { DocumentUploadPage } from './pages/DocumentUploadPage';
import { VerificationStatusPage } from './pages/VerificationStatusPage';
import { ProfilePage } from './pages/ProfilePage';
import { AccessDeniedPage } from './pages/AccessDeniedPage';

import { DashboardPage } from './pages/DashboardPage';
import { BatchesPage } from './pages/BatchesPage';
import { BatchDetailPage } from './pages/BatchDetailPage';
import { CreateBatchPage } from './pages/CreateBatchPage';
import { PassportViewPage } from './pages/PassportViewPage';
import { PublicVerifyPage } from './pages/PublicVerifyPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { GreenGrowthTwinPage } from './pages/GreenGrowthTwinPage';
import { ComplianceDashboardPage } from './pages/ComplianceDashboardPage';
import { DyerPortalPage } from './pages/DyerPortalPage';
import { CetpPortalPage } from './pages/CetpPortalPage';
import { BankPortalPage } from './pages/BankPortalPage';
import { AuditorPortalPage } from './pages/AuditorPortalPage';
import { AdminPortalPage } from './pages/AdminPortalPage';

function AppContent() {
  const { msme, isAuthenticated, loading } = useAuth();
  const { currentRole, toast } = useApp() || {};
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

  // PUBLIC BUYER VERIFICATION ROUTE (No Auth Required)
  if (currentPath.startsWith('/verify/')) {
    const passportId = currentPath.replace('/verify/', '');
    return <PublicVerifyPage passportId={passportId} navigate={navigate} />;
  }

  // UNAUTHENTICATED USERS
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
    if (currentPath === '/identity-proof') {
      return <IdentityUploadPage navigate={navigate} />;
    }
    if (currentPath === '/verification-status') {
      return <VerificationStatusPage navigate={navigate} />;
    }
    return <LandingPage navigate={navigate} />;
  }

  // Active user role resolution
  const userRole = currentRole || msme?.role || 'msme';

  // LOGGED IN USER ROUTE SWITCHER WITH STRICT ROLE-BASED ACCESS CONTROL (RBAC)
  const renderCurrentPage = () => {
    if (currentPath === '/profile') {
      return (
        <AppLayout currentPath="/profile" navigate={navigate}>
          <ProfilePage navigate={navigate} />
        </AppLayout>
      );
    }

    if (currentPath === '/documents') {
      return (
        <AppLayout currentPath="/documents" navigate={navigate}>
          <DocumentUploadPage navigate={navigate} />
        </AppLayout>
      );
    }

    if (currentPath === '/identity-proof') {
      return (
        <AppLayout currentPath="/identity-proof" navigate={navigate}>
          <IdentityUploadPage navigate={navigate} />
        </AppLayout>
      );
    }

    if (currentPath === '/verification-status') {
      return (
        <AppLayout currentPath="/verification-status" navigate={navigate}>
          <VerificationStatusPage navigate={navigate} />
        </AppLayout>
      );
    }

    if (currentPath === '/batches' || currentPath === '/passports') {
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

    if (currentPath === '/analytics') {
      return (
        <AppLayout currentPath="/analytics" navigate={navigate}>
          <AnalyticsPage navigate={navigate} />
        </AppLayout>
      );
    }

    if (currentPath === '/twin') {
      return (
        <AppLayout currentPath="/twin" navigate={navigate}>
          <GreenGrowthTwinPage navigate={navigate} />
        </AppLayout>
      );
    }

    if (currentPath === '/compliance') {
      return (
        <AppLayout currentPath="/compliance" navigate={navigate}>
          <ComplianceDashboardPage navigate={navigate} />
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

    // STRICT RBAC CHECK FOR STAKEHOLDER PORTALS
    if (currentPath === '/portal/bank' || currentPath === '/bank') {
      if (userRole !== 'bank') {
        return (
          <AppLayout currentPath="/dashboard" navigate={navigate}>
            <AccessDeniedPage navigate={navigate} requiredRole="Bank & Financial Underwriter (Role 3)" />
          </AppLayout>
        );
      }
      return (
        <AppLayout currentPath="/portal/bank" navigate={navigate}>
          <BankPortalPage navigate={navigate} />
        </AppLayout>
      );
    }

    if (currentPath === '/portal/auditor' || currentPath === '/auditor' || currentPath === '/government') {
      if (userRole !== 'auditor') {
        return (
          <AppLayout currentPath="/dashboard" navigate={navigate}>
            <AccessDeniedPage navigate={navigate} requiredRole="Government & Environmental Auditor (Role 4)" />
          </AppLayout>
        );
      }
      return (
        <AppLayout currentPath="/portal/auditor" navigate={navigate}>
          <AuditorPortalPage navigate={navigate} />
        </AppLayout>
      );
    }

    if (currentPath === '/portal/admin' || currentPath === '/admin') {
      if (userRole !== 'admin') {
        return (
          <AppLayout currentPath="/dashboard" navigate={navigate}>
            <AccessDeniedPage navigate={navigate} requiredRole="System Platform Admin (Role 5)" />
          </AppLayout>
        );
      }
      return (
        <AppLayout currentPath="/portal/admin" navigate={navigate}>
          <AdminPortalPage navigate={navigate} />
        </AppLayout>
      );
    }

    if (currentPath === '/portal/dyer') {
      if (userRole !== 'dyer') {
        return (
          <AppLayout currentPath="/dashboard" navigate={navigate}>
            <AccessDeniedPage navigate={navigate} requiredRole="Dyeing Partner Facility (Role 2)" />
          </AppLayout>
        );
      }
      return (
        <AppLayout currentPath="/dashboard" navigate={navigate}>
          <DyerPortalPage navigate={navigate} />
        </AppLayout>
      );
    }

    if (currentPath === '/portal/cetp') {
      if (userRole !== 'cetp') {
        return (
          <AppLayout currentPath="/dashboard" navigate={navigate}>
            <AccessDeniedPage navigate={navigate} requiredRole="CETP ZLD Plant Operator (Role 3)" />
          </AppLayout>
        );
      }
      return (
        <AppLayout currentPath="/dashboard" navigate={navigate}>
          <CetpPortalPage navigate={navigate} />
        </AppLayout>
      );
    }

    // Role-specific home page fallback
    if (userRole === 'bank') {
      return (
        <AppLayout currentPath="/portal/bank" navigate={navigate}>
          <BankPortalPage navigate={navigate} />
        </AppLayout>
      );
    }
    if (userRole === 'auditor') {
      return (
        <AppLayout currentPath="/portal/auditor" navigate={navigate}>
          <AuditorPortalPage navigate={navigate} />
        </AppLayout>
      );
    }
    if (userRole === 'dyer') {
      return (
        <AppLayout currentPath="/dashboard" navigate={navigate}>
          <DyerPortalPage navigate={navigate} />
        </AppLayout>
      );
    }
    if (userRole === 'cetp') {
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

export default function App() {
  return (
    <AppProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </AppProvider>
  );
}
