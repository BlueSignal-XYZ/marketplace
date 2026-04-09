/**
 * Scheduled: Data Retention — runs weekly on Sunday at 03:00 UTC.
 *
 * TODO: Before 50+ devices are active, implement full archival pipeline:
 * 1. Export readings older than 12 months to Cloud Storage as JSON
 * 2. Delete exported readings from RTDB
 * 3. Revenue-grade data must be retained for verification period + 3 years minimum
 *
 * A device reporting every 15 minutes generates ~35,000 readings/year.
 * At 50 devices that's 1.75M records annually. Without pruning, RTDB
 * query performance degrades and costs grow linearly.
 *
 * Current implementation: count-only audit log. No deletion yet.
 * Deletion requires the Cloud Storage archival step first — we never
 * delete data that hasn't been archived.
 */

const functions = require("firebase-functions/v1");
const admin = require("firebase-admin");

const ARCHIVE_THRESHOLD_DAYS = 365; // Readings older than this are archival candidates
const REVENUE_GRADE_RETENTION_YEARS = 3; // Revenue-grade data kept 3 years minimum

exports.auditDataRetention = functions.pubsub
  .schedule("every sunday 03:00")
  .timeZone("UTC")
  .onRun(async () => {
    const db = admin.database();
    const now = Date.now();
    const archiveThreshold = now - ARCHIVE_THRESHOLD_DAYS * 86400000;

    const devicesSnap = await db.ref("devices").once("value");
    const devices = devicesSnap.val() || {};

    let totalReadings = 0;
    let archivableReadings = 0;
    const deviceStats = [];

    for (const [deviceId] of Object.entries(devices)) {
      // Count total readings
      const totalSnap = await db.ref(`readings/${deviceId}`)
        .once("value");
      const total = totalSnap.exists() ? Object.keys(totalSnap.val()).length : 0;

      // Count readings older than threshold
      const oldSnap = await db.ref(`readings/${deviceId}`)
        .orderByChild("timestamp")
        .endAt(archiveThreshold)
        .once("value");
      const old = oldSnap.exists() ? Object.keys(oldSnap.val()).length : 0;

      totalReadings += total;
      archivableReadings += old;

      if (total > 0) {
        deviceStats.push({ deviceId, total, archivable: old });
      }
    }

    console.log(
      `Data retention audit: ${totalReadings} total readings across ${deviceStats.length} devices. ` +
      `${archivableReadings} readings older than ${ARCHIVE_THRESHOLD_DAYS} days are archival candidates.`
    );

    // Log audit event
    const auditRef = db.ref("system_events").push();
    await auditRef.set({
      type: "data_retention_audit",
      totalReadings,
      archivableReadings,
      deviceCount: deviceStats.length,
      thresholdDays: ARCHIVE_THRESHOLD_DAYS,
      timestamp: now,
      createdAt: new Date().toISOString(),
      // TODO: When archival is implemented, add:
      // archivedCount, archiveBucket, deleteCount
    });

    return null;
  });
