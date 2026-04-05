/**
 * WQT Portfolio — holdings, history, retirements, impact, listings.
 * Wired to /v2/credits/portfolio.
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Tabs } from '../../../design-system/primitives/Tabs';
import { DataCard } from '../../../design-system/primitives/DataCard';
import { Table } from '../../../design-system/primitives/Table';
import { Badge } from '../../../design-system/primitives/Badge';
import { EmptyState } from '../../../design-system/primitives/EmptyState';
import { Button } from '../../../design-system/primitives/Button';
import { Skeleton } from '../../../design-system/primitives/Skeleton';
import { usePortfolioQuery } from '../../../shared/hooks/useApiQueries';
import { useAppContext } from '../../../context/AppContext';

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
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
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

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 32px;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const Section = styled.section`
  margin-top: 24px;
`;

const SectionTitle = styled.h3`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin: 0 0 16px;
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

const SkeletonGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 32px;
  @media (max-width: 640px) {
    grid-template-columns: 1fr 1fr;
  }
  @media (max-width: 380px) {
    grid-template-columns: 1fr;
  }
`;

function PortfolioSkeleton() {
  return (
    <>
      <SkeletonGrid>
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} height={80} />
        ))}
      </SkeletonGrid>
      <Skeleton width={200} height={32} />
      <div style={{ height: 16 }} />
      {[1, 2, 3].map((i) => (
        <Skeleton key={i} height={48} style={{ marginBottom: 8 }} />
      ))}
    </>
  );
}

const HOLDINGS_COLUMNS = [
  {
    key: 'creditId',
    header: 'Credit ID',
    mono: true,
    width: '120px',
    render: (r) => (r.creditId || '').slice(0, 12),
  },
  {
    key: 'nutrientType',
    header: 'Type',
    render: (r) => (
      <Badge variant={r.nutrientType === 'nitrogen' ? 'info' : 'positive'} size="sm">
        {r.nutrientType === 'nitrogen' ? 'N' : 'P'}
      </Badge>
    ),
  },
  {
    key: 'quantity',
    header: 'Qty (kg)',
    align: 'right',
    mono: true,
    render: (r) => (r.quantity || 0).toLocaleString(),
  },
  {
    key: 'currentValue',
    header: 'Value',
    align: 'right',
    mono: true,
    render: (r) => `$${(r.currentValue || 0).toLocaleString()}`,
  },
  { key: 'region', header: 'Region', render: (r) => r.region || '\u2014' },
  {
    key: 'status',
    header: 'Status',
    render: (r) => (
      <Badge variant={r.status === 'retired' ? 'neutral' : 'positive'} size="sm">
        {r.status}
      </Badge>
    ),
  },
];

const TX_COLUMNS = [
  {
    key: 'timestamp',
    header: 'Date',
    mono: true,
    width: '110px',
    render: (r) => (r.timestamp ? new Date(r.timestamp).toLocaleDateString() : '\u2014'),
  },
  {
    key: 'type',
    header: 'Type',
    render: (r) => (
      <Badge
        variant={r.type === 'purchase' ? 'info' : r.type === 'sale' ? 'positive' : 'warning'}
        size="sm"
      >
        {r.type}
      </Badge>
    ),
  },
  {
    key: 'quantity',
    header: 'Credits',
    align: 'right',
    mono: true,
    render: (r) => `${(r.quantity || 0).toLocaleString()} kg`,
  },
  {
    key: 'price',
    header: 'Amount',
    align: 'right',
    mono: true,
    render: (r) => (r.price ? `$${(r.price || 0).toLocaleString()}` : '\u2014'),
  },
  { key: 'counterparty', header: 'Counterparty', render: (r) => r.counterparty || '\u2014' },
];

export function PortfolioPage() {
  useEffect(() => {
    document.title = 'Portfolio — WaterQuality.Trading';
  }, []);
  const navigate = useNavigate();
  const { STATES } = useAppContext();
  const user = STATES?.user;

  const [tab, setTab] = useState('holdings');

  const {
    data: portfolio,
    isLoading: loading,
    error: queryError,
    refetch,
  } = usePortfolioQuery(user?.uid);

  const error = queryError?.message || null;

  const holdings = portfolio?.holdings || [];
  const transactions = portfolio?.transactions || [];
  const summary = portfolio?.summary || {};
  const totalValue = portfolio?.totalValue || 0;
  const totalN = portfolio?.totalNitrogenRemoved || 0;
  const totalP = portfolio?.totalPhosphorusRemoved || 0;
  const activeCredits = holdings.filter((h) => h.status !== 'retired');
  const totalActiveKg = activeCredits.reduce((s, h) => s + (h.quantity || 0), 0);
  const retiredKg = holdings
    .filter((h) => h.status === 'retired')
    .reduce((s, h) => s + (h.quantity || 0), 0);

  const tabs = [
    { id: 'holdings', label: 'Holdings' },
    { id: 'history', label: 'Transaction History' },
    { id: 'impact', label: 'Impact' },
  ];

  return (
    <Page>
      <Header>
        <div>
          <Title>Portfolio</Title>
          <Subtitle>Your credit holdings, transaction history, and environmental impact.</Subtitle>
        </div>
      </Header>

      {error && (
        <ErrorBanner>
          <ErrorText>{error}</ErrorText>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            Retry
          </Button>
        </ErrorBanner>
      )}

      {loading ? (
        <PortfolioSkeleton />
      ) : holdings.length === 0 && transactions.length === 0 && !error ? (
        <EmptyState
          title="No credits yet"
          description="Purchase credits from the marketplace to start building your portfolio and environmental impact."
          action={{ label: 'Browse Marketplace', onClick: () => navigate('/marketplace') }}
        />
      ) : (
        <>
          <StatsGrid>
            <DataCard
              label="Total Holdings"
              value={totalActiveKg.toLocaleString()}
              unit="kg"
              compact
            />
            <DataCard label="Portfolio Value" value={`$${totalValue.toLocaleString()}`} compact />
            <DataCard
              label="Credits Retired"
              value={retiredKg.toLocaleString()}
              unit="kg"
              compact
            />
            <DataCard
              label="Certificates"
              value={(summary.activeCredits || 0).toString()}
              compact
            />
          </StatsGrid>

          <Tabs tabs={tabs} activeTab={tab} onTabChange={setTab} />

          {tab === 'holdings' && (
            <Section>
              {holdings.length > 0 ? (
                <Table
                  columns={HOLDINGS_COLUMNS}
                  data={holdings}
                  rowKey={(r) => r.creditId}
                  onRowClick={(r) => r.listingId && navigate(`/certificate/${r.listingId}`)}
                  compact
                />
              ) : (
                <EmptyState
                  title="No holdings yet"
                  description="Purchase credits from the marketplace to build your portfolio."
                  action={{ label: 'Browse Marketplace', onClick: () => navigate('/marketplace') }}
                />
              )}
            </Section>
          )}

          {tab === 'history' && (
            <Section>
              {transactions.length > 0 ? (
                <Table columns={TX_COLUMNS} data={transactions} rowKey={(r) => r.id} compact />
              ) : (
                <EmptyState
                  title="No transactions yet"
                  description="Your purchase and retirement history will appear here."
                />
              )}
            </Section>
          )}

          {tab === 'impact' && (
            <Section>
              <StatsGrid>
                <DataCard
                  label="Nitrogen Removed"
                  value={totalN.toLocaleString()}
                  unit="kg"
                  compact
                />
                <DataCard
                  label="Phosphorus Removed"
                  value={totalP.toLocaleString()}
                  unit="kg"
                  compact
                />
                <DataCard
                  label="Water Restored (est.)"
                  value={`~${((totalN + totalP) * 10000).toLocaleString()}`}
                  unit="gallons"
                  compact
                />
                <DataCard
                  label="Equivalent Impact"
                  value={Math.max(1, Math.round((totalN + totalP) / 23)).toString()}
                  unit="acres wetland"
                  compact
                />
              </StatsGrid>
              <SectionTitle>Impact Breakdown</SectionTitle>
              {totalN + totalP > 0 ? (
                <Table
                  columns={[
                    { key: 'nutrient', header: 'Nutrient' },
                    { key: 'amount', header: 'Amount Removed', align: 'right', mono: true },
                  ]}
                  data={[
                    ...(totalN > 0
                      ? [{ id: 'n', nutrient: 'Nitrogen', amount: `${totalN.toLocaleString()} kg` }]
                      : []),
                    ...(totalP > 0
                      ? [
                          {
                            id: 'p',
                            nutrient: 'Phosphorus',
                            amount: `${totalP.toLocaleString()} kg`,
                          },
                        ]
                      : []),
                  ]}
                  rowKey={(r) => r.id}
                  compact
                />
              ) : (
                <EmptyState
                  compact
                  title="No impact data yet"
                  description="Impact data will appear once you hold credits."
                />
              )}
            </Section>
          )}
        </>
      )}
    </Page>
  );
}

export default PortfolioPage;
