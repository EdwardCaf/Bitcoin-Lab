import { motion } from 'framer-motion';
import { 
  Shield, 
  Cpu, 
  Eye, 
  Lock, 
  Fingerprint,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { Card, Accordion } from '../../common';
import styles from './SecurityLayers.module.css';

const securityLayers = [
  {
    id: 'secure-elements',
    title: 'Dual Secure Elements',
    icon: Cpu,
    color: 'var(--success)',
    description: 'Your seed phrase is protected by two separate security chips from different manufacturers. Both must be compromised to access your keys.',
    details: [
      'Two chips from different vendors (no single point of failure)',
      'Seed phrase never leaves the secure elements',
      'Hardware-level protection against extraction attempts'
    ]
  },
  {
    id: 'genuine-check',
    title: 'Genuine Verification',
    icon: CheckCircle,
    color: 'var(--success)',
    description: 'A green light confirms the firmware is authentic and unmodified. A red light warns of tampering or unofficial firmware.',
    details: [
      'Green LED means firmware signature is valid',
      'Red LED warns of modified or unsigned code',
      'Controlled by dedicated circuitry (can\'t be faked by software)'
    ]
  },
  {
    id: 'anti-phishing',
    title: 'Anti-Phishing Words',
    icon: Fingerprint,
    color: 'var(--info)',
    description: 'After entering the first part of your PIN, two secret words appear. Only your genuine Coldcard knows these words.',
    details: [
      'Unique word pair for each device and PIN prefix',
      'Protects against fake/cloned devices',
      'Memorize your words and verify every time'
    ]
  },
  {
    id: 'clear-case',
    title: 'Transparent Design',
    icon: Eye,
    color: 'var(--warning)',
    description: 'The clear plastic case lets you visually inspect the circuit board for any hardware tampering or implants.',
    details: [
      'No hidden compartments or covered areas',
      'PCB design publicly documented',
      'Easy to spot any additions or modifications'
    ]
  },
  {
    id: 'no-reset',
    title: 'No Factory Reset',
    icon: Lock,
    color: 'var(--error)',
    description: 'If you forget your PIN, the device cannot be reset. This prevents attackers from bypassing security with a simple reset.',
    details: [
      'PIN attempts are limited and delayed',
      'No backdoor for "recovery"',
      'Your backup seed phrase is your only recovery option'
    ]
  }
];

function SecurityDiagram() {
  return (
    <svg viewBox="0 0 400 300" className={styles.diagram}>
      {/* Background layers */}
      <defs>
        <linearGradient id="layer1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--success)" stopOpacity="0.1" />
          <stop offset="100%" stopColor="var(--success)" stopOpacity="0.05" />
        </linearGradient>
        <linearGradient id="layer2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--info)" stopOpacity="0.1" />
          <stop offset="100%" stopColor="var(--info)" stopOpacity="0.05" />
        </linearGradient>
        <linearGradient id="layer3" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--warning)" stopOpacity="0.1" />
          <stop offset="100%" stopColor="var(--warning)" stopOpacity="0.05" />
        </linearGradient>
      </defs>
      
      {/* Outer layer - Physical */}
      <rect x="20" y="20" width="360" height="260" rx="20" fill="url(#layer3)" stroke="var(--warning)" strokeWidth="2" strokeDasharray="5,5" />
      <text x="40" y="45" fill="var(--warning)" fontSize="12" fontWeight="600">Physical Security</text>
      
      {/* Middle layer - Software */}
      <rect x="50" y="60" width="300" height="200" rx="16" fill="url(#layer2)" stroke="var(--info)" strokeWidth="2" strokeDasharray="5,5" />
      <text x="70" y="85" fill="var(--info)" fontSize="12" fontWeight="600">Firmware Verification</text>
      
      {/* Inner layer - Hardware */}
      <rect x="80" y="100" width="240" height="140" rx="12" fill="url(#layer1)" stroke="var(--success)" strokeWidth="2" />
      <text x="100" y="125" fill="var(--success)" fontSize="12" fontWeight="600">Secure Elements</text>
      
      {/* Seed phrase in center */}
      <rect x="130" y="150" width="140" height="60" rx="8" fill="var(--bg-tertiary)" stroke="var(--bitcoin-orange)" strokeWidth="2" />
      <text x="200" y="175" textAnchor="middle" fill="var(--bitcoin-orange)" fontSize="11" fontWeight="600">Your Seed Phrase</text>
      <text x="200" y="195" textAnchor="middle" fill="var(--text-muted)" fontSize="9">24 words</text>
      
      {/* Security chips */}
      <g transform="translate(110, 160)">
        <rect width="30" height="20" rx="3" fill="var(--bg-elevated)" stroke="var(--success)" />
        <text x="15" y="13" textAnchor="middle" fill="var(--text-muted)" fontSize="6">SE1</text>
      </g>
      <g transform="translate(260, 160)">
        <rect width="30" height="20" rx="3" fill="var(--bg-elevated)" stroke="var(--success)" />
        <text x="15" y="13" textAnchor="middle" fill="var(--text-muted)" fontSize="6">SE2</text>
      </g>
      
      {/* Arrows showing protection */}
      <path d="M125 170 L130 180" stroke="var(--success)" strokeWidth="1.5" fill="none" markerEnd="url(#arrowhead)" />
      <path d="M275 170 L270 180" stroke="var(--success)" strokeWidth="1.5" fill="none" markerEnd="url(#arrowhead)" />
      
      {/* Legend */}
      <g transform="translate(280, 240)">
        <rect width="8" height="8" fill="var(--success)" opacity="0.3" />
        <text x="12" y="8" fill="var(--text-muted)" fontSize="8">Hardware</text>
      </g>
      <g transform="translate(280, 252)">
        <rect width="8" height="8" fill="var(--info)" opacity="0.3" />
        <text x="12" y="8" fill="var(--text-muted)" fontSize="8">Software</text>
      </g>
      <g transform="translate(280, 264)">
        <rect width="8" height="8" fill="var(--warning)" opacity="0.3" />
        <text x="12" y="8" fill="var(--text-muted)" fontSize="8">Physical</text>
      </g>
    </svg>
  );
}

