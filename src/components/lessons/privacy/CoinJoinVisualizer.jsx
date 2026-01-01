import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shuffle, 
  Eye,
  EyeOff,
  Users,
  Play,
  RotateCcw,
  Check,
  Info
} from 'lucide-react';
import { Card, Button, Badge, Accordion } from '../../common';
import styles from './CoinJoinVisualizer.module.css';

// Standard CoinJoin denominations (in BTC)
const DENOMINATIONS = [0.1, 0.05, 0.01];

// Participants with different input amounts
const participants = [
  { id: 'alice', name: 'Alice', color: '#f97316', inputAmount: 0.23 },
  { id: 'bob', name: 'Bob', color: '#3b82f6', inputAmount: 0.17 },
  { id: 'carol', name: 'Carol', color: '#22c55e', inputAmount: 0.31 },
  { id: 'dave', name: 'Dave', color: '#a855f7', inputAmount: 0.19 },
];

const generateAddress = () => {
  const chars = 'abcdef0123456789';
  let addr = 'bc1q';
  for (let i = 0; i < 8; i++) {
    addr += chars[Math.floor(Math.random() * chars.length)];
  }
  return addr + '...';
};

// Break down an amount into standard denominations
function breakIntodenominations(amount) {
  const outputs = [];
  let remaining = Math.round(amount * 1000) / 1000; // Fix floating point
  
  for (const denom of DENOMINATIONS) {
    while (remaining >= denom - 0.0001) {
      outputs.push(denom);
      remaining = Math.round((remaining - denom) * 1000) / 1000;
    }
  }
  
  // Any remaining is "change" (non-standard amount)
  if (remaining > 0.001) {
    outputs.push(Math.round(remaining * 1000) / 1000);
  }
  
  return outputs;
}

