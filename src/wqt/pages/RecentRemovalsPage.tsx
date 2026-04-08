import React, { useState, useMemo, useEffect } from 'react';
import styled from 'styled-components';
import type { RegistryCredit } from '../../data/mockRegistryData';
import { fetchRetiredCredits } from '../../services/wqtDataService';
import { FilterChips } from '../../design-system/primitives/FilterChips';
import { Table } from '../../design-system/primitives/Table';
import { Badge, type BadgeVariant } from '../../design-system/primitives/Badge';
import { EmptyState } from '../../design-system/primitives/EmptyState';
import { Skeleton } from '../../design-system/primitives/Skeleton';
import { Modal } from '../../design-system/primitives/Modal';
import { Button } from '../../design-system/primitives/Button';
import SEOHead from '../../components/seo/SEOHead';
import { createBreadcrumbSchema } from '../../components/seo/schemas';

const Page = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px 0;

  @media (min-width: ${({ theme }) => theme.breakpoints.sm}px) {
    padding: 28px 0;
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}px) {
    padding: 32px 0;
  }
`;

const Header = styled.div`
  margin-bottom: 24px;
`;

const Title = styled.h1`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 28px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin: 0 0 4px;

  @media (max-width: 768px) {
    font-size: 24px;
  }
`;

const Subtitle = styled.p`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 0;
`;

const ChipsRow = styled.div`
  margin-bottom: 16px;
`;

const ResultCount = styled.div`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-bottom: 16px;
`;

const ErrorBanner = styled.div`
  padding: 16px 20px;
  background: rgba(239, 68, 68, 0.06);
  border: 1px solid rgba(239, 68, 68, 0.15);
  border-radius: ${({ theme }) => theme.radius.md}px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 16px;
`;

const ErrorText = styled.span`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text};
`;

const SkeletonTable = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const SkeletonRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 80px 80px 1.5fr 100px 100px;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderLight};
`;

const ModalBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 8px 0;
`;

const DetailRow = styled.div``;

const DetailLabel = styled.div`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 11px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin-bottom: 4px;
`;

const DetailValue = styled.div`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 15px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
`;

const DetailSub = styled.div`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-top: 2px;
`;

const DATE_OPTIONS = [
  { value: '30', label: 'Last 30 days' },
  { value: '90', label: 'Last 90 days' },
  { value: '365', label: 'Last year' },
  { value: 'all', label: 'All time' },
];

const TYPE_OPTIONS = [
  { value: 'all', label: 'All Types' },
  { value: 'nitrogen', label: 'Nitrogen' },
  { value: 'phosphorus', label: 'Phosphorus' },
  { value: 'stormwater', label: 'Stormwater' },
  { value: 'thermal', label: 'Thermal' },
];

function creditTypeBadge(type: string) {
  const variants: Record<string, BadgeVariant> = {
    nitrogen: 'info',
    phosphorus: 'positive',
    stormwater: 'neutral',
    thermal: 'warning',
  };
  return (
    <Badge variant={variants[type] || 'neutral'} size="sm">
      {type}
    </Badge>
  );
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function getDaysAgo(dateStr: string) {
  const diffDays = Math.ceil(Math.abs(Date.now() - new Date(dateStr).getTime()) / 86400000);
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
}

const COLUMNS = [
  {
    key: 'id',
    header: 'Credit ID',
    mono: true,
    width: '140px',
    render: (row: RegistryCredit) => row.id,
  },
  {
    key: 'type',
    header: 'Type',
    width: '100px',
    render: (row: RegistryCredit) => creditTypeBadge(row.type),
  },
  {
    key: 'quantity',
    header: 'Quantity',
    align: 'right' as const,
    mono: true,
    render: (row: RegistryCredit) => `${row.quantity.toLocaleString()} ${row.unit}`,
  },
  { key: 'projectName', header: 'Project', render: (row: RegistryCredit) => row.projectName },
  {
    key: 'retirementDate',
    header: 'Retired',
    mono: true,
    width: '120px',
    render: (row: RegistryCredit) => (row.retirementDate ? formatDate(row.retirementDate) : '—'),
  },
  { key: 'verifier', header: 'Retired By', render: (row: RegistryCredit) => row.verifier },
];

function TableSkeleton() {
  return (
    <SkeletonTable>
      {Array.from({ length: 6 }, (_, i) => (
        <SkeletonRow key={i}>
          {Array.from({ length: 6 }, (_, j) => (
            <Skeleton key={j} width="100%" height={16} />
          ))}
        </SkeletonRow>
      ))}
    </SkeletonTable>
  );
}

export function RecentRemovalsPage() {
  useEffect(() => {
    document.title = 'Recent Removals — WaterQuality.Trading';
  }, []);
  const [loading, setLoading] = useState(true);
  const [allRetiredCredits, setAllRetiredCredits] = useState<RegistryCredit[]>([]);
  const [filterType, setFilterType] = useState('all');
  const [dateRange, setDateRange] = useState('90');
  const [selectedCredit, setSelectedCredit] = useState<RegistryCredit | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadCredits = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const realCredits = await fetchRetiredCredits();
      setAllRetiredCredits((Array.isArray(realCredits) ? realCredits : []) as RegistryCredit[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load retired credits.');
      setAllRetiredCredits([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCredits();
  }, [loadCredits]);

  const filteredCredits = useMemo(() => {
    let credits = allRetiredCredits;
    if (filterType !== 'all') {
      credits = credits.filter((credit) => credit.type === filterType);
    }
    if (dateRange !== 'all') {
      const daysAgo = parseInt(dateRange);
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysAgo);
      credits = credits.filter((credit) => {
        if (!credit.retirementDate) return false;
        return new Date(credit.retirementDate) >= cutoffDate;
      });
    }
    return credits.sort((a, b) => {
      if (!a.retirementDate || !b.retirementDate) return 0;
      return new Date(b.retirementDate).getTime() - new Date(a.retirementDate).getTime();
    });
  }, [filterType, dateRange, allRetiredCredits]);

  const removalsSchema = createBreadcrumbSchema([
    { name: 'Home', url: 'https://waterquality.trading/' },
    { name: 'Recent Removals', url: 'https://waterquality.trading/recent-removals' },
  ]);

  return (
    <Page>
      <SEOHead
        title="Recent Credit Retirements"
        description="Track recently retired water quality credits."
        canonical="/recent-removals"
        keywords="credit retirements, retired credits, nutrient removal"
        jsonLd={removalsSchema}
      />

      <Header>
        <Title>Recent Removals</Title>
        <Subtitle>Recently retired and used nutrient credits</Subtitle>
      </Header>

      <ChipsRow>
        <FilterChips
          label="Time period:"
          options={DATE_OPTIONS}
          value={dateRange}
          onChange={setDateRange}
        />
      </ChipsRow>

      <ChipsRow>
        <FilterChips options={TYPE_OPTIONS} value={filterType} onChange={setFilterType} />
      </ChipsRow>

      {error && (
        <ErrorBanner>
          <ErrorText>{error}</ErrorText>
          <Button variant="outline" size="sm" onClick={loadCredits}>
            Retry
          </Button>
        </ErrorBanner>
      )}

      <ResultCount>
        {loading
          ? 'Loading...'
          : `${filteredCredits.length} retirement${filteredCredits.length !== 1 ? 's' : ''} found`}
      </ResultCount>

      {loading ? (
        <TableSkeleton />
      ) : filteredCredits.length === 0 && !error ? (
        <EmptyState
          icon={<span style={{ fontSize: 36 }}>🔄</span>}
          title="No recent retirements"
          description={
            dateRange === 'all'
              ? 'No credits have been retired yet.'
              : 'No credits retired in the selected time period.'
          }
        />
      ) : (
        <Table
          columns={COLUMNS}
          data={filteredCredits}
          rowKey={(row) => row.id}
          onRowClick={(row) => setSelectedCredit(row)}
          compact
        />
      )}

      <Modal
        isOpen={!!selectedCredit}
        onClose={() => setSelectedCredit(null)}
        title={selectedCredit?.id || ''}
      >
        {selectedCredit && (
          <ModalBody>
            <DetailRow>
              <DetailLabel>Project</DetailLabel>
              <DetailValue>{selectedCredit.projectName}</DetailValue>
            </DetailRow>
            <DetailRow>
              <DetailLabel>Credit Type</DetailLabel>
              <DetailValue>{creditTypeBadge(selectedCredit.type)}</DetailValue>
            </DetailRow>
            <DetailRow>
              <DetailLabel>Quantity</DetailLabel>
              <DetailValue>
                {selectedCredit.quantity.toLocaleString()} {selectedCredit.unit}
              </DetailValue>
            </DetailRow>
            <DetailRow>
              <DetailLabel>Project ID</DetailLabel>
              <DetailValue>{selectedCredit.projectId}</DetailValue>
            </DetailRow>
            <DetailRow>
              <DetailLabel>Location</DetailLabel>
              <DetailValue>{selectedCredit.location}</DetailValue>
            </DetailRow>
            <DetailRow>
              <DetailLabel>Original Issue Date</DetailLabel>
              <DetailValue>{formatDate(selectedCredit.issueDate)}</DetailValue>
            </DetailRow>
            {selectedCredit.retirementDate && (
              <DetailRow>
                <DetailLabel>Retirement Date</DetailLabel>
                <DetailValue>
                  {formatDate(selectedCredit.retirementDate)}
                  <DetailSub>{getDaysAgo(selectedCredit.retirementDate)}</DetailSub>
                </DetailValue>
              </DetailRow>
            )}
            <DetailRow>
              <DetailLabel>Verification ID</DetailLabel>
              <DetailValue>{selectedCredit.verificationId}</DetailValue>
            </DetailRow>
            <DetailRow>
              <DetailLabel>Retired By</DetailLabel>
              <DetailValue>{selectedCredit.verifier}</DetailValue>
            </DetailRow>
          </ModalBody>
        )}
      </Modal>
    </Page>
  );
}

export default RecentRemovalsPage;
