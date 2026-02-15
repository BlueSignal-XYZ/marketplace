/**
 * MarketSnapshotBar — live ticker-style stats bar.
 * Signals "financial platform" immediately.
 */

import React from 'react';
import styled from 'styled-components';

const Bar = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  padding: 16px 24px;
  overflow-x: auto;
`;

const Inner = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  gap: 32px;
  min-width: fit-content;
`;

const Stat = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  min-width: 120px;
`;

const StatLabel = styled.span`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const StatValue = styled.span`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  letter-spacing: -0.02em;
`;

const StatChange = styled.span`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 12px;
  font-weight: 600;
  color: ${({ $positive }) => ($positive ? '#10B981' : '#EF4444')};
`;

const Divider = styled.div`
  width: 1px;
  background: ${({ theme }) => theme.colors.border};
  align-self: stretch;
`;

// Placeholder data — will be replaced by /v2/market/stats and /v2/market/ticker
const SNAPSHOT_DATA = [
  { label: 'Total Credits Traded', value: '142,847', change: null },
  { label: 'Credits Retired', value: '38,291', change: null },
  { label: 'Active Sensors', value: '1,204', change: null },
  { label: 'Avg N Price', value: '$8.42', change: '+2.1%', positive: true },
  { label: 'Avg P Price', value: '$12.67', change: '-0.8%', positive: false },
];

export function MarketSnapshotBar() {
  return (
    <Bar>
      <Inner>
        {SNAPSHOT_DATA.map((stat, i) => (
          <React.Fragment key={stat.label}>
            {i > 0 && <Divider />}
            <Stat>
              <StatLabel>{stat.label}</StatLabel>
              <StatValue>{stat.value}</StatValue>
              {stat.change && (
                <StatChange $positive={stat.positive}>{stat.change}</StatChange>
              )}
            </Stat>
          </React.Fragment>
        ))}
      </Inner>
    </Bar>
  );
}
