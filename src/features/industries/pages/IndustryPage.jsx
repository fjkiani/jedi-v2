import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Section from '@/components/Section';
import { Icon } from '@/components/Icon';
import IndustrySolutions from '../components/IndustrySolutions';
import IndustryHero from '../components/IndustryHero';
import { industriesList } from '@/constants/industry';
import { getSectionsForIndustry } from '@/constants/registry/industrySectionsRegistry';
import { getIndustryDiagram } from '@/constants/registry/industryDiagramsRegistry';
import { getSolutionConfig } from '@/constants/registry/solutionRegistry';
import { getUseCaseImplementation } from '@/constants/registry/useCaseRegistry';

const IndustryPage = () => {
  const { industryId } = useParams();
  
  // Get industry data and related configurations
  const industryData = useMemo(() => {
    const industry = industriesList.find(ind => ind.id === industryId);
    if (!industry) return null;

    // Get industry-specific sections
    const sections = getSectionsForIndustry(industryId);
    
    // Get diagrams for each section
    const diagrams = sections.reduce((acc, section) => {
      acc[section.id] = getIndustryDiagram(industryId, section.id);
      return acc;
    }, {});

    // Get solution configurations
    const solutions = industry.solutions.map(solution => {
      const config = getSolutionConfig(industryId, solution.id);
      const useCases = solution.techStack?.primary?.id 
        ? getUseCaseImplementation(solution.title, solution.techStack.primary.id)
        : null;

      return {
        ...solution,
        config,
        useCases,
        diagrams: diagrams[solution.id]
      };
    });

    return {
      ...industry,
      sections,
      diagrams,
      solutions
    };
  }, [industryId]);

  if (!industryData) {
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

  const defaultSolution = industryData.solutions[0];
  const defaultSection = industryData.sections[0];

  return (
    <>
      {/* Hero Section with Industry Hero Component */}
      <IndustryHero 
        industry={industryData}
        solution={defaultSolution}
        sections={industryData.sections}
        diagram={industryData.diagrams[defaultSection.id]}
      />

      {/* Solutions Section */}
      <Section>
        <div className="container">
          <IndustrySolutions 
            industry={industryData}
            sections={industryData.sections}
            diagrams={industryData.diagrams}
          />
        </div>
      </Section>

      {/* Background Gradient */}
      <div 
        className={`fixed inset-0 bg-gradient-to-b ${industryData.color} 
          opacity-10 pointer-events-none z-0`}
      />
    </>
  );
};

export default IndustryPage;