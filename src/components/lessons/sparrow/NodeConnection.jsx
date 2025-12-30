import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Server, 
  Globe, 
  Shield,
  Zap,
  Eye,
  EyeOff,
  CheckCircle,
  AlertTriangle,
  Info,
  Lock,
  Unlock
} from 'lucide-react';
import { Card, Accordion } from '../../common';
import styles from './NodeConnection.module.css';

const connectionTypes = [
  {
    id: 'bitcoin-core',
    title: 'Bitcoin Core',
    icon: Server,
    color: 'var(--success)',
    privacy: 'maximum',
    description: 'Connect directly to your own Bitcoin Core node',
    pros: [
      'Maximum privacy - no third party sees your addresses',
      'Verify transactions yourself - don\'t trust, verify',
      'Full blockchain validation',
      'Supports all Sparrow features'
    ],
    cons: [
      'Requires running Bitcoin Core (500GB+ disk space)',
      'Initial sync takes hours to days',
      'More technical setup'
    ],
    setup: [
      'Install and sync Bitcoin Core',
      'Enable the server option in bitcoin.conf (server=1)',
      'In Sparrow: File > Preferences > Server',
      'Select "Bitcoin Core" and enter RPC credentials',
      'Test connection and apply'
    ]
  },
  {
    id: 'electrum',
    title: 'Private Electrum Server',
    icon: Zap,
    color: 'var(--info)',
    privacy: 'high',
    description: 'Connect to your own Electrs, Fulcrum, or ElectrumX server',
    pros: [
      'Privacy equivalent to Bitcoin Core',
      'Faster queries than Core RPC',
      'Lower resource usage than Core',
      'Popular with node packages (Umbrel, Start9, etc.)'
    ],
    cons: [
      'Still requires full blockchain',
      'Additional software to set up',
      'Slightly more complex than Core'
    ],
    setup: [
      'Run an Electrum server (Electrs, Fulcrum, or ElectrumX)',
      'Note your server address and port (usually 50001 or 50002)',
      'In Sparrow: File > Preferences > Server',
      'Select "Private Electrum Server"',
      'Enter your server URL and port, test connection'
    ]
  },
  {
    id: 'public',
    title: 'Public Electrum Server',
    icon: Globe,
    color: 'var(--warning)',
    privacy: 'low',
    description: 'Use public servers - convenient but less private',
    pros: [
      'No setup required - works immediately',
      'No disk space needed',
      'Good for testing or small amounts',
      'Sparrow includes curated server list'
    ],
    cons: [
      'Server operator can see your addresses',
      'Must trust server for balance info',
      'Could potentially be censored',
      'Not suitable for significant holdings'
    ],
    setup: [
      'In Sparrow: File > Preferences > Server',
      'Select "Public Server"',
      'Choose a server from the list or use default',
      'Consider using Tor for additional privacy',
      'Test connection and apply'
    ]
  }
];

function PrivacyMeter({ level }) {
  const levels = {
    maximum: { bars: 4, color: 'var(--success)', label: 'Maximum Privacy' },
    high: { bars: 3, color: 'var(--info)', label: 'High Privacy' },
    low: { bars: 1, color: 'var(--warning)', label: 'Low Privacy' }
  };
  
  const config = levels[level];
  
  return (
    <div className={styles.privacyMeter}>
      <div className={styles.privacyBars}>
        {[1, 2, 3, 4].map(i => (
          <div
            key={i}
            className={`${styles.privacyBar} ${i <= config.bars ? styles.active : ''}`}
            style={{ '--bar-color': config.color }}
          />
        ))}
      </div>
      <span className={styles.privacyLabel} style={{ color: config.color }}>
        {config.label}
      </span>
    </div>
  );
}

