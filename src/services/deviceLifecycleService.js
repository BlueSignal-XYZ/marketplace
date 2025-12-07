/**
 * Device Lifecycle Service
 *
 * Business logic for device lifecycle state management:
 * - State transitions
 * - Inventory management
 * - Device binding to orders/sites/customers
 */

import { DeviceAPI, OrderAPI, SiteAPI, CustomerAPI } from '../scripts/back_door';
import HubSpotAPI from '../apis/hubspot';

// Valid lifecycle state transitions
const LIFECYCLE_TRANSITIONS = {
  inventory: ['allocated'],
  allocated: ['shipped', 'inventory'], // Can go back to inventory if order cancelled
  shipped: ['delivered'],
  delivered: ['installed'],
  installed: ['commissioned', 'delivered'], // Can retry if commission fails
  commissioned: ['active'],
  active: ['maintenance', 'decommissioned'],
  maintenance: ['active', 'decommissioned'],
  decommissioned: ['inventory'], // Can be refurbished
};

// Generate unique device ID
const generateDeviceId = () => {
  const num = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `pgw-${num}`;
};

/**
 * Validate a lifecycle state transition
 */
export const validateTransition = (currentState, newState) => {
  const validNextStates = LIFECYCLE_TRANSITIONS[currentState] || [];
  return validNextStates.includes(newState);
};

/**
 * Create a new device in inventory
 */
export const createDevice = async (deviceData) => {
  try {
    const deviceId = deviceData.id || generateDeviceId();
    const now = new Date().toISOString();

    const device = {
      id: deviceId,
      sku: deviceData.sku,
      name: deviceData.name || `Device ${deviceId}`,
      serialNumber: deviceData.serialNumber,
      deviceType: deviceData.deviceType,
      lifecycle: 'inventory',
      commissionStatus: 'pending',
      status: 'offline',
      firmwareVersion: deviceData.firmwareVersion || '',
      hardwareRevision: deviceData.hardwareRevision || '',
      createdAt: now,
      updatedAt: now,
    };

    const result = await DeviceAPI.addDevice(device);
    return result;
  } catch (error) {
    console.error('Error creating device:', error);
    throw error;
  }
};

/**
 * Transition device to new lifecycle state
 */
export const transitionLifecycle = async (deviceId, newState, metadata = {}) => {
  try {
    const device = await DeviceAPI.getDeviceDetails(deviceId);
    if (!device) throw new Error('Device not found');

    if (!validateTransition(device.lifecycle, newState)) {
      throw new Error(
        `Invalid transition from ${device.lifecycle} to ${newState}`
      );
    }

    const now = new Date().toISOString();
    const timestampField = `${newState}At`;

    await DeviceAPI.updateLifecycle(deviceId, newState, {
      ...metadata,
      [timestampField]: now,
    });

    await DeviceAPI.editDevice(deviceId, {
      lifecycle: newState,
      updatedAt: now,
    });

    return { success: true, previousState: device.lifecycle, newState };
  } catch (error) {
    console.error('Error transitioning device lifecycle:', error);
    throw error;
  }
};

/**
 * Allocate device to an order
 */
export const allocateToOrder = async (deviceId, orderId) => {
  try {
    const device = await DeviceAPI.getDeviceDetails(deviceId);
    if (!device) throw new Error('Device not found');

    if (device.lifecycle !== 'inventory') {
      throw new Error('Device must be in inventory to allocate');
    }

    const order = await OrderAPI.get(orderId);
    if (!order) throw new Error('Order not found');

    const now = new Date().toISOString();

    // Update device
    await DeviceAPI.updateLifecycle(deviceId, 'allocated', {
      allocatedAt: now,
    });

    await DeviceAPI.editDevice(deviceId, {
      orderId,
      customerId: order.customerId,
      siteId: order.siteId,
      lifecycle: 'allocated',
      updatedAt: now,
    });

    return { success: true };
  } catch (error) {
    console.error('Error allocating device to order:', error);
    throw error;
  }
};

/**
 * Deallocate device back to inventory
 */
export const deallocate = async (deviceId, reason = '') => {
  try {
    const device = await DeviceAPI.getDeviceDetails(deviceId);
    if (!device) throw new Error('Device not found');

    if (device.lifecycle !== 'allocated') {
      throw new Error('Only allocated devices can be deallocated');
    }

    const now = new Date().toISOString();

    await DeviceAPI.updateLifecycle(deviceId, 'inventory', {
      deallocatedAt: now,
      deallocatedReason: reason,
    });

    await DeviceAPI.editDevice(deviceId, {
      orderId: null,
      customerId: null,
      siteId: null,
      siteName: null,
      lifecycle: 'inventory',
      updatedAt: now,
    });

    return { success: true };
  } catch (error) {
    console.error('Error deallocating device:', error);
    throw error;
  }
};

