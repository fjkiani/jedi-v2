import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { gql } from 'graphql-request';
import { hygraphClient } from '@/lib/hygraph';
import Section from './Section';
import { fadeIn } from '@/utils/motion';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiCpu } from 'react-icons/fi';
import { useTheme } from '@/context/ThemeContext';

// Import Swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// Add custom styles for Swiper navigation/pagination
const swiperNavStyles = `
  .case-studies-swiper .swiper-button-prev,
  .case-studies-swiper .swiper-button-next {
    color: var(--swiper-navigation-color, inherit);
    width: 28px; height: 28px;
    background-color: rgba(0, 0, 0, 0.3);
    border-radius: 50%;
    padding: 4px;
    transition: background-color 0.2s;
  }
  .case-studies-swiper .swiper-button-prev:hover,
  .case-studies-swiper .swiper-button-next:hover {
    background-color: rgba(0, 0, 0, 0.5);
  }
  .case-studies-swiper .swiper-button-prev::after,
  .case-studies-swiper .swiper-button-next::after {
    font-size: 12px; font-weight: bold;
  }
  .case-studies-swiper .swiper-button-prev { left: 8px; top: calc(50% - 14px); }
  .case-studies-swiper .swiper-button-next { right: 8px; top: calc(50% - 14px); }
  .case-studies-swiper .swiper-pagination-bullet {
    background-color: var(--swiper-pagination-bullet-inactive-color, #ccc);
    opacity: 0.7;
  }
  .case-studies-swiper .swiper-pagination-bullet-active {
    background-color: var(--swiper-pagination-color, #007aff);
    opacity: 1;
  }
`;

const GetAllUseCases = gql`
  query GetAllUseCases {
    useCaseS(stage: PUBLISHED, orderBy: publishedAt_DESC) {
      id
      title
      slug
      description
      industry {
        name
        slug
      }
      technologies(first: 6) {
        id
        name
        icon
        slug
      }
    }
  }
`;

