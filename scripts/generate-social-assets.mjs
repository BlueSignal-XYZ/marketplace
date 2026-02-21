#!/usr/bin/env node
/**
 * Generate distinct OG images + favicons for each site.
 * Uses sharp (already installed) to convert inline SVGs to PNG.
 *
 * Output:
 *   public/og-image-wqt.png      1200×630
 *   public/og-image-cloud.png    1200×630
 *   public/og-image-bs.png       1200×630  (landing — bluesignal.xyz)
 *   public/favicon-wqt-16.png    16×16
 *   public/favicon-wqt-32.png    32×32
 *   public/apple-touch-icon-wqt.png  180×180
 *   public/favicon-bs-16.png     16×16
 *   public/favicon-bs-32.png     32×32
 *   public/apple-touch-icon-bs.png   180×180
 */

import sharp from 'sharp';
import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC = join(__dirname, '..', 'public');

async function svgToPng(svgString, outPath, width, height) {
  await sharp(Buffer.from(svgString))
    .resize(width, height)
    .png()
    .toFile(outPath);
  console.log(`  ✓ ${outPath.replace(PUBLIC + '/', '')} (${width}×${height})`);
}

// ── OG Images (1200×630) ────────────────────────────────────

const ogWqtSvg = `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="wqt-bg" x1="0" y1="0" x2="0.5" y2="1">
      <stop offset="0%" stop-color="#0A1628"/>
      <stop offset="100%" stop-color="#162240"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#wqt-bg)"/>
  <!-- Subtle grid pattern -->
  <g opacity="0.04">
    ${Array.from({length: 15}, (_, i) => `<line x1="${80*i}" y1="0" x2="${80*i}" y2="630" stroke="white" stroke-width="1"/>`).join('')}
    ${Array.from({length: 8}, (_, i) => `<line x1="0" y1="${80*i}" x2="1200" y2="${80*i}" stroke="white" stroke-width="1"/>`).join('')}
  </g>
  <text x="600" y="245" text-anchor="middle" fill="#ffffff"
    font-family="system-ui, -apple-system, sans-serif" font-size="54" font-weight="700" letter-spacing="-1">
    WaterQuality.Trading
  </text>
  <text x="600" y="305" text-anchor="middle" fill="#94a3b8"
    font-family="system-ui, -apple-system, sans-serif" font-size="26" font-weight="400">
    Verified Water Quality Credit Marketplace
  </text>
  <line x1="440" y1="355" x2="760" y2="355" stroke="#1e3a5f" stroke-width="1"/>
  <text x="600" y="405" text-anchor="middle" fill="#64748b"
    font-family="system-ui, -apple-system, sans-serif" font-size="18" font-weight="400">
    Nitrogen · Phosphorus · Sediment Credits
  </text>
  <text x="600" y="560" text-anchor="middle" fill="#475569"
    font-family="system-ui, -apple-system, sans-serif" font-size="16">
    Powered by BlueSignal
  </text>
</svg>`;

const ogCloudSvg = `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="630" fill="#f8fafc"/>
  <rect x="0" y="0" width="1200" height="4" fill="#0066FF"/>
  <!-- Subtle dot grid -->
  <g opacity="0.06">
    ${Array.from({length: 12}, (_, i) =>
      Array.from({length: 6}, (_, j) =>
        `<circle cx="${100 + 100*i}" cy="${100 + 80*j}" r="2" fill="#94a3b8"/>`
      ).join('')
    ).join('')}
  </g>
  <text x="600" y="250" text-anchor="middle" fill="#0f172a"
    font-family="system-ui, -apple-system, sans-serif" font-size="54" font-weight="700" letter-spacing="-1">
    BlueSignal Cloud
  </text>
  <text x="600" y="310" text-anchor="middle" fill="#64748b"
    font-family="system-ui, -apple-system, sans-serif" font-size="26" font-weight="400">
    Water Quality Monitoring Platform
  </text>
  <line x1="440" y1="355" x2="760" y2="355" stroke="#e2e8f0" stroke-width="1"/>
  <text x="600" y="405" text-anchor="middle" fill="#94a3b8"
    font-family="system-ui, -apple-system, sans-serif" font-size="18">
    Devices · Sites · Analytics · Verification
  </text>
  <text x="600" y="555" text-anchor="middle" fill="#94a3b8"
    font-family="system-ui, -apple-system, sans-serif" font-size="16">
    cloud.bluesignal.xyz
  </text>
</svg>`;

