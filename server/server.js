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
        width
        height
        mimeType
        fileName
      }
      createdAt
      author {
        name
        bio
        photo {
          url
        }
      }
      slug
      categories {
        name
        slug
      }
    }
  }
`;

// Middleware to detect social media crawlers
app.use((req, res, next) => {
  const userAgent = req.get('user-agent') || '';
  req.isSocialCrawler = /facebookexternalhit|twitterbot|linkedinbot|whatsapp|telegram/i.test(userAgent);
  req.isLinkedIn = /linkedinbot/i.test(userAgent);
  console.log('User Agent:', userAgent, 'Is Social Crawler:', req.isSocialCrawler, 'Is LinkedIn:', req.isLinkedIn);
  next();
});

// Serve static files
app.use(express.static('dist'));

// Handle blog posts
app.get('/blog/post/:slug', async (req, res, next) => {
  try {
    const slug = req.params.slug;
    console.log('Processing request for blog post:', slug);
    
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

    console.log('Post data from HyGraph:', {
      title: post.title,
      excerpt: post.excerpt,
      featuredImage: post.featuredImage,
      author: post.author
    });

    // Ensure we have absolute URLs for images
    let imageUrl = 'https://www.jedilabs.org/og-image.jpg'; // default fallback
    if (post.featuredImage?.url) {
      imageUrl = post.featuredImage.url;
      if (!imageUrl.startsWith('http')) {
        imageUrl = `https:${imageUrl}`;
      }
      // Ensure the URL is properly encoded
      imageUrl = encodeURI(imageUrl);
    }

    console.log('Processed image URL:', imageUrl);

    let html = await fs.readFile(path.join(__dirname, '../dist/index.html'), 'utf-8');
    
    // More aggressive cleaning of existing meta tags
    html = html.replace(/<title>.*?<\/title>/, '');
    html = html.replace(/<meta[^>]*>/g, '');
    html = html.replace(/<link[^>]*rel="canonical"[^>]*>/g, '');
    
    const authorName = post.author?.[0]?.name || post.author?.name;
    const authorBio = post.author?.[0]?.bio || post.author?.bio;
    const authorPhoto = post.author?.[0]?.photo?.url || post.author?.photo?.url;

    // Function to safely encode content for HTML
    const escapeHtml = (unsafe) => {
      if (!unsafe) return '';
      return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    };
    
    // Add cache control headers for social media crawlers
    if (req.isSocialCrawler) {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
    }

    const metaTags = `
      <title>${escapeHtml(post.title)} | Jedi Labs</title>
      
      <!-- Force meta tag updates -->
      <meta http-equiv="cache-control" content="no-cache" />
      <meta http-equiv="expires" content="0" />
      <meta http-equiv="pragma" content="no-cache" />

      <!-- Basic Meta Tags -->
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="description" content="${escapeHtml(post.excerpt)}" />
      <meta name="author" content="${escapeHtml(authorName || 'Jedi Labs')}" />

      <!-- Twitter Card Tags -->
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@JediLabs" />
      <meta name="twitter:title" content="${escapeHtml(post.title)}" />
      <meta name="twitter:description" content="${escapeHtml(post.excerpt)}" />
      <meta name="twitter:image" content="${imageUrl}" />
      ${authorName ? `<meta name="twitter:creator" content="${escapeHtml(authorName)}" />` : ''}

      <!-- OpenGraph Tags -->
      <meta property="og:type" content="article" />
      <meta property="og:title" content="${escapeHtml(post.title)}" />
      <meta property="og:description" content="${escapeHtml(post.excerpt)}" />
      <meta property="og:image" content="${imageUrl}" />
      <meta property="og:image:secure_url" content="${imageUrl}" />
      ${post.featuredImage?.width ? `<meta property="og:image:width" content="${post.featuredImage.width}" />` : ''}
      ${post.featuredImage?.height ? `<meta property="og:image:height" content="${post.featuredImage.height}" />` : ''}
      <meta property="og:url" content="https://www.jedilabs.org/blog/post/${escapeHtml(slug)}" />
      <meta property="og:site_name" content="Jedi Labs" />
      <meta property="article:published_time" content="${post.createdAt}" />
      ${authorName ? `<meta property="article:author" content="${escapeHtml(authorName)}" />` : ''}
      ${authorBio ? `<meta property="article:author:bio" content="${escapeHtml(authorBio)}" />` : ''}
      ${authorPhoto ? `<meta property="article:author:image" content="${authorPhoto}" />` : ''}

      <!-- Favicon -->
      <link rel="icon" type="image/svg+xml" href="./src/assets/brainwave-symbol.svg" />
      
      <!-- Canonical URL -->
      <link rel="canonical" href="https://www.jedilabs.org/blog/post/${escapeHtml(slug)}" />
    `;

    // Replace the entire head content
    html = html.replace(/<head>.*?<\/head>/s, `<head>${metaTags}</head>`);
    
    console.log('Meta tags debug:', {
      title: post.title,
      image: imageUrl,
      author: authorName,
      excerpt: post.excerpt,
      isLinkedIn: req.isLinkedIn,
      userAgent: req.get('user-agent')
    });
    
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