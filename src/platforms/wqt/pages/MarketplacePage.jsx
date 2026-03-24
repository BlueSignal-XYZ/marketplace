/**
 * WQT Marketplace — the exchange. Table-first layout.
 * Wired to /v2/market/search with loading, error, empty states.
 */

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams, useLocation, Link } from 'react-router-dom';
import styled from 'styled-components';
import { ArrowUpRight, ArrowDownRight, TrendingUp } from 'lucide-react';
import { SearchBar } from '../../../design-system/primitives/SearchBar';
import { Table } from '../../../design-system/primitives/Table';
import { Badge } from '../../../design-system/primitives/Badge';
import { EmptyState } from '../../../design-system/primitives/EmptyState';
import { Skeleton } from '../../../design-system/primitives/Skeleton';
import { Button } from '../../../design-system/primitives/Button';
import { Pagination } from '../../../design-system/primitives/Pagination';
import { useMarketplaceQuery } from '../../../shared/hooks/useApiQueries';
import { getMarketStats } from '../../../services/v2/client';
import { useAppContext } from '../../../context/AppContext';

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

// ── Market Overview Banner ────────────────────────────────

const MarketBanner = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 14px 20px;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md}px;
  margin-bottom: 20px;
  overflow-x: auto;
  white-space: nowrap;
`;

const MarketStat = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text};
`;

const StatLabel = styled.span`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const StatValue = styled.span`
  font-weight: 600;
`;

const StatChange = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 2px;
  font-size: 12px;
  font-weight: 500;
  color: ${({ $positive, theme }) => $positive ? (theme.colors.positive || '#10B981') : (theme.colors.negative || '#EF4444')};
`;

const StatDivider = styled.span`
  width: 1px;
  height: 24px;
  background: ${({ theme }) => theme.colors.border};
  flex-shrink: 0;
`;

const BannerPlaceholder = styled.div`
  padding: 14px 20px;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md}px;
  margin-bottom: 20px;
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textSecondary};
  text-align: center;
`;

// ── Credit Type Filter Tabs ───────────────────────────────

const CreditTabs = styled.div`
  display: flex;
  gap: 6px;
  flex-shrink: 0;
`;

const CreditTab = styled.button`
  padding: 6px 16px;
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 13px;
  font-weight: 500;
  color: ${({ $active, theme }) => $active ? (theme.colors.textOnPrimary || '#fff') : theme.colors.text};
  background: ${({ $active, theme }) => $active ? theme.colors.primary : theme.colors.surface};
  border: 1px solid ${({ $active, theme }) => $active ? theme.colors.primary : theme.colors.border};
  border-radius: 9999px;
  cursor: pointer;
  transition: all 0.15s ease;
  white-space: nowrap;

  &:hover {
    opacity: 0.85;
  }
`;

// ── Layout containers ─────────────────────────────────────

const TableSection = styled.div`
  width: 100%;
  min-width: 0;
`;

// ── Order Panel ───────────────────────────────────────────

const OrderPanelWrapper = styled.div`
  width: 100%;
`;

const OrderPanelCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md}px;
  padding: 20px;
  margin-top: 24px;
`;

const OrderPanelTitle = styled.h3`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin: 0 0 16px;
`;

const OrderToggle = styled.div`
  display: flex;
  margin-bottom: 16px;
  border-radius: ${({ theme }) => theme.radius.sm}px;
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const OrderToggleBtn = styled.button`
  flex: 1;
  padding: 8px 0;
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 14px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.15s ease;
  color: ${({ $active, $isBuy, theme }) =>
    $active ? '#fff' : theme.colors.text};
  background: ${({ $active, $isBuy, theme }) =>
    $active
      ? $isBuy
        ? (theme.colors.positive || '#10B981')
        : (theme.colors.negative || '#EF4444')
      : theme.colors.background || '#f8f8f8'};

  &:hover {
    opacity: 0.85;
  }
`;

const OrderFieldLabel = styled.label`
  display: block;
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 12px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: 6px;
`;

const OrderFieldGroup = styled.div`
  margin-bottom: 14px;
`;

const OrderInput = styled.input`
  width: 100%;
  padding: 10px 12px;
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text};
  background: ${({ theme }) => theme.colors.background || '#f8f8f8'};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.sm}px;
  box-sizing: border-box;
  outline: none;
  transition: border-color 0.15s ease;

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.textSecondary};
    opacity: 0.6;
  }
`;

const PriceInputWrapper = styled.div`
  position: relative;
`;

const PricePrefix = styled.span`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textSecondary};
  pointer-events: none;
`;

const PriceInput = styled(OrderInput)`
  padding-left: 24px;
`;

