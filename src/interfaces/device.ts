// Device entity for the commercial pipeline
// Represents BlueSignal hardware devices with lifecycle tracking

export interface Device {
  id: string; // Format: pgw-XXXX
  sku: string;
  name: string;
  alias?: string;
  serialNumber: string;

  // Ownership and assignment
  orderId?: string;
  customerId?: string;
  siteId?: string;
  siteName?: string;
  assignedInstallerId?: string;

  // Lifecycle state machine
  lifecycle: DeviceLifecycle;
  commissionStatus: DeviceCommissionStatus;

  // Timestamps for lifecycle transitions
  createdAt: string; // ISO8601
  updatedAt: string; // ISO8601
  allocatedAt?: string; // ISO8601
  shippedAt?: string; // ISO8601
  deliveredAt?: string; // ISO8601
  installedAt?: string; // ISO8601
  commissionedAt?: string; // ISO8601
  commissionedBy?: string; // Installer UID
  activatedAt?: string; // ISO8601
  decommissionedAt?: string; // ISO8601

  // Commission results
  lastCommissionId?: string;
  lastCommissionResult?: CommissionResult;

  // Device status (runtime)
  status: DeviceStatus;
  lastContact?: string; // ISO8601

  // Device configuration
  deviceType: DeviceType;
  firmwareVersion?: string;
  hardwareRevision?: string;

  // Hardware details
  gatewayId?: string;
  gatewayWebUrl?: string;
  gatewayIp?: string;
  simIccid?: string;
  macAddress?: string;

  // Telemetry
  batteryLevel?: number; // 0-100
  signalStrength?: number; // dBm
  coordinates?: DeviceCoordinates;

  // Latest sensor readings
  latestReadings?: DeviceReadings;
}

export type DeviceLifecycle =
  | 'inventory'      // Device created/received, in warehouse
  | 'allocated'      // Linked to an order
  | 'shipped'        // In transit to site
  | 'delivered'      // On-site, awaiting installation
  | 'installed'      // Physically installed, not tested
  | 'commissioned'   // Tests passed, pending activation
  | 'active'         // Operational, sending data
  | 'maintenance'    // Temporarily offline for service
  | 'decommissioned'; // Removed from service

export type DeviceCommissionStatus =
  | 'pending'     // Not yet commissioned
  | 'in_progress' // Commission workflow started
  | 'passed'      // All tests passed
  | 'failed';     // One or more tests failed

export type DeviceStatus =
  | 'online'  // Receiving data
  | 'warning' // Partial connectivity or alerts
  | 'offline'; // No recent contact

export type DeviceType =
  | 'shore-ac'
  | 'shore-solar'
  | 'shore-monitor'
  | 'smart-buoy'
  | 'smart-buoy-xl';

export interface DeviceCoordinates {
  lat: number;
  lng: number;
}

export interface DeviceReadings {
  timestamp?: string; // ISO8601
  temp_c?: number;
  ph?: number;
  ntu?: number; // Turbidity
  tds_ppm?: number;
  do_mgl?: number; // Dissolved oxygen
  orp_mv?: number;
  npk_n?: number;
  npk_p?: number;
  npk_k?: number;
  chlorophyll_a?: number;
  phycocyanin?: number;
}

// Commission test result shapes
export interface CommissionResult {
  commissionId: string;
  deviceId: string;
  startedAt: string; // ISO8601
  completedAt: string; // ISO8601
  status: 'passed' | 'failed';
  tests: CommissionTest[];
  overallScore?: number; // 0-100
}

export interface CommissionTest {
  id: CommissionTestId;
  name: string;
  status: CommissionTestStatus;
  duration: number; // milliseconds
  details?: string;
  expectedValue?: string;
  actualValue?: string;
}

export type CommissionTestId =
  | 'power_os'       // Power & OS boot
  | 'ads1115'        // ADS1115 ADC detection
  | 'ds18b20'        // DS18B20 temperature sensor
  | 'ph_ntu'         // pH/Turbidity sensors
  | 'npk'            // NPK Modbus (soil probes only)
  | 'relay_ch1'      // Relay channel 1
  | 'relay_ch2'      // Relay channel 2
  | 'lte_wifi'       // Cellular/WiFi connectivity
  | 'cloud_ingest'   // Cloud data upload test
  | 'gps'            // GPS position lock
  | 'ultrasonic'     // Ultrasonic transducer test
  | 'solar_mppt'     // Solar MPPT charging
  | 'battery_voltage'; // Battery voltage check

export type CommissionTestStatus =
  | 'pending'
  | 'running'
  | 'passed'
  | 'failed'
  | 'skipped';

// Device API payload types
export interface DeviceCreatePayload {
  sku: string;
  serialNumber: string;
  name?: string;
  deviceType: DeviceType;
  firmwareVersion?: string;
  hardwareRevision?: string;
}

export interface DeviceUpdatePayload {
  name?: string;
  alias?: string;
  orderId?: string;
  customerId?: string;
  siteId?: string;
  siteName?: string;
  assignedInstallerId?: string;
  lifecycle?: DeviceLifecycle;
  commissionStatus?: DeviceCommissionStatus;
  status?: DeviceStatus;
  firmwareVersion?: string;
  gatewayId?: string;
  gatewayWebUrl?: string;
  gatewayIp?: string;
  simIccid?: string;
  macAddress?: string;
  coordinates?: DeviceCoordinates;
}

export interface DeviceLifecycleUpdatePayload {
  deviceId: string;
  lifecycle: DeviceLifecycle;
  metadata?: {
    installedBy?: string;
    shippingTrackingNumber?: string;
    deliveryConfirmedBy?: string;
    notes?: string;
  };
}

export interface DeviceInventoryFilters {
  lifecycle?: DeviceLifecycle | DeviceLifecycle[];
  commissionStatus?: DeviceCommissionStatus;
  deviceType?: DeviceType;
  sku?: string;
  customerId?: string;
  siteId?: string;
  orderId?: string;
  assignedInstallerId?: string;
  search?: string;
  limit?: number;
  offset?: number;
}

export interface DeviceAssignmentPayload {
  deviceId: string;
  orderId: string;
}

export interface DeviceInstallerAssignmentPayload {
  deviceId: string;
  installerId: string;
}
