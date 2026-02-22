/**
 * Calibration Tracking Endpoints
 *
 * POST /v2/devices/:id/calibrations — log a probe calibration
 * GET  /v2/devices/:id/calibrations — get calibration history
 */

const admin = require("firebase-admin");

const CALIBRATION_VALIDITY_DAYS = 90;
const EXPIRING_SOON_DAYS = 7;

async function logCalibration(req, res) {
  try {
    const { id } = req.params;
    const {
      probe_type, standards_used, calibrated_at,
      offset_value, slope_value, photo_urls,
    } = req.body;

    const uid = req.user?.uid || req.body.userId;
    if (!uid) return res.status(401).json({ success: false, error: "Auth required" });

    if (!probe_type || !["ph", "tds", "turbidity", "orp"].includes(probe_type)) {
      return res.status(400).json({ success: false, error: "Invalid probe_type" });
    }

    const db = admin.database();
    const deviceSnap = await db.ref(`devices/${id}`).once("value");
    if (!deviceSnap.exists()) return res.status(404).json({ success: false, error: "Device not found" });

    const device = deviceSnap.val();
    if (device.ownerId !== uid) {
      return res.status(403).json({ success: false, error: "Not the device owner" });
    }

    const now = new Date().toISOString();
    const calibratedAtTs = calibrated_at ? new Date(calibrated_at).getTime() : Date.now();
    const expiresAtTs = calibratedAtTs + CALIBRATION_VALIDITY_DAYS * 86400000;

    const calRef = db.ref(`calibrations/${id}`).push();
    const record = {
      id: calRef.key,
      deviceId: id,
      probeType: probe_type,
      calibratedAt: calibratedAtTs,
      calibratedBy: uid,
      standardsUsed: standards_used || [],
      offsetValue: offset_value !== undefined ? Number(offset_value) : 0,
      slopeValue: slope_value !== undefined ? Number(slope_value) : null,
      photoUrls: photo_urls || [],
      expiresAt: expiresAtTs,
      status: "valid",
      createdAt: now,
    };

    await calRef.set(record);

    // Log device event
    const eventRef = db.ref("device_events").push();
    await eventRef.set({
      deviceId: id,
      eventType: "calibration_logged",
      actorId: uid,
      details: { probe_type, standards_used, offset_value, slope_value },
      createdAt: now,
    });

    res.json({ success: true, data: record });
  } catch (error) {
    console.error("v2/devices/:id/calibrations POST error:", error);
    res.status(500).json({ success: false, error: "Failed to log calibration" });
  }
}

async function getCalibrations(req, res) {
  try {
    const { id } = req.params;
    const uid = req.user?.uid || req.query.userId;
    if (!uid) return res.status(401).json({ success: false, error: "Auth required" });

    const db = admin.database();
    const deviceSnap = await db.ref(`devices/${id}`).once("value");
    if (!deviceSnap.exists()) return res.status(404).json({ success: false, error: "Device not found" });
    if (deviceSnap.val().ownerId !== uid) {
      return res.status(403).json({ success: false, error: "Not the device owner" });
    }

    const snap = await db.ref(`calibrations/${id}`).once("value");
    const raw = snap.val() || {};
    const now = Date.now();

    const calibrations = Object.values(raw).map((cal) => ({
      ...cal,
      // Recompute status live
      status: !cal.expiresAt ? "valid"
        : cal.expiresAt < now ? "expired"
        : (cal.expiresAt - now) < EXPIRING_SOON_DAYS * 86400000 ? "expiring_soon"
        : "valid",
    }));

    // Sort newest first
    calibrations.sort((a, b) => (b.calibratedAt || 0) - (a.calibratedAt || 0));

    res.json({ success: true, data: calibrations });
  } catch (error) {
    console.error("v2/devices/:id/calibrations GET error:", error);
    res.status(500).json({ success: false, error: "Failed to fetch calibrations" });
  }
}

module.exports = { logCalibration, getCalibrations };