export function CoinJoinVisualizer() {
  const [step, setStep] = useState(0); // 0: initial, 1: mixing, 2: complete
  const [showOwnership, setShowOwnership] = useState(false);
  
  // Generate input addresses
  const inputs = useMemo(() => 
    participants.map(p => ({ 
      ...p, 
      address: generateAddress()
    })),
  []);
  
  // Calculate outputs for each participant
  const participantOutputs = useMemo(() => {
    return participants.map(p => {
      const denoms = breakIntodenominations(p.inputAmount);
      return {
        ...p,
        outputs: denoms.map(amount => ({
          amount,
          address: generateAddress(),
          isStandard: DENOMINATIONS.includes(amount)
        }))
      };
    });
  }, []);
  
  // All outputs shuffled together
  const allOutputs = useMemo(() => {
    const outputs = [];
    participantOutputs.forEach(p => {
      p.outputs.forEach(out => {
        outputs.push({
          ...out,
          owner: p.id,
          ownerName: p.name,
          ownerColor: p.color
        });
      });
    });
    // Shuffle the outputs
    return outputs.sort(() => Math.random() - 0.5);
  }, [participantOutputs]);
  
  // Count outputs by denomination for statistics
  const denominationCounts = useMemo(() => {
    const counts = {};
    allOutputs.forEach(out => {
      const key = out.amount.toFixed(2);
      counts[key] = (counts[key] || 0) + 1;
    });
    return counts;
  }, [allOutputs]);
  
  // Calculate total input/output
  const totalInput = participants.reduce((sum, p) => sum + p.inputAmount, 0);
  const totalOutput = allOutputs.reduce((sum, o) => sum + o.amount, 0);
  
  const runCoinJoin = async () => {
    setStep(1);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setStep(2);
  };
  
  const reset = () => {
    setStep(0);
    setShowOwnership(false);
  };

  // Calculate anonymity set for each denomination
  const getAnonymityInfo = () => {
    const info = [];
    Object.entries(denominationCounts).forEach(([amount, count]) => {
      if (count > 1 && DENOMINATIONS.includes(parseFloat(amount))) {
        info.push({ amount: parseFloat(amount), count });
      }
    });
    return info;
  };

  return (
    <div className={styles.container}>
      <Card variant="elevated" padding="large">
        <div className={styles.header}>
          <div className={styles.titleSection}>
            <div className={styles.iconWrapper}>
              <Shuffle size={24} />
            </div>
            <div>
              <h3 className={styles.title}>CoinJoin Visualizer</h3>
              <p className={styles.subtitle}>
                See how CoinJoin breaks transaction links with standard denominations
              </p>
            </div>
          </div>
          
          <div className={styles.controls}>
            {step === 2 && (
              <Button
                variant={showOwnership ? 'primary' : 'secondary'}
                size="small"
                icon={showOwnership ? <Eye size={14} /> : <EyeOff size={14} />}
                onClick={() => setShowOwnership(!showOwnership)}
              >
                {showOwnership ? 'Hide' : 'Reveal'} Owners
              </Button>
            )}
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

        {/* Participants Summary */}
        <div className={styles.participantsRow}>
          <Users size={16} />
          <span>
            {participants.length} participants with different amounts: {' '}
            {participants.map((p, i) => (
              <span key={p.id}>
                <span style={{ color: p.color, fontWeight: 600 }}>{p.name}</span>
                {' '}({p.inputAmount} BTC){i < participants.length - 1 ? ', ' : ''}
              </span>
            ))}
          </span>
        </div>

        {/* Denomination Legend */}
        <div className={styles.denominationLegend}>
          <Info size={14} />
          <span>Standard denominations: </span>
          {DENOMINATIONS.map((d, i) => (
            <Badge key={d} variant="outline" size="small">
              {d} BTC
            </Badge>
          ))}
        </div>

        {/* CoinJoin Visualization */}
        <div className={styles.coinjoinFlow}>
          {/* Inputs */}
          <div className={styles.inputsColumn}>
            <h4>Inputs ({totalInput.toFixed(2)} BTC total)</h4>
            {inputs.map((p, i) => (
              <motion.div
                key={p.id}
                className={styles.utxoBox}
                style={{ 
                  borderColor: showOwnership || step < 2 ? p.color : 'var(--border-medium)',
                  backgroundColor: showOwnership || step < 2 ? `${p.color}15` : 'var(--bg-secondary)'
                }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                {(showOwnership || step < 2) && (
                  <span className={styles.ownerBadge} style={{ backgroundColor: p.color }}>
                    {p.name}
                  </span>
                )}
                <code>{p.address}</code>
                <span className={styles.amount}>{p.inputAmount} BTC</span>
              </motion.div>
            ))}
          </div>

          {/* Arrow / Mixing Animation */}
          <div className={styles.mixingSection}>
            {step === 0 && (
              <Button
                variant="primary"
                icon={<Play size={16} />}
                onClick={runCoinJoin}
              >
                Run CoinJoin
              </Button>
            )}
            
            {step === 1 && (
              <motion.div 
                className={styles.mixingAnimation}
                initial={{ scale: 0 }}
                animate={{ scale: 1, rotate: 360 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
              >
                <Shuffle size={48} />
                <span>Mixing...</span>
              </motion.div>
            )}
            
            {step === 2 && (
              <motion.div 
                className={styles.mixedIndicator}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <Check size={24} />
                <span>Mixed!</span>
              </motion.div>
            )}
          </div>

          {/* Outputs */}
          <div className={styles.outputsColumn}>
            <h4>Outputs ({allOutputs.length} UTXOs)</h4>
            <AnimatePresence>
              {step >= 1 && (
                <div className={styles.outputsList}>
                  {allOutputs.map((out, i) => (
                    <motion.div
                      key={`${out.owner}-${i}`}
                      className={`${styles.utxoBox} ${styles.outputBox} ${!out.isStandard ? styles.nonStandard : ''}`}
                      style={{ 
                        borderColor: showOwnership ? out.ownerColor : 'var(--border-medium)',
                        backgroundColor: showOwnership ? `${out.ownerColor}15` : 'var(--bg-secondary)'
                      }}
                      initial={{ opacity: 0, x: 20, scale: 0.8 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      transition={{ delay: 0.3 + i * 0.08 }}
                    >
                      {showOwnership && (
                        <span className={styles.ownerBadge} style={{ backgroundColor: out.ownerColor }}>
                          {out.ownerName}
                        </span>
                      )}
                      <code>{out.address}</code>
                      <span className={`${styles.amount} ${out.isStandard ? styles.standardAmount : styles.changeAmount}`}>
                        {out.amount} BTC
                        {out.isStandard && <span className={styles.denomTag}>std</span>}
                        {!out.isStandard && <span className={styles.changeTag}>change</span>}
                      </span>
                      {!showOwnership && step === 2 && out.isStandard && (
                        <span className={styles.unknownOwner}>Owner: ?</span>
                      )}
                      {!showOwnership && step === 2 && !out.isStandard && (
                        <span className={styles.changeWarning}>Unique amount!</span>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </AnimatePresence>
            
            {step === 0 && (
              <div className={styles.placeholder}>
                Outputs will appear after mixing
              </div>
            )}
          </div>
        </div>

        {/* Verification: Show totals match when ownership revealed */}
        {step === 2 && showOwnership && (
          <motion.div
            className={styles.verificationSection}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h4><Check size={16} /> Balance Verification</h4>
            <div className={styles.verificationGrid}>
              {participantOutputs.map(p => {
                const outputTotal = p.outputs.reduce((sum, o) => sum + o.amount, 0);
                return (
                  <div key={p.id} className={styles.verificationCard} style={{ borderColor: p.color }}>
                    <span className={styles.verifyName} style={{ color: p.color }}>{p.name}</span>
                    <div className={styles.verifyRow}>
                      <span>Input:</span>
                      <span>{p.inputAmount} BTC</span>
                    </div>
                    <div className={styles.verifyRow}>
                      <span>Outputs:</span>
                      <span>{p.outputs.map(o => o.amount).join(' + ')}</span>
                    </div>
                    <div className={styles.verifyRow}>
                      <span>Total:</span>
                      <span className={styles.verifyTotal}>{outputTotal.toFixed(2)} BTC</span>
                    </div>
                    <Check size={14} className={styles.verifyCheck} style={{ color: p.color }} />
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Analysis Result */}
        {step === 2 && !showOwnership && (
          <motion.div
            className={styles.analysisResult}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className={styles.analysisBox}>
              <EyeOff size={24} />
              <div>
                <strong>Privacy Enhanced!</strong>
                <p>
                  The CoinJoin transaction has {inputs.length} inputs totaling {totalInput.toFixed(2)} BTC, 
                  broken into {allOutputs.length} outputs using standard denominations.
                </p>
                <p>
                  Standard denomination outputs (like 0.1 BTC) are indistinguishable from each other. 
                  Non-standard "change" amounts can sometimes be linked to their owners.
                </p>
                <p>
                  <b>Press "Reveal Owners" at the top of the Visualizer to view total balances.</b>
                </p>
              </div>
            </div>
            
            <div className={styles.statsGrid}>
              {getAnonymityInfo().map(info => (
                <div key={info.amount} className={styles.statCard}>
                  <span className={styles.statValue}>{info.count}</span>
                  <span className={styles.statLabel}>{info.amount} BTC outputs</span>
                  <span className={styles.statSubtext}>
                    {Math.round(100 / info.count)}% chance per guess
                  </span>
                </div>
              ))}
              <div className={styles.statCard}>
                <span className={styles.statValue}>
                  {allOutputs.filter(o => !o.isStandard).length}
                </span>
                <span className={styles.statLabel}>Change outputs</span>
                <span className={styles.statSubtext}>
                  May reduce privacy
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </Card>

      <Accordion
        title="Deep Dive: Forward-facing Privacy"
        variant="deepdive"
        icon={<Shuffle size={16} />}
      >
        <p>
          Be sure to follow these rules after coinjoin:
        </p>
        <ul>
          <li>
            <strong>No Consolidating:</strong> If you consolidate all the UTXOs you receive from the Coinjoin, 
            you destroy the privacy gained
          </li>
          <li>
            <strong>Label UTXOs:</strong> Make sure to label where each UTXO has come from and/or what it will be used for.
          </li>
        </ul>
      </Accordion>
    </div>
  );
}

export default CoinJoinVisualizer;
