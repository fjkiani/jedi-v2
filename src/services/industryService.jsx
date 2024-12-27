import { USE_CASE_REGISTRY } from '@/constants/registry/useCaseRegistry';
import { getIndustryResponse } from './templates/industryResponseTemplate';
import { fraudDetectionImplementation as fraudDetectionBase } from '@/constants/implementations/industries/financial/fraudDetection';
import { fraudDetectionImplementation as fraudDetectionArch } from '@/constants/implementations/industries/financial/implementation';
import { diagnosticAIImplementation } from '@/constants/implementations/industries/healthcare/diagnosticAI';

// Merge both implementation files
const fraudDetectionMerged = {
  ...fraudDetectionBase,
  architecture: fraudDetectionArch.architecture,
  examples: fraudDetectionArch.examples
};

// Map of implementations by use case
export const IMPLEMENTATION_MAP = {
  'fraud-detection': fraudDetectionMerged,
  'diagnostic-ai': diagnosticAIImplementation
};

export const industryService = {
  async generateResponse(industry, section, query) {
    try {
      console.log('Generating response for:', { industry, section, query });

      // Get use cases from the registry
      const useCases = USE_CASE_REGISTRY[industry]?.[section]?.useCases;
      
      if (!useCases) {
        console.error('No use cases found for:', { industry, section });
        throw new Error(`No use cases found for section: ${section}`);
      }

      // Find the use case that matches the query
      const useCase = Object.entries(useCases).find(([_, uc]) => 
        uc.queries.includes(query)
      );

      if (!useCase) {
        console.error('No matching use case found for query:', query);
        throw new Error('No matching use case found');
      }

      const [useCaseId, useCaseData] = useCase;
      const implementation = {
        ...IMPLEMENTATION_MAP[useCaseId],
        ...useCaseData.implementation
      };

      // Create the base response template
      const baseResponse = getIndustryResponse(industry, useCaseId, query);
      
      if (!baseResponse) {
        throw new Error('Failed to generate response');
      }

      return baseResponse;
    } catch (error) {
      console.error('Error generating response:', error);
      throw error;
    }
  }
};