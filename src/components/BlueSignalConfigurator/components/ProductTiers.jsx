// ProductTiers - DIY, Electronics Only, Turnkey System options
import React from "react";
import styled from "styled-components";
import { salesTheme } from "../styles/theme";

const TiersSection = styled.section`
  background: ${salesTheme.colors.bgSecondary};
  padding: 80px 24px;

  @media (max-width: ${salesTheme.breakpoints.tablet}) {
    padding: 48px 16px;
  }
`;

const TiersContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 48px;
`;

const SectionLabel = styled.span`
  display: inline-block;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: ${salesTheme.colors.accentPrimary};
  margin-bottom: 12px;
`;

const SectionTitle = styled.h2`
  font-size: 32px;
  font-weight: 600;
  color: ${salesTheme.colors.textPrimary};
  margin: 0 0 16px;

  span {
    background: ${salesTheme.gradients.greenText};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  @media (max-width: ${salesTheme.breakpoints.tablet}) {
    font-size: 24px;
  }
`;

const SectionDescription = styled.p`
  font-size: 16px;
  color: ${salesTheme.colors.textSecondary};
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
`;

const TiersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;

  @media (max-width: ${salesTheme.breakpoints.laptop}) {
    grid-template-columns: 1fr;
    max-width: 500px;
    margin: 0 auto;
  }
`;

const TierCard = styled.div`
  background: ${salesTheme.colors.glassDark};
  border: 1px solid ${salesTheme.colors.borderLight};
  border-radius: ${salesTheme.borderRadius.xl};
  padding: 32px;
  transition: all ${salesTheme.transitions.spring};
  cursor: pointer;

  &:hover {
    background: ${salesTheme.colors.glassLight};
    border-color: rgba(16, 185, 129, 0.3);
    transform: translateY(-4px);
  }
`;

const TierIcon = styled.div`
  width: 56px;
  height: 56px;
  border-radius: ${salesTheme.borderRadius.lg};
  background: ${props => props.$color || 'rgba(16, 185, 129, 0.15)'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  margin-bottom: 20px;
`;

const TierTitle = styled.h3`
  font-size: 20px;
  font-weight: 600;
  color: ${salesTheme.colors.textPrimary};
  margin: 0 0 8px;
`;

const TierDescription = styled.p`
  font-size: 14px;
  color: ${salesTheme.colors.textSecondary};
  line-height: 1.6;
  margin: 0 0 20px;
`;

const TierFeatures = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const TierFeature = styled.li`
  font-size: 13px;
  color: rgba(255, 255, 255, 0.7);
  padding: 8px 0;
  display: flex;
  align-items: center;
  gap: 10px;
  border-bottom: 1px solid ${salesTheme.colors.borderLight};

  &:last-child {
    border-bottom: none;
  }

  &::before {
    content: "";
    width: 16px;
    height: 16px;
    background: ${salesTheme.colors.accentPrimary};
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z'/%3E%3C/svg%3E");
    background-size: 10px;
    background-position: center;
    background-repeat: no-repeat;
  }
`;

const ResourceLinks = styled.div`
  margin-top: 48px;
  padding-top: 32px;
  border-top: 1px solid ${salesTheme.colors.borderLight};
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
`;

const ResourceLink = styled.a`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: ${salesTheme.colors.glassDark};
  border: 1px solid ${salesTheme.colors.borderLight};
  border-radius: ${salesTheme.borderRadius.md};
  font-size: 14px;
  font-weight: 500;
  color: ${salesTheme.colors.textSecondary};
  text-decoration: none;
  transition: all ${salesTheme.transitions.fast};

  &:hover {
    background: ${salesTheme.colors.glassLight};
    color: ${salesTheme.colors.textPrimary};
    border-color: rgba(255, 255, 255, 0.2);
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const tiers = [
  {
    icon: '🔧',
    color: 'rgba(16, 185, 129, 0.15)',
    title: 'Full DIY Kit',
    description: 'Source your own components using our complete bill of materials and wiring diagrams.',
    features: [
      'Complete BOM with sources',
      'Wiring diagrams',
      '3D enclosure files',
      'Firmware repository',
    ],
  },
  {
    icon: '🔌',
    color: 'rgba(34, 211, 238, 0.15)',
    title: 'Electronics Only',
    description: 'Get the pre-assembled PCB and sensors, build your own enclosure and power system.',
    features: [
      'Pre-flashed controller',
      'Calibrated sensors',
      'Cloud connectivity ready',
      'Enclosure templates',
    ],
  },
  {
    icon: '📦',
    color: 'rgba(251, 191, 36, 0.15)',
    title: 'Turnkey System',
    description: 'Fully assembled and tested system ready to deploy. Just connect power and start monitoring.',
    features: [
      'Factory calibrated',
      'Weatherproof enclosure',
      'Solar + battery included',
      '1-year warranty',
    ],
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
        <path d="M9 12h6M9 16h6M17 21H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    label: 'GitHub Repository',
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
          <SectionLabel>Open Hardware</SectionLabel>
          <SectionTitle>
            Build It <span>Yourself</span>
          </SectionTitle>
          <SectionDescription>
            For those who want to build their own monitoring system, we provide
            complete documentation, wiring diagrams, and BOM lists.
          </SectionDescription>
        </SectionHeader>

        <TiersGrid>
          {tiers.map((tier, index) => (
            <TierCard key={index} onClick={handleTierClick}>
              <TierIcon $color={tier.color}>{tier.icon}</TierIcon>
              <TierTitle>{tier.title}</TierTitle>
              <TierDescription>{tier.description}</TierDescription>
              <TierFeatures>
                {tier.features.map((feature, i) => (
                  <TierFeature key={i}>{feature}</TierFeature>
                ))}
              </TierFeatures>
            </TierCard>
          ))}
        </TiersGrid>

        <ResourceLinks>
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
        </ResourceLinks>
      </TiersContainer>
    </TiersSection>
  );
}
