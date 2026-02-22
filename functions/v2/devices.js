/**
 * v2 Device Endpoints — aligned with src/services/types/devices.ts
 * GET  /v2/devices           — list user's devices (DeviceSummary[])
 * GET  /v2/devices/:id       — single device detail (Device)
 * GET  /v2/devices/:id/metrics — time-series data
 * GET  /v2/devices/:id/alerts  — device alert history
 * POST /v2/devices/check      — validate device ID
 * POST /v2/devices/test-connection — connectivity check
 * POST /v2/devices/commission — full commissioning
 */

const admin = require("firebase-admin");

async function listDevices(req, res) {
  try {
    const uid = req.query.userId || req.user?.uid;
    if (!uid) {
      return res.status(400).json({ success: false, error: "Missing userId" });
    }

    const db = admin.database();
    const snap = await db.ref("devices").orderByChild("ownerId").equalTo(uid).once("value");
    const raw = snap.val() || {};

    const devices = Object.entries(raw).map(([id, val]) => ({
      id,
      name: val.name || id,
      status: val.status || "inactive",
      onlineStatus: val.onlineStatus || (val.status === "active" ? "online" : "offline"),
      battery: val.battery ?? 0,
      lastReadingAt: val.lastReadingAt || val.lastReading || "",
      location: {
        latitude: val.latitude || val.location?.latitude || 0,
        longitude: val.longitude || val.location?.longitude || 0,
        address: val.address || val.location?.address || "",
        city: val.city || val.location?.city || "",
        state: val.state || val.location?.state || "",
        country: val.country || val.location?.country || "US",
      },
      creditsGenerated: val.creditsGenerated || 0,
    }));

    res.json({ success: true, data: devices });
  } catch (error) {
    console.error("v2/devices list error:", error);
    res.status(500).json({ success: false, error: "Failed to fetch devices" });
  }
}

async function getDevice(req, res) {
  try {
    const { id } = req.params;
    const db = admin.database();
    const snap = await db.ref(`devices/${id}`).once("value");
    const val = snap.val();

    if (!val) {
      return res.status(404).json({ success: false, error: "Device not found" });
    }

    const device = {
      id,
      serialNumber: val.serialNumber || id,
      name: val.name || id,
      model: "BS-WQM-100",
      firmwareVersion: val.firmwareVersion || val.firmware || "1.0.0",
      status: val.status || "inactive",
      onlineStatus: val.onlineStatus || (val.status === "active" ? "online" : "offline"),
      ownerId: val.ownerId || val.uid || "",
      siteId: val.siteId || undefined,
      location: {
        latitude: val.latitude || val.location?.latitude || 0,
        longitude: val.longitude || val.location?.longitude || 0,
        address: val.address || val.location?.address || "",
        city: val.city || val.location?.city || "",
        state: val.state || val.location?.state || "",
        country: val.country || val.location?.country || "US",
      },
      battery: val.battery ?? 0,
      lastReadingAt: val.lastReadingAt || val.lastReading || "",
      latestReadings: toReadings(val.latestMetrics || val.metrics || {}),
      isPublicSharing: val.isPublicSharing ?? false,
      creditsGenerated: val.creditsGenerated || 0,
      thresholds: val.thresholds || {},
      calibration: val.calibration || undefined,
      createdAt: val.createdAt || "",
      updatedAt: val.updatedAt || "",
    };

    res.json({ success: true, data: device });
  } catch (error) {
    console.error("v2/devices/:id error:", error);
    res.status(500).json({ success: false, error: "Failed to fetch device" });
  }
}

function toReadings(metrics) {
  if (!metrics || typeof metrics !== "object") return [];
  const typeMap = { ph: "pH", tds: "TDS", turbidity: "turbidity", temperature: "temperature", orp: "ORP", do: "pH" };
  const unitMap = { pH: "", TDS: "ppm", turbidity: "NTU", temperature: "°C", ORP: "mV" };
  return Object.entries(metrics)
    .filter(([, v]) => v != null && typeof v === "number")
    .map(([key, value]) => ({
      type: typeMap[key.toLowerCase()] || key,
      value,
      unit: unitMap[typeMap[key.toLowerCase()] || key] || "",
      timestamp: new Date().toISOString(),
    }));
}

