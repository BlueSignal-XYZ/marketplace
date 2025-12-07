// Site List Component - Displays and manages sites
import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import styled from "styled-components";
import { SiteAPI, CustomerAPI } from "../../scripts/back_door";

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const PageTitle = styled.h1`
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  color: #1f2937;
`;

const ActionButton = styled.button`
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 600;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  border: none;
  color: #ffffff;

  &:hover {
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
    transform: translateY(-1px);
  }
`;

const SearchBar = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 10px 16px;
  font-size: 14px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: #ffffff;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const FilterSelect = styled.select`
  padding: 10px 16px;
  font-size: 14px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: #ffffff;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #3b82f6;
  }
`;

const SiteGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
`;

const SiteCard = styled.div`
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #3b82f6;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const SiteName = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 4px;
`;

const SiteAddress = styled.div`
  font-size: 13px;
  color: #6b7280;
  margin-bottom: 12px;
`;

const SiteMeta = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`;

const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  font-size: 11px;
  font-weight: 600;
  border-radius: 4px;
  background: #f3f4f6;
  color: #6b7280;

  ${(props) =>
    props.variant === "devices" &&
    `
    background: #dbeafe;
    color: #1d4ed8;
  `}

  ${(props) =>
    props.variant === "type" &&
    `
    background: #dcfce7;
    color: #166534;
  `}
`;

const CustomerLink = styled.div`
  font-size: 12px;
  color: #3b82f6;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #e5e7eb;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #6b7280;

  h3 {
    margin: 0 0 8px;
    font-size: 18px;
    color: #374151;
  }

  p {
    margin: 0 0 20px;
    font-size: 14px;
  }
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #6b7280;
`;

const Stats = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const StatCard = styled.div`
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 16px;
`;

const StatValue = styled.div`
  font-size: 28px;
  font-weight: 700;
  color: #1f2937;
`;

const StatLabel = styled.div`
  font-size: 12px;
  color: #6b7280;
  margin-top: 4px;
`;

const SITE_TYPES = [
  { value: "", label: "All Types" },
  { value: "residential", label: "Residential" },
  { value: "commercial", label: "Commercial" },
  { value: "municipal", label: "Municipal" },
  { value: "agricultural", label: "Agricultural" },
  { value: "educational", label: "Educational" },
  { value: "research", label: "Research" },
];

const SiteList = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const customerId = searchParams.get("customer");

  const [sites, setSites] = useState([]);
  const [customers, setCustomers] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  useEffect(() => {
    loadSites();
  }, [customerId]);

  const loadSites = async () => {
    setLoading(true);
    try {
      let data;
      if (customerId) {
        data = await SiteAPI.listByCustomer(customerId);
      } else {
        data = await SiteAPI.list({ limit: 100 });
      }
      setSites(data || []);

      // Load customer names
      const customerIds = [...new Set((data || []).map((s) => s.customerId).filter(Boolean))];
      const customerData = {};
      for (const id of customerIds) {
        try {
          const customer = await CustomerAPI.get(id);
          if (customer) {
            customerData[id] = customer;
          }
        } catch (e) {
          // Ignore
        }
      }
      setCustomers(customerData);
    } catch (err) {
      console.error("Failed to load sites:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredSites = sites.filter((site) => {
    const matchesSearch =
      !search ||
      site.name?.toLowerCase().includes(search.toLowerCase()) ||
      site.address?.toLowerCase().includes(search.toLowerCase());

    const matchesType = !typeFilter || site.type === typeFilter;

    return matchesSearch && matchesType;
  });

  const stats = {
    total: sites.length,
    withDevices: sites.filter((s) => s.deviceIds?.length > 0).length,
    totalDevices: sites.reduce((sum, s) => sum + (s.deviceIds?.length || 0), 0),
    uniqueCustomers: [...new Set(sites.map((s) => s.customerId).filter(Boolean))].length,
  };

  const handleCardClick = (siteId) => {
    navigate(`/sites/${siteId}`);
  };

  const handleNewSite = () => {
    navigate(customerId ? `/sites/new?customer=${customerId}` : "/sites/new");
  };

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>
          {customerId ? `Sites for ${customers[customerId]?.name || "Customer"}` : "Sites"}
        </PageTitle>
        <ActionButton onClick={handleNewSite}>+ New Site</ActionButton>
      </PageHeader>

      <Stats>
        <StatCard>
          <StatValue>{stats.total}</StatValue>
          <StatLabel>Total Sites</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{stats.withDevices}</StatValue>
          <StatLabel>With Devices</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{stats.totalDevices}</StatValue>
          <StatLabel>Total Devices</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{stats.uniqueCustomers}</StatValue>
          <StatLabel>Customers</StatLabel>
        </StatCard>
      </Stats>

      <SearchBar>
        <SearchInput
          type="text"
          placeholder="Search sites by name or address..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <FilterSelect
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          {SITE_TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </FilterSelect>
      </SearchBar>

      {loading ? (
        <LoadingState>Loading sites...</LoadingState>
      ) : filteredSites.length === 0 ? (
        <EmptyState>
          <h3>No sites found</h3>
          <p>
            {search || typeFilter
              ? "Try adjusting your search or filters"
              : "Create your first site to get started"}
          </p>
          {!search && !typeFilter && (
            <ActionButton onClick={handleNewSite}>+ New Site</ActionButton>
          )}
        </EmptyState>
      ) : (
        <SiteGrid>
          {filteredSites.map((site) => (
            <SiteCard key={site.id} onClick={() => handleCardClick(site.id)}>
              <SiteName>{site.name}</SiteName>
              <SiteAddress>{site.address}</SiteAddress>
              <SiteMeta>
                <Badge variant="type">{site.type}</Badge>
                <Badge variant="devices">
                  {site.deviceIds?.length || 0} devices
                </Badge>
                {site.waterBodyName && <Badge>{site.waterBodyName}</Badge>}
              </SiteMeta>
              {customers[site.customerId] && (
                <CustomerLink>{customers[site.customerId].name}</CustomerLink>
              )}
            </SiteCard>
          ))}
        </SiteGrid>
      )}
    </PageContainer>
  );
};

export default SiteList;
