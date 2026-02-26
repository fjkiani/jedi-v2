#!/usr/bin/env node
/**
 * Blog Topic Research Script
 *
 * Uses audit data + optional web search to generate targeted blog outlines,
 * keywords, and talking points. Run before writing to ensure content is aligned
 * with industry trends.
 *
 * Usage:
 *   npm run blog:research -- --topic "agentic AI identity"
 *   npm run blog:research -- --topic voice-ai --format markdown
 *
 * Optionally set PERPLEXITY_API_KEY or SEARCH_API_URL in .env for live search.
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const AUDIT_PATH = join(__dirname, 'audit-data.json');

function loadAudit() {
  try {
    return JSON.parse(readFileSync(AUDIT_PATH, 'utf-8'));
  } catch (e) {
    console.error('Could not load audit-data.json:', e.message);
    process.exit(1);
  }
}

function matchTopic(topic, audit) {
  const t = topic.toLowerCase().replace(/\s+/g, '-');
  for (const [key, data] of Object.entries(audit.topics)) {
    if (key.includes(t) || t.includes(key)) return { key, data };
    if (data.keywords.some((k) => k.toLowerCase().includes(t) || t.includes(k.toLowerCase())))
      return { key, data };
  }
  return null;
}

function formatMarkdown(match, topic, audit) {
  const { key, data } = match;
  const jedi = audit.jediContext;
  const lines = [
    `# Blog Research: ${topic}`,
    '',
    '## JEDI Angle (use this)',
    jedi ? [`What we build: ${jedi.whatWeBuild}`, `Clients: ${jedi.clients}`, `Why us: ${jedi.whyUs}`].map((l) => `- ${l}`).join('\n') : '',
    '',
    '## Target Keywords',
    ...data.keywords.map((k) => `- ${k}`),
    '',
    '## Suggested Titles',
    ...data.suggestedTitles.map((t) => `- ${t}`),
    '',
    '## Outline',
    ...data.outline.map((o, i) => `${i + 1}. ${o}`),
    '',
    '## Stats to Include',
    ...data.stats.map((s) => `- ${s}`),
  ];
  if (data.relatedApplication) {
    lines.push(
      '',
      '## See It in Action (tell + show)',
      `**${data.relatedApplication.title}** — ${data.relatedApplication.description}`,
      `→ ${data.relatedApplication.url}`,
    );
  }
  lines.push(
    '',
    '## Tone Checklist',
    '- [ ] Real client names (Go Answer, Clear Mind Life)',
    '- [ ] Concrete numbers',
    '- [ ] "We" not "organizations"',
    '- [ ] Hook question or war story',
    '- [ ] End with link to related application',
  );
  return lines.join('\n').replace(/\n{3,}/g, '\n\n');
}

function formatJson(match, topic, audit) {
  const { key, data } = match;
  return JSON.stringify(
    {
      topic: topic,
      focusArea: key,
      jediContext: audit.jediContext,
      keywords: data.keywords,
      suggestedTitles: data.suggestedTitles,
      outline: data.outline,
      stats: data.stats,
      relatedApplication: data.relatedApplication,
    },
    null,
    2
  );
}

async function main() {
  const args = process.argv.slice(2);
  const topicIdx = args.indexOf('--topic');
  const topic = topicIdx >= 0 ? args[topicIdx + 1] : null;
  const formatIdx = args.indexOf('--format');
  const format = formatIdx >= 0 ? args[formatIdx + 1] : 'markdown';

  if (!topic) {
    console.log(`
Blog Topic Research
Usage: npm run blog:research -- --topic <topic> [--format markdown|json]

Topics: agentic-ai | ai-identity | voice-ai | rag-enterprise | co-pilots

Examples:
  npm run blog:research -- --topic "agentic AI"
  npm run blog:research -- --topic ai-identity --format json
`);
    process.exit(0);
  }

  const audit = loadAudit();
  const match = matchTopic(topic, audit);

  if (!match) {
    console.error(`No match for topic: "${topic}"`);
    console.log('Available topics:', Object.keys(audit.topics).join(', '));
    process.exit(1);
  }

  const output =
    format === 'json' ? formatJson(match, topic, audit) : formatMarkdown(match, topic, audit);
  console.log(output);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
