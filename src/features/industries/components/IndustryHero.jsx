import React from 'react';
import { motion } from 'framer-motion';
import Section from '@/components/Section';
import { Icon } from '@/components/Icon';

const IndustryHero = ({ industry }) => {
  if (!industry) return null;

  return (
    <Section className="overflow-hidden pt-[8rem]">
      <div className="container relative">
        <div className="relative z-1">
          {/* Breadcrumb */}
          <div className="text-n-3 mb-6 flex items-center gap-2">
            <span>Industries</span>
            <Icon name="arrow-right" className="w-4 h-4" />
            <span className="text-n-1">{industry.title}</span>
          </div>

          {/* Hero Content */}
          <div className="relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-[45rem]"
            >
              {/* Title with gradient */}
              <h1 className="h1 mb-6 inline-block bg-clip-text text-transparent 
                bg-gradient-to-r from-primary-1 to-primary-2">
                {industry.title}
              </h1>

              {/* Description */}
              <p className="body-1 text-n-3 mb-8">
                {industry.description}
              </p>

              {/* Metrics/Stats */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-12">
                {industry.solutions.map((solution) => (
                  solution.metrics.slice(0, 3).map((metric, index) => (
                    <div key={index} className="p-4 rounded-2xl bg-n-7 border border-n-6">
                      <div className="h4 mb-2 text-primary-1">
                        {metric.value}
                      </div>
                      <div className="text-n-3">
                        {metric.label}
                      </div>
                    </div>
                  ))
                ))[0]}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4">
                <button className="button button-primary">
                  Explore Solutions
                </button>
                <button className="button button-secondary">
                  Contact Sales
                </button>
              </div>
            </motion.div>

            {/* Background Image */}
            <div className="absolute top-0 right-0 w-[45%] h-full">
              <div className="relative h-full">
                <motion.img
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  src={industry.heroImage}
                  alt={industry.title}
                  className="absolute right-0 top-1/2 -translate-y-1/2 w-full h-auto 
                    rounded-2xl object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-n-8 to-n-8/0" />
              </div>
            </div>
          </div>
        </div>

        {/* Background Decorations */}
        <div className="absolute top-0 left-[40%] w-[70%] h-[70%] 
          bg-radial-gradient from-primary-1/30 to-transparent blur-xl pointer-events-none" />
      </div>
    </Section>
  );
};

export default IndustryHero;
