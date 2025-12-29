import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Code, 
  Lock, 
  Unlock,
  ArrowRight,
  Check,
  X,
  Play,
  RotateCcw
} from 'lucide-react';
import { Card, Button, Badge, Accordion } from '../../common';
import styles from './ScriptVisualizer.module.css';

const scriptTypes = [
  {
    id: 'p2pkh',
    name: 'P2PKH (Pay to Public Key Hash)',
    description: 'The most common script type. Requires a signature matching the public key hash.',
    lockingScript: [
      { op: 'OP_DUP', description: 'Duplicate top stack item' },
      { op: 'OP_HASH160', description: 'Hash the public key' },
      { op: '<PubKeyHash>', description: 'Push expected hash', isData: true },
      { op: 'OP_EQUALVERIFY', description: 'Check hashes match' },
      { op: 'OP_CHECKSIG', description: 'Verify signature' }
    ],
    unlockingScript: [
      { op: '<Signature>', description: 'Your digital signature', isData: true },
      { op: '<PublicKey>', description: 'Your public key', isData: true }
    ],
    execution: [
      { stack: ['<Sig>', '<PubKey>'], description: 'Start: Unlocking script items on stack' },
      { stack: ['<Sig>', '<PubKey>', '<PubKey>'], description: 'OP_DUP: Duplicate public key' },
      { stack: ['<Sig>', '<PubKey>', '<Hash>'], description: 'OP_HASH160: Hash the duplicate' },
      { stack: ['<Sig>', '<PubKey>', '<Hash>', '<ExpectedHash>'], description: 'Push expected hash' },
      { stack: ['<Sig>', '<PubKey>'], description: 'OP_EQUALVERIFY: Hashes match! Continue' },
      { stack: ['TRUE'], description: 'OP_CHECKSIG: Signature valid! Transaction approved' }
    ]
  },
  {
    id: 'p2sh-multisig',
    name: 'P2SH 2-of-3 Multisig',
    description: 'Requires 2 out of 3 signatures to spend. Common for shared wallets.',
    lockingScript: [
      { op: 'OP_HASH160', description: 'Hash the redeem script' },
      { op: '<ScriptHash>', description: 'Expected script hash', isData: true },
      { op: 'OP_EQUAL', description: 'Compare hashes' }
    ],
    unlockingScript: [
      { op: 'OP_0', description: 'Bug workaround (dummy value)' },
      { op: '<Sig1>', description: 'First signature', isData: true },
      { op: '<Sig2>', description: 'Second signature', isData: true },
      { op: '<RedeemScript>', description: 'The actual multisig script', isData: true }
    ],
    execution: [
      { stack: ['0', '<Sig1>', '<Sig2>', '<RedeemScript>'], description: 'Unlocking data ready' },
      { stack: ['0', '<Sig1>', '<Sig2>', '<RedeemScript>', '<Hash>'], description: 'Hash the redeem script' },
      { stack: ['0', '<Sig1>', '<Sig2>', '<RedeemScript>'], description: 'Script hash matches!' },
      { stack: ['0', '<Sig1>', '<Sig2>'], description: 'Execute redeem script: 2-of-3 check' },
      { stack: ['TRUE'], description: '2 valid signatures found! Approved' }
    ]
  },
  {
    id: 'p2wpkh',
    name: 'P2WPKH (Native SegWit)',
    description: 'Simplified script with witness data stored separately for efficiency.',
    lockingScript: [
      { op: 'OP_0', description: 'Witness version 0' },
      { op: '<20-byte-hash>', description: 'Public key hash', isData: true }
    ],
    unlockingScript: [
      { op: '(empty)', description: 'No script - witness data is separate' }
    ],
    witnessData: [
      { op: '<Signature>', description: 'In witness field', isData: true },
      { op: '<PublicKey>', description: 'In witness field', isData: true }
    ],
    execution: [
      { stack: ['<Sig>', '<PubKey>'], description: 'Witness data loaded' },
      { stack: ['<Sig>', '<PubKey>', '<Hash>'], description: 'Hash the public key' },
      { stack: ['<Sig>', '<PubKey>'], description: 'Hash matches witness program!' },
      { stack: ['TRUE'], description: 'Signature verified! Approved' }
    ]
  }
];

