import { useState } from 'react';
import { motion } from 'framer-motion';
import { Droplets, ArrowLeftRight, Shield, Coins, GitCompare } from 'lucide-react';
import { LessonLayout } from '../components/layout';
import { Card, Accordion } from '../components/common';
import { PegVisualizer, ConfidentialTxDemo, AssetExplorer, ComparisonTable } from '../components/lessons/liquid';
import styles from './Lessons.module.css';

const sections = [
  { id: 'intro', title: 'Introduction' },
  { id: 'peg', title: 'Peg-In / Peg-Out' },
  { id: 'confidential', title: 'Confidential TX' },
  { id: 'assets', title: 'Issued Assets' },
  { id: 'comparison', title: 'Trade-offs' }
];

export function LiquidLesson() {
  const [currentSection, setCurrentSection] = useState(0);

  const renderSection = () => {
    switch (currentSection) {
      case 0:
        return <IntroSection />;
      case 1:
        return <PegSection />;
      case 2:
        return <ConfidentialSection />;
      case 3:
        return <AssetsSection />;
      case 4:
        return <ComparisonSection />;
      default:
        return <IntroSection />;
    }
  };

  return (
    <LessonLayout
      lessonId="liquid"
      title="Liquid Network"
      description="Explore Bitcoin's federated sidechain for trading and privacy"
      icon={Droplets}
      sections={sections}
      currentSection={currentSection}
      onSectionChange={setCurrentSection}
      prevLesson={{ path: '/lessons/lightning', title: 'Lightning Network' }}
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
          <Droplets size={48} />
        </div>
        <h2 className={styles.heroTitle}>The Liquid Network</h2>
        <p className={styles.heroText}>
          Liquid is a Bitcoin sidechain designed for traders and businesses. It offers 
          faster settlement, confidential transactions, and the ability to issue custom 
          assets - all backed by real Bitcoin through a federated two-way peg.
        </p>
      </div>

      <div className={styles.conceptGrid}>
        <Card padding="large" hover>
          <div className={styles.conceptIcon}>
            <ArrowLeftRight size={24} />
          </div>
          <h3>Fast Finality</h3>
          <p>
            Transactions are final in about 2 minutes. No more waiting for 6 
            confirmations - perfect for exchange settlements.
          </p>
        </Card>

        <Card padding="large" hover>
          <div className={styles.conceptIcon}>
            <Shield size={24} />
          </div>
          <h3>Confidential</h3>
          <p>
            Transaction amounts are hidden by default. Only the sender and receiver 
            know how much was transferred.
          </p>
        </Card>

        <Card padding="large" hover>
          <div className={styles.conceptIcon}>
            <Coins size={24} />
          </div>
          <h3>Issued Assets</h3>
          <p>
            Create and transfer custom tokens: stablecoins, security tokens, 
            collectibles, and more - all on Bitcoin's security.
          </p>
        </Card>
      </div>

      <Accordion title="What is a Sidechain?" defaultOpen>
        <p>
          A sidechain is a separate blockchain that runs parallel to the main Bitcoin 
          chain but with different rules. Think of it like a highway express lane:
        </p>
        <ul>
          <li>
            <strong>Two-way peg:</strong> You can move BTC onto the sidechain (peg-in) 
            and back to mainchain (peg-out). The peg ensures 1:1 backing.
          </li>
          <li>
            <strong>Different consensus:</strong> Liquid uses a federation of companies 
            instead of proof-of-work. This enables faster blocks and finality.
          </li>
          <li>
            <strong>Enhanced features:</strong> Since it's a separate chain, Liquid can 
            add features like confidential transactions without changing Bitcoin.
          </li>
          <li>
            <strong>Trade-off:</strong> You trust the federation to be honest. In exchange, 
            you get speed, privacy, and new capabilities.
          </li>
        </ul>
      </Accordion>

      <div className={styles.factBox}>
        <h4>Liquid Network Stats</h4>
        <div className={styles.factGrid}>
          <div className={styles.fact}>
            <span className={styles.factValue}>~3,500+</span>
            <span className={styles.factLabel}>L-BTC in circulation</span>
          </div>
          <div className={styles.fact}>
            <span className={styles.factValue}>15</span>
            <span className={styles.factLabel}>Federation members</span>
          </div>
          <div className={styles.fact}>
            <span className={styles.factValue}>1 min</span>
            <span className={styles.factLabel}>Block time</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function PegSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={styles.section}
    >
      <h2 className={styles.sectionTitle}>Moving Between Chains</h2>
      <p className={styles.sectionText}>
        The two-way peg allows you to move Bitcoin onto Liquid (receiving L-BTC) and back 
        again. The process is trustworthy because the federation uses multi-signature 
        security, and the peg is fully auditable on both chains.
      </p>

      <PegVisualizer />
    </motion.div>
  );
}

function ConfidentialSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={styles.section}
    >
      <h2 className={styles.sectionTitle}>Confidential Transactions</h2>
      <p className={styles.sectionText}>
        Unlike Bitcoin where transaction amounts are public, Liquid hides amounts using 
        cryptographic commitments. Anyone can still verify that inputs equal outputs 
        (no inflation), but only the participants know the actual values.
      </p>

      <ConfidentialTxDemo />
    </motion.div>
  );
}

function AssetsSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={styles.section}
    >
      <h2 className={styles.sectionTitle}>Issued Assets</h2>
      <p className={styles.sectionText}>
        Liquid allows anyone to issue their own tokens. These assets are native to the 
        protocol and benefit from the same confidential transactions and fast settlement 
        as L-BTC. Major stablecoins like USDt are available on Liquid.
      </p>

      <AssetExplorer />
    </motion.div>
  );
}

function ComparisonSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={styles.section}
    >
      <h2 className={styles.sectionTitle}>Trade-offs & Use Cases</h2>
      <p className={styles.sectionText}>
        Bitcoin, Lightning, and Liquid each have different strengths. Understanding when 
        to use each layer helps you get the most out of the Bitcoin ecosystem. Here's a 
        side-by-side comparison.
      </p>

      <ComparisonTable />
    </motion.div>
  );
}

export default LiquidLesson;
