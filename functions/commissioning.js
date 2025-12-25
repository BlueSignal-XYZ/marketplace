/**
 * BlueSignal Device Commissioning Cloud Functions
 * Handles the complete device commissioning workflow
 */

const functions = require("firebase-functions");
const admin = require("firebase-admin");

// Commission workflow steps
const COMMISSION_STEPS = [
  { step: 1, name: "device_scan", required: true },
  { step: 2, name: "site_selection", required: true },
  { step: 3, name: "location_capture", required: true },
  { step: 4, name: "photo_upload", required: true },
  { step: 5, name: "connectivity_test", required: true },
  { step: 6, name: "sensor_calibration", required: false },
  { step: 7, name: "review_confirm", required: true },
];

/**
 * Verify authorization for commissioning operations
 */
const verifyCommissionAuth = async (token, db, commission = null) => {
  const decodedToken = await admin.auth().verifyIdToken(token);
  const uid = decodedToken.uid;

  // Get user role
  const userSnapshot = await db.ref(`users/${uid}/profile`).once("value");
  const userProfile = userSnapshot.val();
  const role = userProfile?.role;

  // If commission provided, check specific access
  if (commission) {
    const isOwner = commission.ownerId === uid;
    const isInstaller = commission.installerId === uid;
    const isAdmin = role === "admin";

    if (!isOwner && !isInstaller && !isAdmin) {
      throw new Error("Not authorized for this commission");
    }
  }

  return { uid, role, profile: userProfile };
};

/**
 * Initiate a new commissioning process
 */
