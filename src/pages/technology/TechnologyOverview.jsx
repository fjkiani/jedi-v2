import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Section from '@/components/Section';
import { technologyService } from '@/services/technologyService';

const TechnologyOverview = () => {
  const { slug } = useParams();
  const [loading, setLoading] = useState(true);
  const [technology, setTechnology] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const techData = await technologyService.getTechnologyBySlug(slug);

        if (techData) {
          setTechnology(techData);
        } else {
          setError('Technology not found');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Error loading details');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchData();
    }
  }, [slug]);

  if (loading) {
    return (
      <Section className="text-center">
        <div className="animate-pulse">Loading technology details...</div>
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

  if (!technology) {
    return (
      <Section className="text-center">
        <div className="bg-n-6 rounded-lg p-4">
          <p className="text-n-3">Technology not found</p>
        </div>
      </Section>
    );
  }

  return (
    <Section className="overflow-hidden">
      <div className="container">
        {/* Breadcrumb Navigation */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-n-3 mb-4"
        >
          <Link to="/technology" className="hover:text-color-1">Technologies</Link>
          <span className="mx-2">/</span>
          <span className="text-n-1">{technology.name}</span>
        </motion.div>

        <div className="space-y-12">
          {/* Technology Header */}
          <div>
            <div className="flex items-center gap-4 mb-4">
              {technology.icon && (
                <img 
                  src={technology.icon}
                  alt={technology.name}
                  className="w-12 h-12 object-contain"
                />
              )}
              <h1 className="h1">{technology.name}</h1>
            </div>
            <p className="text-n-3 text-lg mb-6">{technology.description}</p>
            
            {/* Categories */}
            {technology.categories && technology.categories.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {technology.categories.map((category) => (
                  <Link 
                    key={category.slug}
                    to={`/category/${category.slug}`}
                    className="px-4 py-1 bg-n-6 rounded-full text-n-1 hover:bg-n-5"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Use Cases */}
          {technology.useCases && technology.useCases.length > 0 && (
            <div>
              <h2 className="text-4xl font-bold mb-8">Use Cases</h2>
              <div className="space-y-6">
                {technology.useCases.map((useCase) => (
                  <Link
                    key={useCase.title}
                    to={`/technology/${slug}/use-case/${useCase.slug || useCase.title.toLowerCase().replace(/\s+/g, '-')}`}
                    className="block"
                  >
                    <div className="bg-n-7 rounded-[20px] p-8 hover:bg-n-6 transition-colors">
                      <h3 className="text-2xl font-bold mb-6">{useCase.title}</h3>
                      {useCase.industry && (
                        <div className="mb-6">
                          <p className="text-n-3 mb-2">Industry:</p>
                          <p className="text-n-1">{useCase.industry.name}</p>
                        </div>
                      )}
                      {useCase.capabilities && useCase.capabilities.length > 0 && (
                        <div>
                          <p className="text-n-3 mb-3">Capabilities:</p>
                          <ul className="space-y-3">
                            {useCase.capabilities.map((capability, index) => (
                              <li 
                                key={index}
                                className="text-n-1"
                              >
                                {capability}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Section>
  );
};

export default TechnologyOverview;