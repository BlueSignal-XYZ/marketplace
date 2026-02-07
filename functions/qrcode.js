/**
 * BlueSignal QR Code Cloud Functions
 * Handles QR code generation and validation for device registration
 */

const functions = require("firebase-functions");
const admin = require("firebase-admin");
const crypto = require("crypto");
const QRCode = require("qrcode");

// QR Secret from Firebase config
const getQRSecret = () => process.env.QR_SECRET || functions.config().qr?.secret || "bluesignal-dev-secret";

/**
 * Generate a signed QR code payload for a device
 * @param {string} serialNumber - Device serial number
 * @param {string} deviceType - Type of device
 * @returns {object} QR payload with signature
 */
const generateQRPayload = (serialNumber, deviceType) => {
  const timestamp = Date.now();
  const secret = getQRSecret();

  // Create HMAC signature
  const payload = `${serialNumber}:${deviceType}:${timestamp}`;
  const signature = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex")
    .substring(0, 16);

  return {
    serialNumber,
    type: deviceType,
    signature,
    timestamp,
  };
};

/**
 * Validate a QR code payload
 * @param {object} payload - Decoded QR payload
 * @returns {object} Validation result
 */
const validateQRPayload = (payload) => {
  const { serialNumber, type, signature, timestamp } = payload;
  const secret = getQRSecret();

  // Verify signature
  const expectedPayload = `${serialNumber}:${type}:${timestamp}`;
  const expectedSig = crypto
    .createHmac("sha256", secret)
    .update(expectedPayload)
    .digest("hex")
    .substring(0, 16);

  if (signature !== expectedSig) {
    return { valid: false, error: "Invalid signature" };
  }

  // Check QR age (valid for 1 year)
  const maxAge = 365 * 24 * 60 * 60 * 1000;
  if (Date.now() - timestamp > maxAge) {
    return { valid: false, error: "QR code expired" };
  }

  return { valid: true };
};

/**
 * Generate QR code for a device (Admin only)
 */
const generateDeviceQR = async (req, res) => {
  const { serialNumber, deviceType } = req.body;

  if (!serialNumber || !deviceType) {
    return res.status(400).json({ error: "Missing serialNumber or deviceType" });
  }

  // Validate serial number format
  const serialPattern = /^BS-\d{4}-\d{6}$/;
  if (!serialPattern.test(serialNumber)) {
    return res.status(400).json({ error: "Invalid serial number format. Expected: BS-YYYY-NNNNNN" });
  }

  // Validate device type
  const validTypes = ["buoy", "soil_probe", "gateway", "algae_control"];
  if (!validTypes.includes(deviceType)) {
    return res.status(400).json({ error: "Invalid device type" });
  }

  // Verify admin authorization
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = authHeader.split("Bearer ")[1];
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    const db = admin.database();

    // Check if requester is admin
    const requesterSnapshot = await db.ref(`users/${decodedToken.uid}/profile/role`).once("value");
    if (requesterSnapshot.val() !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }

    // Generate QR payload
    const qrPayload = generateQRPayload(serialNumber, deviceType);
    const qrData = Buffer.from(JSON.stringify(qrPayload)).toString("base64");
    const qrUrl = `https://cloud.bluesignal.xyz/commission?d=${qrData}`;

    // Generate QR code image
    const qrImage = await QRCode.toDataURL(qrUrl, {
      errorCorrectionLevel: "H",
      width: 300,
      margin: 2,
    });

    // Check if device already exists
    const deviceSnapshot = await db.ref(`devices/${serialNumber}`).once("value");

    if (deviceSnapshot.exists()) {
      // Update existing device with new QR
      await db.ref(`devices/${serialNumber}`).update({
        qrCode: qrData,
        qrGeneratedAt: Date.now(),
      });
    } else {
      // Create new device record
      await db.ref(`devices/${serialNumber}`).set({
        serialNumber,
        type: deviceType,
        qrCode: qrData,
        qrGeneratedAt: Date.now(),
        model: "",
        firmware: "",
        ownership: {
          ownerId: null,
          purchaseDate: null,
          warrantyExpiry: null,
          transferHistory: [],
        },
        installation: {
          status: "unregistered",
          siteId: null,
          installerId: null,
          commissionedAt: null,
          commissionedBy: null,
          location: null,
        },
        configuration: {
          reportingInterval: 300, // 5 minutes default
          alertThresholds: {},
          calibration: null,
        },
        health: {
          lastSeen: null,
          batteryLevel: null,
          signalStrength: null,
          errorCount: 0,
        },
      });
    }

    res.json({
      success: true,
      qrData,
      qrUrl,
      qrImage,
      serialNumber,
      deviceType,
    });
  } catch (error) {
    console.error("Failed to generate QR code:", error);
    res.status(500).json({ error: "Failed to generate QR code" });
  }
};

