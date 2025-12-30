import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Network,
  Zap,
  ArrowRight,
  RotateCcw,
  DollarSign,
  Clock,
  CheckCircle
} from 'lucide-react';
import { Card, Button, Badge, Accordion } from '../../common';
import styles from './RoutingSimulator.module.css';

// Network nodes with positions for visualization
const NODES = [
  { id: 'alice', name: 'Alice', x: 50, y: 200, color: '#f97316' },
  { id: 'bob', name: 'Bob', x: 200, y: 80, color: '#3b82f6' },
  { id: 'carol', name: 'Carol', x: 350, y: 50, color: '#22c55e' },
  { id: 'dave', name: 'Dave', x: 200, y: 320, color: '#a855f7' },
  { id: 'eve', name: 'Eve', x: 350, y: 250, color: '#ec4899' },
  { id: 'frank', name: 'Frank', x: 500, y: 150, color: '#14b8a6' },
];

// Channels between nodes with capacity and fee rates
const CHANNELS = [
  { from: 'alice', to: 'bob', capacity: 0.5, feeRate: 1 },
  { from: 'alice', to: 'dave', capacity: 0.3, feeRate: 2 },
  { from: 'bob', to: 'carol', capacity: 0.4, feeRate: 1 },
  { from: 'bob', to: 'eve', capacity: 0.6, feeRate: 3 },
  { from: 'carol', to: 'frank', capacity: 0.5, feeRate: 1 },
  { from: 'dave', to: 'eve', capacity: 0.4, feeRate: 2 },
  { from: 'eve', to: 'frank', capacity: 0.7, feeRate: 2 },
];

// Find shortest path using BFS
function findPath(from, to, channels) {
  const graph = {};
  channels.forEach(ch => {
    if (!graph[ch.from]) graph[ch.from] = [];
    if (!graph[ch.to]) graph[ch.to] = [];
    graph[ch.from].push({ node: ch.to, channel: ch });
    graph[ch.to].push({ node: ch.from, channel: ch });
  });

  const queue = [[from]];
  const visited = new Set([from]);

  while (queue.length > 0) {
    const path = queue.shift();
    const current = path[path.length - 1];

    if (current === to) {
      return path;
    }

    for (const { node } of (graph[current] || [])) {
      if (!visited.has(node)) {
        visited.add(node);
        queue.push([...path, node]);
      }
    }
  }

  return null;
}

// Calculate total fees for a path
function calculateFees(path, channels) {
  let totalFees = 0;
  for (let i = 0; i < path.length - 1; i++) {
    const channel = channels.find(
      ch => (ch.from === path[i] && ch.to === path[i + 1]) ||
            (ch.to === path[i] && ch.from === path[i + 1])
    );
    if (channel) {
      totalFees += channel.feeRate;
    }
  }
  return totalFees;
}

