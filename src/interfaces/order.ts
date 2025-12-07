// Order entity for the commercial pipeline
// Represents quotes and orders for BlueSignal devices

export interface Order {
  id: string;
  customerId: string;
  siteId: string;
  hubspotDealId?: string;
  status: OrderStatus;
  lineItems: OrderLineItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  paymentIntentId?: string; // Stripe
  paymentStatus: PaymentStatus;
  createdBy: string; // User UID
  assignedTo?: string; // Sales rep UID
  notes?: string;
  createdAt: string; // ISO8601
  updatedAt: string; // ISO8601
  quotedAt?: string; // ISO8601
  approvedAt?: string; // ISO8601
  paidAt?: string; // ISO8601
  fulfilledAt?: string; // ISO8601
}

export type OrderStatus =
  | 'draft'      // Initial creation, can be edited
  | 'quoted'     // Quote sent to customer
  | 'approved'   // Customer approved quote
  | 'paid'       // Payment received
  | 'processing' // Order being prepared
  | 'shipped'    // Devices shipped
  | 'fulfilled'  // All devices delivered and commissioned
  | 'cancelled'; // Order cancelled

export type PaymentStatus =
  | 'pending'
  | 'paid'
  | 'partial'
  | 'failed'
  | 'refunded';

export interface OrderLineItem {
  id: string;
  sku: string;
  name: string;
  description?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  deviceIds?: string[]; // Allocated device IDs after order approval
}

export interface OrderCreatePayload {
  customerId: string;
  siteId: string;
  lineItems: OrderLineItemInput[];
  notes?: string;
  assignedTo?: string;
}

export interface OrderLineItemInput {
  sku: string;
  quantity: number;
  unitPrice?: number; // Override price (for discounts)
}

export interface OrderUpdatePayload {
  customerId?: string;
  siteId?: string;
  status?: OrderStatus;
  lineItems?: OrderLineItemInput[];
  paymentStatus?: PaymentStatus;
  paymentIntentId?: string;
  hubspotDealId?: string;
  notes?: string;
  assignedTo?: string;
}

export interface OrderListFilters {
  customerId?: string;
  siteId?: string;
  status?: OrderStatus | OrderStatus[];
  paymentStatus?: PaymentStatus;
  createdBy?: string;
  assignedTo?: string;
  dateFrom?: string; // ISO8601
  dateTo?: string; // ISO8601
  search?: string;
  limit?: number;
  offset?: number;
}

export interface OrderAllocationPayload {
  orderId: string;
  deviceIds: string[];
}

// Quote-specific types for the configurator
export interface QuoteData {
  customerId?: string;
  siteId?: string;
  lineItems: QuoteLineItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  validUntil?: string; // ISO8601
  notes?: string;
}

export interface QuoteLineItem {
  sku: string;
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}
