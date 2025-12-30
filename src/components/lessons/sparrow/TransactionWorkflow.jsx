import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Monitor, 
  QrCode, 
  HardDrive, 
  FileKey,
  Send,
  ArrowRight,
  CheckCircle,
  Wallet,
  Eye,
  Radio,
  Shield
} from 'lucide-react';
import { Card } from '../../common';
import styles from './TransactionWorkflow.module.css';

const methods = [
  {
    id: 'connected',
    title: 'Connected Hardware Wallet',
    icon: HardDrive,
    description: 'Sign directly via USB connection',
    steps: [
      { id: 'select-utxos', label: 'Select UTXOs', description: 'Choose which coins to spend in the UTXOs tab', icon: Wallet },
      { id: 'create-tx', label: 'Create Transaction', description: 'Click Send, enter recipient address and amount', icon: Monitor },
      { id: 'set-fee', label: 'Set Fee Rate', description: 'Choose fee priority or enter custom sat/vB rate', icon: FileKey },
      { id: 'create-psbt', label: 'Create PSBT', description: 'Click "Create Transaction" to build the PSBT', icon: FileKey },
      { id: 'sign', label: 'Sign on Device', description: 'Click "Sign" - verify details on your hardware wallet', icon: Shield },
      { id: 'broadcast', label: 'Broadcast', description: 'Click "Broadcast Transaction" to send to the network', icon: Send }
    ]
  },
  {
    id: 'airgapped-qr',
    title: 'Air-Gapped via QR',
    icon: QrCode,
    description: 'Scan QR codes - no cables needed',
    steps: [
      { id: 'select-utxos', label: 'Select UTXOs', description: 'Choose which coins to spend in the UTXOs tab', icon: Wallet },
      { id: 'create-tx', label: 'Create Transaction', description: 'Click Send, enter recipient address and amount', icon: Monitor },
      { id: 'set-fee', label: 'Set Fee Rate', description: 'Choose fee priority or enter custom sat/vB rate', icon: FileKey },
      { id: 'show-qr', label: 'Show QR Code', description: 'Click "Show QR" to display animated QR codes', icon: QrCode },
      { id: 'scan-device', label: 'Scan with Device', description: 'Use your hardware wallet to scan the QR codes', icon: Shield },
      { id: 'sign-device', label: 'Sign on Device', description: 'Verify transaction details and confirm on device', icon: CheckCircle },
      { id: 'scan-back', label: 'Scan Signed QR', description: 'Device displays signed QR - scan it back into Sparrow', icon: QrCode },
      { id: 'broadcast', label: 'Broadcast', description: 'Click "Broadcast Transaction" to send to the network', icon: Send }
    ]
  },
  {
    id: 'airgapped-file',
    title: 'Air-Gapped via File',
    icon: FileKey,
    description: 'Transfer PSBT files via SD card',
    steps: [
      { id: 'select-utxos', label: 'Select UTXOs', description: 'Choose which coins to spend in the UTXOs tab', icon: Wallet },
      { id: 'create-tx', label: 'Create Transaction', description: 'Click Send, enter recipient address and amount', icon: Monitor },
      { id: 'set-fee', label: 'Set Fee Rate', description: 'Choose fee priority or enter custom sat/vB rate', icon: FileKey },
      { id: 'save-psbt', label: 'Save PSBT', description: 'Click "Save Transaction" to export .psbt file to SD card', icon: HardDrive },
      { id: 'move-to-device', label: 'Transfer to Device', description: 'Insert SD card into your hardware wallet', icon: Shield },
      { id: 'sign-device', label: 'Sign on Device', description: 'Load PSBT, verify details, and sign on device', icon: CheckCircle },
      { id: 'move-back', label: 'Transfer Back', description: 'Move SD card with signed PSBT back to computer', icon: HardDrive },
      { id: 'load-signed', label: 'Load Signed PSBT', description: 'File > Load Transaction to import signed PSBT', icon: Monitor },
      { id: 'broadcast', label: 'Broadcast', description: 'Click "Broadcast Transaction" to send to the network', icon: Send }
    ]
  },
  {
    id: 'watch-only',
    title: 'Watch-Only Export',
    icon: Eye,
    description: 'Create PSBT for external signing',
    steps: [
      { id: 'select-utxos', label: 'Select UTXOs', description: 'Choose which coins to spend in the UTXOs tab', icon: Wallet },
      { id: 'create-tx', label: 'Create Transaction', description: 'Click Send, enter recipient address and amount', icon: Monitor },
      { id: 'set-fee', label: 'Set Fee Rate', description: 'Choose fee priority or enter custom sat/vB rate', icon: FileKey },
      { id: 'export-psbt', label: 'Export PSBT', description: 'Save or show QR for signing on separate device/software', icon: FileKey },
      { id: 'sign-external', label: 'Sign Externally', description: 'Use any PSBT-compatible signer (Coldcard, mobile app, etc.)', icon: Shield },
      { id: 'import-signed', label: 'Import Signed', description: 'Load the signed PSBT back into Sparrow', icon: Monitor },
      { id: 'broadcast', label: 'Broadcast', description: 'Click "Broadcast Transaction" to send to the network', icon: Send }
    ]
  }
];

