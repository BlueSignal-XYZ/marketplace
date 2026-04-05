/**
 * Pagination — clean page navigation for tables.
 * Shows "Page X of Y" with prev/next buttons.
 */

import React from 'react';
import styled from 'styled-components';

// ── Types ─────────────────────────────────────────────────

export interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  /** Max number of page buttons to show */
  maxButtons?: number;
  className?: string;
}

// ── Styled ────────────────────────────────────────────────

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;
  margin-top: 24px;
  flex-wrap: wrap;
`;

const PageInfo = styled.span`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textMuted};
  margin: 0 8px;
`;

const PageBtn = styled.button<{ $active?: boolean }>`
  padding: 6px 12px;
  min-width: 36px;
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 13px;
  font-weight: 500;
  color: ${({ $active, theme }) => ($active ? theme.colors.textOnPrimary : theme.colors.text)};
  background: ${({ $active, theme }) => ($active ? theme.colors.primary : theme.colors.surface)};
  border: 1px solid
    ${({ $active, theme }) => ($active ? theme.colors.primary : theme.colors.border)};
  border-radius: ${({ theme }) => theme.radius.sm}px;
  cursor: pointer;
  transition: all ${({ theme }) => theme.animation.fast};

  &:hover:not(:disabled) {
    border-color: ${({ theme }) => theme.colors.primary};
    opacity: 0.85;
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

const Ellipsis = styled.span`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textMuted};
  padding: 0 4px;
`;

// ── Component ─────────────────────────────────────────────

export const Pagination: React.FC<PaginationProps> = ({
  page,
  totalPages,
  onPageChange,
  maxButtons = 7,
  className,
}) => {
  if (totalPages <= 1) return null;

  const pages: (number | 'ellipsis')[] = [];
  if (totalPages <= maxButtons) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    const start = Math.max(2, page - 1);
    const end = Math.min(totalPages - 1, page + 1);
    if (start > 2) pages.push('ellipsis');
    for (let i = start; i <= end; i++) pages.push(i);
    if (end < totalPages - 1) pages.push('ellipsis');
    pages.push(totalPages);
  }

  return (
    <Container className={className}>
      <PageBtn disabled={page === 1} onClick={() => onPageChange(page - 1)}>
        ← Prev
      </PageBtn>
      {pages.map((p, i) =>
        p === 'ellipsis' ? (
          <Ellipsis key={`e-${i}`}>…</Ellipsis>
        ) : (
          <PageBtn key={p} $active={page === p} onClick={() => onPageChange(p as number)}>
            {p}
          </PageBtn>
        )
      )}
      <PageInfo>
        Page {page} of {totalPages}
      </PageInfo>
      <PageBtn disabled={page === totalPages} onClick={() => onPageChange(page + 1)}>
        Next →
      </PageBtn>
    </Container>
  );
};
