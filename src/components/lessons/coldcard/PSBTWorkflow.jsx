import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Monitor, 
  QrCode, 
  HardDrive, 
  ShieldCheck, 
  Send,
  ArrowRight,
  CheckCircle,
  FileKey,
  Radio
} from 'lucide-react';
import { Card } from '../../common';
import styles from './PSBTWorkflow.module.css';

const methods = [
  {
    id: 'qr',
    title: 'QR Code',
    icon: QrCode,
    description: 'Scan QR codes - completely wireless',
    steps: [
      { id: 'create', label: 'Create Transaction', description: 'Build the transaction in your wallet software', icon: Monitor },
      { id: 'display-qr', label: 'Display QR Code', description: 'Wallet shows PSBT as animated QR codes', icon: QrCode },
      { id: 'scan', label: 'Scan with Coldcard', description: 'Use the QR scanner to import the transaction', icon: ShieldCheck },
      { id: 'verify', label: 'Verify & Sign', description: 'Review details on Coldcard screen, then sign', icon: CheckCircle },
      { id: 'display-signed', label: 'Display Signed QR', description: 'Coldcard shows the signed transaction as QR', icon: QrCode },
      { id: 'scan-back', label: 'Scan into Wallet', description: 'Wallet scans the signed transaction', icon: Monitor },
      { id: 'broadcast', label: 'Broadcast', description: 'Wallet broadcasts to the Bitcoin network', icon: Send }
    ]
  },
  {
    id: 'sd',
    title: 'MicroSD Card',
    icon: HardDrive,
    description: 'Transfer via SD card - works anywhere',
    steps: [
      { id: 'create', label: 'Create Transaction', description: 'Build the transaction in your wallet software', icon: Monitor },
      { id: 'save-psbt', label: 'Save PSBT to SD', description: 'Export the unsigned PSBT file to SD card', icon: FileKey },
      { id: 'insert', label: 'Insert into Coldcard', description: 'Move the SD card to your Coldcard', icon: ShieldCheck },
      { id: 'verify', label: 'Verify & Sign', description: 'Review details on Coldcard screen, then sign', icon: CheckCircle },
      { id: 'save-signed', label: 'Save Signed PSBT', description: 'Coldcard saves the signed file to SD card', icon: FileKey },
      { id: 'move-back', label: 'Move SD to Computer', description: 'Transfer the SD card back to your computer', icon: Monitor },
      { id: 'broadcast', label: 'Broadcast', description: 'Wallet broadcasts to the Bitcoin network', icon: Send }
    ]
  }
];

