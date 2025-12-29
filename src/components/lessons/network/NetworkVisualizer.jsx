import { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  Network, 
  Server, 
  Smartphone,
  RotateCcw,
  Send
} from 'lucide-react';
import { Card, Button, Accordion } from '../../common';
import styles from './NetworkVisualizer.module.css';

// Node positions in a circular layout
const generateNodePositions = (count, centerX, centerY, radius) => {
  const positions = [];
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * 2 * Math.PI - Math.PI / 2;
    positions.push({
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle)
    });
  }
  return positions;
};

const nodeTypes = [
  { type: 'full', label: 'Full Node', icon: Server, color: '#22c55e' },
  { type: 'mining', label: 'Mining Node', icon: Server, color: '#f7931a' },
  { type: 'spv', label: 'Light Wallet', icon: Smartphone, color: '#3b82f6' },
];

const NODE_COUNT = 8;
const CENTER = 200;
const RADIUS = 140;

// Pre-generate stable node positions
const generateInitialNodes = () => {
  const positions = generateNodePositions(NODE_COUNT, CENTER, CENTER, RADIUS);
  const nodes = positions.map((pos, i) => ({
    id: i,
    x: pos.x,
    y: pos.y,
    type: i === 0 ? 'mining' : i < 5 ? 'full' : 'spv',
    hasMessage: false,
    connections: []
  }));
  
  // Create deterministic connections for consistent layout
  const connectionPairs = [
    [0, 1], [0, 7], [0, 4],
    [1, 2], [1, 3],
    [2, 3], [2, 4],
    [3, 4], [3, 5],
    [4, 5],
    [5, 6], [5, 7],
    [6, 7], [6, 0],
    [7, 1]
  ];
  
  connectionPairs.forEach(([a, b]) => {
    if (!nodes[a].connections.includes(b)) {
      nodes[a].connections.push(b);
      nodes[b].connections.push(a);
    }
  });
  
  return nodes;
};

