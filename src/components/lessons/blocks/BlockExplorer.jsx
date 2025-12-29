import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Box, 
  Hash, 
  Clock, 
  Layers,
  ChevronRight,
  ArrowRight,
  Link as LinkIcon,
  FileText
} from 'lucide-react';
import { Card, Badge, Tooltip, Accordion } from '../../common';
import { sha256 } from '../../../utils/hash';
import { generateTxId } from '../../../utils/bitcoin';
import styles from './BlockExplorer.module.css';

// Generate sample blocks
function generateBlocks(count = 5) {
  const blocks = [];
  let prevHash = '0000000000000000000000000000000000000000000000000000000000000000';
  
  for (let i = 0; i < count; i++) {
    const height = 840000 + i;
    const txCount = Math.floor(Math.random() * 2000) + 500;
    const blockHash = '0000000000000000000' + Math.random().toString(16).slice(2, 47);
    
    blocks.push({
      height,
      hash: blockHash,
      prevHash,
      timestamp: Date.now() - (count - i) * 10 * 60 * 1000,
      txCount,
      size: Math.floor(Math.random() * 1500000) + 500000,
      nonce: Math.floor(Math.random() * 4000000000),
      merkleRoot: generateTxId(),
      difficulty: '53.91T',
      version: 0x20000000
    });
    
    prevHash = blockHash;
  }
  
  return blocks.reverse();
}

function BlockCard({ block, isSelected, onClick, isLatest }) {
  return (
    <motion.div
      className={`${styles.blockCard} ${isSelected ? styles.selected : ''}`}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      layout
    >
      <div className={styles.blockHeader}>
        <div className={styles.blockIcon}>
          <Box size={20} />
        </div>
        <div className={styles.blockInfo}>
          <span className={styles.blockHeight}>Block #{block.height.toLocaleString()}</span>
          {isLatest && <Badge variant="success" size="small">Latest</Badge>}
        </div>
      </div>
      
      <div className={styles.blockMeta}>
        <div className={styles.metaItem}>
          <FileText size={12} />
          <span>{block.txCount.toLocaleString()} txs</span>
        </div>
        <div className={styles.metaItem}>
          <Clock size={12} />
          <span>{new Date(block.timestamp).toLocaleTimeString()}</span>
        </div>
      </div>
      
      <div className={styles.blockHash}>
        <span className={styles.hashLabel}>Hash</span>
        <code className={styles.hashValue}>{block.hash.slice(0, 16)}...</code>
      </div>
    </motion.div>
  );
}

