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
  Play,
  EyeOff,
  Shield,
  Shuffle
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
      await new Promise(resolve => setTimeout(resolve, 3000));
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

      {/* Privacy Benefits Section */}
      <Card variant="elevated" padding="large">
        <div className={styles.privacySection}>
          <div className={styles.privacyHeader}>
            <EyeOff size={24} />
            <h3>Privacy Benefits of Liquid Pegs</h3>
          </div>
          <p className={styles.privacyDescription}>
            Moving funds through Liquid provides significant privacy enhancements compared to 
            staying on Bitcoin's transparent blockchain. Here's how peg-in and peg-out can 
            enhance your privacy:
          </p>

          <div className={styles.privacyGrid}>
            <div className={styles.privacyCard}>
              <div className={styles.privacyCardHeader}>
                <Shield size={20} />
                <h4>Confidential Transactions</h4>
              </div>
              <p>
                On Liquid, transaction amounts and asset types are cryptographically hidden. 
                Only the sender and receiver can see the actual values - everyone else sees 
                only encrypted commitments. This breaks amount-based analysis.
              </p>
            </div>

            <div className={styles.privacyCard}>
              <div className={styles.privacyCardHeader}>
                <Shuffle size={20} />
                <h4>Break Chain Analysis</h4>
              </div>
              <p>
                When you peg-in to Liquid, make confidential transfers, then peg-out, you 
                break the direct link between your input and output UTXOs. Observers can't 
                easily determine which peg-out corresponds to which peg-in.
              </p>
            </div>

            <div className={styles.privacyCard}>
              <div className={styles.privacyCardHeader}>
                <EyeOff size={20} />
                <h4>Obscure Transaction History</h4>
              </div>
              <p>
                While on Liquid, all your transactions are confidential. This means chain 
                analysts can't track your spending patterns, payment amounts, or determine 
                your balance - making your financial activity private.
              </p>
            </div>
          </div>

          <div className={styles.privacyStrategy}>
            <h4>Privacy Strategy Example:</h4>
            <ol className={styles.strategySteps}>
              <li>
                <strong>Peg-in:</strong> Send 1 BTC from your public Bitcoin address to Liquid
              </li>
              <li>
                <strong>Confidential Transfers:</strong> Make multiple confidential transactions 
                on Liquid. Amounts are hidden, breaking amount-based clustering
              </li>
              <li>
                <strong>Mix with others:</strong> Your L-BTC mixes with other users' L-BTC in 
                the confidential transaction set
              </li>
              <li>
                <strong>Peg-out:</strong> Return to Bitcoin mainchain. The link between your 
                original peg-in and final peg-out is obscured by the confidential activity
              </li>
            </ol>
            <p className={styles.strategyNote}>
              <strong>Result:</strong> Chain analysts can see you pegged-in 1 BTC and later 
              someone pegged-out 1 BTC, but they can't definitively link the two transactions 
              or track what happened in between. The confidential transfers create reasonable 
              deniability.
            </p>
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

      <Accordion
        title="Privacy Deep Dive: How Confidential Transactions Work"
        variant="deepdive"
        icon={<EyeOff size={16} />}
      >
        <p>
          Liquid's <strong>Confidential Transactions (CT)</strong> use advanced cryptography 
          to hide transaction amounts while still allowing the network to verify that the 
          math adds up (no coins are created or destroyed):
        </p>

        <h4>How Confidential Transactions Work:</h4>
        <ul>
          <li>
            <strong>Pedersen Commitments:</strong> Transaction amounts are replaced with 
            cryptographic commitments. These commitments hide the actual values but can 
            still be added and subtracted mathematically.
          </li>
          <li>
            <strong>Range Proofs:</strong> Zero-knowledge proofs ensure that hidden amounts 
            are positive and within a valid range, preventing negative or overflow values.
          </li>
          <li>
            <strong>Blinding Factors:</strong> Only the sender and receiver know the blinding 
            factors needed to reveal the true amounts. Network observers see only encrypted data.
          </li>
          <li>
            <strong>Asset Tags:</strong> In addition to amounts, the asset type (BTC, USDT, etc.) 
            is also blinded, making it impossible to tell what's being transferred.
          </li>
        </ul>

        <h4>Privacy Implications:</h4>
        <ul>
          <li>
            <strong>Amount privacy:</strong> No one except sender and receiver can see how much 
            is being transferred. This defeats amount-based clustering heuristics.
          </li>
          <li>
            <strong>Balance privacy:</strong> Since amounts are hidden, observers can't determine 
            anyone's L-BTC balance by looking at the blockchain.
          </li>
          <li>
            <strong>Payment pattern privacy:</strong> Without amounts, it's harder to link 
            transactions based on "round number" payments or unique amount patterns.
          </li>
          <li>
            <strong>Cross-chain unlinkability:</strong> When combined with peg-in/peg-out, this 
            creates gaps in the transaction graph that break chain analysis.
          </li>
        </ul>

        <h4>Privacy Limitations:</h4>
        <ul>
          <li>
            <strong>Address reuse still bad:</strong> Like Bitcoin, reusing Liquid addresses 
            links all transactions to that address together. Always use fresh addresses.
          </li>
          <li>
            <strong>Timing analysis:</strong> If you peg-in and immediately peg-out the same 
            amount, the timing correlation can link the transactions. Add delays and make 
            intermediate transfers.
          </li>
          <li>
            <strong>Network-level privacy:</strong> Your IP address can still be exposed unless 
            you use Tor or VPN. Liquid hides transaction data but not network metadata.
          </li>
          <li>
            <strong>Peg endpoints visible:</strong> The peg-in (on Bitcoin) and peg-out (on Bitcoin) 
            are transparent. Only the Liquid activity in between is confidential.
          </li>
        </ul>

        <h4>Best Practices for Maximum Privacy:</h4>
        <ul>
          <li>
            <strong>Wait between peg-in and peg-out:</strong> Don't immediately peg-out after 
            pegging-in. Make multiple transactions on Liquid first.
          </li>
          <li>
            <strong>Vary amounts:</strong> If pegging-in 1 BTC, consider pegging-out in different 
            amounts (e.g., 0.6 BTC and 0.4 BTC at different times).
          </li>
          <li>
            <strong>Use fresh addresses:</strong> Never reuse Liquid addresses. Generate a new 
            address for each peg-in and peg-out.
          </li>
          <li>
            <strong>Combine with other techniques:</strong> Use CoinJoin before peg-in and/or 
            after peg-out for maximum privacy.
          </li>
          <li>
            <strong>Use Tor:</strong> Connect to Liquid nodes over Tor to prevent IP-based 
            correlation.
          </li>
        </ul>

        <h4>Why This Matters:</h4>
        <p>
          Liquid's Confidential Transactions represent one of the strongest privacy technologies 
          available in Bitcoin today. Unlike mixing techniques that rely on anonymity sets, CT 
          provides cryptographic privacy - no one can see the amounts, period. Combined with 
          the peg mechanism, this gives you a powerful tool to break chain surveillance while 
          maintaining full Bitcoin custody (via the federation).
        </p>
      </Accordion>
    </div>
  );
}

export default PegVisualizer;
