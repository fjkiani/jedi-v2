import { hygraphClient } from '@/lib/hygraph';

const GET_AUTHOR_DETAILS = `
  query GetAuthorDetails($slug: String!) {
    author(where: { slug: $slug }) {
      name
      title
      photo {
        url
        width
        height
      }
      bio
      posts {
        id
        title
        slug
        excerpt
        coverImage {
          url
        }
        publishedAt
      }
      workExperience {
        id
        companyName
        position
        location
        startDate
        endDate
        isCurrentRole
        description {
          raw
        }
        achievements
        companyLogo {
          url
          width
          height
        }
      }
      education {
        id
        institution
        degree
        field
        graduationYear
      }
      certifications {
        id
        name
        credentialUrl
      }
      socialLinks {
        id
        platform
        url
      }
    }
  }
`;

export const authorService = {
  getAuthorDetails: async (slug) => {
    try {
      const data = await hygraphClient.request(GET_AUTHOR_DETAILS, { slug });
      return data.author;
    } catch (error) {
      console.error('Error fetching author details:', error);
      throw error;
    }
  }
}; 
