import { motion } from 'framer-motion';

const TimelineConnector = ({ active, position }) => {
  return (
    <div className="relative h-full w-0.5 mx-auto">
      <motion.div
        initial={{ height: 0 }}
        animate={{ height: '100%' }}
        transition={{ duration: 0.5, delay: position * 0.2 }}
        className={`
          absolute inset-0
          ${active ? 'bg-color-1' : 'bg-n-3 dark:bg-n-6'}
          transition-colors duration-300
        `}
      />
    </div>
  );
};

export default TimelineConnector; 