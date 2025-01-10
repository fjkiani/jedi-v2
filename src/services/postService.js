import { gql } from 'graphql-request';
import { hygraph } from './hygraph';

const GET_POSTS = gql`
  query GetPosts {
    posts(orderBy: createdAt_DESC) {
      title
      slug
      excerpt
      createdAt
      featuredImage {
        url
      }
      categories {
        name
        slug
      }
      author {
        name
        bio {
          html
        }
        image {
          url
        }
      }
    }
  }
`;

const GET_POSTS_BY_CATEGORY = gql`
  query GetPostsByCategory($slug: String!) {
    posts(where: { categories_some: { slug: $slug } }, orderBy: createdAt_DESC) {
      title
      slug
      excerpt
      createdAt
      featuredImage {
        url
      }
      categories {
        name
        slug
      }
      author {
        name
        bio {
          html
        }
        image {
          url
        }
      }
    }
  }
`;

export const postService = {
  getPosts: async () => {
    try {
      const { posts } = await hygraph.request(GET_POSTS);
      const sortedPosts = posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      return sortedPosts;
    } catch (error) {
      console.error('Error fetching posts:', error);
      return [];
    }
  },

  getPostsByCategory: async (categorySlug) => {
    try {
      const { posts } = await hygraph.request(GET_POSTS_BY_CATEGORY, { slug: categorySlug });
      const sortedPosts = posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      return sortedPosts;
    } catch (error) {
      console.error('Error fetching posts by category:', error);
      return [];
    }
  }
}; 