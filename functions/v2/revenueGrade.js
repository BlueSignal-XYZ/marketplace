/**
 * Revenue Grade Endpoints — enable/disable/status for credit generation.
 *
 * POST /v2/devices/:id/revenue-grade/enable
 * POST /v2/devices/:id/revenue-grade/disable
 * GET  /v2/devices/:id/revenue-grade/status
 * PATCH /v2/devices/:id/revenue-grade/baseline — update baseline (locked once complete)
 */

const admin = require("firebase-admin");

// ── Enable Revenue Grade ──────────────────────────────────────────────

async function enableRevenueGrade(req, res) {
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
    const revenueGrade = {
      enabled: true,
      enabledAt: now,
      enabledBy: uid,
      baselineType: req.body.baselineType || null,
      baselineStart: req.body.baselineStart || null,
      baselineDurationDays: req.body.baselineDurationDays || null,
      baselineComplete: false,
      baselineParams: req.body.baselineParams || null,
      baselineLockedAt: null, // Locked once baseline is complete
      wqtProjectId: null,
      wqtLinked: false,
      flowEstimate: req.body.flowEstimate || null,
      huc12Code: req.body.huc12Code || null,
      watershedName: req.body.watershedName || null,
      waterBodyType: req.body.waterBodyType || null,
      dischargeDescription: req.body.dischargeDescription || null,
      improvementMethod: req.body.improvementMethod || null,
      eligibleCredits: req.body.eligibleCredits || [],
      description: req.body.description || "",
    };

    await db.ref(`devices/${id}/revenueGrade`).set(revenueGrade);
    await db.ref(`devices/${id}/updatedAt`).set(now);

    // Log event
    const eventRef = db.ref("device_events").push();
    await eventRef.set({
      deviceId: id,
      eventType: "revenue_grade_enabled",
      actorId: uid,
      createdAt: now,
    });

    res.json({ success: true, data: revenueGrade });
  } catch (error) {
    console.error("revenue-grade/enable error:", error);
    res.status(500).json({ success: false, error: "Failed to enable revenue grade" });
  }
}

// ── Disable Revenue Grade ─────────────────────────────────────────────

async function disableRevenueGrade(req, res) {
  try {
    const { id } = req.params;
    const uid = req.body.userId || req.user?.uid;
    if (!uid) return res.status(401).json({ success: false, error: "Auth required" });

    const db = admin.database();
    const snap = await db.ref(`devices/${id}`).once("value");
    if (!snap.exists()) return res.status(404).json({ success: false, error: "Device not found" });

    if (snap.val().ownerId !== uid) {
      return res.status(403).json({ success: false, error: "Not the device owner" });
    }

    const now = new Date().toISOString();
    await db.ref(`devices/${id}/revenueGrade/enabled`).set(false);
    await db.ref(`devices/${id}/revenueGrade/disabledAt`).set(now);
    await db.ref(`devices/${id}/updatedAt`).set(now);

    const eventRef = db.ref("device_events").push();
    await eventRef.set({
      deviceId: id,
      eventType: "revenue_grade_disabled",
      actorId: uid,
      createdAt: now,
    });

    res.json({ success: true });
  } catch (error) {
    console.error("revenue-grade/disable error:", error);
    res.status(500).json({ success: false, error: "Failed to disable revenue grade" });
  }
}

// ── Revenue Grade Status ──────────────────────────────────────────────

