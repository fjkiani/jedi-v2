/**
 * JEDI Ensemble™ - Real Client Implementations
 * 
 * Actual client implementations showing how JEDI Ensemble solves real business problems
 * with measurable results and technical details.
 */

export const ENSEMBLE_IMPLEMENTATIONS = [
  {
    id: 'go-answer-voice-agents',
    client: 'Go Answer',
    industry: 'Customer Service',
    problem: 'Small business owner needed 24/7 customer support but couldn\'t afford to hire staff around the clock',
    solution: 'JEDI Ensemble created an AI phone system that answers calls like a human and handles customer questions automatically',
    results: {
      responseTime: '80% faster customer responses',
      customerSatisfaction: '60% happier customers',
      costReduction: '40% lower support costs',
      uptime: 'Never misses a call'
    },
    technicalDetails: 'Uses multiple AI tools working together to provide human-like phone support 24/7.',
    technologies: ['ChatGPT', 'Voice AI', 'Phone Systems'],
    businessImpact: 'Now handles 90% of customer calls automatically, saving thousands in staffing costs while keeping customers happy.',
    scalability: 'Works for any business size - from 10 customers to 10,000.'
  },
  {
    id: 'aiso-search-optimization',
    client: 'AISO (AI Search Optimization)',
    industry: 'Digital Marketing',
    problem: 'Small marketing agency was struggling to get clients\' websites found on Google and other search engines',
    solution: 'JEDI Ensemble created an AI system that automatically optimizes content for all search engines and AI tools',
    results: {
      organicTraffic: '150% more website visitors',
      leadQuality: '200% better leads',
      contentEfficiency: '3x faster content creation',
      searchRankings: 'Top 3 on Google for important keywords'
    },
    technicalDetails: 'Uses multiple AI tools to create and optimize content that works across all search platforms.',
    technologies: ['Google AI', 'ChatGPT', 'SEO Tools'],
    businessImpact: 'Clients now get found on Google and other search engines, bringing in more customers and higher quality leads.',
    scalability: 'Works for any business that wants to be found online - from local shops to e-commerce stores.'
  },
  {
    id: 'interactive-ai-agents',
    client: 'Interactive AI Agents',
    industry: 'Education & Coaching',
    problem: 'Small training company wanted to provide personalized coaching but couldn\'t afford to hire enough coaches for each student',
    solution: 'JEDI Ensemble created AI coaches that adapt to each student\'s learning style and provide personalized guidance',
    results: {
      learningOutcomes: '35% better learning results',
      engagement: '80% more engaged students',
      completionRates: '60% more students finish courses',
      personalization: '95% accurate in understanding how each student learns best'
    },
    technicalDetails: 'Uses multiple AI tools to create personalized learning experiences that adapt to each student.',
    technologies: ['ChatGPT', 'Learning AI', 'Assessment Tools'],
    businessImpact: 'Students learn faster and better with personalized AI coaching, leading to higher satisfaction and completion rates.',
    scalability: 'Works for any type of training or education - from business skills to academic subjects.'
  }
];

// Helper functions for ensemble implementations
export const getEnsembleImplementationById = (id) => 
  ENSEMBLE_IMPLEMENTATIONS.find(impl => impl.id === id);

export const getEnsembleImplementationsByIndustry = (industry) => 
  ENSEMBLE_IMPLEMENTATIONS.filter(impl => impl.industry === industry);

export const getEnsembleImplementationsByTechnology = (technology) => 
  ENSEMBLE_IMPLEMENTATIONS.filter(impl => 
    impl.technologies.some(tech => tech.toLowerCase().includes(technology.toLowerCase()))
  );
