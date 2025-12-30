import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  AlertTriangle, 
  Timer, 
  Key,
  Bomb,
  UserX,
  Database,
  Lock,
  Unlock
} from 'lucide-react';
import { Card, Accordion } from '../../common';
import styles from './AdvancedFeatures.module.css';

const trickPINs = [
  {
    id: 'duress',
    title: 'Duress PIN',
    icon: UserX,
    color: 'var(--warning)',
    description: 'A secondary PIN that opens a decoy wallet with a small amount of Bitcoin. If forced to reveal your PIN, give this one instead.',
    scenario: 'Someone threatens you to reveal your Bitcoin. You give them the duress PIN, which opens a wallet with $500. Your main holdings remain hidden and safe.',
    tip: 'Keep a believable amount in the duress wallet'
  },
  {
    id: 'brick',
    title: 'Brick Me PIN',
    icon: Bomb,
    color: 'var(--error)',
    description: 'Entering this PIN permanently destroys the secure elements, rendering the device useless. Your seed backup is your only recovery.',
    scenario: 'You\'re being coerced and have no way out. Entering the Brick Me PIN destroys all evidence of your Bitcoin holdings on the device.',
    tip: 'Only set this if you have secure seed backups'
  },
  {
    id: 'countdown',
    title: 'Login Countdown',
    icon: Timer,
    color: 'var(--info)',
    description: 'Forces a time delay (minutes to days) between entering your PIN and accessing the wallet. Deters quick theft.',
    scenario: 'A thief steals your Coldcard and PIN. The 24-hour countdown gives you time to move funds using your seed backup before they can access the device.',
    tip: 'Combine with Countdown to Brick for extra protection'
  }
];

const advancedFeatures = [
  {
    id: 'passphrase',
    title: 'BIP39 Passphrase (25th Word)',
    icon: Key,
    description: 'Add an extra word to your 24-word seed to create unlimited hidden wallets. Each passphrase creates a completely different wallet.',
    benefits: [
      'Unlimited decoy wallets from one seed',
      'Passphrase is never stored on device',
      'Plausible deniability - no way to prove other wallets exist'
    ]
  },
  {
    id: 'seed-vault',
    title: 'Seed Vault',
    icon: Database,
    description: 'Store multiple seed phrases on your Coldcard, encrypted with your master seed. Switch between wallets without re-entering seeds.',
    benefits: [
      'Manage multiple wallets on one device',
      'Seeds encrypted with AES-256',
      'Quick switching for different accounts'
    ]
  },
  {
    id: 'secure-notes',
    title: 'Secure Notes & Passwords',
    icon: Lock,
    description: 'Store sensitive text like passwords, recovery codes, or notes. Protected by the same security as your seed phrase.',
    benefits: [
      'Hardware-secured password manager',
      'Display via QR for easy transfer',
      'Encrypted with your master key'
    ]
  }
];

function TrickPINDiagram() {
  return (
    <svg viewBox="0 0 400 200" className={styles.trickPinSvg}>
      {/* Main path - Real PIN */}
      <g>
        <rect x="20" y="80" width="80" height="40" rx="8" fill="var(--bg-tertiary)" stroke="var(--border-medium)" strokeWidth="2" />
        <text x="60" y="105" textAnchor="middle" fill="var(--text-secondary)" fontSize="11">Enter PIN</text>
      </g>
      
      <path d="M100 100 L140 100" stroke="var(--border-medium)" strokeWidth="2" />
      
      {/* Decision point */}
      <g transform="translate(140, 70)">
        <polygon points="30,0 60,30 30,60 0,30" fill="var(--bg-tertiary)" stroke="var(--border-medium)" strokeWidth="2" />
        <text x="30" y="35" textAnchor="middle" fill="var(--text-muted)" fontSize="9">Which PIN?</text>
      </g>
      
      {/* Real PIN path */}
      <path d="M200 85 L240 60" stroke="var(--success)" strokeWidth="2" />
      <g transform="translate(240, 30)">
        <rect width="100" height="50" rx="8" fill="var(--success)" fillOpacity="0.1" stroke="var(--success)" strokeWidth="2" />
        <text x="50" y="22" textAnchor="middle" fill="var(--success)" fontSize="10" fontWeight="600">Real PIN</text>
        <text x="50" y="38" textAnchor="middle" fill="var(--text-muted)" fontSize="8">Full access</text>
      </g>
      
      {/* Duress PIN path */}
      <path d="M200 100 L240 100" stroke="var(--warning)" strokeWidth="2" />
      <g transform="translate(240, 80)">
        <rect width="100" height="50" rx="8" fill="var(--warning)" fillOpacity="0.1" stroke="var(--warning)" strokeWidth="2" />
        <text x="50" y="22" textAnchor="middle" fill="var(--warning)" fontSize="10" fontWeight="600">Duress PIN</text>
        <text x="50" y="38" textAnchor="middle" fill="var(--text-muted)" fontSize="8">Decoy wallet</text>
      </g>
      
      {/* Brick PIN path */}
      <path d="M200 115 L240 150" stroke="var(--error)" strokeWidth="2" />
      <g transform="translate(240, 140)">
        <rect width="100" height="50" rx="8" fill="var(--error)" fillOpacity="0.1" stroke="var(--error)" strokeWidth="2" />
        <text x="50" y="22" textAnchor="middle" fill="var(--error)" fontSize="10" fontWeight="600">Brick PIN</text>
        <text x="50" y="38" textAnchor="middle" fill="var(--text-muted)" fontSize="8">Device destroyed</text>
      </g>
      
      {/* Results */}
      <g transform="translate(360, 30)">
        <circle r="15" fill="var(--success)" fillOpacity="0.2" />
        <text y="4" textAnchor="middle" fill="var(--success)" fontSize="12">✓</text>
      </g>
      <path d="M340 55 L345 55" stroke="var(--success)" strokeWidth="2" />
      
      <g transform="translate(360, 105)">
        <circle r="15" fill="var(--warning)" fillOpacity="0.2" />
        <text y="4" textAnchor="middle" fill="var(--warning)" fontSize="10">$</text>
      </g>
      <path d="M340 105 L345 105" stroke="var(--warning)" strokeWidth="2" />
      
      <g transform="translate(360, 165)">
        <circle r="15" fill="var(--error)" fillOpacity="0.2" />
        <text y="4" textAnchor="middle" fill="var(--error)" fontSize="12">✕</text>
      </g>
      <path d="M340 165 L345 165" stroke="var(--error)" strokeWidth="2" />
    </svg>
  );
}

