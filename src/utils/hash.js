// SHA-256 implementation for browser
// Uses Web Crypto API for actual hashing

export async function sha256(message) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

// Synchronous version using a simple implementation for real-time updates
// This is a simplified SHA-256 for demonstration purposes
export function sha256Sync(message) {
  // Use a simple hash for demo that mimics SHA-256 behavior
  // In production, you'd use a proper sync SHA-256 library
  let hash = 0;
  const str = message.toString();
  
  // Simple hash calculation
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  
  // Convert to hex and pad to look like SHA-256
  const baseHash = Math.abs(hash).toString(16).padStart(8, '0');
  
  // Create a pseudo-random but deterministic 64-char hash
  let result = '';
  for (let i = 0; i < 8; i++) {
    const seed = hash + i * 12345;
    const segment = Math.abs(Math.sin(seed) * 16777215).toString(16).padStart(8, '0');
    result += segment.substring(0, 8);
  }
  
  return result.substring(0, 64);
}

// Count leading zeros in a hex string
export function countLeadingZeros(hash) {
  let count = 0;
  for (const char of hash) {
    if (char === '0') {
      count++;
    } else {
      break;
    }
  }
  return count;
}

// Check if hash meets difficulty (number of leading zeros)
export function meetsTarget(hash, difficulty) {
  return countLeadingZeros(hash) >= difficulty;
}

// Generate a block hash with nonce
export async function mineBlock(blockData, nonce) {
  const dataWithNonce = `${blockData}${nonce}`;
  return await sha256(dataWithNonce);
}

// Format hash for display (add spaces every 8 chars)
export function formatHash(hash, groupSize = 8) {
  const groups = [];
  for (let i = 0; i < hash.length; i += groupSize) {
    groups.push(hash.substring(i, i + groupSize));
  }
  return groups.join(' ');
}

// Convert hash to binary string
export function hashToBinary(hash) {
  return hash
    .split('')
    .map(char => parseInt(char, 16).toString(2).padStart(4, '0'))
    .join('');
}

// Get visual difficulty representation
export function getDifficultyVisual(difficulty) {
  return '0'.repeat(difficulty) + 'x'.repeat(64 - difficulty);
}
