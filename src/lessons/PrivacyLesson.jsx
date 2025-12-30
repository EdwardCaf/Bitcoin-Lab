import { useState } from 'react';
import { motion } from 'framer-motion';
import { EyeOff, Eye, Shield, Shuffle, RefreshCw } from 'lucide-react';
import { LessonLayout } from '../components/layout';
import { Card, Accordion } from '../components/common';
import { AddressReuseDemo, TransactionGraph, CoinJoinVisualizer, PrivacyScorecard } from '../components/lessons/privacy';
import { PegVisualizer } from '../components/lessons/liquid';
import styles from './Lessons.module.css';

const sections = [
  { id: 'intro', title: 'Introduction' },
  { id: 'reuse', title: 'Address Reuse' },
  { id: 'analysis', title: 'Chain Analysis' },
  { id: 'coinjoin', title: 'CoinJoin' },
  { id: 'liquid-pegs', title: 'Liquid Peg Privacy' },
  { id: 'practices', title: 'Best Practices' }
];

export function PrivacyLesson() {
  const [currentSection, setCurrentSection] = useState(0);

  const renderSection = () => {
    switch (currentSection) {
      case 0:
        return <IntroSection />;
      case 1:
        return <AddressReuseSection />;
      case 2:
        return <ChainAnalysisSection />;
      case 3:
        return <CoinJoinSection />;
      case 4:
        return <LiquidPegsSection />;
      case 5:
        return <BestPracticesSection />;
      default:
        return <IntroSection />;
    }
  };

  return (
    <LessonLayout
      lessonId="privacy"
      title="Privacy"
      description="Learn how to protect your financial privacy when using Bitcoin"
      icon={EyeOff}
      sections={sections}
      currentSection={currentSection}
      onSectionChange={setCurrentSection}
      prevLesson={{ path: '/lessons/utxo-management', title: 'UTXO Management' }}
      nextLesson={{ path: '/lessons/multisig', title: 'Multi-Signature' }}
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
          <EyeOff size={48} />
        </div>
        <h2 className={styles.heroTitle}>Bitcoin and Privacy</h2>
        <p className={styles.heroText}>
          Bitcoin is pseudonymous, not anonymous. Every transaction is recorded on a 
          public blockchain forever. With the right techniques, you can protect your 
          financial privacy - but it requires understanding the risks first.
        </p>
      </div>

      <div className={styles.conceptGrid}>
        <Card padding="large" hover>
          <div className={styles.conceptIcon}>
            <Eye size={24} />
          </div>
          <h3>Public Ledger</h3>
          <p>
            All Bitcoin transactions are visible to everyone. Addresses are 
            pseudonyms, but they can be linked to real identities.
          </p>
        </Card>

        <Card padding="large" hover>
          <div className={styles.conceptIcon}>
            <RefreshCw size={24} />
          </div>
          <h3>Address Linking</h3>
          <p>
            Reusing addresses and spending patterns can reveal which addresses 
            belong to the same person or entity.
          </p>
        </Card>

        <Card padding="large" hover>
          <div className={styles.conceptIcon}>
            <Shield size={24} />
          </div>
          <h3>Privacy Tools</h3>
          <p>
            Techniques like CoinJoin, fresh addresses, and careful UTXO management 
            can significantly improve your privacy.
          </p>
        </Card>
      </div>

      <Accordion title="Why Does Privacy Matter?" defaultOpen>
        <p>
          Financial privacy isn't just for criminals. Here's why it matters:
        </p>
        <ul>
          <li>
            <strong>Personal safety:</strong> If your Bitcoin holdings are public, 
            you could become a target for theft or extortion
          </li>
          <li>
            <strong>Business confidentiality:</strong> Companies don't want competitors 
            seeing their supplier payments or payroll
          </li>
          <li>
            <strong>Fungibility:</strong> If some coins are "tainted" by their history, 
            Bitcoin loses a key property of money
          </li>
          <li>
            <strong>Human right:</strong> Financial privacy is recognized as a basic 
            right in many jurisdictions
          </li>
        </ul>
        <p>
          The goal isn't to hide illegal activity - it's to have the same level of 
          financial privacy that cash provides, in the digital age.
        </p>
      </Accordion>

      <div className={styles.factBox}>
        <h4>Privacy Reality Check</h4>
        <div className={styles.factGrid}>
          <div className={styles.fact}>
            <span className={styles.factValue}>100%</span>
            <span className={styles.factLabel}>Transactions are public</span>
          </div>
          <div className={styles.fact}>
            <span className={styles.factValue}>Forever</span>
            <span className={styles.factLabel}>Blockchain records persist</span>
          </div>
          <div className={styles.fact}>
            <span className={styles.factValue}>~65%</span>
            <span className={styles.factLabel}>Addresses can be clustered</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function AddressReuseSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={styles.section}
    >
      <h2 className={styles.sectionTitle}>The Problem with Address Reuse</h2>
      <p className={styles.sectionText}>
        One of the most common privacy mistakes is reusing Bitcoin addresses. When you 
        use the same address multiple times, anyone can see all payments you've received 
        and your total balance. It's like using the same email address for everything 
        and having all your correspondence public.
      </p>

      <AddressReuseDemo />
    </motion.div>
  );
}

function ChainAnalysisSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={styles.section}
    >
      <h2 className={styles.sectionTitle}>How Chain Analysis Works</h2>
      <p className={styles.sectionText}>
        Chain analysis companies use heuristics to cluster addresses and trace the 
        flow of funds. By understanding these techniques, you can take steps to 
        protect yourself. The most common methods exploit spending patterns and 
        the UTXO model itself.
      </p>

      <TransactionGraph />
    </motion.div>
  );
}

function CoinJoinSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={styles.section}
    >
      <h2 className={styles.sectionTitle}>CoinJoin: Breaking the Links</h2>
      <p className={styles.sectionText}>
        CoinJoin is a technique where multiple users combine their transactions into 
        one, making it impossible to tell which inputs correspond to which outputs. 
        It's the most effective way to break transaction links without trusting a 
        third party with your coins.
      </p>

      <CoinJoinVisualizer />
    </motion.div>
  );
}

function LiquidPegsSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={styles.section}
    >
      <h2 className={styles.sectionTitle}>Liquid Peg-In/Peg-Out Privacy</h2>
      <p className={styles.sectionText}>
        Liquid Network offers powerful privacy features through Confidential Transactions, 
        which hide transaction amounts and asset types. By pegging Bitcoin into Liquid 
        (peg-in) and back out (peg-out), you can break chain analysis links while your 
        funds benefit from confidential transfers. This is one of the most effective ways 
        to obscure transaction amounts and break the chain of custody visible on Bitcoin's 
        transparent blockchain.
      </p>

      <PegVisualizer />
    </motion.div>
  );
}

function BestPracticesSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={styles.section}
    >
      <h2 className={styles.sectionTitle}>Privacy Best Practices</h2>
      <p className={styles.sectionText}>
        Improving your Bitcoin privacy doesn't require being a technical expert. 
        These practical steps can significantly reduce your exposure to surveillance. 
        Rate yourself below to see where you stand and get personalized recommendations.
      </p>

      <PrivacyScorecard />
    </motion.div>
  );
}

export default PrivacyLesson;
