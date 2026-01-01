import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  GitFork, 
  GitMerge,
  CheckCircle2, 
  XCircle,
  ArrowRight,
  ArrowDown,
  Box,
  RotateCcw,
  Server,
  AlertTriangle,
  Info
} from 'lucide-react';
import { Card, Button, Badge, Accordion } from '../../common';
import styles from './ForksVisualizer.module.css';

// Node types for the network visualization
const createNodes = (upgraded = false) => [
  { id: 1, x: 50, y: 30, upgraded: upgraded },
  { id: 2, x: 150, y: 50, upgraded: upgraded },
  { id: 3, x: 250, y: 30, upgraded: upgraded },
  { id: 4, x: 350, y: 50, upgraded: upgraded },
  { id: 5, x: 100, y: 120, upgraded: false },
  { id: 6, x: 200, y: 140, upgraded: false },
  { id: 7, x: 300, y: 120, upgraded: false },
];

const connections = [
  [1, 2], [2, 3], [3, 4], [1, 5], [2, 5], [2, 6], [3, 6], [3, 7], [4, 7], [5, 6], [6, 7]
];

// Initial blockchain state
const initialBlocks = [
  { id: 1, label: 'Block 100', rules: 'old' },
  { id: 2, label: 'Block 101', rules: 'old' },
  { id: 3, label: 'Block 102', rules: 'old' },
];

