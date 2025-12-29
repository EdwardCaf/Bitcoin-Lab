import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DndContext, DragOverlay, useDroppable } from '@dnd-kit/core';
import { 
  ArrowRight, 
  Plus, 
  Trash2, 
  AlertCircle, 
  CheckCircle2,
  Coins,
  Send,
  RotateCcw
} from 'lucide-react';
import { Card, Button, Slider, Badge, Accordion } from '../../common';
import { UTXOWallet } from './UTXOWallet';
import { generateSampleUTXOs, SAMPLE_RECIPIENTS, calculateFee, FEE_RATES } from '../../../utils/bitcoin';
import styles from './TransactionBuilder.module.css';

function formatBTC(sats) {
  return (sats / 100000000).toFixed(8).replace(/\.?0+$/, '');
}

function DroppableInputs({ inputs, onRemove }) {
  const { setNodeRef, isOver } = useDroppable({ id: 'inputs-drop' });

  return (
    <div 
      ref={setNodeRef} 
      className={`${styles.dropZone} ${isOver ? styles.dropZoneActive : ''} ${inputs.length > 0 ? styles.hasItems : ''}`}
    >
      {inputs.length === 0 ? (
        <div className={styles.dropPlaceholder}>
          <Plus size={24} />
          <span>Drag coins here</span>
        </div>
      ) : (
        <div className={styles.inputsList}>
          {inputs.map((input) => (
            <motion.div
              key={input.id}
              className={styles.inputItem}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              layout
            >
              <div className={styles.inputIcon}>
                <Coins size={16} />
              </div>
              <div className={styles.inputInfo}>
                <span className={styles.inputAmount}>{formatBTC(input.amount)} BTC</span>
                <span className={styles.inputLabel}>{input.label}</span>
              </div>
              <button
                className={styles.removeButton}
                onClick={() => onRemove(input.id)}
                aria-label="Remove input"
              >
                <Trash2 size={14} />
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

export function TransactionBuilder({ onTransactionCreated }) {
  const [utxos] = useState(() => generateSampleUTXOs());
  const [selectedInputs, setSelectedInputs] = useState([]);
  const [recipient, setRecipient] = useState(SAMPLE_RECIPIENTS[0]);
  const [sendAmount, setSendAmount] = useState(0);
  const [feeRate, setFeeRate] = useState(10);
  const [showSuccess, setShowSuccess] = useState(false);
  const [activeDragId, setActiveDragId] = useState(null);

  // Calculate transaction details
  const inputTotal = useMemo(() => 
    selectedInputs.reduce((sum, input) => sum + input.amount, 0), 
    [selectedInputs]
  );

  const fee = useMemo(() => 
    calculateFee(selectedInputs.length || 1, 2, feeRate),
    [selectedInputs.length, feeRate]
  );

  const change = useMemo(() => 
    Math.max(0, inputTotal - sendAmount - fee),
    [inputTotal, sendAmount, fee]
  );

  const isValid = useMemo(() => {
    return selectedInputs.length > 0 && 
           sendAmount > 0 && 
           sendAmount <= inputTotal - fee &&
           inputTotal >= sendAmount + fee;
  }, [selectedInputs, sendAmount, inputTotal, fee]);

  // Update send amount when inputs change
  useEffect(() => {
    if (inputTotal > 0 && sendAmount === 0) {
      const maxSend = Math.max(0, inputTotal - fee);
      setSendAmount(Math.floor(maxSend * 0.8)); // Default to 80% of available
    }
  }, [inputTotal, fee]);

  const handleDragStart = (event) => {
    setActiveDragId(event.active.id);
  };

  const handleDragEnd = (event) => {
    setActiveDragId(null);
    const { active, over } = event;
    
    if (over && over.id === 'inputs-drop') {
      const utxo = utxos.find(u => u.id === active.id);
      if (utxo && !selectedInputs.some(i => i.id === utxo.id)) {
        setSelectedInputs([...selectedInputs, utxo]);
      }
    }
  };

  const handleRemoveInput = (id) => {
    setSelectedInputs(selectedInputs.filter(i => i.id !== id));
  };

  const handleReset = () => {
    setSelectedInputs([]);
    setSendAmount(0);
    setShowSuccess(false);
  };

  const handleCreateTransaction = () => {
    if (!isValid) return;
    setShowSuccess(true);
    onTransactionCreated?.({
      inputs: selectedInputs,
      outputs: [
        { address: recipient.address, amount: sendAmount },
        { address: 'change', amount: change }
      ],
      fee
    });
  };

  const maxSendAmount = Math.max(0, inputTotal - fee);
  const activeDragItem = activeDragId ? utxos.find(u => u.id === activeDragId) : null;

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className={styles.container}>
        {/* Left: Wallet */}
        <div className={styles.walletSection}>
          <UTXOWallet
            utxos={utxos.filter(u => !selectedInputs.some(i => i.id === u.id))}
            selectedUtxos={[]}
            interactive={true}
          />
        </div>

        {/* Right: Transaction Builder */}
        <div className={styles.builderSection}>
          <Card variant="elevated" padding="large">
            <div className={styles.builderHeader}>
              <h3 className={styles.builderTitle}>Build Transaction</h3>
              <Button
                variant="ghost"
                size="small"
                icon={<RotateCcw size={14} />}
                onClick={handleReset}
              >
                Reset
              </Button>
            </div>

            <AnimatePresence mode="wait">
              {showSuccess ? (
                <motion.div
                  className={styles.successState}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                >
                  <div className={styles.successIcon}>
                    <CheckCircle2 size={48} />
                  </div>
                  <h4>Transaction Created!</h4>
                  <p>Your simulated transaction is ready to be broadcast.</p>
                  <div className={styles.successDetails}>
                    <div className={styles.successRow}>
                      <span>Sent:</span>
                      <span>{formatBTC(sendAmount)} BTC</span>
                    </div>
                    <div className={styles.successRow}>
                      <span>To:</span>
                      <span>{recipient.name}</span>
                    </div>
                    <div className={styles.successRow}>
                      <span>Fee:</span>
                      <span>{fee.toLocaleString()} sats</span>
                    </div>
                    <div className={styles.successRow}>
                      <span>Change:</span>
                      <span>{formatBTC(change)} BTC</span>
                    </div>
                  </div>
                  <Button onClick={handleReset} variant="primary">
                    Create Another
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {/* Inputs Section */}
                  <div className={styles.section}>
                    <label className={styles.sectionLabel}>
                      <span>Inputs</span>
                      <Badge variant="outline" size="small">
                        {formatBTC(inputTotal)} BTC
                      </Badge>
                    </label>
                    <DroppableInputs 
                      inputs={selectedInputs} 
                      onRemove={handleRemoveInput}
                    />
                  </div>

                  {/* Arrow */}
                  <div className={styles.arrowSection}>
                    <ArrowRight size={24} />
                  </div>

                  {/* Outputs Section */}
                  <div className={styles.section}>
                    <label className={styles.sectionLabel}>Outputs</label>
                    
                    {/* Send Output */}
                    <div className={styles.outputCard}>
                      <div className={styles.outputHeader}>
                        <Send size={16} className={styles.outputIcon} />
                        <span>Send to {recipient.name}</span>
                      </div>
                      <Slider
                        value={sendAmount}
                        onChange={setSendAmount}
                        min={0}
                        max={maxSendAmount}
                        step={1000}
                        label="Amount"
                        formatValue={(v) => `${formatBTC(v)} BTC`}
                        disabled={inputTotal === 0}
                      />
                      <select
                        className={styles.recipientSelect}
                        value={recipient.id}
                        onChange={(e) => setRecipient(SAMPLE_RECIPIENTS.find(r => r.id === e.target.value))}
                      >
                        {SAMPLE_RECIPIENTS.slice(0, 3).map(r => (
                          <option key={r.id} value={r.id}>{r.name}</option>
                        ))}
                      </select>
                    </div>

                    {/* Change Output */}
                    <div className={`${styles.outputCard} ${styles.changeOutput}`}>
                      <div className={styles.outputHeader}>
                        <RotateCcw size={16} className={styles.outputIcon} />
                        <span>Change (back to you)</span>
                      </div>
                      <div className={styles.changeAmount}>
                        {formatBTC(change)} BTC
                      </div>
                    </div>
                  </div>

                  {/* Fee Section */}
                  <div className={styles.section}>
                    <label className={styles.sectionLabel}>Transaction Fee</label>
                    <div className={styles.feeCard}>
                      <Slider
                        value={feeRate}
                        onChange={setFeeRate}
                        min={1}
                        max={100}
                        step={1}
                        label="Fee Rate"
                        formatValue={(v) => `${v} sat/vB`}
                      />
                      <div className={styles.feeDetails}>
                        <span>Total Fee: {fee.toLocaleString()} sats</span>
                        <span className={styles.feeTime}>
                          {feeRate <= 5 ? '~1 hour' : feeRate <= 20 ? '~30 min' : feeRate <= 40 ? '~10 min' : 'Next block'}
                        </span>
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
                      <span className={styles.summaryHighlight}>- {formatBTC(sendAmount)} BTC</span>
                    </div>
                    <div className={styles.summaryRow}>
                      <span>Fee:</span>
                      <span>- {fee.toLocaleString()} sats</span>
                    </div>
                    <div className={`${styles.summaryRow} ${styles.summaryTotal}`}>
                      <span>Change:</span>
                      <span>{formatBTC(change)} BTC</span>
                    </div>
                  </div>

                  {/* Validation */}
                  {selectedInputs.length > 0 && !isValid && (
                    <motion.div 
                      className={styles.validationError}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <AlertCircle size={16} />
                      <span>Insufficient funds for this transaction</span>
                    </motion.div>
                  )}

                  {/* Create Button */}
                  <Button
                    variant="primary"
                    fullWidth
                    size="large"
                    disabled={!isValid}
                    onClick={handleCreateTransaction}
                    icon={<Send size={18} />}
                  >
                    Create Transaction
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
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
              <li>The <strong>fee</strong> is implicit: it's the difference between input and output totals</li>
            </ul>
            <p>
              Each input requires a digital signature to prove you own the coins. 
              This signature is verified by every node in the network.
            </p>
          </Accordion>
        </div>
      </div>

      {/* Drag Overlay */}
      <DragOverlay>
        {activeDragItem && (
          <div className={styles.dragPreview}>
            <Coins size={16} />
            <span>{formatBTC(activeDragItem.amount)} BTC</span>
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}

export default TransactionBuilder;
