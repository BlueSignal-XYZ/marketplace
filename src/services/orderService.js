/**
 * Order Service
 *
 * Business logic for the quote-to-order workflow:
 * - Quote creation and management
 * - Order conversion and status updates
 * - Device allocation
 * - HubSpot sync
 */

import { OrderAPI, DeviceAPI, CustomerAPI, SiteAPI } from '../scripts/back_door';
import HubSpotAPI from '../apis/hubspot';
import { PRODUCTS } from '../components/BlueSignalConfigurator/data/products';

// Generate unique order ID
const generateOrderId = () => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 7);
  return `ORD-${timestamp}-${random}`.toUpperCase();
};

// Generate unique line item ID
const generateLineItemId = () => {
  return `LI-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 5)}`.toUpperCase();
};

// Calculate order totals from line items
const calculateOrderTotals = (lineItems, taxRate = 0.0) => {
  const subtotal = lineItems.reduce((sum, item) => sum + item.totalPrice, 0);
  const tax = subtotal * taxRate;
  const shipping = calculateShipping(lineItems);
  const total = subtotal + tax + shipping;

  return { subtotal, tax, shipping, total };
};

// Calculate shipping based on line items
const calculateShipping = (lineItems) => {
  // Simple shipping calculation - can be enhanced
  const itemCount = lineItems.reduce((sum, item) => sum + item.quantity, 0);
  const baseShipping = 0; // Free shipping for now
  const perItemShipping = 0;
  return baseShipping + (itemCount * perItemShipping);
};

// Get product info from SKU
const getProductBySku = (sku) => {
  return Object.values(PRODUCTS).find(p => p.sku === sku) || null;
};

/**
 * Create a new quote/draft order
 */
export const createQuote = async (quoteData, createdBy) => {
  try {
    const orderId = generateOrderId();
    const now = new Date().toISOString();

    // Build line items with product details
    const lineItems = quoteData.lineItems.map(item => {
      const product = getProductBySku(item.sku);
      const unitPrice = item.unitPrice ?? product?.price ?? 0;
      const totalPrice = unitPrice * item.quantity;

      return {
        id: generateLineItemId(),
        sku: item.sku,
        name: product?.name || item.name || 'Unknown Product',
        description: product?.tagline || '',
        quantity: item.quantity,
        unitPrice,
        totalPrice,
        deviceIds: [],
      };
    });

    const { subtotal, tax, shipping, total } = calculateOrderTotals(lineItems);

    const orderData = {
      id: orderId,
      customerId: quoteData.customerId || null,
      siteId: quoteData.siteId || null,
      status: 'draft',
      lineItems,
      subtotal,
      tax,
      shipping,
      total,
      paymentStatus: 'pending',
      createdBy,
      notes: quoteData.notes || '',
      createdAt: now,
      updatedAt: now,
    };

    const result = await OrderAPI.create(orderData);
    return result;
  } catch (error) {
    console.error('Error creating quote:', error);
    throw error;
  }
};

/**
 * Update an existing quote
 */
export const updateQuote = async (orderId, updates) => {
  try {
    // Recalculate totals if line items changed
    if (updates.lineItems) {
      const lineItems = updates.lineItems.map(item => {
        const product = getProductBySku(item.sku);
        const unitPrice = item.unitPrice ?? product?.price ?? 0;
        const totalPrice = unitPrice * item.quantity;

        return {
          id: item.id || generateLineItemId(),
          sku: item.sku,
          name: product?.name || item.name || 'Unknown Product',
          description: product?.tagline || '',
          quantity: item.quantity,
          unitPrice,
          totalPrice,
          deviceIds: item.deviceIds || [],
        };
      });

      const { subtotal, tax, shipping, total } = calculateOrderTotals(lineItems);
      updates = { ...updates, lineItems, subtotal, tax, shipping, total };
    }

    updates.updatedAt = new Date().toISOString();
    const result = await OrderAPI.update(orderId, updates);
    return result;
  } catch (error) {
    console.error('Error updating quote:', error);
    throw error;
  }
};

/**
 * Convert quote to order (send to customer)
 */
