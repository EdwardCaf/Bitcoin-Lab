import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight,
  ArrowLeft,
  Clock,
  CheckCircle,
  Lock,
  Unlock,
  Users,
  RotateCcw,
  Play
} from 'lucide-react';
import { Card, Button, Badge, Accordion } from '../../common';
import styles from './PegVisualizer.module.css';

const PEG_IN_STEPS = [
  { id: 0, title: 'Start', description: 'You have BTC on the Bitcoin mainchain and want to use Liquid.' },
  { id: 1, title: 'Send to Federation', description: 'Send BTC to a special federation address. This is a multi-signature address controlled by Liquid functionaries.' },
  { id: 2, title: 'Wait for Confirmations', description: 'Wait for 102 Bitcoin confirmations (~17 hours). This ensures the transaction is deeply buried and irreversible.' },
  { id: 3, title: 'Receive L-BTC', description: 'The federation sees your confirmed deposit and mints an equivalent amount of L-BTC on the Liquid sidechain.' },
  { id: 4, title: 'Complete!', description: 'You now have L-BTC on Liquid. It\'s pegged 1:1 with BTC and can be transferred with 1-minute finality.' },
];

const PEG_OUT_STEPS = [
  { id: 0, title: 'Start', description: 'You have L-BTC on Liquid and want to move back to Bitcoin mainchain.' },
  { id: 1, title: 'Burn L-BTC', description: 'Send your L-BTC to a special peg-out address, specifying your Bitcoin destination. The L-BTC is burned.' },
  { id: 2, title: 'Federation Signs', description: 'The federation verifies the burn and creates a Bitcoin transaction to your address.' },
  { id: 3, title: 'Wait for Release', description: 'The federation releases BTC from the reserve. This typically takes 2 Liquid blocks (~2 minutes) plus Bitcoin confirmation time.' },
  { id: 4, title: 'Complete!', description: 'You receive BTC on the Bitcoin mainchain. The 1:1 peg is maintained.' },
];

