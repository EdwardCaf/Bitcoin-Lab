import { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, Zap, TrendingUp } from 'lucide-react';
import { Card } from '../../common';
import styles from './FeeVisualizer.module.css';

// Fee priority configurations
const PRIORITIES = {
  high: {
    label: 'High Priority',
    feeRate: '50+ sat/vB',
    time: '~10 minutes',
    blocks: '1-2 blocks',
    position: 'front', // front of queue
    color: 'var(--success)',
    description: 'Your transaction jumps to the front of the queue and gets included in the next block.',
  },
  medium: {
    label: 'Medium Priority',
    feeRate: '20-50 sat/vB',
    time: '~30 minutes',
    blocks: '2-3 blocks',
    position: 'middle',
    color: 'var(--warning)',
    description: 'Your transaction waits behind higher-fee transactions but confirms within a few blocks.',
  },
  low: {
    label: 'Low Priority',
    feeRate: '1-20 sat/vB',
    time: '1+ hours',
    blocks: '6+ blocks',
    position: 'back',
    color: 'var(--error)',
    description: 'Your transaction waits at the back of the queue. It may take a while to confirm.',
  },
};

// Generate static mempool transactions for visualization
function generateMempoolTxs() {
  const txs = [];
  
  // High fee transactions (positions 1-8)
  for (let i = 0; i < 8; i++) {
    txs.push({
      id: `high-${i}`,
      feeRate: Math.floor(Math.random() * 30) + 50,
      tier: 'high',
    });
  }
  
  // Medium fee transactions (positions 9-20)
  for (let i = 0; i < 12; i++) {
    txs.push({
      id: `med-${i}`,
      feeRate: Math.floor(Math.random() * 30) + 20,
      tier: 'medium',
    });
  }
  
  // Low fee transactions (positions 21-40)
  for (let i = 0; i < 20; i++) {
    txs.push({
      id: `low-${i}`,
      feeRate: Math.floor(Math.random() * 19) + 1,
      tier: 'low',
    });
  }
  
  return txs.sort((a, b) => b.feeRate - a.feeRate);
}

const MEMPOOL_TXS = generateMempoolTxs();

export function FeeVisualizer() {
  const [selectedPriority, setSelectedPriority] = useState('medium');
  
  const priority = PRIORITIES[selectedPriority];
  
  // Calculate user position based on priority
  const getUserPosition = () => {
    if (selectedPriority === 'high') return 3; // Near the front
    if (selectedPriority === 'medium') return 15; // Middle
    return 32; // Back of the queue
  };
  
  const userPosition = getUserPosition();

  return (
    <div className={styles.container}>
      <Card variant="elevated" padding="large">
        <h3 className={styles.title}>How Fees Affect Confirmation Time</h3>
        <p className={styles.description}>
          Select a fee priority to see where your transaction would be in the mempool queue.
        </p>

        {/* Priority Toggle Buttons */}
        <div className={styles.priorityButtons}>
          {Object.entries(PRIORITIES).map(([key, config]) => (
            <button
              key={key}
              className={`${styles.priorityButton} ${selectedPriority === key ? styles.selected : ''}`}
              onClick={() => setSelectedPriority(key)}
              style={{
                '--priority-color': config.color,
              }}
            >
              <span className={styles.priorityLabel}>{config.label}</span>
              <span className={styles.priorityFee}>{config.feeRate}</span>
            </button>
          ))}
        </div>

        {/* Status Cards */}
        <div className={styles.statusGrid}>
          <div className={styles.statusCard}>
            <div className={styles.statusIcon} style={{ background: `${priority.color}20`, color: priority.color }}>
              <TrendingUp size={20} />
            </div>
            <div className={styles.statusInfo}>
              <span className={styles.statusLabel}>Queue Position</span>
              <span className={styles.statusValue}>#{userPosition} of 40</span>
            </div>
          </div>
          
          <div className={styles.statusCard}>
            <div className={styles.statusIcon} style={{ background: `${priority.color}20`, color: priority.color }}>
              <Clock size={20} />
            </div>
            <div className={styles.statusInfo}>
              <span className={styles.statusLabel}>Est. Confirmation</span>
              <span className={styles.statusValue}>{priority.time}</span>
            </div>
          </div>
          
          <div className={styles.statusCard}>
            <div className={styles.statusIcon} style={{ background: `${priority.color}20`, color: priority.color }}>
              <Zap size={20} />
            </div>
            <div className={styles.statusInfo}>
              <span className={styles.statusLabel}>Blocks to Wait</span>
              <span className={styles.statusValue}>{priority.blocks}</span>
            </div>
          </div>
        </div>

        {/* Explanation */}
        <motion.div 
          className={styles.explanation}
          key={selectedPriority}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ borderColor: priority.color }}
        >
          <p>{priority.description}</p>
        </motion.div>

        {/* Mempool Visualization */}
        <div className={styles.mempoolSection}>
          <div className={styles.mempoolHeader}>
            <h4>Mempool Queue</h4>
            <span className={styles.mempoolNote}>Sorted by fee rate (highest first)</span>
          </div>
          
          <div className={styles.mempoolViz}>
            {/* Block zones */}
            <div className={styles.blockZones}>
              <div className={styles.blockZone} data-block="1">
                <span>Block 1</span>
              </div>
              <div className={styles.blockZone} data-block="2">
                <span>Block 2</span>
              </div>
              <div className={styles.blockZone} data-block="3">
                <span>Block 3+</span>
              </div>
            </div>
            
            <div className={styles.txList}>
              {MEMPOOL_TXS.map((tx, index) => {
                const isUserPosition = index === userPosition - 1;
                
                return (
                  <motion.div
                    key={tx.id}
                    className={`${styles.txItem} ${styles[tx.tier]} ${isUserPosition ? styles.userTx : ''}`}
                    initial={false}
                    animate={{
                      scale: isUserPosition ? 1.05 : 1,
                      zIndex: isUserPosition ? 10 : 1,
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    {isUserPosition && (
                      <motion.span 
                        className={styles.youLabel}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        key={selectedPriority}
                      >
                        YOUR TX
                      </motion.span>
                    )}
                    <span className={styles.txFee}>{tx.feeRate}</span>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </Card>

      {/* Legend */}
      <div className={styles.legend}>
        <div className={styles.legendItem}>
          <div className={`${styles.legendColor} ${styles.legendHigh}`} />
          <span>High fee (50+ sat/vB)</span>
        </div>
        <div className={styles.legendItem}>
          <div className={`${styles.legendColor} ${styles.legendMedium}`} />
          <span>Medium fee (20-50 sat/vB)</span>
        </div>
        <div className={styles.legendItem}>
          <div className={`${styles.legendColor} ${styles.legendLow}`} />
          <span>Low fee (1-20 sat/vB)</span>
        </div>
      </div>
    </div>
  );
}

export default FeeVisualizer;
