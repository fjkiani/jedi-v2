import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Categories, PostWidget } from '../components/hyGraph';
import { getPostDetails } from '../services';
import { AdjacentPosts } from '../sections';
import PostDetail from '../components/hyGraph/PostDetail';

const PostDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      const fetchedPost = await getPostDetails(slug);
      if (!fetchedPost) {
        navigate('/404'); // Redirect to a 404 page if the post is not found
      } else {
        setPost(fetchedPost);
      }
      setLoading(false);
    };

    fetchPost();
  }, [slug, navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!post) {
    return <div>Post not found</div>;
  }

  return (
    <div className="container mx-auto px-10 mb-8">
      <div className="flex justify-center">
        <div className="w-full max-w-4xl">
          <PostDetail post={post} />
          <AdjacentPosts slug={post.slug} createdAt={post.createdAt} />
          {/* <CommentsForm slug={post.slug} />
          <Comments slug={post.slug} /> */}
        </div>
      </div>
    </div>
  );
};

export default PostDetails;