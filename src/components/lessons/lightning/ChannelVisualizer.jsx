import { Zap, ArrowLeftRight, Lock, Unlock, Link2 } from 'lucide-react';
import { Card, Badge, Accordion } from '../../common';
import styles from './ChannelVisualizer.module.css';

const ALICE_BALANCE = 0.35;
const BOB_BALANCE = 0.65;
const CHANNEL_CAPACITY = 1.0;

export function ChannelVisualizer() {
  const alicePercent = (ALICE_BALANCE / CHANNEL_CAPACITY) * 100;
  const bobPercent = (BOB_BALANCE / CHANNEL_CAPACITY) * 100;

  return (
    <div className={styles.container}>
      <Card variant="elevated" padding="large">
        <div className={styles.header}>
          <div className={styles.titleSection}>
            <div className={styles.iconWrapper}>
              <Zap size={24} />
            </div>
            <div>
              <h3 className={styles.title}>Payment Channel</h3>
              <p className={styles.subtitle}>
                A bidirectional payment channel between two parties
              </p>
            </div>
          </div>
          
          <Badge variant="success">Channel Open</Badge>
        </div>

        {/* Channel Visualization */}
        <div className={styles.channelViz}>
          {/* Alice Side */}
          <div className={styles.participant}>
            <div className={styles.avatarWrapper}>
              <div className={styles.avatar} data-party="alice">
                A
              </div>
              <div className={styles.nodeGlow} data-party="alice" />
            </div>
            <span className={styles.name}>Alice</span>
            <span className={styles.balance}>{ALICE_BALANCE} BTC</span>
            <span className={styles.balanceLabel}>Local Balance</span>
          </div>

          {/* Channel Connection */}
          <div className={styles.channelConnection}>
            {/* Connection Line */}
            <div className={styles.connectionLine}>
              <div className={styles.lineSegment} />
              <div className={styles.channelIcon}>
                <Link2 size={16} />
              </div>
              <div className={styles.lineSegment} />
            </div>

            {/* Balance Bar */}
            <div className={styles.balanceBarContainer}>
              <div className={styles.balanceBar}>
                <div 
                  className={styles.aliceBalance}
                  style={{ width: `${alicePercent}%` }}
                >
                  <span className={styles.balancePercent}>{Math.round(alicePercent)}%</span>
                </div>
                <div 
                  className={styles.bobBalance}
                  style={{ width: `${bobPercent}%` }}
                >
                  <span className={styles.balancePercent}>{Math.round(bobPercent)}%</span>
                </div>
              </div>
              <div className={styles.capacityLabel}>
                <span>Capacity: {CHANNEL_CAPACITY} BTC</span>
              </div>
            </div>

            {/* Bidirectional Arrows */}
            <div className={styles.flowIndicator}>
              <ArrowLeftRight size={18} />
              <span>Instant payments</span>
            </div>
          </div>

          {/* Bob Side */}
          <div className={styles.participant}>
            <div className={styles.avatarWrapper}>
              <div className={styles.avatar} data-party="bob">
                B
              </div>
              <div className={styles.nodeGlow} data-party="bob" />
            </div>
            <span className={styles.name}>Bob</span>
            <span className={styles.balance}>{BOB_BALANCE} BTC</span>
            <span className={styles.balanceLabel}>Remote Balance</span>
          </div>
        </div>

        {/* Channel Properties */}
        <div className={styles.propertiesGrid}>
          <div className={styles.propertyCard}>
            <div className={styles.propertyIcon} data-type="lock">
              <Lock size={18} />
            </div>
            <div className={styles.propertyContent}>
              <span className={styles.propertyLabel}>Funding</span>
              <span className={styles.propertyValue}>2-of-2 Multisig</span>
            </div>
          </div>
          
          <div className={styles.propertyCard}>
            <div className={styles.propertyIcon} data-type="zap">
              <Zap size={18} />
            </div>
            <div className={styles.propertyContent}>
              <span className={styles.propertyLabel}>Latency</span>
              <span className={styles.propertyValue}>~50ms</span>
            </div>
          </div>
          
          <div className={styles.propertyCard}>
            <div className={styles.propertyIcon} data-type="unlock">
              <Unlock size={18} />
            </div>
            <div className={styles.propertyContent}>
              <span className={styles.propertyLabel}>Settlement</span>
              <span className={styles.propertyValue}>1 On-chain Tx</span>
            </div>
          </div>
        </div>

        {/* How it works summary */}
        <div className={styles.summaryBox}>
          <h4>How Payment Channels Work</h4>
          <div className={styles.summarySteps}>
            <div className={styles.summaryStep}>
              <span className={styles.stepNumber}>1</span>
              <div>
                <strong>Open</strong>
                <p>Lock funds in a 2-of-2 multisig (1 on-chain tx)</p>
              </div>
            </div>
            <div className={styles.summaryStep}>
              <span className={styles.stepNumber}>2</span>
              <div>
                <strong>Transact</strong>
                <p>Unlimited instant payments off-chain</p>
              </div>
            </div>
            <div className={styles.summaryStep}>
              <span className={styles.stepNumber}>3</span>
              <div>
                <strong>Close</strong>
                <p>Settle final balances on-chain (1 tx)</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Accordion
        title="Deep Dive: How Payment Channels Work"
        variant="deepdive"
        icon={<Zap size={16} />}
      >
        <p>
          Payment channels are the foundation of the Lightning Network. Here's how they work:
        </p>
        <ul>
          <li>
            <strong>Opening:</strong> Both parties deposit funds into a 2-of-2 multisig address 
            on the Bitcoin blockchain. This is the "funding transaction."
          </li>
          <li>
            <strong>Updating:</strong> Instead of broadcasting transactions, both parties sign 
            new "commitment transactions" that reflect the updated balances. These are kept 
            off-chain but can be broadcast if needed.
          </li>
          <li>
            <strong>Closing:</strong> When done, either party can broadcast the latest commitment 
            transaction, or they can cooperatively close with a simpler transaction.
          </li>
        </ul>
        <p>
          <strong>Key insight:</strong> The channel can update thousands of times, but only 2 
          on-chain transactions are needed (open and close). This is why Lightning is so scalable!
        </p>
      </Accordion>
    </div>
  );
}

export default ChannelVisualizer;
