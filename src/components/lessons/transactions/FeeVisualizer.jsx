import { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, Zap, TrendingUp, Box } from 'lucide-react';
import { Card } from '../../common';
import styles from './FeeVisualizer.module.css';

// Fee priority configurations
const PRIORITIES = {
  high: {
    label: 'High Priority',
    feeRate: '50+ sat/vB',
    time: '~10 minutes',
    targetBlock: 1,
    color: 'var(--success)',
    description: 'Your transaction jumps to the front of the queue and gets included in the next block.',
  },
  medium: {
    label: 'Medium Priority',
    feeRate: '20-50 sat/vB',
    time: '~30 minutes',
    targetBlock: 2,
    color: 'var(--warning)',
    description: 'Your transaction waits behind higher-fee transactions but confirms within a few blocks.',
  },
  low: {
    label: 'Low Priority',
    feeRate: '1-20 sat/vB',
    time: '1+ hours',
    targetBlock: 4,
    color: 'var(--error)',
    description: 'Your transaction waits at the back of the queue. It may take a while to confirm.',
  },
};

// Upcoming blocks with sample transactions
const UPCOMING_BLOCKS = [
  {
    id: 1,
    label: 'Next Block',
    subtitle: '~10 min',
    txCount: 4,
    feeRange: '50-80 sat/vB',
    tier: 'high',
  },
  {
    id: 2,
    label: 'Block +2',
    subtitle: '~20 min',
    txCount: 5,
    feeRange: '25-50 sat/vB',
    tier: 'medium',
  },
  {
    id: 3,
    label: 'Block +3',
    subtitle: '~30 min',
    txCount: 5,
    feeRange: '10-25 sat/vB',
    tier: 'medium',
  },
  {
    id: 4,
    label: 'Block +4+',
    subtitle: '1+ hour',
    txCount: 6,
    feeRange: '1-10 sat/vB',
    tier: 'low',
  },
];

export function FeeVisualizer() {
  const [selectedPriority, setSelectedPriority] = useState('medium');
  
  const priority = PRIORITIES[selectedPriority];
  const targetBlock = priority.targetBlock;

  return (
    <div className={styles.container}>
      <Card variant="elevated" padding="large">
        <h3 className={styles.title}>How Fees Affect Confirmation Time</h3>
        <p className={styles.description}>
          Select a fee priority to see which block your transaction will likely be included in.
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
              <Box size={20} />
            </div>
            <div className={styles.statusInfo}>
              <span className={styles.statusLabel}>Target Block</span>
              <span className={styles.statusValue}>
                {targetBlock === 1 ? 'Next Block' : `Block +${targetBlock}`}
              </span>
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
              <span className={styles.statusLabel}>Fee Rate</span>
              <span className={styles.statusValue}>{priority.feeRate}</span>
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

        {/* Blocks Visualization */}
        <div className={styles.blocksSection}>
          <div className={styles.blocksHeader}>
            <h4>Upcoming Blocks</h4>
            <span className={styles.blocksNote}>Higher fees = earlier block</span>
          </div>
          
          <div className={styles.blocksContainer}>
            {UPCOMING_BLOCKS.map((block) => {
              const isTarget = block.id === targetBlock || (targetBlock >= 4 && block.id === 4);
              const isPast = block.id < targetBlock;
              
              return (
                <motion.div
                  key={block.id}
                  className={`${styles.block} ${styles[block.tier]} ${isTarget ? styles.targetBlock : ''} ${isPast ? styles.pastBlock : ''}`}
                  initial={false}
                  animate={{
                    scale: isTarget ? 1.02 : 1,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <div className={styles.blockHeader}>
                    <span className={styles.blockLabel}>{block.label}</span>
                    <span className={styles.blockTime}>{block.subtitle}</span>
                  </div>
                  
                  <div className={styles.blockContent}>
                    {/* Sample transactions in block */}
                    <div className={styles.blockTxs}>
                      {Array.from({ length: block.txCount }).map((_, i) => (
                        <div 
                          key={i} 
                          className={`${styles.blockTx} ${isTarget && i === Math.floor(block.txCount / 2) ? styles.userTx : ''}`}
                        >
                          {isTarget && i === Math.floor(block.txCount / 2) && (
                            <motion.span
                              className={styles.youIndicator}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              key={selectedPriority}
                            >
                              YOU
                            </motion.span>
                          )}
                        </div>
                      ))}
                    </div>
                    
                    <div className={styles.blockFeeRange}>
                      {block.feeRange}
                    </div>
                  </div>

                  {isTarget && (
                    <motion.div 
                      className={styles.targetIndicator}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      key={`target-${selectedPriority}`}
                    >
                      Your TX Here
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Connection line / flow indicator */}
          <div className={styles.flowIndicator}>
            <span className={styles.flowArrow}>Mined first</span>
            <div className={styles.flowLine} />
            <span className={styles.flowArrow}>Mined later</span>
          </div>
        </div>
      </Card>

      {/* Legend */}
      <div className={styles.legend}>
        <div className={styles.legendItem}>
          <div className={`${styles.legendColor} ${styles.legendHigh}`} />
          <span>High priority</span>
        </div>
        <div className={styles.legendItem}>
          <div className={`${styles.legendColor} ${styles.legendMedium}`} />
          <span>Medium priority</span>
        </div>
        <div className={styles.legendItem}>
          <div className={`${styles.legendColor} ${styles.legendLow}`} />
          <span>Low priority</span>
        </div>
        <div className={styles.legendItem}>
          <div className={`${styles.legendColor} ${styles.legendUser}`} />
          <span>Your transaction</span>
        </div>
      </div>
    </div>
  );
}

export default FeeVisualizer;
