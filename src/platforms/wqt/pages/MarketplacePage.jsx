/**
 * WQT Marketplace — the exchange. Table-first layout.
 * Wired to /v2/market/search with loading, error, empty states.
 */

import React, { useState, useCallback, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import { SearchBar } from '../../../design-system/primitives/SearchBar';
import { Table } from '../../../design-system/primitives/Table';
import { Badge } from '../../../design-system/primitives/Badge';
import { EmptyState } from '../../../design-system/primitives/EmptyState';
import { Skeleton } from '../../../design-system/primitives/Skeleton';
import { Button } from '../../../design-system/primitives/Button';
import { useMarketplaceQuery } from '../../../shared/hooks/useApiQueries';

// ── Page layout ───────────────────────────────────────────

const Page = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 32px 24px;
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
`;

const Subtitle = styled.p`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 0;
`;

const FilterRow = styled.div`
  margin-bottom: 20px;
`;

const ViewToggle = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`;

const ResultCount = styled.span`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const PaginationRow = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-top: 24px;
`;

const PageBtn = styled.button`
  padding: 6px 14px;
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 13px;
  font-weight: 500;
  color: ${({ $active, theme }) => ($active ? theme.colors.textOnPrimary : theme.colors.text)};
  background: ${({ $active, theme }) => ($active ? theme.colors.primary : theme.colors.surface)};
  border: 1px solid ${({ $active, theme }) => ($active ? theme.colors.primary : theme.colors.border)};
  border-radius: ${({ theme }) => theme.radius.sm}px;
  cursor: pointer;
  &:hover { opacity: 0.85; }
  &:disabled { opacity: 0.4; cursor: not-allowed; }
`;

const ErrorBanner = styled.div`
  padding: 20px 24px;
  background: rgba(255, 77, 77, 0.06);
  border: 1px solid rgba(255, 77, 77, 0.2);
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
  grid-template-columns: 120px 80px 90px 80px 1fr 120px 90px 100px;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderLight};
`;

// ── Verification badge ────────────────────────────────────

function VerificationBadge({ level }) {
  const map = {
    'sensor-verified': { variant: 'verified', label: 'Sensor Verified' },
    'third-party': { variant: 'positive', label: 'Third-Party' },
    'self-reported': { variant: 'warning', label: 'Pending' },
    'rejected': { variant: 'negative', label: 'Rejected' },
  };
  const cfg = map[level] || map['self-reported'];
  return <Badge variant={cfg.variant} size="sm" dot>{cfg.label}</Badge>;
}

function NutrientBadge({ type }) {
  return (
    <Badge variant={type === 'nitrogen' ? 'info' : 'positive'} size="sm">
      {type === 'nitrogen' ? 'N' : type === 'phosphorus' ? 'P' : 'N+P'}
    </Badge>
  );
}

// ── Table columns ─────────────────────────────────────────

const COLUMNS = [
  {
    key: 'creditId',
    header: 'Credit ID',
    width: '120px',
    mono: true,
    render: (row) => (row.creditId || row.id || '').slice(0, 10) + '…',
  },
  {
    key: 'nutrientType',
    header: 'Type',
    width: '80px',
    render: (row) => <NutrientBadge type={row.nutrientType || 'nitrogen'} />,
  },
  {
    key: 'quantity',
    header: 'Qty (kg)',
    align: 'right',
    mono: true,
    sortable: true,
    render: (row) => Number(row.quantity || 0).toLocaleString(),
  },
  {
    key: 'pricePerCredit',
    header: 'Price',
    align: 'right',
    mono: true,
    sortable: true,
    render: (row) => `$${Number(row.pricePerCredit || 0).toFixed(2)}`,
  },
  {
    key: 'region',
    header: 'Region',
    sortable: true,
    render: (row) => row.region || '—',
  },
  {
    key: 'verificationLevel',
    header: 'Verification',
    render: (row) => <VerificationBadge level={row.verificationLevel || 'self-reported'} />,
  },
  {
    key: 'vintage',
    header: 'Vintage',
    width: '90px',
    mono: true,
    sortable: true,
  },
  {
    key: 'sellerName',
    header: 'Seller',
    render: (row) => row.sellerName || '—',
  },
];

// ── Filter configs ────────────────────────────────────────

const FILTER_CONFIGS = [
  {
    id: 'nutrientType',
    label: 'Nutrient Type',
    options: [
      { value: 'nitrogen', label: 'Nitrogen (N)' },
      { value: 'phosphorus', label: 'Phosphorus (P)' },
      { value: 'combined', label: 'Combined' },
    ],
  },
  {
    id: 'verificationLevel',
    label: 'Verification',
    options: [
      { value: 'sensor-verified', label: 'Sensor Verified' },
      { value: 'third-party', label: 'Third-Party' },
      { value: 'self-reported', label: 'Pending' },
    ],
  },
];

const PER_PAGE = 20;

// ── Loading skeleton ──────────────────────────────────────

function TableSkeleton() {
  return (
    <SkeletonTable>
      {Array.from({ length: 8 }, (_, i) => (
        <SkeletonRow key={i}>
          <Skeleton width="100%" height={16} />
          <Skeleton width="100%" height={16} />
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

// ── Component ─────────────────────────────────────────────

export function MarketplacePage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [search, setSearch] = useState(searchParams.get('q') || '');
  const [filters, setFilters] = useState({
    nutrientType: searchParams.get('nutrientType') || '',
    verificationLevel: searchParams.get('verificationLevel') || '',
  });
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);
  const debounceRef = useRef(null);

  const queryParams = {
    page,
    limit: PER_PAGE,
    query: search || undefined,
    nutrientType: filters.nutrientType || undefined,
    verificationLevel: filters.verificationLevel || undefined,
  };

  const { data, isLoading: loading, error: queryError, refetch } = useMarketplaceQuery(queryParams);

  const listings = data?.data || [];
  const pagination = data?.pagination || null;
  const error = queryError?.message || null;

  // Sync URL search params
  const updateUrl = useCallback((p, q, f) => {
    const params = new URLSearchParams();
    if (p > 1) params.set('page', String(p));
    if (q) params.set('q', q);
    if (f.nutrientType) params.set('nutrientType', f.nutrientType);
    if (f.verificationLevel) params.set('verificationLevel', f.verificationLevel);
    setSearchParams(params, { replace: true });
  }, [setSearchParams]);

  React.useEffect(() => {
    updateUrl(page, search, filters);
  }, [page, search, filters, updateUrl]);

  const handleSearchChange = useCallback((value) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setSearch(value);
      setPage(1);
    }, 300);
  }, []);

  const handleFilterChange = useCallback((id, value) => {
    setFilters((prev) => ({ ...prev, [id]: value }));
    setPage(1);
  }, []);

  const handleRowClick = useCallback((row) => {
    navigate(`/marketplace/listing/${row.id}`);
  }, [navigate]);

  const totalPages = pagination?.totalPages || 1;
  const total = pagination?.total || listings.length;

  return (
    <Page>
      <Header>
        <Title>Marketplace</Title>
        <Subtitle>Browse verified nutrient credits. Click any listing for details.</Subtitle>
      </Header>

      <FilterRow>
        <SearchBar
          placeholder="Search by credit ID, region, or seller…"
          defaultValue={search}
          onChange={handleSearchChange}
          filters={FILTER_CONFIGS}
          activeFilters={filters}
          onFilterChange={handleFilterChange}
        />
      </FilterRow>

      {error && (
        <ErrorBanner>
          <ErrorText>{error}</ErrorText>
          <Button variant="outline" size="sm" onClick={() => refetch()}>Retry</Button>
        </ErrorBanner>
      )}

      <ViewToggle>
        <ResultCount>
          {loading ? 'Loading…' : `${total} listing${total !== 1 ? 's' : ''}`}
        </ResultCount>
      </ViewToggle>

      {loading ? (
        <TableSkeleton />
      ) : listings.length === 0 && !error ? (
        <EmptyState
          title="No listings found"
          description="Try adjusting your filters or search terms."
          action={{ label: 'Clear Filters', onClick: () => { setSearch(''); setFilters({}); setPage(1); } }}
        />
      ) : listings.length > 0 ? (
        <>
          <Table
            columns={COLUMNS}
            data={listings}
            rowKey={(row) => row.id}
            onRowClick={handleRowClick}
            compact
          />
          {totalPages > 1 && (
            <PaginationRow>
              <PageBtn disabled={page === 1} onClick={() => setPage((p) => p - 1)}>← Prev</PageBtn>
              {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                const pageNum = i + 1;
                return (
                  <PageBtn key={pageNum} $active={page === pageNum} onClick={() => setPage(pageNum)}>
                    {pageNum}
                  </PageBtn>
                );
              })}
              {totalPages > 7 && <span>…</span>}
              <PageBtn disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>Next →</PageBtn>
            </PaginationRow>
          )}
        </>
      ) : null}
    </Page>
  );
}

export default MarketplacePage;