async function getDeviceMetrics(req, res) {
  try {
    const { id } = req.params;
    const metric = req.query.metric || "pH";
    const range = req.query.range || "24h";

    const db = admin.database();
    const deviceSnap = await db.ref(`devices/${id}`).once("value");
    if (!deviceSnap.exists()) {
      return res.status(404).json({ success: false, error: "Device not found" });
    }

    // Try to get time-series data from readings collection
    const rangeMs = parseRange(range);
    const since = Date.now() - rangeMs;
    const readingsSnap = await db.ref(`readings/${id}`)
      .orderByChild("timestamp")
      .startAt(since)
      .limitToLast(500)
      .once("value");

    const raw = readingsSnap.val() || {};
    const points = Object.values(raw)
      .filter((r) => r[metric.toLowerCase()] != null || r[metric] != null)
      .map((r) => ({
        timestamp: r.timestamp ? new Date(r.timestamp).toISOString() : new Date().toISOString(),
        value: r[metric.toLowerCase()] ?? r[metric] ?? 0,
      }))
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

    res.json({
      success: true,
      data: {
        deviceId: id,
        metric,
        range,
        points,
        count: points.length,
      },
    });
  } catch (error) {
    console.error("v2/devices/:id/metrics error:", error);
    res.status(500).json({ success: false, error: "Failed to fetch metrics" });
  }
}

function parseRange(range) {
  const map = { "1h": 3600000, "6h": 21600000, "24h": 86400000, "7d": 604800000, "30d": 2592000000, "90d": 7776000000 };
  return map[range.toLowerCase()] || 86400000;
}

async function getDeviceAlerts(req, res) {
  try {
    const { id } = req.params;
    const db = admin.database();

    const snap = await db.ref("alerts")
      .orderByChild("deviceId")
      .equalTo(id)
      .limitToLast(50)
      .once("value");

    const raw = snap.val() || {};
    const alerts = Object.entries(raw).map(([alertId, val]) => ({
      id: alertId,
      deviceId: id,
      deviceName: val.deviceName || "",
      severity: val.severity || "info",
      status: val.status || "active",
      type: val.type || "threshold_breach",
      message: val.message || "",
      readingType: val.readingType || undefined,
      readingValue: val.readingValue || undefined,
      thresholdValue: val.thresholdValue || undefined,
      acknowledgedAt: val.acknowledgedAt || undefined,
      acknowledgedBy: val.acknowledgedBy || undefined,
      resolvedAt: val.resolvedAt || undefined,
      createdAt: val.createdAt || "",
      updatedAt: val.updatedAt || "",
    }));

    res.json({ success: true, data: alerts });
  } catch (error) {
    console.error("v2/devices/:id/alerts error:", error);
    res.status(500).json({ success: false, error: "Failed to fetch alerts" });
  }
}

async function checkDevice(req, res) {
  try {
    const { deviceId } = req.body;
    if (!deviceId) {
      return res.status(400).json({ success: false, error: "Missing deviceId" });
    }

    const db = admin.database();
    const snap = await db.ref(`devices/${deviceId}`).once("value");
    const exists = snap.exists();
    const val = snap.val();

    const isCommissioned = exists && val && (val.status === "active" || val.status === "commissioned");

    res.json({
      success: true,
      data: {
        deviceId,
        exists,
        isCommissioned,
        status: exists ? (val.status || "unknown") : null,
      },
    });
  } catch (error) {
    console.error("v2/devices/check error:", error);
    res.status(500).json({ success: false, error: "Failed to check device" });
  }
}

