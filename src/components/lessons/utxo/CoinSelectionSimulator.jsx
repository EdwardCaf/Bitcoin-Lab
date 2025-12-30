import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Coins, 
  ArrowRight,
  Eye,
  EyeOff,
  Zap,
  Target,
  Scale,
  TrendingUp,
  Shuffle,
  Layers
} from 'lucide-react';
import { Card, Accordion, Badge } from '../../common';
import { 
  generateManagementUTXOs, 
  COIN_SELECTION_STRATEGIES,
  formatSats
} from '../../../utils/bitcoin';
import styles from './CoinSelectionSimulator.module.css';

// Fixed demo values
const DEMO_TARGET = 2000000; // 0.02 BTC (2,000,000 sats)
const DEMO_FEE_RATE = 20;

const STRATEGY_ICONS = {
  largestFirst: TrendingUp,
  smallestFirst: Layers,
  exactMatch: Target,
  random: Shuffle
};

const PRIVACY_LEVELS = {
  low: { label: 'Low', color: 'var(--error)' },
  medium: { label: 'Medium', color: 'var(--warning)' },
  high: { label: 'High', color: 'var(--success)' }
};

const EFFICIENCY_LEVELS = {
  low: { label: 'Low', color: 'var(--error)' },
  medium: { label: 'Medium', color: 'var(--warning)' },
  high: { label: 'High', color: 'var(--success)' }
};

