import { hygraphClient } from '@/lib/hygraph';
import { aiMlSolution } from '@/constants/solutions/ai-ml';

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
        features
        businessMetrics
        useCases {
          id
          title
          slug
          industry {
            name
          }
        }
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
          features
          businessMetrics
          useCases {
            id
            title
            slug
            industry {
              name
            }
          }
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

const GET_USE_CASE_BY_SLUG = `
  query GetUseCaseBySlug($title: String!) {
    useCaseS(where: { title_contains: $title }) {
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

  async getUseCaseBySlug(slug) {
    try {
      // Convert slug back to a searchable title and clean it up
      const searchTitle = slug
        .split('-')
        .filter(word => word.length > 0)
        .join(' ');
      
      console.log('Searching for use case with title containing:', searchTitle);
      
      // Try exact match first
      let { useCaseS } = await hygraphClient.request(GET_USE_CASE_BY_SLUG, { title: searchTitle });
      
      // If no results, try with individual words
      if (!useCaseS?.length) {
        const words = searchTitle.split(' ');
        for (const word of words) {
          if (word.length < 3) continue; // Skip very short words
          const result = await hygraphClient.request(GET_USE_CASE_BY_SLUG, { title: word });
          if (result.useCaseS?.length) {
            useCaseS = result.useCaseS;
            break;
          }
        }
      }
      
      console.log('Found use cases:', useCaseS);
      
      // Find the best matching use case
      const useCase = useCaseS?.find(uc => 
        uc.title.toLowerCase().includes(searchTitle.toLowerCase()) || 
        searchTitle.toLowerCase().includes(uc.title.toLowerCase())
      ) || useCaseS?.[0];
      
      if (!useCase) {
        console.log('No use case found for title:', searchTitle);
        return null;
      }

      console.log('Selected use case:', useCase);
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
      console.error('Error fetching use case by slug:', error);
      throw error;
    }
  }

  // New methods for local technology data
  getLocalTechnologies() {
    const technologies = {};
    
    // Process AI/ML solution tech stack
    Object.entries(aiMlSolution.techStack).forEach(([category, techs]) => {
      Object.entries(techs).forEach(([name, tech]) => {
        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        technologies[slug] = {
          ...tech,
          name, // Ensure name is included
          slug,
          category,
          useCases: tech.useCases || [],
          features: tech.description || '',
          description: tech.description || '',
          icon: tech.icon || null,
        };
      });
    });

    console.log('Generated local technologies:', technologies);
    return technologies;
  }

  getLocalTechnologyBySlug(slug) {
    console.log('Looking for local technology with slug:', slug);
    const technologies = this.getLocalTechnologies();
    console.log('Available local technologies:', Object.keys(technologies));
    return technologies[slug];
  }

  getLocalCategories() {
    const categories = {};
    
    // Process AI/ML solution tech stack
    Object.entries(aiMlSolution.techStack).forEach(([categoryName, techs]) => {
      categories[categoryName] = {
        id: categoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        name: categoryName.replace(/([A-Z])/g, ' $1').trim(),
        slug: categoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        technologies: Object.entries(techs).map(([name, tech]) => ({
          id: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          name,
          slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          icon: tech.icon,
          description: tech.description,
          category: categoryName
        }))
      };
    });

    return Object.values(categories);
  }

  async getLocalTechnologyBySlug(slug) {
    try {
      // First, try to get the technology from localStorage
      const storedTech = localStorage.getItem('selectedTechnology');
      if (storedTech) {
        const tech = JSON.parse(storedTech);
        // Verify that this is the technology we're looking for
        const techSlug = tech.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
        if (techSlug === slug) {
          return tech;
        }
      }

      // If not found in localStorage, try to get from Hygraph
      return this.getTechnologyBySlug(slug);
    } catch (error) {
      console.error('Error getting technology:', error);
      throw error;
    }
  }
}

export const technologyService = new TechnologyService();