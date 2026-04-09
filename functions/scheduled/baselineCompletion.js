/**
 * Scheduled: Baseline Completion Check — runs daily at 00:05 UTC.
 *
 * For monitoring baselines: checks if now > baselineStart + baselineDurationDays.
 * When complete, computes baseline statistics and locks the baseline.
 */

const functions = require("firebase-functions/v1");
const admin = require("firebase-admin");

exports.checkBaselineCompletion = functions.pubsub
  .schedule("every day 00:05")
  .timeZone("UTC")
  .onRun(async () => {
    const db = admin.database();
    const now = Date.now();

    // Find all credit projects with pending baselines
    const projSnap = await db.ref("credit_projects")
      .orderByChild("status").equalTo("pending_baseline")
      .once("value");

    const projects = projSnap.val() || {};

    for (const [projectId, project] of Object.entries(projects)) {
      if (project.baselineType !== "monitoring") continue;
      if (project.baselineComplete) continue;

      const start = new Date(project.baselineStart).getTime();
      const duration = (project.baselineDurationDays || 60) * 86400000;
      const endDate = start + duration;

      if (now < endDate) continue; // Not yet complete

      console.log(`Baseline complete for project ${projectId} (device: ${project.deviceId})`);

      // Fetch readings from baseline period
      const readingsSnap = await db.ref(`readings/${project.deviceId}`)
        .orderByChild("timestamp")
        .startAt(start)
        .endAt(endDate)
        .once("value");

      const readings = readingsSnap.val() ? Object.values(readingsSnap.val()) : [];

      // Compute baseline statistics
      const stats = _computeBaselineStats(readings);

      const nowIso = new Date().toISOString();

      // Update project
      await db.ref(`credit_projects/${projectId}`).update({
        baselineComplete: true,
        baselineEnd: new Date(endDate).toISOString(),
        baselineLockedAt: nowIso,
        baselineStats: stats,
        baselineParams: stats.means, // Use computed means as baseline values
        status: "active",
        updatedAt: nowIso,
      });

      // Update device revenue grade
      if (project.deviceId) {
        await db.ref(`devices/${project.deviceId}/revenueGrade`).update({
          baselineComplete: true,
          baselineLockedAt: nowIso,
        });
      }

      // Log event
      const eventRef = db.ref("device_events").push();
      await eventRef.set({
        deviceId: project.deviceId,
        eventType: "baseline_complete",
        details: {
          projectId,
          durationDays: project.baselineDurationDays,
          readingsCount: readings.length,
          stats,
        },
        createdAt: nowIso,
      });
    }

    return null;
  });

/**
 * Compute mean, std dev, and percentiles for each sensor parameter.
 */
function _computeBaselineStats(readings) {
  const fields = {
    ph: [],
    tds_ppm: [],
    turbidity_ntu: [],
    orp_mv: [],
    temperature_c: [],
  };

  for (const r of readings) {
    const sensors = r.sensors || r;
    for (const [field, arr] of Object.entries(fields)) {
      const val = sensors[field]?.value ?? sensors[field];
      if (typeof val === "number" && !isNaN(val)) {
        arr.push(val);
      }
    }
  }

  const stats = { means: {}, stdDevs: {}, counts: {} };

  for (const [field, values] of Object.entries(fields)) {
    if (values.length === 0) continue;

    const n = values.length;
    const mean = values.reduce((a, b) => a + b, 0) / n;
    const variance = values.reduce((sum, v) => sum + (v - mean) ** 2, 0) / n;
    const stdDev = Math.sqrt(variance);

    // Clean field name for baseline params (e.g., tds_ppm → tds)
    const cleanName = field.replace("_ppm", "").replace("_ntu", "").replace("_mv", "").replace("_c", "");

    stats.means[cleanName] = Math.round(mean * 100) / 100;
    stats.stdDevs[cleanName] = Math.round(stdDev * 100) / 100;
    stats.counts[cleanName] = n;
  }

  return stats;
}
