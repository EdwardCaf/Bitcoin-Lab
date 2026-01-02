import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeftRight, Coins, Send, Gauge } from 'lucide-react';
import { LessonLayout } from '../components/layout';
import { Card, Accordion } from '../components/common';
import { TransactionBuilder, FeeVisualizer } from '../components/lessons/transactions';
import { generateSampleUTXOs } from '../utils/bitcoin';
import styles from './Lessons.module.css';

const sections = [
  { id: 'intro', title: 'Introduction' },
  { id: 'utxos', title: 'Understanding UTXOs' },
  { id: 'building', title: 'Building Transactions' },
  { id: 'fees', title: 'Transaction Fees' }
];

export function TransactionsLesson() {
  const [currentSection, setCurrentSection] = useState(0);

  const renderSection = () => {
    switch (currentSection) {
      case 0:
        return <IntroSection />;
      case 1:
        return <UTXOSection />;
      case 2:
        return <BuildingSection />;
      case 3:
        return <FeesSection />;
      default:
        return <IntroSection />;
    }
  };

  return (
    <LessonLayout
      lessonId="transactions"
      title="Transactions"
      description="Learn how Bitcoin transactions work - from UTXOs to fees"
      icon={ArrowLeftRight}
      sections={sections}
      currentSection={currentSection}
      onSectionChange={setCurrentSection}
      prevLesson={{ path: '/lessons/wallets', title: 'Wallets' }}
      nextLesson={{ path: '/lessons/utxo-management', title: 'UTXO Management' }}
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
          <ArrowLeftRight size={48} />
        </div>
        <h2 className={styles.heroTitle}>How Bitcoin Transactions Work</h2>
        <p className={styles.heroText}>
          Think of a Bitcoin transaction like paying with cash. You hand over specific bills, 
          and if you pay more than the price, you get change back.
        </p>
      </div>

      <div className={styles.conceptGrid}>
        <Card padding="large" hover>
          <div className={styles.conceptIcon}>
            <Coins size={24} />
          </div>
          <h3>Digital Coins (UTXOs)</h3>
          <p>
            Your Bitcoin wallet doesn't have a "balance" like a bank account. 
            Instead, it holds specific coins of different amounts that you've received.
          </p>
        </Card>

        <Card padding="large" hover>
          <div className={styles.conceptIcon}>
            <Send size={24} />
          </div>
          <h3>Inputs & Outputs</h3>
          <p>
            When you send Bitcoin, you select coins to spend (inputs) and 
            specify where they go (outputs) - typically the recipient and your change address.
          </p>
        </Card>

        <Card padding="large" hover>
          <div className={styles.conceptIcon}>
            <Gauge size={24} />
          </div>
          <h3>Transaction Fees</h3>
          <p>
            Fees incentivize miners to include your transaction in a block. 
            Higher fees = faster confirmation.
          </p>
        </Card>
      </div>

      <Accordion title="Analogy: Cash in Your Wallet" defaultOpen>
        <p>
          Imagine you want to buy a $7 coffee and you have a $10 bill and two $1 bills 
          in your wallet. You'd give the cashier the $10 bill and get $3 back as change.
        </p>
        <p>
          Bitcoin works similarly! If you have coins worth 0.5 BTC and 0.3 BTC, and you 
          want to send 0.6 BTC, you'd use the 0.5 BTC coin plus the 0.3 BTC coin (total 0.8 BTC), 
          and get approximately 0.2 BTC back as change (minus a small fee).
        </p>
      </Accordion>
    </motion.div>
  );
}

function UTXOSection() {
  const sampleUTXOs = generateSampleUTXOs();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={styles.section}
    >
      <h2 className={styles.sectionTitle}>Understanding UTXOs</h2>
      <p className={styles.sectionText}>
        <strong>UTXO</strong> stands for "Unspent Transaction Output." Every time you receive 
        Bitcoin, you get a new UTXO - think of it as a unique, indivisible coin.
      </p>

      {/* Visual UTXO Example */}
      <Card variant="gradient" padding="large" className={styles.utxoDemo}>
        <h3>Your Wallet Contains Individual Coins</h3>
        <div className={styles.utxoGrid}>
          {sampleUTXOs.map((utxo) => (
            <div key={utxo.id} className={styles.utxoCoin}>
              <Coins size={20} />
              <span className={styles.utxoAmount}>
                {(utxo.amount / 100000000).toFixed(2)} BTC
              </span>
              <span className={styles.utxoLabel}>{utxo.label}</span>
            </div>
          ))}
        </div>
        <p className={styles.utxoNote}>
          Total: {(sampleUTXOs.reduce((sum, u) => sum + u.amount, 0) / 100000000).toFixed(2)} BTC 
          across {sampleUTXOs.length} separate coins
        </p>
      </Card>

      <div className={styles.keyPoints}>
        <h3>Key Points</h3>
        <ul>
          <li>
            <strong>Each UTXO is unique</strong> - It has a specific amount and came from 
            a specific transaction
          </li>
          <li>
            <strong>UTXOs must be spent entirely</strong> - You can't spend "part" of a 
            coin; you must use the whole thing
          </li>
          <li>
            <strong>Change goes to a new UTXO</strong> - When you spend more than needed, 
            the difference becomes a new coin in your wallet
          </li>
        </ul>
      </div>

      <Accordion 
        title="Deep Dive: Why UTXOs?" 
        variant="deepdive"
        icon={<Coins size={16} />}
      >
        <p>
          The UTXO model provides several advantages:
        </p>
        <ul>
          <li>
            <strong>Privacy:</strong> UTXOs can use different addresses, making it harder 
            to link transactions
          </li>
          <li>
            <strong>Parallel validation:</strong> Different UTXOs can be verified independently
          </li>
          <li>
            <strong>Simple verification:</strong> To validate a transaction, you only need 
            to check if the UTXOs exist and haven't been spent
          </li>
        </ul>
      </Accordion>
    </motion.div>
  );
}

function BuildingSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={styles.section}
    >
      <h2 className={styles.sectionTitle}>Build Your First Transaction</h2>
      <p className={styles.sectionText}>
        Now let's build a transaction!
      </p>

      <TransactionBuilder />
    </motion.div>
  );
}

function FeesSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={styles.section}
    >
      <h2 className={styles.sectionTitle}>Transaction Fees</h2>
      <p className={styles.sectionText}>
        Transaction fees are how you incentivize miners to include your transaction in a block. 
        The mempool is like a waiting room - transactions with higher fees get picked first.
      </p>

      <FeeVisualizer />

      <Accordion 
        title="Deep Dive: How Fees Work" 
        variant="deepdive"
        icon={<Gauge size={16} />}
      >
        <p>
          Bitcoin transaction fees are based on the transaction's <strong>size in bytes</strong>, 
          not the amount being sent. Fees are measured in "satoshis per virtual byte" (sat/vB).
        </p>
        <p>Key concepts:</p>
        <ul>
          <li>
            <strong>Transaction size:</strong> More inputs/outputs = larger transaction = higher fee
          </li>
          <li>
            <strong>Fee market:</strong> During busy times, fees increase as users compete 
            for limited block space
          </li>
          <li>
            <strong>Replace-By-Fee (RBF):</strong> You can increase the fee on an unconfirmed 
            transaction to speed it up
          </li>
        </ul>
      </Accordion>
    </motion.div>
  );
}

export default TransactionsLesson;
