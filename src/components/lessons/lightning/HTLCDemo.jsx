import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Lock,
  Unlock,
  Key,
  Hash,
  ArrowRight,
  Clock,
  CheckCircle,
  XCircle,
  Play,
  RotateCcw,
  ChevronRight
} from 'lucide-react';
import { Card, Button, Badge, Accordion } from '../../common';
import styles from './HTLCDemo.module.css';

// Simulated hash and preimage
const PREIMAGE = 'secret123';
const HASH = 'a7f5bc...e3d2';

const STEPS = [
  {
    id: 0,
    title: 'Initial State',
    description: 'Carol has something Alice wants to pay for. Carol generates a secret (preimage) and shares its hash.',
    aliceState: 'waiting',
    bobState: 'waiting',
    carolState: 'has_preimage',
  },
  {
    id: 1,
    title: 'Alice Creates HTLC with Bob',
    description: 'Alice locks 0.01 BTC in an HTLC with Bob. Bob can claim it if he provides the preimage, or Alice gets it back after timeout.',
    aliceState: 'locked',
    bobState: 'received_htlc',
    carolState: 'has_preimage',
  },
  {
    id: 2,
    title: 'Bob Creates HTLC with Carol',
    description: 'Bob locks 0.0099 BTC (minus his fee) in an HTLC with Carol using the same hash. Carol can claim with the preimage.',
    aliceState: 'locked',
    bobState: 'locked',
    carolState: 'received_htlc',
  },
  {
    id: 3,
    title: 'Carol Reveals Preimage',
    description: 'Carol reveals the preimage to claim her payment from Bob. This preimage is now visible to Bob.',
    aliceState: 'locked',
    bobState: 'learned_preimage',
    carolState: 'claimed',
  },
  {
    id: 4,
    title: 'Bob Claims from Alice',
    description: 'Bob uses the preimage he learned to claim the payment from Alice. The payment is complete!',
    aliceState: 'paid',
    bobState: 'claimed',
    carolState: 'claimed',
  },
];

