import { Coins, Send, RotateCcw, ArrowRight, ArrowDown } from 'lucide-react';
import { Card, Badge, Accordion } from '../../common';
import styles from './TransactionBuilder.module.css';

function formatBTC(sats) {
  return (sats / 100000000).toFixed(8).replace(/\.?0+$/, '');
}

// Static sample transaction data
// Fee calculation: 10 + (2 inputs × 148) + (2 outputs × 34) = 374 vBytes × 10 sat/vB = 3,740 sats
const SAMPLE_TRANSACTION = {
  inputs: [
    { id: 'utxo-1', amount: 50000000, label: 'Payment from Alice' },
    { id: 'utxo-2', amount: 30000000, label: 'Mining reward' }
  ],
  outputs: {
    recipient: { name: 'Bob', amount: 60000000 },
    change: { amount: 19996260 }
  },
  fee: 3740,
  feeRate: 10
};

function InputItem({ input }) {
  return (
    <div className={styles.inputItem}>
      <div className={styles.inputIcon}>
        <Coins size={16} />
      </div>
      <div className={styles.inputInfo}>
        <span className={styles.inputAmount}>{formatBTC(input.amount)} BTC</span>
        <span className={styles.inputLabel}>{input.label}</span>
      </div>
    </div>
  );
}

function OutputItem({ icon: Icon, label, amount, variant }) {
  return (
    <div className={`${styles.outputItem} ${variant === 'change' ? styles.changeOutput : ''}`}>
      <div className={styles.outputIcon}>
        <Icon size={16} />
      </div>
      <div className={styles.outputInfo}>
        <span className={styles.outputLabel}>{label}</span>
        <span className={styles.outputAmount}>{formatBTC(amount)} BTC</span>
      </div>
    </div>
  );
}

export function TransactionBuilder() {
  const { inputs, outputs, fee, feeRate } = SAMPLE_TRANSACTION;
  const inputTotal = inputs.reduce((sum, input) => sum + input.amount, 0);

  return (
    <div className={styles.container}>
      <Card variant="elevated" padding="large">
        <div className={styles.staticHeader}>
          <h3 className={styles.staticTitle}>Example Transaction</h3>
          <Badge variant="primary">Signed & Ready</Badge>
        </div>

        <div className={styles.transactionFlow}>
          {/* Inputs Section */}
          <div className={styles.flowSection}>
            <label className={styles.sectionLabel}>
              <span>Inputs</span>
              <Badge variant="outline" size="small">
                {formatBTC(inputTotal)} BTC
              </Badge>
            </label>
            <div className={styles.inputsList}>
              {inputs.map((input) => (
                <InputItem key={input.id} input={input} />
              ))}
            </div>
          </div>

          {/* Arrow */}
          <div className={styles.arrowSection}>
            <ArrowRight size={24} className={styles.arrowDesktop} />
            <ArrowDown size={24} className={styles.arrowMobile} />
          </div>

          {/* Outputs Section */}
          <div className={styles.flowSection}>
            <label className={styles.sectionLabel}>
              <span>Outputs</span>
            </label>
            <div className={styles.outputsList}>
              <OutputItem
                icon={Send}
                label={`Send to ${outputs.recipient.name}`}
                amount={outputs.recipient.amount}
              />
              <OutputItem
                icon={RotateCcw}
                label="Change (back to you)"
                amount={outputs.change.amount}
                variant="change"
              />
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className={styles.summary}>
          <div className={styles.summaryRow}>
            <span>Input Total:</span>
            <span>{formatBTC(inputTotal)} BTC</span>
          </div>
          <div className={styles.summaryRow}>
            <span>Sending:</span>
            <span className={styles.summaryHighlight}>- {formatBTC(outputs.recipient.amount)} BTC</span>
          </div>
          <div className={styles.summaryRow}>
            <span>Fee ({feeRate} sat/vB):</span>
            <span>- {fee.toLocaleString()} sats</span>
          </div>
          <div className={`${styles.summaryRow} ${styles.summaryTotal}`}>
            <span>Change:</span>
            <span>{formatBTC(outputs.change.amount)} BTC</span>
          </div>
        </div>

        <div className={styles.equationBox}>
          <span className={styles.equationPart}>
            <strong>Inputs</strong> ({formatBTC(inputTotal)})
          </span>
          <span className={styles.equationOperator}>=</span>
          <span className={styles.equationPart}>
            <strong>Send</strong> ({formatBTC(outputs.recipient.amount)})
          </span>
          <span className={styles.equationOperator}>+</span>
          <span className={styles.equationPart}>
            <strong>Change</strong> ({formatBTC(outputs.change.amount)})
          </span>
          <span className={styles.equationOperator}>+</span>
          <span className={styles.equationPart}>
            <strong>Fee</strong> ({fee.toLocaleString()} sats)
          </span>
        </div>
      </Card>

      {/* Deep Dive */}
      <Accordion 
        title="Deep Dive: Transaction Structure" 
        variant="deepdive"
        icon={<Coins size={16} />}
      >
        <p>
          Bitcoin transactions are composed of <strong>inputs</strong> and <strong>outputs</strong>:
        </p>
        <ul>
          <li><strong>Inputs</strong> reference previous transaction outputs (UTXOs) that you're spending</li>
          <li><strong>Outputs</strong> define where the bitcoin goes - typically one to the recipient and one for change</li>
        </ul>
        <p>
          Each input requires a digital signature to prove you own the coins. 
          This signature is verified by every node in the network.
        </p>
      </Accordion>
    </div>
  );
}

export default TransactionBuilder;