const OrderTotal = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  margin-bottom: 16px;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const TotalLabel = styled.span`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const TotalValue = styled.span`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
`;

const PlaceOrderBtn = styled.button`
  width: 100%;
  padding: 12px 0;
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 15px;
  font-weight: 600;
  color: #fff;
  background: ${({ $isBuy, theme }) =>
    $isBuy ? (theme.colors.positive || '#10B981') : (theme.colors.negative || '#EF4444')};
  border: none;
  border-radius: ${({ theme }) => theme.radius.sm}px;
  cursor: pointer;
  transition: opacity 0.15s ease;

  &:hover {
    opacity: 0.85;
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

// ── Your Listings Section ─────────────────────────────────

const YourListingsSection = styled.div`
  margin-top: 32px;
  padding: 20px 24px;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md}px;
`;

const YourListingsTitle = styled.h2`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin: 0 0 12px;
`;

const YourListingsEmpty = styled.p`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 0;

  a {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: none;
    font-weight: 500;

    &:hover {
      text-decoration: underline;
    }
  }
`;

// ── Existing styled components ────────────────────────────

const FilterRow = styled.div`
  margin-bottom: 20px;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;

  & > *:first-child {
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
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderLight};

  @media (min-width: ${({ theme }) => theme.breakpoints.sm}px) {
    grid-template-columns: 120px 80px 90px 1fr 120px;
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}px) {
    grid-template-columns: 120px 80px 90px 80px 1fr 120px 90px 100px;
  }
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
  const label = type === 'nitrogen' ? 'AWG Credit' : type === 'phosphorus' ? 'AWG+ Credit' : 'AWG Credits';
  return (
    <Badge variant={type === 'nitrogen' ? 'info' : 'positive'} size="sm" aria-label={label}>
      {type === 'nitrogen' ? 'AWG' : type === 'phosphorus' ? 'AWG+' : 'AWG'}
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
    label: 'Credit Type',
    options: [
      { value: 'nitrogen', label: 'AWG' },
      { value: 'phosphorus', label: 'AWG+' },
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

// ── Credit type tab config ────────────────────────────────

const CREDIT_TYPES = [
  { value: '', label: 'All' },
  { value: 'nitrogen', label: 'AWG' },
  { value: 'phosphorus', label: 'AWG+' },
];

// ── Loading skeleton ──────────────────────────────────────

function TableSkeleton() {
  return (
    <SkeletonTable>
      {Array.from({ length: 5 }, (_, i) => (
        <SkeletonRow key={i}>
          <Skeleton width="100%" height={16} />
          <Skeleton width="100%" height={16} />
        </SkeletonRow>
      ))}
    </SkeletonTable>
  );
}

// ── Order Panel Component ─────────────────────────────────

function OrderPanel() {
  const [side, setSide] = useState('buy');
  const [creditType, setCreditType] = useState('nitrogen');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');

  const isBuy = side === 'buy';
  const qty = parseFloat(quantity) || 0;
  const prc = parseFloat(price) || 0;
  const total = qty * prc;

  const handlePlaceOrder = () => {
    window.alert('Order placement coming soon');
  };

  return (
    <OrderPanelWrapper>
      <OrderPanelCard>
        <OrderPanelTitle>Place Order</OrderPanelTitle>

        <OrderToggle>
          <OrderToggleBtn
            $active={isBuy}
            $isBuy={true}
            onClick={() => setSide('buy')}
          >
            Buy
          </OrderToggleBtn>
          <OrderToggleBtn
            $active={!isBuy}
            $isBuy={false}
            onClick={() => setSide('sell')}
          >
            Sell
          </OrderToggleBtn>
        </OrderToggle>

        <OrderFieldGroup>
          <OrderFieldLabel>Credit Type</OrderFieldLabel>
          <CreditTabs>
            <CreditTab
              $active={creditType === 'nitrogen'}
              onClick={() => setCreditType('nitrogen')}
            >
              AWG
            </CreditTab>
            <CreditTab
              $active={creditType === 'phosphorus'}
              onClick={() => setCreditType('phosphorus')}
            >
              AWG+
            </CreditTab>
          </CreditTabs>
        </OrderFieldGroup>

        <OrderFieldGroup>
          <OrderFieldLabel htmlFor="order-quantity">Quantity</OrderFieldLabel>
          <OrderInput
            id="order-quantity"
            type="number"
            min="0"
            step="any"
            placeholder="0"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
        </OrderFieldGroup>

        <OrderFieldGroup>
          <OrderFieldLabel htmlFor="order-price">Price</OrderFieldLabel>
          <PriceInputWrapper>
            <PricePrefix>$</PricePrefix>
            <PriceInput
              id="order-price"
              type="number"
              min="0"
              step="any"
              placeholder="0.00"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </PriceInputWrapper>
        </OrderFieldGroup>

        <OrderTotal>
          <TotalLabel>Total</TotalLabel>
          <TotalValue>${total.toFixed(2)}</TotalValue>
        </OrderTotal>

        <PlaceOrderBtn
          $isBuy={isBuy}
          onClick={handlePlaceOrder}
          disabled={qty <= 0 || prc <= 0}
        >
          {isBuy ? 'Place Buy Order' : 'Place Sell Order'}
        </PlaceOrderBtn>
      </OrderPanelCard>
    </OrderPanelWrapper>
  );
}

// ── Component ─────────────────────────────────────────────

export function MarketplacePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  // App context for user auth
  const { STATES } = useAppContext();
  const user = STATES?.user;

  useEffect(() => { document.title = 'Marketplace — WaterQuality.Trading'; }, []);

  // ── Market stats ──────────────────────────────────────
  const [marketStats, setMarketStats] = useState(null);
  const [marketStatsLoading, setMarketStatsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setMarketStatsLoading(true);
    getMarketStats()
      .then((stats) => {
        if (!cancelled) setMarketStats(stats);
      })
      .catch(() => {
        if (!cancelled) setMarketStats(null);
      })
      .finally(() => {
        if (!cancelled) setMarketStatsLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

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

  const handleCreditTabClick = useCallback((value) => {
    setFilters((prev) => ({ ...prev, nutrientType: value }));
    setPage(1);
  }, []);

  const handleRowClick = useCallback((row) => {
    navigate(`/marketplace/listing/${row.id}`);
  }, [navigate]);

  const totalPages = pagination?.totalPages || 1;
  const total = pagination?.total || listings.length;

  // ── Render helpers ────────────────────────────────────

  const renderMarketBanner = () => {
    if (marketStatsLoading) {
      return (
        <MarketBanner>
          <Skeleton width={120} height={16} />
          <StatDivider />
          <Skeleton width={120} height={16} />
          <StatDivider />
          <Skeleton width={140} height={16} />
        </MarketBanner>
      );
    }

    if (!marketStats) {
      return <BannerPlaceholder>Market data available soon</BannerPlaceholder>;
    }

    const nChange = marketStats.nitrogenPriceChange24h ?? 0;
    const pChange = marketStats.phosphorusPriceChange24h ?? 0;
    const nPositive = nChange >= 0;
    const pPositive = pChange >= 0;

    return (
      <MarketBanner>
        <MarketStat>
          <StatLabel>AWG</StatLabel>
          <StatValue>${(marketStats.avgNitrogenPrice ?? 0).toFixed(3)}</StatValue>
          <StatChange $positive={nPositive}>
            {nPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
            {Math.abs(nChange).toFixed(1)}%
          </StatChange>
        </MarketStat>

        <StatDivider />

        <MarketStat>
          <StatLabel>AWG+</StatLabel>
          <StatValue>${(marketStats.avgPhosphorusPrice ?? 0).toFixed(2)}</StatValue>
          <StatChange $positive={pPositive}>
            {pPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
            {Math.abs(pChange).toFixed(1)}%
          </StatChange>
        </MarketStat>

        <StatDivider />

        <MarketStat>
          <TrendingUp size={14} style={{ opacity: 0.5 }} />
          <StatLabel>24h Vol</StatLabel>
          <StatValue>${(marketStats.totalVolume ?? 0).toLocaleString()}</StatValue>
        </MarketStat>
      </MarketBanner>
    );
  };

  return (
    <Page>
      <Header>
        <Title>Marketplace</Title>
        <Subtitle>Browse verified water quality credits. Click any listing for details.</Subtitle>
      </Header>

      {renderMarketBanner()}

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
        <CreditTabs>
          {CREDIT_TYPES.map((ct) => (
            <CreditTab
              key={ct.value}
              $active={filters.nutrientType === ct.value}
              onClick={() => handleCreditTabClick(ct.value)}
            >
              {ct.label}
            </CreditTab>
          ))}
        </CreditTabs>
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

      <TableSection>
        {loading ? (
          <TableSkeleton />
        ) : listings.length === 0 && !error ? (
          search || filters.nutrientType || filters.verificationLevel ? (
            <EmptyState
              icon={<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>}
              title="No listings found"
              description="Try adjusting your filters or search terms."
              action={{ label: 'Clear Filters', onClick: () => { setSearchInput(''); setSearch(''); setFilters({ nutrientType: '', verificationLevel: '' }); setPage(1); } }}
            />
          ) : (
            <EmptyState
              icon={<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>}
              title="No listings yet"
              description="Check back soon — verified water quality credits will appear here as they're listed."
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
      </TableSection>

      <OrderPanel />

      {user?.uid && (
        <YourListingsSection>
          <YourListingsTitle>Your Listings</YourListingsTitle>
          <YourListingsEmpty>
            No active listings — <Link to="/marketplace/create-listing">Create one →</Link>
          </YourListingsEmpty>
        </YourListingsSection>
      )}
    </Page>
  );
}

export default MarketplacePage;
