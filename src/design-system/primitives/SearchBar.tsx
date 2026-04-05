/**
 * SearchBar — with optional filter dropdowns.
 * Used in marketplace, registry, sensor feeds.
 */

import React, { useState, useCallback, useRef } from 'react';
import styled from 'styled-components';

// ── Types ─────────────────────────────────────────────────

export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterConfig {
  id: string;
  label: string;
  options: FilterOption[];
}

export interface SearchBarProps {
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onSearch?: (value: string) => void;
  filters?: FilterConfig[];
  activeFilters?: Record<string, string>;
  onFilterChange?: (filterId: string, value: string) => void;
  /** Search icon element — defaults to magnifying glass SVG */
  icon?: React.ReactNode;
  /** Hide the default search icon */
  hideIcon?: boolean;
  className?: string;
}

// ── Styled ────────────────────────────────────────────────

const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const InputWrapper = styled.div`
  position: relative;
  flex: 1;
  min-width: 200px;
`;

const IconSlot = styled.span`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.colors.textMuted};
  display: flex;
  pointer-events: none;
`;

const StyledInput = styled.input<{ $hasIcon: boolean }>`
  width: 100%;
  height: 44px;
  padding: 0 14px;
  ${({ $hasIcon }) => $hasIcon && 'padding-left: 38px;'}
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text};
  background: ${({ theme }) => theme.components.inputBg};
  border: 1px solid ${({ theme }) => theme.components.inputBorder};
  border-radius: ${({ theme }) => theme.radius.sm}px;
  outline: none;
  transition: border-color ${({ theme }) => theme.animation.fast};

  &::placeholder { color: ${({ theme }) => theme.components.inputPlaceholder}; }
  &:focus {
    border-color: ${({ theme }) => theme.components.inputFocusBorder};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.focus};
  }
`;

const Select = styled.select`
  height: 44px;
  padding: 0 32px 0 12px;
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text};
  background: ${({ theme }) => theme.components.inputBg};
  border: 1px solid ${({ theme }) => theme.components.inputBorder};
  border-radius: ${({ theme }) => theme.radius.sm}px;
  outline: none;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 10px center;
  transition: border-color ${({ theme }) => theme.animation.fast};

  &:focus {
    border-color: ${({ theme }) => theme.components.inputFocusBorder};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}px) {
    width: 100%;
  }
`;

// ── Component ─────────────────────────────────────────────

const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = 'Search...',
  value,
  defaultValue,
  onChange,
  onSearch,
  filters,
  activeFilters = {},
  onFilterChange,
  icon,
  hideIcon = false,
  className,
}) => {
  const [internal, setInternal] = useState(value ?? defaultValue ?? '');
  const inputRef = useRef<HTMLInputElement>(null);

  const val = value !== undefined ? value : internal;
  const displayIcon = hideIcon ? null : (icon ?? <SearchIcon />);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = e.target.value;
      if (value === undefined) setInternal(v);
      onChange?.(v);
    },
    [value, onChange],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') onSearch?.(val);
    },
    [onSearch, val],
  );

  return (
    <Container className={className}>
      <InputWrapper>
        {displayIcon && <IconSlot>{displayIcon}</IconSlot>}
        <StyledInput
          ref={inputRef}
          $hasIcon={!!displayIcon}
          placeholder={placeholder}
          value={val}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />
      </InputWrapper>
      {filters?.map((f) => (
        <Select
          key={f.id}
          value={activeFilters[f.id] || ''}
          onChange={(e) => onFilterChange?.(f.id, e.target.value)}
        >
          <option value="">{f.label}</option>
          {f.options.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </Select>
      ))}
    </Container>
  );
};