/**
 * Mark device as shipped
 */
export const markShipped = async (deviceId, shippingDetails = {}) => {
  try {
    return await transitionLifecycle(deviceId, 'shipped', {
      trackingNumber: shippingDetails.trackingNumber,
      carrier: shippingDetails.carrier,
      shippedBy: shippingDetails.shippedBy,
    });
  } catch (error) {
    console.error('Error marking device as shipped:', error);
    throw error;
  }
};

/**
 * Mark device as delivered
 */
export const markDelivered = async (deviceId, deliveryDetails = {}) => {
  try {
    return await transitionLifecycle(deviceId, 'delivered', {
      deliveredBy: deliveryDetails.confirmedBy,
      deliveryNotes: deliveryDetails.notes,
    });
  } catch (error) {
    console.error('Error marking device as delivered:', error);
    throw error;
  }
};

/**
 * Mark device as installed (physically mounted)
 */
export const markInstalled = async (deviceId, installerId) => {
  try {
    return await transitionLifecycle(deviceId, 'installed', {
      installedBy: installerId,
    });
  } catch (error) {
    console.error('Error marking device as installed:', error);
    throw error;
  }
};

/**
 * Mark device as commissioned
 */
export const markCommissioned = async (deviceId, commissionResult) => {
  try {
    await transitionLifecycle(deviceId, 'commissioned', {
      commissionedBy: commissionResult.installerId,
    });

    await DeviceAPI.editDevice(deviceId, {
      commissionStatus: 'passed',
      lastCommissionResult: commissionResult,
    });

    return { success: true };
  } catch (error) {
    console.error('Error marking device as commissioned:', error);
    throw error;
  }
};

/**
 * Activate device for customer
 */
export const activate = async (deviceId, customerId = null) => {
  try {
    const device = await DeviceAPI.getDeviceDetails(deviceId);
    if (!device) throw new Error('Device not found');

    if (device.lifecycle !== 'commissioned') {
      throw new Error('Device must be commissioned before activation');
    }

    const now = new Date().toISOString();

    await transitionLifecycle(deviceId, 'active', {});

    await DeviceAPI.editDevice(deviceId, {
      customerId: customerId || device.customerId,
      status: 'online',
      updatedAt: now,
    });

    // Sync to HubSpot
    try {
      const updatedDevice = await DeviceAPI.getDeviceDetails(deviceId);
      if (updatedDevice.orderId) {
        const order = await OrderAPI.get(updatedDevice.orderId);
        if (order?.hubspotDealId) {
          await HubSpotAPI.sync.syncDevice(updatedDevice, order.hubspotDealId);
        }
      }
    } catch (hubspotError) {
      console.warn('HubSpot sync failed (non-critical):', hubspotError);
    }

    return { success: true };
  } catch (error) {
    console.error('Error activating device:', error);
    throw error;
  }
};

/**
 * Put device into maintenance mode
 */
export const setMaintenance = async (deviceId, reason = '') => {
  try {
    const device = await DeviceAPI.getDeviceDetails(deviceId);
    if (!device) throw new Error('Device not found');

    if (device.lifecycle !== 'active') {
      throw new Error('Only active devices can be put into maintenance');
    }

    await transitionLifecycle(deviceId, 'maintenance', {
      maintenanceReason: reason,
    });

    await DeviceAPI.editDevice(deviceId, {
      status: 'offline',
    });

    return { success: true };
  } catch (error) {
    console.error('Error setting device to maintenance:', error);
    throw error;
  }
};

/**
 * Restore device from maintenance
 */
export const restoreFromMaintenance = async (deviceId) => {
  try {
    const device = await DeviceAPI.getDeviceDetails(deviceId);
    if (!device) throw new Error('Device not found');

    if (device.lifecycle !== 'maintenance') {
      throw new Error('Device is not in maintenance');
    }

    await transitionLifecycle(deviceId, 'active', {
      restoredAt: new Date().toISOString(),
    });

    await DeviceAPI.editDevice(deviceId, {
      status: 'online',
    });

    return { success: true };
  } catch (error) {
    console.error('Error restoring device from maintenance:', error);
    throw error;
  }
};

/**
 * Decommission a device
 */
export const decommission = async (deviceId, reason = '') => {
  try {
    const device = await DeviceAPI.getDeviceDetails(deviceId);
    if (!device) throw new Error('Device not found');

    if (!['active', 'maintenance'].includes(device.lifecycle)) {
      throw new Error('Only active or maintenance devices can be decommissioned');
    }

    await transitionLifecycle(deviceId, 'decommissioned', {
      decommissionReason: reason,
    });

    await DeviceAPI.editDevice(deviceId, {
      status: 'offline',
    });

    return { success: true };
  } catch (error) {
    console.error('Error decommissioning device:', error);
    throw error;
  }
};

