import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Smartphone,
  HardDrive,
  Wifi,
  WifiOff,
  Shield,
  Zap,
  AlertTriangle,
  Check,
  X,
  Laptop,
  Lock
} from 'lucide-react';
import { Card, Button, Badge, Accordion } from '../../common';
import styles from './WalletTypesExplorer.module.css';

const walletExamples = {
  hot: [
    { name: 'Mobile Wallets', icon: Smartphone, examples: ['Blue Wallet', 'Nunchuk', 'Bull Bitcoin Wallet'], description: 'Apps on your phone for daily spending' },
    { name: 'Desktop Wallets', icon: Laptop, examples: ['Sparrow', 'Nunchuk', 'Bitcoin Core'], description: 'Software on your computer' }
  ],
  cold: [
    { name: 'Hardware Wallets', icon: HardDrive, examples: ['Coldcard', 'Trezor', 'Jade'], description: 'Dedicated physical devices for secure storage' },
    { name: 'Paper/Steel Wallets', icon: Lock, examples: ['Printed keys', 'Steel backups'], description: 'Keys stored on physical media only' },
    { name: 'Air-Gapped Devices', icon: WifiOff, examples: ['Offline computer', 'DIY solutions'], description: 'Completely isolated from internet' }
  ]
};

const comparisonData = [
  { 
    feature: 'Internet Connection', 
    hot: { value: 'Always connected', icon: Wifi, variant: 'warning' }, 
    cold: { value: 'Offline/disconnected', icon: WifiOff, variant: 'success' }
  },
  { 
    feature: 'Security Level', 
    hot: { value: 'Moderate', icon: AlertTriangle, variant: 'warning' }, 
    cold: { value: 'Very high', icon: Shield, variant: 'success' }
  },
  { 
    feature: 'Transaction Speed', 
    hot: { value: 'Instant', icon: Zap, variant: 'success' }, 
    cold: { value: 'Slower process', icon: AlertTriangle, variant: 'warning' }
  },
  { 
    feature: 'Vulnerable To', 
    hot: { value: 'Malware, hacks, phishing', icon: AlertTriangle, variant: 'error' }, 
    cold: { value: 'Physical theft only', icon: Shield, variant: 'success' }
  },
  { 
    feature: 'Best Use Case', 
    hot: { value: 'Daily spending, small amounts', icon: Check, variant: 'neutral' }, 
    cold: { value: 'Long-term savings, large amounts', icon: Check, variant: 'neutral' }
  },
  { 
    feature: 'Setup Difficulty', 
    hot: { value: 'Easy', icon: Check, variant: 'success' }, 
    cold: { value: 'Moderate to complex', icon: AlertTriangle, variant: 'warning' }
  },
  { 
    feature: 'Cost', 
    hot: { value: 'Free', icon: Check, variant: 'success' }, 
    cold: { value: '$50-$300 for hardware', icon: AlertTriangle, variant: 'warning' }
  }
];

