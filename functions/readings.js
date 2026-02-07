/**
 * BlueSignal Sensor Data Ingestion and Alerts
 * Handles device readings, threshold monitoring, and notifications
 */

const functions = require("firebase-functions");
const admin = require("firebase-admin");

// Sensor value ranges for validation
const SENSOR_RANGES = {
  nitrogen: { min: 0, max: 100, unit: "mg/L" },
  phosphorus: { min: 0, max: 50, unit: "mg/L" },
  dissolved_oxygen: { min: 0, max: 20, unit: "mg/L" },
  temperature: { min: -10, max: 50, unit: "C" },
  ph: { min: 0, max: 14, unit: "" },
  turbidity: { min: 0, max: 1000, unit: "NTU" },
  tds: { min: 0, max: 5000, unit: "ppm" },
  conductivity: { min: 0, max: 5000, unit: "µS/cm" },
  salinity: { min: 0, max: 50, unit: "ppt" },
  chlorophyll: { min: 0, max: 500, unit: "µg/L" },
};

/**
 * Verify device API key
 */
const verifyDeviceApiKey = async (apiKey) => {
  if (!apiKey) return false;

  const db = admin.database();

  try {
    // Check device API keys collection
    const snapshot = await db.ref("deviceApiKeys").orderByChild("key").equalTo(apiKey).once("value");
    if (!snapshot.exists()) return false;

    const keyData = Object.values(snapshot.val())[0];
    return keyData.enabled !== false;
  } catch (error) {
    console.error("API key verification failed:", error);
    return false;
  }
};

/**
 * Validate and process sensor readings
 */
const validateSensors = (sensors) => {
  const processed = {};

  for (const [type, data] of Object.entries(sensors)) {
    const range = SENSOR_RANGES[type];
    let quality = "good";
    let value = data.value;

    if (typeof value !== "number" || isNaN(value)) {
      quality = "invalid";
      value = null;
    } else if (range && (value < range.min || value > range.max)) {
      quality = "suspect";
    }

    processed[type] = {
      value,
      unit: range?.unit || data.unit || "",
      quality,
      rawValue: data.value,
    };
  }

  return processed;
};

/**
 * HTTP endpoint for device data ingestion
 * Devices POST sensor readings here
 */
