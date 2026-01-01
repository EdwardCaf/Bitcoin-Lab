import { useState } from 'react';
import { motion } from 'framer-motion';
import { Coins, Shield, Lock, Users, Target, AlertTriangle, Sparkles } from 'lucide-react';
import { LessonLayout } from '../components/layout';
import { Card, Accordion } from '../components/common';
import { 
  BlindSignatureDemo, 
  MintVisualizer, 
  PrivacyComparison, 
  FedimintExplorer 
} from '../components/lessons/ecash';
import styles from './Lessons.module.css';

const sections = [
  { id: 'intro', title: 'Introduction' },
  { id: 'cashu', title: 'How Cashu Works' },
  { id: 'privacy', title: 'Privacy & Trade-offs' },
  { id: 'fedimint', title: 'Fedimint' },
  { id: 'usecases', title: 'When to Use eCash' }
];

export function EcashLesson() {
  const [currentSection, setCurrentSection] = useState(0);

  const renderSection = () => {
    switch (currentSection) {
      case 0:
        return <IntroSection />;
      case 1:
        return <CashuSection />;
      case 2:
        return <PrivacySection />;
      case 3:
        return <FedimintSection />;
      case 4:
        return <UseCasesSection />;
      default:
        return <IntroSection />;
    }
  };

  return (
    <LessonLayout
      lessonId="ecash"
      title="eCash (Cashu & Fedimint)"
      description="Learn how Chaumian eCash enables near-perfect privacy on Bitcoin"
      icon={Coins}
      sections={sections}
      currentSection={currentSection}
      onSectionChange={setCurrentSection}
      prevLesson={{ path: '/lessons/liquid', title: 'Liquid Network' }}
    >
      {renderSection()}
    </LessonLayout>
  );
}

function IntroSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={styles.section}
    >
      <div className={styles.heroCard}>
        <div className={styles.heroIcon}>
          <Coins size={48} />
        </div>
        <h2 className={styles.heroTitle}>Chaumian eCash</h2>
        <p className={styles.heroText}>
          eCash is a revolutionary technology that helps bring near-perfect privacy to Bitcoin 
          using blind signatures - a cryptographic invention from the 1980s. Unlike Lightning's 
          onion routing or Bitcoin's pseudonymity, eCash provides true unlinkability where 
          even the mint cannot track users.
        </p>
      </div>

      <div className={styles.conceptGrid}>
        <Card padding="large" hover>
          <div className={styles.conceptIcon}>
            <Lock size={24} />
          </div>
          <h3>Near-perfect Privacy</h3>
          <p>
            Blind signatures mean the mint cannot link withdrawals to spends. Your transactions 
            are completely untraceable - better privacy than physical cash.
          </p>
        </Card>

        <Card padding="large" hover>
          <div className={styles.conceptIcon}>
            <Shield size={24} />
          </div>
          <h3>Instant & Free</h3>
          <p>
            Token transfers happen instantly with zero fees. No routing, no channels, 
            just pure peer-to-peer exchange of cryptographic tokens.
          </p>
        </Card>

        <Card padding="large" hover>
          <div className={styles.conceptIcon}>
            <AlertTriangle size={24} />
          </div>
          <h3>Custodial Trade-off</h3>
          <p>
            The mint holds your Bitcoin. You trade custody risk for near-perfect privacy. 
            This is why small amounts and trusted mints are critical.
          </p>
        </Card>
      </div>

      <Accordion title="The Casino Chips Analogy" defaultOpen>
        <p>
          eCash works like exchanging money for casino chips:
        </p>
        <ul>
          <li>
            <strong>Entering the casino:</strong> You exchange Bitcoin (via Lightning) for 
            eCash tokens at the mint. The mint holds your Bitcoin.
          </li>
          <li>
            <strong>Using chips:</strong> Inside the "casino" (the mint's system), you can 
            freely exchange tokens with others. The casino doesn't track who has which chips.
          </li>
          <li>
            <strong>Cashing out:</strong> When you're done, you exchange tokens back for 
            Bitcoin (via Lightning). The mint sends Bitcoin but can't link it to your original deposit.
          </li>
          <li>
            <strong>The risk:</strong> Just like a casino could refuse to honor chips, a mint 
            could disappear with your funds. Choose your casino (mint) wisely!
          </li>
        </ul>
      </Accordion>

      <div className={styles.factBox}>
        <h4>Historical Context</h4>
        <p>
          David Chaum invented eCash in 1983 - before the internet was mainstream! His company 
          DigiCash tried to bring it to banks in the 1990s but failed.
        </p>
      </div>
    </motion.div>
  );
}

function CashuSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={styles.section}
    >
      <h2 className={styles.sectionTitle}>How Cashu Works</h2>
      <p className={styles.sectionText}>
        Cashu is a modern implementation of Chaumian eCash built on Bitcoin and Lightning. 
        It uses blind signatures to create tokens that the mint can verify but cannot track. 
        Let's explore two of the core operations: minting tokens
        and melting them back to Bitcoin.
      </p>

      <MintVisualizer />


      <BlindSignatureDemo />
    </motion.div>
  );
}

function PrivacySection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={styles.section}
    >
      <h2 className={styles.sectionTitle}>Privacy & Custodial Trade-offs</h2>
      <p className={styles.sectionText}>
        eCash offers superior privacy compared to Bitcoin and Lightning, but at a significant 
        cost: you must trust the mint with your funds. This section explores both the remarkable 
        privacy benefits and the serious custodial risks you need to understand.
      </p>

      <PrivacyComparison />

      <Card variant="warning" padding="large" style={{ marginTop: 'var(--spacing-xl)' }}>
        <div className={styles.warningHeader}>
          <AlertTriangle size={24} />
          <h3>Understanding the Custodial Risk</h3>
        </div>
        <p className={styles.warningText}>
          <strong>eCash is custodial.</strong> The mint holds your Bitcoin. They could:
        </p>
        <ul>
          <li>Disappear with your funds (rug pull)</li>
          <li>Be shut down by authorities</li>
          <li>Suffer a technical failure or hack</li>
          <li>Freeze all tokens or refuse redemption</li>
        </ul>
        <p className={styles.warningText}>
          <strong>Mitigation strategies:</strong>
        </p>
        <ul>
          <li>Only use eCash for small amounts you can afford to lose</li>
          <li>Spread funds across multiple mints (diversify trust)</li>
          <li>Choose mints run by people/organizations you know and trust</li>
          <li>Think of eCash as a "hot wallet" for spending, not saving</li>
          <li>Regularly cycle funds in and out to minimize exposure</li>
        </ul>
      </Card>

      <Accordion
        title="Why Accept Custodial Risk?"
        variant="deepdive"
        icon={<Shield size={16} />}
      >
        <p>
          If eCash is custodial, why use it at all? Here's the value proposition:
        </p>
        <ul>
          <li>
            <strong>Privacy is worth it for some use cases:</strong> If you're making 
            privacy-critical payments (donations, sensitive purchases), the risk of losing 
            100 sats is worth the guarantee of near-perfect privacy.
          </li>
          <li>
            <strong>Better than custodial Lightning:</strong> Many users already trust 
            custodial Lightning wallets (Strike, Wallet of Satoshi). eCash offers the same 
            UX with dramatically better privacy.
          </li>
          <li>
            <strong>Practical for circular economies:</strong> In a local Bitcoin community 
            (Bitcoin Beach, Bitcoin Jungle), a community-run mint is more trusted than a 
            random third party.
          </li>
          <li>
            <strong>Layer of abstraction:</strong> eCash is interoperable with Lightning, 
            giving you Lightning's global reach with eCash's local privacy.
          </li>
        </ul>
        <p>
          The key is understanding the trade-off and using the right tool for each job. 
          Don't put your life savings in eCash, but don't let perfect be the enemy of good 
          for everyday private payments.
        </p>
      </Accordion>
    </motion.div>
  );
}

function FedimintSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={styles.section}
    >
      <h2 className={styles.sectionTitle}>Fedimint: Federated Chaumian Mints</h2>
      <p className={styles.sectionText}>
        Fedimint solves the "single mint" problem by distributing custody across multiple 
        guardians using threshold cryptography. Instead of trusting one party, you trust 
        that a majority of guardians won't collude. This is perfect for local Bitcoin 
        communities who know and trust multiple community members.
      </p>

      <FedimintExplorer />

      <Accordion
        title="Community Custody in Practice"
        variant="deepdive"
        icon={<Users size={16} />}
      >
        <h4>The Bitcoin Beach Example</h4>
        <p>
          Imagine a Bitcoin circular economy in El Salvador's Bitcoin Beach:
        </p>
        <ul>
          <li>
            <strong>Guardians:</strong> 5 trusted community members - the local surf shop 
            owner, a teacher, the pastor, a Bitcoin educator, and a tech volunteer.
          </li>
          <li>
            <strong>Threshold:</strong> 3-of-5 signatures required. Any 3 guardians can 
            approve transactions, so 2 can be offline or compromised without breaking the system.
          </li>
          <li>
            <strong>Social trust:</strong> These are known community members with reputations 
            to protect. Rug-pulling would destroy their standing in the community.
          </li>
          <li>
            <strong>Practical for everyday use:</strong> Residents can pay for coffee, groceries, 
            and services with near-perfect privacy and instant settlement, while trusting a distributed 
            set of community members instead of a single bank or company.
          </li>
        </ul>

        <h4>Why Not Just Use Lightning?</h4>
        <p>
          Fedimint makes sense when:
        </p>
        <ul>
          <li>Users lack the technical skill to run Lightning nodes</li>
          <li>Privacy is paramount (Lightning's privacy has limitations)</li>
          <li>The community wants local control instead of depending on external Lightning infrastructure</li>
          <li>Users prefer simple token-based payments over channel management</li>
        </ul>

        <h4>The Trust Model</h4>
        <p>
          Fedimint doesn't eliminate trust - it distributes it. You're trusting:
        </p>
        <ul>
          <li>That a majority of guardians won't collude to steal funds</li>
          <li>That guardians will maintain uptime and security</li>
          <li>That the community will hold guardians accountable</li>
        </ul>
        <p>
          This is a significant improvement over trusting a single custodian, but it's still 
          custodial. For many communities, especially in the Global South where traditional 
          banking is predatory, this trade-off makes sense.
        </p>
      </Accordion>
    </motion.div>
  );
}

function UseCasesSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={styles.section}
    >
      <h2 className={styles.sectionTitle}>When to Use eCash</h2>
      <p className={styles.sectionText}>
        eCash isn't meant to replace Bitcoin or Lightning - it's a specialized tool for 
        specific situations where privacy and simplicity matter more than full sovereignty. 
        Here's a practical guide for choosing the right layer.
      </p>

      <div className={styles.useCaseGrid}>
        <Card padding="large">
          <div className={styles.useCaseHeader}>
            <div className={styles.useCaseIcon} style={{ background: '#f7931a' }}>
              ₿
            </div>
            <h3>Use Bitcoin When...</h3>
          </div>
          <ul className={styles.useCaseList}>
            <li>
              <Target size={16} />
              <span>Saving for the long term (cold storage)</span>
            </li>
            <li>
              <Target size={16} />
              <span>Making large payments that need finality</span>
            </li>
            <li>
              <Target size={16} />
              <span>You need maximum security and don't mind fees</span>
            </li>
            <li>
              <Target size={16} />
              <span>Transparency is acceptable or even desirable</span>
            </li>
            <li>
              <Target size={16} />
              <span>Example: Buying a house, long-term savings, business settlements</span>
            </li>
          </ul>
        </Card>

        <Card padding="large">
          <div className={styles.useCaseHeader}>
            <div className={styles.useCaseIcon} style={{ background: '#ffc107' }}>
              ⚡
            </div>
            <h3>Use Lightning When...</h3>
          </div>
          <ul className={styles.useCaseList}>
            <li>
              <Target size={16} />
              <span>Making instant payments globally</span>
            </li>
            <li>
              <Target size={16} />
              <span>You want non-custodial control of your funds</span>
            </li>
            <li>
              <Target size={16} />
              <span>Privacy is important but not critical</span>
            </li>
            <li>
              <Target size={16} />
              <span>Medium amounts that justify channel management</span>
            </li>
            <li>
              <Target size={16} />
              <span>Example: Daily spending, streaming payments, tips, subscriptions</span>
            </li>
          </ul>
        </Card>

        <Card padding="large">
          <div className={styles.useCaseHeader}>
            <div className={styles.useCaseIcon} style={{ background: '#22c55e' }}>
              🪙
            </div>
            <h3>Use eCash When...</h3>
          </div>
          <ul className={styles.useCaseList}>
            <li>
              <Target size={16} />
              <span>Privacy is absolutely critical</span>
            </li>
            <li>
              <Target size={16} />
              <span>Making small, frequent payments</span>
            </li>
            <li>
              <Target size={16} />
              <span>You trust the mint/federation</span>
            </li>
            <li>
              <Target size={16} />
              <span>Simplicity matters more than sovereignty</span>
            </li>
            <li>
              <Target size={16} />
              <span>Example: Anonymous donations, local community payments, privacy-sensitive purchases</span>
            </li>
          </ul>
        </Card>
      </div>

      <Card variant="elevated" padding="large" style={{ marginTop: 'var(--spacing-xl)' }}>
        <h3>Real-World eCash Implementations</h3>
        <div className={styles.implementationGrid}>
          <div>
            <h4>Cashu</h4>
            <p>
              Lightweight eCash protocol. Easy to run a mint, perfect for individuals or 
              small groups. Available in mobile wallets like eNuts and Minibits.
            </p>
          </div>
          <div>
            <h4>Fedimint</h4>
            <p>
              Full-featured federated system with more robust infrastructure. Designed for 
              community-scale deployments. Used in Bitcoin circular economies.
            </p>
          </div>
          <div>
            <h4>Use Cases Today</h4>
            <p>
              Privacy-focused communities, Bitcoin meetups, circular economies in El Salvador 
              and elsewhere, and individuals seeking maximum transaction privacy.
            </p>
          </div>
        </div>
      </Card>

      <Accordion
        title="The Future of eCash"
        variant="deepdive"
        icon={<Sparkles size={16} />}
      >
        <p>
          eCash is early-stage technology, but it has enormous potential:
        </p>
        <ul>
          <li>
            <strong>Better UX than Lightning:</strong> No channels, no liquidity management, 
            just send and receive tokens. This could onboard the next billion users.
          </li>
          <li>
            <strong>Privacy by default:</strong> Unlike Bitcoin or Lightning where privacy 
            requires extra steps, eCash gives you near-perfect privacy automatically.
          </li>
          <li>
            <strong>Interoperability:</strong> eCash mints can connect via Lightning, creating 
            a network of private payment pools with global reach.
          </li>
        </ul>
        <p>
          <strong>The bottom line:</strong> eCash won't replace Bitcoin's base layer security 
          or Lightning's non-custodial payments. But it fills a crucial niche: simple, private, 
          instant payments for everyday use. In a world of increasing surveillance, that niche 
          might be more important than we think.
        </p>
      </Accordion>
    </motion.div>
  );
}

export default EcashLesson;
