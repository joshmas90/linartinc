#!/usr/bin/env node

/**
 * Create route-specific HTML shells after Vite builds the SPA.
 *
 * Apache internally maps /about, /services, and the other public routes to
 * these files. Visitors still get the same React application, while crawlers
 * and social preview bots receive correct metadata before JavaScript runs.
 */

import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { routeMeta, siteUrl } from '../src/content/siteMeta.js';

const outDir = path.resolve('../../dist/apps/web');
const indexPath = path.join(outDir, 'index.html');
const template = await readFile(indexPath, 'utf8');

const escapeHtml = (value) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');

const replaceRequired = (html, pattern, replacement, label) => {
  if (!pattern.test(html)) throw new Error(`Could not find ${label} in built index.html`);
  return html.replace(pattern, replacement);
};

const setMeta = (html, attribute, key, value) =>
  replaceRequired(
    html,
    new RegExp(`(<meta data-react-helmet="true" ${attribute}="${key}" content=")[^"]*(" \/>)`),
    `$1${escapeHtml(value)}$2`,
    `${attribute}="${key}"`,
  );

for (const [route, meta] of Object.entries(routeMeta)) {
  if (route === '/') continue;

  const canonical = `${siteUrl}${route}`;
  let html = template;
  html = replaceRequired(
    html,
    /(<title data-react-helmet="true">)[\s\S]*?(<\/title>)/,
    `$1${escapeHtml(meta.title)}$2`,
    'title',
  );
  html = replaceRequired(
    html,
    /(<link data-react-helmet="true" rel="canonical" href=")[^"]*(" \/>)/,
    `$1${canonical}$2`,
    'canonical link',
  );
  html = setMeta(html, 'name', 'description', meta.description);
  html = setMeta(html, 'property', 'og:title', meta.title);
  html = setMeta(html, 'property', 'og:description', meta.description);
  html = setMeta(html, 'property', 'og:url', canonical);
  html = setMeta(html, 'name', 'twitter:title', meta.title);
  html = setMeta(html, 'name', 'twitter:description', meta.description);

  const output = path.join(outDir, `${route.slice(1)}.html`);
  await writeFile(output, html);
  process.stdout.write(`  ${path.basename(output)}\n`);
}

console.log('✓ Route metadata shells generated.');
