import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Check,
  X,
  AlertTriangle,
  ChevronRight,
  RefreshCw,
  Lightbulb
} from 'lucide-react';
import { Card, Button, Badge, Accordion } from '../../common';
import styles from './PrivacyScorecard.module.css';

const practices = [
  {
    id: 'fresh-address',
    title: 'Use fresh addresses for each transaction',
    description: 'Never reuse addresses. Modern wallets do this automatically.',
    weight: 15,
    tips: [
      'Enable "generate new address" in your wallet settings',
      'Share a new address for each payment you receive',
      'Consider using a wallet that enforces this automatically'
    ]
  },
  {
    id: 'coinjoin',
    title: 'Use CoinJoin or mixing services',
    description: 'Break transaction links by mixing your coins with others.',
    weight: 20,
    tips: [
      'Use Wasabi Wallet for automated CoinJoin',
      'Multiple rounds of mixing provide better privacy',
      'Mix coins before making sensitive purchases'
    ]
  },
  {
    id: 'full-node',
    title: 'Run your own full node',
    description: 'Avoid leaking transaction data to third-party servers.',
    weight: 10,
    tips: [
      'Bitcoin Core is the reference implementation',
      'Use hardware like Umbrel or Start9 for easy setup',
      'Connect your wallet to your own node via Electrum'
    ]
  },
  {
    id: 'tor',
    title: 'Use Tor or VPN',
    description: 'Hide your IP address when broadcasting transactions.',
    weight: 10,
    tips: [
      'Enable Tor in your wallet settings if available',
      'Use Tor Browser for any Bitcoin-related web activity',
      'Consider running a VPN as a baseline protection'
    ]
  },
  {
    id: 'utxo-management',
    title: 'Practice good UTXO management',
    description: 'Be mindful of which coins you spend together.',
    weight: 15,
    tips: [
      'Label your UTXOs by source',
      'Avoid combining coins from different sources',
      'Use coin control features in advanced wallets'
    ]
  },
  {
    id: 'avoid-kyc',
    title: 'Minimize KYC exposure',
    description: 'Limit how much personal info is linked to your Bitcoin.',
    weight: 20,
    tips: [
      'Consider peer-to-peer exchanges like Bisq or HodlHodl',
      'Use Bitcoin ATMs for small amounts (check privacy policies)',
      'Accept Bitcoin as payment for goods/services'
    ]
  },
  {
    id: 'lightning',
    title: 'Use Lightning Network for payments',
    description: 'Lightning offers better privacy than on-chain transactions.',
    weight: 10,
    tips: [
      'Lightning payments are not recorded on the blockchain',
      'Onion routing hides sender/receiver from intermediate nodes',
      'Use private (unannounced) channels when possible'
    ]
  }
];

