import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Key, 
  Shield, 
  Users,
  Building,
  Heart,
  Briefcase,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Star
} from 'lucide-react';
import { Card, Accordion } from '../../common';
import styles from './ConfigurationExplorer.module.css';

const configurations = [
  {
    id: '2of3',
    m: 2,
    n: 3,
    name: '2-of-3',
    subtitle: 'The Gold Standard',
    icon: Shield,
    popular: true,
    security: 4,
    convenience: 4,
    description: 'The most popular configuration. Provides excellent redundancy - you can lose one key and still access your funds.',
    useCases: [
      'Personal cold storage',
      'Geographic key distribution',
      'Family inheritance planning'
    ],
    example: 'Store one key at home, one in a bank safe deposit box, and one with a trusted family member in another city.',
    pros: ['Lose 1 key, still spend', 'Simple to manage', 'Good balance of security/convenience'],
    cons: ['Need 2 keys together to spend', 'Must coordinate with backup location']
  },
  {
    id: '3of5',
    m: 3,
    n: 5,
    name: '3-of-5',
    subtitle: 'Business Grade',
    icon: Briefcase,
    popular: false,
    security: 5,
    convenience: 3,
    description: 'Higher security with more redundancy. Common for businesses, organizations, or high-value personal holdings.',
    useCases: [
      'Company treasury',
      'Board-controlled funds',
      'High-net-worth individuals'
    ],
    example: 'Five board members each hold a key. Any three can authorize spending, ensuring continuity even if two are unavailable.',
    pros: ['Can lose 2 keys', 'Distributed control', 'Harder to compromise'],
    cons: ['More complex coordination', 'Need 3 parties to agree', 'Higher setup overhead']
  },
  {
    id: '2of2',
    m: 2,
    n: 2,
    name: '2-of-2',
    subtitle: 'Joint Control',
    icon: Heart,
    popular: false,
    security: 3,
    convenience: 3,
    description: 'Both keys required for every transaction. No redundancy, but ensures mutual agreement before spending.',
    useCases: [
      'Married couples',
      'Business partners',
      'Two-factor authentication'
    ],
    example: 'A couple keeps one key each. Neither can spend without the other, protecting against unilateral decisions or theft.',
    pros: ['Both parties must agree', 'Good for shared funds', 'Simple two-party setup'],
    cons: ['No key loss tolerance', 'Both must be available', 'Loss of either key = lost funds']
  },
  {
    id: '1of2',
    m: 1,
    n: 2,
    name: '1-of-2',
    subtitle: 'Shared Access',
    icon: Users,
    popular: false,
    security: 2,
    convenience: 5,
    description: 'Either key can spend independently. Maximum convenience but lower security than other options.',
    useCases: [
      'Family spending account',
      'Easy inheritance',
      'Business petty cash'
    ],
    example: 'Parent and adult child both have access. If parent passes away, child can immediately access funds without probate.',
    pros: ['Either party can spend', 'Simple inheritance', 'No coordination needed'],
    cons: ['Either party can drain funds', 'Lower security', 'Trust required']
  },
  {
    id: '3of3',
    m: 3,
    n: 3,
    name: '3-of-3',
    subtitle: 'Maximum Agreement',
    icon: Building,
    popular: false,
    security: 3,
    convenience: 2,
    description: 'All keys must sign. Highest security but no tolerance for lost keys. Best with reliable backup procedures.',
    useCases: [
      'Strict conditions to spend',
      'Unanimous board decisions',
      'Regulatory compliance'
    ],
    example: 'Three co-founders must all agree to any company Bitcoin expenditure, preventing unauthorized spending.',
    pros: ['Maximum security', 'No single point of compromise'],
    cons: ['No key loss tolerance', 'All parties must coordinate', 'Single unavailable party blocks spending']
  }
];

function SecurityMeter({ level, label }) {
  return (
    <div className={styles.meter}>
      <span className={styles.meterLabel}>{label}</span>
      <div className={styles.meterBars}>
        {[1, 2, 3, 4, 5].map(i => (
          <div
            key={i}
            className={`${styles.meterBar} ${i <= level ? styles.active : ''}`}
          />
        ))}
      </div>
    </div>
  );
}

