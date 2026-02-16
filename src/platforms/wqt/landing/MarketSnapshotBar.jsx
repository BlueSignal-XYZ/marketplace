/**
 * MarketSnapshotBar — live ticker-style stats bar.
 * Wired to /v2/market/stats (unauthenticated).
 * Hides entirely on error. Shows shimmer while loading.
 */

import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { getMarketStats } from '../../../services/v2/client';

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

const shimmer = keyframes`
  0% { background-position: -200px 0; }
  100% { background-position: calc(200px + 100%) 0; }
`;

const ShimmerBlock = styled.div`
  width: ${({ $w }) => $w || 80}px;
  height: ${({ $h }) => $h || 20}px;
  border-radius: 4px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e8e8e8 50%, #f0f0f0 75%);
  background-size: 200px 100%;
  animation: ${shimmer} 1.5s ease-in-out infinite;
`;

function ShimmerBar() {
  return (
    <Bar>
      <Inner>
        {[1,2,3,4,5].map((i) => (
          <React.Fragment key={i}>
            {i > 1 && <Divider />}
            <Stat>
              <ShimmerBlock $w={80} $h={12} />
              <ShimmerBlock $w={60} $h={22} />
            </Stat>
          </React.Fragment>
        ))}
      </Inner>
    </Bar>
  );
}

export function MarketSnapshotBar() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const data = await getMarketStats();
        if (!cancelled) setStats(data);
      } catch {
        if (!cancelled) setHidden(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  if (hidden) return null;
  if (loading) return <ShimmerBar />;
  if (!stats) return null;

  const items = [
    { label: 'Total Credits Traded', value: (stats.totalCreditsTraded || 0).toLocaleString(), change: null },
    { label: 'Credits Retired', value: (stats.totalCreditsRetired || 0).toLocaleString(), change: null },
    { label: 'Active Sensors', value: (stats.activeSensors || 0).toLocaleString(), change: null },
    {
      label: 'Avg N Price',
      value: `$${(stats.avgNitrogenPrice || 0).toFixed(2)}`,
      change: stats.nitrogenPriceChange24h ? `${stats.nitrogenPriceChange24h > 0 ? '+' : ''}${stats.nitrogenPriceChange24h.toFixed(1)}%` : null,
      positive: (stats.nitrogenPriceChange24h || 0) >= 0,
    },
    {
      label: 'Avg P Price',
      value: `$${(stats.avgPhosphorusPrice || 0).toFixed(2)}`,
      change: stats.phosphorusPriceChange24h ? `${stats.phosphorusPriceChange24h > 0 ? '+' : ''}${stats.phosphorusPriceChange24h.toFixed(1)}%` : null,
      positive: (stats.phosphorusPriceChange24h || 0) >= 0,
    },
  ];

  return (
    <Bar>
      <Inner>
        {items.map((stat, i) => (
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
