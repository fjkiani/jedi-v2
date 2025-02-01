import express from 'express';
import { promises as fs } from 'fs';
import { request } from 'graphql-request';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Define HyGraph endpoint
const HYGRAPH_ENDPOINT = import.meta.env.VITE_GRAPHCMS_ENDPOINT;

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

// Middleware to detect social media crawlers
app.use((req, res, next) => {
  const userAgent = req.get('user-agent') || '';
  req.isSocialCrawler = /facebookexternalhit|twitterbot|linkedinbot|whatsapp|telegram/i.test(userAgent);
  console.log('User Agent:', userAgent, 'Is Social Crawler:', req.isSocialCrawler);
  next();
});

// Serve static files
app.use(express.static('dist'));

// Handle blog posts
app.get('/blog/post/:slug', async (req, res, next) => {
  try {
    const slug = req.params.slug;
    console.log('Processing request for blog post:', slug);
    
    // If not a social crawler, serve the SPA
    if (!req.isSocialCrawler) {
      return res.sendFile(path.join(__dirname, '../dist/index.html'));
    }
    
    // For social crawlers, fetch post data and inject meta tags
    const data = await request(
      HYGRAPH_ENDPOINT,
      GET_POST_QUERY,
      { slug }
    );

    const post = data.post;
    if (!post) {
      console.log('Post not found:', slug);
      return res.sendFile(path.join(__dirname, '../dist/index.html'));
    }

    let html = await fs.readFile(path.join(__dirname, '../dist/index.html'), 'utf-8');
    
    // Clean existing meta tags
    html = html.replace(/<meta property="og:.*?>/g, '');
    html = html.replace(/<meta name="twitter:.*?>/g, '');
    
    const metaTags = `
      <!-- Essential Meta Tags -->
      <meta property="og:title" content="${post.title}" />
      <meta property="og:description" content="${post.excerpt}" />
      <meta property="og:image" content="${post.featuredImage?.url}" />
      <meta property="og:type" content="article" />
      <meta property="og:site_name" content="Jedi Labs" />
      <meta property="og:url" content="https://www.jedilabs.org/blog/post/${slug}" />
      <meta property="article:published_time" content="${post.createdAt}" />
      ${post.author?.name ? `<meta property="article:author" content="${post.author.name}" />` : ''}

      <!-- Twitter Card Tags -->
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@JediLabs" />
      <meta name="twitter:title" content="${post.title}" />
      <meta name="twitter:description" content="${post.excerpt}" />
      <meta name="twitter:image" content="${post.featuredImage?.url}" />
    `;

    // Insert meta tags right after <head>
    html = html.replace('<head>', '<head>\n' + metaTags);
    
    console.log('Injected meta tags for social crawler');
    res.send(html);
  } catch (error) {
    console.error('Error processing blog post:', error);
    next();
  }
});

// Handle all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 