import { motion } from 'framer-motion';

const TimelineNode = ({ active, onClick, position }) => {
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.3, delay: position * 0.2 }}
      className="relative"
    >
      <div 
        onClick={onClick}
        className={`
          w-4 h-4 rounded-full cursor-pointer
          transition-all duration-300 ease-out
          ${active 
            ? 'bg-color-1 scale-125 shadow-lg shadow-color-1/30' 
            : 'bg-n-3 dark:bg-n-6 hover:bg-color-1/70'
          }
        `}
      />
      {active && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -inset-2 rounded-full border-2 border-color-1/30"
        />
      )}
    </motion.div>
  );
};

export default TimelineNode; 