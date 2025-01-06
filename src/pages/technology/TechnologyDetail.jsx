import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Section from '@/components/Section';
import { Icon } from '@/components/Icon';
import { technologyService } from '@/services/technologyService';

const TechnologyDetail = () => {
  const { slug } = useParams();
  const [technology, setTechnology] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchTechnology = async () => {
      try {
        setLoading(true);
        const tech = await technologyService.getLocalTechnologyBySlug(slug);
        console.log('Fetched technology:', tech);
        setTechnology(tech);
      } catch (err) {
        console.error('Error fetching technology:', err);
        setError('Error loading technology details');
      } finally {
        setLoading(false);
      }
    };

    fetchTechnology();
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
        <h2 className="h2">Technology not found</h2>
        <p className="text-n-3 mt-4">The technology "{slug}" could not be found.</p>
        <Link to="/solutions" className="button button-gradient mt-4">
          Back to Solutions
        </Link>
      </Section>
    );
  }

  const tabs = [
    {
      id: 'overview',
      label: 'Overview',
      icon: 'layout',
      content: (
        <div className="space-y-8">
          {/* Technology Description */}
          <div className="bg-n-7 rounded-xl p-6 border border-n-6">
            <h3 className="h4 mb-4">About {technology.name}</h3>
            <p className="text-n-3">{technology.description}</p>
          </div>

          {/* Features */}
          {technology.features && (
            <div className="bg-n-7 rounded-xl p-6 border border-n-6">
              <h3 className="h4 mb-4">Key Features</h3>
              <div className="grid gap-4">
                {typeof technology.features === 'string' ? (
                  <p className="text-n-3">{technology.features}</p>
                ) : (
                  technology.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <Icon name="check" className="w-6 h-6 text-primary-1 mt-1" />
                      <span className="text-n-3">{feature}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Use Cases */}
          {technology.useCases && technology.useCases.length > 0 && (
            <div className="bg-n-7 rounded-xl p-6 border border-n-6">
              <h3 className="h4 mb-4">Common Use Cases</h3>
              <div className="grid gap-4">
                {technology.useCases.map((useCase, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <Icon name="check" className="w-6 h-6 text-primary-1 mt-1" />
                    <span className="text-n-3">{useCase}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )
    },
    {
      id: 'implementation',
      label: 'Implementation',
      icon: 'code',
      content: (
        <div className="space-y-8">
          {/* Implementation Details */}
          <div className="bg-n-7 rounded-xl p-6 border border-n-6">
            <h3 className="h4 mb-4">Implementation Details</h3>
            <p className="text-n-3 mb-6">{technology.description}</p>
            
            {technology.implementation && (
              <div className="grid gap-4">
                {Object.entries(technology.implementation).map(([key, value]) => (
                  <div key={key} className="bg-n-8 rounded-lg p-4">
                    <h4 className="font-medium mb-2 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</h4>
                    <p className="text-n-3">{value}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )
    }
  ];

  return (
    <Section className="overflow-hidden">
      <div className="container">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-n-3 mb-4"
        >
          <Link to="/" className="hover:text-color-1">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/solutions" className="hover:text-color-1">Solutions</Link>
          <span className="mx-2">/</span>
          <span className="text-n-1">{technology.name}</span>
        </motion.div>

        {/* Technology Header */}
        <div className="flex items-center gap-6 mb-8">
          {technology.icon && (
            <div className="w-16 h-16 flex-shrink-0">
              <img
                src={typeof technology.icon === 'string' ? technology.icon : technology.icon.url}
                alt={`${technology.name} icon`}
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.target.src = 'https://cdn.simpleicons.org/dotenv';
                }}
              />
            </div>
          )}
          <div>
            <h1 className="h2 mb-2">{technology.name}</h1>
            {technology.category && (
              <div className="flex items-center gap-2">
                <span className="text-n-3">Category:</span>
                <span className="px-3 py-1 bg-n-6 rounded-full text-sm">
                  {technology.category}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 border-b border-n-6 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
                activeTab === tab.id
                  ? 'text-primary-1 border-primary-1'
                  : 'text-n-3 border-transparent hover:text-n-1'
              }`}
            >
              <span className="flex items-center gap-2">
                <Icon name={tab.icon} className="w-4 h-4" />
                {tab.label}
              </span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {tabs.find(tab => tab.id === activeTab)?.content}
        </motion.div>
      </div>
    </Section>
  );
};

export default TechnologyDetail;
