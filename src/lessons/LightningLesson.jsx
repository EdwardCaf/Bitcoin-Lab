import { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, Clock, DollarSign, Network, Lock } from 'lucide-react';
import { LessonLayout } from '../components/layout';
import { Card, Accordion } from '../components/common';
import { ChannelVisualizer, RoutingSimulator, HTLCDemo, InvoiceExplorer, PrivacyDemo } from '../components/lessons/lightning';
import styles from './Lessons.module.css';

const sections = [
  { id: 'intro', title: 'Introduction' },
  { id: 'channels', title: 'Payment Channels' },
  { id: 'routing', title: 'Routing Payments' },
  { id: 'htlc', title: 'HTLCs' },
  { id: 'invoices', title: 'Using Lightning' },
  { id: 'privacy', title: 'Privacy Benefits' }
];

export function LightningLesson() {
  const [currentSection, setCurrentSection] = useState(0);

  const renderSection = () => {
    switch (currentSection) {
      case 0:
        return <IntroSection />;
      case 1:
        return <ChannelsSection />;
      case 2:
        return <RoutingSection />;
      case 3:
        return <HTLCSection />;
      case 4:
        return <InvoicesSection />;
      case 5:
        return <PrivacySection />;
      default:
        return <IntroSection />;
    }
  };

  return (
    <LessonLayout
      lessonId="lightning"
      title="Lightning Network"
      description="Learn how Bitcoin scales with instant, low-fee payments"
      icon={Zap}
      sections={sections}
      currentSection={currentSection}
      onSectionChange={setCurrentSection}
      prevLesson={{ path: '/lessons/network', title: 'Network & Nodes' }}
      nextLesson={{ path: '/lessons/liquid', title: 'Liquid Network' }}
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
          <Zap size={48} />
        </div>
        <h2 className={styles.heroTitle}>The Lightning Network</h2>
        <p className={styles.heroText}>
          Lightning is a "Layer 2" payment protocol built on top of Bitcoin. It enables 
          instant payments with near-zero fees by moving most transactions off the main 
          blockchain while maintaining Bitcoin's security guarantees.
        </p>
      </div>

      <div className={styles.conceptGrid}>
        <Card padding="large" hover>
          <div className={styles.conceptIcon}>
            <Clock size={24} />
          </div>
          <h3>Instant Payments</h3>
          <p>
            Payments settle in milliseconds, not minutes. No waiting for block 
            confirmations - perfect for everyday purchases.
          </p>
        </Card>

        <Card padding="large" hover>
          <div className={styles.conceptIcon}>
            <DollarSign size={24} />
          </div>
          <h3>Tiny Fees</h3>
          <p>
            Fees are typically less than a satoshi. This makes micropayments 
            practical - pay per article, per second of video, or tip creators.
          </p>
        </Card>

        <Card padding="large" hover>
          <div className={styles.conceptIcon}>
            <Network size={24} />
          </div>
          <h3>Scalability</h3>
          <p>
            Millions of transactions per second are possible. Lightning removes 
            the throughput constraints of the base layer.
          </p>
        </Card>
      </div>

      <Accordion title="The Bar Tab Analogy" defaultOpen>
        <p>
          Imagine you're at a bar. Instead of paying for each drink individually (which 
          would require the bartender to process your card each time), you open a "tab."
        </p>
        <ul>
          <li>
            <strong>Opening a tab:</strong> You hand over your credit card. This is like 
            opening a Lightning channel - one on-chain transaction locks up funds.
          </li>
          <li>
            <strong>Ordering drinks:</strong> Throughout the night, you order drinks and 
            the bartender updates your tab. No payment processing needed - just like 
            Lightning channel updates are instant and free.
          </li>
          <li>
            <strong>Closing your tab:</strong> At the end of the night, you settle up once. 
            This is like closing a Lightning channel - one final on-chain transaction.
          </li>
        </ul>
        <p>
          The key insight: by batching many small transactions into one "open" and one 
          "close" transaction, we dramatically reduce the load on the Bitcoin blockchain.
        </p>
      </Accordion>

      <div className={styles.factBox}>
        <h4>Lightning Network Stats</h4>
        <div className={styles.factGrid}>
          <div className={styles.fact}>
            <span className={styles.factValue}>~5,000+</span>
            <span className={styles.factLabel}>BTC capacity</span>
          </div>
          <div className={styles.fact}>
            <span className={styles.factValue}>~15,000+</span>
            <span className={styles.factLabel}>Nodes</span>
          </div>
          <div className={styles.fact}>
            <span className={styles.factValue}>&lt;1 sec</span>
            <span className={styles.factLabel}>Payment time</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function ChannelsSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={styles.section}
    >
      <h2 className={styles.sectionTitle}>Payment Channels</h2>
      <p className={styles.sectionText}>
        Payment channels are the foundation of Lightning. Two parties lock funds in a 
        shared Bitcoin address and can then exchange an unlimited number of payments 
        between themselves without touching the blockchain. Only the opening and closing 
        transactions are recorded on-chain.
      </p>

      <ChannelVisualizer />
    </motion.div>
  );
}

function RoutingSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={styles.section}
    >
      <h2 className={styles.sectionTitle}>Routing Payments</h2>
      <p className={styles.sectionText}>
        You don't need a direct channel with everyone you want to pay. Lightning routes 
        payments through a network of channels. If Alice has a channel with Bob, and Bob 
        has a channel with Carol, then Alice can pay Carol through Bob. Each hop charges 
        a small fee for forwarding the payment.
      </p>

      <RoutingSimulator />
    </motion.div>
  );
}

function HTLCSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={styles.section}
    >
      <h2 className={styles.sectionTitle}>Hash Time-Locked Contracts</h2>
      <p className={styles.sectionText}>
        HTLCs are the cryptographic magic that makes multi-hop payments trustless. They 
        ensure that either the entire payment succeeds, or it fails completely - no 
        intermediate node can steal funds. The receiver reveals a secret that unlocks 
        payments at each hop.
      </p>

      <HTLCDemo />
    </motion.div>
  );
}

function InvoicesSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={styles.section}
    >
      <h2 className={styles.sectionTitle}>Using Lightning</h2>
      <p className={styles.sectionText}>
        To receive a Lightning payment, you generate an invoice - a string that encodes 
        the amount, description, and payment hash. The payer's wallet decodes this invoice 
        and finds a route to complete the payment. Invoices are single-use and typically 
        expire after a set time.
      </p>

      <InvoiceExplorer />
    </motion.div>
  );
}

function PrivacySection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={styles.section}
    >
      <h2 className={styles.sectionTitle}>Privacy Benefits of Lightning</h2>
      <p className={styles.sectionText}>
        Beyond speed and low fees, Lightning Network offers significant privacy improvements 
        over on-chain Bitcoin transactions. Payments are not recorded on the public blockchain, 
        and onion routing ensures that intermediate nodes cannot link senders to receivers. 
        This makes Lightning an excellent choice for everyday transactions where privacy matters.
      </p>

      <PrivacyDemo />
    </motion.div>
  );
}

export default LightningLesson;
