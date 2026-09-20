#!/usr/bin/env node

/**
 * Create route-specific HTML shells after Vite builds the SPA.
 * Crawlers and social preview bots receive route-correct metadata before
 * JavaScript runs, while visitors still get the same React application.
 */

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import {
  buildRouteSchema,
  notFoundMeta,
  routeMeta,
  siteUrl,
} from '../src/content/siteMeta.js';

const outDir = path.resolve('../../dist/apps/web');
const indexPath = path.join(outDir, 'index.html');
const template = await readFile(indexPath, 'utf8');

const escapeHtml = (value) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');

const escapeJsonLd = (value) => JSON.stringify(value).replaceAll('<', '\\u003c');

const replaceRequired = (html, pattern, replacement, label) => {
  if (!pattern.test(html)) throw new Error(`Could not find ${label} in built index.html`);
  return html.replace(pattern, replacement);
};

const setMeta = (html, attribute, key, value) =>
  replaceRequired(
    html,
    new RegExp(`(<meta data-react-helmet="true" ${attribute}="${key}" content=")[^"]*(" \\/>)`),
    `$1${escapeHtml(value)}$2`,
    `${attribute}="${key}"`,
  );

const setKnownRouteMeta = (html, route, meta) => {
  const canonical = `${siteUrl}${route}`;
  let result = html;

  result = replaceRequired(
    result,
    /(<title data-react-helmet="true">)[\s\S]*?(<\/title>)/,
    `$1${escapeHtml(meta.title)}$2`,
    'title',
  );
  result = replaceRequired(
    result,
    /(<link data-react-helmet="true" rel="canonical" href=")[^"]*(" \/>)/,
    `$1${canonical}$2`,
    'canonical link',
  );
  result = setMeta(result, 'name', 'description', meta.description);
  result = setMeta(
    result,
    'name',
    'robots',
    'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1',
  );
  result = setMeta(result, 'property', 'og:title', meta.title);
  result = setMeta(result, 'property', 'og:description', meta.description);
  result = setMeta(result, 'property', 'og:url', canonical);
  result = setMeta(result, 'name', 'twitter:title', meta.title);
  result = setMeta(result, 'name', 'twitter:description', meta.description);

  const schema = buildRouteSchema(route);
  if (schema) {
    result = result.replace(
      '</head>',
      `\t\t<script type="application/ld+json" data-route-schema="true">${escapeJsonLd(schema)}</script>\n\t</head>`,
    );
  }

  return result;
};

for (const [route, meta] of Object.entries(routeMeta)) {
  if (route === '/') continue;

  const html = setKnownRouteMeta(template, route, meta);
  const output = path.join(outDir, `${route.slice(1)}.html`);
  await mkdir(path.dirname(output), { recursive: true });
  await writeFile(output, html);
  process.stdout.write(`  ${path.relative(outDir, output)}\n`);
}

let notFound = template;
notFound = replaceRequired(
  notFound,
  /(<title data-react-helmet="true">)[\s\S]*?(<\/title>)/,
  `$1${escapeHtml(notFoundMeta.title)}$2`,
  '404 title',
);
notFound = setMeta(notFound, 'name', 'description', notFoundMeta.description);
notFound = setMeta(notFound, 'name', 'robots', 'noindex,follow');
notFound = notFound.replace(
  /\s*<link data-react-helmet="true" rel="canonical" href="[^"]*" \/>/,
  '',
);
notFound = setMeta(notFound, 'property', 'og:title', notFoundMeta.title);
notFound = setMeta(notFound, 'property', 'og:description', notFoundMeta.description);
notFound = setMeta(notFound, 'property', 'og:url', `${siteUrl}/`);
notFound = setMeta(notFound, 'name', 'twitter:title', notFoundMeta.title);
notFound = setMeta(notFound, 'name', 'twitter:description', notFoundMeta.description);
await writeFile(path.join(outDir, '404.html'), notFound);
process.stdout.write('  404.html\n');

console.log('✓ Route metadata shells and hard-404 shell generated.');
