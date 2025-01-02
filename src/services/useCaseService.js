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
      const industriesResponse = await hygraphClient.request(GET_INDUSTRIES);
      const industries = industriesResponse?.industries || [];
      console.log('Fetched industries:', industries);
      
      if (!industries || industries.length === 0) {
        console.warn('No industries found');
      }
      
      industries.forEach(industry => {
        if (industry?.slug) {
          this.industries.set(industry.slug, industry);
        }
      });

      // Then get all use cases
      const useCasesResponse = await hygraphClient.request(GET_USE_CASES);
      const useCases = useCasesResponse?.useCaseS || [];
      console.log('Fetched use cases:', useCases);
      
      if (!useCases || useCases.length === 0) {
        console.warn('No use cases found');
      }
      
      console.log('Fetched use cases with queries:', useCases.map(uc => ({
        title: uc.title,
        queries: uc.queries
      })));
      
      // Organize use cases by industry only
      useCases.forEach(useCase => {
        // Skip use cases with no industry instead of warning
        if (!useCase?.industry?.slug) {
          console.log('Skipping use case with no industry:', useCase?.title);
          return;
        }
        
        const industrySlug = useCase.industry.slug;
        if (!this.useCases.has(industrySlug)) {
          this.useCases.set(industrySlug, []);
        }
        
        // Check if use case already exists before adding it
        const existingUseCases = this.useCases.get(industrySlug);
        const useCaseExists = existingUseCases.some(existing => existing.id === useCase.id);
        
        if (!useCaseExists) {
          // Ensure queries are preserved when adding to map
          this.useCases.get(industrySlug).push({
            ...useCase,
            queries: useCase.queries || [] // Ensure queries is at least an empty array
          });
        }
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
    
    const industryUseCases = this.useCases.get(industrySlug) || [];
    // For now, return all use cases for the industry regardless of section
    return industryUseCases;
  }

  async getQueries(industrySlug) {
    const useCases = await this.getUseCasesBySection(industrySlug);
    return useCases.reduce((allQueries, useCase) => {
      if (useCase.queries) {
        allQueries.push(...useCase.queries);
      }
      return allQueries;
    }, []);
  }

  async getImplementation(industrySlug, query) {
    const useCases = await this.getUseCasesBySection(industrySlug);
    console.log('Attempting to match query:', query);
    console.log('Available use cases:', useCases.map(uc => ({
      title: uc.title,
      queries: uc.queries
    })));
    
    // Find the use case that owns this query
    const useCase = useCases.find(uc => {
      if (!uc.queries) {
        console.log(`No queries for use case: ${uc.title}`);
        return false;
      }
      
      console.log(`\nChecking use case "${uc.title}" queries:`, uc.queries);
      const hasMatch = uc.queries.some(q => {
        const match = q.toLowerCase() === query.toLowerCase();
        console.log(`Comparing:\n  Query: "${query}"\n  Against: "${q}"\n  Exact match: ${match}`);
        
        if (!match) {
          const includesMatch = q.toLowerCase().includes(query.toLowerCase()) || 
                              query.toLowerCase().includes(q.toLowerCase());
          console.log(`  Partial match: ${includesMatch}`);
          return includesMatch;
        }
        return match;
      });
      console.log(`Found match in "${uc.title}": ${hasMatch}`);
      return hasMatch;
    });
    
    if (!useCase) {
      console.log('No use case found with matching query:', query);
      console.log('Falling back to first use case');
      return useCases[0] ? {
        title: useCases[0].title,
        description: useCases[0].description,
        architecture: useCases[0].architecture
      } : null;
    }

    console.log('Found matching use case:', useCase.title);
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