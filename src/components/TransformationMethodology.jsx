import React from 'react';
import { motion } from 'framer-motion';
import Section from './Section';
import { fadeIn } from '@/utils/motion';
import { Icon } from './Icon';

const jediMethodologySteps = [
  {
    number: '01',
    title: 'Deep Dive & Strategic Alignment',
    description: 'We partner with you to thoroughly understand your unique business challenges, data landscape, and strategic objectives. We identify precisely where and how our AI platform can deliver maximum impact.',
    features: [
      'Collaborative problem definition',
      'In-depth data analysis & readiness assessment',
      'AI opportunity mapping to business goals',
      'Defining clear, measurable success criteria'
    ],
    iconName: 'target'
  },
  {
    number: '02',
    title: 'Tailored Platform Configuration',
    description: 'Leveraging our core JEDI engines (like Ensemble™ and Rules™), we configure the platform and develop specialized AI models tailored to your specific use case, ensuring a solution built for performance.',
    features: [
      'Configuring core JEDI AI Engines',
      'Custom AI model development & tuning',
      'Solution architecture design',
      'Establishing data pipelines & integration points'
    ],
    iconName: 'settings'
  },
  {
    number: '03',
    title: 'Seamless Integration & Deployment',
    description: 'Our team focuses on integrating the configured AI solution smoothly into your existing workflows and technology stack, ensuring rapid time-to-value and minimal disruption.',
    features: [
      'API-driven integration with existing systems',
      'Cloud, hybrid, or on-premise deployment',
      'User training and comprehensive onboarding',
      'Phased rollout and validation strategy'
    ],
    iconName: 'git-branch'
  },
  {
    number: '04',
    title: 'Continuous Optimization & Adaptation',
    description: 'Post-deployment, we establish processes for ongoing monitoring, performance analysis, and model retraining, ensuring the AI solution adapts and improves over time.',
    features: [
      'Real-time performance monitoring & dashboards',
      'Data-driven solution refinement (MLOps)',
      'User feedback loop integration',
      'Proactive adaptation to new data & requirements'
    ],
    iconName: 'trending-up'
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
          <h2 className="h2 mb-4">Our Approach: Platform-Powered Transformation</h2>
          <p className="body-1 text-n-4 md:max-w-3xl mx-auto">
            We leverage our proprietary JEDI AI platform and a structured approach
            to rapidly design, build, and deploy intelligent solutions tailored
            to solve your most critical business challenges.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {jediMethodologySteps.map((step, index) => (
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
                    <Icon 
                      name={step.iconName || 'check'}
                      className="w-6 h-6 text-color-1 mr-3 flex-shrink-0"
                    />
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
            Discuss Your Transformation
          </a>
        </motion.div>
      </div>
    </Section>
  );
};

export default TransformationMethodology; 