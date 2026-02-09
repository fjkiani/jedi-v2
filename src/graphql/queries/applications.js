import { gql } from 'graphql-request';

export const GET_APPLICATIONS = gql`
  query GetApplications($stage: Stage!) {
    projects12(stage: $stage, orderBy: date_DESC) {
      id
      title
      slug
      description
      applicationUrl
      featuredImage {
        id
        url
        fileName
      }
      caseStudy {
        id
        slug
        title
      }
      categories {
        id
        name
        slug
      }
    }
  }
`;
