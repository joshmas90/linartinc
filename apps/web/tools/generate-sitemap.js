#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { routeMeta, siteUrl } from '../src/content/siteMeta.js';

const OUT = path.join(process.cwd(), 'public', 'sitemap.xml');

const escapeXml = (value) =>
  String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');

const rows = Object.entries(routeMeta)
  .sort(([a], [b]) => {
    if (a === '/') return -1;
    if (b === '/') return 1;
    return a.localeCompare(b);
  })
  .map(([route, meta]) => {
    const loc = `${siteUrl}${route === '/' ? '/' : route}`;
    return [
      '  <url>',
      `    <loc>${escapeXml(loc)}</loc>`,
      meta.lastmod ? `    <lastmod>${escapeXml(meta.lastmod)}</lastmod>` : null,
      meta.changefreq ? `    <changefreq>${escapeXml(meta.changefreq)}</changefreq>` : null,
      meta.priority ? `    <priority>${escapeXml(meta.priority)}</priority>` : null,
      '  </url>',
    ]
      .filter(Boolean)
      .join('\n');
  })
  .join('\n');

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${rows}
</urlset>
`;

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, xml);

console.log(`✓ sitemap.xml written with ${Object.keys(routeMeta).length} canonical routes.`);
