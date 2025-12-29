import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Hash, 
  Shield, 
  Zap, 
  Clock,
  ChevronRight,
  Check,
  X,
  Info
} from 'lucide-react';
import { Card, Badge, Accordion } from '../../common';
import styles from './AddressTypeExplorer.module.css';

const addressTypes = [
  {
    id: 'p2pkh',
    name: 'P2PKH (Legacy)',
    fullName: 'Pay to Public Key Hash',
    prefix: '1',
    example: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
    year: 2009,
    description: 'The original Bitcoin address format, used since the genesis block.',
    scriptType: 'Standard public key hash',
    pros: [
      'Universal compatibility',
      'Widely understood',
      'Works with all wallets'
    ],
    cons: [
      'Highest transaction fees',
      'Larger transaction size',
      'No advanced features'
    ],
    fees: 'high',
    privacy: 'low',
    adoption: '~15%'
  },
  {
    id: 'p2sh',
    name: 'P2SH (Script Hash)',
    fullName: 'Pay to Script Hash',
    prefix: '3',
    example: '3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy',
    year: 2012,
    description: 'Allows complex spending conditions like multisig. Also used to wrap SegWit for compatibility.',
    scriptType: 'Script hash (redeem script hidden)',
    pros: [
      'Enables multisig wallets',
      'Compatible with older systems',
      'Hides script complexity'
    ],
    cons: [
      'Higher fees than native SegWit',
      'Reveals script when spending',
      'Being phased out'
    ],
    fees: 'medium',
    privacy: 'medium',
    adoption: '~20%'
  },
  {
    id: 'p2wpkh',
    name: 'Native SegWit (Bech32)',
    fullName: 'Pay to Witness Public Key Hash',
    prefix: 'bc1q',
    example: 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq',
    year: 2017,
    description: 'The current recommended format. Uses Segregated Witness for lower fees and better efficiency.',
    scriptType: 'Witness program v0',
    pros: [
      'Lowest fees for simple transactions',
      'Better error detection',
      'Improved block efficiency'
    ],
    cons: [
      'Not supported by very old wallets',
      'Case-insensitive (potential confusion)',
      'Longer address string'
    ],
    fees: 'low',
    privacy: 'medium',
    adoption: '~45%'
  },
  {
    id: 'p2tr',
    name: 'Taproot (Bech32m)',
    fullName: 'Pay to Taproot',
    prefix: 'bc1p',
    example: 'bc1p0xlxvlhemja6c4dqv22uapctqupfhlxm9h8z3k2e72q4k9hcz7vqzk5jj0',
    year: 2021,
    description: 'The newest format with Schnorr signatures. Best privacy and enables advanced smart contracts.',
    scriptType: 'Witness program v1 (Taproot)',
    pros: [
      'Best privacy (scripts look identical)',
      'Efficient multisig',
      'Enables complex smart contracts'
    ],
    cons: [
      'Not yet universally supported',
      'Newer, less battle-tested',
      'Requires updated software'
    ],
    fees: 'lowest',
    privacy: 'high',
    adoption: '~20%'
  }
];

const feeLabels = {
  high: { label: 'High', color: 'error' },
  medium: { label: 'Medium', color: 'warning' },
  low: { label: 'Low', color: 'success' },
  lowest: { label: 'Lowest', color: 'success' }
};

const privacyLabels = {
  low: { label: 'Basic', color: 'warning' },
  medium: { label: 'Good', color: 'info' },
  high: { label: 'Best', color: 'success' }
};

