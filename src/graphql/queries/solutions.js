import { gql } from 'graphql-request';

// ─── Solutions / Category queries ─────────────────────────────────────────────
// Schema-verified fields (2025-05-25 introspection):
//   Category: id, name, slug, description, tagline,
//             problemStatement (RichText), valueProposition (RichText),
//             typicalUseCases (RichText), technologyNarrative (RichText),
//             keyOutcomes (RichText), heroImage (Asset),
//             displayOrder, featured
//
// NOTE: Category does NOT have a direct `technologies` relation.
//       Technologies are linked via TechnologyCategory (category field on Technology).
//       Use GET_TECHNOLOGY_BY_CATEGORY to fetch techs for a given category slug.

// ─── Single solution/category by slug ────────────────────────────────────────
export const GET_SOLUTION_BY_SLUG = gql`
  query GetSolutionBySlug($slug: String!) {
    categories(where: { slug: $slug }, stage: PUBLISHED) {
      id
      name
      slug
      description
      tagline
      problemStatement { html text }
      valueProposition { html text }
      typicalUseCases { html text }
      technologyNarrative { html text }
      keyOutcomes { html text }
      heroImage { url }
      displayOrder
      featured
    }
    relatedUseCases: useCaseS(where: { category: { slug: $slug } }, stage: PUBLISHED, first: 10) {
      id
      title
      slug
      description
      resultsHeadline
      thumbnail { url }
      queries
      capabilities
      metrics
      implementation
      architecture {
        id
        description
        components {
          id
          name
          description
          details
          explanation
        }
        flow {
          id
          step
          description
          details
        }
      }
      industryApplication {
        applicationTitle
        tagline
        industryChallenge { html }
        jediApproach { html }
        keyCapabilities
        expectedResults
      }
      technologies {
        id
        name
        slug
        icon
        description
        category {
          id
          name
          slug
        }
        subcategories {
          id
          name
          slug
        }
      }
    }
  }
`;

// ─── All solutions/categories (overview page) ─────────────────────────────────
export const GET_ALL_SOLUTIONS = gql`
  query GetAllSolutions {
    categories(stage: PUBLISHED, orderBy: displayOrder_ASC) {
      id
      name
      slug
      description
      tagline
      featured
      displayOrder
      heroImage { url }
    }
  }
`;

// ─── All categories with their technologies (via reverse lookup) ──────────────
// Used by InfrastructurePage — fetches technologies grouped by category
export const GET_ALL_CATEGORIES_WITH_TECHS = gql`
  query GetAllCategoriesWithTechs {
    categories(stage: PUBLISHED, orderBy: displayOrder_ASC) {
      id
      name
      slug
      description
    }
    technologyS(stage: PUBLISHED, orderBy: priority_ASC, first: 500) {
      id
      name
      slug
      icon
      category {
        id
        name
        slug
      }
    }
  }
`;
