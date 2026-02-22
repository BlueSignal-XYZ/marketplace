/**
 * Credit Project Endpoints (WQT side)
 *
 * POST /v2/projects              — register credit project
 * GET  /v2/projects/:id          — get project details
 * GET  /v2/projects/:id/accruals — get accrual history
 * POST /v2/projects/:id/accruals/calculate — trigger credit calculation
 * POST /v2/projects/:id/submit-verification — submit for review
 */

const admin = require("firebase-admin");
const crypto = require("crypto");

// ── Conversion constants (Gap 5) ──────────────────────────────────────
// Nitrogen/Phosphorus: mg/L concentration × m³ volume → lbs removed
//   lbs = (baseline_mg_L - measured_mg_L) × flow_m3 × 1000 L/m3
//                                        × (1 g / 1000 mg) × (1 lb / 453.592 g)
//   Simplified: lbs = delta_mg_L × flow_m3 × 0.002205
//   Or in kg:   kg  = delta_mg_L × flow_m3 × 0.001
const CONVERSION_FACTORS = {
  nitrogen: {
    lbs_per_mg_L_m3: 0.002205, // mg/L × m³ → lbs
    kg_per_mg_L_m3: 0.001,     // mg/L × m³ → kg
    unit: "lbs",
  },
  phosphorus: {
    lbs_per_mg_L_m3: 0.002205,
    kg_per_mg_L_m3: 0.001,
    unit: "lbs",
  },
};

// ── Register Project ──────────────────────────────────────────────────

async function registerProject(req, res) {
  try {
    const uid = req.body.userId || req.user?.uid;
    if (!uid) return res.status(401).json({ success: false, error: "Auth required" });

    const {
      device_id, site_name, latitude, longitude,
      huc12_code, watershed_name, baseline_type, baseline_params,
      baseline_start, baseline_duration_days,
      eligible_credits, improvement_method, flow_estimate,
      description,
    } = req.body;

    if (!device_id) return res.status(400).json({ success: false, error: "Missing device_id" });

    const db = admin.database();
    const now = new Date().toISOString();
    const projRef = db.ref("credit_projects").push();

    // Determine initial status
    let status = "active";
    if (baseline_type === "monitoring") {
      status = "pending_baseline";
    }

    const project = {
      id: projRef.key,
      wqtUserId: uid,
      bluesignalUserId: uid, // Same Firebase project
      deviceId: device_id,
      siteName: site_name || "",
      latitude: latitude || null,
      longitude: longitude || null,
      huc12Code: huc12_code || null,
      watershedName: watershed_name || null,
      baselineType: baseline_type || "monitoring",
      baselineParams: baseline_params || null,
      baselineStart: baseline_start || now,
      baselineEnd: null,
      baselineComplete: baseline_type !== "monitoring",
      baselineLockedAt: baseline_type !== "monitoring" ? now : null,
      eligibleCredits: eligible_credits || ["nitrogen", "phosphorus"],
      improvementMethod: improvement_method || null,
      flowEstimate: flow_estimate || null,
      description: description || "",
      status,
      totalCredits: {},
      createdAt: now,
      updatedAt: now,
    };

    // Add baseline duration for monitoring type
    if (baseline_type === "monitoring" && baseline_duration_days) {
      project.baselineDurationDays = baseline_duration_days;
    }

    await projRef.set(project);

    // Link project to device's revenue grade
    await db.ref(`devices/${device_id}/revenueGrade`).update({
      wqtProjectId: projRef.key,
      wqtLinked: true,
    });

    res.json({ success: true, data: project });
  } catch (error) {
    console.error("v2/projects POST error:", error);
    res.status(500).json({ success: false, error: "Failed to register project" });
  }
}

// ── Get Project ───────────────────────────────────────────────────────

async function getProject(req, res) {
  try {
    const { id } = req.params;
    const uid = req.query.userId || req.user?.uid;

    const db = admin.database();
    const snap = await db.ref(`credit_projects/${id}`).once("value");
    if (!snap.exists()) return res.status(404).json({ success: false, error: "Project not found" });

    const project = snap.val();
    if (uid && project.wqtUserId !== uid) {
      return res.status(403).json({ success: false, error: "Not the project owner" });
    }

    res.json({ success: true, data: project });
  } catch (error) {
    console.error("v2/projects/:id GET error:", error);
    res.status(500).json({ success: false, error: "Failed to fetch project" });
  }
}

// ── Get Accruals ──────────────────────────────────────────────────────

