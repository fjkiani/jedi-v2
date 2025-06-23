# 📋 Hygraph Use Case Migration & Simulation Integration Guide

## Overview
This guide documents the complete data structure, GraphQL queries, and migration process for creating new use cases in Hygraph that integrate with the Interactive Simulation system.

## GraphQL Query Structure

### Primary Query: `GetUseCaseDetail`
```graphql
query GetUseCaseDetail($slug: String!) {
  useCase(where: { slug: $slug }, stage: PUBLISHED) {
    id
    title
    slug
    description
    capabilities          # Array of strings - Core functional capabilities
    queries               # Array of strings - Sample queries for the use case
    metrics              # Array of strings - Success metrics and KPIs
    implementation       # Array of strings - Implementation phases/steps
    
    industry {
      name               # Industry name (e.g., "Healthcare")
      slug               # Industry slug (e.g., "healthcare")
      description        # Industry description and context
    }
    
    technologies(first: 10) {
      id
      name               # Technology name (e.g., "Weaviate")
      slug               # Technology slug (e.g., "weaviate")
      description        # Detailed technology description
    }
    
    category {
      id
      slug               # Category slug (e.g., "continuous-learning")
      name               # Category name (e.g., "Continuous Learning")
      technologies {     # Related technologies in same category
        id
        name
        slug
        description
      }
    }
    
    industryApplication {  # Array - Related industry applications
      id
      applicationTitle   # Application title (e.g., "Agentic Personalized Learning")
      relevantEngine     # Engine type (e.g., "aiAnalysisEngine")
    }
    
    architecture {
      id
      description        # Overall architecture description
      
      components(orderBy: name_ASC) {
        id
        name             # Component name (e.g., "Medical Image Preprocessor")
        description      # Component description
        details          # Detailed component functionality
        explanation      # Array of strings - Component explanations
      }
      
      flow(orderBy: step_ASC) {
        id
        step             # Step number/identifier
        description      # Step description
        details          # Step details and specifics
      }
    }
  }
}
```

## Data Structure Mapping for Simulation

### Solution Identification
The simulation system identifies solutions using:
```javascript
const solutionName = isApplicationBased ? 
  application?.applicationTitle || 'AI Solution' : 
  useCase?.title || 'AI Solution';

const industryName = industry?.name || 'your industry';
```

### Simulation Steps Generation (9 Steps Total)
1. **Implementation Flow Activation** - Uses `capabilities`, `components.length`, `technologies.length`
2. **Success Metrics Analysis** - Uses `useCase.metrics` array
3. **Architecture Review** - Uses `architecture.components` with full details
4. **Implementation Planning** - Uses `implementation` → `architecture.flow` → defaults
5. **Workflow Analysis** - Uses `architecture.flow` with step numbers and details
6. **Technology Stack Review** - Uses `technologies` array with descriptions
7. **Capabilities Assessment** - Uses `capabilities` array
8. **Risk Assessment** - Dynamic based on complexity (tech count, component count)
9. **Final Recommendations** - Generated from real use case characteristics

### Risk Assessment Calculation
```javascript
// Technology Integration Risk
const techRiskLevel = useCase.technologies.length > 3 ? 'High' : 'Medium';

// Architecture Complexity Risk  
const archRiskLevel = useCase.architecture.components.length > 5 ? 'High' : 
                     useCase.architecture.components.length > 3 ? 'Medium' : 'Low';
```

## Migration Process for New Use Cases

### Step 1: Create Use Case in Hygraph

#### Required Fields
- **title**: Use case name (appears in simulation header)
- **slug**: URL identifier for routing
- **description**: Detailed description of the use case
- **industry**: Connect to existing industry record
- **technologies**: Connect to relevant technology records
- **category**: Connect to technology category

#### Optional Fields (Enhance Simulation Experience)
- **capabilities**: Array of core capabilities (adds Capabilities Assessment step)
- **queries**: Sample queries for Co-Pilot interaction
- **metrics**: Success metrics (adds Success Metrics Analysis step)
- **implementation**: Implementation phases (improves Implementation Planning step)