/**
 * Validate a device QR code scan
 */
const validateDeviceQR = async (req, res) => {
  const { qrData } = req.body;

  if (!qrData) {
    return res.status(400).json({ error: "Missing qrData" });
  }

  // Verify authentication
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = authHeader.split("Bearer ")[1];
  try {
    await admin.auth().verifyIdToken(token);
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }

  try {
    // Decode QR data
    let decoded;
    try {
      decoded = JSON.parse(Buffer.from(qrData, "base64").toString());
    } catch (e) {
      return res.status(400).json({ error: "Invalid QR code format" });
    }

    const { serialNumber, type } = decoded;

    // Validate the payload
    const validation = validateQRPayload(decoded);
    if (!validation.valid) {
      return res.status(400).json({ error: validation.error });
    }

    // Fetch device from database
    const db = admin.database();
    const deviceSnapshot = await db.ref(`devices/${serialNumber}`).once("value");

    if (!deviceSnapshot.exists()) {
      return res.status(404).json({ error: "Device not found" });
    }

    const device = deviceSnapshot.val();

    // Check if already commissioned
    if (device.installation?.status === "active") {
      return res.status(400).json({
        error: "Device already commissioned",
        device: {
          serialNumber,
          type: device.type,
          status: device.installation.status,
        },
      });
    }

    res.json({
      valid: true,
      device: {
        serialNumber,
        type: device.type,
        model: device.model,
        firmware: device.firmware,
        currentStatus: device.installation?.status || "unregistered",
        hasOwner: !!device.ownership?.ownerId,
      },
    });
  } catch (error) {
    console.error("Failed to validate QR code:", error);
    res.status(500).json({ error: "Failed to validate QR code" });
  }
};

/**
 * Register a device to a user (after QR scan)
 */
const registerDevice = async (req, res) => {
  const { serialNumber, purchaseOrderId, devEUI } = req.body;

  if (!serialNumber) {
    return res.status(400).json({ error: "Missing serialNumber" });
  }

  // Verify authentication
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = authHeader.split("Bearer ")[1];
  let uid;
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    uid = decodedToken.uid;
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }

  const db = admin.database();

  try {
    // Fetch device
    const deviceSnapshot = await db.ref(`devices/${serialNumber}`).once("value");
    if (!deviceSnapshot.exists()) {
      return res.status(404).json({ error: "Device not found" });
    }

    const device = deviceSnapshot.val();

    // Check if already owned
    if (device.ownership?.ownerId && device.ownership.ownerId !== uid) {
      return res.status(400).json({ error: "Device already registered to another user" });
    }

    // Update device ownership
    const now = Date.now();
    const warrantyYears = 2;
    const warrantyExpiry = now + warrantyYears * 365 * 24 * 60 * 60 * 1000;

    const updates = {
      [`devices/${serialNumber}/ownership/ownerId`]: uid,
      [`devices/${serialNumber}/ownership/purchaseDate`]: now,
      [`devices/${serialNumber}/ownership/warrantyExpiry`]: warrantyExpiry,
      [`devices/${serialNumber}/installation/status`]: "registered",
    };

    // Add to transfer history if this is a transfer
    if (device.ownership?.ownerId) {
      const transferHistory = device.ownership.transferHistory || [];
      transferHistory.push({
        from: device.ownership.ownerId,
        to: uid,
        date: now,
      });
      updates[`devices/${serialNumber}/ownership/transferHistory`] = transferHistory;
    }

    // Associate with purchase order if provided
    if (purchaseOrderId) {
      updates[`devices/${serialNumber}/purchaseOrderId`] = purchaseOrderId;
    }

    // Associate LoRaWAN DevEUI if provided
    if (devEUI) {
      updates[`devices/${serialNumber}/lorawan/devEUI`] = devEUI.toUpperCase();
      updates[`devices/${serialNumber}/lorawan/registeredAt`] = now;
    }

    await db.ref().update(updates);

    // Log activity
    await db.ref(`users/${uid}/activity`).push({
      type: "device_registered",
      timestamp: now,
      metadata: { deviceId: serialNumber, purchaseOrderId },
    });

    res.json({
      success: true,
      device: {
        serialNumber,
        type: device.type,
        status: "registered",
        warrantyExpiry,
      },
    });
  } catch (error) {
    console.error("Failed to register device:", error);
    res.status(500).json({ error: "Failed to register device" });
  }
};

