import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BlogSEO } from '@/components/SEO/BlogSEO';
import { hygraphClient } from '@/lib/hygraph';
import { useTheme } from '@/context/ThemeContext';
import CallToAction from '@/components/CallToAction';

export const Blog = () => {
  console.log('🚀 Blog page mounted');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isDarkMode } = useTheme();

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
    return (
      <div className={`container mx-auto px-4 py-8 text-center ${isDarkMode ? 'text-n-4' : 'text-n-5'}`}>
        Loading blog posts...
      </div>
    );
  }
  
  if (error) {
    console.error('❌ Blog page error:', error);
    return (
      <div className={`container mx-auto px-4 py-8 border rounded-lg p-4 ${isDarkMode ? 'bg-red-900/20 border-red-500/30' : 'bg-red-50 border-red-200'}`}>
        <p className="text-red-500">Error loading blog posts: {error.message}</p>
      </div>
    );
  }

  console.log('🎨 Rendering blog page with posts:', posts.length);

  return (
    <div className="container mx-auto px-4 py-8">
      <BlogSEO isBlogIndex={true} />
      <h1 className={`h1 text-4xl font-bold mb-8 ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>Blog</h1>
      
      {posts.length === 0 ? (
        <p className={`text-center py-10 ${isDarkMode ? 'text-n-4' : 'text-n-5'}`}>No blog posts found yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map(post => {
            console.log('📝 Rendering post:', post.title);
            return (
              <Link 
                key={post.id} 
                to={`/blog/post/${post.slug}`}
                className={`block border rounded-lg overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col ${isDarkMode ? 'bg-n-7 border-n-6 hover:border-primary-1/50' : 'bg-white border-n-3 hover:border-primary-1/50'} group`}
              >
                {post.coverImage && (
                  <img 
                    src={post.coverImage.url} 
                    alt={post.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-4 flex flex-col flex-grow">
                  <h2 className={`h5 font-bold mb-2 ${isDarkMode ? 'text-n-1' : 'text-n-8'}`}>{post.title}</h2>
                  <p className={`${isDarkMode ? 'text-n-3' : 'text-n-5'} text-sm mb-4 flex-grow line-clamp-3`}>{post.excerpt}</p>
                  
                  <div className="flex items-center mt-auto pt-4 border-t ${isDarkMode ? 'border-n-6' : 'border-n-3'}">
                    {post.author?.photo && (
                      <img 
                        src={post.author.photo.url} 
                        alt={post.author.name}
                        className="w-10 h-10 rounded-full mr-3"
                      />
                    )}
                    <div>
                      <p className={`font-medium text-sm ${isDarkMode ? 'text-n-2' : 'text-n-7'}`}>{post.author?.name}</p>
                      <p className={`text-xs ${isDarkMode ? 'text-n-4' : 'text-n-5'}`}>
                        {new Date(post.publishedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {post.categories && post.categories.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {post.categories.map(category => (
                        <span 
                          key={category.name}
                          className={`text-xs px-3 py-1 rounded-full ${isDarkMode ? 'bg-n-6 text-n-2' : 'bg-n-2 text-n-6'}`}
                        >
                          {category.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}

      <div className="mt-16">
        <CallToAction 
          title="Interested in Our Solutions?"
          description="Learn how Jedi Labs can help transform your business with cutting-edge AI."
          buttonText="Explore Solutions"
          buttonLink="/solutions"
          buttonStyle="primary"
        />
      </div>
    </div>
  );
};

export default Blog; 