import { gql } from 'graphql-request';

export const GET_USE_CASES = `
  query GetUseCases {
    useCaseS {
      id
      title
      industry {
        id
        slug
        name
        sections
      }
      section
      description
      queries
      capabilities
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

export const GET_USE_CASES_BY_INDUSTRY = `
  query GetUseCasesByIndustry($slug: String!) {
    useCaseS(where: { industry: { slug: $slug } }) {
      id
      title
      industry {
        id
        slug
        name
        sections
      }
      section
      description
      queries
      capabilities
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

export const GET_INDUSTRIES = `
  query GetIndustries {
    industries {
      id
      slug
      name
      sections
    }
  }
`; 