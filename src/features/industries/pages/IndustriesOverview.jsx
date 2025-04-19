import React, { useState, useEffect } from 'react';
import { gql } from 'graphql-request';
import { hygraphClient } from '@/lib/hygraph';
import Section from '@/components/Section';
import { Link } from 'react-router-dom';
import { Icon } from '@/components/Icon';
import { useTheme } from '@/context/ThemeContext';

// Simplified query with only fields we know work
const GetAllIndustries = gql`
  query GetAllIndustries {
    industries {
      id
      slug
      name
      sections
    }
  }
`;

const IndustriesOverview = () => {
  const { isDarkMode } = useTheme();
  const [industries, setIndustries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchIndustries = async () => {
      setLoading(true);
      setError(null);
      console.log("[IndustriesOverview] Fetching all industries...");
      try {
        const data = await hygraphClient.request(GetAllIndustries);
        console.log("[IndustriesOverview] Raw data received:", data);
        if (!data || !data.industries) {
          console.warn("[IndustriesOverview] No industries found or data format incorrect.");
          setIndustries([]);
        } else {
          setIndustries(data.industries);
        }
      } catch (err) {
        console.error("[IndustriesOverview] Error fetching industries:", err);
        setError("Failed to load industries.");
      } finally {
        setLoading(false);
        console.log("[IndustriesOverview] Fetch attempt finished.");
      }
    };

    fetchIndustries();
  }, []); // Empty dependency array means fetch once on mount

  if (loading) {
    return (
      <Section className="flex justify-center items-center min-h-[300px]">
        <p className="text-n-3">Loading industries...</p>
        {/* Optional: Add a spinner */}
      </Section>
    );
  }

  if (error) {
    return (
      <Section className="flex justify-center items-center min-h-[300px]">
        <p className="text-red-500">{error}</p>
      </Section>
    );
  }

  return (
    <Section className="overflow-hidden pt-12 pb-12">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className={`h1 mb-4 ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>Industries Overview</h1>
          <p className="body-1 text-n-3 md:max-w-[571px] mx-auto">
            Explore how our AI solutions transform different industries
          </p>
        </div>

        {/* Industries List - Map over fetched data */}
        <div className="grid gap-8">
          {industries.map((industry) => (
            <div
              key={industry.id}
              className={`p-8 rounded-2xl ${isDarkMode ? 'bg-n-7' : 'bg-white'}
                border ${isDarkMode ? 'border-n-6' : 'border-n-3'}
                transition-colors duration-200`}
            >
              <div className="flex flex-col sm:flex-row items-start gap-6">
                {/* Icon - Use a default icon since we don't have icon field */}
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br from-primary-1 to-primary-2
                  flex items-center justify-center flex-shrink-0
                  transform hover:scale-105 transition-transform duration-200`}>
                  {/* Use a default icon based on industry name or slug */}
                  <Icon 
                    name={
                      industry.slug === 'healthcare' ? 'heart' :
                      industry.slug === 'financial' || industry.slug === 'financial-services' ? 'chart-bar' :
                      industry.slug === 'technology' ? 'chip' : 'tag'
                    } 
                    className="w-8 h-8 text-n-1" 
                  />
                </div>

                <div className="flex-grow">
                  {/* Title */}
                  <h3 className={`h3 mb-4 ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>
                    {industry.name}
                  </h3>

                  {/* Description */}
                  <p className="body-2 text-n-3 mb-6">
                    {industry.description || "No description available."}
                  </p>

                  {/* Display sections if available */}
                  {industry.sections && industry.sections.length > 0 && (
                    <div className="mb-6">
                      <h4 className={`text-sm font-semibold mb-3 ${isDarkMode ? 'text-n-2' : 'text-n-5'}`}>
                        Key Focus Areas:
                      </h4>
                      <div className="grid sm:grid-cols-2 gap-x-4 gap-y-2">
                        {industry.sections.map((section, idx) => (
                          <div key={idx} className="flex items-center gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary-1 flex-shrink-0" />
                            <span className={`text-sm ${isDarkMode ? 'text-n-2' : 'text-n-7'}`}>
                              {/* Format section name for display */}
                              {section
                                .split('-')
                                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                                .join(' ')}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Learn More */}
                  <Link
                    to={`/industries/${industry.slug}`}
                    className="button button-primary mt-4 inline-flex"
                  >
                    Learn More
                    <Icon name="arrow-right" className="w-4 h-4 ml-2" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
};

export default IndustriesOverview;