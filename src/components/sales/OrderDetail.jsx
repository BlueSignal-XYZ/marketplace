// Order Detail Component - View and manage individual order
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { OrderAPI, CustomerAPI, SiteAPI, DeviceAPI } from "../../scripts/back_door";
import orderService from "../../services/orderService";
import { useAppContext } from "../../context/AppContext";

const PageContainer = styled.div`
  max-width: 1000px;
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

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;

  @media (max-width: 640px) {
    flex-direction: column;
  }
`;

const OrderInfo = styled.div``;

const OrderId = styled.h1`
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  color: #1f2937;
  font-family: monospace;
`;

const OrderMeta = styled.div`
  font-size: 14px;
  color: #6b7280;
  margin-top: 4px;
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 6px 14px;
  font-size: 13px;
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

const Section = styled.div`
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  margin-bottom: 24px;
  overflow: hidden;
`;

const SectionHeader = styled.div`
  padding: 16px 20px;
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const SectionTitle = styled.h3`
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
`;

const SectionBody = styled.div`
  padding: 20px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const InfoCard = styled.div`
  background: #f9fafb;
  border-radius: 6px;
  padding: 16px;
`;

const InfoLabel = styled.div`
  font-size: 12px;
  color: #6b7280;
  margin-bottom: 4px;
`;

const InfoValue = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #1f2937;
`;

const LineItemsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  padding: 12px;
  text-align: left;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  color: #6b7280;
  border-bottom: 1px solid #e5e7eb;
`;

const Td = styled.td`
  padding: 12px;
  font-size: 14px;
  color: #374151;
  border-bottom: 1px solid #e5e7eb;

  &:last-child {
    text-align: right;
  }
`;

const ProductName = styled.div`
  font-weight: 600;
  color: #1f2937;
`;

const ProductSku = styled.div`
  font-size: 12px;
  color: #6b7280;
  font-family: monospace;
`;

const TotalRow = styled.tr`
  td {
    padding: 16px 12px;
    font-weight: 600;
    border-bottom: none;
    background: #f9fafb;
  }