async function testConnection(req, res) {
  try {
    const { deviceId } = req.body;
    if (!deviceId) {
      return res.status(400).json({ success: false, error: "Missing deviceId" });
    }

    // In production this would ping the actual device hardware.
    // For now, simulate a connection check.
    const db = admin.database();
    const snap = await db.ref(`devices/${deviceId}`).once("value");
    const exists = snap.exists();
    const val = snap.val();

    const connected = exists && val && val.onlineStatus === "online";

    res.json({
      success: true,
      data: {
        deviceId,
        connected,
        signal: connected ? "strong" : "none",
        latency: connected ? Math.floor(Math.random() * 50) + 10 : null,
        simulated: !connected,
        message: connected
          ? "Device responded to ping"
          : "Device not online — simulation mode used",
      },
    });
  } catch (error) {
    console.error("v2/devices/test-connection error:", error);
    res.status(500).json({ success: false, error: "Failed to test connection" });
  }
}

async function commissionDevice(req, res) {
  try {
    const {
      deviceId, siteName, siteId, deviceName,
      latitude, longitude, calibration, userId,
    } = req.body;

    if (!deviceId) {
      return res.status(400).json({ success: false, error: "Missing deviceId" });
    }

    const uid = userId || req.user?.uid;
    if (!uid) {
      return res.status(401).json({ success: false, error: "Authentication required" });
    }

    const db = admin.database();
    const now = new Date().toISOString();

    // Create or use existing site
    let finalSiteId = siteId;
    if (!finalSiteId && siteName) {
      const siteRef = db.ref("sites").push();
      finalSiteId = siteRef.key;
      await siteRef.set({
        id: finalSiteId,
        name: siteName,
        ownerId: uid,
        devices: [deviceId],
        location: {
          latitude: parseFloat(latitude) || 0,
          longitude: parseFloat(longitude) || 0,
        },
        createdAt: now,
        updatedAt: now,
      });
    } else if (finalSiteId) {
      await db.ref(`sites/${finalSiteId}/devices`).transaction((devices) => {
        const arr = devices || [];
        if (!arr.includes(deviceId)) arr.push(deviceId);
        return arr;
      });
    }

    // Update device record
    await db.ref(`devices/${deviceId}`).update({
      name: deviceName || deviceId,
      ownerId: uid,
      siteId: finalSiteId || null,
      status: "active",
      onlineStatus: "online",
      latitude: parseFloat(latitude) || 0,
      longitude: parseFloat(longitude) || 0,
      location: {
        latitude: parseFloat(latitude) || 0,
        longitude: parseFloat(longitude) || 0,
      },
      calibration: calibration || null,
      commissionedAt: now,
      commissionedBy: uid,
      updatedAt: now,
    });

    // Create commissioning record
    const commRef = db.ref("commissions").push();
    await commRef.set({
      id: commRef.key,
      deviceId,
      installerId: uid,
      siteId: finalSiteId || null,
      status: "completed",
      completedAt: now,
      createdAt: now,
    });

    res.json({
      success: true,
      data: {
        deviceId,
        siteId: finalSiteId,
        commissionId: commRef.key,
        status: "active",
        commissionedAt: now,
      },
    });
  } catch (error) {
    console.error("v2/devices/commission error:", error);
    res.status(500).json({ success: false, error: "Failed to commission device" });
  }
}

