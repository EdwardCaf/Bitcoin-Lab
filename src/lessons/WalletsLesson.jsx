import { useState } from 'react';
import { motion } from 'framer-motion';
import { Wallet, Key, Hash, Code, Grid3X3, Shield } from 'lucide-react';
import { LessonLayout } from '../components/layout';
import { Card, Accordion } from '../components/common';
import { KeyPairGenerator, AddressTypeExplorer, ScriptVisualizer, SeedPhraseDemo, WalletTypesExplorer } from '../components/lessons/wallets';
import styles from './Lessons.module.css';

const sections = [
  { id: 'intro', title: 'Introduction' },
  { id: 'keys', title: 'Keys & Addresses' },
  { id: 'types', title: 'Address Types' },
  { id: 'scripts', title: 'Bitcoin Script' },
  { id: 'hd', title: 'HD Wallets & Seeds' },
  { id: 'wallet-types', title: 'Hot vs Cold Wallets' }
];

export function WalletsLesson() {
  const [currentSection, setCurrentSection] = useState(0);

  const renderSection = () => {
    switch (currentSection) {
      case 0:
        return <IntroSection />;
      case 1:
        return <KeysSection />;
      case 2:
        return <AddressTypesSection />;
      case 3:
        return <ScriptsSection />;
      case 4:
        return <HDWalletsSection />;
      case 5:
        return <WalletTypesSection />;
      default:
        return <IntroSection />;
    }
  };

  return (
    <LessonLayout
      lessonId="wallets"
      title="Wallets & Addresses"
      description="Understand how Bitcoin wallets work, from private keys to seed phrases"
      icon={Wallet}
      sections={sections}
      currentSection={currentSection}
      onSectionChange={setCurrentSection}
      nextLesson={{ path: '/lessons/transactions', title: 'Transactions' }}
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
          <Wallet size={48} />
        </div>
        <h2 className={styles.heroTitle}>What is a Bitcoin Wallet?</h2>
        <p className={styles.heroText}>
          A Bitcoin wallet doesn't actually store Bitcoin - it stores the cryptographic 
          keys that prove you own Bitcoin on the blockchain. Think of it as a keychain 
          rather than a physical wallet.
        </p>
      </div>

      <div className={styles.conceptGrid}>
        <Card padding="large" hover>
          <div className={styles.conceptIcon}>
            <Key size={24} />
          </div>
          <h3>Private Keys</h3>
          <p>
            A secret number that proves ownership. Anyone with your private key 
            can spend your Bitcoin. Keep it safe!
          </p>
        </Card>

        <Card padding="large" hover>
          <div className={styles.conceptIcon}>
            <Hash size={24} />
          </div>
          <h3>Addresses</h3>
          <p>
            Derived from your public key, addresses are what you share with others 
            to receive Bitcoin. Like an email address for money.
          </p>
        </Card>

        <Card padding="large" hover>
          <div className={styles.conceptIcon}>
            <Grid3X3 size={24} />
          </div>
          <h3>Seed Phrases</h3>
          <p>
            12-24 words that can recover all your keys. One backup protects 
            unlimited addresses. Write it down, keep it safe.
          </p>
        </Card>
      </div>

      <Accordion title="Analogy: Your Bitcoin Keychain" defaultOpen>
        <p>
          Imagine a special keychain where each key can only open one specific 
          mailbox. People can drop money into your mailbox (your address), but 
          only you can open it with your key (private key).
        </p>
        <p>
          A seed phrase is like a master blueprint that can recreate all your keys. 
          If you lose all your keys but have the blueprint, you can make new copies 
          and still access all your mailboxes.
        </p>
        <p>
          Unlike a physical wallet, you can have the same "wallet" on multiple 
          devices - they all just hold copies of your keys.
        </p>
      </Accordion>

      <div className={styles.factBox}>
        <h4>Wallet Security</h4>
        <div className={styles.factGrid}>
          <div className={styles.fact}>
            <span className={styles.factValue}>256-bit</span>
            <span className={styles.factLabel}>Private key security</span>
          </div>
          <div className={styles.fact}>
            <span className={styles.factValue}>2^256</span>
            <span className={styles.factLabel}>Possible keys</span>
          </div>
          <div className={styles.fact}>
            <span className={styles.factValue}>12+ words</span>
            <span className={styles.factLabel}>Seed phrase backup</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function KeysSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={styles.section}
    >
      <h2 className={styles.sectionTitle}>Private Keys, Public Keys & Addresses</h2>
      <p className={styles.sectionText}>
        Every Bitcoin address starts with a private key - a random 256-bit number. 
        Through cryptographic magic, this creates a public key, which is then hashed 
        to create your address. The math works one way only: you can't reverse-engineer 
        a private key from an address.
      </p>

      <KeyPairGenerator />
    </motion.div>
  );
}

function AddressTypesSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={styles.section}
    >
      <h2 className={styles.sectionTitle}>Bitcoin Address Types</h2>
      <p className={styles.sectionText}>
        Over the years, Bitcoin has evolved with different address formats. Each type 
        offers different tradeoffs in fees, features, and compatibility. The prefix 
        tells you what type of address you're looking at.
      </p>

      <AddressTypeExplorer />
    </motion.div>
  );
}

function ScriptsSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={styles.section}
    >
      <h2 className={styles.sectionTitle}>Bitcoin Script: The Spending Rules</h2>
      <p className={styles.sectionText}>
        When you send Bitcoin, you're not just transferring coins - you're creating 
        a puzzle (script) that must be solved to spend them. Most scripts simply 
        require a valid signature, but Bitcoin can do much more: multisig, timelocks, 
        and smart contracts.
      </p>

      <ScriptVisualizer />
    </motion.div>
  );
}

function HDWalletsSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={styles.section}
    >
      <h2 className={styles.sectionTitle}>HD Wallets & Seed Phrases</h2>
      <p className={styles.sectionText}>
        Modern wallets use <strong>Hierarchical Deterministic (HD)</strong> key generation. 
        This means one seed phrase can generate billions of addresses. You only need to 
        back up 12-24 words, and you can recover everything.
      </p>

      <SeedPhraseDemo />
    </motion.div>
  );
}

function WalletTypesSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={styles.section}
    >
      <h2 className={styles.sectionTitle}>Hot vs Cold Wallets</h2>
      <p className={styles.sectionText}>
        Not all wallets are created equal when it comes to security. <strong>Hot wallets</strong> are 
        connected to the internet for convenience, while <strong>cold wallets</strong> stay offline 
        for maximum security. Understanding the difference is crucial for protecting your Bitcoin.
      </p>

      <WalletTypesExplorer />
    </motion.div>
  );
}

export default WalletsLesson;
