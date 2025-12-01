import React from "react";
import styled from "styled-components";

const PillsContainer = styled.div`
  display: flex;
  gap: 8px;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  padding: 4px 0;
  margin-bottom: 20px;

  /* Hide scrollbar but keep functionality */
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }

  @media (max-width: 768px) {
    gap: 6px;
  }
`;

const Pill = styled.button`
  flex-shrink: 0;
  padding: 10px 16px;
  min-height: 44px;
  border-radius: 24px;
  border: 1px solid ${({ theme, $active }) =>
    $active ? theme.colors?.primary600 || "#0284c7" : theme.colors?.ui300 || "#cbd5e1"};
  background: ${({ theme, $active }) =>
    $active ? theme.colors?.primary600 || "#0284c7" : "white"};
  color: ${({ theme, $active }) =>
    $active ? "white" : theme.colors?.ui700 || "#334155"};
  font-size: 14px;
  font-weight: ${({ $active }) => ($active ? "600" : "500")};
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;

  &:hover {
    background: ${({ theme, $active }) =>
      $active ? theme.colors?.primary700 || "#0369a1" : theme.colors?.ui50 || "#f8fafc"};
    border-color: ${({ theme, $active }) =>
      $active ? theme.colors?.primary700 || "#0369a1" : theme.colors?.ui400 || "#94a3b8"};
  }

  &:active {
    transform: scale(0.98);
  }

  /* Ensure touch target is minimum 44px */
  @media (max-width: 768px) {
    padding: 12px 14px;
    font-size: 13px;
  }
`;

const FilterPills = ({ filters, activeFilter, onFilterChange }) => {
  return (
    <PillsContainer>
      {filters.map((filter) => (
        <Pill
          key={filter.value}
          $active={activeFilter === filter.value}
          onClick={() => onFilterChange(filter.value)}
          type="button"
        >
          {filter.label}
          {filter.count !== undefined && ` (${filter.count})`}
        </Pill>
      ))}
    </PillsContainer>
  );
};

export default FilterPills;
