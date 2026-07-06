#!/usr/bin/env node
/**
 * IndexNow submission — Bing + Yandex (Google does NOT participate in IndexNow yet).
 *
 * IndexNow protocol: https://www.indexnow.org/documentation
 * You POST a JSON body with your host, the key, the location of the key
 * verification file, and a list of URLs to a single endpoint. Bing, Yandex,
 * Naver, and Seznam all consume from the same submission.
 *
 * Usage:
 *   node scripts/indexnow-submit.mjs                  # submits all sitemap URLs
 *   node scripts/indexnow-submit.mjs /new-page /blog  # submits specific paths
 *
 * Configuration:
 *   INDEXNOW_KEY (required)  — 8-128 char hex key, must match public/<KEY>.txt
 *   SITE_URL (default https://jedilabs.org)
 *   SITEMAP_URL (default {SITE_URL}/sitemap.xml)
 *   INDEXNOW_ENDPOINT (default https://api.indexnow.org/indexnow)
 *
 * Notes:
 *   - Google reads sitemap+ping only. There is a separate ping helper below.
 *   - Rate limits: IndexNow accepts up to 10,000 URLs per POST; there is a
 *     soft per-host quota (undocumented but ~1M URLs/day per Bing docs).
 *   - Bing's IndexNow supports both HTTP GET (single URL) and POST (batch);
 *     we use POST since we always have a batch.
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..');

const SITE_URL = process.env.SITE_URL || 'https://jedilabs.org';
const SITEMAP_URL = process.env.SITEMAP_URL || `${SITE_URL}/sitemap.xml`;
const ENDPOINT = process.env.INDEXNOW_ENDPOINT || 'https://api.indexnow.org/indexnow';
const KEY = process.env.INDEXNOW_KEY;

if (!KEY) {
  console.error('ERROR: INDEXNOW_KEY env var required.');
  console.error('       Generate one with:  node -e "console.log(require(\\"node:crypto\\").randomBytes(16).toString(\\"hex\\"))"');
  console.error(`       Then place it in public/<KEY>.txt so the crawler can verify ownership at ${SITE_URL}/<KEY>.txt`);
  process.exit(1);
}

if (!/^[a-f0-9]{8,128}$/i.test(KEY)) {
  console.error(`ERROR: INDEXNOW_KEY must be 8-128 hex chars (got ${KEY.length}).`);
  process.exit(1);
}

async function extractSitemapUrls(sitemapUrl) {
  const res = await fetch(sitemapUrl);
  if (!res.ok) throw new Error(`sitemap fetch failed: ${res.status} ${res.statusText}`);
  const xml = await res.text();
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
  // Handle sitemap index (nested <sitemap> refs)
  const isIndex = xml.includes('<sitemapindex');
  if (isIndex) {
    const nested = [];
    for (const sub of locs) {
      try {
        nested.push(...(await extractSitemapUrls(sub)));
      } catch (err) {
        console.warn(`  skipping nested sitemap ${sub}: ${err.message}`);
      }
    }
    return nested;
  }
  return locs;
}

async function submit(urls) {
  const host = new URL(SITE_URL).host;
  const body = {
    host,
    key: KEY,
    keyLocation: `${SITE_URL}/${KEY}.txt`,
    urlList: urls,
  };
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'content-type': 'application/json; charset=utf-8' },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  return { status: res.status, statusText: res.statusText, body: text };
}

async function main() {
  const cliUrls = process.argv.slice(2).filter((a) => a.startsWith('/') || a.startsWith('http'));
  let urls;
  if (cliUrls.length > 0) {
    urls = cliUrls.map((u) => (u.startsWith('http') ? u : `${SITE_URL}${u}`));
    console.log(`Submitting ${urls.length} explicit URL(s)`);
  } else {
    console.log(`Extracting URLs from ${SITEMAP_URL} ...`);
    urls = await extractSitemapUrls(SITEMAP_URL);
    console.log(`Extracted ${urls.length} URL(s) from sitemap`);
  }

  if (urls.length === 0) {
    console.error('No URLs to submit.');
    process.exit(1);
  }

  // Batch of 10,000 max per IndexNow spec
  const BATCH = 10_000;
  for (let i = 0; i < urls.length; i += BATCH) {
    const chunk = urls.slice(i, i + BATCH);
    console.log(`Submitting batch ${i / BATCH + 1}: ${chunk.length} URLs ...`);
    try {
      const result = await submit(chunk);
      console.log(`  ${result.status} ${result.statusText}`);
      if (result.body) console.log(`  ${result.body.slice(0, 500)}`);
      if (result.status >= 400) {
        console.error('  IndexNow submission failed');
        process.exitCode = 1;
      }
    } catch (err) {
      console.error(`  network error: ${err.message}`);
      process.exitCode = 1;
    }
  }

  // Note: Google DEPRECATED /ping?sitemap= in mid-2023 (per Google Search Central
  // announcement 2023-06-26). The endpoint returns 404 now. Google discovers sitemaps
  // via robots.txt (Sitemap: directive) and via Search Console submission.
  // Both are already in place — robots.txt lives at public/robots.txt with a Sitemap
  // line, and the site is verified in Search Console (see google-site-verification
  // meta tag in index.html).
  console.log('\n[skipped] Google /ping?sitemap= was deprecated 2023-06-26.');
  console.log('           Google discovers sitemaps via robots.txt + Search Console.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
