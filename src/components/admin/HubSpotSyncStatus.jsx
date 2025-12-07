// HubSpot Sync Status Admin Component
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import HubSpotAPI from "../../apis/hubspot";
import { CustomerAPI, OrderAPI } from "../../scripts/back_door";
import { useAppContext } from "../../context/AppContext";

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
  display: flex;
  align-items: center;
  gap: 12px;
`;

const HubSpotLogo = styled.span`
  background: #ff7a59;
  color: white;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 700;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 12px;
`;

const Button = styled.button`
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 600;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;

  ${(props) =>
    props.variant === "primary"
      ? `
    background: linear-gradient(135deg, #ff7a59 0%, #ff5c35 100%);
    border: none;
    color: #ffffff;

    &:hover:not(:disabled) {
      box-shadow: 0 4px 12px rgba(255, 122, 89, 0.4);
      transform: translateY(-1px);
    }
  `
      : `
    background: #ffffff;
    border: 1px solid #d1d5db;
    color: #374151;

    &:hover:not(:disabled) {
      background: #f9fafb;
      border-color: #9ca3af;
    }
  `}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const StatCard = styled.div`
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 20px;
`;

const StatValue = styled.div`
  font-size: 32px;
  font-weight: 700;
  color: ${(props) => props.color || "#1f2937"};
`;

const StatLabel = styled.div`
  font-size: 13px;
  color: #6b7280;
  margin-top: 4px;
`;

const TabNav = styled.div`
  display: flex;
  border-bottom: 2px solid #e5e7eb;
  margin-bottom: 24px;
`;

const Tab = styled.button`
  padding: 12px 24px;
  background: none;
  border: none;
  font-size: 14px;
  font-weight: 600;
  color: ${(props) => (props.active ? "#ff7a59" : "#6b7280")};
  border-bottom: 2px solid ${(props) => (props.active ? "#ff7a59" : "transparent")};
  margin-bottom: -2px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    color: ${(props) => (props.active ? "#ff7a59" : "#374151")};
  }
`;

const Card = styled.div`
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
`;

const CardHeader = styled.div`
  padding: 16px 20px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CardTitle = styled.h3`
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  padding: 12px 16px;
  text-align: left;
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
`;

const Td = styled.td`
  padding: 12px 16px;
  font-size: 13px;
  color: #1f2937;
  border-bottom: 1px solid #f3f4f6;
`;

const SyncBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  font-size: 11px;
  font-weight: 600;
  border-radius: 4px;

  ${(props) =>
    props.synced
      ? `
    background: #dcfce7;
    color: #166534;
  `
      : `
    background: #fef3c7;
    color: #92400e;
  `}
`;

const SyncDot = styled.span`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: ${(props) => (props.synced ? "#22c55e" : "#f59e0b")};
`;

const HubSpotLink = styled.a`
  color: #ff7a59;
  text-decoration: none;
  font-family: monospace;
  font-size: 12px;

  &:hover {
    text-decoration: underline;
  }
`;

const ErrorRow = styled.tr`
  background: #fef2f2;
`;

const ErrorMessage = styled.div`
  color: #dc2626;
  font-size: 12px;
  margin-top: 4px;
`;

const RetryButton = styled.button`
  padding: 4px 10px;
  font-size: 11px;
  font-weight: 600;
  background: #ffffff;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  color: #374151;
  cursor: pointer;

  &:hover {
    background: #f9fafb;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: #6b7280;
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #6b7280;
`;

const Timestamp = styled.span`
  font-size: 11px;
  color: #9ca3af;
`;

