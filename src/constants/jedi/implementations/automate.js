/**
 * JEDI Automate™ - Real Client Implementations
 * 
 * Actual client implementations showing how JEDI Automate solves real business problems
 * with measurable results and technical details.
 */

export const AUTOMATE_IMPLEMENTATIONS = [
  {
    id: 'ecommerce-recommendation-engine',
    client: 'E-commerce Recommendation Engine',
    industry: 'Retail',
    problem: 'Need to optimize product recommendation models for better conversion rates',
    solution: 'JEDI Automate continuously optimizes recommendation models based on user behavior',
    results: {
      conversionRate: '40% improvement',
      clickThroughRate: '60% increase',
      revenue: '25% increase in sales',
      accuracy: '95% recommendation accuracy'
    },
    technicalDetails: 'Automatically tunes recommendation algorithms, tests different approaches, and retrains models based on user interaction data.',
    technologies: ['PyTorch', 'TensorFlow', 'Scikit-learn', 'Recommendation APIs'],
    businessImpact: 'Transformed e-commerce performance with AI-powered recommendations that drive significant revenue growth and customer engagement.',
    scalability: 'Recommendation optimization can be applied to any product catalog and adapted for different retail verticals and customer segments.'
  },
  {
    id: 'financial-fraud-detection',
    client: 'Financial Fraud Detection',
    industry: 'Financial Services',
    problem: 'Need to continuously improve fraud detection models as fraud patterns evolve',
    solution: 'JEDI Automate adapts fraud detection models to new patterns automatically',
    results: {
      fraudDetection: '99.5% accuracy',
      falsePositives: '70% reduction',
      responseTime: 'Real-time detection',
      costSavings: 'Millions in prevented fraud'
    },
    technicalDetails: 'Continuously learns from new fraud patterns, optimizes detection algorithms, and automatically updates models.',
    technologies: ['PyTorch', 'TensorFlow', 'Financial Data APIs', 'Real-time Processing'],
    businessImpact: 'Protected millions in assets with AI-powered fraud detection that adapts to evolving threats and reduces false positives.',
    scalability: 'Fraud detection optimization can be applied to any financial institution and adapted for different transaction types and risk profiles.'
  },
  {
    id: 'manufacturing-quality-control',
    client: 'Manufacturing Quality Control',
    industry: 'Manufacturing',
    problem: 'Need to optimize quality control models for different products and production lines',
    solution: 'JEDI Automate optimizes quality control models for each product and production line',
    results: {
      defectDetection: '98% accuracy',
      falseAlarms: '80% reduction',
      productionEfficiency: '30% improvement',
      qualityImprovement: '45% reduction in defects'
    },
    technicalDetails: 'Automatically tunes computer vision models for different products, optimizes detection thresholds, and adapts to production line changes.',
    technologies: ['PyTorch', 'TensorFlow', 'Computer Vision', 'IoT Sensors'],
    businessImpact: 'Revolutionized manufacturing quality control with AI-powered inspection that reduces defects and improves production efficiency.',
    scalability: 'Quality control optimization can be applied to any manufacturing process and adapted for different products and production environments.'
  }
];

// Helper functions for automate implementations
export const getAutomateImplementationById = (id) => 
  AUTOMATE_IMPLEMENTATIONS.find(impl => impl.id === id);

export const getAutomateImplementationsByIndustry = (industry) => 
  AUTOMATE_IMPLEMENTATIONS.filter(impl => impl.industry === industry);

export const getAutomateImplementationsByTechnology = (technology) => 
  AUTOMATE_IMPLEMENTATIONS.filter(impl => 
    impl.technologies.some(tech => tech.toLowerCase().includes(technology.toLowerCase()))
  );