export const sendQuote = async (orderId) => {
  try {
    const now = new Date().toISOString();
    const result = await OrderAPI.update(orderId, {
      status: 'quoted',
      quotedAt: now,
      updatedAt: now,
    });

    // Sync to HubSpot
    try {
      const order = await OrderAPI.get(orderId);
      if (order?.customerId) {
        const customer = await CustomerAPI.get(order.customerId);
        await HubSpotAPI.sync.syncOrder(order, customer);
      }
    } catch (hubspotError) {
      console.warn('HubSpot sync failed (non-critical):', hubspotError);
    }

    return result;
  } catch (error) {
    console.error('Error sending quote:', error);
    throw error;
  }
};

/**
 * Customer approves quote
 */
export const approveQuote = async (orderId) => {
  try {
    const now = new Date().toISOString();
    const result = await OrderAPI.update(orderId, {
      status: 'approved',
      approvedAt: now,
      updatedAt: now,
    });

    // Update HubSpot deal stage
    try {
      const order = await OrderAPI.get(orderId);
      if (order?.hubspotDealId) {
        await HubSpotAPI.deals.updateStage(
          order.hubspotDealId,
          HubSpotAPI.ORDER_STATUS_TO_STAGE.approved
        );
      }
    } catch (hubspotError) {
      console.warn('HubSpot sync failed (non-critical):', hubspotError);
    }

    return result;
  } catch (error) {
    console.error('Error approving quote:', error);
    throw error;
  }
};

/**
 * Record payment received
 */
export const recordPayment = async (orderId, paymentIntentId) => {
  try {
    const now = new Date().toISOString();
    const result = await OrderAPI.update(orderId, {
      status: 'paid',
      paymentStatus: 'paid',
      paymentIntentId,
      paidAt: now,
      updatedAt: now,
    });

    // Update HubSpot deal stage
    try {
      const order = await OrderAPI.get(orderId);
      if (order?.hubspotDealId) {
        await HubSpotAPI.deals.updateStage(
          order.hubspotDealId,
          HubSpotAPI.ORDER_STATUS_TO_STAGE.paid
        );
      }
    } catch (hubspotError) {
      console.warn('HubSpot sync failed (non-critical):', hubspotError);
    }

    return result;
  } catch (error) {
    console.error('Error recording payment:', error);
    throw error;
  }
};

/**
 * Allocate devices from inventory to order
 */
export const allocateDevicesToOrder = async (orderId, deviceAssignments) => {
  try {
    // deviceAssignments: [{ lineItemId, deviceIds }]
    const order = await OrderAPI.get(orderId);
    if (!order) throw new Error('Order not found');

    // Update line items with device IDs
    const updatedLineItems = order.lineItems.map(item => {
      const assignment = deviceAssignments.find(a => a.lineItemId === item.id);
      if (assignment) {
        return { ...item, deviceIds: assignment.deviceIds };
      }
      return item;
    });

    // Update order
    await OrderAPI.update(orderId, {
      lineItems: updatedLineItems,
      status: 'processing',
      updatedAt: new Date().toISOString(),
    });

    // Update device lifecycle for each allocated device
    const allDeviceIds = deviceAssignments.flatMap(a => a.deviceIds);
    for (const deviceId of allDeviceIds) {
      await DeviceAPI.updateLifecycle(deviceId, 'allocated', {
        orderId,
        allocatedAt: new Date().toISOString(),
      });

      // Also update device with order and site info
      await DeviceAPI.editDevice(deviceId, {
        orderId,
        siteId: order.siteId,
        customerId: order.customerId,
      });
    }

    return { success: true, allocatedDevices: allDeviceIds.length };
  } catch (error) {
    console.error('Error allocating devices to order:', error);
    throw error;
  }
};

/**
 * Mark order as shipped
 */
export const shipOrder = async (orderId, shippingDetails = {}) => {
  try {
    const order = await OrderAPI.get(orderId);
    if (!order) throw new Error('Order not found');

    const now = new Date().toISOString();

    // Update order status
    await OrderAPI.update(orderId, {
      status: 'shipped',
      updatedAt: now,
    });

    // Update all allocated devices to shipped
    const deviceIds = order.lineItems.flatMap(item => item.deviceIds || []);
    for (const deviceId of deviceIds) {
      await DeviceAPI.updateLifecycle(deviceId, 'shipped', {
        shippedAt: now,
        trackingNumber: shippingDetails.trackingNumber,
      });
    }

    return { success: true };
  } catch (error) {
    console.error('Error shipping order:', error);
    throw error;
  }
};

