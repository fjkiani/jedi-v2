import React from 'react';
import { motion } from 'framer-motion';
import Section from '@/components/Section';
import { Icon } from '@/components/Icon';
import { Link } from 'react-router-dom';

const IndustryHero = ({ industryName, industryDescription }) => {
  if (!industryName) {
    return null;
  }

  return (
    <Section className="overflow-hidden pt-[8rem]">
      <div className="container relative">
        {/* Breadcrumb */}
        <div className="text-n-3 mb-6 flex items-center gap-2">
          <Link to="/industries" className="hover:text-n-1">Industries</Link>
          <Icon name="arrow-right" className="w-4 h-4" />
          <span className="text-n-1">{industryName}</span>
        </div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="h1 mb-6"
        >
          {industryName}
        </motion.h1>

        {industryDescription && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="body-1 max-w-3xl text-n-2"
          >
            {industryDescription}
          </motion.p>
        )}
      </div>
    </Section>
  );
};

export default IndustryHero;
