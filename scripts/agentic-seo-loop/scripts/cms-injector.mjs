#!/usr/bin/env node
// cms-injector.mjs — closes the loop for CMS-owned proposals.
//
// Reads cms-proposals-not-applied.jsonl and drafts Hygraph mutations. In
// preview mode it emits a mutation-preview + a diff for operator review.
// If --confirm is passed AND HYGRAPH_MANAGEMENT_TOKEN is set, it actually
// executes the mutation against the management API.
//
// Every write is idempotent — the mutation always sets the exact target
// values, so re-running is safe.
//
// IMPORTANT — this file was updated against the LIVE JEDI Labs Hygraph
// introspection (project cm1fkwyv5084x07mvgzp8hcml). The schema has NO
// nested `seo` model; SEO surfaces live on flat fields per content type:
//   Post          → title + excerpt
//   Technology    → name (used as title) + description
//   UseCase       → title + description
//   CaseStudy     → title + excerpt (description is longer-form)
//   Industry      → name + description
//
// Usage:
//   node cms-injector.mjs --run-dir=... --repo=... [--preview-only] [--confirm]
//
// Output artifacts:
//   cms-mutations-preview.jsonl   — one line per drafted mutation
//   cms-mutations-applied.jsonl   — one line per mutation actually run
//   cms-mutations-skipped.jsonl   — one line per proposal we could not resolve to a record
//   cms-schema-preflight.json     — schema snapshot at the time of run

import fs from 'node:fs';
import path from 'node:path';
import fetch from 'node-fetch';

// ---- CLI ----
const args = Object.fromEntries(process.argv.slice(2).map((a) => {
  const [k, ...rest] = a.replace(/^--/, '').split('=');
  return [k, rest.length ? rest.join('=') : true];
}));
const RUN_DIR = args['run-dir'] || args['runDir'];
const REPO = args.repo || process.env.JEDI_V2_REPO || '/workspace/jedi-v2';
const PREVIEW_ONLY = args['preview-only'] || args.preview || false;
const CONFIRM = args.confirm || false;

if (!RUN_DIR || !fs.existsSync(RUN_DIR)) {
  console.error(`[cms] run-dir missing: ${RUN_DIR}`);
  process.exit(2);
}

// ---- Hygraph config ----
const CONTENT_ENDPOINT = process.env.VITE_HYGRAPH_ENDPOINT || process.env.HYGRAPH_ENDPOINT;
const CONTENT_TOKEN = process.env.VITE_HYGRAPH_TOKEN || process.env.HYGRAPH_TOKEN;
const MGMT_ENDPOINT = process.env.HYGRAPH_MANAGEMENT_ENDPOINT || 'https://management-us-west-2.hygraph.com/graphql';
const MGMT_TOKEN = process.env.HYGRAPH_MANAGEMENT_TOKEN || null;

async function gql(endpoint, token, query, variables = {}) {
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ query, variables }),
  });
  const text = await res.text();
  let json; try { json = JSON.parse(text); } catch { json = { errors: [{ message: text.slice(0, 200) }] }; }
  if (!res.ok || json.errors) return { ok: false, status: res.status, errors: json.errors || [{ message: text.slice(0, 200) }] };
  return { ok: true, data: json.data };
}

// ---- Route → model mapping ----
// Each entry:
//   • prefix           — URL prefix to match against proposal.route
//   • model            — Hygraph type name (capitalized)
//   • query            — Hygraph query name (camelCase singular)
//   • updateMutation   — Hygraph mutation name
//   • titleField       — the flat field to write the SEO title into
//   • descField        — the flat field to write the SEO description into
//                         (null → no description surface for this model)
//   • lookupFields     — extra fields to fetch for diff
const ROUTE_MODELS = [
  {
    prefix: '/blog/post/',
    model: 'Post',
    query: 'post',
    updateMutation: 'updatePost',
    titleField: 'title',
    descField: 'excerpt',
    lookupFields: ['id', 'slug', 'title', 'excerpt'],
  },
  {
    prefix: '/technology/',
    model: 'Technology',
    query: 'technology',
    updateMutation: 'updateTechnology',
    titleField: 'name',
    descField: 'description',
    lookupFields: ['id', 'slug', 'name', 'description'],
  },
  {
    prefix: '/use-cases/',
    model: 'UseCase',
    query: 'useCase',
    updateMutation: 'updateUseCase',
    titleField: 'title',
    descField: 'description',
    lookupFields: ['id', 'slug', 'title', 'description'],
  },
  {
    prefix: '/case-studies/',
    model: 'CaseStudy',
    query: 'caseStudy',
    updateMutation: 'updateCaseStudy',
    titleField: 'title',
    descField: 'excerpt',
    lookupFields: ['id', 'slug', 'title', 'excerpt'],
  },
  {
    prefix: '/industries/',
    model: 'Industry',
    query: 'industry',
    updateMutation: 'updateIndustry',
    titleField: 'name',
    descField: 'description',
    lookupFields: ['id', 'slug', 'name', 'description'],
  },
];

