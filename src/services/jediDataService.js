import { client } from '@/lib/apollo-client';

// GraphQL queries for JEDI data
const GET_JEDI_COMPONENTS = `
  query GetJediComponents {
    jediComponents {
      id
      name
      slug
      tagline
      description
      capabilities {
        primary {
          name
          description
          userBenefit
        }
        advanced {
          name
          description
          userBenefit
        }
      }
      metrics {
        label
        value
        description
      }
      technologies {
        id
        name
        slug
        icon {
          url
        }
      }
      useCases {
        id
        title
        slug
        industry {
          name
          slug
        }
        results {
          responseTime
          accuracy
          customerSatisfaction
          costSavings
        }
      }
    }
  }
`;

const GET_TECHNOLOGIES = `
  query GetTechnologies {
    technologies {
      id
      name
      slug
      description
      icon {
        url
      }
      category
      features
      businessMetrics
    }
  }
`;

const GET_USE_CASES = `
  query GetUseCases {
    useCases {
      id
      title
      slug
      description
      industry {
        id
        name
        slug
      }
      components {
        id
        name
        slug
      }
      results {
        responseTime
        accuracy
        customerSatisfaction
        costSavings
        roi
      }
      implementation {
        duration
        complexity
        teamSize
      }
    }
  }
`;

const GET_INDUSTRIES = `
  query GetIndustries {
    industries {
      id
      name
      slug
      description
      challenges
      solutions
      useCases {
        id
        title
        slug
      }
    }
  }
`;

// Data service class
class JediDataService {
  constructor() {
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
  }

  // Generic cache method
  async getCachedData(key, fetchFunction) {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }

