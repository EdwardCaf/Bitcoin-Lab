import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  GitCompare,
  Clock,
  DollarSign,
  Shield,
  Users,
  Target,
  Zap,
  Droplets,
  Bitcoin,
  Check,
  X,
  Minus,
  Unlock
} from 'lucide-react';
import { Card, Badge, Accordion } from '../../common';
import styles from './ComparisonTable.module.css';

const COMPARISON_DATA = [
  {
    category: 'Settlement Time',
    icon: Clock,
    bitcoin: { value: '~10 min - 1 hour', detail: '1-6 confirmations' },
    lightning: { value: 'Instant', detail: 'Milliseconds' },
    liquid: { value: '~2 minutes', detail: '2 block confirmations' },
  },
  {
    category: 'Transaction Fees',
    icon: DollarSign,
    bitcoin: { value: '$0.50 - $50+', detail: 'Varies with demand' },
    lightning: { value: '< 1 satoshi', detail: 'Near-zero' },
    liquid: { value: '~$0.01', detail: 'Predictable' },
  },
  {
    category: 'Privacy',
    icon: Shield,
    bitcoin: { value: 'Pseudonymous', detail: 'Amounts visible' },
    lightning: { value: 'Good', detail: 'Onion routing' },
    liquid: { value: 'Strong', detail: 'Confidential TX' },
  },
  {
    category: 'Trust Model',
    icon: Users,
    bitcoin: { value: 'Trustless', detail: 'Full nodes verify' },
    lightning: { value: 'Trustless', detail: 'HTLCs enforce' },
    liquid: { value: 'Federated', detail: '11-of-15 multisig' },
  },
  {
    category: 'Exit to Bitcoin',
    icon: Unlock,
    bitcoin: { value: 'N/A', detail: 'Already on Bitcoin' },
    lightning: { value: 'Unilateral', detail: 'Force close anytime' },
    liquid: { value: 'Federated', detail: 'Requires cooperation' },
  },
  {
    category: 'Best For',
    icon: Target,
    bitcoin: { value: 'Large settlements', detail: 'Long-term storage' },
    lightning: { value: 'Micropayments', detail: 'Everyday purchases' },
    liquid: { value: 'Small TXs & Assets', detail: 'Exchanges, tokens' },
  },
];

const FEATURE_MATRIX = [
  { feature: 'Native BTC', bitcoin: true, lightning: true, liquid: false },
  { feature: 'Issued Assets', bitcoin: false, lightning: false, liquid: true },
  { feature: 'Confidential TX', bitcoin: false, lightning: 'partial', liquid: true },
  { feature: 'Unilateral Exit', bitcoin: true, lightning: true, liquid: false },
  { feature: 'Smart Contracts', bitcoin: 'limited', lightning: 'limited', liquid: 'limited' },
  { feature: 'Offline Receive', bitcoin: true, lightning: false, liquid: true },
  { feature: 'High Throughput', bitcoin: false, lightning: true, liquid: true },
];

