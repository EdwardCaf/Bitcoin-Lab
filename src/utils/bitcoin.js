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
