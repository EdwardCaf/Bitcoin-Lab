import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Key, 
  Grid3X3,
  ArrowRight,
  RefreshCw,
  Shield,
  AlertTriangle,
  Copy,
  Check,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Card, Button, Badge, Accordion } from '../../common';
import styles from './SeedPhraseDemo.module.css';

// BIP39 word list (first 100 words for demo)
const wordList = [
  'abandon', 'ability', 'able', 'about', 'above', 'absent', 'absorb', 'abstract',
  'absurd', 'abuse', 'access', 'accident', 'account', 'accuse', 'achieve', 'acid',
  'acoustic', 'acquire', 'across', 'act', 'action', 'actor', 'actress', 'actual',
  'adapt', 'add', 'addict', 'address', 'adjust', 'admit', 'adult', 'advance',
  'advice', 'aerobic', 'affair', 'afford', 'afraid', 'again', 'age', 'agent',
  'agree', 'ahead', 'aim', 'air', 'airport', 'aisle', 'alarm', 'album',
  'alcohol', 'alert', 'alien', 'all', 'alley', 'allow', 'almost', 'alone',
  'alpha', 'already', 'also', 'alter', 'always', 'amateur', 'amazing', 'among',
  'amount', 'amused', 'analyst', 'anchor', 'ancient', 'anger', 'angle', 'angry',
  'animal', 'ankle', 'announce', 'annual', 'another', 'answer', 'antenna', 'antique',
  'anxiety', 'any', 'apart', 'apology', 'appear', 'apple', 'approve', 'april',
  'arch', 'arctic', 'area', 'arena', 'argue', 'arm', 'armed', 'armor',
  'army', 'around', 'arrange', 'arrest'
];

function generateSeedPhrase(wordCount = 12) {
  const words = [];
  for (let i = 0; i < wordCount; i++) {
    words.push(wordList[Math.floor(Math.random() * wordList.length)]);
  }
  return words;
}

function derivePath(seedPhrase, path) {
  // Simulated derivation - creates deterministic-looking fake addresses
  const seed = seedPhrase.join('');
  const chars = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
  
  let address = 'bc1q';
  for (let i = 0; i < 38; i++) {
    const seedIndex = (seed.charCodeAt(i % seed.length) + path.charCodeAt(i % path.length) + i) % chars.length;
    address += chars[seedIndex];
  }
  return address;
}

const derivationPaths = [
  { path: "m/84'/0'/0'/0/0", label: 'First receiving address', type: 'Native SegWit' },
  { path: "m/84'/0'/0'/0/1", label: 'Second receiving address', type: 'Native SegWit' },
  { path: "m/84'/0'/0'/0/2", label: 'Third receiving address', type: 'Native SegWit' },
  { path: "m/84'/0'/0'/1/0", label: 'First change address', type: 'Native SegWit (change)' },
];

