/**
 * WQT Dashboard — personalized market overview for authenticated users.
 * Wired to /v2/market/stats, /v2/credits/portfolio.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { DataCard } from '../../../design-system/primitives/DataCard';
import { Badge } from '../../../design-system/primitives/Badge';
import { Button } from '../../../design-system/primitives/Button';
import { Table } from '../../../design-system/primitives/Table';
import { Skeleton } from '../../../design-system/primitives/Skeleton';
import { EmptyState } from '../../../design-system/primitives/EmptyState';
import { getMarketStats, getPortfolio, ApiError } from '../../../services/v2/client';
import { useAppContext } from '../../../context/AppContext';

const Page = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 32px 24px;
`;

const Greeting = styled.h1`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 28px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin: 0 0 4px;
`;

const SubGreeting = styled.p`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 0 0 24px;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 32px;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const SectionTitle = styled.h3`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin: 0;
`;

const SectionLink = styled.button`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 13px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.primary};
  background: none;
  border: none;
  cursor: pointer;
  &:hover { text-decoration: underline; }
`;

const Section = styled.section`
  margin-bottom: 32px;
`;

const QuickActions = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 16px;
`;

const ActionCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md}px;
  padding: 20px;
  cursor: pointer;
  transition: border-color 0.15s, box-shadow 0.15s;
  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 2px 8px rgba(0, 82, 204, 0.08);
  }
`;

const ActionTitle = styled.div`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 15px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 4px;
`;

const ActionDesc = styled.div`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const SkeletonStats = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 32px;
  @media (max-width: 640px) { grid-template-columns: 1fr 1fr; }
`;

const TX_COLS = [
  { key: 'timestamp', header: 'Date', mono: true, width: '110px', render: (r) => r.timestamp ? new Date(r.timestamp).toLocaleDateString() : '\u2014' },
  { key: 'type', header: 'Type', render: (r) => <Badge variant={r.type === 'purchase' ? 'info' : 'warning'} size="sm">{r.type}</Badge> },
  { key: 'quantity', header: 'Credits', mono: true, render: (r) => `${(r.quantity || 0).toLocaleString()} kg ${r.nutrientType === 'nitrogen' ? 'N' : 'P'}` },
  { key: 'price', header: 'Amount', align: 'right', mono: true, render: (r) => r.price ? `$${(r.price || 0).toLocaleString()}` : '\u2014' },
];

export function WQTDashboardPage() {
  const navigate = useNavigate();
  const { STATES } = useAppContext();
  const user = STATES?.user;

  const [stats, setStats] = useState(null);
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const [statsData, portfolioData] = await Promise.allSettled([
          getMarketStats(),
          user?.uid ? getPortfolio(user.uid) : Promise.resolve(null),
        ]);
        if (!cancelled) {
          setStats(statsData.status === 'fulfilled' ? statsData.value : null);
          setPortfolio(portfolioData.status === 'fulfilled' ? portfolioData.value : null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [user?.uid]);

  const holdings = portfolio?.holdings || [];
  const transactions = portfolio?.transactions || [];
  const totalValue = portfolio?.totalValue || 0;
  const totalKg = holdings.reduce((s, h) => s + (h.quantity || 0), 0);
  const retiredKg = holdings.filter(h => h.status === 'retired').reduce((s, h) => s + (h.quantity || 0), 0);
  const hasActivity = holdings.length > 0 || transactions.length > 0;
  const recentTx = transactions.slice(0, 5);

  const displayName = user?.displayName || user?.username || 'there';

  return (
    <Page>
      <Greeting>Welcome back, {displayName}</Greeting>
      <SubGreeting>Your personalized market overview and portfolio summary.</SubGreeting>

      {loading ? (
        <SkeletonStats>
          {[1,2,3,4].map(i => <Skeleton key={i} height={80} />)}
        </SkeletonStats>
      ) : hasActivity ? (
        <StatsGrid>
          <DataCard
            label="Portfolio Value"
            value={`$${totalValue.toLocaleString()}`}
            compact
          />
          <DataCard label="Total Holdings" value={totalKg.toLocaleString()} unit="kg" compact />
          <DataCard label="Credits Retired" value={retiredKg.toLocaleString()} unit="kg" compact />
          <DataCard
            label="Market Avg N Price"
            value={stats ? `$${stats.avgNitrogenPrice?.toFixed(2) || '\u2014'}` : '\u2014'}
            unit="/kg"
            compact
          />
        </StatsGrid>
      ) : (
        <StatsGrid>
          <DataCard label="Active Listings" value={stats?.activeListings?.toLocaleString() || '\u2014'} compact />
          <DataCard label="Total Credits Traded" value={stats?.totalCreditsTraded?.toLocaleString() || '\u2014'} compact />
          <DataCard label="Active Sensors" value={stats?.activeSensors?.toLocaleString() || '\u2014'} compact />
          <DataCard label="Avg N Price" value={stats ? `$${stats.avgNitrogenPrice?.toFixed(2) || '\u2014'}` : '\u2014'} unit="/kg" compact />
        </StatsGrid>
      )}

      <Section>
        <SectionHeader>
          <SectionTitle>Quick Actions</SectionTitle>
        </SectionHeader>
        <QuickActions>
          <ActionCard onClick={() => navigate('/marketplace')}>
            <ActionTitle>Browse Marketplace</ActionTitle>
            <ActionDesc>Find verified nutrient credits to purchase</ActionDesc>
          </ActionCard>
          <ActionCard onClick={() => navigate('/portfolio')}>
            <ActionTitle>View Portfolio</ActionTitle>
            <ActionDesc>Check your holdings, history, and impact</ActionDesc>
          </ActionCard>
          <ActionCard onClick={() => navigate('/data')}>
            <ActionTitle>Environmental Data</ActionTitle>
            <ActionDesc>Explore live sensor feeds and water quality</ActionDesc>
          </ActionCard>
          <ActionCard onClick={() => navigate('/seller/onboarding')}>
            <ActionTitle>Become a Seller</ActionTitle>
            <ActionDesc>List your credits on the marketplace</ActionDesc>
          </ActionCard>
        </QuickActions>
      </Section>

      <Section>
        <SectionHeader>
          <SectionTitle>Recent Transactions</SectionTitle>
          {hasActivity && <SectionLink onClick={() => navigate('/portfolio')}>View all {'\u2192'}</SectionLink>}
        </SectionHeader>
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[1,2,3].map(i => <Skeleton key={i} height={48} />)}
          </div>
        ) : recentTx.length > 0 ? (
          <Table columns={TX_COLS} data={recentTx} rowKey={(r) => r.id} compact />
        ) : (
          <EmptyState
            title="No transactions yet"
            description="Start by browsing the marketplace and purchasing your first credits."
            action={{ label: 'Browse Marketplace', onClick: () => navigate('/marketplace') }}
          />
        )}
      </Section>
    </Page>
  );
}

export default WQTDashboardPage;
