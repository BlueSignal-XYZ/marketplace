import React, { useState, useMemo, useEffect } from 'react';
import styled from 'styled-components';
import { AnimatePresence } from 'framer-motion';
import { RegistryCredit, mockRegistryCredits } from '../../data/mockRegistryData';
import { fetchRegistryCredits } from '../../services/wqtDataService';
import { isDemoMode } from '../../utils/demoMode';
import { SearchBar } from '../../design-system/primitives/SearchBar';
import { FilterChips } from '../../design-system/primitives/FilterChips';
import { Table } from '../../design-system/primitives/Table';
import { Badge } from '../../design-system/primitives/Badge';
import { EmptyState } from '../../design-system/primitives/EmptyState';
import { Skeleton } from '../../design-system/primitives/Skeleton';
import { Modal } from '../../design-system/primitives/Modal';
import { Button } from '../../design-system/primitives/Button';
import SEOHead from '../../components/seo/SEOHead';
import { createBreadcrumbSchema } from '../../components/seo/schemas';

const Page = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px 16px;

  @media (min-width: ${({ theme }) => theme.breakpoints.sm}px) {
    padding: 28px 24px;
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}px) {
    padding: 32px 48px;
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

const FilterRow = styled.div`
  margin-bottom: 16px;
`;

const ChipsRow = styled.div`
  margin-bottom: 20px;
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
  grid-template-columns: 1fr 80px 100px 1.5fr 100px 80px;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderLight};

  @media (max-width: 768px) {
    grid-template-columns: 1fr 80px 80px;
  }
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

const FILTER_OPTIONS = [
  { value: 'all', label: 'All Credits' },
  { value: 'qc', label: 'AWG Credits' },
  { value: 'nitrogen', label: 'Nitrogen' },
  { value: 'phosphorus', label: 'Phosphorus' },
];

function creditTypeBadge(type: string) {
  const variants: Record<string, any> = {
    qc: 'info',
    kc: 'positive',
    nitrogen: 'info',
    phosphorus: 'positive',
  };
  const labels: Record<string, string> = {
    qc: 'AWG',
    nitrogen: 'Nitrogen',
    phosphorus: 'Phosphorus',
  };
  return <Badge variant={variants[type] || 'neutral'} size="sm">{labels[type] || type}</Badge>;
}

function statusBadge(status: string) {
  return (
    <Badge variant={status === 'active' ? 'positive' : 'neutral'} size="sm" dot>
      {status === 'active' ? 'Active' : 'Retired'}
    </Badge>
  );
}

const COLUMNS = [
  {
    key: 'id',
    header: 'Credit ID',
    mono: true,
    sortable: true,
    width: '140px',
    render: (row: RegistryCredit) => row.id,
  },
  {
    key: 'type',
    header: 'Type',
    sortable: true,
    width: '100px',
    render: (row: RegistryCredit) => creditTypeBadge(row.type),
  },
  {
    key: 'quantity',
    header: 'Quantity',
    align: 'right' as const,
    mono: true,
    sortable: true,
    render: (row: RegistryCredit) => `${row.quantity.toLocaleString()} ${row.unit}`,
  },
  {
    key: 'projectName',
    header: 'Project',
    render: (row: RegistryCredit) => row.projectName,
  },
  {
    key: 'issueDate',
    header: 'Issue Date',
    mono: true,
    sortable: true,
    width: '110px',
    render: (row: RegistryCredit) => new Date(row.issueDate).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
    }),
  },
  {
    key: 'status',
    header: 'Status',
    sortable: true,
    width: '100px',
    render: (row: RegistryCredit) => statusBadge(row.status),
  },
];

function TableSkeleton() {
  return (
    <SkeletonTable>
      {Array.from({ length: 6 }, (_, i) => (
        <SkeletonRow key={i}>
          <Skeleton width="100%" height={16} />
          <Skeleton width="100%" height={16} />
          <Skeleton width="100%" height={16} />
          <Skeleton width="100%" height={16} />
          <Skeleton width="100%" height={16} />
          <Skeleton width="100%" height={16} />
        </SkeletonRow>
      ))}
    </SkeletonTable>
  );
}

export function RegistryPage() {
  const [loading, setLoading] = useState(true);
  const [allCredits, setAllCredits] = useState<RegistryCredit[]>([]);
  const [filterType, setFilterType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCredit, setSelectedCredit] = useState<RegistryCredit | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadCredits = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (isDemoMode()) {
        setAllCredits(mockRegistryCredits);
      } else {
        const realCredits = await fetchRegistryCredits();
        setAllCredits((Array.isArray(realCredits) ? realCredits : []) as RegistryCredit[]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load registry credits.');
      setAllCredits([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCredits();
  }, [loadCredits]);

  const filteredCredits = useMemo(() => {
    let credits = allCredits;
    if (filterType !== 'all') {
      credits = credits.filter(c => c.type === filterType);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      credits = credits.filter(c =>
        c.id.toLowerCase().includes(q) ||
        c.projectName.toLowerCase().includes(q) ||
        c.location.toLowerCase().includes(q)
      );
    }
    return credits;
  }, [filterType, searchQuery, allCredits]);

  const registrySchema = createBreadcrumbSchema([
    { name: 'Home', url: 'https://waterquality.trading/' },
    { name: 'Registry', url: 'https://waterquality.trading/registry' },
  ]);

  return (
    <Page>
      <SEOHead
        title="Water Quality Credit Registry"
        description="Public registry of all water quality trading credits."
        canonical="/registry"
        keywords="credit registry, AWG credits, verified credits, water quality trading"
        jsonLd={registrySchema}
      />

      <Header>
        <Title>Credit Registry</Title>
        <Subtitle>Public registry of all water quality trading credits</Subtitle>
      </Header>

      <FilterRow>
        <SearchBar
          placeholder="Search by credit ID, project name, or location..."
          value={searchQuery}
          onChange={setSearchQuery}
        />
      </FilterRow>

      <ChipsRow>
        <FilterChips
          options={FILTER_OPTIONS}
          value={filterType}
          onChange={setFilterType}
        />
      </ChipsRow>

      {error && (
        <ErrorBanner>
          <ErrorText>{error}</ErrorText>
          <Button variant="outline" size="sm" onClick={loadCredits}>Retry</Button>
        </ErrorBanner>
      )}

      <ResultCount>
        {loading ? 'Loading...' : `${filteredCredits.length} credit${filteredCredits.length !== 1 ? 's' : ''} found`}
      </ResultCount>

      {loading ? (
        <TableSkeleton />
      ) : filteredCredits.length === 0 && !error ? (
        <EmptyState
          icon={<span style={{ fontSize: 36 }}>📋</span>}
          title="No credits found"
          description={
            searchQuery
              ? 'Try adjusting your search or filter criteria.'
              : 'No credits have been registered yet. Check back soon.'
          }
          action={searchQuery ? { label: 'Clear Search', onClick: () => { setSearchQuery(''); setFilterType('all'); } } : undefined}
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
              <DetailValue>{selectedCredit.quantity.toLocaleString()} {selectedCredit.unit}</DetailValue>
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
              <DetailLabel>Issue Date</DetailLabel>
              <DetailValue>{new Date(selectedCredit.issueDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</DetailValue>
            </DetailRow>
            {selectedCredit.retirementDate && (
              <DetailRow>
                <DetailLabel>Retirement Date</DetailLabel>
                <DetailValue>{new Date(selectedCredit.retirementDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</DetailValue>
              </DetailRow>
            )}
            <DetailRow>
              <DetailLabel>Status</DetailLabel>
              <DetailValue>{statusBadge(selectedCredit.status)}</DetailValue>
            </DetailRow>
            <DetailRow>
              <DetailLabel>Verification ID</DetailLabel>
              <DetailValue>{selectedCredit.verificationId}</DetailValue>
            </DetailRow>
            <DetailRow>
              <DetailLabel>Verifier</DetailLabel>
              <DetailValue>{selectedCredit.verifier}</DetailValue>
            </DetailRow>
          </ModalBody>
        )}
      </Modal>
    </Page>
  );
}

export default RegistryPage;
