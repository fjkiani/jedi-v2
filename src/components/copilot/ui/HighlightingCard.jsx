import React from 'react';
import { motion } from 'framer-motion';

const HighlightingCard = ({ 
  children, 
  isHighlighted = false, 
  isRevealed = false, 
  className = '',
  highlightDuration = 2000 
}) => {
  return (
    <motion.div
      className={className}
      animate={{
        scale: isHighlighted ? 1.05 : 1,
        boxShadow: isHighlighted 
          ? '0 10px 25px rgba(0, 0, 0, 0.15)' 
          : '0 1px 3px rgba(0, 0, 0, 0.1)'
      }}
      transition={{
        duration: 0.3,
        ease: "easeInOut"
      }}
    >
      {isHighlighted && (
        <motion.div
          className="absolute inset-0 rounded-lg bg-primary-1/5 border-2 border-primary-1/30"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        />
      )}
      
      <div className="relative">
        {children}
      </div>
    </motion.div>
  );
};

export default HighlightingCard;

