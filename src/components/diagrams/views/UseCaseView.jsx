import React from 'react';
import { motion } from 'framer-motion';
import { Icon } from '../../Icon';

export const UseCaseView = ({ diagram }) => {
  const {
    title,
    description,
    businessValue,
    capabilities,
    examples
  } = diagram.useCase;

  const sections = [
    {
      title: 'Business Value',
      items: businessValue,
      iconName: 'chart'
    },
    {
      title: 'Capabilities',
      items: capabilities,
      iconName: 'tool'
    },
    {
      title: 'Examples',
      items: examples,
      iconName: 'lightbulb'
    }
  ];

  return (
    <div className="space-y-8">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center"
      >
        <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
        <p className="text-n-3">{description}</p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6">
        {sections.map(({ title, items, iconName }, index) => (
          <motion.div
            key={title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-n-6 rounded-xl p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <Icon 
                name={iconName} 
                className="w-5 h-5 text-primary-1" 
              />
              <h3 className="text-lg font-semibold text-white">{title}</h3>
            </div>
            <ul className="space-y-3">
              {items?.map((item, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 + i * 0.05 }}
                  className="flex items-start gap-2"
                >
                  <Icon 
                    name="check" 
                    className="w-5 h-5 text-primary-1 mt-1" 
                  />
                  <span className="text-n-3">{item}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default UseCaseView; 