import { motion } from 'framer-motion';
import { Bitcoin, Menu, X } from 'lucide-react';
import styles from './Header.module.css';

export function Header({ sidebarOpen, onToggleSidebar }) {
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
        
        <motion.div 
          className={styles.logo}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className={styles.logoIcon}>
            <Bitcoin size={28} />
          </div>
          <div className={styles.logoText}>
            <span className={styles.logoTitle}>Bitcoin Mentor Lab</span>
            <span className={styles.logoSubtitle}>Learn by Doing</span>
          </div>
        </motion.div>
      </div>
      
      <div className={styles.right}>
        <div className={styles.status}>
          <span className={styles.statusDot} />
          <span className={styles.statusText}>Simulation Mode</span>
        </div>
      </div>
    </header>
  );
}

export default Header;
