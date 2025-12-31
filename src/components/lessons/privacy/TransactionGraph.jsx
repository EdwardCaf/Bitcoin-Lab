import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  GitBranch, 
  AlertTriangle,
  Search,
  RotateCcw
} from 'lucide-react';
import { Card, Button, Badge, Accordion } from '../../common';
import styles from './TransactionGraph.module.css';

// Generate fictional but realistic-looking transaction data
const generateTransactionHistory = () => {
  const addresses = [];
  for (let i = 0; i < 8; i++) {
    const chars = 'abcdef0123456789';
    let addr = 'bc1q';
    for (let j = 0; j < 12; j++) {
      addr += chars[Math.floor(Math.random() * chars.length)];
    }
    addresses.push(addr + '...');
  }

  return {
    yourAddresses: [addresses[0], addresses[1], addresses[2]],
    transactions: [
      {
        id: 'tx1',
        inputs: [{ address: addresses[3], amount: 1.5, label: 'Exchange' }],
        outputs: [
          { address: addresses[0], amount: 1.0, isYours: true },
          { address: addresses[4], amount: 0.499, label: 'Change' }
        ],
        description: 'Withdrawal from exchange'
      },
      {
        id: 'tx2',
        inputs: [
          { address: addresses[0], amount: 1.0, isYours: true },
          { address: addresses[1], amount: 0.3, isYours: true }
        ],
        outputs: [
          { address: addresses[5], amount: 1.1, label: 'Merchant' },
          { address: addresses[2], amount: 0.198, isYours: true, label: 'Change' }
        ],
        description: 'Purchase (multiple inputs)'
      },
      {
        id: 'tx3',
        inputs: [{ address: addresses[6], amount: 0.5, label: 'Friend' }],
        outputs: [
          { address: addresses[1], amount: 0.3, isYours: true },
          { address: addresses[7], amount: 0.199 }
        ],
        description: 'Received from friend'
      }
    ],
    heuristics: [
      {
        type: 'common-input',
        title: 'Common Input Ownership',
        description: 'Inputs in the same transaction likely belong to the same wallet',
        affected: ['tx2'],
        risk: 'high'
      },
      {
        type: 'change-detection',
        title: 'Change Output Detection',
        description: 'The smaller output going to a new address is likely change',
        affected: ['tx1', 'tx2'],
        risk: 'medium'
      },
      {
        type: 'round-amount',
        title: 'Round Number Analysis',
        description: 'Payments often use round numbers; the odd amount is change',
        affected: ['tx2'],
        risk: 'medium'
      }
    ]
  };
};

