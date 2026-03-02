/**
 * WQT Listing Detail — wired to /v2/market/listing/:id.
 * Loading skeleton, error state, tab layout.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Badge } from '../../../design-system/primitives/Badge';
import { DataCard } from '../../../design-system/primitives/DataCard';
import { Button } from '../../../design-system/primitives/Button';
import { Tabs } from '../../../design-system/primitives/Tabs';
import { Skeleton } from '../../../design-system/primitives/Skeleton';
import { EmptyState } from '../../../design-system/primitives/EmptyState';
import { getListing, ApiError } from '../../../services/v2/api';

const Page = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 24px 16px;

  @media (min-width: ${({ theme }) => theme.breakpoints.sm}px) {
    padding: 28px 24px;
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}px) {
    padding: 32px 48px;
  }
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

  @media (max-width: ${({ theme }) => theme.breakpoints.md}px) {
    flex-direction: column;
  }
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
  flex-wrap: wrap;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}px) {
    font-size: 20px;
  }
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

  @media (max-width: ${({ theme }) => theme.breakpoints.md}px) {
    min-width: 0;
    width: 100%;
  }
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
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 16px;
  margin-bottom: 32px;
`;

const Section = styled.section`
  margin-bottom: 32px;
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

const ErrorBox = styled.div`
  text-align: center;
  padding: 64px 24px;
`;

const ErrorTitle = styled.h2`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 20px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin: 0 0 8px;
`;

const ErrorDesc = styled.p`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 0 0 16px;
`;

const SkeletonBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

function DetailSkeleton() {
  return (
    <Page>
      <Skeleton width={120} height={14} />
      <div style={{ height: 20 }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap' }}>
        <SkeletonBlock>
          <Skeleton width={280} height={28} />
          <Skeleton width={200} height={14} />
        </SkeletonBlock>
        <Skeleton width={260} height={140} />
      </div>
      <div style={{ height: 32 }} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        {[1,2,3,4].map(i => <Skeleton key={i} height={80} />)}
      </div>
    </Page>
  );
}

function verificationLabel(level) {
  const map = {
    'sensor-verified': 'Sensor Verified',
    'third-party': 'Third-Party Verified',
    'self-reported': 'Pending Review',
    'rejected': 'Rejected',
  };
  return map[level] || level || 'Unknown';
}

function verificationVariant(level) {
  const map = {
    'sensor-verified': 'verified',
    'third-party': 'positive',
    'self-reported': 'warning',
    'rejected': 'negative',
  };
  return map[level] || 'neutral';
}

// ── Component ─────────────────────────────────────────────

export function ListingDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('details');

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getListing(id);
      setListing(data);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to load listing.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetchData(); }, [fetchData]);

  if (loading) return <DetailSkeleton />;

  if (error || !listing) {
    return (
      <Page>
        <Back to="/marketplace">← Back to Marketplace</Back>
        <ErrorBox>
          <ErrorTitle>Listing not found</ErrorTitle>
          <ErrorDesc>{error || 'This listing may have been removed or is no longer available.'}</ErrorDesc>
          <Button variant="outline" onClick={() => navigate('/marketplace')}>Back to Marketplace</Button>
        </ErrorBox>
      </Page>
    );
  }

  const totalPrice = (listing.pricePerCredit || 0) * (listing.quantity || 0);

  const tabs = [
    { id: 'details', label: 'Details' },
    { id: 'certificate', label: 'Certificate' },
  ];

  return (
    <Page>
      <Back to="/marketplace">← Back to Marketplace</Back>

      <HeaderRow>
        <HeaderLeft>
          <Title>
            {listing.nutrientType === 'nitrogen' ? 'Nitrogen' : listing.nutrientType === 'phosphorus' ? 'Phosphorus' : 'Combined'} Credits
            <Badge variant={verificationVariant(listing.verificationLevel)} size="sm" dot>
              {verificationLabel(listing.verificationLevel)}
            </Badge>
          </Title>
          <MetaRow>
            <MetaItem>{listing.region || '—'}</MetaItem>
            <MetaItem>•</MetaItem>
            <MetaItem>Vintage {listing.vintage || '—'}</MetaItem>
            <MetaItem>•</MetaItem>
            <MetaItem>Seller: {listing.sellerName || '—'}</MetaItem>
          </MetaRow>
        </HeaderLeft>
        <PriceCard>
          <PriceLabel>Price per Credit</PriceLabel>
          <PriceValue>${(listing.pricePerCredit || 0).toFixed(2)}</PriceValue>
          <PriceSub>{(listing.quantity || 0).toLocaleString()} kg available · ${totalPrice.toLocaleString()} total</PriceSub>
          <Button fullWidth onClick={() => navigate(`/purchase/${listing.id}`)}>Buy Credits</Button>
        </PriceCard>
      </HeaderRow>

      <StatsGrid>
        <DataCard label="Quantity" value={(listing.quantity || 0).toLocaleString()} unit="kg" compact />
        <DataCard label="Price" value={`$${(listing.pricePerCredit || 0).toFixed(2)}`} unit="/credit" compact />
        <DataCard label="Total Value" value={`$${totalPrice.toLocaleString()}`} compact />
        {listing.deviceId && <DataCard label="Device" value={listing.deviceId} compact />}
      </StatsGrid>

      <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === 'details' && (
        <Section style={{ marginTop: 24 }}>
          <InfoGrid>
            <InfoItem><InfoLabel>Credit ID</InfoLabel><InfoValue>{listing.creditId || listing.id}</InfoValue></InfoItem>
            <InfoItem><InfoLabel>Nutrient Type</InfoLabel><InfoValue>{listing.nutrientType}</InfoValue></InfoItem>
            <InfoItem><InfoLabel>Region</InfoLabel><InfoValue>{listing.region || '—'}</InfoValue></InfoItem>
            <InfoItem><InfoLabel>Program</InfoLabel><InfoValue>{listing.programId || '—'}</InfoValue></InfoItem>
            <InfoItem><InfoLabel>Vintage</InfoLabel><InfoValue>{listing.vintage || '—'}</InfoValue></InfoItem>
            <InfoItem><InfoLabel>Listed</InfoLabel><InfoValue>{listing.createdAt || '—'}</InfoValue></InfoItem>
            <InfoItem><InfoLabel>Verification</InfoLabel><InfoValue>{verificationLabel(listing.verificationLevel)}</InfoValue></InfoItem>
            <InfoItem><InfoLabel>Status</InfoLabel><InfoValue>{listing.status}</InfoValue></InfoItem>
          </InfoGrid>
        </Section>
      )}

      {activeTab === 'certificate' && (
        <Section style={{ marginTop: 24 }}>
          {listing.certificateId ? (
            <InfoGrid>
              <InfoItem><InfoLabel>Certificate ID</InfoLabel><InfoValue>{listing.certificateId}</InfoValue></InfoItem>
              <InfoItem>
                <InfoLabel>View Certificate</InfoLabel>
                <InfoValue>
                  <Link to={`/certificate/${listing.certificateId}`} style={{ color: 'inherit' }}>
                    Open →
                  </Link>
                </InfoValue>
              </InfoItem>
            </InfoGrid>
          ) : (
            <EmptyState
              compact
              icon={<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6"/><path d="M12 18v-6"/><path d="m9 15 3-3 3 3"/></svg>}
              title="No certificate yet"
              description="On-chain certificate will be available after verification is complete."
            />
          )}
        </Section>
      )}
    </Page>
  );
}

export default ListingDetailPage;
