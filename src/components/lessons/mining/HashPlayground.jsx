import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Hash, Copy, Check, Binary, Type, Info } from 'lucide-react';
import { Card, Button, Accordion, Tooltip } from '../../common';
import { sha256 } from '../../../utils/hash';
import styles from './HashPlayground.module.css';

export function HashPlayground() {
  const [input, setInput] = useState('Hello, Bitcoin!');
  const [hash, setHash] = useState('');
  const [prevHash, setPrevHash] = useState('');
  const [displayMode, setDisplayMode] = useState('hex'); // hex, binary
  const [copied, setCopied] = useState(false);
  const [isHashing, setIsHashing] = useState(false);
  const inputRef = useRef(null);

  // Compute hash whenever input changes
  useEffect(() => {
    const computeHash = async () => {
      setIsHashing(true);
      setPrevHash(hash);
      const newHash = await sha256(input);
      setHash(newHash);
      setIsHashing(false);
    };
    computeHash();
  }, [input]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(hash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatHash = (h) => {
    if (!h) return '';
    if (displayMode === 'binary') {
      return h.split('').map(char => 
        parseInt(char, 16).toString(2).padStart(4, '0')
      ).join('');
    }
    return h;
  };

  // Find changed characters
  const getChangedPositions = () => {
    if (!prevHash || !hash) return new Set();
    const positions = new Set();
    for (let i = 0; i < hash.length; i++) {
      if (hash[i] !== prevHash[i]) {
        positions.add(i);
      }
    }
    return positions;
  };

  const changedPositions = getChangedPositions();
  const formattedHash = formatHash(hash);

  return (
    <div className={styles.container}>
      <Card variant="elevated" padding="large">
        <div className={styles.header}>
          <div className={styles.titleRow}>
            <div className={styles.iconWrapper}>
              <Hash size={24} />
            </div>
            <div>
              <h3 className={styles.title}>Hash Playground</h3>
              <p className={styles.subtitle}>Type anything and watch the hash change instantly</p>
            </div>
          </div>
        </div>

        {/* Input Section */}
        <div className={styles.inputSection}>
          <label className={styles.label}>
            <Type size={14} />
            <span>Input Text</span>
          </label>
          <textarea
            ref={inputRef}
            className={styles.textarea}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type something..."
            rows={3}
          />
          <div className={styles.inputInfo}>
            <span>{input.length} characters</span>
            <span>{new TextEncoder().encode(input).length} bytes</span>
          </div>
        </div>

        {/* Hash Arrow */}
        <div className={styles.arrowSection}>
          <div className={styles.arrowLine} />
          <div className={styles.arrowLabel}>
            <span>SHA-256</span>
            {isHashing && <span className={styles.hashingDot} />}
          </div>
          <div className={styles.arrowLine} />
        </div>

        {/* Output Section */}
        <div className={styles.outputSection}>
          <div className={styles.outputHeader}>
            <label className={styles.label}>
              <Hash size={14} />
              <span>Hash Output</span>
              <Tooltip content="SHA-256 always produces a 256-bit (64 hex character) output, regardless of input size">
                <Info size={12} className={styles.infoIcon} />
              </Tooltip>
            </label>
            <div className={styles.outputControls}>
              <button
                className={`${styles.modeButton} ${displayMode === 'hex' ? styles.active : ''}`}
                onClick={() => setDisplayMode('hex')}
              >
                Hex
              </button>
              <button
                className={`${styles.modeButton} ${displayMode === 'binary' ? styles.active : ''}`}
                onClick={() => setDisplayMode('binary')}
              >
                <Binary size={14} />
                Binary
              </button>
            </div>
          </div>

          <div className={styles.hashOutput}>
            <div className={styles.hashText}>
              {displayMode === 'hex' ? (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={hash}
                    className={styles.hashChars}
                    initial={{ opacity: 0.5 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    {hash.split('').map((char, i) => (
                      <span
                        key={i}
                        className={`${styles.hashChar} ${changedPositions.has(i) ? styles.changed : ''}`}
                      >
                        {char}
                      </span>
                    ))}
                  </motion.div>
                </AnimatePresence>
              ) : (
                <div className={styles.binaryHash}>
                  {formattedHash}
                </div>
              )}
            </div>
            
            <Button
              variant="ghost"
              size="small"
              icon={copied ? <Check size={14} /> : <Copy size={14} />}
              onClick={handleCopy}
              className={styles.copyButton}
            >
              {copied ? 'Copied!' : 'Copy'}
            </Button>
          </div>

          <div className={styles.outputInfo}>
            <span>256 bits</span>
            <span>64 hex characters</span>
            <span>Always the same length</span>
          </div>
        </div>

        {/* Try These */}
        <div className={styles.suggestions}>
          <span className={styles.suggestLabel}>Try these:</span>
          <div className={styles.suggestionButtons}>
            <button onClick={() => setInput('Hello, Bitcoin!')}>
              Hello, Bitcoin!
            </button>
            <button onClick={() => setInput('hello, Bitcoin!')}>
              hello, Bitcoin!
            </button>
            <button onClick={() => setInput('A')}>
              Just "A"
            </button>
            <button onClick={() => setInput('A'.repeat(1000))}>
              1000 A's
            </button>
          </div>
        </div>
      </Card>

      {/* Key Insights */}
      <div className={styles.insights}>
        <Card padding="medium" className={styles.insightCard}>
          <h4>Deterministic</h4>
          <p>Same input always produces the same hash. Try typing the same thing twice!</p>
        </Card>
        <Card padding="medium" className={styles.insightCard}>
          <h4>Avalanche Effect</h4>
          <p>Change just one character and watch how completely different the hash becomes.</p>
        </Card>
        <Card padding="medium" className={styles.insightCard}>
          <h4>Fixed Size</h4>
          <p>Whether you hash one letter or a million, the output is always 256 bits.</p>
        </Card>
      </div>

      {/* Deep Dive */}
      <Accordion
        title="Deep Dive: How SHA-256 Works"
        variant="deepdive"
        icon={<Hash size={16} />}
      >
        <p>
          <strong>SHA-256</strong> (Secure Hash Algorithm 256-bit) is a cryptographic hash function 
          that takes any input and produces a fixed 256-bit output.
        </p>
        <p>Key properties that make it useful for Bitcoin:</p>
        <ul>
          <li><strong>One-way:</strong> You can't reverse the process to find the input from the hash</li>
          <li><strong>Collision-resistant:</strong> It's practically impossible to find two different inputs that produce the same hash</li>
          <li><strong>Fast to compute:</strong> Verifying is quick, but finding a specific hash pattern requires many attempts</li>
        </ul>
        <p>
          Bitcoin uses SHA-256 for mining (proof-of-work), creating addresses, 
          and securing transaction data in the merkle tree.
        </p>
      </Accordion>
    </div>
  );
}

export default HashPlayground;
