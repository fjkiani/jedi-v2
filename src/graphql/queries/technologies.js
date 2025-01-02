export const GET_USE_CASES_BY_TECHNOLOGY = `
  query GetUseCasesByTechnology($slug: String!) {
    useCaseS(where: { technologies_some: { slug: $slug } }) {
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

export const GET_TECHNOLOGIES = `
  query GetTechnologies {
    technologies {
      id
      name
      slug
      icon {
        url
      }
      category
      subcategories
      description
      services
      primaryUses
      documentation
      website
      github
      dependencies
      compatibleWith
      apis
    }
  }
`;

export const GET_TECHNOLOGY_BY_CATEGORY = `
  query GetTechnologyByCategory($category: String!) {
    technologies(where: { category: $category }) {
      id
      name
      slug
      icon {
        url
      }
      description
      primaryUses
      documentation
    }
  }
`;

export const GET_TECHNOLOGY_BY_SLUG = `
  query GetTechnologyBySlug($slug: String!) {
    technology(where: { slug: $slug }) {
      id
      name
      slug
      description
      category
      primaryUses
    }
  }
`;

export const CREATE_TECHNOLOGY = `
  mutation CreateTechnology(
    $name: String!
    $slug: String!
    $description: String!
    $icon: AssetCreateInput!
    $iconType: IconType!
    $iconPath: String
    $iconUrl: String
    $category: TechnologyCategory!
    $subcategories: [TechnologyCategory!]!
    $services: [String!]!
    $primaryUses: [String!]!
    $metrics: JSON
    $deployment: JSON
    $compatibleWith: [String!]
    $apis: [String!]
    $documentation: String!
    $github: String
    $website: String
  ) {
    createTechnology(
      data: {
        name: $name
        slug: $slug
        description: $description
        icon: $icon
        iconType: $iconType
        iconPath: $iconPath
        iconUrl: $iconUrl
        category: $category
        subcategories: $subcategories
        services: $services
        primaryUses: $primaryUses
        metrics: $metrics
        deployment: $deployment
        compatibleWith: $compatibleWith
        apis: $apis
        documentation: $documentation
        github: $github
        website: $website
      }
    ) {
      id
      slug
    }
  }
`;

export const GET_TECHNOLOGY_WITH_RELATIONS = `
  query GetTechnologyWithRelations($id: ID!) {
    useCase(where: { id: $id }) {
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
