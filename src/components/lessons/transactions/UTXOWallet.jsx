import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDraggable } from '@dnd-kit/core';
import { Coins, Info, Clock, CheckCircle2 } from 'lucide-react';
import { Card, Tooltip, Badge } from '../../common';
import styles from './UTXOWallet.module.css';

function formatBTC(sats) {
  return (sats / 100000000).toFixed(8).replace(/\.?0+$/, '');
}

function DraggableCoin({ utxo, isSelected, onSelect, disabled }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: utxo.id,
    data: utxo,
    disabled
  });

  const style = transform ? {
    transform: `translate(${transform.x}px, ${transform.y}px)`,
    zIndex: isDragging ? 1000 : 1,
  } : undefined;

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`${styles.coin} ${isSelected ? styles.selected : ''} ${isDragging ? styles.dragging : ''} ${disabled ? styles.disabled : ''}`}
      onClick={() => !disabled && onSelect(utxo)}
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      layout
    >
      <div className={styles.coinHeader}>
        <div className={styles.coinIcon}>
          <Coins size={20} />
        </div>
        <span className={styles.coinAmount}>{formatBTC(utxo.amount)} BTC</span>
      </div>
      
      <div className={styles.coinDetails}>
        <span className={styles.coinLabel}>{utxo.label}</span>
        <div className={styles.coinMeta}>
          <Tooltip content={`${utxo.confirmations} confirmations`}>
            <span className={styles.confirmations}>
              {utxo.confirmations >= 6 ? (
                <CheckCircle2 size={12} className={styles.confirmed} />
              ) : (
                <Clock size={12} />
              )}
              {utxo.confirmations}
            </span>
          </Tooltip>
        </div>
      </div>
      
      {isSelected && (
        <motion.div 
          className={styles.selectedBadge}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
        >
          <CheckCircle2 size={14} />
        </motion.div>
      )}
    </motion.div>
  );
}

export function UTXOWallet({ 
  utxos = [], 
  selectedUtxos = [],
  onSelect,
  showTotal = true,
  interactive = true,
  title = "Your Wallet"
}) {
  const totalBalance = utxos.reduce((sum, utxo) => sum + utxo.amount, 0);
  const selectedBalance = selectedUtxos.reduce((sum, utxo) => sum + utxo.amount, 0);

  const handleSelect = (utxo) => {
    if (!interactive || !onSelect) return;
    
    const isAlreadySelected = selectedUtxos.some(u => u.id === utxo.id);
    if (isAlreadySelected) {
      onSelect(selectedUtxos.filter(u => u.id !== utxo.id));
    } else {
      onSelect([...selectedUtxos, utxo]);
    }
  };

  return (
    <Card variant="gradient" padding="large" className={styles.wallet}>
      <div className={styles.header}>
        <div className={styles.titleRow}>
          <h3 className={styles.title}>{title}</h3>
          <Tooltip content="Your wallet contains individual coins (UTXOs) that you can spend. Each coin came from a previous transaction.">
            <Info size={16} className={styles.infoIcon} />
          </Tooltip>
        </div>
        
        {showTotal && (
          <div className={styles.balance}>
            <span className={styles.balanceLabel}>Total Balance</span>
            <span className={styles.balanceAmount}>{formatBTC(totalBalance)} BTC</span>
          </div>
        )}
      </div>

      <div className={styles.coinsGrid}>
        <AnimatePresence mode="popLayout">
          {utxos.map((utxo) => (
            <DraggableCoin
              key={utxo.id}
              utxo={utxo}
              isSelected={selectedUtxos.some(u => u.id === utxo.id)}
              onSelect={handleSelect}
              disabled={!interactive}
            />
          ))}
        </AnimatePresence>
      </div>

      {interactive && selectedUtxos.length > 0 && (
        <motion.div 
          className={styles.selectionSummary}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Badge variant="primary">
            {selectedUtxos.length} coin{selectedUtxos.length > 1 ? 's' : ''} selected
          </Badge>
          <span className={styles.selectedAmount}>
            {formatBTC(selectedBalance)} BTC
          </span>
        </motion.div>
      )}

      {interactive && (
        <p className={styles.hint}>
          Click or drag coins to select them for your transaction
        </p>
      )}
    </Card>
  );
}

export default UTXOWallet;
