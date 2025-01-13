import express from 'express';
import { promises as fs } from 'fs';
import { request } from 'graphql-request';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Define HyGraph endpoint
const HYGRAPH_ENDPOINT = 'https://us-west-2.cdn.hygraph.com/content/cm1fkwyv5084x07mvgzp8hcml/master';

// Define GraphQL query
const GET_POST_QUERY = `
  query GetPost($slug: String!) {
    post(where: { slug: $slug }) {
      title
      excerpt
      featuredImage {
        url
      }
      createdAt
      author {
        name
      }
    }
  }
`;

// Middleware to detect LinkedIn crawler
app.use((req, res, next) => {
  const userAgent = req.get('user-agent') || '';
  console.log('User Agent:', userAgent);
  next();
});

// Serve static files
app.use(express.static('dist'));

// Handle blog posts
app.use('/blog/post/:slug', async (req, res, next) => {
  try {
    const slug = req.params.slug;
    console.log('Processing request for slug:', slug);
    
    if (slug.includes('.')) {
      return next();
    }
    
    const data = await request(
      HYGRAPH_ENDPOINT,
      GET_POST_QUERY,
      { slug }
    );

    const post = data.post;
    
    if (!post) {
      return res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    }

    let html = await fs.readFile(path.join(__dirname, 'dist', 'index.html'), 'utf-8');
    
    // Clean existing meta tags
    html = html.replace(/<meta property="og:.*?>/g, '');
    html = html.replace(/<meta name="twitter:.*?>/g, '');
    
    const metaTags = `
    <!-- Essential Meta Tags -->
    <meta property="og:title" content="${post.title}" />
    <meta property="og:description" content="${post.excerpt}" />
    <meta property="og:image" content="${post.featuredImage.url}" />
    <meta property="og:type" content="article" />
    <meta property="og:site_name" content="Jedi Labs" />
    <meta property="og:url" content="https://www.jedilabs.org/blog/post/${slug}" />
    <meta property="article:published_time" content="${post.createdAt}" />
    ${post.author?.name ? `<meta property="article:author" content="${post.author.name}" />` : ''}

    <!-- Twitter Card Tags -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${post.title}" />
    <meta name="twitter:description" content="${post.excerpt}" />
    <meta name="twitter:image" content="${post.featuredImage.url}" />
    `;

    // Insert meta tags right after <head>
    html = html.replace('<head>', '<head>\n' + metaTags);
    
    console.log('Injected meta tags:', metaTags);
    res.send(html);
  } catch (error) {
    console.error('Error processing meta tags:', error);
    next();
  }
});

// Fallback route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 