// Paste content here
// src/interfaces/commercial.ts
// BlueSignal Commercial Pipeline Type Definitions

/* -------------------------------------------------------------------------- */
/*                                  CUSTOMER                                  */
/* -------------------------------------------------------------------------- */

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  type: CustomerType;
  hubspotContactId?: string;
  siteIds: string[];
  deviceCount: number;
  createdAt: string; // ISO8601
  updatedAt: string;
  createdBy: string; // uid of creator
  notes?: string;
}

export type CustomerType = 'residential' | 'commercial' | 'municipal' | 'agricultural';

export interface CustomerCreatePayload {
  name: string;
  email: string;
  phone: string;
  company?: string;
  type: CustomerType;
  notes?: string;
}

/* -------------------------------------------------------------------------- */
/*                                    SITE                                    */
/* -------------------------------------------------------------------------- */

export interface Site {
  id: string;
  customerId: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  coordinates: Coordinates;
  type: SiteType;
  waterBodyType?: WaterBodyType;
  surfaceArea?: number; // acres
  deviceIds: string[];
  createdAt: string;
  updatedAt: string;
  notes?: string;
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export type SiteType = 'pond' | 'lake' | 'reservoir' | 'farm' | 'marina' | 'municipal' | 'industrial' | 'other';

export type WaterBodyType = 'freshwater' | 'brackish' | 'saltwater' | 'wastewater';

export interface SiteCreatePayload {
  customerId: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  coordinates: Coordinates;
  type: SiteType;
  waterBodyType?: WaterBodyType;
  surfaceArea?: number;
  notes?: string;
}

/* -------------------------------------------------------------------------- */
/*                                   ORDER                                    */
/* -------------------------------------------------------------------------- */

export interface Order {
  id: string;
  customerId: string;
  siteId: string;
  hubspotDealId?: string;
  status: OrderStatus;
  lineItems: OrderLineItem[];
  subtotal: number;
  tax: number;
  total: number;
  paymentIntentId?: string; // Stripe
  paymentStatus: PaymentStatus;
  deviceIds: string[]; // Allocated devices
  createdBy: string; // uid
  createdAt: string;
  updatedAt: string;
  quotedAt?: string;
  approvedAt?: string;
  paidAt?: string;
  fulfilledAt?: string;
  notes?: string;
}

export type OrderStatus = 'draft' | 'quoted' | 'approved' | 'paid' | 'fulfilled' | 'cancelled';

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface OrderLineItem {
  sku: string;
  name: string;
  qty: number;
  unitPrice: number;
  totalPrice: number;
}

export interface OrderCreatePayload {
  customerId: string;
  siteId: string;
  lineItems: OrderLineItem[];
  notes?: string;
}

export interface OrderUpdatePayload {
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  paymentIntentId?: string;
  hubspotDealId?: string;
  deviceIds?: string[];
  notes?: string;
}

/* -------------------------------------------------------------------------- */
/*                                   DEVICE                                   */
/* -------------------------------------------------------------------------- */

export interface Device {
  id: string; // Format: pgw-XXXX
  sku: string;
  serialNumber: string;
  name?: string;
  alias?: string;
  deviceType: DeviceType;
  
  // Relationships
  orderId?: string;
  customerId?: string;
  siteId?: string;
  assignedInstallerId?: string;
  
  // Lifecycle
  lifecycle: DeviceLifecycle;
  commissionStatus: CommissionStatus;
  commissionedAt?: string;
  commissionedBy?: string; // installer uid
  lastCommissionId?: string;
  
  // Shipping
  shippedAt?: string;
  deliveredAt?: string;
  trackingNumber?: string;
  
  // Installation
  installedAt?: string;
  activatedAt?: string;
  
  // Device Info
  firmwareVersion?: string;
  coordinates?: Coordinates;
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
  
