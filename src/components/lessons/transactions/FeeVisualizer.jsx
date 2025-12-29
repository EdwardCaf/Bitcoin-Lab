import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Zap, TrendingUp, Box } from 'lucide-react';
import { Card, Slider, Badge } from '../../common';
import styles from './FeeVisualizer.module.css';

// Generate mock mempool transactions
function generateMempoolTxs(count = 30) {
  const txs = [];
  for (let i = 0; i < count; i++) {
    txs.push({
      id: `tx-${i}`,
      feeRate: Math.floor(Math.random() * 80) + 1,
      size: Math.floor(Math.random() * 500) + 200,
    });
  }
  return txs.sort((a, b) => b.feeRate - a.feeRate);
}

export function FeeVisualizer() {
  const [userFeeRate, setUserFeeRate] = useState(25);
  const [mempoolTxs, setMempoolTxs] = useState(() => generateMempoolTxs());
  const [isMining, setIsMining] = useState(false);
  const [minedBlocks, setMinedBlocks] = useState(0);
  const miningInterval = useRef(null);

  // User's transaction
  const userTx = {
    id: 'user-tx',
    feeRate: userFeeRate,
    size: 250,
    isUser: true
  };

  // Combine and sort all transactions
  const allTxs = [...mempoolTxs, userTx].sort((a, b) => b.feeRate - a.feeRate);
  const userPosition = allTxs.findIndex(tx => tx.id === 'user-tx');
  
  // Estimate confirmation time based on position
  const getEstimatedTime = () => {
    if (userPosition < 10) return 'Next block (~10 min)';
    if (userPosition < 20) return '1-2 blocks (~20 min)';
    if (userPosition < 30) return '2-3 blocks (~30 min)';
    return '3+ blocks (~1 hour)';
  };

  const getPriorityLevel = () => {
    if (userFeeRate >= 50) return { label: 'High', color: 'success' };
    if (userFeeRate >= 20) return { label: 'Medium', color: 'warning' };
    return { label: 'Low', color: 'error' };
  };

  // Simulate mining
  useEffect(() => {
    if (isMining) {
      miningInterval.current = setInterval(() => {
        setMempoolTxs(prev => {
          // Remove top 10 transactions (they got mined)
          const remaining = prev.slice(10);
          // Add some new ones
          const newTxs = generateMempoolTxs(10);
          return [...remaining, ...newTxs].sort((a, b) => b.feeRate - a.feeRate);
        });
        setMinedBlocks(b => b + 1);
      }, 3000);
    }

    return () => {
      if (miningInterval.current) {
        clearInterval(miningInterval.current);
      }
    };
  }, [isMining]);

  const priority = getPriorityLevel();

  return (
    <div className={styles.container}>
      <Card variant="elevated" padding="large">
        <h3 className={styles.title}>Transaction Fee Simulator</h3>
        <p className={styles.description}>
          See how your fee affects your position in the mempool. Higher fees = faster confirmation.
        </p>

        {/* Fee Control */}
        <div className={styles.feeControl}>
          <Slider
            value={userFeeRate}
            onChange={setUserFeeRate}
            min={1}
            max={100}
            step={1}
            label="Your Fee Rate"
            formatValue={(v) => `${v} sat/vB`}
          />
          <div className={styles.feeLabels}>
            <span>Slow</span>
            <span>Fast</span>
          </div>
        </div>

        {/* Status Cards */}
        <div className={styles.statusGrid}>
          <div className={styles.statusCard}>
            <div className={styles.statusIcon}>
              <TrendingUp size={20} />
            </div>
            <div className={styles.statusInfo}>
              <span className={styles.statusLabel}>Queue Position</span>
              <span className={styles.statusValue}>#{userPosition + 1}</span>
            </div>
          </div>
          
          <div className={styles.statusCard}>
            <div className={styles.statusIcon}>
              <Clock size={20} />
            </div>
            <div className={styles.statusInfo}>
              <span className={styles.statusLabel}>Est. Confirmation</span>
              <span className={styles.statusValue}>{getEstimatedTime()}</span>
            </div>
          </div>
          
          <div className={styles.statusCard}>
            <div className={styles.statusIcon}>
              <Zap size={20} />
            </div>
            <div className={styles.statusInfo}>
              <span className={styles.statusLabel}>Priority</span>
              <Badge variant={priority.color} size="small">{priority.label}</Badge>
            </div>
          </div>
        </div>

        {/* Mempool Visualization */}
        <div className={styles.mempoolSection}>
          <div className={styles.mempoolHeader}>
            <h4>Mempool Queue</h4>
            <button
              className={`${styles.mineButton} ${isMining ? styles.mining : ''}`}
              onClick={() => setIsMining(!isMining)}
            >
              <Box size={16} />
              {isMining ? 'Stop Mining' : 'Simulate Mining'}
            </button>
          </div>
          
          <div className={styles.mempoolViz}>
            <div className={styles.nextBlockZone}>
              <span className={styles.zoneLabel}>Next Block</span>
            </div>
            
            <div className={styles.txList}>
              <AnimatePresence mode="popLayout">
                {allTxs.slice(0, 35).map((tx, index) => (
                  <motion.div
                    key={tx.id}
                    className={`${styles.txItem} ${tx.isUser ? styles.userTx : ''}`}
                    style={{
                      width: `${Math.max(20, tx.feeRate)}%`,
                    }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                    layout
                  >
                    {tx.isUser && (
                      <span className={styles.youLabel}>YOU</span>
                    )}
                    <span className={styles.txFee}>{tx.feeRate}</span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
          
          {minedBlocks > 0 && (
            <div className={styles.minedInfo}>
              <Box size={14} />
              <span>{minedBlocks} block{minedBlocks > 1 ? 's' : ''} mined</span>
            </div>
          )}
        </div>
      </Card>

      {/* Legend */}
      <div className={styles.legend}>
        <div className={styles.legendItem}>
          <div className={`${styles.legendColor} ${styles.legendUser}`} />
          <span>Your transaction</span>
        </div>
        <div className={styles.legendItem}>
          <div className={`${styles.legendColor} ${styles.legendOther}`} />
          <span>Other transactions</span>
        </div>
        <div className={styles.legendItem}>
          <span className={styles.legendNote}>Width = Fee rate (sat/vB)</span>
        </div>
      </div>
    </div>
  );
}

export default FeeVisualizer;
