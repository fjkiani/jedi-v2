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
      console.log('Fetched Posts:', fetchedPosts);
      if (fetchedPosts && fetchedPosts.length > 0) {
        console.log('First Post Author:', fetchedPosts[0].node.author);
      }
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
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 col-span-1">
          {posts.map((post, index) => {
            console.log('Rendering post:', post.node);
            return <PostCard key={index} post={post} />;
          })}
        </div>
        <div className="lg:col-span-4 col-span-1">
          <div className="lg:sticky relative top-8">
            {/* <PostWidget /> */}
            <Categories />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPage;
