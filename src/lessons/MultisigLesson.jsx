import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Key, 
  Shield, 
  Users, 
  AlertTriangle,
  CheckCircle,
  Lock
} from 'lucide-react';
import { LessonLayout } from '../components/layout';
import { Card, Accordion } from '../components/common';
import { HowItWorks, ConfigurationExplorer, KeyManagement, BestPractices } from '../components/lessons/multisig';
import styles from './Lessons.module.css';

const sections = [
  { id: 'intro', title: 'Introduction' },
  { id: 'how-it-works', title: 'How It Works' },
  { id: 'configurations', title: 'Configurations' },
  { id: 'key-management', title: 'Key Management' },
  { id: 'best-practices', title: 'Best Practices' }
];

export function MultisigLesson() {
  const [currentSection, setCurrentSection] = useState(0);

  const renderSection = () => {
    switch (currentSection) {
      case 0:
        return <IntroSection />;
      case 1:
        return <HowItWorksSection />;
      case 2:
        return <ConfigurationsSection />;
      case 3:
        return <KeyManagementSection />;
      case 4:
        return <BestPracticesSection />;
      default:
        return <IntroSection />;
    }
  };

  return (
    <LessonLayout
      lessonId="multisig"
      title="Multi-Signature"
      description="Learn how multi-signature wallets eliminate single points of failure"
      icon={Key}
      sections={sections}
      currentSection={currentSection}
      onSectionChange={setCurrentSection}
      prevLesson={{ path: '/lessons/privacy', title: 'Privacy' }}
      nextLesson={{ path: '/lessons/mining', title: 'Mining' }}
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
          <Key size={48} />
        </div>
        <h2 className={styles.heroTitle}>Multi-Signature Security</h2>
        <p className={styles.heroText}>
          Multi-signature (multisig) wallets require multiple keys to authorize a transaction. 
          Instead of trusting a single key, you distribute control across multiple devices, 
          locations, or people - eliminating single points of failure.
        </p>
      </div>

      <div className={styles.conceptGrid}>
        <Card padding="large" hover>
          <div className={styles.conceptIcon}>
            <Shield size={24} />
          </div>
          <h3>No Single Point of Failure</h3>
          <p>
            Lose one key? Still access your funds. One key compromised? Your Bitcoin 
            remains safe. Multisig eliminates the "one key to lose it all" problem.
          </p>
        </Card>

        <Card padding="large" hover>
          <div className={styles.conceptIcon}>
            <Users size={24} />
          </div>
          <h3>Shared Control</h3>
          <p>
            Multiple parties must agree to spend. Perfect for businesses, families, or 
            organizations where no single person should have unilateral control.
          </p>
        </Card>

        <Card padding="large" hover>
          <div className={styles.conceptIcon}>
            <Lock size={24} />
          </div>
          <h3>Inheritance Planning</h3>
          <p>
            Distribute keys to heirs and trustees. If you become unavailable, the required 
            threshold of keyholders can still access and manage the funds.
          </p>
        </Card>
      </div>

      <Accordion title="Single-Sig vs Multi-Sig: An Analogy" defaultOpen>
        <p>
          Think of <strong>single-signature</strong> like a home safe with one key. Whoever 
          has that key has complete access. If you lose the key, you're locked out forever. 
          If someone steals it, they take everything.
        </p>
        <p>
          <strong>Multi-signature</strong> is like a bank vault that requires two of three 
          bank officers to open. No single officer can access the vault alone. If one loses 
          their key, the other two can still open it. If one goes rogue, they can't steal 
          anything without convincing another officer.
        </p>
        <p>
          The most common configuration is <strong>2-of-3</strong>: you create three keys, 
          and any two are needed to spend. One key can be at home, one in a bank safe, one 
          with a trusted family member in another city. Lose any one, and you're still fine.
        </p>
      </Accordion>

      <Card variant="gradient" padding="large" style={{ marginTop: 'var(--spacing-lg)' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--spacing-md)' }}>
          <AlertTriangle size={24} style={{ color: 'var(--warning)', flexShrink: 0 }} />
          <div>
            <h4 style={{ margin: '0 0 var(--spacing-sm)', color: 'var(--text-primary)' }}>
              When is Multisig Worth It?
            </h4>
            <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', lineHeight: 1.6 }}>
              Multisig adds complexity. For small amounts you're learning with, a single 
              hardware wallet is simpler and sufficient. Consider multisig when the value 
              justifies the extra security, typically above $10,000-$50,000, or when you 
              need shared control for business or family purposes.
            </p>
          </div>
        </div>
      </Card>

      <div className={styles.factBox}>
        <h4>Multisig at a Glance</h4>
        <div className={styles.factGrid}>
          <div className={styles.fact}>
            <span className={styles.factValue}>2-of-3</span>
            <span className={styles.factLabel}>Most Popular Config</span>
          </div>
          <div className={styles.fact}>
            <span className={styles.factValue}>20</span>
            <span className={styles.factLabel}>Max Keys (Native Segwit limit)</span>
          </div>
          <div className={styles.fact}>
            <span className={styles.factValue}>2012</span>
            <span className={styles.factLabel}>BIP-11 Introduced</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function HowItWorksSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={styles.section}
    >
      <h2 className={styles.sectionTitle}>How Multi-Signature Works</h2>
      <p className={styles.sectionText}>
        In a multisig wallet, spending requires a threshold of signatures from a set of keys. 
        This is expressed as "M-of-N" - where M signatures are needed from N total keys. 
        Explore the interactive visualizations below to understand the mechanics.
      </p>

      <HowItWorks />
    </motion.div>
  );
}

function ConfigurationsSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={styles.section}
    >
      <h2 className={styles.sectionTitle}>Common Configurations</h2>
      <p className={styles.sectionText}>
        Different M-of-N configurations serve different purposes. A 2-of-3 balances security 
        with usability, while a 3-of-5 provides more redundancy for high-value holdings. 
        Explore the options to find what fits your situation.
      </p>

      <ConfigurationExplorer />
    </motion.div>
  );
}

function KeyManagementSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={styles.section}
    >
      <h2 className={styles.sectionTitle}>Managing Your Keys</h2>
      <p className={styles.sectionText}>
        How you store and manage your keys is just as important as the multisig configuration 
        itself. Learn about different key holder types, geographic distribution strategies, 
        coordinator software options, and collaborative custody providers.
      </p>

      <KeyManagement />
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
      <h2 className={styles.sectionTitle}>Best Practices</h2>
      <p className={styles.sectionText}>
        Multisig is powerful, but it's easy to make mistakes that can lock you out of your 
        own funds. Follow these best practices to maximize security while maintaining access.
      </p>

      <BestPractices />
    </motion.div>
  );
}

export default MultisigLesson;
