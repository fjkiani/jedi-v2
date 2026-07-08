import express from 'express';
import { content, management, hygraphConfig } from '../lib/hygraph.mjs';

export function makeRouter() {
  const r = express.Router();

  r.get('/config', (req, res) => {
    res.json(hygraphConfig());
  });

  // Introspect schema for models the loop cares about
  r.get('/introspect', async (req, res) => {
    // Use management endpoint if available, else content endpoint via GraphQL __schema
    const q = `
      query IntrospectShallow {
        __schema {
          types {
            name
            kind
            fields { name }
          }
        }
      }
    `;
    const useMgmt = hygraphConfig().management_token_present;
    const out = useMgmt ? await management(q) : await content(q);
    if (!out.ok) return res.status(500).json(out);
    // Filter to models that look like content types (Post, Technology, UseCase, ...)
    const wanted = new Set([
      'Post', 'Technology', 'UseCase', 'Solution', 'Methodology', 'Industry',
      'TeamMember', 'Career', 'CaseStudy', 'AiTraining',
    ]);
    const models = (out.data.__schema.types || [])
      .filter((t) => t.kind === 'OBJECT' && wanted.has(t.name))
      .map((t) => ({ name: t.name, field_count: (t.fields || []).length, fields: (t.fields || []).slice(0, 40).map((f) => f.name) }));
    res.json({ ok: true, endpoint_used: useMgmt ? 'management' : 'cdn', models });
  });

  // List posts. JEDI Labs schema has flat fields (no nested seo model), so we
  // return { title, excerpt } as the SEO surface.
  r.get('/posts', async (req, res) => {
    const q = `
      query Posts {
        posts(first: 50, orderBy: publishedAt_DESC) {
          id
          slug
          title
          excerpt
          publishedAt
          updatedAt
        }
      }
    `;
    const out = await content(q);
    if (!out.ok) return res.status(500).json(out);
    res.json({ ok: true, count: out.data.posts.length, posts: out.data.posts });
  });

  r.get('/technologies', async (req, res) => {
    // JEDI Labs Technology model has flat description field (no nested seo).
    const q = `
      query T {
        technologies(first: 200) {
          id
          slug
          name
          description
        }
      }
    `;
    const out = await content(q);
    if (!out.ok) return res.status(500).json(out);
    res.json({ ok: true, count: out.data.technologies.length, technologies: out.data.technologies });
  });

  // JEDI Labs has UseCase (not Solution). Expose it.
  r.get('/use-cases', async (req, res) => {
    const q = `
      query U {
        useCases(first: 200) {
          id
          slug
          title
          description
        }
      }
    `;
    const out = await content(q);
    if (!out.ok) return res.status(500).json(out);
    res.json({ ok: true, count: out.data.useCases.length, useCases: out.data.useCases });
  });

  // GET /api/hygraph/lookup?slug=spacy&model=Technology — find the exact record
  // for a proposal. Uses per-model field lists that match the live JEDI Labs schema.
  r.get('/lookup', async (req, res) => {
    const slug = req.query.slug;
    const model = req.query.model || 'Technology';
    if (!slug) return res.status(400).json({ ok: false, error: 'slug required' });

    // Query-name (camelCase, singular) → SEO-relevant fields
    const modelMap = {
      Post: { query: 'post', fields: ['id', 'slug', 'title', 'excerpt'] },
      Technology: { query: 'technology', fields: ['id', 'slug', 'name', 'description'] },
      UseCase: { query: 'useCase', fields: ['id', 'slug', 'title', 'description'] },
      CaseStudy: { query: 'caseStudy', fields: ['id', 'slug', 'title', 'excerpt', 'description'] },
      Industry: { query: 'industry', fields: ['id', 'slug', 'name', 'description'] },
    };
    const m = modelMap[model];
    if (!m) return res.status(400).json({ ok: false, error: `unknown model ${model}. Available: ${Object.keys(modelMap).join(', ')}` });

    const q = `query L { ${m.query}(where: { slug: "${slug}" }) { ${m.fields.join(' ')} } }`;
    const out = await content(q);
    if (out.ok && out.data?.[m.query]) return res.json({ ok: true, model, record: out.data[m.query] });
    res.status(404).json({ ok: false, error: 'no record found', model, slug, errors: out.errors });
  });

  return r;
}
