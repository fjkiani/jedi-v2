import React from 'react';
import { motion } from 'framer-motion';
import Section from './Section';
import { Icon } from './Icon';
import { GradientLight } from './design/Benefits';

const features = [
  {
    icon: 'cpu',
    title: 'Proprietary JEDI AI Platform',
    description: 'Leverage our unique JEDI Ensemble™ and Rules™ engines for unparalleled AI capabilities and flexibility.',
    gradient: 'from-[#58a4ff] to-[#a658ff]'
  },
  {
    icon: 'target',
    title: 'Use Case Driven Solutions',
    description: 'We focus on solving specific, high-value business problems with tailored AI applications, not generic tools.',
    gradient: 'from-[#ff3d9a] to-[#ff9b3d]'
  },
  {
    icon: 'git-branch',
    title: 'Seamless Integration Expertise',
    description: 'Deep experience in integrating advanced AI smoothly into your existing workflows and technology stack.',
    gradient: 'from-[#58ff6d] to-[#58fff4]'
  },
  {
    icon: 'trending-up',
    title: 'Continuous Performance & Adaptation',
    description: 'Our solutions learn and improve, backed by robust monitoring and MLOps practices for lasting value.',
    gradient: 'from-[#ff583d] to-[#ff58c4]'
  }
];

const WhyChooseUs = () => {
  return (
    <Section className="overflow-hidden">
      <div className="container relative">
        {/* Background Gradients */}
        <div className="absolute top-0 left-[20%] w-[800px] h-[800px] 
          bg-radial-gradient from-primary-1/20 to-transparent blur-xl" />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-center mb-12 relative z-1"
        >
          <h2 className="h2 mb-4 inline-block bg-clip-text text-transparent 
            bg-gradient-to-r from-primary-1 to-n-1">
            Why Choose Jedi Labs
          </h2>
          <p className="body-1 text-n-3 md:max-w-md lg:max-w-2xl mx-auto">
            We combine our powerful JEDI AI platform with deep industry expertise
            to deliver transformative solutions that drive tangible business value.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ 
                delay: index * 0.2,
                duration: 0.7,
                ease: "easeOut"
              }}
              className="hover:-translate-y-1 transition-transform duration-300"
            >
              <div className="relative p-[1px] rounded-3xl overflow-hidden 
                bg-gradient-to-b from-n-1/15 to-n-1/0 hover:from-primary-1/15 hover:to-primary-1/5
                transition-colors duration-500 group">
                <div className="relative p-8 rounded-[23px] bg-n-7 overflow-hidden">
                  {/* Card Content */}
                  <div className="relative z-2">
                    <div className="mb-8 relative">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient}
                        flex items-center justify-center transform transition-transform duration-500
                        hover:scale-115 hover:rotate-[10deg]`}>
                        <Icon name={feature.icon} className="w-6 h-6 text-n-1" />
                      </div>
                      <div className="absolute w-px h-[100px] bg-gradient-to-b from-n-1/15 to-n-1/0 
                        bottom-full left-6 transform -translate-x-1/2" />
                    </div>
                    <h4 className="h5 mb-4">{feature.title}</h4>
                    <p className="body-2 text-n-3">{feature.description}</p>
                  </div>

                  {/* Background Elements */}
                  <div className="absolute inset-0 bg-gradient-to-br opacity-[0.08] 
                    transition-opacity duration-500 group-hover:opacity-[0.15]" />
                  <GradientLight />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
};

export default WhyChooseUs;