/**
 * Mark order as fulfilled (all devices commissioned)
 */
export const fulfillOrder = async (orderId) => {
  try {
    const now = new Date().toISOString();
    const result = await OrderAPI.update(orderId, {
      status: 'fulfilled',
      fulfilledAt: now,
      updatedAt: now,
    });

    // Update HubSpot deal stage
    try {
      const order = await OrderAPI.get(orderId);
      if (order?.hubspotDealId) {
        await HubSpotAPI.deals.updateStage(
          order.hubspotDealId,
          HubSpotAPI.ORDER_STATUS_TO_STAGE.fulfilled
        );
      }
    } catch (hubspotError) {
      console.warn('HubSpot sync failed (non-critical):', hubspotError);
    }

    return result;
  } catch (error) {
    console.error('Error fulfilling order:', error);
    throw error;
  }
};

/**
 * Cancel an order
 */
export const cancelOrder = async (orderId, reason) => {
  try {
    const order = await OrderAPI.get(orderId);
    if (!order) throw new Error('Order not found');

    // Release any allocated devices back to inventory
    const deviceIds = order.lineItems.flatMap(item => item.deviceIds || []);
    for (const deviceId of deviceIds) {
      await DeviceAPI.updateLifecycle(deviceId, 'inventory', {
        deallocatedAt: new Date().toISOString(),
        deallocatedReason: reason,
      });
      await DeviceAPI.editDevice(deviceId, {
        orderId: null,
        siteId: null,
        customerId: null,
      });
    }

    // Update order
    const result = await OrderAPI.cancel(orderId, reason);

    // Update HubSpot
    try {
      if (order.hubspotDealId) {
        await HubSpotAPI.deals.updateStage(
          order.hubspotDealId,
          HubSpotAPI.ORDER_STATUS_TO_STAGE.cancelled
        );
      }
    } catch (hubspotError) {
      console.warn('HubSpot sync failed (non-critical):', hubspotError);
    }

    return result;
  } catch (error) {
    console.error('Error cancelling order:', error);
    throw error;
  }
};

/**
 * Get order with full details (customer, site, devices)
 */
export const getOrderWithDetails = async (orderId) => {
  try {
    const order = await OrderAPI.get(orderId);
    if (!order) return null;

    // Fetch related entities
    const [customer, site, devices] = await Promise.all([
      order.customerId ? CustomerAPI.get(order.customerId) : null,
      order.siteId ? SiteAPI.get(order.siteId) : null,
      DeviceAPI.getByOrder(orderId),
    ]);

    return {
      ...order,
      customer,
      site,
      devices: devices || [],
    };
  } catch (error) {
    console.error('Error fetching order with details:', error);
    throw error;
  }
};

/**
 * Check if all devices in an order are commissioned
 */
export const checkOrderFulfillmentStatus = async (orderId) => {
  try {
    const devices = await DeviceAPI.getByOrder(orderId);
    if (!devices || devices.length === 0) {
      return { fulfilled: false, pending: 0, commissioned: 0 };
    }

    const commissioned = devices.filter(d => d.lifecycle === 'commissioned' || d.lifecycle === 'active');
    const pending = devices.length - commissioned.length;

    return {
      fulfilled: pending === 0,
      pending,
      commissioned: commissioned.length,
      total: devices.length,
    };
  } catch (error) {
    console.error('Error checking order fulfillment:', error);
    throw error;
  }
};

// Export service
const orderService = {
  createQuote,
  updateQuote,
  sendQuote,
  approveQuote,
  recordPayment,
  allocateDevicesToOrder,
  shipOrder,
  fulfillOrder,
  cancelOrder,
  getOrderWithDetails,
  checkOrderFulfillmentStatus,
  // Utilities
  calculateOrderTotals,
  getProductBySku,
  generateOrderId,
};

export default orderService;
