import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Icon } from '@/components/Icon';

const IndustryCard = ({ industry }) => {
  return (
    <Link to={`/industries/${industry.id}`}>
      <motion.div
        whileHover={{ y: -5 }}
        className="relative p-8 rounded-3xl bg-n-7 border border-n-6 overflow-hidden group"
      >
        <div className="relative z-2">
          <div className={`w-12 h-12 mb-4 rounded-xl bg-gradient-to-br ${industry.color} 
            flex items-center justify-center`}>
            <Icon name={industry.icon} className="w-6 h-6 text-n-1" />
          </div>
          <h4 className="h4 mb-4">{industry.title}</h4>
          <p className="body-2 text-n-3">{industry.description}</p>
        </div>
        
        <div className={`absolute inset-0 bg-gradient-to-br 
          ${industry.color} opacity-0 group-hover:opacity-10 
          transition-opacity duration-500`} />
      </motion.div>
    </Link>
  );
};

export default IndustryCard;
