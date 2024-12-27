import { createResponseTemplate, sectionTemplates } from './templates/responseTemplate';
import { USE_CASE_REGISTRY } from '@/constants/registry/useCaseRegistry';

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
      const useCase = Object.values(useCases).find(uc => 
        uc.queries.includes(query)
      );

      if (!useCase) {
        console.error('No matching use case found for query:', query);
        throw new Error('No matching use case found');
      }

      // Get implementation details
      const implementation = useCase.implementation || {};

      const response = createResponseTemplate({
        icon: "🔒",
        title: useCase.title,
        query,
        modelName: "Industry AI",
        modelVersion: "2024",
        capabilities: useCase.capabilities,
        sections: [
          sectionTemplates.processingSection({
            mainPoint: implementation.mainPoint || "Processing transaction patterns",
            steps: implementation.processingSteps || [
              "Data ingestion and enrichment",
              "Pattern matching against known signatures",
              "Risk scoring and decision making"
            ]
          }),
          sectionTemplates.discoverySection([
            {
              title: "Pattern Analysis",
              steps: implementation.exampleQueries?.samples || [],
              highlight: "✨ Analysis Complete",
              points: [
                "Real-time processing enabled",
                "Pattern matching optimized",
                "Risk assessment completed"
              ]
            }
          ])
        ]
      });

      return response;
    } catch (error) {
      console.error("Industry Service Error:", error);
      throw error;
    }
  }
};