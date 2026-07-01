import React from 'react';
import { motion } from 'framer-motion';
import Section from './Section';
import { fadeIn } from '@/utils/motion';
import { FiCpu, FiCode, FiZap, FiTrendingUp, FiCheckCircle, FiArrowRight } from 'react-icons/fi';
import { useTheme } from '@/context/ThemeContext';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import { JEDI_METHODOLOGY_STEPS } from '@/constants/methodology';

const methodologySwiperStyles = `
  .methodology-swiper .swiper-button-prev,
  .methodology-swiper .swiper-button-next {
    color: var(--swiper-navigation-color, inherit);
    width: 36px; height: 36px;
    background-color: rgba(0, 0, 0, 0.25);
    border-radius: 50%;
    padding: 6px;
    transition: background-color 0.2s;
  }
  .methodology-swiper .swiper-button-prev:hover,
  .methodology-swiper .swiper-button-next:hover {
    background-color: rgba(0, 0, 0, 0.4);
  }
  .methodology-swiper .swiper-button-prev::after,
  .methodology-swiper .swiper-button-next::after {
    font-size: 14px; font-weight: bold;
  }
  .methodology-swiper .swiper-pagination-bullet {
    background-color: var(--swiper-pagination-bullet-inactive-color, #999);
    opacity: 0.7;
  }
  .methodology-swiper .swiper-pagination-bullet-active {
    background-color: var(--tw-color-primary-1, #AC6AFF);
    opacity: 1;
  }
`;

