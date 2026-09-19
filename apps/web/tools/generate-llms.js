#!/usr/bin/env node
/** Generates public/llms.txt from the same route metadata used by React. */

import fs from 'fs';
import path from 'path';
import { routeMeta, siteUrl } from '../src/content/siteMeta.js';

const OUT = path.join(process.cwd(), 'public', 'llms.txt');

const pages = Object.entries(routeMeta).map(([route, meta]) => ({
	url: `${siteUrl}${route === '/' ? '/' : route}`,
	...meta,
}));

const body = pages
	.sort((a, b) => a.title.localeCompare(b.title))
	.map((p) => `- [${p.title}](${p.url}): ${p.description}`)
	.join('\n');

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, `## Pages\n${body}\n`);

console.log(`✓ llms.txt written with ${pages.length} routes.`);
