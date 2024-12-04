import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import Section from '@/components/Section';
import { Icon } from '@/components/Icon';

const IndustrySolutions = ({ industry }) => {
  const [activeSolution, setActiveSolution] = useState(0);

  if (!industry || !industry.solutions) return null;

  return (
    <Section className="overflow-hidden">
      <div className="container relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="h2 mb-4">Our Solutions</h2>
          <p className="body-1 text-n-3 md:max-w-[571px] mx-auto">
            Discover how our AI solutions transform {industry.title}
          </p>
        </motion.div>

        {/* Solutions Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {industry.solutions.map((solution, index) => (
            <motion.div
              key={solution.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative p-8 rounded-3xl bg-n-7 border border-n-6 overflow-hidden group"
            >
              <div className="relative z-2">
                {/* Solution Icon */}
                <div className={`w-12 h-12 mb-6 rounded-xl bg-gradient-to-br ${industry.color} 
                  flex items-center justify-center`}>
                  <Icon name={solution.icon || 'bulb'} className="w-6 h-6 text-n-1" />
                </div>

                {/* Solution Content */}
                <h4 className="h4 mb-4">{solution.title}</h4>
                <p className="body-2 text-n-3 mb-6">{solution.description}</p>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {solution.metrics.map((metric, i) => (
                    <div key={i} className="p-4 rounded-2xl bg-n-6">
                      <div className="h5 mb-1 text-primary-1">{metric.value}</div>
                      <div className="text-sm text-n-3">{metric.label}</div>
                    </div>
                  ))}
                </div>

                {/* Technologies */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {solution.technologies.map((tech, i) => (
                    <span
                      key={i}
                      className="px-4 py-1 rounded-full bg-n-6 text-n-3 text-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Learn More Link */}
                <Link
                  to={`/industries/${industry.id}/${solution.id}`}
                  className="flex items-center gap-2 text-primary-1 hover:text-primary-2 transition-colors"
                >
                  <span>Learn More</span>
                  <Icon name="arrow-right" className="w-4 h-4" />
                </Link>
              </div>

              {/* Hover Effect Background */}
              <div className={`absolute inset-0 bg-gradient-to-br 
                ${industry.color} opacity-0 group-hover:opacity-10 
                transition-opacity duration-500`} />
            </motion.div>
          ))}
        </div>

        {/* Benefits Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20"
        >
          <h3 className="h3 mb-10 text-center">Key Benefits</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {industry.solutions[0].benefits.map((benefit, index) => (
              <div
                key={index}
                className="p-6 rounded-2xl bg-n-7 border border-n-6"
              >
                <div className="flex items-center gap-4">
                  <div className="w-2 h-2 rounded-full bg-primary-1" />
                  <span className="text-n-1">{benefit}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Background Elements */}
        <div className="absolute top-0 right-0 w-[70%] h-[70%] 
          bg-radial-gradient from-primary-1/30 to-transparent blur-xl pointer-events-none" />
      </div>
    </Section>
  );
};

export default IndustrySolutions;
