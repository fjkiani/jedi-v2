import { getCategories, getCategoryPost } from '@/src/services';
import PostCard from '../components/hyGraph/PostCard';
import Categories from '../components/hyGraph/Categories';

interface PostNode {
  title: string;
  slug: string;
  createdAt: string;
  excerpt: string;
  featuredImage: {
    url: string;
  };
  author: {
    name: string;
    photo: {
      url: string;
    };
  };
}

interface PostEdge {
  node: PostNode;
}

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const posts: PostEdge[] = await getCategoryPost(params.slug);

  if (!posts || posts.length === 0) {
    return <p>No posts found for this category.</p>;
  }

  return (
    <div className="container mx-auto px-10 mb-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="col-span-1 lg:col-span-8">
          {posts.map((post, index) => (
            <PostCard key={index} post={post.node} />
          ))}
        </div>
        <div className="col-span-1 lg:col-span-4">
          <div className="relative lg:sticky top-8">
            <Categories />
          </div>
        </div>
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((category: { slug: string }) => ({
    slug: category.slug,
  }));
}