export function PegVisualizer() {
  const [direction, setDirection] = useState('in'); // 'in' or 'out'
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const steps = direction === 'in' ? PEG_IN_STEPS : PEG_OUT_STEPS;
  const step = steps[currentStep];

  const runAnimation = async () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentStep(0);
    
    for (let i = 1; i <= steps.length - 1; i++) {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setCurrentStep(i);
    }
    
    setIsAnimating(false);
  };

  const reset = () => {
    setCurrentStep(0);
    setIsAnimating(false);
  };

  const switchDirection = (newDirection) => {
    setDirection(newDirection);
    setCurrentStep(0);
    setIsAnimating(false);
  };

  return (
    <div className={styles.container}>
      <Card variant="elevated" padding="large">
        <div className={styles.header}>
          <div className={styles.titleSection}>
            <div className={styles.iconWrapper}>
              {direction === 'in' ? <ArrowRight size={24} /> : <ArrowLeft size={24} />}
            </div>
            <div>
              <h3 className={styles.title}>
                {direction === 'in' ? 'Peg-In' : 'Peg-Out'} Process
              </h3>
              <p className={styles.subtitle}>
                {direction === 'in' 
                  ? 'Move BTC from Bitcoin to Liquid (BTC → L-BTC)'
                  : 'Move L-BTC from Liquid to Bitcoin (L-BTC → BTC)'}
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

        {/* Direction Toggle */}
        <div className={styles.directionToggle}>
          <button
            className={`${styles.toggleBtn} ${direction === 'in' ? styles.active : ''}`}
            onClick={() => switchDirection('in')}
          >
            <ArrowRight size={16} />
            Peg-In (BTC → L-BTC)
          </button>
          <button
            className={`${styles.toggleBtn} ${direction === 'out' ? styles.active : ''}`}
            onClick={() => switchDirection('out')}
          >
            <ArrowLeft size={16} />
            Peg-Out (L-BTC → BTC)
          </button>
        </div>

        {/* Chain Visualization */}
        <div className={styles.chainViz}>
          {/* Bitcoin Side */}
          <div className={`${styles.chain} ${styles.bitcoinChain}`}>
            <div className={styles.chainLabel}>
              <span className={styles.chainIcon}>₿</span>
              Bitcoin Mainchain
            </div>
            <motion.div 
              className={styles.balanceBox}
              animate={{
                scale: direction === 'in' && currentStep >= 1 ? 0.9 : 1,
                opacity: direction === 'in' && currentStep >= 1 ? 0.5 : 1
              }}
            >
              <span className={styles.balanceAmount}>
                {direction === 'in' 
                  ? (currentStep >= 1 ? '0.0 BTC' : '1.0 BTC')
                  : (currentStep >= 4 ? '1.0 BTC' : '0.0 BTC')
                }
              </span>
              <span className={styles.balanceLabel}>Your Balance</span>
            </motion.div>
          </div>

          {/* Bridge / Federation */}
          <div className={styles.bridge}>
            <motion.div 
              className={styles.federationBox}
              animate={{
                backgroundColor: currentStep >= 1 && currentStep <= 3 
                  ? 'rgba(249, 115, 22, 0.2)' 
                  : 'var(--bg-secondary)'
              }}
            >
              <Users size={24} />
              <span>Federation</span>
              <span className={styles.federationSubtext}>11-of-15 multisig</span>
            </motion.div>

            {/* Animation Arrow */}
            <AnimatePresence>
              {isAnimating && currentStep >= 1 && currentStep <= 3 && (
                <motion.div
                  className={styles.transferAnimation}
                  initial={{ 
                    x: direction === 'in' ? -50 : 50,
                    opacity: 0 
                  }}
                  animate={{ 
                    x: direction === 'in' ? 50 : -50,
                    opacity: [0, 1, 1, 0]
                  }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  {direction === 'in' ? '₿ →' : '← L-₿'}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Liquid Side */}
          <div className={`${styles.chain} ${styles.liquidChain}`}>
            <div className={styles.chainLabel}>
              <span className={styles.chainIcon}>L</span>
              Liquid Sidechain
            </div>
            <motion.div 
              className={styles.balanceBox}
              animate={{
                scale: direction === 'out' && currentStep >= 1 ? 0.9 : 1,
                opacity: direction === 'out' && currentStep >= 1 ? 0.5 : 1
              }}
            >
              <span className={styles.balanceAmount}>
                {direction === 'in' 
                  ? (currentStep >= 4 ? '1.0 L-BTC' : '0.0 L-BTC')
                  : (currentStep >= 1 ? '0.0 L-BTC' : '1.0 L-BTC')
                }
              </span>
              <span className={styles.balanceLabel}>Your Balance</span>
            </motion.div>
          </div>
        </div>

        {/* Step Progress */}
        <div className={styles.stepProgress}>
          {steps.map((s, i) => (
            <div 
              key={s.id}
              className={`${styles.stepDot} ${i === currentStep ? styles.active : ''} ${i < currentStep ? styles.completed : ''}`}
            >
              {i < currentStep ? <CheckCircle size={14} /> : i + 1}
            </div>
          ))}
        </div>

        {/* Current Step Info */}
        <motion.div
          key={`${direction}-${currentStep}`}
          className={styles.stepInfo}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Badge variant={currentStep === steps.length - 1 ? 'success' : 'primary'}>
            Step {currentStep + 1} of {steps.length}
          </Badge>
          <h4>{step.title}</h4>
          <p>{step.description}</p>
        </motion.div>

        {/* Run Button */}
        <div className={styles.actions}>
          <Button
            variant="primary"
            icon={<Play size={16} />}
            onClick={runAnimation}
            disabled={isAnimating || currentStep === steps.length - 1}
          >
            {isAnimating ? 'Processing...' : 'Run Animation'}
          </Button>
        </div>

        {/* Time Comparison */}
        <div className={styles.timeComparison}>
          <div className={styles.timeCard}>
            <Clock size={18} />
            <div>
              <strong>Peg-In Time</strong>
              <span>~102 confirmations (~17 hours)</span>
            </div>
          </div>
          <div className={styles.timeCard}>
            <Clock size={18} />
            <div>
              <strong>Peg-Out Time</strong>
              <span>~2 minutes + Bitcoin confirmations</span>
            </div>
          </div>
        </div>
      </Card>

      <Accordion
        title="Deep Dive: The Federated Peg"
        variant="deepdive"
        icon={<Users size={16} />}
      >
        <p>
          Liquid uses a <strong>federated two-way peg</strong> to secure the bridge between 
          Bitcoin and Liquid:
        </p>
        <ul>
          <li>
            <strong>Federation:</strong> A group of trusted entities (exchanges, infrastructure 
            providers) who collectively manage the Bitcoin reserves. They use an 11-of-15 
            multisig scheme - at least 11 must sign to move funds.
          </li>
          <li>
            <strong>102 Confirmations:</strong> The long wait for peg-ins ensures the Bitcoin 
            deposit is practically irreversible before L-BTC is issued. This protects against 
            reorg attacks.
          </li>
          <li>
            <strong>1:1 Backing:</strong> Every L-BTC in circulation is backed by real BTC 
            held in the federation's multisig wallet. The peg is fully auditable on-chain.
          </li>
          <li>
            <strong>Trust tradeoff:</strong> Unlike Lightning (trustless), Liquid requires 
            trusting the federation won't collude. The tradeoff is faster finality and 
            features like confidential transactions.
          </li>
        </ul>
        <p>
          <strong>Note:</strong> The federation members are well-known companies with 
          reputational and financial incentives to behave honestly.
        </p>
      </Accordion>
    </div>
  );
}

export default PegVisualizer;
