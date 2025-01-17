import React from 'react';
import { motion } from 'framer-motion';
import Section from './Section';
import { Icon } from './Icon';
import { businessValues } from '../constants/whatWeDoData';
import Tooltip from './Tooltip';
import { JEDIDiagramView } from './diagrams/JEDIDiagramView';
import { jediArchitecture } from '@/constants/solutions/jedi-architecture';
import { securityArchitecture } from '@/constants/solutions/security-architecture';
import { aiMlSolution } from '@/constants/solutions/ai-ml';
import { aiAgentsSolution } from '@/constants/solutions/ai-agents';
// Import Swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import { Link } from 'react-router-dom';

const architectures = [
  {
    id: 'jedi',
    diagram: jediArchitecture,
    title: 'J.E.D.I Architecture',
    description: 'Our core principles in action'
  },
  {
    id: 'security',
    diagram: securityArchitecture,
    title: 'Security Architecture',
    description: 'Our comprehensive approach to protecting data and systems'
  },
  {
    id: 'ai-ml',
    diagram: {
      ...aiMlSolution.architecture,
      nodes: aiMlSolution.architecture.nodes.map(node => ({
        ...node,
        description: node.description || ''
      }))
    },
    title: 'AI/ML Architecture',
    description: 'Scalable AI/ML system architecture with components for data processing, model training, and deployment'
  },
  {
    id: 'ai-agents',
    diagram: {
      ...aiAgentsSolution.architecture,
      nodes: aiAgentsSolution.architecture.nodes.map(node => ({
        ...node,
        description: node.description || ''
      }))
    },
    title: 'AI Agents Architecture',
    description: 'Autonomous AI agents that perform complex tasks and interact with various tools and services'
  }
];

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
          <p className="body-1 text-n-6 dark:text-n-3 md:max-w-[571px] mx-auto">
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
              className="relative p-6 rounded-[20px] border border-n-6 bg-white/50 dark:bg-n-7 overflow-hidden group transition-colors duration-200"
            >
              <div className="relative z-1">
                {/* Icon Container */}
                <div className={`w-12 h-12 mb-4 rounded-xl bg-gradient-to-br ${item.color} 
                  flex items-center justify-center transform group-hover:rotate-12 transition-transform`}>
                  <Icon name={item.icon} className="w-6 h-6 text-n-1" />
                </div>
                
                {/* Metric Value with Citation */}
                <div className="flex items-baseline gap-2 mb-3">
                  <span className="h4 text-primary-1 dark:text-n-1">{item.value}</span>
                  <Tooltip content={item.tooltip}>
                    <span className="text-sm text-n-6 dark:text-n-3 cursor-help whitespace-nowrap">
                      ({item.citation})
                    </span>
                  </Tooltip>
                </div>
                
                {/* Title and Description */}
                <div className="mb-2 text-n-8 dark:text-n-1 font-bold">{item.title}</div>
                <p className="body-2 text-n-6 dark:text-n-3">{item.description}</p>
              </div>

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-n-8/50 via-n-8/50 to-n-8/0 
                opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </motion.div>
          ))}
        </motion.div>

        {/* Architecture Diagrams Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-4 text-n-6 dark:text-n-3">
              <Icon name="arrow-left" className="w-6 h-6 animate-pulse" />
              <Icon name="arrow-right" className="w-6 h-6 animate-pulse" />
            </div>
          </div>

          {/* Architecture Slider */}
          <div className="relative">
            <Swiper
              modules={[Navigation, Pagination, EffectFade]}
              spaceBetween={30}
              slidesPerView={1}
              navigation={{
                prevEl: '.swiper-button-prev',
                nextEl: '.swiper-button-next',
              }}
              pagination={{
                clickable: true,
                el: '.swiper-pagination',
                bulletClass: 'swiper-pagination-bullet',
                bulletActiveClass: 'swiper-pagination-bullet-active',
              }}
              effect="fade"
              fadeEffect={{ crossFade: true }}
              className="architecture-slider"
            >
              {architectures.map((arch) => (
                <SwiperSlide key={arch.id}>
                  <div className="rounded-2xl border border-n-6 bg-white/50 dark:bg-n-7 p-6 transition-colors duration-200">
                    <div className="text-center mb-8">
                      <h4 className="h4 mb-4 text-n-8 dark:text-primary-1">{arch.title}</h4>
                      <p className="body-2 text-n-6 dark:text-n-3 mb-6">{arch.description}</p>
                      <Link 
                        to={arch.id === 'jedi' ? '/about' : `/solutions/${arch.id}`}
                        className="button button-primary px-8 py-3 inline-flex items-center gap-2 hover:shadow-xl dark:hover:shadow-primary-1/25"
                        aria-label={`Learn more about ${arch.title}`}
                      >
                        {`Explore ${arch.title}`}
                        <Icon name="arrow-right" className="w-4 h-4" />
                      </Link>
                    </div>
                    <div className="bg-white/80 dark:bg-n-8/80 rounded-xl p-4 transition-colors duration-200">
                      <JEDIDiagramView diagram={arch.diagram} showHeader={false} />
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Navigation Buttons */}
            <button className="swiper-button-prev absolute left-4 top-1/2 transform -translate-y-1/2 z-10 w-14 h-14 flex items-center justify-center rounded-full bg-white/90 dark:bg-n-6/90 hover:bg-n-3/90 dark:hover:bg-n-5/90 transition-all duration-300 backdrop-blur-sm border border-n-3 dark:border-n-5 hover:border-n-4 hover:scale-110 group">
              <Icon name="arrow-left" className="w-8 h-8 text-n-8 dark:text-n-1 group-hover:text-primary-1 transition-colors" />
            </button>
            <button className="swiper-button-next absolute right-4 top-1/2 transform -translate-y-1/2 z-10 w-14 h-14 flex items-center justify-center rounded-full bg-white/90 dark:bg-n-6/90 hover:bg-n-3/90 dark:hover:bg-n-5/90 transition-all duration-300 backdrop-blur-sm border border-n-3 dark:border-n-5 hover:border-n-4 hover:scale-110 group">
              <Icon name="arrow-right" className="w-8 h-8 text-n-8 dark:text-n-1 group-hover:text-primary-1 transition-colors" />
            </button>

            {/* Custom Pagination */}
            <div className="swiper-pagination flex justify-center gap-3 mt-8" />
          </div>
        </motion.div>

        {/* Background Elements */}
        <div className="absolute top-0 left-[40%] w-[70%] h-[70%] 
          bg-radial-gradient from-primary-1/30 to-transparent blur-xl pointer-events-none" />
      </div>

      {/* Add custom styles for Swiper */}
      <style jsx global>{`
        .architecture-slider {
          position: relative;
          padding-bottom: 4rem;
        }
        .swiper-pagination {
          bottom: 0 !important;
        }
        .swiper-pagination-bullet {
          width: 10px;
          height: 10px;
          background: var(--color-n-4);
          opacity: 0.5;
          transition: all 0.3s;
          cursor: pointer;
        }
        .swiper-pagination-bullet:hover {
          opacity: 0.8;
          transform: scale(1.2);
        }
        .swiper-pagination-bullet-active {
          width: 32px;
          border-radius: 5px;
          background: var(--color-primary-1);
          opacity: 1;
        }
        .swiper-pagination-bullet-active:hover {
          transform: none;
        }
        .swiper-button-prev,
        .swiper-button-next {
          opacity: 0.8;
          transition: all 0.3s;
        }
        .swiper-button-prev:hover,
        .swiper-button-next:hover {
          opacity: 1;
        }
        .swiper-button-prev:after,
        .swiper-button-next:after {
          display: none;
        }
        .button-primary {
          background: linear-gradient(92.7deg, var(--color-primary-1) 0%, var(--color-primary-2) 100%);
          color: var(--color-n-1);
          border-radius: 0.75rem;
          font-weight: 600;
          transition: all 0.3s;
        }
        .button-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(var(--color-primary-1-rgb), 0.3);
        }

        /* Dark mode specific styles */
        :root[class~="dark"] .button-primary:hover {
          box-shadow: 0 4px 16px rgba(var(--color-primary-1-rgb), 0.5);
        }
      `}</style>
    </Section>
  );
};

export default WhatWeDo; 