// Bitcoin-specific utility functions and constants

// Block reward schedule
export const HALVING_INTERVAL = 210000;
export const INITIAL_REWARD = 50;
export const MAX_SUPPLY = 21000000;

// Calculate block reward for a given block height
export function getBlockReward(blockHeight) {
  const halvings = Math.floor(blockHeight / HALVING_INTERVAL);
  if (halvings >= 64) return 0; // After ~64 halvings, reward is 0
  return INITIAL_REWARD / Math.pow(2, halvings);
}

// Calculate total supply at a given block height
export function getTotalSupply(blockHeight) {
  let supply = 0;
  let reward = INITIAL_REWARD;
  let remaining = blockHeight;
  
  while (remaining > 0 && reward > 0) {
    const blocksAtThisReward = Math.min(remaining, HALVING_INTERVAL);
    supply += blocksAtThisReward * reward;
    remaining -= blocksAtThisReward;
    reward /= 2;
  }
  
  return Math.min(supply, MAX_SUPPLY);
}

// Get halving events up to a block height
export function getHalvingEvents(maxBlockHeight = 2100000) {
  const events = [];
  let blockHeight = 0;
  let reward = INITIAL_REWARD;
  
  while (blockHeight <= maxBlockHeight && reward >= 0.00000001) {
    events.push({
      blockHeight,
      reward,
      year: 2009 + Math.floor(blockHeight / 52500), // ~52500 blocks per year
      supply: getTotalSupply(blockHeight)
    });
    blockHeight += HALVING_INTERVAL;
    reward /= 2;
  }
  
  return events;
}

// Current block height (approximate, for demo purposes)
export const CURRENT_BLOCK_HEIGHT = 840000; // Post April 2024 halving

// Generate a fake Bitcoin address
export function generateAddress(type = 'p2pkh') {
  const chars = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
  let address = '';
  
  switch (type) {
    case 'p2pkh':
      address = '1';
      break;
    case 'p2sh':
      address = '3';
      break;
    case 'bech32':
      address = 'bc1q';
      break;
    default:
      address = '1';
  }
  
  const length = type === 'bech32' ? 38 : 33;
  while (address.length < length) {
    address += chars[Math.floor(Math.random() * chars.length)];
  }
  
  return address;
}

// Generate a fake transaction ID
export function generateTxId() {
  const chars = '0123456789abcdef';
  let txid = '';
  for (let i = 0; i < 64; i++) {
    txid += chars[Math.floor(Math.random() * chars.length)];
  }
  return txid;
}

// Format BTC amount
export function formatBTC(satoshis, showUnit = true) {
  const btc = satoshis / 100000000;
  const formatted = btc.toFixed(8).replace(/\.?0+$/, '');
  return showUnit ? `${formatted} BTC` : formatted;
}

// Parse BTC to satoshis
export function parseBTC(btcString) {
  return Math.round(parseFloat(btcString) * 100000000);
}

// Format satoshis
export function formatSats(satoshis, showUnit = true) {
  const formatted = satoshis.toLocaleString();
  return showUnit ? `${formatted} sats` : formatted;
}

// Transaction fee rates (sats/vB)
export const FEE_RATES = {
  slow: { rate: 1, label: 'Slow', time: '~1 hour' },
  medium: { rate: 10, label: 'Medium', time: '~30 min' },
  fast: { rate: 25, label: 'Fast', time: '~10 min' },
  urgent: { rate: 50, label: 'Urgent', time: 'Next block' }
};

// Estimate transaction size (simplified)
export function estimateTxSize(inputCount, outputCount) {
  // P2PKH: ~148 bytes per input, ~34 bytes per output, 10 bytes overhead
  return 10 + (inputCount * 148) + (outputCount * 34);
}

// Calculate fee for transaction
export function calculateFee(inputCount, outputCount, feeRate) {
  const size = estimateTxSize(inputCount, outputCount);
  return size * feeRate;
}

// Sample UTXOs for demo
export function generateSampleUTXOs() {
  return [
    {
      id: 'utxo-1',
      txid: generateTxId(),
      vout: 0,
      amount: 50000000, // 0.5 BTC in sats
      address: generateAddress(),
      confirmations: 6,
      label: 'Payment from Alice'
    },
    {
      id: 'utxo-2',
      txid: generateTxId(),
      vout: 1,
      amount: 30000000, // 0.3 BTC
      address: generateAddress(),
      confirmations: 100,
      label: 'Mining reward'
    },
    {
      id: 'utxo-3',
      txid: generateTxId(),
      vout: 0,
      amount: 15000000, // 0.15 BTC
      address: generateAddress(),
      confirmations: 25,
      label: 'Change from tx'
    },
    {
      id: 'utxo-4',
      txid: generateTxId(),
      vout: 2,
      amount: 5000000, // 0.05 BTC
      address: generateAddress(),
      confirmations: 3,
      label: 'Payment from Bob'
    }
  ];
}