export function SeedPhraseDemo() {
  const [seedPhrase, setSeedPhrase] = useState(() => generateSeedPhrase(12));
  const [wordCount, setWordCount] = useState(12);
  const [showAllAddresses, setShowAllAddresses] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const addresses = useMemo(() => {
    return derivationPaths.map(item => ({
      ...item,
      address: derivePath(seedPhrase, item.path)
    }));
  }, [seedPhrase]);
  
  const regenerate = () => {
    setSeedPhrase(generateSeedPhrase(wordCount));
    setCopied(false);
  };
  
  const copyPhrase = async () => {
    await navigator.clipboard.writeText(seedPhrase.join(' '));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={styles.container}>
      <Card variant="elevated" padding="large">
        <div className={styles.header}>
          <div className={styles.titleSection}>
            <div className={styles.iconWrapper}>
              <Grid3X3 size={24} />
            </div>
            <div>
              <h3 className={styles.title}>HD Wallet & Seed Phrases</h3>
              <p className={styles.subtitle}>
                See how one seed phrase generates multiple addresses
              </p>
            </div>
          </div>
          
          <div className={styles.controls}>
            <select 
              value={wordCount} 
              onChange={(e) => {
                setWordCount(Number(e.target.value));
                setSeedPhrase(generateSeedPhrase(Number(e.target.value)));
              }}
              className={styles.wordCountSelect}
            >
              <option value={12}>12 words</option>
              <option value={24}>24 words</option>
            </select>
            <Button
              variant="secondary"
              size="small"
              icon={<RefreshCw size={14} />}
              onClick={regenerate}
            >
              Generate New
            </Button>
          </div>
        </div>

        {/* Seed Phrase Display */}
        <div className={styles.seedSection}>
          <div className={styles.seedHeader}>
            <Key size={18} />
            <span>Recovery Seed Phrase</span>
            <Badge variant="warning" size="small">Demo Only</Badge>
          </div>
          
          <div className={styles.seedGrid}>
            {seedPhrase.map((word, index) => (
              <motion.div
                key={index}
                className={styles.wordCard}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
              >
                <span className={styles.wordNumber}>{index + 1}</span>
                <span className={styles.word}>{word}</span>
              </motion.div>
            ))}
          </div>
          
          <div className={styles.seedActions}>
            <button 
              className={styles.copyButton}
              onClick={copyPhrase}
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              {copied ? 'Copied!' : 'Copy phrase'}
            </button>
          </div>
        </div>

        {/* Derivation Flow */}
        <div className={styles.derivationFlow}>
          <div className={styles.flowStep}>
            <div className={styles.flowIcon}>
              <Grid3X3 size={20} />
            </div>
            <span>Seed Phrase</span>
          </div>
          <ArrowRight size={20} className={styles.flowArrow} />
          <div className={styles.flowStep}>
            <div className={styles.flowIcon}>
              <Key size={20} />
            </div>
            <span>Master Key</span>
          </div>
          <ArrowRight size={20} className={styles.flowArrow} />
          <div className={styles.flowStep}>
            <div className={styles.flowIcon}>
              <Shield size={20} />
            </div>
            <span>Addresses</span>
          </div>
        </div>

        {/* Derived Addresses */}
        <div className={styles.addressesSection}>
          <div className={styles.addressesHeader}>
            <h4>Derived Addresses</h4>
            <button 
              className={styles.toggleButton}
              onClick={() => setShowAllAddresses(!showAllAddresses)}
            >
              {showAllAddresses ? 'Show less' : 'Show all'}
              {showAllAddresses ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          </div>
          
          <div className={styles.addressesList}>
            {addresses.slice(0, showAllAddresses ? addresses.length : 2).map((item, index) => (
              <motion.div
                key={item.path}
                className={styles.addressItem}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className={styles.addressInfo}>
                  <code className={styles.addressPath}>{item.path}</code>
                  <span className={styles.addressLabel}>{item.label}</span>
                </div>
                <code className={styles.addressValue}>{item.address}</code>
              </motion.div>
            ))}
          </div>
          
          <p className={styles.addressNote}>
            All these addresses are controlled by the same seed phrase. 
            Losing the seed means losing access to all addresses!
          </p>
        </div>

        {/* Security Warning */}
        <div className={styles.warning}>
          <AlertTriangle size={20} />
          <div>
            <strong>Never use these words for real Bitcoin!</strong>
            <p>This is a simulation. Real seed phrases must be generated securely and kept secret.</p>
          </div>
        </div>
      </Card>

      {/* Comprehensive Security Section */}
      <Card variant="elevated" padding="large" className={styles.securityCard}>
        <div className={styles.securityHeader}>
          <Shield size={24} className={styles.securityIcon} />
          <h3 className={styles.securityTitle}>Critical Security Information</h3>
        </div>
        
        <div className={styles.criticalWarning}>
          <AlertTriangle size={20} />
          <div>
            <strong>Your seed phrase is the ONLY way to recover your Bitcoin</strong>
            <p>If you lose it, your funds are permanently lost. If someone else gets it, they can steal everything.</p>
          </div>
        </div>

        <div className={styles.securityGrid}>
          <div className={styles.securityColumn}>
            <h4 className={styles.doTitle}>✅ DO:</h4>
            <ul className={styles.securityList}>
              <li>Write seed phrase on paper or engrave on metal backup</li>
              <li>Store in multiple secure physical locations (fireproof safe, bank vault)</li>
              <li>Use a hardware wallet (Coldcard, Jade) for cold storage</li>
              <li>Test recovery process before funding wallet with real Bitcoin</li>
              <li>Keep it offline and completely private - never share with anyone</li>
              <li>Consider using a passphrase (25th word) for additional security</li>
            </ul>
          </div>

          <div className={styles.securityColumn}>
            <h4 className={styles.dontTitle}>❌ NEVER:</h4>
            <ul className={styles.securityList}>
              <li>Take photos or screenshots of your seed phrase</li>
              <li>Store in email, cloud storage, password managers, or any digital format</li>
              <li>Share with anyone claiming to be "support" or "verification"</li>
              <li>Enter into websites or apps you don't completely trust</li>
              <li>Store on internet-connected devices (computers, phones)</li>
              <li>Type it into any device if you can avoid it</li>
            </ul>
          </div>
        </div>

        <div className={styles.threatWarning}>
          <strong>Common Threats:</strong>
          <p>
            Phishing websites, fake wallet apps, malware/keyloggers, physical theft, 
            social engineering scams, clipboard hijacking, and shoulder surfing. 
            Always verify wallet software authenticity and generate seeds offline when possible.
          </p>
        </div>

        <div className={styles.bestPractice}>
          <strong>Best Practice:</strong> For significant amounts, use a hardware wallet that generates 
          the seed phrase offline and never exposes your private keys to your computer or the internet.
        </div>
      </Card>

      <Accordion
        title="Deep Dive: BIP39 & Derivation Paths"
        variant="deepdive"
        icon={<Grid3X3 size={16} />}
      >
        <p>
          <strong>BIP39</strong> defines how seed phrases work:
        </p>
        <ul>
          <li>12 words = 128 bits of entropy (very secure)</li>
          <li>24 words = 256 bits of entropy (extremely secure)</li>
          <li>Words come from a standardized list of 2048 words</li>
          <li>The last word includes a checksum for error detection</li>
        </ul>
        <p>
          <strong>Derivation Paths</strong> (like m/84'/0'/0'/0/0) tell the wallet which address to generate:
        </p>
        <ul>
          <li><code>m</code> - Master key</li>
          <li><code>84'</code> - Purpose (84 = Native SegWit)</li>
          <li><code>0'</code> - Coin type (0 = Bitcoin)</li>
          <li><code>0'</code> - Account number</li>
          <li><code>0</code> - External (0) or change (1)</li>
          <li><code>0</code> - Address index</li>
        </ul>
        <p>
          This hierarchical structure (HD = Hierarchical Deterministic) means one backup 
          protects multiple addresses.
        </p>
      </Accordion>
    </div>
  );
}

export default SeedPhraseDemo;