export function RoutingSimulator() {
  const [selectedSource, setSelectedSource] = useState(null);
  const [selectedDest, setSelectedDest] = useState(null);
  const [activePath, setActivePath] = useState(null);
  const [animatingPayment, setAnimatingPayment] = useState(false);
  const [paymentProgress, setPaymentProgress] = useState(-1);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [paymentAmount] = useState(0.01);

  const nodesMap = useMemo(() => {
    const map = {};
    NODES.forEach(n => map[n.id] = n);
    return map;
  }, []);

  const handleNodeClick = (nodeId) => {
    if (animatingPayment) return;

    if (!selectedSource) {
      setSelectedSource(nodeId);
      setActivePath(null);
    } else if (nodeId === selectedSource) {
      setSelectedSource(null);
      setSelectedDest(null);
      setActivePath(null);
    } else {
      setSelectedDest(nodeId);
      const path = findPath(selectedSource, nodeId, CHANNELS);
      setActivePath(path);
    }
  };

  const sendPayment = async () => {
    if (!activePath || animatingPayment) return;

    setAnimatingPayment(true);
    setPaymentComplete(false);
    
    // Animate through each hop
    for (let i = 0; i < activePath.length; i++) {
      setPaymentProgress(i);
      await new Promise(resolve => setTimeout(resolve, 600));
    }

    // Hold at destination briefly
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setPaymentProgress(-1);
    setPaymentComplete(true);
    setAnimatingPayment(false);
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      setPaymentComplete(false);
    }, 3000);
  };

  const reset = () => {
    setSelectedSource(null);
    setSelectedDest(null);
    setActivePath(null);
    setPaymentProgress(-1);
    setAnimatingPayment(false);
    setPaymentComplete(false);
  };

  const totalFees = activePath ? calculateFees(activePath, CHANNELS) : 0;

  // Check if a channel is part of the active path
  const isChannelActive = (channel) => {
    if (!activePath) return false;
    for (let i = 0; i < activePath.length - 1; i++) {
      if ((channel.from === activePath[i] && channel.to === activePath[i + 1]) ||
          (channel.to === activePath[i] && channel.from === activePath[i + 1])) {
        return true;
      }
    }
    return false;
  };

  // Get the current animation position
  const getPaymentPosition = () => {
    if (paymentProgress < 0 || !activePath) return null;
    const node = nodesMap[activePath[paymentProgress]];
    return node ? { x: node.x, y: node.y } : null;
  };

  const paymentPos = getPaymentPosition();

  return (
    <div className={styles.container}>
      <Card variant="elevated" padding="large">
        <div className={styles.header}>
          <div className={styles.titleSection}>
            <div className={styles.iconWrapper}>
              <Network size={24} />
            </div>
            <div>
              <h3 className={styles.title}>Lightning Network Routing</h3>
              <p className={styles.subtitle}>
                Click a source node, then a destination to find a payment route
              </p>
            </div>
          </div>
          
          <div className={styles.controls}>
            <Button
              variant="ghost"
              size="small"
              icon={<RotateCcw size={14} />}
              onClick={reset}
            >
              Reset
            </Button>
          </div>
        </div>

        {/* Instructions */}
        <div className={styles.instructions}>
          {!selectedSource && (
            <Badge variant="outline">Step 1: Click a node to select as source</Badge>
          )}
          {selectedSource && !selectedDest && (
            <Badge variant="outline">Step 2: Click another node as destination</Badge>
          )}
          {activePath && (
            <Badge variant="success">
              Route found: {activePath.length - 1} hop{activePath.length > 2 ? 's' : ''}
            </Badge>
          )}
        </div>

        {/* Network Visualization */}
        <div className={styles.networkContainer}>
          <svg className={styles.networkSvg} viewBox="0 0 550 370">
            {/* Channels */}
            {CHANNELS.map((channel, i) => {
              const from = nodesMap[channel.from];
              const to = nodesMap[channel.to];
              const isActive = isChannelActive(channel);
              
              return (
                <g key={i}>
                  <line
                    x1={from.x}
                    y1={from.y}
                    x2={to.x}
                    y2={to.y}
                    className={`${styles.channel} ${isActive ? styles.activeChannel : ''} ${isActive && paymentComplete ? styles.successChannel : ''}`}
                    strokeWidth={isActive ? 4 : 2}
                  />
                  {/* Fee label */}
                  <text
                    x={(from.x + to.x) / 2}
                    y={(from.y + to.y) / 2 - 8}
                    className={styles.feeLabel}
                  >
                    {channel.feeRate} sat
                  </text>
                </g>
              );
            })}

            {/* Payment animation */}
            <AnimatePresence>
              {paymentPos && (
                <motion.circle
                  cx={paymentPos.x}
                  cy={paymentPos.y}
                  r={12}
                  className={styles.paymentPacket}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </AnimatePresence>

            {/* Nodes */}
            {NODES.map(node => {
              const isSource = selectedSource === node.id;
              const isDest = selectedDest === node.id;
              const isInPath = activePath?.includes(node.id);
              
              return (
                <g 
                  key={node.id}
                  className={styles.nodeGroup}
                  onClick={() => handleNodeClick(node.id)}
                >
                  {/* Node circle */}
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={isSource || isDest ? 28 : 24}
                    fill={node.color}
                    className={`${styles.node} ${isSource ? styles.sourceNode : ''} ${isDest ? styles.destNode : ''} ${isInPath ? styles.pathNode : ''}`}
                  />
                  {/* Node label */}
                  <text
                    x={node.x}
                    y={node.y + 5}
                    className={styles.nodeLabel}
                  >
                    {node.name[0]}
                  </text>
                  {/* Name below */}
                  <text
                    x={node.x}
                    y={node.y + 45}
                    className={styles.nodeName}
                  >
                    {node.name}
                  </text>
                  
                  {/* Role indicator */}
                  {isSource && (
                    <text x={node.x} y={node.y - 35} className={styles.roleLabel}>
                      Source
                    </text>
                  )}
                  {isDest && (
                    <text x={node.x} y={node.y - 35} className={styles.roleLabel}>
                      Destination
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        {/* Route Details */}
        {activePath && (
          <motion.div
            className={styles.routeDetails}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className={styles.routePath}>
              <h4>Payment Route</h4>
              <div className={styles.pathSteps}>
                {activePath.map((nodeId, i) => (
                  <div key={nodeId} className={styles.pathStep}>
                    <span 
                      className={styles.pathNode}
                      style={{ backgroundColor: nodesMap[nodeId].color }}
                    >
                      {nodesMap[nodeId].name}
                    </span>
                    {i < activePath.length - 1 && (
                      <ArrowRight size={16} className={styles.pathArrow} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.routeStats}>
              <div className={styles.stat}>
                <Clock size={16} />
                <span>{activePath.length - 1} hop{activePath.length > 2 ? 's' : ''}</span>
              </div>
              <div className={styles.stat}>
                <DollarSign size={16} />
                <span>{totalFees} sats total fees</span>
              </div>
              <div className={styles.stat}>
                <Zap size={16} />
                <span>{paymentAmount} BTC payment</span>
              </div>
            </div>

            <Button
              variant="primary"
              icon={<Zap size={16} />}
              onClick={sendPayment}
              disabled={animatingPayment}
            >
              {animatingPayment ? 'Sending...' : 'Send Payment'}
            </Button>
            
            {/* Success Message */}
            <AnimatePresence>
              {paymentComplete && (
                <motion.div
                  className={styles.successMessage}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                >
                  <CheckCircle size={20} />
                  <span>Payment Successful!</span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Legend */}
        <div className={styles.legend}>
          <div className={styles.legendItem}>
            <div className={styles.legendLine} />
            <span>Channel (fee shown)</span>
          </div>
          <div className={styles.legendItem}>
            <div className={styles.legendLineActive} />
            <span>Active route</span>
          </div>
        </div>
      </Card>

      <Accordion
        title="Deep Dive: Multi-Hop Routing"
        variant="deepdive"
        icon={<Network size={16} />}
      >
        <p>
          The Lightning Network enables payments between parties who don't have a 
          direct channel by routing through intermediate nodes:
        </p>
        <ul>
          <li>
            <strong>Pathfinding:</strong> Your wallet finds a route with sufficient 
            capacity and low fees. Multiple algorithms exist (Dijkstra, A*, etc.)
          </li>
          <li>
            <strong>Onion routing:</strong> Each hop only knows the previous and next 
            node, not the full route. This preserves privacy.
          </li>
          <li>
            <strong>Routing fees:</strong> Each intermediate node charges a small fee 
            (typically 1-10 satoshis + a percentage) for forwarding payments.
          </li>
          <li>
            <strong>Atomic payments:</strong> HTLCs ensure the payment either succeeds 
            at all hops or fails completely - no partial payments.
          </li>
        </ul>
        <p>
          <strong>Scalability:</strong> With just 6 connections, you can reach most of 
          the Lightning Network in 2-3 hops!
        </p>
      </Accordion>
    </div>
  );
}

export default RoutingSimulator;
