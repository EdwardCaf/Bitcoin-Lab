import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Coins, 
  ArrowRight, 
  TrendingDown,
  TrendingUp,
  Minus,
  Clock,
  EyeOff,
  Merge,
  Info,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Card, Button, Accordion, Badge, Slider } from '../../common';
import { 
  generateManagementUTXOs, 
  formatSats,
  INPUT_SIZE_VBYTES
} from '../../../utils/bitcoin';
import styles from './ConsolidationDemo.module.css';

const FEE_PRESETS = [
  { rate: 5, label: 'Low', description: 'Weekend/night rates' },
  { rate: 15, label: 'Medium', description: 'Average conditions' },
  { rate: 50, label: 'High', description: 'Busy mempool' },
  { rate: 100, label: 'Very High', description: 'Peak congestion' }
];

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
  const [utxos] = useState(() => generateManagementUTXOs().slice(0, 6));
  const [selectedIds, setSelectedIds] = useState([]);
  const [feeRate, setFeeRate] = useState(15);
  const [isConsolidated, setIsConsolidated] = useState(false);
  const [showPrivacyWarning, setShowPrivacyWarning] = useState(true);
  const [expandedScenario, setExpandedScenario] = useState('higher');

  const selectedUtxos = useMemo(() => 
    utxos.filter(u => selectedIds.includes(u.id)),
    [utxos, selectedIds]
  );

  const consolidationStats = useMemo(() => {
    if (selectedUtxos.length < 2) return null;
    return calculateConsolidationWithScenarios(selectedUtxos, feeRate);
  }, [selectedUtxos, feeRate]);

  const toggleUtxo = (id) => {
    if (isConsolidated) return;
    setSelectedIds(prev => 
      prev.includes(id) 
        ? prev.filter(i => i !== id)
        : [...prev, id]
    );
  };

  const selectAll = () => {
    if (isConsolidated) return;
    setSelectedIds(utxos.map(u => u.id));
  };

  const clearSelection = () => {
    setSelectedIds([]);
    setIsConsolidated(false);
  };

  const handleConsolidate = () => {
    if (selectedUtxos.length < 2) return;
    setIsConsolidated(true);
  };

  const resetDemo = () => {
    setSelectedIds([]);
    setIsConsolidated(false);
  };

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
          <div className={styles.headerActions}>
            {!isConsolidated && (
              <>
                <Button variant="ghost" size="small" onClick={selectAll}>
                  Select All
                </Button>
                <Button variant="ghost" size="small" onClick={clearSelection}>
                  Clear
                </Button>
              </>
            )}
            {isConsolidated && (
              <Button variant="secondary" size="small" onClick={resetDemo}>
                Reset Demo
              </Button>
            )}
          </div>
        </div>

        {/* Fee Rate Selector */}
        <div className={styles.feeSection}>
          <div className={styles.feeSectionHeader}>
            <span className={styles.feeLabel}>Current Fee Rate: {feeRate} sat/vB</span>
            <div className={styles.feePresets}>
              {FEE_PRESETS.map(preset => (
                <button
                  key={preset.rate}
                  className={`${styles.feePreset} ${feeRate === preset.rate ? styles.active : ''}`}
                  onClick={() => setFeeRate(preset.rate)}
                  disabled={isConsolidated}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
          <Slider
            min={1}
            max={150}
            value={feeRate}
            onChange={setFeeRate}
            disabled={isConsolidated}
          />
          <p className={styles.feeTip}>
            <Clock size={14} />
            Best to consolidate during low-fee periods (weekends, nights)
          </p>
        </div>

        {/* UTXO Selection Area */}
        <div className={styles.utxoSection}>
          <AnimatePresence mode="wait">
            {!isConsolidated ? (
              <motion.div
                key="selection"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={styles.utxoGrid}
              >
                {utxos.map((utxo, index) => (
                  <motion.div
                    key={utxo.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`${styles.utxoCard} ${selectedIds.includes(utxo.id) ? styles.selected : ''}`}
                    onClick={() => toggleUtxo(utxo.id)}
                  >
                    <div className={styles.utxoIcon}>
                      <Coins size={18} />
                    </div>
                    <div className={styles.utxoInfo}>
                      <span className={styles.utxoAmount}>{formatSats(utxo.amount)}</span>
                      <span className={styles.utxoLabel}>{utxo.label}</span>
                    </div>
                    <div className={styles.utxoCheck}>
                      {selectedIds.includes(utxo.id) && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className={styles.checkmark}
                        >
                          ✓
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="consolidated"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className={styles.consolidatedView}
              >
                <div className={styles.beforeAfter}>
                  <div className={styles.beforeSection}>
                    <span className={styles.baLabel}>Before</span>
                    <div className={styles.miniUtxos}>
                      {selectedUtxos.map((utxo, i) => (
                        <motion.div
                          key={utxo.id}
                          className={styles.miniUtxo}
                          initial={{ opacity: 1, scale: 1, x: 0 }}
                          animate={{ 
                            opacity: 0.3, 
                            scale: 0.8,
                            x: 50 * (i - selectedUtxos.length / 2)
                          }}
                          transition={{ delay: 0.2 + i * 0.1 }}
                        >
                          <Coins size={14} />
                        </motion.div>
                      ))}
                    </div>
                    <span className={styles.baCount}>{selectedUtxos.length} UTXOs</span>
                  </div>

                  <motion.div
                    className={styles.arrowSection}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <ArrowRight size={24} />
                  </motion.div>

                  <div className={styles.afterSection}>
                    <span className={styles.baLabel}>After</span>
                    <motion.div
                      className={styles.consolidatedUtxo}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.7, type: 'spring' }}
                    >
                      <Coins size={24} />
                      <span>{formatSats(consolidationStats?.consolidatedValue || 0)}</span>
                    </motion.div>
                    <span className={styles.baCount}>1 UTXO</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Stats Panel with Future Scenarios */}
        {consolidationStats && (
          <motion.div
            className={styles.statsPanel}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Current Transaction Stats */}
            <div className={styles.currentStats}>
              <h4 className={styles.statsTitle}>Consolidation Cost (Paid Now)</h4>
              <div className={styles.statRow}>
                <div className={styles.stat}>
                  <span className={styles.statLabel}>UTXOs to Combine</span>
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
                      
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            className={styles.scenarioDetails}
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                          >
                            <div className={styles.detailGrid}>
                              <div className={styles.detailItem}>
                                <span className={styles.detailLabel}>
                                  Without consolidation
                                </span>
                                <span className={styles.detailValue}>
                                  {consolidationStats.inputCount} inputs × {scenario.futureRate} sat/vB = {formatSats(scenario.futureSpendCostBefore)}
                                </span>
                              </div>
                              <div className={styles.detailItem}>
                                <span className={styles.detailLabel}>
                                  With consolidation
                                </span>
                                <span className={styles.detailValue}>
                                  1 input × {scenario.futureRate} sat/vB = {formatSats(scenario.futureSpendCostAfter)}
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
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {/* Privacy Warning */}
        {showPrivacyWarning && selectedIds.length >= 2 && (
          <motion.div
            className={styles.privacyWarning}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
          >
            <div className={styles.warningHeader}>
              <EyeOff size={18} />
              <span>Privacy Consideration</span>
              <button 
                className={styles.dismissBtn}
                onClick={() => setShowPrivacyWarning(false)}
              >
                Dismiss
              </button>
            </div>
            <p>
              Consolidating UTXOs <strong>links them on-chain</strong>, revealing they belong to the 
              same wallet. This reduces your privacy by making it easier to trace your funds. 
              Consider the trade-off between fee savings and privacy.
            </p>
          </motion.div>
        )}

        {/* Consolidate Button */}
        {!isConsolidated && selectedUtxos.length >= 2 && (
          <div className={styles.actionSection}>
            <Button 
              variant="primary" 
              size="large"
              icon={<Merge size={18} />}
              onClick={handleConsolidate}
            >
              Consolidate {selectedUtxos.length} UTXOs
            </Button>
          </div>
        )}

        {selectedUtxos.length < 2 && !isConsolidated && (
          <div className={styles.hint}>
            <Info size={16} />
            Select at least 2 UTXOs to consolidate
          </div>
        )}
      </Card>

      <Accordion
        title="Deep Dive: When to Consolidate"
        variant="deepdive"
        icon={<Merge size={16} />}
      >
        <p>
          UTXO consolidation is a balancing act between <strong>fee efficiency</strong> and <strong>privacy</strong>:
        </p>
        <ul>
          <li>
            <strong>Best Time:</strong> Consolidate during low-fee periods (weekends, late nights UTC). 
            If fees are 1-5 sat/vB, consolidation makes more sense.
          </li>
          <li>
            <strong>Bet on Higher Fees:</strong> Consolidation pays off most when future fees rise. 
            If you expect fees to stay low forever, consolidation may not be worth it.
          </li>
          <li>
            <strong>Privacy Trade-off:</strong> Every consolidation transaction links your UTXOs together 
            on the public blockchain. If privacy is paramount, avoid consolidation.
          </li>
          <li>
            <strong>Dust Cleanup:</strong> Small UTXOs that cost more to spend than they're worth are 
            good candidates for consolidation during extremely low fee periods.
          </li>
        </ul>
      </Accordion>
    </div>
  );
}

export default ConsolidationDemo;
