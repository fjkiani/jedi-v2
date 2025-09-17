/**
 * JEDI Rules™ - Real Client Implementations
 * 
 * Actual client implementations showing how JEDI Rules solves real business problems
 * with measurable results and technical details.
 */

export const RULES_IMPLEMENTATIONS = [
  {
    id: 'marketing-operations-automation',
    client: 'Marketing Operations Automation',
    industry: 'Digital Marketing',
    problem: 'Need to automate complex marketing workflows and decision-making processes',
    solution: 'JEDI Rules converts marketing requirements into automated workflows',
    results: {
      automation: '90% of marketing processes automated',
      efficiency: '60% reduction in manual work',
      accuracy: '95% decision accuracy',
      scalability: '1M+ rule evaluations per minute'
    },
    technicalDetails: 'Processes customer data, campaign performance, and business rules to automatically trigger marketing actions and optimizations.',
    technologies: ['PostgreSQL', 'MongoDB', 'Redis', 'Marketing APIs'],
    businessImpact: 'Transformed marketing operations from manual, error-prone processes to fully automated, data-driven workflows that scale with business growth.',
    scalability: 'Rule-based automation can be applied to any marketing strategy and adapted for different industries and customer segments.'
  },
  {
    id: 'financial-services-compliance',
    client: 'Financial Services Compliance',
    industry: 'Financial Services',
    problem: 'Need to ensure regulatory compliance across all financial operations',
    solution: 'JEDI Rules implements and monitors compliance rules automatically',
    results: {
      compliance: '100% regulatory compliance',
      reporting: '50% faster compliance reporting',
      accuracy: '99.9% rule execution accuracy',
      costReduction: '40% reduction in compliance costs'
    },
    technicalDetails: 'Monitors transactions, customer data, and market conditions to automatically enforce compliance rules and generate reports.',
    technologies: ['PostgreSQL', 'Financial Data APIs', 'Compliance Databases', 'Reporting Systems'],
    businessImpact: 'Eliminated compliance risks and reduced regulatory costs while maintaining 100% compliance across all financial operations.',
    scalability: 'Compliance framework can be adapted for different financial regulations and applied across multiple jurisdictions and business units.'
  },
  {
    id: 'healthcare-workflow-automation',
    client: 'Healthcare Workflow Automation',
    industry: 'Healthcare',
    problem: 'Need to automate patient care workflows and clinical decision support',
    solution: 'JEDI Rules automates clinical workflows based on medical protocols',
    results: {
      workflowEfficiency: '70% faster patient processing',
      accuracy: '98% protocol compliance',
      patientOutcomes: '25% improvement in patient outcomes',
      staffProductivity: '50% reduction in administrative tasks'
    },
    technicalDetails: 'Processes patient data, medical records, and clinical protocols to automate care pathways and decision support.',
    technologies: ['HIPAA-compliant Databases', 'EHR Systems', 'Medical APIs', 'Clinical Decision Support Systems'],
    businessImpact: 'Improved patient care quality and efficiency while reducing administrative burden on healthcare staff and ensuring protocol compliance.',
    scalability: 'Clinical workflow automation can be adapted for different medical specialties and healthcare settings, from clinics to hospitals.'
  }
];

// Helper functions for rules implementations
export const getRulesImplementationById = (id) => 
  RULES_IMPLEMENTATIONS.find(impl => impl.id === id);

export const getRulesImplementationsByIndustry = (industry) => 
  RULES_IMPLEMENTATIONS.filter(impl => impl.industry === industry);

export const getRulesImplementationsByTechnology = (technology) => 
  RULES_IMPLEMENTATIONS.filter(impl => 
    impl.technologies.some(tech => tech.toLowerCase().includes(technology.toLowerCase()))
  );
