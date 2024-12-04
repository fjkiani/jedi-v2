import React from 'react';
import { motion } from 'framer-motion';

const DEFAULT_ICON = 'https://cdn.simpleicons.org/dotenv';

export const TechBadge = ({ name, icon, description, delay = 0 }) => {
  const [imgError, setImgError] = React.useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay }}
      className="bg-n-6 rounded-lg p-4 hover:bg-n-5 transition-colors"
    >
      <div className="flex items-center gap-3">
        <img 
          src={imgError ? DEFAULT_ICON : icon} 
          alt={name}
          className="w-6 h-6"
          onError={() => setImgError(true)}
        />
        <span className="text-white font-medium">{name}</span>
      </div>
      {description && (
        <p className="text-n-3 text-sm mt-2">{description}</p>
      )}
    </motion.div>
  );
};

export default TechBadge; 