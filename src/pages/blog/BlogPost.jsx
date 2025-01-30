import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { BlogSEO } from '@/components/SEO/BlogSEO';
import { hygraphClient } from '@/lib/hygraph';
import { RichText } from '@graphcms/rich-text-react-renderer';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useTheme } from '@/context/ThemeContext';

export const BlogPost = () => {
  const { slug } = useParams();
  const { isDarkMode } = useTheme();
  
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const query = `
          query GetBlogPost($slug: String!) {
            post(where: { slug: $slug }) {
              id
              title
              slug
              excerpt
              content {
                raw
                references {
                  ... on Asset {
                    id
                    url
                    mimeType
                  }
                }
              }
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
        console.log('Post content:', result.post.content); // Debug log
        setPost(result.post);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching blog post:', err);
        setError(err);
        setLoading(false);
      }
    };

    if (slug) {
      fetchPost();
    }
  }, [slug]);

  // Update the renderers to better handle code blocks
  const renderers = {
    code: ({ children }) => (
      <code className="bg-gray-100 dark:bg-gray-800 rounded px-1 py-0.5">
        {children}
      </code>
    ),
    code_block: ({ children }) => {
      console.log('Code block content:', children); // Debug log
      return (
        <div className="relative">
          <SyntaxHighlighter
            language="javascript"
            style={vscDarkPlus}
            className="rounded-lg my-4 p-4 !bg-gray-900"
            showLineNumbers={true}
            wrapLines={true}
            customStyle={{
              margin: 0,
              padding: '1rem',
              backgroundColor: '#1a1a1a',
            }}
          >
            {children}
          </SyntaxHighlighter>
        </div>
      );
    },
    h1: ({ children }) => <h1 className="text-3xl font-bold mt-8 mb-4">{children}</h1>,
    h2: ({ children }) => <h2 className="text-2xl font-bold mt-6 mb-3">{children}</h2>,
    h3: ({ children }) => <h3 className="text-xl font-bold mt-5 mb-2">{children}</h3>,
    p: ({ children }) => <p className="mb-4 text-gray-800 dark:text-gray-200">{children}</p>,
    ul: ({ children }) => <ul className="list-disc ml-6 mb-4">{children}</ul>,
    ol: ({ children }) => <ol className="list-decimal ml-6 mb-4">{children}</ol>,
    li: ({ children }) => <li className="mb-2">{children}</li>,
  };

  if (loading) return <div>Loading blog post...</div>;
  if (error) return <div>Error loading blog post: {error.message}</div>;
  if (!post) return <div>Blog post not found</div>;

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
      
      <div className={`prose prose-lg max-w-none ${isDarkMode ? 'prose-invert' : ''}`}>
        {post.content?.raw ? (
          <RichText
            content={post.content.raw}
            references={post.content.references}
            renderers={renderers}
          />
        ) : (
          <p>No content available</p>
        )}
      </div>
      
      {post.author?.bio && (
        <div className="mt-12 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
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
              <p className="text-gray-600 dark:text-gray-300">{post.author.bio}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 