export function CoinSelectionSimulator() {
  const [utxos] = useState(() => generateManagementUTXOs().filter(u => u.amount > 10000));
  const [selectedStrategy, setSelectedStrategy] = useState('largestFirst');

  const strategies = Object.values(COIN_SELECTION_STRATEGIES);
  const currentStrategy = COIN_SELECTION_STRATEGIES[selectedStrategy];

  // Pre-calculate results for the selected strategy
  const selectionResult = useMemo(() => {
    if (!currentStrategy) return null;
    return currentStrategy.select(utxos, DEMO_TARGET, DEMO_FEE_RATE);
  }, [utxos, currentStrategy]);

  const StrategyIcon = STRATEGY_ICONS[selectedStrategy] || Coins;

  return (
    <div className={styles.container}>
      <Card variant="elevated" padding="large">
        <div className={styles.header}>
          <div className={styles.titleSection}>
            <div className={styles.iconWrapper}>
              <Scale size={24} />
            </div>
            <div>
              <h3 className={styles.title}>Coin Selection Strategies</h3>
              <p className={styles.subtitle}>See how different algorithms choose which UTXOs to spend</p>
            </div>
          </div>
        </div>

        {/* Demo Context */}
        <div className={styles.demoContext}>
          <div className={styles.contextItem}>
            <span className={styles.contextLabel}>Sending</span>
            <span className={styles.contextValue}>{formatSats(DEMO_TARGET)}</span>
          </div>
          <div className={styles.contextItem}>
            <span className={styles.contextLabel}>Fee Rate</span>
            <span className={styles.contextValue}>{DEMO_FEE_RATE} sat/vB</span>
          </div>
          <div className={styles.contextItem}>
            <span className={styles.contextLabel}>Available UTXOs</span>
            <span className={styles.contextValue}>{utxos.length}</span>
          </div>
        </div>

        {/* Strategy Selector */}
        <div className={styles.strategySection}>
          <span className={styles.sectionLabel}>Select a Strategy</span>
          <div className={styles.strategyTabs}>
            {strategies.map((strategy) => {
              const Icon = STRATEGY_ICONS[strategy.id] || Coins;
              const isSelected = selectedStrategy === strategy.id;
              
              return (
                <button
                  key={strategy.id}
                  className={`${styles.strategyTab} ${isSelected ? styles.selected : ''}`}
                  onClick={() => setSelectedStrategy(strategy.id)}
                >
                  <Icon size={16} />
                  <span>{strategy.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Strategy Description */}
        <motion.div
          key={selectedStrategy}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={styles.strategyDescription}
        >
          <div className={styles.strategyHeader}>
            <div className={styles.strategyIconLarge}>
              <StrategyIcon size={24} />
            </div>
            <div>
              <h4 className={styles.strategyName}>{currentStrategy.name}</h4>
              <p className={styles.strategyDesc}>{currentStrategy.description}</p>
            </div>
          </div>
          
          <div className={styles.strategyMeta}>
            <div className={styles.metaItem}>
              <EyeOff size={14} />
              <span>Privacy:</span>
              <span 
                className={styles.metaValue}
                style={{ color: PRIVACY_LEVELS[currentStrategy.privacy].color }}
              >
                {PRIVACY_LEVELS[currentStrategy.privacy].label}
              </span>
            </div>
            <div className={styles.metaItem}>
              <Zap size={14} />
              <span>Fee Efficiency:</span>
              <span 
                className={styles.metaValue}
                style={{ color: EFFICIENCY_LEVELS[currentStrategy.efficiency].color }}
              >
                {EFFICIENCY_LEVELS[currentStrategy.efficiency].label}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Visual Representation */}
        <div className={styles.visualization}>
          <div className={styles.vizSection}>
            <span className={styles.vizLabel}>Wallet UTXOs</span>
            <div className={styles.utxoList}>
              <AnimatePresence mode="popLayout">
                {utxos.map((utxo, index) => {
                  const isSelected = selectionResult?.selected.some(s => s.id === utxo.id);
                  return (
                    <motion.div
                      key={utxo.id}
                      layout
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ 
                        opacity: isSelected ? 1 : 0.4, 
                        scale: 1,
                        y: 0
                      }}
                      transition={{ 
                        duration: 0.3, 
                        delay: isSelected ? index * 0.05 : 0 
                      }}
                      className={`${styles.utxoChip} ${isSelected ? styles.selectedUtxo : ''}`}
                    >
                      <Coins size={12} />
                      <span>{formatSats(utxo.amount)}</span>
                      {isSelected && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className={styles.selectedIndicator}
                        >
                          ✓
                        </motion.span>
                      )}
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>

          <div className={styles.arrowContainer}>
            <ArrowRight size={24} />
          </div>

          <div className={styles.vizSection}>
            <span className={styles.vizLabel}>Transaction Outputs</span>
            <AnimatePresence mode="wait">
              {selectionResult && (
                <motion.div
                  key={selectedStrategy}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className={styles.outputsList}
                >
                  <div className={styles.outputItem}>
                    <div className={styles.outputIcon}>
                      <Target size={16} />
                    </div>
                    <div className={styles.outputInfo}>
                      <span className={styles.outputLabel}>Recipient</span>
                      <span className={styles.outputValue}>{formatSats(DEMO_TARGET)}</span>
                    </div>
                  </div>
                  
                  {selectionResult.change > 0 && (
                    <div className={styles.outputItem}>
                      <div className={styles.outputIcon}>
                        <Coins size={16} />
                      </div>
                      <div className={styles.outputInfo}>
                        <span className={styles.outputLabel}>Change (back to you)</span>
                        <span className={styles.outputValue}>{formatSats(selectionResult.change)}</span>
                      </div>
                    </div>
                  )}
                  
                  <div className={`${styles.outputItem} ${styles.feeOutput}`}>
                    <div className={styles.outputIcon}>
                      <Zap size={16} />
                    </div>
                    <div className={styles.outputInfo}>
                      <span className={styles.outputLabel}>Miner Fee</span>
                      <span className={styles.outputValue}>-{formatSats(selectionResult.fee)}</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Summary Stats */}
        {selectionResult && (
          <motion.div
            key={selectedStrategy + '-stats'}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={styles.summaryStats}
          >
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Inputs Used</span>
              <span className={styles.statValue}>{selectionResult.selected.length}</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Total Input</span>
              <span className={styles.statValue}>{formatSats(selectionResult.total)}</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Fee Paid</span>
              <span className={styles.statValue}>{formatSats(selectionResult.fee)}</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Change Created</span>
              <span className={styles.statValue}>
                {selectionResult.change > 0 ? formatSats(selectionResult.change) : 'None'}
              </span>
            </div>
          </motion.div>
        )}

        {/* Strategy Insight */}
        <div className={styles.insightBox}>
          {selectedStrategy === 'largestFirst' && (
            <p>Uses the fewest inputs possible, keeping fees low. However, small UTXOs accumulate over time and can become "dust" that's expensive to spend later.</p>
          )}
          {selectedStrategy === 'smallestFirst' && (
            <p>Cleans up small UTXOs first, preventing dust accumulation. Higher fees now, but a healthier wallet long-term. Good during low-fee periods.</p>
          )}
          {selectedStrategy === 'exactMatch' && (
            <p>Tries to find UTXOs that exactly match the target amount. When successful, no change output is created, which is better for privacy and slightly lower fees.</p>
          )}
          {selectedStrategy === 'random' && (
            <p>Randomly selects UTXOs, making your spending patterns unpredictable. This makes chain analysis harder but results in variable fees.</p>
          )}
        </div>
      </Card>

      <Accordion
        title="Deep Dive: Coin Selection Trade-offs"
        variant="deepdive"
        icon={<Scale size={16} />}
      >
        <p>
          Coin selection is a crucial but often invisible part of Bitcoin wallets. The algorithm 
          determines which UTXOs are spent, affecting both your <strong>fees</strong> and <strong>privacy</strong>:
        </p>
        <ul>
          <li>
            <strong>Fewer inputs = lower fees:</strong> Each input adds ~68 bytes to your transaction. 
            At 20 sat/vB, each additional input costs ~1,360 sats.
          </li>
          <li>
            <strong>No change = better privacy:</strong> Change outputs can be traced back to you. 
            If the algorithm finds an exact match, no change is needed.
          </li>
          <li>
            <strong>Randomness = harder to analyze:</strong> Predictable selection patterns make it 
            easier for chain analysis companies to track your wallet.
          </li>
          <li>
            <strong>Long-term thinking:</strong> Cleaning up small UTXOs during low-fee periods 
            saves money when fees spike.
          </li>
        </ul>
        <p>
          Most modern wallets use sophisticated algorithms that balance these factors. Advanced 
          users can often manually select coins for important transactions ("coin control").
        </p>
      </Accordion>
    </div>
  );
}

export default CoinSelectionSimulator;
