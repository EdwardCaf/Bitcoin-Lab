import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Eye,
  EyeOff,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Bitcoin,
  Zap,
  Coins,
  Info,
  Users,
  Lock
} from 'lucide-react';
import { Card, Button, Badge, Accordion } from '../../common';
import styles from './PrivacyComparison.module.css';

const LAYERS = [
  {
    id: 'bitcoin',
    name: 'Bitcoin',
    icon: Bitcoin,
    color: '#f7931a',
    privacy: 'low',
    properties: {
      addressReuse: 'Visible on chain',
      amounts: 'Fully public',
      timing: 'Block timestamps visible',
      participants: 'Address clusters linkable',
      graphAnalysis: 'Vulnerable to chain analysis'
    },
    rating: 2,
    description: 'All transactions permanently recorded on public blockchain'
  },
  {
    id: 'lightning',
    name: 'Lightning',
    icon: Zap,
    color: '#ffc107',
    privacy: 'medium',
    properties: {
      addressReuse: 'Not on blockchain',
      amounts: 'Hidden from intermediate nodes',
      timing: 'No public timestamps',
      participants: 'Sender/receiver hidden via onion routing',
      graphAnalysis: 'Channel opens/closes visible on-chain'
    },
    rating: 4,
    description: 'Off-chain payments with onion routing for better privacy'
  },
  {
    id: 'ecash',
    name: 'eCash',
    icon: Coins,
    color: '#22c55e',
    privacy: 'high',
    properties: {
      addressReuse: 'No addresses',
      amounts: 'Denominations hide amounts',
      timing: 'No timing correlation',
      participants: 'Completely unlinkable',
      graphAnalysis: 'No transaction graph exists'
    },
    rating: 5,
    description: 'Perfect privacy via blind signatures - mint cannot track users'
  }
];

const SCENARIOS = [
  {
    id: 'donation',
    title: 'Donating to a Cause',
    concern: 'You don\'t want the charity to see your entire wallet balance',
    layers: {
      bitcoin: { risk: 'high', description: 'Charity can see all your addresses and balance history' },
      lightning: { risk: 'low', description: 'Only the payment amount is visible, not your balance' },
      ecash: { risk: 'none', description: 'Perfect privacy - charity can\'t link payment to you at all' }
    }
  },
  {
    id: 'salary',
    title: 'Receiving Your Salary',
    concern: 'You don\'t want your employer tracking how you spend money',
    layers: {
      bitcoin: { risk: 'high', description: 'Employer can follow the chain and see where you spend' },
      lightning: { risk: 'medium', description: 'Channel opens visible, but payments are private' },
      ecash: { risk: 'none', description: 'Once converted to eCash, spending is completely untraceable' }
    }
  },
  {
    id: 'merchant',
    title: 'Buying Coffee',
    concern: 'You don\'t want the coffee shop to know you just received a large payment',
    layers: {
      bitcoin: { risk: 'high', description: 'Merchant sees your transaction history and can estimate balance' },
      lightning: { risk: 'low', description: 'Merchant only sees this payment, not your channels or balance' },
      ecash: { risk: 'none', description: 'Tokens reveal nothing about your financial history' }
    }
  }
];