export function PrivacyScorecard() {
  const [scores, setScores] = useState({});
  const [expandedTip, setExpandedTip] = useState(null);
  
  const toggleScore = (id) => {
    setScores(prev => ({
      ...prev,
      [id]: prev[id] === 'yes' ? 'no' : prev[id] === 'no' ? undefined : 'yes'
    }));
  };
  
  const totalScore = practices.reduce((sum, p) => {
    if (scores[p.id] === 'yes') return sum + p.weight;
    return sum;
  }, 0);
  
  const getGrade = () => {
    if (totalScore >= 80) return { label: 'Excellent', color: 'success', icon: Shield };
    if (totalScore >= 60) return { label: 'Good', color: 'info', icon: Check };
    if (totalScore >= 40) return { label: 'Fair', color: 'warning', icon: AlertTriangle };
    return { label: 'Needs Work', color: 'error', icon: X };
  };
  
  const grade = getGrade();
  const GradeIcon = grade.icon;
  
  const reset = () => {
    setScores({});
    setExpandedTip(null);
  };

  return (
    <div className={styles.container}>
      <Card variant="elevated" padding="large">
        <div className={styles.header}>
          <div className={styles.titleSection}>
            <div className={styles.iconWrapper}>
              <Shield size={24} />
            </div>
            <div>
              <h3 className={styles.title}>Privacy Scorecard</h3>
              <p className={styles.subtitle}>
                Assess your Bitcoin privacy practices
              </p>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="small"
            icon={<RefreshCw size={14} />}
            onClick={reset}
          >
            Reset
          </Button>
        </div>

        {/* Score Display */}
        <div className={styles.scoreSection}>
          <div className={`${styles.scoreCircle} ${styles[grade.color]}`}>
            <span className={styles.scoreValue}>{totalScore}</span>
            <span className={styles.scoreMax}>/100</span>
          </div>
          <div className={styles.gradeInfo}>
            <Badge variant={grade.color} size="medium" icon={<GradeIcon size={14} />}>
              {grade.label}
            </Badge>
            <p>
              {totalScore === 0 
                ? 'Click on practices below to rate yourself'
                : `You're following ${Object.values(scores).filter(s => s === 'yes').length} of ${practices.length} recommended practices`
              }
            </p>
          </div>
        </div>

        {/* Practices List */}
        <div className={styles.practicesList}>
          {practices.map(practice => (
            <div key={practice.id} className={styles.practiceItem}>
              <div className={styles.practiceMain}>
                <button
                  className={`${styles.practiceToggle} ${
                    scores[practice.id] === 'yes' ? styles.yes : 
                    scores[practice.id] === 'no' ? styles.no : ''
                  }`}
                  onClick={() => toggleScore(practice.id)}
                >
                  {scores[practice.id] === 'yes' ? (
                    <Check size={18} />
                  ) : scores[practice.id] === 'no' ? (
                    <X size={18} />
                  ) : (
                    <span className={styles.emptyCheck} />
                  )}
                </button>
                
                <div className={styles.practiceContent}>
                  <div className={styles.practiceHeader}>
                    <span className={styles.practiceTitle}>{practice.title}</span>
                    <Badge variant="outline" size="small">+{practice.weight} pts</Badge>
                  </div>
                  <p className={styles.practiceDescription}>{practice.description}</p>
                </div>
                
                <button
                  className={`${styles.tipToggle} ${expandedTip === practice.id ? styles.expanded : ''}`}
                  onClick={() => setExpandedTip(expandedTip === practice.id ? null : practice.id)}
                >
                  <Lightbulb size={16} />
                  <ChevronRight size={14} />
                </button>
              </div>
              
              {expandedTip === practice.id && (
                <motion.div
                  className={styles.tips}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <h5><Lightbulb size={14} /> Tips to Implement</h5>
                  <ul>
                    {practice.tips.map((tip, i) => (
                      <li key={i}>{tip}</li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </div>
          ))}
        </div>

        {/* Summary */}
        {totalScore > 0 && (
          <motion.div
            className={styles.summary}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h4>Your Privacy Profile</h4>
            <div className={styles.summaryGrid}>
              <div className={styles.summaryItem}>
                <span className={styles.summaryValue}>
                  {Object.values(scores).filter(s => s === 'yes').length}
                </span>
                <span className={styles.summaryLabel}>Practices followed</span>
              </div>
              <div className={styles.summaryItem}>
                <span className={styles.summaryValue}>
                  {Object.values(scores).filter(s => s === 'no').length}
                </span>
                <span className={styles.summaryLabel}>Areas to improve</span>
              </div>
              <div className={styles.summaryItem}>
                <span className={styles.summaryValue}>
                  {100 - totalScore}
                </span>
                <span className={styles.summaryLabel}>Points available</span>
              </div>
            </div>
          </motion.div>
        )}
      </Card>

      <Accordion
        title="Deep Dive: The Privacy Spectrum"
        variant="deepdive"
        icon={<Shield size={16} />}
      >
        <p>
          Bitcoin privacy isn't all-or-nothing - it's a spectrum. Different 
          threat models require different levels of protection:
        </p>
        <ul>
          <li>
            <strong>Basic:</strong> Fresh addresses and avoiding obvious mistakes 
            protects against casual observers
          </li>
          <li>
            <strong>Moderate:</strong> Adding CoinJoin and running your own node 
            protects against most chain analysis
          </li>
          <li>
            <strong>Advanced:</strong> Full Tor integration, careful UTXO management, 
            and avoiding KYC protects against sophisticated adversaries
          </li>
        </ul>
        <p>
          Remember: Privacy is about <strong>raising the cost of surveillance</strong>. 
          You don't need perfect privacy - you just need enough to make tracking 
          economically unfeasible for your specific situation.
        </p>
      </Accordion>
    </div>
  );
}

export default PrivacyScorecard;