`;

const GrandTotal = styled.div`
  font-size: 20px;
  color: #059669;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
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
    }
  `
      : props.variant === "success"
      ? `
    background: linear-gradient(135deg, #059669 0%, #047857 100%);
    border: none;
    color: #ffffff;

    &:hover:not(:disabled) {
      box-shadow: 0 4px 12px rgba(5, 150, 105, 0.4);
    }
  `
      : props.variant === "danger"
      ? `
    background: #ffffff;
    border: 1px solid #dc2626;
    color: #dc2626;

    &:hover:not(:disabled) {
      background: #fef2f2;
    }
  `
      : `
    background: #ffffff;
    border: 1px solid #d1d5db;
    color: #374151;

    &:hover:not(:disabled) {
      background: #f9fafb;
    }
  `}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Timeline = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const TimelineItem = styled.div`
  display: flex;
  gap: 12px;
`;

const TimelineDot = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${(props) => (props.active ? "#3b82f6" : "#d1d5db")};
  margin-top: 4px;
  flex-shrink: 0;
`;

const TimelineContent = styled.div`
  flex: 1;
`;

const TimelineTitle = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #1f2937;
`;

const TimelineDate = styled.div`
  font-size: 12px;
  color: #6b7280;
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #6b7280;
`;

const ErrorState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #dc2626;
`;

const OrderDetail = () => {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const { ACTIONS } = useAppContext();

  const [order, setOrder] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [site, setSite] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    loadOrder();
  }, [orderId]);

  const loadOrder = async () => {
    setLoading(true);
    setError(null);

    try {
      const orderData = await OrderAPI.get(orderId);
      if (!orderData) {
        setError("Order not found");
        return;
      }

      setOrder(orderData);

      // Load related data
      if (orderData.customerId) {
        const customerData = await CustomerAPI.get(orderData.customerId);
        setCustomer(customerData);
      }

      if (orderData.siteId) {
        const siteData = await SiteAPI.get(orderData.siteId);
        setSite(siteData);
      }
    } catch (err) {
      console.error("Failed to load order:", err);
      setError("Failed to load order");
    } finally {
      setLoading(false);
    }
  };

  const handleSendQuote = async () => {
    setActionLoading(true);
    try {
      await orderService.sendQuote(orderId);
      ACTIONS?.logNotification?.("success", "Quote sent to customer");
      loadOrder();
    } catch (err) {
      ACTIONS?.logNotification?.("error", err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleApprove = async () => {
    setActionLoading(true);
    try {
      await orderService.approveQuote(orderId);
      ACTIONS?.logNotification?.("success", "Quote approved");
      loadOrder();
    } catch (err) {
      ACTIONS?.logNotification?.("error", err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleMarkPaid = async () => {
    setActionLoading(true);
    try {
      await orderService.recordPayment(orderId, `manual-${Date.now()}`);
      ACTIONS?.logNotification?.("success", "Payment recorded");
      loadOrder();
    } catch (err) {
      ACTIONS?.logNotification?.("error", err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleShip = async () => {
    setActionLoading(true);
    try {
      await orderService.shipOrder(orderId);
      ACTIONS?.logNotification?.("success", "Order marked as shipped");
      loadOrder();
    } catch (err) {
      ACTIONS?.logNotification?.("error", err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;

    setActionLoading(true);
    try {
      await orderService.cancelOrder(orderId, "Cancelled by user");
      ACTIONS?.logNotification?.("success", "Order cancelled");
      loadOrder();
    } catch (err) {
      ACTIONS?.logNotification?.("error", err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const getAvailableActions = () => {
    if (!order) return [];

    const actions = [];
    switch (order.status) {
      case "draft":
        actions.push({ label: "Send Quote", action: handleSendQuote, variant: "primary" });
        actions.push({ label: "Cancel", action: handleCancel, variant: "danger" });
        break;
      case "quoted":
        actions.push({ label: "Mark Approved", action: handleApprove, variant: "success" });
        actions.push({ label: "Cancel", action: handleCancel, variant: "danger" });
        break;
      case "approved":
        actions.push({ label: "Record Payment", action: handleMarkPaid, variant: "success" });
        actions.push({ label: "Cancel", action: handleCancel, variant: "danger" });
        break;
      case "paid":
      case "processing":
        actions.push({ label: "Mark Shipped", action: handleShip, variant: "primary" });
        break;
      default:
        break;
    }
    return actions;
  };

  const getTimeline = () => {
    if (!order) return [];

    const items = [
      { title: "Order Created", date: order.createdAt, active: true },
    ];

    if (order.quotedAt) {
      items.push({ title: "Quote Sent", date: order.quotedAt, active: true });
    }

    if (order.approvedAt) {
      items.push({ title: "Quote Approved", date: order.approvedAt, active: true });
    }

    if (order.paidAt) {
      items.push({ title: "Payment Received", date: order.paidAt, active: true });
    }

    if (order.fulfilledAt) {
      items.push({ title: "Order Fulfilled", date: order.fulfilledAt, active: true });
    }

    return items;
  };

  if (loading) {
    return (
      <PageContainer>
        <LoadingState>Loading order...</LoadingState>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <ErrorState>{error}</ErrorState>
      </PageContainer>
    );
  }

  const actions = getAvailableActions();
  const timeline = getTimeline();

  return (
    <PageContainer>
      <PageHeader>
        <BackLink onClick={() => navigate("/orders")}>← Back to Orders</BackLink>
        <HeaderRow>
          <OrderInfo>
            <OrderId>{order.id}</OrderId>
            <OrderMeta>
              Created {new Date(order.createdAt).toLocaleDateString()}
            </OrderMeta>
          </OrderInfo>
          <StatusBadge status={order.status}>{order.status}</StatusBadge>
        </HeaderRow>
      </PageHeader>

      {actions.length > 0 && (
        <Section>
          <SectionHeader>
            <SectionTitle>Actions</SectionTitle>
          </SectionHeader>
          <SectionBody>
            <ActionButtons>
              {actions.map((action, index) => (
                <Button
                  key={index}
                  variant={action.variant}
                  onClick={action.action}
                  disabled={actionLoading}
                >
                  {action.label}
                </Button>
              ))}
            </ActionButtons>
          </SectionBody>
        </Section>
      )}

      <Grid>
        <Section>
          <SectionHeader>
            <SectionTitle>Customer</SectionTitle>
          </SectionHeader>
          <SectionBody>
            {customer ? (
              <>
                <InfoCard style={{ marginBottom: 12 }}>
                  <InfoLabel>Name</InfoLabel>
                  <InfoValue>{customer.name}</InfoValue>
                </InfoCard>
                <InfoCard style={{ marginBottom: 12 }}>
                  <InfoLabel>Email</InfoLabel>
                  <InfoValue>{customer.email}</InfoValue>
                </InfoCard>
                {customer.phone && (
                  <InfoCard>
                    <InfoLabel>Phone</InfoLabel>
                    <InfoValue>{customer.phone}</InfoValue>
                  </InfoCard>
                )}
              </>
            ) : (
              <InfoValue style={{ color: "#6b7280" }}>No customer assigned</InfoValue>
            )}
          </SectionBody>
        </Section>

        <Section>
          <SectionHeader>
            <SectionTitle>Installation Site</SectionTitle>
          </SectionHeader>
          <SectionBody>
            {site ? (
              <>
                <InfoCard style={{ marginBottom: 12 }}>
                  <InfoLabel>Site Name</InfoLabel>
                  <InfoValue>{site.name}</InfoValue>
                </InfoCard>
                <InfoCard>
                  <InfoLabel>Address</InfoLabel>
                  <InfoValue>{site.address}</InfoValue>
                </InfoCard>
              </>
            ) : (
              <InfoValue style={{ color: "#6b7280" }}>No site assigned</InfoValue>
            )}
          </SectionBody>
        </Section>
      </Grid>

      <Section>
        <SectionHeader>
          <SectionTitle>Line Items</SectionTitle>
        </SectionHeader>
        <SectionBody style={{ padding: 0 }}>
          <LineItemsTable>
            <thead>
              <tr>
                <Th>Product</Th>
                <Th>Quantity</Th>
                <Th>Unit Price</Th>
                <Th>Total</Th>
              </tr>
            </thead>
            <tbody>
              {order.lineItems?.map((item, index) => (
                <tr key={index}>
                  <Td>
                    <ProductName>{item.name}</ProductName>
                    <ProductSku>{item.sku}</ProductSku>
                  </Td>
                  <Td>{item.quantity}</Td>
                  <Td>${item.unitPrice?.toLocaleString()}</Td>
                  <Td>${item.totalPrice?.toLocaleString()}</Td>
                </tr>
              ))}
              <TotalRow>
                <Td colSpan={3}>Subtotal</Td>
                <Td>${order.subtotal?.toLocaleString()}</Td>
              </TotalRow>
              {order.tax > 0 && (
                <TotalRow>
                  <Td colSpan={3}>Tax</Td>
                  <Td>${order.tax?.toLocaleString()}</Td>
                </TotalRow>
              )}
              {order.shipping > 0 && (
                <TotalRow>
                  <Td colSpan={3}>Shipping</Td>
                  <Td>${order.shipping?.toLocaleString()}</Td>
                </TotalRow>
              )}
              <TotalRow>
                <Td colSpan={3}>Total</Td>
                <Td>
                  <GrandTotal>${order.total?.toLocaleString()}</GrandTotal>
                </Td>
              </TotalRow>
            </tbody>
          </LineItemsTable>
        </SectionBody>
      </Section>

      <Section>
        <SectionHeader>
          <SectionTitle>Timeline</SectionTitle>
        </SectionHeader>
        <SectionBody>
          <Timeline>
            {timeline.map((item, index) => (
              <TimelineItem key={index}>
                <TimelineDot active={item.active} />
                <TimelineContent>
                  <TimelineTitle>{item.title}</TimelineTitle>
                  <TimelineDate>
                    {item.date ? new Date(item.date).toLocaleString() : "-"}
                  </TimelineDate>
                </TimelineContent>
              </TimelineItem>
            ))}
          </Timeline>
        </SectionBody>
      </Section>

      {order.notes && (
        <Section>
          <SectionHeader>
            <SectionTitle>Notes</SectionTitle>
          </SectionHeader>
          <SectionBody>
            <p style={{ margin: 0, color: "#374151" }}>{order.notes}</p>
          </SectionBody>
        </Section>
      )}
    </PageContainer>
  );
};

export default OrderDetail;
