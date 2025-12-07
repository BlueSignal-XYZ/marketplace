// Device Allocation Component - Allocate inventory devices to orders
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { DeviceAPI, OrderAPI } from "../../scripts/back_door";
import orderService from "../../services/orderService";
import { useAppContext } from "../../context/AppContext";

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
`;

const PageHeader = styled.div`
  margin-bottom: 24px;
`;

const BackLink = styled.button`
  background: none;
  border: none;
  color: #3b82f6;
  font-size: 14px;
  cursor: pointer;
  padding: 0;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 4px;

  &:hover {
    text-decoration: underline;
  }
`;

const PageTitle = styled.h1`
  margin: 0 0 8px;
  font-size: 24px;
  font-weight: 600;
  color: #1f2937;
`;

const PageSubtitle = styled.p`
  margin: 0;
  font-size: 14px;
  color: #6b7280;
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 24px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const MainContent = styled.div``;

const Sidebar = styled.div``;

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

const CardBody = styled.div`
  padding: 20px;
`;

const OrderSummary = styled.div`
  margin-bottom: 24px;
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  font-size: 13px;
  border-bottom: 1px solid #f3f4f6;

  &:last-child {
    border-bottom: none;
  }
`;

const SummaryLabel = styled.span`
  color: #6b7280;
`;

const SummaryValue = styled.span`
  color: #1f2937;
  font-weight: 500;
`;

const LineItemCard = styled.div`
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const LineItemHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
`;

const LineItemName = styled.div`
  font-size: 15px;
  font-weight: 600;
  color: #1f2937;
`;

const LineItemQty = styled.div`
  font-size: 13px;
  color: #6b7280;
`;

const AllocationStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
`;

const StatusBadge = styled.span`
  padding: 4px 10px;
  font-size: 12px;
  font-weight: 600;
  border-radius: 4px;

  ${(props) =>
    props.status === "complete"
      ? `
    background: #dcfce7;
    color: #166534;
  `
      : props.status === "partial"
      ? `
    background: #fef3c7;
    color: #92400e;
  `
      : `
    background: #f3f4f6;
    color: #6b7280;
  `}
`;

const AllocationProgress = styled.div`
  font-size: 12px;
  color: #6b7280;
`;

const DeviceList = styled.div`
  margin-top: 12px;
`;

const DeviceTag = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  margin: 4px 4px 4px 0;
  background: #dbeafe;
  color: #1d4ed8;
  font-size: 11px;
  font-weight: 600;
  border-radius: 4px;
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: #1d4ed8;
  cursor: pointer;
  padding: 0;
  font-size: 14px;
  opacity: 0.6;

  &:hover {
    opacity: 1;
  }
`;

const InventoryList = styled.div`
  max-height: 400px;
  overflow-y: auto;
`;

const InventoryItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  border-bottom: 1px solid #f3f4f6;
  cursor: pointer;
  transition: background 0.2s;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: #f9fafb;
  }

  ${(props) =>
    props.selected &&
    `
    background: #eff6ff;
    border-color: #bfdbfe;
  `}

  ${(props) =>
    props.disabled &&
    `
    opacity: 0.5;
    cursor: not-allowed;
    &:hover {
      background: transparent;
    }
  `}
`;

const DeviceInfo = styled.div``;

const DeviceId = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: #1f2937;
  font-family: monospace;
`;

const DeviceMeta = styled.div`
  font-size: 11px;
  color: #6b7280;
  margin-top: 2px;
`;

const SelectButton = styled.button`
  padding: 6px 12px;
  font-size: 12px;
  font-weight: 600;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;

  ${(props) =>
    props.selected
      ? `
    background: #dc2626;
    border: none;
    color: #ffffff;
    &:hover {
      background: #b91c1c;
    }
  `
      : `
    background: #3b82f6;
    border: none;
    color: #ffffff;
    &:hover {
      background: #2563eb;
    }
  `}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ActionBar = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
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
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
    border: none;
    color: #ffffff;

    &:hover:not(:disabled) {
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
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
    transform: none;
    box-shadow: none;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: #6b7280;
  font-size: 14px;
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #6b7280;
`;

const ErrorMessage = styled.div`
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
  padding: 12px;
  border-radius: 6px;
  font-size: 13px;
  margin-bottom: 16px;
`;

const FilterBar = styled.div`
  padding: 12px;
  border-bottom: 1px solid #e5e7eb;
`;

