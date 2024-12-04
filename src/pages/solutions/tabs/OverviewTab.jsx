import React from 'react';
import { motion } from 'framer-motion';

const OverviewTab = ({ solution }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
      {/* Features/Benefits */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="h3 mb-6">Key Features</h2>
        <div className="space-y-6">
          {solution.subcategories?.map((sub, index) => (
            <div 
              key={index}
              className="p-6 rounded-2xl bg-n-7 border border-n-6 hover:border-n-5 transition-colors"
            >
              <h3 className="h5 mb-4">{sub}</h3>
              <p className="text-n-3">
                Detailed explanation of {sub} would go here...
              </p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Benefits */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h2 className="h3 mb-6">Benefits</h2>
        <div className="p-6 rounded-2xl bg-n-7 border border-n-6">
          <ul className="space-y-4">
            {solution.benefits?.map((benefit, index) => (
              <li key={index} className="flex items-center">
                <span className="w-3 h-3 rounded-full bg-color-1 mr-3" />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </div>
      </motion.div>
    </div>
  );
};

export default OverviewTab; 