import { getIndustryResponse } from './templates/industryResponseTemplate';
import { useCaseService } from './useCaseService';

export const industryService = {
  async generateResponse(industry, section, query) {
    try {
      console.log('Generating response for:', { industry, section, query });

      // Get implementation from the use case service
      const implementation = await useCaseService.getImplementation(industry, section, query);
      
      if (!implementation) {
        throw new Error('No implementation found');
      }

      // Create the base response template
      const baseResponse = getIndustryResponse(industry, implementation);
      
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