export function AdvancedFeatures() {
  const [expandedTrick, setExpandedTrick] = useState(null);

  return (
    <div className={styles.container}>
      {/* Trick PINs section */}
      <Card variant="elevated" padding="large">
        <div className={styles.sectionHeader}>
          <div className={styles.headerIcon}>
            <Shield size={24} />
          </div>
          <div>
            <h4 className={styles.sectionTitle}>Trick PIN System</h4>
            <p className={styles.sectionDescription}>
              Multiple PIN codes for different security scenarios. Protect yourself against 
              physical threats with plausible deniability.
            </p>
          </div>
        </div>
        
        <div className={styles.diagramContainer}>
          <TrickPINDiagram />
        </div>
        
        <div className={styles.trickPINList}>
          {trickPINs.map((trick, index) => {
            const Icon = trick.icon;
            const isExpanded = expandedTrick === trick.id;
            
            return (
              <motion.div
                key={trick.id}
                className={`${styles.trickPINCard} ${isExpanded ? styles.expanded : ''}`}
                onClick={() => setExpandedTrick(isExpanded ? null : trick.id)}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className={styles.trickHeader}>
                  <div 
                    className={styles.trickIcon}
                    style={{ background: `${trick.color}20`, color: trick.color }}
                  >
                    <Icon size={18} />
                  </div>
                  <div className={styles.trickInfo}>
                    <h5 className={styles.trickTitle}>{trick.title}</h5>
                    <p className={styles.trickDescription}>{trick.description}</p>
                  </div>
                </div>
                
                {isExpanded && (
                  <motion.div
                    className={styles.trickDetails}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                  >
                    <div className={styles.scenarioBox}>
                      <h6>Example Scenario</h6>
                      <p>{trick.scenario}</p>
                    </div>
                    <div className={styles.tipBox} style={{ borderColor: trick.color }}>
                      <AlertTriangle size={14} style={{ color: trick.color }} />
                      <span><strong>Tip:</strong> {trick.tip}</span>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
      </Card>
      
      {/* Other advanced features */}
      <div className={styles.featuresGrid}>
        {advancedFeatures.map((feature, index) => {
          const Icon = feature.icon;
          
          return (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
            >
              <Card padding="large" className={styles.featureCard}>
                <div className={styles.featureIcon}>
                  <Icon size={24} />
                </div>
                <h4 className={styles.featureTitle}>{feature.title}</h4>
                <p className={styles.featureDescription}>{feature.description}</p>
                <ul className={styles.featureBenefits}>
                  {feature.benefits.map((benefit, i) => (
                    <li key={i}>{benefit}</li>
                  ))}
                </ul>
              </Card>
            </motion.div>
          );
        })}
      </div>
      
      {/* Important note */}
      <Accordion
        title="When to Use These Features"
        variant="deepdive"
        icon={<AlertTriangle size={16} />}
      >
        <p>
          These advanced features are powerful but not necessary for most users. Consider using them if:
        </p>
        <ul>
          <li><strong>You hold significant value</strong> - Larger holdings justify more complex security</li>
          <li><strong>You travel frequently</strong> - Border crossings or travel to high-risk areas</li>
          <li><strong>You have physical security concerns</strong> - Home invasion, kidnapping risks</li>
          <li><strong>You want plausible deniability</strong> - Ability to deny existence of other wallets</li>
        </ul>
        <p>
          <strong>Remember:</strong> The most important security measure is having secure, tested backups of 
          your seed phrase. All Trick PINs and advanced features are useless if you can't recover 
          your Bitcoin from your seed backup.
        </p>
      </Accordion>
    </div>
  );
}

export default AdvancedFeatures;