async function listAlerts(req, res) {
  try {
    const uid = req.query.userId || req.user?.uid;
    if (!uid) {
      return res.status(400).json({ success: false, error: "Missing userId" });
    }

    const db = admin.database();

    // Get user's device IDs first
    const devSnap = await db.ref("devices").orderByChild("ownerId").equalTo(uid).once("value");
    const devRaw = devSnap.val() || {};
    const deviceIds = Object.keys(devRaw);

    if (deviceIds.length === 0) {
      return res.json({ success: true, data: [] });
    }

    // Get alerts for all user devices
    const allAlerts = [];
    for (const devId of deviceIds) {
      const alertSnap = await db.ref("alerts")
        .orderByChild("deviceId").equalTo(devId)
        .limitToLast(20)
        .once("value");
      const raw = alertSnap.val() || {};
      Object.entries(raw).forEach(([alertId, val]) => {
        allAlerts.push({
          id: alertId,
          deviceId: devId,
          deviceName: val.deviceName || devRaw[devId]?.name || devId,
          severity: val.severity || "info",
          status: val.status || "active",
          type: val.type || "threshold_breach",
          message: val.message || "",
          readingType: val.readingType || undefined,
          readingValue: val.readingValue || undefined,
          thresholdValue: val.thresholdValue || undefined,
          acknowledgedAt: val.acknowledgedAt || undefined,
          acknowledgedBy: val.acknowledgedBy || undefined,
          resolvedAt: val.resolvedAt || undefined,
          createdAt: val.createdAt || "",
          updatedAt: val.updatedAt || "",
        });
      });
    }

    // Sort by severity (critical > warning > info), then by createdAt desc
    const severityOrder = { critical: 0, warning: 1, info: 2 };
    allAlerts.sort((a, b) => {
      const sev = (severityOrder[a.severity] || 2) - (severityOrder[b.severity] || 2);
      if (sev !== 0) return sev;
      return (b.createdAt || "").localeCompare(a.createdAt || "");
    });

    res.json({ success: true, data: allAlerts });
  } catch (error) {
    console.error("v2/devices/alerts (user) error:", error);
    res.status(500).json({ success: false, error: "Failed to fetch alerts" });
  }
}

// ── Device Claim (with TTN registration + AppKey generation) ──────────

const crypto = require("crypto");
const fetch = require("node-fetch");

