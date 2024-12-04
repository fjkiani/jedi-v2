import React from 'react';
import { motion } from 'framer-motion';

const Loading = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-n-8/90 backdrop-blur-sm">
      <div className="relative">
        {/* Animated circles */}
        {[...Array(3)].map((_, index) => (
          <motion.div
            key={index}
            className="absolute inset-0 rounded-full border-2 border-primary-1"
            initial={{ scale: 1, opacity: 0 }}
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.1, 0.5, 0.1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: index * 0.3,
              ease: "easeInOut",
            }}
          />
        ))}
        
        {/* Center logo or icon */}
        <motion.div
          className="relative w-16 h-16 rounded-full bg-n-7 border border-n-1/10
            flex items-center justify-center"
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary-1 to-primary-2" />
        </motion.div>
      </div>
    </div>
  );
};

export default Loading; 