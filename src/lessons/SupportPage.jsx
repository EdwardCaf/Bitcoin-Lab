import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Handshake,
  ExternalLink,
  Mail,
  Check
} from 'lucide-react';
import { Badge, Button } from '../components/common';
import styles from './SupportPage.module.css';

const XIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

export function SupportPage() {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('edward@bitcoinmentor.io');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <motion.section
        className={styles.hero}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Badge variant="primary" size="medium" icon={<Handshake size={14} />}>
          Personalized Mentorship
        </Badge>
        
        <h1 className={styles.heroTitle}>
          Bitcoin <span className={styles.heroHighlight}>Mentorship</span>
        </h1>

        <p className={styles.heroTagline}>
          Guidance to Financial Sovereignty
        </p>
        
        <p className={styles.heroText}>
          The bitcoin journey is unique to everyone. Get personalized guidance from an
          experienced mentor who will help you achieve true self-sovereign bitcoin ownership.
        </p>

        <div className={styles.heroCta}>
          <a 
            href="https://bitcoinmentor.io/?fluent-booking=calendar&host=edward-1712805121&event=30min" 
            target="_blank" 
            rel="noopener noreferrer"
            className={styles.ctaButtonLink}
          >
            <Button 
              variant="primary" 
              size="large"
              icon={<ExternalLink size={18} />}
            >
              Book a Free Session
            </Button>
          </a>
          <div className={styles.poweredByWrapper}>
            <span className={styles.poweredBy}>Powered by</span>
            <span className={styles.brandName}>Bitcoin Mentor</span>
          </div>
        </div>

        <div className={styles.socialSection}>
          <span className={styles.socialLabel}>Connect with me</span>
          <a 
            href="https://x.com/LiveFreeBTC" 
            target="_blank" 
            rel="noopener noreferrer"
            className={styles.socialLink}
          >
            <XIcon size={20} />
            <span className={styles.emailText}>@LiveFreeBTC</span>
          </a>
          <button 
            onClick={handleCopyEmail}
            className={styles.socialLink}
            type="button"
          >
            {copied ? <Check size={20} /> : <Mail size={20} />}
            <span className={styles.emailText}>
              {copied ? 'Copied!' : 'edward@bitcoinmentor.io'}
            </span>
          </button>
        </div>
      </motion.section>

    </div>
  );
}

export default SupportPage;
