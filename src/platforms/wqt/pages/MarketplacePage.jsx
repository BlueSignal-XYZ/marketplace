/**
 * WQT Marketplace — the exchange. Table-first layout.
 * Filter bar + listing table + pagination. NOT a card grid.
 */

import React, { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { SearchBar } from '../../../design-system/primitives/SearchBar';
import { Table } from '../../../design-system/primitives/Table';
import { Badge } from '../../../design-system/primitives/Badge';
import { Tabs } from '../../../design-system/primitives/Tabs';
import { EmptyState } from '../../../design-system/primitives/EmptyState';
import { Skeleton } from '../../../design-system/primitives/Skeleton';

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
    render: (row) => <NutrientBadge type={row.nutrientType || row.pollutant || 'nitrogen'} />,
  },
  {
    key: 'quantity',
    header: 'Qty (kg)',
    align: 'right',
    mono: true,
    sortable: true,
    render: (row) => Number(row.quantity || row.quantityAvailable || 0).toLocaleString(),
  },
  {
    key: 'pricePerCredit',
    header: 'Price',
    align: 'right',
    mono: true,
    sortable: true,
    render: (row) => `$${Number(row.pricePerCredit || row.pricePerUnit || 0).toFixed(2)}`,
  },
  {
    key: 'region',
    header: 'Region',
    sortable: true,
    render: (row) => row.region || row.location || '—',
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
    render: (row) => row.sellerName || row.seller || '—',
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
    id: 'verification',
    label: 'Verification',
    options: [
      { value: 'sensor-verified', label: 'Sensor Verified' },
      { value: 'third-party', label: 'Third-Party' },
      { value: 'self-reported', label: 'Pending' },
    ],
  },
];

// ── Placeholder data ──────────────────────────────────────

const PLACEHOLDER_LISTINGS = Array.from({ length: 12 }, (_, i) => ({
  id: `cred-${String(i + 1).padStart(4, '0')}`,
  creditId: `0x${Math.random().toString(16).slice(2, 14)}`,
  nutrientType: i % 3 === 0 ? 'phosphorus' : 'nitrogen',
  quantity: Math.floor(Math.random() * 500) + 10,
  pricePerCredit: +(Math.random() * 15 + 3).toFixed(2),
  region: ['Virginia - James River', 'Virginia - Potomac', 'Chesapeake Bay', 'Virginia - York'][i % 4],
  verificationLevel: ['sensor-verified', 'sensor-verified', 'third-party', 'self-reported'][i % 4],
  vintage: ['2025', '2024', '2025', '2024-Q3'][i % 4],
  sellerName: ['BlueSignal IoT', 'EcoRestore LLC', 'GreenField Farms', 'WaterWorks Inc.'][i % 4],
  status: 'active',
}));

// ── Component ─────────────────────────────────────────────

export function MarketplacePage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({});
  const [page, setPage] = useState(1);
  const perPage = 10;

  // TODO: Replace with /v2/market/search API call
  const filteredData = useMemo(() => {
    let data = PLACEHOLDER_LISTINGS;
    if (search) {
      const q = search.toLowerCase();
      data = data.filter((d) =>
        d.creditId.toLowerCase().includes(q) ||
        d.region.toLowerCase().includes(q) ||
        d.sellerName.toLowerCase().includes(q)
      );
    }
    if (filters.nutrientType) {
      data = data.filter((d) => d.nutrientType === filters.nutrientType);
    }
    if (filters.verification) {
      data = data.filter((d) => d.verificationLevel === filters.verification);
    }
    return data;
  }, [search, filters]);

  const totalPages = Math.ceil(filteredData.length / perPage);
  const pageData = filteredData.slice((page - 1) * perPage, page * perPage);

  const handleRowClick = useCallback((row) => {
    navigate(`/marketplace/listing/${row.id}`);
  }, [navigate]);

  const handleFilterChange = useCallback((id, value) => {
    setFilters((prev) => ({ ...prev, [id]: value }));
    setPage(1);
  }, []);

  return (
    <Page>
      <Header>
        <Title>Marketplace</Title>
        <Subtitle>Browse verified nutrient credits. Click any listing for details.</Subtitle>
      </Header>

      <FilterRow>
        <SearchBar
          placeholder="Search by credit ID, region, or seller…"
          value={search}
          onChange={(v) => { setSearch(v); setPage(1); }}
          filters={FILTER_CONFIGS}
          activeFilters={filters}
          onFilterChange={handleFilterChange}
        />
      </FilterRow>

      <ViewToggle>
        <ResultCount>{filteredData.length} listing{filteredData.length !== 1 ? 's' : ''}</ResultCount>
      </ViewToggle>

      {filteredData.length === 0 ? (
        <EmptyState
          title="No listings found"
          description="Try adjusting your filters or search terms."
          action={{ label: 'Clear Filters', onClick: () => { setSearch(''); setFilters({}); } }}
        />
      ) : (
        <>
          <Table
            columns={COLUMNS}
            data={pageData}
            rowKey={(row) => row.id}
            onRowClick={handleRowClick}
            compact
          />
          {totalPages > 1 && (
            <PaginationRow>
              <PageBtn disabled={page === 1} onClick={() => setPage((p) => p - 1)}>← Prev</PageBtn>
              {Array.from({ length: totalPages }, (_, i) => (
                <PageBtn key={i + 1} $active={page === i + 1} onClick={() => setPage(i + 1)}>
                  {i + 1}
                </PageBtn>
              ))}
              <PageBtn disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>Next →</PageBtn>
            </PaginationRow>
          )}
        </>
      )}
    </Page>
  );
}
