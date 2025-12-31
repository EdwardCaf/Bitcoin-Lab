import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  Key, 
  Eye, 
  EyeOff, 
  RefreshCw, 
  ArrowRight,
  Lock,
  Unlock,
  Copy,
  Check
} from 'lucide-react';
import { Card, Button, Badge, Accordion } from '../../common';
import styles from './KeyPairGenerator.module.css';

// Simulated key generation (for educational purposes only)
function generatePrivateKey() {
  const chars = '0123456789abcdef';
  let key = '';
  for (let i = 0; i < 64; i++) {
    key += chars[Math.floor(Math.random() * chars.length)];
  }
  return key;
}

function derivePublicKey(privateKey) {
  // Simulated - in reality this uses elliptic curve cryptography
  const chars = '0123456789abcdef';
  let key = '04'; // Uncompressed public key prefix
  // Create deterministic-looking but fake derivation
  for (let i = 0; i < 128; i++) {
    const seed = parseInt(privateKey.substr(i % 60, 4), 16);
    key += chars[(seed + i * 7) % 16];
  }
  return key;
}

function deriveAddress(publicKey, type = 'p2pkh') {
  const chars = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
  const hexChars = '0123456789abcdef';
  
  switch (type) {
    case 'p2pkh': {
      let address = '1';
      for (let i = 0; i < 33; i++) {
        const seed = parseInt(publicKey.substr(i * 2, 4), 16);
        address += chars[(seed + i * 3) % chars.length];
      }
      return address;
    }
    case 'p2sh': {
      let address = '3';
      for (let i = 0; i < 33; i++) {
        const seed = parseInt(publicKey.substr(i * 2 + 10, 4), 16);
        address += chars[(seed + i * 5) % chars.length];
      }
      return address;
    }
    case 'bech32': {
      let address = 'bc1q';
      for (let i = 0; i < 38; i++) {
        const seed = parseInt(publicKey.substr(i * 2, 4), 16);
        address += hexChars[(seed + i * 2) % 16];
      }
      return address;
    }
    case 'taproot': {
      let address = 'bc1p';
      for (let i = 0; i < 58; i++) {
        const seed = parseInt(publicKey.substr(i % 100, 4), 16);
        address += hexChars[(seed + i * 4) % 16];
      }
      return address;
    }
    default:
      return '';
  }
}