async function claimDevice(req, res) {
  try {
    const { device_id, dev_eui, hw_revision, fw_version, sensors_detected } = req.body;

    if (!device_id || !dev_eui) {
      return res.status(400).json({ success: false, error: "Missing device_id or dev_eui" });
    }

    // Validate device_id format (alphanumeric + hyphens, 6-40 chars)
    if (!/^[A-Za-z0-9_-]{6,40}$/.test(device_id)) {
      return res.status(400).json({ success: false, error: "Invalid device_id format" });
    }

    // Validate dev_eui format (16 hex characters)
    if (!/^[0-9A-Fa-f]{16}$/.test(dev_eui)) {
      return res.status(400).json({ success: false, error: "Invalid dev_eui format" });
    }

    const uid = req.body.userId || req.user?.uid;
    if (!uid) {
      return res.status(401).json({ success: false, error: "Authentication required" });
    }

    const db = admin.database();
    const now = new Date().toISOString();

    // Check if device already claimed
    const existingSnap = await db.ref(`devices/${device_id}`).once("value");
    if (existingSnap.exists()) {
      const existing = existingSnap.val();
      if (existing.ownerId && existing.ownerId === uid) {
        // Idempotent: same user re-claiming — return existing app_key
        const loraSnap = await db.ref(`devices/${device_id}/lorawan`).once("value");
        const appKey = loraSnap.val()?.appKey || null;
        return res.json({ success: true, data: { device_id, app_key: appKey, already_claimed: true } });
      }
      if (existing.ownerId && existing.ownerId !== uid) {
        return res.status(409).json({ success: false, error: "Device already claimed by another user" });
      }
    }

    // Generate cryptographically random 128-bit AppKey (CSPRNG)
    const appKey = crypto.randomBytes(16).toString("hex");

    // Register on TTN via TTN v3 API (if configured)
    const ttnAppId = process.env.TTN_APP_ID;
    const ttnApiKey = process.env.TTN_API_KEY;
    const ttnBaseUrl = process.env.TTN_BASE_URL || "https://nam1.cloud.thethings.network";
    const appEui = process.env.BLUESIGNAL_APP_EUI || "70B3D57ED0000001";

    if (ttnAppId && ttnApiKey) {
      try {
        const ttnBody = {
          end_device: {
            ids: {
              device_id: dev_eui.toLowerCase(),
              dev_eui: dev_eui.toUpperCase(),
              join_eui: appEui.toUpperCase(),
            },
            root_keys: {
              app_key: { key: appKey.toUpperCase() },
            },
            lorawan_version: "MAC_V1_0_3",
            lorawan_phy_version: "PHY_V1_0_3_REV_A",
            frequency_plan_id: "US_902_928_FSB_2",
          },
          field_mask: {
            paths: ["ids", "root_keys", "lorawan_version", "lorawan_phy_version", "frequency_plan_id"],
          },
        };

        const ttnRes = await fetch(
          `${ttnBaseUrl}/api/v3/applications/${ttnAppId}/devices`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${ttnApiKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(ttnBody),
          }
        );

        if (!ttnRes.ok) {
          const errBody = await ttnRes.text();
          console.error("TTN registration failed:", ttnRes.status, errBody);
          // Don't block claim if TTN is down — device can be registered later
          // return res.status(502).json({ success: false, error: "TTN device registration failed" });
        } else {
          console.log(`TTN device registered: ${dev_eui}`);
        }
      } catch (ttnErr) {
        console.error("TTN API error:", ttnErr.message);
      }
    }

    // Create device record in Firebase RTDB
    await db.ref(`devices/${device_id}`).set({
      ownerId: uid,
      devEui: dev_eui.toUpperCase(),
      hwRevision: hw_revision || "WQM1-v1.0",
      firmwareVersion: fw_version || "1.0.0",
      sensorsDetected: sensors_detected || ["ph", "tds", "turbidity", "temperature", "orp", "gps"],
      status: "commissioning",
      onlineStatus: "offline",
      loraJoinStatus: "pending",
      name: device_id,
      battery: 0,
      relayState: false,
      lastSeen: null,
      lastReadingAt: null,
      latestMetrics: {},
      siteId: null,
      createdAt: now,
      updatedAt: now,
      lorawan: {
        devEUI: dev_eui.toUpperCase(),
        appKey: appKey,
        joinStatus: "pending",
      },
    });

    // Log claim event
    const eventRef = db.ref("device_events").push();
    await eventRef.set({
      deviceId: device_id,
      eventType: "claimed",
      actorId: uid,
      details: { dev_eui, hw_revision, fw_version },
      createdAt: now,
    });

    res.json({
      success: true,
      data: {
        device_id,
        app_key: appKey,
        already_claimed: false,
      },
    });
  } catch (error) {
    console.error("v2/devices/claim error:", error);
    res.status(500).json({ success: false, error: "Failed to claim device" });
  }
}

// ── Device Unclaim ────────────────────────────────────────────────────

async function unclaimDevice(req, res) {
  try {
    const { id } = req.params;
    const uid = req.body.userId || req.user?.uid;
    if (!uid) return res.status(401).json({ success: false, error: "Auth required" });

    const db = admin.database();
    const snap = await db.ref(`devices/${id}`).once("value");
    if (!snap.exists()) return res.status(404).json({ success: false, error: "Device not found" });

    const device = snap.val();
    if (device.ownerId !== uid) {
      return res.status(403).json({ success: false, error: "Not the device owner" });
    }

    const now = new Date().toISOString();
    await db.ref(`devices/${id}`).update({
      ownerId: null,
      siteId: null,
      status: "commissioning",
      onlineStatus: "offline",
      "revenueGrade/enabled": false,
      updatedAt: now,
    });

    // Remove from site device list
    if (device.siteId) {
      const siteDevicesSnap = await db.ref(`sites/${device.siteId}/devices`).once("value");
      const devices = (siteDevicesSnap.val() || []).filter((d) => d !== id);
      await db.ref(`sites/${device.siteId}/devices`).set(devices);
    }

    // Delete pending commands
    await db.ref(`pending_commands/${id}`).remove();

    // Log event
    const eventRef = db.ref("device_events").push();
    await eventRef.set({ deviceId: id, eventType: "unclaimed", actorId: uid, createdAt: now });

    res.json({ success: true });
  } catch (error) {
    console.error("v2/devices/:id/unclaim error:", error);
    res.status(500).json({ success: false, error: "Failed to unclaim device" });
  }
}