function WorkflowDiagram({ method, currentStep }) {
  const isQR = method === 'qr';
  
  return (
    <svg viewBox="0 0 600 200" className={styles.workflowSvg}>
      {/* Computer/Wallet */}
      <g transform="translate(50, 60)">
        <rect x="0" y="0" width="100" height="70" rx="8" fill="var(--bg-tertiary)" stroke="var(--border-medium)" strokeWidth="2" />
        <rect x="10" y="10" width="80" height="45" rx="4" fill="var(--bg-elevated)" />
        <rect x="35" y="65" width="30" height="5" rx="2" fill="var(--border-medium)" />
        <Monitor x="35" y="20" size={30} className={styles.diagramIcon} />
        <text x="50" y="95" textAnchor="middle" fill="var(--text-secondary)" fontSize="10">Wallet Software</text>
      </g>
      
      {/* Arrow 1: Wallet to medium */}
      <motion.g
        initial={{ opacity: 0.3 }}
        animate={{ opacity: currentStep >= 1 && currentStep <= 2 ? 1 : 0.3 }}
      >
        <path d="M160 95 L220 95" stroke="var(--bitcoin-orange)" strokeWidth="2" strokeDasharray="5,5" fill="none" />
        <polygon points="220,95 210,90 210,100" fill="var(--bitcoin-orange)" />
        {isQR ? (
          <g transform="translate(175, 75)">
            <rect width="30" height="30" rx="4" fill="var(--bg-tertiary)" stroke="var(--bitcoin-orange)" strokeWidth="1" />
            <rect x="5" y="5" width="6" height="6" fill="var(--bitcoin-orange)" />
            <rect x="13" y="5" width="6" height="6" fill="var(--bitcoin-orange)" />
            <rect x="5" y="13" width="6" height="6" fill="var(--bitcoin-orange)" />
            <rect x="13" y="13" width="3" height="3" fill="var(--bitcoin-orange)" />
            <rect x="19" y="13" width="6" height="6" fill="var(--bitcoin-orange)" />
            <rect x="19" y="5" width="3" height="3" fill="var(--bitcoin-orange)" />
          </g>
        ) : (
          <g transform="translate(175, 80)">
            <rect width="35" height="25" rx="3" fill="var(--bg-tertiary)" stroke="var(--bitcoin-orange)" strokeWidth="1" />
            <rect x="5" y="8" width="15" height="10" rx="1" fill="var(--bitcoin-orange)" opacity="0.3" />
            <text x="17" y="18" textAnchor="middle" fill="var(--bitcoin-orange)" fontSize="6">SD</text>
          </g>
        )}
        <text x="190" y="125" textAnchor="middle" fill="var(--text-muted)" fontSize="8">
          {isQR ? 'Unsigned PSBT' : 'PSBT File'}
        </text>
      </motion.g>
      
      {/* Coldcard */}
      <g transform="translate(250, 40)">
        <rect x="0" y="0" width="100" height="130" rx="10" fill="var(--bg-tertiary)" stroke="var(--border-medium)" strokeWidth="2" />
        <rect x="15" y="15" width="70" height="40" rx="4" fill="var(--bg-elevated)" />
        <text x="50" y="40" textAnchor="middle" fill="var(--success)" fontSize="8">VERIFIED</text>
        <rect x="20" y="65" width="60" height="50" rx="4" fill="var(--bg-secondary)" />
        {/* Mini keyboard representation */}
        <g transform="translate(25, 70)">
          {[0,1,2,3,4].map(i => (
            <rect key={i} x={i * 10} y="0" width="8" height="6" rx="1" fill="var(--bg-elevated)" />
          ))}
          {[0,1,2,3,4].map(i => (
            <rect key={i} x={i * 10} y="8" width="8" height="6" rx="1" fill="var(--bg-elevated)" />
          ))}
          {[0,1,2,3,4].map(i => (
            <rect key={i} x={i * 10} y="16" width="8" height="6" rx="1" fill="var(--bg-elevated)" />
          ))}
        </g>
        <text x="50" y="145" textAnchor="middle" fill="var(--text-secondary)" fontSize="10">Coldcard Q</text>
        
        {/* Signing indicator */}
        <motion.circle
          cx="85"
          cy="25"
          r="5"
          fill="var(--success)"
          initial={{ opacity: 0 }}
          animate={{ opacity: currentStep >= 3 && currentStep <= 4 ? [0.3, 1, 0.3] : 0 }}
          transition={{ duration: 1, repeat: Infinity }}
        />
      </g>
      
      {/* Arrow 2: medium back to wallet */}
      <motion.g
        initial={{ opacity: 0.3 }}
        animate={{ opacity: currentStep >= 4 && currentStep <= 5 ? 1 : 0.3 }}
      >
        <path d="M360 95 L420 95" stroke="var(--success)" strokeWidth="2" strokeDasharray="5,5" fill="none" />
        <polygon points="420,95 410,90 410,100" fill="var(--success)" />
        {isQR ? (
          <g transform="translate(375, 75)">
            <rect width="30" height="30" rx="4" fill="var(--bg-tertiary)" stroke="var(--success)" strokeWidth="1" />
            <rect x="5" y="5" width="6" height="6" fill="var(--success)" />
            <rect x="13" y="5" width="6" height="6" fill="var(--success)" />
            <rect x="5" y="13" width="6" height="6" fill="var(--success)" />
            <rect x="13" y="13" width="3" height="3" fill="var(--success)" />
            <rect x="19" y="13" width="6" height="6" fill="var(--success)" />
            <rect x="19" y="5" width="3" height="3" fill="var(--success)" />
          </g>
        ) : (
          <g transform="translate(375, 80)">
            <rect width="35" height="25" rx="3" fill="var(--bg-tertiary)" stroke="var(--success)" strokeWidth="1" />
            <rect x="5" y="8" width="15" height="10" rx="1" fill="var(--success)" opacity="0.3" />
            <text x="17" y="18" textAnchor="middle" fill="var(--success)" fontSize="6">SD</text>
          </g>
        )}
        <text x="390" y="125" textAnchor="middle" fill="var(--text-muted)" fontSize="8">Signed PSBT</text>
      </motion.g>
      
      {/* Computer/Wallet (broadcast) */}
      <g transform="translate(450, 60)">
        <rect x="0" y="0" width="100" height="70" rx="8" fill="var(--bg-tertiary)" stroke="var(--border-medium)" strokeWidth="2" />
        <rect x="10" y="10" width="80" height="45" rx="4" fill="var(--bg-elevated)" />
        <rect x="35" y="65" width="30" height="5" rx="2" fill="var(--border-medium)" />
        <Send x="35" y="20" size={30} className={styles.diagramIcon} />
        <text x="50" y="95" textAnchor="middle" fill="var(--text-secondary)" fontSize="10">Broadcast</text>
      </g>
      
      {/* Bitcoin Network */}
      <motion.g
        transform="translate(560, 75)"
        initial={{ opacity: 0.3 }}
        animate={{ opacity: currentStep >= 6 ? 1 : 0.3 }}
      >
        <circle r="25" fill="var(--bitcoin-orange-subtle)" stroke="var(--bitcoin-orange)" strokeWidth="2" />
        <text y="5" textAnchor="middle" fill="var(--bitcoin-orange)" fontSize="14" fontWeight="bold">₿</text>
      </motion.g>
      
      <motion.path
        d="M550 95 L535 95"
        stroke="var(--bitcoin-orange)"
        strokeWidth="2"
        initial={{ opacity: 0.3 }}
        animate={{ opacity: currentStep >= 6 ? 1 : 0.3 }}
      />
    </svg>
  );
}

