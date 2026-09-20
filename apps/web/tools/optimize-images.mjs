#!/usr/bin/env node
/**
 * Regenerates the responsive image variants that <Img> expects.
 *
 *   npm run images:optimize
 *
 * For every source WebP in public/images, this writes responsive variants at
 * true pixel widths, re-encodes the source with a 2048px cap, and generates the
 * manifest consumed by <Img>. Sources narrower than a target are never enlarged
 * or mislabeled in srcset. Pass one or more source paths to process only those
 * photos while still refreshing the complete manifest, or pass --manifest-only
 * to refresh metadata without re-encoding any image.
 *
 * Run this whenever you add project photos. Until the manifest is regenerated,
 * <Img> safely falls back to the original photo without a responsive srcset.
 */

import { mkdir, readFile, readdir, stat, unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = path.resolve('public/images');
const MANIFEST = path.resolve('src/generated/imageManifest.js');
const WIDTHS = [480, 960, 1600, 2048];
const QUALITY = 80;
const MAX_EDGE = 2048;
const args = process.argv.slice(2);
const manifestOnly = args.includes('--manifest-only');
const requestedFiles = new Set(args.filter((arg) => arg !== '--manifest-only').map((file) => path.resolve(file)));

if (manifestOnly && requestedFiles.size > 0) {
  throw new Error('--manifest-only cannot be combined with image source paths.');
}
async function* walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const filenames = new Set(entries.filter((entry) => entry.isFile()).map((entry) => entry.name));

  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else if (/\.tmp\.webp$/i.test(entry.name)) await unlink(full);
    else if (/\.webp$/i.test(entry.name)) {
      const candidate = entry.name.match(/^(.*)-(\d+)\.webp$/i);
      const isGeneratedVariant = candidate && filenames.has(`${candidate[1]}.webp`);
      if (!isGeneratedVariant) yield full;
    }
  }
}

const fmt = (b) => `${(b / 1024).toFixed(0)} KB`;

let before = 0;
let after = 0;
let count = 0;
let processed = 0;
const manifest = {};
const expectedVariants = new Set();
const matchedRequests = new Set();

for await (const file of walk(ROOT)) {
  const source = await readFile(file);
  const base = file.replace(/\.webp$/i, '');
  const { width, height } = await sharp(source).metadata();

  if (!width || !height) {
    throw new Error(`Could not read image dimensions: ${file}`);
  }

  const outputWidth = Math.min(width, MAX_EDGE);
  const outputHeight = Math.round(height * (outputWidth / width));
  const candidates = [...new Set(WIDTHS.map((target) => Math.min(outputWidth, target)))].sort((a, b) => a - b);
  const absoluteFile = path.resolve(file);
  const shouldProcess = !manifestOnly && (requestedFiles.size === 0 || requestedFiles.has(absoluteFile));

  for (const w of candidates) expectedVariants.add(path.resolve(`${base}-${w}.webp`));

  if (shouldProcess) {
    before += (await stat(file)).size;
    matchedRequests.add(absoluteFile);

    const directory = path.dirname(file);
    const stem = path.basename(base);
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const candidate = entry.name.match(/^(.*)-(\d+)\.webp$/i);
      if (entry.isFile() && candidate?.[1] === stem) {
        await unlink(path.join(directory, entry.name));
      }
    }

    // Re-encode the original with a size cap
    const capped = await sharp(source)
      .resize({ width: outputWidth, withoutEnlargement: true })
      .webp({ quality: QUALITY, effort: 6 })
      .toBuffer();
    for (const w of candidates) {
      const out = `${base}-${w}.webp`;
      await sharp(source)
        .resize({ width: w, withoutEnlargement: true })
        .webp({ quality: QUALITY, effort: 6 })
        .toFile(out);
      after += (await stat(out)).size;
    }

    await writeFile(file, capped);
    after += (await stat(file)).size;
    processed += 1;
    process.stdout.write(`  ${path.relative(ROOT, file)} (${width}×${height})\n`);
  }

  const relative = path.relative(path.resolve('public'), file).split(path.sep).join('/');
  manifest[`/${relative}`] = { width: outputWidth, height: outputHeight, candidates };
  count += 1;
}

const unmatchedRequests = [...requestedFiles].filter((file) => !matchedRequests.has(file));
if (unmatchedRequests.length) {
  throw new Error(`Requested image source not found: ${unmatchedRequests.join(', ')}`);
}

const sourceFiles = new Set(
  Object.keys(manifest).map((src) => path.resolve('public', src.replace(/^\//, ''))),
);

async function removeStaleGeneratedFiles(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await removeStaleGeneratedFiles(full);
      continue;
    }
    if (/\.tmp\.webp$/i.test(entry.name)) {
      await unlink(full);
      continue;
    }
    const candidate = entry.name.match(/^(.*)-(\d+)\.webp$/i);
    const sourceFile = candidate ? path.resolve(dir, `${candidate[1]}.webp`) : null;
    if (sourceFile && sourceFiles.has(sourceFile) && !expectedVariants.has(path.resolve(full))) {
      await unlink(full);
    }
  }
}

await removeStaleGeneratedFiles(ROOT);

const orderedManifest = Object.fromEntries(Object.entries(manifest).sort(([a], [b]) => a.localeCompare(b)));
await mkdir(path.dirname(MANIFEST), { recursive: true });
await writeFile(
  MANIFEST,
  `// Generated by tools/optimize-images.mjs. Do not edit manually.\nexport const responsiveImages = ${JSON.stringify(orderedManifest, null, 2)};\n`,
);

console.log(`\n${processed} of ${count} source images processed.`);
console.log(`Selected sources before: ${fmt(before)}   Selected generated set: ${fmt(after)}`);
console.log(`Manifest: ${path.relative(process.cwd(), MANIFEST)}`);
