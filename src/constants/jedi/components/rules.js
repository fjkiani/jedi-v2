/**
 * JEDI Rules™ - Business Automation Assistant
 * 
 * Turns your business rules and processes into automated AI actions,
 * so you can focus on growing your business instead of managing repetitive tasks.
 */

export const JEDI_RULES = {
  id: 'jedi-rules',
  name: 'JEDI Rules™',
  tagline: 'Business Automation Assistant',
  description: 'Turns your business rules and processes into automated AI actions, so you can focus on growing your business instead of managing repetitive tasks.',
  
  // Core Problem It Solves
  problem: {
    title: 'Manual Work & Inconsistency',
    description: 'Small businesses waste time on repetitive tasks and struggle to keep processes consistent as they grow, leading to mistakes and lost opportunities.',
    painPoints: [
      'How do I automate my business processes without hiring a developer?',
      'How do I make sure my team follows the same rules every time?',
      'How do I handle customer requests consistently across all channels?',
      'How do I update my business rules without breaking everything?'
    ]
  },

  // What It Does For You
  capabilities: {
    primary: [
      {
        name: 'Write Rules in Plain English',
        description: 'Just tell us your business rules in simple language - we\'ll turn them into automated actions.',
        userBenefit: 'No technical knowledge needed - just describe what you want to happen.',
        businessValue: 'Save hours of work by automating your business processes'
      },
      {
        name: 'Makes Decisions Automatically',
        description: 'Handles routine business decisions 24/7 based on your rules, so you don\'t have to.',
        userBenefit: 'Your business runs smoothly even when you\'re not there.',
        businessValue: 'Never miss an opportunity or make a mistake due to human error'
      },
      {
        name: 'Connects All Your Systems',
        description: 'Makes all your business tools work together automatically, from your website to your email.',
        userBenefit: 'Everything happens seamlessly without you having to manage each system separately.',
        businessValue: 'Reduce errors and save time by eliminating manual data entry'
      },
      {
        name: 'Keeps Track of Everything',
        description: 'Automatically records all decisions and actions for easy tracking and compliance.',
        userBenefit: 'Always know what happened and when, without keeping manual records.',
        businessValue: 'Stay organized and compliant without extra paperwork'
      }
    ],
    secondary: [
      {
        name: 'Prevents Rule Conflicts',
        description: 'Automatically checks your rules to make sure they don\'t contradict each other.',
        userBenefit: 'Avoid confusion and mistakes from conflicting business rules.'
      },
      {
        name: 'Runs Fast and Efficiently',
        description: 'Processes your business rules quickly and efficiently without slowing down your systems.',
        userBenefit: 'Get instant results without waiting for slow processes.'
      }
    ]
  },

  // Architecture & Technical Foundation
  architecture: {
    description: 'JEDI Rules is built on a rule engine architecture that abstracts away all technical complexity from users.',
    components: [
      {
        name: 'Natural Language Processor',
        description: 'Converts natural language business requirements into executable rule logic.',
        userFacing: false
      },
      {
        name: 'Rule Engine',
        description: 'Executes business rules efficiently with high performance and reliability.',
        userFacing: false
      },
      {
        name: 'Workflow Orchestrator',
        description: 'Coordinates complex business processes across multiple systems.',
        userFacing: false
      },
      {
        name: 'Audit & Compliance Manager',
        description: 'Tracks all rule executions and decisions for compliance and auditing.',
        userFacing: false
      }
    ],
    integrations: [
      'PostgreSQL for rule storage',
      'MongoDB for document-based workflows',
      'Redis for high-performance caching',
      'Enterprise systems via APIs',
      'Cloud platforms (AWS, Azure, GCP)'
    ]
  },

  // User Experience
  userExperience: {
    setup: 'Describe your business rules in plain English - JEDI Rules handles the technical implementation.',
    configuration: 'Visual rule builder with natural language input - no coding required.',
    monitoring: 'Real-time dashboard shows rule performance, execution logs, and compliance status.',
    scaling: 'Automatically handles any number of rules and transactions without performance degradation.'
  }
};
