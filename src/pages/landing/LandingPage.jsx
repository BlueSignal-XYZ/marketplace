/**
 * BlueSignal Landing Page — bluesignal.xyz
 *
 * FRONTEND AUDIT CHECKLIST
 * Run this checklist after every significant change.
 *
 * Visual Audit (Manual — Every PR)
 * - [ ] Orphan check: Scan every paragraph/heading at 1440, 1024, 768, 480, 375px. No single-word final lines.
 * - [ ] Spec value wrapping: No spec value wraps mid-value at any viewport.
 * - [ ] Card grid alignment: All grids maintain 2px gap pattern, consistent row heights.
 * - [ ] Animation smoothness: All CSS animations at 60fps. Test with 4x CPU slowdown.
 * - [ ] Font rendering: Outfit + IBM Plex Mono load correctly. No FOUT.
 * - [ ] Color consistency: All colors from theme.js. No hardcoded hex outside theme.
 * - [ ] Dark theme contrast: All text meets WCAG AA against #08090a / #0f1114.
 * - [ ] Hover states: Every interactive element has visible hover with smooth transition.
 * - [ ] Focus states: Every interactive element has visible focus indicator.
 *
 * Responsive Audit (Manual — Every PR)
 * - [ ] 375px (iPhone SE): Text readable, buttons full-width, no horizontal scroll.
 * - [ ] 480px (small phone): Hero headline max 3 lines, CTAs stack, footer 1-col.
 * - [ ] 768px (tablet): Nav links hidden, sensor grid 1-col, use cases 1-col.
 * - [ ] 1024px (small desktop): Sensor grid 3-col, architecture 1-col, use cases 2x2.
 * - [ ] 1440px (desktop): Full layout, SVG scene fully visible, nothing overflows.
 * - [ ] 1920px+: 1320px container centered, readable line lengths.
 *
 * Performance Audit (Automated — CI)
 * - [ ] Lighthouse Performance > 90 on mobile.
 * - [ ] FCP < 1.5s on 3G throttle.
 * - [ ] CLS < 0.1.
 * - [ ] Landing page JS < 50KB gzipped.
 * - [ ] No unused CSS leakage.
 *
 * Code Audit (Automated — CI)
 * - [ ] No hardcoded color/font/spacing strings outside theme.js.
 * - [ ] No inline styles except justified SVG attributes.
 * - [ ] All styled-components have meaningful names.
 * - [ ] No console.log statements.
 * - [ ] No patterns breaking future TSX migration.
 */

import Nav from './components/Nav';
import Footer from './components/Footer';
import HeroSection from './sections/HeroSection';
import SensorGrid from './sections/SensorGrid';
import ArchitectureSection from './sections/ArchitectureSection';
import UseCasesSection from './sections/UseCasesSection';
import InstallationBanner from './sections/InstallationBanner';
import SpecsSection from './sections/SpecsSection';
import CTASection from './sections/CTASection';

const LandingPage = () => (
  <>
    <Nav />
    <main>
      <HeroSection />
      <SensorGrid />
      <ArchitectureSection />
      <UseCasesSection />
      <InstallationBanner />
      <SpecsSection />
      <CTASection />
    </main>
    <Footer />
  </>
);

export default LandingPage;
