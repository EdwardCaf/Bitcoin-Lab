import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Header, Sidebar } from './components/layout';
import { HomePage } from './lessons/HomePage';
import { WalletsLesson } from './lessons/WalletsLesson';
import { TransactionsLesson } from './lessons/TransactionsLesson';
import { PrivacyLesson } from './lessons/PrivacyLesson';
import { MultisigLesson } from './lessons/MultisigLesson';
import { MiningLesson } from './lessons/MiningLesson';
import { BlocksLesson } from './lessons/BlocksLesson';
import { NetworkLesson } from './lessons/NetworkLesson';
import { LightningLesson } from './lessons/LightningLesson';
import { LiquidLesson } from './lessons/LiquidLesson';
import { ColdcardQLesson } from './lessons/ColdcardQLesson';
import { SparrowLesson } from './lessons/SparrowLesson';
import './styles/globals.css';
import styles from './App.module.css';

function AppLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className={styles.app}>
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
          <Route path="/lessons/wallets" element={<WalletsLesson />} />
          <Route path="/lessons/transactions" element={<TransactionsLesson />} />
          <Route path="/lessons/privacy" element={<PrivacyLesson />} />
          <Route path="/lessons/multisig" element={<MultisigLesson />} />
          <Route path="/lessons/mining" element={<MiningLesson />} />
          <Route path="/lessons/blocks" element={<BlocksLesson />} />
          <Route path="/lessons/network" element={<NetworkLesson />} />
          <Route path="/lessons/lightning" element={<LightningLesson />} />
          <Route path="/lessons/liquid" element={<LiquidLesson />} />
          <Route path="/lessons/coldcard-q" element={<ColdcardQLesson />} />
          <Route path="/lessons/sparrow" element={<SparrowLesson />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
}

export default App;
