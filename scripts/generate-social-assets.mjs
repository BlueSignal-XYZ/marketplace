#!/usr/bin/env node
/**
 * Generate distinct OG images + favicons for each site.
 * Uses sharp (already installed) to convert inline SVGs to PNG.
 *
 * Fonts: Outfit (display) + IBM Plex Mono (mono) — must be installed system-wide.
 *   npm install @fontsource/outfit @fontsource/ibm-plex-mono
 *   Then copy woff/woff2 files to /usr/local/share/fonts/ and run fc-cache -f
 *
 * Output:
 *   public/og-image-wqt.png      1200x630
 *   public/og-image-cloud.png    1200x630
 *   public/og-image-bs.png       1200x630  (landing — bluesignal.xyz)
 *   public/favicon-wqt-16.png    16x16
 *   public/favicon-wqt-32.png    32x32
 *   public/apple-touch-icon-wqt.png  180x180
 *   public/favicon-bs-16.png     16x16
 *   public/favicon-bs-32.png     32x32
 *   public/apple-touch-icon-bs.png   180x180
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

// ── Brand tokens ────────────────────────────────────────────
const font = {
  display: "'Outfit', 'Outfit Thin', sans-serif",
  mono: "'IBM Plex Mono', 'IBM Plex Mono Medium', monospace",
};

const colors = {
  bg: '#08090a',
  surface: '#0f1114',
  surface2: '#151719',
  blue: '#2d8cf0',
  blueB: '#5badff',
  green: '#34d399',
  algae: '#22c55e',
  algaeLight: '#86efac',
  white: '#ffffff',
  w90: 'rgba(255,255,255,0.9)',
  w70: 'rgba(255,255,255,0.7)',
  w50: 'rgba(255,255,255,0.5)',
  w30: 'rgba(255,255,255,0.3)',
  w15: 'rgba(255,255,255,0.15)',
  w08: 'rgba(255,255,255,0.08)',
};

// ── OG Images (1200×630) ────────────────────────────────────

// BlueSignal Landing (bluesignal.xyz) — hero-inspired dark design
const ogBsSvg = `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bs-bg" x1="0" y1="0" x2="0.3" y2="1">
      <stop offset="0%" stop-color="#0c0d10"/>
      <stop offset="100%" stop-color="#08090a"/>
    </linearGradient>
    <linearGradient id="green-grad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${colors.algae}"/>
      <stop offset="50%" stop-color="${colors.algaeLight}"/>
      <stop offset="100%" stop-color="#15803d"/>
    </linearGradient>
    <linearGradient id="blue-glow" x1="0.5" y1="0" x2="0.5" y2="1">
      <stop offset="0%" stop-color="${colors.blue}" stop-opacity="0.15"/>
      <stop offset="100%" stop-color="${colors.blue}" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bs-bg)"/>

  <!-- Subtle radial glow top center -->
  <ellipse cx="600" cy="100" rx="500" ry="300" fill="url(#blue-glow)"/>

  <!-- Wave decoration (from hero) -->
  <path d="M0 430 C200 390, 400 470, 600 430 C800 390, 1000 470, 1200 430 L1200 630 L0 630 Z" fill="rgba(45,140,240,0.05)"/>
  <path d="M0 470 C200 430, 400 510, 600 470 C800 430, 1000 510, 1200 470 L1200 630 L0 630 Z" fill="rgba(45,140,240,0.03)"/>
  <path d="M0 510 C200 470, 400 550, 600 510 C800 470, 1000 550, 1200 510 L1200 630 L0 630 Z" fill="rgba(45,140,240,0.02)"/>

  <!-- Badge pill -->
  <rect x="440" y="135" width="320" height="34" rx="17" fill="rgba(52,211,153,0.12)"/>
  <circle cx="465" cy="152" r="4" fill="${colors.green}"/>
  <text x="600" y="157" text-anchor="middle" fill="${colors.green}"
    font-family="${font.mono}" font-size="12" font-weight="500">
    Raspberry Pi HAT · Open Platform
  </text>

  <!-- Headline: "Monitor. Detect." -->
  <text x="600" y="240" text-anchor="middle" fill="${colors.white}"
    font-family="${font.display}" font-size="64" font-weight="800" letter-spacing="-2">
    Monitor. Detect.
  </text>

  <!-- Headline gradient word: "Control." -->
  <text x="600" y="310" text-anchor="middle" fill="url(#green-grad)"
    font-family="${font.display}" font-size="64" font-weight="800" letter-spacing="-2">
    Control.
  </text>

  <!-- Subhead -->
  <text x="600" y="365" text-anchor="middle" fill="${colors.w50}"
    font-family="${font.display}" font-size="19" font-weight="400">
    Continuous water quality monitoring for tanks, ponds, and treatment systems.
  </text>

  <!-- CTA button simulation -->
  <rect x="453" y="405" width="294" height="48" rx="24" fill="${colors.white}"/>
  <text x="582" y="435" text-anchor="middle" fill="${colors.bg}"
    font-family="${font.display}" font-size="15" font-weight="600">
    Order Dev Kit — $499
  </text>
  <path d="M697 425 L707 425 M703 421 L707 425 L703 429" stroke="${colors.bg}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>

  <!-- Specs bar at bottom -->
  <rect x="150" y="495" width="900" height="54" rx="12" fill="${colors.surface}" stroke="${colors.w08}" stroke-width="1"/>
  <text x="250" y="518" text-anchor="middle" fill="${colors.w50}"
    font-family="${font.mono}" font-size="9" font-weight="500" letter-spacing="0.8" text-transform="uppercase">SENSORS</text>
  <text x="250" y="536" text-anchor="middle" fill="${colors.w70}"
    font-family="${font.mono}" font-size="13" font-weight="500">6-Ch · 16-bit</text>

  <text x="420" y="518" text-anchor="middle" fill="${colors.w50}"
    font-family="${font.mono}" font-size="9" font-weight="500" letter-spacing="0.8">RADIO</text>
  <text x="420" y="536" text-anchor="middle" fill="${colors.w70}"
    font-family="${font.mono}" font-size="13" font-weight="500">SX1262 · 15 km</text>

  <text x="590" y="518" text-anchor="middle" fill="${colors.w50}"
    font-family="${font.mono}" font-size="9" font-weight="500" letter-spacing="0.8">POWER</text>
  <text x="590" y="536" text-anchor="middle" fill="${colors.w70}"
    font-family="${font.mono}" font-size="13" font-weight="500">9 – 24 V DC</text>

  <text x="760" y="518" text-anchor="middle" fill="${colors.w50}"
    font-family="${font.mono}" font-size="9" font-weight="500" letter-spacing="0.8">STORAGE</text>
  <text x="760" y="536" text-anchor="middle" fill="${colors.w70}"
    font-family="${font.mono}" font-size="13" font-weight="500">SQLite WAL</text>

  <text x="930" y="518" text-anchor="middle" fill="${colors.w50}"
    font-family="${font.mono}" font-size="9" font-weight="500" letter-spacing="0.8">CONTROL</text>
  <text x="930" y="536" text-anchor="middle" fill="${colors.w70}"
    font-family="${font.mono}" font-size="13" font-weight="500">Relay · 10 A</text>

  <!-- BlueSignal wordmark bottom -->
  <text x="600" y="595" text-anchor="middle" fill="${colors.w30}"
    font-family="${font.display}" font-size="14" font-weight="600" letter-spacing="0.5">
    bluesignal.xyz
  </text>
</svg>`;

// WaterQuality.Trading — marketplace-focused dark design
const ogWqtSvg = `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="wqt-bg" x1="0" y1="0" x2="0.5" y2="1">
      <stop offset="0%" stop-color="#0A1628"/>
      <stop offset="100%" stop-color="#0d1f3c"/>
    </linearGradient>
    <linearGradient id="wqt-accent" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${colors.blue}"/>
      <stop offset="100%" stop-color="${colors.blueB}"/>
    </linearGradient>
    <linearGradient id="wqt-glow" x1="0.5" y1="0" x2="0.5" y2="1">
      <stop offset="0%" stop-color="${colors.blue}" stop-opacity="0.12"/>
      <stop offset="100%" stop-color="${colors.blue}" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#wqt-bg)"/>

  <!-- Subtle radial glow -->
  <ellipse cx="600" cy="180" rx="500" ry="300" fill="url(#wqt-glow)"/>

  <!-- Grid pattern -->
  <g opacity="0.03">
    ${Array.from({length: 16}, (_, i) => `<line x1="${80*i}" y1="0" x2="${80*i}" y2="630" stroke="white" stroke-width="1"/>`).join('')}
    ${Array.from({length: 9}, (_, i) => `<line x1="0" y1="${70*i}" x2="1200" y2="${70*i}" stroke="white" stroke-width="1"/>`).join('')}
  </g>

  <!-- "Verified" badge -->
  <rect x="435" y="135" width="330" height="34" rx="17" fill="rgba(45,140,240,0.12)"/>
  <text x="600" y="157" text-anchor="middle" fill="${colors.blueB}"
    font-family="${font.mono}" font-size="12" font-weight="500">
    Sensor-Verified · Blockchain-Backed
  </text>

  <!-- Headline -->
  <text x="600" y="243" text-anchor="middle" fill="${colors.white}"
    font-family="${font.display}" font-size="58" font-weight="800" letter-spacing="-2">
    WaterQuality.Trading
  </text>

  <!-- Subhead -->
  <text x="600" y="300" text-anchor="middle" fill="${colors.w50}"
    font-family="${font.display}" font-size="22" font-weight="400">
    The First Verified Water Quality Credit Marketplace
  </text>

  <!-- Divider -->
  <line x1="480" y1="335" x2="720" y2="335" stroke="${colors.w08}" stroke-width="1"/>

  <!-- Credit type cards -->
  <g>
    <!-- Nitrogen -->
    <rect x="195" y="365" width="240" height="80" rx="12" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
    <circle cx="232" cy="393" r="10" fill="rgba(52,211,153,0.15)"/>
    <text x="232" y="397" text-anchor="middle" fill="${colors.green}"
      font-family="${font.mono}" font-size="10" font-weight="600">N</text>
    <text x="252" y="397" fill="${colors.w90}"
      font-family="${font.display}" font-size="15" font-weight="600">Nitrogen Credits</text>
    <text x="232" y="425" fill="${colors.w30}"
      font-family="${font.mono}" font-size="11" font-weight="400">Utility-controlled pricing</text>

    <!-- Phosphorus -->
    <rect x="480" y="365" width="240" height="80" rx="12" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
    <circle cx="517" cy="393" r="10" fill="rgba(45,140,240,0.15)"/>
    <text x="517" y="397" text-anchor="middle" fill="${colors.blue}"
      font-family="${font.mono}" font-size="10" font-weight="600">P</text>
    <text x="537" y="397" fill="${colors.w90}"
      font-family="${font.display}" font-size="15" font-weight="600">Phosphorus Credits</text>
    <text x="517" y="425" fill="${colors.w30}"
      font-family="${font.mono}" font-size="11" font-weight="400">Three-layer verification</text>

    <!-- Sediment -->
    <rect x="765" y="365" width="240" height="80" rx="12" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
    <circle cx="802" cy="393" r="10" fill="rgba(251,191,36,0.15)"/>
    <text x="802" y="397" text-anchor="middle" fill="#fbbf24"
      font-family="${font.mono}" font-size="10" font-weight="600">S</text>
    <text x="822" y="397" fill="${colors.w90}"
      font-family="${font.display}" font-size="15" font-weight="600">Sediment Credits</text>
    <text x="802" y="425" fill="${colors.w30}"
      font-family="${font.mono}" font-size="11" font-weight="400">Sensor-verified removal</text>
  </g>

  <!-- CTA area -->
  <rect x="460" y="485" width="280" height="46" rx="23" fill="${colors.white}"/>
  <text x="600" y="514" text-anchor="middle" fill="#0A1628"
    font-family="${font.display}" font-size="15" font-weight="600">
    Explore the Marketplace
  </text>

  <!-- Footer -->
  <text x="600" y="585" text-anchor="middle" fill="${colors.w30}"
    font-family="${font.display}" font-size="13" font-weight="500">
    Powered by BlueSignal · Built for Utilities, Homeowners, and Aggregators
  </text>
</svg>`;

// BlueSignal Cloud — monitoring dashboard feel, dark theme to match brand
const ogCloudSvg = `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="cl-bg" x1="0" y1="0" x2="0.5" y2="1">
      <stop offset="0%" stop-color="#0a0e17"/>
      <stop offset="100%" stop-color="#08090a"/>
    </linearGradient>
    <linearGradient id="cl-glow" x1="0.5" y1="0" x2="0.5" y2="1">
      <stop offset="0%" stop-color="${colors.blue}" stop-opacity="0.1"/>
      <stop offset="100%" stop-color="${colors.blue}" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="cl-bar" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${colors.blue}"/>
      <stop offset="100%" stop-color="${colors.blueB}"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#cl-bg)"/>

  <!-- Top accent bar -->
  <rect x="0" y="0" width="1200" height="3" fill="url(#cl-bar)"/>

  <!-- Subtle glow -->
  <ellipse cx="600" cy="120" rx="500" ry="250" fill="url(#cl-glow)"/>

  <!-- Cloud badge -->
  <rect x="460" y="130" width="280" height="34" rx="17" fill="rgba(45,140,240,0.12)"/>
  <circle cx="485" cy="147" r="4" fill="${colors.blue}"/>
  <text x="600" y="152" text-anchor="middle" fill="${colors.blueB}"
    font-family="${font.mono}" font-size="12" font-weight="500">
    Real-Time Monitoring Platform
  </text>

  <!-- Headline -->
  <text x="600" y="235" text-anchor="middle" fill="${colors.white}"
    font-family="${font.display}" font-size="58" font-weight="800" letter-spacing="-2">
    BlueSignal Cloud
  </text>

  <!-- Subhead -->
  <text x="600" y="285" text-anchor="middle" fill="${colors.w50}"
    font-family="${font.display}" font-size="20" font-weight="400">
    Water Quality Monitoring &amp; Device Fleet Management
  </text>

  <!-- Dashboard preview cards -->
  <g>
    <!-- Card 1: Devices -->
    <rect x="115" y="330" width="220" height="120" rx="12" fill="${colors.surface}" stroke="${colors.w08}" stroke-width="1"/>
    <text x="140" y="360" fill="${colors.w50}"
      font-family="${font.mono}" font-size="10" font-weight="500" letter-spacing="0.8">DEVICES ONLINE</text>
    <text x="140" y="400" fill="${colors.white}"
      font-family="${font.display}" font-size="36" font-weight="700">24</text>
    <text x="192" y="400" fill="${colors.green}"
      font-family="${font.mono}" font-size="12" font-weight="500">● Active</text>
    <text x="140" y="430" fill="${colors.w30}"
      font-family="${font.mono}" font-size="11">Across 8 sites</text>

    <!-- Card 2: pH Level -->
    <rect x="370" y="330" width="220" height="120" rx="12" fill="${colors.surface}" stroke="${colors.w08}" stroke-width="1"/>
    <text x="395" y="360" fill="${colors.w50}"
      font-family="${font.mono}" font-size="10" font-weight="500" letter-spacing="0.8">AVG pH LEVEL</text>
    <text x="395" y="400" fill="${colors.white}"
      font-family="${font.display}" font-size="36" font-weight="700">7.2</text>
    <text x="452" y="400" fill="${colors.green}"
      font-family="${font.mono}" font-size="12" font-weight="500">Normal</text>
    <!-- Mini sparkline -->
    <polyline points="395,428 410,422 425,426 440,418 455,420 470,414 485,416 500,410 515,412 530,406 545,408 560,402"
      fill="none" stroke="${colors.blue}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" opacity="0.6"/>

    <!-- Card 3: Alerts -->
    <rect x="625" y="330" width="220" height="120" rx="12" fill="${colors.surface}" stroke="${colors.w08}" stroke-width="1"/>
    <text x="650" y="360" fill="${colors.w50}"
      font-family="${font.mono}" font-size="10" font-weight="500" letter-spacing="0.8">ALERTS (24H)</text>
    <text x="650" y="400" fill="${colors.white}"
      font-family="${font.display}" font-size="36" font-weight="700">0</text>
    <text x="675" y="400" fill="${colors.green}"
      font-family="${font.mono}" font-size="12" font-weight="500">All clear</text>
    <text x="650" y="430" fill="${colors.w30}"
      font-family="${font.mono}" font-size="11">Last alert: 3 days ago</text>

    <!-- Card 4: Verification -->
    <rect x="880" y="330" width="220" height="120" rx="12" fill="${colors.surface}" stroke="${colors.w08}" stroke-width="1"/>
    <text x="905" y="360" fill="${colors.w50}"
      font-family="${font.mono}" font-size="10" font-weight="500" letter-spacing="0.8">VERIFIED CREDITS</text>
    <text x="905" y="400" fill="${colors.white}"
      font-family="${font.display}" font-size="36" font-weight="700">156</text>
    <text x="970" y="400" fill="${colors.blueB}"
      font-family="${font.mono}" font-size="12" font-weight="500">This month</text>
    <text x="905" y="430" fill="${colors.w30}"
      font-family="${font.mono}" font-size="11">↑ 23% vs last month</text>
  </g>

  <!-- Feature list -->
  <text x="600" y="505" text-anchor="middle" fill="${colors.w30}"
    font-family="${font.mono}" font-size="13" font-weight="400">
    Devices · Sites · Analytics · Verification · Automation
  </text>

  <!-- CTA -->
  <rect x="472" y="530" width="256" height="44" rx="22" fill="${colors.white}"/>
  <text x="600" y="558" text-anchor="middle" fill="${colors.bg}"
    font-family="${font.display}" font-size="14" font-weight="600">
    Open Cloud Dashboard
  </text>

  <!-- Footer -->
  <text x="600" y="610" text-anchor="middle" fill="${colors.w30}"
    font-family="${font.display}" font-size="13" font-weight="500">
    cloud.bluesignal.xyz
  </text>
</svg>`;

// ── Favicons ────────────────────────────────────────────────

// WQT favicon: Dark navy rounded square with "WQ" text
const faviconWqtSvg = (size) => `<svg width="${size}" height="${size}" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
  <rect width="32" height="32" rx="6" fill="#0A1628"/>
  <text x="16" y="22" text-anchor="middle" fill="white"
    font-family="${font.display}" font-size="14" font-weight="700">WQ</text>
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
  await svgToPng(ogBsSvg, join(PUBLIC, 'og-image-bs.png'), 1200, 630);
  await svgToPng(ogWqtSvg, join(PUBLIC, 'og-image-wqt.png'), 1200, 630);
  await svgToPng(ogCloudSvg, join(PUBLIC, 'og-image-cloud.png'), 1200, 630);

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