export function PrivacyComparison() {
  const [selectedLayer, setSelectedLayer] = useState('bitcoin');
  const [selectedScenario, setSelectedScenario] = useState(0);
  const [showGraph, setShowGraph] = useState(true);

  const currentLayer = LAYERS.find(l => l.id === selectedLayer);
  const scenario = SCENARIOS[selectedScenario];

  return (
    <div className={styles.container}>
      <Card variant="elevated" padding="large">
        <div className={styles.header}>
          <div className={styles.titleSection}>
            <div className={styles.iconWrapper}>
              <Shield size={24} />
            </div>
            <div>
              <h3 className={styles.title}>Privacy Comparison</h3>
              <p className={styles.subtitle}>
                Compare privacy properties across Bitcoin layers
              </p>
            </div>
          </div>
        </div>

        {/* Layer Selector */}
        <div className={styles.layerSelector}>
          {LAYERS.map((layer) => {
            const Icon = layer.icon;
            return (
              <motion.button
                key={layer.id}
                className={`${styles.layerButton} ${
                  selectedLayer === layer.id ? styles.active : ''
                }`}
                style={{
                  borderColor: selectedLayer === layer.id ? layer.color : 'var(--border-color)'
                }}
                onClick={() => setSelectedLayer(layer.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div 
                  className={styles.layerIcon}
                  style={{ backgroundColor: layer.color }}
                >
                  <Icon size={24} />
                </div>
                <div className={styles.layerInfo}>
                  <span className={styles.layerName}>{layer.name}</span>
                  <div className={styles.privacyRating}>
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className={styles.ratingDot}
                        style={{
                          backgroundColor: i < layer.rating ? layer.color : 'var(--bg-tertiary)'
                        }}
                      />
                    ))}
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Transaction Graph Visualization */}
        <div className={styles.graphSection}>
          <div className={styles.graphHeader}>
            <h4>Transaction Graph Visibility</h4>
            <Badge variant={currentLayer.privacy === 'high' ? 'success' : currentLayer.privacy === 'medium' ? 'warning' : 'error'}>
              {currentLayer.privacy.toUpperCase()} Privacy
            </Badge>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={selectedLayer}
              className={styles.graph}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {selectedLayer === 'bitcoin' && <BitcoinGraph />}
              {selectedLayer === 'lightning' && <LightningGraph />}
              {selectedLayer === 'ecash' && <EcashGraph />}
            </motion.div>
          </AnimatePresence>

          <p className={styles.graphDescription}>
            {currentLayer.description}
          </p>
        </div>

        {/* Properties Table */}
        <div className={styles.propertiesSection}>
          <h4>Privacy Properties</h4>
          <div className={styles.propertiesTable}>
            {Object.entries(currentLayer.properties).map(([key, value]) => (
              <motion.div
                key={key}
                className={styles.propertyRow}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className={styles.propertyLabel}>
                  {formatPropertyLabel(key)}
                </div>
                <div className={`${styles.propertyValue} ${getPropertyValueClass(value)}`}>
                  {getPropertyIcon(value)}
                  <span>{value}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Real-World Scenarios */}
        <div className={styles.scenariosSection}>
          <h4>Real-World Scenarios</h4>
          <div className={styles.scenarioSelector}>
            {SCENARIOS.map((s, index) => (
              <button
                key={s.id}
                className={`${styles.scenarioButton} ${
                  selectedScenario === index ? styles.active : ''
                }`}
                onClick={() => setSelectedScenario(index)}
              >
                {s.title}
              </button>
            ))}
          </div>

          <div className={styles.scenarioCard}>
            <div className={styles.scenarioConcern}>
              <AlertTriangle size={18} />
              <span>{scenario.concern}</span>
            </div>

            <div className={styles.scenarioComparison}>
              {LAYERS.map((layer) => {
                const layerScenario = scenario.layers[layer.id];
                const Icon = layer.icon;
                
                return (
                  <div 
                    key={layer.id}
                    className={`${styles.scenarioItem} ${
                      selectedLayer === layer.id ? styles.selected : ''
                    }`}
                  >
                    <div className={styles.scenarioHeader}>
                      <div 
                        className={styles.scenarioIcon}
                        style={{ backgroundColor: layer.color }}
                      >
                        <Icon size={16} />
                      </div>
                      <span>{layer.name}</span>
                      <Badge 
                        variant={
                          layerScenario.risk === 'none' ? 'success' :
                          layerScenario.risk === 'low' ? 'warning' :
                          'error'
                        }
                        size="small"
                      >
                        {layerScenario.risk} risk
                      </Badge>
                    </div>
                    <p>{layerScenario.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Card>

      {/* Deep Dive */}
      <Accordion
        title="Deep Dive: Privacy Trade-offs"
        variant="deepdive"
        icon={<Shield size={16} />}
      >
        <p>
          Each layer makes different privacy trade-offs:
        </p>
        
        <h4>Bitcoin (Layer 1)</h4>
        <ul>
          <li><strong>Pro:</strong> Fully trustless, censorship-resistant, permanent settlement</li>
          <li><strong>Con:</strong> All transactions public forever. Chain analysis can cluster addresses and track funds</li>
          <li><strong>Best for:</strong> Large, final settlements where transparency is acceptable</li>
        </ul>

        <h4>Lightning (Layer 2)</h4>
        <ul>
          <li><strong>Pro:</strong> Instant payments, onion routing hides sender/receiver from intermediaries</li>
          <li><strong>Con:</strong> Channel opens/closes are on-chain. Routing nodes can theoretically correlate timing/amounts</li>
          <li><strong>Best for:</strong> Everyday payments where privacy is important but trust in routing is acceptable</li>
        </ul>

        <h4>eCash (Cashu/Fedimint)</h4>
        <ul>
          <li><strong>Pro:</strong> Perfect cryptographic privacy via blind signatures. Mint cannot track users</li>
          <li><strong>Con:</strong> Custodial - you must trust the mint not to steal funds or be shut down</li>
          <li><strong>Best for:</strong> Privacy-critical payments in small amounts with trusted community mints</li>
        </ul>

        <p>
          <strong>The key insight:</strong> eCash trades custody risk for perfect privacy. Bitcoin trades 
          privacy for trustlessness. Lightning sits in the middle. Choose the right tool for each use case!
        </p>
      </Accordion>
    </div>
  );
}

function BitcoinGraph() {
  return (
    <div className={styles.bitcoinGraph}>
      <div className={styles.graphTitle}>
        <Eye size={16} />
        <span>Fully Public Transaction Graph</span>
      </div>
      <svg className={styles.graphSvg} viewBox="0 0 400 200">
        {/* Addresses */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Alice's addresses */}
          <circle cx="50" cy="50" r="20" fill="#3b82f6" opacity="0.3" />
          <circle cx="50" cy="150" r="20" fill="#3b82f6" opacity="0.3" />
          
          {/* Bob's addresses */}
          <circle cx="200" cy="100" r="20" fill="#8b5cf6" opacity="0.3" />
          
          {/* Carol's addresses */}
          <circle cx="350" cy="50" r="20" fill="#ec4899" opacity="0.3" />
          <circle cx="350" cy="150" r="20" fill="#ec4899" opacity="0.3" />
        </motion.g>

        {/* Transactions */}
        <motion.g
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.6 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          <motion.path
            d="M 70 50 L 180 100"
            stroke="#f7931a"
            strokeWidth="2"
            fill="none"
            strokeDasharray="5,5"
          />
          <motion.path
            d="M 70 150 L 180 100"
            stroke="#f7931a"
            strokeWidth="2"
            fill="none"
            strokeDasharray="5,5"
          />
          <motion.path
            d="M 220 100 L 330 50"
            stroke="#f7931a"
            strokeWidth="2"
            fill="none"
            strokeDasharray="5,5"
          />
          <motion.path
            d="M 220 100 L 330 150"
            stroke="#f7931a"
            strokeWidth="2"
            fill="none"
            strokeDasharray="5,5"
          />
        </motion.g>

        {/* Labels */}
        <text x="50" y="190" textAnchor="middle" fontSize="12" fill="var(--text-secondary)">
          Alice
        </text>
        <text x="200" y="190" textAnchor="middle" fontSize="12" fill="var(--text-secondary)">
          Bob
        </text>
        <text x="350" y="190" textAnchor="middle" fontSize="12" fill="var(--text-secondary)">
          Carol
        </text>
      </svg>
      <div className={styles.graphNote}>
        <XCircle size={14} />
        <span>All amounts, addresses, and connections are permanently visible</span>
      </div>
    </div>
  );
}

function LightningGraph() {
  return (
    <div className={styles.lightningGraph}>
      <div className={styles.graphTitle}>
        <EyeOff size={16} />
        <span>Onion-Routed Payments</span>
      </div>
      <svg className={styles.graphSvg} viewBox="0 0 400 200">
        {/* Nodes */}
        <motion.g
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
        >
          <circle cx="50" cy="100" r="25" fill="#ffc107" opacity="0.2" stroke="#ffc107" strokeWidth="2" />
          <circle cx="200" cy="60" r="25" fill="#ffc107" opacity="0.1" stroke="#ffc107" strokeWidth="1" />
          <circle cx="200" cy="140" r="25" fill="#ffc107" opacity="0.1" stroke="#ffc107" strokeWidth="1" />
          <circle cx="350" cy="100" r="25" fill="#ffc107" opacity="0.2" stroke="#ffc107" strokeWidth="2" />
        </motion.g>

        {/* Onion layers */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <path
            d="M 75 100 Q 137 60 175 60"
            stroke="#ffc107"
            strokeWidth="3"
            fill="none"
            opacity="0.6"
          />
          <path
            d="M 225 60 Q 287 60 325 100"
            stroke="#ffc107"
            strokeWidth="3"
            fill="none"
            opacity="0.4"
          />
        </motion.g>

        {/* Labels */}
        <text x="50" y="145" textAnchor="middle" fontSize="12" fill="var(--text-primary)" fontWeight="600">
          Alice
        </text>
        <text x="200" y="40" textAnchor="middle" fontSize="10" fill="var(--text-tertiary)">
          Routing
        </text>
        <text x="350" y="145" textAnchor="middle" fontSize="12" fill="var(--text-primary)" fontWeight="600">
          Bob
        </text>
      </svg>
      <div className={styles.graphNote}>
        <CheckCircle size={14} />
        <span>Payment path hidden via onion routing - intermediaries can't see endpoints</span>
      </div>
    </div>
  );
}

function EcashGraph() {
  return (
    <div className={styles.ecashGraph}>
      <div className={styles.graphTitle}>
        <Lock size={16} />
        <span>No Transaction Graph</span>
      </div>
      <svg className={styles.graphSvg} viewBox="0 0 400 200">
        {/* Mint in center */}
        <motion.g
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring' }}
        >
          <circle cx="200" cy="100" r="40" fill="#22c55e" opacity="0.1" stroke="#22c55e" strokeWidth="2" />
          <text x="200" y="105" textAnchor="middle" fontSize="14" fill="var(--text-primary)" fontWeight="600">
            Mint
          </text>
        </motion.g>

        {/* Users around mint - disconnected */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <circle cx="50" cy="50" r="20" fill="#3b82f6" opacity="0.3" />
          <circle cx="350" cy="50" r="20" fill="#8b5cf6" opacity="0.3" />
          <circle cx="50" cy="150" r="20" fill="#ec4899" opacity="0.3" />
          <circle cx="350" cy="150" r="20" fill="#f97316" opacity="0.3" />
          
          <text x="50" y="185" textAnchor="middle" fontSize="10" fill="var(--text-secondary)">Alice</text>
          <text x="350" y="185" textAnchor="middle" fontSize="10" fill="var(--text-secondary)">Bob</text>
          <text x="50" y="30" textAnchor="middle" fontSize="10" fill="var(--text-secondary)">Carol</text>
          <text x="350" y="30" textAnchor="middle" fontSize="10" fill="var(--text-secondary)">Dave</text>
        </motion.g>

        {/* Question marks - unknown connections */}
        <motion.g
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <text x="125" y="75" fontSize="24" fill="var(--text-tertiary)">?</text>
          <text x="275" y="75" fontSize="24" fill="var(--text-tertiary)">?</text>
          <text x="125" y="135" fontSize="24" fill="var(--text-tertiary)">?</text>
          <text x="275" y="135" fontSize="24" fill="var(--text-tertiary)">?</text>
        </motion.g>
      </svg>
      <div className={styles.graphNote}>
        <CheckCircle size={14} />
        <span>Blind signatures mean the mint cannot link tokens to users - perfect privacy!</span>
      </div>
    </div>
  );
}

function formatPropertyLabel(key) {
  const labels = {
    addressReuse: 'Address Tracking',
    amounts: 'Transaction Amounts',
    timing: 'Timing Analysis',
    participants: 'Participant Privacy',
    graphAnalysis: 'Graph Analysis'
  };
  return labels[key] || key;
}

function isNegativeProperty(value) {
  const lowerValue = value.toLowerCase();
  return lowerValue.includes('visible') || 
         lowerValue.includes('public') || 
         lowerValue.includes('vulnerable') ||
         lowerValue.includes('linkable');
}

function isPositiveProperty(value) {
  const lowerValue = value.toLowerCase();
  return lowerValue.includes('hidden') || 
         lowerValue.includes('hide') ||
         lowerValue.includes('unlinkable') || 
         lowerValue.includes('no ') ||
         lowerValue.startsWith('no ') ||
         lowerValue.includes('not on');
}

function getPropertyIcon(value) {
  if (isNegativeProperty(value)) {
    return <XCircle size={16} className={styles.iconNegative} />;
  }
  if (isPositiveProperty(value)) {
    return <CheckCircle size={16} className={styles.iconPositive} />;
  }
  return <Info size={16} className={styles.iconNeutral} />;
}

function getPropertyValueClass(value) {
  if (isNegativeProperty(value)) {
    return styles.propertyValueNegative;
  }
  if (isPositiveProperty(value)) {
    return styles.propertyValuePositive;
  }
  return styles.propertyValueNeutral;
}

export default PrivacyComparison;
