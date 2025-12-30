// HeroSection - Main hero section for the sales portal
import React from "react";
import styled from "styled-components";
import { salesTheme } from "../styles/theme";

const HeroWrapper = styled.section`
  background: ${salesTheme.gradients.heroBg};
  color: ${salesTheme.colors.textPrimary};
  padding: 140px 24px 100px;
  position: relative;
  overflow: hidden;

  /* Dot pattern overlay */
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
    pointer-events: none;
  }

  @media (max-width: ${salesTheme.breakpoints.tablet}) {
    padding: 120px 16px 64px;
  }
`;

const HeroContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
`;

const HeroContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 64px;
  align-items: center;

  @media (max-width: ${salesTheme.breakpoints.laptop}) {
    grid-template-columns: 1fr;
    text-align: center;
    gap: 48px;
  }
`;

const HeroText = styled.div``;

const HeroTitle = styled.h1`
  font-size: clamp(32px, 5vw, 48px);
  font-weight: 700;
  line-height: 1.1;
  margin: 0 0 20px;
  letter-spacing: -0.02em;

  span {
    background: ${salesTheme.gradients.greenText};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 18px;
  line-height: 1.7;
  color: ${salesTheme.colors.textSecondary};
  margin: 0 0 32px;
  max-width: 480px;

  @media (max-width: ${salesTheme.breakpoints.laptop}) {
    margin-left: auto;
    margin-right: auto;
  }
`;

const HeroActions = styled.div`
  display: flex;
  gap: 16px;
  flex-wrap: wrap;

  @media (max-width: ${salesTheme.breakpoints.laptop}) {
    justify-content: center;
  }
`;

const PrimaryButton = styled.button`
  background: ${salesTheme.gradients.greenCta};
  color: ${salesTheme.colors.bgPrimary};
  border: none;
  border-radius: ${salesTheme.borderRadius.lg};
  padding: 16px 32px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all ${salesTheme.transitions.fast};
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${salesTheme.shadows.glow};
  }
`;

const SecondaryButton = styled.button`
  background: ${salesTheme.colors.glassDark};
  color: ${salesTheme.colors.textPrimary};
  border: 1px solid ${salesTheme.colors.borderLight};
  border-radius: ${salesTheme.borderRadius.lg};
  padding: 16px 32px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all ${salesTheme.transitions.fast};

  &:hover {
    background: ${salesTheme.colors.glassLight};
    border-color: rgba(255, 255, 255, 0.2);
  }
`;

const TrustBadges = styled.div`
  display: flex;
  gap: 24px;
  margin-top: 32px;
  flex-wrap: wrap;

  @media (max-width: ${salesTheme.breakpoints.laptop}) {
    justify-content: center;
  }
`;

const TrustBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: ${salesTheme.colors.textSecondary};

  svg {
    width: 16px;
    height: 16px;
    color: ${salesTheme.colors.accentPrimary};
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;

  @media (max-width: ${salesTheme.breakpoints.laptop}) {
    max-width: 400px;
    margin: 0 auto;
  }

  @media (max-width: ${salesTheme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

const StatCard = styled.div`
  background: ${salesTheme.colors.glassDark};
  border: 1px solid ${salesTheme.colors.borderLight};
  border-radius: ${salesTheme.borderRadius.xl};
  padding: 24px;
  text-align: center;
  backdrop-filter: blur(8px);
`;

const StatValue = styled.div`
  font-size: 36px;
  font-weight: 800;
  background: ${salesTheme.gradients.greenText};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 4px;
`;

const StatLabel = styled.div`
  font-size: 13px;
  color: ${salesTheme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const stats = [
  { value: '500+', label: 'Devices Deployed' },
  { value: '$2M+', label: 'Credits Generated' },
  { value: '98%', label: 'Uptime' },
];

export default function HeroSection({ onNavigateToProducts, onNavigateToBenchmark }) {
  return (
    <HeroWrapper id="hero">
      <HeroContainer>
        <HeroContent>
          <HeroText>
            <HeroTitle>
              Turn Water Quality Into <span>Revenue</span>
            </HeroTitle>
            <HeroSubtitle>
              BlueSignal monitoring devices transform your water quality data into
              tradeable credits. Professional-grade sensors, real-time monitoring,
              and seamless marketplace integration.
            </HeroSubtitle>
            <HeroActions>
              <PrimaryButton onClick={onNavigateToProducts}>
                Start Your Quote
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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

          <StatsGrid>
            {stats.map((stat, index) => (
              <StatCard key={index}>
                <StatValue>{stat.value}</StatValue>
                <StatLabel>{stat.label}</StatLabel>
              </StatCard>
            ))}
          </StatsGrid>
        </HeroContent>
      </HeroContainer>
    </HeroWrapper>
  );
}
