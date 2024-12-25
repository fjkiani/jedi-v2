export const healthcareOverview = {
    'patient-risk-analysis': {
      title: 'How Clinical Risk Analysis Works',
      description: 'Modern patient risk analysis combines real-time health monitoring with predictive analytics to identify potential health risks before they become critical events.',
      workflow: {
        title: 'How It Works',
        description: 'The clinical risk analysis pipeline consists of several critical steps:',
        steps: [
          {
            title: 'Data Collection & Integration',
            description: 'Continuous monitoring of patient vital signs and health indicators',
            details: [
              'Real-time vital signs from medical devices',
              'Electronic Health Records (EHR)',
              'Laboratory results and diagnostics',
              'Medication data and treatment plans'
            ],
            icon: 'database'
          },
          {
            title: 'AI Analysis Engine',
            description: 'Advanced pattern recognition and risk assessment',
            details: [
              'Machine learning models trained on clinical data',
              'Real-time analysis of patient vitals',
              'Pattern detection in health indicators',
              'Correlation of multiple risk factors'
            ],
            icon: 'cpu'
          },
          {
            title: 'Clinical Decision Support',
            description: 'Actionable insights for healthcare providers',
            details: [
              'Risk score calculation and trending',
              'Early warning notifications',
              'Treatment recommendation support',
              'Care team coordination'
            ],
            icon: 'activity'
          }
        ]
      },
      keyPoints: [
        {
          title: 'Real-time Monitoring',
          description: 'Continuous analysis of patient data streams',
          icon: 'bar-chart-2',
          metrics: ['<100ms processing latency', '24/7 monitoring coverage']
        },
        {
          title: 'Predictive Analytics',
          description: 'Early detection of potential health risks',
          icon: 'trending-up',
          metrics: ['6-12 hours early warning', '85% prediction accuracy']
        },
        {
          title: 'Clinical Integration',
          description: 'Seamless integration with existing systems',
          icon: 'git-merge',
          metrics: ['FHIR/HL7 compatible', 'HIPAA compliant']
        }
      ]
    }
    // Add other healthcare solutions here
  }; 