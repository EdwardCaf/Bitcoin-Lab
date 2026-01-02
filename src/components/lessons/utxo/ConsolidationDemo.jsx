import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Coins, 
  ArrowRight, 
  TrendingDown,
  TrendingUp,
  Minus,
  Clock,
  EyeOff,
  Merge,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Card, Badge } from '../../common';
import { 
  formatSats,
  INPUT_SIZE_VBYTES
} from '../../../utils/bitcoin';
import styles from './ConsolidationDemo.module.css';

// Static example UTXOs for demonstration
const EXAMPLE_UTXOS = [
  { id: 1, amount: 50000, label: 'Exchange withdrawal' },
  { id: 2, amount: 125000, label: 'Payment received' },
  { id: 3, amount: 35000, label: 'Mining payout' },
  { id: 4, amount: 180000, label: 'Salary deposit' },
  { id: 5, amount: 22000, label: 'Refund' },
  { id: 6, amount: 95000, label: 'Gift received' }
];

const CURRENT_FEE_RATE = 15; // sat/vB - representing "Medium" fee environment

const FUTURE_SCENARIOS = [
  { id: 'lower', label: 'Fees Drop', multiplier: 0.5, icon: TrendingDown, color: 'var(--success)' },
  { id: 'same', label: 'Fees Stay Same', multiplier: 1, icon: Minus, color: 'var(--warning)' },
  { id: 'higher', label: 'Fees Rise', multiplier: 2, icon: TrendingUp, color: 'var(--error)' }
];

// Calculate consolidation with future fee scenarios
function calculateConsolidationWithScenarios(utxos, currentFeeRate) {
  const inputCount = utxos.length;
  const outputCount = 1;
  
  // Consolidation transaction size and cost (paid now)
  const consolidationTxSize = 10 + (inputCount * INPUT_SIZE_VBYTES) + (34 * outputCount);
  const consolidationFee = consolidationTxSize * currentFeeRate;
  
  const totalValue = utxos.reduce((sum, u) => sum + u.amount, 0);
  const consolidatedValue = totalValue - consolidationFee;
  
  // Calculate future spend costs at different fee scenarios
  const scenarios = FUTURE_SCENARIOS.map(scenario => {
    const futureRate = Math.round(currentFeeRate * scenario.multiplier);
    
    // Cost to spend all UTXOs separately (without consolidation)
    const futureSpendCostBefore = inputCount * INPUT_SIZE_VBYTES * futureRate;
    
    // Cost to spend 1 consolidated UTXO
    const futureSpendCostAfter = 1 * INPUT_SIZE_VBYTES * futureRate;
    
    // Savings from having fewer inputs in future
    const futureSavings = futureSpendCostBefore - futureSpendCostAfter;
    
    // Net benefit = future savings - consolidation cost paid now
    const netBenefit = futureSavings - consolidationFee;
    
    return {
      ...scenario,
      futureRate,
      futureSpendCostBefore,
      futureSpendCostAfter,
      futureSavings,
      netBenefit,
      worthIt: netBenefit > 0
    };
  });
  
  return {
    inputCount,
    consolidationTxSize,
    consolidationFee,
    totalValue,
    consolidatedValue,
    scenarios
  };
}

