import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Monitor, 
  Download, 
  Key, 
  Users, 
  Send, 
  Server,
  ExternalLink,
  Shield,
  Zap,
  HardDrive
} from 'lucide-react';
import { LessonLayout } from '../components/layout';
import { Card, Accordion } from '../components/common';
import { WalletSetup, MultisigSetup, TransactionWorkflow, NodeConnection } from '../components/lessons/sparrow';
import styles from './Lessons.module.css';

const sections = [
  { id: 'intro', title: 'Introduction' },
  { id: 'single-sig', title: 'Single-Sig Setup' },
  { id: 'multisig', title: 'Multi-Sig Setup' },
  { id: 'transactions', title: 'Sending Transactions' },
  { id: 'node', title: 'Node Connection' }
];

export function SparrowLesson() {
  const [currentSection, setCurrentSection] = useState(0);

  const renderSection = () => {
    switch (currentSection) {
      case 0:
        return <IntroSection />;
      case 1:
        return <SingleSigSection />;
      case 2:
        return <MultisigSection />;
      case 3:
        return <TransactionsSection />;
      case 4:
        return <NodeSection />;
      default:
        return <IntroSection />;
    }
  };

  return (
    <LessonLayout
      lessonId="sparrow"
      title="Sparrow Wallet"
      description="Learn how to use Sparrow Wallet for advanced Bitcoin management"
      icon={Monitor}
      sections={sections}
      currentSection={currentSection}
      onSectionChange={setCurrentSection}
      prevLesson={{ path: '/lessons/coldcard-q', title: 'Coldcard Q' }}
    >
      {renderSection()}
    </LessonLayout>
  );
}

function IntroSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={styles.section}
    >
      <div className={styles.heroCard}>
        <div className={styles.heroIcon}>
          <Monitor size={48} />
        </div>
        <h2 className={styles.heroTitle}>Sparrow Wallet</h2>
        <p className={styles.heroText}>
          Sparrow is a powerful desktop Bitcoin wallet focused on security, privacy, and 
          usability. It's designed for users who want full control over their Bitcoin 
          with support for hardware wallets, multisig, and advanced features.
        </p>
      </div>

      {/* Download CTA */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Card 
          variant="gradient" 
          padding="large" 
          style={{ 
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(99, 102, 241, 0.05))',
            border: '2px solid var(--info)',
            textAlign: 'center',
            margin: '0 0 var(--spacing-xl)'
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--spacing-lg)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '64px', height: '64px', background: 'var(--info)', borderRadius: 'var(--radius-xl)' }}>
              <Download size={32} color="white" />
            </div>
            <div>
              <h3 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 var(--spacing-sm)' }}>
                Download Sparrow Wallet
              </h3>
              <p style={{ fontSize: 'var(--text-base)', color: 'var(--text-secondary)', margin: '0 0 var(--spacing-lg)', maxWidth: '600px' }}>
                Sparrow is free, open-source software available for Windows, macOS, and Linux. 
                Always verify the download signature for security.
              </p>
            </div>
            <a 
              href="https://sparrowwallet.com" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 'var(--spacing-sm)',
                padding: 'var(--spacing-md) var(--spacing-2xl)',
                background: 'var(--info)',
                color: 'white',
                fontSize: 'var(--text-lg)',
                fontWeight: 600,
                borderRadius: 'var(--radius-lg)',
                textDecoration: 'none',
                transition: 'all var(--transition-fast)',
                boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 20px rgba(99, 102, 241, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 12px rgba(99, 102, 241, 0.3)';
              }}
            >
              <Download size={20} />
              Visit sparrowwallet.com
              <ExternalLink size={18} />
            </a>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', margin: 0 }}>
              Always verify GPG signatures after downloading to ensure authenticity
            </p>
          </div>
        </Card>
      </motion.div>

      <div className={styles.conceptGrid}>
        <Card padding="large" hover>
          <div className={styles.conceptIcon}>
            <HardDrive size={24} />
          </div>
          <h3>Hardware Wallet Support</h3>
          <p>
            Works seamlessly with Coldcard, Trezor, BitBox, and more. 
            Sign transactions via USB, QR codes, or SD card.
          </p>
        </Card>

        <Card padding="large" hover>
          <div className={styles.conceptIcon}>
            <Users size={24} />
          </div>
          <h3>Multi-Signature</h3>
          <p>
            Create and manage multisig wallets with any M-of-N configuration. 
            Distribute keys across devices and locations for enhanced security.
          </p>
        </Card>

        <Card padding="large" hover>
          <div className={styles.conceptIcon}>
            <Server size={24} />
          </div>
          <h3>Your Node, Your Rules</h3>
          <p>
            Connect to your own Bitcoin Core or Electrum server for maximum privacy. 
            No third party sees your addresses or balances.
          </p>
        </Card>
      </div>

      <Accordion title="Why Choose Sparrow?" defaultOpen>
        <p>
          Sparrow Wallet stands out for its focus on transparency and user empowerment. 
          Unlike mobile wallets that hide complexity, Sparrow shows you exactly what's 
          happening with your Bitcoin - from UTXO management to transaction construction.
        </p>
        <p>
          Key differentiators include:
        </p>
        <ul>
          <li><strong>Full PSBT support</strong> - Create, sign, and finalize transactions with complete control</li>
          <li><strong>UTXO labeling</strong> - Track the source and purpose of every coin</li>
          <li><strong>Coin control</strong> - Choose exactly which UTXOs to spend</li>
          <li><strong>Open source</strong> - Fully auditable code with reproducible builds</li>
          <li><strong>No accounts</strong> - No registration, no cloud, no tracking</li>
        </ul>
        <p>
          Whether you're setting up your first hardware wallet or managing a complex 
          multisig arrangement, Sparrow provides the tools you need without hiding 
          important details behind oversimplified interfaces.
        </p>
      </Accordion>

      <div className={styles.factBox}>
        <h4>Sparrow at a Glance</h4>
        <div className={styles.factGrid}>
          <div className={styles.fact}>
            <span className={styles.factValue}>3</span>
            <span className={styles.factLabel}>Platforms</span>
          </div>
          <div className={styles.fact}>
            <span className={styles.factValue}>10+</span>
            <span className={styles.factLabel}>Hardware Wallets</span>
          </div>
          <div className={styles.fact}>
            <span className={styles.factValue}>100%</span>
            <span className={styles.factLabel}>Open Source</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function SingleSigSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={styles.section}
    >
      <h2 className={styles.sectionTitle}>Single-Signature Wallet Setup</h2>
      <p className={styles.sectionText}>
        A single-signature (single-sig) wallet uses one private key to control your Bitcoin. 
        This is the most common wallet type and the best starting point for most users. 
        Sparrow supports creating new wallets, importing existing seeds, connecting hardware 
        wallets, and setting up watch-only wallets.
      </p>

      <WalletSetup />
    </motion.div>
  );
}

function MultisigSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={styles.section}
    >
      <h2 className={styles.sectionTitle}>Multi-Signature Wallet Setup</h2>
      <p className={styles.sectionText}>
        Multi-signature (multisig) wallets require multiple keys to authorize a transaction. 
        This eliminates single points of failure - if one key is lost or compromised, your 
        Bitcoin remains secure. Sparrow makes setting up and managing multisig straightforward.
      </p>

      <MultisigSetup />
    </motion.div>
  );
}

function TransactionsSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={styles.section}
    >
      <h2 className={styles.sectionTitle}>Sending Transactions</h2>
      <p className={styles.sectionText}>
        Sparrow uses the PSBT (Partially Signed Bitcoin Transaction) standard to safely 
        create and sign transactions. Whether you're using a connected hardware wallet 
        or an air-gapped signing device, the workflow keeps your keys secure while 
        giving you full visibility into every transaction detail.
      </p>

      <TransactionWorkflow />
    </motion.div>
  );
}

function NodeSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={styles.section}
    >
      <h2 className={styles.sectionTitle}>Connecting to Your Node</h2>
      <p className={styles.sectionText}>
        How Sparrow connects to the Bitcoin network significantly impacts your privacy. 
        By default, public servers can see which addresses you're querying. Running your 
        own node ensures no third party learns about your Bitcoin holdings.
      </p>

      <NodeConnection />
    </motion.div>
  );
}

export default SparrowLesson;
