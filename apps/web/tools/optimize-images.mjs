#!/usr/bin/env node
/**
 * Regenerates the responsive image variants that <Img> expects.
 *
 *   npm i -D sharp
 *   node tools/optimize-images.mjs
 *
 * For every public/images/**\/*.webp that is NOT already a variant, this writes
 * <name>-480.webp, <name>-960.webp and <name>-1600.webp alongside it and
 * re-encodes the original with a 1600px cap.
 *
 * Run this whenever you add project photos. If you forget, <Img> will request
 * variant files that do not exist and those images will 404.
 */

import { readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = path.resolve('public/images');
const WIDTHS = [480, 960, 1600];
const QUALITY = 74;
const MAX_EDGE = 1600;
const VARIANT = /-(?:480|960|1600)\.webp$/i;

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else if (/\.webp$/i.test(entry.name) && !VARIANT.test(entry.name)) yield full;
  }
}

const fmt = (b) => `${(b / 1024).toFixed(0)} KB`;

let before = 0;
let after = 0;
let count = 0;

for await (const file of walk(ROOT)) {
  before += (await stat(file)).size;
  const base = file.replace(/\.webp$/i, '');
  const input = sharp(file);
  const { width, height } = await input.metadata();

  // Re-encode the original with a size cap
  const capped = await sharp(file)
    .resize({ width: Math.min(width, MAX_EDGE), withoutEnlargement: true })
    .webp({ quality: QUALITY, effort: 6 })
    .toBuffer();
  await sharp(capped).toFile(`${base}.tmp.webp`);

  for (const w of WIDTHS) {
    const out = `${base}-${w}.webp`;
    await sharp(file)
      .resize({ width: Math.min(width, w), withoutEnlargement: true })
      .webp({ quality: QUALITY, effort: 6 })
      .toFile(out);
    after += (await stat(out)).size;
  }

  const { rename } = await import('node:fs/promises');
  await rename(`${base}.tmp.webp`, file);
  after += (await stat(file)).size;
  count += 1;
  process.stdout.write(`  ${path.relative(ROOT, file)} (${width}×${height})\n`);
}

console.log(`\n${count} source images processed.`);
console.log(`Originals before: ${fmt(before)}   Generated set on disk: ${fmt(after)}`);
console.log('Visitors download only the variant that matches their viewport.');
