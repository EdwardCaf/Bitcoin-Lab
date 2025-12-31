import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Coins, 
  Merge, 
  Scale, 
  Sparkles,
  TrendingUp,
  TrendingDown,
  Eye,
  EyeOff,
  AlertTriangle,
  Clock,
  Wallet
} from 'lucide-react';
import { LessonLayout } from '../components/layout';
import { Card, Accordion } from '../components/common';
import { 
  ConsolidationDemo, 
  CoinSelectionSimulator, 
  DustAnalyzer 
} from '../components/lessons/utxo';
import styles from './Lessons.module.css';

const sections = [
  { id: 'intro', title: 'Introduction' },
  { id: 'consolidation', title: 'UTXO Consolidation' },
  { id: 'coin-selection', title: 'Coin Selection' },
  { id: 'dust', title: 'Managing Dust' }
];

export function UTXOManagementLesson() {
  const [currentSection, setCurrentSection] = useState(0);

  const renderSection = () => {
    switch (currentSection) {
      case 0:
        return <IntroSection />;
      case 1:
        return <ConsolidationSection />;
      case 2:
        return <CoinSelectionSection />;
      case 3:
        return <DustSection />;
      default:
        return <IntroSection />;
    }
  };

  return (
    <LessonLayout
      lessonId="utxo-management"
      title="UTXO Management"
      description="Master the art of managing your Bitcoin UTXOs for optimal fees and privacy"
      icon={Coins}
      sections={sections}
      currentSection={currentSection}
      onSectionChange={setCurrentSection}
      prevLesson={{ path: '/lessons/transactions', title: 'Transactions' }}
      nextLesson={{ path: '/lessons/privacy', title: 'Privacy' }}
    >
      {renderSection()}
    </LessonLayout>
  );
}

function IntroSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={styles.section}
    >
      <div className={styles.heroCard}>
        <div className={styles.heroIcon}>
          <Coins size={48} />
        </div>
        <h2 className={styles.heroTitle}>Why UTXO Management Matters</h2>
        <p className={styles.heroText}>
          Your Bitcoin wallet doesn't hold a single balance—it holds individual coins (UTXOs). 
          How you manage these coins directly impacts your transaction fees and privacy.
        </p>
      </div>

      <div className={styles.conceptGrid}>
        <Card padding="large" hover>
          <div className={styles.conceptIcon}>
            <TrendingDown size={24} />
          </div>
          <h3>UTXO Fragmentation</h3>
          <p>
            Over time, your wallet accumulates many small UTXOs from change and payments. 
            Like having a wallet full of pennies, this makes spending expensive.
          </p>
        </Card>

        <Card padding="large" hover>
          <div className={styles.conceptIcon}>
            <TrendingUp size={24} />
          </div>
          <h3>Fee Efficiency</h3>
          <p>
            Transaction fees depend on how many UTXOs you spend, not the amount. 
            Spending 10 small coins costs more than spending 1 large coin.
          </p>
        </Card>

        <Card padding="large" hover>
          <div className={styles.conceptIcon}>
            <EyeOff size={24} />
          </div>
          <h3>Privacy Trade-offs</h3>
          <p>
            Combining UTXOs reveals they belong to the same wallet. 
            Good UTXO management balances fee savings with privacy preservation.
          </p>
        </Card>
      </div>

      <Accordion title="Analogy: Managing Your Coin Jar" defaultOpen>
        <p>
          Imagine you have a jar of coins. Every time you buy something, you throw the change 
          back in. Over time, the jar fills up with pennies, nickels, and dimes.
        </p>
        <p>
          When you want to buy something big, you have two options:
        </p>
        <ul>
          <li>
            <strong>Count out hundreds of small coins</strong> - Takes forever, and the cashier 
            might charge you extra for the hassle (high fees)
          </li>
          <li>
            <strong>First roll your coins into larger denominations</strong> - Takes some effort 
            upfront, but future purchases are much easier (consolidation)
          </li>
        </ul>
        <p>
          Bitcoin works the same way. "Rolling your coins" is called <strong>consolidation</strong>, 
          and timing it right can save you significant fees.
        </p>
      </Accordion>

      <div className={styles.factBox}>
        <h4>The UTXO Impact</h4>
        <div className={styles.factGrid}>
          <div className={styles.fact}>
            <span className={styles.factValue}>~68 vB</span>
            <span className={styles.factLabel}>Size per input</span>
          </div>
          <div className={styles.fact}>
            <span className={styles.factValue}>10x</span>
            <span className={styles.factLabel}>More inputs = 10x fees</span>
          </div>
          <div className={styles.fact}>
            <span className={styles.factValue}>~$0.50-$50</span>
            <span className={styles.factLabel}>Fee range per input</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function ConsolidationSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={styles.section}
    >
      <h2 className={styles.sectionTitle}>UTXO Consolidation</h2>
      <p className={styles.sectionText}>
        Consolidation means combining multiple UTXOs into a single, larger UTXO. This reduces 
        the number of inputs needed for future transactions, saving fees—but it comes with 
        an important privacy trade-off.
      </p>

      <ConsolidationDemo />

      <div className={styles.warningBox} style={{ 
        background: 'rgba(247, 147, 26, 0.1)', 
        border: '1px solid rgba(247, 147, 26, 0.3)',
        borderRadius: '8px',
        padding: '1rem 1.5rem',
        marginTop: '2rem',
        marginBottom: '2rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
          <AlertTriangle size={20} style={{ color: 'var(--bitcoin-orange)', flexShrink: 0, marginTop: '0.125rem' }} />
          <div>
            <h4 style={{ color: 'var(--bitcoin-orange)', marginTop: 0, marginBottom: '0.5rem', fontSize: '0.95rem' }}>
              Why Consolidate Even If You Don't Save on Fees?
            </h4>
            <p style={{ margin: 0, lineHeight: '1.6' }}>
              As fee rates rise over time, small UTXOs can become <strong>dust</strong>—
              too expensive to ever spend. Consolidating them during low-fee periods prevents them from 
              becoming permanently locked. Think of it as preventative maintenance for your wallet's health.
            </p>
          </div>
        </div>
      </div>

      <div className={styles.keyPoints}>
        <h3>Key Considerations</h3>
        <ul>
          <li>
            <strong>Timing is everything:</strong> Consolidate during low-fee periods 
            (weekends, late nights) when fees drop to 1-5 sat/vB
          </li>
          <li>
            <strong>Privacy cost:</strong> Consolidation links all your UTXOs on-chain, 
            proving they belong to the same wallet
          </li>
          <li>
            <strong>Calculate the break-even:</strong> Only consolidate if future fee 
            savings exceed the consolidation cost
          </li>
          <li>
            <strong>Don't over-consolidate:</strong> Having a few medium-sized UTXOs is 
            better for privacy than one giant UTXO
          </li>
        </ul>
      </div>
    </motion.div>
  );
}

function CoinSelectionSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={styles.section}
    >
      <h2 className={styles.sectionTitle}>Coin Selection Strategies</h2>
      <p className={styles.sectionText}>
        When you make a transaction, your wallet must decide which UTXOs to spend. Different 
        algorithms optimize for different goals—some minimize fees, others maximize privacy, 
        and some try to balance both.
      </p>

      <CoinSelectionSimulator />

      <div className={styles.keyPoints}>
        <h3>Strategy Comparison</h3>
        <ul>
          <li>
            <strong>Largest First:</strong> Uses big coins first. Low fees now, but small 
            UTXOs accumulate over time
          </li>
          <li>
            <strong>Smallest First:</strong> Cleans up small UTXOs. Higher fees now, but 
            healthier wallet long-term
          </li>
          <li>
            <strong>Exact Match:</strong> Tries to avoid creating change. Better privacy 
            since there's no "leftover" to trace
          </li>
          <li>
            <strong>Random:</strong> Unpredictable selection. Makes chain analysis harder 
            but fees are unpredictable
          </li>
        </ul>
      </div>
    </motion.div>
  );
}

function DustSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={styles.section}
    >
      <h2 className={styles.sectionTitle}>Managing Dust UTXOs</h2>
      <p className={styles.sectionText}>
        "Dust" refers to UTXOs so small that spending them costs more in fees than they're 
        worth. At high fee rates, even moderately-sized UTXOs can become temporarily 
        uneconomical to spend.
      </p>

      <DustAnalyzer />

      <Accordion 
        title="Deep Dive: Preventing Dust Accumulation" 
        variant="deepdive"
        icon={<Sparkles size={16} />}
      >
        <p>
          Prevention is better than cure. Here's how to avoid creating dust in the first place:
        </p>
        <ul>
          <li>
            <strong>Set minimum receive amounts:</strong> Configure your wallet to warn 
            about incoming payments below a threshold (e.g., 10,000 sats)
          </li>
          <li>
            <strong>Use good wallets:</strong> Modern wallets like Sparrow and Bitcoin Core 
            have sophisticated coin selection that minimizes dust creation
          </li>
          <li>
            <strong>Coin control:</strong> Manually select which UTXOs to spend for 
            important transactions
          </li>
          <li>
            <strong>Batch transactions:</strong> Combine multiple payments into one 
            transaction to reduce the number of change outputs
          </li>
          <li>
            <strong>Lightning for small amounts:</strong> Use the Lightning Network for 
            small, frequent payments instead of on-chain transactions
          </li>
        </ul>
        <p>
          <strong>When you do have dust:</strong> Wait for extremely low-fee periods 
          (often during Bitcoin's "quiet" times) and consolidate it along with other 
          small UTXOs. Accept the privacy trade-off as the cost of cleaning up your wallet.
        </p>
      </Accordion>
    </motion.div>
  );
}

export default UTXOManagementLesson;
