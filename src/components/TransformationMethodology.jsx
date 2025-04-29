import React from 'react';
import { motion } from 'framer-motion';
import Section from './Section';
import { fadeIn } from '@/utils/motion';

const methodologySteps = [
  {
    number: '01',
    title: 'Identify Exponential Opportunities',
    description: 'We analyze your business to identify untapped potential and opportunities for exponential growth.',
    features: [
      'Comprehensive business analysis',
      'Market opportunity assessment',
      'Competitive advantage identification',
      'Growth bottleneck detection'
    ],
    icon: 'M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z M8 12L11 15L16 10'
  },
  {
    number: '02',
    title: 'Design 100x Solutions',
    description: 'Our experts create custom strategies and solutions designed specifically for your business needs.',
    features: [
      'Custom technology roadmap',
      'AI-powered solution design',
      'Process transformation blueprint',
      'Scalability architecture'
    ],
    icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z M12 8v4'
  },
  {
    number: '03',
    title: 'Implement & Transform',
    description: 'We execute the transformation plan with precision, ensuring minimal disruption to your operations.',
    features: [
      'Rapid implementation methodology',
      'Change management support',
      'Staff training and enablement',
      'Continuous improvement cycles'
    ],
    icon: 'M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z'
  },
  {
    number: '04',
    title: 'Scale & Accelerate',
    description: 'We help you scale the solution across your organization and continuously optimize for maximum impact.',
    features: [
      'Enterprise-wide deployment',
      'Performance optimization',
      'Data-driven refinement',
      'Continuous innovation support'
    ],
    icon: 'M12 2L2 7L12 12L22 7L12 2Z M2 17L12 22L22 17 M2 12L12 17L22 12'
  }
];

const TransformationMethodology = () => {
  return (
    <Section className="overflow-hidden">
      <div className="container">
        <motion.div
          variants={fadeIn('up')}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-20"
        >
          <h2 className="h2 mb-4">Our 100x Methodology</h2>
          <p className="body-1 text-n-4 md:max-w-3xl mx-auto">
            Our proven approach has helped businesses across industries achieve exponential growth.
            We follow a systematic process designed to identify opportunities, implement solutions,
            and drive transformative results.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {methodologySteps.map((step, index) => (
            <motion.div
              key={index}
              variants={fadeIn('up')}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="bg-n-7 rounded-2xl p-8 lg:p-10 border border-n-6 hover:border-color-1 transition-colors"
            >
              <div className="flex items-center mb-6">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-color-1 text-n-8 font-bold mr-4">
                  {step.number}
                </div>
                <h3 className="h3">{step.title}</h3>
              </div>
              
              <p className="body-2 text-n-3 mb-8">
                {step.description}
              </p>
              
              <ul className="space-y-3">
                {step.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start">
                    <svg 
                      className="w-6 h-6 text-color-1 mr-3 flex-shrink-0" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d={step.icon} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className="body-2">{feature}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <motion.div
          variants={fadeIn('up')}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <a 
            href="/contact" 
            className="button button-primary button-lg"
          >
            Start Your 100x Journey
          </a>
        </motion.div>
      </div>
    </Section>
  );
};

export default TransformationMethodology; 