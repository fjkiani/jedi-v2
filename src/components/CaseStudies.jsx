import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gql } from 'graphql-request';
import { hygraphClient } from '@/lib/hygraph';
import Section from './Section';
import { fadeIn } from '@/utils/motion';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiCpu, FiX } from 'react-icons/fi';
import UseCaseDetailView from './UseCaseDetailView';

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
  const [selectedUseCase, setSelectedUseCase] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await hygraphClient.request(GetAllUseCases);
        setUseCasesData(data.useCaseS || []);
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

  const handleCloseDetail = () => {
    setSelectedUseCase(null);
  };

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
          <h2 className="h2 mb-4">Use Cases</h2>
          <p className="body-1 text-n-4 md:max-w-3xl mx-auto">
            Explore how our AI solutions address specific industry challenges and deliver tangible results.
          </p>
        </motion.div>

        {loading && (
          <div className="text-center py-10 text-n-4">Loading Success Stories...</div>
        )}

        {error && (
          <div className="text-center py-10 text-red-500 bg-n-8 border border-red-500/30 rounded-lg p-4">
            Error: {error}
          </div>
        )}

        {!loading && !error && (
          <AnimatePresence mode="wait">
            {selectedUseCase ? (
              <motion.div
                key="detail"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              >
                <UseCaseDetailView 
                  useCase={selectedUseCase} 
                  onClose={handleCloseDetail} 
                />
              </motion.div>
            ) : (
              <motion.div 
                key="grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-12">
                  {useCasesData.length === 0 ? (
                    <p className="md:col-span-2 text-center text-n-4 py-10">No use cases available at the moment.</p>
                  ) : (
                    useCasesData.map((useCase) => (
                      <motion.div
                        key={useCase.id}
                        variants={fadeIn('up')}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true }}
                        className="flex"
                      >
                        <div className="bg-n-7 rounded-2xl overflow-hidden h-full w-full p-8 lg:p-10 flex flex-col">
                          <div className="mb-6">
                            <span className="text-xs uppercase tracking-wider text-n-3 mb-2 block">
                              {useCase.industry?.name || 'Industry'}
                            </span>
                            <h3 className="h3 mb-2">{useCase.title}</h3>
                          </div>
                          
                          {useCase.description && (
                            <div className="mb-8">
                              <h4 className="text-lg font-semibold text-color-1 mb-2">Overview</h4>
                              <p className="body-2 text-n-3 whitespace-pre-wrap">{useCase.description}</p>
                            </div>
                          )}

                          {useCase.technologies && useCase.technologies.length > 0 && (
                            <div className="mb-8 flex-grow">
                              <h4 className="text-lg font-semibold text-color-1 mb-2 flex items-center">
                                <FiCpu className="mr-2 opacity-80" size={18}/> Technologies Used
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {useCase.technologies.map((tech) => (
                                  <Link
                                    key={tech.id}
                                    to={`/technology/${tech.slug}`}
                                    className="flex items-center bg-n-6 px-3 py-1 rounded-full text-xs text-n-3 hover:text-primary-1 hover:bg-n-5 transition-colors"
                                    title={tech.name}
                                  >
                                    {tech.icon && (
                                      <img src={tech.icon} alt="" className="w-4 h-4 mr-1.5 object-contain" />
                                    )}
                                    <span className="truncate">{tech.name}</span>
                                  </Link>
                                ))}
                              </div>
                            </div>
                          )}

                          {useCase.slug && (
                            <div className="mt-auto pt-6 border-t border-n-6/50">
                              <button
                                onClick={() => {
                                  console.warn("Detailed data not fetched yet, cannot show full details.");
                                }}
                                className="inline-flex items-center text-sm font-bold text-primary-1 hover:text-primary-2 transition-colors group disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={true}
                              >
                                View Details (WIP)
                                <FiArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                              </button>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
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