export function KeyPairGenerator() {
  const [privateKey, setPrivateKey] = useState(generatePrivateKey());
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [copied, setCopied] = useState(null);
  const [selectedAddressType, setSelectedAddressType] = useState('bech32');
  
  const publicKey = derivePublicKey(privateKey);
  const address = deriveAddress(publicKey, selectedAddressType);
  
  const regenerate = useCallback(() => {
    setPrivateKey(generatePrivateKey());
    setCopied(null);
  }, []);
  
  const copyToClipboard = async (text, type) => {
    await navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };
  
  const addressTypes = [
    { id: 'p2pkh', label: 'Legacy (P2PKH)', prefix: '1...', description: 'Original address format' },
    { id: 'p2sh', label: 'Script (P2SH)', prefix: '3...', description: 'Used for multisig, SegWit wrapped' },
    { id: 'bech32', label: 'Native SegWit', prefix: 'bc1q...', description: 'Lower fees, recommended' },
    { id: 'taproot', label: 'Taproot', prefix: 'bc1p...', description: 'Latest format, best privacy' },
  ];

  return (
    <div className={styles.container}>
      <Card variant="elevated" padding="large">
        <div className={styles.header}>
          <div className={styles.titleSection}>
            <div className={styles.iconWrapper}>
              <Key size={24} />
            </div>
            <div>
              <h3 className={styles.title}>Key Pair Generator</h3>
              <p className={styles.subtitle}>
                See how private keys, public keys, and addresses are related
              </p>
            </div>
          </div>
          
          <Button
            variant="secondary"
            size="small"
            icon={<RefreshCw size={14} />}
            onClick={regenerate}
          >
            Generate New
          </Button>
        </div>
        
        {/* Key Derivation Flow */}
        <div className={styles.flowContainer}>
          {/* Private Key */}
          <motion.div 
            className={styles.keyBox}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className={styles.keyHeader}>
              <Lock size={18} />
              <span>Private Key</span>
              <Badge variant="error" size="small">Secret</Badge>
            </div>
            <div className={styles.keyValue}>
              <code className={styles.keyCode}>
                {showPrivateKey ? privateKey : '•'.repeat(64)}
              </code>
              <div className={styles.keyActions}>
                <button 
                  className={styles.iconButton}
                  onClick={() => setShowPrivateKey(!showPrivateKey)}
                  title={showPrivateKey ? 'Hide' : 'Show'}
                >
                  {showPrivateKey ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
                <button 
                  className={styles.iconButton}
                  onClick={() => copyToClipboard(privateKey, 'private')}
                  title="Copy"
                >
                  {copied === 'private' ? <Check size={16} /> : <Copy size={16} />}
                </button>
              </div>
            </div>
            <p className={styles.keyNote}>
              256-bit random number. Never share this!
            </p>
          </motion.div>
          
          {/* Arrow */}
          <div className={styles.arrow}>
            <ArrowRight size={24} />
          </div>
          
          {/* Public Key */}
          <motion.div 
            className={styles.keyBox}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className={styles.keyHeader}>
              <Unlock size={18} />
              <span>Public Key</span>
              <Badge variant="success" size="small">Shareable</Badge>
            </div>
            <div className={styles.keyValue}>
              <code className={styles.keyCode}>
                {publicKey.slice(0, 32)}...
              </code>
              <div className={styles.keyActions}>
                <button 
                  className={styles.iconButton}
                  onClick={() => copyToClipboard(publicKey, 'public')}
                  title="Copy"
                >
                  {copied === 'public' ? <Check size={16} /> : <Copy size={16} />}
                </button>
              </div>
            </div>
            <p className={styles.keyNote}>
              Derived from private key using elliptic curve math
            </p>
          </motion.div>
          
          {/* Arrow */}
          <div className={styles.arrow}>
            <ArrowRight size={24} />
          </div>
          
          {/* Address */}
          <motion.div 
            className={`${styles.keyBox} ${styles.addressBox}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className={styles.keyHeader}>
              <Key size={18} />
              <span>Bitcoin Address</span>
            </div>
            <div className={styles.keyValue}>
              <code className={styles.keyCode}>
                {address}
              </code>
              <div className={styles.keyActions}>
                <button 
                  className={styles.iconButton}
                  onClick={() => copyToClipboard(address, 'address')}
                  title="Copy"
                >
                  {copied === 'address' ? <Check size={16} /> : <Copy size={16} />}
                </button>
              </div>
            </div>
            <p className={styles.keyNote}>
              Human-readable format for receiving bitcoin
            </p>
          </motion.div>
        </div>
        
        {/* Address Type Selector */}
        <div className={styles.addressTypeSection}>
          <h4>Address Format</h4>
          <div className={styles.addressTypes}>
            {addressTypes.map(type => (
              <button
                key={type.id}
                className={`${styles.addressType} ${selectedAddressType === type.id ? styles.selected : ''}`}
                onClick={() => setSelectedAddressType(type.id)}
              >
                <span className={styles.addressPrefix}>{type.prefix}</span>
                <span className={styles.addressLabel}>{type.label}</span>
              </button>
            ))}
          </div>
        </div>
        
        {/* Security Warning */}
        <div className={styles.warning}>
          <Lock size={16} />
          <span>
            This is a simulation for learning. Never use generated keys for real Bitcoin!
          </span>
        </div>
      </Card>
      
      <Accordion
        title="Deep Dive: Elliptic Curve Cryptography"
        variant="deepdive"
        icon={<Key size={16} />}
      >
        <p>
          Bitcoin uses <strong>ECDSA (Elliptic Curve Digital Signature Algorithm)</strong> with 
          the secp256k1 curve. Here's the magic:
        </p>
        <ul>
          <li>
            <strong>One-way derivation:</strong> You can easily compute the public key from 
            the private key, but it's computationally impossible to reverse.
          </li>
          <li>
            <strong>256-bit security:</strong> There are 2^256 possible private keys - more 
            than atoms in the observable universe for a 24 word seed phrase.
          </li>
          <li>
            <strong>Digital signatures:</strong> Your private key can create signatures that 
            anyone can verify using your public key.
          </li>
        </ul>
        <p>
          The address is derived by hashing the public key (SHA-256 + RIPEMD-160) and 
          encoding it for human readability with error checking.
        </p>
      </Accordion>
    </div>
  );
}

export default KeyPairGenerator;