function RedundancyCalculator({ m, n }) {
  const scenarios = [];
  
  for (let lost = 0; lost <= n; lost++) {
    const remaining = n - lost;
    const canSpend = remaining >= m;
    scenarios.push({
      lost,
      remaining,
      canSpend,
      status: canSpend ? (lost === 0 ? 'optimal' : 'ok') : 'failed'
    });
  }
  
  return (
    <div className={styles.redundancyCalc}>
      <h5 className={styles.redundancyTitle}>Redundancy Analysis</h5>
      <div className={styles.redundancyGrid}>
        {scenarios.map(scenario => (
          <div 
            key={scenario.lost} 
            className={`${styles.redundancyItem} ${styles[scenario.status]}`}
          >
            <div className={styles.redundancyKeys}>
              {Array.from({ length: n }, (_, i) => (
                <Key 
                  key={i} 
                  size={14} 
                  className={i < scenario.remaining ? styles.keyPresent : styles.keyLost}
                />
              ))}
            </div>
            <div className={styles.redundancyInfo}>
              <span className={styles.redundancyLabel}>
                {scenario.lost === 0 ? 'All keys' : `Lose ${scenario.lost} key${scenario.lost > 1 ? 's' : ''}`}
              </span>
              <span className={`${styles.redundancyStatus} ${styles[scenario.status]}`}>
                {scenario.canSpend ? (
                  <><CheckCircle size={12} /> Can spend</>
                ) : (
                  <><XCircle size={12} /> Funds lost</>
                )}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ConfigurationExplorer() {
  const [selectedConfig, setSelectedConfig] = useState('2of3');
  
  const config = configurations.find(c => c.id === selectedConfig);
  const Icon = config.icon;

  return (
    <div className={styles.container}>
      {/* Configuration Selector */}
      <div className={styles.configSelector}>
        {configurations.map(c => {
          const ConfigIcon = c.icon;
          return (
            <button
              key={c.id}
              className={`${styles.configButton} ${selectedConfig === c.id ? styles.active : ''}`}
              onClick={() => setSelectedConfig(c.id)}
            >
              {c.popular && <span className={styles.popularBadge}><Star size={10} /> Popular</span>}
              <ConfigIcon size={20} />
              <span className={styles.configName}>{c.name}</span>
              <span className={styles.configSubtitle}>{c.subtitle}</span>
            </button>
          );
        })}
      </div>
      
      {/* Selected Configuration Details */}
      <motion.div
        key={selectedConfig}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card variant="elevated" padding="large">
          <div className={styles.configHeader}>
            <div className={styles.configIcon}>
              <Icon size={28} />
            </div>
            <div className={styles.configTitleBlock}>
              <h4>{config.name} Multisig</h4>
              <p>{config.description}</p>
            </div>
          </div>
          
          <div className={styles.metersRow}>
            <SecurityMeter level={config.security} label="Security" />
            <SecurityMeter level={config.convenience} label="Convenience" />
          </div>
          
          <div className={styles.configDetails}>
            <div className={styles.useCasesSection}>
              <h5>Common Use Cases</h5>
              <ul>
                {config.useCases.map((useCase, i) => (
                  <li key={i}>{useCase}</li>
                ))}
              </ul>
            </div>
            
            <div className={styles.exampleSection}>
              <h5>Example Setup</h5>
              <p>{config.example}</p>
            </div>
          </div>
          
          <div className={styles.prosConsGrid}>
            <div className={styles.prosSection}>
              <h5><CheckCircle size={16} /> Advantages</h5>
              <ul>
                {config.pros.map((pro, i) => (
                  <li key={i}>{pro}</li>
                ))}
              </ul>
            </div>
            <div className={styles.consSection}>
              <h5><AlertTriangle size={16} /> Considerations</h5>
              <ul>
                {config.cons.map((con, i) => (
                  <li key={i}>{con}</li>
                ))}
              </ul>
            </div>
          </div>
          
          <RedundancyCalculator m={config.m} n={config.n} />
        </Card>
      </motion.div>
      
      {/* Choosing Guide */}
      <Accordion
        title="How to Choose Your Configuration"
        variant="deepdive"
        icon={<Shield size={16} />}
      >
        <div className={styles.choosingGuide}>
          <p>
            The right configuration depends on your specific situation. Consider these factors:
          </p>
          
          <div className={styles.factorsList}>
            <div className={styles.factor}>
              <strong>Value at stake</strong>
              <p>Higher values justify more complex setups. For small amounts, 2-of-3 is usually sufficient.</p>
            </div>
            <div className={styles.factor}>
              <strong>Number of parties</strong>
              <p>Solo user? 2-of-3 with geographic distribution. Multiple stakeholders? Match the threshold to required agreement.</p>
            </div>
            <div className={styles.factor}>
              <strong>Access frequency</strong>
              <p>Frequent spending needs lower friction (2-of-3). Long-term storage can tolerate higher thresholds.</p>
            </div>
          </div>
          
          <div className={styles.recommendation}>
            <h5>My Recommendation</h5>
            <p>
              <strong>For most individuals:</strong> Start with 2-of-3. It's the best balance of security, 
              redundancy, and usability. You can always migrate to a more complex setup later as your 
              holdings and experience grow.
            </p>
          </div>
        </div>
      </Accordion>
    </div>
  );
}

export default ConfigurationExplorer;
