import React, { useState, useEffect } from 'react';
import { gql } from 'graphql-request';
import { hygraphClient } from '@/lib/hygraph';
import Section from '@/components/Section';
import { Link } from 'react-router-dom';
import { Icon } from '@/components/Icon';
import { useTheme } from '@/context/ThemeContext';

// Query using the new 'relatedUseCases' relation field
const GetAllIndustries = gql`
  query GetAllIndustries {
    industries(stage: PUBLISHED, orderBy: name_ASC) {
      id
      slug
      name
      # Fetch slug along with id and title for linking
      relatedUseCases(first: 3) {
        id
        title
        slug # <-- Add slug here
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
      console.log("[IndustriesOverview] Fetching all industries with related use cases...");
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
    <Section className="pt-[12rem] -mt-[5.25rem]" crosses crossesOffset="lg:translate-y-[5.25rem]" customPaddings id="industries">
      <div className="container relative">
        <div className="relative z-1 max-w-[62rem] mx-auto text-center mb-[3.875rem] md:mb-20 lg:mb-[6.25rem]">
          <h1 className="h1 mb-6">
            Industries Overview
          </h1>
          {/* Update introductory text */}
          <p className="body-1 max-w-3xl mx-auto mb-6 text-n-2 lg:mb-8">
            Jedi Labs drives breakthrough innovation across diverse sectors. Explore our tailored AI solutions impacting key industries:
          </p>
        </div>

        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          {industries.map((industry) => (
            <div
              key={industry.id}
              className={`block relative p-0.5 rounded-2xl transition-colors duration-300 ${
                isDarkMode ? 'bg-gradient-to-r from-color-7 to-color-8 hover:bg-gradient-to-r hover:from-color-8 hover:to-color-7' : 'bg-gradient-to-r from-color-1/70 to-color-3/70 hover:from-color-3/70 hover:to-color-1/70'
              }`}
            >
              <div className={`relative z-2 flex flex-col min-h-[22rem] p-[2.4rem] pointer-events-none rounded-2xl ${isDarkMode ? 'bg-n-7' : 'bg-n-1'}`}>
                <h5 className={`h5 mb-5 ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>{industry.name}</h5>
                {/* Check if relatedUseCases exist and have items */}
                {industry.relatedUseCases && industry.relatedUseCases.length > 0 && (
                  <div className="mt-auto">
                    <p className={`body-2 mb-3 ${isDarkMode ? 'text-n-4' : 'text-n-5'}`}>Example Use Cases:</p>
                    <ul className="list-disc list-inside space-y-1">
                      {industry.relatedUseCases.map((useCase) => (
                        <li key={useCase.id} className={`body-2 ${isDarkMode ? 'text-n-3' : 'text-n-6'}`}>
                          {/* Make the use case title a link */}
                          <Link
                            to={`/industries/${industry.slug}/${useCase.slug}`}
                            className={`pointer-events-auto hover:text-color-1 transition-colors ${isDarkMode ? 'text-n-3 hover:text-color-4' : 'text-n-6 hover:text-color-1'}`}
                          >
                            {useCase.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {/* Fallback if no use cases */}
                {(!industry.relatedUseCases || industry.relatedUseCases.length === 0) && (
                   <p className={`body-2 mt-auto ${isDarkMode ? 'text-n-4' : 'text-n-5'}`}>
                     More use cases coming soon.
                   </p>
                )}
              </div>
              {/* Keep the "Learn More" link pointing to the industry detail page */}
              <Link
                to={`/industries/${industry.slug}`}
                className="absolute inset-0 z-10 rounded-2xl" // Clickable overlay link
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