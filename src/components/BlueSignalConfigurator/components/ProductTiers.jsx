// ProductTiers - DIY, Electronics Only, Turnkey System options
import React from "react";
import styled, { keyframes } from "styled-components";
import { salesTheme } from "../styles/theme";

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(24px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const TiersSection = styled.section`
  background: ${salesTheme.colors.bgSecondary};
  padding: 100px 24px;
  position: relative;

  @media (max-width: ${salesTheme.breakpoints.laptop}) {
    padding: 80px 20px;
  }

  @media (max-width: ${salesTheme.breakpoints.tablet}) {
    padding: 60px 16px;
  }
`;

const TiersContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 64px;

  @media (max-width: ${salesTheme.breakpoints.tablet}) {
    margin-bottom: 48px;
  }
`;

const SectionLabel = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: ${salesTheme.colors.accentPrimary};
  margin-bottom: 16px;
  padding: 6px 14px;
  background: rgba(16, 185, 129, 0.1);
  border-radius: 100px;

  svg {
    width: 14px;
    height: 14px;
  }
`;

const SectionTitle = styled.h2`
  font-size: clamp(28px, 4vw, 40px);
  font-weight: 700;
  color: ${salesTheme.colors.textPrimary};
  margin: 0 0 20px;
  letter-spacing: -0.02em;
  line-height: 1.2;

  span {
    background: ${salesTheme.gradients.greenText};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
`;

const SectionDescription = styled.p`
  font-size: 17px;
  color: rgba(255, 255, 255, 0.6);
  max-width: 560px;
  margin: 0 auto;
  line-height: 1.7;

  @media (max-width: ${salesTheme.breakpoints.tablet}) {
    font-size: 15px;
  }
`;

const TiersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 28px;

  @media (max-width: ${salesTheme.breakpoints.laptop}) {
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
  }

  @media (max-width: ${salesTheme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
    max-width: 440px;
    margin: 0 auto;
    gap: 20px;
  }
`;

const TierCard = styled.div`
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 24px;
  padding: 36px 32px;
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  position: relative;
  overflow: hidden;
  animation: ${fadeInUp} 0.6s ease-out ${props => props.$delay || '0s'} both;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: ${props => props.$accentColor || 'linear-gradient(90deg, #10b981, #22d3ee)'};
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(255, 255, 255, 0.12);
    transform: translateY(-8px);
    box-shadow: 0 24px 48px rgba(0, 0, 0, 0.2);

    &::before {
      opacity: 1;
    }
  }

  @media (max-width: ${salesTheme.breakpoints.tablet}) {
    padding: 28px 24px;
  }
`;

const TierIconWrapper = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 18px;
  background: ${props => props.$color || 'rgba(16, 185, 129, 0.12)'};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
  transition: transform 0.3s ease;

  ${TierCard}:hover & {
    transform: scale(1.08);
  }

  svg {
    width: 32px;
    height: 32px;
    color: ${props => props.$iconColor || salesTheme.colors.accentPrimary};
  }

  @media (max-width: ${salesTheme.breakpoints.tablet}) {
    width: 56px;
    height: 56px;
    border-radius: 14px;

    svg {
      width: 28px;
      height: 28px;
    }
  }
`;

const TierTitle = styled.h3`
  font-size: 22px;
  font-weight: 700;
  color: ${salesTheme.colors.textPrimary};
  margin: 0 0 10px;
  letter-spacing: -0.01em;

  @media (max-width: ${salesTheme.breakpoints.tablet}) {
    font-size: 20px;
  }
`;

const TierDescription = styled.p`
  font-size: 15px;
  color: rgba(255, 255, 255, 0.55);
  line-height: 1.65;
  margin: 0 0 24px;

  @media (max-width: ${salesTheme.breakpoints.tablet}) {
    font-size: 14px;
    margin-bottom: 20px;
  }
`;

const TierFeatures = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0;
`;

const TierFeature = styled.li`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
  padding: 12px 0;
  display: flex;
  align-items: center;
  gap: 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);

  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }

  &:first-child {
    padding-top: 0;
  }

  @media (max-width: ${salesTheme.breakpoints.tablet}) {
    font-size: 13px;
    padding: 10px 0;
  }
`;

const FeatureCheck = styled.span`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: rgba(16, 185, 129, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  svg {
    width: 12px;
    height: 12px;
    color: ${salesTheme.colors.accentPrimary};
  }
`;

const ResourceLinks = styled.div`
  margin-top: 72px;
  padding-top: 48px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);

  @media (max-width: ${salesTheme.breakpoints.tablet}) {
    margin-top: 48px;
    padding-top: 32px;
  }
`;

const ResourcesTitle = styled.h4`
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: rgba(255, 255, 255, 0.4);
  text-align: center;
  margin: 0 0 24px;
`;

const ResourcesGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  justify-content: center;

  @media (max-width: ${salesTheme.breakpoints.mobile}) {
    flex-direction: column;
    gap: 10px;
  }
`;

const ResourceLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 14px 24px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  transition: all 0.25s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
    color: ${salesTheme.colors.textPrimary};
    border-color: rgba(255, 255, 255, 0.15);
    transform: translateY(-2px);
  }

  svg {
    width: 18px;
    height: 18px;
    opacity: 0.7;
  }

  &:hover svg {
    opacity: 1;
  }

  @media (max-width: ${salesTheme.breakpoints.mobile}) {
    justify-content: center;
    padding: 12px 20px;
  }
