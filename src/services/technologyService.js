import { hygraphClient } from '@/lib/hygraph';

const GET_TECHNOLOGY_BY_SLUG = `
  query GetTechnologyBySlug($slug: String!) {
    technologyS(where: { slug: $slug }) {
      id
      name
      slug
      description
      icon
      category {
        id
        name
      }
    }
  }
`;

const GET_USE_CASES_BY_TECH = `
  query GetUseCasesByTech($slug: String!) {
    useCaseS(where: { technologies_some: { slug: $slug } }) {
      id
      title
      slug
      description
      queries
      capabilities
      architecture {
        description
        components {
          name
          description
          details
          explanation
        }
        flow {
          step
          description
          details
        }
      }
    }
  }
`;

const GET_USE_CASE_BY_SLUG = `
  query GetUseCaseBySlug($slug: String!) {
    useCaseS(where: { slug: $slug }) {
      id
      title
      slug
      description
      queries
      capabilities
      architecture {
        description
        components {
          name
          description
          details
          explanation
        }
        flow {
          step
          description
          details
        }
      }
      technologies {
        id
        name
        slug
        icon
      }
    }
  }
`;

class TechnologyService {
  async getTechnologyBySlug(slug) {
    try {
      // Get technology details
      const { technologyS } = await hygraphClient.request(GET_TECHNOLOGY_BY_SLUG, { slug });
      const technology = technologyS?.[0];
      
      if (!technology) {
        return null;
      }

      // Get related use cases
      const { useCaseS } = await hygraphClient.request(GET_USE_CASES_BY_TECH, { slug });
      console.log('Use cases data:', useCaseS); // Debug log
      
      return {
        ...technology,
        relatedUseCases: useCaseS.map(useCase => {
          console.log('Mapping use case:', useCase); // Debug log for each use case
          return {
            id: useCase.id,
            title: useCase.title,
            slug: useCase.slug,
            implementation: {
              overview: useCase.description,
              architecture: useCase.architecture,
              queries: useCase.queries,
              capabilities: useCase.capabilities
            }
          };
        })
      };
    } catch (error) {
      console.error('Error fetching technology:', error);
      throw error;
    }
  }

  async getUseCaseBySlug(slug) {
    try {
      const { useCaseS } = await hygraphClient.request(GET_USE_CASE_BY_SLUG, { slug });
      console.log('Fetched use case by slug:', useCaseS); // Debug log
      
      if (!useCaseS || useCaseS.length === 0) {
        return null;
      }

      const useCase = useCaseS[0];
      return {
        id: useCase.id,
        title: useCase.title,
        slug: useCase.slug,
        implementation: {
          overview: useCase.description,
          architecture: useCase.architecture,
          queries: useCase.queries,
          capabilities: useCase.capabilities
        },
        technologies: useCase.technologies
      };
    } catch (error) {
      console.error('Error fetching use case:', error);
      throw error;
    }
  }
}

export const technologyService = new TechnologyService(); 