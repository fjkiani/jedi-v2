#!/usr/bin/env node
/**
 * Create Blog Post in Hygraph
 *
 * Creates a Post entry in Hygraph from a JSON file. Content must be Slate AST format.
 *
 * Usage:
 *   npm run blog:create -- --file scripts/blog/drafts/my-post.json
 *
 * JSON format:
 *   { "title": "...", "slug": "...", "excerpt": "...", "content": { "children": [...] } }
 *
 * For content, use Slate AST:
 *   { "children": [
 *     { "type": "paragraph", "children": [{ "text": "First paragraph." }] },
 *     { "type": "heading-two", "children": [{ "text": "A Heading" }] }
 *   ]}
 */

import { readFileSync } from 'fs';
import { GraphQLClient } from 'graphql-request';
import dotenv from 'dotenv';

dotenv.config();

const ENDPOINT = process.env.VITE_HYGRAPH_ENDPOINT || process.env.VITE_GRAPHCMS_ENDPOINT;
const TOKEN = process.env.VITE_HYGRAPH_TOKEN;

if (!ENDPOINT || !TOKEN) {
  console.error('Missing .env: VITE_HYGRAPH_ENDPOINT and VITE_HYGRAPH_TOKEN (or VITE_GRAPHCMS_ENDPOINT)');
  process.exit(1);
}

const client = new GraphQLClient(ENDPOINT, {
  headers: { Authorization: `Bearer ${TOKEN}` },
});

const CREATE_POST = `
  mutation CreatePost($data: PostCreateInput!) {
    createPost(data: $data) {
      id
      title
      slug
      excerpt
      stage
      createdAt
    }
  }
`;

const PUBLISH_POST = `
  mutation PublishPost($id: ID!) {
    publishPost(where: { id: $id }) {
      id
      publishedAt
    }
  }
`;

function loadPostFile(path) {
  try {
    return JSON.parse(readFileSync(path, 'utf-8'));
  } catch (e) {
    console.error('Could not load post file:', e.message);
    process.exit(1);
  }
}

function toSlateContent(content) {
  if (!content) return { children: [{ type: 'paragraph', children: [{ text: 'No content.' }] }] };
  if (content.children && Array.isArray(content.children)) return content;
  if (typeof content === 'string') {
    return {
      children: content.split('\n\n').map((p) => ({
        type: 'paragraph',
        children: [{ text: p.trim() || ' ' }],
      })),
    };
  }
  return { children: [{ type: 'paragraph', children: [{ text: 'Placeholder.' }] }] };
}

async function main() {
  const args = process.argv.slice(2);
  const fileIdx = args.indexOf('--file');
  const filePath = fileIdx >= 0 ? args[fileIdx + 1] : null;
  const publish = args.includes('--publish');

  if (!filePath) {
    console.log(`
Create Blog Post in Hygraph
Usage: npm run blog:create -- --file <path-to-post.json> [--publish]

Example:
  npm run blog:create -- --file scripts/blog/drafts/agentic-ai-identity.json --publish

JSON fields: title, slug, excerpt, content (Slate AST), featuredPost (boolean)
`);
    process.exit(0);
  }

  const raw = loadPostFile(filePath);
  const content = toSlateContent(raw.content);

  const data = {
    title: raw.title || 'Untitled',
    slug: raw.slug || raw.title?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') || 'untitled',
    excerpt: raw.excerpt || raw.title || 'No excerpt.',
    content,
    featuredPost: raw.featuredPost ?? false,
  };

  if (raw.author?.connect?.id) data.author = raw.author;
  if (raw.categories?.connect?.length) data.categories = raw.categories;
  if (raw.featuredImage?.connect?.id) data.featuredImage = raw.featuredImage;

  try {
    const result = await client.request(CREATE_POST, { data });
    const post = result.createPost;
    console.log('Created post:', post.title, '| id:', post.id, '| slug:', post.slug);

    if (publish) {
      const pub = await client.request(PUBLISH_POST, { id: post.id });
      console.log('Published at:', pub.publishPost.publishedAt);
    } else {
      console.log('(Draft. Add --publish to publish.)');
    }
  } catch (e) {
    console.error('Hygraph error:', e.message);
    if (e.response?.errors) console.error(JSON.stringify(e.response.errors, null, 2));
    process.exit(1);
  }
}

main();