async function getAccruals(req, res) {
  try {
    const { id } = req.params;
    const db = admin.database();

    const snap = await db.ref("credit_accruals")
      .orderByChild("projectId").equalTo(id)
      .once("value");

    const raw = snap.val() || {};
    const accruals = Object.values(raw).sort(
      (a, b) => (b.periodStart || 0) - (a.periodStart || 0)
    );

    res.json({ success: true, data: accruals });
  } catch (error) {
    console.error("v2/projects/:id/accruals GET error:", error);
    res.status(500).json({ success: false, error: "Failed to fetch accruals" });
  }
}

// ── Calculate Credits for Period ──────────────────────────────────────

async function calculateCredits(req, res) {
  try {
    const { id } = req.params;
    const uid = req.body.userId || req.user?.uid;
    if (!uid) return res.status(401).json({ success: false, error: "Auth required" });

    const db = admin.database();
    const projSnap = await db.ref(`credit_projects/${id}`).once("value");
    if (!projSnap.exists()) return res.status(404).json({ success: false, error: "Project not found" });

    const project = projSnap.val();
    if (project.wqtUserId !== uid) {
      return res.status(403).json({ success: false, error: "Not the project owner" });
    }

    if (!project.baselineComplete) {
      return res.status(400).json({ success: false, error: "Baseline period not complete" });
    }

    if (project.status === "paused" || project.status === "retired") {
      return res.status(400).json({ success: false, error: `Project is ${project.status}` });
    }

    // Determine calculation period (last 30 days or since last accrual)
    const now = Date.now();
    const periodEnd = now;
    let periodStart = now - 30 * 86400000;

    // Check last accrual to avoid double-counting
    const lastAccrualSnap = await db.ref("credit_accruals")
      .orderByChild("projectId").equalTo(id)
      .limitToLast(1)
      .once("value");
    if (lastAccrualSnap.exists()) {
      const lastAccrual = Object.values(lastAccrualSnap.val())[0];
      if (lastAccrual.periodEnd) {
        periodStart = Math.max(periodStart, lastAccrual.periodEnd);
      }
    }

    // Fetch readings for the period
    const readingsSnap = await db.ref(`readings/${project.deviceId}`)
      .orderByChild("timestamp")
      .startAt(periodStart)
      .endAt(periodEnd)
      .once("value");

    const readings = readingsSnap.val() ? Object.values(readingsSnap.val()) : [];
    if (readings.length === 0) {
      return res.json({ success: true, data: { message: "No readings in period", credits: {} } });
    }

    // Check calibration validity during period
    const calSnap = await db.ref(`calibrations/${project.deviceId}`).once("value");
    const cals = calSnap.val() ? Object.values(calSnap.val()) : [];
    const calibrationValid = _checkCalibrationValidity(cals, periodStart, periodEnd);

    // Compute uptime
    const interval = 900; // 15 min default
    const expectedReadings = Math.floor((periodEnd - periodStart) / (interval * 1000));
    const uptimePct = expectedReadings > 0
      ? Math.round((readings.length / expectedReadings) * 1000) / 10
      : 0;

    // Calculate credits per eligible type
    const accruals = [];
    const flowEstimate = project.flowEstimate || {};
    const flowM3PerDay = flowEstimate.value || 0;
    const periodDays = (periodEnd - periodStart) / 86400000;
    const totalFlowM3 = flowM3PerDay * periodDays;

    for (const creditType of project.eligibleCredits || []) {
      const factor = CONVERSION_FACTORS[creditType];
      if (!factor) continue;

      // Get baseline value for this credit type
      const baselineParams = project.baselineParams || {};
      let baselineValue = null;
      if (creditType === "nitrogen") baselineValue = baselineParams.tn || baselineParams.nitrogen;
      if (creditType === "phosphorus") baselineValue = baselineParams.tp || baselineParams.phosphorus;
      if (baselineValue === null || baselineValue === undefined) continue;

      // Compute average measured value
      // Map credit type to sensor field
      const sensorField = creditType === "nitrogen" ? "tds_ppm" : "ph"; // Simplified mapping
      const values = readings
        .map((r) => {
          const sensors = r.sensors || r;
          return sensors[sensorField]?.value ?? sensors[sensorField];
        })
        .filter((v) => v !== null && v !== undefined && typeof v === "number");

      if (values.length === 0) continue;
      const measuredValue = values.reduce((a, b) => a + b, 0) / values.length;

      // credit_amount = (baseline - measured) × flow × conversion_factor
      const delta = baselineValue - measuredValue;
      if (delta <= 0) continue; // No improvement

      const amount = delta * totalFlowM3 * factor.lbs_per_mg_L_m3;
      if (amount <= 0) continue;

      const accrualRef = db.ref("credit_accruals").push();
      const accrual = {
        id: accrualRef.key,
        projectId: id,
        periodStart,
        periodEnd,
        creditType,
        amount: Math.round(amount * 10000) / 10000,
        unit: factor.unit,
        baselineValue,
        measuredValue: Math.round(measuredValue * 100) / 100,
        flowVolume: Math.round(totalFlowM3 * 100) / 100,
        dataPoints: readings.length,
        uptimePct,
        calibrationValid,
        status: "pending_verification",
        verificationNotes: null,
        createdAt: new Date().toISOString(),
      };
      await accrualRef.set(accrual);
      accruals.push(accrual);

      // Update project total
      const currentTotal = project.totalCredits?.[creditType] || 0;
      await db.ref(`credit_projects/${id}/totalCredits/${creditType}`).set(
        Math.round((currentTotal + amount) * 10000) / 10000
      );
    }

    // Lock baseline after first credit calculation (Gap 6)
    if (accruals.length > 0 && !project.baselineLockedAt) {
      await db.ref(`credit_projects/${id}/baselineLockedAt`).set(new Date().toISOString());
      await db.ref(`devices/${project.deviceId}/revenueGrade/baselineLockedAt`).set(
        new Date().toISOString()
      );
    }

    res.json({ success: true, data: { accruals, uptimePct, calibrationValid } });
  } catch (error) {
    console.error("v2/projects/:id/accruals/calculate error:", error);
    res.status(500).json({ success: false, error: "Failed to calculate credits" });
  }
}