// Sample recipients for demo
export const SAMPLE_RECIPIENTS = [
  { id: 'alice', name: 'Alice', address: generateAddress('bech32') },
  { id: 'bob', name: 'Bob', address: generateAddress('p2pkh') },
  { id: 'charlie', name: 'Charlie', address: generateAddress('p2sh') },
  { id: 'custom', name: 'Custom Address', address: '' }
];

// ============================================
// UTXO Management Utilities
// ============================================

// Dust threshold calculation
// A UTXO is considered "dust" if the cost to spend it exceeds its value
export const DUST_RELAY_FEE = 3; // sat/vB - minimum relay fee
export const INPUT_SIZE_VBYTES = 68; // Average input size for P2WPKH

export function calculateDustThreshold(feeRate) {
  // Dust threshold = cost to spend the input at current fee rate
  return INPUT_SIZE_VBYTES * feeRate;
}

// Classify UTXO health based on fee rate
export function classifyUTXO(utxoAmount, feeRate) {
  const dustThreshold = calculateDustThreshold(feeRate);
  const spendCost = calculateDustThreshold(feeRate);
  const costRatio = spendCost / utxoAmount;
  
  if (utxoAmount <= dustThreshold) {
    return { 
      status: 'dust', 
      label: 'Dust', 
      color: 'var(--error)',
      description: 'Costs more to spend than it\'s worth'
    };
  } else if (costRatio > 0.1) {
    return { 
      status: 'warning', 
      label: 'Inefficient', 
      color: 'var(--warning)',
      description: 'High fee ratio when spending'
    };
  } else {
    return { 
      status: 'healthy', 
      label: 'Healthy', 
      color: 'var(--success)',
      description: 'Efficient to spend'
    };
  }
}

// Calculate consolidation cost and savings
export function calculateConsolidation(utxos, feeRate) {
  const inputCount = utxos.length;
  const outputCount = 1; // Consolidating to single UTXO
  
  // Transaction size for consolidation
  const txSize = 10 + (inputCount * INPUT_SIZE_VBYTES) + (34 * outputCount);
  const consolidationFee = txSize * feeRate;
  
  const totalValue = utxos.reduce((sum, u) => sum + u.amount, 0);
  const consolidatedValue = totalValue - consolidationFee;
  
  // Calculate future savings (spending 1 UTXO vs many)
  const futureSpendCostBefore = inputCount * INPUT_SIZE_VBYTES * feeRate;
  const futureSpendCostAfter = 1 * INPUT_SIZE_VBYTES * feeRate;
  const futureSavings = futureSpendCostBefore - futureSpendCostAfter;
  
  return {
    inputCount,
    txSize,
    consolidationFee,
    totalValue,
    consolidatedValue,
    futureSpendCostBefore,
    futureSpendCostAfter,
    futureSavings,
    netBenefit: futureSavings - consolidationFee,
    worthIt: futureSavings > consolidationFee
  };
}

// Coin selection algorithms
export const COIN_SELECTION_STRATEGIES = {
  largestFirst: {
    id: 'largestFirst',
    name: 'Largest First',
    description: 'Uses biggest UTXOs first. Minimizes input count but may leave dust.',
    privacy: 'low',
    efficiency: 'high',
    select: (utxos, targetAmount, feeRate) => {
      const sorted = [...utxos].sort((a, b) => b.amount - a.amount);
      return selectGreedy(sorted, targetAmount, feeRate);
    }
  },
  smallestFirst: {
    id: 'smallestFirst',
    name: 'Smallest First',
    description: 'Uses smallest UTXOs first. Cleans up small coins but higher fees.',
    privacy: 'low',
    efficiency: 'low',
    select: (utxos, targetAmount, feeRate) => {
      const sorted = [...utxos].sort((a, b) => a.amount - b.amount);
      return selectGreedy(sorted, targetAmount, feeRate);
    }
  },
  exactMatch: {
    id: 'exactMatch',
    name: 'Exact Match',
    description: 'Tries to find UTXOs that exactly match the target. Minimizes change output.',
    privacy: 'medium',
    efficiency: 'high',
    select: (utxos, targetAmount, feeRate) => {
      return selectExactMatch(utxos, targetAmount, feeRate);
    }
  },
  random: {
    id: 'random',
    name: 'Random Selection',
    description: 'Randomly selects UTXOs. Better privacy but unpredictable fees.',
    privacy: 'medium',
    efficiency: 'medium',
    select: (utxos, targetAmount, feeRate) => {
      const shuffled = [...utxos].sort(() => Math.random() - 0.5);
      return selectGreedy(shuffled, targetAmount, feeRate);
    }
  }
};

