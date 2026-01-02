// HeroSection - Main hero section for the sales portal
import React from "react";
import styled, { keyframes } from "styled-components";
import { salesTheme } from "../styles/theme";

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
`;

const HeroWrapper = styled.section`
  background: ${salesTheme.gradients.heroBg};
  color: ${salesTheme.colors.textPrimary};
  padding: 120px 24px 80px;
  position: relative;
  overflow: hidden;
  min-height: 100vh;
  min-height: 100dvh; /* Dynamic viewport height for mobile browsers */
  display: flex;
  align-items: center;

  /* Subtle gradient orbs for depth */
  &::before {
    content: "";
    position: absolute;
    top: -20%;
    right: -10%;
    width: 600px;
    height: 600px;
    background: radial-gradient(circle, rgba(16, 185, 129, 0.08) 0%, transparent 70%);
    pointer-events: none;
  }

  &::after {
    content: "";
    position: absolute;
    bottom: -30%;
    left: -10%;
    width: 500px;
    height: 500px;
    background: radial-gradient(circle, rgba(59, 130, 246, 0.06) 0%, transparent 70%);
    pointer-events: none;
  }

  @media (max-width: ${salesTheme.breakpoints.laptop}) {
    padding: 100px 20px 60px;
    min-height: 100vh;
    min-height: 100dvh;
  }

  @media (max-width: ${salesTheme.breakpoints.tablet}) {
    padding: 100px 16px 60px;
    min-height: 100vh;
    min-height: 100dvh;
  }
`;

const HeroContainer = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
  width: 100%;
`;

const HeroContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 64px;
  align-items: center;
  text-align: left; /* Ensure left alignment on desktop */

  /* Tablet (768px-1024px): Stack but keep LEFT-aligned */
  @media (max-width: ${salesTheme.breakpoints.laptop}) {
    grid-template-columns: 1fr;
    text-align: left;
    gap: 48px;
  }

  /* Mobile only (< 768px): Center-aligned */
  @media (max-width: ${salesTheme.breakpoints.tablet}) {
    text-align: center;
  }
`;

const HeroText = styled.div`
  animation: ${fadeInUp} 0.8s ease-out;
`;

const Eyebrow = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.2);
  border-radius: 100px;
  padding: 8px 16px;
  margin-bottom: 24px;
  font-size: 13px;
  font-weight: 600;
  color: ${salesTheme.colors.accentPrimary};
  letter-spacing: 0.02em;

  svg {
    width: 16px;
    height: 16px;
  }

  /* Mobile only: center the eyebrow */
  @media (max-width: ${salesTheme.breakpoints.tablet}) {
    margin-left: auto;
    margin-right: auto;
  }
`;

const HeroTitle = styled.h1`
  font-size: clamp(36px, 5.5vw, 56px);
  font-weight: 800;
  line-height: 1.08;
  margin: 0 0 24px;
  letter-spacing: -0.03em;
  color: #ffffff;
  text-align: left;

  span {
    display: inline-block;
    background: ${salesTheme.gradients.greenText};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  @media (max-width: ${salesTheme.breakpoints.tablet}) {
    font-size: clamp(28px, 8vw, 36px);
    margin-bottom: 20px;
    text-align: center;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 18px;
  line-height: 1.75;
  color: rgba(255, 255, 255, 0.7);
  margin: 0 0 40px;
  max-width: 520px;
  font-weight: 400;

  /* Mobile only: center the subtitle */
  @media (max-width: ${salesTheme.breakpoints.tablet}) {
    font-size: 16px;
    margin-bottom: 32px;
    line-height: 1.7;
    margin-left: auto;
    margin-right: auto;
  }
`;

const HeroActions = styled.div`
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 48px;

  /* Mobile only: center buttons */
  @media (max-width: ${salesTheme.breakpoints.tablet}) {
    justify-content: center;
  }

  @media (max-width: ${salesTheme.breakpoints.mobile}) {
    flex-direction: column;
    gap: 12px;
  }
`;

const PrimaryButton = styled.button`
  background: ${salesTheme.gradients.greenCta};
  color: #0f172a;
  border: none;
  border-radius: 12px;
  padding: 18px 36px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  min-width: 200px;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 20px 40px rgba(16, 185, 129, 0.35);
  }

  &:active {
    transform: translateY(-1px);
  }

  svg {
    transition: transform 0.2s ease;
  }

  &:hover svg {
    transform: translateX(4px);
  }

  @media (max-width: ${salesTheme.breakpoints.mobile}) {
    width: 100%;
    padding: 16px 32px;
  }
`;

const SecondaryButton = styled.button`
  background: transparent;
  color: ${salesTheme.colors.textPrimary};
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 16px 32px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  min-width: 180px;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(255, 255, 255, 0.35);
    transform: translateY(-2px);
  }

  @media (max-width: ${salesTheme.breakpoints.mobile}) {
    width: 100%;
    padding: 14px 28px;
  }
`;

