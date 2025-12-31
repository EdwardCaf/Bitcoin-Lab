import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Coins,
  Zap,
  ArrowDown,
  ArrowUp,
  Building,
  Sparkles,
  Info
} from 'lucide-react';
import { Card, Button, Badge, Accordion } from '../../common';
import styles from './MintVisualizer.module.css';

const OPERATIONS = [
  { id: 'mint', label: 'Mint', icon: ArrowDown, description: 'Convert Lightning to eCash tokens' },
  { id: 'melt', label: 'Melt', icon: ArrowUp, description: 'Convert eCash tokens back to Lightning' }
];

const TOKEN_DENOMINATIONS = [1, 2, 4, 8, 16, 32, 64];

export function MintVisualizer() {
  const [operation, setOperation] = useState('mint');
  const [amount, setAmount] = useState(100);
  const [isProcessing, setIsProcessing] = useState(false);
  const [tokens, setTokens] = useState([]);
  const [showBreakdown, setShowBreakdown] = useState(false);

  const handleOperation = async () => {
    setIsProcessing(true);
    setShowBreakdown(true);
    
    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (operation === 'mint') {
      // Generate token breakdown
      const breakdown = getTokenBreakdown(amount);
      setTokens(breakdown);
    } else if (operation === 'melt') {
      setTokens([]);
    }
    
    setIsProcessing(false);
  };

  const getTokenBreakdown = (value) => {
    const result = [];
    let remaining = value;
    
    for (let i = TOKEN_DENOMINATIONS.length - 1; i >= 0; i--) {
      const denom = TOKEN_DENOMINATIONS[i];
      while (remaining >= denom) {
        result.push({
          id: Math.random().toString(36).substr(2, 9),
          value: denom,
          color: getTokenColor(denom)
        });
        remaining -= denom;
      }
    }
    
    return result;
  };

  const getTokenColor = (value) => {
    const colors = {
      1: '#ef4444',
      2: '#f97316',
      4: '#f59e0b',
      8: '#eab308',
      16: '#84cc16',
      32: '#22c55e',
      64: '#10b981'
    };
    return colors[value] || '#3b82f6';
  };

  return (
    <div className={styles.container}>
      <Card variant="elevated" padding="large">
        <div className={styles.header}>
          <div className={styles.titleSection}>
            <div className={styles.iconWrapper}>
              <Coins size={24} />
            </div>
            <div>
              <h3 className={styles.title}>Cashu Mint Operations</h3>
              <p className={styles.subtitle}>
                See how Bitcoin moves in and out of eCash tokens
              </p>
            </div>
          </div>
        </div>

        {/* Operation Selector */}
        <div className={styles.operationSelector}>
          {OPERATIONS.map((op) => {
            const Icon = op.icon;
            return (
              <motion.button
                key={op.id}
                className={`${styles.operationButton} ${
                  operation === op.id ? styles.active : ''
                }`}
                onClick={() => {
                  setOperation(op.id);
                  setTokens([]);
                  setShowBreakdown(false);
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Icon size={20} />
                <div>
                  <span className={styles.opLabel}>{op.label}</span>
                  <span className={styles.opDesc}>{op.description}</span>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Amount Input */}
        <div className={styles.amountSection}>
          <label className={styles.label}>Amount (sats)</label>
          <div className={styles.amountInput}>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Math.max(1, Math.min(1000, parseInt(e.target.value) || 0)))}
              min="1"
              max="1000"
              step="1"
              disabled={isProcessing}
            />
            <span className={styles.unit}>sats</span>
          </div>
          <div className={styles.presetButtons}>
            {[10, 50, 100, 500].map((preset) => (
              <button
                key={preset}
                className={styles.presetButton}
                onClick={() => setAmount(preset)}
                disabled={isProcessing}
              >
                {preset}
              </button>
            ))}
          </div>
        </div>

        {/* Visualization */}
        <div className={styles.visualization}>
          {operation === 'mint' && (
            <MintOperation
              amount={amount}
              isProcessing={isProcessing}
              tokens={tokens}
              showBreakdown={showBreakdown}
            />
          )}
          {operation === 'melt' && (
            <MeltOperation
              amount={amount}
              isProcessing={isProcessing}
              showBreakdown={showBreakdown}
            />
          )}
        </div>

        {/* Action Button */}
        <div className={styles.actions}>
          <Button
            variant="primary"
            size="large"
            onClick={handleOperation}
            disabled={isProcessing}
            fullWidth
          >
            {isProcessing ? 'Processing...' : `${operation.charAt(0).toUpperCase() + operation.slice(1)} ${amount} sats`}
          </Button>
        </div>

        {/* Token Breakdown */}
        <AnimatePresence>
          {showBreakdown && tokens.length > 0 && operation === 'mint' && (
            <motion.div
              className={styles.breakdown}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <h4>
                <Sparkles size={16} />
                Token Breakdown
              </h4>
              <p className={styles.breakdownDesc}>
                Your {amount} sats are represented by {tokens.length} token{tokens.length !== 1 ? 's' : ''} 
                using powers of 2 for efficient splitting
              </p>
              <div className={styles.tokenGrid}>
                {tokens.map((token, index) => (
                  <motion.div
                    key={token.id}
                    className={styles.token}
                    style={{ 
                      backgroundColor: token.color,
                      borderColor: token.color
                    }}
                    initial={{ opacity: 0, scale: 0, rotate: -180 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    transition={{ delay: index * 0.05, type: 'spring' }}
                  >
                    <Coins size={16} />
                    <span>{token.value}</span>
                  </motion.div>
                ))}
              </div>
              <div className={styles.infoBox}>
                <Info size={14} />
                <span>
                  Powers of 2 allow efficient token splitting. Any amount can be represented, 
                  and tokens can be combined or split as needed.
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>

      {/* Deep Dive */}
      <Accordion
        title="Deep Dive: Token Denominations & Privacy"
        variant="deepdive"
        icon={<Coins size={16} />}
      >
        <p>
          Cashu uses fixed denominations (powers of 2) for several important reasons:
        </p>
        <ul>
          <li>
            <strong>Anonymity sets:</strong> All 64-sat tokens look identical. This creates 
            large anonymity sets - the mint cannot distinguish between different 64-sat tokens.
          </li>
          <li>
            <strong>Efficient splitting:</strong> Any amount can be represented as a sum of 
            powers of 2. This is the same principle as binary numbers!
          </li>
          <li>
            <strong>No change addresses:</strong> Unlike Bitcoin, you can make exact payments. 
            If you have a 64-sat token but only need 50 sats, you ask the mint to split it 
            into 32 + 16 + 2, creating fresh tokens that aren't linked to the original.
          </li>
          <li>
            <strong>Blinded at each step:</strong> Every mint, split, or combine operation uses 
            blind signatures, so the mint never knows which tokens belong to whom.
          </li>
        </ul>
        <p>
          <strong>Trade-off:</strong> You must trust the mint not to run away with the funds. 
          This is why it's recommended to use multiple small mints and not store large amounts 
          in eCash.
        </p>
      </Accordion>
    </div>
  );
}

function MintOperation({ amount, isProcessing, tokens, showBreakdown }) {
  return (
    <div className={styles.operation}>
      <div className={styles.participant}>
        <div className={styles.participantHeader}>
          <Zap size={24} className={styles.lightning} />
          <div>
            <h5>Lightning Network</h5>
            <Badge variant="warning" size="small">Source</Badge>
          </div>
        </div>
        <motion.div 
          className={styles.balanceBox}
          animate={isProcessing ? { scale: [1, 0.95, 1] } : {}}
          transition={{ duration: 1, repeat: isProcessing ? Infinity : 0 }}
        >
          <div className={styles.balanceLabel}>Sending</div>
          <div className={styles.balanceAmount}>{amount} sats</div>
          <Zap size={32} className={styles.balanceIcon} />
        </motion.div>
      </div>

      <motion.div 
        className={styles.flowArrow}
        animate={isProcessing ? { y: [0, 10, 0] } : {}}
        transition={{ duration: 1, repeat: isProcessing ? Infinity : 0 }}
      >
        <ArrowDown size={32} />
        {isProcessing && (
          <motion.div
            className={styles.flowParticle}
            animate={{ y: [0, 100] }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
        )}
      </motion.div>

      <div className={styles.participant}>
        <div className={styles.participantHeader}>
          <Building size={24} className={styles.mint} />
          <div>
            <h5>Cashu Mint</h5>
            <Badge variant="primary" size="small">
              {isProcessing ? 'Minting...' : 'Ready'}
            </Badge>
          </div>
        </div>
        <motion.div 
          className={`${styles.balanceBox} ${showBreakdown ? styles.success : ''}`}
          animate={isProcessing ? { scale: [1, 1.05, 1] } : {}}
          transition={{ duration: 1, repeat: isProcessing ? Infinity : 0 }}
        >
          {showBreakdown ? (
            <>
              <div className={styles.balanceLabel}>Created</div>
              <div className={styles.balanceAmount}>{tokens.length} tokens</div>
              <Coins size={32} className={styles.balanceIcon} />
            </>
          ) : (
            <>
              <div className={styles.balanceLabel}>Will Create</div>
              <div className={styles.balanceAmount}>{amount} sats</div>
              <Coins size={32} className={styles.balanceIcon} style={{ opacity: 0.3 }} />
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}

function MeltOperation({ amount, isProcessing, showBreakdown }) {
  return (
    <div className={styles.operation}>
      <div className={styles.participant}>
        <div className={styles.participantHeader}>
          <Coins size={24} className={styles.ecash} />
          <div>
            <h5>eCash Tokens</h5>
            <Badge variant="secondary" size="small">Source</Badge>
          </div>
        </div>
        <motion.div 
          className={styles.balanceBox}
          animate={isProcessing ? { scale: [1, 0.95, 1] } : {}}
          transition={{ duration: 1, repeat: isProcessing ? Infinity : 0 }}
        >
          <div className={styles.balanceLabel}>Redeeming</div>
          <div className={styles.balanceAmount}>{amount} sats</div>
          <Coins size={32} className={styles.balanceIcon} />
        </motion.div>
      </div>

      <motion.div 
        className={styles.flowArrow}
        animate={isProcessing ? { y: [0, 10, 0] } : {}}
        transition={{ duration: 1, repeat: isProcessing ? Infinity : 0 }}
      >
        <ArrowDown size={32} />
        {isProcessing && (
          <motion.div
            className={styles.flowParticle}
            animate={{ y: [0, 100] }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
        )}
      </motion.div>

      <div className={styles.participant}>
        <div className={styles.participantHeader}>
          <Zap size={24} className={styles.lightning} />
          <div>
            <h5>Lightning Network</h5>
            <Badge variant="warning" size="small">
              {isProcessing ? 'Sending...' : 'Destination'}
            </Badge>
          </div>
        </div>
        <motion.div 
          className={`${styles.balanceBox} ${showBreakdown ? styles.success : ''}`}
          animate={isProcessing ? { scale: [1, 1.05, 1] } : {}}
          transition={{ duration: 1, repeat: isProcessing ? Infinity : 0 }}
        >
          <div className={styles.balanceLabel}>Receiving</div>
          <div className={styles.balanceAmount}>{amount} sats</div>
          <Zap size={32} className={styles.balanceIcon} />
        </motion.div>
      </div>

      <div className={styles.infoBox} style={{ marginTop: 'var(--spacing-lg)' }}>
        <Info size={14} />
        <span>
          Tokens are destroyed and Lightning sats are sent out. The mint burns the tokens 
          to prevent double-spending.
        </span>
      </div>
    </div>
  );
}

export default MintVisualizer;
