import { motion } from 'framer-motion';

export const IndustryHeader = ({ title, description }) => (
  <>
    <motion.h1 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="h1 mb-6"
    >
      {title}
    </motion.h1>

    <motion.p 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="text-n-3 text-lg mb-8"
    >
      {description}
    </motion.p>
  </>
); 