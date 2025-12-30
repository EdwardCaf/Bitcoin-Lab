import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { BookOpen, Zap, BarChart3, Trophy } from 'lucide-react';
import styles from './StatsSection.module.css';

const STATS = [
  {
    icon: BookOpen,
    value: 11,
    label: 'Interactive Lessons',
    suffix: '',
  },
  {
    icon: Zap,
    value: 40,
    label: 'Concepts Covered',
    suffix: '+',
  },
  {
    icon: BarChart3,
    value: 30,
    label: 'Visualizations',
    suffix: '+',
  },
  {
    icon: Trophy,
    value: 100,
    label: 'Free Forever',
    suffix: '%',
  },
];

function AnimatedCounter({ value, duration = 2, suffix = '' }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  useEffect(() => {
    if (!isInView) return;

    let startTime;
    let animationFrame;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeOutQuart * value));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [isInView, value, duration]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

export function StatsSection() {
  return (
    <section className={styles.container}>
      <div className={styles.grid}>
        {STATS.map((stat, index) => {
          const Icon = stat.icon;
          
          return (
            <motion.div
              key={stat.label}
              className={styles.statCard}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <div className={styles.iconWrapper}>
                <Icon size={24} />
              </div>
              <div className={styles.value}>
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </div>
              <div className={styles.label}>{stat.label}</div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

export default StatsSection;
