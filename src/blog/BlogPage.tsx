import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Categories, PostWidget } from '../components/hyGraph';
import { getPostDetails } from '../services';
import { AdjacentPosts } from '../sections';
import PostDetail from '../components/hyGraph/PostDetail';
import SEO from '@/components/SEO';

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
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-10 mb-8">
        <div className="flex justify-center">
          <div className="w-full max-w-4xl">
            <div className="animate-pulse">
              <div className="h-48 sm:h-64 md:h-80 bg-n-3 rounded-t-xl mb-6" />
              <div className="h-4 bg-n-3 rounded w-1/3 mb-4" />
              <div className="h-8 bg-n-3 rounded w-full max-w-2xl mb-6" />
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-4 bg-n-3 rounded" style={{ width: i === 4 ? '80%' : '100%' }} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return <div className="container mx-auto px-4 py-12 text-center">Post not found</div>;
  }

  const rawExcerpt = (post as any).excerpt || (post as any).description || '';
  const cleanExcerpt = String(rawExcerpt).replace(/<[^>]+>/g, '').trim().slice(0, 160);
  const seoTitle = `${(post as any).title} | Jedi Labs Research`;
  const seoDesc = cleanExcerpt || `Read "${(post as any).title}" on Jedi Labs — production AI evaluation deep-dives.`;
  const seoImage = (post as any).featuredImage?.url || 'https://jedilabs.org/og/og-blog.png';

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-10 mb-8">
      <SEO
        title={seoTitle}
        description={seoDesc}
        path={`/blog/post/${(post as any).slug}`}
        ogImage={seoImage}
      />
      <div className="flex justify-center">
        <div className="w-full max-w-4xl">
          <PostDetail post={post} />
          <h2 className="text-xl font-semibold mb-6 mt-12 text-n-8 dark:text-n-2">Related reads</h2>
          <AdjacentPosts slug={post.slug} createdAt={post.createdAt} />
          {/* <CommentsForm slug={post.slug} />
          <Comments slug={post.slug} /> */}
        </div>
      </div>
    </div>
  );
};

export default PostDetails;