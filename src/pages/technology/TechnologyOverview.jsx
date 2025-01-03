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
    const fetchTechnology = async () => {
      try {
        setLoading(true);
        const data = await technologyService.getTechnologyBySlug(slug);
        if (data) {
          setTechnology(data);
        } else {
          setError('Technology not found');
        }
      } catch (error) {
        console.error('Error fetching technology:', error);
        setError('Error loading technology details');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchTechnology();
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
          {/* Technology Overview */}
          <div className="flex items-start gap-6">
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
              {technology.category && technology.category.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-8">
                  {technology.category.map((cat) => (
                    <span 
                      key={cat.id}
                      className="px-3 py-1 bg-n-6 rounded-full text-sm text-n-1"
                    >
                      {cat.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Use Cases List */}
          {technology.relatedUseCases && technology.relatedUseCases.length > 0 && (
            <div>
              <h2 className="h3 mb-6">Use Cases</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {technology.relatedUseCases.map((useCase) => (
                  <Link
                    key={useCase.id}
                    to={`/technology/${slug}/use-case/${useCase.id}`}
                    className="bg-n-7 rounded-xl p-6 border border-n-6 
                             transition-all duration-300 hover:border-primary-1 hover:shadow-lg"
                  >
                    <h3 className="h4 mb-4">{useCase.title}</h3>
                    <p className="text-n-3 line-clamp-3">{useCase.implementation.overview}</p>
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