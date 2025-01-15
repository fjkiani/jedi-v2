export const GET_POST_SEO = `
  query GetPostSEO($slug: String!) {
    post(where: { slug: $slug }) {
      title
      excerpt
      featuredImage {
        url
      }
      author {
        name
        bio
        photo {
          url
        }
      }
      teamMember {
        name
        role
        bio
        image {
          url
        }
      }
    }
  }
`;

export const GET_PAGE_SEO = `
  query GetPageSEO($slug: String!) {
    post(where: { slug: $slug }) {
      title
      excerpt
      featuredImage {
        url
      }
      author {
        name
        bio
        photo {
          url
        }
      }
      teamMember {
        name
        role
        bio
        image {
          url
        }
      }
    }
  }
`;

export const GET_GLOBAL_SEO = `
  query GetGlobalSEO {
    posts(where: { slug: "global-seo" }, first: 1) {
      title
      excerpt
      featuredImage {
        url
      }
      author {
        name
        bio
        photo {
          url
        }
      }
      teamMember {
        name
        role
        bio
        image {
          url
        }
      }
    }
  }
`;

