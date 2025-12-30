import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Download, 
  HardDrive, 
  Eye,
  Key,
  Shield,
  CheckCircle,
  ArrowRight,
  Info
} from 'lucide-react';
import { Card } from '../../common';
import styles from './WalletSetup.module.css';

const walletTypes = [
  {
    id: 'new',
    title: 'New Wallet',
    icon: Plus,
    description: 'Generate a new seed phrase and create a fresh wallet',
    color: 'var(--success)',
    steps: [
      'Click "New Wallet" in Sparrow',
      'Choose wallet name',
      'Select "New or Imported Software Wallet"',
      'Click "Generate New" for a fresh 12 or 24-word seed',
      'Write down your seed phrase on paper (never digitally!)',
      'Verify the seed by re-entering selected words',
      'Set an optional passphrase for extra security'
    ],
    tips: [
      'Use 24 words for maximum security',
      'Store your seed in multiple secure locations',
      'Consider a metal backup for fire/water protection'
    ]
  },
  {
    id: 'import',
    title: 'Import Seed',
    icon: Download,
    description: 'Restore an existing wallet using your seed phrase',
    color: 'var(--info)',
    steps: [
      'Click "New Wallet" in Sparrow',
      'Choose wallet name',
      'Select "New or Imported Software Wallet"',
      'Click "Enter 12 Words" or "Enter 24 Words"',
      'Type your seed words in order',
      'Add passphrase if you used one originally',
      'Sparrow will derive your addresses automatically'
    ],
    tips: [
      'Ensure you\'re on a secure, offline computer if possible',
      'Double-check each word for typos',
      'The wallet will scan the blockchain for your transactions'
    ]
  },
  {
    id: 'hardware',
    title: 'Hardware Wallet',
    icon: HardDrive,
    description: 'Connect a hardware wallet like Coldcard, Ledger, or Trezor',
    color: 'var(--warning)',
    steps: [
      'Click "New Wallet" in Sparrow',
      'Choose wallet name',
      'Select "Connected Hardware Wallet" or "Airgapped Hardware Wallet"',
      'For connected: plug in your device and click "Scan"',
      'For airgapped: import the wallet file or scan QR from device',
      'Select the account and script type',
      'Sparrow imports the public keys (private keys stay on device)'
    ],
    tips: [
      'Your private keys never leave the hardware wallet',
      'Coldcard can export wallet files via SD card for air-gapped setup',
      'Supports Coldcard, Trezor, Ledger, BitBox, Keystone, and more'
    ]
  },
  {
    id: 'watch',
    title: 'Watch-Only',
    icon: Eye,
    description: 'Monitor a wallet without spending capability',
    color: 'var(--text-muted)',
    steps: [
      'Click "New Wallet" in Sparrow',
      'Choose wallet name',
      'Select "New or Imported Software Wallet"',
      'Click "xPub / Watch Only Wallet"',
      'Paste your extended public key (xpub, zpub, etc.)',
      'Sparrow derives all addresses from the xpub',
      'You can view balances and create unsigned transactions'
    ],
    tips: [
      'Perfect for monitoring cold storage',
      'Can create PSBTs to sign on an air-gapped device',
      'Safe to use on everyday computers since no private keys'
    ]
  }
];

const addressTypes = [
  {
    id: 'native-segwit',
    name: 'Native SegWit',
    prefix: 'bc1q...',
    path: "m/84'/0'/0'",
    description: 'Modern format with lowest fees. Recommended for most users.',
    recommended: true
  },
  {
    id: 'taproot',
    name: 'Taproot',
    prefix: 'bc1p...',
    path: "m/86'/0'/0'",
    description: 'Latest format with enhanced privacy and smart contract capabilities.',
    recommended: false
  },
  {
    id: 'nested-segwit',
    name: 'Nested SegWit',
    prefix: '3...',
    path: "m/49'/0'/0'",
    description: 'SegWit wrapped in P2SH for compatibility with older systems.',
    recommended: false
  },
  {
    id: 'legacy',
    name: 'Legacy',
    prefix: '1...',
    path: "m/44'/0'/0'",
    description: 'Original Bitcoin address format. Higher fees, universal compatibility.',
    recommended: false
  }
];

