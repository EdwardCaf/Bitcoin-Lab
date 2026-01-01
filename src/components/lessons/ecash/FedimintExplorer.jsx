import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users,
  Shield,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Key,
  Lock,
  Unlock,
  Building,
  Info,
  Sparkles,
  UserCheck,
  UserX
} from 'lucide-react';
import { Card, Button, Badge, Accordion } from '../../common';
import styles from './FedimintExplorer.module.css';

const GUARDIANS = [
  { id: 1, name: 'Coffee Shop', honest: true, icon: '☕' },
  { id: 2, name: 'Local Bank', honest: true, icon: '🏦' },
  { id: 3, name: 'Community Center', honest: true, icon: '🏘️' },
  { id: 4, name: 'Bitcoin Meetup', honest: true, icon: '₿' },
  { id: 5, name: 'Tech Cooperative', honest: true, icon: '💻' }
];

const SCENARIOS = [
  {
    id: 'all-honest',
    title: 'All Guardians Honest',
    description: 'Normal operation - all guardians sign',
    honestGuardians: [1, 2, 3, 4, 5],
    result: 'success',
    threshold: 3
  },
  {
    id: 'one-offline',
    title: 'One Guardian Offline',
    description: 'System still works with 4/5 guardians',
    honestGuardians: [1, 2, 3, 4],
    result: 'success',
    threshold: 3
  },
  {
    id: 'two-offline',
    title: 'Two Guardians Offline',
    description: 'Still have threshold (3/5), system works',
    honestGuardians: [1, 2, 3],
    result: 'success',
    threshold: 3
  },
  {
    id: 'threshold-minus-one',
    title: 'Below Threshold',
    description: 'Only 2/5 guardians - transaction fails',
    honestGuardians: [1, 2],
    result: 'failure',
    threshold: 3
  },
  {
    id: 'majority-malicious',
    title: 'Majority Malicious',
    description: '3+ malicious guardians could steal funds',
    honestGuardians: [1, 2],
    result: 'danger',
    threshold: 3
  }
];

