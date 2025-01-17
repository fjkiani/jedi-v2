import { useState, useEffect } from 'react';
import { BlogSEO } from '@/components/SEO/BlogSEO';
import { hygraphClient } from '@/lib/hygraph';

export const Blog = () => {
  console.log('🚀 Blog page mounted');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      console.log('🔄 Fetching blog posts...');
      try {
        const query = `
          query GetBlogPosts {
            posts(orderBy: publishedAt_DESC) {
              id
              title
              slug
              excerpt
              publishedAt
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

        const result = await hygraphClient.request(query);
        console.log('✅ Fetched blog posts:', result.posts);
        setPosts(result.posts);
        setLoading(false);
      } catch (err) {
        console.error('❌ Error fetching blog posts:', err);
        setError(err);
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    console.log('⏳ Blog page loading...');
    return <div>Loading blog posts...</div>;
  }
  
  if (error) {
    console.error('❌ Blog page error:', error);
    return <div>Error loading blog posts: {error.message}</div>;
  }

  console.log('🎨 Rendering blog page with posts:', posts.length);

  return (
    <div>
      <BlogSEO isBlogIndex={true} />
      <h1>Blog</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map(post => {
          console.log('📝 Rendering post:', post.title);
          return (
            <div key={post.id} className="border rounded-lg p-4">
              {post.coverImage && (
                <img 
                  src={post.coverImage.url} 
                  alt={post.title}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
              )}
              <h2 className="text-xl font-bold mb-2">{post.title}</h2>
              <p className="text-gray-600 mb-4">{post.excerpt}</p>
              <div className="flex items-center">
                {post.author?.photo && (
                  <img 
                    src={post.author.photo.url} 
                    alt={post.author.name}
                    className="w-10 h-10 rounded-full mr-3"
                  />
                )}
                <div>
                  <p className="font-medium">{post.author?.name}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(post.publishedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              {post.categories && (
                <div className="mt-4 flex flex-wrap gap-2">
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
            </div>
          );
        })}
      </div>
    </div>
  );
}; 