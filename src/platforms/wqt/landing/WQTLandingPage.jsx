/**
 * WQTLandingPage — redesigned marketing page for waterquality.trading.
 * Water Demand Response Platform.
 * Supports dual-audience toggle (Homeowner / Utility).
 */

import { useState, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import { AUDIENCE_CONTENT } from './audienceContent';
import { HeroSection } from './HeroSection';
import { ProblemSection } from './ProblemSection';
import { SolutionSection } from './SolutionSection';
import { HowItWorksSection } from './HowItWorksSection';
import { ByTheNumbersSection } from './ByTheNumbersSection';
import { AudienceSection } from './AudienceSection';
import { CTASection } from './CTASection';
import { WQTFooter } from './WQTFooter';

const DARK_BG = '#0B1120';
const STORAGE_KEY = 'wqt_audience';

const PageWrapper = styled.div`
  background: ${DARK_BG};
  min-height: 100vh;
`;

function getInitialAudience() {
  if (typeof window === 'undefined') return 'homeowner';
  const params = new URLSearchParams(window.location.search);
  const paramVal = params.get('audience');
  if (paramVal === 'utility' || paramVal === 'homeowner') return paramVal;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'utility') return 'utility';
  return 'homeowner';
}

export function WQTLandingPage() {
  const [audience, setAudience] = useState(getInitialAudience);

  const handleToggle = useCallback((val) => {
    setAudience(val);
    localStorage.setItem(STORAGE_KEY, val);
  }, []);

  const content = AUDIENCE_CONTENT[audience];

  useEffect(() => {
    document.title = 'WaterQuality.Trading — Nutrient Credit Marketplace';
  }, []);

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
      <HeroSection audience={audience} onToggle={handleToggle} content={content.hero} />
      <ProblemSection />
      <SolutionSection audience={audience} content={content.howItWorks} />
      <HowItWorksSection audience={audience} content={content.valueProps} trust={content.trust} />
      <ByTheNumbersSection />
      <AudienceSection />
      <CTASection audience={audience} content={content.bottomCta} />
      <WQTFooter />
    </PageWrapper>
  );
}
