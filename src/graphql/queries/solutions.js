
import { gql } from 'graphql-request';

export const GET_SOLUTION_BY_SLUG = gql`
  query GetSolutionBySlug($slug: String!) {
    categories(where: { slug: $slug }) {
      id
      name
      slug
      description
      tagline
      problemStatement { html }
      valueProposition { html }
      typicalUseCases { html }
      technologyNarrative { html }
      keyOutcomes { html }
      heroImage { url }
      displayOrder
      featured
    }
    technologies: technologyS(where: { category_some: { slug: $slug } }) {
      id
      name
      slug
      icon
      description
      category {
        slug
      }
      subcategories {
        name
        slug
      }
    }
    # Fetch "Soul" Content via associated Use Cases (Industry Applications)
    # We fetch up to 10 to find at least one with good content
    relatedUseCases: useCaseS(where: { category: { slug: $slug } }, first: 10) {
      title
      slug
      description
      # Fetch rich implementation data (Demo queries, Architecture flow, Metrics)
      queries
      implementation
      architecture {
        id
        description
        components(orderBy: name_ASC) {
          id
          name
          description
          details
          explanation
        }
        flow(orderBy: step_ASC) {
          id
          step
          description
          details
        }
      }
      industryApplication {
        applicationTitle
        industryChallenge { html }
        jediApproach { html }
        keyCapabilities
        expectedResults
      }
    }
  }
  }
`;

export const GET_ALL_SOLUTIONS = gql`
  query GetAllSolutions {
    categories {
      id
      name
      slug
      description
      icon
      # Fetch associated technologies to calculate "module count"
      technologies(first: 5) {
        id
        icon
      }
    }
  }
`;

export const GET_ALL_CATEGORIES_WITH_TECHS = gql`
  query GetAllCategoriesWithTechs {
    categories {
      id
      name
      slug
      description
      technologies(first: 20) {
        id
        name
        slug
        icon { url }
      }
    }
  }
`;