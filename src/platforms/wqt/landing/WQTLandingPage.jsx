/**
 * WQTLandingPage — standalone marketing page for waterquality.trading.
 * Sells the PLATFORM, not the hardware.
 * Shown to unauthenticated visitors.
 */

import React from 'react';
import { HeroSection } from './HeroSection';
import { MarketSnapshotBar } from './MarketSnapshotBar';
import { PillarsSection } from './PillarsSection';
import { AudienceSection } from './AudienceSection';
import { TrustSection } from './TrustSection';
import { WQTFooter } from './WQTFooter';

export function WQTLandingPage() {
  return (
    <>
      <HeroSection />
      <MarketSnapshotBar />
      <PillarsSection />
      <AudienceSection />
      <TrustSection />
      <WQTFooter />
    </>
  );
}
