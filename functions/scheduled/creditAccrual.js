/**
 * Scheduled: Daily Credit Accrual — runs daily at 01:00 UTC.
 *
 * For all active revenue-grade devices with complete baselines,
 * compute daily credit accruals automatically.
 *
 * Conversion factors (Gap 5):
 *   lbs = (baseline_mg_L - measured_mg_L) × flow_m3 × 0.002205
 *   kg  = (baseline_mg_L - measured_mg_L) × flow_m3 × 0.001
 */

const functions = require("firebase-functions/v1");
const admin = require("firebase-admin");

// Unit conversion constants — the math that makes every credit correct
const CONVERSION = {
  nitrogen: {
    // mg/L × m³ → lbs: delta × flow × (1000 L/m³) × (1g/1000mg) × (1lb/453.592g)
    factor: 0.002205,
    unit: "lbs",
  },
  phosphorus: {
    factor: 0.002205,
    unit: "lbs",
  },
};

exports.calculateDailyCredits = functions.pubsub
  .schedule("every day 01:00")
  .timeZone("UTC")
  .onRun(async () => {
    const db = admin.database();
    const now = Date.now();
    const oneDayAgo = now - 86400000;

    // Find all active projects
    const projSnap = await db.ref("credit_projects")
      .orderByChild("status").equalTo("active")
      .once("value");

    const projects = projSnap.val() || {};
    let totalAccruals = 0;

    for (const [projectId, project] of Object.entries(projects)) {
      if (!project.baselineComplete) continue;

      const deviceId = project.deviceId;
      if (!deviceId) continue;

      // Check device is still revenue-grade enabled
      const deviceSnap = await db.ref(`devices/${deviceId}/revenueGrade/enabled`).once("value");
      if (!deviceSnap.val()) continue;

      // Check calibration validity
      const calSnap = await db.ref(`calibrations/${deviceId}`).once("value");
      const cals = calSnap.val() ? Object.values(calSnap.val()) : [];
      const calValid = _allProbesCalibrated(cals, oneDayAgo, now);

      if (!calValid) {
        console.log(`Skipping ${projectId}: calibration invalid`);
        continue;
      }

      // Fetch yesterday's readings
      const readingsSnap = await db.ref(`readings/${deviceId}`)
        .orderByChild("timestamp")
        .startAt(oneDayAgo)
        .endAt(now)
        .once("value");

      const readings = readingsSnap.val() ? Object.values(readingsSnap.val()) : [];
      if (readings.length === 0) continue;

      // Check uptime
      const interval = 900; // 15 min
      const expected = Math.floor(86400 / interval); // 96
      const uptimePct = Math.round((readings.length / expected) * 1000) / 10;

      if (uptimePct < 80) {
        console.log(`Skipping ${projectId}: uptime ${uptimePct}% < 80%`);
        continue;
      }

      // Get flow estimate
      const flowEstimate = project.flowEstimate || {};
      const flowM3PerDay = flowEstimate.value || 0;
      if (flowM3PerDay <= 0) continue;

      // Calculate credits per eligible type
      for (const creditType of project.eligibleCredits || []) {
        const conv = CONVERSION[creditType];
        if (!conv) continue;

        const baselineParams = project.baselineParams || {};
        let baselineValue = null;
        if (creditType === "nitrogen") baselineValue = baselineParams.tn ?? baselineParams.nitrogen;
        if (creditType === "phosphorus") baselineValue = baselineParams.tp ?? baselineParams.phosphorus;
        if (baselineValue === null || baselineValue === undefined) continue;

        // Average measured value from readings
        const sensorValues = readings
          .map((r) => {
            const s = r.sensors || r;
            // TDS as proxy for nitrogen, pH for phosphorus (simplified for v1)
            if (creditType === "nitrogen") return s.tds?.value ?? s.tds_ppm;
            if (creditType === "phosphorus") return s.ph?.value ?? s.ph;
            return null;
          })
          .filter((v) => typeof v === "number" && !isNaN(v));

        if (sensorValues.length === 0) continue;

        const measuredAvg = sensorValues.reduce((a, b) => a + b, 0) / sensorValues.length;
        const delta = baselineValue - measuredAvg;
        if (delta <= 0) continue; // No improvement

        // credit_amount = delta_mg_L × flow_m3 × conversion_factor
        const amount = delta * flowM3PerDay * conv.factor;
        if (amount <= 0.0001) continue; // Too small to record

        // Store accrual
        const accrualRef = db.ref("credit_accruals").push();
        await accrualRef.set({
          id: accrualRef.key,
          projectId,
          periodStart: oneDayAgo,
          periodEnd: now,
          creditType,
          amount: Math.round(amount * 10000) / 10000,
          unit: conv.unit,
          baselineValue,
          measuredValue: Math.round(measuredAvg * 100) / 100,
          flowVolume: flowM3PerDay,
          dataPoints: readings.length,
          uptimePct,
          calibrationValid: calValid,
          status: "pending_verification",
          verificationNotes: null,
          createdAt: new Date().toISOString(),
        });

        // Update project totals
        const currentTotal = project.totalCredits?.[creditType] || 0;
        await db.ref(`credit_projects/${projectId}/totalCredits/${creditType}`).set(
          Math.round((currentTotal + amount) * 10000) / 10000
        );

        totalAccruals++;
      }
    }

    console.log(`Daily credit accrual complete: ${totalAccruals} accruals across ${Object.keys(projects).length} projects`);
    return null;
  });

function _allProbesCalibrated(calibrations, periodStart, periodEnd) {
  for (const probe of ["ph", "tds", "turbidity", "orp"]) {
    const probeCals = calibrations.filter((c) => c.probeType === probe);
    if (probeCals.length === 0) return false;
    const covers = probeCals.some((c) => {
      return (c.calibratedAt || 0) <= periodStart && (c.expiresAt || Infinity) >= periodEnd;
    });
    if (!covers) return false;
  }
  return true;
}
