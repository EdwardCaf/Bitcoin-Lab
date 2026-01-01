import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  HardDrive, 
  Monitor, 
  Building,
  FileText,
  MapPin,
  Home,
  Building2,
  Users,
  Shield,
  AlertTriangle,
  ExternalLink,
  CheckCircle,
  Info
} from 'lucide-react';
import { Card, Accordion } from '../../common';
import styles from './KeyManagement.module.css';

const keyHolderTypes = [
  {
    id: 'hardware',
    title: 'Hardware Wallet',
    icon: HardDrive,
    color: 'var(--success)',
    description: 'Dedicated signing devices like Coldcard, Trezor, or Jade',
    pros: ['Air-gapped security', 'Secure elements protect keys', 'Purpose-built for Bitcoin'],
    cons: ['Cost ($50-$250 each)', 'Learning curve', 'Device can fail/break'],
    examples: ['Coldcard Q', 'Trezor Safe 7', 'BitBox02']
  },
  {
    id: 'software',
    title: 'Software Signer',
    icon: Monitor,
    color: 'var(--info)',
    description: 'Desktop or mobile apps that can sign transactions',
    pros: ['Free', 'Accessible', 'Can run on existing devices'],
    cons: ['Computer vulnerabilities', 'Malware risk', 'Less secure than hardware'],
    examples: ['Sparrow (desktop)', 'BlueWallet (mobile)', 'Nunchuk (mobile)']
  },
  {
    id: 'custodian',
    title: 'Collaborative Custody',
    icon: Building,
    color: 'var(--warning)',
    description: 'Professional services that hold one key as a recovery backup',
    pros: ['Professional security', 'Recovery assistance', 'Often includes inheritance'],
    cons: ['Trust required', 'Monthly fees', 'Privacy leaked to third party'],
    examples: ['Nunchuk Honey Badger']
  },
  {
    id: 'backup',
    title: 'Paper/Metal Backup',
    icon: FileText,
    color: 'var(--text-muted)',
    description: 'Seed phrase stored on paper or stamped in metal',
    pros: ['No electronics to fail', 'Long-term durability (metal)', 'Air-gapped by nature'],
    cons: ['Physical security needed', 'Can be lost/destroyed', 'Must protect from discovery'],
    examples: ['Paper in fireproof safe', 'Steel plate backup', 'StampSeed', 'Seedplate', 'SEEDOR']
  }
];

const coordinatorSoftware = [
  {
    id: 'sparrow',
    name: 'Sparrow Wallet',
    type: 'Desktop',
    url: 'https://sparrowwallet.com',
    description: 'Full-featured desktop wallet with excellent multisig support. Connects to your own node.',
    features: ['Hardware wallet support', 'PSBT workflows', 'Own node connection', 'Output descriptor export']
  },
  {
    id: 'nunchuk',
    name: 'Nunchuk',
    type: 'Desktop/Mobile',
    url: 'https://nunchuk.io',
    description: 'Collaborative multisig with inheritance planning. Mobile and desktop apps available.',
    features: ['Collaborative signing', 'Inheritance planning', 'Key recovery service', 'Cross-platform']
  }
];

const collaborativeCustody = [
  {
    id: 'nunchuk-assisted',
    name: 'Nunchuk Honey Badger',
    model: 'Flexible configurations',
    url: 'https://nunchuk.io',
    description: 'Optional assisted custody layer on top of Nunchuk\'s self-custody platform.',
    features: ['Flexible setup', 'Platform integration', 'Inheritance support', 'Mobile + Desktop']
  }
];

function GeographicDistribution() {
  return (
    <div className={styles.geoContainer}>
      <h5 className={styles.geoTitle}>Example: Geographic Distribution for 2-of-3</h5>
      <div className={styles.geoGrid}>
        <div className={styles.geoLocation}>
          <div className={styles.geoIcon}>
            <Home size={24} />
          </div>
          <div className={styles.geoInfo}>
            <strong>Home Safe</strong>
            <span>Hardware wallet for regular use</span>
          </div>
        </div>
        
        <div className={styles.geoLocation}>
          <div className={styles.geoIcon}>
            <Building2 size={24} />
          </div>
          <div className={styles.geoInfo}>
            <strong>Bank Safe Deposit</strong>
            <span>Metal backup of seed phrase</span>
          </div>
        </div>
        
        <div className={styles.geoLocation}>
          <div className={styles.geoIcon}>
            <Users size={24} />
          </div>
          <div className={styles.geoInfo}>
            <strong>Trusted Family</strong>
            <span>Hardware wallet in another city</span>
          </div>
        </div>
      </div>
      <p className={styles.geoNote}>
        With keys in different locations, no single disaster (fire, flood, theft) can compromise 
        enough keys to either steal or lock you out of your funds.
      </p>
    </div>
  );
}

