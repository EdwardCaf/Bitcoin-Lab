import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Pencil, 
  Lock, 
  Unlock,
  Sparkles,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  RotateCcw,
  Info
} from 'lucide-react';
import { Card, Button, Badge, Accordion } from '../../common';
import styles from './BlindSignatureDemo.module.css';

const STEPS = [
  { 
    id: 'message', 
    title: 'User Creates Message',
    description: 'Alice wants the mint to sign a token worth 100 sats',
    icon: Mail
  },
  { 
    id: 'blind', 
    title: 'Blind the Message',
    description: 'Alice blinds the message so the mint cannot see it',
    icon: EyeOff
  },
  { 
    id: 'sign', 
    title: 'Mint Signs Blindly',
    description: 'The mint signs without knowing the message content',
    icon: Pencil
  },
  { 
    id: 'unblind', 
    title: 'Unblind the Signature',
    description: 'Alice removes the blinding to get the final signed token',
    icon: Eye
  },
  { 
    id: 'verify', 
    title: 'Verify & Spend',
    description: 'Anyone can verify the signature, but cannot link it to Alice',
    icon: CheckCircle
  }
];

const MESSAGES = [
  { value: 100, hash: 'a7f8d3e2c1b9' },
  { value: 50, hash: 'f2c9b8a3e7d1' },
  { value: 25, hash: 'e1d8c7b2a9f3' },
];

