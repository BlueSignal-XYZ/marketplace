/**
 * WQT Listing Detail — credit detail with sensor data, certificate, lineage.
 */

import React from 'react';
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import { Badge } from '../../../design-system/primitives/Badge';
import { DataCard } from '../../../design-system/primitives/DataCard';
import { Button } from '../../../design-system/primitives/Button';
import { Tabs } from '../../../design-system/primitives/Tabs';

const Page = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 32px 24px;
`;

const Back = styled(Link)`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textSecondary};
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 20px;
  &:hover { color: ${({ theme }) => theme.colors.primary}; }
`;

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 24px;
  margin-bottom: 32px;
  flex-wrap: wrap;
`;

const HeaderLeft = styled.div``;

const Title = styled.h1`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 24px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin: 0 0 8px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const MetaRow = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
  flex-wrap: wrap;
`;

const MetaItem = styled.span`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const PriceCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md}px;
  padding: 24px;
  min-width: 260px;
`;

const PriceLabel = styled.div`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-bottom: 4px;
`;

const PriceValue = styled.div`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 32px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 4px;
`;

const PriceSub = styled.div`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: 16px;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
  margin-bottom: 32px;
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
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  @media (max-width: 640px) { grid-template-columns: 1fr; }
`;

const InfoItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 10px 14px;
  background: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.radius.sm}px;
`;

const InfoLabel = styled.span`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const InfoValue = styled.span`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`;

const Timeline = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
`;

const TimelineStep = styled.div`
  display: flex;
  gap: 16px;
  padding: 12px 0;
`;

const TimelineDot = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${({ $active, theme }) => ($active ? theme.colors.primary : theme.colors.border)};
  margin-top: 4px;
  flex-shrink: 0;
  position: relative;
  &::after {
    content: '';
    position: absolute;
    top: 12px;
    left: 4px;
    width: 2px;
    height: calc(100% + 12px);
    background: ${({ theme }) => theme.colors.borderLight};
  }
`;

const TimelineContent = styled.div``;

const TimelineLabel = styled.div`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
`;

const TimelineDate = styled.div`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textMuted};
`;

// ── Component ─────────────────────────────────────────────

