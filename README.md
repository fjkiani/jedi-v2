# Agency V3

Agency V3 is a modern web application built with Vite.js and React, showcasing a digital agency's services and portfolio.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Code Architecture](#code-architecture)
- [Adding New Use Cases](#adding-new-use-cases)
- [Contributing](#contributing)
- [License](#license)

## Features

- Responsive design for various screen sizes
- Fast development and build times with Vite.js
- Custom animations and transitions
- Contact form functionality

## Technologies Used

- **Vite.js**: Next-generation frontend tooling for faster development
- **React**: JavaScript library for building user interfaces
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Framer Motion**: Animation library for React
- **Stripe**: Payment processing integration
- **TypeScript**: Typed superset of JavaScript for improved development experience
- **Hygraph**: A headless CMS that provides a GraphQL API for content management and delivery, enabling flexible content modeling and integration

## Getting Started

To run this project locally, follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/fjkiani/agency-v3.git

# Adding New Use Cases with Hygraph

This guide explains how to add new use cases to the application using Hygraph CMS. For use cases, we need to create a new industry, then create components, flow steps, architecture, and finally the use case.

## Schema Setup in Hygraph

### 1. Models Required
- **Component**
  - `name` (Single line text)
  - `description` (Multi line text)
  - `technologies` (List - Single line text)
  - `details` (Multi line text)
  - `explanation` (Multi line text)

- **FlowStep**
  - `step` (Single line text)
  - `description` (Multi line text)
  - `details` (Multi line text)

- **Architecture**
  - `description` (Multi line text)
  - `components` (Relation - Multiple Components)
  - `flow` (Relation - Multiple FlowSteps)

- **UseCase**
  - `title` (Single line text)
  - `industry` (Relation - Single Industry)
  - `section` (Single line text)
  - `description` (Multi line text)
  - `queries` (List - Single line text)
  - `capabilities` (List - Single line text)
  - `architecture` (Relation - Single Architecture)

- **Industry**
  - `name` (Single line text)
  - `slug` (Single line text)
  - `sections` (List - Single line text)

## Adding a New Use Case

### 1. Create Industry (if new)
1. Go to Content tab in Hygraph
2. Create new Industry entry
3. Fill in:
   - name (e.g., "Healthcare")
   - slug (e.g., "healthcare")
   - sections (e.g., ["diagnostic-ai", "fundamentals"])

### 2. Create Components
1. Create entries for each component
2. Example component:
   ```json
   {
     "name": "Medical Image Analysis Engine",
     "description": "Advanced image processing system...",
     "technologies": ["tensorflow", "pytorch", "monai"],
     "details": "Processes medical images with 99% accuracy...",
     "explanation": [
       "Analyzes multiple imaging modalities",
       "Detects anomalies and potential concerns"
     ]
   }
   ```

### 3. Create Flow Steps
1. Create entries for each step in the process
2. Example flow step:
   ```json
   {
     "step": "Data Collection",
     "description": "Gather patient data from multiple sources",
     "details": "Integrates with EMR systems, imaging databases..."
   }
   ```

### 4. Create Architecture
1. Create new Architecture entry
2. Link to components and flow steps
3. Add description
4. Example:
   ```json
   {
     "description": "Our medical diagnostic system leverages...",
     "components": [Link to components created above],
     "flow": [Link to flow steps created above]
   }
   ```

### 5. Create Use Case
1. Create new UseCase entry
2. Fill in all fields:
   <!-- ```json
   {
     "title": "AI-Powered Medical Diagnostics",
     "industry": [Link to Industry],
     "section": "fundamentals",
     "description": "Advanced diagnostic system using...",
     "queries": [
       "Analyze medical imaging for diagnosis",
       "Process clinical data for patient assessment"
     ],
     "capabilities": [
       "Generate diagnostic recommendations",
       "Clinical Processing"
     ],
     "architecture": [Link to Architecture]
   } -->
   ```

### 6. Publish
- Make sure to publish all created entries
- Check relationships are correctly established

## Authentication

### Setting up API Access
1. Go to Project Settings in Hygraph
2. Navigate to API Access
3. Create a new Permanent Auth Token
4. Select required permissions:
   - `Query content`
   - `View content`
5. Copy the token
6. Update `.env` file:
   ```
   VITE_HYGRAPH_ENDPOINT='your-hygraph-endpoint'
   VITE_HYGRAPH_TOKEN='your-token'
   ```

## Testing
1. Navigate to your industry page (e.g., `/industries/healthcare`)
2. Verify:
   - Queries are displayed correctly
   - Clicking queries works
   - Architecture and components are shown
   - Flow steps are visible

## Troubleshooting
- Check console for any GraphQL errors
- Verify all relationships are properly linked
- Ensure all content is published
- Confirm API permissions are set correctly
- Validate environment variables are properly set

## Notes
- Keep model names consistent with API IDs
- Maintain clear naming conventions for sections
- Always publish changes after editing
- Test queries before publishing

## Code Architecture

### High-Level Overview

The application uses a service-based architecture to manage use cases and industry data:

1. **Data Flow**
   ```
   Hygraph CMS → GraphQL Queries → Services → React Components → UI
   ```

2. **Key Components**
   - `IndustryHero`: Main component for displaying industry use cases
   - `OverviewTab`: Displays use case queries and responses
   - `ArchitectureTab`: Shows technical architecture
   - `MetricsTab`: Displays performance metrics

3. **Services Layer**
   - `useCaseService.js`: Manages use case data and caching
     ```javascript
     // Fetches and caches use cases from Hygraph
     class UseCaseService {
       // Stores use cases by industry and section
       useCases = new Map();
       // Stores industry data
       industries = new Map();
       
       // Fetches and organizes data from Hygraph
       async initialize() {...}
       
       // Gets queries for specific industry/section
       async getQueries(industrySlug, section) {...}
       
       // Gets implementation details for a query
       async getImplementation(industrySlug, section, query) {...}
     }
     ```

4. **GraphQL Integration**
   - `queries/useCases.js`: Contains GraphQL queries
     ```javascript
     // Example query structure
     export const GET_USE_CASES = `
       query {
         useCaseS {
           id
           title
           industry {...}
           queries
           architecture {...}
         }
       }
     `;
     ```

5. **State Management**
   - Uses React's built-in state management
   - Caches data in service layer
   - Component-level state for UI interactions

6. **Data Flow Example**
   ```
   1. User visits /industries/healthcare
   2. IndustryHero component mounts
   3. useEffect triggers data fetch
   4. useCaseService fetches from Hygraph
   5. Data is cached in service
   6. Components receive and display data
   ```

7. **Key Features**
   - Lazy loading of use case data
   - Caching to prevent redundant fetches
   - Real-time query execution
   - Dynamic content updates

8. **Component Hierarchy**
   ```
   IndustryHero
   ├── BreadcrumbNav
   ├── IndustryHeader
   ├── SectionNavigation
   └── TabContent
       ├── OverviewTab
       ├── ArchitectureTab
       ├── DeploymentTab
       └── MetricsTab
   ```

9. **Error Handling**
   - Service layer catches and processes errors
   - Components display appropriate error states
   - Console logging for debugging

10. **Environment Configuration**
    - Uses Vite environment variables
    - Separate configs for development/production
    - Secure storage of API credentials


{
  technology(where: { slug: "gpt-4" }) {
    id
    name
    slug
    description
    icon
    category {
      id
    }
    subcategories {
      id
    }
    useCases {
      id
      title
      description
    }
  }
}


{
  useCase(where: { id: "cm5corv2f3b4j07mz6ajljqfx" }) {
    id
    title
    description
    queries
    capabilities
    architecture {
      description
      components {
        name
        description
        details
        explanation
      }
      flow {
        step
        description
        details
      }
    }
    metrics
    implementation
    technologies {
      name
      slug
      icon
    }
  }
}


mutation {
  updateAutomation: updateCategory(
    where: { slug: "automation" }
    data: {
      technologies: {
        create: [
          { 
            name: "Bayesian Networks for Decision Making"
            slug: "bayesian-networks-decision"
            icon: "https://cdn.simpleicons.org/bayes"
            description: "Probabilistic graphical models that combine Bayesian networks with decision theory for optimal decision-making."
            priority: 11
          }
          { 
            name: "Markov Processes"
            slug: "markov-processes-ai"
            icon: "https://cdn.simpleicons.org/markov"
            description: "Mathematical framework for modeling decision-making in situations where outcomes are partly random and partly under control."
            priority: 12
          }
          { 
            name: "Game Theory Optimization"
            slug: "game-theory-optimization"
            icon: "https://cdn.simpleicons.org/game"
            description: "Mathematical models of strategic interaction between rational decision-makers."
            priority: 13
          }
        ]
      }
    }
  ) {
    name
    technologies { name priority }
  }
  
  updateAIAgents: updateCategory(
    where: { slug: "ai-agents" }
    data: {
      technologies: {
        create: [
          { 
            name: "RESTful Services Integration"
            slug: "restful-services-integration"
            icon: "https://cdn.simpleicons.org/api"
            description: "RESTful web services for standardized client-server communication in AI systems."
            priority: 11
          }
          { 
            name: "GraphQL Integration"
            slug: "graphql-integration-systems"
            icon: "https://cdn.simpleicons.org/graphql"
            description: "Query language and runtime for precise data fetching in AI applications."
            priority: 12
          }
          { 
            name: "Service Mesh for AI"
            slug: "service-mesh-ai"
            icon: "https://cdn.simpleicons.org/istio"
            description: "Infrastructure layer for facilitating AI service-to-service communications."
            priority: 13
          }
        ]
      }
    }
  ) {
    name
    technologies { name priority }
  }
}


mutation CreateLoggingTechnologies {
  createELKStack: createTechnology(data: {
    name: "ELK Stack"
    slug: "elk-stack"
    description: "Elasticsearch, Logstash, and Kibana stack for log management and analytics."
    icon: "https://cdn.simpleicons.org/elastic"
    priority: 4
    category: {
      connect: [
        { id: "cm5byr71jqii207mv6ch2mnur" },  # AI Agents
        { id: "cm5bep4cuhf0v07lq9ehqrv1k" }   # Automation
      ]
    }
  }) {
    name
    category {
      name
    }
  }
  
  createSplunk: createTechnology(data: {
    name: "Splunk"
    slug: "splunk"
    description: "Platform for searching, monitoring, and analyzing machine-generated data."
    icon: "https://cdn.simpleicons.org/splunk"
    priority: 5
    category: {
      connect: [
        { id: "cm5byr71jqii207mv6ch2mnur" },
        { id: "cm5bep4cuhf0v07lq9ehqrv1k" }
      ]
    }
  }) {
    name
    category {
      name
    }
  }
  
  createDatadog: createTechnology(data: {
    name: "Datadog"
    slug: "datadog"
    description: "Monitoring and analytics platform for cloud-scale applications."
    icon: "https://cdn.simpleicons.org/datadog"
    priority: 6
    category: {
      connect: [
        { id: "cm5byr71jqii207mv6ch2mnur" },
        { id: "cm5bep4cuhf0v07lq9ehqrv1k" }
      ]
    }
  }) {
    name
    category {
      name
    }
  }
}


mutation AddWebhooksAndTrigger {
  createWebhooks: createTechnology(data: {
    name: "Webhooks"
    slug: "webhooks"
    description: "HTTP callbacks for real-time data integration and event-driven architecture."
    icon: "https://cdn.simpleicons.org/webhook"
    priority: 5
    category: {
      connect: { id: "cm5byr71jqii207mv6ch2mnur" }
    }
  }) {
    id
    name
    description
  }
  
  createTriggerIO: createTechnology(data: {
    name: "Trigger.io"
    slug: "trigger-io"
    description: "Event-driven integration platform for connecting modern cloud services."
    icon: "https://cdn.simpleicons.org/trigger"
    priority: 6
    category: {
      connect: { id: "cm5byr71jqii207mv6ch2mnur" }
    }
  }) {
    id
    name
    description
  }
}

mutation CreateNLPTechnologies {
  createTechnology: createTechnology(data: {
    name: "NLTK"
    description: "Platform for building Python programs to work with human language data."
    category: {
      connect: [
        { id: "cm5bxqt9spkvw07mv3y42z7f4" }  # NLP/NLU category ID
      ]
    }
  }) {
    id
    name
    description
    category {
      name
    }
  }
  
  createDialogflow: createTechnology(data: {
    name: "Dialogflow"
    description: "Google's conversational AI development suite."
    category: {
      connect: [
        { id: "cm5bxqt9spkvw07mv3y42z7f4" }  # NLP/NLU category ID
      ]
    }
  }) {
    id
    name
    description
    category {
      name
    }
  }
  
  createRasa: createTechnology(data: {
    name: "Rasa"
    description: "Open-source framework for building conversational AI."
    category: {
      connect: [
        { id: "cm5bxqt9spkvw07mv3y42z7f4" }  # NLP/NLU category ID
      ]
    }
  }) {
    id
    name
    description
    category {
      name
    }
  }
}


mutation CreateAIAgentEcosystem {
  # Create Categories
  createAgentCore: createCategory(data: {
    name: "Agent Core"
    slug: "agent-core"
  }) {
    id
    name
  }
  
  createReasoning: createCategory(data: {
    name: "Reasoning"
    slug: "reasoning"
  }) {
    id
    name
  }
  
  createMemory: createCategory(data: {
    name: "Memory"
    slug: "memory"
  }) {
    id
    name
  }
  
  # Create Agent Core Technologies
  createLangChain: createTechnology(data: {
    name: "LangChain"
    description: "Framework for building applications powered by language models."
    category: {
      connect: [
        { slug: "agent-core" }
      ]
    }
  }) {
    id
    name
  }
  
  createOpenAIFunctions: createTechnology(data: {
    name: "OpenAI Functions"
    description: "OpenAI's interface for integrating language models with external functions."
    category: {
      connect: [
        { slug: "agent-core" }
      ]
    }
  }) {
    id
    name
  }
  
  # Create Reasoning Technologies
  createReAct: createTechnology(data: {
    name: "ReAct"
    description: "Reasoning and Acting in language models"
    category: {
      connect: [
        { slug: "reasoning" }
      ]
    }
  }) {
    id
    name
  }
  
  createCoT: createTechnology(data: {
    name: "Chain-of-thought (CoT)"
    description: "Step-by-step reasoning approach for language models"
    category: {
      connect: [
        { slug: "reasoning" }
      ]
    }
  }) {
    id
    name
  }
  
  # Create Memory Technologies
  createVectorDB: createTechnology(data: {
    name: "Vector Databases"
    description: "Databases optimized for storing and retrieving vector embeddings"
    category: {
      connect: [
        { slug: "memory" }
      ]
    }
  }) {
    id
    name
  }
  
  createKnowledgeGraphs: createTechnology(data: {
    name: "Knowledge Graphs"
    description: "Graph-based knowledge representation for AI systems"
    category: {
      connect: [
        { slug: "memory" }
      ]
    }
  }) {
    id
    name
  }
}

mutation CreateAIAgentEcosystem {
  # Create Categories
  createAgentCore: createCategory(data: {
    name: "Agent Core"
    slug: "agent-core"
  }) {
    id
    name
  }
  
  createReasoning: createCategory(data: {
    name: "Reasoning"
    slug: "reasoning"
  }) {
    id
    name
  }
  
  createMemory: createCategory(data: {
    name: "Memory"
    slug: "memory"
  }) {
    id
    name
  }
  
  # Create Agent Core Technologies
  createLangChain: createTechnology(data: {
    name: "LangChain"
    description: "Framework for building applications powered by language models."
    category: {
      connect: [
        { slug: "agent-core" }
      ]
    }
  }) {
    id
    name
  }
  
  createOpenAIFunctions: createTechnology(data: {
    name: "OpenAI Functions"
    description: "OpenAI's interface for integrating language models with external functions."
    category: {
      connect: [
        { slug: "agent-core" }
      ]
    }
  }) {
    id
    name
  }
  
  # Create Reasoning Technologies
  createReAct: createTechnology(data: {
    name: "ReAct"
    description: "Reasoning and Acting in language models"
    category: {
      connect: [
        { slug: "reasoning" }
      ]
    }
  }) {
    id
    name
  }
  
  createCoT: createTechnology(data: {
    name: "Chain-of-thought (CoT)"
    description: "Step-by-step reasoning approach for language models"
    category: {
      connect: [
        { slug: "reasoning" }
      ]
    }
  }) {
    id
    name
  }
  
  # Create Memory Technologies
  createVectorDB: createTechnology(data: {
    name: "Vector Databases"
    description: "Databases optimized for storing and retrieving vector embeddings"
    category: {
      connect: [
        { slug: "memory" }
      ]
    }
  }) {
    id
    name
  }
  
  createKnowledgeGraphs: createTechnology(data: {
    name: "Knowledge Graphs"
    description: "Graph-based knowledge representation for AI systems"
    category: {
      connect: [
        { slug: "memory" }
      ]
    }
  }) {
    id
    name
  }
}

query VerifyAIAgentEcosystem {
  # Get all categories
  categories(where: {
    slug_in: ["agent-core", "reasoning", "memory"]
  }) {
    name
    slug
    technologies {
      name
      description
      category {
        name
      }
    }
  }
}

mutation CreateAIAgentEcosystem {
  # Create main AI Agents category if it doesn't exist
  createAIAgentsCategory: createCategory(data: {
    name: "AI Agents"
    slug: "ai-agents"
  }) {
    id
    name
  }
  
  # Create subcategories under AI Agents
  createAgentCoreSubcat: createTechnologySubcategory(data: {
    name: "Agent Core"
    technology: {
      create: [
        {
          name: "LangChain"
          slug: "langchain"
          description: "Framework for building applications powered by language models."
          icon: "https://cdn.simpleicons.org/langchain"
          priority: 1
          category: {
            connect: [{ slug: "ai-agents" }]
          }
        },
        {
          name: "OpenAI Functions"
          slug: "openai-functions"
          description: "OpenAI's interface for integrating language models with external functions."
          icon: "https://cdn.simpleicons.org/openai"
          priority: 2
          category: {
            connect: [{ slug: "ai-agents" }]
          }
        },
        {
          name: "AutoGPT"
          slug: "autogpt"
          description: "Experimental open-source application showcasing the capabilities of GPT-4."
          icon: "https://cdn.simpleicons.org/autogpt"
          priority: 3
          category: {
            connect: [{ slug: "ai-agents" }]
          }
        },
        {
          name: "BabyAGI"
          slug: "babyagi"
          description: "Python script that uses GPT-4 to autonomously develop and manage tasks."
          icon: "https://cdn.simpleicons.org/artificialintelligence"
          priority: 4
          category: {
            connect: [{ slug: "ai-agents" }]
          }
        }
      ]
    }
  }) {
    id
    name
    technology {
      name
      slug
      priority
    }
  }
  
  createReasoningSubcat: createTechnologySubcategory(data: {
    name: "Reasoning"
    technology: {
      create: [
        {
          name: "ReAct"
          slug: "react"
          description: "Reasoning and Acting in language models"
          icon: "https://cdn.simpleicons.org/artificialintelligence"
          priority: 1
          category: {
            connect: [{ slug: "ai-agents" }]
          }
        },
        {
          name: "Chain-of-thought (CoT)"
          slug: "chain-of-thought"
          description: "Step-by-step reasoning approach for language models"
          icon: "https://cdn.simpleicons.org/artificialintelligence"
          priority: 2
          category: {
            connect: [{ slug: "ai-agents" }]
          }
        },
        {
          name: "Self-Reflective Models"
          slug: "self-reflective-models"
          description: "Models capable of evaluating their own outputs and reasoning"
          icon: "https://cdn.simpleicons.org/artificialintelligence"
          priority: 3
          category: {
            connect: [{ slug: "ai-agents" }]
          }
        }
      ]
    }
  }) {
    id
    name
    technology {
      name
      slug
      priority
    }
  }
  
  createMemorySubcat: createTechnologySubcategory(data: {
    name: "Memory"
    technology: {
      create: [
        {
          name: "Vector Databases"
          slug: "vector-databases"
          description: "Databases optimized for storing and retrieving vector embeddings"
          icon: "https://cdn.simpleicons.org/database"
          priority: 1
          category: {
            connect: [{ slug: "ai-agents" }]
          }
        },
        {
          name: "Knowledge Graphs"
          slug: "knowledge-graphs"
          description: "Graph-based knowledge representation for AI systems"
          icon: "https://cdn.simpleicons.org/neo4j"
          priority: 2
          category: {
            connect: [{ slug: "ai-agents" }]
          }
        }
      ]
    }
  }) {
    id
    name
    technology {
      name
      slug
      priority
    }
  }
}

mutation UpdateSingleTechnology {
  updateTechnology(
    where: { slug: "langchain" }
    data: {
      category: {
        connect: { where: { name: "AI Agents" } }
      }
    }
  ) {
    name
    category {
      name
    }
  }
}

query VerifyAIAgentSubcategories {
  technologySubcategories(where: { 
    name_in: ["Agent Core", "Reasoning", "Memory"]
  }) {
    name
    technology {
      name
      description
      priority
    }
  }
}

{
  "data": {
    "createDataProtection": {
      "name": "Data Protection",
      "technology": [
        {
          "name": "Encryption",
          "description": "Data protection through cryptographic algorithms and protocols.",
          "priority": 1
        },
        {
          "name": "Anonymization",
          "description": "Techniques for removing personally identifiable information from data.",
          "priority": 2
        },
        {
          "name": "Data Masking",
          "description": "Protecting sensitive data by obscuring specific parts while maintaining format.",
          "priority": 3
        }
      ]
    },
    "createCompliance": {
      "name": "Compliance",
      "technology": [
        {
          "name": "GDPR",
          "description": "European Union's General Data Protection Regulation for data privacy and protection.",
          "priority": 4
        },
        {
          "name": "HIPAA",
          "description": "Health Insurance Portability and Accountability Act for medical data protection.",
          "priority": 5
        },
        {
          "name": "ISO 27001",
          "description": "International standard for information security management systems.",
          "priority": 6
        }
      ]
    },
    "createAuthentication": {
      "name": "Authentication",
      "technology": [
        {
          "name": "OAuth2",
          "description": "Industry-standard protocol for authorization.",
          "priority": 1
        },
        {
          "name": "Multi-factor Authentication",
          "description": "Security system requiring multiple methods of authentication for access.",
          "priority": 7
        }
      ]
    },
    "createAuthorization": {
      "name": "Authorization",
      "technology": [
        {
          "name": "RBAC",
          "description": "Role-Based Access Control for managing permissions based on user roles.",
          "priority": 8
        },
        {
          "name": "ABAC",
          "description": "Attribute-Based Access Control for dynamic, context-aware authorization.",
          "priority": 9
        }
      ]
    }
  }
}


mutation CreateToolIntegrationSubcategory {
  createToolIntegration: createTechnologySubcategory(data: {
    name: "Tool Integration"
    technology: {
      connect: [
        { slug: "zapier" },
        { slug: "aws-lambda" },
        { slug: "ifttt" },
        { slug: "power-automate" }
      ]
    }
  }) {
    id
    name
    technology {
      name
      description
      priority
    }
  }
}

mutation CreateVectorDBs {
  createPinecone: createTechnology(data: {
    name: "Pinecone"
    slug: "pinecone"
    description: "Vector database for high-performance vector search."
    icon: "https://cdn.simpleicons.org/pinecone"
    priority: 1
    category: {
      connect: { id: "cm5byr71jqii207mv6ch2mnur" }
    }
  }) {
    name
    description
  }
  
  createWeaviate: createTechnology(data: {
    name: "Weaviate"
    slug: "weaviate"
    description: "Open-source vector search engine and vector DB."
    icon: "https://cdn.simpleicons.org/weaviate"
    priority: 2
    category: {
      connect: { id: "cm5byr71jqii207mv6ch2mnur" }
    }
  }) {
    name
    description
  }
  
  createFAISS: createTechnology(data: {
    name: "FAISS"
    slug: "faiss"
    description: "Facebook AI Similarity Search for efficient similarity search and clustering of dense vectors."
    icon: "https://cdn.simpleicons.org/meta"
    priority: 3
    category: {
      connect: { id: "cm5byr71jqii207mv6ch2mnur" }
    }
  }) {
    name
    description
  }
  
  createChromaDB: createTechnology(data: {
    name: "ChromaDB"
    slug: "chromadb"
    description: "Open-source embedding database designed for AI applications."
    icon: "https://cdn.simpleicons.org/database"
    priority: 4
    category: {
      connect: { id: "cm5byr71jqii207mv6ch2mnur" }
    }
  }) {
    name
    description
  }
}

mutation CreateTaskPlanningTechnologies {
  # Planning Algorithms
  createTreeOfThoughts: createTechnology(data: {
    name: "Tree of Thoughts"
    slug: "tree-of-thoughts"
    description: "Advanced reasoning framework for systematic exploration of thought processes."
    icon: "https://cdn.simpleicons.org/artificialintelligence"
    priority: 1
    category: {
      connect: { id: "cm5byr71jqii207mv6ch2mnur" }  # AI Agents
    }
  }) {
    name
    category {
      name
    }
  }
  
  createMCTS: createTechnology(data: {
    name: "Monte Carlo Tree Search"
    slug: "mcts"
    description: "Search algorithm for finding optimal decisions in decision processes."
    icon: "https://cdn.simpleicons.org/artificialintelligence"
    priority: 2
    category: {
      connect: { id: "cm5byr71jqii207mv6ch2mnur" }
    }
  }) {
    name
    category {
      name
    }
  }
  
  createAStarSearch: createTechnology(data: {
    name: "A* Search"
    slug: "a-star-search"
    description: "Path finding and graph traversal algorithm using heuristic estimation."
    icon: "https://cdn.simpleicons.org/artificialintelligence"
    priority: 3
    category: {
      connect: { id: "cm5byr71jqii207mv6ch2mnur" }
    }
  }) {
    name
    category {
      name
    }
  }
  
  createHTN: createTechnology(data: {
    name: "Hierarchical Task Networks"
    slug: "htn"
    description: "Planning methodology that creates plans by task decomposition."
    icon: "https://cdn.simpleicons.org/artificialintelligence"
    priority: 4
    category: {
      connect: { id: "cm5byr71jqii207mv6ch2mnur" }
    }
  }) {
    name
    category {
      name
    }
  }
}


mutation CreateObservabilityTechnologies {
  createPrometheus: createTechnology(data: {
    name: "Prometheus"
    slug: "prometheus"
    description: "Open-source monitoring and alerting toolkit for cloud-native applications."
    icon: "https://cdn.simpleicons.org/prometheus"
    priority: 1
    category: {
      connect: [
        { id: "cm5byr71jqii207mv6ch2mnur" },  # AI Agents
        { id: "cm5bep4cuhf0v07lq9ehqrv1k" }   # Automation (for monitoring automation)
      ]
    }
  }) {
    name
    category {
      name
    }
  }
  
  createGrafana: createTechnology(data: {
    name: "Grafana"
    slug: "grafana"
    description: "Multi-platform analytics and interactive visualization platform."
    icon: "https://cdn.simpleicons.org/grafana"
    priority: 2
    category: {
      connect: [
        { id: "cm5byr71jqii207mv6ch2mnur" },
        { id: "cm5bep4cuhf0v07lq9ehqrv1k" }
      ]
    }
  }) {
    name
    category {
      name
    }
  }
  
  createOpenTelemetry: createTechnology(data: {
    name: "OpenTelemetry"
    slug: "opentelemetry"
    description: "Observability framework for cloud-native software."
    icon: "https://cdn.simpleicons.org/opentelemetry"
    priority: 3
    category: {
      connect: [
        { id: "cm5byr71jqii207mv6ch2mnur" },
        { id: "cm5bep4cuhf0v07lq9ehqrv1k" }
      ]
    }
  }) {
    name
    category {
      name
    }
  }
}


mutation {
  createCapabilities: createCategory(
    data: {
      name: "AI Agent Capabilities"
      slug: "ai-agent-capabilities"
      technologies: {
        create: [
          { 
            name: "Autonomous Decision Making"
            slug: "autonomous-decision-making"
            icon: "https://cdn.simpleicons.org/brain"
            description: "Autonomous decision-making and problem-solving capabilities for AI agents."
            priority: 1 
          }
          { 
            name: "API Integration"
            slug: "api-integration"
            icon: "https://cdn.simpleicons.org/api"
            description: "Integration with APIs, tools, and third-party services."
            priority: 2
          }
          { 
            name: "Task Planning"
            slug: "task-planning"
            icon: "https://cdn.simpleicons.org/task"
            description: "Multi-step task planning and execution capabilities."
            priority: 3
          }
          { 
            name: "Continuous Learning"
            slug: "continuous-learning"
            icon: "https://cdn.simpleicons.org/learn"
            description: "Continuous learning and self-improvement through AI/ML algorithms."
            priority: 4
          }
          { 
            name: "NLU & Generation"
            slug: "nlu-generation"
            icon: "https://cdn.simpleicons.org/nlp"
            description: "Natural Language Understanding and Generation capabilities."
            priority: 5
          }
          { 
            name: "Contextual Awareness"
            slug: "contextual-awareness"
            icon: "https://cdn.simpleicons.org/context"
            description: "Contextual awareness and memory management capabilities."
            priority: 6
          }
        ]
      }
    }
  ) {
    name
    technologies { name priority }
  }
  
  createUseCases: createCategory(
    data: {
      name: "AI Agent Use Cases"
      slug: "ai-agent-use-cases"
      technologies: {
        create: [
          { 
            name: "Research Assistant"
            slug: "research-assistant"
            icon: "https://cdn.simpleicons.org/research"
            description: "Automated research assistance and information gathering."
            priority: 1 
          }
          { 
            name: "Customer Service"
            slug: "customer-service"
            icon: "https://cdn.simpleicons.org/customerservice"
            description: "AI-powered customer service and support automation."
            priority: 2
          }
          { 
            name: "Data Analysis"
            slug: "data-analysis"
            icon: "https://cdn.simpleicons.org/analytics"
            description: "Automated data analysis and insights generation."
            priority: 3
          }
          { 
            name: "DevOps Automation"
            slug: "devops-automation"
            icon: "https://cdn.simpleicons.org/devops"
            description: "Automation of DevOps processes and workflows."
            priority: 4
          }
          { 
            name: "Financial Advisory"
            slug: "financial-advisory"
            icon: "https://cdn.simpleicons.org/finance"
            description: "AI-powered financial advice and analysis."
            priority: 5
          }
          { 
            name: "Healthcare Assistant"
            slug: "healthcare-assistant"
            icon: "https://cdn.simpleicons.org/healthcare"
            description: "Virtual assistance in healthcare contexts."
            priority: 6
          }
          { 
            name: "Supply Chain Optimization"
            slug: "supply-chain-optimization"
            icon: "https://cdn.simpleicons.org/supplychain"
            description: "AI-driven supply chain optimization and management."
            priority: 7
          }
          { 
            name: "Cybersecurity Monitoring"
            slug: "cybersecurity-monitoring"
            icon: "https://cdn.simpleicons.org/security"
            description: "Automated cybersecurity monitoring and threat detection."
            priority: 8
          }
          { 
            name: "Marketing Automation"
            slug: "marketing-automation"
            icon: "https://cdn.simpleicons.org/marketing"
            description: "Personalized marketing automation and campaign management."
            priority: 9
          }
          { 
            name: "Legal Document Analysis"
            slug: "legal-document-analysis"
            icon: "https://cdn.simpleicons.org/legal"
            description: "AI-powered legal document analysis and processing."
            priority: 10
          }
        ]
      }
    }
  ) {
    name
    technologies { name priority }
  }
}

{
  "data": {
    "updateTaskPlanning": {
      "name": "Task Planning",
      "technologies": [
        {
          "name": "Task Decomposition Engine",
          "slug": "task-decomposition-engine",
          "priority": 1
        },
        {
          "name": "Dynamic Task Scheduler",
          "slug": "dynamic-task-scheduler",
          "priority": 2
        },
        {
          "name": "Goal-Oriented Planning",
          "slug": "goal-oriented-planning",
          "priority": 3
        },
        {
          "name": "Execution Monitoring",
          "slug": "execution-monitoring-system",
          "priority": 4
        },
        {
          "name": "State Management System",
          "slug": "state-management-planning",
          "priority": 5
        },
        {
          "name": "Resource Allocation Engine",
          "slug": "resource-allocation-engine",
          "priority": 6
        },
        {
          "name": "Constraint Solver",
          "slug": "constraint-solver-planning",
          "priority": 7
        },
        {
          "name": "Plan Adaptation System",
          "slug": "plan-adaptation-system",
          "priority": 8
        },
        {
          "name": "Task Recovery Framework",
          "slug": "task-recovery-framework",
          "priority": 9
        },
        {
          "name": "Progress Analytics",
          "slug": "progress-analytics-planning",
          "priority": 10
        }
      ]
    }
  }
}



this is how I created queries with technologies and use-cases and flows

mutation {
  createUseCase(
    data: {
      title: "BioMedical Research Intelligence Assistant"
      section: "healthcare-research"
      description: """
        Enterprise-scale AI system specifically designed for pharmaceutical and biotech research, accelerating drug discovery 
        and clinical research processes. Processes clinical trials, medical literature, and genomic research data, reducing 
        drug discovery research time by 70% and increasing successful target identification by 45%. Specializes in 
        cross-referencing multiple data types: clinical trials, genomic studies, protein interaction research, and 
        drug-response data.
      """
      queries: [
        "Analyze clinical trial results and identify success patterns across different patient cohorts",
        "Map protein-drug interactions across multiple research papers and predict potential new applications",
        "Generate comprehensive meta-analysis of treatment efficacy across multiple studies",
        "Identify emerging biomarkers and their correlation with treatment outcomes",
        "Track drug development pipelines and compare methodologies across competing research"
      ]
      capabilities: [
        "Multi-modal research analysis (genomic data, clinical trials, medical imaging)",
        "Biomedical entity recognition and relationship mapping",
        "Statistical validation of research methodologies and results",
        "Regulatory compliance checking and documentation",
        "Real-time monitoring of global research developments"
      ]
      technologies: {
        connect: [
          # Core AI Processing
          { slug: "gpt-4" },        # Complex medical text understanding
          { slug: "bert" },         # Biomedical named entity recognition
          
          # Knowledge Management
          { slug: "neo4j" },        # Drug-protein interaction mapping
          { slug: "knowledge-graphs" }, # Medical knowledge organization
          
          # Data Storage & Retrieval
          { slug: "pinecone" },     # Semantic search for medical literature
          { slug: "weaviate" },     # Vector storage for research data
          
          # Processing Pipeline
          { slug: "langchain" },    # Research workflow orchestration
          { slug: "spacy" }         # Medical text processing
        ]
      }
      architecture: {
        create: {
          description: """
            HIPAA-compliant, GxP-validated architecture designed for processing sensitive medical research data.
            Features automated regulatory documentation and real-time validation of research methodologies.
            Integrates with major medical databases (PubMed, ClinicalTrials.gov, TCGA) and supports secure
            multi-institutional collaboration.
          """
          components: {
            create: [
              {
                name: "Biomedical Research Analyzer"
                description: "Specialized system for analyzing clinical trials, genomic studies, and medical literature"
                details: "Processes 50,000+ medical documents per day with 98% accuracy in biomarker identification"
                explanation: """
                  - Validates clinical trial methodologies against regulatory requirements
                  - Maps complex protein-drug interactions across studies
                  - Identifies patient cohort patterns and treatment responses
                  - Tracks adverse events and safety signals across multiple trials
                  - Correlates genomic markers with clinical outcomes
                """
              },
              {
                name: "Medical Knowledge Synthesizer"
                description: "Advanced system for integrating multi-modal medical research data"
                details: "Maintains comprehensive knowledge graph of 10M+ medical relationships with real-time updates"
                explanation: """
                  - Integrates genomic, proteomic, and clinical trial data
                  - Identifies potential drug repurposing opportunities
                  - Maps disease pathway mechanisms
                  - Tracks treatment efficacy across different populations
                  - Generates regulatory-compliant research documentation
                """
              }
            ]
          }
          flow: {
            create: [
              {
                step: "Multi-source Data Integration"
                description: "Parallel processing of clinical trials, genomic data, and medical literature"
                details: "Integrates with 50+ medical databases and research platforms"
              },
              {
                step: "Regulatory Validation"
                description: "Automated checking of research compliance and methodology validation"
                details: "Validates against FDA, EMA, and ICH guidelines"
              },
              {
                step: "Cross-study Analysis"
                description: "Deep analysis of treatment effects across multiple studies and data types"
                details: "Combines clinical, genomic, and molecular data for comprehensive insights"
              },
              {
                step: "Insight Generation"
                description: "Production of actionable research insights with regulatory documentation"
                details: "Generates GxP-compliant reports and research summaries"
              }
            ]
          }
        }
      }
      metrics: [
        "Drug discovery research time reduction: 70%",
        "Biomarker identification accuracy: 98%",
        "Regulatory compliance rate: 100%",
        "Cross-study insight generation: 45% improvement",
        "Research documentation time: 85% reduction"
      ]
      implementation: {
        requirements: [
          "HIPAA-compliant infrastructure",
          "GxP-validated systems",
          "Secure multi-institutional access",
          "High-performance computing for genomic data"
        ],
        integration_points: [
          "Clinical trial management systems",
          "Genomic databases",
          "Laboratory information systems",
          "Regulatory documentation systems",
          "Drug development pipelines"
        ],
        success_metrics: [
          "Speed of target identification",
          "Accuracy of drug-protein interaction predictions",
          "Regulatory compliance efficiency",
          "Novel therapeutic pathway discovery rate",
          "Research cost reduction"
        ]
      }
    }
  ) {
    id
    title
    technologies {
      name
      slug
    }
    architecture {
      components {
        name
        description
      }
      flow {
        step
        description
      }
    }
  }
}