export function ScriptVisualizer() {
  const [selectedScript, setSelectedScript] = useState('p2pkh');
  const [executionStep, setExecutionStep] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const script = scriptTypes.find(s => s.id === selectedScript);
  
  const runExecution = async () => {
    setIsPlaying(true);
    setExecutionStep(0);
    
    for (let i = 1; i < script.execution.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1200));
      setExecutionStep(i);
    }
    
    setIsPlaying(false);
  };
  
  const reset = () => {
    setExecutionStep(-1);
    setIsPlaying(false);
  };

  return (
    <div className={styles.container}>
      <Card variant="elevated" padding="large">
        <div className={styles.header}>
          <div className={styles.titleSection}>
            <div className={styles.iconWrapper}>
              <Code size={24} />
            </div>
            <div>
              <h3 className={styles.title}>Bitcoin Script Visualizer</h3>
              <p className={styles.subtitle}>
                See how spending conditions work under the hood
              </p>
            </div>
          </div>
        </div>

        {/* Script Type Selector */}
        <div className={styles.scriptSelector}>
          {scriptTypes.map(type => (
            <button
              key={type.id}
              className={`${styles.scriptButton} ${selectedScript === type.id ? styles.selected : ''}`}
              onClick={() => {
                setSelectedScript(type.id);
                reset();
              }}
            >
              {type.name}
            </button>
          ))}
        </div>

        <p className={styles.description}>{script.description}</p>

        {/* Script Display */}
        <div className={styles.scriptDisplay}>
          {/* Locking Script */}
          <div className={styles.scriptSection}>
            <div className={styles.scriptHeader}>
              <Lock size={16} />
              <span>Locking Script (ScriptPubKey)</span>
              <Badge variant="secondary" size="small">In UTXO</Badge>
            </div>
            <div className={styles.scriptCode}>
              {script.lockingScript.map((item, i) => (
                <div 
                  key={i} 
                  className={`${styles.scriptOp} ${item.isData ? styles.isData : ''}`}
                  title={item.description}
                >
                  {item.op}
                </div>
              ))}
            </div>
            <p className={styles.scriptNote}>
              This is stored on the blockchain with the coins. Defines spending conditions.
            </p>
          </div>

          <div className={styles.plusSign}>+</div>

          {/* Unlocking Script */}
          <div className={styles.scriptSection}>
            <div className={styles.scriptHeader}>
              <Unlock size={16} />
              <span>Unlocking Script (ScriptSig)</span>
              <Badge variant="primary" size="small">In Transaction</Badge>
            </div>
            <div className={styles.scriptCode}>
              {script.unlockingScript.map((item, i) => (
                <div 
                  key={i} 
                  className={`${styles.scriptOp} ${item.isData ? styles.isData : ''}`}
                  title={item.description}
                >
                  {item.op}
                </div>
              ))}
            </div>
            {script.witnessData && (
              <>
                <p className={styles.scriptNote}>Plus Witness Data:</p>
                <div className={styles.scriptCode}>
                  {script.witnessData.map((item, i) => (
                    <div 
                      key={i} 
                      className={`${styles.scriptOp} ${styles.isData} ${styles.witnessOp}`}
                      title={item.description}
                    >
                      {item.op}
                    </div>
                  ))}
                </div>
              </>
            )}
            <p className={styles.scriptNote}>
              You provide this when spending. Proves you own the coins.
            </p>
          </div>
        </div>

        {/* Execution Visualization */}
        <div className={styles.executionSection}>
          <div className={styles.executionHeader}>
            <h4>Script Execution</h4>
            <div className={styles.executionControls}>
              <Button
                variant="primary"
                size="small"
                icon={<Play size={14} />}
                onClick={runExecution}
                disabled={isPlaying}
              >
                Run Script
              </Button>
              <Button
                variant="ghost"
                size="small"
                icon={<RotateCcw size={14} />}
                onClick={reset}
              >
                Reset
              </Button>
            </div>
          </div>

          <div className={styles.stackVisualization}>
            <AnimatePresence mode="wait">
              {executionStep >= 0 ? (
                <motion.div
                  key={executionStep}
                  className={styles.executionState}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <div className={styles.stepInfo}>
                    <Badge variant="outline" size="small">
                      Step {executionStep + 1} of {script.execution.length}
                    </Badge>
                    <span className={styles.stepDescription}>
                      {script.execution[executionStep].description}
                    </span>
                  </div>
                  <div className={styles.stack}>
                    <span className={styles.stackLabel}>Stack:</span>
                    <div className={styles.stackItems}>
                      {script.execution[executionStep].stack.map((item, i) => (
                        <motion.span
                          key={i}
                          className={`${styles.stackItem} ${item === 'TRUE' ? styles.success : ''}`}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: i * 0.1 }}
                        >
                          {item}
                        </motion.span>
                      ))}
                    </div>
                  </div>
                  {executionStep === script.execution.length - 1 && (
                    <motion.div 
                      className={styles.successMessage}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <Check size={20} />
                      <span>Transaction Valid!</span>
                    </motion.div>
                  )}
                </motion.div>
              ) : (
                <div className={styles.executionPlaceholder}>
                  <p>Click "Run Script" to see how Bitcoin validates transactions</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </Card>

      <Accordion
        title="Deep Dive: Bitcoin Script Language"
        variant="deepdive"
        icon={<Code size={16} />}
      >
        <p>
          Bitcoin Script is a simple, stack-based programming language. It's intentionally 
          <strong> not Turing-complete</strong> - there are no loops, preventing infinite execution.
        </p>
        <p><strong>Common Opcodes:</strong></p>
        <ul>
          <li><code>OP_DUP</code> - Duplicate the top stack item</li>
          <li><code>OP_HASH160</code> - SHA-256 then RIPEMD-160 hash</li>
          <li><code>OP_EQUALVERIFY</code> - Check equality, fail if not equal</li>
          <li><code>OP_CHECKSIG</code> - Verify a signature against a public key</li>
          <li><code>OP_CHECKMULTISIG</code> - Verify multiple signatures (for multisig)</li>
        </ul>
        <p>
          When you spend bitcoin, your unlocking script is combined with the locking script 
          and executed. If the final stack value is TRUE (non-zero), the spend is valid.
        </p>
      </Accordion>
    </div>
  );
}

export default ScriptVisualizer;