export function ListingDetailPage() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = React.useState('details');

  // TODO: Fetch from /v2/market/search or listing API
  const listing = {
    id,
    creditId: '0x7a3f9c2e1b4d',
    nutrientType: 'nitrogen',
    quantity: 250,
    pricePerCredit: 8.42,
    region: 'Virginia - James River Basin',
    verificationLevel: 'sensor-verified',
    vintage: '2025',
    sellerName: 'BlueSignal IoT',
    deviceId: 'BS-WQM-1042',
    programId: 'va-nce',
    certificateId: '0xabc...def',
    status: 'active',
    createdAt: '2025-11-15',
  };

  const tabs = [
    { id: 'details', label: 'Details' },
    { id: 'sensor', label: 'Sensor Data' },
    { id: 'certificate', label: 'Certificate' },
    { id: 'lineage', label: 'Lineage' },
  ];

  return (
    <Page>
      <Back to="/marketplace">← Back to Marketplace</Back>

      <HeaderRow>
        <HeaderLeft>
          <Title>
            {listing.nutrientType === 'nitrogen' ? 'Nitrogen' : 'Phosphorus'} Credits
            <Badge variant="verified" size="sm" dot>Sensor Verified</Badge>
          </Title>
          <MetaRow>
            <MetaItem>{listing.region}</MetaItem>
            <MetaItem>•</MetaItem>
            <MetaItem>Vintage {listing.vintage}</MetaItem>
            <MetaItem>•</MetaItem>
            <MetaItem>Seller: {listing.sellerName}</MetaItem>
          </MetaRow>
        </HeaderLeft>
        <PriceCard>
          <PriceLabel>Price per Credit</PriceLabel>
          <PriceValue>${listing.pricePerCredit.toFixed(2)}</PriceValue>
          <PriceSub>{listing.quantity} kg available · ${(listing.pricePerCredit * listing.quantity).toLocaleString()} total</PriceSub>
          <Button fullWidth>Buy Credits</Button>
        </PriceCard>
      </HeaderRow>

      <StatsGrid>
        <DataCard label="Quantity" value={listing.quantity.toLocaleString()} unit="kg" compact />
        <DataCard label="Price" value={`$${listing.pricePerCredit.toFixed(2)}`} unit="/credit" compact />
        <DataCard label="Total Value" value={`$${(listing.pricePerCredit * listing.quantity).toLocaleString()}`} compact />
        <DataCard label="Device" value={listing.deviceId} compact />
      </StatsGrid>

      <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === 'details' && (
        <Section style={{ marginTop: 24 }}>
          <InfoGrid>
            <InfoItem><InfoLabel>Credit ID</InfoLabel><InfoValue>{listing.creditId}</InfoValue></InfoItem>
            <InfoItem><InfoLabel>Nutrient Type</InfoLabel><InfoValue>{listing.nutrientType}</InfoValue></InfoItem>
            <InfoItem><InfoLabel>Region</InfoLabel><InfoValue>{listing.region}</InfoValue></InfoItem>
            <InfoItem><InfoLabel>Program</InfoLabel><InfoValue>Virginia Nutrient Credit Exchange</InfoValue></InfoItem>
            <InfoItem><InfoLabel>Vintage</InfoLabel><InfoValue>{listing.vintage}</InfoValue></InfoItem>
            <InfoItem><InfoLabel>Listed</InfoLabel><InfoValue>{listing.createdAt}</InfoValue></InfoItem>
            <InfoItem><InfoLabel>Verification</InfoLabel><InfoValue>{listing.verificationLevel}</InfoValue></InfoItem>
            <InfoItem><InfoLabel>Status</InfoLabel><InfoValue>{listing.status}</InfoValue></InfoItem>
          </InfoGrid>
        </Section>
      )}

      {activeTab === 'sensor' && (
        <Section style={{ marginTop: 24 }}>
          <SectionTitle>Sensor Data — {listing.deviceId}</SectionTitle>
          <StatsGrid>
            <DataCard label="pH" value="7.2" compact />
            <DataCard label="TDS" value="342" unit="ppm" compact />
            <DataCard label="Turbidity" value="4.1" unit="NTU" compact />
            <DataCard label="Temperature" value="18.3" unit="°C" compact />
          </StatsGrid>
          <InfoItem style={{ marginBottom: 8 }}>
            <InfoLabel>Data Coverage</InfoLabel><InfoValue>96.2%</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>Last Reading</InfoLabel><InfoValue>2 minutes ago</InfoValue>
          </InfoItem>
        </Section>
      )}

      {activeTab === 'certificate' && (
        <Section style={{ marginTop: 24 }}>
          <SectionTitle>On-Chain Certificate</SectionTitle>
          <InfoGrid>
            <InfoItem><InfoLabel>Token ID</InfoLabel><InfoValue>#1042</InfoValue></InfoItem>
            <InfoItem><InfoLabel>Contract</InfoLabel><InfoValue>0x7a3f…9c2e</InfoValue></InfoItem>
            <InfoItem><InfoLabel>Network</InfoLabel><InfoValue>Polygon</InfoValue></InfoItem>
            <InfoItem><InfoLabel>Block</InfoLabel><InfoValue>45,892,103</InfoValue></InfoItem>
            <InfoItem><InfoLabel>Tx Hash</InfoLabel><InfoValue>0xdef…abc</InfoValue></InfoItem>
            <InfoItem><InfoLabel>Mint Date</InfoLabel><InfoValue>2025-11-15</InfoValue></InfoItem>
          </InfoGrid>
        </Section>
      )}

      {activeTab === 'lineage' && (
        <Section style={{ marginTop: 24 }}>
          <SectionTitle>Credit Lineage</SectionTitle>
          <Timeline>
            {[
              { label: 'Generated', date: '2025-11-10', active: true },
              { label: 'Verified (Sensor)', date: '2025-11-12', active: true },
              { label: 'Minted on Polygon', date: '2025-11-13', active: true },
              { label: 'Listed on WQT', date: '2025-11-15', active: true },
              { label: 'Purchased', date: '—', active: false },
              { label: 'Retired', date: '—', active: false },
            ].map((step, i) => (
              <TimelineStep key={i}>
                <TimelineDot $active={step.active} />
                <TimelineContent>
                  <TimelineLabel>{step.label}</TimelineLabel>
                  <TimelineDate>{step.date}</TimelineDate>
                </TimelineContent>
              </TimelineStep>
            ))}
          </Timeline>
        </Section>
      )}
    </Page>
  );
}
