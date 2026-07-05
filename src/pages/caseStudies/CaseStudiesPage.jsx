import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { hygraphClient } from '@/lib/hygraph';
import { GET_CASE_STUDIES } from '@/graphql/queries/caseStudies';
import Section from '@/components/Section';
import SEO from '@/components/SEO';
import { useTheme } from '@/context/ThemeContext';
import { fadeIn } from '@/utils/motion';
import { FiArrowRight } from 'react-icons/fi';

const CaseStudiesPage = () => {
  const [caseStudies, setCaseStudies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isDarkMode } = useTheme();

  useEffect(() => {
    const fetchCaseStudies = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await hygraphClient.request(GET_CASE_STUDIES, { stage: 'PUBLISHED' });
        setCaseStudies(data?.caseStudies || data?.caseStudyS || []);
      } catch (err) {
        console.error('Error fetching case studies:', err);
        setError('Failed to load case studies.');
        setCaseStudies([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCaseStudies();
  }, []);

  return (
    <>
      <SEO
        title="Case Studies | JEDI Labs — Production AI Results"
        description="Real client results. Go Answer voice agents, AISO search optimization, CrisPRO oncology co-pilot. Deployed for production, not pilots."
        path="/case-studies"
      />
      <Section className="pt-[8rem] -mt-[5.25rem]" crosses>
        <div className="container relative">
          <motion.div
            variants={fadeIn('up')}
            initial="hidden"
            animate="show"
            className="text-center mb-12 md:mb-16"
          >
            <h1 className={`h1 mb-4 ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>Case Studies</h1>
            <p className={`body-1 max-w-2xl mx-auto ${isDarkMode ? 'text-n-4' : 'text-n-5'}`}>
              Client success stories and measurable outcomes from JEDI Labs implementations.
            </p>
          </motion.div>

          {loading && (
            <div className={`text-center py-16 ${isDarkMode ? 'text-n-4' : 'text-n-5'}`}>
              Loading case studies...
            </div>
          )}

          {error && (
            <div className={`text-center py-16 rounded-lg ${isDarkMode ? 'bg-n-7 border border-n-6 text-n-3' : 'bg-red-50 border border-red-200 text-red-700'}`}>
              {error}
            </div>
          )}

          {!loading && !error && caseStudies.length === 0 && (
            <p className={`text-center py-16 ${isDarkMode ? 'text-n-4' : 'text-n-5'}`}>
              No case studies published yet. Check back soon.
            </p>
          )}

          {!loading && !error && caseStudies.length > 0 && (
            <motion.div
              variants={fadeIn('up')}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {caseStudies.map((study, index) => (
                <Link
                  key={study.id}
                  to={`/case-studies/${study.slug}`}
                  className="block h-full group"
                  aria-label={`Read case study: ${study.title}`}
                >
                  <motion.article
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.08 }}
                    className={`h-full rounded-2xl overflow-hidden border transition-all duration-300 flex flex-col
                      ${isDarkMode ? 'bg-n-7 border-n-6 hover:border-primary-1/50' : 'bg-white border-n-3 hover:border-primary-1/50 shadow-sm hover:shadow-lg'}`}
                  >
                    {study.coverImageUrl ? (
                      <div className="aspect-video overflow-hidden bg-n-6">
                        <img
                          src={study.coverImageUrl}
                          alt=""
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ) : (
                      <div className={`aspect-video flex items-center justify-center ${isDarkMode ? 'bg-n-6' : 'bg-n-2'}`}>
                        <span className={`text-4xl font-mono ${isDarkMode ? 'text-n-5' : 'text-n-4'}`}>JEDI</span>
                      </div>
                    )}
                    <div className="p-6 flex flex-col flex-1">
                      {study.clientName && (
                        <span className={`text-xs font-mono uppercase tracking-wider mb-2 ${isDarkMode ? 'text-n-4' : 'text-n-5'}`}>
                          {study.clientName}
                        </span>
                      )}
                      <h2 className={`h4 mb-2 group-hover:text-primary-1 transition-colors ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>
                        {study.title}
                      </h2>
                      {study.excerpt && (
                        <p className={`body-2 line-clamp-3 flex-1 ${isDarkMode ? 'text-n-3' : 'text-n-5'}`}>
                          {study.excerpt}
                        </p>
                      )}
                      {/* Technologies */}
                      {study.technologies?.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-4">
                          {study.technologies.slice(0, 4).map((tech) => (
                            <span
                              key={tech.id}
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${isDarkMode ? 'bg-n-6 text-n-4' : 'bg-n-2 text-n-6'}`}
                            >
                              {tech.icon && <img src={tech.icon} alt="" className="w-3 h-3 object-contain" />}
                              {tech.name}
                            </span>
                          ))}
                          {study.technologies.length > 4 && (
                            <span className={`px-2 py-0.5 rounded-full text-xs ${isDarkMode ? 'bg-n-6 text-n-4' : 'bg-n-2 text-n-6'}`}>
                              +{study.technologies.length - 4}
                            </span>
                          )}
                        </div>
                      )}
                      <span className="inline-flex items-center gap-2 mt-4 text-primary-1 font-mono text-sm group-hover:gap-3 transition-all">
                        Read the full case study <FiArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </motion.article>
                </Link>
              ))}
            </motion.div>
          )}
        </div>
      </Section>
    </>
  );
};

export default CaseStudiesPage;
