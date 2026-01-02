import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Handshake,
  ExternalLink,
  Mail,
  Check,
  Shield,
  Target,
  Zap,
  ArrowRight
} from 'lucide-react';
import { Badge, Button } from '../components/common';
import styles from './SupportPage.module.css';

const XIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const valueProps = [
  { icon: Shield, text: 'Self-custody mastery' },
  { icon: Target, text: 'Personalized roadmap' },
  { icon: Zap, text: 'Accelerated learning' },
];

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
        className={styles.heroSection}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className={styles.heroBackground}>
          <div className={styles.heroGlow} />
          <div className={styles.heroGrid} />
        </div>
        
        <div className={styles.heroContent}>
          <motion.div
            className={styles.heroBadge}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Badge variant="primary" size="medium" icon={<Handshake size={14} />}>
              1-on-1 Bitcoin Mentorship
            </Badge>
          </motion.div>
          
          <motion.h1 
            className={styles.heroTitle}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Your Path to
            <span className={styles.heroHighlight}> Financial Sovereignty</span>
          </motion.h1>

          <motion.p 
            className={styles.heroSubtitle}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            Get personalized guidance from an experienced mentor who will help you achieve true self-sovereign bitcoin ownership.
          </motion.p>

          <motion.div 
            className={styles.valueProps}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {valueProps.map((prop, index) => (
              <div key={index} className={styles.valueProp}>
                <prop.icon size={18} className={styles.valuePropIcon} />
                <span>{prop.text}</span>
              </div>
            ))}
          </motion.div>

          <motion.div 
            className={styles.heroCta}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <a 
              href="https://bitcoinmentor.io/?fluent-booking=calendar&host=edward-1712805121&event=30min" 
              target="_blank" 
              rel="noopener noreferrer"
              className={styles.ctaPrimary}
            >
              <span>Book Your Free Session</span>
              <ArrowRight size={20} />
            </a>
            <p className={styles.ctaSubtext}>
              30-minute call &bull; No commitment &bull; 100% free
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* Connect Section */}
      <motion.section 
        className={styles.connectSection}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <span className={styles.socialLabel}>Connect with me</span>
        <div className={styles.socialLinks}>
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
