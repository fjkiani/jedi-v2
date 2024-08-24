// types.ts or at the top of your file
export interface Author {
  bio: string;
  name: string;
  id: string;
  photo: {
    url: string;
  };
}

export interface PostNode {
  author: Author;
  createdAt: string;
  slug: string;
  title: string;
  excerpt: string;
  featuredImage: {
    url: string;
  };
  categories: {
    name: string;
    slug: string;
  }[];
}

export interface PostEdge {
  cursor: string;
  node: PostNode;
}

export type PostsResponse = PostEdge[];
