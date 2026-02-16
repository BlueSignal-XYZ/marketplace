/**
 * WQT Dashboard — personalized market overview for authenticated users.
 * Shows portfolio snapshot, market trends, recent activity, quick actions.
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { DataCard } from '../../../design-system/primitives/DataCard';
import { Badge } from '../../../design-system/primitives/Badge';
import { Button } from '../../../design-system/primitives/Button';
import { Table } from '../../../design-system/primitives/Table';

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

const RECENT_TX = [
  { id: 't1', date: '2025-11-15', type: 'buy', credits: '150 kg N', amount: '$1,263', status: 'completed' },
  { id: 't2', date: '2025-10-20', type: 'buy', credits: '75 kg P', amount: '$862', status: 'completed' },
  { id: 't3', date: '2025-12-01', type: 'retire', credits: '50 kg N', amount: '—', status: 'completed' },
];

const TX_COLS = [
  { key: 'date', header: 'Date', mono: true, width: '110px' },
  { key: 'type', header: 'Type', render: (r) => <Badge variant={r.type === 'buy' ? 'info' : 'warning'} size="sm">{r.type}</Badge> },
  { key: 'credits', header: 'Credits', mono: true },
  { key: 'amount', header: 'Amount', align: 'right', mono: true },
  { key: 'status', header: 'Status', render: () => <Badge variant="positive" size="sm">completed</Badge> },
];

export function WQTDashboardPage() {
  const navigate = useNavigate();

  return (
    <Page>
      <Greeting>Dashboard</Greeting>
      <SubGreeting>Your personalized market overview and portfolio summary.</SubGreeting>

      <StatsGrid>
        <DataCard label="Portfolio Value" value="$2,546" trend={{ value: 12.3, direction: 'up' }} compact />
        <DataCard label="Total Holdings" value="225" unit="kg" compact />
        <DataCard label="Credits Retired" value="50" unit="kg" compact />
        <DataCard label="Market Avg Price" value="$8.42" unit="/kg N" compact />
      </StatsGrid>

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
          <SectionLink onClick={() => navigate('/portfolio')}>View all →</SectionLink>
        </SectionHeader>
        <Table columns={TX_COLS} data={RECENT_TX} rowKey={(r) => r.id} compact />
      </Section>
    </Page>
  );
}
