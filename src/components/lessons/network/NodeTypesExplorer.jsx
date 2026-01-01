import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Server, 
  Smartphone, 
  HardDrive,
  Shield,
  Zap,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { Card, Badge, Accordion } from '../../common';
import styles from './NodeTypesExplorer.module.css';

const nodeTypes = [
  {
    id: 'full',
    name: 'Full Node',
    icon: Server,
    color: '#22c55e',
    description: 'The backbone of the Bitcoin network. Fully validates all rules.',
    features: [
      { text: 'Stores complete blockchain (~800GB+)', included: true },
      { text: 'Validates all transactions independently', included: true },
      { text: 'Validates all blocks independently', included: true },
      { text: 'Relays transactions and blocks to peers', included: true },
      { text: 'Enforces consensus rules', included: true },
      { text: 'Creates new blocks (mining)', included: false },
    ],
    examples: ['Bitcoin Core', 'Bitcoin Knots', 'btcd', 'libbitcoin'],
    requirements: 'Disk: 2TB, RAM: 8-16GB, Bandwidth: 200GB/month'
  },

  {
    id: 'neutrino',
    name: 'Light Client (Neutrino)',
    icon: Smartphone,
    color: '#3b82f6',
    description: 'BIP 157/158 compact block filters. Privacy-preserving light client.',
    features: [
      { text: 'Stores block headers + compact filters', included: true },
      { text: 'Downloads only relevant blocks', included: true },
      { text: 'Privacy-preserving (no address leakage)', included: true },
      { text: 'Fast sync, low resource usage', included: true },
      { text: 'Cannot validate all transactions', included: false },
      { text: 'Cannot enforce consensus rules', included: false },
      { text: 'Trusts full nodes for filter accuracy', included: false },
    ],
    examples: ['Lightning wallets (Breez, Phoenix)', 'Wasabi Wallet', 'btcd/lnd'],
    requirements: 'Minimal - works on smartphones and desktops'
  },
  {
    id: 'pruned',
    name: 'Pruned Node',
    icon: HardDrive,
    color: '#8b5cf6',
    description: 'A full node that discards old block data to save space.',
    features: [
      { text: 'Validates all transactions independently', included: true },
      { text: 'Stores only recent blocks + UTXO set', included: true },
      { text: 'Much lower disk requirements (~10GB)', included: true },
      { text: 'Enforces all consensus rules', included: true },
      { text: 'Cannot serve historical blocks to peers', included: false },
      { text: 'Cannot help new nodes sync from scratch', included: false },
    ],
    examples: ['Bitcoin Core with -prune flag'],
    requirements: 'Disk: 30GB+, RAM: 8-16GB+'
  },
];

export function NodeTypesExplorer() {
  const [selectedType, setSelectedType] = useState(nodeTypes[0]);
  
  const SelectedIcon = selectedType.icon;
  
  return (
    <div className={styles.container}>
      <Card variant="elevated" padding="large">
        <div className={styles.header}>
          <div className={styles.titleSection}>
            <div className={styles.iconWrapper}>
              <Server size={24} />
            </div>
            <div>
              <h3 className={styles.title}>Types of Bitcoin Nodes</h3>
              <p className={styles.subtitle}>
                Click on each type to learn more
              </p>
            </div>
          </div>
        </div>
        
        {/* Node Type Selector */}
        <div className={styles.typeSelector}>
          {nodeTypes.map(type => {
            const TypeIcon = type.icon;
            return (
              <button
                key={type.id}
                className={`${styles.typeButton} ${selectedType.id === type.id ? styles.selected : ''}`}
                onClick={() => setSelectedType(type)}
                style={{ '--type-color': type.color }}
              >
                <TypeIcon size={20} />
                <span>{type.name}</span>
              </button>
            );
          })}
        </div>
        
        {/* Selected Type Details */}
        <motion.div
          className={styles.details}
          key={selectedType.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className={styles.detailsHeader}>
            <div 
              className={styles.detailsIcon}
              style={{ background: `${selectedType.color}20`, color: selectedType.color }}
            >
              <SelectedIcon size={32} />
            </div>
            <div>
              <h4 className={styles.detailsName}>{selectedType.name}</h4>
              <p className={styles.detailsDesc}>{selectedType.description}</p>
            </div>
          </div>
          
          {/* Features */}
          <div className={styles.features}>
            <h5>Capabilities</h5>
            <ul className={styles.featureList}>
              {selectedType.features.map((feature, i) => (
                <li key={i} className={feature.included ? styles.included : styles.excluded}>
                  {feature.included ? (
                    <CheckCircle2 size={16} />
                  ) : (
                    <XCircle size={16} />
                  )}
                  <span>{feature.text}</span>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Examples */}
          <div className={styles.examples}>
            <h5>Examples</h5>
            <div className={styles.examplesList}>
              {selectedType.examples.map((example, i) => (
                <Badge key={i} variant="outline">{example}</Badge>
              ))}
            </div>
          </div>
          
          {/* Requirements */}
          <div className={styles.requirements}>
            <h5>Requirements</h5>
            <p>{selectedType.requirements}</p>
          </div>
        </motion.div>
      </Card>
      
      <Accordion
        title="Deep Dive: Why Run Your Own Node?"
        variant="deepdive"
        icon={<Shield size={16} />}
      >
        <p>
          Running your own full node gives you the highest level of security 
          and privacy in Bitcoin:
        </p>
        <ul>
          <li>
            <strong>Don't trust, verify:</strong> You independently verify that 
            all transactions follow the rules, including your own
          </li>
          <li>
            <strong>Privacy:</strong> You don't reveal your addresses to third-party 
            servers when checking balances
          </li>
          <li>
            <strong>Network health:</strong> More nodes make Bitcoin more decentralized 
            and resilient
          </li>
          <li>
            <strong>Consensus votes:</strong> Nodes enforce the rules they agree with, 
            giving them a voice in protocol governance
          </li>
        </ul>
        <p>
          While SPV wallets are convenient, they trust external servers. For 
          maximum security, connect your wallet to your own full node.
        </p>
      </Accordion>
    </div>
  );
}

export default NodeTypesExplorer;
