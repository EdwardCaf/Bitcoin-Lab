import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  GitBranch, 
  FileText, 
  Hash
} from 'lucide-react';
import { Card, Accordion } from '../../common';
import styles from './MerkleTreeVisualizer.module.css';

// Simple hash for demo (synchronous)
function simpleHash(input) {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16).padStart(8, '0');
}

function buildMerkleTree(transactions) {
  if (transactions.length === 0) return { levels: [], root: null };
  
  // Hash each transaction
  let currentLevel = transactions.map(tx => ({
    label: tx.label,
    hash: simpleHash(tx.data),
    isLeaf: true
  }));
  
  const levels = [currentLevel];
  
  // Build tree upwards
  while (currentLevel.length > 1) {
    const nextLevel = [];
    
    for (let i = 0; i < currentLevel.length; i += 2) {
      const left = currentLevel[i];
      const right = currentLevel[i + 1] || currentLevel[i]; // Duplicate if odd
      
      const combinedHash = simpleHash(left.hash + right.hash);
      nextLevel.push({
        label: `${left.label}+${right.label}`,
        hash: combinedHash,
        leftChild: left,
        rightChild: right,
        isLeaf: false
      });
    }
    
    levels.push(nextLevel);
    currentLevel = nextLevel;
  }
  
  return { 
    levels, 
    root: currentLevel[0] 
  };
}

function TreeNode({ node, level, isHighlighted, delay = 0 }) {
  return (
    <motion.div
      className={`${styles.node} ${node.isLeaf ? styles.leaf : ''} ${isHighlighted ? styles.highlighted : ''}`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: delay * 0.1, duration: 0.3 }}
    >
      <div className={styles.nodeIcon}>
        {node.isLeaf ? <FileText size={14} /> : <Hash size={14} />}
      </div>
      <div className={styles.nodeContent}>
        <span className={styles.nodeLabel}>{node.label}</span>
        <code className={styles.nodeHash}>{node.hash}</code>
      </div>
    </motion.div>
  );
}

const transactions = [
  { id: 1, label: 'Tx1', data: 'Alice sends 1 BTC to Bob' },
  { id: 2, label: 'Tx2', data: 'Bob sends 0.5 BTC to Charlie' },
  { id: 3, label: 'Tx3', data: 'Charlie sends 0.2 BTC to Dave' },
  { id: 4, label: 'Tx4', data: 'Dave sends 0.1 BTC to Eve' }
];

export function MerkleTreeVisualizer() {
  const tree = useMemo(() => buildMerkleTree(transactions), []);
  
  return (
    <div className={styles.container}>
      <Card variant="elevated" padding="large">
        <div className={styles.header}>
          <div className={styles.titleSection}>
            <div className={styles.iconWrapper}>
              <GitBranch size={24} />
            </div>
            <div>
              <h3 className={styles.title}>Merkle Tree Visualizer</h3>
              <p className={styles.subtitle}>
                See how transactions are hashed into a single root
              </p>
            </div>
          </div>
          
        </div>
        
        {/* Transactions List */}
        <div className={styles.transactionsList}>
          <label className={styles.listLabel}>Transactions in Block</label>
          <div className={styles.txGrid}>
            {transactions.map((tx) => (
              <div key={tx.id} className={styles.txItem}>
                <div className={styles.txInfo}>
                  <span className={styles.txLabel}>{tx.label}</span>
                  <span className={styles.txData}>{tx.data}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Tree Visualization */}
        <div className={styles.treeSection}>
          <label className={styles.listLabel}>Merkle Tree</label>
          <div className={styles.treeWrapper}>
            <div className={styles.tree}>
              {tree.levels.slice().reverse().map((level, levelIndex) => (
                <div key={levelIndex} className={styles.level}>
                  {level.map((node, nodeIndex) => (
                    <TreeNode
                      key={`${levelIndex}-${nodeIndex}`}
                      node={node}
                      level={levelIndex}
                      delay={levelIndex + nodeIndex}
                    />
                  ))}
                </div>
              ))}
            </div>
            
            {/* Connections */}
            <svg className={styles.connections} preserveAspectRatio="none">
              {/* Lines would be drawn here with JavaScript */}
            </svg>
          </div>
        </div>
        
        {/* Merkle Root */}
        {tree.root && (
          <div className={styles.rootSection}>
            <div className={styles.rootLabel}>
              <Hash size={16} />
              <span>Merkle Root</span>
            </div>
            <div className={styles.rootValue}>
              <code>{tree.root.hash}</code>
            </div>
            <p className={styles.rootNote}>
              This single hash represents all {transactions.length} transactions. 
              If any transaction changes, the root changes.
            </p>
          </div>
        )}
      </Card>
      
      {/* Benefits Card */}
      <div className={styles.benefitsGrid}>
        <Card padding="medium" className={styles.benefitCard}>
          <h4>Efficient Verification</h4>
          <p>
            To prove a transaction is in a block, you only need log(n) hashes 
            instead of all transactions.
          </p>
        </Card>
        <Card padding="medium" className={styles.benefitCard}>
          <h4>Tamper Detection</h4>
          <p>
            Changing any transaction changes the merkle root, making 
            tampering immediately detectable.
          </p>
        </Card>
        <Card padding="medium" className={styles.benefitCard}>
          <h4>Light Clients</h4>
          <p>
            SPV wallets can verify payments without downloading the 
            entire blockchain.
          </p>
        </Card>
      </div>
      
      <Accordion
        title="Deep Dive: Merkle Proofs"
        variant="deepdive"
        icon={<GitBranch size={16} />}
      >
        <p>
          A <strong>Merkle proof</strong> allows you to verify that a specific 
          transaction is included in a block without having all the transactions.
        </p>
        <p>For a block with 1000 transactions, you only need:</p>
        <ul>
          <li>The transaction you want to verify</li>
          <li>About 10 intermediate hashes (log₂1000 ≈ 10)</li>
          <li>The merkle root (from the block header)</li>
        </ul>
        <p>
          This is how lightweight wallets (SPV) can verify transactions 
          without downloading the entire 800+ GB blockchain.
        </p>
      </Accordion>
    </div>
  );
}

export default MerkleTreeVisualizer;
