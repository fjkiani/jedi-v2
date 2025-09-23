import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ProgressiveReveal = ({ 
  items = [], 
  revealedCount = 0, 
  renderItem, 
  className = '',
  staggerDelay = 0.1 
}) => {
  return (
    <div className={className}>
      <AnimatePresence>
        {items.slice(0, revealedCount).map((item, index) => (
          <motion.div
            key={item.id || index}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ 
              duration: 0.5, 
              delay: index * staggerDelay,
              ease: "easeOut"
            }}
          >
            {renderItem(item, index)}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ProgressiveReveal;