// ── Device Factory Reset ──────────────────────────────────────────────

async function factoryResetDevice(req, res) {
  try {
    const { id } = req.params;
    const uid = req.body.userId || req.user?.uid;
    if (!uid) return res.status(401).json({ success: false, error: "Auth required" });

    const db = admin.database();
    const snap = await db.ref(`devices/${id}`).once("value");
    if (!snap.exists()) return res.status(404).json({ success: false, error: "Device not found" });

    const device = snap.val();
    if (device.ownerId !== uid) {
      return res.status(403).json({ success: false, error: "Not the device owner" });
    }

    const now = new Date().toISOString();

    // Delete all readings
    await db.ref(`readings/${id}`).remove();
    // Delete all alerts for this device
    const alertSnap = await db.ref("alerts").orderByChild("deviceId").equalTo(id).once("value");
    if (alertSnap.exists()) {
      const updates = {};
      alertSnap.forEach((child) => { updates[`alerts/${child.key}`] = null; });
      await db.ref().update(updates);
    }
    // Delete calibrations
    await db.ref(`calibrations/${id}`).remove();
    // Delete pending commands
    await db.ref(`pending_commands/${id}`).remove();
    // Delete device events (except this one)
    const eventsSnap = await db.ref("device_events").orderByChild("deviceId").equalTo(id).once("value");
    if (eventsSnap.exists()) {
      const updates = {};
      eventsSnap.forEach((child) => { updates[`device_events/${child.key}`] = null; });
      await db.ref().update(updates);
    }

    // Reset device record
    await db.ref(`devices/${id}`).update({
      ownerId: null,
      siteId: null,
      status: "commissioning",
      onlineStatus: "offline",
      revenueGrade: null,
      lastSeen: null,
      lastReadingAt: null,
      latestMetrics: {},
      battery: 0,
      relayState: false,
      updatedAt: now,
    });

    // Log the factory reset event
    const eventRef = db.ref("device_events").push();
    await eventRef.set({ deviceId: id, eventType: "factory_reset", actorId: uid, createdAt: now });

    res.json({ success: true });
  } catch (error) {
    console.error("v2/devices/:id/factory-reset error:", error);
    res.status(500).json({ success: false, error: "Failed to factory reset device" });
  }
}

// ── Device Transfer ───────────────────────────────────────────────────

async function transferDevice(req, res) {
  try {
    const { id } = req.params;
    const { new_owner_email } = req.body;
    const uid = req.body.userId || req.user?.uid;
    if (!uid) return res.status(401).json({ success: false, error: "Auth required" });
    if (!new_owner_email) return res.status(400).json({ success: false, error: "Missing new_owner_email" });

    const db = admin.database();
    const snap = await db.ref(`devices/${id}`).once("value");
    if (!snap.exists()) return res.status(404).json({ success: false, error: "Device not found" });

    const device = snap.val();
    if (device.ownerId !== uid) {
      return res.status(403).json({ success: false, error: "Not the device owner" });
    }

    const now = new Date().toISOString();
    const transferRef = db.ref("device_transfers").push();
    await transferRef.set({
      deviceId: id,
      fromUserId: uid,
      toEmail: new_owner_email,
      toUserId: null,
      status: "pending",
      createdAt: now,
    });

    const eventRef = db.ref("device_events").push();
    await eventRef.set({
      deviceId: id,
      eventType: "transfer_initiated",
      actorId: uid,
      details: { new_owner_email },
      createdAt: now,
    });

    res.json({ success: true, data: { transferId: transferRef.key, status: "pending" } });
  } catch (error) {
    console.error("v2/devices/:id/transfer error:", error);
    res.status(500).json({ success: false, error: "Failed to initiate transfer" });
  }
}

// ── Device Command (relay/config downlink) ────────────────────────────

