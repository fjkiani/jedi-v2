import express from 'express';
import { promises as fs } from 'fs';
import { request } from 'graphql-request';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const HYGRAPH_ENDPOINT = process.env.VITE_HYGRAPH_ENDPOINT;
const HYGRAPH_TOKEN = process.env.VITE_HYGRAPH_TOKEN;

// Middleware to detect LinkedIn crawler
app.use((req, res, next) => {
  const userAgent = req.get('user-agent') || '';
  console.log('User Agent:', userAgent);
  next();
});

// Serve static files
app.use(express.static(path.join(__dirname, '../dist')));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// Handle blog posts
app.use('/blog/post/:slug', async (req, res, next) => {
  try {
    if (!HYGRAPH_ENDPOINT) {
      throw new Error('HYGRAPH_ENDPOINT environment variable is not set');
    }

    const query = `
      query GetPost($slug: String!) {
        post(where: { slug: $slug }) {
          id
          title
          content
          slug
          date
          excerpt
          coverImage {
            url
          }
        }
      }
    `;

    const variables = {
      slug: req.params.slug,
    };

    const headers = HYGRAPH_TOKEN ? {
      Authorization: `Bearer ${HYGRAPH_TOKEN}`
    } : {};

    const data = await request(HYGRAPH_ENDPOINT, query, variables, headers);
    
    if (!data.post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.json(data);
  } catch (error) {
    console.error('Error fetching blog post:', error);
    next(error);
  }
});

// Fallback route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app; 