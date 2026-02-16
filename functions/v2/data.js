/**
 * v2 Data Endpoints
 * GET /v2/data/sensors/public — List public sensor feeds (→ PublicSensor[])
 * GET /v2/data/watersheds     — List watershed summaries (→ Watershed[])
 */

const admin = require("firebase-admin");

// Helper: convert raw device metrics to SensorReading[]
function toReadings(metrics) {
  if (!metrics || typeof metrics !== "object") return [];
  const typeMap = { ph: "pH", tds: "TDS", turbidity: "turbidity", temperature: "temperature", orp: "ORP" };
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

async function getPublicSensors(req, res) {
  try {
    const db = admin.database();
    const snap = await db.ref("devices").once("value");
    const raw = snap.val() || {};

    const sensors = Object.entries(raw)
      .map(([id, val]) => ({
        // PublicSensor shape
        id,
        deviceId: val.deviceId || id,
        name: val.name || id,
        location: {
          latitude: val.latitude || val.lat || 0,
          longitude: val.longitude || val.lng || 0,
          address: val.address || "",
          city: val.city || "",
          state: val.state || "",
          country: val.country || "US",
        },
        status: val.status || "unknown",
        lastReadingAt: val.lastReadingAt || val.lastReading || "",
        latestReadings: toReadings(val.latestMetrics || val.metrics || {}),
        waterQualityIndex: val.waterQualityIndex || val.wqi || 0,
        isPublic: true,
        watershedId: val.watershedId || val.watershed || undefined,
        createdAt: val.createdAt || "",
        updatedAt: val.updatedAt || "",
      }))
      .filter((s) => s.status !== "decommissioned");

    res.json({
      success: true,
      data: sensors,
    });
  } catch (error) {
    console.error("v2/data/sensors error:", error);
    res.status(500).json({ success: false, error: "Failed to fetch sensors" });
  }
}

async function getWatersheds(req, res) {
  try {
    const db = admin.database();
    const snap = await db.ref("watersheds").once("value");
    const raw = snap.val() || {};

    const watersheds = Object.entries(raw).map(([id, val]) => ({
      // Watershed shape
      id,
      name: val.name || id,
      state: val.state || "",
      region: val.region || val.area || "",
      stats: {
        activeSensors: val.sensorCount || val.activeSensors || 0,
        totalReadings: val.totalReadings || 0,
        avgWaterQualityIndex: val.avgWaterQualityIndex || val.wqi || 0,
        qualityTrend: val.qualityTrend || "stable",
        nutrientLoading: {
          nitrogen: val.nutrientLoading?.nitrogen || 0,
          phosphorus: val.nutrientLoading?.phosphorus || 0,
        },
        activeCredits: val.totalCredits || val.activeCredits || 0,
        participatingSensors: val.participatingSensors || val.sensorCount || 0,
        regulatoryContext: val.regulatoryContext || undefined,
      },
      createdAt: val.createdAt || "",
      updatedAt: val.updatedAt || "",
    }));

    res.json({
      success: true,
      data: watersheds,
    });
  } catch (error) {
    console.error("v2/data/watersheds error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch watersheds",
    });
  }
}

module.exports = { getPublicSensors, getWatersheds };
