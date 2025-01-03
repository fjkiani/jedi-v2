export const GET_INDUSTRIES = `
  query GetIndustries {
    industries {
      id
      title
      name
      sections
      technologies {
        id
        name
        slug
      }
    }
  }
`;

export const GET_INDUSTRY_BY_TITLE = `
  query GetIndustryByTitle($title: String!) {
    industry(where: { title: $title }) {
      id
      title
      name
      sections
      technologies {
        id
        name
        slug
      }
    }
  }
`;

export const CREATE_INDUSTRY = `
  mutation CreateIndustry(
    $title: String!
    $name: String!
    $sections: [String!]!
  ) {
    createIndustry(
      data: {
        title: $title
        name: $name
        sections: $sections
      }
    ) {
      id
      title
    }
  }
`;

export const CREATE_INDUSTRY_TECHNOLOGY_RELATION = `
  mutation CreateIndustryTechnologyRelation(
    $industryId: ID!
    $technologyId: ID!
  ) {
    updateIndustry(
      where: { id: $industryId }
      data: {
        technologies: {
          connect: [{ id: $technologyId }]
        }
      }
    ) {
      id
      title
    }
  }
`; 