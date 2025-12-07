// Customer List Component - Displays and manages customers
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { CustomerAPI } from "../../scripts/back_door";
import customerService from "../../services/customerService";

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

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: #ffffff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const Th = styled.th`
  padding: 12px 16px;
  text-align: left;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #6b7280;
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
`;

const Td = styled.td`
  padding: 16px;
  font-size: 14px;
  color: #374151;
  border-bottom: 1px solid #e5e7eb;
`;

const Tr = styled.tr`
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #f9fafb;
  }

  &:last-child td {
    border-bottom: none;
  }
`;

const CustomerName = styled.div`
  font-weight: 600;
  color: #1f2937;
`;

const CustomerEmail = styled.div`
  font-size: 12px;
  color: #6b7280;
  margin-top: 2px;
`;

const Badge = styled.span`
  display: inline-block;
  padding: 4px 8px;
  font-size: 11px;
  font-weight: 600;
  border-radius: 4px;
  text-transform: capitalize;

  ${(props) => {
    switch (props.type) {
      case "residential":
        return "background: #dbeafe; color: #1d4ed8;";
      case "commercial":
        return "background: #dcfce7; color: #166534;";
      case "municipal":
        return "background: #fef3c7; color: #92400e;";
      case "agricultural":
        return "background: #d1fae5; color: #047857;";
      default:
        return "background: #f3f4f6; color: #6b7280;";
    }
  }}
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
  font-size: 14px;
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

const CUSTOMER_TYPES = [
  { value: "", label: "All Types" },
  { value: "residential", label: "Residential" },
  { value: "commercial", label: "Commercial" },
  { value: "municipal", label: "Municipal" },
  { value: "agricultural", label: "Agricultural" },
  { value: "educational", label: "Educational" },
  { value: "research", label: "Research" },
];

const CustomerList = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    setLoading(true);
    try {
      const data = await CustomerAPI.list({ limit: 100 });
      setCustomers(data || []);
    } catch (err) {
      console.error("Failed to load customers:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      !search ||
      customer.name?.toLowerCase().includes(search.toLowerCase()) ||
      customer.email?.toLowerCase().includes(search.toLowerCase()) ||
      customer.company?.toLowerCase().includes(search.toLowerCase());

    const matchesType = !typeFilter || customer.type === typeFilter;

    return matchesSearch && matchesType;
  });

  const stats = {
    total: customers.length,
    residential: customers.filter((c) => c.type === "residential").length,
    commercial: customers.filter((c) => c.type === "commercial").length,
    other: customers.filter(
      (c) => !["residential", "commercial"].includes(c.type)
    ).length,
  };

  const handleRowClick = (customerId) => {
    navigate(`/customers/${customerId}`);
  };

  const handleNewCustomer = () => {
    navigate("/customers/new");
  };

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Customers</PageTitle>
        <ActionButton onClick={handleNewCustomer}>+ New Customer</ActionButton>
      </PageHeader>

      <Stats>
        <StatCard>
          <StatValue>{stats.total}</StatValue>
          <StatLabel>Total Customers</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{stats.residential}</StatValue>
          <StatLabel>Residential</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{stats.commercial}</StatValue>
          <StatLabel>Commercial</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{stats.other}</StatValue>
          <StatLabel>Other Types</StatLabel>
        </StatCard>
      </Stats>

      <SearchBar>
        <SearchInput
          type="text"
          placeholder="Search customers by name, email, or company..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <FilterSelect
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          {CUSTOMER_TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </FilterSelect>
      </SearchBar>

      {loading ? (
        <LoadingState>Loading customers...</LoadingState>
      ) : filteredCustomers.length === 0 ? (
        <EmptyState>
          <h3>No customers found</h3>
          <p>
            {search || typeFilter
              ? "Try adjusting your search or filters"
              : "Create your first customer to get started"}
          </p>
          {!search && !typeFilter && (
            <ActionButton onClick={handleNewCustomer}>
              + New Customer
            </ActionButton>
          )}
        </EmptyState>
      ) : (
        <Table>
          <thead>
            <tr>
              <Th>Customer</Th>
              <Th>Company</Th>
              <Th>Type</Th>
              <Th>Phone</Th>
              <Th>Created</Th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.map((customer) => (
              <Tr key={customer.id} onClick={() => handleRowClick(customer.id)}>
                <Td>
                  <CustomerName>{customer.name}</CustomerName>
                  <CustomerEmail>{customer.email}</CustomerEmail>
                </Td>
                <Td>{customer.company || "-"}</Td>
                <Td>
                  <Badge type={customer.type}>{customer.type}</Badge>
                </Td>
                <Td>{customer.phone || "-"}</Td>
                <Td>
                  {customer.createdAt
                    ? new Date(customer.createdAt).toLocaleDateString()
                    : "-"}
                </Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      )}
    </PageContainer>
  );
};

export default CustomerList;
