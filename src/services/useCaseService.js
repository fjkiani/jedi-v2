import { hygraphClient } from '@/lib/hygraph';
import { GET_USE_CASES, GET_USE_CASES_BY_INDUSTRY, GET_INDUSTRIES } from '@/graphql/queries/useCases';

class UseCaseService {
  constructor() {
    this.useCases = new Map();
    this.industries = new Map();
    this.initialized = false;
  }

  async initialize() {
    if (this.initialized) return;
    
    try {
      // First get all industries
      const { industries } = await hygraphClient.request(GET_INDUSTRIES);
      console.log('Fetched industries:', industries);
      
      industries.forEach(industry => {
        this.industries.set(industry.slug, industry);
      });

      // Then get all use cases
      const { useCaseS } = await hygraphClient.request(GET_USE_CASES);
      console.log('Fetched use cases:', useCaseS);
      
      // Organize use cases by industry and section
      useCaseS.forEach(useCase => {
        const industrySlug = useCase.industry.slug;
        if (!this.useCases.has(industrySlug)) {
          this.useCases.set(industrySlug, new Map());
        }
        
        const industryMap = this.useCases.get(industrySlug);
        if (!industryMap.has(useCase.section)) {
          industryMap.set(useCase.section, []);
        }
        
        industryMap.get(useCase.section).push(useCase);
      });

      console.log('Organized use cases:', {
        industries: Array.from(this.industries.entries()),
        useCases: Array.from(this.useCases.entries()).map(([industry, sections]) => ({
          industry,
          sections: Array.from(sections.entries())
        }))
      });

      this.initialized = true;
    } catch (error) {
      console.error('Error initializing use cases:', error);
      throw error;
    }
  }

  async getIndustries() {
    await this.initialize();
    return Array.from(this.industries.values());
  }

  async getIndustrySections(industrySlug) {
    await this.initialize();
    return this.industries.get(industrySlug)?.sections || [];
  }

  async getUseCasesByIndustry(industrySlug) {
    await this.initialize();
    return this.useCases.get(industrySlug) || new Map();
  }

  async getUseCasesBySection(industrySlug, section) {
    await this.initialize();
    return this.useCases.get(industrySlug)?.get(section) || [];
  }

  async getQueries(industrySlug, section) {
    const useCases = await this.getUseCasesBySection(industrySlug, section);
    return useCases.reduce((allQueries, useCase) => {
      if (useCase.queries) {
        allQueries.push(...useCase.queries);
      }
      return allQueries;
    }, []);
  }

  async getImplementation(industrySlug, section, query) {
    const useCases = await this.getUseCasesBySection(industrySlug, section);
    const useCase = useCases.find(uc => uc.queries.includes(query));
    
    if (!useCase) {
      throw new Error('No matching use case found');
    }

    return {
      title: useCase.title,
      description: useCase.description,
      architecture: useCase.architecture
    };
  }

  // Refresh the cache if needed
  async refresh() {
    this.useCases.clear();
    this.industries.clear();
    this.initialized = false;
    await this.initialize();
  }
}

export const useCaseService = new UseCaseService(); 