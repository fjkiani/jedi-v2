import React, { useMemo, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { industriesList } from '@/constants/industry';
import { getTechConfig } from '@/constants/registry/techConfigFactory';
import { TECH_IDS, TECH_CATEGORIES } from '@/constants/registry/techRegistry';
import IndustryHero from '../components/IndustryHero';
import IndustrySolutions from '../components/IndustrySolutions';

const IndustryPage = () => {
  const { industryId } = useParams();
  const industry = industriesList.find(ind => ind.id === industryId);

  // Get all relevant tech configurations for this industry
  const techConfigs = useMemo(() => {
    if (!industry?.solutions) return null;

    console.log('Industry:', industry);
    
    // Safely get all unique technologies used in this industry
    const usedTechnologies = industry.solutions
      .flatMap(solution => solution.technologies || [])
      .filter(Boolean) // Remove any null/undefined values
      .filter((tech, index, self) => self.indexOf(tech) === index);

    console.log('Used Technologies:', usedTechnologies);

    // Get relevant tech configurations
    const configs = Object.entries(TECH_IDS)
      .filter(([_, id]) => {
        // Only process if we have both valid id and matching technology
        if (!id) return false;
        return usedTechnologies.some(tech => {
          if (!tech) return false;
          return tech.toLowerCase().includes(id.toLowerCase());
        });
      })
      .reduce((acc, [key, id]) => {
        try {
          const config = getTechConfig(id);
          if (config) {
            // Find category safely
            const categoryEntry = Object.entries(TECH_CATEGORIES)
              .find(([_, cats]) => Array.isArray(cats) ? cats.includes(id) : false);
            
            acc[key] = {
              ...config,
              category: categoryEntry?.[0] || 'uncategorized'
            };
          }
        } catch (error) {
          console.error(`Error processing tech config for ${id}:`, error);
        }
        return acc;
      }, {});

    console.log('Final Tech Configs:', configs);

    return {
      configs,
      categories: TECH_CATEGORIES,
      usedTechnologies
    };
  }, [industry]);

  // Debug log with safe access
  useEffect(() => {
    console.log('Industry Data:', industry);
    console.log('Tech Configs:', techConfigs);
  }, [industry, techConfigs]);

  if (!industry) {
    return (
      <div className="container pt-[8rem]">
        <h1 className="h1 text-center mb-6">Industry Not Found</h1>
        <div className="text-center">
          <Link to="/industries" className="button button-primary">
            Back to Industries
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <IndustryHero 
        industry={industry} 
        techConfigs={techConfigs}
      />
      <IndustrySolutions 
        industry={industry}
        techConfigs={techConfigs}
      />
    </div>
  );
};

export default IndustryPage;