const initiateCommission = async (req, res) => {
  const { deviceId, siteId } = req.body;

  if (!deviceId) {
    return res.status(400).json({ error: "Missing deviceId" });
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = authHeader.split("Bearer ")[1];
  const db = admin.database();

  try {
    const { uid, role } = await verifyCommissionAuth(token, db);

    // Verify device exists
    const deviceSnapshot = await db.ref(`devices/${deviceId}`).once("value");
    if (!deviceSnapshot.exists()) {
      return res.status(404).json({ error: "Device not found" });
    }

    const device = deviceSnapshot.val();

    // Check authorization
    const isOwner = device.ownership?.ownerId === uid;
    const isInstaller = role === "installer";
    const isAdmin = role === "admin";

    if (!isOwner && !isInstaller && !isAdmin) {
      return res.status(403).json({ error: "Not authorized to commission this device" });
    }

    // Check if device can be commissioned
    const allowedStatuses = ["registered", "unregistered", "decommissioned"];
    if (!allowedStatuses.includes(device.installation?.status)) {
      return res.status(400).json({
        error: `Cannot commission device with status: ${device.installation?.status}`,
      });
    }

    // Check for existing active commission
    const existingCommissions = await db.ref("commissions")
      .orderByChild("deviceId")
      .equalTo(deviceId)
      .once("value");

    const existingData = existingCommissions.val() || {};
    const activeCommission = Object.entries(existingData).find(
      ([, c]) => c.status !== "completed" && c.status !== "failed"
    );

    if (activeCommission) {
      return res.status(400).json({
        error: "Device has an active commission in progress",
        commissionId: activeCommission[0],
      });
    }

    // Create commission
    const commissionId = db.ref("commissions").push().key;
    const now = Date.now();

    const steps = COMMISSION_STEPS.map((s) => ({
      step: s.step,
      name: s.name,
      required: s.required,
      status: "pending",
      completedAt: null,
      data: null,
    }));

    const commission = {
      deviceId,
      siteId: siteId || null,
      installerId: isInstaller ? uid : null,
      ownerId: device.ownership?.ownerId || uid,
      orderId: device.orderId || null,
      status: "initiated",
      workflow: {
        currentStep: 1,
        totalSteps: COMMISSION_STEPS.length,
        steps,
      },
      deviceLink: null,
      location: null,
      photos: [],
      tests: [],
      timestamps: {
        initiated: now,
        completed: null,
        lastUpdated: now,
      },
    };

    // Save commission and update device status
    const updates = {
      [`commissions/${commissionId}`]: commission,
      [`devices/${deviceId}/installation/status`]: "commissioned",
    };

    await db.ref().update(updates);

    res.json({
      success: true,
      commissionId,
      steps: COMMISSION_STEPS,
      currentStep: 1,
    });
  } catch (error) {
    console.error("Failed to initiate commission:", error);
    res.status(500).json({ error: error.message || "Failed to initiate commission" });
  }
};

/**
 * Update a commissioning step
 */
const updateCommissionStep = async (req, res) => {
  const { commissionId, stepName, stepData } = req.body;

  if (!commissionId || !stepName) {
    return res.status(400).json({ error: "Missing commissionId or stepName" });
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = authHeader.split("Bearer ")[1];
  const db = admin.database();

  try {
    // Get commission
    const commissionSnapshot = await db.ref(`commissions/${commissionId}`).once("value");
    if (!commissionSnapshot.exists()) {
      return res.status(404).json({ error: "Commission not found" });
    }

    const commission = commissionSnapshot.val();

    // Verify authorization
    const { uid } = await verifyCommissionAuth(token, db, commission);

    // Check if commission is in progress
    if (commission.status === "completed" || commission.status === "failed") {
      return res.status(400).json({ error: "Commission is no longer active" });
    }

    // Find the step
    const stepIndex = commission.workflow.steps.findIndex((s) => s.name === stepName);
    if (stepIndex === -1) {
      return res.status(400).json({ error: "Invalid step name" });
    }

    const now = Date.now();
    const updates = {
      [`workflow/steps/${stepIndex}/status`]: "completed",
      [`workflow/steps/${stepIndex}/completedAt`]: now,
      [`workflow/steps/${stepIndex}/data`]: stepData || null,
      "timestamps/lastUpdated": now,
    };

    // Handle specific step logic
    switch (stepName) {
      case "device_scan":
        if (!stepData?.method || !stepData?.serialNumber) {
          return res.status(400).json({ error: "Missing method or serialNumber in stepData" });
        }
        updates["deviceLink"] = {
          method: stepData.method,
          scannedAt: now,
          verifiedSerial: stepData.serialNumber,
        };
        break;

      case "site_selection":
        if (!stepData?.siteId) {
          return res.status(400).json({ error: "Missing siteId in stepData" });
        }
        updates["siteId"] = stepData.siteId;
        break;

      case "location_capture":
        if (!stepData?.coordinates) {
          return res.status(400).json({ error: "Missing coordinates in stepData" });
        }
        updates["location"] = {
          method: stepData.method || "manual",
          coordinates: stepData.coordinates,
          address: stepData.address || null,
        };
        // Update device location
        await db.ref(`devices/${commission.deviceId}/installation/location`).set({
          lat: stepData.coordinates.lat,
          lng: stepData.coordinates.lng,
          accuracy: stepData.coordinates.accuracy || null,
          source: stepData.method || "manual",
        });
        break;

      case "photo_upload":
        if (!stepData?.photos || !Array.isArray(stepData.photos)) {
          return res.status(400).json({ error: "Missing photos array in stepData" });
        }
        const existingPhotos = commission.photos || [];
        updates["photos"] = [...existingPhotos, ...stepData.photos];
        break;

      case "connectivity_test":
        if (!stepData?.tests || !Array.isArray(stepData.tests)) {
          return res.status(400).json({ error: "Missing tests array in stepData" });
        }
        updates["tests"] = stepData.tests;

        // Check if all tests passed
        const allTestsPassed = stepData.tests.every((t) => t.result === "passed");
        if (!allTestsPassed) {
          // Update status but don't fail yet - user can retry
          updates[`workflow/steps/${stepIndex}/status`] = "failed";
        }
        break;

      case "sensor_calibration":
        if (stepData?.offsets) {
          await db.ref(`devices/${commission.deviceId}/configuration/calibration`).set({
            lastCalibrated: now,
            calibratedBy: uid,
            offsets: stepData.offsets,
          });
        }
        break;

      case "review_confirm":
        // Final review step - just mark as completed
        break;

      default:
        break;
    }

    // Calculate next step
    const currentStepNum = stepIndex + 1;
    const nextStep = currentStepNum + 1;

    if (nextStep <= commission.workflow.totalSteps) {
      updates["workflow/currentStep"] = nextStep;
    }

    // Update commission
    await db.ref(`commissions/${commissionId}`).update(updates);

    res.json({
      success: true,
      stepCompleted: stepName,
      nextStep: nextStep <= commission.workflow.totalSteps ? nextStep : null,
      isComplete: nextStep > commission.workflow.totalSteps,
    });
  } catch (error) {
    console.error("Failed to update commission step:", error);
    res.status(500).json({ error: error.message || "Failed to update step" });
  }
};

/**
 * Complete a commissioning process
 */
const completeCommission = async (req, res) => {
  const { commissionId } = req.body;

  if (!commissionId) {
    return res.status(400).json({ error: "Missing commissionId" });
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = authHeader.split("Bearer ")[1];
  const db = admin.database();

  try {
    // Get commission
    const commissionSnapshot = await db.ref(`commissions/${commissionId}`).once("value");
    if (!commissionSnapshot.exists()) {
      return res.status(404).json({ error: "Commission not found" });
    }

    const commission = commissionSnapshot.val();

    // Verify authorization
    const { uid } = await verifyCommissionAuth(token, db, commission);

    // Check all required steps are completed
    const incompleteRequired = commission.workflow.steps.filter(
      (s) => s.required && s.status !== "completed"
    );

    if (incompleteRequired.length > 0) {
      return res.status(400).json({
        error: "Not all required steps completed",
        incompleteSteps: incompleteRequired.map((s) => s.name),
      });
    }

    const now = Date.now();

    // Update commission status
    await db.ref(`commissions/${commissionId}`).update({
      status: "completed",
      "timestamps/completed": now,
      "timestamps/lastUpdated": now,
    });

    // Update device to active
    await db.ref(`devices/${commission.deviceId}/installation`).update({
      status: "active",
      siteId: commission.siteId,
      installerId: commission.installerId,
      commissionedAt: now,
      commissionedBy: uid,
    });

    // Add device to site
    if (commission.siteId) {
      const siteDevicesSnapshot = await db.ref(`sites/${commission.siteId}/devices`).once("value");
      const siteDevices = siteDevicesSnapshot.val() || [];
      if (!siteDevices.includes(commission.deviceId)) {
        siteDevices.push(commission.deviceId);
        await db.ref(`sites/${commission.siteId}/devices`).set(siteDevices);
      }
    }

    // Update installer stats if applicable
    if (commission.installerId) {
      await db.ref(`installers/${commission.installerId}/stats`).transaction((stats) => {
        if (!stats) stats = { totalInstalls: 0, activeDevices: 0 };
        stats.totalInstalls = (stats.totalInstalls || 0) + 1;
        stats.activeDevices = (stats.activeDevices || 0) + 1;
        stats.lastInstall = now;
        return stats;
      });
    }

    // Log activity
    await db.ref(`users/${commission.ownerId}/activity`).push({
      type: "device_commissioned",
      timestamp: now,
      metadata: {
        deviceId: commission.deviceId,
        siteId: commission.siteId,
        commissionId,
      },
    });

    res.json({
      success: true,
      deviceId: commission.deviceId,
      siteId: commission.siteId,
      status: "active",
    });
  } catch (error) {
    console.error("Failed to complete commission:", error);
    res.status(500).json({ error: error.message || "Failed to complete commission" });
  }
};

/**
 * Get commission details
 */
const getCommission = async (req, res) => {
  const { commissionId } = req.body;

  if (!commissionId) {
    return res.status(400).json({ error: "Missing commissionId" });
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = authHeader.split("Bearer ")[1];
  const db = admin.database();

  try {
    // Get commission
    const commissionSnapshot = await db.ref(`commissions/${commissionId}`).once("value");
    if (!commissionSnapshot.exists()) {
      return res.status(404).json({ error: "Commission not found" });
    }

    const commission = commissionSnapshot.val();

    // Verify authorization
    await verifyCommissionAuth(token, db, commission);

    res.json({ commission, commissionId });
  } catch (error) {
    console.error("Failed to get commission:", error);
    res.status(500).json({ error: error.message || "Failed to get commission" });
  }
};

/**
 * List commissions for a user
 */
const listCommissions = async (req, res) => {
  const { filters = {} } = req.body;

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = authHeader.split("Bearer ")[1];
  const db = admin.database();

  try {
    const { uid, role } = await verifyCommissionAuth(token, db);

    let query;
    if (role === "admin") {
      // Admins can see all
      query = db.ref("commissions");
    } else if (role === "installer") {
      // Installers see their assigned commissions
      query = db.ref("commissions").orderByChild("installerId").equalTo(uid);
    } else {
      // Owners see their devices
      query = db.ref("commissions").orderByChild("ownerId").equalTo(uid);
    }

    const snapshot = await query.once("value");
    const data = snapshot.val() || {};

    let commissions = Object.entries(data).map(([id, c]) => ({
      id,
      ...c,
    }));

    // Apply filters
    if (filters.status) {
      commissions = commissions.filter((c) => c.status === filters.status);
    }
    if (filters.deviceId) {
      commissions = commissions.filter((c) => c.deviceId === filters.deviceId);
    }
    if (filters.siteId) {
      commissions = commissions.filter((c) => c.siteId === filters.siteId);
    }

    // Sort by most recent first
    commissions.sort((a, b) => (b.timestamps?.initiated || 0) - (a.timestamps?.initiated || 0));

    res.json({ commissions });
  } catch (error) {
    console.error("Failed to list commissions:", error);
    res.status(500).json({ error: error.message || "Failed to list commissions" });
  }
};

/**
 * Cancel a commission
 */
const cancelCommission = async (req, res) => {
  const { commissionId, reason } = req.body;

  if (!commissionId) {
    return res.status(400).json({ error: "Missing commissionId" });
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = authHeader.split("Bearer ")[1];
  const db = admin.database();

  try {
    const commissionSnapshot = await db.ref(`commissions/${commissionId}`).once("value");
    if (!commissionSnapshot.exists()) {
      return res.status(404).json({ error: "Commission not found" });
    }

    const commission = commissionSnapshot.val();

    // Verify authorization
    await verifyCommissionAuth(token, db, commission);

    if (commission.status === "completed") {
      return res.status(400).json({ error: "Cannot cancel completed commission" });
    }

    const now = Date.now();

    // Update commission
    await db.ref(`commissions/${commissionId}`).update({
      status: "failed",
      cancelReason: reason || null,
      "timestamps/lastUpdated": now,
    });

    // Reset device status
    await db.ref(`devices/${commission.deviceId}/installation/status`).set("registered");

    res.json({ success: true });
  } catch (error) {
    console.error("Failed to cancel commission:", error);
    res.status(500).json({ error: error.message || "Failed to cancel commission" });
  }
};

/**
 * Run commission tests
 */
const runCommissionTests = async (req, res) => {
  const { commissionId, deviceId, tests } = req.body;

  if (!commissionId || !deviceId) {
    return res.status(400).json({ error: "Missing commissionId or deviceId" });
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = authHeader.split("Bearer ")[1];
  const db = admin.database();

  try {
    const commissionSnapshot = await db.ref(`commissions/${commissionId}`).once("value");
    if (!commissionSnapshot.exists()) {
      return res.status(404).json({ error: "Commission not found" });
    }

    const commission = commissionSnapshot.val();
    await verifyCommissionAuth(token, db, commission);

    // Get device data for testing
    const deviceSnapshot = await db.ref(`devices/${deviceId}`).once("value");
    const device = deviceSnapshot.val();

    // Run tests
    const testResults = [];
    const testsToRun = tests || ["power", "connectivity", "sensors", "cloud_ingestion"];

    for (const testName of testsToRun) {
      let result = { testName, testedAt: Date.now() };

      switch (testName) {
        case "power":
          // Check battery level
          const batteryLevel = device.health?.batteryLevel;
          result.value = batteryLevel;
          result.expectedRange = { min: 10, max: 100 };
          result.result = batteryLevel >= 10 ? "passed" : "failed";
          break;

        case "connectivity":
          // Check signal strength
          const signalStrength = device.health?.signalStrength;
          result.value = signalStrength;
          result.expectedRange = { min: -100, max: -30 };
          result.result = signalStrength && signalStrength >= -100 ? "passed" : "warning";
          break;

        case "sensors":
          // Check last sensor reading
          const lastSeen = device.health?.lastSeen;
          const ageMinutes = lastSeen ? (Date.now() - lastSeen) / 60000 : Infinity;
          result.value = ageMinutes;
          result.expectedRange = { min: 0, max: 30 };
          result.result = ageMinutes <= 30 ? "passed" : "warning";
          break;

        case "cloud_ingestion":
          // Check if data is reaching the cloud
          const readingsSnapshot = await db.ref(`readings/${deviceId}`)
            .limitToLast(1)
            .once("value");
          const hasRecentReadings = readingsSnapshot.exists();
          result.value = hasRecentReadings ? "Data received" : "No data";
          result.result = hasRecentReadings ? "passed" : "warning";
          break;

        default:
          result.result = "skipped";
      }

      testResults.push(result);
    }

    // Store test results
    await db.ref(`commissions/${commissionId}/tests`).set(testResults);

    const allPassed = testResults.every((t) => t.result === "passed");
    const hasFailures = testResults.some((t) => t.result === "failed");

    res.json({
      success: true,
      testResults,
      overallStatus: hasFailures ? "failed" : allPassed ? "passed" : "warning",
    });
  } catch (error) {
    console.error("Failed to run commission tests:", error);
    res.status(500).json({ error: error.message || "Failed to run tests" });
  }
};

module.exports = {
  initiateCommission,
  updateCommissionStep,
  completeCommission,
  getCommission,
  listCommissions,
  cancelCommission,
  runCommissionTests,
  COMMISSION_STEPS,
};