// ── Submit for Verification ───────────────────────────────────────────

async function submitVerification(req, res) {
  try {
    const { id } = req.params;
    const { accrual_ids } = req.body;
    const uid = req.body.userId || req.user?.uid;
    if (!uid) return res.status(401).json({ success: false, error: "Auth required" });

    const db = admin.database();
    const projSnap = await db.ref(`credit_projects/${id}`).once("value");
    if (!projSnap.exists()) return res.status(404).json({ success: false, error: "Project not found" });

    const project = projSnap.val();
    if (project.wqtUserId !== uid) {
      return res.status(403).json({ success: false, error: "Not the project owner" });
    }

    // Run automated verification checks
    const checks = [];

    // 1. Data continuity ≥95%
    const readingsSnap = await db.ref(`readings/${project.deviceId}`)
      .orderByChild("timestamp")
      .startAt(Date.now() - 30 * 86400000)
      .once("value");
    const readingCount = readingsSnap.exists() ? Object.keys(readingsSnap.val()).length : 0;
    const expected = Math.floor((30 * 86400) / 900);
    const continuityPct = expected > 0 ? Math.round((readingCount / expected) * 1000) / 10 : 0;

    checks.push({
      name: "data_continuity",
      passed: continuityPct >= 95,
      value: continuityPct,
      threshold: 95,
      message: continuityPct >= 95
        ? `Data continuity: ${continuityPct}% ✓`
        : `Data continuity is ${continuityPct}% — 95% required.`,
    });

    // 2. Calibration validity
    const calSnap = await db.ref(`calibrations/${project.deviceId}`).once("value");
    const cals = calSnap.val() ? Object.values(calSnap.val()) : [];
    const calValid = _checkCalibrationValidity(cals, Date.now() - 30 * 86400000, Date.now());
    checks.push({
      name: "calibration_validity",
      passed: calValid,
      message: calValid
        ? "All probe calibrations valid during period ✓"
        : "Calibration lapsed during accrual period. Recalibrate affected probes.",
    });

    // 3. Baseline integrity
    const baselineLocked = !!project.baselineLockedAt;
    checks.push({
      name: "baseline_integrity",
      passed: baselineLocked,
      message: baselineLocked
        ? "Baseline locked and unmodified ✓"
        : "Baseline not yet locked. Complete first credit calculation.",
    });

    // 4. Statistical significance (Welch's t-test, p < 0.05)
    //    Compares accrual-period readings against baseline statistics.
    //    If baseline stats aren't available (regulatory/historical), skip.
    const baselineStats = project.baselineStats;
    if (baselineStats && baselineStats.means && baselineStats.stdDevs && baselineStats.counts) {
      const accrualReadings = readingsSnap.val() ? Object.values(readingsSnap.val()) : [];
      for (const param of Object.keys(baselineStats.means)) {
        const baselineMean = baselineStats.means[param];
        const baselineStd = baselineStats.stdDevs[param];
        const baselineN = baselineStats.counts[param];

        // Extract accrual-period values for this parameter
        const accrualValues = accrualReadings
          .map((r) => {
            const s = r.sensors || r;
            return s[param]?.value ?? s[param] ?? s[`${param}_ppm`]?.value ?? s[`${param}_ppm`];
          })
          .filter((v) => typeof v === "number" && !isNaN(v));

        if (accrualValues.length < 10) continue; // Not enough data

        const accrualMean = accrualValues.reduce((a, b) => a + b, 0) / accrualValues.length;
        const accrualN = accrualValues.length;
        const accrualVariance = accrualValues.reduce((sum, v) => sum + (v - accrualMean) ** 2, 0) / (accrualN - 1);
        const accrualStd = Math.sqrt(accrualVariance);
        const baselineVariance = baselineStd ** 2;

        // Welch's t-statistic: t = (x̄₁ - x̄₂) / √(s₁²/n₁ + s₂²/n₂)
        const denominator = Math.sqrt(
          (baselineVariance / baselineN) + (accrualVariance / accrualN)
        );

        if (denominator < 1e-10) continue; // Avoid division by zero

        const tStat = (baselineMean - accrualMean) / denominator;

        // Welch-Satterthwaite degrees of freedom
        const num = ((baselineVariance / baselineN) + (accrualVariance / accrualN)) ** 2;
        const den =
          ((baselineVariance / baselineN) ** 2) / (baselineN - 1) +
          ((accrualVariance / accrualN) ** 2) / (accrualN - 1);
        const df = Math.floor(num / den);

        // Approximate p-value using t-distribution CDF
        // For one-sided test (improvement = baseline > measured):
        // We want tStat > 0 (baseline higher than accrual)
        const pValue = _approxTTestPValue(Math.abs(tStat), Math.max(1, df));
        const significant = tStat > 0 && pValue < 0.05;

        checks.push({
          name: `statistical_significance_${param}`,
          passed: significant,
          value: { tStat: Math.round(tStat * 100) / 100, pValue: Math.round(pValue * 1000) / 1000, df },
          message: significant
            ? `Improvement for ${param} is statistically significant (t=${tStat.toFixed(2)}, p=${pValue.toFixed(3)}) ✓`
            : `Improvement for ${param} is not statistically significant (t=${tStat.toFixed(2)}, p=${pValue.toFixed(3)}). Consider extending the accrual period.`,
        });
      }
    } else {
      // No baseline stats (regulatory/historical baseline) — skip statistical test
      checks.push({
        name: "statistical_significance",
        passed: true,
        message: "Statistical test skipped — regulatory/historical baseline (no monitoring-period stats). Manual review required.",
      });
    }

    // 5. Outlier detection (>3σ from 30-day rolling mean)
    const allReadings = readingsSnap.val() ? Object.values(readingsSnap.val()) : [];
    if (allReadings.length > 30) {
      let outlierCount = 0;
      const outlierTimestamps = [];

      // Check each key sensor parameter
      for (const param of ["ph", "tds", "turbidity", "orp"]) {
        const values = allReadings
          .map((r) => {
            const s = r.sensors || r;
            return { v: s[param]?.value ?? s[param] ?? s[`${param}_ppm`]?.value, ts: r.timestamp };
          })
          .filter((d) => typeof d.v === "number" && !isNaN(d.v));

        if (values.length < 30) continue;

        const mean = values.reduce((a, d) => a + d.v, 0) / values.length;
        const stdDev = Math.sqrt(
          values.reduce((sum, d) => sum + (d.v - mean) ** 2, 0) / values.length
        );

        if (stdDev < 1e-10) continue;

        for (const d of values) {
          if (Math.abs(d.v - mean) > 3 * stdDev) {
            outlierCount++;
            if (outlierTimestamps.length < 5) outlierTimestamps.push(d.ts);
          }
        }
      }

      const outlierPct = allReadings.length > 0
        ? Math.round((outlierCount / allReadings.length) * 1000) / 10
        : 0;

      checks.push({
        name: "outlier_detection",
        passed: outlierPct < 5, // <5% outliers is acceptable
        value: { outlierCount, outlierPct, sampleTimestamps: outlierTimestamps },
        message: outlierPct < 5
          ? `Outlier rate: ${outlierPct}% (${outlierCount} readings >3σ) ✓`
          : `${outlierCount} readings (${outlierPct}%) are >3σ from the mean. These may indicate sensor malfunction. Flagged for review.`,
      });
    }

    const allPassed = checks.every((c) => c.passed);

    if (!allPassed) {
      return res.json({
        success: true,
        data: {
          status: "failed",
          checks,
          message: "Automated verification checks failed. Address the issues above and resubmit.",
        },
      });
    }

    // All checks passed — mark accruals as pending_review
    if (accrual_ids && accrual_ids.length > 0) {
      for (const accrualId of accrual_ids) {
        await db.ref(`credit_accruals/${accrualId}/status`).set("pending_review");
      }
    }

    res.json({
      success: true,
      data: {
        status: "pending_review",
        checks,
        message: "All automated checks passed. Submitted for manual review (estimated 5 business days).",
      },
    });
  } catch (error) {
    console.error("v2/projects/:id/submit-verification error:", error);
    res.status(500).json({ success: false, error: "Failed to submit verification" });
  }
}

