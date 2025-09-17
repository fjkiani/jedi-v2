/**
 * JEDI Automate™ - AI Performance Booster
 * 
 * Automatically makes your AI tools work better for your specific business,
 * so you get better results without needing technical expertise.
 */

export const JEDI_AUTOMATE = {
  id: 'jedi-automate',
  name: 'JEDI Automate™',
  tagline: 'AI Performance Booster',
  description: 'Automatically makes your AI tools work better for your specific business, so you get better results without needing technical expertise.',
  
  // Core Problem It Solves
  problem: {
    title: 'AI That Doesn\'t Work Well for Your Business',
    description: 'Small businesses try AI tools but they don\'t work well for their specific needs, leading to poor results and wasted time.',
    painPoints: [
      'How do I make AI tools work better for my specific business?',
      'How do I improve AI results without hiring technical experts?',
      'How do I keep my AI working well as my business changes?',
      'How do I know if my AI is actually helping or hurting my business?'
    ]
  },

  // What It Does For You
  capabilities: {
    primary: [
      {
        name: 'Finds the Best Settings',
        description: 'Automatically figures out the best settings for your AI tools based on your specific business needs.',
        userBenefit: 'Get the best results from your AI without needing to understand technical settings.',
        businessValue: 'Better AI results that actually help your business grow'
      },
      {
        name: 'Learns and Improves',
        description: 'Continuously learns from your business data and automatically improves your AI performance.',
        userBenefit: 'Your AI gets smarter and more helpful over time without any work from you.',
        businessValue: 'Better results and lower costs as your AI learns your business'
      },
      {
        name: 'Watches and Alerts',
        description: 'Monitors your AI performance and lets you know when something needs attention.',
        userBenefit: 'Never wonder if your AI is working properly - we\'ll tell you if there\'s a problem.',
        businessValue: 'Catch problems early before they hurt your business'
      },
      {
        name: 'Tests and Compares',
        description: 'Automatically tests different AI approaches to find what works best for your business.',
        userBenefit: 'Always get the best AI solution without having to guess or experiment yourself.',
        businessValue: 'Confidently use AI knowing it\'s optimized for your specific needs'
      }
    ],
    secondary: [
      {
        name: 'Adapts to Changes',
        description: 'Automatically adjusts when your business data or needs change.',
        userBenefit: 'Your AI stays relevant and helpful even as your business evolves.'
      },
      {
        name: 'Keeps Backups',
        description: 'Maintains backup versions of your AI settings so you can always go back to what worked.',
        userBenefit: 'Experiment safely knowing you can always return to a working version.'
      }
    ]
  },

  // Architecture & Technical Foundation
  architecture: {
    description: 'JEDI Automate is built on an automated ML pipeline architecture that abstracts away all optimization complexity from users.',
    components: [
      {
        name: 'Hyperparameter Optimizer',
        description: 'Automatically finds optimal model parameters using advanced optimization algorithms.',
        userFacing: false
      },
      {
        name: 'Model Trainer',
        description: 'Handles all aspects of model training, validation, and testing automatically.',
        userFacing: false
      },
      {
        name: 'Performance Monitor',
        description: 'Continuously monitors model performance and triggers optimization when needed.',
        userFacing: false
      },
      {
        name: 'A/B Testing Engine',
        description: 'Automatically tests different model versions and selects the best performing one.',
        userFacing: false
      }
    ],
    integrations: [
      'PyTorch for model training',
      'TensorFlow for deep learning',
      'Scikit-learn for traditional ML',
      'Hugging Face for transformer models',
      'Cloud ML platforms (AWS SageMaker, Azure ML)'
    ]
  },

  // User Experience
  userExperience: {
    setup: 'Provide your data and use case - JEDI Automate handles all optimization automatically.',
    configuration: 'Simple configuration interface - no ML expertise required.',
    monitoring: 'Real-time dashboard shows model performance, optimization progress, and alerts.',
    scaling: 'Automatically scales optimization processes based on data size and complexity.'
  }
};
