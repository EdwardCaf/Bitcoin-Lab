import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Wallet,
  ArrowLeftRight,
  EyeOff,
  Key,
  Pickaxe,
  Blocks,
  Network,
  Zap,
  Droplets,
  Coins,
  ChevronRight,
  Clock
} from 'lucide-react';
import { Badge } from '../common';
import styles from './LearningPath.module.css';

// Branching tree structure:
// Foundation → Core Concepts → Protocol → Other Topics
const LEARNING_TREE = {
  foundation: [
    { 
      id: 'wallets', 
      title: 'Wallets & Addresses', 
      icon: Wallet, 
      path: '/lessons/wallets', 
      level: 1,
      description: 'Understand how Bitcoin wallets work, from private keys to address types and scripts.',
      difficulty: 'Beginner',
      duration: '15 min',
      topics: ['Private Keys', 'Address Types', 'Bitcoin Script', 'HD Wallets']
    },
    { 
      id: 'transactions', 
      title: 'Transactions', 
      icon: ArrowLeftRight, 
      path: '/lessons/transactions', 
      level: 1,
      description: 'Learn how Bitcoin moves from one wallet to another through inputs, outputs, and fees.',
      difficulty: 'Beginner',
      duration: '20 min',
      topics: ['UTXOs', 'Inputs & Outputs', 'Transaction Fees', 'Change Addresses']
    },
  ],
  core: [
    { 
      id: 'utxo-management', 
      title: 'UTXO Management', 
      icon: Coins, 
      path: '/lessons/utxo-management', 
      level: 2,
      description: 'Master the art of managing your Bitcoin UTXOs for optimal fees and privacy.',
      difficulty: 'Intermediate',
      duration: '20 min',
      topics: ['Consolidation', 'Coin Selection', 'Dust Management', 'Fee Optimization']
    },
    { 
      id: 'multisig', 
      title: 'Multi-Signature', 
      icon: Key, 
      path: '/lessons/multisig', 
      level: 2,
      description: 'Learn how multi-signature wallets enhance Bitcoin security with multiple keys.',
      difficulty: 'Intermediate',
      duration: '18 min',
      topics: ['M-of-N Setup', 'Key Management', 'Security Models', 'Best Practices']
    },
    { 
      id: 'privacy', 
      title: 'Privacy', 
      icon: EyeOff, 
      path: '/lessons/privacy', 
      level: 2,
      description: 'Explore Bitcoin privacy - how transactions can be traced and how to protect yourself.',
      difficulty: 'Intermediate',
      duration: '18 min',
      topics: ['Address Reuse', 'Chain Analysis', 'CoinJoin', 'Best Practices']
    },
  ],
  protocol: [
    { 
      id: 'blocks', 
      title: 'Blocks & Blockchain', 
      icon: Blocks, 
      path: '/lessons/blocks', 
      level: 3,
      description: 'Understand how blocks are structured and chained together to form an immutable ledger.',
      difficulty: 'Intermediate',
      duration: '18 min',
      topics: ['Block Structure', 'Merkle Trees', 'Chain of Hashes', 'Immutability']
    },
    { 
      id: 'mining', 
      title: 'Mining', 
      icon: Pickaxe, 
      path: '/lessons/mining', 
      level: 3,
      description: 'Discover how miners secure the network and create new Bitcoin through proof-of-work.',
      difficulty: 'Intermediate',
      duration: '20 min',
      topics: ['Hash Functions', 'Proof of Work', 'Difficulty', 'Block Rewards']
    },
    { 
      id: 'network', 
      title: 'Network & Nodes', 
      icon: Network, 
      path: '/lessons/network', 
      level: 3,
      description: 'Explore how Bitcoin\'s peer-to-peer network operates and reaches consensus.',
      difficulty: 'Intermediate',
      duration: '20 min',
      topics: ['Node Types', 'Transaction Propagation', 'Consensus Rules', 'Forks']
    },
  ],
  advanced: [
    { 
      id: 'lightning', 
      title: 'Lightning Network', 
      icon: Zap, 
      path: '/lessons/lightning', 
      level: 4,
      description: 'Learn how Lightning enables instant, low-fee Bitcoin payments through payment channels.',
      difficulty: 'Advanced',
      duration: '25 min',
      topics: ['Payment Channels', 'Routing', 'HTLCs', 'Invoices']
    },
    { 
      id: 'liquid', 
      title: 'Liquid Network', 
      icon: Droplets, 
      path: '/lessons/liquid', 
      level: 4,
      description: 'Explore Bitcoin\'s federated sidechain for fast settlement and confidential transactions.',
      difficulty: 'Advanced',
      duration: '22 min',
      topics: ['Peg-In/Out', 'Confidential TX', 'Issued Assets', 'Trade-offs']
    },
    { 
      id: 'ecash', 
      title: 'eCash (Cashu & Fedimint)', 
      icon: Coins, 
      path: '/lessons/ecash', 
      level: 4,
      description: 'Learn how Chaumian blind signatures enable perfect privacy with Bitcoin-backed tokens.',
      difficulty: 'Advanced',
      duration: '23 min',
      topics: ['Blind Signatures', 'Cashu Mints', 'Privacy', 'Federated Custody']
    },
  ],
};