    const data = await fetchFunction();
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
    return data;
  }

  // Get JEDI components with relationships
  async getJediComponents() {
    return this.getCachedData('jediComponents', async () => {
      try {
        const { data } = await client.query({
          query: GET_JEDI_COMPONENTS,
          fetchPolicy: 'cache-first'
        });
        return data.jediComponents || [];
      } catch (error) {
        console.error('Error fetching JEDI components:', error);
        return this.getFallbackJediComponents();
      }
    });
  }

  // Get technologies
  async getTechnologies() {
    return this.getCachedData('technologies', async () => {
      try {
        const { data } = await client.query({
          query: GET_TECHNOLOGIES,
          fetchPolicy: 'cache-first'
        });
        return data.technologies || [];
      } catch (error) {
        console.error('Error fetching technologies:', error);
        return this.getFallbackTechnologies();
      }
    });
  }

  // Get use cases
  async getUseCases() {
    return this.getCachedData('useCases', async () => {
      try {
        const { data } = await client.query({
          query: GET_USE_CASES,
          fetchPolicy: 'cache-first'
        });
        return data.useCases || [];
      } catch (error) {
        console.error('Error fetching use cases:', error);
        return this.getFallbackUseCases();
      }
    });
  }

  // Get industries
  async getIndustries() {
    return this.getCachedData('industries', async () => {
      try {
        const { data } = await client.query({
          query: GET_INDUSTRIES,
          fetchPolicy: 'cache-first'
        });
        return data.industries || [];
      } catch (error) {
        console.error('Error fetching industries:', error);
        return this.getFallbackIndustries();
      }
    });
  }

  // Get all data for JEDI pages
  async getAllJediData() {
    const [jediComponents, technologies, useCases, industries] = await Promise.all([
      this.getJediComponents(),
      this.getTechnologies(),
      this.getUseCases(),
      this.getIndustries()
    ]);

    return {
      jediComponents,
      technologies,
      useCases,
      industries
    };
  }

  // Get technologies used by a specific JEDI component
  async getTechnologiesForComponent(componentId) {
    const components = await this.getJediComponents();
    const component = components.find(c => c.id === componentId);
    return component?.technologies || [];
  }

  // Get use cases for a specific JEDI component
  async getUseCasesForComponent(componentId) {
    const useCases = await this.getUseCases();
    return useCases.filter(useCase => 
      useCase.components?.some(comp => comp.id === componentId)
    );
  }

  // Get use cases for a specific industry
  async getUseCasesForIndustry(industrySlug) {
    const useCases = await this.getUseCases();
    return useCases.filter(useCase => 
      useCase.industry?.slug === industrySlug
    );
  }

  // Fallback data when Hygraph is unavailable
  getFallbackJediComponents() {
    return [
      {
        id: 'jedi-ensemble',
        name: 'JEDI Ensemble™',
        slug: 'jedi-ensemble',
        tagline: 'Multi-Model AI Orchestration',
        description: 'Intelligently orchestrates multiple AI models to solve complex business problems without requiring users to understand model selection, routing, or optimization.',
        capabilities: {
          primary: [
            { name: 'Intelligent Model Selection', description: 'Automatically chooses best model for each task', userBenefit: 'No need to understand which AI model to use' },
            { name: 'Multi-Model Orchestration', description: 'Coordinates multiple models seamlessly', userBenefit: 'Get the best of all AI models working together' },
            { name: 'Automatic Fallback & Recovery', description: 'Ensures continuous service availability', userBenefit: 'Your AI never goes down' }
          ]
        },
        metrics: [
          { label: 'Model Accuracy', value: '95-99.5%' },
          { label: 'Response Time', value: '< 200ms' },
          { label: 'Uptime', value: '99.9%' },
          { label: 'Client Satisfaction', value: '98%' }
        ],
        technologies: [],
        useCases: []
      },
      {
        id: 'jedi-rules',
        name: 'JEDI Rules™',
        slug: 'jedi-rules',
        tagline: 'Business Logic Engine',
        description: 'Converts natural language business requirements into executable AI logic, allowing non-technical users to define complex business rules and workflows.',
        capabilities: {
          primary: [
            { name: 'Natural Language Rule Definition', description: 'Define rules in plain English', userBenefit: 'No coding required' },
            { name: 'Automated Decision Making', description: 'Processes complex decisions automatically', userBenefit: '24/7 automated decision making' },
            { name: 'Workflow Orchestration', description: 'Coordinates processes across systems', userBenefit: 'Everything works together seamlessly' }
          ]
        },
        metrics: [
          { label: 'Process Automation', value: '90%' },
          { label: 'Decision Accuracy', value: '99.2%' },
          { label: 'Time Savings', value: '60%' },
          { label: 'Compliance Rate', value: '100%' }
        ],
        technologies: [],
        useCases: []
      },
      {
        id: 'jedi-automate',
        name: 'JEDI AutoTune™',
        slug: 'jedi-automate',
        tagline: 'AI Performance Booster',
        description: 'Automatically optimizes AI models for specific business needs without requiring machine learning expertise or manual tuning.',
        capabilities: {
          primary: [
            { name: 'Automatic Hyperparameter Tuning', description: 'Finds optimal parameters automatically', userBenefit: 'Best performance without technical knowledge' },
            { name: 'Continuous Model Learning', description: 'Retrains models as data changes', userBenefit: 'AI gets better over time automatically' },
            { name: 'Performance Monitoring & Alerting', description: 'Alerts when optimization needed', userBenefit: 'Proactive performance management' }
          ]
        },
        metrics: [
          { label: 'Performance Improvement', value: '40%' },
          { label: 'False Positive Reduction', value: '70%' },
          { label: 'Model Accuracy', value: '98%' },
          { label: 'Optimization Time', value: '80% faster' }
        ],
        technologies: [],
        useCases: []
      }
    ];
  }

  getFallbackTechnologies() {
    return [
      { id: 'openai', name: 'OpenAI GPT', slug: 'openai-gpt', icon: { url: '/assets/stack/openai.png' } },
      { id: 'anthropic', name: 'Anthropic Claude', slug: 'anthropic-claude', icon: { url: '/assets/stack/anthropic.png' } },
      { id: 'langchain', name: 'LangChain', slug: 'langchain', icon: { url: '/assets/stack/langchain.png' } },
      { id: 'weaviate', name: 'Weaviate', slug: 'weaviate', icon: { url: '/assets/stack/weaviate.png' } },
      { id: 'huggingface', name: 'Hugging Face', slug: 'hugging-face', icon: { url: '/assets/stack/huggingface.png' } },
      { id: 'postgresql', name: 'PostgreSQL', slug: 'postgresql', icon: { url: '/assets/stack/postgresql.png' } },
      { id: 'mongodb', name: 'MongoDB', slug: 'mongodb', icon: { url: '/assets/stack/mongodb.png' } },
      { id: 'docker', name: 'Docker', slug: 'docker', icon: { url: '/assets/stack/docker.png' } }
    ];
  }

  getFallbackUseCases() {
    return [
      {
        id: 'go-answer',
        title: 'Go Answer Voice AI',
        slug: 'go-answer-voice-ai',
        industry: { name: 'Technology', slug: 'technology' },
        components: [{ id: 'jedi-ensemble', name: 'JEDI Ensemble™' }],
        results: { responseTime: '80% faster', accuracy: '95%', customerSatisfaction: '60% improvement' }
      },
      {
        id: 'aiso-search',
        title: 'AISO Search Optimization',
        slug: 'aiso-search-optimization',
        industry: { name: 'Technology', slug: 'technology' },
        components: [{ id: 'jedi-ensemble', name: 'JEDI Ensemble™' }],
        results: { responseTime: '150% traffic increase', accuracy: '200% lead quality improvement' }
      },
      {
        id: 'crispro-oncology',
        title: 'CrisPRO Oncology Co-Pilot',
        slug: 'crispro-oncology-copilot',
        industry: { name: 'Healthcare', slug: 'healthcare' },
        components: [{ id: 'jedi-ensemble', name: 'JEDI Ensemble™' }, { id: 'jedi-rules', name: 'JEDI Rules™' }],
        results: { responseTime: '40% faster diagnostics', accuracy: '60% improved patient outcomes' }
      }
    ];
  }

  getFallbackIndustries() {
    return [
      { id: 'healthcare', name: 'Healthcare', slug: 'healthcare', description: 'AI-powered medical solutions' },
      { id: 'technology', name: 'Technology', slug: 'technology', description: 'AI automation and optimization' },
      { id: 'financial', name: 'Financial Services', slug: 'financial', description: 'AI-driven financial solutions' }
    ];
  }

  // Clear cache
  clearCache() {
    this.cache.clear();
  }
}

// Export singleton instance
export const jediDataService = new JediDataService();
export default jediDataService;