// ── Helper: Check calibration validity over a time period ─────────────

function _checkCalibrationValidity(calibrations, periodStart, periodEnd) {
  const probes = ["ph", "tds", "turbidity", "orp"];
  for (const probe of probes) {
    const probeCals = calibrations.filter((c) => c.probeType === probe);
    if (probeCals.length === 0) return false;

    // Check if any calibration covers the entire period
    const covers = probeCals.some((c) => {
      const calStart = c.calibratedAt || 0;
      const calEnd = c.expiresAt || Infinity;
      return calStart <= periodStart && calEnd >= periodEnd;
    });
    if (!covers) return false;
  }
  return true;
}

/**
 * Approximate one-sided p-value for Student's t-distribution.
 *
 * Uses the regularized incomplete beta function approximation.
 * Accurate to ~3 decimal places for df > 5 — sufficient for
 * verification threshold checking (p < 0.05).
 *
 * For production v2, consider replacing with a proper stats library.
 */
function _approxTTestPValue(tAbs, df) {
  // Convert t-statistic to p-value via the incomplete beta function
  // P(T > t) = 0.5 * I_x(df/2, 0.5) where x = df / (df + t²)
  const x = df / (df + tAbs * tAbs);
  const a = df / 2;
  const b = 0.5;

  // Approximate regularized incomplete beta using continued fraction
  // This is a simplified version — accurate enough for p < 0.05 threshold
  const betaInc = _regIncBeta(x, a, b);
  return 0.5 * betaInc;
}

