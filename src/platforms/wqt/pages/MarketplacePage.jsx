/**
 * WQT Marketplace — the exchange. Table-first layout.
 * Wired to /v2/market/search with loading, error, empty states.
 */

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { SearchBar } from '../../../design-system/primitives/SearchBar';
import { Table } from '../../../design-system/primitives/Table';
import { Badge } from '../../../design-system/primitives/Badge';
import { EmptyState } from '../../../design-system/primitives/EmptyState';
import { Skeleton } from '../../../design-system/primitives/Skeleton';
import { Button } from '../../../design-system/primitives/Button';
import { Pagination } from '../../../design-system/primitives/Pagination';
import { useMarketplaceQuery } from '../../../shared/hooks/useApiQueries';

// ── Page layout ───────────────────────────────────────────

const Page = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px 16px;
  overflow-x: hidden;
  box-sizing: border-box;

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
`;

const Subtitle = styled.p`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 0;
`;

const FilterRow = styled.div`
  margin-bottom: 20px;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;

  & > * {
    flex: 1;
    min-width: 0;
  }
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
  const label = type === 'nitrogen' ? 'Nitrogen' : type === 'phosphorus' ? 'Phosphorus' : 'Nitrogen and Phosphorus';
  return (
    <Badge variant={type === 'nitrogen' ? 'info' : 'positive'} size="sm" aria-label={label}>
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
    render: (row) => {
      const fullId = row.creditId || row.id || '';
      return <span title={fullId}>{fullId.slice(0, 10)}…</span>;
    },
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
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => { document.title = 'Marketplace — WaterQuality.Trading'; }, []);

  const [searchInput, setSearchInput] = useState(searchParams.get('q') || '');
  const [search, setSearch] = useState(searchParams.get('q') || '');
  const [filters, setFilters] = useState({
    nutrientType: searchParams.get('nutrientType') || '',
    verificationLevel: searchParams.get('verificationLevel') || '',
  });
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);
  const debounceRef = useRef(null);
  const initialKeyRef = useRef(location.key);
  const skipUrlSyncRef = useRef(false);

  // Sync state from URL params on back/forward navigation
  useEffect(() => {
    if (location.key === initialKeyRef.current) return;
    if (skipUrlSyncRef.current) {
      skipUrlSyncRef.current = false;
      return;
    }
    const q = searchParams.get('q') || '';
    setSearchInput(q);
    setSearch(q);
    setFilters({
      nutrientType: searchParams.get('nutrientType') || '',
      verificationLevel: searchParams.get('verificationLevel') || '',
    });
    setPage(Number(searchParams.get('page')) || 1);
  }, [location.key, searchParams]);

  // Clean up debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

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
  const updateUrlRef = React.useRef();
  updateUrlRef.current = setSearchParams;

  React.useEffect(() => {
    const params = new URLSearchParams();
    if (page > 1) params.set('page', String(page));
    if (search) params.set('q', search);
    if (filters.nutrientType) params.set('nutrientType', filters.nutrientType);
    if (filters.verificationLevel) params.set('verificationLevel', filters.verificationLevel);

    // Only update URL if params actually changed to prevent replaceState loops
    const newSearch = params.toString();
    const currentSearch = searchParams.toString();
    if (newSearch === currentSearch) return;

    skipUrlSyncRef.current = true;
    updateUrlRef.current(params, { replace: true });
  }, [page, search, filters, searchParams]);

  const handleSearchChange = useCallback((value) => {
    setSearchInput(value);
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
          value={searchInput}
          onChange={handleSearchChange}
          filters={FILTER_CONFIGS}
          activeFilters={filters}
          onFilterChange={handleFilterChange}
          aria-label="Search marketplace listings"
        />
      </FilterRow>

      {error && (
        <ErrorBanner>
          <ErrorText>{error}</ErrorText>
          <Button variant="outline" size="sm" onClick={() => refetch()}>Retry</Button>
        </ErrorBanner>
      )}

      <ViewToggle>
        <ResultCount aria-live="polite">
          {loading ? 'Loading…' : `${total} listing${total !== 1 ? 's' : ''}`}
        </ResultCount>
      </ViewToggle>

      {loading ? (
        <TableSkeleton />
      ) : listings.length === 0 && !error ? (
        search || filters.nutrientType || filters.verificationLevel ? (
          <EmptyState
            icon={<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>}
            title="No listings found"
            description="Try adjusting your filters or search terms."
            action={{ label: 'Clear Filters', onClick: () => { setSearchInput(''); setSearch(''); setFilters({}); setPage(1); } }}
          />
        ) : (
          <EmptyState
            icon={<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>}
            title="No listings yet"
            description="Check back soon — verified nutrient credits will appear here as they're listed."
          />
        )
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
            <Pagination
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          )}
        </>
      ) : null}
    </Page>
  );
}

export default MarketplacePage;