function WorkflowDiagram({ method, currentStep }) {
  const isQR = method === 'airgapped-qr';
  const isFile = method === 'airgapped-file';
  const isConnected = method === 'connected';
  
  const createPhase = currentStep <= 3;
  const signPhase = currentStep > 3 && currentStep < (isFile ? 8 : isQR ? 7 : 5);
  const broadcastPhase = currentStep >= (isFile ? 8 : isQR ? 7 : 5);
  
  return (
    <svg viewBox="0 0 600 180" className={styles.workflowSvg}>
      {/* Sparrow Wallet - Create */}
      <g transform="translate(30, 50)">
        <motion.rect 
          x="0" y="0" width="120" height="80" rx="10" 
          fill="var(--bg-tertiary)" 
          stroke={createPhase ? 'var(--bitcoin-orange)' : 'var(--border-medium)'} 
          strokeWidth="2" 
        />
        <rect x="15" y="15" width="90" height="45" rx="4" fill="var(--bg-elevated)" />
        <Monitor x="45" y="22" size={30} className={styles.diagramIcon} />
        <text x="60" y="105" textAnchor="middle" fill="var(--text-secondary)" fontSize="10">Sparrow Wallet</text>
        <text x="60" y="118" textAnchor="middle" fill="var(--text-muted)" fontSize="8">Create TX</text>
        
        {createPhase && (
          <motion.circle
            cx="110" cy="10" r="6"
            fill="var(--bitcoin-orange)"
            initial={{ scale: 0 }}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        )}
      </g>
      
      {/* Arrow to signer */}
      <motion.g
        initial={{ opacity: 0.3 }}
        animate={{ opacity: currentStep >= 3 ? 1 : 0.3 }}
      >
        <path d="M160 90 L220 90" stroke="var(--bitcoin-orange)" strokeWidth="2" strokeDasharray="5,5" fill="none" />
        <polygon points="220,90 210,85 210,95" fill="var(--bitcoin-orange)" />
        
        {/* Transfer medium indicator */}
        <g transform="translate(175, 70)">
          {isQR && (
            <>
              <rect width="30" height="30" rx="4" fill="var(--bg-tertiary)" stroke="var(--bitcoin-orange)" strokeWidth="1" />
              <rect x="5" y="5" width="6" height="6" fill="var(--bitcoin-orange)" />
              <rect x="13" y="5" width="6" height="6" fill="var(--bitcoin-orange)" />
              <rect x="5" y="13" width="6" height="6" fill="var(--bitcoin-orange)" />
              <rect x="19" y="13" width="6" height="6" fill="var(--bitcoin-orange)" />
            </>
          )}
          {isFile && (
            <>
              <rect width="35" height="25" rx="3" fill="var(--bg-tertiary)" stroke="var(--bitcoin-orange)" strokeWidth="1" />
              <text x="17" y="16" textAnchor="middle" fill="var(--bitcoin-orange)" fontSize="7">PSBT</text>
            </>
          )}
          {isConnected && (
            <>
              <rect width="35" height="10" rx="2" fill="var(--bg-tertiary)" stroke="var(--bitcoin-orange)" strokeWidth="1" />
              <text x="17" y="8" textAnchor="middle" fill="var(--bitcoin-orange)" fontSize="6">USB</text>
            </>
          )}
        </g>
        <text x="190" y="115" textAnchor="middle" fill="var(--text-muted)" fontSize="8">
          {isQR ? 'QR Code' : isFile ? 'SD Card' : 'USB'}
        </text>
      </motion.g>
      
      {/* Hardware Wallet / Signer */}
      <g transform="translate(230, 40)">
        <motion.rect 
          x="0" y="0" width="140" height="100" rx="12" 
          fill="var(--bg-tertiary)" 
          stroke={signPhase ? 'var(--success)' : 'var(--border-medium)'} 
          strokeWidth="2" 
        />
        <rect x="20" y="15" width="100" height="45" rx="6" fill="var(--bg-elevated)" />
        <text x="70" y="42" textAnchor="middle" fill="var(--success)" fontSize="9">VERIFY TX</text>
        
        <Shield x="50" y="65" size={20} className={styles.signerIcon} />
        <CheckCircle x="75" y="65" size={20} className={styles.signerIcon} />
        
        <text x="70" y="120" textAnchor="middle" fill="var(--text-secondary)" fontSize="10">Hardware Wallet</text>
        <text x="70" y="133" textAnchor="middle" fill="var(--text-muted)" fontSize="8">Verify & Sign</text>
        
        {signPhase && (
          <motion.circle
            cx="130" cy="10" r="6"
            fill="var(--success)"
            initial={{ scale: 0 }}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        )}
      </g>
      
      {/* Arrow back / to broadcast */}
      <motion.g
        initial={{ opacity: 0.3 }}
        animate={{ opacity: signPhase || broadcastPhase ? 1 : 0.3 }}
      >
        <path d="M380 90 L440 90" stroke="var(--success)" strokeWidth="2" strokeDasharray="5,5" fill="none" />
        <polygon points="440,90 430,85 430,95" fill="var(--success)" />
        
        <g transform="translate(395, 70)">
          {(isQR || isFile) && (
            <>
              <rect width="30" height="20" rx="3" fill="var(--bg-tertiary)" stroke="var(--success)" strokeWidth="1" />
              <CheckCircle x="8" y="3" size={14} className={styles.signedIcon} />
            </>
          )}
        </g>
        <text x="410" y="115" textAnchor="middle" fill="var(--text-muted)" fontSize="8">Signed</text>
      </motion.g>
      
      {/* Broadcast */}
      <g transform="translate(450, 50)">
        <motion.rect 
          x="0" y="0" width="120" height="80" rx="10" 
          fill="var(--bg-tertiary)" 
          stroke={broadcastPhase ? 'var(--info)' : 'var(--border-medium)'} 
          strokeWidth="2" 
        />
        <rect x="15" y="15" width="90" height="45" rx="4" fill="var(--bg-elevated)" />
        <Send x="45" y="22" size={30} className={styles.broadcastIcon} />
        <text x="60" y="105" textAnchor="middle" fill="var(--text-secondary)" fontSize="10">Broadcast</text>
        <text x="60" y="118" textAnchor="middle" fill="var(--text-muted)" fontSize="8">to Network</text>
        
        {broadcastPhase && (
          <motion.circle
            cx="110" cy="10" r="6"
            fill="var(--info)"
            initial={{ scale: 0 }}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        )}
      </g>
      
      {/* Network */}
      <motion.g
        transform="translate(585, 75)"
        initial={{ opacity: 0.3 }}
        animate={{ opacity: broadcastPhase ? 1 : 0.3 }}
      >
        <circle r="20" fill="var(--bitcoin-orange-subtle)" stroke="var(--bitcoin-orange)" strokeWidth="2" />
        <text y="5" textAnchor="middle" fill="var(--bitcoin-orange)" fontSize="16" fontWeight="bold">₿</text>
      </motion.g>
    </svg>
  );
}