export function ComparisonTable() {
  const [hoveredRow, setHoveredRow] = useState(null);
  const [selectedNetwork, setSelectedNetwork] = useState(null);

  const getStatusIcon = (value) => {
    if (value === true) return <Check size={16} className={styles.checkIcon} />;
    if (value === false) return <X size={16} className={styles.xIcon} />;
    return <Minus size={16} className={styles.partialIcon} />;
  };

  return (
    <div className={styles.container}>
      <Card variant="elevated" padding="large">
        <div className={styles.header}>
          <div className={styles.titleSection}>
            <div className={styles.iconWrapper}>
              <GitCompare size={24} />
            </div>
            <div>
              <h3 className={styles.title}>Bitcoin vs Lightning vs Liquid</h3>
              <p className={styles.subtitle}>
                Compare the three layers of the Bitcoin ecosystem
              </p>
            </div>
          </div>
        </div>

        {/* Network Headers */}
        <div className={styles.networkHeaders}>
          <div className={styles.categoryHeader}></div>
          <button
            className={`${styles.networkHeader} ${styles.bitcoin} ${selectedNetwork === 'bitcoin' ? styles.selected : ''}`}
            onClick={() => setSelectedNetwork(selectedNetwork === 'bitcoin' ? null : 'bitcoin')}
          >
            <Bitcoin size={24} />
            <span>Bitcoin</span>
            <span className={styles.networkSubtext}>Layer 1</span>
          </button>
          <button
            className={`${styles.networkHeader} ${styles.lightning} ${selectedNetwork === 'lightning' ? styles.selected : ''}`}
            onClick={() => setSelectedNetwork(selectedNetwork === 'lightning' ? null : 'lightning')}
          >
            <Zap size={24} />
            <span>Lightning</span>
            <span className={styles.networkSubtext}>Layer 2</span>
          </button>
          <button
            className={`${styles.networkHeader} ${styles.liquid} ${selectedNetwork === 'liquid' ? styles.selected : ''}`}
            onClick={() => setSelectedNetwork(selectedNetwork === 'liquid' ? null : 'liquid')}
          >
            <Droplets size={24} />
            <span>Liquid</span>
            <span className={styles.networkSubtext}>Sidechain</span>
          </button>
        </div>

        {/* Comparison Table */}
        <div className={styles.table}>
          {COMPARISON_DATA.map((row, i) => (
            <motion.div
              key={row.category}
              className={`${styles.row} ${hoveredRow === i ? styles.hovered : ''}`}
              onMouseEnter={() => setHoveredRow(i)}
              onMouseLeave={() => setHoveredRow(null)}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <div className={styles.categoryCell}>
                <row.icon size={18} />
                <span>{row.category}</span>
              </div>
              <div className={`${styles.valueCell} ${styles.bitcoinCell} ${selectedNetwork === 'bitcoin' ? styles.highlight : ''}`}>
                <span className={styles.value}>{row.bitcoin.value}</span>
                <span className={styles.detail}>{row.bitcoin.detail}</span>
              </div>
              <div className={`${styles.valueCell} ${styles.lightningCell} ${selectedNetwork === 'lightning' ? styles.highlight : ''}`}>
                <span className={styles.value}>{row.lightning.value}</span>
                <span className={styles.detail}>{row.lightning.detail}</span>
              </div>
              <div className={`${styles.valueCell} ${styles.liquidCell} ${selectedNetwork === 'liquid' ? styles.highlight : ''}`}>
                <span className={styles.value}>{row.liquid.value}</span>
                <span className={styles.detail}>{row.liquid.detail}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Feature Matrix */}
        <div className={styles.featureSection}>
          <h4>Feature Support</h4>
          <div className={styles.featureTable}>
            <div className={styles.featureHeader}>
              <div className={styles.featureLabel}>Feature</div>
              <div className={styles.featureNetwork}>
                <Bitcoin size={16} />
              </div>
              <div className={styles.featureNetwork}>
                <Zap size={16} />
              </div>
              <div className={styles.featureNetwork}>
                <Droplets size={16} />
              </div>
            </div>
            {FEATURE_MATRIX.map((row, i) => (
              <div key={row.feature} className={styles.featureRow}>
                <div className={styles.featureLabel}>{row.feature}</div>
                <div className={styles.featureValue}>{getStatusIcon(row.bitcoin)}</div>
                <div className={styles.featureValue}>{getStatusIcon(row.lightning)}</div>
                <div className={styles.featureValue}>{getStatusIcon(row.liquid)}</div>
              </div>
            ))}
          </div>
          <div className={styles.legend}>
            <span><Check size={12} className={styles.checkIcon} /> Full support</span>
            <span><Minus size={12} className={styles.partialIcon} /> Limited/Partial</span>
            <span><X size={12} className={styles.xIcon} /> Not supported</span>
          </div>
        </div>

        {/* Summary Cards */}
        <div className={styles.summaryGrid}>
          <div className={styles.summaryCard} style={{ borderColor: '#f97316' }}>
            <Bitcoin size={24} style={{ color: '#f97316' }} />
            <h5>Use Bitcoin When...</h5>
            <ul>
              <li>Storing value long-term</li>
              <li>Maximum security needed</li>
              <li>Large value transfers</li>
              <li>You don't trust anyone</li>
            </ul>
          </div>
          <div className={styles.summaryCard} style={{ borderColor: '#facc15' }}>
            <Zap size={24} style={{ color: '#facc15' }} />
            <h5>Use Lightning When...</h5>
            <ul>
              <li>Buying coffee or tipping</li>
              <li>Speed is critical</li>
              <li>Fees must be minimal</li>
              <li>Streaming payments</li>
            </ul>
          </div>
          <div className={styles.summaryCard} style={{ borderColor: '#14b8a6' }}>
            <Droplets size={24} style={{ color: '#14b8a6' }} />
            <h5>Use Liquid When...</h5>
            <ul>
              <li>Desire offline receive</li>
              <li>Privacy is important</li>
              <li>Using stablecoins/assets</li>
              <li>1-min finality needed</li>
            </ul>
          </div>
        </div>
      </Card>

      <Accordion
        title="Deep Dive: Choosing the Right Layer"
        variant="deepdive"
        icon={<GitCompare size={16} />}
      >
        <p>
          Each layer serves different use cases. Here's how to think about the tradeoffs:
        </p>
        <ul>
          <li>
            <strong>Security vs Speed:</strong> Bitcoin is the most secure but slowest. 
            Lightning trades some security assumptions for instant payments. Liquid trades 
            trustlessness for fast finality and features.
          </li>
          <li>
            <strong>Exit mechanism:</strong> Lightning allows unilateral exit - you can 
            always close your channel and return to the Bitcoin main chain without anyone's 
            permission. Liquid is a sidechain that requires the federation's cooperation 
            to peg-out. This is a fundamental trust difference: Lightning is trustless 
            exit, Liquid requires trusting the federation.
          </li>
          <li>
            <strong>On-chain vs Off-chain:</strong> Bitcoin records every transaction 
            forever. Lightning keeps most activity off-chain. Liquid is a separate chain 
            with its own blockchain.
          </li>
          <li>
            <strong>Capacity:</strong> Bitcoin: ~7 TPS. Lightning: millions of TPS 
            (theoretical). Liquid: ~1000s TPS with larger blocks.
          </li>
          <li>
            <strong>Interoperability:</strong> You can move between all three! BTC → 
            Lightning channel, BTC → Liquid peg-in, or even Lightning ↔ Liquid via 
            submarine swaps.
          </li>
        </ul>
        <p>
          <strong>Pro tip:</strong> Many users keep a small amount on Lightning for 
          spending, some on Liquid for spending, and the majority on Bitcoin base layer 
          for long-term savings.
        </p>
      </Accordion>
    </div>
  );
}

export default ComparisonTable;
