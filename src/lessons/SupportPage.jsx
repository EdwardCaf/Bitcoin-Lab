import { motion } from 'framer-motion';
import {
  Handshake,
  Wallet,
  KeyRound,
  ShieldCheck,
  GraduationCap,
  ExternalLink
} from 'lucide-react';
import { Badge, Button } from '../components/common';
import styles from './SupportPage.module.css';

const FEATURES = [
  {
    icon: Wallet,
    title: 'Wallet Setup',
    description: 'Properly configure hardware and software wallets, ensuring they\'re secure and tailored to your needs.'
  },
  {
    icon: KeyRound,
    title: 'Key Management',
    description: 'Master seed phrase storage, backups, and best practices for protecting your bitcoin keys.'
  },
  {
    icon: ShieldCheck,
    title: 'Privacy & Security',
    description: 'Learn to protect your bitcoin wealth from hackers, thieves, and prying eyes.'
  },
  {
    icon: GraduationCap,
    title: 'Advanced Topics',
    description: 'Multi-signature vaults, node setup, inheritance planning, Lightning Network, and more.'
  }
];

function FeatureCard({ feature, index }) {
  const Icon = feature.icon;

  return (
    <motion.div
      className={styles.featureCard}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <div className={styles.featureIcon}>
        <Icon size={24} />
      </div>
      <h3 className={styles.featureTitle}>{feature.title}</h3>
      <p className={styles.featureDescription}>{feature.description}</p>
    </motion.div>
  );
}

export function SupportPage() {
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
          1-on-1 Bitcoin <span className={styles.heroHighlight}>Support</span>
        </h1>

        <p className={styles.heroTagline}>
          True bitcoin ownership, taught the right way.
        </p>
        
        <p className={styles.heroText}>
          The bitcoin journey is unique to everyone. Get personalized guidance from 
          experienced mentors who will help you achieve true self-sovereign bitcoin ownership.
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
      </motion.section>

      {/* Features Section */}
      <motion.section
        className={styles.features}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.5 }}
      >
        <h2 className={styles.sectionTitle}>What You'll Learn</h2>
        <div className={styles.featureGrid}>
          {FEATURES.map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index} />
          ))}
        </div>
      </motion.section>

    </div>
  );
}

export default SupportPage;