/**
 * Batch generate QR codes (Admin only)
 */
const batchGenerateQR = async (req, res) => {
  const { devices } = req.body;

  if (!devices || !Array.isArray(devices) || devices.length === 0) {
    return res.status(400).json({ error: "Missing or invalid devices array" });
  }

  if (devices.length > 100) {
    return res.status(400).json({ error: "Maximum 100 devices per batch" });
  }

  // Verify admin authorization
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = authHeader.split("Bearer ")[1];
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    const db = admin.database();

    // Check if requester is admin
    const requesterSnapshot = await db.ref(`users/${decodedToken.uid}/profile/role`).once("value");
    if (requesterSnapshot.val() !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }

    const results = [];
    const updates = {};

    for (const device of devices) {
      const { serialNumber, deviceType } = device;

      if (!serialNumber || !deviceType) {
        results.push({ serialNumber, error: "Missing serialNumber or deviceType" });
        continue;
      }

      const serialPattern = /^BS-\d{4}-\d{6}$/;
      if (!serialPattern.test(serialNumber)) {
        results.push({ serialNumber, error: "Invalid serial number format" });
        continue;
      }

      const qrPayload = generateQRPayload(serialNumber, deviceType);
      const qrData = Buffer.from(JSON.stringify(qrPayload)).toString("base64");
      const qrUrl = `https://cloud.bluesignal.xyz/commission?d=${qrData}`;

      // Generate QR image
      const qrImage = await QRCode.toDataURL(qrUrl, {
        errorCorrectionLevel: "H",
        width: 300,
        margin: 2,
      });

      updates[`devices/${serialNumber}`] = {
        serialNumber,
        type: deviceType,
        qrCode: qrData,
        qrGeneratedAt: Date.now(),
        model: device.model || "",
        firmware: device.firmware || "",
        ownership: {
          ownerId: null,
          purchaseDate: null,
          warrantyExpiry: null,
          transferHistory: [],
        },
        installation: {
          status: "unregistered",
          siteId: null,
          installerId: null,
          commissionedAt: null,
          commissionedBy: null,
          location: null,
        },
        configuration: {
          reportingInterval: 300,
          alertThresholds: {},
          calibration: null,
        },
        health: {
          lastSeen: null,
          batteryLevel: null,
          signalStrength: null,
          errorCount: 0,
        },
      };

      results.push({
        serialNumber,
        success: true,
        qrUrl,
        qrImage,
      });
    }

    if (Object.keys(updates).length > 0) {
      await db.ref().update(updates);
    }

    res.json({
      success: true,
      generated: results.filter((r) => r.success).length,
      failed: results.filter((r) => r.error).length,
      results,
    });
  } catch (error) {
    console.error("Failed to batch generate QR codes:", error);
    res.status(500).json({ error: "Failed to batch generate QR codes" });
  }
};

module.exports = {
  generateDeviceQR,
  validateDeviceQR,
  registerDevice,
  batchGenerateQR,
  generateQRPayload,
  validateQRPayload,
};
