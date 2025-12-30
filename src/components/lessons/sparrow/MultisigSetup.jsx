import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Key, 
  HardDrive,
  FileText,
  Download,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { Card } from '../../common';
import styles from './MultisigSetup.module.css';

const setupSteps = [
  {
    number: 1,
    title: 'Create New Wallet',
    description: 'Go to File → New Wallet. Give it a descriptive name that identifies the configuration (e.g., "2of3-family-vault").',
    icon: FileText
  },
  {
    number: 2,
    title: 'Select Multi Signature',
    description: 'In the "Policy Type" dropdown, select "Multi Signature". Set your M-of-N threshold (e.g., 2-of-3).',
    icon: Users
  },
  {
    number: 3,
    title: 'Add First Keystore',
    description: 'Click the first keystore tab. Choose how to add it: connected hardware wallet, air-gapped (file/QR), or software signer.',
    icon: Key
  },
  {
    number: 4,
    title: 'Import from Hardware Wallet',
    description: 'For hardware wallets: click "Connected Hardware Wallet" or "Airgapped Hardware Wallet", then scan/import the xpub.',
    icon: HardDrive
  },
  {
    number: 5,
    title: 'Add Remaining Keystores',
    description: 'Repeat for each cosigner. Each keystore can be a different device type. Sparrow will show all xpubs when complete.',
    icon: Key
  },
  {
    number: 6,
    title: 'Review Script Type',
    description: 'Choose your script type: Native SegWit (P2WSH) is recommended for lowest fees. Nested SegWit (P2SH-P2WSH) for compatibility.',
    icon: FileText
  },
  {
    number: 7,
    title: 'Apply and Save',
    description: 'Click "Apply" to create the wallet. Sparrow will generate addresses from the combined xpubs.',
    icon: CheckCircle
  },
  {
    number: 8,
    title: 'Export Wallet Descriptor',
    description: 'Go to Settings → Export → Output Descriptor. Save this file - it\'s required to reconstruct the wallet!',
    icon: Download
  }
];

const keystoreTypes = [
  {
    type: 'Connected Hardware Wallet',
    description: 'Plug in via USB, click "Scan" to detect device and import xpub directly.',
    devices: ['Coldcard', 'Trezor', 'Ledger', 'BitBox', 'Keystone']
  },
  {
    type: 'Airgapped Hardware Wallet',
    description: 'Import xpub via QR code scan or from a file exported to SD card.',
    devices: ['Coldcard (SD card)', 'Keystone (QR)', 'Passport (QR)']
  },
  {
    type: 'Software Signer',
    description: 'Generate a new seed or import existing BIP39 words. Less secure than hardware.',
    devices: ['Sparrow-generated seed', 'Imported seed phrase']
  },
  {
    type: 'Watch Only (xpub)',
    description: 'Paste an xpub directly. Useful when you already have the public key from another source.',
    devices: ['Manual xpub entry', 'Imported from another wallet']
  }
];

export function MultisigSetup() {
  return (
    <div className={styles.container}>
      {/* Link to conceptual lesson */}
      <Card variant="gradient" padding="medium" className={styles.learnMoreCard}>
        <div className={styles.learnMoreContent}>
          <Users size={24} />
          <div>
            <strong>New to Multi-Signature?</strong>
            <p>Learn what multisig is, how it works, and how to choose the right configuration.</p>
          </div>
          <Link to="/lessons/multisig" className={styles.learnMoreLink}>
            Learn the Fundamentals
            <ArrowRight size={16} />
          </Link>
        </div>
      </Card>
      
      {/* Step by Step Setup */}
      <Card variant="elevated" padding="large">
        <h4 className={styles.sectionTitle}>Setting Up Multisig in Sparrow</h4>
        <p className={styles.sectionDescription}>
          Follow these steps to create a new multi-signature wallet in Sparrow:
        </p>
        
        <div className={styles.stepsContainer}>
          {setupSteps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.number}
                className={styles.step}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className={styles.stepNumber}>{step.number}</div>
                <div className={styles.stepContent}>
                  <div className={styles.stepHeader}>
                    <Icon size={16} />
                    <h5>{step.title}</h5>
                  </div>
                  <p>{step.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </Card>
      
      {/* Keystore Import Options */}
      <Card variant="elevated" padding="large">
        <h4 className={styles.sectionTitle}>Keystore Import Options</h4>
        <p className={styles.sectionDescription}>
          Each cosigner's public key can be imported in different ways:
        </p>
        
        <div className={styles.keystoreGrid}>
          {keystoreTypes.map((keystore, index) => (
            <div key={index} className={styles.keystoreCard}>
              <h5>{keystore.type}</h5>
              <p>{keystore.description}</p>
              <div className={styles.deviceTags}>
                {keystore.devices.map((device, i) => (
                  <span key={i} className={styles.deviceTag}>{device}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>
      
      {/* Sharing with Cosigners */}
      <Card variant="elevated" padding="large">
        <h4 className={styles.sectionTitle}>Sharing with Cosigners</h4>
        <p className={styles.sectionDescription}>
          All cosigners need the wallet configuration to build and sign transactions:
        </p>
        
        <div className={styles.sharingSteps}>
          <div className={styles.sharingStep}>
            <div className={styles.sharingIcon}>
              <Download size={20} />
            </div>
            <div>
              <strong>Export the Wallet File</strong>
              <p>Go to File → Export → Sparrow to save a .sparrow file that other Sparrow users can import.</p>
            </div>
          </div>
          
          <div className={styles.sharingStep}>
            <div className={styles.sharingIcon}>
              <FileText size={20} />
            </div>
            <div>
              <strong>Export Output Descriptor</strong>
              <p>Settings → Export → Output Descriptor creates a universal format any compatible wallet can use.</p>
            </div>
          </div>
          
          <div className={styles.sharingStep}>
            <div className={styles.sharingIcon}>
              <HardDrive size={20} />
            </div>
            <div>
              <strong>For Hardware Wallets</strong>
              <p>Export the wallet file to SD card for Coldcard, or display as QR for Keystone/Passport.</p>
            </div>
          </div>
        </div>
      </Card>
      
      {/* Critical Warning */}
      <div className={styles.warningBox}>
        <AlertTriangle size={24} />
        <div>
          <strong>Critical: Back Up the Descriptor</strong>
          <p>
            The output descriptor contains all the information needed to reconstruct your 
            multisig wallet. Without it, having all the seed phrases is NOT enough to 
            recover your funds. Store the descriptor separately from your seeds.
          </p>
        </div>
      </div>
      
      {/* Quick Tips */}
      <div className={styles.tipsGrid}>
        <div className={styles.tipCard}>
          <CheckCircle size={16} />
          <span>Test with a small amount before depositing significant funds</span>
        </div>
        <div className={styles.tipCard}>
          <CheckCircle size={16} />
          <span>Verify each cosigner can independently view the wallet</span>
        </div>
        <div className={styles.tipCard}>
          <CheckCircle size={16} />
          <span>Practice the full signing workflow before you need it</span>
        </div>
        <div className={styles.tipCard}>
          <CheckCircle size={16} />
          <span>Label your keystores clearly (e.g., "Coldcard - Home Safe")</span>
        </div>
      </div>
    </div>
  );
}

export default MultisigSetup;
