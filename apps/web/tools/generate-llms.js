#!/usr/bin/env node
/**
 * Generates public/llms.txt from the single source of route metadata.
 *
 * The previous version scanned src/pages for per-page <Helmet> blocks. Those
 * were removed in favour of src/components/SiteMeta.jsx, which now owns every
 * title, description and canonical. This reads that file directly, so there is
 * one place to edit metadata instead of two that can drift apart.
 *
 * (The old scanner also treated the `//` in an https:// URL as a JavaScript
 * line comment, which silently blanked any Helmet block containing a canonical
 * tag. Parsing one known object avoids that whole class of problem.)
 */

import fs from 'fs';
import path from 'path';

const SITE_META = path.join(process.cwd(), 'src', 'components', 'SiteMeta.jsx');
const OUT = path.join(process.cwd(), 'public', 'llms.txt');

function fail(message) {
	console.error(`❌ ${message}`);
	process.exit(1);
}

if (!fs.existsSync(SITE_META)) fail(`SiteMeta.jsx not found at ${SITE_META}`);

const source = fs.readFileSync(SITE_META, 'utf8');

const block = source.match(/const routeMeta = \{([\s\S]*?)\n\};/);
if (!block) fail('Could not find the routeMeta object in SiteMeta.jsx');

const entry = /'([^']+)':\s*\{\s*title:\s*'((?:[^'\\]|\\.)*)',\s*description:\s*'((?:[^'\\]|\\.)*)',?\s*\}/g;

const unescape = (v) => v.replace(/\\'/g, "'").replace(/\\\\/g, '\\');

const pages = [...block[1].matchAll(entry)].map(([, url, title, description]) => ({
	url,
	title: unescape(title),
	description: unescape(description),
}));

if (pages.length === 0) fail('No routes parsed from routeMeta — check the object formatting.');

const body = pages
	.sort((a, b) => a.title.localeCompare(b.title))
	.map((p) => `- [${p.title}](${p.url}): ${p.description}`)
	.join('\n');

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, `## Pages\n${body}\n`);

console.log(`✓ llms.txt written with ${pages.length} routes.`);