const TrustBadges = styled.div`
  display: flex;
  gap: 32px;
  flex-wrap: wrap;

  /* Mobile only: center badges */
  @media (max-width: ${salesTheme.breakpoints.tablet}) {
    justify-content: center;
  }

  @media (max-width: ${salesTheme.breakpoints.mobile}) {
    gap: 20px;
  }
`;

const TrustBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.65);

  svg {
    width: 20px;
    height: 20px;
    color: ${salesTheme.colors.accentPrimary};
    flex-shrink: 0;
  }

  @media (max-width: ${salesTheme.breakpoints.mobile}) {
    font-size: 13px;
    gap: 8px;

    svg {
      width: 18px;
      height: 18px;
    }
  }
`;

const FeaturesContainer = styled.div`
  animation: ${fadeInUp} 0.8s ease-out 0.2s both;
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;

  @media (max-width: ${salesTheme.breakpoints.laptop}) {
    max-width: 100%;
  }

  /* Mobile only: center features */
  @media (max-width: ${salesTheme.breakpoints.tablet}) {
    margin: 0 auto;
  }
`;

const FeaturesGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;

  @media (max-width: ${salesTheme.breakpoints.laptop}) {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
    max-width: 600px;
  }

  /* Mobile only: center and single column */
  @media (max-width: ${salesTheme.breakpoints.tablet}) {
    margin: 0 auto;
  }

  @media (max-width: ${salesTheme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
    gap: 12px;
    max-width: 100%;
  }
`;

const FeatureCard = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  backdrop-filter: blur(12px);
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(16, 185, 129, 0.2);
  }

  /* Tablet: horizontal cards, left-aligned */
  @media (max-width: ${salesTheme.breakpoints.laptop}) {
    flex-direction: column;
    text-align: center;
    padding: 20px 16px;
    gap: 12px;
  }

  /* Mobile: horizontal layout */
  @media (max-width: ${salesTheme.breakpoints.mobile}) {
    flex-direction: row;
    text-align: left;
    padding: 16px 20px;
    gap: 14px;
  }
`;

const FeatureIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: rgba(16, 185, 129, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  svg {
    width: 24px;
    height: 24px;
    color: ${salesTheme.colors.accentPrimary};
  }

  @media (max-width: ${salesTheme.breakpoints.laptop}) {
    width: 44px;
    height: 44px;

    svg {
      width: 22px;
      height: 22px;
    }
  }
`;

const FeatureContent = styled.div``;

const FeatureTitle = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: ${salesTheme.colors.textPrimary};
  line-height: 1.2;
  margin-bottom: 4px;

  @media (max-width: ${salesTheme.breakpoints.laptop}) {
    font-size: 16px;
  }
`;

const FeatureDescription = styled.div`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.55);
  font-weight: 400;
  line-height: 1.4;

  @media (max-width: ${salesTheme.breakpoints.mobile}) {
    font-size: 13px;
  }
`;

const features = [
  {
    title: 'Real-Time Data',
    description: 'Continuous monitoring with instant cloud sync',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
    )
  },
  {
    title: 'Credit Ready',
    description: 'Data formatted for marketplace trading',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="12" y1="1" x2="12" y2="23"/>
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
      </svg>
    )
  },
  {
    title: 'Open Source',
    description: 'Full hardware specs and build guides',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
      </svg>
    )
  },
];

export default function HeroSection({ onNavigateToProducts, onNavigateToBenchmark }) {
  return (
    <HeroWrapper id="hero">
      <HeroContainer>
        <HeroContent>
          <HeroText>
            <Eyebrow>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
              Real-Time Water Quality Monitoring
            </Eyebrow>
            <HeroTitle>
              Turn Water Quality<br />Into <span>Revenue</span>
            </HeroTitle>
            <HeroSubtitle>
              BlueSignal monitoring devices transform your water quality data into
              tradeable credits. Professional-grade sensors, real-time monitoring,
              and seamless marketplace integration.
            </HeroSubtitle>
            <HeroActions>
              <PrimaryButton onClick={onNavigateToProducts}>
                Start Your Quote
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </PrimaryButton>
              <SecondaryButton onClick={onNavigateToBenchmark}>
                See Comparison
              </SecondaryButton>
            </HeroActions>
            <TrustBadges>
              <TrustBadge>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                EPA Compliant
              </TrustBadge>
              <TrustBadge>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Registry Verified
              </TrustBadge>
              <TrustBadge>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                2-Year Warranty
              </TrustBadge>
            </TrustBadges>
          </HeroText>

          <FeaturesContainer>
            <FeaturesGrid>
              {features.map((feature, index) => (
                <FeatureCard key={index}>
                  <FeatureIcon>{feature.icon}</FeatureIcon>
                  <FeatureContent>
                    <FeatureTitle>{feature.title}</FeatureTitle>
                    <FeatureDescription>{feature.description}</FeatureDescription>
                  </FeatureContent>
                </FeatureCard>
              ))}
            </FeaturesGrid>
          </FeaturesContainer>
        </HeroContent>
      </HeroContainer>
    </HeroWrapper>
  );
}
