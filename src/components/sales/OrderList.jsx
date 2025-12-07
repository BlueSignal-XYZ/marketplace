// Order List Component - Displays and manages orders/quotes
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { OrderAPI } from "../../scripts/back_door";

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

const Stats = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 16px;
  margin-bottom: 24px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 640px) {
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
  color: ${(props) => props.color || "#1f2937"};
`;

const StatLabel = styled.div`
  font-size: 12px;
  color: #6b7280;
  margin-top: 4px;
`;

const FilterBar = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  flex-wrap: wrap;
`;

const SearchInput = styled.input`
  flex: 1;
  min-width: 200px;
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

const OrderId = styled.div`
  font-weight: 600;
  color: #3b82f6;
  font-family: monospace;
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 4px 10px;
  font-size: 11px;
  font-weight: 600;
  border-radius: 9999px;
  text-transform: capitalize;

  ${(props) => {
    switch (props.status) {
      case "draft":
        return "background: #f3f4f6; color: #6b7280;";
      case "quoted":
        return "background: #dbeafe; color: #1d4ed8;";
      case "approved":
        return "background: #fef3c7; color: #92400e;";
      case "paid":
        return "background: #dcfce7; color: #166534;";
      case "processing":
        return "background: #e0e7ff; color: #4338ca;";
      case "shipped":
        return "background: #cffafe; color: #0891b2;";
      case "fulfilled":
        return "background: #d1fae5; color: #047857;";
      case "cancelled":
        return "background: #fee2e2; color: #dc2626;";
      default:
        return "background: #f3f4f6; color: #6b7280;";
    }
  }}
`;

const PaymentBadge = styled.span`
  display: inline-block;
  padding: 3px 8px;
  font-size: 10px;
  font-weight: 600;
  border-radius: 4px;
  margin-left: 8px;

  ${(props) => {
    switch (props.status) {
      case "paid":
        return "background: #dcfce7; color: #166534;";
      case "pending":
        return "background: #fef3c7; color: #92400e;";
      case "failed":
        return "background: #fee2e2; color: #dc2626;";
      default:
        return "background: #f3f4f6; color: #6b7280;";
    }
  }}
`;

const Amount = styled.div`
  font-weight: 600;
  color: #059669;
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

const ORDER_STATUSES = [
  { value: "", label: "All Statuses" },
  { value: "draft", label: "Draft" },
  { value: "quoted", label: "Quoted" },
  { value: "approved", label: "Approved" },
  { value: "paid", label: "Paid" },
  { value: "processing", label: "Processing" },
  { value: "shipped", label: "Shipped" },
  { value: "fulfilled", label: "Fulfilled" },
  { value: "cancelled", label: "Cancelled" },
];

const OrderList = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await OrderAPI.list({ limit: 100 });
      setOrders(data || []);
    } catch (err) {
      console.error("Failed to load orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      !search ||
      order.id?.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = !statusFilter || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: orders.length,
    drafts: orders.filter((o) => o.status === "draft").length,
    quoted: orders.filter((o) => o.status === "quoted").length,
    paid: orders.filter((o) => ["paid", "processing", "shipped", "fulfilled"].includes(o.status)).length,
    totalValue: orders.reduce((sum, o) => sum + (o.total || 0), 0),
  };

  const handleRowClick = (orderId) => {
    navigate(`/orders/${orderId}`);
  };

  const handleNewOrder = () => {
    navigate("/configurator");
  };

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Orders & Quotes</PageTitle>
        <ActionButton onClick={handleNewOrder}>+ New Quote</ActionButton>
      </PageHeader>

      <Stats>
        <StatCard>
          <StatValue>{stats.total}</StatValue>
          <StatLabel>Total Orders</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue color="#6b7280">{stats.drafts}</StatValue>
          <StatLabel>Drafts</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue color="#3b82f6">{stats.quoted}</StatValue>
          <StatLabel>Pending Quotes</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue color="#059669">{stats.paid}</StatValue>
          <StatLabel>Paid Orders</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue color="#059669">${stats.totalValue.toLocaleString()}</StatValue>
          <StatLabel>Total Value</StatLabel>
        </StatCard>
      </Stats>

      <FilterBar>
        <SearchInput
          type="text"
          placeholder="Search by order ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <FilterSelect
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          {ORDER_STATUSES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </FilterSelect>
      </FilterBar>

      {loading ? (
        <LoadingState>Loading orders...</LoadingState>
      ) : filteredOrders.length === 0 ? (
        <EmptyState>
          <h3>No orders found</h3>
          <p>
            {search || statusFilter
              ? "Try adjusting your search or filters"
              : "Create your first quote to get started"}
          </p>
          {!search && !statusFilter && (
            <ActionButton onClick={handleNewOrder}>+ New Quote</ActionButton>
          )}
        </EmptyState>
      ) : (
        <Table>
          <thead>
            <tr>
              <Th>Order ID</Th>
              <Th>Status</Th>
              <Th>Items</Th>
              <Th>Total</Th>
              <Th>Created</Th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <Tr key={order.id} onClick={() => handleRowClick(order.id)}>
                <Td>
                  <OrderId>{order.id}</OrderId>
                </Td>
                <Td>
                  <StatusBadge status={order.status}>{order.status}</StatusBadge>
                  {order.paymentStatus && order.paymentStatus !== "pending" && (
                    <PaymentBadge status={order.paymentStatus}>
                      {order.paymentStatus}
                    </PaymentBadge>
                  )}
                </Td>
                <Td>
                  {order.lineItems?.reduce((sum, item) => sum + item.quantity, 0) || 0} units
                </Td>
                <Td>
                  <Amount>${(order.total || 0).toLocaleString()}</Amount>
                </Td>
                <Td>
                  {order.createdAt
                    ? new Date(order.createdAt).toLocaleDateString()
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

export default OrderList;
