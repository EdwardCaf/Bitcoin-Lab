import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Eye,
  EyeOff,
  ArrowRight,
  Shield,
  Lock,
  Unlock,
  Info
} from 'lucide-react';
import { Card, Button, Badge, Accordion } from '../../common';
import styles from './ConfidentialTxDemo.module.css';

// Sample transaction data
const TRANSACTION = {
  inputs: [
    { address: 'VJL...x8p', amount: 2.5 },
    { address: 'VTw...3kf', amount: 1.2 },
  ],
  outputs: [
    { address: 'VJN...m2d', amount: 3.0 },
    { address: 'VKx...9qr', amount: 0.699 }, // change (minus fee)
  ],
  fee: 0.001,
};

// Blinded versions
const BLINDED = {
  inputs: [
    { address: 'VJL...x8p', amount: '••••••••' },
    { address: 'VTw...3kf', amount: '••••••••' },
  ],
  outputs: [
    { address: 'VJN...m2d', amount: '••••••••' },
    { address: 'VKx...9qr', amount: '••••••••' },
  ],
  fee: '••••••••',
};

export function ConfidentialTxDemo() {
  const [isConfidential, setIsConfidential] = useState(true);
  
  const tx = isConfidential ? BLINDED : TRANSACTION;

  return (
    <div className={styles.container}>
      <Card variant="elevated" padding="large">
        <div className={styles.header}>
          <div className={styles.titleSection}>
            <div className={styles.iconWrapper}>
              <Shield size={24} />
            </div>
            <div>
              <h3 className={styles.title}>Confidential Transactions</h3>
              <p className={styles.subtitle}>
                Toggle to see how Liquid hides transaction amounts
              </p>
            </div>
          </div>
        </div>

        {/* Toggle Switch */}
        <div className={styles.toggleSection}>
          <button
            className={`${styles.modeButton} ${!isConfidential ? styles.active : ''}`}
            onClick={() => setIsConfidential(false)}
          >
            <Eye size={18} />
            <span>Transparent</span>
            <span className={styles.modeSubtext}>Like Bitcoin</span>
          </button>
          
          <div className={styles.toggleSwitch}>
            <motion.div 
              className={styles.toggleKnob}
              animate={{ x: isConfidential ? 40 : 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              onClick={() => setIsConfidential(!isConfidential)}
            >
              {isConfidential ? <Lock size={16} /> : <Unlock size={16} />}
            </motion.div>
          </div>
          
          <button
            className={`${styles.modeButton} ${isConfidential ? styles.active : ''}`}
            onClick={() => setIsConfidential(true)}
          >
            <EyeOff size={18} />
            <span>Confidential</span>
            <span className={styles.modeSubtext}>Liquid default</span>
          </button>
        </div>

        {/* Transaction Visualization */}
        <div className={styles.txContainer}>
          <motion.div 
            className={styles.txCard}
            animate={{
              borderColor: isConfidential ? '#14b8a6' : '#f97316',
            }}
          >
            <div className={styles.txHeader}>
              <Badge variant={isConfidential ? 'success' : 'warning'}>
                {isConfidential ? 'Confidential Transaction' : 'Transparent Transaction'}
              </Badge>
              <code className={styles.txid}>txid: 7f3a8b...e2c1</code>
            </div>

            <div className={styles.txBody}>
              {/* Inputs */}
              <div className={styles.txSide}>
                <h4>Inputs</h4>
                {tx.inputs.map((input, i) => (
                  <motion.div 
                    key={i}
                    className={styles.utxo}
                    layout
                  >
                    <code className={styles.address}>{input.address}</code>
                    <motion.span 
                      className={`${styles.amount} ${isConfidential ? styles.hidden : ''}`}
                      animate={{ opacity: isConfidential ? 0.5 : 1 }}
                    >
                      {typeof input.amount === 'number' 
                        ? `${input.amount} L-BTC` 
                        : input.amount}
                    </motion.span>
                  </motion.div>
                ))}
                <div className={styles.total}>
                  <span>Total:</span>
                  <span className={isConfidential ? styles.hidden : ''}>
                    {isConfidential ? '••••••••' : '3.7 L-BTC'}
                  </span>
                </div>
              </div>

              {/* Arrow */}
              <div className={styles.arrow}>
                <ArrowRight size={24} />
              </div>

              {/* Outputs */}
              <div className={styles.txSide}>
                <h4>Outputs</h4>
                {tx.outputs.map((output, i) => (
                  <motion.div 
                    key={i}
                    className={styles.utxo}
                    layout
                  >
                    <code className={styles.address}>{output.address}</code>
                    <motion.span 
                      className={`${styles.amount} ${isConfidential ? styles.hidden : ''}`}
                      animate={{ opacity: isConfidential ? 0.5 : 1 }}
                    >
                      {typeof output.amount === 'number' 
                        ? `${output.amount} L-BTC` 
                        : output.amount}
                    </motion.span>
                  </motion.div>
                ))}
                <div className={styles.total}>
                  <span>Total:</span>
                  <span className={isConfidential ? styles.hidden : ''}>
                    {isConfidential ? '••••••••' : '3.699 L-BTC'}
                  </span>
                </div>
              </div>
            </div>

            {/* Fee */}
            <div className={styles.txFooter}>
              <span>Transaction Fee:</span>
              <span className={isConfidential ? styles.hidden : ''}>
                {isConfidential ? '••••••••' : '0.001 L-BTC'}
              </span>
            </div>
          </motion.div>
        </div>

        {/* What's Still Visible */}
        <div className={styles.visibilitySection}>
          <h4>What observers can see:</h4>
          <div className={styles.visibilityGrid}>
            <div className={styles.visibilityItem}>
              <div className={`${styles.visIcon} ${styles.visible}`}>
                <Eye size={16} />
              </div>
              <span>Addresses (sender/receiver)</span>
            </div>
            <div className={styles.visibilityItem}>
              <div className={`${styles.visIcon} ${styles.visible}`}>
                <Eye size={16} />
              </div>
              <span>Number of inputs/outputs</span>
            </div>
            <div className={styles.visibilityItem}>
              <div className={`${styles.visIcon} ${isConfidential ? styles.hiddenIcon : styles.visible}`}>
                {isConfidential ? <EyeOff size={16} /> : <Eye size={16} />}
              </div>
              <span>Transaction amounts</span>
            </div>
            <div className={styles.visibilityItem}>
              <div className={`${styles.visIcon} ${isConfidential ? styles.hiddenIcon : styles.visible}`}>
                {isConfidential ? <EyeOff size={16} /> : <Eye size={16} />}
              </div>
              <span>Fee amount</span>
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className={styles.infoBox}>
          <Info size={18} />
          <div>
            <strong>How is this possible?</strong>
            <p>
              Confidential Transactions use cryptographic "Pedersen commitments" to hide 
              amounts while still allowing anyone to verify that inputs equal outputs 
              (no coins created from thin air). Range proofs ensure amounts aren't negative.
            </p>
          </div>
        </div>
      </Card>

      <Accordion
        title="Deep Dive: Confidential Transactions"
        variant="deepdive"
        icon={<Shield size={16} />}
      >
        <p>
          Confidential Transactions (CT) were invented by Greg Maxwell and are a core 
          feature of Liquid:
        </p>
        <ul>
          <li>
            <strong>Pedersen Commitments:</strong> Amounts are replaced with cryptographic 
            commitments. The commitment hides the value but is mathematically bound to it.
          </li>
          <li>
            <strong>Homomorphic property:</strong> You can add and subtract commitments 
            just like regular numbers. This allows verifying that inputs = outputs + fee 
            without knowing the actual amounts.
          </li>
          <li>
            <strong>Range proofs:</strong> Attached proofs that demonstrate amounts are 
            positive and within a valid range (preventing overflow attacks). These are 
            the main contributor to CT transaction size.
          </li>
          <li>
            <strong>Blinding keys:</strong> The sender and receiver share a blinding key 
            that allows them to "unblind" and see the actual amounts.
          </li>
        </ul>
        <p>
          <strong>Tradeoff:</strong> Confidential transactions are larger (~3x) than 
          regular transactions, but Liquid's 1-minute blocks and federation model make 
          this practical.
        </p>
      </Accordion>
    </div>
  );
}

export default ConfidentialTxDemo;
