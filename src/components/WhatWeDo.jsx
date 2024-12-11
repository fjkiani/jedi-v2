import React from 'react';
import { motion } from 'framer-motion';
import Section from './Section';
import { Icon } from './Icon';
import { businessValues, capabilities } from '../constants/whatWeDoData';
import Tooltip from './Tooltip';

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
              Enterprise Solutions
            </h2>
          </motion.div>
          <p className="body-1 text-n-3 md:max-w-[571px] mx-auto">
            Comprehensive technology solutions from AI and data engineering to full-stack development
          </p>
        </motion.div>

        {/* Solution Cards with hover effects */}
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
                {/* Icon Container */}
                <div className={`w-12 h-12 mb-4 rounded-xl bg-gradient-to-br ${item.color} 
                  flex items-center justify-center transform group-hover:rotate-12 transition-transform`}>
                  <Icon name={item.icon} className="w-6 h-6 text-n-1" />
                </div>
                
                {/* Metric Value with Citation */}
                <div className="flex items-baseline gap-2 mb-3">
                  <span className="h4 text-primary-1">{item.value}</span>
                  <Tooltip content={item.tooltip}>
                    <span className="text-sm text-n-3 cursor-help whitespace-nowrap">
                      ({item.citation})
                    </span>
                  </Tooltip>
                </div>
                
                {/* Title and Description */}
                <div className="mb-2 text-n-1 font-bold">{item.title}</div>
                <p className="body-2 text-n-3">{item.description}</p>
              </div>

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-n-8/50 via-n-8/50 to-n-8/0 
                opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </motion.div>
          ))}
        </motion.div>

        {/* Capabilities Section */}
        {/* <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {capabilities.map((capability, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.01 }}
              className="p-6 rounded-[20px] border border-n-6 bg-n-7"
            >
              <div className="flex items-center gap-4 mb-4">
                <Icon name={capability.icon} className="w-8 h-8 text-primary-1" />
                <h3 className="h4 text-n-1">{capability.title}</h3>
              </div>
              <p className="body-2 text-n-3 mb-4">{capability.description}</p>
              <ul className="grid grid-cols-2 gap-2">
                {capability.details.map((detail, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-n-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-1" />
                    <span className="text-sm">{detail}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div> */}

        {/* Background Elements */}
        <div className="absolute top-0 left-[40%] w-[70%] h-[70%] 
          bg-radial-gradient from-primary-1/30 to-transparent blur-xl pointer-events-none" />
      </div>
    </Section>
  );
};

export default WhatWeDo; 