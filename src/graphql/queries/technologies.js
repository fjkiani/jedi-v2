// ─── Technology queries ───────────────────────────────────────────────────────
// Schema-verified fields (2025-05-25 introspection):
//   Technology: id, name, slug, description, icon (String URL), additonalDetails,
//               features, priority, businessMetrics,
//               category [TechnologyCategory], subcategories [TechnologySubcategory],
//               usedInUseCases (UseCase), useCases, caseStudies, industryApplication
//
// Fields that do NOT exist (removed): primaryUses, documentation, website, github,
//   dependencies, compatibleWith, apis, services, iconType, iconPath, iconUrl

// ─── List all technologies ────────────────────────────────────────────────────
export const GET_TECHNOLOGIES = `
  query GetTechnologies {
    technologyS(stage: PUBLISHED, orderBy: priority_ASC) {
      id
      name
      slug
      icon
      description
      features
      additonalDetails
      businessMetrics
      priority
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
`;

// ─── Single technology by slug ────────────────────────────────────────────────
export const GET_TECHNOLOGY_BY_SLUG = `
  query GetTechnologyBySlug($slug: String!) {
    technology(where: { slug: $slug }, stage: PUBLISHED) {
      id
      name
      slug
      description
      icon
      features
      additonalDetails
      businessMetrics
      priority
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
      useCases {
        id
        title
        slug
        description
        resultsHeadline
        thumbnail { url }
        industry { name slug }
        category { name slug }
      }
      caseStudies {
        id
        title
        slug
        excerpt
        clientName
        results
        coverImageUrl
      }
    }
  }
`;

// ─── Technologies by category slug ───────────────────────────────────────────
export const GET_TECHNOLOGY_BY_CATEGORY = `
  query GetTechnologyByCategory($slug: String!) {
    technologyS(where: { category_some: { slug: $slug } }, stage: PUBLISHED, orderBy: priority_ASC) {
      id
      name
      slug
      icon
      description
      features
      category {
        id
        name
        slug
      }
    }
  }
`;

// ─── Technologies by slugs (batch lookup) ────────────────────────────────────
export const GET_TECHNOLOGIES_BY_SLUGS = `
  query GetTechnologiesBySlugs($slugs: [String!]) {
    technologyS(where: { slug_in: $slugs }, stage: PUBLISHED) {
      id
      name
      slug
      icon
      description
      features
      additonalDetails
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
`;

// ─── Use cases that use a given technology ────────────────────────────────────
// (kept for backwards compat — prefer GET_TECHNOLOGY_BY_SLUG which includes usedInUseCases)
export const GET_USE_CASES_BY_TECHNOLOGY = `
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
