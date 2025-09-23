import { useState, useEffect, useCallback } from 'react';

export const useProgressiveReveal = (items = [], isAnalyzing = false, revealDelay = 800) => {
  const [revealedItems, setRevealedItems] = useState(new Set());
  const [currentItem, setCurrentItem] = useState(null);

  // Progressive reveal of items based on analysis progress
  const startReveal = useCallback(() => {
    if (!isAnalyzing || items.length === 0) return;

    const revealInterval = setInterval(() => {
      setRevealedItems(prev => {
        const newRevealed = new Set(prev);
        const nextIndex = newRevealed.size;
        
        if (nextIndex < items.length) {
          newRevealed.add(nextIndex);
          setCurrentItem(items[nextIndex]);
          
          // Auto-clear current item after 2 seconds
          setTimeout(() => setCurrentItem(null), 2000);
        } else {
          clearInterval(revealInterval);
        }
        
        return newRevealed;
      });
    }, revealDelay);

    return () => clearInterval(revealInterval);
  }, [isAnalyzing, items, revealDelay]);

  // Start reveal when analysis begins
  useEffect(() => {
    if (isAnalyzing) {
      setRevealedItems(new Set());
      setCurrentItem(null);
      const cleanup = startReveal();
      return cleanup;
    }
  }, [isAnalyzing, startReveal]);

  // Reset when items change
  useEffect(() => {
    setRevealedItems(new Set());
    setCurrentItem(null);
  }, [items]);

  const getItemStatus = useCallback((index) => {
    if (revealedItems.has(index)) {
      if (currentItem === items[index]) return 'highlighted';
      return 'revealed';
    }
    return 'hidden';
  }, [revealedItems, currentItem, items]);

  return {
    revealedItems,
    currentItem,
    getItemStatus,
    isComplete: revealedItems.size === items.length
  };
};

