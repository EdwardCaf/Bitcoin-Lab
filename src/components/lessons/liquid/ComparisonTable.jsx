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

        {/* Comparison Cards */}
        <div className={styles.comparisonCards}>
          {COMPARISON_DATA.map((row, i) => (
            <motion.div
              key={row.category}
              className={styles.comparisonCard}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <div className={styles.cardHeader}>
                <row.icon size={18} />
                <span>{row.category}</span>
              </div>
              <div className={styles.cardBody}>
                <div className={styles.cardRow}>
                  <div className={`${styles.networkLabel} ${styles.bitcoin}`}>
                    <Bitcoin size={16} />
                    <span>Bitcoin</span>
                  </div>
                  <div className={styles.valueSection}>
                    <span className={styles.valueText}>{row.bitcoin.value}</span>
                    <span className={styles.detailText}>{row.bitcoin.detail}</span>
                  </div>
                </div>
                <div className={styles.cardRow}>
                  <div className={`${styles.networkLabel} ${styles.lightning}`}>
                    <Zap size={16} />
                    <span>Lightning</span>
                  </div>
                  <div className={styles.valueSection}>
                    <span className={styles.valueText}>{row.lightning.value}</span>
                    <span className={styles.detailText}>{row.lightning.detail}</span>
                  </div>
                </div>
                <div className={styles.cardRow}>
                  <div className={`${styles.networkLabel} ${styles.liquid}`}>
                    <Droplets size={16} />
                    <span>Liquid</span>
                  </div>
                  <div className={styles.valueSection}>
                    <span className={styles.valueText}>{row.liquid.value}</span>
                    <span className={styles.detailText}>{row.liquid.detail}</span>
                  </div>
                </div>
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

      
    </div>
  );
}

export default ComparisonTable;
