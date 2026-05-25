import { gql } from 'graphql-request';

// ─── Core list query ────────────────────────────────────────────────────────
// NOTE: Hygraph pluralises this model as "useCaseS" (capital S) — not "useCases"
export const GET_USE_CASES = gql`
  query GetUseCases {
    useCaseS(stage: PUBLISHED, orderBy: title_ASC) {
      id
      title
      slug
      description
      queries
      capabilities
      metrics
      resultsHeadline
      thumbnail { url }
      heroImage { url }
      industry {
        id
        name
        slug
      }
      category {
        id
        name
        slug
      }
      technologies {
        id
        name
        slug
        icon
      }
    }
  }
`;

// ─── Full detail query (single use case) ────────────────────────────────────
export const GET_USE_CASE_BY_SLUG = gql`
  query GetUseCaseBySlug($slug: String!) {
    useCase(where: { slug: $slug }, stage: PUBLISHED) {
      id
      title
      slug
      description
      queries
      capabilities
      metrics
      implementation
      resultsHeadline
      implementationTimeline
      thumbnail { url }
      heroImage { url }
      pdfDeck { url fileName }
      demoVideoUrl
      applicationUrl

      # Rich-text narrative fields
      clientChallenge { html text }
      beforeState { html text }
      jediApproach { html text }
      outcomes { html text }
      resultsNarrative { html text }
      architectureNarrative { html text }
      technologyNarrative { html text }
      capabilityNarrative { html text }
      prerequisites { html text }
      risksAndMitigations { html text }
      testScenarios { html text }

      # JSON fields
      queryExamples
      beforeAfterComparison

      # Relations
      industry {
        id
        name
        slug
      }
      category {
        id
        name
        slug
      }
      technologies {
        id
        name
        slug
        icon
        description
        features
        additonalDetails
      }
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
      caseStudy {
        id
        title
        slug
        excerpt
        clientName
        results
        coverImageUrl
      }
      industryApplication {
        id
        applicationTitle
        tagline
        relevantEngine
        industryChallenge { html }
        jediApproach { html }
        keyCapabilities
        expectedResults
      }
    }
  }
`;

// ─── By industry ─────────────────────────────────────────────────────────────
// Fixed: was "useCases" (wrong) — correct plural is "useCaseS"
export const GET_USE_CASES_BY_INDUSTRY = gql`
  query GetUseCasesByIndustry($slug: String!) {
    useCaseS(where: { industry: { slug: $slug } }, stage: PUBLISHED) {
      id
      title
      slug
      description
      resultsHeadline
      thumbnail { url }
      industry {
        id
        slug
        name
      }
      category {
        id
        name
        slug
      }
      technologies {
        id
        name
        slug
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

// ─── By category ─────────────────────────────────────────────────────────────
export const GET_USE_CASES_BY_CATEGORY = gql`
  query GetUseCasesByCategory($slug: String!) {
    useCaseS(where: { category: { slug: $slug } }, stage: PUBLISHED) {
      id
      title
      slug
      description
      resultsHeadline
      thumbnail { url }
      queries
      capabilities
      metrics
      technologies {
        id
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

// ─── By technology ────────────────────────────────────────────────────────────
export const GET_USE_CASES_BY_TECHNOLOGY = gql`
  query GetUseCasesByTechnology($slug: String!) {
    useCaseS(where: { technologies_some: { slug: $slug } }, stage: PUBLISHED) {
      id
      title
      slug
      description
      resultsHeadline
      thumbnail { url }
      queries
      capabilities
      metrics
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
        id
        name
        slug
        icon
      }
    }
  }
`;

// ─── Industries list ──────────────────────────────────────────────────────────
export const GET_INDUSTRIES = gql`
  query GetIndustries {
    industries(stage: PUBLISHED) {
      id
      slug
      name
      sections
    }
  }
`;
