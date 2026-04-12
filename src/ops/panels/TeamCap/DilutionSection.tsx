import { useMemo } from 'react';
import styled, { useTheme } from 'styled-components';
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip,
  type TooltipItem,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { Table, Th, Td, Tr } from '../../components/DataTable';
import type { FundingRound, TeamMember } from '../../types';
import {
  buildOwnershipSeries,
  computeProForma,
  formatMoney,
  formatNumber,
  formatPct,
} from './dilution';

// Register chart.js primitives once. Safe to call multiple times.
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const Wrapper = styled.div`
  margin-top: 1rem;
`;

const Toolbar = styled.div`
  display: flex;
  gap: 0.3rem;
  margin-bottom: 0.75rem;
`;

const TogglePill = styled.button<{ $active: boolean }>`
  background: ${({ $active, theme }) => ($active ? theme.colors.accent : theme.colors.surface2)};
  color: ${({ $active, theme }) => ($active ? '#fff' : theme.colors.text2)};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 999px;
  padding: 0.3rem 0.8rem;
  font-size: 0.7rem;
  font-weight: 600;
  cursor: pointer;
  &:hover {
    opacity: 0.9;
  }
`;

const ChartBox = styled.div`
  position: relative;
  height: 260px;
  margin-bottom: 1rem;
`;

const EstimatedPill = styled.span`
  background: ${({ theme }) => theme.colors.yellowDim};
  color: ${({ theme }) => theme.colors.yellow};
  padding: 0.1rem 0.4rem;
  border-radius: 3px;
  font-size: 0.65rem;
  font-weight: 600;
  text-transform: uppercase;
  margin-left: 0.3rem;
`;

const EmptyNote = styled.p`
  color: ${({ theme }) => theme.colors.text3};
  font-size: 0.75rem;
  font-style: italic;
  padding: 0.5rem 0;
`;

export interface DilutionSectionProps {
  members: TeamMember[];
  rounds: FundingRound[];
  mode: 'current' | 'proforma';
  onChangeMode: (mode: 'current' | 'proforma') => void;
}

export default function DilutionSection({
  members,
  rounds,
  mode,
  onChangeMode,
}: DilutionSectionProps) {
  const theme = useTheme();
  const proforma = useMemo(
    () => computeProForma({ members, rounds, mode }),
    [members, rounds, mode]
  );

  const palette = {
    founder: theme.colors.accent,
    cofounder: theme.colors.purple,
    pool: theme.colors.green,
    investor: theme.colors.yellow,
  };

  const series = useMemo(() => buildOwnershipSeries(proforma, palette), [proforma, palette]);

  const chartData = {
    labels: series.labels,
    datasets: series.datasets.map((d) => ({
      label: d.label,
      data: d.data,
      backgroundColor: d.color,
      borderWidth: 0,
    })),
  };

  const chartOptions = {
    indexAxis: 'y' as const,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom' as const,
        labels: {
          color: theme.colors.text2,
          font: { size: 11 },
          boxWidth: 10,
          boxHeight: 10,
        },
      },
      tooltip: {
        backgroundColor: theme.colors.surface,
        titleColor: theme.colors.text,
        bodyColor: theme.colors.text2,
        borderColor: theme.colors.border,
        borderWidth: 1,
        callbacks: {
          label: (item: TooltipItem<'bar'>) => {
            const v = typeof item.raw === 'number' ? item.raw : 0;
            return `${item.dataset.label}: ${v.toFixed(1)}%`;
          },
        },
      },
    },
    scales: {
      x: {
        stacked: true,
        max: 100,
        ticks: {
          color: theme.colors.text3,
          callback: (v: number | string) => `${v}%`,
        },
        grid: { color: theme.colors.border },
      },
      y: {
        stacked: true,
        ticks: { color: theme.colors.text2, font: { size: 10 } },
        grid: { display: false },
      },
    },
  };

  return (
    <Wrapper>
      <Toolbar>
        <TogglePill $active={mode === 'current'} onClick={() => onChangeMode('current')}>
          Current
        </TogglePill>
        <TogglePill $active={mode === 'proforma'} onClick={() => onChangeMode('proforma')}>
          Pro-Forma
        </TogglePill>
      </Toolbar>

      {proforma.rows.length === 0 ? (
        <EmptyNote>No rounds to chart yet — add rounds above.</EmptyNote>
      ) : (
        <>
          <ChartBox>
            <Bar data={chartData} options={chartOptions} />
          </ChartBox>
          <Table>
            <thead>
              <tr>
                <Th>Round</Th>
                <Th>Pre-Money</Th>
                <Th>Post-Money</Th>
                <Th>New Shares</Th>
                <Th>Total Shares</Th>
                <Th>Founder %</Th>
                <Th>Co-founders %</Th>
                <Th>Pool %</Th>
                <Th>Investors %</Th>
              </tr>
            </thead>
            <tbody>
              {proforma.rows.map((row, i) => (
                <Tr key={i}>
                  <Td style={{ color: theme.colors.text, fontWeight: 600 }}>
                    {row.roundName}
                    {row.estimated && <EstimatedPill>estimated</EstimatedPill>}
                  </Td>
                  <Td>{formatMoney(row.preMoney)}</Td>
                  <Td>{formatMoney(row.postMoney)}</Td>
                  <Td>{formatNumber(row.newShares)}</Td>
                  <Td>{formatNumber(row.totalShares)}</Td>
                  <Td>{formatPct(row.founderPct)}</Td>
                  <Td>{formatPct(row.cofounderPct)}</Td>
                  <Td>{formatPct(row.poolPct)}</Td>
                  <Td>{formatPct(row.investorPct)}</Td>
                </Tr>
              ))}
            </tbody>
          </Table>
        </>
      )}
    </Wrapper>
  );
}