const ogBsSvg = `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bs-bg" x1="0" y1="0" x2="0.3" y2="1">
      <stop offset="0%" stop-color="#08090a"/>
      <stop offset="100%" stop-color="#111318"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bs-bg)"/>
  <!-- Wave decoration -->
  <path d="M0 420 C200 380, 400 460, 600 420 C800 380, 1000 460, 1200 420 L1200 630 L0 630 Z" fill="rgba(45,140,240,0.06)"/>
  <path d="M0 460 C200 420, 400 500, 600 460 C800 420, 1000 500, 1200 460 L1200 630 L0 630 Z" fill="rgba(45,140,240,0.04)"/>
  <text x="600" y="240" text-anchor="middle" fill="#ffffff"
    font-family="system-ui, -apple-system, sans-serif" font-size="54" font-weight="700" letter-spacing="-1">
    BlueSignal
  </text>
  <text x="600" y="300" text-anchor="middle" fill="rgba(255,255,255,0.6)"
    font-family="system-ui, -apple-system, sans-serif" font-size="26" font-weight="400">
    Water Quality Monitoring Hardware
  </text>
  <line x1="440" y1="345" x2="760" y2="345" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
  <text x="600" y="395" text-anchor="middle" fill="rgba(255,255,255,0.35)"
    font-family="system-ui, -apple-system, sans-serif" font-size="18">
    6-Channel Sensor HAT · LoRaWAN · GPS · Relay Control
  </text>
</svg>`;

// ── Favicons ────────────────────────────────────────────────

// WQT favicon: Dark navy rounded square with "WQ" text
const faviconWqtSvg = (size) => `<svg width="${size}" height="${size}" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
  <rect width="32" height="32" rx="6" fill="#0A1628"/>
  <text x="16" y="22" text-anchor="middle" fill="white"
    font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="700">WQ</text>
</svg>`;

// BlueSignal favicon: Dark square with wave pattern (used for Cloud AND Landing)
const faviconBsSvg = (size) => `<svg width="${size}" height="${size}" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
  <rect width="32" height="32" rx="6" fill="#08090a"/>
  <path d="M5 10 C9 7, 17 7, 27 10" stroke="#2d8cf0" stroke-width="2.5" stroke-linecap="round" fill="none"/>
  <path d="M5 16 C9 13, 17 13, 27 16" stroke="#2d8cf0" stroke-width="2.5" stroke-linecap="round" fill="none"/>
  <path d="M5 22 C9 19, 17 19, 27 22" stroke="#2d8cf0" stroke-width="2.5" stroke-linecap="round" fill="none"/>
</svg>`;

async function main() {
  console.log('Generating social / metadata assets...\n');

  console.log('OG images (1200×630):');
  await svgToPng(ogWqtSvg, join(PUBLIC, 'og-image-wqt.png'), 1200, 630);
  await svgToPng(ogCloudSvg, join(PUBLIC, 'og-image-cloud.png'), 1200, 630);
  await svgToPng(ogBsSvg, join(PUBLIC, 'og-image-bs.png'), 1200, 630);

  console.log('\nWQT favicons:');
  await svgToPng(faviconWqtSvg(16), join(PUBLIC, 'favicon-wqt-16.png'), 16, 16);
  await svgToPng(faviconWqtSvg(32), join(PUBLIC, 'favicon-wqt-32.png'), 32, 32);
  await svgToPng(faviconWqtSvg(180), join(PUBLIC, 'apple-touch-icon-wqt.png'), 180, 180);

  console.log('\nBlueSignal favicons (Cloud + Landing):');
  await svgToPng(faviconBsSvg(16), join(PUBLIC, 'favicon-bs-16.png'), 16, 16);
  await svgToPng(faviconBsSvg(32), join(PUBLIC, 'favicon-bs-32.png'), 32, 32);
  await svgToPng(faviconBsSvg(180), join(PUBLIC, 'apple-touch-icon-bs.png'), 180, 180);

  console.log('\n✓ All social assets generated.');
}

main().catch(err => {
  console.error('Failed to generate assets:', err);
  process.exit(1);
});
