import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { getAllSolutions } from '@/constants/solutions/index';
import { Icon } from '@/components/Icon';
import Section from '@/components/Section';
import { useTheme } from '@/context/ThemeContext';
import Button from '@/components/Button';
import CallToAction from '@/components/CallToAction';

// Import Swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// Add custom styles for Swiper navigation/pagination
const swiperNavStyles = `
  .homepage-solutions-swiper .swiper-button-prev,
  .homepage-solutions-swiper .swiper-button-next {
    color: var(--swiper-navigation-color, inherit);
    width: 28px; height: 28px;
    background-color: rgba(0, 0, 0, 0.3);
    border-radius: 50%;
    padding: 4px;
    transition: background-color 0.2s;
    top: calc(50% - 14px); /* Adjust vertical position */
  }
  .homepage-solutions-swiper .swiper-button-prev:hover,
  .homepage-solutions-swiper .swiper-button-next:hover {
    background-color: rgba(0, 0, 0, 0.5);
  }
  .homepage-solutions-swiper .swiper-button-prev::after,
  .homepage-solutions-swiper .swiper-button-next::after {
    font-size: 12px; font-weight: bold;
  }
  .homepage-solutions-swiper .swiper-button-prev { left: 8px; }
  .homepage-solutions-swiper .swiper-button-next { right: 8px; }
  .homepage-solutions-swiper .swiper-pagination-bullet {
    background-color: var(--swiper-pagination-bullet-inactive-color, #ccc);
    opacity: 0.7;
  }
  .homepage-solutions-swiper .swiper-pagination-bullet-active {
    background-color: var(--swiper-pagination-color, #007aff);
    opacity: 1;
  }
`;

