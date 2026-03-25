/**
 * WQT Dashboard — personalized market overview for authenticated users.
 * Wired to /v2/market/stats, /v2/credits/portfolio.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { ShoppingCart, Cpu, Search, TrendingUp, ArrowRight } from 'lucide-react';
import { DataCard } from '../../../design-system/primitives/DataCard';
import { Badge } from '../../../design-system/primitives/Badge';
import { Button } from '../../../design-system/primitives/Button';
import { Table } from '../../../design-system/primitives/Table';
import { Skeleton } from '../../../design-system/primitives/Skeleton';
import { EmptyState } from '../../../design-system/primitives/EmptyState';
import { getMarketStats, getPortfolio, ApiError } from '../../../services/v2/client';
import { useAppContext } from '../../../context/AppContext';

/* ── Layout ─────────────────────────────────────────────── */

const Page = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 32px 24px;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}px) {
    padding: 24px 16px;
  }
`;

const Greeting = styled.h1`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 28px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin: 0 0 4px;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}px) {
    font-size: 24px;
  }
`;

const SubGreeting = styled.p`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 0 0 32px;
`;

const Section = styled.section`
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
  display: inline-flex;
  align-items: center;
  gap: 4px;
  &:hover { text-decoration: underline; }
`;

/* ── Stats Grid ─────────────────────────────────────────── */

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 32px;

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
`;

const SkeletonStats = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 32px;

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
`;

/* ── Portfolio Value Header ─────────────────────────────── */

const PortfolioHeader = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg}px;
  padding: 24px;
  margin-bottom: 32px;
`;

const PortfolioValue = styled.div`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 36px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  letter-spacing: -0.02em;
  line-height: 1.2;
  margin-bottom: 4px;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}px) {
    font-size: 28px;
  }
`;

const PortfolioLabel = styled.div`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 13px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.02em;
  margin-bottom: 16px;
`;

const BreakdownGrid = styled.div`
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
`;

const BreakdownItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const BreakdownLabel = styled.span`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const BreakdownValue = styled.span`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 15px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`;

/* ── Getting Started Cards (Empty State) ────────────────── */

const GettingStartedWrap = styled.div`
  margin-bottom: 32px;
`;

const GettingStartedTitle = styled.h2`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 22px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin: 0 0 4px;
`;

const GettingStartedSub = styled.p`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 0 0 24px;
`;

const GettingStartedGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}px) {
    grid-template-columns: 1fr;
  }
`;

const StartCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg}px;
  padding: 24px;
  cursor: pointer;
  transition: border-color 0.15s, box-shadow 0.15s;
  display: flex;
  flex-direction: column;
  gap: 12px;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 2px 12px rgba(0, 82, 204, 0.08);
  }
`;

const StartCardIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: ${({ theme }) => theme.radius.md}px;
  background: ${({ theme }) => theme.colors.primaryLight || 'rgba(0, 82, 204, 0.08)'};
  color: ${({ theme }) => theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StartCardTitle = styled.div`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`;

const StartCardDesc = styled.div`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.5;
`;

const StartCardArrow = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 13px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.primary};
  margin-top: auto;
`;

/* ── Market Summary Placeholder ─────────────────────────── */

const ChartPlaceholder = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md}px;
  padding: 48px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  min-height: 200px;
`;

const ChartPlaceholderIcon = styled.div`
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: 12px;
  opacity: 0.4;
`;

const ChartPlaceholderText = styled.div`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

/* ── Quick Actions ──────────────────────────────────────── */

const QuickActions = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`;

const ActionButton = styled.button`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 14px;
  font-weight: 500;
  padding: 10px 20px;
  border-radius: ${({ theme }) => theme.radius.md}px;
  cursor: pointer;
  transition: opacity 0.15s, border-color 0.15s;
  display: inline-flex;
  align-items: center;
  gap: 6px;

  &:hover { opacity: 0.85; }

  ${({ $primary, theme }) =>
    $primary
      ? `
    background: ${theme.colors.primary};
    color: ${theme.colors.textOnPrimary || '#fff'};
    border: 1px solid ${theme.colors.primary};
  `
      : `
    background: ${theme.colors.surface};
    color: ${theme.colors.text};
    border: 1px solid ${theme.colors.border};
    &:hover { border-color: ${theme.colors.primary}; }
  `}
