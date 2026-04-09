/**
 * Scheduled: Calibration Expiry Check — runs daily at 06:00 UTC.
 *
 * Transitions calibration status: valid → expiring_soon (7 days out) → expired.
 * When calibration expires on a revenue-grade device, credit generation pauses.
 */

const functions = require("firebase-functions/v1");
const admin = require("firebase-admin");

const EXPIRING_SOON_DAYS = 7;

exports.checkCalibrationExpiry = functions.pubsub
  .schedule("every day 06:00")
  .timeZone("UTC")
  .onRun(async () => {
    const db = admin.database();
    const now = Date.now();
    const expiringSoonThreshold = now + EXPIRING_SOON_DAYS * 86400000;

    // Get all devices with revenue grade enabled
    const devicesSnap = await db.ref("devices").once("value");
    const devices = devicesSnap.val() || {};

    for (const [deviceId, device] of Object.entries(devices)) {
      if (!device.revenueGrade?.enabled) continue;

      const calSnap = await db.ref(`calibrations/${deviceId}`).once("value");
      const calibrations = calSnap.val() || {};

      const probeStatuses = {};
      let anyExpired = false;
      let anyExpiringSoon = false;

      for (const probe of ["ph", "tds", "turbidity", "orp"]) {
        const probeCals = Object.values(calibrations)
          .filter((c) => c.probeType === probe)
          .sort((a, b) => (b.calibratedAt || 0) - (a.calibratedAt || 0));

        const latest = probeCals[0];

        if (!latest) {
          probeStatuses[probe] = "not_calibrated";
          anyExpired = true;
        } else if (latest.expiresAt && latest.expiresAt < now) {
          probeStatuses[probe] = "expired";
          anyExpired = true;

          // Update the calibration record status
          if (latest.status !== "expired") {
            await db.ref(`calibrations/${deviceId}/${latest.id || Object.keys(calibrations).find(
              (k) => calibrations[k] === latest
            )}/status`).set("expired");
          }
        } else if (latest.expiresAt && latest.expiresAt < expiringSoonThreshold) {
          probeStatuses[probe] = "expiring_soon";
          anyExpiringSoon = true;

          if (latest.status !== "expiring_soon") {
            const calKey = latest.id || Object.keys(calibrations).find(
              (k) => calibrations[k] === latest
            );
            if (calKey) {
              await db.ref(`calibrations/${deviceId}/${calKey}/status`).set("expiring_soon");
            }
          }
        } else {
          probeStatuses[probe] = "valid";
        }
      }

      // Update device calibration status summary
      await db.ref(`devices/${deviceId}/revenueGrade/calibrationStatus`).set(probeStatuses);

      // Create alerts for expiring/expired calibrations
      if (anyExpired) {
        const expiredProbes = Object.entries(probeStatuses)
          .filter(([, s]) => s === "expired")
          .map(([p]) => p);

        const alertRef = db.ref("alerts").push();
        await alertRef.set({
          deviceId,
          deviceName: device.name || deviceId,
          severity: "critical",
          status: "active",
          type: "calibration_expired",
          message: `Calibration expired for ${expiredProbes.join(", ")} — recalibrate to resume credit generation`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      } else if (anyExpiringSoon) {
        const soonProbes = Object.entries(probeStatuses)
          .filter(([, s]) => s === "expiring_soon")
          .map(([p]) => p);

        const alertRef = db.ref("alerts").push();
        await alertRef.set({
          deviceId,
          deviceName: device.name || deviceId,
          severity: "warning",
          status: "active",
          type: "calibration_expiring",
          message: `${soonProbes.join(", ")} probe calibration expires within 7 days — recalibrate to continue generating credits`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }
    }

    return null;
  });
