import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Section from '@/components/Section';
import { Icon } from '@/components/Icon';
import { gql } from 'graphql-request';
import { hygraphClient } from '@/lib/hygraph';

// Define GraphQL Query
const GetIndustriesOverview = gql`
  query GetIndustriesOverview {
    industries(stage: PUBLISHED, orderBy: name_ASC) {
      id
      name
      slug
    }
  }
`;

// Simple mapping for icons based on slug (adjust keys/values as needed)
const iconMap = {
  'healthcare': 'heart',
  'financial-services': 'dollar-sign',
  'default': 'grid'
};

// Simple mapping for colors based on slug (adjust keys/values as needed)
const colorMap = {
  'healthcare': 'from-blue-500 to-blue-700',
  'financial-services': 'from-green-500 to-green-700',
  'default': 'from-n-5 to-n-7'
};

const IndustryOverview = () => {
  const [industriesData, setIndustriesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchIndustries = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await hygraphClient.request(GetIndustriesOverview);
        setIndustriesData(data.industries || []);
      } catch (err) {
        console.error("Error fetching industries:", err);
        setError("Failed to load industries. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchIndustries();
  }, []);

  return (
    <Section className="relative overflow-hidden bg-n-8/90 backdrop-blur-sm">
      <div className="container relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="h2 mb-4">Industries We Transform</h2>
          <p className="body-1 text-n-3 md:max-w-[571px] mx-auto">
            Discover how our AI solutions revolutionize different industries
          </p>
        </motion.div>

        {/* Loading State */}
        {loading && <div className="text-center text-n-4 p-8">Loading industries...</div>}

        {/* Error State */}
        {error && <div className="text-center text-red-500 p-8">Error: {error}</div>}

        {/* Industries Grid */}
        {!loading && !error && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-2">
            {industriesData.map((industry, index) => {
              // Determine icon and color using mappings and slug
              const iconName = iconMap[industry.slug] || iconMap['default'];
              const colorClass = colorMap[industry.slug] || colorMap['default'];

              return (
                <motion.div
                  key={industry.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    to={`/industries/${industry.slug}`}
                    className="group block p-6 rounded-2xl bg-n-7 border border-n-6
                      hover:border-primary-1 transition-colors duration-300 h-full flex flex-col"
                  >
                    {/* Icon */}
                    <div className={`w-12 h-12 mb-4 rounded-xl bg-gradient-to-br ${colorClass}
                      flex items-center justify-center transform group-hover:scale-110 transition-transform flex-shrink-0`}>
                      <Icon name={iconName} className="w-6 h-6 text-n-1" />
                    </div>

                    <div className="flex-grow">
                      {/* Title */}
                      <h4 className="h4 mb-2">{industry.name}</h4>

                      {/* Description removed as it's not fetched */}

                    </div>

                    {/* Learn More */}
                    <div className="mt-4 flex items-center gap-2 text-primary-1">
                      <span className="text-sm font-medium">Learn More</span>
                      <Icon name="arrow-right" className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* View All Link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-8 relative z-2"
        >
          <Link 
            to="/industries"
            className="button button-primary"
          >
            View All Industries
          </Link>
        </motion.div>

        {/* Background Elements */}
        <div className="absolute top-0 left-[40%] w-[70%] h-[70%] 
          bg-radial-gradient from-primary-1/20 to-transparent blur-lg pointer-events-none" />
      </div>
    </Section>
  );
};

export default IndustryOverview; 