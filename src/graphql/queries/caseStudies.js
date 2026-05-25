import { gql } from 'graphql-request';

// ─── Case study queries ───────────────────────────────────────────────────────
// Schema-verified fields (2025-05-25 introspection):
//   CaseStudy: id, title, slug, excerpt, clientName, results (String),
//              description (RichText), coverImageUrl, videoUrl,
//              pdfDeck (Asset), galleryImages [Asset],
//              technologies [Technology], useCases [UseCase], projects

// ─── List all case studies ────────────────────────────────────────────────────
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
      technologies {
        id
        name
        slug
        icon
      }
      useCases {
        id
        title
        slug
        industry { name slug }
      }
    }
  }
`;

// ─── Single case study by slug ────────────────────────────────────────────────
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
        icon
        description
        features
      }
      useCases {
        id
        title
        slug
        description
        resultsHeadline
        thumbnail { url }
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
  }
`;
