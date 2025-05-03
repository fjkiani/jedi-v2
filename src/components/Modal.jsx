import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { Icon } from './Icon';

// --- Basic Modal Component ---
const Modal = ({ isOpen, onClose, children }) => {
  const { isDarkMode } = useTheme();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className={`relative rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto ${
            isDarkMode ? 'bg-n-7 border border-n-6' : 'bg-white border border-n-3'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className={`absolute top-4 right-4 p-1 rounded-full transition-colors ${
              isDarkMode ? 'text-n-4 hover:bg-n-6' : 'text-n-5 hover:bg-n-2'
            }`}
            aria-label="Close modal"
          >
            <Icon name="close" className="w-5 h-5" />
          </button>
          <div className="p-6 pt-12 sm:p-8 sm:pt-14">
            {children}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Modal;
// --- End Modal Component --- 