`;

const tiers = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
      </svg>
    ),
    iconColor: '#10b981',
    color: 'rgba(16, 185, 129, 0.12)',
    accentColor: 'linear-gradient(90deg, #10b981, #059669)',
    title: 'Full DIY Kit',
    description: 'Source your own components using our complete bill of materials and detailed wiring diagrams.',
    features: [
      'Complete BOM with vendor links',
      'Professional wiring diagrams',
      '3D printable enclosure files',
      'Open-source firmware repository',
    ],
    delay: '0s',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="4" y="4" width="16" height="16" rx="2" ry="2"/>
        <rect x="9" y="9" width="6" height="6"/>
        <line x1="9" y1="1" x2="9" y2="4"/>
        <line x1="15" y1="1" x2="15" y2="4"/>
        <line x1="9" y1="20" x2="9" y2="23"/>
        <line x1="15" y1="20" x2="15" y2="23"/>
        <line x1="20" y1="9" x2="23" y2="9"/>
        <line x1="20" y1="14" x2="23" y2="14"/>
        <line x1="1" y1="9" x2="4" y2="9"/>
        <line x1="1" y1="14" x2="4" y2="14"/>
      </svg>
    ),
    iconColor: '#22d3ee',
    color: 'rgba(34, 211, 238, 0.12)',
    accentColor: 'linear-gradient(90deg, #22d3ee, #06b6d4)',
    title: 'Electronics Only',
    description: 'Pre-assembled PCB with calibrated sensors. Build your own enclosure and power system.',
    features: [
      'Pre-flashed microcontroller',
      'Factory calibrated sensors',
      'Cloud connectivity ready',
      'Enclosure design templates',
    ],
    delay: '0.1s',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
        <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
        <line x1="12" y1="22.08" x2="12" y2="12"/>
      </svg>
    ),
    iconColor: '#f59e0b',
    color: 'rgba(251, 191, 36, 0.12)',
    accentColor: 'linear-gradient(90deg, #f59e0b, #d97706)',
    title: 'Turnkey System',
    description: 'Fully assembled and tested. Just mount it, connect power, and start monitoring immediately.',
    features: [
      'Factory calibrated & tested',
      'Weatherproof IP67 enclosure',
      'Solar panel + battery included',
      'Full 2-year warranty',
    ],
    delay: '0.2s',
  },
];

const resources = [
  {
    label: 'Wiring Diagrams',
    href: '#technical',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
      </svg>
    ),
  },
  {
    label: 'Download BOM',
    href: '#pricing',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
      </svg>
    ),
  },
  {
    label: 'Installation Guide',
    href: '#install',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
        <polyline points="10 9 9 9 8 9"/>
      </svg>
    ),
  },
  {
    label: 'GitHub',
    href: 'https://github.com/bluesignal',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
      </svg>
    ),
    external: true,
  },
];

export default function ProductTiers({ onNavigate }) {
  const handleTierClick = () => {
    if (onNavigate) {
      onNavigate('products');
    }
  };

  const handleResourceClick = (href) => {
    if (href.startsWith('#') && onNavigate) {
      onNavigate(href.slice(1));
    }
  };

  return (
    <TiersSection id="tiers">
      <TiersContainer>
        <SectionHeader>
          <SectionLabel>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
            Open Hardware
          </SectionLabel>
          <SectionTitle>
            Build It <span>Yourself</span>
          </SectionTitle>
          <SectionDescription>
            Whether you're a DIY enthusiast or need a ready-to-deploy solution,
            we have options that fit your needs and technical expertise.
          </SectionDescription>
        </SectionHeader>

        <TiersGrid>
          {tiers.map((tier, index) => (
            <TierCard
              key={index}
              onClick={handleTierClick}
              $delay={tier.delay}
              $accentColor={tier.accentColor}
            >
              <TierIconWrapper $color={tier.color} $iconColor={tier.iconColor}>
                {tier.icon}
              </TierIconWrapper>
              <TierTitle>{tier.title}</TierTitle>
              <TierDescription>{tier.description}</TierDescription>
              <TierFeatures>
                {tier.features.map((feature, i) => (
                  <TierFeature key={i}>
                    <FeatureCheck>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    </FeatureCheck>
                    {feature}
                  </TierFeature>
                ))}
              </TierFeatures>
            </TierCard>
          ))}
        </TiersGrid>

        <ResourceLinks>
          <ResourcesTitle>Developer Resources</ResourcesTitle>
          <ResourcesGrid>
            {resources.map((resource, index) => (
              <ResourceLink
                key={index}
                href={resource.external ? resource.href : undefined}
                target={resource.external ? '_blank' : undefined}
                rel={resource.external ? 'noopener noreferrer' : undefined}
                onClick={(e) => {
                  if (!resource.external) {
                    e.preventDefault();
                    handleResourceClick(resource.href);
                  }
                }}
              >
                {resource.icon}
                {resource.label}
              </ResourceLink>
            ))}
          </ResourcesGrid>
        </ResourceLinks>
      </TiersContainer>
    </TiersSection>
  );
}
