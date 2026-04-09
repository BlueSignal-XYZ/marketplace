/**
 * Scheduled: Device Health Check — runs every 5 minutes.
 *
 * Marks devices as offline if last_seen > 2 × uplink_interval + 60s.
 * Creates "device_offline" alerts and "came_online" events.
 */

const functions = require("firebase-functions/v1");
const admin = require("firebase-admin");

exports.checkDeviceHealth = functions.pubsub
  .schedule("every 5 minutes")
  .onRun(async () => {
    const db = admin.database();
    const now = Date.now();

    const devicesSnap = await db.ref("devices").once("value");
    const devices = devicesSnap.val() || {};

    for (const [deviceId, device] of Object.entries(devices)) {
      if (!device.ownerId) continue; // Unclaimed devices

      const uplinkInterval = device.configuration?.sampleInterval || 900;
      const offlineThreshold = (2 * uplinkInterval + 60) * 1000; // ms
      const lastSeen = device.lastSeen || device.health?.lastSeen || 0;
      const currentStatus = device.onlineStatus || "unknown";

      if (currentStatus === "online" || currentStatus === "unknown") {
        if (lastSeen && (now - lastSeen) > offlineThreshold) {
          // Mark offline
          await db.ref(`devices/${deviceId}`).update({
            onlineStatus: "offline",
            status: device.status === "active" ? "inactive" : device.status,
            updatedAt: new Date().toISOString(),
          });

          // Create offline alert
          const alertRef = db.ref("alerts").push();
          await alertRef.set({
            deviceId,
            deviceName: device.name || deviceId,
            severity: "warning",
            status: "active",
            type: "device_offline",
            message: `${device.name || deviceId} hasn't reported in ${Math.round((now - lastSeen) / 60000)} minutes`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });

          // Log event
          const eventRef = db.ref("device_events").push();
          await eventRef.set({
            deviceId,
            eventType: "went_offline",
            details: { lastSeen, threshold: offlineThreshold },
            createdAt: new Date().toISOString(),
          });

          console.log(`Device ${deviceId} marked offline (last seen ${Math.round((now - lastSeen) / 60000)}m ago)`);
        }
      }
    }

    return null;
  });
