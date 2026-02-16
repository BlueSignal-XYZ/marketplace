/**
 * WQT Portfolio — holdings, history, retirements, impact, listings.
 * Data-dense, tabbed layout.
 */

import React, { useState } from 'react';
import styled from 'styled-components';
import { Tabs } from '../../../design-system/primitives/Tabs';
import { DataCard } from '../../../design-system/primitives/DataCard';
import { Table } from '../../../design-system/primitives/Table';
import { Badge } from '../../../design-system/primitives/Badge';
import { EmptyState } from '../../../design-system/primitives/EmptyState';
import { Button } from '../../../design-system/primitives/Button';

const Page = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 32px 24px;
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

// ── Placeholder data ──────────────────────────────────────

const HOLDINGS = [
  { id: 'h1', type: 'nitrogen', quantity: 150, value: 1263, certId: '#1042', region: 'James River', purchaseDate: '2025-11-15', status: 'active' },
  { id: 'h2', type: 'phosphorus', quantity: 75, value: 862.50, certId: '#1038', region: 'Potomac', purchaseDate: '2025-10-20', status: 'active' },
  { id: 'h3', type: 'nitrogen', quantity: 50, value: 421, certId: '#1035', region: 'York River', purchaseDate: '2025-09-05', status: 'retired' },
];

const TRANSACTIONS = [
  { id: 't1', date: '2025-11-15', type: 'buy', credits: 150, amount: 1263, counterparty: 'BlueSignal IoT', status: 'completed' },
  { id: 't2', date: '2025-10-20', type: 'buy', credits: 75, amount: 862.50, counterparty: 'EcoRestore LLC', status: 'completed' },
  { id: 't3', date: '2025-09-05', type: 'buy', credits: 50, amount: 421, counterparty: 'GreenField Farms', status: 'completed' },
  { id: 't4', date: '2025-12-01', type: 'retire', credits: 50, amount: 0, counterparty: '—', status: 'completed' },
];

const HOLDINGS_COLUMNS = [
  { key: 'certId', header: 'Certificate', mono: true, width: '100px' },
  { key: 'type', header: 'Type', render: (r) => <Badge variant={r.type === 'nitrogen' ? 'info' : 'positive'} size="sm">{r.type === 'nitrogen' ? 'N' : 'P'}</Badge> },
  { key: 'quantity', header: 'Qty (kg)', align: 'right', mono: true },
  { key: 'value', header: 'Value', align: 'right', mono: true, render: (r) => `$${r.value.toLocaleString()}` },
  { key: 'region', header: 'Region' },
  { key: 'status', header: 'Status', render: (r) => <Badge variant={r.status === 'active' ? 'positive' : 'neutral'} size="sm">{r.status}</Badge> },
];

const TX_COLUMNS = [
  { key: 'date', header: 'Date', mono: true, width: '110px' },
  { key: 'type', header: 'Type', render: (r) => <Badge variant={r.type === 'buy' ? 'info' : r.type === 'sell' ? 'positive' : 'warning'} size="sm">{r.type}</Badge> },
  { key: 'credits', header: 'Credits', align: 'right', mono: true, render: (r) => `${r.credits} kg` },
  { key: 'amount', header: 'Amount', align: 'right', mono: true, render: (r) => r.amount ? `$${r.amount.toLocaleString()}` : '—' },
  { key: 'counterparty', header: 'Counterparty' },
  { key: 'status', header: 'Status', render: (r) => <Badge variant="positive" size="sm">{r.status}</Badge> },
];

export function PortfolioPage() {
  const [tab, setTab] = useState('holdings');

  const totalValue = HOLDINGS.filter(h => h.status === 'active').reduce((s, h) => s + h.value, 0);
  const totalCredits = HOLDINGS.filter(h => h.status === 'active').reduce((s, h) => s + h.quantity, 0);
  const retired = HOLDINGS.filter(h => h.status === 'retired').reduce((s, h) => s + h.quantity, 0);

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
        <Button onClick={() => {}}>Download Report</Button>
      </Header>

      <StatsGrid>
        <DataCard label="Total Holdings" value={totalCredits.toLocaleString()} unit="kg" compact />
        <DataCard label="Portfolio Value" value={`$${totalValue.toLocaleString()}`} compact />
        <DataCard label="Credits Retired" value={retired.toLocaleString()} unit="kg" compact />
        <DataCard label="Certificates" value={HOLDINGS.length.toString()} compact />
      </StatsGrid>

      <Tabs tabs={tabs} activeTab={tab} onTabChange={setTab} />

      {tab === 'holdings' && (
        <Section>
          {HOLDINGS.length > 0 ? (
            <Table columns={HOLDINGS_COLUMNS} data={HOLDINGS} rowKey={(r) => r.id} compact />
          ) : (
            <EmptyState
              title="No holdings yet"
              description="Purchase credits from the marketplace to build your portfolio."
              action={{ label: 'Browse Marketplace', onClick: () => {} }}
            />
          )}
        </Section>
      )}

      {tab === 'history' && (
        <Section>
          <Table columns={TX_COLUMNS} data={TRANSACTIONS} rowKey={(r) => r.id} compact />
        </Section>
      )}

      {tab === 'impact' && (
        <Section>
          <StatsGrid>
            <DataCard label="Nitrogen Removed" value="200" unit="kg" compact />
            <DataCard label="Phosphorus Removed" value="75" unit="kg" compact />
            <DataCard label="Water Restored" value="~2.5M" unit="gallons" compact />
            <DataCard label="Equivalent Impact" value="12" unit="acres wetland" compact />
          </StatsGrid>
          <SectionTitle>Impact Breakdown</SectionTitle>
          <div style={{ padding: 32, textAlign: 'center', color: '#888', fontSize: 14, background: '#f9fafb', borderRadius: 8 }}>
            📊 Impact visualization chart — wires to Chart.js primitives
          </div>
        </Section>
      )}
    </Page>
  );
}
