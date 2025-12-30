import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Key, 
  Shield, 
  CheckCircle,
  XCircle,
  ArrowRight,
  Plus,
  Minus,
  Lock,
  Unlock
} from 'lucide-react';
import { Card, Accordion } from '../../common';
import styles from './HowItWorks.module.css';

const addressFormats = [
  {
    id: 'p2sh',
    name: 'P2SH (Legacy)',
    prefix: '3...',
    description: 'Original multisig format from 2012. Widely compatible with all wallets and exchanges.',
    fees: 'Higher'
  },
  {
    id: 'p2wsh',
    name: 'P2WSH (Native SegWit)',
    prefix: 'bc1q...',
    description: 'Modern format with lower transaction fees. Recommended for new setups.',
    fees: 'Lower'
  },
  {
    id: 'p2sh-p2wsh',
    name: 'P2SH-P2WSH (Nested)',
    prefix: '3...',
    description: 'SegWit benefits wrapped in P2SH for compatibility with older systems.',
    fees: 'Medium'
  }
];

function ThresholdDiagram({ m, n, activeKeys }) {
  const signedCount = activeKeys.filter(Boolean).length;
  const thresholdMet = signedCount >= m;
  
  return (
    <div className={styles.diagramWrapper}>
      {/* Keys Grid */}
      <div className={styles.keysGrid}>
        {Array.from({ length: n }, (_, index) => {
          const isActive = activeKeys[index];
          return (
            <motion.div
              key={index}
              className={`${styles.keyCard} ${isActive ? styles.keyCardActive : ''}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <div className={styles.keyCardIcon}>
                <Key size={24} />
              </div>
              <span className={styles.keyCardLabel}>Key {index + 1}</span>
              <div className={styles.keyCardStatus}>
                {isActive ? (
                  <CheckCircle size={16} />
                ) : (
                  <XCircle size={16} />
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
      
      {/* Arrow */}
      <div className={styles.flowArrow}>
        <ArrowRight size={24} />
      </div>
      
      {/* Vault Card */}
      <motion.div 
        className={`${styles.vaultCard} ${thresholdMet ? styles.vaultCardUnlocked : ''}`}
        animate={{ scale: thresholdMet ? [1, 1.02, 1] : 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className={styles.vaultCardIcon}>
          {thresholdMet ? <Unlock size={32} /> : <Lock size={32} />}
        </div>
        <div className={styles.vaultCardInfo}>
          <span className={styles.vaultCardTitle}>
            {thresholdMet ? 'Unlocked' : 'Locked'}
          </span>
          <span className={styles.vaultCardSubtitle}>
            {signedCount} of {m} signatures
          </span>
        </div>
      </motion.div>
      
      {/* Status Badge */}
      <div className={`${styles.statusBadge} ${thresholdMet ? styles.unlocked : styles.locked}`}>
        {thresholdMet ? (
          <>
            <Unlock size={16} />
            <span>Threshold Met - Can Spend</span>
          </>
        ) : (
          <>
            <Lock size={16} />
            <span>Need {m - signedCount} more signature{m - signedCount > 1 ? 's' : ''}</span>
          </>
        )}
      </div>
    </div>
  );
}

function SigningFlowDiagram({ m, n }) {
  const [currentStep, setCurrentStep] = useState(0);
  
  const steps = [
    { 
      title: 'Transaction Created', 
      description: 'Coordinator software creates unsigned transaction',
      signatures: 0
    },
    { 
      title: 'First Signature', 
      description: 'Key holder #1 reviews and signs',
      signatures: 1
    },
    { 
      title: 'Second Signature', 
      description: 'Key holder #2 reviews and signs',
      signatures: 2
    },
    { 
      title: 'Threshold Met', 
      description: `${m} signatures collected - transaction valid`,
      signatures: m
    },
    { 
      title: 'Broadcast', 
      description: 'Transaction sent to Bitcoin network',
      signatures: m,
      broadcast: true
    }
  ];
  
  const step = steps[currentStep];
  
  return (
    <div className={styles.flowContainer}>
      <div className={styles.flowSteps}>
        {steps.map((s, index) => (
          <button
            key={index}
            className={`${styles.flowStep} ${currentStep === index ? styles.active : ''} ${index < currentStep ? styles.complete : ''}`}
            onClick={() => setCurrentStep(index)}
          >
            <div className={styles.flowStepIndicator}>
              {index < currentStep ? <CheckCircle size={16} /> : index + 1}
            </div>
            <span className={styles.flowStepTitle}>{s.title}</span>
          </button>
        ))}
      </div>
      
      <Card variant="elevated" padding="large" className={styles.flowVisualization}>
        <div className={styles.flowHeader}>
          <h4>{step.title}</h4>
          <p>{step.description}</p>
        </div>
        
        <div className={styles.signaturesVisual}>
          {Array.from({ length: n }, (_, i) => (
            <div 
              key={i} 
              className={`${styles.signatureSlot} ${i < step.signatures ? styles.signed : ''}`}
            >
              <Key size={18} />
              <span>{i < step.signatures ? 'Signed' : 'Pending'}</span>
            </div>
          ))}
        </div>
        
        <div className={styles.flowProgress}>
          <div className={styles.progressBar}>
            <motion.div 
              className={styles.progressFill}
              initial={{ width: 0 }}
              animate={{ width: `${(step.signatures / m) * 100}%` }}
              style={{ 
                background: step.signatures >= m ? 'var(--success)' : 'var(--bitcoin-orange)' 
              }}
            />
          </div>
          <span className={styles.progressText}>
            {step.signatures}/{m} signatures ({Math.round((step.signatures / m) * 100)}%)
          </span>
        </div>
        
        {step.broadcast && (
          <motion.div 
            className={styles.broadcastSuccess}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <CheckCircle size={20} />
            <span>Transaction broadcasted to Bitcoin network!</span>
          </motion.div>
        )}
      </Card>
    </div>
  );
}

export function HowItWorks() {
  const [m, setM] = useState(2);
  const [n, setN] = useState(3);
  const [activeKeys, setActiveKeys] = useState([true, true, false]);
  
  const handleMChange = (newM) => {
    if (newM >= 1 && newM <= n) {
      setM(newM);
    }
  };
  
  const handleNChange = (newN) => {
    if (newN >= 2 && newN <= 7) {
      setN(newN);
      if (m > newN) {
        setM(newN);
      }
      // Reset active keys
      setActiveKeys(Array(newN).fill(false).map((_, i) => i < m));
    }
  };
  
  const toggleKey = (index) => {
    const newActiveKeys = [...activeKeys];
    newActiveKeys[index] = !newActiveKeys[index];
    setActiveKeys(newActiveKeys);
  };

  return (
    <div className={styles.container}>
      {/* Threshold Concept */}
      <Card variant="elevated" padding="large">
        <h4 className={styles.sectionTitle}>The Threshold Concept</h4>
        <p className={styles.sectionDescription}>
          In an M-of-N multisig, you need at least M signatures from N total keys to spend. 
          Click the keys below to simulate signing:
        </p>
        
        <div className={styles.configControls}>
          <div className={styles.configControl}>
            <label>Required (M)</label>
            <div className={styles.stepper}>
              <button onClick={() => handleMChange(m - 1)} disabled={m <= 1}>
                <Minus size={16} />
              </button>
              <span className={styles.stepperValue}>{m}</span>
              <button onClick={() => handleMChange(m + 1)} disabled={m >= n}>
                <Plus size={16} />
              </button>
            </div>
          </div>
          
          <div className={styles.configOf}>of</div>
          
          <div className={styles.configControl}>
            <label>Total (N)</label>
            <div className={styles.stepper}>
              <button onClick={() => handleNChange(n - 1)} disabled={n <= 2}>
                <Minus size={16} />
              </button>
              <span className={styles.stepperValue}>{n}</span>
              <button onClick={() => handleNChange(n + 1)} disabled={n >= 7}>
                <Plus size={16} />
              </button>
            </div>
          </div>
        </div>
        
        <ThresholdDiagram m={m} n={n} activeKeys={activeKeys} />
        
        <div className={styles.keyToggleGrid}>
          {Array.from({ length: n }, (_, i) => (
            <button
              key={i}
              className={`${styles.keyToggle} ${activeKeys[i] ? styles.active : ''}`}
              onClick={() => toggleKey(i)}
            >
              <Key size={16} />
              <span>Key {i + 1}</span>
              {activeKeys[i] ? <CheckCircle size={14} /> : <XCircle size={14} />}
            </button>
          ))}
        </div>
      </Card>
      
      {/* Signing Flow */}
      <Card variant="elevated" padding="large">
        <h4 className={styles.sectionTitle}>The Signing Process</h4>
        <p className={styles.sectionDescription}>
          Each key holder signs independently, often on different devices in different locations. 
          The transaction becomes valid once the threshold is met.
        </p>
        
        <SigningFlowDiagram m={m} n={n} />
      </Card>
      
      {/* Address Formats */}
      <Card variant="elevated" padding="large">
        <h4 className={styles.sectionTitle}>Multisig Address Formats</h4>
        <p className={styles.sectionDescription}>
          Bitcoin supports several address formats for multisig, each with different tradeoffs:
        </p>
        
        <div className={styles.formatGrid}>
          {addressFormats.map(format => (
            <div key={format.id} className={styles.formatCard}>
              <div className={styles.formatHeader}>
                <span className={styles.formatName}>{format.name}</span>
                <code className={styles.formatPrefix}>{format.prefix}</code>
              </div>
              <p className={styles.formatDescription}>{format.description}</p>
              <div className={styles.formatFees}>
                <span>Fees:</span>
                <span className={`${styles.feeLevel} ${styles[format.fees.toLowerCase()]}`}>
                  {format.fees}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>
      
      {/* Deep Dive */}
      <Accordion
        title="Deep Dive: How Bitcoin Verifies Multisig"
        variant="deepdive"
        icon={<Shield size={16} />}
      >
        <p>
          When you create a multisig wallet, you're defining a special spending condition 
          called a <strong>redeem script</strong>. This script says: "To spend these coins, 
          provide M valid signatures from this set of N public keys."
        </p>
        
        <div className={styles.deepDiveSteps}>
          <div className={styles.deepDiveStep}>
            <div className={styles.deepDiveNumber}>1</div>
            <div>
              <strong>Script Creation</strong>
              <p>All N public keys are combined into a redeem script that defines the threshold</p>
            </div>
          </div>
          <div className={styles.deepDiveStep}>
            <div className={styles.deepDiveNumber}>2</div>
            <div>
              <strong>Address Generation</strong>
              <p>The script is hashed to create the multisig address (starts with 3 or bc1)</p>
            </div>
          </div>
          <div className={styles.deepDiveStep}>
            <div className={styles.deepDiveNumber}>3</div>
            <div>
              <strong>Spending</strong>
              <p>To spend, you provide the original script plus M valid signatures</p>
            </div>
          </div>
          <div className={styles.deepDiveStep}>
            <div className={styles.deepDiveNumber}>4</div>
            <div>
              <strong>Verification</strong>
              <p>Bitcoin nodes verify each signature matches one of the N public keys</p>
            </div>
          </div>
        </div>
        
        <p className={styles.deepDiveNote}>
          <strong>Note:</strong> The order of signatures must match the order of public keys 
          in the script. Modern wallets handle this automatically using "sortedmulti" which 
          orders keys consistently.
        </p>
      </Accordion>
    </div>
  );
}

export default HowItWorks;
