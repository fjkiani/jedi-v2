import React from 'react';
import { motion } from 'framer-motion';
import Section from '@/components/Section';
import { Icon } from '@/components/Icon';
import { Link } from 'react-router-dom';

const IndustryHero = ({ industry }) => {
  if (!industry) {
    return null;
  }

  return (
    <Section className="overflow-hidden pt-[8rem]">
      <div className="container relative">
        {/* Breadcrumb */}
        <div className="text-n-3 mb-6 flex items-center gap-2">
          <Link to="/industries" className="hover:text-n-1">Industries</Link>
          <Icon name="arrow-right" className="w-4 h-4" />
          <span className="text-n-1">{industry.name}</span>
        </div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="h1 mb-6"
        >
          {industry.name}
        </motion.h1>
      </div>
    </Section>
  );
};

export default IndustryHero;
