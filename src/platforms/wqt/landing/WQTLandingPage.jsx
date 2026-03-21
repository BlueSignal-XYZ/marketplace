/**
 * WQTLandingPage — redesigned marketing page for waterquality.trading.
 * Water Demand Response Platform.
 */

import React, { useEffect } from 'react';
import styled from 'styled-components';
import { HeroSection } from './HeroSection';
import { ProblemSection } from './ProblemSection';
import { SolutionSection } from './SolutionSection';
import { HowItWorksSection } from './HowItWorksSection';
import { ByTheNumbersSection } from './ByTheNumbersSection';
import { AudienceSection } from './AudienceSection';
import { CTASection } from './CTASection';
import { WQTFooter } from './WQTFooter';

const DARK_BG = '#0B1120';

const PageWrapper = styled.div`
  background: ${DARK_BG};
  min-height: 100vh;
`;

export function WQTLandingPage() {
  // Set html/body background to dark so iOS overscroll areas match
  useEffect(() => {
    const prevHtml = document.documentElement.style.backgroundColor;
    const prevBody = document.body.style.backgroundColor;
    document.documentElement.style.backgroundColor = DARK_BG;
    document.body.style.backgroundColor = DARK_BG;
    return () => {
      document.documentElement.style.backgroundColor = prevHtml;
      document.body.style.backgroundColor = prevBody;
    };
  }, []);

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
