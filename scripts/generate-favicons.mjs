/**
 * Generate favicon raster images from SVG.
 * Run: node scripts/generate-favicons.mjs
 * Requires: npm install sharp (dev dependency)
 *
 * Generates:
 *   public/favicon.ico (32x32 PNG renamed - browsers accept PNG favicons)
 *   public/apple-touch-icon.png (180x180)
 *   public/android-chrome-192x192.png (192x192)
 *   public/android-chrome-512x512.png (512x512)
 */
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const publicDir = join(root, 'public');

// Read the SVG source
const svgSource = readFileSync(join(publicDir, 'favicon.svg'), 'utf-8');

// Create a larger SVG for better rasterization
function createSvgAtSize(size) {
  return svgSource
    .replace('width="32"', `width="${size}"`)
    .replace('height="32"', `height="${size}"`)
    .replace('viewBox="0 0 32 32"', 'viewBox="0 0 32 32"');
}

async function main() {
  try {
    const sharp = (await import('sharp')).default;

    const sizes = [
      { name: 'favicon.ico', size: 32 },
      { name: 'apple-touch-icon.png', size: 180 },
      { name: 'android-chrome-192x192.png', size: 192 },
      { name: 'android-chrome-512x512.png', size: 512 },
    ];

    for (const { name, size } of sizes) {
      const svg = Buffer.from(createSvgAtSize(size));
      await sharp(svg)
        .resize(size, size)
        .png()
        .toFile(join(publicDir, name));
      console.log(`  Created ${name} (${size}x${size})`);
    }

    console.log('Favicon generation complete!');
  } catch (e) {
    console.error('sharp not available. Install with: npm install -D sharp');
    console.error('Then run: node scripts/generate-favicons.mjs');
    process.exit(1);
  }
}

main();