function DerivationDiagram({ addressType }) {
  const type = addressTypes.find(t => t.id === addressType) || addressTypes[0];
  
  return (
    <svg viewBox="0 0 500 120" className={styles.derivationSvg}>
      {/* Seed */}
      <g transform="translate(20, 40)">
        <rect width="80" height="40" rx="8" fill="var(--bg-tertiary)" stroke="var(--bitcoin-orange)" strokeWidth="2" />
        <text x="40" y="25" textAnchor="middle" fill="var(--bitcoin-orange)" fontSize="11" fontWeight="600">Seed</text>
      </g>
      
      {/* Arrow 1 */}
      <path d="M105 60 L135 60" stroke="var(--border-medium)" strokeWidth="2" />
      <polygon points="135,60 128,55 128,65" fill="var(--border-medium)" />
      
      {/* Master Key */}
      <g transform="translate(140, 40)">
        <rect width="80" height="40" rx="8" fill="var(--bg-tertiary)" stroke="var(--text-muted)" strokeWidth="2" />
        <text x="40" y="25" textAnchor="middle" fill="var(--text-secondary)" fontSize="10">Master Key</text>
      </g>
      
      {/* Arrow 2 */}
      <path d="M225 60 L255 60" stroke="var(--border-medium)" strokeWidth="2" />
      <polygon points="255,60 248,55 248,65" fill="var(--border-medium)" />
      
      {/* Derivation Path */}
      <g transform="translate(260, 35)">
        <rect width="100" height="50" rx="8" fill="var(--bg-secondary)" stroke="var(--info)" strokeWidth="2" />
        <text x="50" y="22" textAnchor="middle" fill="var(--info)" fontSize="9" fontWeight="600">Derivation</text>
        <text x="50" y="38" textAnchor="middle" fill="var(--text-primary)" fontSize="10" fontFamily="monospace">{type.path}</text>
      </g>
      
      {/* Arrow 3 */}
      <path d="M365 60 L395 60" stroke="var(--border-medium)" strokeWidth="2" />
      <polygon points="395,60 388,55 388,65" fill="var(--border-medium)" />
      
      {/* Addresses */}
      <g transform="translate(400, 30)">
        <rect width="80" height="60" rx="8" fill="var(--success)" fillOpacity="0.1" stroke="var(--success)" strokeWidth="2" />
        <text x="40" y="22" textAnchor="middle" fill="var(--success)" fontSize="9" fontWeight="600">Addresses</text>
        <text x="40" y="40" textAnchor="middle" fill="var(--text-primary)" fontSize="11" fontFamily="monospace">{type.prefix}</text>
        <text x="40" y="54" textAnchor="middle" fill="var(--text-muted)" fontSize="8">+ unlimited more</text>
      </g>
    </svg>
  );
}

