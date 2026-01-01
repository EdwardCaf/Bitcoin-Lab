import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Eye, 
  EyeOff,
  AlertTriangle,
  Check,
  ArrowRight,
  RotateCcw,
  User,
  Building,
  ShoppingCart
} from 'lucide-react';
import { Card, Button, Badge, Accordion } from '../../common';
import styles from './AddressReuseDemo.module.css';

const generateAddress = () => {
  const chars = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
  let address = 'bc1q';
  for (let i = 0; i < 38; i++) {
    address += chars[Math.floor(Math.random() * chars.length)];
  }
  return address;
};

const scenarios = {
  reuse: {
    title: 'Address Reuse (Bad)',
    description: 'Using the same address for multiple payments',
    payments: [
      { from: 'Employer (Salary)', amount: '0.5 BTC', icon: Building },
      { from: 'Friend (Repayment)', amount: '0.1 BTC', icon: User },
      { from: 'Online Store (Refund)', amount: '0.05 BTC', icon: ShoppingCart },
    ]
  },
  fresh: {
    title: 'Fresh Addresses (Good)',
    description: 'Using a new address for each payment',
    payments: [
      { from: 'Employer (Salary)', amount: '0.5 BTC', icon: Building },
      { from: 'Friend (Repayment)', amount: '0.1 BTC', icon: User },
      { from: 'Online Store (Refund)', amount: '0.05 BTC', icon: ShoppingCart },
    ]
  }
};

export function AddressReuseDemo() {
  const [mode, setMode] = useState('reuse');
  const [step, setStep] = useState(0);
  const [sharedAddress] = useState(generateAddress());
  const [freshAddresses] = useState([generateAddress(), generateAddress(), generateAddress()]);
  
  const scenario = scenarios[mode];
  
  const reset = () => {
    setStep(0);
  };
  
  const addPayment = () => {
    if (step < 3) {
      setStep(step + 1);
    }
  };

  return (
    <div className={styles.container}>
      <Card variant="elevated" padding="large">
        <div className={styles.header}>
          <div className={styles.titleSection}>
            <div className={styles.iconWrapper}>
              {mode === 'reuse' ? <Eye size={24} /> : <EyeOff size={24} />}
            </div>
            <div>
              <h3 className={styles.title}>Address Reuse Demo</h3>
              <p className={styles.subtitle}>
                See how address reuse affects your privacy
              </p>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="small"
            icon={<RotateCcw size={14} />}
            onClick={reset}
          >
            Reset
          </Button>
        </div>

        {/* Mode Selector */}
        <div className={styles.modeSelector}>
          <button
            className={`${styles.modeButton} ${mode === 'reuse' ? styles.selected : ''}`}
            onClick={() => { setMode('reuse'); reset(); }}
          >
            <Eye size={18} />
            <span>Address Reuse</span>
            <Badge variant="error" size="small">Bad</Badge>
          </button>
          <button
            className={`${styles.modeButton} ${mode === 'fresh' ? styles.selected : ''}`}
            onClick={() => { setMode('fresh'); reset(); }}
          >
            <EyeOff size={18} />
            <span>Fresh Addresses</span>
            <Badge variant="success" size="small">Good</Badge>
          </button>
        </div>

        {/* Visualization */}
        <div className={styles.visualization}>
          {/* Your Wallet */}
          <div className={styles.walletSection}>
            <h4>Your Wallet</h4>
            <div className={styles.addressList}>
              {mode === 'reuse' ? (
                <div className={`${styles.addressCard} ${styles.reuseAddress}`}>
                  <code>{sharedAddress.slice(0, 12)}...{sharedAddress.slice(-8)}</code>
                  {step > 0 && (
                    <div className={styles.paymentCount}>
                      {step} payment{step > 1 ? 's' : ''}
                    </div>
                  )}
                </div>
              ) : (
                freshAddresses.slice(0, Math.max(1, step)).map((addr, i) => (
                  <motion.div
                    key={addr}
                    className={styles.addressCard}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <code>{addr.slice(0, 12)}...{addr.slice(-8)}</code>
                    {i < step && (
                      <Badge variant="success" size="small">1 payment</Badge>
                    )}
                  </motion.div>
                ))
              )}
            </div>
          </div>

          {/* Payments */}
          <div className={styles.paymentsSection}>
            <h4>Incoming Payments</h4>
            <div className={styles.paymentsList}>
              {scenario.payments.slice(0, step).map((payment, i) => {
                const Icon = payment.icon;
                return (
                  <motion.div
                    key={i}
                    className={styles.paymentCard}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <div className={styles.paymentIcon}>
                      <Icon size={18} />
                    </div>
                    <div className={styles.paymentInfo}>
                      <span className={styles.paymentFrom}>{payment.from}</span>
                      <span className={styles.paymentAmount}>{payment.amount}</span>
                    </div>
                    <ArrowRight size={16} className={styles.paymentArrow} />
                    <code className={styles.paymentAddress}>
                      {mode === 'reuse' 
                        ? `${sharedAddress.slice(0, 8)}...` 
                        : `${freshAddresses[i].slice(0, 8)}...`}
                    </code>
                  </motion.div>
                );
              })}
              
              {step < 3 && (
                <Button
                  variant="secondary"
                  onClick={addPayment}
                  icon={<ArrowRight size={16} />}
                  fullWidth
                >
                  Receive Payment #{step + 1}
                </Button>
              )}
            </div>
          </div>

          {/* Observer View */}
          {step > 1 && (
            <motion.div 
              className={styles.observerSection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h4>
                <Eye size={18} />
                What an Observer Sees
              </h4>
              <div className={`${styles.observerBox} ${mode === 'reuse' ? styles.exposed : styles.private}`}>
                {mode === 'reuse' ? (
                  <>
                    <AlertTriangle size={24} />
                    <div>
                      <strong>Privacy Compromised!</strong>
                      <p>
                        An observer can see that <code>{sharedAddress.slice(0, 12)}...</code> received 
                        payments from {step} different sources. They can link your employer, friend, 
                        and shopping habits to the same person.
                      </p>
                      <ul>
                        {scenario.payments.slice(0, step).map((p, i) => (
                          <li key={i}>{p.from}: {p.amount}</li>
                        ))}
                      </ul>
                      <p>Total balance visible: {(0.5 + (step > 1 ? 0.1 : 0) + (step > 2 ? 0.05 : 0)).toFixed(2)} BTC</p>
                    </div>
                  </>
                ) : (
                  <>
                    <Check size={24} />
                    <div>
                      <strong>Privacy Preserved!</strong>
                      <p>
                        An observer sees {step} unrelated addresses. Without additional information, 
                        they can't tell these belong to the same person.
                      </p>
                      <p>
                        Each payment appears to go to a different entity.
                      </p>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </Card>

      
    </div>
  );
}

export default AddressReuseDemo;