export function NetworkVisualizer() {
  const [nodes, setNodes] = useState(() => generateInitialNodes());
  const [messages, setMessages] = useState([]);
  const [stats, setStats] = useState({ propagated: 0, total: NODE_COUNT });
  const containerRef = useRef(null);
  
  // Broadcast a transaction from a node
  const broadcastTransaction = useCallback((sourceId) => {
    // Reset and start fresh
    const freshNodes = generateInitialNodes();
    freshNodes[sourceId].hasMessage = true;
    setNodes(freshNodes);
    setMessages([]);
    setStats({ propagated: 1, total: NODE_COUNT });
    
    const visited = new Set([sourceId]);
    
    const propagate = (nodeId, depth = 0) => {
      const node = freshNodes.find(n => n.id === nodeId);
      if (!node) return;
      
      node.connections.forEach((targetId, index) => {
        if (!visited.has(targetId)) {
          visited.add(targetId);
          const delay = (depth * 400) + (index * 150);
          
          setTimeout(() => {
            // Add message animation
            setMessages(prev => [...prev, {
              id: `${nodeId}-${targetId}-${Date.now()}`,
              from: nodeId,
              to: targetId
            }]);
            
            // Mark target as having message
            setNodes(prev => prev.map(n => 
              n.id === targetId ? { ...n, hasMessage: true } : n
            ));
            
            setStats(prev => ({ ...prev, propagated: Math.min(prev.propagated + 1, NODE_COUNT) }));
            
            // Continue propagation
            setTimeout(() => {
              propagate(targetId, depth + 1);
            }, 200);
          }, delay);
        }
      });
    };
    
    setTimeout(() => propagate(sourceId, 0), 100);
  }, []);
  
  // Start simulation
  const startSimulation = () => {
    const miningNode = nodes.find(n => n.type === 'mining');
    if (miningNode) {
      broadcastTransaction(miningNode.id);
    }
  };
  
  // Reset simulation
  const resetSimulation = () => {
    setNodes(generateInitialNodes());
    setMessages([]);
    setStats({ propagated: 0, total: NODE_COUNT });
  };
  
  const getNodeStyle = (node) => {
    const nodeType = nodeTypes.find(t => t.type === node.type);
    return {
      background: node.hasMessage ? nodeType.color : 'var(--bg-tertiary)',
      borderColor: nodeType.color
    };
  };
  
  return (
    <div className={styles.container}>
      <Card variant="elevated" padding="large">
        <div className={styles.header}>
          <div className={styles.titleSection}>
            <div className={styles.iconWrapper}>
              <Network size={24} />
            </div>
            <div>
              <h3 className={styles.title}>P2P Network Simulator</h3>
              <p className={styles.subtitle}>
                Watch how transactions propagate across the network
              </p>
            </div>
          </div>
          
          <div className={styles.controls}>
            <Button
              variant="primary"
              size="small"
              icon={<Send size={14} />}
              onClick={startSimulation}
            >
              Broadcast Tx
            </Button>
            <Button
              variant="ghost"
              size="small"
              icon={<RotateCcw size={14} />}
              onClick={resetSimulation}
            >
              Reset
            </Button>
          </div>
        </div>
        
        {/* Network Visualization */}
        <div className={styles.networkArea} ref={containerRef}>
          <svg className={styles.connectionsSvg} viewBox="0 0 400 400" preserveAspectRatio="xMidYMid meet">
            {/* Draw connections */}
            {nodes.map(node => 
              node.connections
                .filter(targetId => targetId > node.id) // Avoid duplicate lines
                .map(targetId => {
                  const target = nodes.find(n => n.id === targetId);
                  if (!target) return null;
                  return (
                    <line
                      key={`${node.id}-${targetId}`}
                      x1={node.x}
                      y1={node.y}
                      x2={target.x}
                      y2={target.y}
                      className={styles.connection}
                    />
                  );
                })
            )}
            
            {/* Draw message animations */}
            {messages.map(msg => {
              const fromNode = nodes.find(n => n.id === msg.from);
              const toNode = nodes.find(n => n.id === msg.to);
              if (!fromNode || !toNode) return null;
              
              return (
                <motion.circle
                  key={msg.id}
                  r="6"
                  fill="var(--bitcoin-orange)"
                  initial={{ cx: fromNode.x, cy: fromNode.y, opacity: 1 }}
                  animate={{ cx: toNode.x, cy: toNode.y, opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                />
              );
            })}
            
            {/* Draw nodes as SVG elements so they scale with the viewBox */}
            {nodes.map(node => {
              const nodeType = nodeTypes.find(t => t.type === node.type);
              return (
                <g key={node.id} transform={`translate(${node.x}, ${node.y})`}>
                  <motion.circle
                    r="18"
                    fill={node.hasMessage ? nodeType.color : 'var(--bg-tertiary)'}
                    stroke={nodeType.color}
                    strokeWidth="2"
                    className={styles.nodeCircle}
                    animate={node.hasMessage ? { scale: [1, 1.2, 1] } : {}}
                    transition={{ duration: 0.3 }}
                    style={{ cursor: 'pointer' }}
                  />
                  {/* Server icon for full/mining nodes */}
                  {(node.type === 'full' || node.type === 'mining') && (
                    <g fill={node.hasMessage ? 'white' : 'var(--text-secondary)'} transform="translate(-8, -8)">
                      <rect x="2" y="4" width="12" height="10" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                      <line x1="8" y1="7" x2="8" y2="11" stroke="currentColor" strokeWidth="1.5"/>
                    </g>
                  )}
                  {/* Phone icon for SPV nodes */}
                  {node.type === 'spv' && (
                    <g fill={node.hasMessage ? 'white' : 'var(--text-secondary)'} transform="translate(-6, -8)">
                      <rect x="2" y="1" width="8" height="14" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                      <line x1="6" y1="12" x2="6" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </g>
                  )}
                </g>
              );
            })}
          </svg>
        </div>
        
        {/* Stats */}
        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statValue}>
              {stats.propagated} / {stats.total}
            </span>
            <span className={styles.statLabel}>Nodes Reached</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statValue}>{nodes.length}</span>
            <span className={styles.statLabel}>Total Nodes</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statValue}>
              {nodes.reduce((sum, n) => sum + n.connections.length, 0) / 2}
            </span>
            <span className={styles.statLabel}>Connections</span>
          </div>
        </div>
        
        {/* Legend */}
        <div className={styles.legend}>
          {nodeTypes.map(type => (
            <div key={type.type} className={styles.legendItem}>
              <div 
                className={styles.legendDot}
                style={{ borderColor: type.color }}
              />
              <span>{type.label}</span>
            </div>
          ))}
        </div>
      </Card>
      
      <Accordion
        title="Deep Dive: Bitcoin's P2P Network"
        variant="deepdive"
        icon={<Network size={16} />}
      >
        <p>
          Bitcoin operates on a peer-to-peer (P2P) network with no central server. 
          Each node connects directly to several other nodes.
        </p>
        <p>Types of nodes:</p>
        <ul>
          <li>
            <strong>Full Nodes:</strong> Store the complete blockchain and validate 
            all transactions and blocks independently
          </li>
          <li>
            <strong>Mining Nodes:</strong> Full nodes that also compete to create new 
            blocks through proof-of-work
          </li>
          <li>
            <strong>Light Clients (SPV):</strong> Don't store the full blockchain; 
            rely on full nodes for verification
          </li>
        </ul>
        <p>
          When a new transaction or block is created, it propagates through the 
          network in seconds as nodes relay it to their peers.
        </p>
      </Accordion>
    </div>
  );
}

export default NetworkVisualizer;