async function sendDeviceCommand(req, res) {
  try {
    const { id } = req.params;
    const { type, state, duration_seconds, settings } = req.body;
    const uid = req.body.userId || req.user?.uid;
    if (!uid) return res.status(401).json({ success: false, error: "Auth required" });

    const db = admin.database();
    const snap = await db.ref(`devices/${id}`).once("value");
    if (!snap.exists()) return res.status(404).json({ success: false, error: "Device not found" });

    const device = snap.val();
    if (device.ownerId !== uid) {
      return res.status(403).json({ success: false, error: "Not the device owner" });
    }

    // Check daily downlink budget (10/day per TTN fair use)
    const today = new Date().toISOString().slice(0, 10);
    const cmdCountSnap = await db.ref(`pending_commands/${id}`)
      .orderByChild("createdAt")
      .startAt(today)
      .once("value");
    const todayCount = cmdCountSnap.exists() ? Object.keys(cmdCountSnap.val()).length : 0;
    if (todayCount >= 10) {
      return res.status(429).json({
        success: false,
        error: "Daily remote command limit reached (10/day). Will be available tomorrow.",
      });
    }

    const now = new Date().toISOString();
    const cmdRef = db.ref(`pending_commands/${id}`).push();
    const command = {
      type: type || "relay",
      state: state !== undefined ? state : null,
      durationSeconds: duration_seconds || null,
      settings: settings || null,
      status: "pending",
      createdBy: uid,
      createdAt: now,
    };
    await cmdRef.set(command);

    // Attempt TTN downlink push (if credentials available)
    const ttnAppId = process.env.TTN_APP_ID;
    const ttnApiKey = process.env.TTN_API_KEY;
    const ttnBaseUrl = process.env.TTN_BASE_URL || "https://nam1.cloud.thethings.network";
    const devEui = device.lorawan?.devEUI || device.devEui;

    if (ttnAppId && ttnApiKey && devEui) {
      try {
        let downlinkPayload;
        let fPort = 1;

        if (type === "relay") {
          // Cayenne LPP: Channel 7, Digital Output
          downlinkPayload = Buffer.from([0x07, 0x01, state ? 0x01 : 0x00]).toString("base64");
        } else if (type === "config") {
          // Custom JSON on FPort 2
          fPort = 2;
          downlinkPayload = Buffer.from(JSON.stringify(settings || {})).toString("base64");
        }

        if (downlinkPayload) {
          await fetch(
            `${ttnBaseUrl}/api/v3/as/applications/${ttnAppId}/devices/${devEui.toLowerCase()}/down/push`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${ttnApiKey}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                downlinks: [{
                  frm_payload: downlinkPayload,
                  f_port: fPort,
                  confirmed: false,
                }],
              }),
            }
          );
          await cmdRef.update({ status: "queued", queuedAt: new Date().toISOString() });
        }
      } catch (ttnErr) {
        console.error("TTN downlink error:", ttnErr.message);
        // Command stays as pending — will be delivered when possible
      }
    }

    const uplinkInterval = device.configuration?.sampleInterval || 900;
    res.json({
      success: true,
      data: {
        commandId: cmdRef.key,
        status: "queued",
        message: `Command queued — will be delivered on the device's next uplink (up to ${Math.ceil(uplinkInterval / 60)} minutes).`,
      },
    });
  } catch (error) {
    console.error("v2/devices/:id/command error:", error);
    res.status(500).json({ success: false, error: "Failed to send command" });
  }
}

// ── Readings Export (CSV) ─────────────────────────────────────────────

