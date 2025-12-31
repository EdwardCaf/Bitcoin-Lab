import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Pickaxe, 
  Play, 
  Pause, 
  RotateCcw, 
  Zap, 
  Target,
  Trophy,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import { Card, Button, Slider, Badge, Accordion } from '../../common';
import { sha256 } from '../../../utils/hash';
import styles from './NonceFinder.module.css';

export function NonceFinder() {
  const [blockData] = useState('Block #840001 | Prev: 0000...abc | Txs: 3,421');
  const [nonce, setNonce] = useState(0);
  const [hash, setHash] = useState('');
  const [difficulty, setDifficulty] = useState(2);
  const [isAutoMining, setIsAutoMining] = useState(false);
  const [miningSpeed, setMiningSpeed] = useState(50);
  const [attempts, setAttempts] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [found, setFound] = useState(false);
  const [hashHistory, setHashHistory] = useState([]);
  const miningRef = useRef(null);

  // Target pattern (number of leading zeros required)
  const target = '0'.repeat(difficulty);

  // Check if hash meets difficulty
  const meetsTarget = useCallback((h) => {
    return h.startsWith(target);
  }, [target]);

  // Compute hash
  const computeHash = useCallback(async (n) => {
    const data = `${blockData}|nonce:${n}`;
    return await sha256(data);
  }, [blockData]);

  // Update hash when nonce changes
  useEffect(() => {
    computeHash(nonce).then(h => {
      setHash(h);
      if (meetsTarget(h) && !found) {
        setFound(true);
        setIsAutoMining(false);
      }
    });
  }, [nonce, computeHash, meetsTarget, found]);

  // Auto-mining loop
  useEffect(() => {
    if (isAutoMining && !found) {
      const interval = Math.max(10, 200 - miningSpeed * 2);
      miningRef.current = setInterval(() => {
        setNonce(n => n + 1);
        setAttempts(a => a + 1);
      }, interval);
    } else {
      if (miningRef.current) {
        clearInterval(miningRef.current);
      }
    }
    return () => {
      if (miningRef.current) {
        clearInterval(miningRef.current);
      }
    };
  }, [isAutoMining, found, miningSpeed]);

  // Track time
  useEffect(() => {
    if (isAutoMining && !startTime) {
      setStartTime(Date.now());
    }
  }, [isAutoMining, startTime]);

  const handleManualIncrement = (amount) => {
    if (found) return;
    setNonce(n => Math.max(0, n + amount));
    setAttempts(a => a + Math.abs(amount));
  };

  const handleReset = () => {
    setNonce(0);
    setAttempts(0);
    setFound(false);
    setStartTime(null);
    setIsAutoMining(false);
    setHashHistory([]);
  };

  const handleToggleMining = () => {
    if (found) {
      handleReset();
    } else {
      setIsAutoMining(!isAutoMining);
    }
  };

  // Add to history
  useEffect(() => {
    if (hash) {
      setHashHistory(prev => {
        const newHistory = [{ nonce, hash, valid: meetsTarget(hash) }, ...prev];
        return newHistory.slice(0, 8);
      });
    }
  }, [hash, nonce, meetsTarget]);

  const elapsedTime = startTime ? Math.floor((Date.now() - startTime) / 1000) : 0;
  const hashRate = elapsedTime > 0 ? Math.round(attempts / elapsedTime) : 0;

  return (
    <div className={styles.container}>
      <Card variant="elevated" padding="large">
        <div className={styles.header}>
          <div className={styles.titleSection}>
            <div className={styles.iconWrapper}>
              <Pickaxe size={24} />
            </div>
            <div>
              <h3 className={styles.title}>Find the Golden Nonce</h3>
              <p className={styles.subtitle}>
                Change the nonce until the hash starts with {difficulty} zeros
              </p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="small" 
            icon={<RotateCcw size={14} />}
            onClick={handleReset}
          >
            Reset
          </Button>
        </div>

        {/* Block Data Display */}
        <div className={styles.blockData}>
          <label className={styles.label}>Block Header Data</label>
          <div className={styles.dataDisplay}>
            <code>{blockData}</code>
          </div>
        </div>

        {/* Target Section */}
        <div className={styles.targetSection}>
          <div className={styles.targetHeader}>
            <Target size={16} />
            <span>Target: Hash must start with</span>
          </div>
          <div className={styles.targetPattern}>
            {target.split('').map((_, i) => (
              <span key={i} className={styles.targetZero}>0</span>
            ))}
            <span className={styles.targetWildcard}>x</span>
            <span className={styles.targetEllipsis}>...</span>
          </div>
          <Slider
            value={difficulty}
            onChange={(v) => {
              setDifficulty(v);
              handleReset();
            }}
            min={1}
            max={5}
            step={1}
            label="Difficulty"
            formatValue={(v) => `${v} leading zeros`}
            marks={[
              { value: 1, label: 'Easy' },
              { value: 3, label: 'Medium' },
              { value: 5, label: 'Hard' }
            ]}
          />
        </div>

        {/* Nonce Control */}
        <div className={styles.nonceSection}>
          <label className={styles.label}>Nonce Value</label>
          <div className={styles.nonceControls}>
            <button 
              className={styles.nonceButton}
              onClick={() => handleManualIncrement(-10)}
              disabled={found || nonce < 10}
            >
              <ChevronDown size={16} />
              -10
            </button>
            <button 
              className={styles.nonceButton}
              onClick={() => handleManualIncrement(-1)}
              disabled={found || nonce < 1}
            >
              <ChevronDown size={16} />
              -1
            </button>
            <div className={styles.nonceValue}>
              <span className={styles.nonceNumber}>{nonce.toLocaleString()}</span>
            </div>
            <button 
              className={styles.nonceButton}
              onClick={() => handleManualIncrement(1)}
              disabled={found}
            >
              +1
              <ChevronUp size={16} />
            </button>
            <button 
              className={styles.nonceButton}
              onClick={() => handleManualIncrement(10)}
              disabled={found}
            >
              +10
              <ChevronUp size={16} />
            </button>
          </div>
        </div>

        {/* Current Hash */}
        <div className={styles.hashSection}>
          <label className={styles.label}>Current Hash</label>
          <motion.div 
            className={`${styles.hashDisplay} ${found ? styles.valid : ''}`}
            animate={found ? { scale: [1, 1.02, 1] } : {}}
            transition={{ duration: 0.3 }}
          >
            <div className={styles.hashText}>
              {hash.split('').map((char, i) => (
                <span 
                  key={i}
                  className={`${styles.hashChar} ${i < difficulty ? styles.highlight : ''} ${i < difficulty && char === '0' ? styles.match : ''}`}
                >
                  {char}
                </span>
              ))}
            </div>
            {found ? (
              <Badge variant="success" size="small" icon={<Trophy size={12} />}>
                Valid!
              </Badge>
            ) : (
              <Badge variant="error" size="small">
                {difficulty - (hash.match(/^0*/)?.[0].length || 0)} zeros needed
              </Badge>
            )}
          </motion.div>
        </div>

        {/* Mining Controls */}
        <div className={styles.miningControls}>
          <Button
            variant={found ? 'success' : isAutoMining ? 'secondary' : 'primary'}
            size="large"
            icon={found ? <Trophy size={18} /> : isAutoMining ? <Pause size={18} /> : <Play size={18} />}
            onClick={handleToggleMining}
            fullWidth
          >
            {found ? 'Block Found! Try Again' : isAutoMining ? 'Pause Mining' : 'Auto Mine'}
          </Button>
          
          {!found && (
            <div className={styles.speedControl}>
              <Slider
                value={miningSpeed}
                onChange={setMiningSpeed}
                min={10}
                max={100}
                label="Mining Speed"
                formatValue={(v) => v < 50 ? 'Slow' : v < 80 ? 'Medium' : 'Fast'}
              />
            </div>
          )}
        </div>

        {/* Stats */}
        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statValue}>{attempts.toLocaleString()}</span>
            <span className={styles.statLabel}>Attempts</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statValue}>{hashRate}/s</span>
            <span className={styles.statLabel}>Hash Rate</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statValue}>{elapsedTime}s</span>
            <span className={styles.statLabel}>Time</span>
          </div>
        </div>

        {/* Hash History */}
        {hashHistory.length > 0 && (
          <div className={styles.history}>
            <label className={styles.label}>Recent Attempts</label>
            <div className={styles.historyList}>
              <AnimatePresence mode="popLayout">
                {hashHistory.map((item, i) => (
                  <motion.div
                    key={`${item.nonce}-${i}`}
                    className={`${styles.historyItem} ${item.valid ? styles.valid : ''}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    layout
                  >
                    <span className={styles.historyNonce}>#{item.nonce}</span>
                    <span className={styles.historyHash}>
                      {item.hash.substring(0, 16)}...
                    </span>
                    {item.valid && <Trophy size={12} className={styles.historyTrophy} />}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}
      </Card>

      {/* Success Celebration */}
      <AnimatePresence>
        {found && (
          <motion.div
            className={styles.celebrationOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleReset}
          >
            <motion.div
              className={styles.celebration}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={(e) => e.stopPropagation()}
            >
              <Trophy size={48} />
              <h4>Block Mined!</h4>
              <p>You found a valid hash after {attempts.toLocaleString()} attempts!</p>
              <Button 
                variant="success" 
                size="medium" 
                onClick={handleReset}
                className={styles.celebrationButton}
              >
                Try Again
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Deep Dive */}
      <Accordion
        title="Deep Dive: Proof of Work"
        variant="deepdive"
        icon={<Pickaxe size={16} />}
      >
        <p>
          Bitcoin mining is essentially this puzzle at a massive scale. Miners around the world 
          compete to find a nonce that produces a hash meeting the network's difficulty target.
        </p>
        <p>Key concepts:</p>
        <ul>
          <li><strong>Nonce:</strong> A 32-bit number (0 to ~4 billion) that miners change to get different hashes</li>
          <li><strong>Difficulty:</strong> Adjusts every 2016 blocks to maintain ~10 minute block times</li>
          <li><strong>No shortcuts:</strong> The only way to find a valid hash is trial and error</li>
          <li><strong>Easy to verify:</strong> Once found, anyone can verify the hash is valid instantly</li>
        </ul>
        <p>
          Real Bitcoin mining requires finding a hash with about 19+ leading zeros, 
          requiring trillions of attempts. That's why specialized hardware (ASICs) is needed!
        </p>
      </Accordion>
    </div>
  );
}

export default NonceFinder;
