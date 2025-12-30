import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  EyeOff, 
  Eye,
  Zap,
  Shield,
  Play,
  RotateCcw,
  Check,
  X,
  Info,
  Lock
} from 'lucide-react';
import { Card, Button, Badge, Accordion } from '../../common';
import styles from './PrivacyDemo.module.css';

const nodes = [
  { id: 'alice', name: 'Alice', role: 'Sender', x: 50, color: '#f97316' },
  { id: 'bob', name: 'Bob', role: 'Routing Node', x: 250, color: '#3b82f6' },
  { id: 'carol', name: 'Carol', role: 'Routing Node', x: 450, color: '#22c55e' },
  { id: 'dave', name: 'Dave', role: 'Receiver', x: 650, color: '#a855f7' },
];

const PAYMENT_AMOUNT = 50000; // sats
const PAYMENT_DESC = 'Coffee';

export function PrivacyDemo() {
  const [step, setStep] = useState(0); // 0: initial, 1-4: routing animation, 5: complete
  const [showOnChain, setShowOnChain] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);

  const runPayment = async () => {
    setStep(0);
    // Animate through each hop with slower timing
    for (let i = 1; i <= 5; i++) {
      await new Promise(resolve => setTimeout(resolve, 1200));
      setStep(i);
    }
  };

  const reset = () => {
    setStep(0);
    setSelectedNode(null);
  };

  // What each node can see
  const nodeVisibility = {
    alice: {
      sender: true,
      receiver: true,
      amount: true,
      description: true,
      fullPath: true
    },
    bob: {
      sender: false,
      receiver: false,
      amount: false,
      description: false,
      fullPath: false,
      knows: 'Previous hop and next hop only'
    },
    carol: {
      sender: false,
      receiver: false,
      amount: false,
      description: false,
      fullPath: false,
      knows: 'Previous hop and next hop only'
    },
    dave: {
      sender: false,
      receiver: true,
      amount: true,
      description: true,
      fullPath: false
    }
  };

  return (
    <div className={styles.container}>
      <Card variant="elevated" padding="large">
        <div className={styles.header}>
          <div className={styles.titleSection}>
            <div className={styles.iconWrapper}>
              <EyeOff size={24} />
            </div>
            <div>
              <h3 className={styles.title}>Lightning Privacy</h3>
              <p className={styles.subtitle}>
                See how Lightning protects your privacy with onion routing
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

        {/* Comparison Toggle */}
        <div className={styles.comparisonToggle}>
          <button
            className={`${styles.toggleButton} ${!showOnChain ? styles.active : ''}`}
            onClick={() => setShowOnChain(false)}
          >
            <Zap size={16} />
            Lightning Payment
            <Badge variant="success" size="small">Private</Badge>
          </button>
          <button
            className={`${styles.toggleButton} ${showOnChain ? styles.active : ''}`}
            onClick={() => setShowOnChain(true)}
          >
            <Eye size={16} />
            On-Chain Transaction
            <Badge variant="error" size="small">Public</Badge>
          </button>
        </div>

        {showOnChain ? (
          // On-Chain Comparison View
          <div className={styles.onChainView}>
            <div className={styles.publicLedger}>
              <h4>
                <Eye size={18} />
                Public Blockchain Record
              </h4>
              <div className={styles.txRecord}>
                <div className={styles.txRow}>
                  <span className={styles.label}>From Address:</span>
                  <code>bc1q...alice...xyz</code>
                  <Badge variant="error" size="small">Visible to all</Badge>
                </div>
                <div className={styles.txRow}>
                  <span className={styles.label}>To Address:</span>
                  <code>bc1q...dave...xyz</code>
                  <Badge variant="error" size="small">Visible to all</Badge>
                </div>
                <div className={styles.txRow}>
                  <span className={styles.label}>Amount:</span>
                  <strong>{PAYMENT_AMOUNT.toLocaleString()} sats</strong>
                  <Badge variant="error" size="small">Visible to all</Badge>
                </div>
                <div className={styles.txRow}>
                  <span className={styles.label}>Timestamp:</span>
                  <span>2025-12-30 14:32:15</span>
                  <Badge variant="error" size="small">Visible to all</Badge>
                </div>
              </div>
              
              <div className={styles.warningBox}>
                <Eye size={20} />
                <div>
                  <strong>Everything is public forever</strong>
                  <p>
                    Anyone can see exactly who sent money to whom, how much, and when. 
                    Chain analysis companies can link addresses to real identities.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Lightning Privacy View
          <>
            {/* Payment Route Visualization */}
            <div className={styles.routeContainer}>
              <div className={styles.paymentInfo}>
                <div className={styles.infoRow}>
                  <span>Sending:</span>
                  <strong>{PAYMENT_AMOUNT.toLocaleString()} sats</strong>
                </div>
                <div className={styles.infoRow}>
                  <span>For:</span>
                  <span>{PAYMENT_DESC}</span>
                </div>
              </div>

              <div className={styles.route}>
                {nodes.map((node, index) => {
                  const isActive = step > index;
                  const isCurrent = step === index + 1;
                  const isComplete = step > index + 1;

                  return (
                    <div key={node.id} className={styles.nodeWrapper}>
                      <motion.div
                        className={`${styles.node} ${isActive ? styles.active : ''} ${isCurrent ? styles.current : ''}`}
                        style={{ borderColor: isActive ? node.color : 'var(--border-medium)' }}
                        onClick={() => setSelectedNode(node.id)}
                        animate={{
                          scale: isCurrent ? 1.1 : 1,
                          backgroundColor: isActive ? `${node.color}20` : 'var(--bg-secondary)'
                        }}
                      >
                        <div className={styles.nodeIcon} style={{ backgroundColor: isActive ? node.color : 'var(--text-tertiary)' }}>
                          {isComplete ? <Check size={20} /> : node.name.charAt(0)}
                        </div>
                        <div className={styles.nodeName}>{node.name}</div>
                        <div className={styles.nodeRole}>{node.role}</div>
                        
                        {/* Onion layers visualization */}
                        {step > 0 && step <= index + 1 && (
                          <motion.div 
                            className={styles.onionLayers}
                            initial={{ opacity: 0, scale: 1.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                          >
                            {Array.from({ length: 4 - index }).map((_, i) => (
                              <motion.div
                                key={i}
                                className={styles.onionLayer}
                                initial={{ scale: 1 + (i * 0.15) }}
                                animate={{ scale: 1 + (i * 0.15) }}
                                style={{ 
                                  opacity: 0.3 - (i * 0.08),
                                  borderColor: node.color
                                }}
                              />
                            ))}
                            <Lock size={12} className={styles.lockIcon} />
                          </motion.div>
                        )}
                      </motion.div>

                      {/* Arrow between nodes */}
                      {index < nodes.length - 1 && (
                        <div className={styles.arrowContainer}>
                          <motion.div 
                            className={styles.arrow}
                            animate={{
                              opacity: step > index ? 1 : 0.3,
                              scaleX: step > index ? 1 : 0
                            }}
                            transition={{ duration: 0.8 }}
                          >
                            <div className={styles.arrowLine} />
                            <div className={styles.arrowHead} />
                            
                            {/* Traveling payment packet */}
                            {step === index + 1 && (
                              <motion.div
                                className={styles.packet}
                                initial={{ left: '0%' }}
                                animate={{ left: '100%' }}
                                transition={{ duration: 1, ease: 'linear' }}
                              >
                                <Zap size={16} />
                              </motion.div>
                            )}
                          </motion.div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {step === 0 && (
                <Button
                  variant="primary"
                  icon={<Play size={16} />}
                  onClick={runPayment}
                  fullWidth
                >
                  Send Payment
                </Button>
              )}

              {step === 5 && (
                <motion.div
                  className={styles.successBox}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Check size={24} />
                  <div>
                    <strong>Payment Successful!</strong>
                    <p>No public record created. Only sender and receiver know the details.</p>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Information Visibility Table */}
            {step > 0 && (
              <motion.div
                className={styles.visibilitySection}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h4>
                  <Info size={18} />
                  What Each Participant Knows
                  <span className={styles.hint}>Click a node above to see their view</span>
                </h4>
                
                <div className={styles.visibilityGrid}>
                  {nodes.map(node => {
                    const visibility = nodeVisibility[node.id];
                    const isSelected = selectedNode === node.id;
                    
                    return (
                      <div
                        key={node.id}
                        className={`${styles.visibilityCard} ${isSelected ? styles.selected : ''}`}
                        style={{ borderColor: isSelected ? node.color : 'var(--border-medium)' }}
                        onClick={() => setSelectedNode(node.id)}
                      >
                        <div className={styles.cardHeader} style={{ backgroundColor: `${node.color}20` }}>
                          <strong style={{ color: node.color }}>{node.name}</strong>
                          <span className={styles.roleLabel}>{node.role}</span>
                        </div>
                        
                        <div className={styles.visibilityList}>
                          <div className={styles.visibilityItem}>
                            <span>Sender Identity:</span>
                            {visibility.sender ? (
                              <Badge variant="error" size="small"><Eye size={12} /> Knows</Badge>
                            ) : (
                              <Badge variant="success" size="small"><EyeOff size={12} /> Hidden</Badge>
                            )}
                          </div>
                          
                          <div className={styles.visibilityItem}>
                            <span>Receiver Identity:</span>
                            {visibility.receiver ? (
                              <Badge variant="error" size="small"><Eye size={12} /> Knows</Badge>
                            ) : (
                              <Badge variant="success" size="small"><EyeOff size={12} /> Hidden</Badge>
                            )}
                          </div>
                          
                          <div className={styles.visibilityItem}>
                            <span>Payment Amount:</span>
                            {visibility.amount ? (
                              <Badge variant="error" size="small"><Eye size={12} /> Knows</Badge>
                            ) : (
                              <Badge variant="success" size="small"><EyeOff size={12} /> Hidden</Badge>
                            )}
                          </div>
                          
                          <div className={styles.visibilityItem}>
                            <span>Description:</span>
                            {visibility.description ? (
                              <Badge variant="error" size="small"><Eye size={12} /> Knows</Badge>
                            ) : (
                              <Badge variant="success" size="small"><EyeOff size={12} /> Hidden</Badge>
                            )}
                          </div>

                          {visibility.knows && (
                            <div className={styles.knowsInfo}>
                              <Info size={14} />
                              <span>{visibility.knows}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Privacy Summary */}
            {step === 5 && (
              <motion.div
                className={styles.privacySummary}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className={styles.summaryHeader}>
                  <Shield size={24} />
                  <h4>Privacy Benefits</h4>
                </div>
                
                <div className={styles.benefitsList}>
                  <div className={styles.benefit}>
                    <Check size={18} />
                    <div>
                      <strong>No Public Record</strong>
                      <p>Payment not recorded on the blockchain</p>
                    </div>
                  </div>
                  
                  <div className={styles.benefit}>
                    <Check size={18} />
                    <div>
                      <strong>Sender/Receiver Unlinkable</strong>
                      <p>Routing nodes can't connect sender to receiver</p>
                    </div>
                  </div>
                  
                  <div className={styles.benefit}>
                    <Check size={18} />
                    <div>
                      <strong>Amount Hidden</strong>
                      <p>Intermediaries don't know payment amount</p>
                    </div>
                  </div>
                  
                  <div className={styles.benefit}>
                    <Check size={18} />
                    <div>
                      <strong>Fast & Private</strong>
                      <p>Instant settlement with enhanced privacy</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </>
        )}
      </Card>

      {/* Technical Deep Dive */}
      <Accordion
        title="Deep Dive: How Onion Routing Works"
        variant="deepdive"
        icon={<Lock size={16} />}
      >
        <p>
          Lightning uses <strong>onion routing</strong>, similar to the Tor network, to protect 
          payment privacy. The sender creates multiple "layers" of encryption, like layers of an onion.
        </p>
        
        <h4>Technical Details:</h4>
        <ul>
          <li>
            <strong>Source routing:</strong> The sender (Alice) chooses the entire payment path and 
            encrypts routing information for each hop in layers
          </li>
          <li>
            <strong>Layered encryption:</strong> Each routing node can only decrypt one layer, 
            revealing only the next hop. They cannot see the final destination or full path
          </li>
          <li>
            <strong>HTLC privacy:</strong> Each hop creates an HTLC (Hash Time-Locked Contract) 
            for a slightly different amount (to account for fees), making it harder to trace
          </li>
          <li>
            <strong>Payment hash:</strong> All HTLCs use the same payment hash, but nodes don't 
            know if they're the final recipient or just forwarding
          </li>
        </ul>

        <h4>What Each Hop Knows:</h4>
        <ul>
          <li><strong>Routing nodes (Bob, Carol):</strong> Only know the previous hop and next hop. 
          They don't know if the previous hop is the sender or the next hop is the receiver</li>
          <li><strong>Amount privacy:</strong> Each hop sees slightly different amounts due to fees, 
          making amount correlation more difficult</li>
          <li><strong>Timing attacks:</strong> Sophisticated attackers could potentially correlate 
          payments by timing, but this is much harder than on-chain analysis</li>
        </ul>

        <h4>Privacy Limitations:</h4>
        <ul>
          <li>
            <strong>Channel graph is public:</strong> Opening and closing channels requires on-chain 
            transactions, which are visible
          </li>
          <li>
            <strong>Network topology:</strong> The network of channels is public knowledge, allowing 
            some statistical analysis
          </li>
          <li>
            <strong>Invoice metadata:</strong> Lightning invoices can contain descriptions that 
            leak information. Use generic descriptions for better privacy
          </li>
          <li>
            <strong>Balance probing:</strong> Malicious nodes might try to probe channel balances, 
            though this is being addressed in newer protocol versions
          </li>
        </ul>

        <h4>Best Practices:</h4>
        <ul>
          <li>Use multiple channels to different peers for better privacy</li>
          <li>Avoid reusing invoices (each invoice should be single-use)</li>
          <li>Keep invoice descriptions generic when possible</li>
          <li>Consider using Tor for additional network-level privacy</li>
          <li>Private channels (unannounced) offer even better privacy but limit routing</li>
        </ul>
      </Accordion>
    </div>
  );
}

export default PrivacyDemo;