function NetworkDiagram({ selectedType }) {
  const isCore = selectedType === 'bitcoin-core';
  const isPrivateElectrum = selectedType === 'electrum';
  const isPublic = selectedType === 'public';
  
  return (
    <svg viewBox="0 0 500 200" className={styles.diagram}>
      {/* Your Computer / Sparrow */}
      <g transform="translate(30, 70)">
        <rect width="100" height="60" rx="8" fill="var(--bg-tertiary)" stroke="var(--bitcoin-orange)" strokeWidth="2" />
        <text x="50" y="30" textAnchor="middle" fill="var(--text-primary)" fontSize="10" fontWeight="600">Sparrow</text>
        <text x="50" y="45" textAnchor="middle" fill="var(--text-muted)" fontSize="8">Your Computer</text>
      </g>
      
      {/* Connection line */}
      <motion.path
        d={isPublic ? "M135 100 L200 100 Q225 100 225 80 L225 60 Q225 40 250 40 L340 40" : "M135 100 L240 100"}
        stroke={isPublic ? 'var(--warning)' : 'var(--success)'}
        strokeWidth="2"
        strokeDasharray={isPublic ? '5,5' : 'none'}
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.5 }}
      />
      
      {isPublic && (
        <>
          {/* Internet cloud */}
          <g transform="translate(200, 80)">
            <ellipse cx="30" cy="20" rx="35" ry="20" fill="var(--warning)" fillOpacity="0.1" stroke="var(--warning)" strokeWidth="1" strokeDasharray="3,3" />
            <Globe x="18" y="8" size={24} className={styles.internetIcon} />
          </g>
          
          {/* Eye icon - server sees you */}
          <g transform="translate(280, 65)">
            <Eye size={16} className={styles.eyeIcon} />
          </g>
        </>
      )}
      
      {/* Your Node (for Core/Electrum) or Public Server */}
      <g transform={isPublic ? "translate(350, 20)" : "translate(250, 70)"}>
        <rect 
          width={isPublic ? 120 : 100} 
          height="60" 
          rx="8" 
          fill="var(--bg-tertiary)" 
          stroke={isPublic ? 'var(--warning)' : 'var(--success)'} 
          strokeWidth="2" 
        />
        <text 
          x={isPublic ? 60 : 50} 
          y="25" 
          textAnchor="middle" 
          fill="var(--text-primary)" 
          fontSize="10" 
          fontWeight="600"
        >
          {isPublic ? 'Public Server' : isCore ? 'Bitcoin Core' : 'Electrum Server'}
        </text>
        <text 
          x={isPublic ? 60 : 50} 
          y="40" 
          textAnchor="middle" 
          fill="var(--text-muted)" 
          fontSize="8"
        >
          {isPublic ? 'Third Party' : 'Your Hardware'}
        </text>
        
        {!isPublic && (
          <g transform="translate(35, 42)">
            <Lock size={14} className={styles.lockIcon} />
          </g>
        )}
        {isPublic && (
          <g transform="translate(52, 42)">
            <Unlock size={14} className={styles.unlockIcon} />
          </g>
        )}
      </g>
      
      {/* Arrow to Bitcoin Network */}
      <motion.path
        d={isPublic ? "M475 50 L490 50" : "M355 100 L420 100"}
        stroke="var(--bitcoin-orange)"
        strokeWidth="2"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      />
      
      {/* Bitcoin Network */}
      <g transform={isPublic ? "translate(450, 70)" : "translate(430, 70)"}>
        <circle cx="30" cy="30" r="30" fill="var(--bitcoin-orange-subtle)" stroke="var(--bitcoin-orange)" strokeWidth="2" />
        <text x="30" y="37" textAnchor="middle" fill="var(--bitcoin-orange)" fontSize="20" fontWeight="bold">₿</text>
        <text x="30" y="75" textAnchor="middle" fill="var(--text-muted)" fontSize="8">Bitcoin Network</text>
      </g>
      
      {/* Privacy indicator */}
      <g transform={isPublic ? "translate(200, 150)" : "translate(150, 150)"}>
        <rect width="200" height="30" rx="4" fill={isPublic ? 'var(--warning)' : 'var(--success)'} fillOpacity="0.1" />
        {isPublic ? (
          <>
            <EyeOff x="10" y="7" size={16} className={styles.privacyIconBad} />
            <text x="35" y="20" fill="var(--warning)" fontSize="10">Server can see your addresses</text>
          </>
        ) : (
          <>
            <Shield x="10" y="7" size={16} className={styles.privacyIconGood} />
            <text x="35" y="20" fill="var(--success)" fontSize="10">Your data stays private</text>
          </>
        )}
      </g>
    </svg>
  );
}

