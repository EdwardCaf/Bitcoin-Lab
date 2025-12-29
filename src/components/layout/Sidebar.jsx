import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wallet,
  ArrowLeftRight, 
  EyeOff,
  Pickaxe, 
  Blocks, 
  Network,
  Zap,
  Droplets,
  Lock,
  ChevronRight
} from 'lucide-react';
import styles from './Sidebar.module.css';

const lessons = [
  {
    id: 'wallets',
    title: 'Wallets & Addresses',
    description: 'Keys & address types',
    icon: Wallet,
    path: '/lessons/wallets',
    available: true
  },
  {
    id: 'transactions',
    title: 'Transactions',
    description: 'How Bitcoin moves',
    icon: ArrowLeftRight,
    path: '/lessons/transactions',
    available: true
  },
  {
    id: 'privacy',
    title: 'Privacy',
    description: 'Protecting your identity',
    icon: EyeOff,
    path: '/lessons/privacy',
    available: true
  },
  {
    id: 'mining',
    title: 'Mining',
    description: 'Securing the network',
    icon: Pickaxe,
    path: '/lessons/mining',
    available: true
  },
  {
    id: 'blocks',
    title: 'Blocks',
    description: 'Building the chain',
    icon: Blocks,
    path: '/lessons/blocks',
    available: true
  },
  {
    id: 'network',
    title: 'Network',
    description: 'Nodes & propagation',
    icon: Network,
    path: '/lessons/network',
    available: true
  },
  {
    id: 'lightning',
    title: 'Lightning',
    description: 'Instant payments',
    icon: Zap,
    path: '/lessons/lightning',
    available: true
  },
  {
    id: 'liquid',
    title: 'Liquid',
    description: 'Federated sidechain',
    icon: Droplets,
    path: '/lessons/liquid',
    available: true
  }
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
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Lessons</h3>
            <nav className={styles.nav}>
              {lessons.map((lesson) => {
                const Icon = lesson.icon;

                return (
                  <NavLink
                    key={lesson.id}
                    to={lesson.available ? lesson.path : '#'}
                    className={({ isActive }) => `
                      ${styles.navItem}
                      ${isActive ? styles.active : ''}
                      ${!lesson.available ? styles.locked : ''}
                    `}
                    onClick={(e) => {
                      if (!lesson.available) {
                        e.preventDefault();
                      } else if (window.innerWidth < 1024) {
                        onClose();
                      }
                    }}
                  >
                    <div className={styles.navIcon}>
                      {!lesson.available ? (
                        <Lock size={20} />
                      ) : (
                        <Icon size={20} />
                      )}
                    </div>
                    <div className={styles.navContent}>
                      <span className={styles.navTitle}>{lesson.title}</span>
                      <span className={styles.navDescription}>{lesson.description}</span>
                    </div>
                    <ChevronRight size={16} className={styles.navArrow} />
                  </NavLink>
                );
              })}
            </nav>
          </div>

          <div className={styles.footer}>
            <p className={styles.footerText}>
              All simulations are for educational purposes.
              No real Bitcoin is involved.
            </p>
          </div>
        </div>
      </motion.aside>
    </>
  );
}

export default Sidebar;
