import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Bitcoin,
  Zap,
  Coins,
  Info
} from 'lucide-react';
import { Card, Badge, Accordion } from '../../common';
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
      lightning: { risk: 'low', description: 'Channel opens visible, but payments are private' },
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

        {/* Layer Description */}
        <p className={styles.layerDescription}>
          {currentLayer.description}
        </p>

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
  // Check for 'linkable' but not 'unlinkable'
  const hasLinkable = lowerValue.includes('linkable') && !lowerValue.includes('unlinkable');
  // Check for 'public' but not 'no public'
  const hasPublic = lowerValue.includes('public') && !lowerValue.includes('no public');
  return lowerValue.includes('visible') || 
         hasPublic || 
         lowerValue.includes('vulnerable') ||
         hasLinkable;
}

function getPropertyIcon(value) {
  if (isNegativeProperty(value)) {
    return <XCircle size={16} />;
  }
  return <CheckCircle size={16} />;
}

function getPropertyValueClass(value) {
  if (isNegativeProperty(value)) {
    return styles.propertyValueNegative;
  }
  return styles.propertyValuePositive;
}

export default PrivacyComparison;