function findModel(route) {
  for (const rm of ROUTE_MODELS) {
    if (route.startsWith(rm.prefix)) {
      const slug = route.slice(rm.prefix.length).split('/')[0];
      return { ...rm, slug };
    }
  }
  return null;
}

// ---- Preflight: introspect schema, confirm target fields exist ----
async function preflight() {
  const q = `query Introspect { __schema { types { name kind fields { name } } } }`;
  const out = await gql(CONTENT_ENDPOINT, CONTENT_TOKEN, q);
  if (!out.ok) return { ok: false, errors: out.errors };
  const modelIndex = {};
  for (const t of out.data.__schema.types || []) {
    if (t.kind !== 'OBJECT') continue;
    modelIndex[t.name] = new Set((t.fields || []).map((f) => f.name));
  }
  const report = {};
  const problems = [];
  for (const rm of ROUTE_MODELS) {
    const fields = modelIndex[rm.model];
    if (!fields) {
      report[rm.model] = { exists: false };
      problems.push(`${rm.model} does not exist in schema`);
      continue;
    }
    const hasTitle = fields.has(rm.titleField);
    const hasDesc = rm.descField ? fields.has(rm.descField) : true;
    report[rm.model] = {
      exists: true,
      titleField: rm.titleField,
      titleField_present: hasTitle,
      descField: rm.descField,
      descField_present: hasDesc,
    };
    if (!hasTitle) problems.push(`${rm.model}.${rm.titleField} missing`);
    if (rm.descField && !hasDesc) problems.push(`${rm.model}.${rm.descField} missing`);
  }
  return { ok: true, report, problems };
}

// ---- Main ----
const inFile = path.join(RUN_DIR, 'cms-proposals-not-applied.jsonl');
if (!fs.existsSync(inFile)) {
  console.error(`[cms] no cms-proposals-not-applied.jsonl in ${RUN_DIR}`);
  process.exit(2);
}
const proposals = fs.readFileSync(inFile, 'utf-8').split('\n').filter(Boolean).map((l) => JSON.parse(l));
console.log(`[cms] read ${proposals.length} CMS proposals from ${inFile}`);

// Run preflight against the live schema
const pf = await preflight();
if (!pf.ok) {
  console.error('[cms] schema preflight FAILED:', pf.errors);
  process.exit(3);
}
fs.writeFileSync(path.join(RUN_DIR, 'cms-schema-preflight.json'), JSON.stringify(pf, null, 2));
console.log(`[cms] preflight OK. problems=${pf.problems.length}`);
for (const p of pf.problems) console.warn(`[cms] preflight warning: ${p}`);

const previewOut = path.join(RUN_DIR, 'cms-mutations-preview.jsonl');
const appliedOut = path.join(RUN_DIR, 'cms-mutations-applied.jsonl');
const skippedOut = path.join(RUN_DIR, 'cms-mutations-skipped.jsonl');

// The runs dir is on the S3-FUSE mount which rejects random-access writes.
// Buffer everything in memory and flush with a single writeFileSync per file
// at the end of the loop.
const previewBuf = [];
const appliedBuf = [];
const skippedBuf = [];
function bufAppend(buf, obj) { buf.push(JSON.stringify(obj)); }
function flushAll() {
  fs.writeFileSync(previewOut, previewBuf.join('\n') + (previewBuf.length ? '\n' : ''));
  fs.writeFileSync(appliedOut, appliedBuf.join('\n') + (appliedBuf.length ? '\n' : ''));
  fs.writeFileSync(skippedOut, skippedBuf.join('\n') + (skippedBuf.length ? '\n' : ''));
}