export function KeyManagement() {
  const [selectedHolder, setSelectedHolder] = useState('hardware');
  
  const holder = keyHolderTypes.find(h => h.id === selectedHolder);
  const HolderIcon = holder.icon;

  return (
    <div className={styles.container}>
      {/* Key Holder Types */}
      <Card variant="elevated" padding="large">
        <h4 className={styles.sectionTitle}>Types of Key Holders</h4>
        <p className={styles.sectionDescription}>
          In a multisig setup, each key can be held by different types of devices or services. 
          Mixing different types adds defense in depth.
        </p>
        
        <div className={styles.holderSelector}>
          {keyHolderTypes.map(h => {
            const Icon = h.icon;
            return (
              <button
                key={h.id}
                className={`${styles.holderButton} ${selectedHolder === h.id ? styles.active : ''}`}
                onClick={() => setSelectedHolder(h.id)}
                style={{ '--holder-color': h.color }}
              >
                <Icon size={20} />
                <span>{h.title}</span>
              </button>
            );
          })}
        </div>
        
        <motion.div
          key={selectedHolder}
          className={styles.holderDetails}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className={styles.holderHeader}>
            <div className={styles.holderIcon} style={{ background: `${holder.color}20`, color: holder.color }}>
              <HolderIcon size={24} />
            </div>
            <div>
              <h5>{holder.title}</h5>
              <p>{holder.description}</p>
            </div>
          </div>
          
          <div className={styles.prosConsRow}>
            <div className={styles.prosList}>
              <h6><CheckCircle size={14} /> Pros</h6>
              <ul>
                {holder.pros.map((pro, i) => (
                  <li key={i}>{pro}</li>
                ))}
              </ul>
            </div>
            <div className={styles.consList}>
              <h6><AlertTriangle size={14} /> Cons</h6>
              <ul>
                {holder.cons.map((con, i) => (
                  <li key={i}>{con}</li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className={styles.examplesBox}>
            <span className={styles.examplesLabel}>Examples:</span>
            <div className={styles.examplesTags}>
              {holder.examples.map((ex, i) => (
                <span key={i} className={styles.exampleTag}>{ex}</span>
              ))}
            </div>
          </div>
        </motion.div>
      </Card>
      
      {/* Geographic Distribution */}
      <Card variant="elevated" padding="large">
        <h4 className={styles.sectionTitle}>Geographic Distribution</h4>
        <p className={styles.sectionDescription}>
          Don't keep all keys in the same location. Distribute them geographically to protect 
          against localized disasters.
        </p>
        <GeographicDistribution />
      </Card>
      
      {/* Coordinator Software */}
      <Card variant="elevated" padding="large">
        <h4 className={styles.sectionTitle}>Coordinator Software</h4>
        <p className={styles.sectionDescription}>
          Coordinator software builds transactions and collects signatures, but never holds your 
          private keys. You need one to manage a multisig wallet.
        </p>
        
        <div className={styles.softwareGrid}>
          {coordinatorSoftware.map(software => (
            <a 
              key={software.id}
              href={software.url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.softwareCard}
            >
              <div className={styles.softwareHeader}>
                <span className={styles.softwareName}>{software.name}</span>
                <span className={styles.softwareType}>{software.type}</span>
              </div>
              <p className={styles.softwareDescription}>{software.description}</p>
              <div className={styles.softwareFeatures}>
                {software.features.slice(0, 3).map((feature, i) => (
                  <span key={i} className={styles.featureTag}>{feature}</span>
                ))}
              </div>
              <span className={styles.softwareLink}>
                Visit site <ExternalLink size={12} />
              </span>
            </a>
          ))}
        </div>
      </Card>
      
      {/* Collaborative Custody */}
      <Card variant="elevated" padding="large">
        <h4 className={styles.sectionTitle}>Collaborative Custody Providers</h4>
        <p className={styles.sectionDescription}>
          These services hold one key in your multisig as a recovery backup. You retain the 
          majority of keys and full control, but have professional support if needed.
        </p>
        
        <div className={styles.custodyGrid}>
          {collaborativeCustody.map(provider => (
            <a
              key={provider.id}
              href={provider.url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.custodyCard}
            >
              <div className={styles.custodyHeader}>
                <span className={styles.custodyName}>{provider.name}</span>
                <span className={styles.custodyModel}>{provider.model}</span>
              </div>
              <p className={styles.custodyDescription}>{provider.description}</p>
              <div className={styles.custodyFeatures}>
                {provider.features.map((feature, i) => (
                  <span key={i} className={styles.featureTag}>{feature}</span>
                ))}
              </div>
              <span className={styles.custodyLink}>
                Learn more <ExternalLink size={12} />
              </span>
            </a>
          ))}
        </div>
      </Card>
      
      {/* Output Descriptor Warning */}
      <div className={styles.warningBox}>
        <AlertTriangle size={24} />
        <div>
          <strong>Critical: Back Up Your Output Descriptor</strong>
          <p>
            Your multisig wallet is defined by an <strong>output descriptor</strong> - a string that 
            contains all the public keys and the threshold. Without it, you cannot reconstruct the 
            wallet even if you have all the seed phrases. Export and back up the descriptor 
            separately from your seeds.
          </p>
        </div>
      </div>
      
      {/* Deep Dive: Descriptors */}
      <Accordion
        title="Understanding Output Descriptors"
        variant="deepdive"
        icon={<Info size={16} />}
      >
        <p>
          An output descriptor is a standardized way to describe how a wallet generates addresses. 
          For multisig, it contains:
        </p>
        
        <ul className={styles.descriptorList}>
          <li><strong>Script type</strong> - What kind of multisig (P2SH, P2WSH, etc.)</li>
          <li><strong>Threshold</strong> - The M-of-N requirement</li>
          <li><strong>All public keys</strong> - Extended public keys (xpubs) for all cosigners</li>
          <li><strong>Derivation paths</strong> - How addresses are derived from each key</li>
        </ul>
        
        <div className={styles.descriptorExample}>
          <code>
            wsh(sortedmulti(2,[fingerprint/48'/0'/0'/2']xpub.../0/*,[fingerprint/48'/0'/0'/2']xpub.../0/*,[fingerprint/48'/0'/0'/2']xpub.../0/*))
          </code>
          <span>Example 2-of-3 native SegWit multisig descriptor (abbreviated)</span>
        </div>
        
        <p>
          All cosigners should have a copy of the descriptor. Store it with your seed backups, 
          but in a separate location (knowing just the descriptor doesn't give access to funds).
        </p>
      </Accordion>
    </div>
  );
}

export default KeyManagement;
