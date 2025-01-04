import { hygraphClient } from '@/lib/hygraph';

const GET_ALL_CATEGORIES = `
  query GetAllCategories {
    categories {
      id
      name
      slug
      description
      technologies {
        id
        name
        slug
        icon
        description
      }
      technologySubcategory {
        id
        name
        slug
        technology {
          id
          name
          slug
          icon
          description
        }
      }
    }
  }
`;

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

const GET_USE_CASE_BY_ID = `
  query GetUseCaseById($id: ID!) {
    useCase(where: { id: $id }) {
      id
      title
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
  async getAllCategories() {
    try {
      console.log('Sending query:', GET_ALL_CATEGORIES);
      const response = await hygraphClient.request(GET_ALL_CATEGORIES);
      console.log('Raw response:', response);
      
      if (!response || !response.categories) {
        console.warn('No categories found in response:', response);
        return [];
      }
      
      return response.categories;
    } catch (error) {
      console.error('Error details:', {
        message: error.message,
        response: error.response,
        request: error.request
      });
      throw error;
    }
  }

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
      
      return {
        ...technology,
        relatedUseCases: useCaseS.map(useCase => ({
          id: useCase.id,
          title: useCase.title,
          implementation: {
            overview: useCase.description,
            architecture: useCase.architecture,
            queries: useCase.queries,
            capabilities: useCase.capabilities
          }
        }))
      };
    } catch (error) {
      console.error('Error fetching technology:', error);
      throw error;
    }
  }

  async getUseCaseById(id) {
    try {
      const { useCase } = await hygraphClient.request(GET_USE_CASE_BY_ID, { id });
      
      if (!useCase) {
        return null;
      }

      return {
        id: useCase.id,
        title: useCase.title,
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