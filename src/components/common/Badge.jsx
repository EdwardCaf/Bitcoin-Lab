import { motion } from 'framer-motion';
import styles from './Badge.module.css';

export function Badge({ 
  children, 
  variant = 'default',
  size = 'medium',
  icon,
  animate = false,
  className = ''
}) {
  const badgeClasses = [
    styles.badge,
    styles[variant],
    styles[size],
    className
  ].filter(Boolean).join(' ');

  const content = (
    <>
      {icon && <span className={styles.icon}>{icon}</span>}
      <span>{children}</span>
    </>
  );

  if (animate) {
    return (
      <motion.span
        className={badgeClasses}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        {content}
      </motion.span>
    );
  }

  return (
    <span className={badgeClasses}>
      {content}
    </span>
  );
}

export default Badge;
