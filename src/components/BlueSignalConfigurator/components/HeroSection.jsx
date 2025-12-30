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
  padding: 160px 24px 120px;
  position: relative;
  overflow: hidden;
  min-height: 90vh;
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
    padding: 140px 20px 80px;
    min-height: auto;
  }

  @media (max-width: ${salesTheme.breakpoints.tablet}) {
    padding: 120px 16px 60px;
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
  grid-template-columns: 1.1fr 0.9fr;
  gap: 80px;
  align-items: center;

  @media (max-width: ${salesTheme.breakpoints.laptop}) {
    grid-template-columns: 1fr;
    text-align: center;
    gap: 56px;
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

  @media (max-width: ${salesTheme.breakpoints.laptop}) {
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
  }
`;

const HeroSubtitle = styled.p`
  font-size: 18px;
  line-height: 1.75;
  color: rgba(255, 255, 255, 0.7);
  margin: 0 0 40px;
  max-width: 520px;
  font-weight: 400;

  @media (max-width: ${salesTheme.breakpoints.laptop}) {
    margin-left: auto;
    margin-right: auto;
  }

  @media (max-width: ${salesTheme.breakpoints.tablet}) {
    font-size: 16px;
    margin-bottom: 32px;
    line-height: 1.7;
  }
`;

const HeroActions = styled.div`
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 48px;

  @media (max-width: ${salesTheme.breakpoints.laptop}) {
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

  @media (max-width: ${salesTheme.breakpoints.laptop}) {
    justify-content: center;
  }

  @media (max-width: ${salesTheme.breakpoints.mobile}) {
    gap: 20px;
    justify-content: center;
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

const StatsContainer = styled.div`
  animation: ${fadeInUp} 0.8s ease-out 0.2s both;

  @media (max-width: ${salesTheme.breakpoints.laptop}) {
    max-width: 480px;
    margin: 0 auto;
  }
`;

const StatsGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;

  @media (max-width: ${salesTheme.breakpoints.laptop}) {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
  }

  @media (max-width: ${salesTheme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
    gap: 12px;
  }
`;

const StatCard = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  padding: 28px 32px;
  display: flex;
  align-items: center;
  gap: 20px;
  backdrop-filter: blur(12px);
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.06);
    border-color: rgba(16, 185, 129, 0.2);
    transform: translateX(4px);
  }

  @media (max-width: ${salesTheme.breakpoints.laptop}) {
    flex-direction: column;
    text-align: center;
    padding: 24px 16px;
    gap: 8px;

    &:hover {
      transform: translateY(-4px);
    }
  }

  @media (max-width: ${salesTheme.breakpoints.mobile}) {
    flex-direction: row;
    text-align: left;
    padding: 20px 24px;
    gap: 16px;

    &:hover {
      transform: translateX(4px);
    }
  }
`;

const StatIcon = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 16px;
  background: rgba(16, 185, 129, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  svg {
    width: 28px;
    height: 28px;
    color: ${salesTheme.colors.accentPrimary};
  }

  @media (max-width: ${salesTheme.breakpoints.laptop}) {
    width: 48px;
    height: 48px;
    border-radius: 12px;

    svg {
      width: 24px;
      height: 24px;
    }
  }
`;

const StatContent = styled.div``;

const StatValue = styled.div`
  font-size: 32px;
  font-weight: 800;
  background: ${salesTheme.gradients.greenText};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1.1;
  margin-bottom: 4px;
  font-family: ${salesTheme.typography.fontMono};

  @media (max-width: ${salesTheme.breakpoints.laptop}) {
    font-size: 28px;
  }

  @media (max-width: ${salesTheme.breakpoints.mobile}) {
    font-size: 26px;
  }
`;

const StatLabel = styled.div`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.55);
  font-weight: 500;
  letter-spacing: 0.01em;

  @media (max-width: ${salesTheme.breakpoints.mobile}) {
    font-size: 13px;
  }
`;

const stats = [
  {
    value: '500+',
    label: 'Devices Deployed',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
        <line x1="8" y1="21" x2="16" y2="21"/>
        <line x1="12" y1="17" x2="12" y2="21"/>
      </svg>
    )
  },
  {
    value: '$2M+',
    label: 'Credits Generated',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="12" y1="1" x2="12" y2="23"/>
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
      </svg>
    )
  },
  {
    value: '98%',
    label: 'System Uptime',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
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

          <StatsContainer>
            <StatsGrid>
              {stats.map((stat, index) => (
                <StatCard key={index}>
                  <StatIcon>{stat.icon}</StatIcon>
                  <StatContent>
                    <StatValue>{stat.value}</StatValue>
                    <StatLabel>{stat.label}</StatLabel>
                  </StatContent>
                </StatCard>
              ))}
            </StatsGrid>
          </StatsContainer>
        </HeroContent>
      </HeroContainer>
    </HeroWrapper>
  );
}
