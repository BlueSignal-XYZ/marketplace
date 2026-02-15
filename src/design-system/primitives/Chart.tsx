/**
 * Chart — time-series wrapper for Chart.js.
 * Thin themed wrapper around react-chartjs-2 Line chart.
 * Keeps chart config centralized and theme-aware.
 */

import React, { useMemo } from 'react';
import styled from 'styled-components';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
  type ChartOptions,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler);

// ── Types ─────────────────────────────────────────────────

export interface ChartDataset {
  label: string;
  data: number[];
  color?: string;
  /** Show area fill under line */
  fill?: boolean;
}

export interface TimeSeriesChartProps {
  labels: string[];
  datasets: ChartDataset[];
  /** Chart height in px */
  height?: number;
  /** Show legend */
  showLegend?: boolean;
  /** Show grid lines */
  showGrid?: boolean;
  /** Y-axis unit label */
  yUnit?: string;
  className?: string;
}

// ── Styled ────────────────────────────────────────────────

const ChartWrapper = styled.div<{ $height: number }>`
  width: 100%;
  height: ${({ $height }) => $height}px;
  position: relative;
`;

// ── Component ─────────────────────────────────────────────

export const TimeSeriesChart: React.FC<TimeSeriesChartProps> = ({
  labels,
  datasets,
  height = 300,
  showLegend = false,
  showGrid = true,
  yUnit,
  className,
}) => {
  const chartData = useMemo(
    () => ({
      labels,
      datasets: datasets.map((ds) => ({
        label: ds.label,
        data: ds.data,
        borderColor: ds.color || '#0052CC',
        backgroundColor: ds.fill
          ? `${ds.color || '#0052CC'}18`
          : 'transparent',
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 4,
        tension: 0.35,
        fill: ds.fill ?? false,
      })),
    }),
    [labels, datasets],
  );

  const options: ChartOptions<'line'> = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { display: showLegend, position: 'top' as const },
        tooltip: {
          backgroundColor: '#1A1A1A',
          titleFont: { size: 12 },
          bodyFont: { family: "'JetBrains Mono', monospace", size: 12 },
          padding: 10,
          cornerRadius: 8,
          callbacks: yUnit ? { label: (ctx) => `${ctx.dataset.label}: ${ctx.formattedValue} ${yUnit}` } : undefined,
        },
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { font: { size: 11 }, color: '#9CA3AF', maxRotation: 0 },
        },
        y: {
          grid: { display: showGrid, color: '#F0F1F3' },
          ticks: {
            font: { size: 11, family: "'JetBrains Mono', monospace" },
            color: '#9CA3AF',
            callback: yUnit ? (val) => `${val} ${yUnit}` : undefined,
          },
        },
      },
    }),
    [showLegend, showGrid, yUnit],
  );

  return (
    <ChartWrapper $height={height} className={className}>
      <Line data={chartData} options={options} />
    </ChartWrapper>
  );
};

// ── Sparkline (mini chart for DataCards / table cells) ─────

export interface SparklineProps {
  data: number[];
  color?: string;
  width?: number;
  height?: number;
}

const SparkWrapper = styled.div<{ $w: number; $h: number }>`
  width: ${({ $w }) => $w}px;
  height: ${({ $h }) => $h}px;
`;

export const Sparkline: React.FC<SparklineProps> = ({
  data,
  color = '#0052CC',
  width = 80,
  height = 24,
}) => {
  const chartData = useMemo(
    () => ({
      labels: data.map((_, i) => String(i)),
      datasets: [
        {
          data,
          borderColor: color,
          borderWidth: 1.5,
          pointRadius: 0,
          tension: 0.4,
          fill: false,
        },
      ],
    }),
    [data, color],
  );

  const opts: ChartOptions<'line'> = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: { enabled: false } },
      scales: {
        x: { display: false },
        y: { display: false },
      },
    }),
    [],
  );

  return (
    <SparkWrapper $w={width} $h={height}>
      <Line data={chartData} options={opts} />
    </SparkWrapper>
  );
};
