import { motion } from 'framer-motion';
import { Box } from 'lucide-react';
import styles from './HashWaveVisualization.module.css';

// Sample Bitcoin block hashes with leading zeros (realistic)
const BLOCKS = [
  {
    id: 1,
    hash: '00000000000000000002a7c4c1e48d76c5a37902165a270156b7a8d72728a054',
  },
  {
    id: 2,
    hash: '00000000000000000001c2e2e3f5d9a8b4c3f8e2d1a9b8c7d6e5f4a3b2c1d0e9',
  },
  {
    id: 3,
    hash: '00000000000000000003d4f6a8b2c9e1f3a5b7c9d1e3f5a7b9c1d3e5f7a9b1c3',
  },
];

// Convert hash to wave path (SVG path data)
function hashToWavePath(hash, width, height) {
  // Take every 4th character to get ~16 points for smooth wave
  const points = [];
  const step = Math.floor(hash.length / 16);
  
  for (let i = 0; i < 16; i++) {
    const char = hash[i * step] || '0';
    // Convert hex char to height value (0-15)
    const value = parseInt(char, 16) || 0;
    // Normalize to height range (inverted so 0 is low)
    const y = height - (value / 15) * height;
    const x = (i / 15) * width;
    points.push({ x, y });
  }
  
  // Create smooth curve using quadratic bezier
  let path = `M ${points[0].x} ${points[0].y}`;
  
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const cpX = (prev.x + curr.x) / 2;
    const cpY = (prev.y + curr.y) / 2;
    path += ` Q ${cpX} ${curr.y}, ${curr.x} ${curr.y}`;
  }
  
  return path;
}

function BlockCard({ block, index }) {
  const waveWidth = 180;
  const waveHeight = 60;
  const wavePath = hashToWavePath(block.hash, waveWidth, waveHeight);
  
  return (
    <motion.div
      className={styles.blockContainer}
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ 
        duration: 0.8, 
        delay: index * 0.2,
        ease: [0.22, 1, 0.36, 1]
      }}
    >
      {/* Block Card */}
      <motion.div
        className={styles.block}
        animate={{ 
          y: [0, -8, 0],
        }}
        transition={{
          duration: 4,
          delay: index * 0.3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <div className={styles.blockIcon}>
          <Box size={20} strokeWidth={1.5} />
        </div>
        <div className={styles.blockGlow} />
      </motion.div>
      
      {/* Hash Wave */}
      <div className={styles.waveContainer}>
        <svg
          width={waveWidth}
          height={waveHeight}
          viewBox={`0 0 ${waveWidth} ${waveHeight}`}
          className={styles.wave}
        >
          <defs>
            <linearGradient id={`waveGradient${index}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--bitcoin-orange-dark)" stopOpacity="0.6" />
              <stop offset="50%" stopColor="var(--bitcoin-orange)" stopOpacity="0.8" />
              <stop offset="100%" stopColor="var(--bitcoin-orange-light)" stopOpacity="0.6" />
            </linearGradient>
            <filter id={`glow${index}`}>
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          {/* Animated wave path */}
          <motion.path
            d={wavePath}
            fill="none"
            stroke={`url(#waveGradient${index})`}
            strokeWidth="2"
            strokeLinecap="round"
            filter={`url(#glow${index})`}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ 
              pathLength: 1, 
              opacity: 1,
            }}
            transition={{
              pathLength: { duration: 1.5, delay: index * 0.2 + 0.3, ease: "easeInOut" },
              opacity: { duration: 0.5, delay: index * 0.2 + 0.3 }
            }}
          />
          
          {/* Subtle pulsing glow overlay */}
          <motion.path
            d={wavePath}
            fill="none"
            stroke={`url(#waveGradient${index})`}
            strokeWidth="3"
            strokeLinecap="round"
            opacity="0.3"
            animate={{ 
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 3,
              delay: index * 0.4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </svg>
      </div>
    </motion.div>
  );
}

function ConnectionArrow({ index, show }) {
  if (!show) return null;
  
  return (
    <motion.div
      className={styles.connection}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ 
        duration: 0.6, 
        delay: index * 0.2 + 0.5,
        ease: "easeOut"
      }}
    >
      <svg width="60" height="40" viewBox="0 0 60 40" className={styles.arrow}>
        <defs>
          <linearGradient id={`arrowGradient${index}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--bitcoin-orange)" stopOpacity="0.3" />
            <stop offset="100%" stopColor="var(--bitcoin-orange)" stopOpacity="0.6" />
          </linearGradient>
        </defs>
        
        {/* Arrow line */}
        <motion.path
          d="M 5 20 L 45 20"
          stroke={`url(#arrowGradient${index})`}
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ 
            duration: 0.8, 
            delay: index * 0.2 + 0.6,
            ease: "easeInOut"
          }}
        />
        
        {/* Arrow head */}
        <motion.path
          d="M 40 15 L 48 20 L 40 25"
          stroke={`url(#arrowGradient${index})`}
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ opacity: 0, x: -5 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ 
            duration: 0.4, 
            delay: index * 0.2 + 1.2,
            ease: "easeOut"
          }}
        />
        
        {/* Animated pulse along line */}
        <motion.circle
          cx="0"
          cy="20"
          r="2"
          fill="var(--bitcoin-orange)"
          opacity="0.8"
          animate={{
            cx: [5, 45],
            opacity: [0, 0.8, 0],
          }}
          transition={{
            duration: 2,
            delay: index * 0.2 + 1.5,
            repeat: Infinity,
            ease: "easeInOut",
            repeatDelay: 1
          }}
        />
      </svg>
    </motion.div>
  );
}

export function HashWaveVisualization() {
  return (
    <motion.div 
      className={styles.container}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.2 }}
    >
      <div className={styles.blocksWrapper}>
        {BLOCKS.map((block, index) => (
          <div key={block.id} className={styles.blockWithConnection}>
            <BlockCard block={block} index={index} />
            <ConnectionArrow index={index} show={index < BLOCKS.length - 1} />
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export default HashWaveVisualization;
