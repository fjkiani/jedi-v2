import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Icon } from '@/components/Icon';
import Section from '@/components/Section';
import { hygraphClient } from '@/lib/hygraph';

const GET_ALL_TECHNOLOGIES = `
  query GetAllTechnologies {
    technologyS {
      id
      name
      slug
      description
      icon
      category {
        id
        name
      }
    }
  }
`;

const TechnologiesPage = () => {
  const [technologies, setTechnologies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTechnologies = async () => {
      try {
        setLoading(true);
        const { technologyS } = await hygraphClient.request(GET_ALL_TECHNOLOGIES);
        console.log('All technologies:', technologyS);
        
        const grouped = technologyS.reduce((acc, tech) => {
          const categoryName = tech.category?.[0]?.name || 'Other';
          if (!acc[categoryName]) acc[categoryName] = [];
          acc[categoryName].push(tech);
          return acc;
        }, {});
        
        setTechnologies(grouped);
      } catch (err) {
        console.error('Error fetching technologies:', err);
        setError('Error loading technologies');
      } finally {
        setLoading(false);
      }
    };

    fetchTechnologies();
  }, []);

  if (loading) {
    return (
      <Section className="text-center">
        <div className="animate-pulse text-n-6 dark:text-n-3">Loading technologies...</div>
      </Section>
    );
  }

  if (error) {
    return (
      <Section className="text-center">
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
          <p className="text-red-500">{error}</p>
        </div>
      </Section>
    );
  }

  return (
    <Section className="overflow-hidden">
      <div className="container">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-n-6 dark:text-n-3 mb-4"
        >
          <Link to="/" className="hover:text-color-1">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-n-1 dark:text-n-1">Technologies</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="h1 text-n-1 dark:text-n-1 mb-6">Technology Stack</h1>
          <p className="body-1 text-n-6 dark:text-n-3 md:max-w-md lg:max-w-2xl">
            Explore our comprehensive technology stack, featuring cutting-edge tools and frameworks that power our solutions.
          </p>
        </motion.div>

        <div className="space-y-16">
          {Object.entries(technologies).map(([category, techs]) => (
            <div key={category}>
              <h2 className="h3 text-n-1 dark:text-n-1 mb-8 capitalize">
                {category.replace(/([A-Z])/g, ' $1').trim()}
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {techs.map((tech) => (
                  <Link
                    key={tech.id}
                    to={`/technology/${tech.slug}`}
                    className="bg-white dark:bg-n-7 rounded-xl p-6 border border-n-6 
                             transition-all duration-300 hover:border-primary-1 hover:shadow-lg"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      {tech.icon && (
                        <img 
                          src={tech.icon} 
                          alt={tech.name}
                          className="w-8 h-8 object-contain"
                        />
                      )}
                      <h3 className="font-semibold text-n-1 dark:text-n-1">{tech.name}</h3>
                    </div>
                    
                    <p className="text-n-6 dark:text-n-3 mb-4 line-clamp-2">{tech.description}</p>
                    
                    {tech.category && tech.category.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {tech.category.map((cat) => (
                          <span 
                            key={cat.id}
                            className="px-3 py-1 bg-n-7/50 dark:bg-n-6 rounded-full text-sm text-n-1 dark:text-n-1"
                          >
                            {cat.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
};

export default TechnologiesPage;