const getDifficultyColor = (difficulty) => {
  switch (difficulty) {
    case 'Beginner':
      return 'success';
    case 'Intermediate':
      return 'warning';
    case 'Advanced':
      return 'error';
    default:
      return 'secondary';
  }
};

function LessonNode({ lesson, delay = 0 }) {
  const Icon = lesson.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ delay, duration: 0.4 }}
      className={styles.nodeWrapper}
    >
      <Link to={lesson.path} className={styles.node}>
        <div className={styles.nodeHeader}>
          <div className={styles.nodeIcon}>
            <Icon size={20} />
          </div>
          <div className={styles.nodeMeta}>
            <Badge 
              variant={getDifficultyColor(lesson.difficulty)} 
              size="small"
            >
              {lesson.difficulty}
            </Badge>
            <span className={styles.duration}>
              <Clock size={12} />
              {lesson.duration}
            </span>
          </div>
        </div>
        <div className={styles.nodeContent}>
          <span className={styles.nodeTitle}>{lesson.title}</span>
          <p className={styles.nodeDescription}>{lesson.description}</p>
          <div className={styles.nodeTopics}>
            {lesson.topics.map((topic) => (
              <span key={topic} className={styles.topic}>{topic}</span>
            ))}
          </div>
        </div>
        <div className={styles.nodeFooter}>
          <span className={styles.startLesson}>Start Lesson</span>
          <ChevronRight size={14} className={styles.nodeArrow} />
        </div>
      </Link>
    </motion.div>
  );
}

export function LearningPath() {
  return (
    <section id="learning-path" className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Your Learning Journey</h2>
        <p className={styles.subtitle}>
          Progress from Bitcoin basics to advanced topics through our structured curriculum
        </p>
      </div>

      <div className={styles.tree}>
        {/* Foundation Level */}
        <div className={styles.level}>
          <div className={styles.levelLabel}>
            <span className={styles.levelBadge}>Foundation</span>
          </div>
          <div className={styles.nodeContainer}>
            {LEARNING_TREE.foundation.map((lesson, index) => (
              <LessonNode key={lesson.id} lesson={lesson} delay={index * 0.1} />
            ))}
          </div>
        </div>

        {/* Connector */}
        <svg className={styles.connector} viewBox="0 0 100 50">
          <motion.path
            d="M 50 0 L 50 50"
            stroke="rgba(247, 147, 26, 0.3)"
            strokeWidth="2"
            fill="none"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          />
        </svg>

        {/* Core Level - Branching */}
        <div className={styles.level}>
          <div className={styles.levelLabel}>
            <span className={styles.levelBadge}>Core Concepts</span>
          </div>
          <div className={`${styles.nodeContainer} ${styles.branching}`}>
            {LEARNING_TREE.core.map((lesson, index) => (
              <LessonNode key={lesson.id} lesson={lesson} delay={0.3 + index * 0.1} />
            ))}
          </div>
        </div>

        {/* Connector - Converging branches */}
        <svg className={styles.connector} viewBox="0 0 300 80">
          <motion.path
            d="M 50 0 Q 100 40 150 80"
            stroke="rgba(247, 147, 26, 0.3)"
            strokeWidth="2"
            fill="none"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6 }}
          />
          <motion.path
            d="M 150 0 L 150 80"
            stroke="rgba(247, 147, 26, 0.3)"
            strokeWidth="2"
            fill="none"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6 }}
          />
          <motion.path
            d="M 250 0 Q 200 40 150 80"
            stroke="rgba(247, 147, 26, 0.3)"
            strokeWidth="2"
            fill="none"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6 }}
          />
        </svg>

        {/* Protocol Level */}
        <div className={styles.level}>
          <div className={styles.levelLabel}>
            <span className={styles.levelBadge}>Protocol</span>
          </div>
          <div className={styles.nodeContainer}>
            {LEARNING_TREE.protocol.map((lesson, index) => (
              <LessonNode key={lesson.id} lesson={lesson} delay={0.9 + index * 0.1} />
            ))}
          </div>
        </div>

        {/* Connector */}
        <svg className={styles.connector} viewBox="0 0 100 50">
          <motion.path
            d="M 50 0 L 50 50"
            stroke="rgba(247, 147, 26, 0.3)"
            strokeWidth="2"
            fill="none"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 1.1 }}
          />
        </svg>

        {/* Advanced Level */}
        <div className={styles.level}>
          <div className={styles.levelLabel}>
            <span className={styles.levelBadge}>Other / Advanced Topics</span>
          </div>
          <div className={styles.nodeContainer}>
            {LEARNING_TREE.advanced.map((lesson, index) => (
              <LessonNode key={lesson.id} lesson={lesson} delay={1.3 + index * 0.1} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default LearningPath;
