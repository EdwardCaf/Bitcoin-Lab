import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Monitor, 
  Keyboard, 
  QrCode, 
  HardDrive, 
  Battery, 
  Usb,
  Nfc,
  Camera
} from 'lucide-react';
import { Card } from '../../common';
import styles from './DeviceOverview.module.css';

const features = [
  {
    id: 'screen',
    title: '3.2" LCD Screen',
    description: 'Large 320x240 pixel display shows transaction details clearly. Verify addresses and amounts before signing.',
    icon: Monitor,
  },
  {
    id: 'qr-scanner',
    title: 'QR Code Scanner',
    description: 'Built-in camera with LED illumination scans QR codes for air-gapped transaction signing. No cables needed.',
    icon: Camera,
  },
  {
    id: 'keyboard',
    title: 'Full QWERTY Keyboard',
    description: 'Physical keys make entering long BIP39 passphrases easy and secure. No on-screen keyboard to spy on.',
    icon: Keyboard,
  },
  {
    id: 'sd-slots',
    title: 'Dual MicroSD Slots',
    description: 'Two SD card slots for backup, firmware updates, and PSBT file transfer. Push-pull design (not spring-loaded).',
    icon: HardDrive,
  },
  {
    id: 'battery',
    title: 'Battery Powered',
    description: 'Runs on 3x AAA batteries for true air-gapped operation. Never needs to connect to USB for power.',
    icon: Battery,
  },
  {
    id: 'usb-nfc',
    title: 'USB-C & NFC',
    description: 'Optional USB-C and NFC connectivity. Can be permanently disabled by cutting a PCB trace for maximum security.',
    icon: Usb,
  }
];

export function DeviceOverview() {
  const [activeFeature, setActiveFeature] = useState(null);

  return (
    <div className={styles.container}>
      <Card variant="elevated" padding="large">
        <div className={styles.layout}>
          <div className={styles.deviceContainer}>
            <img
              src="/coldcard-q-dark.png"
              alt="Coldcard Q hardware wallet"
              className={styles.deviceImage}
            />
            <p className={styles.imageNote}>
              Coldcard Q
            </p>
          </div>
          
          <div className={styles.featuresContainer}>
            <h4 className={styles.featuresTitle}>Key Features</h4>
            <div className={styles.featuresList}>
              {features.map((feature, index) => {
                const Icon = feature.icon;
                const isActive = activeFeature === feature.id;
                
                return (
                  <motion.div
                    key={feature.id}
                    className={`${styles.featureItem} ${isActive ? styles.active : ''}`}
                    onMouseEnter={() => setActiveFeature(feature.id)}
                    onMouseLeave={() => setActiveFeature(null)}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className={styles.featureIcon}>
                      <Icon size={18} />
                    </div>
                    <div className={styles.featureContent}>
                      <h5 className={styles.featureName}>{feature.title}</h5>
                      <p className={styles.featureDescription}>{feature.description}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </Card>
      
      <div className={styles.methodsGrid}>
        <Card padding="medium" hover>
          <div className={styles.methodIcon}>
            <QrCode size={24} />
          </div>
          <h4>QR Code</h4>
          <p>Scan and display QR codes for completely wireless transaction signing</p>
        </Card>
        
        <Card padding="medium" hover>
          <div className={styles.methodIcon}>
            <HardDrive size={24} />
          </div>
          <h4>MicroSD Card</h4>
          <p>Transfer PSBTs and backups via SD card - works with any computer</p>
        </Card>
        
        <Card padding="medium" hover>
          <div className={styles.methodIcon}>
            <Nfc size={24} />
          </div>
          <h4>NFC Tap</h4>
          <p>Tap-to-sign with compatible mobile wallets (can be disabled)</p>
        </Card>
        
        <Card padding="medium" hover>
          <div className={styles.methodIcon}>
            <Usb size={24} />
          </div>
          <h4>USB-C</h4>
          <p>Traditional USB connection available but not required (can be disabled)</p>
        </Card>
      </div>
    </div>
  );
}

export default DeviceOverview;
