import { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Header, Sidebar } from './components/layout';
import { HomePage } from './lessons/HomePage';
import { ResourcesPage } from './lessons/ResourcesPage';
import { SupportPage } from './lessons/SupportPage';
import './styles/globals.css';
import styles from './App.module.css';

// Lazy load lesson components for code splitting
const WalletsLesson = lazy(() => import('./lessons/WalletsLesson'));
const TransactionsLesson = lazy(() => import('./lessons/TransactionsLesson'));
const UTXOManagementLesson = lazy(() => import('./lessons/UTXOManagementLesson'));
const PrivacyLesson = lazy(() => import('./lessons/PrivacyLesson'));
const MultisigLesson = lazy(() => import('./lessons/MultisigLesson'));
const MiningLesson = lazy(() => import('./lessons/MiningLesson'));
const BlocksLesson = lazy(() => import('./lessons/BlocksLesson'));
const NetworkLesson = lazy(() => import('./lessons/NetworkLesson'));
const LightningLesson = lazy(() => import('./lessons/LightningLesson'));
const LiquidLesson = lazy(() => import('./lessons/LiquidLesson'));
const EcashLesson = lazy(() => import('./lessons/EcashLesson'));

// Minimal loading spinner for Suspense fallback
function LoadingSpinner() {
  return (
    <div className={styles.loadingContainer}>
      <div className={styles.spinner} />
    </div>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function AppLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className={styles.app}>
      <ScrollToTop />
      <Header 
        sidebarOpen={sidebarOpen} 
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} 
      />
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />
      <main className={styles.main}>
        {children}
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppLayout>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/resources" element={<ResourcesPage />} />
            <Route path="/support" element={<SupportPage />} />
            <Route path="/lessons/wallets" element={<WalletsLesson />} />
            <Route path="/lessons/transactions" element={<TransactionsLesson />} />
            <Route path="/lessons/utxo-management" element={<UTXOManagementLesson />} />
            <Route path="/lessons/privacy" element={<PrivacyLesson />} />
            <Route path="/lessons/multisig" element={<MultisigLesson />} />
            <Route path="/lessons/mining" element={<MiningLesson />} />
            <Route path="/lessons/blocks" element={<BlocksLesson />} />
            <Route path="/lessons/network" element={<NetworkLesson />} />
            <Route path="/lessons/lightning" element={<LightningLesson />} />
            <Route path="/lessons/liquid" element={<LiquidLesson />} />
            <Route path="/lessons/ecash" element={<EcashLesson />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </AppLayout>
    </BrowserRouter>
  );
}

export default App;