function BlockDetails({ block }) {
  if (!block) return null;
  
  const formatSize = (bytes) => {
    if (bytes >= 1000000) return (bytes / 1000000).toFixed(2) + ' MB';
    return (bytes / 1000).toFixed(2) + ' KB';
  };
  
  return (
    <motion.div
      className={styles.details}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      key={block.height}
    >
      <h4 className={styles.detailsTitle}>
        <Box size={18} />
        Block #{block.height.toLocaleString()}
      </h4>
      
      <div className={styles.detailsGrid}>
        <div className={styles.detailItem}>
          <span className={styles.detailLabel}>Block Hash</span>
          <code className={styles.detailValue}>{block.hash}</code>
        </div>
        
        <div className={styles.detailItem}>
          <span className={styles.detailLabel}>Previous Block Hash</span>
          <code className={styles.detailValue}>{block.prevHash}</code>
        </div>
        
        <div className={styles.detailItem}>
          <span className={styles.detailLabel}>Merkle Root</span>
          <code className={styles.detailValue}>{block.merkleRoot}</code>
        </div>
        
        <div className={styles.detailRow}>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Timestamp</span>
            <span className={styles.detailText}>
              {new Date(block.timestamp).toLocaleString()}
            </span>
          </div>
          
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Transactions</span>
            <span className={styles.detailText}>{block.txCount.toLocaleString()}</span>
          </div>
        </div>
        
        <div className={styles.detailRow}>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Size</span>
            <span className={styles.detailText}>{formatSize(block.size)}</span>
          </div>
          
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Nonce</span>
            <span className={styles.detailText}>{block.nonce.toLocaleString()}</span>
          </div>
        </div>
        
        <div className={styles.detailRow}>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Difficulty</span>
            <span className={styles.detailText}>{block.difficulty}</span>
          </div>
          
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Version</span>
            <span className={styles.detailText}>0x{block.version.toString(16)}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function BlockExplorer() {
  const [blocks] = useState(() => generateBlocks(5));
  const [selectedBlock, setSelectedBlock] = useState(blocks[0]);
  
  return (
    <div className={styles.container}>
      <Card variant="elevated" padding="large">
        <div className={styles.header}>
          <div className={styles.titleSection}>
            <div className={styles.iconWrapper}>
              <Layers size={24} />
            </div>
            <div>
              <h3 className={styles.title}>Block Explorer</h3>
              <p className={styles.subtitle}>
                Click on a block to see its details
              </p>
            </div>
          </div>
        </div>
        
        {/* Blockchain visualization */}
        <div className={styles.chain}>
          {blocks.map((block, index) => (
            <div key={block.height} className={styles.chainItem}>
              <BlockCard
                block={block}
                isSelected={selectedBlock?.height === block.height}
                onClick={() => setSelectedBlock(block)}
                isLatest={index === 0}
              />
              {index < blocks.length - 1 && (
                <div className={styles.chainLink}>
                  <LinkIcon size={16} />
                </div>
              )}
            </div>
          ))}
        </div>
        
        {/* Selected block details */}
        <BlockDetails block={selectedBlock} />
      </Card>
      
      {/* Chain Integrity Explanation */}
      <Card padding="large" className={styles.integrityCard}>
        <h4>
          <LinkIcon size={18} />
          How Blocks Link Together
        </h4>
        <div className={styles.integrityDemo}>
          <div className={styles.integrityBlock}>
            <span className={styles.integrityLabel}>Block N</span>
            <div className={styles.integrityHash}>
              Hash: <code>0000...abc</code>
            </div>
          </div>
          <ArrowRight size={24} className={styles.integrityArrow} />
          <div className={styles.integrityBlock}>
            <span className={styles.integrityLabel}>Block N+1</span>
            <div className={styles.integrityPrev}>
              Prev: <code>0000...abc</code>
            </div>
            <div className={styles.integrityHash}>
              Hash: <code>0000...def</code>
            </div>
          </div>
          <ArrowRight size={24} className={styles.integrityArrow} />
          <div className={styles.integrityBlock}>
            <span className={styles.integrityLabel}>Block N+2</span>
            <div className={styles.integrityPrev}>
              Prev: <code>0000...def</code>
            </div>
            <div className={styles.integrityHash}>
              Hash: <code>0000...ghi</code>
            </div>
          </div>
        </div>
        <p className={styles.integrityText}>
          Each block contains the hash of the previous block. If any data in an old block 
          changes, its hash changes, breaking the chain. This makes the blockchain tamper-evident.
        </p>
      </Card>
      
      <Accordion
        title="Deep Dive: Block Header Structure"
        variant="deepdive"
        icon={<Box size={16} />}
      >
        <p>The block header is exactly 80 bytes and contains:</p>
        <ul>
          <li><strong>Version (4 bytes):</strong> Block version for protocol upgrades</li>
          <li><strong>Previous Block Hash (32 bytes):</strong> Links to the parent block</li>
          <li><strong>Merkle Root (32 bytes):</strong> Hash of all transactions in the block</li>
          <li><strong>Timestamp (4 bytes):</strong> When the block was mined</li>
          <li><strong>Difficulty Target (4 bytes):</strong> The mining difficulty</li>
          <li><strong>Nonce (4 bytes):</strong> The value miners change to find valid hashes</li>
        </ul>
        <p>
          Miners hash this 80-byte header repeatedly (with different nonces) until they 
          find a hash that meets the difficulty target.
        </p>
      </Accordion>
    </div>
  );
}

export default BlockExplorer;
