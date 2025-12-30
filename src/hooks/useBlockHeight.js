import { useState, useEffect } from 'react';

// API endpoints (in priority order)
const APIS = [
  { url: 'https://blockstream.info/api/blocks/tip/height', name: 'Blockstream' },
  { url: 'https://mempool.space/api/blocks/tip/height', name: 'Mempool' }
];

// TEST MODE: Set to true to simulate new blocks every 10 seconds (for testing animation)
const TEST_MODE = false;

export function useBlockHeight(refreshInterval = 30000) {
  const [blockHeight, setBlockHeight] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBlockHeight = async () => {
    // TEST MODE: Simulate incrementing blocks
    if (TEST_MODE) {
      setBlockHeight(prev => (prev || 930188) + 1);
      setError(null);
      setIsLoading(false);
      return;
    }

    // Try each API in order until one succeeds
    for (const api of APIS) {
      try {
        const response = await fetch(api.url, {
          method: 'GET',
          headers: {
            'Accept': 'text/plain'
          }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const height = await response.text();
        const parsedHeight = parseInt(height.trim(), 10);
        
        if (isNaN(parsedHeight)) {
          throw new Error('Invalid block height received');
        }
        
        setBlockHeight(parsedHeight);
        setError(null);
        setIsLoading(false);
        return; // Success! Exit the loop
        
      } catch (err) {
        console.warn(`Failed to fetch from ${api.name}:`, err.message);
        // Continue to next API
      }
    }
    
    // If all APIs failed
    setError('Unable to fetch block height');
    setIsLoading(false);
  };

  useEffect(() => {
    // Fetch immediately on mount
    fetchBlockHeight();

    // Set up interval for periodic updates
    const interval = setInterval(() => {
      fetchBlockHeight();
    }, refreshInterval);

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, [refreshInterval]);

  return { blockHeight, isLoading, error };
}
