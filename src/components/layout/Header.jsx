import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Eye, Menu, X } from 'lucide-react';
import { useBlockHeight } from '../../hooks/useBlockHeight';
import styles from './Header.module.css';

export function Header({ sidebarOpen, onToggleSidebar }) {
  const { blockHeight, isLoading, error } = useBlockHeight(5000);
  const [isNewBlock, setIsNewBlock] = useState(false);
  const prevBlockHeight = useRef(null);

  // Detect when block height changes
  useEffect(() => {
    if (blockHeight && prevBlockHeight.current !== null && blockHeight > prevBlockHeight.current) {
      // New block detected! Trigger animation
      setIsNewBlock(true);
      
      // Remove animation class after it completes (3 seconds)
      const timeout = setTimeout(() => {
        setIsNewBlock(false);
      }, 3000);
      
      return () => clearTimeout(timeout);
    }
    
    prevBlockHeight.current = blockHeight;
  }, [blockHeight]);

  // Determine status display
  const getStatusContent = () => {
    if (isLoading && !blockHeight) {
      return {
        text: 'Testnet Mode',
        dotClass: styles.statusDotYellow
      };
    }
    
    if (error && !blockHeight) {
      return {
        text: 'Testnet Mode',
        dotClass: styles.statusDotYellow
      };
    }
    
    return {
      text: `Block ${blockHeight.toLocaleString()}`,
      dotClass: styles.statusDot
    };
  };

  const { text, dotClass } = getStatusContent();

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <button 
          className={styles.menuButton}
          onClick={onToggleSidebar}
          aria-label={sidebarOpen ? 'Close menu' : 'Open menu'}
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        
        <Link to="/" className={styles.logoLink}>
          <motion.div 
            className={styles.logo}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className={styles.logoIcon}>
              <Eye size={28} />
            </div>
            <div className={styles.logoText}>
              <span className={styles.logoTitle}>The Bitcoin <span className={styles.logoOrange}>OP</span>tic</span>
              <span className={styles.logoSubtitle}>See Bitcoin Clearly</span>
            </div>
          </motion.div>
        </Link>
      </div>
      
      <div className={styles.right}>
        <div className={`${styles.status} ${isNewBlock ? styles.statusNewBlock : ''}`}>
          <span className={dotClass} />
          <span className={styles.statusText}>{text}</span>
        </div>
      </div>
    </header>
  );
}

export default Header;
