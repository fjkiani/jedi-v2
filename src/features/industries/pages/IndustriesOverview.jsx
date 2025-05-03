import React, { useState, useEffect } from 'react';
import { gql } from 'graphql-request';
import { hygraphClient } from '@/lib/hygraph';
import Section from '@/components/Section';
import { Link } from 'react-router-dom';
import { Icon } from '@/components/Icon';
import { useTheme } from '@/context/ThemeContext';

// Query to fetch industries, descriptions, and related IndustryApplications
const GetAllIndustries = gql`
  query GetAllIndustries {
    industries(stage: PUBLISHED, orderBy: name_ASC) {
      id
      slug
      name
      description
      # Fetch related IndustryApplications instead of UseCases
      industryApplication(first: 3, orderBy: applicationTitle_ASC) { # Use correct API ID
        id
        applicationTitle # Fetch the title to display
        # tagline # Optionally fetch tagline if needed for display
      }
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
      console.log("[IndustriesOverview] Fetching all industries with descriptions and related IndustryApplications..."); // Updated log
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
  }, []);

  if (loading) {
    return (
      <Section className="flex justify-center items-center min-h-[300px]">
        <p className={`${isDarkMode ? 'text-n-4' : 'text-n-5'}`}>Loading industries...</p>
      </Section>
    );
  }

  if (error) {
    return (
      <Section className="flex justify-center items-center min-h-[300px]">
        <div className={`border rounded-lg p-4 ${isDarkMode ? 'bg-red-900/20 border-red-500/30' : 'bg-red-50 border-red-200'}`}>
          <p className="text-red-500">{error}</p>
        </div>
      </Section>
    );
  }

  return (
    <Section className="pt-[12rem] -mt-[5.25rem]" crosses crossesOffset="lg:translate-y-[5.25rem]" customPaddings id="industries">
      <div className="container relative">
        <div className="relative z-1 max-w-[62rem] mx-auto text-center mb-[3.875rem] md:mb-20 lg:mb-[6.25rem]">
          <h1 className={`h1 mb-6 ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>
            Industries Overview
          </h1>
          <p className={`body-1 max-w-3xl mx-auto mb-6 ${isDarkMode ? 'text-n-3' : 'text-n-5'} lg:mb-8`}>
            Jedi Labs drives breakthrough innovation across diverse sectors. Explore our tailored AI solutions impacting key industries:
          </p>
        </div>

        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          {industries.map((industry) => (
            <div
              key={industry.id}
              className={`block relative p-0.5 rounded-2xl transition-colors duration-300 group ${
                isDarkMode 
                  ? 'bg-gradient-to-b from-n-6 to-n-7 hover:from-n-5 hover:to-n-6' 
                  : 'bg-n-2 hover:bg-n-3'
              }`}
            >
              <div className={`relative z-2 flex flex-col h-full p-[1.8rem] rounded-[0.9rem] ${isDarkMode ? 'bg-n-8' : 'bg-n-1'}`}>
                <h5 className={`h5 mb-3 ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>{industry.name}</h5>
                <p className={`body-2 mb-6 flex-grow ${isDarkMode ? 'text-n-4' : 'text-n-5'} line-clamp-4`}>
                  {industry.description || 'Tailored solutions driving innovation in this sector.'}
                </p>
                {industry.industryApplication && industry.industryApplication.length > 0 && (
                  <div className="mt-4 border-t pt-4 ${isDarkMode ? 'border-n-6' : 'border-n-3'}">
                    <p className={`body-2 mb-3 ${isDarkMode ? 'text-n-4' : 'text-n-5'} font-semibold`}>Example Applications:</p>
                    <ul className="space-y-1">
                      {industry.industryApplication.map((app) => (
                        <li key={app.id} className={`body-2 text-sm ${isDarkMode ? 'text-n-3' : 'text-n-6'}`}>
                          <Link
                            to={`/industries/${industry.slug}#application-${app.id}`}
                            className={`inline-block pointer-events-auto hover:text-primary-1 transition-colors ${isDarkMode ? 'text-n-3 hover:text-primary-2' : 'text-n-6 hover:text-primary-1'}`}
                          >
                            {app.applicationTitle}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              <Link
                to={`/industries/${industry.slug}`}
                className="absolute inset-0 z-10 rounded-2xl"
                aria-label={`Learn more about ${industry.name}`}
              />
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
};

export default IndustriesOverview;