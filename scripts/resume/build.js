#!/usr/bin/env node
/**
 * Resume Builder
 *
 * Reads a JSON resume and outputs Markdown, HTML, or PDF (two-column layout).
 *
 * Usage:
 *   npm run resume:build -- --input scripts/resume/sample.json
 *   npm run resume:build -- --input scripts/resume/sample.json --output resume.md
 *   npm run resume:build -- --input scripts/resume/sample.json --output resume.html --format html
 *   npm run resume:build -- --input scripts/resume/sample.json --output resume.pdf --format pdf
 */

import { readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

function loadResume(path) {
  try {
    return JSON.parse(readFileSync(path, 'utf-8'));
  } catch (e) {
    console.error('Could not load resume file:', e.message);
    process.exit(1);
  }
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function toHtml(resume) {
  const c = resume.contact || {};
  const email = c.email || '';
  const links = c.links || [];
  const linkLine1 = [c.location, c.phone].filter(Boolean).join(' | ');
  const linkLine2 = [email, ...links].filter(Boolean);

  const linkToAnchor = (text) => {
    if (text.includes('@')) return `<a href="mailto:${text}">${escapeHtml(text)}</a>`;
    const href = text.startsWith('http') ? text : `https://${text.replace(/^www\./, '')}`;
    return `<a href="${href}">${escapeHtml(text)}</a>`;
  };

  let html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(resume.name || 'Resume')}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Arial, Helvetica, sans-serif; font-size: 11px; line-height: 1.4; color: #000; max-width: 850px; margin: 0 auto; padding: 24px; }
    .header { text-align: center; margin-bottom: 20px; border-bottom: 1px solid #ddd; padding-bottom: 16px; }
    .name { font-size: 24px; font-weight: bold; margin-bottom: 8px; }
    .contact-line { font-size: 10px; color: #333; margin-bottom: 4px; }
    .contact-line a { color: #0066cc; text-decoration: none; }
    .contact-line a:hover { text-decoration: underline; }
    .contact-line span { margin: 0 6px; color: #999; }
    .tagline { text-align: left; margin-top: 12px; font-size: 11px; }
    .columns { display: grid; grid-template-columns: 1.6fr 1fr; gap: 32px; margin-top: 16px; }
    .section { margin-bottom: 20px; }
    .section-heading { font-size: 13px; font-weight: bold; border-bottom: 1px solid #999; padding-bottom: 4px; margin-bottom: 12px; }
    .job { margin-bottom: 20px; }
    .job-title { font-weight: bold; font-size: 12px; }
    .job-company { font-size: 11px; margin-bottom: 2px; }
    .job-dates { font-size: 10px; color: #444; margin-bottom: 8px; }
    .job ul { margin-left: 16px; }
    .job li { margin-bottom: 6px; }
    .skill-category { font-weight: bold; font-size: 11px; margin-top: 8px; margin-bottom: 2px; }
    .skill-items { font-size: 10px; color: #333; margin-bottom: 4px; }
    .edu-degree { font-weight: bold; font-size: 11px; }
    .edu-school { font-size: 10px; margin-bottom: 2px; }
    .edu-dates { font-size: 10px; color: #444; margin-bottom: 8px; }
    @media print { body { padding: 12px; } .columns { break-inside: avoid; } .job { break-inside: avoid; } }
    @page { size: Letter; margin: 0.5in; }
  </style>
</head>
<body>
  <div class="header">
    <div class="name">${escapeHtml(resume.name || '')}</div>
    <div class="contact-line">${escapeHtml(linkLine1)}</div>
    <div class="contact-line">${linkLine2.map((t) => linkToAnchor(t)).join('<span>|</span>')}</div>
    <div class="tagline">${escapeHtml(resume.tagline || '')}</div>
  </div>
  <div class="columns">
    <div class="left-column">
      <div class="section">
        <div class="section-heading">Work Experience</div>`;

  for (const job of resume.workExperience || []) {
    const dateLine = job.context ? `${job.dates || ''} (${job.context})` : job.dates || '';
    html += `
        <div class="job">
          <div class="job-title">${escapeHtml(job.title || '')}</div>
          <div class="job-company">${escapeHtml(job.company || '')}</div>
          <div class="job-dates">${escapeHtml(dateLine)}</div>
          <ul>`;
    for (const bullet of job.bullets || []) {
      html += `\n            <li>${escapeHtml(bullet)}</li>`;
    }
    html += `
          </ul>
        </div>`;
  }

  html += `
      </div>
    </div>
    <div class="right-column">
      <div class="section">
        <div class="section-heading">Technical Skills</div>`;

  const skills = resume.technicalSkills || {};
  for (const [category, items] of Object.entries(skills)) {
    const itemsStr = typeof items === 'string' ? items : (Array.isArray(items) ? items.join(', ') : '');
    html += `
        <div class="skill-category">${escapeHtml(category)}</div>
        <div class="skill-items">${escapeHtml(itemsStr)}</div>`;
  }

  html += `
      </div>
      <div class="section">
        <div class="section-heading">Education</div>`;

  for (const edu of resume.education || []) {
    html += `
        <div class="edu-degree">${escapeHtml(edu.degree || '')}</div>
        <div class="edu-school">${escapeHtml(edu.school || '')}</div>
        <div class="edu-dates">${escapeHtml(edu.dates || '')}</div>`;
  }

  html += `
      </div>
    </div>
  </div>
</body>
</html>`;

  return html;
}

function toMarkdown(resume) {
  const lines = [];

  // Header
  lines.push(resume.name || '');
  lines.push('');
  lines.push(resume.tagline || '');
  lines.push('');
  lines.push('Work Experience');
  lines.push('');

  // Work Experience
  for (const job of resume.workExperience || []) {
    lines.push(job.title || '');
    lines.push(job.company || '');
    const dateLine = job.context
      ? `${job.dates || ''} (${job.context})`
      : job.dates || '';
    lines.push(dateLine);
    for (const bullet of job.bullets || []) {
      lines.push(bullet);
    }
    lines.push('');
  }

  // Technical Skills
  lines.push('Technical Skills');
  const skills = resume.technicalSkills || {};
  for (const [category, items] of Object.entries(skills)) {
    lines.push(category);
    lines.push(typeof items === 'string' ? items : items.join(', '));
  }
  lines.push('');

  // Education
  lines.push('Education');
  for (const edu of resume.education || []) {
    lines.push(edu.degree || '');
    lines.push(`${edu.school || ''} ${edu.dates || ''}`.trim());
  }
  lines.push('');

  // Publications
  if (resume.publications?.length) {
    lines.push('Publications & Presentations');
    lines.push('Peer-Reviewed Abstracts & Proceedings');
    for (const pub of resume.publications) {
      lines.push(`• ${pub}`);
    }
    lines.push('');
  }

  // Certifications
  if (resume.certifications?.length) {
    lines.push('Certifications');
    for (const cert of resume.certifications) {
      lines.push(cert);
    }
    lines.push('');
  }

  // Technical Work
  if (resume.technicalWork?.length) {
    lines.push('Technical Work');
    for (const tw of resume.technicalWork) {
      lines.push(tw);
    }
    lines.push('');
  }

  // Contact
  const c = resume.contact || {};
  const contactParts = [
    c.location,
    c.phone,
    c.email,
    ...(c.links || []),
  ].filter(Boolean);
  lines.push(contactParts.join(' | '));
  lines.push('');

  return lines.join('\n');
}

async function toPdf(html, outputPath) {
  const { execSync } = await import('child_process');
  const { mkdtempSync, writeFileSync, unlinkSync, rmSync } = await import('fs');
  const { tmpdir } = await import('os');
  const { join } = await import('path');

  const tmpDir = mkdtempSync(join(tmpdir(), 'resume-'));
  const htmlPath = join(tmpDir, 'resume.html');

  try {
    writeFileSync(htmlPath, html, 'utf-8');
    const htmlUrl = `file://${htmlPath}`;

    const chromePaths = [
      '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
      '/Applications/Chromium.app/Contents/MacOS/Chromium',
      '/usr/bin/google-chrome',
      '/usr/bin/chromium',
      '/usr/bin/chromium-browser',
    ];

    let chromePath = null;
    const { existsSync } = await import('fs');
    for (const p of chromePaths) {
      if (existsSync(p)) {
        chromePath = p;
        break;
      }
    }

    if (!chromePath) {
      throw new Error(
        'Chrome/Chromium not found. Install Chrome or use: npm run resume:build -- --output resume.html --format html, then open in browser and Print → Save as PDF'
      );
    }

    execSync(
      `"${chromePath}" --headless --disable-gpu --no-pdf-header-footer --print-to-pdf="${outputPath}" "${htmlUrl}"`,
      { stdio: 'pipe', timeout: 15000 }
    );
  } finally {
    rmSync(tmpDir, { recursive: true, force: true });
  }
}

async function main() {
  const args = process.argv.slice(2);
  const inputIdx = args.indexOf('--input');
  const outputIdx = args.indexOf('--output');
  const formatIdx = args.indexOf('--format');
  const inputPath = inputIdx >= 0 ? args[inputIdx + 1] : join(__dirname, 'sample.json');
  const outputPath = outputIdx >= 0 ? args[outputIdx + 1] : null;
  const format = formatIdx >= 0 ? (args[formatIdx + 1] || 'md').toLowerCase() : 'md';

  const resume = loadResume(inputPath);

  if (format === 'pdf') {
    const html = toHtml(resume);
    const { tmpdir } = await import('os');
    const pdfPath = outputPath || join(tmpdir(), 'resume.pdf');
    await toPdf(html, pdfPath);
    console.log('PDF written to:', pdfPath);
    return;
  }

  const content = format === 'html' ? toHtml(resume) : toMarkdown(resume);

  if (outputPath) {
    writeFileSync(outputPath, content, 'utf-8');
    console.log('Resume written to:', outputPath);
  } else {
    console.log(content);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
