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
  ChevronRight
} from 'lucide-react';
import styles from './LearningPath.module.css';

// Branching tree structure:
// Foundation → Core → Advanced
const LEARNING_TREE = {
  foundation: [
    { id: 'wallets', title: 'Wallets', icon: Wallet, path: '/lessons/wallets', level: 1 },
  ],
  core: [
    { id: 'transactions', title: 'Transactions', icon: ArrowLeftRight, path: '/lessons/transactions', level: 2 },
    { id: 'privacy', title: 'Privacy', icon: EyeOff, path: '/lessons/privacy', level: 2 },
    { id: 'mining', title: 'Mining', icon: Pickaxe, path: '/lessons/mining', level: 2 },
  ],
  blockchain: [
    { id: 'blocks', title: 'Blocks', icon: Blocks, path: '/lessons/blocks', level: 3 },
    { id: 'network', title: 'Network', icon: Network, path: '/lessons/network', level: 3 },
  ],
  advanced: [
    { id: 'lightning', title: 'Lightning', icon: Zap, path: '/lessons/lightning', level: 4 },
    { id: 'liquid', title: 'Liquid', icon: Droplets, path: '/lessons/liquid', level: 4 },
    { id: 'multisig', title: 'Multi-Signature', icon: Key, path: '/lessons/multisig', level: 4 },
  ],
};

function LessonNode({ lesson, delay = 0 }) {
  const Icon = lesson.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ delay, duration: 0.4 }}
    >
      <Link to={lesson.path} className={styles.node}>
        <div className={styles.nodeIcon}>
          <Icon size={20} />
        </div>
        <span className={styles.nodeTitle}>{lesson.title}</span>
        <ChevronRight size={14} className={styles.nodeArrow} />
      </Link>
    </motion.div>
  );
}

export function LearningPath() {
  return (
    <section className={styles.container}>
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

        {/* Blockchain Level */}
        <div className={styles.level}>
          <div className={styles.levelLabel}>
            <span className={styles.levelBadge}>The Blockchain</span>
          </div>
          <div className={styles.nodeContainer}>
            {LEARNING_TREE.blockchain.map((lesson, index) => (
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
            <span className={styles.levelBadge}>Advanced Topics</span>
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
