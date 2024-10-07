// src/pages/CategoryPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getCategories, getCategoryPost } from '@/services';
import PostCard from '@/components/hyGraph/PostCard';
import Categories from '@/components/hyGraph/Categories';

const CategoryPage = () => {
  const { slug } = useParams(); // Get the slug from the URL
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch posts when the component mounts or when slug changes
  useEffect(() => {
    const fetchCategoryPosts = async () => {
      try {
        const postsData = await getCategoryPost(slug);
        setPosts(postsData);
      } catch (error) {
        console.error('Error fetching category posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryPosts();
  }, [slug]);

  if (loading) {
    return <p className="text-center mt-20">Loading...</p>;
  }

  if (!posts || posts.length === 0) {
    return <p className="text-center mt-20">No posts found for this category.</p>;
  }

  return (
    <div className="container mx-auto px-10 mb-8">
      <h1 className="text-3xl font-semibold mb-8">
        Posts in "{posts[0].node.categories.find((cat) => cat.slug === slug)?.name || slug}"
      </h1>
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
};

export default CategoryPage;
