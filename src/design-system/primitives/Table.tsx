/**
 * Table — sortable, filterable columns. CRITICAL for WQT.
 * Data-dense, monospace numbers, Bloomberg-terminal feel.
 */

import React, { useState, useMemo, useCallback } from 'react';
import styled from 'styled-components';

// ── Types ─────────────────────────────────────────────────

export type SortDir = 'asc' | 'desc' | null;

export interface Column<T> {
  key: string;
  header: string;
  /** Render cell content. Defaults to row[key] */
  render?: (row: T, index: number) => React.ReactNode;
  /** Sortable? Default false */
  sortable?: boolean;
  /** Compare function for custom sort */
  compare?: (a: T, b: T) => number;
  /** Column width (CSS string) */
  width?: string;
  /** Right-align (for numbers) */
  align?: 'left' | 'center' | 'right';
  /** Use monospace font (for data values) */
  mono?: boolean;
  /** Hide column below this breakpoint (px). Column gets display:none via CSS class. */
  hideBelow?: number;
}

export interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  /** Unique key extractor for each row */
  rowKey: (row: T) => string;
  /** Row click handler */
  onRowClick?: (row: T) => void;
  /** Empty message when no data */
  emptyMessage?: string;
  /** Loading state — shows skeleton rows */
  loading?: boolean;
  /** Compact density */
  compact?: boolean;
  /** Render rows as a stacked card list below the `sm` breakpoint (640px). Default true. */
  mobileCardView?: boolean;
  className?: string;
}

// ── Styled ────────────────────────────────────────────────

const Wrapper = styled.div<{ $hideOnMobile: boolean }>`
  width: 100%;
  max-width: 100%;
  overflow-x: auto;
  border: 1px solid ${({ theme }) => theme.components.tableBorder};
  border-radius: ${({ theme }) => theme.radius.md}px;
  -webkit-overflow-scrolling: touch;

  ${({ $hideOnMobile, theme }) =>
    $hideOnMobile &&
    `
    @media (max-width: ${theme.breakpoints.sm - 1}px) {
      display: none;
    }
  `}
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-family: ${({ theme }) => theme.fonts.sans};
  table-layout: auto;
`;

const Thead = styled.thead`
  background: ${({ theme }) => theme.components.tableHeaderBg};
`;

const Th = styled.th<{ $align: string; $sortable: boolean; $hideBelow?: number }>`
  padding: 10px 14px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: ${({ theme }) => theme.colors.textSecondary};
  text-align: ${({ $align }) => $align};
  cursor: ${({ $sortable }) => ($sortable ? 'pointer' : 'default')};
  user-select: none;
  white-space: nowrap;
  border-bottom: 1px solid ${({ theme }) => theme.components.tableBorder};

  @media (max-width: ${({ theme }) => theme.breakpoints.md - 1}px) {
    padding: 9px 10px;
    white-space: normal;
  }

  ${({ $hideBelow }) =>
    $hideBelow &&
    `
    @media (max-width: ${$hideBelow - 1}px) {
      display: none;
    }
  `}

  &:hover {
    ${({ $sortable, theme }) => $sortable && `color: ${theme.colors.text};`}
  }
`;

const SortArrow = styled.span<{ $active: boolean }>`
  margin-left: 4px;
  opacity: ${({ $active }) => ($active ? 1 : 0.3)};
`;

const Tbody = styled.tbody``;

const Tr = styled.tr<{ $clickable: boolean }>`
  cursor: ${({ $clickable }) => ($clickable ? 'pointer' : 'default')};
  transition: background ${({ theme }) => theme.animation.fast};
  &:nth-child(even) {
    background: ${({ theme }) => theme.components.tableHeaderBg}08;
  }
  &:hover {
    background: ${({ theme }) => theme.components.tableRowHover};
  }
  &:not(:last-child) > td {
    border-bottom: 1px solid ${({ theme }) => theme.components.tableBorder};
  }
  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: -2px;
  }
`;

const Td = styled.td<{ $align: string; $mono: boolean; $compact: boolean; $hideBelow?: number }>`
  padding: ${({ $compact }) => ($compact ? '8px 12px' : '12px 14px')};
  font-size: 13px;
  color: ${({ theme }) => theme.colors.text};
  text-align: ${({ $align }) => $align};
  font-family: ${({ $mono, theme }) => ($mono ? theme.fonts.mono : 'inherit')};
  white-space: nowrap;
  overflow-wrap: anywhere;

  @media (max-width: ${({ theme }) => theme.breakpoints.md - 1}px) {
    padding: ${({ $compact }) => ($compact ? '8px 10px' : '10px 10px')};
    white-space: normal;
  }

  ${({ $hideBelow }) =>
    $hideBelow &&
    `
    @media (max-width: ${$hideBelow - 1}px) {
      display: none;
    }
  `}
`;

const Empty = styled.td`
  padding: 40px 16px;
  text-align: center;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 14px;
`;

// ── Mobile card view (below `sm` breakpoint) ──────────────

const CardList = styled.div`
  display: none;
  width: 100%;
  flex-direction: column;
  gap: 10px;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm - 1}px) {
    display: flex;
  }
`;

