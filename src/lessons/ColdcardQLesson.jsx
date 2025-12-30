import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Cpu, Fingerprint, FileKey, Settings, ExternalLink, ShoppingCart } from 'lucide-react';
import { LessonLayout } from '../components/layout';
import { Card, Accordion } from '../components/common';
import { DeviceOverview, SecurityLayers, PSBTWorkflow, AdvancedFeatures } from '../components/lessons/coldcard';
import styles from './Lessons.module.css';

const sections = [
  { id: 'intro', title: 'Introduction' },
  { id: 'device', title: 'Device Overview' },
  { id: 'security', title: 'Security Model' },
  { id: 'workflow', title: 'Signing Transactions' },
  { id: 'advanced', title: 'Advanced Features' }
];

export function ColdcardQLesson() {
  const [currentSection, setCurrentSection] = useState(0);

  const renderSection = () => {
    switch (currentSection) {
      case 0:
        return <IntroSection />;
      case 1:
        return <DeviceSection />;
      case 2:
        return <SecuritySection />;
      case 3:
        return <WorkflowSection />;
      case 4:
        return <AdvancedSection />;
      default:
        return <IntroSection />;
    }
  };

  return (
    <LessonLayout
      lessonId="coldcard-q"
      title="Coldcard Q"
      description="Learn how to secure your Bitcoin with the Coldcard Q hardware wallet"
      icon={ShieldCheck}
      sections={sections}
      currentSection={currentSection}
      onSectionChange={setCurrentSection}
      prevLesson={{ path: '/lessons/liquid', title: 'Liquid Network' }}
      nextLesson={{ path: '/lessons/sparrow', title: 'Sparrow Wallet' }}
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
          <ShieldCheck size={48} />
        </div>
        <h2 className={styles.heroTitle}>Coldcard Q Hardware Wallet</h2>
        <p className={styles.heroText}>
          The Coldcard Q is a premium Bitcoin hardware wallet designed for maximum security. 
          It keeps your private keys completely offline, protecting them from hackers, malware, 
          and online threats.
        </p>
      </div>

      {/* Store CTA */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Card 
          variant="gradient" 
          padding="large" 
          style={{ 
            background: 'linear-gradient(135deg, rgba(247, 147, 26, 0.15), rgba(247, 147, 26, 0.05))',
            border: '2px solid var(--bitcoin-orange)',
            textAlign: 'center',
            margin: '0 0 var(--spacing-xl)'
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--spacing-lg)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '64px', height: '64px', background: 'var(--bitcoin-orange)', borderRadius: 'var(--radius-xl)' }}>
              <ShoppingCart size={32} color="white" />
            </div>
            <div>
              <h3 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 var(--spacing-sm)' }}>
                Get Your Coldcard Q
              </h3>
              <p style={{ fontSize: 'var(--text-base)', color: 'var(--text-secondary)', margin: '0 0 var(--spacing-lg)', maxWidth: '600px' }}>
                Ready to secure your Bitcoin with the best? The Coldcard Q is available directly from Coinkite's official store.
              </p>
            </div>
            <a 
              href="https://store.coinkite.com/store/coldcard" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 'var(--spacing-sm)',
                padding: 'var(--spacing-md) var(--spacing-2xl)',
                background: 'var(--bitcoin-orange)',
                color: 'white',
                fontSize: 'var(--text-lg)',
                fontWeight: 600,
                borderRadius: 'var(--radius-lg)',
                textDecoration: 'none',
                transition: 'all var(--transition-fast)',
                boxShadow: '0 4px 12px rgba(247, 147, 26, 0.3)'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 20px rgba(247, 147, 26, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 12px rgba(247, 147, 26, 0.3)';
              }}
            >
              <ShoppingCart size={20} />
              Visit Coldcard Store
              <ExternalLink size={18} />
            </a>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', margin: 0 }}>
              Always purchase from the official store to ensure authenticity and avoid tampered devices
            </p>
          </div>
        </Card>
      </motion.div>

      <div className={styles.conceptGrid}>
        <Card padding="large" hover>
          <div className={styles.conceptIcon}>
            <ShieldCheck size={24} />
          </div>
          <h3>Air-Gapped Security</h3>
          <p>
            Never connects to the internet. Sign transactions using QR codes or 
            MicroSD cards - your keys never touch an online device.
          </p>
        </Card>

        <Card padding="large" hover>
          <div className={styles.conceptIcon}>
            <Cpu size={24} />
          </div>
          <h3>Dual Secure Elements</h3>
          <p>
            Two separate security chips from different manufacturers protect your 
            seed phrase. No single point of failure.
          </p>
        </Card>

        <Card padding="large" hover>
          <div className={styles.conceptIcon}>
            <Fingerprint size={24} />
          </div>
          <h3>Anti-Phishing Protection</h3>
          <p>
            Unique words appear after entering your PIN prefix, proving the device 
            is genuine and hasn't been tampered with.
          </p>
        </Card>
      </div>

      <Accordion title="Why Use a Hardware Wallet?" defaultOpen>
        <p>
          When you store Bitcoin on a phone or computer, your private keys are vulnerable 
          to malware, hackers, and phishing attacks. A hardware wallet solves this by 
          keeping your keys on a dedicated device that never connects to the internet.
        </p>
        <p>
          Think of it like this: your computer is a busy office with lots of people coming 
          and going. A hardware wallet is like a private vault in a secure location - only 
          you have access, and it's completely isolated from the chaos of the internet.
        </p>
        <p>
          The Coldcard Q takes this further with "air-gapped" operation - it can work 
          entirely without USB connections, using QR codes or SD cards to communicate 
          with your wallet software.
        </p>
      </Accordion>

      <div className={styles.factBox}>
        <h4>Coldcard Q Specifications</h4>
        <div className={styles.factGrid}>
          <div className={styles.fact}>
            <span className={styles.factValue}>3.2"</span>
            <span className={styles.factLabel}>LCD Screen</span>
          </div>
          <div className={styles.fact}>
            <span className={styles.factValue}>QWERTY</span>
            <span className={styles.factLabel}>Full Keyboard</span>
          </div>
          <div className={styles.fact}>
            <span className={styles.factValue}>2x SD</span>
            <span className={styles.factLabel}>Card Slots</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function DeviceSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={styles.section}
    >
      <h2 className={styles.sectionTitle}>Device Overview</h2>
      <p className={styles.sectionText}>
        The Coldcard Q is designed for serious Bitcoin security. Every feature serves a purpose: 
        the full keyboard makes entering passphrases easy, the QR scanner enables air-gapped 
        signing, and the battery power means it never needs to connect to anything.
      </p>

      <DeviceOverview />
    </motion.div>
  );
}

