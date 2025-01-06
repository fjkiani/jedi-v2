import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Section from '@/components/Section';
import { Icon } from '@/components/Icon';
import { technologyService } from '@/services/technologyService';
import logo from '@/assets/logo/logo.png';

const LocalTechnologyOverview = () => {
  const { slug } = useParams();
  const [activeTab, setActiveTab] = useState('overview');
  const technology = technologyService.getLocalTechnologyBySlug(slug);

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
          <div className="bg-n-8 rounded-xl p-8 border border-n-6">
            <div className="flex items-center gap-6 mb-6">
              <div className="flex items-center gap-4">
                {technology.icon && (
                  <div className="w-20 h-20 rounded-2xl bg-n-7 flex items-center justify-center p-4">
                    <img 
                      src={technology.icon}
                      alt={technology.name}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        e.target.src = 'https://cdn.simpleicons.org/dotenv';
                      }}
                    />
                  </div>
                )}
                <div className="w-px h-12 bg-n-6"></div>
                <div className="w-20 h-20 rounded-2xl bg-n-7 flex items-center justify-center p-4">
                  <img 
                    src={logo}
                    alt="JediLabs"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="h1">{technology.name}</h1>
                  <span className="text-n-3">at</span>
                  <span className="text-primary-1 font-bold">JediLabs</span>
                </div>
                <p className="text-n-3 text-lg">{technology.description}</p>
              </div>
            </div>
          </div>

          {/* Tabs Navigation */}
          <div className="flex space-x-4 border-b border-n-6">
            {['overview', 'features', 'use-cases'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
                  activeTab === tab
                    ? 'text-primary-1 border-primary-1'
                    : 'text-n-3 border-transparent hover:text-n-1'
                }`}
              >
                {tab.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="space-y-8">
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Description */}
                <div className="bg-n-7 rounded-xl p-8 border border-n-6">
                  <h2 className="text-2xl font-bold mb-6">Overview</h2>
                  <p className="text-n-3">{technology.description}</p>
                </div>

                {/* Category */}
                <div className="bg-n-7 rounded-xl p-8 border border-n-6">
                  <h2 className="text-2xl font-bold mb-6">Category</h2>
                  <div className="flex items-center gap-2 px-4 py-2 bg-n-8 rounded-lg w-fit">
                    <span className="text-n-1">{technology.category}</span>
                  </div>
                </div>

                {/* Priority */}
                {technology.priority && (
                  <div className="bg-n-7 rounded-xl p-8 border border-n-6">
                    <h2 className="text-2xl font-bold mb-6">Priority Level</h2>
                    <div className="flex items-center gap-2">
                      <div className="px-3 py-1 bg-primary-1 text-white rounded-full">
                        Priority {technology.priority}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'features' && (
              <div className="bg-n-7 rounded-xl p-8 border border-n-6">
                <h2 className="text-2xl font-bold mb-6">Features</h2>
                {technology.features ? (
                  <div className="grid gap-6">
                    <p className="text-n-3">{technology.features}</p>
                  </div>
                ) : (
                  <p className="text-n-3">No features available.</p>
                )}
              </div>
            )}

            {activeTab === 'use-cases' && (
              <div className="bg-n-7 rounded-xl p-8 border border-n-6">
                <h2 className="text-2xl font-bold mb-6">Use Cases</h2>
                {technology.useCases ? (
                  <div className="grid gap-6">
                    {technology.useCases.map((useCase, index) => (
                      <div key={index} className="bg-n-8 rounded-lg p-6">
                        <h3 className="text-xl font-semibold mb-4">{useCase}</h3>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-n-3">No use cases available.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Section>
  );
};

export default LocalTechnologyOverview;