#### Example Use Case Creation
```javascript
const newUseCase = {
  title: "AI-Powered Fraud Detection System",
  slug: "ai-fraud-detection-system",
  description: "Advanced machine learning system for real-time fraud detection in financial transactions using pattern recognition and anomaly detection.",
  
  // Connect to existing records
  industry: { connect: { slug: "financial-services" } },
  technologies: { 
    connect: [
      { slug: "tensorflow" },
      { slug: "apache-kafka" },
      { slug: "elasticsearch" }
    ]
  },
  category: { connect: { slug: "machine-learning" } },
  
  // Optional enhancements
  capabilities: [
    "Real-time transaction monitoring",
    "Pattern recognition and anomaly detection",
    "Risk scoring and alert generation",
    "Adaptive learning from new fraud patterns"
  ],
  
  queries: [
    "How does the fraud detection system work?",
    "What is the accuracy of fraud detection?",
    "How quickly can the system detect fraudulent transactions?",
    "What is the implementation timeline?"
  ],
  
  metrics: [
    "Detection Accuracy: 99.2%",
    "False Positive Rate: <0.1%",
    "Processing Speed: <100ms",
    "Cost Reduction: 40%"
  ],
  
  implementation: [
    "Phase 1: Data Integration and Preprocessing",
    "Phase 2: Model Development and Training",
    "Phase 3: Real-time Processing Pipeline Setup",
    "Phase 4: Alert System Integration",
    "Phase 5: Testing and Validation",
    "Phase 6: Production Deployment"
  ]
};
```

### Step 2: Create Architecture (Critical for Rich Simulation)

The architecture provides the foundation for detailed simulation steps.

#### Architecture Structure
```javascript
const architecture = {
  description: "Real-time fraud detection architecture with streaming data processing and machine learning inference pipeline",
  
  // Components (displayed in Architecture Review step)
  components: [
    {
      name: "Transaction Stream Processor",
      description: "Ingests and processes real-time transaction data streams",
      details: "Handles high-volume transaction streams with Apache Kafka, performs initial data validation and enrichment",
      explanation: [
        "Processes 10,000+ transactions per second",
        "Enriches transaction data with historical patterns",
        "Maintains real-time data quality checks"
      ]
    },
    {
      name: "ML Inference Engine",
      description: "Applies trained fraud detection models to incoming transactions",
      details: "TensorFlow-based inference engine with ensemble models for fraud scoring",
      explanation: [
        "Uses ensemble of gradient boosting and neural networks",
        "Provides real-time fraud probability scores",
        "Adapts to new fraud patterns through continuous learning"
      ]
    },
    {
      name: "Alert Management System",
      description: "Manages fraud alerts and investigation workflows",
      details: "Prioritizes alerts based on risk scores and manages investigation workflows",
      explanation: [
        "Prioritizes alerts by risk level and impact",
        "Integrates with existing case management systems",
        "Provides investigation tools and evidence collection"
      ]
    }
  ],
  
  // Flow steps (displayed in Workflow Analysis step, used as implementation fallback)
  flow: [
    {
      step: "Transaction Ingestion",
      description: "Real-time transaction data is captured from payment systems",
      details: "Secure API integration with payment processors, data validation and normalization"
    },
    {
      step: "Feature Engineering",
      description: "Extract relevant features for fraud detection analysis",
      details: "Generate behavioral patterns, transaction velocity, geographic analysis, and merchant risk factors"
    },
    {
      step: "ML Model Inference",
      description: "Apply trained models to generate fraud probability scores",
      details: "Ensemble model prediction combining multiple algorithms for optimal accuracy"
    },
    {
      step: "Risk Assessment",
      description: "Evaluate overall transaction risk based on multiple factors",
      details: "Combine ML scores with rule-based checks and historical data analysis"
    },
    {
      step: "Alert Generation",
      description: "Generate alerts for high-risk transactions requiring investigation",
      details: "Prioritize alerts based on risk level, transaction amount, and customer profile"
    },
    {
      step: "Investigation Support",
      description: "Provide investigation tools and evidence for fraud analysts",
      details: "Present transaction history, pattern analysis, and supporting evidence for decision making"
    }
  ]
};
```

### Step 3: Connect Industry Applications (Optional)

Link the use case to broader industry applications for enhanced context.

```javascript
const industryApplications = [
  {
    applicationTitle: "Financial Risk Management Platform",
    relevantEngine: "riskAnalysisEngine"
  },
  {
    applicationTitle: "Real-time Transaction Monitoring",
    relevantEngine: "streamProcessingEngine"
  }
];
```

## Simulation Enhancement Levels

### Level 1: Basic Simulation (6 Steps)
**Required Data**: Title + Industry + Technologies
- Implementation Flow Activation
- Architecture Review (generic)
- Implementation Planning (generic phases)
- Risk Assessment (basic)
- Final Recommendations
- Consultation CTA