`;

/* ── Transaction Columns ────────────────────────────────── */

const TX_COLS = [
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
      <Badge variant={r.type === 'purchase' ? 'info' : 'warning'} size="sm">
        {r.type}
      </Badge>
    ),
  },
  {
    key: 'quantity',
    header: 'Credits',
    mono: true,
    render: (r) =>
      `${(r.quantity || 0).toLocaleString()} kg ${r.nutrientType === 'nitrogen' ? 'N' : 'P'}`,
  },
  {
    key: 'price',
    header: 'Amount',
    align: 'right',
    mono: true,
    render: (r) => (r.price ? `$${(r.price || 0).toLocaleString()}` : '\u2014'),
  },
];

/* ── Component ──────────────────────────────────────────── */

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
    return () => {
      cancelled = true;
    };
  }, [user?.uid]);

  const holdings = portfolio?.holdings || [];
  const transactions = portfolio?.transactions || [];
  const totalValue = portfolio?.totalValue || 0;
  const hasActivity = holdings.length > 0 || transactions.length > 0;
  const recentTx = transactions.slice(0, 5);

  // Break down holdings by type
  const qcCredits = holdings
    .filter((h) => h.nutrientType === 'quality' || h.nutrientType === 'phosphorus')
    .reduce((s, h) => s + (h.quantity || 0), 0);
  const kcCredits = holdings
    .filter((h) => h.nutrientType === 'nitrogen')
    .reduce((s, h) => s + (h.quantity || 0), 0);
  const pendingCredits = holdings
    .filter((h) => h.status === 'pending')
    .reduce((s, h) => s + (h.quantity || 0), 0);

  const displayName = user?.displayName || user?.username || 'there';

  /* ── Loading State ──────────────────────────────────────── */

  if (loading) {
    return (
      <Page>
        <Skeleton height={32} width={280} style={{ marginBottom: 8 }} />
        <Skeleton height={16} width={360} style={{ marginBottom: 32 }} />
        <SkeletonStats>
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} height={80} />
          ))}
        </SkeletonStats>
        <Skeleton height={200} style={{ marginBottom: 32 }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} height={48} />
          ))}
        </div>
      </Page>
    );
  }

  /* ── Empty State (no activity) ──────────────────────────── */

  if (!hasActivity) {
    return (
      <Page>
        <GettingStartedWrap>
          <Greeting>Welcome to WaterQuality.Trading</Greeting>
          <GettingStartedSub>
            Your account is set up. Here's how to get started:
          </GettingStartedSub>

          <GettingStartedGrid>
            <StartCard onClick={() => navigate('/marketplace')}>
              <StartCardIcon>
                <ShoppingCart size={20} />
              </StartCardIcon>
              <StartCardTitle>Buy Credits</StartCardTitle>
              <StartCardDesc>
                Browse the marketplace and buy verified credits
              </StartCardDesc>
              <StartCardArrow>
                Get started <ArrowRight size={14} />
              </StartCardArrow>
            </StartCard>

            <StartCard
              onClick={() => window.open('https://cloud.bluesignal.xyz', '_blank')}
            >
              <StartCardIcon>
                <Cpu size={20} />
              </StartCardIcon>
              <StartCardTitle>Generate Credits</StartCardTitle>
              <StartCardDesc>
                Link a BlueSignal device to start generating verified AWG credits
              </StartCardDesc>
              <StartCardArrow>
                Get started <ArrowRight size={14} />
              </StartCardArrow>
            </StartCard>

            <StartCard onClick={() => navigate('/registry')}>
              <StartCardIcon>
                <Search size={20} />
              </StartCardIcon>
              <StartCardTitle>Explore Market</StartCardTitle>
              <StartCardDesc>
                View the registry and live credit map
              </StartCardDesc>
              <StartCardArrow>
                Get started <ArrowRight size={14} />
              </StartCardArrow>
            </StartCard>
          </GettingStartedGrid>
        </GettingStartedWrap>

        {/* Market stats even in empty state */}
        {stats && (
          <Section>
            <SectionHeader>
              <SectionTitle>Market Overview</SectionTitle>
            </SectionHeader>
            <StatsGrid>
              <DataCard
                label="Active Listings"
                value={stats.activeListings?.toLocaleString() || '\u2014'}
                compact
              />
              <DataCard
                label="Total Credits Traded"
                value={stats.totalCreditsTraded?.toLocaleString() || '\u2014'}
                compact
              />
              <DataCard
                label="Active Sensors"
                value={stats.activeSensors?.toLocaleString() || '\u2014'}
                compact
              />
              <DataCard
                label="Avg N Price"
                value={
                  stats.avgNitrogenPrice != null
                    ? `$${stats.avgNitrogenPrice.toFixed(2)}`
                    : '\u2014'
                }
                unit="/kg"
                compact
              />
            </StatsGrid>
          </Section>
        )}
      </Page>
    );
  }

  /* ── Active State (has holdings/transactions) ───────────── */

  return (
    <Page>
      <Greeting>Welcome back, {displayName}</Greeting>
      <SubGreeting>Your personalized market overview and portfolio summary.</SubGreeting>

      {/* Portfolio Value Header */}
      <PortfolioHeader>
        <PortfolioLabel>Portfolio Value</PortfolioLabel>
        <PortfolioValue>${totalValue.toLocaleString()}</PortfolioValue>
        <BreakdownGrid>
          <BreakdownItem>
            <BreakdownLabel>AWG Balance</BreakdownLabel>
            <BreakdownValue>{qcCredits.toLocaleString()} credits</BreakdownValue>
          </BreakdownItem>
          {pendingCredits > 0 && (
            <BreakdownItem>
              <BreakdownLabel>Pending</BreakdownLabel>
              <BreakdownValue>
                {pendingCredits.toLocaleString()} credits{' '}
                <Badge variant="warning" size="sm">
                  awaiting verification
                </Badge>
              </BreakdownValue>
            </BreakdownItem>
          )}
        </BreakdownGrid>
      </PortfolioHeader>

      {/* Market Summary */}
      <Section>
        <SectionHeader>
          <SectionTitle>Market Summary</SectionTitle>
        </SectionHeader>
        <StatsGrid>
          <DataCard
            label="Avg N Price"
            value={
              stats?.avgNitrogenPrice != null
                ? `$${stats.avgNitrogenPrice.toFixed(2)}`
                : '\u2014'
            }
            unit="/kg"
            compact
          />
          <DataCard
            label="Active Listings"
            value={stats?.activeListings?.toLocaleString() || '\u2014'}
            compact
          />
          <DataCard
            label="Total Traded"
            value={stats?.totalCreditsTraded?.toLocaleString() || '\u2014'}
            compact
          />
          <DataCard
            label="Active Sensors"
            value={stats?.activeSensors?.toLocaleString() || '\u2014'}
            compact
          />
        </StatsGrid>
        <ChartPlaceholder>
          <ChartPlaceholderIcon>
            <TrendingUp size={32} />
          </ChartPlaceholderIcon>
          <ChartPlaceholderText>
            Market data visualization available soon
          </ChartPlaceholderText>
        </ChartPlaceholder>
      </Section>

      {/* Recent Activity */}
      <Section>
        <SectionHeader>
          <SectionTitle>Recent Activity</SectionTitle>
          {recentTx.length > 0 && (
            <SectionLink onClick={() => navigate('/portfolio')}>
              View all <ArrowRight size={14} />
            </SectionLink>
          )}
        </SectionHeader>
        {recentTx.length > 0 ? (
          <Table columns={TX_COLS} data={recentTx} rowKey={(r) => r.id} compact />
        ) : (
          <EmptyState
            title="No transactions yet"
            description="Start by browsing the marketplace and purchasing your first credits."
            action={{
              label: 'Browse Marketplace',
              onClick: () => navigate('/marketplace'),
            }}
            compact
          />
        )}
      </Section>

      {/* Quick Actions */}
      <Section>
        <SectionHeader>
          <SectionTitle>Quick Actions</SectionTitle>
        </SectionHeader>
        <QuickActions>
          <ActionButton $primary onClick={() => navigate('/marketplace')}>
            <ShoppingCart size={16} /> Buy Credits
          </ActionButton>
          <ActionButton onClick={() => navigate('/marketplace/seller-dashboard')}>
            Sell Credits
          </ActionButton>
          <ActionButton onClick={() => navigate('/portfolio')}>
            View Portfolio
          </ActionButton>
        </QuickActions>
      </Section>
    </Page>
  );
}

export default WQTDashboardPage;