export function FedimintExplorer() {
  const [selectedScenario, setSelectedScenario] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSignatures, setShowSignatures] = useState(false);
  const [threshold, setThreshold] = useState(3);

  const scenario = SCENARIOS[selectedScenario];

  const handleProcess = async () => {
    setIsProcessing(true);
    setShowSignatures(false);
    
    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setShowSignatures(true);
    setIsProcessing(false);
  };

  const getGuardianStatus = (guardianId) => {
    if (!scenario.honestGuardians.includes(guardianId)) {
      return 'offline';
    }
    return 'online';
  };

  const getResultColor = () => {
    if (scenario.result === 'success') return 'var(--success)';
    if (scenario.result === 'failure') return 'var(--error)';
    return 'var(--warning)';
  };

  return (
    <div className={styles.container}>
      <Card variant="elevated" padding="large">
        <div className={styles.header}>
          <div className={styles.titleSection}>
            <div className={styles.iconWrapper}>
              <Users size={24} />
            </div>
            <div>
              <h3 className={styles.title}>Fedimint Federation</h3>
              <p className={styles.subtitle}>
                Explore how federated consensus reduces custodial risk
              </p>
            </div>
          </div>
        </div>

        {/* Threshold Selector */}
        <div className={styles.thresholdSection}>
          <div className={styles.thresholdInfo}>
            <h4>Federation Setup</h4>
            <p>
              This federation has 5 guardians with a{' '}
              <Badge variant="primary" size="medium">
                {threshold}-of-5
              </Badge>
              {' '}threshold signature
            </p>
          </div>
          <div className={styles.thresholdExplainer}>
            <Info size={16} />
            <span>
              Need {threshold} guardians to approve any transaction. This prevents a single 
              party from stealing funds.
            </span>
          </div>
        </div>

        {/* Guardians Grid */}
        <div className={styles.guardiansGrid}>
          {GUARDIANS.map((guardian, index) => {
            const status = getGuardianStatus(guardian.id);
            const isActive = scenario.honestGuardians.includes(guardian.id);

            return (
              <motion.div
                key={guardian.id}
                className={`${styles.guardian} ${
                  status === 'online' ? styles.online : styles.offline
                }`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className={styles.guardianIcon}>
                  <span className={styles.emoji}>{guardian.icon}</span>
                  {showSignatures && isActive && (
                    <motion.div
                      className={styles.signature}
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.5 + index * 0.1, type: 'spring' }}
                    >
                      <CheckCircle size={20} />
                    </motion.div>
                  )}
                  {showSignatures && !isActive && (
                    <motion.div
                      className={styles.offlineBadge}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <XCircle size={20} />
                    </motion.div>
                  )}
                </div>
                <div className={styles.guardianName}>{guardian.name}</div>
                <Badge 
                  variant={status === 'online' ? 'success' : 'secondary'}
                  size="small"
                >
                  {status}
                </Badge>
              </motion.div>
            );
          })}
        </div>

        {/* Signature Progress */}
        <div className={styles.signatureProgress}>
          <div className={styles.progressHeader}>
            <h4>Signature Progress</h4>
            <span className={styles.progressCount}>
              {showSignatures ? scenario.honestGuardians.length : 0} / {threshold} required
            </span>
          </div>
          <div className={styles.progressBar}>
            <motion.div
              className={styles.progressFill}
              style={{ 
                backgroundColor: isProcessing ? 'var(--warning)' : getResultColor()
              }}
              initial={{ width: 0 }}
              animate={{ 
                width: isProcessing 
                  ? `${(scenario.honestGuardians.length / GUARDIANS.length) * 100}%`
                  : showSignatures 
                    ? `${(scenario.honestGuardians.length / GUARDIANS.length) * 100}%`
                    : 0
              }}
              transition={{ duration: isProcessing ? 1.2 : 0.5, delay: isProcessing ? 0 : 0.5 }}
            />
            <div 
              className={styles.thresholdMarker}
              style={{ left: `${(threshold / GUARDIANS.length) * 100}%` }}
            >
              <div className={styles.thresholdLine} />
              <span className={styles.thresholdLabel}>Threshold</span>
            </div>
          </div>
        </div>

        {/* Scenario Selector */}
        <div className={styles.scenarioSection}>
          <h4>Test Scenarios</h4>
          <div className={styles.scenarioButtons}>
            {SCENARIOS.map((s, index) => (
              <button
                key={s.id}
                className={`${styles.scenarioButton} ${
                  selectedScenario === index ? styles.active : ''
                } ${styles[s.result]}`}
                onClick={() => {
                  setSelectedScenario(index);
                  setShowSignatures(false);
                }}
                disabled={isProcessing}
              >
                <span className={styles.scenarioTitle}>{s.title}</span>
                <span className={styles.scenarioDesc}>{s.description}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Process Button */}
        <div className={styles.actions}>
          <Button
            variant="primary"
            size="large"
            onClick={handleProcess}
            disabled={isProcessing}
            fullWidth
          >
            {isProcessing ? 'Processing Transaction...' : 'Process Transaction'}
          </Button>
        </div>

        {/* Result */}
        <AnimatePresence>
          {showSignatures && (
            <motion.div
              className={`${styles.result} ${styles[scenario.result]}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {scenario.result === 'success' && (
                <>
                  <CheckCircle size={32} />
                  <div>
                    <h4>Transaction Approved!</h4>
                    <p>
                      {scenario.honestGuardians.length} guardians signed, meeting the {threshold}-of-{GUARDIANS.length} threshold. 
                      The transaction is valid and will be processed.
                    </p>
                  </div>
                </>
              )}
              {scenario.result === 'failure' && (
                <>
                  <XCircle size={32} />
                  <div>
                    <h4>Transaction Failed</h4>
                    <p>
                      Only {scenario.honestGuardians.length} guardians available, but {threshold} are required. 
                      The transaction cannot proceed without reaching threshold.
                    </p>
                  </div>
                </>
              )}
              {scenario.result === 'danger' && (
                <>
                  <AlertTriangle size={32} />
                  <div>
                    <h4>Security Compromised!</h4>
                    <p>
                      With {GUARDIANS.length - scenario.honestGuardians.length} malicious guardians and a {threshold}-of-{GUARDIANS.length} threshold, 
                      they could collude to steal funds. This demonstrates why choosing trustworthy 
                      guardians is critical.
                    </p>
                  </div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </Card>

      {/* Comparison Card */}
      <Card variant="elevated" padding="large">
        <h3 className={styles.comparisonTitle}>
          <Building size={20} />
          Single Mint vs. Federated Mint
        </h3>
        
        <div className={styles.comparison}>
          <div className={styles.comparisonItem}>
            <div className={styles.comparisonHeader}>
              <Building size={24} className={styles.singleMint} />
              <h4>Single Mint (Cashu)</h4>
            </div>
            <ul>
              <li className={styles.negative}>
                <XCircle size={16} />
                <span>One party holds all funds</span>
              </li>
              <li className={styles.negative}>
                <XCircle size={16} />
                <span>Single point of failure</span>
              </li>
              <li className={styles.positive}>
                <CheckCircle size={16} />
                <span>Simple to set up and use</span>
              </li>
              <li className={styles.positive}>
                <CheckCircle size={16} />
                <span>Near-perfect privacy via blind signatures</span>
              </li>
              <li className={styles.warning}>
                <AlertTriangle size={16} />
                <span>Best for small amounts with trusted mints</span>
              </li>
            </ul>
          </div>

          <div className={styles.comparisonDivider}>
            <span>VS</span>
          </div>

          <div className={styles.comparisonItem}>
            <div className={styles.comparisonHeader}>
              <Users size={24} className={styles.federation} />
              <h4>Federated Mint (Fedimint)</h4>
            </div>
            <ul>
              <li className={styles.positive}>
                <CheckCircle size={16} />
                <span>Distributed trust across guardians</span>
              </li>
              <li className={styles.positive}>
                <CheckCircle size={16} />
                <span>Resilient to individual failures</span>
              </li>
              <li className={styles.positive}>
                <CheckCircle size={16} />
                <span>Community-managed custody</span>
              </li>
              <li className={styles.positive}>
                <CheckCircle size={16} />
                <span>Same blind signature privacy</span>
              </li>
              <li className={styles.warning}>
                <AlertTriangle size={16} />
                <span>More complex setup, requires trusted guardians</span>
              </li>
            </ul>
          </div>
        </div>
      </Card>

      
    </div>
  );
}

export default FedimintExplorer;
