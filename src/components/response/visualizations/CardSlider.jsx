import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CardSlider = ({ cards }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % cards.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
  };

  return (
    <div className="relative w-full">
      <div className="overflow-hidden rounded-xl bg-n-7 border border-n-6">
        <div className="relative min-h-[300px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
              className="p-6"
            >
              {cards[currentIndex]}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between p-4 border-t border-n-6">
          <button
            onClick={handlePrev}
            className="flex items-center gap-2 text-n-3 hover:text-n-1 transition-colors"
          >
            <span className="text-xl">←</span>
            Previous
          </button>
          <div className="text-n-3">
            {currentIndex + 1} / {cards.length}
          </div>
          <button
            onClick={handleNext}
            className="flex items-center gap-2 text-n-3 hover:text-n-1 transition-colors"
          >
            Next
            <span className="text-xl">→</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CardSlider; 