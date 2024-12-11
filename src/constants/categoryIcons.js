export const categoryIcons = {
  // AI & ML Categories
  ai: {
    aiPlatforms: 'brain',
    mlFrameworks: 'code-square',
    vectorDatabases: 'database',
    mlOps: 'settings',
    agents: 'robot',
    nlp: 'message-square'
  },

  // Data Engineering
  data: {
    processing: 'data',
    storage: 'database',
    visualization: 'chart-line',
    orchestration: 'workflow',
    transformation: 'transform',
    quality: 'check-circle'
  },

  // Development & Tools (existing)
  development: {
    core: 'tool',
    frontend: 'tool',
    backend: 'tool',
    mobile: 'tool',
    desktop: 'tool',
    sdk: 'tool'
  },

  // Analytics & Monitoring (existing)
  analytics: {
    monitoring: 'chart',
    metrics: 'chart',
    analytics: 'chart',
    reporting: 'chart',
    performance: 'chart'
  },

  // Quality & Validation (existing)
  quality: {
    testing: 'check',
    validation: 'check',
    quality: 'check',
    compliance: 'check',
    security: 'check'
  },

  // Innovation & Features (existing)
  features: {
    innovation: 'lightbulb',
    features: 'lightbulb',
    solutions: 'lightbulb',
    ideas: 'lightbulb'
  }
};

export const getIconForCategory = (category) => {
  if (!category) return 'cube'; // Default fallback

  // Direct mapping for common tech categories
  const iconMap = {
    // AI/ML
    aiPlatforms: 'brain',
    mlFrameworks: 'code-square',
    vectorDatabases: 'database',
    mlOps: 'settings',
    agents: 'robot',
    nlp: 'message-square',

    // Data Engineering
    dataProcessing: 'data',
    dataStorage: 'database',
    dataVisualization: 'chart-line',
    dataOrchestration: 'workflow',
    dataTransformation: 'transform',
    dataQuality: 'check-circle',

    // Core & Development (existing)
    core: 'code',
    frontend: 'code',
    backend: 'server',
    mobile: 'code',
    sdk: 'tool',
    runtime: 'cpu',

    // Data & Storage (existing)
    database: 'database',
    storage: 'database',
    cache: 'database',
    data: 'database',

    // Infrastructure & Deployment (existing)
    infrastructure: 'server',
    cloud: 'cloud',
    deployment: 'rocket',
    container: 'server',

    // Monitoring & Analytics (existing)
    monitoring: 'chart',
    analytics: 'chart',
    metrics: 'chart',
    performance: 'chart',

    // Security & Quality (existing)
    security: 'shield',
    auth: 'shield',
    encryption: 'shield',
    quality: 'check',
    testing: 'check',
    validation: 'check',

    // Features & Innovation (existing)
    features: 'lightbulb',
    innovation: 'lightbulb',
    experimental: 'lightbulb',

    // Tools & Utilities (existing)
    tools: 'tool',
    utilities: 'tool',
    devops: 'tool'
  };

  try {
    // Convert category to lowercase for case-insensitive matching
    const normalizedCategory = category.toLowerCase();
    
    // Try to find a direct match
    if (iconMap[normalizedCategory]) {
      return iconMap[normalizedCategory];
    }

    // Try to find a partial match
    const partialMatch = Object.keys(iconMap).find(key => 
      normalizedCategory.includes(key) || key.includes(normalizedCategory)
    );

    return partialMatch ? iconMap[partialMatch] : 'cube';
  } catch (error) {
    console.warn(`Error getting icon for category: ${category}`, error);
    return 'cube';
  }
}; 