export function WalletTypesExplorer() {
  const [selectedType, setSelectedType] = useState('hot');
  const [riskLevel, setRiskLevel] = useState(5); // 0-10 scale

  const getRiskAssessment = () => {
    if (riskLevel <= 3) return { label: 'Low Risk', color: 'success', recommendation: 'Hot wallet is fine for this amount' };
    if (riskLevel <= 6) return { label: 'Medium Risk', color: 'warning', recommendation: 'Consider a hardware wallet' };
    return { label: 'High Risk', color: 'error', recommendation: 'Use cold storage (hardware wallet required)' };
  };

  const risk = getRiskAssessment();

  return (
    <div className={styles.container}>
      <Card variant="elevated" padding="large">
        <div className={styles.header}>
          <div className={styles.titleSection}>
            <div className={styles.iconWrapper}>
              <Shield size={24} />
            </div>
            <div>
              <h3 className={styles.title}>Hot vs Cold Wallets</h3>
              <p className={styles.subtitle}>
                Understanding wallet types and choosing the right security level
              </p>
            </div>
          </div>
        </div>

        {/* Wallet Type Toggle */}
        <div className={styles.typeToggle}>
          <button
            className={`${styles.typeButton} ${selectedType === 'hot' ? styles.active : ''} ${styles.hotButton}`}
            onClick={() => setSelectedType('hot')}
          >
            <Wifi size={20} />
            <div>
              <div className={styles.typeName}>Hot Wallets</div>
              <div className={styles.typeTagline}>Connected & Convenient</div>
            </div>
          </button>
          <button
            className={`${styles.typeButton} ${selectedType === 'cold' ? styles.active : ''} ${styles.coldButton}`}
            onClick={() => setSelectedType('cold')}
          >
            <WifiOff size={20} />
            <div>
              <div className={styles.typeName}>Cold Wallets</div>
              <div className={styles.typeTagline}>Offline & Secure</div>
            </div>
          </button>
        </div>

        {/* Wallet Examples */}
        <motion.div 
          key={selectedType}
          className={styles.examplesSection}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h4 className={styles.sectionTitle}>
            {selectedType === 'hot' ? 'Hot Wallet' : 'Cold Wallet'} Types
          </h4>
          <div className={styles.examplesGrid}>
            {walletExamples[selectedType].map((wallet, index) => (
              <motion.div
                key={wallet.name}
                className={styles.exampleCard}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className={styles.exampleIcon}>
                  <wallet.icon size={24} />
                </div>
                <h5 className={styles.exampleName}>{wallet.name}</h5>
                <p className={styles.exampleDescription}>{wallet.description}</p>
                <div className={styles.exampleTags}>
                  {wallet.examples.map(ex => (
                    <span key={ex} className={styles.exampleTag}>{ex}</span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Comparison Table */}
        <div className={styles.comparisonSection}>
          <h4 className={styles.sectionTitle}>Feature Comparison</h4>
          <div className={styles.comparisonTable}>
            <div className={styles.tableHeader}>
              <div className={styles.featureColumn}>Feature</div>
              <div className={styles.hotColumn}>
                <Wifi size={16} />
                Hot Wallet
              </div>
              <div className={styles.coldColumn}>
                <WifiOff size={16} />
                Cold Wallet
              </div>
            </div>
            {comparisonData.map((row, index) => (
              <motion.div
                key={row.feature}
                className={styles.tableRow}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className={styles.featureColumn}>{row.feature}</div>
                <div className={styles.valueColumn}>
                  <Badge variant={row.hot.variant} size="small">
                    {row.hot.value}
                  </Badge>
                </div>
                <div className={styles.valueColumn}>
                  <Badge variant={row.cold.variant} size="small">
                    {row.cold.value}
                  </Badge>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Risk Assessment */}
        <div className={styles.riskSection}>
          <h4 className={styles.sectionTitle}>Risk Assessment Tool</h4>
          <p className={styles.riskQuestion}>
            How much Bitcoin are you storing? (Slide to see recommendation)
          </p>
          
          <div className={styles.riskSlider}>
            <div className={styles.sliderLabels}>
              <span>Small amount<br/>(~$100)</span>
              <span>Medium<br/>(~$1,000)</span>
              <span>Large<br/>($5,000+)</span>
            </div>
            <input
              type="range"
              min="0"
              max="10"
              value={riskLevel}
              onChange={(e) => setRiskLevel(Number(e.target.value))}
              className={styles.slider}
            />
          </div>

          <motion.div 
            key={risk.label}
            className={`${styles.riskResult} ${styles[risk.color]}`}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <div className={styles.riskBadge}>
              <Shield size={20} />
              {risk.label}
            </div>
            <p className={styles.riskRecommendation}>{risk.recommendation}</p>
          </motion.div>
        </div>

        {/* Best Practices */}
        <div className={styles.bestPractices}>
          <h4 className={styles.sectionTitle}>Best Practices</h4>
          <div className={styles.practicesGrid}>
            <div className={styles.practiceCard}>
              <Zap size={20} className={styles.practiceIcon} />
              <h5>Use Both Types</h5>
              <p>Keep small amounts in a hot wallet for convenience, large amounts in cold storage for security.</p>
            </div>
            <div className={styles.practiceCard}>
              <Shield size={20} className={styles.practiceIcon} />
              <h5>Start with Hardware</h5>
              <p>If you're serious about Bitcoin, invest in a hardware wallet early. It's worth the ~$100 cost.</p>
            </div>
            <div className={styles.practiceCard}>
              <Lock size={20} className={styles.practiceIcon} />
              <h5>Never Trust, Verify</h5>
              <p>Always verify wallet software signatures and buy hardware wallets directly from manufacturers.</p>
            </div>
          </div>
        </div>
      </Card>

      <Accordion
        title="Deep Dive: Threat Models"
        variant="deepdive"
        icon={<Shield size={16} />}
      >
        <p><strong>Hot Wallet Threats:</strong></p>
        <ul>
          <li><strong>Malware/Keyloggers:</strong> Software that steals your keys or seed phrase</li>
          <li><strong>Phishing:</strong> Fake websites or apps that trick you into revealing credentials</li>
          <li><strong>Remote Hacks:</strong> Attackers gaining access to your device over the internet</li>
          <li><strong>Clipboard Hijacking:</strong> Malware that changes Bitcoin addresses when you copy/paste</li>
        </ul>
        
        <p><strong>Cold Wallet Threats:</strong></p>
        <ul>
          <li><strong>Physical Theft:</strong> Someone stealing your hardware wallet or backup</li>
          <li><strong>Supply Chain Attacks:</strong> Buying tampered devices (always buy from manufacturer)</li>
          <li><strong>Loss/Damage:</strong> Losing device or backup, fire/water damage (mitigate with multiple backups)</li>
          <li><strong>$5 Wrench Attack:</strong> Physical coercion (use passphrase, don't advertise holdings)</li>
        </ul>

        <p>
          <strong>The Trade-off:</strong> Hot wallets protect against physical threats but are vulnerable 
          to digital attacks. Cold wallets protect against digital threats but require careful physical 
          security. The best approach is layered security using both.
        </p>
      </Accordion>
    </div>
  );
}

export default WalletTypesExplorer;
