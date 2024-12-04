import React from 'react';
import { motion } from 'framer-motion';
import Section from './Section';
import { Icon } from './Icon';
import { businessValues } from '../constants/whatWeDoData';

const WhatWeDo = () => {
  return (
    <Section className="overflow-hidden">
      <div className="container relative">
        {/* Header with animated text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-block"
          >
            <h2 className="h2 mb-5 bg-clip-text text-transparent bg-gradient-to-r from-primary-1 to-primary-2">
              Transforming Businesses with AI
            </h2>
          </motion.div>
          <p className="body-1 text-n-3 md:max-w-[571px] mx-auto">
            Enterprise-grade AI and machine learning solutions for intelligent
            automation and decision making
          </p>
        </motion.div>

        {/* Business Values with hover effects */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20"
        >
          {businessValues.map((item, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.02, y: -5 }}
              className="relative p-6 rounded-[20px] border border-n-6 bg-n-7 overflow-hidden group"
            >
              <div className="relative z-1">
                <div className={`w-12 h-12 mb-4 rounded-xl bg-gradient-to-br ${item.color} 
                  flex items-center justify-center transform group-hover:rotate-12 transition-transform`}>
                  <Icon name={item.icon} className="w-6 h-6 text-n-1" />
                </div>
                <div className="flex items-center justify-between mb-3">
                  <motion.span 
                    className="h4 text-primary-1"
                    whileHover={{ scale: 1.1 }}
                  >
                    {item.value}
                  </motion.span>
                </div>
                <div className="mb-2 text-n-1 font-bold">{item.title}</div>
                <p className="body-2 text-n-3">{item.description}</p>
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-n-8/50 via-n-8/50 to-n-8/0 
                opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </motion.div>
          ))}
        </motion.div>

        {/* Background Elements */}
        <div className="absolute top-0 left-[40%] w-[70%] h-[70%] 
          bg-radial-gradient from-primary-1/30 to-transparent blur-xl pointer-events-none" />
      </div>
    </Section>
  );
};

export default WhatWeDo; 