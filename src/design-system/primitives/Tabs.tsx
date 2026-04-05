/**
 * Tabs — clean tab switcher.
 * Controlled component. Theme-aware underline style.
 */

import React from 'react';
import styled from 'styled-components';

// ── Types ─────────────────────────────────────────────────

export interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
  /** Badge count shown next to label */
  count?: number;
}

export interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  /** Full-width tabs (stretch to fill container) */
  fullWidth?: boolean;
  className?: string;
}

// ── Styled ────────────────────────────────────────────────

const TabList = styled.div<{ $fullWidth: boolean }>`
  display: flex;
  gap: 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  ${({ $fullWidth }) => $fullWidth && 'width: 100%;'}
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const TabButton = styled.button<{ $active: boolean; $fullWidth: boolean }>`
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 12px 16px;
  min-height: 44px;
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 14px;
  font-weight: ${({ $active }) => ($active ? 600 : 400)};
  color: ${({ $active, theme }) => ($active ? theme.colors.primary : theme.colors.textSecondary)};
  background: transparent;
  border: none;
  cursor: pointer;
  white-space: nowrap;
  flex-shrink: 0;
  transition: color ${({ theme }) => theme.animation.fast};
  ${({ $fullWidth }) => $fullWidth && 'flex: 1; justify-content: center;'}

  &:hover {
    color: ${({ theme }) => theme.colors.text};
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    right: 0;
    height: 2px;
    background: ${({ $active, theme }) => ($active ? theme.colors.primary : 'transparent')};
    border-radius: 1px 1px 0 0;
    transition: background ${({ theme }) => theme.animation.fast};
  }
`;

const Count = styled.span`
  font-size: 11px;
  font-weight: 600;
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.textSecondary};
  padding: 1px 6px;
  border-radius: ${({ theme }) => theme.radius.full}px;
`;

// ── Component ─────────────────────────────────────────────

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onTabChange,
  fullWidth = false,
  className,
}) => (
  <TabList $fullWidth={fullWidth} role="tablist" className={className}>
    {tabs.map((tab) => (
      <TabButton
        key={tab.id}
        role="tab"
        aria-selected={activeTab === tab.id}
        $active={activeTab === tab.id}
        $fullWidth={fullWidth}
        onClick={() => onTabChange(tab.id)}
      >
        {tab.icon}
        {tab.label}
        {tab.count !== undefined && <Count>{tab.count}</Count>}
      </TabButton>
    ))}
  </TabList>
);
