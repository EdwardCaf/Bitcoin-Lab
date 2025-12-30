import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Header, Sidebar } from './components/layout';
import { HomePage } from './lessons/HomePage';
import { ResourcesPage } from './lessons/ResourcesPage';
import { WalletsLesson } from './lessons/WalletsLesson';
import { TransactionsLesson } from './lessons/TransactionsLesson';
import { UTXOManagementLesson } from './lessons/UTXOManagementLesson';
import { PrivacyLesson } from './lessons/PrivacyLesson';
import { MultisigLesson } from './lessons/MultisigLesson';
import { MiningLesson } from './lessons/MiningLesson';
import { BlocksLesson } from './lessons/BlocksLesson';
import { NetworkLesson } from './lessons/NetworkLesson';
import { LightningLesson } from './lessons/LightningLesson';
import { LiquidLesson } from './lessons/LiquidLesson';
import { EcashLesson } from './lessons/EcashLesson';
import './styles/globals.css';
import styles from './App.module.css';

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
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/resources" element={<ResourcesPage />} />
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
      </AppLayout>
    </BrowserRouter>
  );
}

export default App;