export function WalletSetup() {
  const [selectedType, setSelectedType] = useState('new');
  const [selectedAddressType, setSelectedAddressType] = useState('native-segwit');
  const [currentStep, setCurrentStep] = useState(0);
  
  const walletType = walletTypes.find(t => t.id === selectedType);
  
  return (
    <div className={styles.container}>
      {/* Wallet Type Selector */}
      <div className={styles.typeSelector}>
        {walletTypes.map(type => {
          const Icon = type.icon;
          const isActive = selectedType === type.id;
          
          return (
            <button
              key={type.id}
              className={`${styles.typeButton} ${isActive ? styles.active : ''}`}
              onClick={() => {
                setSelectedType(type.id);
                setCurrentStep(0);
              }}
              style={{ '--type-color': type.color }}
            >
              <div className={styles.typeIcon}>
                <Icon size={20} />
              </div>
              <div className={styles.typeInfo}>
                <span className={styles.typeTitle}>{type.title}</span>
                <span className={styles.typeDescription}>{type.description}</span>
              </div>
            </button>
          );
        })}
      </div>
      
      {/* Setup Steps */}
      <Card variant="elevated" padding="large">
        <div className={styles.stepsHeader}>
          <h4>Setup Steps: {walletType.title}</h4>
          <div className={styles.stepProgress}>
            Step {currentStep + 1} of {walletType.steps.length}
          </div>
        </div>
        
        <div className={styles.stepsContainer}>
          {walletType.steps.map((step, index) => {
            const isActive = index === currentStep;
            const isComplete = index < currentStep;
            
            return (
              <motion.div
                key={index}
                className={`${styles.step} ${isActive ? styles.active : ''} ${isComplete ? styles.complete : ''}`}
                onClick={() => setCurrentStep(index)}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className={styles.stepNumber}>
                  {isComplete ? <CheckCircle size={16} /> : <span>{index + 1}</span>}
                </div>
                <div className={styles.stepText}>{step}</div>
                {isActive && (
                  <motion.div
                    className={styles.stepArrow}
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <ArrowRight size={16} />
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
        
        <div className={styles.stepNavigation}>
          <button
            className={styles.navButton}
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
          >
            Previous
          </button>
          <button
            className={`${styles.navButton} ${styles.primary}`}
            onClick={() => setCurrentStep(Math.min(walletType.steps.length - 1, currentStep + 1))}
            disabled={currentStep === walletType.steps.length - 1}
          >
            Next Step
          </button>
        </div>
        
        {/* Tips */}
        <div className={styles.tipsBox}>
          <div className={styles.tipsHeader}>
            <Info size={16} />
            <span>Pro Tips</span>
          </div>
          <ul className={styles.tipsList}>
            {walletType.tips.map((tip, index) => (
              <li key={index}>{tip}</li>
            ))}
          </ul>
        </div>
        {/* Key Security Note */}
      <div className={styles.securityNote}>
        <Shield size={20} />
        <div>
          <strong>Security Reminder</strong>
          <p>
            Importing a seed phrase into a computer makes the seed "Hot". Do not import a hardware wallet seed into Sparrow, connect device through the airgapped method instead. Your seed phrase is the master key to your Bitcoin. Anyone with access to these 
            words can steal your funds. Never store it digitally, never share it, and always 
            verify you're using the genuine Sparrow Wallet software.
          </p>
        </div>
      </div>
      </Card>
      
      {/* Address Types */}
      <Card variant="elevated" padding="large">
        <h4 className={styles.sectionTitle}>Address Types</h4>
        <p className={styles.sectionDescription}>
          Sparrow supports all Bitcoin address formats. Choose based on your needs:
        </p>
        
        <div className={styles.addressTypeSelector}>
          {addressTypes.map(type => (
            <button
              key={type.id}
              className={`${styles.addressTypeButton} ${selectedAddressType === type.id ? styles.active : ''}`}
              onClick={() => setSelectedAddressType(type.id)}
            >
              <div className={styles.addressTypeHeader}>
                <span className={styles.addressTypeName}>{type.name}</span>
                {type.recommended && (
                  <span className={styles.recommendedBadge}>Recommended</span>
                )}
              </div>
              <span className={styles.addressTypePrefix}>{type.prefix}</span>
            </button>
          ))}
        </div>
        
        <div className={styles.derivationContainer}>
          <DerivationDiagram addressType={selectedAddressType} />
        </div>
        
        <div className={styles.addressTypeInfo}>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Derivation Path:</span>
            <code className={styles.infoValue}>
              {addressTypes.find(t => t.id === selectedAddressType)?.path}
            </code>
          </div>
          <p className={styles.infoDescription}>
            {addressTypes.find(t => t.id === selectedAddressType)?.description}
          </p>
        </div>
      </Card>
      
    </div>
  );
}

export default WalletSetup;