function SecuritySection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={styles.section}
    >
      <h2 className={styles.sectionTitle}>Security Architecture</h2>
      <p className={styles.sectionText}>
        The Coldcard Q uses multiple layers of security to protect your Bitcoin. Understanding 
        these layers helps you appreciate why it's considered one of the most secure hardware 
        wallets available.
      </p>

      <SecurityLayers />
    </motion.div>
  );
}

function WorkflowSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={styles.section}
    >
      <h2 className={styles.sectionTitle}>Air-Gapped Transaction Signing</h2>
      <p className={styles.sectionText}>
        The Coldcard Q can sign Bitcoin transactions without ever connecting to the internet 
        or your computer via USB. This "air-gapped" workflow uses PSBTs (Partially Signed 
        Bitcoin Transactions) transferred via QR codes or MicroSD cards.
      </p>

      <PSBTWorkflow />
    </motion.div>
  );
}

function AdvancedSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={styles.section}
    >
      <h2 className={styles.sectionTitle}>Advanced Security Features</h2>
      <p className={styles.sectionText}>
        The Coldcard Q includes powerful features for advanced users. These help protect 
        against physical threats, provide plausible deniability, and enable complex 
        security setups.
      </p>

      <AdvancedFeatures />
    </motion.div>
  );
}

export default ColdcardQLesson;