const CaseStudies = () => {
  const [useCasesData, setUseCasesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isDarkMode } = useTheme();

  // Add theme-aware colors to styles (reuse logic)
  const themeAwareSwiperNavStyles = swiperNavStyles.replace(
    'var(--swiper-navigation-color, inherit)',
    isDarkMode ? '#FFFFFF' : '#000000'
  ).replace(
    'var(--swiper-pagination-color, #007aff)',
    isDarkMode ? '#8E55EA' : '#6C2BD9' // Example primary colors
  ).replace(
    'var(--swiper-pagination-bullet-inactive-color, #ccc)',
    isDarkMode ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.3)'
  );

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log("Fetching use cases with corrected query...");
        const data = await hygraphClient.request(GetAllUseCases);
        console.log("Raw use case data fetched:", data);
        const cases = data.useCases || data.useCaseS || [];
        setUseCasesData(cases);
        console.log("Set useCasesData:", cases);
      } catch (err) {
        console.error("Error fetching use cases:", err);
        setError("Failed to load success stories. Please try again later.");
        setUseCasesData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <Section className="overflow-hidden">
      <style>{themeAwareSwiperNavStyles}</style> {/* Inject styles */}
      <div className="container">
        <motion.div
          variants={fadeIn('up')}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-20"
        >
          <h2 className={`h2 mb-4 ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>Use Cases</h2>
          <p className={`body-1 ${isDarkMode ? 'text-n-4' : 'text-n-5'} md:max-w-3xl mx-auto`}>
            Explore how our AI solutions address specific industry challenges and deliver tangible results.
          </p>
        </motion.div>

        {loading && (
          <div className={`text-center py-10 ${isDarkMode ? 'text-n-4' : 'text-n-5'}`}>Loading Success Stories...</div>
        )}

        {error && (
          <div className={`text-center py-10 text-red-500 ${isDarkMode ? 'bg-n-8' : 'bg-red-50'} border ${isDarkMode ? 'border-red-500/30' : 'border-red-300'} rounded-lg p-4`}>
            Error: {error}
          </div>
        )}

        {/* Swiper Container */}
        {!loading && !error && (
          <motion.div 
            key="swiper-container" // Use a distinct key
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="relative" // Needed for absolute positioning of nav buttons
          >
            {useCasesData.length === 0 ? (
              <p className={`text-center ${isDarkMode ? 'text-n-4' : 'text-n-5'} py-10`}>No use cases available at the moment.</p>
            ) : (
              <Swiper
                modules={[Navigation, Pagination]}
                spaceBetween={30}
                slidesPerView={1} // Start with 1 slide on mobile
                navigation // Enable navigation arrows
                pagination={{ clickable: true }} // Enable pagination dots
                breakpoints={{
                  // 768px (md) and up: show 2 slides
                  768: {
                    slidesPerView: 2,
                    spaceBetween: 40,
                  },
                   // 1024px (lg) and up: potentially show 3 if design allows
                   // 1024: {
                   //   slidesPerView: 3,
                   //   spaceBetween: 40,
                   // },
                }}
                className="case-studies-swiper !pb-10 md:!pb-12" // Add padding bottom for pagination
              >
                {useCasesData.map((useCase) => (
                  <SwiperSlide key={useCase.id} className="h-auto flex pb-2"> {/* Add flex and slight padding bottom */}
                    {/* Use Case Card Content (extracted from the original Link) */}
                     <Link 
                        to={useCase.industry?.slug && useCase.slug ? `/industries/${useCase.industry.slug}/${useCase.slug}` : '#'}
                        className="block h-full group w-full" // Ensure link takes full slide width/height
                        aria-label={`Learn more about ${useCase.title}`}
                      >
                       <motion.div
                          // Optional: keep variants if needed per slide
                          // variants={fadeIn('up')} 
                          // initial="hidden"
                          // whileInView="show"
                          // viewport={{ once: true }}
                          className="flex h-full hover:-translate-y-1 transition-transform duration-300"
                        >
                            <div className={`rounded-2xl overflow-hidden h-full w-full p-6 lg:p-8 flex flex-col transition-all 
                            ${isDarkMode ? 'bg-n-7 border border-n-6 group-hover:border-primary-1/50' : 'bg-white border border-n-3 group-hover:border-primary-1/50'}
                            `}>
                                <div className="mb-4">
                                    <span className={`text-xs uppercase tracking-wider ${isDarkMode ? 'text-n-3' : 'text-n-5'} mb-1 block`}>
                                        {useCase.industry?.name || 'Industry'}
                                    </span>
                                    <h3 className={`h4 mb-2 ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>{useCase.title}</h3>
                                </div>
                                
                                {useCase.description && (
                                <div className="mb-6">
                                    <h4 className={`text-base font-semibold ${isDarkMode ? 'text-color-1' : 'text-primary-1'} mb-1`}>Overview</h4>
                                    <p className={`body-2 ${isDarkMode ? 'text-n-3' : 'text-n-5'} line-clamp-3`}>{useCase.description}</p>
                                </div>
                                )}

                                {useCase.technologies && useCase.technologies.length > 0 && (
                                <div className="mt-auto pt-4"> {/* Pushes tech to bottom */}
                                    <h4 className={`text-base font-semibold ${isDarkMode ? 'text-color-1' : 'text-primary-1'} mb-2 flex items-center`}>
                                    <FiCpu className={`mr-1.5 ${isDarkMode ? 'opacity-80' : 'opacity-100'}`} size={16}/> Technologies
                                    </h4>
                                    <div className="flex flex-wrap gap-1.5">
                                    {useCase.technologies.map((tech) => (
                                        <span
                                        key={tech.id}
                                        className={`flex items-center px-2.5 py-0.5 rounded-full text-xxs 
                                            ${isDarkMode ? 'bg-n-6 text-n-3' : 'bg-n-2 text-n-6'}
                                        `}
                                        title={tech.name}
                                        >
                                        {tech.icon && (
                                            <img src={tech.icon} alt={tech.name} className="w-3 h-3 mr-1 object-contain" />
                                        )}
                                        <span className="truncate">{tech.name}</span>
                                        </span>
                                    ))}
                                    </div>
                                </div>
                                )}
                            </div>
                        </motion.div>
                    </Link>
                  </SwiperSlide>
                ))}
              </Swiper>
            )}
          </motion.div>
        )}
        
        {!loading && (
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
              Become Our Next Success Story
            </a>
          </motion.div>
        )}
      </div>
    </Section>
  );
};

export default CaseStudies; 