export function NodeConnection() {
  const [selectedType, setSelectedType] = useState('bitcoin-core');
  
  const connectionType = connectionTypes.find(t => t.id === selectedType);

  return (
    <div className={styles.container}>
      {/* Intro */}
      <Card variant="elevated" padding="large">
        <div className={styles.introHeader}>
          <div className={styles.introIcon}>
            <Server size={24} />
          </div>
          <div>
            <h4>Why Node Connection Matters</h4>
            <p>
              How Sparrow connects to the Bitcoin network affects your privacy and security. 
              The server you use can see which addresses you're looking up - this reveals 
              your balance and transaction history.
            </p>
          </div>
        </div>
      </Card>
      
      {/* Connection Type Selector */}
      <div className={styles.typeSelector}>
        {connectionTypes.map(type => {
          const Icon = type.icon;
          const isActive = selectedType === type.id;
          
          return (
            <button
              key={type.id}
              className={`${styles.typeButton} ${isActive ? styles.active : ''}`}
              onClick={() => setSelectedType(type.id)}
              style={{ '--type-color': type.color }}
            >
              <div className={styles.typeHeader}>
                <div className={styles.typeIcon}>
                  <Icon size={20} />
                </div>
                <span className={styles.typeTitle}>{type.title}</span>
              </div>
              <PrivacyMeter level={type.privacy} />
            </button>
          );
        })}
      </div>
      
      {/* Network Diagram */}
      <Card variant="elevated" padding="large">
        <h4 className={styles.sectionTitle}>How Data Flows</h4>
        <div className={styles.diagramContainer}>
          <NetworkDiagram selectedType={selectedType} />
        </div>
      </Card>
      
      {/* Selected Type Details */}
      <motion.div
        key={selectedType}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card variant="elevated" padding="large">
          <div className={styles.detailsHeader}>
            <h4>{connectionType.title}</h4>
            <PrivacyMeter level={connectionType.privacy} />
          </div>
          <p className={styles.detailsDescription}>{connectionType.description}</p>
          
          <div className={styles.prosConsGrid}>
            <div className={styles.prosSection}>
              <h5>
                <CheckCircle size={16} />
                Advantages
              </h5>
              <ul>
                {connectionType.pros.map((pro, i) => (
                  <li key={i}>{pro}</li>
                ))}
              </ul>
            </div>
            
            <div className={styles.consSection}>
              <h5>
                <AlertTriangle size={16} />
                Considerations
              </h5>
              <ul>
                {connectionType.cons.map((con, i) => (
                  <li key={i}>{con}</li>
                ))}
              </ul>
            </div>
          </div>
        </Card>
        
        {/* Setup Steps */}
        <Accordion
          title={`Setting Up ${connectionType.title}`}
          variant="deepdive"
          icon={<Info size={16} />}
          defaultOpen
        >
          <div className={styles.setupSteps}>
            {connectionType.setup.map((step, index) => (
              <div key={index} className={styles.setupStep}>
                <div className={styles.setupStepNumber}>{index + 1}</div>
                <div className={styles.setupStepText}>{step}</div>
              </div>
            ))}
          </div>
        </Accordion>
      </motion.div>
      
      {/* Recommendation */}
      <div className={styles.recommendation}>
        <Shield size={20} />
        <div>
          <strong>Our Recommendation</strong>
          <p>
            For the best balance of privacy and usability, run your own node. If you're using 
            a node-in-a-box solution like Umbrel, Start9, or RaspiBlitz, connecting Sparrow 
            to your private Electrum server is straightforward and gives you maximum privacy.
          </p>
        </div>
      </div>
    </div>
  );
}

export default NodeConnection;