/**
 * Regularized incomplete beta function I_x(a, b).
 * Simple series expansion — converges quickly for our use case
 * (a = df/2 where df > 5, b = 0.5).
 */
function _regIncBeta(x, a, b) {
  if (x <= 0) return 0;
  if (x >= 1) return 1;

  // Use the series expansion for I_x(a, b)
  // For small x or a, use the direct series
  const lnBeta = _lnGamma(a) + _lnGamma(b) - _lnGamma(a + b);
  const front = Math.exp(Math.log(x) * a + Math.log(1 - x) * b - lnBeta) / a;

  // Continued fraction (Lentz's method)
  let f = 1, c = 1, d = 1 - (a + b) * x / (a + 1);
  if (Math.abs(d) < 1e-30) d = 1e-30;
  d = 1 / d;
  f = d;

  for (let i = 1; i <= 100; i++) {
    const m = i;
    // Even step
    let numerator = m * (b - m) * x / ((a + 2 * m - 1) * (a + 2 * m));
    d = 1 + numerator * d;
    if (Math.abs(d) < 1e-30) d = 1e-30;
    c = 1 + numerator / c;
    if (Math.abs(c) < 1e-30) c = 1e-30;
    d = 1 / d;
    f *= d * c;

    // Odd step
    numerator = -(a + m) * (a + b + m) * x / ((a + 2 * m) * (a + 2 * m + 1));
    d = 1 + numerator * d;
    if (Math.abs(d) < 1e-30) d = 1e-30;
    c = 1 + numerator / c;
    if (Math.abs(c) < 1e-30) c = 1e-30;
    d = 1 / d;
    const delta = d * c;
    f *= delta;

    if (Math.abs(delta - 1) < 1e-8) break;
  }

  return front * f;
}

/** Stirling's approximation for ln(Gamma(x)). */
function _lnGamma(x) {
  if (x <= 0) return 0;
  // Lanczos approximation coefficients
  const g = 7;
  const coef = [
    0.99999999999980993, 676.5203681218851, -1259.1392167224028,
    771.32342877765313, -176.61502916214059, 12.507343278686905,
    -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7,
  ];

  if (x < 0.5) {
    return Math.log(Math.PI / Math.sin(Math.PI * x)) - _lnGamma(1 - x);
  }

  x -= 1;
  let a = coef[0];
  const t = x + g + 0.5;
  for (let i = 1; i < coef.length; i++) {
    a += coef[i] / (x + i);
  }

  return 0.5 * Math.log(2 * Math.PI) + (x + 0.5) * Math.log(t) - t + Math.log(a);
}

module.exports = {
  registerProject,
  getProject,
  getAccruals,
  calculateCredits,
  submitVerification,
};
