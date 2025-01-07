import { gql } from 'graphql-request';
import { hygraph } from '../lib/hygraph';

const getTeamMembers = async () => {
  const query = gql`
    query TeamMembers {
      teamMembers(orderBy: order_ASC) {
        id
        name
        role
        bio
        order
        image {
          url
        }
        linkedinUrl
        twitterUrl
        githubUrl
        specialties
        achievements
        education {
          degree
          institution
          year
        }
        publications {
          title
          url
          year
        }
      }
    }
  `;

  try {
    const { teamMembers } = await hygraph.request(query);
    return teamMembers;
  } catch (error) {
    console.error('Error fetching team members:', error);
    return [];
  }
};

const getTeamMemberBySlug = async (slug) => {
  const query = gql`
    query TeamMemberBySlug($slug: String!) {
      teamMember(where: { slug: $slug }) {
        id
        name
        role
        bio
        slug
        image {
          url
        }
        linkedinUrl
        twitterUrl
        githubUrl
        specialties
        achievements
        education {
          degree
          institution
          year
        }
        publications {
          title
          url
          year
        }
        featuredProjects {
          title
          description
          technologies
          imageUrl
          projectUrl
        }
      }
    }
  `;

  try {
    const { teamMember } = await hygraph.request(query, { slug });
    return teamMember;
  } catch (error) {
    console.error('Error fetching team member:', error);
    return null;
  }
};

export const teamService = {
  getTeamMembers,
  getTeamMemberBySlug
}; 