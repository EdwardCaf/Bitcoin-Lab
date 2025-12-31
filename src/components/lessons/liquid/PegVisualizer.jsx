import { useState } from 'react';
import { 
  ArrowRight,
  ArrowLeft,
  Clock,
  Users,
  EyeOff,
  Shield,
  Shuffle
} from 'lucide-react';
import { Card, Accordion } from '../../common';
import styles from './PegVisualizer.module.css';

const PEG_IN_STEPS = [
  { id: 1, title: 'Send BTC', description: 'Send BTC to the federation\'s multisig address' },
  { id: 2, title: 'Wait 102 blocks', description: '~17 hours for confirmations' },
  { id: 3, title: 'Receive L-BTC', description: 'Federation mints L-BTC 1:1' },
];

const PEG_OUT_STEPS = [
  { id: 1, title: 'Burn L-BTC', description: 'Send L-BTC to peg-out address' },
  { id: 2, title: 'Federation signs', description: 'Verifies and creates BTC tx' },
  { id: 3, title: 'Receive BTC', description: '~2 min + BTC confirmations' },
];

export function PegVisualizer() {
  const [direction, setDirection] = useState('in');

  const steps = direction === 'in' ? PEG_IN_STEPS : PEG_OUT_STEPS;

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
                  ? 'Move BTC from Bitcoin to Liquid'
                  : 'Move L-BTC from Liquid to Bitcoin'}
              </p>
            </div>
          </div>
        </div>

        {/* Direction Toggle */}
        <div className={styles.directionToggle}>
          <button
            className={`${styles.toggleBtn} ${direction === 'in' ? styles.active : ''}`}
            onClick={() => setDirection('in')}
          >
            <ArrowRight size={16} />
            <span>Peg-In</span>
          </button>
          <button
            className={`${styles.toggleBtn} ${direction === 'out' ? styles.active : ''}`}
            onClick={() => setDirection('out')}
          >
            <ArrowLeft size={16} />
            <span>Peg-Out</span>
          </button>
        </div>

        {/* Simple Flow Diagram */}
        <div className={styles.flowDiagram}>
          {/* Source Chain */}
          <div className={`${styles.chainBox} ${direction === 'in' ? styles.bitcoin : styles.liquid}`}>
            <div className={styles.chainIcon}>
              {direction === 'in' ? '₿' : 'L'}
            </div>
            <div className={styles.chainInfo}>
              <span className={styles.chainName}>
                {direction === 'in' ? 'Bitcoin' : 'Liquid'}
              </span>
              <span className={styles.chainAmount}>
                1.0 {direction === 'in' ? 'BTC' : 'L-BTC'}
              </span>
            </div>
          </div>

          {/* Arrow and Steps */}
          <div className={styles.flowSteps}>
            <div className={styles.flowArrow}>
              <ArrowRight size={20} />
            </div>
            <div className={styles.stepsContainer}>
              {steps.map((step, index) => (
                <div key={step.id} className={styles.stepItem}>
                  <div className={styles.stepNumber}>{step.id}</div>
                  <div className={styles.stepContent}>
                    <span className={styles.stepTitle}>{step.title}</span>
                    <span className={styles.stepDesc}>{step.description}</span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={styles.stepConnector} />
                  )}
                </div>
              ))}
            </div>
            <div className={styles.flowArrow}>
              <ArrowRight size={20} />
            </div>
          </div>

          {/* Destination Chain */}
          <div className={`${styles.chainBox} ${direction === 'in' ? styles.liquid : styles.bitcoin}`}>
            <div className={styles.chainIcon}>
              {direction === 'in' ? 'L' : '₿'}
            </div>
            <div className={styles.chainInfo}>
              <span className={styles.chainName}>
                {direction === 'in' ? 'Liquid' : 'Bitcoin'}
              </span>
              <span className={styles.chainAmount}>
                1.0 {direction === 'in' ? 'L-BTC' : 'BTC'}
              </span>
            </div>
          </div>
        </div>

        {/* Federation Note */}
        <div className={styles.federationNote}>
          <Users size={16} />
          <span>Managed by 11-of-15 federation multisig</span>
        </div>

        {/* Time Info */}
        <div className={styles.timeInfo}>
          <Clock size={16} />
          <span>
            {direction === 'in' 
              ? 'Total time: ~17 hours (102 Bitcoin confirmations)'
              : 'Total time: ~2 minutes + Bitcoin confirmations'}
          </span>
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
            staying on Bitcoin's transparent blockchain.
          </p>

          <div className={styles.privacyGrid}>
            <div className={styles.privacyCard}>
              <div className={styles.privacyCardHeader}>
                <Shield size={20} />
                <h4>Confidential Transactions</h4>
              </div>
              <p>
                On Liquid, transaction amounts and asset types are cryptographically hidden. 
                Only the sender and receiver can see the actual values.
              </p>
            </div>

            <div className={styles.privacyCard}>
              <div className={styles.privacyCardHeader}>
                <Shuffle size={20} />
                <h4>Break Chain Analysis</h4>
              </div>
              <p>
                When you peg-in, make confidential transfers, then peg-out, you break the 
                direct link between your input and output UTXOs.
              </p>
            </div>

            <div className={styles.privacyCard}>
              <div className={styles.privacyCardHeader}>
                <EyeOff size={20} />
                <h4>Obscure Transaction History</h4>
              </div>
              <p>
                While on Liquid, all your transactions are confidential. Chain analysts can't 
                track your spending patterns or determine your balance.
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
                <strong>Peg-out:</strong> Return to Bitcoin mainchain. The link between your 
                original peg-in and final peg-out is obscured
              </li>
            </ol>
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
            providers) who collectively manage the Bitcoin reserves using an 11-of-15 multisig.
          </li>
          <li>
            <strong>102 Confirmations:</strong> The long wait for peg-ins ensures the Bitcoin 
            deposit is practically irreversible before L-BTC is issued.
          </li>
          <li>
            <strong>1:1 Backing:</strong> Every L-BTC in circulation is backed by real BTC 
            held in the federation's multisig wallet.
          </li>
          <li>
            <strong>Trust tradeoff:</strong> Unlike Lightning (trustless), Liquid requires 
            trusting the federation. The tradeoff is faster finality and confidential transactions.
          </li>
        </ul>
      </Accordion>
    </div>
  );
}

export default PegVisualizer;