export function PSBTWorkflow() {
  const [selectedMethod, setSelectedMethod] = useState('qr');
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const method = methods.find(m => m.id === selectedMethod);
  
  // Auto-advance animation
  useEffect(() => {
    if (isPlaying) {
      const timer = setInterval(() => {
        setCurrentStep(prev => {
          if (prev >= method.steps.length - 1) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 2000);
      
      return () => clearInterval(timer);
    }
  }, [isPlaying, method.steps.length]);
  
  // Reset step when method changes
  useEffect(() => {
    setCurrentStep(0);
    setIsPlaying(false);
  }, [selectedMethod]);

  return (
    <div className={styles.container}>
      {/* Method selector */}
      <div className={styles.methodSelector}>
        {methods.map(m => {
          const Icon = m.icon;
          return (
            <button
              key={m.id}
              className={`${styles.methodButton} ${selectedMethod === m.id ? styles.active : ''}`}
              onClick={() => setSelectedMethod(m.id)}
            >
              <Icon size={20} />
              <div className={styles.methodInfo}>
                <span className={styles.methodTitle}>{m.title}</span>
                <span className={styles.methodDescription}>{m.description}</span>
              </div>
            </button>
          );
        })}
      </div>
      
      {/* Workflow diagram */}
      <Card variant="elevated" padding="large">
        <div className={styles.diagramHeader}>
          <h4>Transaction Signing Flow</h4>
          <button 
            className={styles.playButton}
            onClick={() => {
              if (isPlaying) {
                setIsPlaying(false);
              } else {
                setCurrentStep(0);
                setIsPlaying(true);
              }
            }}
          >
            {isPlaying ? 'Pause' : 'Play Animation'}
          </button>
        </div>
        
        <div className={styles.diagramContainer}>
          <WorkflowDiagram method={selectedMethod} currentStep={currentStep} />
        </div>
        
        {/* Steps */}
        <div className={styles.stepsContainer}>
          {method.steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = index === currentStep;
            const isComplete = index < currentStep;
            
            return (
              <motion.div
                key={step.id}
                className={`${styles.step} ${isActive ? styles.active : ''} ${isComplete ? styles.complete : ''}`}
                onClick={() => {
                  setCurrentStep(index);
                  setIsPlaying(false);
                }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className={styles.stepIndicator}>
                  {isComplete ? (
                    <CheckCircle size={16} />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
                <div className={styles.stepContent}>
                  <div className={styles.stepHeader}>
                    <Icon size={14} />
                    <span className={styles.stepLabel}>{step.label}</span>
                  </div>
                  {isActive && (
                    <motion.p
                      className={styles.stepDescription}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                    >
                      {step.description}
                    </motion.p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </Card>
      
      {/* Key points */}
      <div className={styles.keyPoints}>
        <Card padding="medium">
          <h4>Why Air-Gapped Signing Matters</h4>
          <ul>
            <li>
              <CheckCircle size={14} />
              <span><strong>Keys never leave the device</strong> - Your private keys stay on the Coldcard at all times</span>
            </li>
            <li>
              <CheckCircle size={14} />
              <span><strong>No USB connection needed</strong> - Eliminates malware attack vectors through USB</span>
            </li>
            <li>
              <CheckCircle size={14} />
              <span><strong>Verify before signing</strong> - Always review the transaction details on the Coldcard screen</span>
            </li>
            <li>
              <CheckCircle size={14} />
              <span><strong>Works with any wallet</strong> - PSBTs are a standard format supported by most Bitcoin wallets</span>
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
}

export default PSBTWorkflow;
