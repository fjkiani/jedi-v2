import { getTechConfig } from '@/constants/registry/techConfigFactory';
import { TECH_IDS } from '@/constants/registry/techRegistry';
import { financial } from '@/constants/industry/financial';

export const analyzeIndustryTechRelationships = (industrySolution, techConfigs) => {
  // Helper function to safely check string matches
  const hasMatch = (capability, value) => {
    if (typeof capability !== 'string' || typeof value !== 'string') return false;
    return capability.toLowerCase().includes(value.toLowerCase().split(' ')[0]);
  };

  // Helper function to extract searchable values
  const getSearchableValue = (value) => {
    if (typeof value === 'string') return value;
    if (typeof value === 'object' && value !== null) {
      if (value.label) return value.label;
      if (value.title) return value.title;
      if (value.value) return value.value;
    }
    return null;
  };

  // Get all relationships dynamically
  const relationships = {
    // Get arrays from industry solution
    required: Object.entries(industrySolution).reduce((acc, [key, value]) => {
      if (Array.isArray(value)) {
        acc[key] = value;
      }
      return acc;
    }, {}),
    
    // Get tech capabilities
    available: techConfigs.useCases.map(useCase => ({
      type: useCase.type,
      title: useCase.title,
      capabilities: Object.entries(useCase.implementation?.techStack || {})
        .flatMap(([tech, details]) => details.features || []),
      industryApplication: useCase.implementation?.industryApplications?.[industrySolution.industry]
    }))
  };

  console.log('Found relationships:', relationships);

  // Find connections for each requirement type
  const connections = Object.entries(relationships.required).reduce((acc, [requirement, values]) => {
    acc[requirement] = values.map(value => {
      const searchableValue = getSearchableValue(value);
      
      if (!searchableValue) {
        console.log(`Skipping non-searchable value:`, value);
        return null;
      }

      return {
        value: searchableValue,
        original: value,
        matchingUseCases: relationships.available
          .filter(useCase => 
            useCase.capabilities.some(cap => hasMatch(cap, searchableValue))
          )
          .map(useCase => ({
            type: useCase.type,
            title: useCase.title,
            hasIndustrySpecific: !!useCase.industryApplication
          }))
      };
    }).filter(Boolean);
    
    return acc;
  }, {});

  return {
    relationships,
    connections
  };
};

// Test
export const testIndustryTechMapping = () => {
  const fraudDetection = financial.solutions.find(s => s.id === 'fraud-detection');
  const openAIConfig = getTechConfig(TECH_IDS.OPENAI);

  console.log('\n=== Dynamic Analysis ===');
  const analysis = analyzeIndustryTechRelationships(fraudDetection, openAIConfig);
  console.log('Analysis Results:', analysis);
};

// Call it to see results
testIndustryTechMapping(); 

export const buildTechRelationships = (industrySolution, techConfigs) => {
  // Get all tech capabilities in a flat structure
  const techCapabilities = techConfigs.useCases.map(useCase => ({
    type: useCase.type,
    title: useCase.title,
    capabilities: Object.entries(useCase.implementation?.techStack || {}).map(([tech, details]) => ({
      tech,
      features: details.features || []
    })),
    industryApplication: useCase.implementation?.industryApplications?.financial
  }));

  // Build relationships
  const relationships = {
    // Map technologies to tech capabilities
    technologies: industrySolution.technologies.map(tech => {
      const matchingUseCases = techCapabilities.filter(useCase =>
        useCase.capabilities.some(cap =>
          cap.features.some(feature =>
            feature.toLowerCase().includes(tech.toLowerCase().split(' ')[0])
          )
        )
      );

      return {
        technology: tech,
        matchingUseCases: matchingUseCases.map(uc => ({
          type: uc.type,
          title: uc.title,
          relevantCapabilities: uc.capabilities
            .filter(cap =>
              cap.features.some(feature =>
                feature.toLowerCase().includes(tech.toLowerCase().split(' ')[0])
              )
            )
            .map(cap => ({
              tech: cap.tech,
              features: cap.features.filter(feature =>
                feature.toLowerCase().includes(tech.toLowerCase().split(' ')[0])
              )
            }))
        }))
      };
    }),

    // Map benefits to tech capabilities
    benefits: industrySolution.benefits.map(benefit => {
      const words = benefit.toLowerCase().split(' ')
        .filter(word => word.length > 3); // Skip small words

      const matchingUseCases = techCapabilities.filter(useCase =>
        useCase.capabilities.some(cap =>
          cap.features.some(feature =>
            words.some(word => feature.toLowerCase().includes(word))
          )
        )
      );

      return {
        benefit,
        matchingUseCases: matchingUseCases.map(uc => ({
          type: uc.type,
          title: uc.title,
          relevantCapabilities: uc.capabilities
            .filter(cap =>
              cap.features.some(feature =>
                words.some(word => feature.toLowerCase().includes(word))
              )
            )
            .map(cap => ({
              tech: cap.tech,
              features: cap.features.filter(feature =>
                words.some(word => feature.toLowerCase().includes(word))
              )
            }))
        }))
      };
    })
  };

  console.log('\n=== Technology Relationships ===', relationships);
  return relationships;
}; 