/**
 * WQTLandingPage — redesigned marketing page for waterquality.trading.
 * Water Demand Response Platform.
 */

import React from 'react';
import { HeroSection } from './HeroSection';
import { ProblemSection } from './ProblemSection';
import { SolutionSection } from './SolutionSection';
import { HowItWorksSection } from './HowItWorksSection';
import { ByTheNumbersSection } from './ByTheNumbersSection';
import { AudienceSection } from './AudienceSection';
import { CTASection } from './CTASection';
import { WQTFooter } from './WQTFooter';

export function WQTLandingPage() {
  return (
    <>
      <HeroSection />
      <ProblemSection />
      <SolutionSection />
      <HowItWorksSection />
      <ByTheNumbersSection />
      <AudienceSection />
      <CTASection />
      <WQTFooter />
    </>
  );
}
