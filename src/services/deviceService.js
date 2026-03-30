// /src/services/deviceService.js
// Firebase device operations for BlueSignal Cloud
//
// Provides device CRUD operations with Firebase Realtime Database
// Used for device registration, inventory management, and lifecycle updates

import { ref, get, set, query, orderByChild, limitToLast, push, update } from "firebase/database";
import { db } from "../apis/firebase";
import PRODUCTS from "../components/BlueSignalConfigurator/data/products";

/* -------------------------------------------------------------------------- */
/*                                 CONSTANTS                                  */
/* -------------------------------------------------------------------------- */

// Serial number prefix
const SERIAL_PREFIX = "pgw-";

// SKU to deviceType mapping
const SKU_TO_DEVICE_TYPE = {
  "WQM-S-AC": "shore_monitor",
  "WQM-S-SOL": "shore_monitor",
  "WQM-S-MON": "shore_monitor",
  "BS-BUOY-01": "buoy",
  "BS-BUOY-XL": "buoy_xl",
};

// Get product details by SKU
export const getProductBySku = (sku) => {
  const product = Object.values(PRODUCTS).find((p) => p.sku === sku);
  return product || null;
};

// Get all available products for dropdown
export const getAvailableProducts = () => {
  return Object.values(PRODUCTS).map((p) => ({
    sku: p.sku,
    name: p.name,
    price: p.price,
  }));
};

/* -------------------------------------------------------------------------- */
/*                            SERIAL NUMBER UTILS                             */
/* -------------------------------------------------------------------------- */

/**
 * Parse serial number to extract the numeric portion
 * @param {string} serialNumber - e.g., "pgw-0011"
 * @returns {number} - e.g., 11
 */
const parseSerialNumber = (serialNumber) => {
  if (!serialNumber || !serialNumber.startsWith(SERIAL_PREFIX)) {
    return 0;
  }
  const numPart = serialNumber.replace(SERIAL_PREFIX, "");
  return parseInt(numPart, 10) || 0;
};

/**
 * Format serial number with 4-digit padding
 * @param {number} num - The number to format
 * @param {string} prefix - Optional prefix override (default: "pgw-")
 * @returns {string} - e.g., "pgw-0011"
 */
const formatSerialNumber = (num, prefix = SERIAL_PREFIX) => {
  return `${prefix}${String(num).padStart(4, "0")}`;
};

/**
 * Get the next available serial number by querying existing devices
 * @returns {Promise<string>} - Next serial number (e.g., "pgw-0011")
 */
export const getNextSerialNumber = async () => {
  try {
    const devicesRef = ref(db, "devices");
    const snapshot = await get(devicesRef);

    if (!snapshot.exists()) {
      // No devices exist, start at 0001
      return formatSerialNumber(1);
    }

    const devices = snapshot.val();
    let highestNum = 0;

    // Find the highest serial number
    Object.values(devices).forEach((device) => {
      const serialNum = parseSerialNumber(device?.serialNumber || device?.id || "");
      if (serialNum > highestNum) {
        highestNum = serialNum;
      }
    });

    return formatSerialNumber(highestNum + 1);
  } catch (error) {
    console.error("Error getting next serial number:", error);
    throw error;
  }
};

/**
 * Get a batch of sequential serial numbers
 * @param {number} count - Number of serial numbers needed
 * @param {string} prefix - Optional prefix override
 * @returns {Promise<string[]>} - Array of serial numbers
 */
export const getNextSerialNumbers = async (count, prefix = SERIAL_PREFIX) => {
  try {
    const devicesRef = ref(db, "devices");
    const snapshot = await get(devicesRef);

    let highestNum = 0;

    if (snapshot.exists()) {
      const devices = snapshot.val();
      Object.values(devices).forEach((device) => {
        const serialNum = parseSerialNumber(device?.serialNumber || device?.id || "");
        if (serialNum > highestNum) {
          highestNum = serialNum;
        }
      });
    }

    // Generate sequential serial numbers
    const serials = [];
    for (let i = 1; i <= count; i++) {
      serials.push(formatSerialNumber(highestNum + i, prefix));
    }

    return serials;
  } catch (error) {
    console.error("Error getting next serial numbers:", error);
    throw error;
  }
};

/* -------------------------------------------------------------------------- */
/*                              DEVICE OPERATIONS                             */
/* -------------------------------------------------------------------------- */

/**
 * Create a single device in Firebase
 * @param {Object} deviceData - Device data to create
 * @returns {Promise<Object>} - Created device
 */
export const createDevice = async (deviceData) => {
  try {
    const deviceRef = ref(db, `devices/${deviceData.id}`);
    await set(deviceRef, deviceData);
    console.log(`Device created: ${deviceData.id}`);
    return deviceData;
  } catch (error) {
    console.error("Error creating device:", error);
    throw error;
  }
};

/**
 * Create multiple devices in batch
 * @param {string} sku - Product SKU
 * @param {number} quantity - Number of devices to create (1-50)
 * @param {string} createdBy - UID of user creating devices
 * @param {Object} options - Optional configuration
 * @param {string} options.serialPrefix - Override serial prefix
 * @param {string} options.notes - Notes for all devices
 * @returns {Promise<Object>} - Result with created devices
 */
