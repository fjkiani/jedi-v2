import React, { useState, useEffect } from 'react';
import { FeaturedPosts } from '../sections';
import { PostCard, Categories, PostWidget } from '../components/hyGraph';
import { getPosts } from '../../src/services';

const BlogPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      const fetchedPosts = await getPosts();
      setPosts(fetchedPosts);
      setLoading(false);
    };

    fetchPosts();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Show a loading state
  }

  return (
    <div className="container mx-auto px-10 mb-8">
      {/* <FeaturedPosts /> */}
      <div className="flex justify-center">
        <div className="w-full max-w-4xl">
          {posts.map((post, index) => (
            <PostCard key={index} post={post.node} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogPage;
