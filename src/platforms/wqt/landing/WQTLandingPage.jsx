/**
 * WQTLandingPage — rebuilt marketing page for waterquality.trading.
 * Deregulated water quality trading platform.
 * All content traceable to the market mechanics document.
 */

import React from 'react';
import { HeroSection } from './HeroSection';
import { CreditDefinitionsSection } from './CreditDefinitionsSection';
import { VerificationSection } from './VerificationSection';
import { PricingSection } from './PricingSection';
import { SettlementSection } from './SettlementSection';
import { GreeksSection } from './GreeksSection';
import { AggregatorSection } from './AggregatorSection';
import { AudienceSection } from './AudienceSection';
import { WQTFooter } from './WQTFooter';

export function WQTLandingPage() {
  return (
    <>
      <HeroSection />
      <CreditDefinitionsSection />
      <VerificationSection />
      <PricingSection />
      <SettlementSection />
      <GreeksSection />
      <AggregatorSection />
      <AudienceSection />
      <WQTFooter />
    </>
  );
}
