import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Shield,
  DollarSign,
  Clock,
  Users,
  Lightbulb,
  HardDrive,
  MapPin,
  FileCheck,
  TestTube
} from 'lucide-react';
import { Card, Accordion } from '../../common';
import styles from './BestPractices.module.css';

const dosAndDonts = {
  dos: [
    {
      icon: TestTube,
      title: 'Test with small amounts first',
      description: 'Send a small test transaction before depositing significant funds. Verify you can actually spend.'
    },
    {
      icon: MapPin,
      title: 'Store keys in different locations',
      description: 'Geographic distribution protects against localized disasters like fire, flood, or theft.'
    },
    {
      icon: HardDrive,
      title: 'Use different hardware vendors',
      description: 'Mix brands (e.g., Coldcard + Trezor) to avoid single-vendor firmware vulnerabilities.'
    },
    {
      icon: FileCheck,
      title: 'Back up the wallet descriptor',
      description: 'The output descriptor is required to reconstruct your wallet. Store copies with each seed backup.'
    },
    {
      icon: Users,
      title: 'Document your setup for heirs',
      description: 'Write clear instructions for family/trustees. They need to understand how to access funds.'
    },
    {
      icon: Clock,
      title: 'Periodically verify access',
      description: 'Every 6-12 months, confirm you can still sign with each key. Don\'t wait for an emergency.'
    }
  ],
  donts: [
    {
      icon: MapPin,
      title: 'Store all keys in the same location',
      description: 'A single disaster could destroy all keys, making funds permanently inaccessible.'
    },
    {
      icon: HardDrive,
      title: 'Use only one hardware wallet vendor',
      description: 'A firmware bug or supply chain attack affecting one vendor could compromise all keys.'
    },
    {
      icon: FileCheck,
      title: 'Forget to back up the descriptor',
      description: 'Without the output descriptor, you cannot reconstruct the wallet even with all seeds.'
    },
    {
      icon: TestTube,
      title: 'Skip testing before large deposits',
      description: 'Your first real use shouldn\'t be an emergency. Always verify the setup works first.'
    },
    {
      icon: Users,
      title: 'Make it too complex',
      description: 'A 7-of-11 setup you can\'t actually use is worse than a simple 2-of-3 you can manage.'
    }
  ]
};

const securityTiers = [
  {
    tier: 'Learning',
    value: '< $1,000',
    color: 'var(--success)',
    recommendation: 'Single-sig hardware wallet is sufficient for learning. The complexity of multisig isn\'t worth it yet.',
    setup: 'Single hardware wallet with seed backup'
  },
  {
    tier: 'Moderate',
    value: '$1K - $50K',
    color: 'var(--info)',
    recommendation: 'Consider 2-of-3 multisig with two hardware wallets and one paper backup.',
    setup: '2-of-3: Hardware wallet (home) + Hardware wallet (secure location) + Paper backup'
  },
  {
    tier: 'Significant',
    value: '$50K - $500K',
    color: 'var(--warning)',
    recommendation: '2-of-3 with geographic distribution and different vendors. Consider professional guidance.',
    setup: '2-of-3: Coldcard (home) + Trezor (bank safe) + Paper/Metal (family)'
  },
  {
    tier: 'High Value',
    value: '$500K+',
    color: 'var(--bitcoin-orange)',
    recommendation: '3-of-5 or collaborative custody with professional services. Involve legal/estate planning.',
    setup: '3-of-5 or 2-of-3 with Unchained/Casa holding one key for recovery'
  }
];

const commonMistakes = [
  {
    title: 'Single Vendor Dependency',
    description: 'Using three Ledgers means one firmware bug could affect all your keys. Mix vendors: Coldcard + Trezor + Ledger, or similar.',
    severity: 'high'
  },
  {
    title: 'Same Location Storage',
    description: 'Keeping all keys at home means a house fire destroys everything. Distribute keys across home, bank, and trusted family.',
    severity: 'high'
  },
  {
    title: 'No Practice Run',
    description: 'Many people set up multisig but never test it until they need to spend. By then, they\'ve forgotten how or lost access.',
    severity: 'medium'
  },
  {
    title: 'Lost Descriptor',
    description: 'You have all three seeds but no output descriptor. You cannot recreate the wallet addresses. Funds appear lost forever.',
    severity: 'high'
  },
  {
    title: 'Over-Engineering',
    description: 'A 5-of-9 setup sounds secure, but coordinating 5 signers for every transaction is impractical. Simple setups get used; complex ones get abandoned.',
    severity: 'medium'
  },
  {
    title: 'No Inheritance Plan',
    description: 'Your heirs don\'t know the setup exists, where keys are, or how to use them. Your Bitcoin could be lost forever.',
    severity: 'medium'
  }
];

