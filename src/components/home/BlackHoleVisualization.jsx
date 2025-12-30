import { motion } from 'framer-motion';
import styles from './BlackHoleVisualization.module.css';

const BLOCK_COUNT = 21;
const CYCLE_DURATION = 18; // seconds for full spiral journey
const OUTER_RADIUS = 180; // pixels
const INNER_RADIUS = 0; // ends at center

// Generate blocks with random starting angles for variety
const blocks = Array.from({ length: BLOCK_COUNT }, (_, i) => ({
  id: i,
  // Random starting angle for each block (0-360 degrees)
  startAngle: Math.random() * 360,
  // Stagger each block's starting point in the cycle
  delay: (i / BLOCK_COUNT) * CYCLE_DURATION,
}));

function SpiralBlock({ id, delay, startAngle }) {
  return (
    <motion.div
      className={styles.block}
      initial={{
        x: 0,
        y: 0,
        scale: 1,
        opacity: 0,
      }}
      animate={{
        x: [
          // Calculate spiral path: outer → inner from random starting angle
          ...Array.from({ length: 100 }, (_, i) => {
            const progress = i / 99;
            const radius = OUTER_RADIUS * (1 - progress);
            const angle = startAngle + (progress * 720); // 2 full rotations inward from random start
            const angleRad = (angle * Math.PI) / 180;
            return radius * Math.cos(angleRad);
          }),
        ],
        y: [
          ...Array.from({ length: 100 }, (_, i) => {
            const progress = i / 99;
            const radius = OUTER_RADIUS * (1 - progress);
            const angle = startAngle + (progress * 720);
            const angleRad = (angle * Math.PI) / 180;
            return radius * Math.sin(angleRad);
          }),
        ],
        scale: [
          // Scale down as it approaches center
          ...Array.from({ length: 100 }, (_, i) => {
            const progress = i / 99;
            return 1 - (progress * 0.85); // Scale from 1 to 0.15
          }),
        ],
        opacity: [
          // Fade in at start, fade out near center
          0, // Start invisible
          1, // Fade in
          ...Array.from({ length: 97 }, (_, i) => {
            const progress = (i + 1) / 99;
            if (progress < 0.1) return 1; // Stay full opacity early
            return 1 - ((progress - 0.1) / 0.9); // Fade from 90% of journey
          }),
          0, // Fully transparent at center
        ],
      }}
      transition={{
        duration: CYCLE_DURATION,
        delay: delay,
        repeat: Infinity,
        ease: "linear",
      }}
      style={{
        filter: 'blur(0px)',
      }}
    />
  );
}

function Vortex() {
  return (
    <div className={styles.vortexContainer}>
      {/* Outer glow ring */}
      <motion.div
        className={styles.vortexRing}
        style={{
          width: '120px',
          height: '120px',
          background: 'radial-gradient(circle, rgba(247, 147, 26, 0.15) 0%, rgba(247, 147, 26, 0.08) 50%, transparent 100%)',
        }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.6, 0.8, 0.6],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      {/* Middle glow ring */}
      <motion.div
        className={styles.vortexRing}
        style={{
          width: '80px',
          height: '80px',
          background: 'radial-gradient(circle, rgba(247, 147, 26, 0.3) 0%, rgba(247, 147, 26, 0.15) 50%, transparent 100%)',
        }}
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.7, 0.9, 0.7],
          rotate: [0, 360],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
          rotate: {
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }
        }}
      />
      
      {/* Inner core */}
      <motion.div
        className={styles.vortexCore}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.8, 1, 0.8],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      {/* Center singularity point */}
      <div className={styles.singularity} />
    </div>
  );
}

export function BlackHoleVisualization() {
  return (
    <motion.div 
      className={styles.container}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, delay: 0.2 }}
    >
      <div className={styles.viewport}>
        {/* Central vortex */}
        <Vortex />
        
        {/* Orbiting blocks */}
        <div className={styles.blocksContainer}>
          {blocks.map((block) => (
            <SpiralBlock 
              key={block.id} 
              id={block.id} 
              delay={block.delay} 
              startAngle={block.startAngle}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default BlackHoleVisualization;