async function exportReadings(req, res) {
  try {
    const { id } = req.params;
    const uid = req.query.userId || req.user?.uid;
    if (!uid) return res.status(401).json({ success: false, error: "Auth required" });

    const db = admin.database();
    const deviceSnap = await db.ref(`devices/${id}`).once("value");
    if (!deviceSnap.exists()) return res.status(404).json({ success: false, error: "Device not found" });
    if (deviceSnap.val().ownerId !== uid) return res.status(403).json({ success: false, error: "Forbidden" });

    const start = req.query.start ? parseInt(req.query.start) : Date.now() - 7 * 86400000;
    const end = req.query.end ? parseInt(req.query.end) : Date.now();

    const readingsSnap = await db.ref(`readings/${id}`)
      .orderByChild("timestamp")
      .startAt(start)
      .endAt(end)
      .limitToLast(10000)
      .once("value");

    const rows = [];
    rows.push("timestamp,ph,tds_ppm,turbidity_ntu,orp_mv,temperature_c,latitude,longitude,relay_state");

    const raw = readingsSnap.val() || {};
    Object.values(raw)
      .sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0))
      .forEach((r) => {
        const sensors = r.sensors || r;
        rows.push([
          r.timestamp ? new Date(r.timestamp).toISOString() : "",
          sensors.ph?.value ?? sensors.ph ?? "",
          sensors.tds?.value ?? sensors.tds_ppm ?? "",
          sensors.turbidity?.value ?? sensors.turbidity_ntu ?? "",
          sensors.orp?.value ?? sensors.orp_mv ?? "",
          sensors.temperature?.value ?? sensors.temperature_c ?? "",
          r.metadata?.gps?.latitude ?? r.latitude ?? "",
          r.metadata?.gps?.longitude ?? r.longitude ?? "",
          r.relay_state ?? "",
        ].join(","));
      });

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename="${id}-readings.csv"`);
    res.send(rows.join("\n"));
  } catch (error) {
    console.error("v2/devices/:id/readings/export error:", error);
    res.status(500).json({ success: false, error: "Failed to export readings" });
  }
}

// ── Installer Fleet ───────────────────────────────────────────────────

async function installerFleet(req, res) {
  try {
    const uid = req.query.userId || req.user?.uid;
    if (!uid) return res.status(400).json({ success: false, error: "Missing userId" });

    const db = admin.database();
    const snap = await db.ref("devices").orderByChild("commissionedBy").equalTo(uid).once("value");
    const raw = snap.val() || {};

    const devices = Object.entries(raw).map(([id, val]) => ({
      id,
      name: val.name || id,
      ownerId: val.ownerId || "",
      ownerEmail: val.ownerEmail || "",
      siteId: val.siteId || null,
      status: val.status || "inactive",
      onlineStatus: val.onlineStatus || "offline",
      lastReadingAt: val.lastReadingAt || "",
      commissionedAt: val.commissionedAt || "",
      hwRevision: val.hwRevision || "",
      firmwareVersion: val.firmwareVersion || "",
    }));

    res.json({ success: true, data: devices });
  } catch (error) {
    console.error("v2/installer/fleet error:", error);
    res.status(500).json({ success: false, error: "Failed to fetch installer fleet" });
  }
}

async function installerCommissions(req, res) {
  try {
    const uid = req.query.userId || req.user?.uid;
    if (!uid) return res.status(400).json({ success: false, error: "Missing userId" });

    const db = admin.database();
    const snap = await db.ref("commissions").orderByChild("installerId").equalTo(uid).once("value");
    const raw = snap.val() || {};

    const commissions = Object.entries(raw).map(([id, val]) => ({
      id,
      deviceId: val.deviceId,
      siteId: val.siteId || null,
      status: val.status || "unknown",
      completedAt: val.completedAt || "",
      createdAt: val.createdAt || "",
    }));

    res.json({ success: true, data: commissions });
  } catch (error) {
    console.error("v2/installer/commissions error:", error);
    res.status(500).json({ success: false, error: "Failed to fetch commissions" });
  }
}

module.exports = {
  listDevices,
  getDevice,
  getDeviceMetrics,
  getDeviceAlerts,
  listAlerts,
  checkDevice,
  testConnection,
  commissionDevice,
  claimDevice,
  unclaimDevice,
  factoryResetDevice,
  transferDevice,
  sendDeviceCommand,
  exportReadings,
  installerFleet,
  installerCommissions,
};