const StepCard = ({ step, index, isDarkMode }) => (
  <div
    className={`relative backdrop-blur-sm border p-6 hover:border-primary-1 transition-all group flex flex-col items-center text-center min-h-[420px] ${isDarkMode
      ? 'bg-n-8/90 border-n-6 hover:bg-n-8'
      : 'bg-white/90 border-n-3 shadow-lg hover:shadow-xl'
      }`}
  >
    <div className={`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-3 py-1 font-mono text-xs font-bold border tracking-wider ${isDarkMode ? 'bg-n-8 border-n-6 text-n-1' : 'bg-white border-n-3 text-n-8'}`}>
      PHASE {step.number}
    </div>
    <Link to={`/methodology/${step.slug}`} className="cursor-pointer block">
      <div className={`w-20 h-20 mb-6 flex items-center justify-center rounded-full border-2 border-dashed group-hover:border-solid group-hover:scale-110 transition-all duration-300 ${isDarkMode ? 'border-n-6 bg-n-8/50' : 'border-n-3 bg-n-1'}`}>
        <step.icon size={32} className="text-primary-1" />
      </div>
    </Link>
    <Link to={`/methodology/${step.slug}`} className="cursor-pointer block hover:opacity-80 transition-opacity">
      <h3 className={`h5 font-mono uppercase mb-2 group-hover:text-primary-1 transition-colors ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>
        {step.title}
      </h3>
    </Link>
    <div className={`text-xs font-mono mb-6 uppercase tracking-widest ${isDarkMode ? 'text-n-4' : 'text-n-5'}`}>
      {step.status}
    </div>
    <div className="w-full h-1 bg-n-6 overflow-hidden rounded-full mb-6">
      <div className="h-full bg-primary-1 w-full origin-left animate-progress-line"></div>
    </div>
    <div className={`w-full text-left bg-n-1/5 p-4 rounded border ${isDarkMode ? 'border-n-6 bg-n-7/30' : 'border-n-3 bg-gray-50'}`}>
      <div className="text-[10px] font-mono uppercase mb-2 opacity-50">Active Modules</div>
      <ul className="space-y-1.5 mb-4">
        {step.features.map((feature, idx) => (
          <li key={idx} className="flex items-center gap-2 text-xs font-mono">
            <div className="w-1 h-1 bg-primary-1 rounded-full"></div>
            <span className={isDarkMode ? 'text-n-3' : 'text-n-7'}>{feature}</span>
          </li>
        ))}
      </ul>
      <div className={`pt-3 border-t border-dashed ${isDarkMode ? 'border-gray-700/50' : 'border-gray-300'}`}>
        <div className="text-[10px] font-mono uppercase mb-2 opacity-50 flex items-center gap-1">
          <FiCpu size={10} /> Powered By
        </div>
        <div className="flex flex-wrap gap-1">
          {step.involvedTech?.map((tech, tIdx) => (
            <Link
              key={tIdx}
              to={`/technology/${tech.slug}`}
              className={`text-[10px] px-1.5 py-0.5 rounded border transition-colors ${isDarkMode
                ? 'bg-n-8 border-n-6 text-n-3 hover:text-primary-1 hover:border-primary-1'
                : 'bg-white border-gray-200 text-n-7 hover:text-primary-1 hover:border-primary-1 shadow-sm'
                }`}
            >
              {tech.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
    <div className={`absolute top-0 left-0 w-2 h-2 border-t border-l group-hover:border-primary-1 transition-colors ${isDarkMode ? 'border-n-6' : 'border-n-3'}`}></div>
    <div className={`absolute top-0 right-0 w-2 h-2 border-t border-r group-hover:border-primary-1 transition-colors ${isDarkMode ? 'border-n-6' : 'border-n-3'}`}></div>
    <div className={`absolute bottom-0 left-0 w-2 h-2 border-b border-l group-hover:border-primary-1 transition-colors ${isDarkMode ? 'border-n-6' : 'border-n-3'}`}></div>
    <div className={`absolute bottom-0 right-0 w-2 h-2 border-b border-r group-hover:border-primary-1 transition-colors ${isDarkMode ? 'border-n-6' : 'border-n-3'}`}></div>
  </div>
);

const TransformationMethodology = () => {
  const { isDarkMode } = useTheme();

  return (
    <Section className="overflow-hidden" id="methodology">
      <style>{methodologySwiperStyles}</style>
      <div className="container relative z-10">
        <motion.div
          variants={fadeIn('up')}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="text-center mb-8 md:mb-10"
        >
          <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded border mb-3 ${isDarkMode ? 'bg-n-7 border-n-6' : 'bg-n-1 border-n-3'}`}>
            <div className="w-1.5 h-1.5 rounded-full bg-primary-1 animate-pulse"></div>
            <span className="text-[10px] font-mono text-primary-1 tracking-widest uppercase">Protocol: GENESIS</span>
          </div>
          <h2 className={`text-lg sm:text-xl font-mono uppercase tracking-tight mb-2 ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>How we ship it</h2>
          <p className={`text-sm sm:text-base font-light tracking-wide max-w-2xl mx-auto leading-snug px-2 ${isDarkMode ? 'text-n-4' : 'text-n-6'}`}>
            <strong className={`font-semibold ${isDarkMode ? 'text-primary-1' : 'text-primary-1'}`}>Deploy</strong>
            <span className={isDarkMode ? 'text-n-4' : 'text-n-5'}> production endpoints · </span>
            <strong className={`font-semibold ${isDarkMode ? 'text-primary-1' : 'text-primary-1'}`}>Train</strong>
            <span className={isDarkMode ? 'text-n-4' : 'text-n-5'}> with reproducible curves · </span>
            <strong className={`font-semibold ${isDarkMode ? 'text-primary-1' : 'text-primary-1'}`}>Evaluate</strong>
            <span className={isDarkMode ? 'text-n-4' : 'text-n-5'}> per-epoch, per-class · </span>
            <strong className={`font-semibold ${isDarkMode ? 'text-primary-1' : 'text-primary-1'}`}>Benchmark</strong>
            <span className={isDarkMode ? 'text-n-4' : 'text-n-5'}> honestly</span>
          </p>
        </motion.div>

        {/* Mobile: Slider */}
        <div className="md:hidden relative pb-12">
          <Swiper
            className="methodology-swiper"
            modules={[Navigation, Pagination]}
            spaceBetween={16}
            slidesPerView={1.08}
            centeredSlides={false}
            navigation
            pagination={{ clickable: true }}
            grabCursor
          >
            {JEDI_METHODOLOGY_STEPS.map((step, index) => (
              <SwiperSlide key={index}>
                <StepCard step={step} index={index} isDarkMode={isDarkMode} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Desktop: Grid */}
        <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          <div className={`hidden lg:block absolute top-[4rem] left-[10%] w-[80%] h-0.5 border-t-2 border-dashed z-0 ${isDarkMode ? 'border-n-6/50' : 'border-n-4/30'}`} />
          {JEDI_METHODOLOGY_STEPS.map((step, index) => (
            <motion.div
              key={index}
              variants={fadeIn('up', 'tween', index * 0.2, 0.5)}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="relative z-10"
            >
              <StepCard step={step} index={index} isDarkMode={isDarkMode} />
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
            className={`group uppercase font-mono text-md font-bold tracking-wider inline-flex items-center gap-2 hover:text-primary-1 transition-colors ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}
          >
            <span>Initiate Transformation Sequence</span>
            <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
          </a>
        </motion.div>
      </div>
    </Section>
  );
};

export default TransformationMethodology; 