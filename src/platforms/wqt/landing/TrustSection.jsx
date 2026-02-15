/**
 * TrustSection — verification methodology, blockchain transparency,
 * quality standards, "Powered by BlueSignal IoT" badge.
 */

import React from 'react';
import styled from 'styled-components';

const Section = styled.section`
  padding: 96px 24px;
  background: ${({ theme }) => theme.colors.background};
`;

const Inner = styled.div`
  max-width: 1100px;
  margin: 0 auto;
`;

const SectionLabel = styled.span`
  display: block;
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 12px;
  text-align: center;
`;

const SectionTitle = styled.h2`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 36px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  text-align: center;
  margin: 0 0 12px;
  letter-spacing: -0.02em;
`;

const SectionSub = styled.p`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 16px;
  color: ${({ theme }) => theme.colors.textSecondary};
  text-align: center;
  max-width: 600px;
  margin: 0 auto 64px;
  line-height: 1.6;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 24px;
  margin-bottom: 48px;
`;

const TrustCard = styled.div`
  padding: 28px;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md}px;
`;

const CardIcon = styled.div`
  font-size: 28px;
  margin-bottom: 16px;
`;

const CardTitle = styled.h4`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin: 0 0 8px;
`;

const CardDesc = styled.p`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.6;
  margin: 0;
`;

const PoweredBy = styled.div`
  text-align: center;
  padding: 32px;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg}px;
`;

const PoweredLabel = styled.span`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: ${({ theme }) => theme.colors.textMuted};
  display: block;
  margin-bottom: 8px;
`;

const PoweredBrand = styled.span`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`;

const PoweredDesc = styled.p`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textSecondary};
  max-width: 500px;
  margin: 8px auto 16px;
  line-height: 1.5;
`;

const PoweredLink = styled.a`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.primary};
  text-decoration: none;
  &:hover { text-decoration: underline; }
`;

const TRUST_CARDS = [
  {
    icon: '🔬',
    title: 'Sensor-Verified Data',
    desc: 'Credits backed by continuous IoT sensor measurements — not self-reported estimates. Real data, real outcomes.',
  },
  {
    icon: '⛓',
    title: 'Blockchain Transparency',
    desc: 'Every credit minted as an ERC-1155 token on Polygon. Verify any certificate on Polygonscan in seconds.',
  },
  {
    icon: '🛡',
    title: '85-95% Rejection Rate',
    desc: 'We maintain the highest quality standards in the industry. Most submissions don\'t make the cut. That\'s the point.',
  },
  {
    icon: '📊',
    title: 'Full Credit Lineage',
    desc: 'Track every credit from generation through verification, listing, purchase, and retirement. Complete audit trail.',
  },
];

export function TrustSection() {
  return (
    <Section>
      <Inner>
        <SectionLabel>Why Trust WQT</SectionLabel>
        <SectionTitle>Quality is the Brand</SectionTitle>
        <SectionSub>
          We built the exchange we'd want to trade on. Every credit verified,
          every transaction traceable, every outcome measurable.
        </SectionSub>
        <Grid>
          {TRUST_CARDS.map((c) => (
            <TrustCard key={c.title}>
              <CardIcon>{c.icon}</CardIcon>
              <CardTitle>{c.title}</CardTitle>
              <CardDesc>{c.desc}</CardDesc>
            </TrustCard>
          ))}
        </Grid>
        <PoweredBy>
          <PoweredLabel>Sensor Infrastructure</PoweredLabel>
          <PoweredBrand>Powered by BlueSignal IoT</PoweredBrand>
          <PoweredDesc>
            The dominant sensor network on the exchange. BS-WQM-100 devices provide
            the gold standard in continuous water quality monitoring.
          </PoweredDesc>
          <PoweredLink href="https://bluesignal.xyz" target="_blank" rel="noopener">
            Learn about BlueSignal hardware →
          </PoweredLink>
        </PoweredBy>
      </Inner>
    </Section>
  );
}
