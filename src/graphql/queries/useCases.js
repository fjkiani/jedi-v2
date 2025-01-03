import { gql } from 'graphql-request';

export const GET_USE_CASES = gql`
  query GetUseCases {
    useCaseS {
      id
      title
      description
      industry {
        id
        name
        slug
      }
      technologies {
        id
        name
        icon
        description
      }
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
    }
  }
`;

export const GET_USE_CASES_BY_INDUSTRY = gql`
  query GetUseCasesByIndustry($slug: String!) {
    useCases(where: { industry: { slug: $slug } }) {
      id
      title
      section
      description
      industry {
        id
        slug
        name
        sections
      }
      category {
        name
        slug
      }
      technologies {
        id
        name
        icon
        description
      }
      queries
      capabilities
      metrics
      implementation
      architecture {
        description
        components {
          name
          description
          technologies
          details
          explanation
        }
        flow {
          step
          description
          details
        }
      }
    }
  }
`;

export const GET_INDUSTRIES = gql`
  query GetIndustries {
    industries {
      id
      slug
      name
      sections
    }
  }
`;

export const GET_AI_AGENT_USE_CASES = gql`
  query GetAIAgentUseCases {
    useCaseS(where: { category: "ai-agents" }) {
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
`;

export const GET_USE_CASES_BY_CATEGORY = gql`
  query GetUseCasesByCategory($category: String!) {
    useCases(where: { category_contains: $category }) {
      id
      title
      description
      queries
      capabilities
      technologies {
        name
        slug
        icon
      }
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
      implementation
    }
  }
`; 