  // Metadata
  notes?: string;
}

export type DeviceType = 
  | 'Water Quality Buoy'
  | 'Soil NPK Probe'
  | 'Ultrasonic Algae Control'
  | 'LoRaWAN Gateway'
  | 'Shore Monitor AC'
  | 'Shore Monitor Solar'
  | 'Shore Monitor Lite'
  | 'Smart Buoy'
  | 'Smart Buoy XL';

export type DeviceLifecycle = 
  | 'inventory'      // In warehouse
  | 'allocated'      // Assigned to order
  | 'shipped'        // In transit
  | 'delivered'      // On-site, awaiting install
  | 'installed'      // Physically installed, not tested
  | 'commissioned'   // Tests passed, pending activation
  | 'active'         // Operational, sending data
  | 'maintenance'    // Temporarily offline for service
  | 'decommissioned'; // Retired

export type CommissionStatus = 'pending' | 'in_progress' | 'passed' | 'failed';

export interface DeviceCreatePayload {
  sku: string;
  serialNumber: string;
  deviceType: DeviceType;
  name?: string;
  notes?: string;
}

export interface DeviceUpdatePayload {
  lifecycle?: DeviceLifecycle;
  commissionStatus?: CommissionStatus;
  orderId?: string;
  customerId?: string;
  siteId?: string;
  assignedInstallerId?: string;
  firmwareVersion?: string;
  coordinates?: Coordinates;
  notes?: string;
}

/* -------------------------------------------------------------------------- */
/*                                COMMISSION                                  */
/* -------------------------------------------------------------------------- */

export interface Commission {
  id: string;
  deviceId: string;
  orderId: string;
  siteId: string;
  installerId: string;
  installerName: string;
  
  // Status
  status: CommissionStatus;
  startedAt?: string;
  completedAt?: string;
  
  // Checklist
  checklistType: ChecklistType;
  preDeploymentChecks: ChecklistItem[];
  commissioningChecks: ChecklistItem[];
  
  // Test Results
  testResults: CommissionTest[];
  
  // Documentation
  photos: CommissionPhoto[];
  signature?: CommissionSignature;
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
  
  notes?: string;
}

export type ChecklistType = 'shore' | 'buoy';

export interface ChecklistItem {
  id: string;
  text: string;
  category: string;
  completed: boolean;
  completedAt?: string;
}

export interface CommissionTest {
  id: CommissionTestId;
  name: string;
  status: TestStatus;
  duration: number; // ms
  details?: string;
}

export type CommissionTestId = 
  | 'power_os'
  | 'ads1115'
  | 'ds18b20'
  | 'ph_ntu'
  | 'npk'
  | 'relay_ch1'
  | 'relay_ch2'
  | 'lte_wifi'
  | 'cloud_ingest';

export type TestStatus = 'pending' | 'running' | 'passed' | 'failed' | 'skipped';

export interface CommissionPhoto {
  url: string;
  caption?: string;
  uploadedAt: string;
}

export interface CommissionSignature {
  name: string;
  timestamp: string;
  dataUrl: string; // Base64 signature image
}

export interface CommissionCreatePayload {
  deviceId: string;
  orderId: string;
  siteId: string;
  checklistType: ChecklistType;
}

export interface CommissionUpdatePayload {
  status?: CommissionStatus;
  preDeploymentChecks?: ChecklistItem[];
  commissioningChecks?: ChecklistItem[];
  testResults?: CommissionTest[];
  photos?: CommissionPhoto[];
  signature?: CommissionSignature;
  notes?: string;
}

/* -------------------------------------------------------------------------- */
/*                               HUBSPOT SYNC                                 */
/* -------------------------------------------------------------------------- */

export interface HubSpotSyncRecord {
  id: string;
  entityType: 'deal' | 'contact';
  entityId: string; // Firebase ID
  hubspotId: string;
  lastSyncAt: string;
  syncStatus: 'success' | 'failed';
  syncDirection: 'outbound' | 'inbound';
  errorMessage?: string;
}

/* -------------------------------------------------------------------------- */
/*                                  HELPERS                                   */
/* -------------------------------------------------------------------------- */

// Type guard for checking device lifecycle transitions
export const VALID_LIFECYCLE_TRANSITIONS: Record<DeviceLifecycle, DeviceLifecycle[]> = {
  inventory: ['allocated'],
  allocated: ['shipped', 'inventory'], // Can return to inventory if order cancelled
  shipped: ['delivered'],
  delivered: ['installed'],
  installed: ['commissioned'],
  commissioned: ['active'],
  active: ['maintenance', 'decommissioned'],
  maintenance: ['active', 'decommissioned'],
  decommissioned: [], // Terminal state
};

export function canTransitionLifecycle(from: DeviceLifecycle, to: DeviceLifecycle): boolean {
  return VALID_LIFECYCLE_TRANSITIONS[from]?.includes(to) ?? false;
}

// Order status to HubSpot deal stage mapping
export const ORDER_STATUS_TO_HUBSPOT_STAGE: Record<OrderStatus, string> = {
  draft: 'Lead',
  quoted: 'Quoted',
  approved: 'Qualified',
  paid: 'Closed Won',
  fulfilled: 'Fulfilled',
  cancelled: 'Closed Lost',
};