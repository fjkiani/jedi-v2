/**
 * JEDI Ensemble™ - Smart AI Assistant
 * 
 * Your intelligent AI assistant that automatically chooses the best AI tools
 * for each task, so you don't have to worry about which AI to use or how to set it up.
 */

export const JEDI_ENSEMBLE = {
  id: 'jedi-ensemble',
  name: 'JEDI Ensemble™',
  tagline: 'Smart AI Assistant',
  description: 'Your intelligent AI assistant that automatically chooses the best AI tools for each task, so you don\'t have to worry about which AI to use or how to set it up.',
  
  // Core Problem It Solves
  problem: {
    title: 'AI Confusion & Overwhelm',
    description: 'Small businesses know they need AI but don\'t know which AI tools to use, how to set them up, or how to make them work together effectively.',
    painPoints: [
      'Which AI tool should I use for my business?',
      'How do I get different AI tools to work together?',
      'How do I make sure my AI keeps working when one tool fails?',
      'How do I know if my AI is actually helping my business?'
    ]
  },

  // What It Does For You
  capabilities: {
    primary: [
      {
        name: 'Picks the Right AI Tool',
        description: 'Automatically chooses the best AI tool for each job, so you don\'t have to research or compare different options.',
        userBenefit: 'Just tell us what you need - we\'ll pick the perfect AI tool for the job.',
        businessValue: 'Saves you hours of research and prevents costly mistakes'
      },
      {
        name: 'Makes AI Tools Work Together',
        description: 'Connects different AI tools so they work as one smart system for your business.',
        userBenefit: 'All your AI tools work together seamlessly - no technical setup required.',
        businessValue: 'Get more done with less effort and better results'
      },
      {
        name: 'Keeps Your AI Running',
        description: 'Automatically switches to backup AI tools if one stops working, so your business never stops.',
        userBenefit: 'Your AI assistant never goes down - it always finds a way to help you.',
        businessValue: 'No lost sales or frustrated customers due to AI downtime'
      },
      {
        name: 'Gets Smarter Over Time',
        description: 'Learns from your business and automatically improves to give you better results.',
        userBenefit: 'Your AI gets better and more helpful every day without you doing anything.',
        businessValue: 'Better results and lower costs as your AI learns your business'
      }
    ],
    secondary: [
      {
        name: 'Saves You Money',
        description: 'Automatically finds the most cost-effective AI tools for each task.',
        userBenefit: 'Get the best results at the lowest cost without any manual optimization.'
      },
      {
        name: 'Handles Any Volume',
        description: 'Scales up or down automatically based on your business needs.',
        userBenefit: 'Whether you have 10 customers or 10,000, your AI handles it all.'
      }
    ]
  },

  // How It Works (Behind the Scenes)
  architecture: {
    description: 'JEDI Ensemble works behind the scenes to make AI simple for your business.',
    components: [
      {
        name: 'Smart Tool Picker',
        description: 'Automatically chooses the best AI tool for each task.',
        userFacing: false
      },
      {
        name: 'Performance Tracker',
        description: 'Monitors how well your AI is working and makes improvements automatically.',
        userFacing: false
      },
      {
        name: 'Backup Manager',
        description: 'Keeps backup AI tools ready in case your main one stops working.',
        userFacing: false
      },
      {
        name: 'Cost Optimizer',
        description: 'Finds the most cost-effective AI tools for your business needs.',
        userFacing: false
      }
    ],
    integrations: [
      'ChatGPT and similar AI tools',
      'Google AI tools',
      'Specialized business AI tools',
      'Custom AI tools for your industry'
    ]
  },

  // What You Experience
  userExperience: {
    setup: 'Just tell us what you need help with - we handle all the technical setup.',
    configuration: 'No complicated settings or technical knowledge required - it just works.',
    monitoring: 'See how much time and money your AI is saving you with simple, clear reports.',
    scaling: 'Grows with your business automatically - no need to worry about capacity or limits.'
  }
};
