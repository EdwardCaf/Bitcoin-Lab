import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle2,
  Edit3,
  RotateCcw,
  Link as LinkIcon,
  Unlink
} from 'lucide-react';
import { Card, Button, Accordion } from '../../common';
import styles from './ChainTamperDemo.module.css';

function simpleHash(input) {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return '0000' + Math.abs(hash).toString(16).padStart(8, '0');
}

const initialBlocks = [
  { id: 1, data: 'Genesis Block', originalData: 'Genesis Block' },
  { id: 2, data: 'Alice pays Bob 5 BTC', originalData: 'Alice pays Bob 5 BTC' },
  { id: 3, data: 'Bob pays Charlie 2 BTC', originalData: 'Bob pays Charlie 2 BTC' },
];

export function ChainTamperDemo() {
  const [blocks, setBlocks] = useState(initialBlocks);
  const [editingBlock, setEditingBlock] = useState(null);
  const [editValue, setEditValue] = useState('');
  
  // Calculate hashes for all blocks, considering in-progress edits
  const calculateChain = useCallback(() => {
    let prevHash = '0000000000000000';
    return blocks.map((block, index) => {
      // Use the edit value if this block is being edited, otherwise use block data
      const currentData = editingBlock === block.id ? editValue : block.data;
      const fullData = `${prevHash}|${currentData}`;
      const hash = simpleHash(fullData);
      const isModified = currentData !== block.originalData;
      const result = {
        ...block,
        prevHash,
        hash,
        currentData,
        isValid: !isModified,
        index
      };
      prevHash = hash;
      return result;
    });
  }, [blocks, editingBlock, editValue]);
  
  const chainData = calculateChain();
  const isChainBroken = chainData.some(b => !b.isValid);
  
  const startEditing = (block) => {
    setEditingBlock(block.id);
    setEditValue(block.data);
  };
  
  const saveEdit = (id) => {
    setBlocks(blocks.map(b => 
      b.id === id ? { ...b, data: editValue } : b
    ));
    setEditingBlock(null);
  };
  
  const cancelEdit = () => {
    setEditingBlock(null);
    setEditValue('');
  };
  
  const resetChain = () => {
    setBlocks(initialBlocks);
    setEditingBlock(null);
  };
  
  return (
    <div className={styles.container}>
      <Card variant="elevated" padding="large">
        <div className={styles.header}>
          <div className={styles.titleSection}>
            <div className={styles.iconWrapper}>
              <Shield size={24} />
            </div>
            <div>
              <h3 className={styles.title}>Blockchain Immutability Demo</h3>
              <p className={styles.subtitle}>
                Try to change a block and see what happens to the chain
              </p>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="small"
            icon={<RotateCcw size={14} />}
            onClick={resetChain}
          >
            Reset
          </Button>
        </div>
        
        {/* Chain Status */}
        <div className={`${styles.statusBar} ${isChainBroken ? styles.broken : styles.valid}`}>
          {isChainBroken ? (
            <>
              <AlertTriangle size={20} />
              <span>Chain Integrity Broken! Tampering detected.</span>
            </>
          ) : (
            <>
              <CheckCircle2 size={20} />
              <span>Chain Integrity Valid - All blocks verified</span>
            </>
          )}
        </div>
        
        {/* Blockchain */}
        <div className={styles.blockchain}>
          {chainData.map((block, index) => (
            <div key={block.id} className={styles.blockWrapper}>
              <motion.div 
                className={`${styles.block} ${!block.isValid ? styles.tampered : ''}`}
                animate={!block.isValid ? { x: [0, -5, 5, -5, 5, 0] } : {}}
                transition={{ duration: 0.5 }}
              >
                <div className={styles.blockHeader}>
                  <span className={styles.blockNumber}>Block {block.id}</span>
                  {!block.isValid && (
                    <span className={styles.tamperedBadge}>
                      <AlertTriangle size={12} />
                      Modified
                    </span>
                  )}
                </div>
                
                <div className={styles.blockContent}>
                  <div className={styles.field}>
                    <span className={styles.fieldLabel}>Data:</span>
                    {editingBlock === block.id ? (
                      <div className={styles.editField}>
                        <input
                          type="text"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className={styles.editInput}
                          autoFocus
                        />
                        <Button size="small" onClick={() => saveEdit(block.id)}>
                          Save
                        </Button>
                        <Button size="small" variant="ghost" onClick={cancelEdit}>
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <div className={styles.dataField}>
                        <span className={styles.fieldValue}>{block.data}</span>
                        <button
                          className={styles.editButton}
                          onClick={() => startEditing(block)}
                          title="Edit data"
                        >
                          <Edit3 size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                  
                  <div className={styles.field}>
                    <span className={styles.fieldLabel}>Prev Hash:</span>
                    <code className={styles.hashValue}>{block.prevHash}</code>
                  </div>
                  
                  <div className={styles.field}>
                    <span className={styles.fieldLabel}>This Hash:</span>
                    <code className={`${styles.hashValue} ${!block.isValid ? styles.changed : ''}`}>
                      {block.hash}
                    </code>
                  </div>
                </div>
              </motion.div>
              
              {index < chainData.length - 1 && (
                <div className={`${styles.chainLink} ${!chainData[index + 1].isValid ? styles.broken : ''}`}>
                  {!block.isValid || !chainData[index + 1].isValid ? (
                    <Unlink size={20} />
                  ) : (
                    <LinkIcon size={20} />
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
        
        {/* Explanation */}
        {isChainBroken && (
          <motion.div
            className={styles.explanation}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h4>What Happened?</h4>
            <p>
              When you changed the data in a block, its hash changed. But the next block 
              still references the old hash, breaking the chain. To "fix" this, an attacker 
              would need to recalculate the hash for every subsequent block - and do it 
              faster than the entire network is adding new blocks.
            </p>
            <p>
              With thousands of miners worldwide producing new blocks every 10 minutes, 
              this is computationally impossible for historical blocks.
            </p>
          </motion.div>
        )}
      </Card>
      
      <Accordion
        title="Deep Dive: Why Blockchains Are Immutable"
        variant="deepdive"
        icon={<Shield size={16} />}
      >
        <p>
          Blockchain immutability comes from three key properties:
        </p>
        <ul>
          <li>
            <strong>Hash Chaining:</strong> Each block contains the hash of the previous 
            block. Changing any data changes all subsequent hashes.
          </li>
          <li>
            <strong>Proof of Work:</strong> Finding valid hashes requires enormous 
            computational effort. Rewriting history means redoing all that work.
          </li>
          <li>
            <strong>Decentralization:</strong> Thousands of nodes have copies of the 
            blockchain. An attacker would need to convince more than half to accept 
            their altered version.
          </li>
        </ul>
        <p>
          Together, these make altering historical transactions practically impossible. 
          This is why Bitcoin is often called "digital gold" - it can't be counterfeited 
          or double-spent.
        </p>
      </Accordion>
    </div>
  );
}

export default ChainTamperDemo;
