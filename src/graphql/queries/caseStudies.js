import { gql } from 'graphql-request';

export const GET_CASE_STUDIES = gql`
  query GetCaseStudies($stage: Stage!) {
    caseStudies(stage: $stage, orderBy: publishedAt_DESC) {
      id
      title
      slug
      excerpt
      clientName
      results
      coverImageUrl
    }
  }
`;

export const GET_CASE_STUDY_BY_SLUG = gql`
  query GetCaseStudyBySlug($slug: String!, $stage: Stage!) {
    caseStudies(where: { slug: $slug }, stage: $stage, first: 1) {
      id
      title
      slug
      excerpt
      clientName
      results
      coverImageUrl
      videoUrl
      description {
        raw
        html
        text
      }
      pdfDeck {
        id
        url
        fileName
        mimeType
      }
      galleryImages {
        id
        url
        fileName
        width
        height
      }
      technologies {
        id
        name
        slug
        description
        icon
      }
      useCases {
        id
        title
        slug
        description
        industry {
          id
          name
          slug
        }
        industryApplication {
          id
          applicationTitle
          tagline
          relevantEngine
        }
      }
    }
  }
`;
