// /src/components/cloud/SitesListPage.jsx
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import CloudPageLayout from "./CloudPageLayout";
import SiteCard from "./SiteCard";
import CloudMockAPI from "../../services/cloudMockAPI";

const Controls = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
`;

const SearchBar = styled.input`
  flex: 1;
  max-width: 400px;
  padding: 10px 16px;
  border: 1px solid ${({ theme }) => theme.colors?.ui200 || "#e5e7eb"};
  border-radius: 8px;
  font-size: 14px;
  color: ${({ theme }) => theme.colors?.ui900 || "#0f172a"};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors?.primary500 || "#06b6d4"};
    box-shadow: 0 0 0 3px rgba(6, 182, 212, 0.1);
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors?.ui400 || "#9ca3af"};
  }
`;

const Filters = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const FilterChip = styled.button`
  border-radius: 999px;
  border: 1px solid
    ${({ $active, theme }) =>
      $active
        ? theme.colors?.primary500 || "#06b6d4"
        : theme.colors?.ui200 || "#e5e7eb"};
  padding: 6px 14px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease-out;

  background: ${({ $active, theme }) =>
    $active ? theme.colors?.primary50 || "#e0f2ff" : "#ffffff"};
  color: ${({ $active, theme }) =>
    $active
      ? theme.colors?.primary700 || "#0369a1"
      : theme.colors?.ui700 || "#374151"};

  &:hover {
    border-color: ${({ theme }) => theme.colors?.primary400 || "#22d3ee"};
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 48px 20px;
  color: ${({ theme }) => theme.colors?.ui500 || "#6b7280"};

  h3 {
    margin: 0 0 8px;
    font-size: 16px;
    font-weight: 600;
    color: ${({ theme }) => theme.colors?.ui700 || "#374151"};
  }

  p {
    margin: 0;
    font-size: 14px;
  }
`;

const Skeleton = styled.div`
  background: linear-gradient(
    90deg,
    #f3f4f6 25%,
    #e5e7eb 50%,
    #f3f4f6 75%
  );
  background-size: 200% 100%;
  animation: loading 1.5s ease-in-out infinite;
  border-radius: 12px;
  height: 200px;

  @keyframes loading {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }
`;

export default function SitesListPage() {
  const [sites, setSites] = useState([]);
  const [filteredSites, setFilteredSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    loadSites();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchQuery, statusFilter, sites]);

  const loadSites = async () => {
    setLoading(true);
    try {
      const data = await CloudMockAPI.sites.getAll();
      setSites(data);
    } catch (error) {
      console.error("Error loading sites:", error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...sites];

    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (s) =>
          s.name.toLowerCase().includes(query) ||
          s.customer.toLowerCase().includes(query) ||
          s.location.toLowerCase().includes(query)
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((s) => s.status === statusFilter);
    }

    setFilteredSites(filtered);
  };

  if (loading) {
    return (
      <CloudPageLayout
        title="Sites"
        subtitle="Manage all monitoring locations"
      >
        <Grid>
          <Skeleton />
          <Skeleton />
          <Skeleton />
        </Grid>
      </CloudPageLayout>
    );
  }

  return (
    <CloudPageLayout
      title="Sites"
      subtitle="Manage all monitoring locations"
    >
      <Controls>
        <SearchBar
          type="text"
          placeholder="Search sites, customers, locations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Filters>
          <FilterChip
            $active={statusFilter === "all"}
            onClick={() => setStatusFilter("all")}
          >
            All
          </FilterChip>
          <FilterChip
            $active={statusFilter === "online"}
            onClick={() => setStatusFilter("online")}
          >
            Online
          </FilterChip>
          <FilterChip
            $active={statusFilter === "warning"}
            onClick={() => setStatusFilter("warning")}
          >
            Warning
          </FilterChip>
          <FilterChip
            $active={statusFilter === "offline"}
            onClick={() => setStatusFilter("offline")}
          >
            Offline
          </FilterChip>
        </Filters>
      </Controls>

      {filteredSites.length === 0 ? (
        <EmptyState>
          <h3>No sites found</h3>
          <p>
            {searchQuery || statusFilter !== "all"
              ? "Try adjusting your filters or search query."
              : "No sites have been configured yet."}
          </p>
        </EmptyState>
      ) : (
        <Grid>
          {filteredSites.map((site) => (
            <SiteCard key={site.id} site={site} />
          ))}
        </Grid>
      )}
    </CloudPageLayout>
  );
}
