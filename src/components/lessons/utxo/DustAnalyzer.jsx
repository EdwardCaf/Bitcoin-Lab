import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Coins, 
  AlertTriangle, 
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Lock,
  Unlock,
  Info,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { Card, Button, Accordion, Badge, Slider } from '../../common';
import { 
  generateManagementUTXOs, 
  classifyUTXO, 
  calculateDustThreshold,
  formatSats,
  INPUT_SIZE_VBYTES
} from '../../../utils/bitcoin';
import styles from './DustAnalyzer.module.css';

const FEE_SCENARIOS = [
  { rate: 5, label: 'Low Fees', description: 'Good time to spend small UTXOs' },
  { rate: 20, label: 'Normal Fees', description: 'Average network conditions' },
  { rate: 50, label: 'High Fees', description: 'Many small UTXOs become uneconomical' },
  { rate: 100, label: 'Very High Fees', description: 'Only large UTXOs worth spending' }
];

export function DustAnalyzer() {
  const [utxos] = useState(() => generateManagementUTXOs());
  const [feeRate, setFeeRate] = useState(20);
  const [showDetails, setShowDetails] = useState(null);

  const dustThreshold = useMemo(() => 
    calculateDustThreshold(feeRate),
    [feeRate]
  );

  const analyzedUtxos = useMemo(() => 
    utxos.map(utxo => ({
      ...utxo,
      classification: classifyUTXO(utxo.amount, feeRate),
      spendCost: INPUT_SIZE_VBYTES * feeRate,
      costRatio: (INPUT_SIZE_VBYTES * feeRate) / utxo.amount
    })).sort((a, b) => b.amount - a.amount),
    [utxos, feeRate]
  );

  const stats = useMemo(() => {
    const healthy = analyzedUtxos.filter(u => u.classification.status === 'healthy');
    const warning = analyzedUtxos.filter(u => u.classification.status === 'warning');
    const dust = analyzedUtxos.filter(u => u.classification.status === 'dust');
    
    const totalValue = analyzedUtxos.reduce((sum, u) => sum + u.amount, 0);
    const dustValue = dust.reduce((sum, u) => sum + u.amount, 0);
    const warningValue = warning.reduce((sum, u) => sum + u.amount, 0);
    const lockedValue = dustValue; // Dust is effectively "locked"
    
    return {
      healthy: healthy.length,
      warning: warning.length,
      dust: dust.length,
      total: analyzedUtxos.length,
      totalValue,
      dustValue,
      warningValue,
      lockedValue,
      healthyPercent: Math.round((healthy.length / analyzedUtxos.length) * 100)
    };
  }, [analyzedUtxos]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'healthy': return <CheckCircle2 size={16} />;
      case 'warning': return <AlertCircle size={16} />;
      case 'dust': return <AlertTriangle size={16} />;
      default: return <Coins size={16} />;
    }
  };

  return (
    <div className={styles.container}>
      <Card variant="elevated" padding="large">
        <div className={styles.header}>
          <div className={styles.titleSection}>
            <div className={styles.iconWrapper}>
              <Sparkles size={24} />
            </div>
            <div>
              <h3 className={styles.title}>Dust Analyzer</h3>
              <p className={styles.subtitle}>See which UTXOs are economical to spend at different fee rates</p>
            </div>
          </div>
        </div>

        {/* Fee Rate Scenarios */}
        <div className={styles.feeSection}>
          <div className={styles.feeSectionHeader}>
            <span className={styles.feeLabel}>Fee Environment</span>
            <span className={styles.currentRate}>{feeRate} sat/vB</span>
          </div>
          
          <div className={styles.scenarioButtons}>
            {FEE_SCENARIOS.map(scenario => (
              <button
                key={scenario.rate}
                className={`${styles.scenarioBtn} ${feeRate === scenario.rate ? styles.active : ''}`}
                onClick={() => setFeeRate(scenario.rate)}
              >
                <span className={styles.scenarioLabel}>{scenario.label}</span>
                <span className={styles.scenarioRate}>{scenario.rate} sat/vB</span>
              </button>
            ))}
          </div>

          <Slider
            min={1}
            max={150}
            value={feeRate}
            onChange={setFeeRate}
          />

          <div className={styles.dustThresholdInfo}>
            <Info size={14} />
            <span>
              Dust threshold at {feeRate} sat/vB: <strong>{formatSats(dustThreshold)}</strong>
              {' '}(UTXOs below this cost more to spend than they're worth)
            </span>
          </div>
        </div>

        {/* Summary Stats */}
        <div className={styles.statsGrid}>
          <div className={`${styles.statCard} ${styles.healthy}`}>
            <div className={styles.statIcon}>
              <CheckCircle2 size={20} />
            </div>
            <div className={styles.statInfo}>
              <span className={styles.statValue}>{stats.healthy}</span>
              <span className={styles.statLabel}>Healthy UTXOs</span>
            </div>
          </div>
          
          <div className={`${styles.statCard} ${styles.warning}`}>
            <div className={styles.statIcon}>
              <AlertCircle size={20} />
            </div>
            <div className={styles.statInfo}>
              <span className={styles.statValue}>{stats.warning}</span>
              <span className={styles.statLabel}>Inefficient UTXOs</span>
            </div>
          </div>
          
          <div className={`${styles.statCard} ${styles.dust}`}>
            <div className={styles.statIcon}>
              <AlertTriangle size={20} />
            </div>
            <div className={styles.statInfo}>
              <span className={styles.statValue}>{stats.dust}</span>
              <span className={styles.statLabel}>Dust UTXOs</span>
            </div>
          </div>
          
          <div className={`${styles.statCard} ${styles.locked}`}>
            <div className={styles.statIcon}>
              <Lock size={20} />
            </div>
            <div className={styles.statInfo}>
              <span className={styles.statValue}>{formatSats(stats.lockedValue)}</span>
              <span className={styles.statLabel}>Locked in Dust</span>
            </div>
          </div>
        </div>

        {/* Health Bar */}
        <div className={styles.healthBar}>
          <div className={styles.healthBarLabel}>
            <span>Wallet Health</span>
            <span className={styles.healthPercent}>{stats.healthyPercent}% healthy</span>
          </div>
          <div className={styles.healthBarTrack}>
            <motion.div
              className={styles.healthBarFill}
              initial={{ width: 0 }}
              animate={{ width: `${stats.healthyPercent}%` }}
              transition={{ duration: 0.5 }}
              style={{
                background: stats.healthyPercent > 70 
                  ? 'var(--success)' 
                  : stats.healthyPercent > 40 
                    ? 'var(--warning)' 
                    : 'var(--error)'
              }}
            />
          </div>
        </div>

        {/* UTXO List */}
        <div className={styles.utxoSection}>
          <div className={styles.utxoHeader}>
            <span className={styles.utxoHeaderLabel}>Your UTXOs</span>
            <span className={styles.utxoHeaderHint}>Click for details</span>
          </div>
          
          <div className={styles.utxoList}>
            <AnimatePresence>
              {analyzedUtxos.map((utxo, index) => (
                <motion.div
                  key={utxo.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className={`${styles.utxoRow} ${styles[utxo.classification.status]}`}
                  onClick={() => setShowDetails(showDetails === utxo.id ? null : utxo.id)}
                >
                  <div className={styles.utxoMain}>
                    <div 
                      className={styles.statusIndicator}
                      style={{ color: utxo.classification.color }}
                    >
                      {getStatusIcon(utxo.classification.status)}
                    </div>
                    
                    <div className={styles.utxoInfo}>
                      <span className={styles.utxoAmount}>{formatSats(utxo.amount)}</span>
                      <span className={styles.utxoLabel}>{utxo.label}</span>
                    </div>
                    
                    <Badge 
                      variant={
                        utxo.classification.status === 'healthy' ? 'success' :
                        utxo.classification.status === 'warning' ? 'warning' : 'error'
                      }
                      size="small"
                    >
                      {utxo.classification.label}
                    </Badge>
                  </div>
                  
                  <AnimatePresence>
                    {showDetails === utxo.id && (
                      <motion.div
                        className={styles.utxoDetails}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                      >
                        <div className={styles.detailRow}>
                          <span>Cost to spend:</span>
                          <span className={styles.detailValue}>{formatSats(utxo.spendCost)}</span>
                        </div>
                        <div className={styles.detailRow}>
                          <span>Fee ratio:</span>
                          <span className={styles.detailValue}>
                            {(utxo.costRatio * 100).toFixed(1)}% of value
                          </span>
                        </div>
                        <div className={styles.detailRow}>
                          <span>Status:</span>
                          <span className={styles.detailValue}>{utxo.classification.description}</span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Tips */}
        {stats.dust > 0 && (
          <div className={styles.tipsSection}>
            <h4 className={styles.tipsTitle}>
              <Sparkles size={16} />
              Tips for Managing Dust
            </h4>
            <ul className={styles.tipsList}>
              <li>Wait for low-fee periods (1-5 sat/vB) to consolidate dust UTXOs</li>
              <li>When receiving payments, prefer larger, less frequent deposits</li>
              <li>Use wallets that support coin control to avoid creating dust change</li>
              <li>Consider the privacy trade-off when consolidating</li>
            </ul>
          </div>
        )}
      </Card>

      <Accordion
        title="Deep Dive: What is Dust?"
        variant="deepdive"
        icon={<Sparkles size={16} />}
      >
        <p>
          <strong>Dust</strong> refers to UTXOs that are uneconomical to spend because the 
          transaction fee would exceed the UTXO's value. The dust threshold varies with fee rates (assuming single input with Native Segwit):
        </p>
        <ul>
          <li>
            <strong>At 5 sat/vB:</strong> UTXOs under ~340 sats are dust
          </li>
          <li>
            <strong>At 20 sat/vB:</strong> UTXOs under ~1,360 sats are dust
          </li>
          <li>
            <strong>At 100 sat/vB:</strong> UTXOs under ~6,800 sats are dust
          </li>
        </ul>
        <p>
          <strong>How Dust Accumulates:</strong>
        </p>
        <ul>
          <li>Receiving many small payments (tips, faucets, etc.)</li>
          <li>Change outputs from transactions with poor coin selection</li>
        </ul>
      </Accordion>
    </div>
  );
}

export default DustAnalyzer;