export function ForksVisualizer() {
  const [forkType, setForkType] = useState(null); // 'soft' | 'hard' | null
  const [step, setStep] = useState(0);
  const [nodes, setNodes] = useState(createNodes());
  const [mainChain, setMainChain] = useState(initialBlocks);
  const [forkChain, setForkChain] = useState([]);
  const [showOutcome, setShowOutcome] = useState(false);
  
  const reset = useCallback(() => {
    setForkType(null);
    setStep(0);
    setNodes(createNodes());
    setMainChain(initialBlocks);
    setForkChain([]);
    setShowOutcome(false);
  }, []);
  
  const startSoftFork = () => {
    setForkType('soft');
    setStep(1);
    // Upgrade some nodes (majority)
    setNodes(prev => prev.map((node, i) => ({
      ...node,
      upgraded: i < 5 // First 5 nodes upgrade
    })));
  };
  
  const startHardFork = () => {
    setForkType('hard');
    setStep(1);
    // Split nodes
    setNodes(prev => prev.map((node, i) => ({
      ...node,
      upgraded: i < 4 // First 4 nodes upgrade, creating a split
    })));
  };
  
  const advanceSimulation = () => {
    if (forkType === 'soft') {
      if (step === 1) {
        // Show new block being created with new rules
        setMainChain(prev => [...prev, { 
          id: 4, 
          label: 'Block 103', 
          rules: 'new',
          highlight: true 
        }]);
        setStep(2);
      } else if (step === 2) {
        // Old nodes accept the block
        setMainChain(prev => [...prev, { 
          id: 5, 
          label: 'Block 104', 
          rules: 'new' 
        }]);
        setShowOutcome(true);
        setStep(3);
      }
    } else if (forkType === 'hard') {
      if (step === 1) {
        // Create diverging chains
        setMainChain(prev => [...prev, { 
          id: 4, 
          label: 'Block 103', 
          rules: 'new',
          highlight: true 
        }]);
        setForkChain([{ 
          id: 'f1', 
          label: 'Block 103\'', 
          rules: 'old',
          highlight: true 
        }]);
        setStep(2);
      } else if (step === 2) {
        // Both chains continue
        setMainChain(prev => [...prev, { 
          id: 5, 
          label: 'Block 104', 
          rules: 'new' 
        }]);
        setForkChain(prev => [...prev, { 
          id: 'f2', 
          label: 'Block 104\'', 
          rules: 'old' 
        }]);
        setShowOutcome(true);
        setStep(3);
      }
    }
  };
  
  const getStepDescription = () => {
    if (!forkType) return '';
    
    if (forkType === 'soft') {
      switch (step) {
        case 1:
          return 'Upgraded nodes (green) now enforce stricter rules, but still accept old-format blocks. Old nodes (gray) continue operating normally.';
        case 2:
          return 'An upgraded miner creates a block with new rules. Old nodes see it as valid (new rules are a subset of old rules).';
        case 3:
          return 'The network continues as one chain! Old nodes don\'t even realize the rules changed.';
        default:
          return '';
      }
    } else {
      switch (step) {
        case 1:
          return 'Nodes split into two groups with incompatible rules. They can no longer agree on what\'s valid.';
        case 2:
          return 'Each group creates their own block. Neither accepts the other\'s block as valid.';
        case 3:
          return 'Two separate blockchains now exist! Each has its own transaction history going forward.';
        default:
          return '';
      }
    }
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
              <h3 className={styles.title}>Fork Simulator</h3>
              <p className={styles.subtitle}>
                See how the network handles protocol upgrades
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
        
        {/* Fork Type Selection */}
        {!forkType && (
          <div className={styles.forkSelection}>
            <h4 className={styles.selectionTitle}>Choose a Fork Type to Simulate</h4>
            <div className={styles.forkOptions}>
              <button 
                className={styles.forkOption}
                onClick={startSoftFork}
              >
                <div className={styles.forkOptionIcon}>
                  <GitMerge size={32} />
                </div>
                <h5>Soft Fork</h5>
                <p>Backward-compatible upgrade. Old nodes still work.</p>
                <Badge variant="success" size="small">Compatible</Badge>
              </button>
              
              <button 
                className={styles.forkOption}
                onClick={startHardFork}
              >
                <div className={styles.forkOptionIcon}>
                  <GitFork size={32} />
                </div>
                <h5>Hard Fork</h5>
                <p>Breaking change. Creates a permanent chain split.</p>
                <Badge variant="warning" size="small">Incompatible</Badge>
              </button>
            </div>
          </div>
        )}
        
        {/* Simulation View */}
        {forkType && (
          <>
            {/* Network Visualization */}
            <div className={styles.networkSection}>
              <h4 className={styles.sectionLabel}>
                Network Nodes
                <span className={styles.forkBadge}>
                  {forkType === 'soft' ? 'Soft Fork' : 'Hard Fork'}
                </span>
              </h4>
              <div className={styles.networkArea}>
                <svg className={styles.connectionsSvg}>
                  {connections.map(([from, to], i) => {
                    const fromNode = nodes.find(n => n.id === from);
                    const toNode = nodes.find(n => n.id === to);
                    const sameGroup = fromNode.upgraded === toNode.upgraded;
                    
                    return (
                      <line
                        key={i}
                        x1={fromNode.x}
                        y1={fromNode.y}
                        x2={toNode.x}
                        y2={toNode.y}
                        className={`${styles.connection} ${
                          forkType === 'hard' && !sameGroup ? styles.brokenConnection : ''
                        }`}
                      />
                    );
                  })}
                </svg>
                
                {nodes.map(node => (
                  <motion.div
                    key={node.id}
                    className={`${styles.node} ${
                      node.upgraded ? styles.upgradedNode : styles.oldNode
                    }`}
                    style={{
                      left: node.x - 20,
                      top: node.y - 20
                    }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: node.id * 0.05 }}
                  >
                    <Server size={16} />
                  </motion.div>
                ))}
              </div>
              
              <div className={styles.nodeLegend}>
                <div className={styles.legendItem}>
                  <span className={`${styles.legendDot} ${styles.upgradedDot}`}></span>
                  <span>Upgraded (new rules)</span>
                </div>
                <div className={styles.legendItem}>
                  <span className={`${styles.legendDot} ${styles.oldDot}`}></span>
                  <span>Old (original rules)</span>
                </div>
              </div>
            </div>
            
            {/* Blockchain Visualization */}
            <div className={styles.chainSection}>
              <h4 className={styles.sectionLabel}>Blockchain</h4>
              
              <div className={styles.chainsArea}>
                {/* Main Chain */}
                <div className={styles.chainRow}>
                  <span className={styles.chainLabel}>
                    {forkType === 'hard' && forkChain.length > 0 
                      ? 'New Rules Chain' 
                      : 'Main Chain'}
                    {forkType === 'hard' && forkChain.length > 0 && (
                      <Badge variant="info" size="small">Upgraded nodes</Badge>
                    )}
                  </span>
                  <div className={styles.chain}>
                    {mainChain.map((block, i) => (
                      <div key={block.id} className={styles.blockWrapper}>
                        <motion.div 
                          className={`${styles.block} ${
                            block.rules === 'new' ? styles.newRulesBlock : ''
                          } ${block.highlight ? styles.highlightBlock : ''}`}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                        >
                          <Box size={14} />
                          <span>{block.label}</span>
                          {block.rules === 'new' && (
                            <span className={styles.rulesTag}>new</span>
                          )}
                        </motion.div>
                        {i < mainChain.length - 1 && (
                          <ArrowRight size={16} className={styles.arrow} />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Fork Chain (only for hard forks) */}
                {forkChain.length > 0 && (
                  <>
                    <div className={styles.forkIndicator}>
                      <GitFork size={16} />
                      <span>Chain Split at Block 102</span>
                    </div>
                    
                    <div className={`${styles.chainRow} ${styles.forkChainRow}`}>
                      <span className={styles.chainLabel}>
                        Old Rules Chain
                        <Badge variant="secondary" size="small">Old nodes</Badge>
                      </span>
                      <div className={styles.chain}>
                        <div className={styles.forkStart}>
                          <span className={styles.forkParent}>← from Block 102</span>
                        </div>
                        {forkChain.map((block, i) => (
                          <div key={block.id} className={styles.blockWrapper}>
                            <motion.div 
                              className={`${styles.block} ${styles.oldRulesBlock} ${
                                block.highlight ? styles.highlightBlock : ''
                              }`}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                            >
                              <Box size={14} />
                              <span>{block.label}</span>
                              <span className={styles.rulesTag}>old</span>
                            </motion.div>
                            {i < forkChain.length - 1 && (
                              <ArrowRight size={16} className={styles.arrow} />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
            
            {/* Step Description */}
            <div className={styles.stepDescription}>
              <Info size={18} />
              <p>{getStepDescription()}</p>
            </div>
            
            {/* Controls */}
            {!showOutcome && (
              <div className={styles.controls}>
                <Button
                  variant="primary"
                  onClick={advanceSimulation}
                  icon={<ArrowRight size={16} />}
                  iconPosition="right"
                >
                  {step === 1 ? 'Mine New Block' : 'Continue Mining'}
                </Button>
              </div>
            )}
            
            {/* Outcome */}
            {showOutcome && (
              <motion.div
                className={`${styles.outcome} ${
                  forkType === 'soft' ? styles.successOutcome : styles.splitOutcome
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {forkType === 'soft' ? (
                  <>
                    <CheckCircle2 size={24} />
                    <div>
                      <h4>Soft Fork Successful!</h4>
                      <p>
                        The network upgraded seamlessly. Old nodes continue to follow 
                        the chain without knowing the rules changed. This is how 
                        SegWit was activated in 2017.
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <AlertTriangle size={24} />
                    <div>
                      <h4>Permanent Chain Split!</h4>
                      <p>
                        Two separate cryptocurrencies now exist. This is how Bitcoin Cash 
                        split from Bitcoin in 2017. Each chain has its own community, 
                        miners, and value.
                      </p>
                    </div>
                  </>
                )}
              </motion.div>
            )}
          </>
        )}
      </Card>
      
      {/* Comparison Table */}
      <Card padding="large">
        <h3 className={styles.comparisonTitle}>Soft Fork vs Hard Fork</h3>
        <div className={styles.comparisonTable}>
          <div className={styles.comparisonHeader}>
            <div></div>
            <div className={styles.softForkHeader}>
              <GitMerge size={18} />
              Soft Fork
            </div>
            <div className={styles.hardForkHeader}>
              <GitFork size={18} />
              Hard Fork
            </div>
          </div>
          
          <div className={styles.comparisonRow}>
            <div className={styles.rowLabel}>Backward Compatible</div>
            <div className={styles.softForkCell}>
              <CheckCircle2 size={16} className={styles.checkIcon} />
              Yes
            </div>
            <div className={styles.hardForkCell}>
              <XCircle size={16} className={styles.xIcon} />
              No
            </div>
          </div>
          
          <div className={styles.comparisonRow}>
            <div className={styles.rowLabel}>Old Nodes</div>
            <div className={styles.softForkCell}>Still work</div>
            <div className={styles.hardForkCell}>Must upgrade or split</div>
          </div>
          
          <div className={styles.comparisonRow}>
            <div className={styles.rowLabel}>Rule Changes</div>
            <div className={styles.softForkCell}>Only tightening (stricter)</div>
            <div className={styles.hardForkCell}>Loosening of rules</div>
          </div>
          
          <div className={styles.comparisonRow}>
            <div className={styles.rowLabel}>Chain Split Risk</div>
            <div className={styles.softForkCell}>Low</div>
            <div className={styles.hardForkCell}>High (permanent)</div>
          </div>
          
          <div className={styles.comparisonRow}>
            <div className={styles.rowLabel}>Examples</div>
            <div className={styles.softForkCell}>SegWit, Taproot</div>
            <div className={styles.hardForkCell}>Bitcoin Cash, Ethereum Classic</div>
          </div>
        </div>
      </Card>
      
      <Accordion
        title="Deep Dive: Fork History"
        variant="deepdive"
        icon={<GitFork size={16} />}
      >
        <p>
          <strong>Notable Soft Forks:</strong>
        </p>
        <ul>
          <li>
            <strong>SegWit (2017):</strong> Before SegWit, blocks were strictly 
            limited to 1MB of data. SegWit changed this: it stopped counting 
            the "signature" data (which takes up a lot of space) against that 
            1MB limit. This allowed blocks to hold significantly more transactions 
            (effectively 2–4MB of real data) while still appearing to be valid, 
            small 1MB blocks to older computers that hadn't upgraded.
          </li>
          <li>
            <strong>Taproot (2021):</strong> Added Schnorr signatures and smart 
            contract improvements while maintaining backward compatibility.
          </li>
        </ul>
        <p>
          <strong>Notable Hard Forks:</strong>
        </p>
        <ul>
          <li>
            <strong>Bitcoin Cash (2017):</strong> Increased block size from 1MB to 
            8MB. Nodes that didn't upgrade stayed on Bitcoin; those that did moved 
            to BCH.
          </li>
          <li>
            <strong>Ethereum Classic (2016):</strong> Created when Ethereum hard 
            forked to reverse the DAO hack. Those who disagreed kept the original 
            chain as ETC.
          </li>
        </ul>
      </Accordion>
    </div>
  );
}

export default ForksVisualizer;