export function ConsolidationDemo() {
  const [expandedScenario, setExpandedScenario] = useState('higher');

  const consolidationStats = useMemo(() => {
    return calculateConsolidationWithScenarios(EXAMPLE_UTXOS, CURRENT_FEE_RATE);
  }, []);

  return (
    <div className={styles.container}>
      <Card variant="elevated" padding="large">
        <div className={styles.header}>
          <div className={styles.titleSection}>
            <div className={styles.iconWrapper}>
              <Merge size={24} />
            </div>
            <div>
              <h3 className={styles.title}>UTXO Consolidation</h3>
              <p className={styles.subtitle}>Combine multiple UTXOs into one to save on future fees</p>
            </div>
          </div>
        </div>

        {/* Fee Context */}
        <div className={styles.feeContext}>
          <Clock size={14} />
          <span>Current fee rate: <strong>{CURRENT_FEE_RATE} sat/vB</strong> (Medium)</span>
        </div>

        {/* Static Consolidation Visualization */}
        <div className={styles.visualSection}>
          <div className={styles.consolidationFlow}>
            {/* Before - Multiple UTXOs */}
            <div className={styles.beforeColumn}>
              <span className={styles.columnLabel}>Before</span>
              <div className={styles.utxoStack}>
                {EXAMPLE_UTXOS.map((utxo, index) => (
                  <motion.div
                    key={utxo.id}
                    className={styles.utxoItem}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className={styles.utxoIcon}>
                      <Coins size={14} />
                    </div>
                    <div className={styles.utxoDetails}>
                      <span className={styles.utxoAmount}>{formatSats(utxo.amount)}</span>
                      <span className={styles.utxoLabel}>{utxo.label}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className={styles.columnSummary}>
                <span className={styles.summaryCount}>{EXAMPLE_UTXOS.length} UTXOs</span>
                <span className={styles.summaryTotal}>{formatSats(consolidationStats.totalValue)}</span>
              </div>
            </div>

            {/* Arrow */}
            <div className={styles.arrowColumn}>
              <motion.div
                className={styles.arrowContainer}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
              >
                <ArrowRight size={28} />
                <span className={styles.arrowLabel}>Consolidate</span>
              </motion.div>
            </div>

            {/* After - Single UTXO */}
            <div className={styles.afterColumn}>
              <span className={styles.columnLabel}>After</span>
              <motion.div
                className={styles.consolidatedResult}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7, type: 'spring' }}
              >
                <div className={styles.consolidatedIcon}>
                  <Coins size={28} />
                </div>
                <div className={styles.consolidatedInfo}>
                  <span className={styles.consolidatedAmount}>
                    {formatSats(consolidationStats.consolidatedValue)}
                  </span>
                  <span className={styles.consolidatedSubtext}>Single UTXO</span>
                </div>
              </motion.div>
              <div className={styles.columnSummary}>
                <span className={styles.summaryCount}>1 UTXO</span>
                <span className={styles.summaryFee}>
                  Fee paid: -{formatSats(consolidationStats.consolidationFee)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Panel with Future Scenarios */}
        <motion.div
          className={styles.statsPanel}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {/* Current Transaction Stats */}
          <div className={styles.currentStats}>
            <h4 className={styles.statsTitle}>Consolidation Cost (Paid Now)</h4>
            <div className={styles.statRow}>
              <div className={styles.stat}>
                <span className={styles.statLabel}>UTXOs Combined</span>
                <span className={styles.statValue}>{consolidationStats.inputCount}</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statLabel}>Total Value</span>
                <span className={styles.statValue}>{formatSats(consolidationStats.totalValue)}</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statLabel}>Consolidation Fee</span>
                <span className={`${styles.statValue} ${styles.negative}`}>
                  -{formatSats(consolidationStats.consolidationFee)}
                </span>
              </div>
            </div>
          </div>
          
          <div className={styles.divider} />
          
          {/* Future Fee Scenarios */}
          <div className={styles.scenariosSection}>
            <h4 className={styles.statsTitle}>Future Savings Scenarios</h4>
            <p className={styles.scenariosSubtitle}>
              When you spend your Bitcoin later, how much will you save?
            </p>
            
            <div className={styles.scenariosList}>
              {consolidationStats.scenarios.map(scenario => {
                const Icon = scenario.icon;
                const isExpanded = expandedScenario === scenario.id;
                
                return (
                  <motion.div
                    key={scenario.id}
                    className={`${styles.scenarioCard} ${isExpanded ? styles.expanded : ''}`}
                    style={{ '--scenario-color': scenario.color }}
                    onClick={() => setExpandedScenario(isExpanded ? null : scenario.id)}
                  >
                    <div className={styles.scenarioHeader}>
                      <div className={styles.scenarioIcon}>
                        <Icon size={18} />
                      </div>
                      <div className={styles.scenarioInfo}>
                        <span className={styles.scenarioLabel}>{scenario.label}</span>
                        <span className={styles.scenarioRate}>
                          Future rate: {scenario.futureRate} sat/vB
                        </span>
                      </div>
                      <div className={styles.scenarioResult}>
                        <Badge 
                          variant={scenario.worthIt ? 'success' : 'error'}
                          size="small"
                        >
                          {scenario.netBenefit > 0 ? '+' : ''}{formatSats(scenario.netBenefit)}
                        </Badge>
                      </div>
                      <div className={styles.expandIcon}>
                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </div>
                    </div>
                    
                    {isExpanded && (
                      <motion.div
                        className={styles.scenarioDetails}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <div className={styles.detailGrid}>
                          <div className={styles.detailItem}>
                            <span className={styles.detailLabel}>
                              Without consolidation
                            </span>
                            <span className={styles.detailValue}>
                              {consolidationStats.inputCount} inputs x {scenario.futureRate} sat/vB = {formatSats(scenario.futureSpendCostBefore)}
                            </span>
                          </div>
                          <div className={styles.detailItem}>
                            <span className={styles.detailLabel}>
                              With consolidation
                            </span>
                            <span className={styles.detailValue}>
                              1 input x {scenario.futureRate} sat/vB = {formatSats(scenario.futureSpendCostAfter)}
                            </span>
                          </div>
                          <div className={styles.detailItem}>
                            <span className={styles.detailLabel}>Future savings</span>
                            <span className={`${styles.detailValue} ${styles.positive}`}>
                              {formatSats(scenario.futureSavings)}
                            </span>
                          </div>
                          <div className={styles.detailItem}>
                            <span className={styles.detailLabel}>Minus consolidation cost</span>
                            <span className={`${styles.detailValue} ${styles.negative}`}>
                              -{formatSats(consolidationStats.consolidationFee)}
                            </span>
                          </div>
                        </div>
                        <div className={styles.scenarioVerdict}>
                          {scenario.worthIt ? (
                            <span className={styles.verdictPositive}>
                              Worth it! You save {formatSats(scenario.netBenefit)} overall.
                            </span>
                          ) : (
                            <span className={styles.verdictNegative}>
                              Not worth it. You'd lose {formatSats(Math.abs(scenario.netBenefit))} overall.
                            </span>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Privacy Warning */}
        <div className={styles.privacyWarning}>
          <div className={styles.warningHeader}>
            <EyeOff size={18} />
            <span>Privacy Consideration</span>
          </div>
          <p>
            Consolidating UTXOs <strong>links them on-chain</strong>, revealing they belong to the 
            same wallet. This reduces your privacy by making it easier to trace your funds. 
            Consider the trade-off between fee savings and privacy.
          </p>
        </div>

        {/* Best Practice Tip */}
        <div className={styles.tipSection}>
          <Clock size={16} />
          <p>
            <strong>Best practice:</strong> Consolidate during low-fee periods (weekends, late nights) 
            when you expect fees to rise in the future.
          </p>
        </div>
      </Card>
    </div>
  );
}

export default ConsolidationDemo;
