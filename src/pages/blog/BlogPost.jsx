import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { BlogSEO } from '@/components/SEO/BlogSEO';
import { hygraphClient } from '@/lib/hygraph';

export const BlogPost = () => {
  const { slug } = useParams();
  console.log('🚀 BlogPost page mounted for slug:', slug);
  
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      console.log('🔄 Fetching blog post for slug:', slug);
      try {
        const query = `
          query GetBlogPost($slug: String!) {
            post(where: { slug: $slug }) {
              id
              title
              slug
              excerpt
              content
              publishedAt
              updatedAt
              categories {
                name
              }
              author {
                name
                bio
                photo {
                  url
                }
              }
              coverImage {
                url
              }
            }
          }
        `;

        const result = await hygraphClient.request(query, { slug });
        console.log('✅ Fetched blog post:', result.post);
        setPost(result.post);
        setLoading(false);
      } catch (err) {
        console.error('❌ Error fetching blog post:', err);
        setError(err);
        setLoading(false);
      }
    };

    if (slug) {
      fetchPost();
    } else {
      console.warn('⚠️ No slug provided for blog post');
      setLoading(false);
    }
  }, [slug]);

  if (loading) {
    console.log('⏳ BlogPost page loading...');
    return <div>Loading blog post...</div>;
  }
  
  if (error) {
    console.error('❌ BlogPost page error:', error);
    return <div>Error loading blog post: {error.message}</div>;
  }
  
  if (!post) {
    console.warn('⚠️ No post found for slug:', slug);
    return <div>Blog post not found</div>;
  }

  console.log('🎨 Rendering blog post:', {
    title: post.title,
    hasContent: !!post.content,
    hasAuthor: !!post.author,
    categoriesCount: post.categories?.length
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <BlogSEO post={post} />
      
      {post.coverImage && (
        <img 
          src={post.coverImage.url} 
          alt={post.title}
          className="w-full h-64 md:h-96 object-cover rounded-lg mb-8"
        />
      )}
      
      <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
      
      <div className="flex items-center mb-8">
        {post.author?.photo && (
          <img 
            src={post.author.photo.url} 
            alt={post.author.name}
            className="w-12 h-12 rounded-full mr-4"
          />
        )}
        <div>
          <p className="font-medium">{post.author?.name}</p>
          <p className="text-sm text-gray-500">
            Published on {new Date(post.publishedAt).toLocaleDateString()}
            {post.updatedAt && post.updatedAt !== post.publishedAt && (
              <> · Updated on {new Date(post.updatedAt).toLocaleDateString()}</>
            )}
          </p>
        </div>
      </div>
      
      {post.categories && (
        <div className="flex flex-wrap gap-2 mb-8">
          {post.categories.map(category => (
            <span 
              key={category.name}
              className="bg-gray-100 text-gray-800 text-sm px-3 py-1 rounded-full"
            >
              {category.name}
            </span>
          ))}
        </div>
      )}
      
      <div className="prose prose-lg max-w-none">
        {post.content}
      </div>
      
      {post.author?.bio && (
        <div className="mt-12 p-6 bg-gray-50 rounded-lg">
          <h2 className="text-xl font-bold mb-4">About the Author</h2>
          <div className="flex items-start">
            {post.author.photo && (
              <img 
                src={post.author.photo.url} 
                alt={post.author.name}
                className="w-16 h-16 rounded-full mr-4"
              />
            )}
            <div>
              <p className="font-medium mb-2">{post.author.name}</p>
              <p className="text-gray-600">{post.author.bio}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 