/**
 * Return device to inventory (refurbished)
 */
export const returnToInventory = async (deviceId, refurbNotes = '') => {
  try {
    const device = await DeviceAPI.getDeviceDetails(deviceId);
    if (!device) throw new Error('Device not found');

    if (device.lifecycle !== 'decommissioned') {
      throw new Error('Only decommissioned devices can be returned to inventory');
    }

    const now = new Date().toISOString();

    await transitionLifecycle(deviceId, 'inventory', {
      refurbishedAt: now,
      refurbNotes,
    });

    // Clear all associations
    await DeviceAPI.editDevice(deviceId, {
      orderId: null,
      customerId: null,
      siteId: null,
      siteName: null,
      assignedInstallerId: null,
      commissionStatus: 'pending',
      lastCommissionId: null,
      lastCommissionResult: null,
      status: 'offline',
      updatedAt: now,
    });

    return { success: true };
  } catch (error) {
    console.error('Error returning device to inventory:', error);
    throw error;
  }
};

/**
 * Get device inventory summary
 */
export const getInventorySummary = async () => {
  try {
    const devices = await DeviceAPI.getDevices();
    if (!devices) return { total: 0, byLifecycle: {}, bySku: {} };

    const byLifecycle = {};
    const bySku = {};

    for (const device of devices) {
      // Count by lifecycle
      byLifecycle[device.lifecycle] = (byLifecycle[device.lifecycle] || 0) + 1;

      // Count by SKU
      if (!bySku[device.sku]) {
        bySku[device.sku] = { total: 0, inventory: 0, allocated: 0, active: 0 };
      }
      bySku[device.sku].total++;
      if (device.lifecycle === 'inventory') bySku[device.sku].inventory++;
      if (device.lifecycle === 'allocated') bySku[device.sku].allocated++;
      if (device.lifecycle === 'active') bySku[device.sku].active++;
    }

    return {
      total: devices.length,
      byLifecycle,
      bySku,
      availableForAllocation: byLifecycle.inventory || 0,
    };
  } catch (error) {
    console.error('Error getting inventory summary:', error);
    throw error;
  }
};

/**
 * Get available devices for allocation (in inventory)
 */
export const getAvailableDevices = async (sku = null) => {
  try {
    const filters = {
      lifecycle: 'inventory',
    };
    if (sku) filters.sku = sku;

    return await DeviceAPI.getInventory(filters);
  } catch (error) {
    console.error('Error getting available devices:', error);
    throw error;
  }
};

/**
 * Assign installer to device
 */
export const assignInstaller = async (deviceId, installerId) => {
  try {
    await DeviceAPI.assignInstaller(deviceId, installerId);

    await DeviceAPI.editDevice(deviceId, {
      assignedInstallerId: installerId,
      updatedAt: new Date().toISOString(),
    });

    return { success: true };
  } catch (error) {
    console.error('Error assigning installer to device:', error);
    throw error;
  }
};

/**
 * Get devices assigned to an installer
 */
export const getInstallerDevices = async (installerId) => {
  try {
    return await DeviceAPI.getByInstaller(installerId);
  } catch (error) {
    console.error('Error getting installer devices:', error);
    throw error;
  }
};

/**
 * Bulk update device lifecycle
 */
export const bulkTransition = async (deviceIds, newState, metadata = {}) => {
  try {
    const results = [];

    for (const deviceId of deviceIds) {
      try {
        const result = await transitionLifecycle(deviceId, newState, metadata);
        results.push({ deviceId, success: true, ...result });
      } catch (error) {
        results.push({ deviceId, success: false, error: error.message });
      }
    }

    const successCount = results.filter(r => r.success).length;
    const failureCount = results.filter(r => !r.success).length;

    return {
      results,
      summary: {
        total: deviceIds.length,
        success: successCount,
        failed: failureCount,
      },
    };
  } catch (error) {
    console.error('Error in bulk transition:', error);
    throw error;
  }
};

// Export service
const deviceLifecycleService = {
  createDevice,
  transitionLifecycle,
  validateTransition,
  allocateToOrder,
  deallocate,
  markShipped,
  markDelivered,
  markInstalled,
  markCommissioned,
  activate,
  setMaintenance,
  restoreFromMaintenance,
  decommission,
  returnToInventory,
  getInventorySummary,
  getAvailableDevices,
  assignInstaller,
  getInstallerDevices,
  bulkTransition,
  // Constants
  LIFECYCLE_TRANSITIONS,
  generateDeviceId,
};

export default deviceLifecycleService;
