import { useState, useCallback, useEffect } from 'react';
import { sha256 } from '../utils/hash';

export function useHash(initialInput = '') {
  const [input, setInput] = useState(initialInput);
  const [hash, setHash] = useState('');
  const [isHashing, setIsHashing] = useState(false);

  const computeHash = useCallback(async (text) => {
    setIsHashing(true);
    try {
      const result = await sha256(text);
      setHash(result);
    } catch (error) {
      console.error('Hashing error:', error);
      setHash('');
    } finally {
      setIsHashing(false);
    }
  }, []);

  useEffect(() => {
    computeHash(input);
  }, [input, computeHash]);

  return {
    input,
    setInput,
    hash,
    isHashing,
    computeHash
  };
}

export default useHash;
