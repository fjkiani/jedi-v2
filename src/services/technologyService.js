import { hygraphClient } from '@/lib/hygraph';
import { GET_USE_CASES_BY_TECHNOLOGY } from '@/graphql/queries/technologies';

class TechnologyService {
  async getTechnologyBySlug(slug) {
    try {
      const { useCaseS } = await hygraphClient.request(GET_USE_CASES_BY_TECHNOLOGY, { slug });
      
      // Transform the data to match the expected format
      if (useCaseS && useCaseS.length > 0) {
        const firstUseCase = useCaseS[0]; // Use the first use case for the main technology info
        return {
          id: firstUseCase.id,
          name: firstUseCase.title,
          description: firstUseCase.description,
          relatedUseCases: useCaseS.map(useCase => ({
            title: useCase.title,
            implementation: {
              overview: useCase.description,
              architecture: {
                components: useCase.architecture?.components?.map(component => ({
                  name: component.name,
                  description: component.description,
                  role: component.explanation,
                  details: component.details
                })) || [],
                flow: useCase.architecture?.flow?.map(step => ({
                  description: step.description,
                  details: step.details,
                  step: step.step
                })) || []
              },
              queries: useCase.queries || [],
              capabilities: useCase.capabilities || [],
              metrics: useCase.metrics || [],
              benefits: useCase.benefits || [],
              requirements: useCase.requirements || []
            }
          })),
          technologies: firstUseCase.technologies || []
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching technology:', error);
      throw error;
    }
  }
}

export const technologyService = new TechnologyService(); 