const canWrite = !!MGMT_TOKEN && CONFIRM && !PREVIEW_ONLY;
console.log(`[cms] mode: ${canWrite ? 'CONFIRM (will mutate)' : 'PREVIEW (no writes)'} — mgmt_token=${!!MGMT_TOKEN}`);

let previewed = 0, applied = 0, skipped = 0;

for (const p of proposals) {
  const rm = findModel(p.route);
  if (!rm) {
    skipped++;
    bufAppend(skippedBuf, { ...p, _skip_reason: 'no route→model mapping' });
    continue;
  }

  // Look up the current record so we can produce a real before→after diff
  const lookupQ = `query L { ${rm.query}(where: { slug: "${rm.slug}" }) { ${rm.lookupFields.join(' ')} } }`;
  const lookupResult = await gql(CONTENT_ENDPOINT, CONTENT_TOKEN, lookupQ);
  if (!lookupResult.ok) {
    skipped++;
    bufAppend(skippedBuf, {
      ...p, _skip_reason: 'lookup failed', _errors: lookupResult.errors,
    });
    continue;
  }
  const record = lookupResult.data?.[rm.query];
  if (!record?.id) {
    skipped++;
    bufAppend(skippedBuf, {
      ...p, _skip_reason: 'record not found', _model: rm.model, _slug: rm.slug,
    });
    continue;
  }

  // Build the mutation using FLAT fields (title/description/excerpt/name — whichever
  // are defined for this model).
  const data = {};
  data[rm.titleField] = p.proposed_title;
  if (rm.descField && p.proposed_desc) data[rm.descField] = p.proposed_desc;

  // Serialize into inline mutation (no variables — Hygraph often rejects unknown
  // *UpdateInput vars, plus this makes the preview file human-readable).
  const dataStr = Object.entries(data)
    .map(([k, v]) => `${k}: ${JSON.stringify(v)}`)
    .join(', ');
  const mutationQ = `mutation Update${rm.model} { ${rm.updateMutation}(where: { id: "${record.id}" }, data: { ${dataStr} }) { id ${Object.keys(data).join(' ')} } }`;

  // Also emit a publish mutation for after write — Hygraph updates land as DRAFT
  // by default; we need to publish the record to make it visible.
  const publishQ = `mutation Publish${rm.model} { publish${rm.model}(where: { id: "${record.id}" }, to: PUBLISHED) { id } }`;

  const preview = {
    route: p.route,
    model: rm.model,
    slug: rm.slug,
    record_id: record.id,
    diff: {
      title: { from: record[rm.titleField] || null, to: p.proposed_title, field: rm.titleField },
      description: {
        from: rm.descField ? (record[rm.descField] || null) : null,
        to: p.proposed_desc,
        field: rm.descField,
      },
    },
    mutation: mutationQ,
    publish: publishQ,
    keyword_stats: p.keyword_stats,
    confidence: p.confidence,
  };
  bufAppend(previewBuf, preview);
  previewed++;

  if (canWrite) {
    const runResult = await gql(MGMT_ENDPOINT, MGMT_TOKEN, mutationQ);
    if (!runResult.ok) {
      bufAppend(skippedBuf, { ...preview, _skip_reason: 'mutation failed', _errors: runResult.errors });
      skipped++;
      console.error(`[cms] mutation failed for ${p.route}:`, runResult.errors);
      continue;
    }
    // Publish the change
    const publishResult = await gql(MGMT_ENDPOINT, MGMT_TOKEN, publishQ);
    bufAppend(appliedBuf, {
      ...preview,
      applied_at: new Date().toISOString(),
      update_result: runResult.data,
      publish_result: publishResult.data,
      publish_ok: publishResult.ok,
    });
    applied++;
    console.log(`[cms] APPLIED ${p.route} → ${rm.model} ${record.id} ${publishResult.ok ? '(+published)' : '(publish FAILED)'}`);
  } else {
    console.log(`[cms] PREVIEW ${p.route} → ${rm.model} ${record.id} :: "${p.proposed_title}"`);
  }
}

flushAll();
console.log(`[cms] done. previewed=${previewed} applied=${applied} skipped=${skipped}`);
console.log(`[cms] wrote ${previewOut}`);
console.log(`[cms] wrote ${appliedOut}`);
console.log(`[cms] wrote ${skippedOut}`);
process.exit(0);
