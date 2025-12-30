import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeftRight, 
  Lock,
  Unlock,
  Key,
  Play,
  RotateCcw,
  Check,
  X,
  Eye,
  EyeOff,
  Info,
  Shield,
  Zap,
  Droplets
} from 'lucide-react';
import { Card, Button, Badge, Accordion } from '../../common';
import styles from './AtomicSwapVisualizer.module.css';

const SWAP_SCENARIOS = {
  submarine: {
    name: 'Lightning Submarine Swap',
    description: 'Bitcoin ↔ Lightning (via Boltz)',
    chainA: { name: 'Bitcoin', icon: Lock, color: '#f97316', asset: 'On-Chain BTC' },
    chainB: { name: 'Lightning', icon: Zap, color: '#f59e0b', asset: 'Lightning BTC' },
    amount: 0.01,
    privacyBenefit: 'Break on-chain surveillance by moving to Lightning\'s private payment network'
  },
  liquid: {
    name: 'Liquid Swap',
    description: 'Bitcoin ↔ Liquid (via Boltz)',
    chainA: { name: 'Bitcoin', icon: Lock, color: '#f97316', asset: 'BTC' },
    chainB: { name: 'Liquid', icon: Droplets, color: '#06b6d4', asset: 'L-BTC' },
    amount: 0.1,
    privacyBenefit: 'Hide transaction amounts and recipients with Liquid\'s confidential transactions'
  }
};

const STEPS = [
  { id: 0, name: 'Setup', description: 'You and Boltz ready to swap' },
  { id: 1, name: 'You Lock BTC', description: 'You create HTLC on Bitcoin chain' },
  { id: 2, name: 'Boltz Locks Asset', description: 'Boltz creates HTLC on target chain' },
  { id: 3, name: 'You Claim', description: 'You reveal secret and claim your asset' },
  { id: 4, name: 'Boltz Claims', description: 'Boltz uses secret to claim your BTC' },
  { id: 5, name: 'Complete', description: 'Swap completed atomically' },
];