const SolutionsPage = ({ isHomepage = false }) => {
  const { isDarkMode } = useTheme();
  const allSolutions = getAllSolutions();

  // Add theme-aware colors to styles
  const themeAwareSwiperNavStyles = swiperNavStyles.replace(
    'var(--swiper-navigation-color, inherit)',
    isDarkMode ? '#FFFFFF' : '#000000'
  ).replace(
    'var(--swiper-pagination-color, #007aff)',
    isDarkMode ? '#8E55EA' : '#6C2BD9'
  ).replace(
    'var(--swiper-pagination-bullet-inactive-color, #ccc)',
    isDarkMode ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.3)'
  );

  // Determine solutions and page info based on context
  const solutionsToDisplay = isHomepage ? allSolutions.slice(0, 3) : allSolutions;
  const pageTitle = isHomepage ? "AI/ML Solutions" : "Enterprise Solutions";
  const pageDescription = isHomepage ? 
    "Enterprise-grade AI and machine learning solutions for intelligent automation and decision-making."
    : "Explore our comprehensive suite of enterprise-grade solutions powered by cutting-edge AI technologies.";

  // Helper function to flatten tech stack and get icons (REVISED LOGIC)
  const getTechIcons = (techStack) => {
    if (!techStack || typeof techStack !== 'object') return [];
    
    const iconsToShow = [];
    const MAX_ICONS = 3;

    // Iterate through categories first
    const categories = Object.values(techStack);
    for (const category of categories) {
      if (iconsToShow.length >= MAX_ICONS) break; // Stop if we have enough

      if (typeof category === 'object' && category !== null) {
        // Get the first tech with an icon from this category
        const firstTechEntry = Object.entries(category).find(([name, details]) => 
          details && typeof details === 'object' && details.icon
        );

        if (firstTechEntry) {
          const [name, details] = firstTechEntry;
          // Add only if not already added (based on icon URL to avoid duplicates)
          if (!iconsToShow.some(tech => tech.icon === details.icon)) {
             iconsToShow.push({ name, icon: details.icon });
          }
        }
      }
    }

    // If we still need more icons, fill with remaining unique ones
    if (iconsToShow.length < MAX_ICONS) {
        const allOtherTech = [];
         Object.values(techStack).forEach(category => {
           if (typeof category === 'object' && category !== null) {
             Object.entries(category).forEach(([name, details]) => {
               if (details && typeof details === 'object' && details.icon) {
                 // Add if not already in iconsToShow and not already in allOtherTech (based on icon URL)
                 if (!iconsToShow.some(tech => tech.icon === details.icon) && !allOtherTech.some(tech => tech.icon === details.icon)) {
                    allOtherTech.push({ name, icon: details.icon });
                 }
               }
             });
           }
         });
         // Add remaining unique icons until max is reached
         iconsToShow.push(...allOtherTech.slice(0, MAX_ICONS - iconsToShow.length));
    }

    console.log("Icons selected for card:", iconsToShow); // Add logging
    return iconsToShow; 
  };

  return (
    <Section className="overflow-hidden">
      <style>{themeAwareSwiperNavStyles}</style> {/* Inject styles */} 
      <div className="container">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >  
          <h1 className={`h1 mb-4 ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>
            {pageTitle}
          </h1>
          <p className={`body-1 ${isDarkMode ? 'text-n-3' : 'text-n-5'} md:max-w-md lg:max-w-2xl mx-auto`}>
            {pageDescription}
          </p>
        </motion.div>

        {/* Solutions Swiper - RENDERED IN BOTH CASES */}
        <div className="relative">
          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={30}
            slidesPerView={1} // Start with 1 on mobile
            navigation
            pagination={{ clickable: true }}
            breakpoints={{
              640: { slidesPerView: 1, spaceBetween: 20 },
              768: { slidesPerView: 2, spaceBetween: 30 },
              1024: { slidesPerView: 3, spaceBetween: 30 },
            }}
            className="homepage-solutions-swiper !pb-10 md:!pb-12"
          >
            {solutionsToDisplay.map((solution, index) => (
              <SwiperSlide key={solution.slug} className="h-auto flex pb-2">
                <motion.div
                  className="hover:-translate-y-1 transition-transform duration-300 group w-full"
                >
                  <Link
                    to={`/solutions/${solution.slug}`}
                    className={`block h-full flex flex-col ${isDarkMode ? 'bg-n-7' : 'bg-white'} rounded-2xl p-6 
                        border ${isDarkMode ? 'border-n-6 hover:border-primary-1/50' : 'border-n-3 hover:border-primary-1/50'} 
                        transition-colors`}
                  >
                    {/* Solution Header */}
                    <div className="flex items-center gap-4 mb-6">
                      <div className={`w-12 h-12 ${isDarkMode ? 'bg-n-6 group-hover:bg-n-5' : 'bg-n-2 group-hover:bg-n-3'} rounded-xl flex items-center justify-center transition-colors`}>
                        <Icon name={solution.icon} className="w-6 h-6 text-primary-1" />
                      </div>
                      <div>
                        <h3 className={`h4 mb-1 ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>{solution.title}</h3>
                        <p className={`text-sm ${isDarkMode ? 'text-n-3' : 'text-n-5'}`}>
                          {solution.categories.join(' • ')}
                        </p>
                      </div>
                    </div>
                    {/* Description */}
                    <p className={`${isDarkMode ? 'text-n-3' : 'text-n-5'} mb-6 flex-grow`}>
                      {solution.description}
                    </p>
                    {/* Conditional Key Metrics (Only shown on standalone page) */}
                    {!isHomepage && solution.businessValue?.metrics && (
                      <div className="space-y-3 mb-6">
                        <h4 className={`text-sm font-medium ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>Key Benefits</h4>
                        <ul className="space-y-2">
                          {solution.businessValue.metrics.slice(0, 3).map((metric, i) => (
                            <li key={i} className={`flex items-center gap-2 text-sm ${isDarkMode ? 'text-n-3' : 'text-n-5'}`}>
                              <Icon name="check" className="w-4 h-4 text-primary-1" />
                              <span>{metric}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {/* Footer with Tech Icons */}
                    <div className={`mt-auto pt-6 border-t ${isDarkMode ? 'border-n-6' : 'border-n-3'} flex justify-between items-center`}>
                      <div className="flex gap-3">
                        {getTechIcons(solution.techStack).map((tech) => (
                          <img key={tech.name} src={tech.icon} alt={tech.name} title={tech.name} className="w-6 h-6 object-contain" />
                        ))}
                      </div>
                      <Icon name="arrow-right" className={`w-5 h-5 ${isDarkMode ? 'text-n-3' : 'text-n-5'} group-hover:text-primary-1 transition-colors`} />
                    </div>
                  </Link>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Conditional "Learn More" Button (Only shows on Homepage) */}
        {isHomepage && (
          <div className="mt-12 text-center">
            <Button href="/solutions" white={!isDarkMode} >
              Explore All Solutions
            </Button>
          </div>
        )}

        {/* Conditional CTA Section (Only shows on Standalone page) */}
        {!isHomepage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-20"
          >
            <CallToAction />
          </motion.div>
        )}
      </div>
    </Section>
  );
};

export default SolutionsPage;
