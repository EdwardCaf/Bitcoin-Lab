import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import styles from './NetworkVisualization.module.css';

// Network nodes representing Bitcoin concepts
const NODES = [
  { id: 1, x: 50, y: 30, size: 12, speed: 0.3 },
  { id: 2, x: 20, y: 60, size: 8, speed: 0.5 },
  { id: 3, x: 80, y: 50, size: 10, speed: 0.4 },
  { id: 4, x: 35, y: 80, size: 6, speed: 0.6 },
  { id: 5, x: 65, y: 75, size: 14, speed: 0.25 },
  { id: 6, x: 15, y: 25, size: 7, speed: 0.55 },
  { id: 7, x: 75, y: 15, size: 9, speed: 0.45 },
  { id: 8, x: 45, y: 50, size: 11, speed: 0.35 },
];

// Connections between nodes (representing Bitcoin transactions/links)
const CONNECTIONS = [
  { from: 1, to: 2 },
  { from: 1, to: 3 },
  { from: 2, to: 4 },
  { from: 3, to: 5 },
  { from: 4, to: 5 },
  { from: 6, to: 1 },
  { from: 7, to: 3 },
  { from: 8, to: 1 },
  { from: 8, to: 5 },
];

export function NetworkVisualization() {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const nodesRef = useRef(NODES.map(node => ({
    ...node,
    currentX: node.x,
    currentY: node.y,
    vx: (Math.random() - 0.5) * node.speed,
    vy: (Math.random() - 0.5) * node.speed,
  })));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const nodes = nodesRef.current;
    
    // Set canvas size
    const updateSize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    
    updateSize();
    window.addEventListener('resize', updateSize);

    // Animation loop
    let animationTime = 0;
    const animate = () => {
      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      
      // Clear canvas
      ctx.clearRect(0, 0, width, height);
      
      // Update node positions
      nodes.forEach(node => {
        // Update position
        node.currentX += node.vx;
        node.currentY += node.vy;
        
        // Bounce off edges
        if (node.currentX <= 0 || node.currentX >= 100) {
          node.vx *= -1;
          node.currentX = Math.max(0, Math.min(100, node.currentX));
        }
        if (node.currentY <= 0 || node.currentY >= 100) {
          node.vy *= -1;
          node.currentY = Math.max(0, Math.min(100, node.currentY));
        }
      });
      
      // Draw connections
      ctx.strokeStyle = 'rgba(247, 147, 26, 0.15)';
      ctx.lineWidth = 1;
      
      CONNECTIONS.forEach(conn => {
        const fromNode = nodes.find(n => n.id === conn.from);
        const toNode = nodes.find(n => n.id === conn.to);
        
        if (fromNode && toNode) {
          const x1 = (fromNode.currentX / 100) * width;
          const y1 = (fromNode.currentY / 100) * height;
          const x2 = (toNode.currentX / 100) * width;
          const y2 = (toNode.currentY / 100) * height;
          
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();
          
          // Animated pulse along connection
          const progress = (animationTime * 0.5) % 1;
          const pulseX = x1 + (x2 - x1) * progress;
          const pulseY = y1 + (y2 - y1) * progress;
          
          ctx.fillStyle = 'rgba(247, 147, 26, 0.4)';
          ctx.beginPath();
          ctx.arc(pulseX, pulseY, 2, 0, Math.PI * 2);
          ctx.fill();
        }
      });
      
      // Draw nodes
      nodes.forEach((node, index) => {
        const x = (node.currentX / 100) * width;
        const y = (node.currentY / 100) * height;
        const pulse = Math.sin(animationTime * 2 + index) * 0.2 + 1;
        
        // Outer glow
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, node.size * pulse);
        gradient.addColorStop(0, 'rgba(247, 147, 26, 0.8)');
        gradient.addColorStop(0.5, 'rgba(247, 147, 26, 0.3)');
        gradient.addColorStop(1, 'rgba(247, 147, 26, 0)');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, node.size * pulse, 0, Math.PI * 2);
        ctx.fill();
        
        // Inner core
        ctx.fillStyle = '#f7931a';
        ctx.beginPath();
        ctx.arc(x, y, node.size * 0.5, 0, Math.PI * 2);
        ctx.fill();
      });
      
      animationTime += 0.01;
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      window.removeEventListener('resize', updateSize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <motion.div 
      className={styles.container}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.3 }}
    >
      <canvas ref={canvasRef} className={styles.canvas} />
      <div className={styles.overlay}>
        <div className={styles.gridPattern} />
      </div>
    </motion.div>
  );
}

export default NetworkVisualization;