const ingestReading = async (req, res) => {
  // CORS headers
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type, X-API-Key, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(204).send("");
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Verify API key
  const apiKey = req.headers["x-api-key"] || req.query.apiKey;
  const isValidKey = await verifyDeviceApiKey(apiKey);

  if (!isValidKey) {
    return res.status(401).json({ error: "Invalid or missing API key" });
  }

  const db = admin.database();

  try {
    // Support single or batch readings
    const readings = Array.isArray(req.body) ? req.body : [req.body];
    const results = [];

    for (const reading of readings) {
      const { deviceId, timestamp, sensors, metadata } = reading;

      if (!deviceId) {
        results.push({ error: "Missing deviceId" });
        continue;
      }

      if (!sensors || Object.keys(sensors).length === 0) {
        results.push({ deviceId, error: "Missing sensors data" });
        continue;
      }

      // Verify device exists
      const deviceSnapshot = await db.ref(`devices/${deviceId}`).once("value");
      if (!deviceSnapshot.exists()) {
        results.push({ deviceId, error: "Device not found" });
        continue;
      }

      const device = deviceSnapshot.val();
      const readingTimestamp = timestamp || Date.now();

      // Validate and process sensors
      const processedSensors = validateSensors(sensors);

      // Create reading record
      const readingData = {
        timestamp: readingTimestamp,
        deviceId,
        siteId: device.installation?.siteId || null,
        sensors: processedSensors,
        metadata: {
          batteryLevel: metadata?.batteryLevel || null,
          signalStrength: metadata?.signalStrength || null,
          firmware: metadata?.firmware || null,
          ...metadata,
        },
      };

      // Store reading
      await db.ref(`readings/${deviceId}/${readingTimestamp}`).set(readingData);

      // Update device health
      const healthUpdate = {
        lastSeen: readingTimestamp,
      };
      if (metadata?.batteryLevel !== undefined) {
        healthUpdate.batteryLevel = metadata.batteryLevel;
      }
      if (metadata?.signalStrength !== undefined) {
        healthUpdate.signalStrength = metadata.signalStrength;
      }

      await db.ref(`devices/${deviceId}/health`).update(healthUpdate);

      // Check alert thresholds
      await checkAlertThresholds(db, deviceId, device, processedSensors);

      results.push({ deviceId, timestamp: readingTimestamp, status: "stored" });
    }

    res.status(200).json({
      success: true,
      processed: results.filter((r) => r.status === "stored").length,
      failed: results.filter((r) => r.error).length,
      results,
    });
  } catch (error) {
    console.error("Reading ingestion failed:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Check sensor values against alert thresholds
 */
const checkAlertThresholds = async (db, deviceId, device, sensors) => {
  const thresholds = device.configuration?.alertThresholds || {};

  for (const [sensorType, data] of Object.entries(sensors)) {
    const threshold = thresholds[sensorType];
    if (!threshold || !threshold.enabled) continue;
    if (data.value === null || data.quality === "invalid") continue;

    let triggered = false;
    let condition = "";
    let thresholdValue = 0;

    if (threshold.high !== undefined && data.value > threshold.high) {
      triggered = true;
      condition = "above";
      thresholdValue = threshold.high;
    } else if (threshold.low !== undefined && data.value < threshold.low) {
      triggered = true;
      condition = "below";
      thresholdValue = threshold.low;
    }

    if (triggered) {
      // Check for existing active alert of same type
      const existingSnapshot = await db.ref("alerts")
        .orderByChild("deviceId")
        .equalTo(deviceId)
        .once("value");

      const existingAlerts = existingSnapshot.val() || {};
      const hasActiveAlert = Object.values(existingAlerts).some(
        (a) => a.trigger?.parameter === sensorType &&
               a.status === "active" &&
               a.trigger?.condition === condition
      );

      if (!hasActiveAlert) {
        // Calculate severity based on how far outside threshold
        const deviation = Math.abs(data.value - thresholdValue) / thresholdValue;
        const severity = deviation > 0.5 ? "critical" : deviation > 0.2 ? "warning" : "info";

        const alertId = db.ref("alerts").push().key;
        await db.ref(`alerts/${alertId}`).set({
          deviceId,
          siteId: device.installation?.siteId || null,
          ownerId: device.ownership?.ownerId || null,
          type: "threshold",
          severity,
          status: "active",
          trigger: {
            parameter: sensorType,
            condition,
            threshold: thresholdValue,
            actualValue: data.value,
          },
          timestamps: {
            triggered: Date.now(),
            acknowledged: null,
            resolved: null,
          },
          notifications: {
            emailSent: false,
            smsSent: false,
            pushSent: false,
          },
        });

        console.log(`Alert created: ${alertId} for device ${deviceId}, ${sensorType} ${condition} ${thresholdValue}`);
      }
    } else {
      // Auto-resolve existing alerts if value is back to normal
      const existingSnapshot = await db.ref("alerts")
        .orderByChild("deviceId")
        .equalTo(deviceId)
        .once("value");

      const existingAlerts = existingSnapshot.val() || {};
      for (const [alertId, alert] of Object.entries(existingAlerts)) {
        if (
          alert.trigger?.parameter === sensorType &&
          alert.status === "active" &&
          alert.type === "threshold"
        ) {
          // Check if value is now within threshold
          const isWithinBounds =
            (threshold.high === undefined || data.value <= threshold.high) &&
            (threshold.low === undefined || data.value >= threshold.low);

          if (isWithinBounds) {
            await db.ref(`alerts/${alertId}`).update({
              status: "resolved",
              "timestamps/resolved": Date.now(),
              autoResolved: true,
            });
            console.log(`Alert auto-resolved: ${alertId}`);
          }
        }
      }
    }
  }
};

/**
 * Get readings for a device
 */
const getDeviceReadings = async (req, res) => {
  const { deviceId, limit = 100, startTime, endTime } = req.body;

  if (!deviceId) {
    return res.status(400).json({ error: "Missing deviceId" });
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = authHeader.split("Bearer ")[1];
  const db = admin.database();

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    const uid = decodedToken.uid;

    // Verify user has access to device
    const deviceSnapshot = await db.ref(`devices/${deviceId}`).once("value");
    if (!deviceSnapshot.exists()) {
      return res.status(404).json({ error: "Device not found" });
    }

    const device = deviceSnapshot.val();
    const userSnapshot = await db.ref(`users/${uid}/profile/role`).once("value");
    const role = userSnapshot.val();

    if (device.ownership?.ownerId !== uid && role !== "admin") {
      return res.status(403).json({ error: "Not authorized" });
    }

    // Query readings
    let query = db.ref(`readings/${deviceId}`);

    if (startTime) {
      query = query.orderByChild("timestamp").startAt(startTime);
    }
    if (endTime) {
      query = query.endAt(endTime);
    }

    query = query.limitToLast(Math.min(limit, 1000));

    const snapshot = await query.once("value");
    const data = snapshot.val() || {};

    const readings = Object.values(data).sort((a, b) => b.timestamp - a.timestamp);

    res.json({ readings, count: readings.length });
  } catch (error) {
    console.error("Failed to get readings:", error);
    res.status(500).json({ error: "Failed to get readings" });
  }
};

/**
 * Get aggregated statistics for a device
 */
const getDeviceStats = async (req, res) => {
  const { deviceId, period = "day" } = req.body;

  if (!deviceId) {
    return res.status(400).json({ error: "Missing deviceId" });
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = authHeader.split("Bearer ")[1];
  const db = admin.database();

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    const uid = decodedToken.uid;

    // Verify access
    const deviceSnapshot = await db.ref(`devices/${deviceId}`).once("value");
    if (!deviceSnapshot.exists()) {
      return res.status(404).json({ error: "Device not found" });
    }

    const device = deviceSnapshot.val();
    const userSnapshot = await db.ref(`users/${uid}/profile/role`).once("value");
    const role = userSnapshot.val();

    if (device.ownership?.ownerId !== uid && role !== "admin") {
      return res.status(403).json({ error: "Not authorized" });
    }

    // Calculate time range
    const now = Date.now();
    let startTime;
    switch (period) {
      case "hour":
        startTime = now - 60 * 60 * 1000;
        break;
      case "day":
        startTime = now - 24 * 60 * 60 * 1000;
        break;
      case "week":
        startTime = now - 7 * 24 * 60 * 60 * 1000;
        break;
      case "month":
        startTime = now - 30 * 24 * 60 * 60 * 1000;
        break;
      default:
        startTime = now - 24 * 60 * 60 * 1000;
    }

    // Get readings for the period
    const snapshot = await db.ref(`readings/${deviceId}`)
      .orderByChild("timestamp")
      .startAt(startTime)
      .once("value");

    const data = snapshot.val() || {};
    const readings = Object.values(data);

    if (readings.length === 0) {
      return res.json({
        period,
        startTime,
        endTime: now,
        readingCount: 0,
        stats: {},
      });
    }

    // Calculate statistics for each sensor
    const stats = {};
    const sensorTypes = new Set();

    readings.forEach((r) => {
      Object.keys(r.sensors || {}).forEach((type) => sensorTypes.add(type));
    });

    for (const sensorType of sensorTypes) {
      const values = readings
        .map((r) => r.sensors?.[sensorType]?.value)
        .filter((v) => v !== null && v !== undefined && !isNaN(v));

      if (values.length === 0) continue;

      const sorted = [...values].sort((a, b) => a - b);
      const sum = values.reduce((a, b) => a + b, 0);

      stats[sensorType] = {
        count: values.length,
        min: Math.min(...values),
        max: Math.max(...values),
        avg: sum / values.length,
        median: sorted[Math.floor(sorted.length / 2)],
        latest: readings[readings.length - 1].sensors?.[sensorType]?.value,
        unit: SENSOR_RANGES[sensorType]?.unit || "",
      };
    }

    res.json({
      period,
      startTime,
      endTime: now,
      readingCount: readings.length,
      stats,
    });
  } catch (error) {
    console.error("Failed to get device stats:", error);
    res.status(500).json({ error: "Failed to get device stats" });
  }
};

/**
 * Scheduled function: Device health check
 * Runs every 15 minutes to check for offline devices
 */
const deviceHealthCheck = functions.pubsub
  .schedule("every 15 minutes")
  .onRun(async () => {
    const db = admin.database();
    const now = Date.now();
    const offlineThreshold = 30 * 60 * 1000; // 30 minutes

    try {
      const devicesSnapshot = await db.ref("devices")
        .orderByChild("installation/status")
        .equalTo("active")
        .once("value");

      const devices = devicesSnapshot.val() || {};

      for (const [deviceId, device] of Object.entries(devices)) {
        const lastSeen = device.health?.lastSeen || 0;

        if (now - lastSeen > offlineThreshold) {
          // Check for existing offline alert
          const alertsSnapshot = await db.ref("alerts")
            .orderByChild("deviceId")
            .equalTo(deviceId)
            .once("value");

          const alerts = alertsSnapshot.val() || {};
          const hasActiveOffline = Object.values(alerts).some(
            (a) => a.type === "offline" && a.status === "active"
          );

          if (!hasActiveOffline) {
            const alertId = db.ref("alerts").push().key;
            await db.ref(`alerts/${alertId}`).set({
              deviceId,
              siteId: device.installation?.siteId,
              ownerId: device.ownership?.ownerId,
              type: "offline",
              severity: "warning",
              status: "active",
              trigger: {
                parameter: "connectivity",
                condition: "offline",
                threshold: offlineThreshold,
                actualValue: now - lastSeen,
              },
              timestamps: {
                triggered: now,
                acknowledged: null,
                resolved: null,
              },
              notifications: {
                emailSent: false,
                smsSent: false,
                pushSent: false,
              },
            });

            console.log(`Offline alert created for device ${deviceId}`);
          }
        } else {
          // Device is online - auto-resolve any offline alerts
          const alertsSnapshot = await db.ref("alerts")
            .orderByChild("deviceId")
            .equalTo(deviceId)
            .once("value");

          const alerts = alertsSnapshot.val() || {};
          for (const [alertId, alert] of Object.entries(alerts)) {
            if (alert.type === "offline" && alert.status === "active") {
              await db.ref(`alerts/${alertId}`).update({
                status: "resolved",
                "timestamps/resolved": now,
                autoResolved: true,
              });
              console.log(`Offline alert auto-resolved for device ${deviceId}`);
            }
          }
        }

        // Check battery level
        const batteryLevel = device.health?.batteryLevel;
        if (batteryLevel !== null && batteryLevel < 20) {
          const alertsSnapshot = await db.ref("alerts")
            .orderByChild("deviceId")
            .equalTo(deviceId)
            .once("value");

          const alerts = alertsSnapshot.val() || {};
          const hasActiveBattery = Object.values(alerts).some(
            (a) => a.type === "battery" && a.status === "active"
          );

          if (!hasActiveBattery) {
            const severity = batteryLevel < 10 ? "critical" : "warning";
            const alertId = db.ref("alerts").push().key;
            await db.ref(`alerts/${alertId}`).set({
              deviceId,
              siteId: device.installation?.siteId,
              ownerId: device.ownership?.ownerId,
              type: "battery",
              severity,
              status: "active",
              trigger: {
                parameter: "battery",
                condition: "below",
                threshold: 20,
                actualValue: batteryLevel,
              },
              timestamps: { triggered: now },
              notifications: { emailSent: false, smsSent: false, pushSent: false },
            });
          }
        }
      }

      return null;
    } catch (error) {
      console.error("Health check failed:", error);
      return null;
    }
  });

/**
 * Get active alerts for a user
 */
const getActiveAlerts = async (req, res) => {
  const { filters = {} } = req.body;

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = authHeader.split("Bearer ")[1];
  const db = admin.database();

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    const uid = decodedToken.uid;

    const userSnapshot = await db.ref(`users/${uid}/profile/role`).once("value");
    const role = userSnapshot.val();

    let query;
    if (role === "admin") {
      query = db.ref("alerts");
    } else {
      query = db.ref("alerts").orderByChild("ownerId").equalTo(uid);
    }

    const snapshot = await query.once("value");
    const data = snapshot.val() || {};

    let alerts = Object.entries(data).map(([id, a]) => ({ id, ...a }));

    // Filter by status
    if (filters.status) {
      alerts = alerts.filter((a) => a.status === filters.status);
    } else {
      // Default to active alerts
      alerts = alerts.filter((a) => a.status === "active");
    }

    // Filter by severity
    if (filters.severity) {
      alerts = alerts.filter((a) => a.severity === filters.severity);
    }

    // Filter by device
    if (filters.deviceId) {
      alerts = alerts.filter((a) => a.deviceId === filters.deviceId);
    }

    // Sort by timestamp (most recent first)
    alerts.sort((a, b) => (b.timestamps?.triggered || 0) - (a.timestamps?.triggered || 0));

    res.json({ alerts, count: alerts.length });
  } catch (error) {
    console.error("Failed to get alerts:", error);
    res.status(500).json({ error: "Failed to get alerts" });
  }
};

/**
 * Acknowledge an alert
 */
const acknowledgeAlert = async (req, res) => {
  const { alertId } = req.body;

  if (!alertId) {
    return res.status(400).json({ error: "Missing alertId" });
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = authHeader.split("Bearer ")[1];
  const db = admin.database();

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    const uid = decodedToken.uid;

    const alertSnapshot = await db.ref(`alerts/${alertId}`).once("value");
    if (!alertSnapshot.exists()) {
      return res.status(404).json({ error: "Alert not found" });
    }

    const alert = alertSnapshot.val();
    const userSnapshot = await db.ref(`users/${uid}/profile/role`).once("value");
    const role = userSnapshot.val();

    if (alert.ownerId !== uid && role !== "admin") {
      return res.status(403).json({ error: "Not authorized" });
    }

    await db.ref(`alerts/${alertId}`).update({
      status: "acknowledged",
      "timestamps/acknowledged": Date.now(),
      "timestamps/acknowledgedBy": uid,
    });

    res.json({ success: true });
  } catch (error) {
    console.error("Failed to acknowledge alert:", error);
    res.status(500).json({ error: "Failed to acknowledge alert" });
  }
};

/**
 * Resolve an alert
 */
const resolveAlert = async (req, res) => {
  const { alertId, resolution } = req.body;

  if (!alertId) {
    return res.status(400).json({ error: "Missing alertId" });
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = authHeader.split("Bearer ")[1];
  const db = admin.database();

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    const uid = decodedToken.uid;

    const alertSnapshot = await db.ref(`alerts/${alertId}`).once("value");
    if (!alertSnapshot.exists()) {
      return res.status(404).json({ error: "Alert not found" });
    }

    const alert = alertSnapshot.val();
    const userSnapshot = await db.ref(`users/${uid}/profile/role`).once("value");
    const role = userSnapshot.val();

    if (alert.ownerId !== uid && role !== "admin") {
      return res.status(403).json({ error: "Not authorized" });
    }

    await db.ref(`alerts/${alertId}`).update({
      status: "resolved",
      resolution: resolution || null,
      "timestamps/resolved": Date.now(),
      "timestamps/resolvedBy": uid,
    });

    res.json({ success: true });
  } catch (error) {
    console.error("Failed to resolve alert:", error);
    res.status(500).json({ error: "Failed to resolve alert" });
  }
};

/**
 * Update alert thresholds for a device
 */
const updateAlertThresholds = async (req, res) => {
  const { deviceId, thresholds } = req.body;

  if (!deviceId || !thresholds) {
    return res.status(400).json({ error: "Missing deviceId or thresholds" });
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = authHeader.split("Bearer ")[1];
  const db = admin.database();

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    const uid = decodedToken.uid;

    const deviceSnapshot = await db.ref(`devices/${deviceId}`).once("value");
    if (!deviceSnapshot.exists()) {
      return res.status(404).json({ error: "Device not found" });
    }

    const device = deviceSnapshot.val();
    const userSnapshot = await db.ref(`users/${uid}/profile/role`).once("value");
    const role = userSnapshot.val();

    if (device.ownership?.ownerId !== uid && role !== "admin") {
      return res.status(403).json({ error: "Not authorized" });
    }

    // Validate thresholds
    const validatedThresholds = {};
    for (const [sensorType, config] of Object.entries(thresholds)) {
      if (!SENSOR_RANGES[sensorType]) continue;

      validatedThresholds[sensorType] = {
        enabled: config.enabled !== false,
        high: config.high !== undefined ? Number(config.high) : undefined,
        low: config.low !== undefined ? Number(config.low) : undefined,
      };
    }

    await db.ref(`devices/${deviceId}/configuration/alertThresholds`).set(validatedThresholds);

    res.json({ success: true, thresholds: validatedThresholds });
  } catch (error) {
    console.error("Failed to update thresholds:", error);
    res.status(500).json({ error: "Failed to update thresholds" });
  }
};

/**
 * TTN v3 Webhook Handler
 *
 * Receives uplink messages from The Things Network v3 and feeds them
 * into the existing ingestReading pipeline. TTN sends a JSON payload
 * containing end_device_ids (with dev_eui) and uplink_message (with
 * decoded_payload from Cayenne LPP decoder).
 *
 * Auth: Shared secret via X-TTN-Webhook-Secret header or ?secret= query param.
 * This endpoint is registered as a separate Cloud Function (not behind Express CORS).
 */

// Cayenne LPP field name -> BlueSignal canonical sensor name mapping
const CAYENNE_TO_CANONICAL = {
  temperature_1: "temperature",
  analog_input_2: "ph",
  analog_input_3: "turbidity",
  analog_input_4: "tds",
};

/**
 * Look up a BlueSignal device by its LoRaWAN DevEUI.
 * Returns { deviceId, device } or null if not found.
 */
const findDeviceByDevEUI = async (db, devEUI) => {
  // Normalize to uppercase for consistent lookup
  const normalized = devEUI.toUpperCase();

  const snapshot = await db.ref("devices").once("value");
  const devices = snapshot.val() || {};

  for (const [deviceId, device] of Object.entries(devices)) {
    const storedEUI = device.lorawan?.devEUI;
    if (storedEUI && storedEUI.toUpperCase() === normalized) {
      return { deviceId, device };
    }
  }

  return null;
};

/**
 * Parse TTN v3 uplink payload into BlueSignal reading format.
 */
const parseTTNPayload = (body) => {
  const endDeviceIds = body.end_device_ids;
  const uplinkMessage = body.uplink_message;

  if (!endDeviceIds || !uplinkMessage) {
    return null;
  }

  const devEUI = endDeviceIds.dev_eui;
  if (!devEUI) return null;

  // Get decoded payload (from TTN Cayenne LPP decoder)
  const decoded = uplinkMessage.decoded_payload || {};

  // Map Cayenne LPP fields to canonical sensor names
  const sensors = {};
  for (const [cayenneKey, canonicalName] of Object.entries(CAYENNE_TO_CANONICAL)) {
    if (decoded[cayenneKey] !== undefined) {
      sensors[canonicalName] = { value: decoded[cayenneKey] };
    }
  }

  // Extract GPS if present (Cayenne LPP GPS type)
  const gps = decoded.gps_5 || decoded.gps_1 || null;

  // Extract RF metadata
  const rxMeta = uplinkMessage.rx_metadata?.[0] || {};
  const metadata = {
    source: "ttn_v3",
    devEUI,
    rssi: rxMeta.rssi || null,
    snr: rxMeta.snr || null,
    frameCounter: uplinkMessage.f_cnt || null,
    frequency: uplinkMessage.settings?.frequency || null,
    spreadingFactor: uplinkMessage.settings?.data_rate?.lora?.spreading_factor || null,
    gateway: rxMeta.gateway_ids?.gateway_id || null,
  };

  // Use received_at timestamp from TTN, fall back to now
  const timestamp = uplinkMessage.received_at
    ? new Date(uplinkMessage.received_at).getTime()
    : Date.now();

  return { devEUI, sensors, metadata, gps, timestamp };
};

const ttnWebhook = async (req, res) => {
  // CORS not needed -- TTN sends direct POST, not from a browser
  if (req.method === "OPTIONS") {
    res.status(204).send("");
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  // Verify shared secret
  const secret =
    req.headers["x-ttn-webhook-secret"] ||
    req.headers["x-downlink-apikey"] ||
    req.query.secret;

  const expectedSecret = process.env.TTN_WEBHOOK_SECRET;

  if (!expectedSecret) {
    console.error("TTN_WEBHOOK_SECRET not configured");
    res.status(500).json({ error: "Webhook secret not configured" });
    return;
  }

  if (secret !== expectedSecret) {
    console.warn("TTN webhook: invalid secret");
    res.status(401).json({ error: "Invalid webhook secret" });
    return;
  }

  const db = admin.database();

  try {
    const parsed = parseTTNPayload(req.body);

    if (!parsed) {
      console.warn("TTN webhook: could not parse payload");
      res.status(400).json({ error: "Invalid TTN payload format" });
      return;
    }

    const { devEUI, sensors, metadata, gps, timestamp } = parsed;

    if (Object.keys(sensors).length === 0) {
      console.warn(`TTN webhook: no sensor data in payload for ${devEUI}`);
      res.status(400).json({ error: "No sensor data in decoded payload" });
      return;
    }

    // Look up device by DevEUI
    const result = await findDeviceByDevEUI(db, devEUI);

    if (!result) {
      console.warn(`TTN webhook: unknown DevEUI ${devEUI}`);
      res.status(404).json({ error: `Device not found for DevEUI: ${devEUI}` });
      return;
    }

    const { deviceId, device } = result;

    // Validate sensors through existing pipeline
    const processedSensors = validateSensors(sensors);

    // Store reading (same path as ingestReading)
    const readingData = {
      timestamp,
      deviceId,
      siteId: device.installation?.siteId || null,
      sensors: processedSensors,
      metadata: {
        ...metadata,
        batteryLevel: null,
        signalStrength: metadata.rssi,
        firmware: null,
      },
    };

    if (gps) {
      readingData.metadata.gps = gps;
    }

    await db.ref(`readings/${deviceId}/${timestamp}`).set(readingData);

    // Update device health
    const healthUpdate = {
      lastSeen: timestamp,
    };
    if (metadata.rssi !== null) {
      healthUpdate.signalStrength = metadata.rssi;
    }

    await db.ref(`devices/${deviceId}/health`).update(healthUpdate);

    // Update LoRaWAN metadata on device
    const lorawanUpdate = {
      lastFrameCounter: metadata.frameCounter,
      lastRSSI: metadata.rssi,
      lastSNR: metadata.snr,
      lastGateway: metadata.gateway,
      lastUplinkAt: timestamp,
    };
    await db.ref(`devices/${deviceId}/lorawan`).update(lorawanUpdate);

    // Check alert thresholds
    await checkAlertThresholds(db, deviceId, device, processedSensors);

    console.log(
      `TTN webhook: stored reading for device ${deviceId} (DevEUI: ${devEUI}), ` +
      `sensors: ${Object.keys(processedSensors).join(", ")}`
    );

    res.status(200).json({
      success: true,
      deviceId,
      timestamp,
      sensors: Object.keys(processedSensors),
    });
  } catch (error) {
    console.error("TTN webhook error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  ingestReading,
  getDeviceReadings,
  getDeviceStats,
  deviceHealthCheck,
  getActiveAlerts,
  acknowledgeAlert,
  resolveAlert,
  updateAlertThresholds,
  ttnWebhook,
  SENSOR_RANGES,
};
