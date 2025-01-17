import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { getAllSolutions } from '@/constants/solutions/index';
import { Icon } from '@/components/Icon';
import Section from '@/components/Section';
import { useTheme } from '@/context/ThemeContext';

const SolutionsPage = () => {
  const { isDarkMode } = useTheme();
  const solutions = getAllSolutions();

  return (
    <Section className="overflow-hidden">
      <div className="container">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >  
          <h1 className={`h1 mb-4 ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>
            Enterprise Solutions
          </h1>
          <p className={`body-1 ${isDarkMode ? 'text-n-3' : 'text-n-5'} md:max-w-md lg:max-w-2xl mx-auto`}>
            Explore our comprehensive suite of enterprise-grade solutions powered by cutting-edge AI technologies.
          </p>
        </motion.div>

        {/* Solutions Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {solutions.map((solution, index) => (
            <motion.div
              key={solution.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link 
                to={`/solutions/${solution.slug}`}
                className={`block ${isDarkMode ? 'bg-n-7' : 'bg-white'} rounded-2xl p-6 
                  border ${isDarkMode ? 'border-n-6 hover:border-n-5' : 'border-n-3 hover:border-n-4'} 
                  transition-colors group`}
              >
                {/* Solution Header */}
                <div className="flex items-center gap-4 mb-6">
                  <div className={`w-12 h-12 ${isDarkMode ? 'bg-n-6 group-hover:bg-n-5' : 'bg-n-2 group-hover:bg-n-3'} 
                    rounded-xl flex items-center justify-center transition-colors`}>
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
                <p className={`${isDarkMode ? 'text-n-3' : 'text-n-5'} mb-6`}>
                  {solution.description}
                </p>

                {/* Key Metrics */}
                <div className="space-y-3">
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

                {/* Footer with Tech Icons */}
                <div className={`mt-6 pt-6 border-t ${isDarkMode ? 'border-n-6' : 'border-n-3'} 
                  flex justify-between items-center`}>
                  <div className="flex gap-3">
                    {Object.values(solution.techStack)[0] && 
                      Object.values(Object.values(solution.techStack)[0])
                        .slice(0, 3)
                        .map((tech, i) => (
                          <img
                            key={i}
                            src={tech.icon}
                            alt=""
                            className="w-6 h-6"
                          />
                        ))}
                  </div>
                  <Icon 
                    name="arrow-right" 
                    className={`w-5 h-5 ${isDarkMode ? 'text-n-3' : 'text-n-5'} 
                      group-hover:text-primary-1 transition-colors`} 
                  />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-20 text-center"
        >
          <div className={`${isDarkMode ? 'bg-n-7' : 'bg-white'} rounded-2xl p-8 
            border ${isDarkMode ? 'border-n-6' : 'border-n-3'} max-w-3xl mx-auto`}>
            <h2 className={`h3 mb-4 ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>Need a Custom Solution?</h2>
            <p className={`${isDarkMode ? 'text-n-3' : 'text-n-5'} mb-6`}>
              Our team can help you build a tailored solution that meets your specific needs.
            </p>
            <Link 
              to="/contact" 
              className="button button-gradient"
            >
              Contact Us
            </Link>
          </div>
        </motion.div>
      </div>
    </Section>
  );
};

export default SolutionsPage;
