import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import Section from '@/components/Section';
import IndustrySolutionCard from './IndustrySolutionCard';
import { getTechConfig } from '@/constants/registry/techConfigFactory';
import { 
  TECH_IDS, 
  TECH_CATEGORY_MAPPING,
  USE_CASE_REQUIREMENTS 
} from '@/constants/registry/techRegistry';
import { 
  USE_CASE_TECH_MAPPING,
  getUseCaseImplementation 
} from '@/constants/registry/useCaseRegistry';

const IndustrySolutions = ({ industry }) => {
  // Enhanced solution relationships with registry integration
  const solutionRelationships = useMemo(() => {
    if (!industry?.solutions) return [];

    return industry.solutions.map(solution => {
      // Get all technologies for this solution
      const techStack = {
        primary: [],
        supporting: [],
        implementations: []
      };

      // Map solution technologies to registry tech configurations
      solution.techStack?.primary && techStack.primary.push({
        config: getTechConfig(solution.techStack.primary.id),
        usage: solution.techStack.primary.usage
      });

      solution.techStack?.supporting?.forEach(tech => {
        techStack.supporting.push({
          config: getTechConfig(tech.id),
          usage: tech.usage,
          features: tech.features
        });
      });

      // Get use case implementations
      solution.benefits?.forEach(benefit => {
        benefit.enabledBy?.forEach(techId => {
          const useCases = Object.entries(USE_CASE_TECH_MAPPING)
            .filter(([_, mapping]) => 
              mapping.primaryTech === techId || 
              mapping.relatedTech.includes(techId)
            )
            .map(([useCase]) => ({
              title: useCase,
              implementation: getUseCaseImplementation(useCase, techId)
            }))
            .filter(uc => uc.implementation);

          techStack.implementations.push(...useCases);
        });
      });

      // Validate tech stack against use case requirements
      const validations = solution.useCases?.map(useCase => {
        const requirements = USE_CASE_REQUIREMENTS[useCase.type];
        const allTechIds = [
          solution.techStack?.primary?.id,
          ...(solution.techStack?.supporting?.map(tech => tech.id) || [])
        ];

        return {
          useCase: useCase.type,
          isValid: requirements?.requiredCategories.every(category =>
            allTechIds.some(techId => 
              TECH_CATEGORY_MAPPING[techId] === category
            )
          ),
          missingCategories: requirements?.requiredCategories.filter(category =>
            !allTechIds.some(techId => 
              TECH_CATEGORY_MAPPING[techId] === category
            )
          )
        };
      });

      // Add technical implementation details
      const technicalDetails = solution.techStack?.primary && {
        architecture: {
          components: solution.architecture?.components?.map(comp => ({
            ...comp,
            technologies: comp.technologies?.map(techId => ({
              id: techId,
              config: getTechConfig(techId),
              implementation: getUseCaseImplementation(solution.id, techId)
            }))
          })),
          dataFlow: solution.architecture?.dataFlow?.map(flow => ({
            ...flow,
            technologies: flow.technologies?.map(techId => ({
              id: techId,
              config: getTechConfig(techId),
              implementation: getUseCaseImplementation(solution.id, techId)
            }))
          }))
        },
        performance: solution.metrics?.map(metric => ({
          ...metric,
          technicalDetails: getTechConfig(solution.techStack.primary.id)
            ?.performance?.[metric.type]
        }))
      };

      return {
        techStack,
        validations,
        implementations: techStack.implementations,
        technicalDetails
      };
    });
  }, [industry]);

  if (!industry || !industry.solutions) return null;

  return (
    <div className="container relative">
      <div className="grid md:grid-cols-2 gap-6">
        {industry.solutions.map((solution, index) => (
          <IndustrySolutionCard
            key={solution.id}
            solution={solution}
            industry={industry}
            relationships={solutionRelationships[index]}
            index={index}
          />
        ))}
      </div>

      <div className="absolute top-0 right-0 w-[70%] h-[70%] 
        bg-radial-gradient from-primary-1/30 to-transparent blur-xl pointer-events-none" />
    </div>
  );
};

export default IndustrySolutions;