const FilterInput = styled.input`
  width: 100%;
  padding: 8px 12px;
  font-size: 13px;
  border: 1px solid #d1d5db;
  border-radius: 4px;

  &:focus {
    outline: none;
    border-color: #3b82f6;
  }
`;

const DeviceAllocation = () => {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const { ACTIONS } = useAppContext();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [order, setOrder] = useState(null);
  const [inventory, setInventory] = useState([]);
  const [allocations, setAllocations] = useState({}); // lineItemIndex -> deviceIds[]
  const [filter, setFilter] = useState("");

  useEffect(() => {
    loadData();
  }, [orderId]);

  const loadData = async () => {
    try {
      setLoading(true);

      // Load order
      const orderData = await OrderAPI.get(orderId);
      if (!orderData) {
        setError("Order not found");
        return;
      }
      setOrder(orderData);

      // Initialize allocations from existing data
      const existingAllocations = {};
      orderData.lineItems?.forEach((item, index) => {
        existingAllocations[index] = item.deviceIds || [];
      });
      setAllocations(existingAllocations);

      // Load available inventory
      const inventoryData = await DeviceAPI.getInventory();
      setInventory(inventoryData || []);
    } catch (err) {
      console.error("Failed to load data:", err);
      setError("Failed to load order data");
    } finally {
      setLoading(false);
    }
  };

  const getAllocatedDeviceIds = () => {
    return Object.values(allocations).flat();
  };

  const getLineItemAllocationStatus = (index) => {
    const item = order?.lineItems?.[index];
    if (!item) return "none";

    const allocated = allocations[index]?.length || 0;
    const required = item.quantity || 1;

    if (allocated >= required) return "complete";
    if (allocated > 0) return "partial";
    return "none";
  };

  const handleAllocate = (lineItemIndex, deviceId) => {
    const item = order?.lineItems?.[lineItemIndex];
    const required = item?.quantity || 1;
    const current = allocations[lineItemIndex] || [];

    if (current.length >= required) return;

    setAllocations((prev) => ({
      ...prev,
      [lineItemIndex]: [...current, deviceId],
    }));
  };

  const handleDeallocate = (lineItemIndex, deviceId) => {
    setAllocations((prev) => ({
      ...prev,
      [lineItemIndex]: (prev[lineItemIndex] || []).filter((id) => id !== deviceId),
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);

    try {
      // Collect all device IDs
      const allDeviceIds = getAllocatedDeviceIds();

      // Update order with allocations
      await orderService.allocateDevicesToOrder(orderId, allDeviceIds, {
        lineItemAllocations: allocations,
      });

      ACTIONS?.logNotification?.("success", "Devices allocated successfully");
      navigate(`/orders/${orderId}`);
    } catch (err) {
      console.error("Failed to save allocations:", err);
      setError(err.message || "Failed to save allocations");
    } finally {
      setSaving(false);
    }
  };

  const filteredInventory = inventory.filter((device) => {
    if (!filter) return true;
    const searchLower = filter.toLowerCase();
    return (
      device.id?.toLowerCase().includes(searchLower) ||
      device.serialNumber?.toLowerCase().includes(searchLower) ||
      device.model?.toLowerCase().includes(searchLower)
    );
  });

  const allocatedIds = getAllocatedDeviceIds();

  if (loading) {
    return (
      <PageContainer>
        <LoadingState>Loading order...</LoadingState>
      </PageContainer>
    );
  }

  if (!order) {
    return (
      <PageContainer>
        <EmptyState>Order not found</EmptyState>
      </PageContainer>
    );
  }

  const totalRequired = order.lineItems?.reduce((sum, item) => sum + (item.quantity || 1), 0) || 0;
  const totalAllocated = allocatedIds.length;
  const isComplete = totalAllocated >= totalRequired;

  return (
    <PageContainer>
      <PageHeader>
        <BackLink onClick={() => navigate(`/orders/${orderId}`)}>
          ← Back to Order
        </BackLink>
        <PageTitle>Allocate Devices</PageTitle>
        <PageSubtitle>
          Order {order.id} - {order.customerName || "Customer"}
        </PageSubtitle>
      </PageHeader>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      <ContentGrid>
        <MainContent>
          <Card>
            <CardHeader>
              <CardTitle>Order Line Items</CardTitle>
              <AllocationProgress>
                {totalAllocated} / {totalRequired} allocated
              </AllocationProgress>
            </CardHeader>
            <CardBody>
              {order.lineItems?.map((item, index) => {
                const status = getLineItemAllocationStatus(index);
                const allocated = allocations[index] || [];
                const required = item.quantity || 1;

                return (
                  <LineItemCard key={index}>
                    <LineItemHeader>
                      <div>
                        <LineItemName>{item.productName || item.productId}</LineItemName>
                        <LineItemQty>
                          {item.variant && `${item.variant} - `}
                          Qty: {required}
                        </LineItemQty>
                      </div>
                      <AllocationStatus>
                        <StatusBadge status={status}>
                          {status === "complete"
                            ? "Complete"
                            : status === "partial"
                            ? "Partial"
                            : "Pending"}
                        </StatusBadge>
                        <AllocationProgress>
                          {allocated.length} / {required}
                        </AllocationProgress>
                      </AllocationStatus>
                    </LineItemHeader>

                    {allocated.length > 0 && (
                      <DeviceList>
                        {allocated.map((deviceId) => (
                          <DeviceTag key={deviceId}>
                            {deviceId}
                            <RemoveButton
                              onClick={() => handleDeallocate(index, deviceId)}
                              title="Remove"
                            >
                              ×
                            </RemoveButton>
                          </DeviceTag>
                        ))}
                      </DeviceList>
                    )}

                    {allocated.length < required && (
                      <div style={{ marginTop: 12, fontSize: 12, color: "#6b7280" }}>
                        Select {required - allocated.length} more device(s) from inventory →
                      </div>
                    )}
                  </LineItemCard>
                );
              })}
            </CardBody>
          </Card>

          <ActionBar>
            <Button onClick={() => navigate(`/orders/${orderId}`)}>Cancel</Button>
            <Button variant="primary" onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : "Save Allocations"}
            </Button>
          </ActionBar>
        </MainContent>

        <Sidebar>
          <Card>
            <CardHeader>
              <CardTitle>Available Inventory</CardTitle>
            </CardHeader>
            <FilterBar>
              <FilterInput
                type="text"
                placeholder="Search by ID or serial..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              />
            </FilterBar>
            <InventoryList>
              {filteredInventory.length === 0 ? (
                <EmptyState>
                  {filter ? "No matching devices" : "No inventory available"}
                </EmptyState>
              ) : (
                filteredInventory.map((device) => {
                  const isAllocated = allocatedIds.includes(device.id);

                  return (
                    <InventoryItem
                      key={device.id}
                      selected={isAllocated}
                      disabled={isAllocated}
                    >
                      <DeviceInfo>
                        <DeviceId>{device.id}</DeviceId>
                        <DeviceMeta>
                          {device.model || "BlueSignal"} •{" "}
                          {device.serialNumber || "No S/N"}
                        </DeviceMeta>
                      </DeviceInfo>
                      {order.lineItems?.map((item, index) => {
                        const allocated = allocations[index] || [];
                        const required = item.quantity || 1;
                        const canAllocate = !isAllocated && allocated.length < required;

                        if (!canAllocate) return null;

                        return (
                          <SelectButton
                            key={index}
                            onClick={() => handleAllocate(index, device.id)}
                          >
                            + Item {index + 1}
                          </SelectButton>
                        );
                      })}
                      {isAllocated && (
                        <SelectButton selected disabled>
                          Allocated
                        </SelectButton>
                      )}
                    </InventoryItem>
                  );
                })
              )}
            </InventoryList>
          </Card>

          <Card style={{ marginTop: 16 }}>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardBody>
              <OrderSummary>
                <SummaryRow>
                  <SummaryLabel>Status</SummaryLabel>
                  <SummaryValue>{order.status}</SummaryValue>
                </SummaryRow>
                <SummaryRow>
                  <SummaryLabel>Total Items</SummaryLabel>
                  <SummaryValue>{totalRequired}</SummaryValue>
                </SummaryRow>
                <SummaryRow>
                  <SummaryLabel>Allocated</SummaryLabel>
                  <SummaryValue>{totalAllocated}</SummaryValue>
                </SummaryRow>
                <SummaryRow>
                  <SummaryLabel>Remaining</SummaryLabel>
                  <SummaryValue>{Math.max(0, totalRequired - totalAllocated)}</SummaryValue>
                </SummaryRow>
              </OrderSummary>
            </CardBody>
          </Card>
        </Sidebar>
      </ContentGrid>
    </PageContainer>
  );
};

export default DeviceAllocation;