export const createDeviceBatch = async (sku, quantity, createdBy, options = {}) => {
  const { serialPrefix = SERIAL_PREFIX, notes = "" } = options;

  // Validate inputs
  if (!sku) {
    throw new Error("SKU is required");
  }
  if (!quantity || quantity < 1 || quantity > 50) {
    throw new Error("Quantity must be between 1 and 50");
  }
  if (!createdBy) {
    throw new Error("Creator UID is required");
  }

  // Get product info
  const product = getProductBySku(sku);
  if (!product) {
    throw new Error(`Unknown SKU: ${sku}`);
  }

  // Get device type from SKU
  const deviceType = SKU_TO_DEVICE_TYPE[sku];
  if (!deviceType) {
    throw new Error(`No device type mapping for SKU: ${sku}`);
  }

  try {
    // Get serial numbers
    const serialNumbers = await getNextSerialNumbers(quantity, serialPrefix);

    // Create device records
    const now = new Date().toISOString();
    const devices = serialNumbers.map((serialNumber) => ({
      id: serialNumber,
      serialNumber,
      sku,
      name: product.name,
      deviceType,
      lifecycle: "inventory",
      commissionStatus: "pending",
      createdAt: now,
      updatedAt: now,
      createdBy,
      notes: notes || "",
    }));

    // Write all devices to Firebase
    const updates = {};
    devices.forEach((device) => {
      updates[`devices/${device.id}`] = device;
    });

    const rootRef = ref(db);
    await update(rootRef, updates);

    console.log(`Batch created: ${quantity} devices (${serialNumbers[0]} to ${serialNumbers[quantity - 1]})`);

    return {
      success: true,
      count: quantity,
      firstSerial: serialNumbers[0],
      lastSerial: serialNumbers[quantity - 1],
      devices,
    };
  } catch (error) {
    console.error("Error creating device batch:", error);
    throw error;
  }
};

/**
 * Get all devices from Firebase
 * @returns {Promise<Array>} - Array of devices
 */
export const getAllDevices = async () => {
  try {
    const devicesRef = ref(db, "devices");
    const snapshot = await get(devicesRef);

    if (!snapshot.exists()) {
      return [];
    }

    const devices = snapshot.val();
    return Object.values(devices);
  } catch (error) {
    console.error("Error getting devices:", error);
    throw error;
  }
};

/**
 * Get devices by lifecycle state
 * @param {string} lifecycle - Lifecycle state to filter by
 * @returns {Promise<Array>} - Array of devices
 */
export const getDevicesByLifecycle = async (lifecycle) => {
  try {
    const devices = await getAllDevices();
    return devices.filter((d) => d.lifecycle === lifecycle);
  } catch (error) {
    console.error("Error getting devices by lifecycle:", error);
    throw error;
  }
};

/**
 * Get inventory devices (lifecycle = "inventory")
 * @returns {Promise<Array>} - Array of inventory devices
 */
export const getInventoryDevices = async () => {
  return getDevicesByLifecycle("inventory");
};

/**
 * Get a single device by ID
 * @param {string} deviceId - Device ID
 * @returns {Promise<Object|null>} - Device data or null
 */
export const getDevice = async (deviceId) => {
  try {
    const deviceRef = ref(db, `devices/${deviceId}`);
    const snapshot = await get(deviceRef);

    if (!snapshot.exists()) {
      return null;
    }

    return snapshot.val();
  } catch (error) {
    console.error("Error getting device:", error);
    throw error;
  }
};

/**
 * Update a device
 * @param {string} deviceId - Device ID
 * @param {Object} updateData - Fields to update
 * @returns {Promise<Object>} - Updated device
 */
export const updateDevice = async (deviceId, updateData) => {
  try {
    const deviceRef = ref(db, `devices/${deviceId}`);

    // Get current device
    const snapshot = await get(deviceRef);
    if (!snapshot.exists()) {
      throw new Error(`Device not found: ${deviceId}`);
    }

    const currentDevice = snapshot.val();
    const updatedDevice = {
      ...currentDevice,
      ...updateData,
      updatedAt: new Date().toISOString(),
    };

    await set(deviceRef, updatedDevice);
    console.log(`Device updated: ${deviceId}`);

    return updatedDevice;
  } catch (error) {
    console.error("Error updating device:", error);
    throw error;
  }
};

/**
 * Delete a device
 * @param {string} deviceId - Device ID
 * @returns {Promise<boolean>} - Success status
 */
export const deleteDevice = async (deviceId) => {
  try {
    const deviceRef = ref(db, `devices/${deviceId}`);
    await set(deviceRef, null);
    console.log(`Device deleted: ${deviceId}`);
    return true;
  } catch (error) {
    console.error("Error deleting device:", error);
    throw error;
  }
};

/* -------------------------------------------------------------------------- */
/*                              DEVICE STATS                                  */
/* -------------------------------------------------------------------------- */

/**
 * Get device counts by lifecycle
 * @returns {Promise<Object>} - Counts by lifecycle state
 */
export const getDeviceCounts = async () => {
  try {
    const devices = await getAllDevices();

    const counts = {
      total: devices.length,
      inventory: 0,
      allocated: 0,
      shipped: 0,
      delivered: 0,
      installed: 0,
      commissioned: 0,
      active: 0,
      maintenance: 0,
      decommissioned: 0,
    };

    devices.forEach((device) => {
      if (counts[device.lifecycle] !== undefined) {
        counts[device.lifecycle]++;
      }
    });

    return counts;
  } catch (error) {
    console.error("Error getting device counts:", error);
    throw error;
  }
};

/* -------------------------------------------------------------------------- */
/*                                   EXPORT                                   */
/* -------------------------------------------------------------------------- */

const DeviceService = {
  // Products
  getProductBySku,
  getAvailableProducts,

  // Serial numbers
  getNextSerialNumber,
  getNextSerialNumbers,

  // Device CRUD
  createDevice,
  createDeviceBatch,
  getAllDevices,
  getDevice,
  updateDevice,
  deleteDevice,

  // Filtered queries
  getDevicesByLifecycle,
  getInventoryDevices,

  // Stats
  getDeviceCounts,
};

export default DeviceService;
