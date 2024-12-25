export const industries = [
  {
    id: 'financial',
    title: 'Financial Services',
    description: 'Advanced solutions for banking, insurance, and fintech',
    icon: 'bank',
    solutions: [
      {
        id: 'fraud-detection',
        title: 'Fraud Detection & Prevention',
        description: 'AI-powered fraud detection and prevention system',
        fullDescription: 'Enterprise-grade fraud detection solution leveraging advanced AI and machine learning to identify and prevent fraudulent activities in real-time.',
        icon: 'shield',
        capabilities: [
          'Real-time transaction monitoring',
          'Pattern recognition and anomaly detection',
          'Risk scoring and assessment',
          'Automated alert generation'
        ],
        benefits: [
          'Reduce fraud losses by up to 60%',
          'Improve customer trust and satisfaction',
          'Minimize false positives',
          'Streamline investigation workflows'
        ],
        features: [
          {
            title: 'AI-Powered Analysis',
            description: 'Advanced machine learning models for pattern detection',
            icon: 'cpu'
          },
          {
            title: 'Real-Time Monitoring',
            description: '24/7 transaction monitoring and instant alerts',
            icon: 'activity'
          },
          {
            title: 'Case Management',
            description: 'Integrated workflow for fraud investigation',
            icon: 'folder'
          }
        ],
        useCases: [
          {
            title: 'Transaction Fraud',
            description: 'Detect and prevent fraudulent transactions in real-time',
            icon: 'credit-card'
          },
          {
            title: 'Account Takeover',
            description: 'Protect against unauthorized account access',
            icon: 'user-x'
          },
          {
            title: 'Identity Theft',
            description: 'Prevent identity theft and synthetic identity fraud',
            icon: 'fingerprint'
          }
        ],
        industryStats: [
          {
            value: '60%',
            label: 'Reduction in Fraud Losses'
          },
          {
            value: '90%',
            label: 'Detection Accuracy'
          },
          {
            value: '<50ms',
            label: 'Response Time'
          }
        ]
      }
      // Add more financial solutions here
    ]
  },
  {
    id: 'healthcare',
    title: 'Healthcare',
    description: 'Innovative solutions for healthcare providers and payers',
    icon: 'heart-pulse',
    solutions: [
      {
        id: 'patient-risk-analysis',
        title: 'Patient Risk Analysis',
        description: 'AI-driven patient risk assessment and prediction',
        fullDescription: 'Comprehensive patient risk analysis platform using advanced analytics and machine learning to predict health risks and improve patient outcomes.',
        icon: 'activity',
        capabilities: [
          'Risk factor identification',
          'Predictive analytics',
          'Patient monitoring',
          'Clinical decision support'
        ],
        benefits: [
          'Early risk detection',
          'Improved patient outcomes',
          'Reduced healthcare costs',
          'Enhanced preventive care'
        ],
        features: [
          {
            title: 'Risk Prediction',
            description: 'ML-based health risk prediction models',
            icon: 'trending-up'
          },
          {
            title: 'Patient Monitoring',
            description: 'Real-time patient health monitoring',
            icon: 'activity'
          },
          {
            title: 'Clinical Analytics',
            description: 'Advanced analytics for clinical decision support',
            icon: 'bar-chart'
          }
        ],
        useCases: [
          {
            title: 'Chronic Disease Management',
            description: 'Predict and manage chronic disease progression',
            icon: 'heart'
          },
          {
            title: 'Hospital Readmission',
            description: 'Reduce hospital readmission rates',
            icon: 'hospital'
          },
          {
            title: 'Preventive Care',
            description: 'Identify patients needing preventive care',
            icon: 'shield'
          }
        ],
        industryStats: [
          {
            value: '40%',
            label: 'Reduced Readmissions'
          },
          {
            value: '85%',
            label: 'Prediction Accuracy'
          },
          {
            value: '25%',
            label: 'Cost Reduction'
          }
        ]
      }
      // Add more healthcare solutions here
    ]
  }
  // Add more industries here
];

export const getIndustryById = (id) => {
  return industries.find(industry => industry.id === id);
};

export const getAllIndustries = () => {
  return industries;
}; 