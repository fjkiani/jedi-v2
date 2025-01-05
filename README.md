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
- [Data Structure and Management](#data-structure-and-management)

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

# Data Structure and Management

## Technology Stack Organization

### Hierarchy


Categories (e.g., "AI/ML")
└── Subcategories (e.g., "Model Training")
└── Technologies (with detailed information)

graphql
mutation CreateSubcategory {
createTechnologySubcategory(data: {
name: "Your Subcategory"
slug: "your-subcategory"
category: {
connect: {
slug: "ai-ml" # or relevant category
}
}
}) {
id
name
slug
}
}

### 2. Create a Technology
graphql:README.md
mutation CreateTechnology {
createTechnology(data: {
name: "Technology Name"
slug: "technology-slug"
description: "Comprehensive description"
icon: "https://icon-url.com"
priority: 1 # Lower number = higher priority
features: "Feature 1, Feature 2, Feature 3"
additonalDetails: """
What it is: Brief definition
How it works: Technical explanation
What it's used for:
Use case 1
Use case 2
Use case 3
How to use it:
Step 1
Step 2
Step 3
"""
category: {
connect: {
slug: "ai-ml" # or relevant category
}
}
}) {
id
name
slug
}
}

### 3. Connect Technology to Subcategory
graphql
mutation ConnectTechnologyToSubcategory {
updateTechnology(
where: { slug: "technology-slug" }
data: {
subcategories: {
connect: [{ where: { slug: "subcategory-slug" } }]
}
}
) {
name
subcategories {
name
slug
}
}
}

## Best Practices

### Naming Conventions
- **Slugs**: Use lowercase with hyphens (e.g., "model-training")
- **Names**: Use proper capitalization (e.g., "Model Training")
- **Icons**: Use consistent URL format and sizing

### Content Structure
1. **Description**
   - Should be comprehensive but concise
   - Focus on main purpose and key benefits
   - Include version if relevant

2. **Features**
   - List key capabilities
   - Separate with commas
   - Keep consistent format

3. **Additional Details**
   - What it is: One-line definition
   - How it works: Technical explanation
   - What it's used for: List of use cases
   - How to use it: Step-by-step guide

### Priority Levels
1. Core Technologies: Priority 1
2. Supporting Technologies: Priority 2-3
3. Optional Tools: Priority 4+

## Verification Queries

### Check Full Category Structure

graphql
query VerifyCategory {
categories(where: { slug: "ai-ml" }) {
name
slug
technologySubcategory {
name
slug
technology {
name
slug
description
features
additonalDetails
}
}
}
}

### Check Specific Technology
graphql
query VerifyTechnology {
technologies(where: { slug: "your-technology-slug" }) {
name
description
features
additonalDetails
subcategories {
name
slug
}
}
}
### Check Subcategory
graphql
query VerifySubcategory {
technologySubcategories(where: { slug: "your-subcategory-slug" }) {
name
slug
technology {
name
slug
}
}
}

## Troubleshooting

### Common Issues
1. **Connection Errors**
   - Verify category/subcategory exists
   - Check slug spelling
   - Ensure proper mutation syntax

2. **Missing Content**
   - Verify all required fields
   - Check relation connections
   - Confirm proper publishing

3. **Invalid Updates**
   - Verify unique constraints
   - Check field types
   - Confirm proper mutation structure

