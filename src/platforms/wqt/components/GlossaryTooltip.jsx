/**
 * GlossaryTooltip — inline term with tooltip/popover for industry jargon.
 * Used on How It Works and Solutions pages for first-time visitors.
 */

import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';

const Term = styled.span`
  border-bottom: 1px dashed ${({ theme }) => theme.colors?.textMuted || '#94a3b8'};
  cursor: help;
  position: relative;
  color: inherit;
`;

const Popover = styled.div`
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%) translateY(-8px);
  min-width: 220px;
  max-width: 320px;
  padding: 12px 14px;
  background: ${({ theme }) => theme.colors?.surface || '#fff'};
  border: 1px solid ${({ theme }) => theme.colors?.border || '#e2e8f0'};
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.12);
  font-size: 13px;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors?.text || '#1e293b'};
  z-index: 30;
  pointer-events: none;

  &::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 6px solid transparent;
    border-top-color: ${({ theme }) => theme.colors?.surface || '#fff'};
  }
`;

const PopoverTitle = styled.div`
  font-weight: 600;
  margin-bottom: 4px;
  color: ${({ theme }) => theme.colors?.text || '#1e293b'};
`;

const PopoverSource = styled.div`
  font-size: 11px;
  color: ${({ theme }) => theme.colors?.textMuted || '#64748b'};
  margin-top: 6px;
`;

export function GlossaryTooltip({ term, definition, source }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    if (open) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  return (
    <Term
      ref={ref}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onClick={() => setOpen((p) => !p)}
      role="button"
      tabIndex={0}
      aria-describedby={open ? `glossary-${term.replace(/\s/g, '-')}` : undefined}
    >
      {term}
      {open && (
        <Popover id={`glossary-${term.replace(/\s/g, '-')}`}>
          <PopoverTitle>{term}</PopoverTitle>
          {definition}
          {source && <PopoverSource>{source}</PopoverSource>}
        </Popover>
      )}
    </Term>
  );
}
