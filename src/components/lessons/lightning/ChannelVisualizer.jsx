import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, 
  ArrowRight, 
  ArrowLeft,
  Lock,
  Unlock,
  Play,
  RotateCcw,
  Plus,
  Minus,
  Clock
} from 'lucide-react';
import { Card, Button, Badge, Accordion } from '../../common';
import styles from './ChannelVisualizer.module.css';

const INITIAL_BALANCE = { alice: 0.5, bob: 0.5 };
const CHANNEL_CAPACITY = 1.0;

export function ChannelVisualizer() {
  const [channelState, setChannelState] = useState('closed'); // closed, opening, open, closing
  const [balance, setBalance] = useState(INITIAL_BALANCE);
  const [stateCount, setStateCount] = useState(0);
  const [history, setHistory] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);

  const openChannel = async () => {
    setIsAnimating(true);
    setChannelState('opening');
    await new Promise(resolve => setTimeout(resolve, 1500));
    setChannelState('open');
    setStateCount(1);
    setHistory([{ type: 'open', alice: 0.5, bob: 0.5 }]);
    setIsAnimating(false);
  };

  const closeChannel = async () => {
    setIsAnimating(true);
    setChannelState('closing');
    await new Promise(resolve => setTimeout(resolve, 1500));
    setChannelState('closed');
    setHistory([]);
    setStateCount(0);
    setBalance(INITIAL_BALANCE);
    setIsAnimating(false);
  };

  const sendPayment = async (from, amount) => {
    if (channelState !== 'open' || isAnimating) return;
    
    const to = from === 'alice' ? 'bob' : 'alice';
    if (balance[from] < amount) return;

    setIsAnimating(true);
    
    // Animate the payment
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const newBalance = {
      ...balance,
      [from]: Math.round((balance[from] - amount) * 1000) / 1000,
      [to]: Math.round((balance[to] + amount) * 1000) / 1000
    };
    
    setBalance(newBalance);
    setStateCount(prev => prev + 1);
    setHistory(prev => [...prev, { 
      type: 'payment', 
      from, 
      to, 
      amount, 
      alice: newBalance.alice, 
      bob: newBalance.bob 
    }]);
    
    setIsAnimating(false);
  };

  const resetChannel = () => {
    setChannelState('closed');
    setBalance(INITIAL_BALANCE);
    setStateCount(0);
    setHistory([]);
    setIsAnimating(false);
  };

  const alicePercent = (balance.alice / CHANNEL_CAPACITY) * 100;
  const bobPercent = (balance.bob / CHANNEL_CAPACITY) * 100;

  return (
    <div className={styles.container}>
      <Card variant="elevated" padding="large">
        <div className={styles.header}>
          <div className={styles.titleSection}>
            <div className={styles.iconWrapper}>
              <Zap size={24} />
            </div>
            <div>
              <h3 className={styles.title}>Payment Channel</h3>
              <p className={styles.subtitle}>
                Open a channel and send instant off-chain payments
              </p>
            </div>
          </div>
          
          <div className={styles.controls}>
            <Badge variant={channelState === 'open' ? 'success' : 'secondary'}>
              {channelState === 'closed' && 'Channel Closed'}
              {channelState === 'opening' && 'Opening...'}
              {channelState === 'open' && 'Channel Open'}
              {channelState === 'closing' && 'Closing...'}
            </Badge>
            <Button
              variant="ghost"
              size="small"
              icon={<RotateCcw size={14} />}
              onClick={resetChannel}
            >
              Reset
            </Button>
          </div>
        </div>

        {/* Channel Visualization */}
        <div className={styles.channelViz}>
          {/* Alice Side */}
          <div className={styles.participant}>
            <div className={styles.avatar} style={{ backgroundColor: '#f97316' }}>
              A
            </div>
            <span className={styles.name}>Alice</span>
            <span className={styles.balance}>{balance.alice} BTC</span>
            
            {channelState === 'open' && (
              <div className={styles.paymentControls}>
                <Button
                  variant="secondary"
                  size="small"
                  icon={<ArrowRight size={14} />}
                  onClick={() => sendPayment('alice', 0.1)}
                  disabled={balance.alice < 0.1 || isAnimating}
                >
                  Send 0.1
                </Button>
                <Button
                  variant="secondary"
                  size="small"
                  icon={<ArrowRight size={14} />}
                  onClick={() => sendPayment('alice', 0.05)}
                  disabled={balance.alice < 0.05 || isAnimating}
                >
                  Send 0.05
                </Button>
              </div>
            )}
          </div>

          {/* Channel Bar */}
          <div className={styles.channelSection}>
            <div className={styles.channelBar}>
              <motion.div 
                className={styles.aliceBalance}
                animate={{ width: `${alicePercent}%` }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
              <motion.div 
                className={styles.bobBalance}
                animate={{ width: `${bobPercent}%` }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
              
              {/* Channel state indicator */}
              <AnimatePresence>
                {(channelState === 'opening' || channelState === 'closing') && (
                  <motion.div 
                    className={styles.channelOverlay}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <Clock size={20} className={styles.spinIcon} />
                    <span>{channelState === 'opening' ? 'Broadcasting...' : 'Settling...'}</span>
                  </motion.div>
                )}
              </AnimatePresence>
              
              {channelState === 'closed' && (
                <div className={styles.closedOverlay}>
                  <Lock size={20} />
                  <span>Channel Closed</span>
                </div>
              )}
            </div>
            
            <div className={styles.capacityLabel}>
              Capacity: {CHANNEL_CAPACITY} BTC
            </div>
            
            {channelState === 'open' && (
              <div className={styles.stateCounter}>
                <Badge variant="outline" size="small">
                  State #{stateCount}
                </Badge>
                <span className={styles.stateHint}>
                  Off-chain updates: instant & free
                </span>
              </div>
            )}
          </div>

          {/* Bob Side */}
          <div className={styles.participant}>
            <div className={styles.avatar} style={{ backgroundColor: '#3b82f6' }}>
              B
            </div>
            <span className={styles.name}>Bob</span>
            <span className={styles.balance}>{balance.bob} BTC</span>
            
            {channelState === 'open' && (
              <div className={styles.paymentControls}>
                <Button
                  variant="secondary"
                  size="small"
                  icon={<ArrowLeft size={14} />}
                  onClick={() => sendPayment('bob', 0.1)}
                  disabled={balance.bob < 0.1 || isAnimating}
                >
                  Send 0.1
                </Button>
                <Button
                  variant="secondary"
                  size="small"
                  icon={<ArrowLeft size={14} />}
                  onClick={() => sendPayment('bob', 0.05)}
                  disabled={balance.bob < 0.05 || isAnimating}
                >
                  Send 0.05
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Channel Actions */}
        <div className={styles.actions}>
          {channelState === 'closed' && (
            <Button
              variant="primary"
              icon={<Unlock size={16} />}
              onClick={openChannel}
              disabled={isAnimating}
            >
              Open Channel (1 on-chain tx)
            </Button>
          )}
          
          {channelState === 'open' && (
            <Button
              variant="secondary"
              icon={<Lock size={16} />}
              onClick={closeChannel}
              disabled={isAnimating}
            >
              Close Channel (1 on-chain tx)
            </Button>
          )}
        </div>

        {/* Transaction History */}
        {history.length > 0 && (
          <div className={styles.historySection}>
            <h4>Channel History</h4>
            <div className={styles.historyList}>
              {history.map((entry, i) => (
                <div key={i} className={styles.historyItem}>
                  {entry.type === 'open' ? (
                    <>
                      <Badge variant="success" size="small">OPEN</Badge>
                      <span>Channel opened with {entry.alice} + {entry.bob} BTC</span>
                      <span className={styles.onChain}>on-chain</span>
                    </>
                  ) : (
                    <>
                      <Badge variant="outline" size="small">PAY</Badge>
                      <span>
                        {entry.from === 'alice' ? 'Alice' : 'Bob'} → {entry.to === 'alice' ? 'Alice' : 'Bob'}: {entry.amount} BTC
                      </span>
                      <span className={styles.offChain}>off-chain</span>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Info Cards */}
        <div className={styles.infoGrid}>
          <div className={styles.infoCard}>
            <div className={styles.infoIcon}>
              <Lock size={20} />
            </div>
            <div>
              <strong>Opening</strong>
              <p>Requires 1 on-chain transaction (~10 min confirmation)</p>
            </div>
          </div>
          <div className={styles.infoCard}>
            <div className={styles.infoIcon}>
              <Zap size={20} />
            </div>
            <div>
              <strong>Payments</strong>
              <p>Instant, unlimited updates with no on-chain fees</p>
            </div>
          </div>
          <div className={styles.infoCard}>
            <div className={styles.infoIcon}>
              <Unlock size={20} />
            </div>
            <div>
              <strong>Closing</strong>
              <p>Final balances settled on-chain (1 transaction)</p>
            </div>
          </div>
        </div>
      </Card>

      <Accordion
        title="Deep Dive: How Payment Channels Work"
        variant="deepdive"
        icon={<Zap size={16} />}
      >
        <p>
          Payment channels are the foundation of the Lightning Network. Here's how they work:
        </p>
        <ul>
          <li>
            <strong>Opening:</strong> Both parties deposit funds into a 2-of-2 multisig address 
            on the Bitcoin blockchain. This is the "funding transaction."
          </li>
          <li>
            <strong>Updating:</strong> Instead of broadcasting transactions, both parties sign 
            new "commitment transactions" that reflect the updated balances. These are kept 
            off-chain but can be broadcast if needed.
          </li>
          <li>
            <strong>Security:</strong> Old states are invalidated using "revocation keys." If 
            someone tries to broadcast an old state, the other party can claim all the funds 
            as a penalty.
          </li>
          <li>
            <strong>Closing:</strong> When done, either party can broadcast the latest commitment 
            transaction, or they can cooperatively close with a simpler transaction.
          </li>
        </ul>
        <p>
          <strong>Key insight:</strong> The channel can update thousands of times, but only 2 
          on-chain transactions are needed (open and close). This is why Lightning is so scalable!
        </p>
      </Accordion>
    </div>
  );
}

export default ChannelVisualizer;