const whenNotToUse = [
  {
    icon: DollarSign,
    title: 'Very Small Amounts',
    description: 'The complexity overhead isn\'t worth it for amounts you\'d be OK losing. A hardware wallet is simpler and sufficient.'
  },
  {
    icon: Clock,
    title: 'Frequent Spending',
    description: 'If you need to spend regularly, coordinating multiple signatures becomes frustrating. Use single-sig for spending wallets.'
  },
  {
    icon: Users,
    title: 'Single User, No Inheritance Concerns',
    description: 'If it\'s just you and you\'re young with no dependents, a well-secured single-sig setup may be simpler.'
  },
  {
    icon: Lightbulb,
    title: 'Insufficient Technical Understanding',
    description: 'If you don\'t fully understand the setup, you risk locking yourself out. Learn thoroughly before committing large amounts.'
  }
];

export function BestPractices() {
  return (
    <div className={styles.container}>
      {/* Do's and Don'ts */}
      <Card variant="elevated" padding="large">
        <h4 className={styles.sectionTitle}>Best Practices Checklist</h4>
        
        <div className={styles.dosAndDonts}>
          <div className={styles.dosSection}>
            <div className={styles.sectionHeader}>
              <CheckCircle size={20} />
              <h5>Do</h5>
            </div>
            <div className={styles.practicesList}>
              {dosAndDonts.dos.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.div 
                    key={index} 
                    className={styles.practiceItem}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <div className={styles.practiceIcon}>
                      <Icon size={16} />
                    </div>
                    <div className={styles.practiceContent}>
                      <strong>{item.title}</strong>
                      <p>{item.description}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
          
          <div className={styles.dontsSection}>
            <div className={styles.sectionHeader}>
              <XCircle size={20} />
              <h5>Don't</h5>
            </div>
            <div className={styles.practicesList}>
              {dosAndDonts.donts.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.div 
                    key={index} 
                    className={styles.practiceItem}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <div className={styles.practiceIcon}>
                      <Icon size={16} />
                    </div>
                    <div className={styles.practiceContent}>
                      <strong>{item.title}</strong>
                      <p>{item.description}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </Card>
      
      {/* Security Tiers */}
      <Card variant="elevated" padding="large">
        <h4 className={styles.sectionTitle}>Recommended Setups by Value</h4>
        <p className={styles.sectionDescription}>
          Security should be proportional to what you're protecting. Here's a general guide:
        </p>
        
        <div className={styles.tiersGrid}>
          {securityTiers.map((tier, index) => (
            <motion.div
              key={tier.tier}
              className={styles.tierCard}
              style={{ '--tier-color': tier.color }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className={styles.tierHeader}>
                <span className={styles.tierName}>{tier.tier}</span>
                <span className={styles.tierValue}>{tier.value}</span>
              </div>
              <p className={styles.tierRecommendation}>{tier.recommendation}</p>
              <div className={styles.tierSetup}>
                <strong>Suggested:</strong> {tier.setup}
              </div>
            </motion.div>
          ))}
        </div>
      </Card>
      
      {/* Common Mistakes */}
      <Accordion
        title="Common Mistakes to Avoid"
        variant="deepdive"
        icon={<AlertTriangle size={16} />}
        defaultOpen
      >
        <div className={styles.mistakesList}>
          {commonMistakes.map((mistake, index) => (
            <div key={index} className={`${styles.mistakeItem} ${styles[mistake.severity]}`}>
              <div className={styles.mistakeHeader}>
                <span className={styles.mistakeTitle}>{mistake.title}</span>
                <span className={`${styles.severityBadge} ${styles[mistake.severity]}`}>
                  {mistake.severity === 'high' ? 'Critical' : 'Important'}
                </span>
              </div>
              <p className={styles.mistakeDescription}>{mistake.description}</p>
            </div>
          ))}
        </div>
      </Accordion>
      
      {/* When NOT to use multisig */}
      <Card variant="elevated" padding="large">
        <h4 className={styles.sectionTitle}>When NOT to Use Multisig</h4>
        <p className={styles.sectionDescription}>
          Multisig isn't always the answer. Sometimes simpler solutions are better:
        </p>
        
        <div className={styles.whenNotGrid}>
          {whenNotToUse.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={index} className={styles.whenNotItem}>
                <div className={styles.whenNotIcon}>
                  <Icon size={20} />
                </div>
                <div className={styles.whenNotContent}>
                  <strong>{item.title}</strong>
                  <p>{item.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
      
      {/* Final Recommendation */}
      <div className={styles.finalRecommendation}>
        <Shield size={24} />
        <div>
          <strong>Start Simple, Upgrade Later</strong>
          <p>
            Begin with a 2-of-3 setup using two hardware wallets from different vendors plus 
            a paper/metal backup. Test thoroughly with small amounts. Document everything. 
            You can always migrate to a more complex setup as your experience and holdings grow.
          </p>
        </div>
      </div>
    </div>
  );
}

export default BestPractices;