export function TransactionGraph() {
  const [data] = useState(() => generateTransactionHistory());
  const [selectedHeuristic, setSelectedHeuristic] = useState(null);

  const affectedTxs = selectedHeuristic 
    ? data.heuristics.find(h => h.type === selectedHeuristic)?.affected || []
    : [];

  return (
    <div className={styles.container}>
      <Card variant="elevated" padding="large">
        <div className={styles.header}>
          <div className={styles.titleSection}>
            <div className={styles.iconWrapper}>
              <GitBranch size={24} />
            </div>
            <div>
              <h3 className={styles.title}>Transaction Graph Analysis</h3>
              <p className={styles.subtitle}>
                See how chain analysis can trace transactions
              </p>
            </div>
          </div>
        </div>

        {/* Your Addresses */}
        <div className={styles.addressesSection}>
          <h4>Your Known Addresses</h4>
          <div className={styles.addressTags}>
            {data.yourAddresses.map((addr, i) => (
              <span key={i} className={styles.addressTag}>
                <code>{addr}</code>
              </span>
            ))}
          </div>
        </div>

        {/* Transaction History */}
        <div className={styles.transactionsSection}>
          <h4>Transaction History</h4>
          
          {data.transactions.map((tx, txIndex) => (
            <motion.div
              key={tx.id}
              className={`${styles.transaction} ${
                affectedTxs.includes(tx.id) ? styles.highlighted : ''
              }`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: txIndex * 0.1 }}
            >
              <div className={styles.txHeader}>
                <Badge variant="outline" size="small">{tx.id.toUpperCase()}</Badge>
                <span className={styles.txDescription}>{tx.description}</span>
              </div>
              
              <div className={styles.txFlow}>
                {/* Inputs */}
                <div className={styles.txInputs}>
                  <span className={styles.flowLabel}>Inputs</span>
                  {tx.inputs.map((input, i) => (
                    <div 
                      key={i} 
                      className={`${styles.utxoBox} ${input.isYours ? styles.yours : ''}`}
                    >
                      <code>{input.address}</code>
                      <span className={styles.utxoAmount}>{input.amount} BTC</span>
                      {input.label && <span className={styles.utxoLabel}>{input.label}</span>}
                      {input.isYours && <Badge variant="primary" size="small">Yours</Badge>}
                    </div>
                  ))}
                </div>
                
                <div className={styles.txArrow}>→</div>
                
                {/* Outputs */}
                <div className={styles.txOutputs}>
                  <span className={styles.flowLabel}>Outputs</span>
                  {tx.outputs.map((output, i) => (
                    <div 
                      key={i} 
                      className={`${styles.utxoBox} ${output.isYours ? styles.yours : ''}`}
                    >
                      <code>{output.address}</code>
                      <span className={styles.utxoAmount}>{output.amount} BTC</span>
                      {output.label && <span className={styles.utxoLabel}>{output.label}</span>}
                      {output.isYours && <Badge variant="primary" size="small">Yours</Badge>}
                    </div>
                  ))}
                </div>
              </div>
              
              {affectedTxs.includes(tx.id) && (
                <motion.div 
                  className={styles.analysisNote}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                >
                  <AlertTriangle size={16} />
                  <span>This transaction reveals information through heuristic analysis</span>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Heuristics Panel */}
        <div className={styles.heuristicsSection}>
          <h4>
            <Search size={18} />
            Chain Analysis Heuristics
          </h4>
          <p className={styles.heuristicsIntro}>
            Click a heuristic to see which transactions it affects:
          </p>
          
          <div className={styles.heuristicsList}>
            {data.heuristics.map(heuristic => (
              <button
                key={heuristic.type}
                className={`${styles.heuristicCard} ${
                  selectedHeuristic === heuristic.type ? styles.selected : ''
                }`}
                onClick={() => setSelectedHeuristic(
                  selectedHeuristic === heuristic.type ? null : heuristic.type
                )}
              >
                <div className={styles.heuristicHeader}>
                  <span className={styles.heuristicTitle}>{heuristic.title}</span>
                  <Badge 
                    variant={heuristic.risk === 'high' ? 'error' : 'warning'} 
                    size="small"
                  >
                    {heuristic.risk} risk
                  </Badge>
                </div>
                <p className={styles.heuristicDescription}>{heuristic.description}</p>
              </button>
            ))}
          </div>
        </div>
      </Card>

      <Accordion
        title="Deep Dive: How Chain Analysis Works"
        variant="deepdive"
        icon={<Search size={16} />}
      >
        <p>
          Chain analysis companies use various techniques to cluster addresses and 
          trace transaction flows:
        </p>
        <ul>
          <li>
            <strong>Common Input Heuristic:</strong> If two inputs are spent in the 
            same transaction, they likely belong to the same wallet
          </li>
          <li>
            <strong>Change Detection:</strong> Identifying which output is "change" 
            back to the sender based on amounts and address types
          </li>
          <li>
            <strong>Timing Analysis:</strong> Correlating transaction times with 
            known activities
          </li>
          <li>
            <strong>Exchange Deposits:</strong> Linking clusters when they deposit 
            to exchanges that require identity verification
          </li>
        </ul>
        <p>
          <strong>Countermeasures:</strong> CoinJoin, avoiding address reuse, using 
          consistent address types, and being mindful of timing patterns.
        </p>
      </Accordion>
    </div>
  );
}

export default TransactionGraph;