async function getRevenueGradeStatus(req, res) {
  try {
    const { id } = req.params;
    const uid = req.query.userId || req.user?.uid;
    if (!uid) return res.status(401).json({ success: false, error: "Auth required" });

    const db = admin.database();
    const snap = await db.ref(`devices/${id}`).once("value");
    if (!snap.exists()) return res.status(404).json({ success: false, error: "Device not found" });

    const device = snap.val();
    if (device.ownerId !== uid) {
      return res.status(403).json({ success: false, error: "Not the device owner" });
    }

    const rg = device.revenueGrade || { enabled: false };

    // Compute uptime (30-day rolling)
    let uptime30d = null;
    if (rg.enabled) {
      const thirtyDaysAgo = Date.now() - 30 * 86400000;
      const interval = device.configuration?.sampleInterval || 900;
      const expectedReadings = Math.floor((30 * 86400) / interval);

      const readingsSnap = await db.ref(`readings/${id}`)
        .orderByChild("timestamp")
        .startAt(thirtyDaysAgo)
        .once("value");
      const actualReadings = readingsSnap.exists() ? Object.keys(readingsSnap.val()).length : 0;
      uptime30d = expectedReadings > 0
        ? Math.round((actualReadings / expectedReadings) * 1000) / 10
        : 0;
    }

    // Get calibration status
    let calibrationStatus = {};
    if (rg.enabled) {
      const calSnap = await db.ref(`calibrations/${id}`).once("value");
      const cals = calSnap.val() || {};
      const now = Date.now();

      for (const probe of ["ph", "tds", "turbidity", "orp"]) {
        const probeCals = Object.values(cals).filter((c) => c.probeType === probe);
        const latest = probeCals.sort((a, b) => (b.calibratedAt || 0) - (a.calibratedAt || 0))[0];
        if (!latest) {
          calibrationStatus[probe] = "not_calibrated";
        } else if (latest.expiresAt && latest.expiresAt < now) {
          calibrationStatus[probe] = "expired";
        } else if (latest.expiresAt && latest.expiresAt - now < 7 * 86400000) {
          calibrationStatus[probe] = "expiring_soon";
        } else {
          calibrationStatus[probe] = "valid";
        }
      }
    }

    // Get credit totals from credit_projects
    let creditTotals = {};
    if (rg.wqtProjectId) {
      const projSnap = await db.ref(`credit_projects/${rg.wqtProjectId}/totalCredits`).once("value");
      creditTotals = projSnap.val() || {};
    }

    // Compute baseline progress
    let baselineProgress = null;
    if (rg.baselineType === "monitoring" && rg.baselineStart && !rg.baselineComplete) {
      const start = new Date(rg.baselineStart).getTime();
      const duration = (rg.baselineDurationDays || 60) * 86400000;
      const elapsed = Date.now() - start;
      baselineProgress = {
        daysCurrent: Math.floor(elapsed / 86400000),
        daysTotal: rg.baselineDurationDays || 60,
        percentComplete: Math.min(100, Math.round((elapsed / duration) * 100)),
      };
    }

    res.json({
      success: true,
      data: {
        enabled: rg.enabled || false,
        enabledAt: rg.enabledAt || null,
        baselineType: rg.baselineType || null,
        baselineComplete: rg.baselineComplete || false,
        baselineProgress,
        baselineParams: rg.baselineParams || null,
        baselineLockedAt: rg.baselineLockedAt || null,
        wqtProjectId: rg.wqtProjectId || null,
        wqtLinked: rg.wqtLinked || false,
        calibrationStatus,
        uptime30d,
        creditTotals,
        flowEstimate: rg.flowEstimate || null,
        huc12Code: rg.huc12Code || null,
        watershedName: rg.watershedName || null,
        eligibleCredits: rg.eligibleCredits || [],
      },
    });
  } catch (error) {
    console.error("revenue-grade/status error:", error);
    res.status(500).json({ success: false, error: "Failed to get revenue grade status" });
  }
}

// ── Update Revenue Grade (partial update, with baseline immutability) ─

async function updateRevenueGrade(req, res) {
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

    const rg = device.revenueGrade || {};
    const updates = req.body;

    // Gap 6: Baseline immutability — reject baseline changes once locked
    if (rg.baselineLockedAt) {
      const baselineFields = ["baselineType", "baselineParams", "baselineDurationDays", "baselineStart"];
      const attemptedBaselineChange = baselineFields.some((f) => updates[f] !== undefined);
      if (attemptedBaselineChange) {
        return res.status(409).json({
          success: false,
          error: "Baseline is locked and cannot be modified after credit generation has begun. "
            + `Locked at: ${rg.baselineLockedAt}`,
        });
      }
    }

    const now = new Date().toISOString();
    const allowedFields = [
      "baselineType", "baselineStart", "baselineDurationDays", "baselineParams",
      "flowEstimate", "huc12Code", "watershedName", "waterBodyType",
      "dischargeDescription", "improvementMethod", "eligibleCredits", "description",
      "wqtProjectId", "wqtLinked",
    ];

    const safeUpdates = {};
    for (const key of allowedFields) {
      if (updates[key] !== undefined) {
        safeUpdates[`revenueGrade/${key}`] = updates[key];
      }
    }
    safeUpdates[`devices/${id}/updatedAt`] = now;

    if (Object.keys(safeUpdates).length > 0) {
      // Apply updates relative to device path
      const dbUpdates = {};
      for (const [key, val] of Object.entries(safeUpdates)) {
        if (key.startsWith("devices/")) {
          dbUpdates[key] = val;
        } else {
          dbUpdates[`devices/${id}/${key}`] = val;
        }
      }
      await db.ref().update(dbUpdates);
    }

    res.json({ success: true });
  } catch (error) {
    console.error("revenue-grade/update error:", error);
    res.status(500).json({ success: false, error: "Failed to update revenue grade" });
  }
}

module.exports = {
  enableRevenueGrade,
  disableRevenueGrade,
  getRevenueGradeStatus,
  updateRevenueGrade,
};