export function AddressTypeExplorer() {
  const [selectedType, setSelectedType] = useState('p2wpkh');
  const selected = addressTypes.find(t => t.id === selectedType);

  return (
    <div className={styles.container}>
      <Card variant="elevated" padding="large">
        <div className={styles.header}>
          <div className={styles.titleSection}>
            <div className={styles.iconWrapper}>
              <Hash size={24} />
            </div>
            <div>
              <h3 className={styles.title}>Address Type Explorer</h3>
              <p className={styles.subtitle}>
                Compare different Bitcoin address formats
              </p>
            </div>
          </div>
        </div>

        {/* Type Selector */}
        <div className={styles.typeSelector}>
          {addressTypes.map(type => (
            <button
              key={type.id}
              className={`${styles.typeButton} ${selectedType === type.id ? styles.selected : ''}`}
              onClick={() => setSelectedType(type.id)}
            >
              <span className={styles.typePrefix}>{type.prefix}...</span>
              <span className={styles.typeName}>{type.name}</span>
              <span className={styles.typeYear}>{type.year}</span>
            </button>
          ))}
        </div>

        {/* Selected Type Details */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selected.id}
            className={styles.details}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <div className={styles.detailsHeader}>
              <div>
                <h4 className={styles.detailsTitle}>{selected.fullName}</h4>
                <p className={styles.detailsDescription}>{selected.description}</p>
              </div>
              <div className={styles.badges}>
                <Badge 
                  variant={feeLabels[selected.fees].color} 
                  size="small"
                  icon={<Zap size={12} />}
                >
                  {feeLabels[selected.fees].label} Fees
                </Badge>
                <Badge 
                  variant={privacyLabels[selected.privacy].color} 
                  size="small"
                  icon={<Shield size={12} />}
                >
                  {privacyLabels[selected.privacy].label} Privacy
                </Badge>
              </div>
            </div>

            {/* Example Address */}
            <div className={styles.exampleSection}>
              <label>Example Address</label>
              <code className={styles.exampleAddress}>{selected.example}</code>
            </div>

            {/* Pros and Cons */}
            <div className={styles.prosConsGrid}>
              <div className={styles.prosSection}>
                <h5><Check size={16} /> Advantages</h5>
                <ul>
                  {selected.pros.map((pro, i) => (
                    <li key={i}>{pro}</li>
                  ))}
                </ul>
              </div>
              <div className={styles.consSection}>
                <h5><X size={16} /> Disadvantages</h5>
                <ul>
                  {selected.cons.map((con, i) => (
                    <li key={i}>{con}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Stats */}
            <div className={styles.statsRow}>
              <div className={styles.stat}>
                <Clock size={16} />
                <span>Introduced: {selected.year}</span>
              </div>
              <div className={styles.stat}>
                <Hash size={16} />
                <span>Script: {selected.scriptType}</span>
              </div>
              <div className={styles.stat}>
                <Info size={16} />
                <span>Current usage: {selected.adoption}</span>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Recommendation */}
        <div className={styles.recommendation}>
          <Zap size={18} />
          <div>
            <strong>Recommendation:</strong> Use <span className={styles.highlight}>Native SegWit (bc1q...)</span> for 
            everyday transactions, or <span className={styles.highlight}>Taproot (bc1p...)</span> if your wallet supports it.
          </div>
        </div>
      </Card>

      <Accordion
        title="Deep Dive: Why So Many Address Types?"
        variant="deepdive"
        icon={<Hash size={16} />}
      >
        <p>
          Bitcoin has evolved over time, and each address type represents a different 
          era of development:
        </p>
        <ul>
          <li>
            <strong>2009 - P2PKH:</strong> Satoshi's original design. Simple but inefficient.
          </li>
          <li>
            <strong>2012 - P2SH:</strong> Introduced to enable multisig and more complex scripts 
            without revealing them until spending.
          </li>
          <li>
            <strong>2017 - SegWit:</strong> Major upgrade that fixed transaction malleability and 
            reduced fees by separating signature data.
          </li>
          <li>
            <strong>2021 - Taproot:</strong> Added Schnorr signatures for better privacy and 
            efficiency, especially for complex transactions.
          </li>
        </ul>
        <p>
          All types remain valid for backward compatibility. You can send bitcoin between 
          any address types freely.
        </p>
      </Accordion>
    </div>
  );
}

export default AddressTypeExplorer;
