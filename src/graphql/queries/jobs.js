import { gql } from 'graphql-request';

export const GET_JOBS = gql`
  query GetJobs($stage: Stage!) {
    jobs(stage: $stage, orderBy: displayOrder_ASC, first: 50) {
      id
      title
      slug
      department
      location
      type
      excerpt
      requirements
      displayOrder
    }
  }
`;

export const GET_JOB_BY_SLUG = gql`
  query GetJobBySlug($slug: String!, $stage: Stage!) {
    jobs(where: { slug: $slug }, stage: $stage, first: 1) {
      id
      title
      slug
      department
      location
      type
      excerpt
      requirements
      description {
        raw
        html
        text
      }
    }
  }
`;
