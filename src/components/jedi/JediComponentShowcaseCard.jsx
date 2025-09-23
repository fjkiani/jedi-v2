import React from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@/components/Icon';
import { Link } from 'react-router-dom';

const JediComponentShowcaseCard = ({ component }) => {
  if (!component) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-n-1 dark:bg-n-8 rounded-2xl shadow-lg p-6 flex flex-col h-full border border-n-2 dark:border-n-6"
    >
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 flex items-center justify-center bg-primary-1/10 rounded-lg">
          <Icon name={component.icon || 'cpu'} className="w-6 h-6 text-primary-1" />
        </div>
        <h3 className="h5 text-n-8 dark:text-n-1">{component.name}</h3>
      </div>
      <p className="body-2 text-n-6 dark:text-n-4 mb-4 flex-grow">{component.tagline}</p>
      
      <div className="mt-auto pt-4 border-t border-n-2 dark:border-n-6">
        <ul className="space-y-2 mb-6">
          {component.capabilities?.primary.slice(0, 3).map((capability, index) => (
            <li key={index} className="flex items-start gap-3 text-sm">
              <Icon name="check" className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
              <span className="text-n-7 dark:text-n-3">{capability.name}</span>
            </li>
          ))}
        </ul>
        <Link 
          to={`/technology/${component.slug || component.id}`}
          className="text-sm font-semibold text-primary-1 hover:text-primary-2 flex items-center gap-2 transition-colors"
        >
          <span>Learn More</span>
          <Icon name="arrow-right" className="w-4 h-4" />
        </Link>
      </div>
    </motion.div>
  );
};

export default JediComponentShowcaseCard;
