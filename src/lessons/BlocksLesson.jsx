import { useState } from 'react';
import { motion } from 'framer-motion';
import { Blocks, Box, Shield, Link as LinkIcon } from 'lucide-react';
import { LessonLayout } from '../components/layout';
import { Card, Accordion } from '../components/common';
import { BlockExplorer, MerkleTreeVisualizer, ChainTamperDemo } from '../components/lessons/blocks';
import styles from './Lessons.module.css';

const sections = [
  { id: 'intro', title: 'Introduction' },
  { id: 'structure', title: 'Block Structure' },
  { id: 'merkle', title: 'Merkle Trees' },
  { id: 'immutability', title: 'Immutability' }
];

export function BlocksLesson() {
  const [currentSection, setCurrentSection] = useState(0);

  const renderSection = () => {
    switch (currentSection) {
      case 0:
        return <IntroSection />;
      case 1:
        return <StructureSection />;
      case 2:
        return <MerkleSection />;
      case 3:
        return <ImmutabilitySection />;
      default:
        return <IntroSection />;
    }
  };

  return (
    <LessonLayout
      lessonId="blocks"
      title="Blocks & Blockchain"
      description="Understand how blocks are structured and linked together"
      icon={Blocks}
      sections={sections}
      currentSection={currentSection}
      onSectionChange={setCurrentSection}
      prevLesson={{ path: '/lessons/mining', title: 'Mining' }}
      nextLesson={{ path: '/lessons/network', title: 'Network' }}
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
          <Blocks size={48} />
        </div>
        <h2 className={styles.heroTitle}>The Blockchain Structure</h2>
        <p className={styles.heroText}>
          A blockchain is exactly what it sounds like: a chain of blocks. Each block 
          contains transactions and is cryptographically linked to the previous one, 
          creating an immutable record of all Bitcoin transactions ever made.
        </p>
      </div>

      <div className={styles.conceptGrid}>
        <Card padding="large" hover>
          <div className={styles.conceptIcon}>
            <Box size={24} />
          </div>
          <h3>Blocks</h3>
          <p>
            Containers that hold a batch of transactions. A new block is added 
            roughly every 10 minutes.
          </p>
        </Card>

        <Card padding="large" hover>
          <div className={styles.conceptIcon}>
            <LinkIcon size={24} />
          </div>
          <h3>Hash Links</h3>
          <p>
            Each block contains the hash of the previous block, creating an 
            unbreakable chain back to the genesis block.
          </p>
        </Card>

        <Card padding="large" hover>
          <div className={styles.conceptIcon}>
            <Shield size={24} />
          </div>
          <h3>Immutability</h3>
          <p>
            Changing any past transaction would require redoing all subsequent 
            proof-of-work - computationally impossible.
          </p>
        </Card>
      </div>

      <Accordion title="Analogy: The World's Largest Ledger" defaultOpen>
        <p>
          Imagine a giant accounting ledger that's been running since January 3, 2009. 
          Every 10 minutes, a new page (block) is added with all the latest transactions.
        </p>
        <p>
          Each page is stamped with a unique fingerprint (hash) that includes the 
          fingerprint of the previous page. If anyone tries to alter a page from years 
          ago, all the fingerprints after it would change - immediately exposing the fraud.
        </p>
        <p>
          Over 800,000 pages later, this ledger records every bitcoin transaction ever 
          made, verified by thousands of computers worldwide.
        </p>
      </Accordion>

      <div className={styles.factBox}>
        <h4>Blockchain by the Numbers</h4>
        <div className={styles.factGrid}>
          <div className={styles.fact}>
            <span className={styles.factValue}>840,000+</span>
            <span className={styles.factLabel}>Blocks mined</span>
          </div>
          <div className={styles.fact}>
            <span className={styles.factValue}>~500 GB</span>
            <span className={styles.factLabel}>Full blockchain size</span>
          </div>
          <div className={styles.fact}>
            <span className={styles.factValue}>~3,000</span>
            <span className={styles.factLabel}>Transactions per block</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function StructureSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={styles.section}
    >
      <h2 className={styles.sectionTitle}>Exploring Block Structure</h2>
      <p className={styles.sectionText}>
        Each block has two main parts: the <strong>header</strong> (80 bytes of metadata) 
        and the <strong>body</strong> (list of transactions). The header is what gets 
        hashed during mining and links blocks together.
      </p>

      <BlockExplorer />
    </motion.div>
  );
}

function MerkleSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={styles.section}
    >
      <h2 className={styles.sectionTitle}>Merkle Trees</h2>
      <p className={styles.sectionText}>
        A Merkle tree efficiently summarizes all transactions in a block into a single 
        hash called the "Merkle root." This allows for efficient verification of 
        individual transactions without downloading the entire block.
      </p>

      <MerkleTreeVisualizer />
    </motion.div>
  );
}

function ImmutabilitySection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={styles.section}
    >
      <h2 className={styles.sectionTitle}>Blockchain Immutability</h2>
      <p className={styles.sectionText}>
        Once a block is added to the chain and buried under subsequent blocks, 
        changing it becomes practically impossible. Try editing a block below 
        to see what happens to the chain.
      </p>

      <ChainTamperDemo />
    </motion.div>
  );
}

export default BlocksLesson;