export function HTLCDemo() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const step = STEPS[currentStep];

  const nextStep = async () => {
    if (currentStep >= STEPS.length - 1 || isAnimating) return;
    setIsAnimating(true);
    await new Promise(resolve => setTimeout(resolve, 300));
    setCurrentStep(prev => prev + 1);
    setIsAnimating(false);
  };

  const prevStep = () => {
    if (currentStep <= 0 || isAnimating) return;
    setCurrentStep(prev => prev - 1);
  };

  const reset = () => {
    setCurrentStep(0);
    setIsAnimating(false);
  };

  const getNodeState = (state) => {
    switch (state) {
      case 'has_preimage':
        return { icon: Key, color: '#22c55e', label: 'Has secret' };
      case 'waiting':
        return { icon: Clock, color: '#6b7280', label: 'Waiting' };
      case 'locked':
        return { icon: Lock, color: '#f97316', label: 'Funds locked' };
      case 'received_htlc':
        return { icon: Lock, color: '#3b82f6', label: 'Received HTLC' };
      case 'learned_preimage':
        return { icon: Key, color: '#22c55e', label: 'Learned secret' };
      case 'claimed':
        return { icon: CheckCircle, color: '#22c55e', label: 'Claimed!' };
      case 'paid':
        return { icon: CheckCircle, color: '#22c55e', label: 'Paid!' };
      default:
        return { icon: Clock, color: '#6b7280', label: '' };
    }
  };

  const aliceNodeState = getNodeState(step.aliceState);
  const bobNodeState = getNodeState(step.bobState);
  const carolNodeState = getNodeState(step.carolState);

  return (
    <div className={styles.container}>
      <Card variant="elevated" padding="large">
        <div className={styles.header}>
          <div className={styles.titleSection}>
            <div className={styles.iconWrapper}>
              <Lock size={24} />
            </div>
            <div>
              <h3 className={styles.title}>Hash Time-Locked Contracts</h3>
              <p className={styles.subtitle}>
                Step through how HTLCs enable trustless multi-hop payments
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

        {/* Hash/Preimage Display */}
        <div className={styles.cryptoDisplay}>
          <div className={styles.cryptoItem}>
            <Hash size={16} />
            <span className={styles.cryptoLabel}>Hash:</span>
            <code className={styles.cryptoValue}>{HASH}</code>
            <Badge variant="outline" size="small">Public</Badge>
          </div>
          <div className={styles.cryptoItem}>
            <Key size={16} />
            <span className={styles.cryptoLabel}>Preimage:</span>
            <code className={`${styles.cryptoValue} ${currentStep >= 3 ? styles.revealed : styles.hidden}`}>
              {currentStep >= 3 ? PREIMAGE : '????????'}
            </code>
            <Badge 
              variant={currentStep >= 3 ? 'success' : 'secondary'} 
              size="small"
            >
              {currentStep >= 3 ? 'Revealed!' : 'Secret'}
            </Badge>
          </div>
        </div>

        {/* Step Progress */}
        <div className={styles.stepProgress}>
          {STEPS.map((s, i) => (
            <div 
              key={s.id}
              className={`${styles.stepDot} ${i === currentStep ? styles.active : ''} ${i < currentStep ? styles.completed : ''}`}
            >
              {i < currentStep ? <CheckCircle size={16} /> : i + 1}
            </div>
          ))}
        </div>

        {/* Current Step Info */}
        <motion.div
          key={currentStep}
          className={styles.stepInfo}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Badge variant="primary">Step {currentStep + 1} of {STEPS.length}</Badge>
          <h4>{step.title}</h4>
          <p>{step.description}</p>
        </motion.div>

        {/* Three-Party Visualization */}
        <div className={styles.partyViz}>
          {/* Alice */}
          <div className={styles.party}>
            <div className={styles.avatar} style={{ backgroundColor: '#f97316' }}>
              A
            </div>
            <span className={styles.partyName}>Alice</span>
            <span className={styles.partyRole}>Sender</span>
            <motion.div 
              className={styles.stateIndicator}
              style={{ backgroundColor: `${aliceNodeState.color}20`, borderColor: aliceNodeState.color }}
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              key={step.aliceState}
            >
              <aliceNodeState.icon size={16} style={{ color: aliceNodeState.color }} />
              <span style={{ color: aliceNodeState.color }}>{aliceNodeState.label}</span>
            </motion.div>
          </div>

          {/* Arrow Alice -> Bob */}
          <div className={styles.arrow}>
            <div className={`${styles.arrowLine} ${currentStep >= 1 ? styles.active : ''}`}>
              {currentStep >= 1 && currentStep < 4 && (
                <span className={styles.htlcLabel}>HTLC: 0.01 BTC</span>
              )}
              {currentStep >= 4 && (
                <motion.span 
                  className={styles.preimageFlow}
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                >
                  <Key size={12} /> preimage
                </motion.span>
              )}
            </div>
            <ArrowRight size={20} className={currentStep >= 1 ? styles.activeArrow : ''} />
          </div>

          {/* Bob */}
          <div className={styles.party}>
            <div className={styles.avatar} style={{ backgroundColor: '#3b82f6' }}>
              B
            </div>
            <span className={styles.partyName}>Bob</span>
            <span className={styles.partyRole}>Router</span>
            <motion.div 
              className={styles.stateIndicator}
              style={{ backgroundColor: `${bobNodeState.color}20`, borderColor: bobNodeState.color }}
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              key={step.bobState}
            >
              <bobNodeState.icon size={16} style={{ color: bobNodeState.color }} />
              <span style={{ color: bobNodeState.color }}>{bobNodeState.label}</span>
            </motion.div>
          </div>

          {/* Arrow Bob -> Carol */}
          <div className={styles.arrow}>
            <div className={`${styles.arrowLine} ${currentStep >= 2 ? styles.active : ''}`}>
              {currentStep >= 2 && currentStep < 3 && (
                <span className={styles.htlcLabel}>HTLC: 0.0099 BTC</span>
              )}
              {currentStep >= 3 && (
                <motion.span 
                  className={styles.preimageFlow}
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                >
                  <Key size={12} /> preimage
                </motion.span>
              )}
            </div>
            <ArrowRight size={20} className={currentStep >= 2 ? styles.activeArrow : ''} />
          </div>

          {/* Carol */}
          <div className={styles.party}>
            <div className={styles.avatar} style={{ backgroundColor: '#22c55e' }}>
              C
            </div>
            <span className={styles.partyName}>Carol</span>
            <span className={styles.partyRole}>Receiver</span>
            <motion.div 
              className={styles.stateIndicator}
              style={{ backgroundColor: `${carolNodeState.color}20`, borderColor: carolNodeState.color }}
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              key={step.carolState}
            >
              <carolNodeState.icon size={16} style={{ color: carolNodeState.color }} />
              <span style={{ color: carolNodeState.color }}>{carolNodeState.label}</span>
            </motion.div>
          </div>
        </div>

        {/* Navigation */}
        <div className={styles.navigation}>
          <Button
            variant="secondary"
            onClick={prevStep}
            disabled={currentStep === 0 || isAnimating}
          >
            Previous
          </Button>
          
          {currentStep < STEPS.length - 1 ? (
            <Button
              variant="primary"
              icon={<ChevronRight size={16} />}
              onClick={nextStep}
              disabled={isAnimating}
            >
              Next Step
            </Button>
          ) : (
            <Button
              variant="success"
              icon={<CheckCircle size={16} />}
              disabled
            >
              Complete!
            </Button>
          )}
        </div>

        {/* Key Insight */}
        <div className={styles.insight}>
          <strong>Key Insight:</strong> The preimage flows backwards (Carol → Bob → Alice) 
          while the payments flow forwards. This ensures everyone gets paid atomically!
        </div>
      </Card>

      <Accordion
        title="Deep Dive: HTLC Mechanics"
        variant="deepdive"
        icon={<Lock size={16} />}
      >
        <p>
          Hash Time-Locked Contracts are the cryptographic foundation of Lightning payments:
        </p>
        <ul>
          <li>
            <strong>Hash lock:</strong> Funds can only be claimed by revealing the preimage 
            that hashes to a known hash value. SHA256(preimage) = hash
          </li>
          <li>
            <strong>Time lock:</strong> If the preimage isn't revealed within a timeout, 
            the sender can reclaim their funds. This prevents funds from being stuck forever.
          </li>
          <li>
            <strong>Decreasing timelocks:</strong> Each hop has a shorter timeout than the 
            previous. This ensures intermediate nodes have time to claim their incoming 
            payment after forwarding.
          </li>
          <li>
            <strong>Atomic execution:</strong> Either the entire payment succeeds (preimage 
            revealed at all hops) or it fails completely (everyone reclaims via timeout).
          </li>
        </ul>
        <p>
          <strong>Security:</strong> Even if Bob is malicious, he can't steal funds - he 
          can only claim from Alice if he knows the preimage, which he only learns after 
          paying Carol.
        </p>
      </Accordion>
    </div>
  );
}

export default HTLCDemo;