// Helper: Greedy coin selection
function selectGreedy(sortedUtxos, targetAmount, feeRate) {
  const selected = [];
  let total = 0;
  
  for (const utxo of sortedUtxos) {
    if (total >= targetAmount) break;
    selected.push(utxo);
    total += utxo.amount;
  }
  
  // Calculate fee and change
  const inputCount = selected.length;
  const hasChange = total > targetAmount;
  const outputCount = hasChange ? 2 : 1;
  const txSize = 10 + (inputCount * INPUT_SIZE_VBYTES) + (34 * outputCount);
  const fee = txSize * feeRate;
  const change = Math.max(0, total - targetAmount - fee);
  
  return {
    selected,
    total,
    fee,
    change,
    txSize,
    sufficient: total >= targetAmount + fee
  };
}

// Helper: Try to find exact match (simplified branch and bound)
function selectExactMatch(utxos, targetAmount, feeRate) {
  // First, try to find a single UTXO that's close to target
  const singleUtxoFee = (10 + INPUT_SIZE_VBYTES + 34) * feeRate;
  const targetWithFee = targetAmount + singleUtxoFee;
  
  // Sort by how close they are to target
  const candidates = utxos
    .filter(u => u.amount >= targetWithFee)
    .sort((a, b) => (a.amount - targetWithFee) - (b.amount - targetWithFee));
  
  if (candidates.length > 0) {
    const selected = [candidates[0]];
    const total = candidates[0].amount;
    const change = total - targetAmount - singleUtxoFee;
    
    return {
      selected,
      total,
      fee: singleUtxoFee,
      change: change > 0 ? change : 0,
      txSize: 10 + INPUT_SIZE_VBYTES + (change > 0 ? 68 : 34),
      sufficient: true
    };
  }
  
  // Fallback to greedy
  return selectGreedy([...utxos].sort((a, b) => b.amount - a.amount), targetAmount, feeRate);
}

// Generate varied UTXOs for UTXO management demos
export function generateManagementUTXOs() {
  return [
    {
      id: 'utxo-large-1',
      txid: generateTxId(),
      vout: 0,
      amount: 25000000, // 0.25 BTC
      address: generateAddress('bech32'),
      confirmations: 144,
      label: 'Exchange withdrawal',
      age: 30
    },
    {
      id: 'utxo-med-1',
      txid: generateTxId(),
      vout: 1,
      amount: 5000000, // 0.05 BTC
      address: generateAddress('bech32'),
      confirmations: 72,
      label: 'Payment received',
      age: 14
    },
    {
      id: 'utxo-med-2',
      txid: generateTxId(),
      vout: 0,
      amount: 3500000, // 0.035 BTC
      address: generateAddress('bech32'),
      confirmations: 288,
      label: 'Change from purchase',
      age: 60
    },
    {
      id: 'utxo-small-1',
      txid: generateTxId(),
      vout: 2,
      amount: 500000, // 0.005 BTC (5000 sats)
      address: generateAddress('bech32'),
      confirmations: 50,
      label: 'Small payment',
      age: 10
    },
    {
      id: 'utxo-small-2',
      txid: generateTxId(),
      vout: 0,
      amount: 250000, // 0.0025 BTC (2500 sats)
      address: generateAddress('bech32'),
      confirmations: 20,
      label: 'Tip received',
      age: 5
    },
    {
      id: 'utxo-tiny-1',
      txid: generateTxId(),
      vout: 1,
      amount: 50000, // 500 sats
      address: generateAddress('bech32'),
      confirmations: 100,
      label: 'Leftover change',
      age: 45
    },
    {
      id: 'utxo-tiny-2',
      txid: generateTxId(),
      vout: 0,
      amount: 25000, // 250 sats
      address: generateAddress('bech32'),
      confirmations: 80,
      label: 'Dust from split',
      age: 30
    },
    {
      id: 'utxo-dust-1',
      txid: generateTxId(),
      vout: 3,
      amount: 5000, // 50 sats - actual dust
      address: generateAddress('bech32'),
      confirmations: 200,
      label: 'Legacy dust',
      age: 90
    },
    {
      id: 'utxo-dust-2',
      txid: generateTxId(),
      vout: 0,
      amount: 2000, // 20 sats - dust
      address: generateAddress('bech32'),
      confirmations: 150,
      label: 'Micro change',
      age: 60
    }
  ];
}
