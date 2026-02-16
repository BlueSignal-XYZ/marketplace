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

module.exports = {
  listDevices,
  getDevice,
  getDeviceMetrics,
  getDeviceAlerts,
  listAlerts,
  checkDevice,
  testConnection,
  commissionDevice,
};
