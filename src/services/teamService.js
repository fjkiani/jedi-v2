import { gql } from 'graphql-request';
import { hygraphClient } from '@/lib/hygraph';

const GET_TEAM_MEMBER_BY_SLUG = gql`
  query TeamMemberBySlug($slug: String!) {
    teamMembers(where: {slug: $slug}, first: 1) {
      name
      role
      slug
      bio {
        html
      }
      order
      image {
        url
      }
      socialLink {
        social
        url
      }
      quickStats {
        value
        label
      }
      certification {
        name
        description {
          raw
        }
        credentialUrl
        image {
          url
        }
      }
      # workExperience {
      #   ... on WorkExperience {
      #     id
      #     title
      #     company
      #     location
      #     startDate
      #     endDate
      #     highlights
      #     description {
      #       html
      #     }
      #     skills {
      #       ... on Technology {
      #         name
      #         slug
      #         icon
      #         description
      #       }
      #       ... on UseCase {
      #         title
      #         description
      #       }
      #       ... on Projects {
      #         title
      #         description
      #       }
      #     }
      #   }
      # }
      # portfolioAsset {
      #   # ... portfolio asset fields ...
      # }
      # certification {
      #   # ... certification fields ...
      # }
    }
  }
`;

const GET_ALL_TEAM_MEMBERS = gql`
  query GetAllTeamMembers {
    teamMembers(orderBy: order_ASC) {
      name
      role
      slug
      order
      image {
        url
      }
      socialLink {
        social
        url
      }
    }
  }
`;

const GET_ALL_TECHNOLOGIES = gql`
  query GetAllTechnologies {
    technologies {
      name
      slug
    }
  }
`;

// Cache for technologies
let technologiesCache = null;

export const teamService = {
  getAllTechnologies: async () => {
    if (technologiesCache) return technologiesCache;
    
    try {
      const { technologies } = await hygraphClient.request(GET_ALL_TECHNOLOGIES);
      technologiesCache = technologies;
      return technologies;
    } catch (error) {
      console.error('Error fetching technologies:', error);
      return [];
    }
  },

  getTeamMemberBySlug: async (slug) => {
    try {
      console.log('Fetching team member with slug:', slug);
      const { teamMembers } = await hygraphClient.request(GET_TEAM_MEMBER_BY_SLUG, { slug });
      console.log('Team members data (plural query):', teamMembers);
      return teamMembers && teamMembers.length > 0 ? teamMembers[0] : null;
    } catch (error) {
      console.error('Error fetching team member:', error);
      throw error;
    }
  },

  getAllTeamMembers: async () => {
    try {
      const { teamMembers } = await hygraphClient.request(GET_ALL_TEAM_MEMBERS);
      return teamMembers;
    } catch (error) {
      console.error('Error fetching team members:', error);
      throw error;
    }
  }
}; 