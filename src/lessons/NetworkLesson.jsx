import { useState } from 'react';
import { motion } from 'framer-motion';
import { Network, Server, Radio, GitFork, Shield } from 'lucide-react';
import { LessonLayout } from '../components/layout';
import { Card, Accordion } from '../components/common';
import { NetworkVisualizer, ConsensusDemo, NodeTypesExplorer, ForksVisualizer } from '../components/lessons/network';
import styles from './Lessons.module.css';

const sections = [
  { id: 'intro', title: 'Introduction' },
  { id: 'nodes', title: 'Node Types' },
  { id: 'propagation', title: 'Network Propagation' },
  { id: 'consensus', title: 'Consensus' },
  { id: 'forks', title: 'Hard & Soft Forks' }
];

export function NetworkLesson() {
  const [currentSection, setCurrentSection] = useState(0);

  const renderSection = () => {
    switch (currentSection) {
      case 0:
        return <IntroSection />;
      case 1:
        return <NodesSection />;
      case 2:
        return <PropagationSection />;
      case 3:
        return <ConsensusSection />;
      case 4:
        return <ForksSection />;
      default:
        return <IntroSection />;
    }
  };

  return (
    <LessonLayout
      lessonId="network"
      title="Network & Nodes"
      description="Explore Bitcoin's decentralized peer-to-peer network"
      icon={Network}
      sections={sections}
      currentSection={currentSection}
      onSectionChange={setCurrentSection}
      prevLesson={{ path: '/lessons/blocks', title: 'Blocks' }}
      nextLesson={{ path: '/lessons/lightning', title: 'Lightning Network' }}
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
          <Network size={48} />
        </div>
        <h2 className={styles.heroTitle}>The Bitcoin Network</h2>
        <p className={styles.heroText}>
          Bitcoin runs on a peer-to-peer network with no central server. 
          Thousands of nodes around the world work together to validate 
          transactions, share blocks, and maintain the same truth.
        </p>
      </div>

      <div className={styles.conceptGrid}>
        <Card padding="large" hover>
          <div className={styles.conceptIcon}>
            <Server size={24} />
          </div>
          <h3>Decentralized</h3>
          <p>
            No single point of failure. If some nodes go offline, the 
            network continues operating normally.
          </p>
        </Card>

        <Card padding="large" hover>
          <div className={styles.conceptIcon}>
            <Radio size={24} />
          </div>
          <h3>Peer-to-Peer</h3>
          <p>
            Nodes connect directly to each other, sharing transactions 
            and blocks without intermediaries.
          </p>
        </Card>

        <Card padding="large" hover>
          <div className={styles.conceptIcon}>
            <Shield size={24} />
          </div>
          <h3>Trustless</h3>
          <p>
            Nodes verify everything independently. You don't need to 
            trust any single participant.
          </p>
        </Card>
      </div>

      <Accordion title="Analogy: A Global Game of Telephone" defaultOpen>
        <p>
          Imagine a worldwide game of telephone, but one where every player 
          checks that messages are accurate before passing them on.
        </p>
        <p>
          When someone creates a Bitcoin transaction, they announce it to a few 
          nearby "players" (nodes). Those nodes verify it's valid, then pass 
          it to their neighbors, who do the same. Within seconds, the entire 
          network knows about the transaction.
        </p>
        <p>
          Unlike regular telephone, if someone tries to change the message 
          (fake transaction), the next player will catch the error and reject it.
        </p>
      </Accordion>

      <div className={styles.factBox}>
        <h4>Network Statistics</h4>
        <div className={styles.factGrid}>
          <div className={styles.fact}>
            <span className={styles.factValue}>~15,000</span>
            <span className={styles.factLabel}>Reachable nodes</span>
          </div>
          <div className={styles.fact}>
            <span className={styles.factValue}>~100</span>
            <span className={styles.factLabel}>Countries</span>
          </div>
          <div className={styles.fact}>
            <span className={styles.factValue}>&lt;1 sec</span>
            <span className={styles.factLabel}>Tx propagation time</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function NodesSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={styles.section}
    >
      <h2 className={styles.sectionTitle}>Types of Bitcoin Nodes</h2>
      <p className={styles.sectionText}>
        Not all nodes are equal. Different types serve different purposes, 
        from full validation to lightweight mobile access. Understanding 
        these differences is key to understanding Bitcoin's security model.
      </p>

      <NodeTypesExplorer />
    </motion.div>
  );
}

function PropagationSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={styles.section}
    >
      <h2 className={styles.sectionTitle}>Network Propagation</h2>
      <p className={styles.sectionText}>
        When a new transaction or block is created, it spreads across the 
        network through a gossip protocol. Each node tells its peers, who 
        tell their peers, until everyone knows.
      </p>

      <NetworkVisualizer />
    </motion.div>
  );
}

function ConsensusSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={styles.section}
    >
      <h2 className={styles.sectionTitle}>Reaching Consensus</h2>
      <p className={styles.sectionText}>
        How does a decentralized network agree on which transactions are valid? 
        Bitcoin uses the "longest chain" rule: nodes always follow the chain 
        with the most accumulated proof-of-work.
      </p>

      <ConsensusDemo />
    </motion.div>
  );
}

function ForksSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={styles.section}
    >
      <h2 className={styles.sectionTitle}>Hard Forks & Soft Forks</h2>
      <p className={styles.sectionText}>
        How does a decentralized network upgrade? Unlike traditional software, 
        Bitcoin has no central authority to push updates. Instead, the community 
        must coordinate changes through "forks" - modifications to the protocol rules.
      </p>

      <div className={styles.conceptGrid}>
        <Card padding="large" hover>
          <div className={styles.conceptIcon}>
            <GitFork size={24} style={{ transform: 'rotate(180deg)' }} />
          </div>
          <h3>Soft Fork</h3>
          <p>
            A backward-compatible upgrade. Old nodes still accept new blocks, 
            they just don't enforce the new rules. Think of it like adding 
            a new traffic law that only some police enforce.
          </p>
        </Card>

        <Card padding="large" hover>
          <div className={styles.conceptIcon}>
            <GitFork size={24} />
          </div>
          <h3>Hard Fork</h3>
          <p>
            A breaking change that old nodes reject. This creates a permanent 
            split into two separate cryptocurrencies. Like a road that splits 
            into two different destinations.
          </p>
        </Card>
      </div>

      <ForksVisualizer />
    </motion.div>
  );
}

export default NetworkLesson;