const HubSpotSyncStatus = () => {
  const { ACTIONS } = useAppContext();
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [activeTab, setActiveTab] = useState("customers");
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [errors, setErrors] = useState([]);
  const [stats, setStats] = useState({
    totalCustomers: 0,
    syncedCustomers: 0,
    totalOrders: 0,
    syncedOrders: 0,
    totalErrors: 0,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // Load customers
      const customerList = await CustomerAPI.list({ limit: 100 });
      setCustomers(customerList || []);

      // Load orders
      const orderList = await OrderAPI.list({ limit: 100 });
      setOrders(orderList || []);

      // Calculate stats
      const syncedCustomers = (customerList || []).filter((c) => c.hubspotContactId).length;
      const syncedOrders = (orderList || []).filter((o) => o.hubspotDealId).length;

      setStats({
        totalCustomers: customerList?.length || 0,
        syncedCustomers,
        totalOrders: orderList?.length || 0,
        syncedOrders,
        totalErrors: errors.length,
      });
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSyncAll = async () => {
    setSyncing(true);
    try {
      // Sync all unsynced customers
      const unsyncedCustomers = customers.filter((c) => !c.hubspotContactId);
      const unsyncedOrders = orders.filter((o) => !o.hubspotDealId);

      const entities = [
        ...unsyncedCustomers.map((c) => ({ type: "customer", id: c.id, data: c })),
        ...unsyncedOrders.map((o) => ({ type: "order", id: o.id, data: o })),
      ];

      if (entities.length > 0) {
        await HubSpotAPI.sync.batchSync(entities);
        ACTIONS?.logNotification?.("success", `Synced ${entities.length} entities to HubSpot`);
        await loadData();
      } else {
        ACTIONS?.logNotification?.("info", "All entities already synced");
      }
    } catch (error) {
      console.error("Sync failed:", error);
      ACTIONS?.logNotification?.("error", "Sync failed: " + error.message);
    } finally {
      setSyncing(false);
    }
  };

  const handleSyncEntity = async (type, id) => {
    try {
      await HubSpotAPI.sync.syncEntity(type, id, true);
      ACTIONS?.logNotification?.("success", "Entity synced to HubSpot");
      await loadData();
    } catch (error) {
      ACTIONS?.logNotification?.("error", "Sync failed: " + error.message);
    }
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "Never";
    const date = new Date(timestamp);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <PageContainer>
        <LoadingState>Loading sync status...</LoadingState>
      </PageContainer>
    );
  }

  const syncPercentage =
    stats.totalCustomers + stats.totalOrders > 0
      ? Math.round(
          ((stats.syncedCustomers + stats.syncedOrders) /
            (stats.totalCustomers + stats.totalOrders)) *
            100
        )
      : 0;

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>
          <HubSpotLogo>HubSpot</HubSpotLogo>
          CRM Sync Status
        </PageTitle>
        <ActionButtons>
          <Button onClick={loadData}>Refresh</Button>
          <Button variant="primary" onClick={handleSyncAll} disabled={syncing}>
            {syncing ? "Syncing..." : "Sync All"}
          </Button>
        </ActionButtons>
      </PageHeader>

      <StatsGrid>
        <StatCard>
          <StatValue color="#22c55e">{syncPercentage}%</StatValue>
          <StatLabel>Overall Sync Rate</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>
            {stats.syncedCustomers}/{stats.totalCustomers}
          </StatValue>
          <StatLabel>Customers Synced</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>
            {stats.syncedOrders}/{stats.totalOrders}
          </StatValue>
          <StatLabel>Orders Synced</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue color={stats.totalErrors > 0 ? "#dc2626" : "#22c55e"}>
            {stats.totalErrors}
          </StatValue>
          <StatLabel>Sync Errors</StatLabel>
        </StatCard>
      </StatsGrid>

      <TabNav>
        <Tab active={activeTab === "customers"} onClick={() => setActiveTab("customers")}>
          Customers ({stats.totalCustomers})
        </Tab>
        <Tab active={activeTab === "orders"} onClick={() => setActiveTab("orders")}>
          Orders ({stats.totalOrders})
        </Tab>
        <Tab active={activeTab === "errors"} onClick={() => setActiveTab("errors")}>
          Errors ({stats.totalErrors})
        </Tab>
      </TabNav>

      {activeTab === "customers" && (
        <Card>
          <CardHeader>
            <CardTitle>Customer → Contact Sync</CardTitle>
          </CardHeader>
          {customers.length === 0 ? (
            <EmptyState>No customers found</EmptyState>
          ) : (
            <Table>
              <thead>
                <tr>
                  <Th>Customer</Th>
                  <Th>Email</Th>
                  <Th>Status</Th>
                  <Th>HubSpot ID</Th>
                  <Th>Last Synced</Th>
                  <Th>Action</Th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr key={customer.id}>
                    <Td>{customer.name}</Td>
                    <Td>{customer.email}</Td>
                    <Td>
                      <SyncBadge synced={!!customer.hubspotContactId}>
                        <SyncDot synced={!!customer.hubspotContactId} />
                        {customer.hubspotContactId ? "Synced" : "Not Synced"}
                      </SyncBadge>
                    </Td>
                    <Td>
                      {customer.hubspotContactId ? (
                        <HubSpotLink
                          href={`https://app.hubspot.com/contacts/${customer.hubspotContactId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {customer.hubspotContactId}
                        </HubSpotLink>
                      ) : (
                        "-"
                      )}
                    </Td>
                    <Td>
                      <Timestamp>{formatTimestamp(customer.hubspotSyncedAt)}</Timestamp>
                    </Td>
                    <Td>
                      <RetryButton onClick={() => handleSyncEntity("customer", customer.id)}>
                        {customer.hubspotContactId ? "Re-sync" : "Sync"}
                      </RetryButton>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card>
      )}

      {activeTab === "orders" && (
        <Card>
          <CardHeader>
            <CardTitle>Order → Deal Sync</CardTitle>
          </CardHeader>
          {orders.length === 0 ? (
            <EmptyState>No orders found</EmptyState>
          ) : (
            <Table>
              <thead>
                <tr>
                  <Th>Order ID</Th>
                  <Th>Customer</Th>
                  <Th>Status</Th>
                  <Th>Sync Status</Th>
                  <Th>HubSpot Deal</Th>
                  <Th>Last Synced</Th>
                  <Th>Action</Th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <Td style={{ fontFamily: "monospace" }}>{order.id}</Td>
                    <Td>{order.customerName || order.customerId || "-"}</Td>
                    <Td>{order.status}</Td>
                    <Td>
                      <SyncBadge synced={!!order.hubspotDealId}>
                        <SyncDot synced={!!order.hubspotDealId} />
                        {order.hubspotDealId ? "Synced" : "Not Synced"}
                      </SyncBadge>
                    </Td>
                    <Td>
                      {order.hubspotDealId ? (
                        <HubSpotLink
                          href={`https://app.hubspot.com/deals/${order.hubspotDealId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {order.hubspotDealId}
                        </HubSpotLink>
                      ) : (
                        "-"
                      )}
                    </Td>
                    <Td>
                      <Timestamp>{formatTimestamp(order.hubspotSyncedAt)}</Timestamp>
                    </Td>
                    <Td>
                      <RetryButton onClick={() => handleSyncEntity("order", order.id)}>
                        {order.hubspotDealId ? "Re-sync" : "Sync"}
                      </RetryButton>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card>
      )}

      {activeTab === "errors" && (
        <Card>
          <CardHeader>
            <CardTitle>Sync Errors</CardTitle>
          </CardHeader>
          {errors.length === 0 ? (
            <EmptyState>No sync errors</EmptyState>
          ) : (
            <Table>
              <thead>
                <tr>
                  <Th>Entity Type</Th>
                  <Th>Entity ID</Th>
                  <Th>Error</Th>
                  <Th>Timestamp</Th>
                  <Th>Action</Th>
                </tr>
              </thead>
              <tbody>
                {errors.map((error) => (
                  <ErrorRow key={error.id}>
                    <Td>{error.type}</Td>
                    <Td style={{ fontFamily: "monospace" }}>{error.entityId}</Td>
                    <Td>
                      <ErrorMessage>{error.error}</ErrorMessage>
                    </Td>
                    <Td>
                      <Timestamp>{formatTimestamp(error.timestamp)}</Timestamp>
                    </Td>
                    <Td>
                      <RetryButton
                        onClick={() => handleSyncEntity(error.type, error.entityId)}
                      >
                        Retry
                      </RetryButton>
                    </Td>
                  </ErrorRow>
                ))}
              </tbody>
            </Table>
          )}
        </Card>
      )}
    </PageContainer>
  );
};

export default HubSpotSyncStatus;
