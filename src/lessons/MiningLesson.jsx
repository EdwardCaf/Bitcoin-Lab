import { useState } from 'react';
import { motion } from 'framer-motion';
import { Pickaxe, Hash, Target, Coins } from 'lucide-react';
import { LessonLayout } from '../components/layout';
import { Card, Accordion } from '../components/common';
import { HashPlayground, NonceFinder, HalvingTimeline } from '../components/lessons/mining';
import styles from './Lessons.module.css';

const sections = [
  { id: 'intro', title: 'Introduction' },
  { id: 'hashing', title: 'Hash Functions' },
  { id: 'puzzle', title: 'The Mining Puzzle' },
  { id: 'rewards', title: 'Block Rewards' }
];

export function MiningLesson() {
  const [currentSection, setCurrentSection] = useState(0);

  const renderSection = () => {
    switch (currentSection) {
      case 0:
        return <IntroSection />;
      case 1:
        return <HashingSection />;
      case 2:
        return <PuzzleSection />;
      case 3:
        return <RewardsSection />;
      default:
        return <IntroSection />;
    }
  };

  return (
    <LessonLayout
      lessonId="mining"
      title="Mining"
      description="Discover how miners secure the network and create new Bitcoin"
      icon={Pickaxe}
      sections={sections}
      currentSection={currentSection}
      onSectionChange={setCurrentSection}
      prevLesson={{ path: '/lessons/multisig', title: 'Multi-Signature' }}
      nextLesson={{ path: '/lessons/blocks', title: 'Blocks' }}
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
          <Pickaxe size={48} />
        </div>
        <h2 className={styles.heroTitle}>What is Bitcoin Mining?</h2>
        <p className={styles.heroText}>
          Mining is how new Bitcoin is created and how transactions get confirmed. 
          Think of miners as the accountants of the Bitcoin network, competing to 
          write the next page in Bitcoin's ledger.
        </p>
      </div>

      <div className={styles.conceptGrid}>
        <Card padding="large" hover>
          <div className={styles.conceptIcon}>
            <Hash size={24} />
          </div>
          <h3>Finding the Nonce</h3>
          <p>
            Miners compete to find a number (nonce) that produces a valid hash. 
            The first to find it wins the right to add a new block.
          </p>
        </Card>

        <Card padding="large" hover>
          <div className={styles.conceptIcon}>
            <Target size={24} />
          </div>
          <h3>Proof of Work</h3>
          <p>
            Finding a valid nonce requires computational work, proving the miner 
            invested real resources. This secures the network.
          </p>
        </Card>

        <Card padding="large" hover>
          <div className={styles.conceptIcon}>
            <Coins size={24} />
          </div>
          <h3>Block Rewards</h3>
          <p>
            The winning miner earns newly created Bitcoin plus transaction fees 
            from all transactions in the block.
          </p>
        </Card>
      </div>

      <Accordion title="Analogy: The Global Lottery" defaultOpen>
        <p>
          Imagine a global lottery that happens every 10 minutes. To enter, you must 
          show proof that you did a lot of work (found a valid nonce). The winner gets 
          to record the latest transactions and receives a reward.
        </p>
        <p>
          The more computing power you have, the more "lottery tickets" you can buy. 
          But the lottery is designed so that on average, someone wins every 10 minutes, 
          no matter how many people are playing.
        </p>
      </Accordion>

      <div className={styles.factBox}>
        <h4>Mining by the Numbers</h4>
        <div className={styles.factGrid}>
          <div className={styles.fact}>
            <span className={styles.factValue}>~10 min</span>
            <span className={styles.factLabel}>Average block time</span>
          </div>
          <div className={styles.fact}>
            <span className={styles.factValue}>3.125 BTC</span>
            <span className={styles.factLabel}>Current block reward</span>
          </div>
          <div className={styles.fact}>
            <span className={styles.factValue}>~900 EH/s</span>
            <span className={styles.factLabel}>Network hash rate</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function HashingSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={styles.section}
    >
      <h2 className={styles.sectionTitle}>Understanding Hash Functions</h2>
      <p className={styles.sectionText}>
        At the heart of Bitcoin mining is the <strong>SHA-256 hash function</strong>. 
        A hash function is like a fingerprint machine - put anything in, get a unique 
        "fingerprint" out. Even tiny changes create completely different results.
      </p>

      <HashPlayground />
    </motion.div>
  );
}

function PuzzleSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={styles.section}
    >
      <h2 className={styles.sectionTitle}>The Mining Puzzle</h2>
      <p className={styles.sectionText}>
        Miners must find a hash that starts with a certain number of zeros (Difficulty target). The only 
        way to do this is to keep trying different numbers (called a "nonce") until 
        one works. It's pure trial and error!
      </p>

      <NonceFinder />
    </motion.div>
  );
}

function RewardsSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={styles.section}
    >
      <h2 className={styles.sectionTitle}>Block Rewards & The Halving</h2>
      <p className={styles.sectionText}>
        When a miner finds a valid block, they earn newly created Bitcoin. This reward 
        gets cut in half every 210,000 blocks (~4 years), making Bitcoin increasingly scarce.
      </p>

      <HalvingTimeline />
    </motion.div>
  );
}

export default MiningLesson;
