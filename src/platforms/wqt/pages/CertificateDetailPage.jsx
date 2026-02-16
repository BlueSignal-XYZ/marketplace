/**
 * WQT Certificate Detail — shareable verification page.
 * Suitable for linking in reports, audits, press.
 */

import React from 'react';
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import { Badge } from '../../../design-system/primitives/Badge';
import { DataCard } from '../../../design-system/primitives/DataCard';

const Page = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 48px 24px;
`;

const VerifiedBanner = styled.div`
  background: linear-gradient(135deg, rgba(139,92,246,0.06), rgba(0,82,204,0.06));
  border: 1px solid rgba(139,92,246,0.15);
  border-radius: ${({ theme }) => theme.radius.lg}px;
  padding: 32px;
  text-align: center;
  margin-bottom: 32px;
`;

const CheckIcon = styled.div`
  font-size: 48px;
  margin-bottom: 12px;
`;

const BannerTitle = styled.h1`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 24px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin: 0 0 8px;
`;

const BannerSub = styled.p`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 0;
`;

const Section = styled.section`
  margin-bottom: 32px;
`;

const SectionTitle = styled.h3`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin: 0 0 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  @media (max-width: 640px) { grid-template-columns: 1fr; }
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 10px 14px;
  background: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.radius.sm}px;
`;

const Label = styled.span`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const Value = styled.span`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`;

const ExtLink = styled.a`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 13px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.primary};
  text-decoration: none;
  &:hover { text-decoration: underline; }
`;

const StatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 16px;
  margin-bottom: 32px;
`;

export function CertificateDetailPage() {
  const { id } = useParams();

  // TODO: Fetch from /v2/blockchain/certificate/:id
  const cert = {
    id,
    creditId: '0x7a3f9c2e1b4d',
    tokenId: '1042',
    contractAddress: '0x1234…5678',
    transactionHash: '0xabcd…ef01',
    blockNumber: 45892103,
    network: 'Polygon',
    mintedAt: '2025-11-13',
    nutrientType: 'nitrogen',
    quantity: 250,
    region: 'Virginia - James River Basin',
    vintage: '2025',
    verificationLevel: 'sensor-verified',
    status: 'active',
    owner: '0x9876…5432',
    explorerUrl: 'https://polygonscan.com/tx/0xabcd',
  };

  return (
    <Page>
      <VerifiedBanner>
        <CheckIcon>🛡</CheckIcon>
        <BannerTitle>Verified Environmental Credit</BannerTitle>
        <BannerSub>
          This certificate has been verified on the Polygon blockchain.
          <br />
          Certificate #{cert.tokenId} · Minted {cert.mintedAt}
        </BannerSub>
        <div style={{ marginTop: 12 }}>
          <Badge variant="verified" dot>Blockchain Verified</Badge>
        </div>
      </VerifiedBanner>

      <StatsRow>
        <DataCard label="Nutrient Type" value={cert.nutrientType === 'nitrogen' ? 'Nitrogen (N)' : 'Phosphorus (P)'} compact />
        <DataCard label="Quantity Removed" value={cert.quantity.toLocaleString()} unit="kg" compact />
        <DataCard label="Region" value={cert.region.split(' - ')[1] || cert.region} compact />
        <DataCard label="Status" value={cert.status === 'active' ? 'Active' : 'Retired'} compact />
      </StatsRow>

      <Section>
        <SectionTitle>Credit Details</SectionTitle>
        <Grid>
          <Row><Label>Credit ID</Label><Value>{cert.creditId}</Value></Row>
          <Row><Label>Nutrient Type</Label><Value>{cert.nutrientType}</Value></Row>
          <Row><Label>Quantity</Label><Value>{cert.quantity} kg</Value></Row>
          <Row><Label>Region</Label><Value>{cert.region}</Value></Row>
          <Row><Label>Vintage</Label><Value>{cert.vintage}</Value></Row>
          <Row><Label>Verification</Label><Value>{cert.verificationLevel}</Value></Row>
        </Grid>
      </Section>

      <Section>
        <SectionTitle>On-Chain Verification</SectionTitle>
        <Grid>
          <Row><Label>Token ID</Label><Value>#{cert.tokenId}</Value></Row>
          <Row><Label>Contract</Label><Value>{cert.contractAddress}</Value></Row>
          <Row><Label>Tx Hash</Label><Value>{cert.transactionHash}</Value></Row>
          <Row><Label>Block</Label><Value>{cert.blockNumber.toLocaleString()}</Value></Row>
          <Row><Label>Network</Label><Value>{cert.network}</Value></Row>
          <Row><Label>Minted</Label><Value>{cert.mintedAt}</Value></Row>
        </Grid>
        <div style={{ marginTop: 12 }}>
          <ExtLink href={cert.explorerUrl} target="_blank" rel="noopener">
            View on Polygonscan →
          </ExtLink>
        </div>
      </Section>

      <Section>
        <SectionTitle>Owner</SectionTitle>
        <Row><Label>Wallet Address</Label><Value>{cert.owner}</Value></Row>
      </Section>
    </Page>
  );
}
