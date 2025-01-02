export const GET_SOLUTION_BY_SLUG = `
  query GetSolutionBySlug($slug: String!) {
    solution(where: { slug: $slug }) {
      id
      title
      shortTitle
      slug
      description
      imageUrl
      icon
      categories
      businessValue
      architecture
      techStack
      deployment
    }
  }
`;

export const CREATE_SOLUTION = `
  mutation CreateSolution(
    $title: String!
    $shortTitle: String!
    $slug: String!
    $description: String!
    $imageUrl: String
    $icon: String!
    $categories: [String!]!
    $businessValue: JSON!
    $architecture: JSON!
    $techStack: JSON!
    $deployment: JSON!
  ) {
    createSolution(
      data: {
        title: $title
        shortTitle: $shortTitle
        slug: $slug
        description: $description
        imageUrl: $imageUrl
        icon: $icon
        categories: $categories
        businessValue: $businessValue
        architecture: $architecture
        techStack: $techStack
        deployment: $deployment
      }
    ) {
      id
      slug
    }
  }
`; 