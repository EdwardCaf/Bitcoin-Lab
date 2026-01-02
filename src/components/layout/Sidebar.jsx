import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wallet,
  ArrowLeftRight,
  Coins,
  EyeOff,
  Key,
  Pickaxe, 
  Blocks, 
  Network,
  Zap,
  Droplets,
  CircleDollarSign,
  ChevronRight,
  Library,
  Users
} from 'lucide-react';
import styles from './Sidebar.module.css';

const sections = [
  {
    id: 'fundamentals',
    title: 'Fundamentals',
    lessons: [
      { id: 'wallets', title: 'Wallets', icon: Wallet, path: '/lessons/wallets' },
      { id: 'transactions', title: 'Transactions', icon: ArrowLeftRight, path: '/lessons/transactions' },
      { id: 'utxo-management', title: 'UTXO Management', icon: Coins, path: '/lessons/utxo-management' },
      { id: 'privacy', title: 'Privacy', icon: EyeOff, path: '/lessons/privacy' },
      { id: 'multisig', title: 'Multi-Signature', icon: Key, path: '/lessons/multisig' },
    ]
  },
  {
    id: 'protocol',
    title: 'Protocol',
    lessons: [
      { id: 'mining', title: 'Mining', icon: Pickaxe, path: '/lessons/mining' },
      { id: 'blocks', title: 'Blocks', icon: Blocks, path: '/lessons/blocks' },
      { id: 'network', title: 'Network', icon: Network, path: '/lessons/network' },
    ]
  },
  {
    id: 'layer2',
    title: 'Layer 2 / Sidechains',
    lessons: [
      { id: 'lightning', title: 'Lightning', icon: Zap, path: '/lessons/lightning' },
      { id: 'liquid', title: 'Liquid', icon: Droplets, path: '/lessons/liquid' },
      { id: 'ecash', title: 'eCash', icon: CircleDollarSign, path: '/lessons/ecash' },
    ]
  },
];

export function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={styles.overlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}
        initial={false}
      >
        <div className={styles.content}>
          {sections.map((section) => (
            <div key={section.id} className={styles.section}>
              <h3 className={styles.sectionTitle}>{section.title}</h3>
              <nav className={styles.nav}>
                {section.lessons.map((lesson) => {
                  const Icon = lesson.icon;

                  return (
                    <NavLink
                      key={lesson.id}
                      to={lesson.path}
                      className={({ isActive }) => `
                        ${styles.navItem}
                        ${isActive ? styles.active : ''}
                      `}
                      onClick={() => {
                        if (window.innerWidth < 1024) {
                          onClose();
                        }
                      }}
                    >
                      <div className={styles.navIcon}>
                        <Icon size={18} />
                      </div>
                      <span className={styles.navTitle}>{lesson.title}</span>
                      <ChevronRight size={14} className={styles.navArrow} />
                    </NavLink>
                  );
                })}
              </nav>
            </div>
          ))}

          {/* Separator */}
          <div className={styles.separator} />

          {/* Resources Link */}
          <NavLink
            to="/resources"
            className={({ isActive }) => `
              ${styles.resourcesLink}
              ${isActive ? styles.active : ''}
            `}
            onClick={() => {
              if (window.innerWidth < 1024) {
                onClose();
              }
            }}
          >
            <div className={styles.navIcon}>
              <Library size={18} />
            </div>
            <span className={styles.navTitle}>Resources</span>
            <ChevronRight size={14} className={styles.navArrow} />
          </NavLink>

          {/* Support Link */}
          <NavLink
            to="/support"
            className={({ isActive }) => `
              ${styles.supportLink}
              ${isActive ? styles.active : ''}
            `}
            onClick={() => {
              if (window.innerWidth < 1024) {
                onClose();
              }
            }}
          >
            <div className={styles.navIcon}>
              <Users size={18} />
            </div>
            <span className={styles.navTitle}>Bitcoin Mentor</span>
            <ChevronRight size={14} className={styles.navArrow} />
          </NavLink>

          <div className={styles.footer}>
            <p className={styles.footerText}>
              All visuals are for educational purposes.
              Nothing stated is finanical advice.
            </p>
            <p className={styles.footerText}>
              Created by Edward Cafarella
            </p>
          </div>
        </div>
      </motion.aside>
    </>
  );
}

export default Sidebar;