export function SecurityLayers() {
  return (
    <div className={styles.container}>
      {/* Visual diagram */}
      <Card variant="elevated" padding="large">
        <h4 className={styles.diagramTitle}>Defense in Depth</h4>
        <p className={styles.diagramDescription}>
          Multiple layers of security protect your Bitcoin. An attacker would need to breach 
          all layers simultaneously to access your keys.
        </p>
        <div className={styles.diagramContainer}>
          <SecurityDiagram />
        </div>
      </Card>
      
      {/* Security features list */}
      <div className={styles.layersList}>
        {securityLayers.map((layer, index) => {
          const Icon = layer.icon;
          
          return (
            <motion.div
              key={layer.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card padding="medium" className={styles.layerCard}>
                <div className={styles.layerHeader}>
                  <div 
                    className={styles.layerIcon}
                    style={{ background: `${layer.color}20`, color: layer.color }}
                  >
                    <Icon size={20} />
                  </div>
                  <h4 className={styles.layerTitle}>{layer.title}</h4>
                </div>
                <p className={styles.layerDescription}>{layer.description}</p>
                <ul className={styles.layerDetails}>
                  {layer.details.map((detail, i) => (
                    <li key={i}>
                      <CheckCircle size={12} />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </motion.div>
          );
        })}
      </div>
      
      {/* PIN explanation */}
      <Accordion
        title="How the Split PIN Works"
        variant="deepdive"
        icon={<Lock size={16} />}
      >
        <div className={styles.pinExplanation}>
          <p>
            The Coldcard PIN is split into two parts (e.g., <strong>1234-5678</strong>). 
            This isn't just for convenience - it's a critical security feature.
          </p>
          
          <div className={styles.pinSteps}>
            <div className={styles.pinStep}>
              <div className={styles.stepNumber}>1</div>
              <div className={styles.stepContent}>
                <h5>Enter First Part</h5>
                <p>Type the first part of your PIN (e.g., "1234")</p>
              </div>
            </div>
            
            <div className={styles.pinStep}>
              <div className={styles.stepNumber}>2</div>
              <div className={styles.stepContent}>
                <h5>Verify Anti-Phishing Words</h5>
                <p>Two unique words appear (e.g., "BRAVE TIGER"). These words are known only to your specific Coldcard.</p>
              </div>
            </div>
            
            <div className={styles.pinStep}>
              <div className={styles.stepNumber}>3</div>
              <div className={styles.stepContent}>
                <h5>Enter Second Part</h5>
                <p>If the words match what you memorized, enter the second part (e.g., "5678")</p>
              </div>
            </div>
          </div>
          
          <div className={styles.pinWarning}>
            <AlertTriangle size={16} />
            <p>
              <strong>Important:</strong> If the words are different, STOP! Your device may have been 
              replaced with a fake one designed to steal your PIN.
            </p>
          </div>
        </div>
      </Accordion>
    </div>
  );
}

export default SecurityLayers;
