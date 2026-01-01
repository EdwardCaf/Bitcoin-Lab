import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  GitFork, 
  CheckCircle2, 
  XCircle,
  ArrowRight,
  Box,
  RotateCcw
} from 'lucide-react';
import { Card, Button, Badge, Accordion } from '../../common';
import styles from './ConsensusDemo.module.css';

const initialChain = [
  { id: 1, label: 'Block 100', hash: '0000...abc' },
  { id: 2, label: 'Block 101', hash: '0000...def' },
  { id: 3, label: 'Block 102', hash: '0000...ghi' },
];

export function ConsensusDemo() {
  const [mainChain, setMainChain] = useState(initialChain);
  const [forkChain, setForkChain] = useState([]);
  const [hasFork, setHasFork] = useState(false);
  const [resolved, setResolved] = useState(false);
  const [winner, setWinner] = useState(null);
  
  const createFork = () => {
    // Create a fork at block 102
    setForkChain([
      { id: 'f1', label: 'Block 102\'', hash: '0000...xyz', isFork: true },
    ]);
    setHasFork(true);
    setResolved(false);
    setWinner(null);
  };
  
  const extendMainChain = () => {
    if (!hasFork || resolved) return;
    
    const newBlock = {
      id: mainChain.length + 1,
      label: `Block ${102 + mainChain.length - 2}`,
      hash: '0000...' + Math.random().toString(16).slice(2, 5)
    };
    setMainChain([...mainChain, newBlock]);
    
    // Check if main chain wins
    if (mainChain.length >= forkChain.length + 3) {
      setResolved(true);
      setWinner('main');
    }
  };
  
  const extendForkChain = () => {
    if (!hasFork || resolved) return;
    
    const newBlock = {
      id: 'f' + (forkChain.length + 1),
      label: `Block ${102 + forkChain.length}'`,
      hash: '0000...' + Math.random().toString(16).slice(2, 5),
      isFork: true
    };
    setForkChain([...forkChain, newBlock]);
    
    // Check if fork wins
    if (forkChain.length >= mainChain.length - 1) {
      setResolved(true);
      setWinner('fork');
    }
  };
  
  const reset = () => {
    setMainChain(initialChain);
    setForkChain([]);
    setHasFork(false);
    setResolved(false);
    setWinner(null);
  };
  
  return (
    <div className={styles.container}>
      <Card variant="elevated" padding="large">
        <div className={styles.header}>
          <div className={styles.titleSection}>
            <div className={styles.iconWrapper}>
              <GitFork size={24} />
            </div>
            <div>
              <h3 className={styles.title}>Chain Fork & Consensus</h3>
              <p className={styles.subtitle}>
                See how the network resolves competing chains
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
        
        {/* Chain Visualization */}
        <div className={styles.chainsArea}>
          {/* Main Chain */}
          <div className={`${styles.chainRow} ${winner === 'main' ? styles.winner : ''} ${winner === 'fork' ? styles.loser : ''}`}>
            <span className={styles.chainLabel}>
              Main Chain
              {winner === 'main' && <Badge variant="success" size="small">Winner</Badge>}
            </span>
            <div className={styles.chain}>
              {mainChain.map((block, i) => (
                <div key={block.id} className={styles.blockWrapper}>
                  <motion.div 
                    className={styles.block}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <Box size={14} />
                    <span>{block.label}</span>
                  </motion.div>
                  {i < mainChain.length - 1 && (
                    <ArrowRight size={16} className={styles.arrow} />
                  )}
                </div>
              ))}
              
              {hasFork && !resolved && (
                <Button
                  variant="secondary"
                  size="small"
                  onClick={extendMainChain}
                  className={styles.addButton}
                >
                  + Add Block
                </Button>
              )}
            </div>
          </div>
          
          {/* Fork indicator */}
          {hasFork && (
            <div className={styles.forkIndicator}>
              <GitFork size={20} />
              <span>Fork at Block 101</span>
            </div>
          )}
          
          {/* Fork Chain */}
          {hasFork && (
            <div className={`${styles.chainRow} ${styles.forkRow} ${winner === 'fork' ? styles.winner : ''} ${winner === 'main' ? styles.loser : ''}`}>
              <span className={styles.chainLabel}>
                Competing Chain
                {winner === 'fork' && <Badge variant="success" size="small">Winner</Badge>}
                {winner === 'main' && <Badge variant="error" size="small">Orphaned</Badge>}
              </span>
              <div className={styles.chain}>
                {/* Show connection to parent */}
                <div className={styles.forkStart}>
                  <span className={styles.forkParent}>← from Block 101</span>
                </div>
                
                {forkChain.map((block, i) => (
                  <div key={block.id} className={styles.blockWrapper}>
                    <motion.div 
                      className={`${styles.block} ${styles.forkBlock}`}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      <Box size={14} />
                      <span>{block.label}</span>
                    </motion.div>
                    {i < forkChain.length - 1 && (
                      <ArrowRight size={16} className={styles.arrow} />
                    )}
                  </div>
                ))}
                
                {!resolved && (
                  <Button
                    variant="secondary"
                    size="small"
                    onClick={extendForkChain}
                    className={styles.addButton}
                  >
                    + Add Block
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
        
        {/* Controls */}
        {!hasFork && (
          <div className={styles.actionArea}>
            <Button
              variant="primary"
              icon={<GitFork size={16} />}
              onClick={createFork}
            >
              Create a Fork
            </Button>
            <p className={styles.hint}>
              Simulate what happens when two miners find a block at nearly the same time
            </p>
          </div>
        )}
        
        {/* Resolution Message */}
        {resolved && (
          <motion.div
            className={styles.resolution}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <CheckCircle2 size={24} />
            <div>
              <h4>Consensus Reached!</h4>
              <p>
                The {winner === 'main' ? 'main chain' : 'competing chain'} won because 
                it became longer/heavier. The other chain's blocks are now "orphaned" and 
                its transactions return to the mempool.
              </p>
            </div>
          </motion.div>
        )}
        
        {hasFork && !resolved && (
          <div className={styles.instructions}>
            <p>
              <strong>The Heaviest Chain Rule:</strong> Add blocks to either chain. 
              The chain that becomes heavier will be accepted by the network.
            </p>
          </div>
        )}
      </Card>
      
    </div>
  );
}

export default ConsensusDemo;
