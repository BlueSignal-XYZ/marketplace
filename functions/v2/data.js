/**
 * v2 Data Endpoints
 * GET /v2/data/sensors/public — List public sensor feeds
 * GET /v2/data/watersheds     — List watershed summaries
 */

const admin = require("firebase-admin");

async function getPublicSensors(req, res) {
  try {
    const db = admin.database();
    const snap = await db.ref("devices").once("value");
    const raw = snap.val() || {};

    const sensors = Object.entries(raw)
      .map(([id, val]) => ({
        id,
        name: val.name || id,
        region: val.region || val.location || "",
        latitude: val.latitude || val.lat || null,
        longitude: val.longitude || val.lng || null,
        status: val.status || "unknown",
        lastReading: val.lastReading || null,
        metrics: val.latestMetrics || {},
      }))
      .filter((s) => s.status !== "decommissioned");

    res.json({
      success: true,
      data: sensors,
      total: sensors.length,
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
      id,
      name: val.name || id,
      state: val.state || "",
      area: val.area || "",
      sensorCount: val.sensorCount || 0,
      health: val.health || "unknown",
      totalCredits: val.totalCredits || 0,
      metrics: val.aggregateMetrics || {},
    }));

    res.json({
      success: true,
      data: watersheds,
      total: watersheds.length,
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
