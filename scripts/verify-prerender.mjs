#!/usr/bin/env node
// Verify: does live browser after 5s see the correct title on /pricing?
import puppeteer from 'puppeteer';
import http from 'http';
import { readFileSync, statSync } from 'fs';
import { join, extname } from 'path';

const DIST = 'dist'; const PORT = 4492;
const mime = { '.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.png':'image/png','.jpg':'image/jpeg','.svg':'image/svg+xml','.ico':'image/x-icon','.webp':'image/webp' };

// Serve /pricing as SPA (send index.html for any missing route so React handles it)
const server = http.createServer((req, res) => {
  let url = req.url.split('?')[0]; if (url === '/') url = '/index.html';
  let file = join(DIST, url);
  try { const st = statSync(file); if (st.isDirectory()) file = join(file, 'index.html'); }
  catch { file = join(DIST, 'index.html'); }
  try { const data = readFileSync(file); res.writeHead(200, { 'Content-Type': mime[extname(file)] || 'text/html' }); res.end(data); }
  catch (e) { res.writeHead(500); res.end(e.message); }
});
await new Promise(r => server.listen(PORT, r));

const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });

for (const route of ['/pricing', '/solutions', '/methodology', '/contact', '/case-studies', '/infrastructure']) {
  const page = await browser.newPage();
  await page.goto(`http://localhost:${PORT}${route}`, { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 5000));
  const title = await page.title();
  const helmetCount = await page.evaluate(() => document.querySelectorAll('[data-rh="true"]').length);
  console.log(`${route} → title: "${title}" (helmet=${helmetCount})`);
  await page.close();
}

await browser.close(); server.close();
