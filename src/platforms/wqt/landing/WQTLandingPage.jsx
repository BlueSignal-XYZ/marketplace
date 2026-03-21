/**
 * WQTLandingPage — redesigned marketing page for waterquality.trading.
 * Water Demand Response Platform.
 */

import React from 'react';
import styled from 'styled-components';
import { HeroSection } from './HeroSection';
import { ProblemSection } from './ProblemSection';
import { SolutionSection } from './SolutionSection';
import { HowItWorksSection } from './HowItWorksSection';
import { ByTheNumbersSection } from './ByTheNumbersSection';
import { AudienceSection } from './AudienceSection';
import { CTASection } from './CTASection';
import { WQTFooter } from './WQTFooter';

const PageWrapper = styled.div`
  background: #0B1120;
  min-height: 100vh;
`;

export function WQTLandingPage() {
  return (
    <PageWrapper>
      <HeroSection />
      <ProblemSection />
      <SolutionSection />
      <HowItWorksSection />
      <ByTheNumbersSection />
      <AudienceSection />
      <CTASection />
      <WQTFooter />
    </PageWrapper>
  );
}
