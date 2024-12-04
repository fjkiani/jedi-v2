export const categoryIcons = {
  // Development & Tools
  development: {
    core: 'tool',
    frontend: 'tool',
    backend: 'tool',
    mobile: 'tool',
    desktop: 'tool',
    sdk: 'tool'
  },

  // Analytics & Monitoring
  analytics: {
    monitoring: 'chart',
    metrics: 'chart',
    analytics: 'chart',
    reporting: 'chart',
    performance: 'chart'
  },

  // Quality & Validation
  quality: {
    testing: 'check',
    validation: 'check',
    quality: 'check',
    compliance: 'check',
    security: 'check'
  },

  // Innovation & Features
  features: {
    innovation: 'lightbulb',
    features: 'lightbulb',
    solutions: 'lightbulb',
    ideas: 'lightbulb'
  }
};

export const getIconForCategory = (category) => {
  // Direct mapping for common tech categories
  const iconMap = {
    // Core & Development
    core: 'code',
    frontend: 'code',
    backend: 'server',
    mobile: 'code',
    sdk: 'tool',
    runtime: 'cpu',

    // Data & Storage
    database: 'database',
    storage: 'database',
    cache: 'database',
    data: 'database',

    // Infrastructure & Deployment
    infrastructure: 'server',
    cloud: 'cloud',
    deployment: 'rocket',
    container: 'server',

    // Monitoring & Analytics
    monitoring: 'chart',
    analytics: 'chart',
    metrics: 'chart',
    performance: 'chart',

    // Security & Quality
    security: 'shield',
    auth: 'shield',
    encryption: 'shield',
    quality: 'check',
    testing: 'check',
    validation: 'check',

    // Features & Innovation
    features: 'lightbulb',
    innovation: 'lightbulb',
    experimental: 'lightbulb',

    // Tools & Utilities
    tools: 'tool',
    utilities: 'tool',
    devops: 'tool'
  };

  // Convert category to lowercase for case-insensitive matching
  const normalizedCategory = category.toLowerCase();
  
  // Return matched icon or default to 'cube'
  return iconMap[normalizedCategory] || 'tool';
}; 