const Card = styled.div<{ $clickable: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 14px;
  background: ${({ theme }) => theme.components.cardBg};
  border: 1px solid ${({ theme }) => theme.components.tableBorder};
  border-radius: ${({ theme }) => theme.radius.md}px;
  cursor: ${({ $clickable }) => ($clickable ? 'pointer' : 'default')};
  transition: background ${({ theme }) => theme.animation.fast};

  &:hover {
    ${({ $clickable, theme }) => $clickable && `background: ${theme.components.tableRowHover};`}
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
`;

const CardRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 12px;
  min-width: 0;
`;

const CardLabel = styled.span`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: ${({ theme }) => theme.colors.textSecondary};
  flex-shrink: 0;
`;

const CardValue = styled.span<{ $mono: boolean; $align: string }>`
  font-family: ${({ $mono, theme }) => ($mono ? theme.fonts.mono : theme.fonts.sans)};
  font-size: 13px;
  color: ${({ theme }) => theme.colors.text};
  text-align: ${({ $align }) => $align};
  min-width: 0;
  overflow-wrap: anywhere;
`;

const CardEmpty = styled.div`
  padding: 32px 16px;
  text-align: center;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 14px;
  border: 1px dashed ${({ theme }) => theme.components.tableBorder};
  border-radius: ${({ theme }) => theme.radius.md}px;
`;

// ── Component ─────────────────────────────────────────────

export function Table<T>({
  columns,
  data,
  rowKey,
  onRowClick,
  emptyMessage = 'No data',
  loading = false,
  compact = false,
  mobileCardView = true,
  className,
}: TableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>(null);

  const handleSort = useCallback((col: Column<T>) => {
    if (!col.sortable) return;
    setSortKey((prev) => {
      if (prev === col.key) {
        setSortDir((d) => (d === 'asc' ? 'desc' : d === 'desc' ? null : 'asc'));
        return col.key;
      }
      setSortDir('asc');
      return col.key;
    });
  }, []);

  const sortedData = useMemo(() => {
    if (!sortKey || !sortDir) return data;
    const col = columns.find((c) => c.key === sortKey);
    if (!col) return data;

    return [...data].sort((a, b) => {
      if (col.compare) {
        return sortDir === 'asc' ? col.compare(a, b) : col.compare(b, a);
      }
      const aVal = (a as Record<string, string | number>)[col.key];
      const bVal = (b as Record<string, string | number>)[col.key];
      if (aVal < bVal) return sortDir === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortKey, sortDir, columns]);

  return (
    <>
      <Wrapper className={className} $hideOnMobile={mobileCardView}>
        <StyledTable>
          <Thead>
            <tr>
              {columns.map((col) => (
                <Th
                  key={col.key}
                  scope="col"
                  $align={col.align || 'left'}
                  $sortable={!!col.sortable}
                  $hideBelow={col.hideBelow}
                  style={col.width ? { width: col.width } : undefined}
                  onClick={() => handleSort(col)}
                  aria-sort={
                    col.sortable
                      ? sortKey === col.key && sortDir
                        ? sortDir === 'asc'
                          ? 'ascending'
                          : 'descending'
                        : 'none'
                      : undefined
                  }
                >
                  {col.header}
                  {col.sortable && (
                    <SortArrow $active={sortKey === col.key && sortDir !== null}>
                      {sortKey === col.key && sortDir === 'desc' ? '↓' : '↑'}
                    </SortArrow>
                  )}
                </Th>
              ))}
            </tr>
          </Thead>
          <Tbody>
            {sortedData.length === 0 && !loading ? (
              <tr>
                <Empty colSpan={columns.length}>{emptyMessage}</Empty>
              </tr>
            ) : (
              sortedData.map((row, i) => (
                <Tr
                  key={rowKey(row)}
                  $clickable={!!onRowClick}
                  onClick={() => onRowClick?.(row)}
                  tabIndex={onRowClick ? 0 : undefined}
                  onKeyDown={
                    onRowClick
                      ? (e: React.KeyboardEvent) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            onRowClick(row);
                          }
                        }
                      : undefined
                  }
                >
                  {columns.map((col) => (
                    <Td
                      key={col.key}
                      $align={col.align || 'left'}
                      $mono={!!col.mono}
                      $compact={compact}
                      $hideBelow={col.hideBelow}
                    >
                      {col.render
                        ? col.render(row, i)
                        : ((row as Record<string, unknown>)[col.key] as React.ReactNode)}
                    </Td>
                  ))}
                </Tr>
              ))
            )}
          </Tbody>
        </StyledTable>
      </Wrapper>

      {mobileCardView && (
        <CardList className={className} role="list">
          {sortedData.length === 0 && !loading ? (
            <CardEmpty>{emptyMessage}</CardEmpty>
          ) : (
            sortedData.map((row, i) => (
              <Card
                key={rowKey(row)}
                role="listitem"
                $clickable={!!onRowClick}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                tabIndex={onRowClick ? 0 : undefined}
                onKeyDown={
                  onRowClick
                    ? (e: React.KeyboardEvent) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          onRowClick(row);
                        }
                      }
                    : undefined
                }
              >
                {columns.map((col) => (
                  <CardRow key={col.key}>
                    <CardLabel>{col.header}</CardLabel>
                    <CardValue $mono={!!col.mono} $align={col.align || 'right'}>
                      {col.render
                        ? col.render(row, i)
                        : ((row as Record<string, unknown>)[col.key] as React.ReactNode)}
                    </CardValue>
                  </CardRow>
                ))}
              </Card>
            ))
          )}
        </CardList>
      )}
    </>
  );
}