### Level 2: Enhanced Simulation (7-8 Steps)
**Additional Data**: + Architecture (components + flow)
- All Level 1 steps
- Detailed Architecture Review (real components)
- Workflow Analysis (real flow steps)
- Enhanced risk assessment based on architecture complexity

### Level 3: Complete Simulation (9 Steps)
**Additional Data**: + Capabilities + Metrics + Implementation
- All Level 2 steps
- Success Metrics Analysis (real metrics)
- Capabilities Assessment (real capabilities)
- Custom Implementation Planning (real implementation phases)
- Comprehensive risk and recommendation analysis

## Testing New Use Cases

### 1. Verify GraphQL Response
Test the query in Hygraph GraphQL playground:
```graphql
query GetUseCaseDetail($slug: String!) {
  useCase(where: { slug: "your-new-use-case-slug" }, stage: PUBLISHED) {
    # ... full query structure
  }
}
```

### 2. Test Frontend Integration
1. Navigate to: `/industries/[industry-slug]/solutions/[use-case-slug]`
2. Interact with Co-Pilot queries
3. Click "🚀 Run Implementation Simulation" 
4. Verify all expected steps appear with real data
5. Complete simulation to test consultation CTAs

### 3. Validate Lead Capture Integration
- Complete simulation to final step
- Verify "📅 Book Implementation Consultation" button appears
- Test consultation booking CTA functionality
- Check completion state CTAs:
  - "📅 Schedule Free Implementation Consultation"
  - "💰 Get Custom ROI Analysis"

## Example: Medical Image Classification (Real Data)

```json
{
  "title": "Medical Image Classification",
  "slug": "medical-image-classification",
  "description": "Using Weaviate vector search capabilities combined with a classification model to analyze and categorize medical images (e.g., X-rays, CT scans) for detecting anomalies like pneumonia or tumors.",
  "industry": {
    "name": "Healthcare",
    "slug": "healthcare",
    "description": "Utilizing AI for enhanced diagnostics, personalized treatment plans, and streamlined healthcare operations."
  },
  "technologies": [
    {
      "name": "Weaviate",
      "slug": "weaviate",
      "description": "Open-source vector database that enables semantic search and AI-powered applications..."
    }
  ],
  "category": {
    "name": "Continuous Learning",
    "slug": "continuous-learning"
  },
  "architecture": {
    "description": "A pipeline involving DICOM/image data ingestion, preprocessing, feature extraction using deep learning models, vector storage in Weaviate, and classification inference.",
    "components": [
      {
        "name": "Medical Image Preprocessor & Feature Extractor",
        "description": "Loads images, performs normalization, augmentation, and extracts meaningful features using pre-trained CNNs",
        "details": "Handles various input formats (DICOM, PNG, JPG), applies medical imaging preprocessing techniques",
        "explanation": ["Prepares images and converts them into feature vectors suitable for classification"]
      }
    ],
    "flow": [
      {
        "step": "Image Acquisition",
        "description": "Medical image is acquired from the source system",
        "details": "Input: DICOM, PNG, JPG etc."
      }
    ]
  }
}
```

## Consultation Integration

The simulation system includes integrated consultation booking:

### Consultation CTAs
- **During Simulation**: "📅 Book Implementation Consultation" button appears on final step
- **Completion State**: Multiple CTAs with celebration animation:
  - "📅 Schedule Free Implementation Consultation"
  - "💰 Get Custom ROI Analysis"

### Lead Capture Integration
Uses existing lead capture system with context:
```javascript
onSuggestedQuery(`LEAD_CAPTURE:consultation:${useCase.title} implementation consultation`);
```

## Future Enhancement Opportunities

1. **Dynamic Step Generation**: Add more step types based on available data
2. **Industry-Specific Steps**: Custom steps for different industries  
3. **Technology-Specific Analysis**: Deep-dive steps for specific tech stacks
4. **Integration Complexity**: Steps based on number of connected systems
5. **Compliance Steps**: Automatic compliance analysis for regulated industries

## Best Practices

1. **Rich Architecture Data**: Always include detailed components and flow for best simulation experience
2. **Meaningful Capabilities**: Use specific, actionable capabilities rather than generic descriptions
3. **Realistic Metrics**: Include achievable, industry-standard metrics
4. **Detailed Implementation**: Break down implementation into logical, sequential phases
5. **Technology Relevance**: Ensure connected technologies are actually used in the solution
6. **Industry Alignment**: Verify the use case aligns with the connected industry's focus areas

---

*This guide ensures consistent, high-quality use case creation that integrates seamlessly with the Interactive Simulation system and provides valuable user experiences.* 