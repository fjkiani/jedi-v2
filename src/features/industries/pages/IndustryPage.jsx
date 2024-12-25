import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Section from '@/components/Section';
import { Icon } from '@/components/Icon';
import IndustrySolutions from '../components/IndustrySolutions';
import { industriesList } from '@/constants/industry';

const IndustryPage = () => {
  const { industryId } = useParams();
  const industry = industriesList.find(ind => ind.id === industryId);

  if (!industry) {
    return (
      <div className="container pt-[8rem]">
        <h1 className="h1 text-center">Industry Not Found</h1>
      </div>
    );
  }

  return (
    <>
      {/* Hero Section */}
      <Section className="overflow-hidden pt-[8rem]">
        <div className="container relative">
          {/* Breadcrumb */}
          <div className="text-n-3 mb-6 flex items-center gap-2">
            <Link to="/industries" className="hover:text-n-1">Industries</Link>
            <Icon name="arrow-right" className="w-4 h-4" />
            <span className="text-n-1">{industry.title}</span>
          </div>

          {/* Hero Content */}
          <div className="relative z-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-[45rem]"
            >
              <h1 className="h1 mb-6 inline-block bg-clip-text text-transparent 
                bg-gradient-to-r from-primary-1 to-primary-2">
                {industry.title}
              </h1>
              <p className="body-1 text-n-3 mb-8">
                {industry.description}
              </p>
            </motion.div>
          </div>
        </div>
      </Section>

      {/* Solutions Section */}
      <Section>
        <div className="container">
          <IndustrySolutions industry={industry} />
        </div>
      </Section>
    </>
  );
};

export default IndustryPage;