export function BlindSignatureDemo() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentMessage, setCurrentMessage] = useState(0);
  const [blindingFactor, setBlindingFactor] = useState('r7x9k2m5');
  const [signature, setSignature] = useState(null);
  const [unblindedSig, setUnblindedSig] = useState(null);
  const [showMintView, setShowMintView] = useState(false);

  const message = MESSAGES[currentMessage];

  const nextStep = async () => {
    if (isAnimating || currentStep >= STEPS.length - 1) return;
    
    setIsAnimating(true);
    setCurrentStep(prev => prev + 1);
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (currentStep === 2) {
      setSignature(`SIG_${Math.random().toString(36).substr(2, 8)}`);
    }
    if (currentStep === 3) {
      setUnblindedSig(`VALID_${Math.random().toString(36).substr(2, 8)}`);
    }
    
    setIsAnimating(false);
  };

  const prevStep = () => {
    if (isAnimating || currentStep <= 0) return;
    setCurrentStep(prev => prev - 1);
  };

  const reset = () => {
    setCurrentStep(0);
    setSignature(null);
    setUnblindedSig(null);
    setShowMintView(false);
    setCurrentMessage((prev) => (prev + 1) % MESSAGES.length);
    setBlindingFactor(Math.random().toString(36).substr(2, 8));
  };

  const getBlindedMessage = () => {
    return `BLIND_${message.hash}_${blindingFactor}`;
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return <MessageStep message={message} />;
      case 1:
        return <BlindStep message={message} blindingFactor={blindingFactor} />;
      case 2:
        return <SignStep 
          blindedMessage={getBlindedMessage()} 
          signature={signature}
          showMintView={showMintView}
          setShowMintView={setShowMintView}
        />;
      case 3:
        return <UnblindStep 
          signature={signature}
          blindingFactor={blindingFactor}
          unblindedSig={unblindedSig}
        />;
      case 4:
        return <VerifyStep 
          message={message}
          unblindedSig={unblindedSig}
          showMintView={showMintView}
          setShowMintView={setShowMintView}
        />;
      default:
        return null;
    }
  };

  return (
    <div className={styles.container}>
      <Card variant="elevated" padding="large">
        <div className={styles.header}>
          <div className={styles.titleSection}>
            <div className={styles.iconWrapper}>
              <Sparkles size={24} />
            </div>
            <div>
              <h3 className={styles.title}>Blind Signature Protocol</h3>
              <p className={styles.subtitle}>
                See how Chaumian blind signatures enable perfect privacy
              </p>
            </div>
          </div>
        </div>

        {/* Progress Tracker */}
        <div className={styles.progressBar}>
          {STEPS.map((step, index) => {
            const Icon = step.icon;
            const isActive = index === currentStep;
            const isComplete = index < currentStep;
            
            return (
              <div key={step.id} className={styles.progressItem}>
                <div className={styles.progressStep}>
                  <motion.div
                    className={`${styles.stepCircle} ${
                      isActive ? styles.active : ''
                    } ${isComplete ? styles.complete : ''}`}
                    animate={isActive && isAnimating ? {
                      scale: [1, 1.1, 1],
                      boxShadow: [
                        '0 0 0 0 rgba(59, 130, 246, 0)',
                        '0 0 0 10px rgba(59, 130, 246, 0.1)',
                        '0 0 0 0 rgba(59, 130, 246, 0)'
                      ]
                    } : {}}
                    transition={{ duration: 1, repeat: isActive && isAnimating ? Infinity : 0 }}
                  >
                    <Icon size={16} />
                  </motion.div>
                  <span className={styles.stepLabel}>{step.title}</span>
                </div>
                {index < STEPS.length - 1 && (
                  <div className={styles.progressLine}>
                    <motion.div
                      className={styles.progressLineFill}
                      initial={{ width: 0 }}
                      animate={{ width: isComplete ? '100%' : '0%' }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Current Step Info */}
        <div className={styles.stepInfo}>
          <Badge variant="primary" size="medium">
            Step {currentStep + 1} of {STEPS.length}
          </Badge>
          <h4>{STEPS[currentStep].title}</h4>
          <p>{STEPS[currentStep].description}</p>
        </div>

        {/* Step Visualization */}
        <div className={styles.visualization}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderStepContent()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Controls */}
        <div className={styles.controls}>
          <Button
            variant="secondary"
            onClick={prevStep}
            disabled={currentStep === 0 || isAnimating}
            size="medium"
          >
            Previous
          </Button>
          
          <Button
            variant="ghost"
            icon={<RotateCcw size={16} />}
            onClick={reset}
            disabled={isAnimating}
          >
            Reset
          </Button>

          {currentStep < STEPS.length - 1 ? (
            <Button
              variant="primary"
              onClick={nextStep}
              disabled={isAnimating}
              icon={<ArrowRight size={16} />}
              iconPosition="right"
              size="medium"
            >
              {isAnimating ? 'Processing...' : 'Next Step'}
            </Button>
          ) : (
            <Button
              variant="success"
              onClick={reset}
              icon={<RotateCcw size={16} />}
              size="medium"
            >
              Try Again
            </Button>
          )}
        </div>
      </Card>

      {/* Deep Dive Accordion */}
      <Accordion
        title="Deep Dive: The Mathematics of Blind Signatures"
        variant="deepdive"
        icon={<Sparkles size={16} />}
      >
        <p>
          Blind signatures use clever cryptographic math to allow signing without revealing 
          the message content. Here's how it works:
        </p>
        <ul>
          <li>
            <strong>Blinding:</strong> Alice multiplies her message by a random blinding 
            factor. Think of this like putting a message in a sealed envelope with carbon 
            paper inside.
          </li>
          <li>
            <strong>Signing:</strong> The mint signs the blinded message without opening 
            the envelope. The signature goes through the carbon paper onto the message inside.
          </li>
          <li>
            <strong>Unblinding:</strong> Alice removes the blinding factor (opens the envelope) 
            to reveal a valid signature on her original message.
          </li>
          <li>
            <strong>Privacy:</strong> When Alice later spends the token, the mint sees a valid 
            signature but cannot determine which blinded message it originally signed. It's 
            unlinkable!
          </li>
        </ul>
        <p>
          <strong>The key insight:</strong> The mint proves the token is worth 100 sats without 
          knowing who withdrew it. This gives eCash users perfect privacy - even better than 
          cash, since there are no serial numbers!
        </p>
      </Accordion>
    </div>
  );
}

function MessageStep({ message }) {
  return (
    <div className={styles.stepContent}>
      <div className={styles.participant}>
        <div className={styles.participantHeader}>
          <div className={styles.avatar}>👤</div>
          <div>
            <h5>Alice (User)</h5>
            <Badge variant="success" size="small">Creating Token Request</Badge>
          </div>
        </div>
        
        <motion.div 
          className={styles.messageBox}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        >
          <div className={styles.messageHeader}>
            <Mail size={18} />
            <span>Token Request</span>
          </div>
          <div className={styles.messageContent}>
            <div className={styles.messageRow}>
              <span className={styles.label}>Value:</span>
              <span className={styles.value}>{message.value} sats</span>
            </div>
            <div className={styles.messageRow}>
              <span className={styles.label}>Message Hash:</span>
              <code className={styles.hash}>{message.hash}</code>
            </div>
          </div>
        </motion.div>

        <div className={styles.infoBox}>
          <Info size={14} />
          <span>
            Alice wants to create a token worth {message.value} sats. She generates a secret 
            message that represents this token.
          </span>
        </div>
      </div>
    </div>
  );
}

function BlindStep({ message, blindingFactor }) {
  const [showBlinding, setShowBlinding] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowBlinding(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={styles.stepContent}>
      <div className={styles.participant}>
        <div className={styles.participantHeader}>
          <div className={styles.avatar}>👤</div>
          <div>
            <h5>Alice (User)</h5>
            <Badge variant="warning" size="small">Blinding Message</Badge>
          </div>
        </div>

        <div className={styles.blindingProcess}>
          <motion.div 
            className={styles.messageBox}
            animate={{ scale: showBlinding ? 0.95 : 1 }}
          >
            <div className={styles.messageHeader}>
              <Mail size={18} />
              <span>Original Message</span>
            </div>
            <div className={styles.messageContent}>
              <code className={styles.hash}>{message.hash}</code>
            </div>
          </motion.div>

          <motion.div 
            className={styles.operator}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Lock size={20} />
            <span>×</span>
          </motion.div>

          <motion.div 
            className={styles.messageBox}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className={styles.messageHeader}>
              <Sparkles size={18} />
              <span>Blinding Factor</span>
            </div>
            <div className={styles.messageContent}>
              <code className={styles.hash}>{blindingFactor}</code>
            </div>
          </motion.div>

          <motion.div 
            className={styles.arrow}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <ArrowRight size={24} />
          </motion.div>

          <motion.div 
            className={`${styles.messageBox} ${styles.blinded}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1 }}
          >
            <div className={styles.messageHeader}>
              <EyeOff size={18} />
              <span>Blinded Message</span>
            </div>
            <div className={styles.messageContent}>
              <code className={styles.hash}>BLIND_{message.hash}_{blindingFactor}</code>
            </div>
            <div className={styles.blindedOverlay}>
              <Lock size={32} />
            </div>
          </motion.div>
        </div>

        <div className={styles.infoBox}>
          <Info size={14} />
          <span>
            The blinding factor acts like a sealed envelope. The message is now hidden 
            from the mint, but can still be signed.
          </span>
        </div>
      </div>
    </div>
  );
}

function SignStep({ blindedMessage, signature, showMintView, setShowMintView }) {
  return (
    <div className={styles.stepContent}>
      <div className={styles.twoParticipants}>
        <div className={styles.participant}>
          <div className={styles.participantHeader}>
            <div className={styles.avatar}>👤</div>
            <div>
              <h5>Alice</h5>
              <Badge variant="secondary" size="small">Waiting</Badge>
            </div>
          </div>
          
          <motion.div 
            className={styles.messageBox}
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className={styles.messageHeader}>
              <EyeOff size={18} />
              <span>Sent to Mint</span>
            </div>
            <div className={styles.messageContent}>
              <code className={styles.hashSmall}>{blindedMessage}</code>
            </div>
          </motion.div>
        </div>

        <motion.div 
          className={styles.transferArrow}
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <ArrowRight size={32} />
        </motion.div>

        <div className={styles.participant}>
          <div className={styles.participantHeader}>
            <div className={styles.avatar}>🏦</div>
            <div>
              <h5>Mint</h5>
              <Badge variant="primary" size="small">Signing</Badge>
            </div>
          </div>

          <motion.div 
            className={styles.messageBox}
            initial={{ scale: 1 }}
            animate={{ scale: signature ? 1 : [1, 1.05, 1] }}
            transition={{ duration: 1, repeat: signature ? 0 : Infinity }}
          >
            <div className={styles.messageHeader}>
              <Pencil size={18} />
              <span>Signing Blindly</span>
            </div>
            <div className={styles.messageContent}>
              {signature ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <code className={styles.hash}>{signature}</code>
                  <CheckCircle size={16} className={styles.successIcon} />
                </motion.div>
              ) : (
                <div className={styles.signing}>
                  <motion.div
                    className={styles.signingSpinner}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  >
                    <Pencil size={24} />
                  </motion.div>
                  <span>Signing...</span>
                </div>
              )}
            </div>
          </motion.div>

          <Button
            variant="ghost"
            size="small"
            icon={showMintView ? <EyeOff size={14} /> : <Eye size={14} />}
            onClick={() => setShowMintView(!showMintView)}
          >
            {showMintView ? 'Hide' : 'Show'} Mint's View
          </Button>

          <AnimatePresence>
            {showMintView && (
              <motion.div
                className={styles.mintView}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <AlertCircle size={16} />
                <span>
                  The mint can only see the blinded message: <code>{blindedMessage}</code>
                  <br />
                  It has no idea this is for {MESSAGES[0].value} sats or who Alice is!
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className={styles.infoBox}>
        <Info size={14} />
        <span>
          The mint signs the blinded message without seeing the original. This is the magic 
          of blind signatures - signing without knowing what you're signing!
        </span>
      </div>
    </div>
  );
}

function UnblindStep({ signature, blindingFactor, unblindedSig }) {
  return (
    <div className={styles.stepContent}>
      <div className={styles.participant}>
        <div className={styles.participantHeader}>
          <div className={styles.avatar}>👤</div>
          <div>
            <h5>Alice (User)</h5>
            <Badge variant="success" size="small">Unblinding</Badge>
          </div>
        </div>

        <div className={styles.blindingProcess}>
          <motion.div className={styles.messageBox}>
            <div className={styles.messageHeader}>
              <Pencil size={18} />
              <span>Blinded Signature</span>
            </div>
            <div className={styles.messageContent}>
              <code className={styles.hash}>{signature}</code>
            </div>
          </motion.div>

          <motion.div 
            className={styles.operator}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Unlock size={20} />
            <span>÷</span>
          </motion.div>

          <motion.div 
            className={styles.messageBox}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className={styles.messageHeader}>
              <Sparkles size={18} />
              <span>Blinding Factor</span>
            </div>
            <div className={styles.messageContent}>
              <code className={styles.hash}>{blindingFactor}</code>
            </div>
          </motion.div>

          <motion.div 
            className={styles.arrow}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <ArrowRight size={24} />
          </motion.div>

          <motion.div 
            className={`${styles.messageBox} ${styles.valid}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7 }}
          >
            <div className={styles.messageHeader}>
              <CheckCircle size={18} />
              <span>Valid Token</span>
            </div>
            <div className={styles.messageContent}>
              <code className={styles.hash}>{unblindedSig}</code>
            </div>
            <motion.div 
              className={styles.sparkle}
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 180, 360]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sparkles size={24} />
            </motion.div>
          </motion.div>
        </div>

        <div className={styles.infoBox}>
          <Info size={14} />
          <span>
            Alice removes the blinding factor to reveal a valid signature on her original 
            message. She now has a spendable eCash token!
          </span>
        </div>
      </div>
    </div>
  );
}

function VerifyStep({ message, unblindedSig, showMintView, setShowMintView }) {
  return (
    <div className={styles.stepContent}>
      <div className={styles.twoParticipants}>
        <div className={styles.participant}>
          <div className={styles.participantHeader}>
            <div className={styles.avatar}>👤</div>
            <div>
              <h5>Alice</h5>
              <Badge variant="success" size="small">Spending</Badge>
            </div>
          </div>
          
          <motion.div 
            className={`${styles.messageBox} ${styles.valid}`}
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className={styles.messageHeader}>
              <CheckCircle size={18} />
              <span>Spending Token</span>
            </div>
            <div className={styles.messageContent}>
              <div className={styles.messageRow}>
                <span className={styles.label}>Value:</span>
                <span className={styles.value}>{message.value} sats</span>
              </div>
              <code className={styles.hashSmall}>{unblindedSig}</code>
            </div>
          </motion.div>
        </div>

        <motion.div 
          className={styles.transferArrow}
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
        >
          <ArrowRight size={32} />
        </motion.div>

        <div className={styles.participant}>
          <div className={styles.participantHeader}>
            <div className={styles.avatar}>🏦</div>
            <div>
              <h5>Mint</h5>
              <Badge variant="primary" size="small">Verifying</Badge>
            </div>
          </div>

          <motion.div 
            className={`${styles.messageBox} ${styles.valid}`}
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ delay: 0.5 }}
          >
            <div className={styles.messageHeader}>
              <CheckCircle size={18} />
              <span>Valid Signature!</span>
            </div>
            <div className={styles.messageContent}>
              <div className={styles.verifySuccess}>
                <CheckCircle size={32} className={styles.checkIcon} />
                <span>Token Accepted</span>
              </div>
            </div>
          </motion.div>

          <Button
            variant="ghost"
            size="small"
            icon={showMintView ? <EyeOff size={14} /> : <Eye size={14} />}
            onClick={() => setShowMintView(!showMintView)}
          >
            {showMintView ? 'Hide' : 'Show'} Privacy Details
          </Button>

          <AnimatePresence>
            {showMintView && (
              <motion.div
                className={styles.privacyHighlight}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <Sparkles size={16} />
                <div>
                  <strong>Perfect Privacy Achieved!</strong>
                  <p>
                    The mint sees a valid signature but cannot link this token to Alice's 
                    original withdrawal. The blind signature broke the connection forever.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className={styles.successBox}>
        <CheckCircle size={20} />
        <div>
          <strong>Privacy Preserved!</strong>
          <p>
            The mint verified the token is valid and worth {message.value} sats, but has 
            no way to know it came from Alice. This is perfect privacy - better than physical cash!
          </p>
        </div>
      </div>
    </div>
  );
}

export default BlindSignatureDemo;
