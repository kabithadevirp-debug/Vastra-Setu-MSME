import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
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

function AppContent() {
  const { toast } = useApp();
  const [currentPath, setCurrentPath] = useState(window.location.pathname || '/');

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderCurrentPage = () => {
    if (currentPath === '/' || currentPath === '/landing') {
      return <LandingPage navigate={navigate} />;
    }
    if (currentPath === '/dashboard') {
      return <DashboardPage navigate={navigate} />;
    }
    if (currentPath === '/batches') {
      return <BatchesPage navigate={navigate} />;
    }
    if (currentPath.startsWith('/batches/')) {
      const batchId = currentPath.replace('/batches/', '');
      return <BatchDetailPage batchId={batchId} navigate={navigate} />;
    }
    if (currentPath === '/create-batch') {
      return <CreateBatchPage navigate={navigate} />;
    }
    if (currentPath === '/portal/dyer') {
      return <DyerPortalPage navigate={navigate} />;
    }
    if (currentPath === '/portal/cetp') {
      return <CetpPortalPage navigate={navigate} />;
    }
    if (currentPath.startsWith('/passport/')) {
      const batchId = currentPath.replace('/passport/', '');
      return <PassportViewPage batchId={batchId} navigate={navigate} />;
    }
    if (currentPath.startsWith('/verify/')) {
      const passportId = currentPath.replace('/verify/', '');
      return <PublicVerifyPage passportId={passportId} navigate={navigate} />;
    }
    if (currentPath === '/analytics' || currentPath === '/sustainability') {
      return <AnalyticsPage navigate={navigate} />;
    }

    return <DashboardPage navigate={navigate} />;
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFC] text-zinc-900 font-sans">
      <Navbar currentPath={currentPath} navigate={navigate} />
      <main className="flex-1">
        {renderCurrentPage()}
      </main>
      <Toast toast={toast} onClose={() => {}} />
    </div>
  );
}

export function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