export function AtomicSwapVisualizer() {
  const [scenario, setScenario] = useState('liquid');
  const [step, setStep] = useState(0);
  const [showSecret, setShowSecret] = useState(false);
  const [comparing, setComparing] = useState(false);

  const currentScenario = SWAP_SCENARIOS[scenario];
  const ChainAIcon = currentScenario.chainA.icon;
  const ChainBIcon = currentScenario.chainB.icon;

  const runSwap = async () => {
    setStep(0);
    setShowSecret(false);
    
    // Slower animations for better understanding
    for (let i = 1; i <= 5; i++) {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setStep(i);
      
      // Show secret when Alice claims
      if (i === 3) {
        await new Promise(resolve => setTimeout(resolve, 500));
        setShowSecret(true);
      }
    }
  };

  const reset = () => {
    setStep(0);
    setShowSecret(false);
  };

  const secretHash = 'a7b9c3d2...';
  const secret = 'mysecret123';

  return (
    <div className={styles.container}>
      <Card variant="elevated" padding="large">
        <div className={styles.header}>
          <div className={styles.titleSection}>
            <div className={styles.iconWrapper}>
              <ArrowLeftRight size={24} />
            </div>
            <div>
              <h3 className={styles.title}>Boltz Swaps</h3>
              <p className={styles.subtitle}>
                Privacy-preserving atomic swaps between Bitcoin layers
              </p>
            </div>
          </div>
          
          <div className={styles.controls}>
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

        {/* Scenario Selector */}
        <div className={styles.scenarioSelector}>
          {Object.entries(SWAP_SCENARIOS).map(([key, scen]) => {
            const IconA = scen.chainA.icon;
            const IconB = scen.chainB.icon;
            return (
              <button
                key={key}
                className={`${styles.scenarioButton} ${scenario === key ? styles.active : ''}`}
                onClick={() => { setScenario(key); reset(); }}
              >
                <div className={styles.scenarioIcons}>
                  <IconA size={18} style={{ color: scen.chainA.color }} />
                  <ArrowLeftRight size={14} />
                  <IconB size={18} style={{ color: scen.chainB.color }} />
                </div>
                <div className={styles.scenarioInfo}>
                  <strong>{scen.name}</strong>
                  <span>{scen.description}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Comparison Toggle */}
        <div className={styles.comparisonToggle}>
          <button
            className={`${styles.toggleBtn} ${!comparing ? styles.activeToggle : ''}`}
            onClick={() => setComparing(false)}
          >
            <ArrowLeftRight size={16} />
            Boltz Swap Demo
          </button>
          <button
            className={`${styles.toggleBtn} ${comparing ? styles.activeToggle : ''}`}
            onClick={() => setComparing(true)}
          >
            <Eye size={16} />
            Privacy Comparison
          </button>
        </div>

        {comparing ? (
          // Comparison View
          <div className={styles.comparisonView}>
            <div className={styles.comparisonGrid}>
              <div className={styles.comparisonCard}>
                <div className={styles.comparisonHeader} style={{ background: 'linear-gradient(135deg, #fee2e2, #fef3c7)' }}>
                  <Eye size={24} style={{ color: '#dc2626' }} />
                  <h4>Centralized Exchange</h4>
                </div>
                <div className={styles.comparisonContent}>
                  <div className={styles.comparisonItem}>
                    <X size={16} className={styles.negative} />
                    <div>
                      <strong>KYC Required</strong>
                      <p>Must provide ID, address, photo</p>
                    </div>
                  </div>
                  <div className={styles.comparisonItem}>
                    <X size={16} className={styles.negative} />
                    <div>
                      <strong>Permanent Records</strong>
                      <p>Exchange logs all your trades forever</p>
                    </div>
                  </div>
                  <div className={styles.comparisonItem}>
                    <X size={16} className={styles.negative} />
                    <div>
                      <strong>Identity Linked</strong>
                      <p>Your deposits/withdrawals tied to your name</p>
                    </div>
                  </div>
                  <div className={styles.comparisonItem}>
                    <X size={16} className={styles.negative} />
                    <div>
                      <strong>Custody Risk</strong>
                      <p>Exchange controls your funds during trade</p>
                    </div>
                  </div>
                  <div className={styles.comparisonItem}>
                    <X size={16} className={styles.negative} />
                    <div>
                      <strong>Data Breaches</strong>
                      <p>Your personal info can be hacked or leaked</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.comparisonCard}>
                <div className={styles.comparisonHeader} style={{ background: 'linear-gradient(135deg, #d1fae5, #a7f3d0)' }}>
                  <EyeOff size={24} style={{ color: '#059669' }} />
                  <h4>Boltz Swap</h4>
                </div>
                <div className={styles.comparisonContent}>
                  <div className={styles.comparisonItem}>
                    <Check size={16} className={styles.positive} />
                    <div>
                      <strong>No KYC</strong>
                      <p>Zero identity verification - completely anonymous</p>
                    </div>
                  </div>
                  <div className={styles.comparisonItem}>
                    <Check size={16} className={styles.positive} />
                    <div>
                      <strong>No Records</strong>
                      <p>Non-custodial, no database of user activity</p>
                    </div>
                  </div>
                  <div className={styles.comparisonItem}>
                    <Check size={16} className={styles.positive} />
                    <div>
                      <strong>Layer Unlinkability</strong>
                      <p>Break chain analysis across Bitcoin layers</p>
                    </div>
                  </div>
                  <div className={styles.comparisonItem}>
                    <Check size={16} className={styles.positive} />
                    <div>
                      <strong>Trustless</strong>
                      <p>Atomic swaps - you always control your keys</p>
                    </div>
                  </div>
                  <div className={styles.comparisonItem}>
                    <Check size={16} className={styles.positive} />
                    <div>
                      <strong>Enhanced Privacy</strong>
                      <p>Access Lightning & Liquid privacy features</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Atomic Swap Demo
          <>
            {/* Progress Steps */}
            <div className={styles.progressSteps}>
              {STEPS.map((s, idx) => (
                <div
                  key={s.id}
                  className={`${styles.progressStep} ${step >= idx ? styles.stepActive : ''} ${step === idx ? styles.stepCurrent : ''}`}
                >
                  <div className={styles.stepNumber}>
                    {step > idx ? <Check size={16} /> : idx}
                  </div>
                  <div className={styles.stepInfo}>
                    <strong>{s.name}</strong>
                    <span>{s.description}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Swap Visualization */}
            <div className={styles.swapContainer}>
              {/* Chain A (Bitcoin or Lightning) */}
              <div className={styles.chain}>
                <div className={styles.chainHeader}>
                  <ChainAIcon size={24} style={{ color: currentScenario.chainA.color }} />
                  <h4>{currentScenario.chainA.name}</h4>
                </div>

                <div className={styles.participant}>
                  <div className={styles.participantHeader}>
                    <div className={styles.avatar} style={{ background: '#f97316' }}>U</div>
                    <div>
                      <strong>You</strong>
                      <span>Have {currentScenario.chainA.asset}</span>
                    </div>
                  </div>

                  <AnimatePresence>
                    {step >= 1 && (
                      <motion.div
                        className={styles.htlc}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <div className={styles.htlcHeader}>
                          {step >= 4 ? (
                            <Unlock size={20} style={{ color: '#22c55e' }} />
                          ) : (
                            <Lock size={20} style={{ color: '#f59e0b' }} />
                          )}
                          <strong>HTLC Contract</strong>
                        </div>
                        <div className={styles.htlcContent}>
                          <div className={styles.htlcRow}>
                            <span>Amount:</span>
                            <strong>{currentScenario.amount} {currentScenario.chainA.asset}</strong>
                          </div>
                          <div className={styles.htlcRow}>
                            <span>Hash:</span>
                            <code>{secretHash}</code>
                          </div>
                          <div className={styles.htlcRow}>
                            <span>Status:</span>
                            {step >= 4 ? (
                              <Badge variant="success" size="small">
                                <Check size={12} /> Claimed by Boltz
                              </Badge>
                            ) : (
                              <Badge variant="warning" size="small">
                                <Lock size={12} /> Locked
                              </Badge>
                            )}
                          </div>
                          {step >= 4 && showSecret && (
                            <motion.div
                              className={styles.secretReveal}
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                            >
                              <Key size={14} />
                              <span>Secret used: <code>{secret}</code></span>
                            </motion.div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Center Arrow with Secret */}
              <div className={styles.centerSection}>
                <div className={styles.secretBox}>
                  <div className={styles.secretHeader}>
                    <Key size={20} />
                    <strong>Shared Secret</strong>
                  </div>
                  <div className={styles.secretContent}>
                    <div className={styles.hashDisplay}>
                      <span>Hash:</span>
                      <code>{secretHash}</code>
                    </div>
                    {showSecret && (
                      <motion.div
                        className={styles.secretDisplay}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                      >
                        <Unlock size={16} style={{ color: '#22c55e' }} />
                        <div>
                          <span>Secret Revealed:</span>
                          <code>{secret}</code>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>

                {step >= 1 && step < 5 && (
                  <motion.div
                    className={styles.swapArrow}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <ArrowLeftRight size={32} />
                  </motion.div>
                )}

                {step === 5 && (
                  <motion.div
                    className={styles.completeIcon}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                  >
                    <Check size={48} style={{ color: '#22c55e' }} />
                  </motion.div>
                )}
              </div>

              {/* Chain B (Liquid or Bitcoin) */}
              <div className={styles.chain}>
                <div className={styles.chainHeader}>
                  <ChainBIcon size={24} style={{ color: currentScenario.chainB.color }} />
                  <h4>{currentScenario.chainB.name}</h4>
                </div>

                <div className={styles.participant}>
                  <div className={styles.participantHeader}>
                    <div className={styles.avatar} style={{ background: '#3b82f6' }}>B</div>
                    <div>
                      <strong>Boltz</strong>
                      <span>Has {currentScenario.chainB.asset}</span>
                    </div>
                  </div>

                  <AnimatePresence>
                    {step >= 2 && (
                      <motion.div
                        className={styles.htlc}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <div className={styles.htlcHeader}>
                          {step >= 3 ? (
                            <Unlock size={20} style={{ color: '#22c55e' }} />
                          ) : (
                            <Lock size={20} style={{ color: '#f59e0b' }} />
                          )}
                          <strong>HTLC Contract</strong>
                        </div>
                        <div className={styles.htlcContent}>
                          <div className={styles.htlcRow}>
                            <span>Amount:</span>
                            <strong>{currentScenario.amount} {currentScenario.chainB.asset}</strong>
                          </div>
                          <div className={styles.htlcRow}>
                            <span>Hash:</span>
                            <code>{secretHash}</code>
                          </div>
                          <div className={styles.htlcRow}>
                            <span>Status:</span>
                            {step >= 3 ? (
                              <Badge variant="success" size="small">
                                <Check size={12} /> Claimed by You
                              </Badge>
                            ) : (
                              <Badge variant="warning" size="small">
                                <Lock size={12} /> Locked
                              </Badge>
                            )}
                          </div>
                          {step >= 3 && showSecret && (
                            <motion.div
                              className={styles.secretReveal}
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                            >
                              <Key size={14} />
                              <span>You reveal: <code>{secret}</code></span>
                            </motion.div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Action Button */}
            {step === 0 && (
                <Button
                variant="primary"
                icon={<Play size={16} />}
                onClick={runSwap}
                fullWidth
              >
                Start Boltz Swap
              </Button>
            )}

            {/* Success Message */}
            {step === 5 && (
              <motion.div
                className={styles.successBox}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Shield size={24} />
                <div>
                  <strong>Swap Completed Successfully!</strong>
                  <p>
                    You now have {currentScenario.amount} {currentScenario.chainB.asset} on {currentScenario.chainB.name}.
                    Boltz has {currentScenario.amount} {currentScenario.chainA.asset} on {currentScenario.chainA.name}.
                    No KYC, no custody, no surveillance - just a trustless atomic swap.
                  </p>
                </div>
              </motion.div>
            )}

            {/* Privacy Benefit */}
            {step === 5 && (
              <motion.div
                className={styles.privacyBenefit}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className={styles.benefitHeader}>
                  <EyeOff size={24} />
                  <h4>Privacy Benefit</h4>
                </div>
                <p>{currentScenario.privacyBenefit}</p>
                <ul>
                  <li>
                    <Check size={16} />
                    <span>Zero KYC - completely anonymous swaps</span>
                  </li>
                  <li>
                    <Check size={16} />
                    <span>Breaks chain surveillance by moving between layers</span>
                  </li>
                  <li>
                    <Check size={16} />
                    <span>No centralized records linking your identity to swaps</span>
                  </li>
                  <li>
                    <Check size={16} />
                    <span>Access advanced privacy features (Lightning routing, Liquid CT)</span>
                  </li>
                  <li>
                    <Check size={16} />
                    <span>Non-custodial - you always control your keys</span>
                  </li>
                </ul>
              </motion.div>
            )}
          </>
        )}
      </Card>

      {/* Technical Deep Dive */}
      <Accordion
        title="Deep Dive: How Boltz Enhances Privacy"
        variant="deepdive"
        icon={<Lock size={16} />}
      >
        <p>
          <strong>Boltz</strong> is a non-custodial swap service that uses atomic swaps to move 
          funds between Bitcoin's different layers (on-chain, Lightning, and Liquid) without 
          requiring KYC or trusting a third party. It's a powerful privacy tool because it lets 
          you break chain surveillance and access privacy features of different Bitcoin layers.
        </p>

        <h4>How Boltz Works (Atomic Swaps via HTLCs):</h4>
        <p>
          Boltz uses <strong>Hash Time-Locked Contracts (HTLCs)</strong> to ensure trustless swaps. 
          The "atomic" property means the swap either completes on both layers or fails on both - 
          there's no scenario where funds can be stolen.
        </p>
        <ul>
          <li>
            <strong>Hash lock:</strong> A random secret is generated and hashed. Both HTLCs require 
            revealing this secret (pre-image) to claim funds
          </li>
          <li>
            <strong>Time lock:</strong> Each HTLC has an expiration time. If the secret isn't 
            revealed before expiry, funds automatically return to the sender
          </li>
          <li>
            <strong>Atomic property:</strong> Once you reveal the secret to claim your funds on one 
            layer, Boltz can use that secret to complete their side - ensuring fairness
          </li>
        </ul>

        <h4>Privacy Benefits of Boltz Swaps:</h4>
        <ul>
          <li>
            <strong>No KYC or identity verification:</strong> Unlike centralized exchanges, Boltz 
            requires zero personal information. You can swap completely anonymously
          </li>
          <li>
            <strong>Non-custodial:</strong> You always control your private keys. Boltz never has 
            custody of your funds, so there's no database linking swaps to identities
          </li>
          <li>
            <strong>Break chain analysis:</strong> Move from transparent on-chain Bitcoin to privacy 
            layers. Observers can't link your activity across layers without advanced correlation
          </li>
          <li>
            <strong>Access Lightning privacy:</strong> Lightning transactions are off-chain and 
            don't appear on the Bitcoin blockchain. Payments are nearly untraceable
          </li>
          <li>
            <strong>Access Liquid confidentiality:</strong> Liquid uses Confidential Transactions 
            to hide amounts and asset types. Only sender and receiver can see transaction details
          </li>
          <li>
            <strong>No permanent records:</strong> Since Boltz is non-custodial, there's no 
            centralized database of who swapped what, when
          </li>
        </ul>

        <h4>Submarine Swaps (Bitcoin ↔ Lightning):</h4>
        <p>
          The most popular Boltz use case is submarine swaps between on-chain Bitcoin and Lightning:
        </p>
        <ul>
          <li>
            <strong>Swap In:</strong> Send on-chain BTC, receive Lightning BTC. Useful for 
            breaking chain surveillance by moving to Lightning's private payment network
          </li>
          <li>
            <strong>Swap Out:</strong> Send Lightning BTC, receive on-chain BTC. Useful when you 
            need to settle on-chain but want to obscure the source
          </li>
          <li>
            <strong>Privacy enhancement:</strong> Once on Lightning, your payments leave no 
            on-chain footprint. Chain analysis companies can't track Lightning payments
          </li>
        </ul>

        <h4>Liquid Swaps (Bitcoin ↔ Liquid):</h4>
        <p>
          Boltz also supports swaps to Liquid Network for confidential transactions:
        </p>
        <ul>
          <li>
            <strong>Confidential amounts:</strong> Liquid hides transaction amounts using 
            cryptographic commitments. Only sender and receiver see the actual values
          </li>
          <li>
            <strong>Confidential assets:</strong> Liquid supports multiple assets (BTC, USDT, etc.) 
            and hides which asset is being transferred
          </li>
          <li>
            <strong>Faster settlements:</strong> Liquid has 1-minute blocks vs Bitcoin's 10 minutes, 
            with better privacy than on-chain
          </li>
        </ul>

        <h4>Privacy Best Practices with Boltz:</h4>
        <ul>
          <li>
            <strong>Use Tor:</strong> Connect to Boltz over Tor to hide your IP address
          </li>
          <li>
            <strong>Avoid address reuse:</strong> Always use fresh addresses when swapping
          </li>
          <li>
            <strong>Chain your swaps:</strong> For maximum privacy, swap Bitcoin → Lightning → Liquid 
            → Bitcoin. Each hop breaks analysis
          </li>
          <li>
            <strong>Mix with CoinJoin:</strong> Combine Boltz swaps with CoinJoin for even stronger privacy
          </li>
        </ul>

        <h4>Limitations to Consider:</h4>
        <ul>
          <li>
            <strong>Fees:</strong> Boltz charges a small service fee (typically 0.1-0.5%) plus 
            on-chain mining fees
          </li>
          <li>
            <strong>Amounts:</strong> There are minimum and maximum swap limits based on liquidity
          </li>
          <li>
            <strong>Hash correlation:</strong> Advanced analysis could potentially correlate the 
            HTLC hash across layers, though this requires monitoring both networks simultaneously
          </li>
          <li>
            <strong>Not a mixer:</strong> Boltz swaps improve privacy but aren't as strong as 
            CoinJoin for on-chain anonymity. Best used in combination
          </li>
        </ul>

        <h4>Why Boltz Matters for Privacy:</h4>
        <p>
          Boltz represents a new paradigm: privacy without permission. You don't need to ask an 
          exchange for permission to swap, provide ID, or trust them with custody. This makes 
          financial privacy accessible to everyone, regardless of jurisdiction or identity - just 
          like Bitcoin itself.
        </p>
      </Accordion>
    </div>
  );
}

export default AtomicSwapVisualizer;