export function TransactionWorkflow() {
  const [selectedMethod, setSelectedMethod] = useState('connected');
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
          <h4>PSBT Best Practices</h4>
          <ul>
            <li>
              <CheckCircle size={14} />
              <span><strong>Always verify on device</strong> - Check address and amount on your hardware wallet screen</span>
            </li>
            <li>
              <CheckCircle size={14} />
              <span><strong>Double-check addresses</strong> - Malware can swap clipboard addresses; verify the first and last characters</span>
            </li>
            <li>
              <CheckCircle size={14} />
              <span><strong>Understand fees</strong> - Higher fees = faster confirmation; check mempool conditions</span>
            </li>
            <li>
              <CheckCircle size={14} />
              <span><strong>Label transactions</strong> - Add notes to remember what each transaction was for</span>
            </li>
          </ul>
        </Card>
      </div>
      
      {/* PSBT explanation */}
      <Card variant="elevated" padding="large">
        <h4 className={styles.psbtTitle}>What is a PSBT?</h4>
        <p className={styles.psbtDescription}>
          A <strong>Partially Signed Bitcoin Transaction</strong> (BIP-174) is a standardized format 
          for passing unsigned or partially-signed transactions between wallets and signers.
        </p>
        <div className={styles.psbtFeatures}>
          <div className={styles.psbtFeature}>
            <div className={styles.psbtFeatureIcon}>
              <FileKey size={20} />
            </div>
            <div>
              <strong>Portable</strong>
              <span>Transfer via file, QR code, or any medium</span>
            </div>
          </div>
          <div className={styles.psbtFeature}>
            <div className={styles.psbtFeatureIcon}>
              <Shield size={20} />
            </div>
            <div>
              <strong>Safe</strong>
              <span>Contains no private keys - safe to share</span>
            </div>
          </div>
          <div className={styles.psbtFeature}>
            <div className={styles.psbtFeatureIcon}>
              <Radio size={20} />
            </div>
            <div>
              <strong>Universal</strong>
              <span>Works with any PSBT-compatible wallet</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default TransactionWorkflow;
