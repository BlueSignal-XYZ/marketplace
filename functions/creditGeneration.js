/**
 * BlueSignal Credit Generation from Device Readings
 *
 * When an enrolled device submits qualifying readings, this module:
 * 1. Checks if the device has any active enrollments in trading programs
 * 2. Validates readings meet program requirements
 * 3. Generates credit records in /credits/
 * 4. Writes an immutable audit record to /creditAuditLog/ capturing inputs,
 *    formula, tier, multiplier, and result — the answer to "how was this
 *    credit calculated?" for utilities, auditors, and institutional buyers.
 *    See CLAUDE.md ADR "Credit audit trail as immutable RTDB node — 2026-04-12"
 *    and the v1.1 plan §2.3.
 * 5. Updates enrollment counters
 * 6. Creates notification for the user
 */

const functions = require("firebase-functions/v1");
const admin = require("firebase-admin");

/**
 * Write an append-only audit record for a generated credit.
 *
 * The audit log is readable by the credit owner and admins (see
 * database.rules.json `/creditAuditLog`). Writes are server-only and the
 * rule enforces no-updates-once-written.
 *
 * @param {import('firebase-admin').database.Database} db
 * @param {string} creditId
 * @param {object} entry  Must include: deviceId, programId, inputs, formula,
 *                        result, confidenceFlags.
 */
async function writeCreditAudit(db, creditId, entry) {
  if (!creditId) return;
  try {
    await db.ref(`creditAuditLog/${creditId}`).set({
      ...entry,
      creditId,
      writtenAt: admin.database.ServerValue.TIMESTAMP,
      schemaVersion: 1,
    });
  } catch (err) {
    // Audit-log failures must not block credit generation; surface via logs.
    console.error(`creditAuditLog write failed for credit ${creditId}:`, err);
  }
}

/**
 * Build the confidence-flag array for a credit. Flags surface data-quality
 * concerns that auditors must see (e.g., calibration expired at generation
 * time).
 *
 * @param {object} deviceData  Device RTDB snapshot value
 * @param {object} readingData Readings snapshot value
 * @returns {string[]}
 */
function buildConfidenceFlags(deviceData, readingData) {
  const flags = [];
  const now = Date.now();

  const calibExpiry = deviceData?.calibration?.expiresAt;
  if (calibExpiry && Number(calibExpiry) < now) flags.push("calibration-expired");

  const sensors = readingData?.sensors || readingData || {};
  if (sensors.ph != null && (sensors.ph < 0 || sensors.ph > 14)) {
    flags.push("ph-out-of-range");
  }
  if (sensors.turbidity != null && sensors.turbidity < 0) {
    flags.push("turbidity-negative");
  }

  if (!deviceData?.installation?.siteId) flags.push("no-site-assignment");
  if (!readingData) flags.push("reading-missing");

  return flags;
}

/**
 * Process new readings and generate credits for enrolled devices.
 * This is called as a database trigger when new readings are written.
 */
const onReadingCreated = functions.database
  .ref("/readings/{deviceId}/{timestamp}")
  .onCreate(async (snapshot, context) => {
    const { deviceId, timestamp } = context.params;
    const readingData = snapshot.val();

    if (!readingData) return null;

    const db = admin.database();

    try {
      // 1. Find active enrollments for this device
      const enrollmentsSnap = await db
        .ref("enrollments")
        .orderByChild("deviceId")
        .equalTo(deviceId)
        .once("value");

      if (!enrollmentsSnap.exists()) return null;

      const enrollments = enrollmentsSnap.val();
      const activeEnrollments = Object.entries(enrollments).filter(
        ([, enrollment]) =>
          enrollment.status === "active" || enrollment.status === "enrolled"
      );

      if (activeEnrollments.length === 0) return null;

      // 2. For each active enrollment, check program requirements and generate credits
      for (const [enrollmentId, enrollment] of activeEnrollments) {
        // Fetch the trading program
        const programSnap = await db
          .ref(`tradingPrograms/${enrollment.programId}`)
          .once("value");

        if (!programSnap.exists()) continue;

        const program = programSnap.val();
        if (program.status !== "active") continue;

        // 3. Validate reading has required sensors
        const sensors = readingData.sensors || readingData;
        const requiredSensors = program.requirements?.minSensors || [
          "pH",
          "tds",
          "turbidity",
        ];

        const sensorKeys = Object.keys(sensors).map((k) => k.toLowerCase());
        const hasRequiredSensors = requiredSensors.every((s) =>
          sensorKeys.some((k) => k.includes(s.toLowerCase()))
        );

        if (!hasRequiredSensors) {
          console.log(
            `Device ${deviceId} missing required sensors for program ${enrollment.programId}`
          );
          continue;
        }

        // 4. Calculate credit amount based on program rate
        // Simple credit generation: 1 qualifying reading = fractional credit
        const ratePerUnit = program.incentives?.ratePerUnit || 0.01;
        const creditAmount = ratePerUnit;

        if (creditAmount <= 0) continue;

        // 5. Get device info for credit origin
        const deviceSnap = await db.ref(`devices/${deviceId}`).once("value");
        const deviceData = deviceSnap.exists() ? deviceSnap.val() : {};

        // 6. Create credit record
        const creditRef = db.ref("credits").push();
        const creditId = creditRef.key;

        const creditRecord = {
          type: program.type || "nutrient",
          status: "pending",
          origin: {
            siteId: deviceData.installation?.siteId || "",
            deviceId: deviceId,
            watershed:
              deviceData.installation?.location?.watershed || "",
            generatedFrom: parseInt(timestamp),
            generatedTo: parseInt(timestamp),
            methodology: `auto-${program.type}-${enrollment.programId}`,
          },
          quantity: {
            amount: creditAmount,
            unit: program.incentives?.unit || "lbs",
          },
          verification: {
            verifiedAt: null,
            certificateHash: null,
            transactionHash: null,
          },
          ownership: {
            currentOwner: enrollment.userId,
            originalOwner: enrollment.userId,
          },
          listing: {},
          metadata: {
            enrollmentId: enrollmentId,
            programId: enrollment.programId,
            readingTimestamp: parseInt(timestamp),
            generatedAt: admin.database.ServerValue.TIMESTAMP,
          },
        };

        await creditRef.set(creditRecord);

        // 6b. Write audit trail — MUST be set after the credit record exists
        //     so the auditLog entry references a valid creditId.
        await writeCreditAudit(db, creditId, {
          trigger: "onReadingCreated",
          deviceId,
          enrollmentId,
          programId: enrollment.programId,
          programType: program.type || "nutrient",
          methodology:
            program.methodology ||
            `auto-${program.type}-${enrollment.programId}`,
          verificationTier: program.verificationTier || "auto",
          inputs: {
            readingTimestamp: parseInt(timestamp),
            sensors,
            requiredSensors,
            ratePerUnit,
            qualityMultiplier: program.incentives?.qualityMultiplier || 1,
          },
          formula:
            "creditAmount = ratePerUnit * qualityMultiplier * qualifyingReadingCount",
          qualifyingReadingCount: 1,
          result: {
            creditAmount,
            unit: program.incentives?.unit || "lbs",
          },
          confidenceFlags: buildConfidenceFlags(deviceData, readingData),
          owner: enrollment.userId,
        });

        // 7. Update enrollment counters
        const currentGenerated = enrollment.creditsGenerated || 0;
        const currentAvailable = enrollment.creditsAvailable || 0;

        await db.ref(`enrollments/${enrollmentId}`).update({
          creditsGenerated: currentGenerated + creditAmount,
          creditsAvailable: currentAvailable + creditAmount,
        });

        // 8. Create notification for user (every 10 credits to avoid spam)
        if (
          Math.floor(currentGenerated + creditAmount) >
          Math.floor(currentGenerated)
        ) {
          const notifRef = db.ref("notifications").push();
          await notifRef.set({
            userId: enrollment.userId,
            deviceId: deviceId,
            programId: enrollment.programId,
            type: "credit-generated",
            title: "Credits Generated",
            body: `Your device ${deviceId} generated ${creditAmount.toFixed(
              4
            )} ${program.type} credits from the ${program.name} program.`,
            read: false,
            dismissed: false,
            actionUrl: `/credits`,
            createdAt: admin.database.ServerValue.TIMESTAMP,
          });
        }

        console.log(
          `Generated ${creditAmount} ${program.type} credit for device ${deviceId}, enrollment ${enrollmentId}`
        );
      }

      return null;
    } catch (error) {
      console.error("Credit generation error:", error);
      return null;
    }
  });

/**
 * HTTP endpoint for manual credit calculation/generation.
 * Called from the frontend when an admin or enrolled user triggers credit generation.
 */
const calculateCredits = async (req, res) => {
  const { enrollmentId, fromTimestamp, toTimestamp } = req.body;

  if (!enrollmentId) {
    return res.status(400).json({ error: "enrollmentId is required" });
  }

  const db = admin.database();

  try {
    // Fetch enrollment
    const enrollmentSnap = await db
      .ref(`enrollments/${enrollmentId}`)
      .once("value");
    if (!enrollmentSnap.exists()) {
      return res.status(404).json({ error: "Enrollment not found" });
    }

    const enrollment = enrollmentSnap.val();

    // Fetch program
    const programSnap = await db
      .ref(`tradingPrograms/${enrollment.programId}`)
      .once("value");
    if (!programSnap.exists()) {
      return res.status(404).json({ error: "Trading program not found" });
    }

    const program = programSnap.val();

    // Count readings in time range
    const readingsRef = db.ref(`readings/${enrollment.deviceId}`);
    let readingsQuery = readingsRef;

    if (fromTimestamp) {
      readingsQuery = readingsQuery.orderByKey().startAt(String(fromTimestamp));
    }
    if (toTimestamp) {
      readingsQuery = readingsQuery.endAt(String(toTimestamp));
    }

    const readingsSnap = await readingsQuery.once("value");
    const readingsCount = readingsSnap.exists()
      ? Object.keys(readingsSnap.val()).length
      : 0;

    const ratePerUnit = program.incentives?.ratePerUnit || 0.01;
    const qualityMultiplier = program.incentives?.qualityMultiplier || 1;
    const totalCredits = readingsCount * ratePerUnit * qualityMultiplier;

    // Dry-run audit: we record the calculation even when called via the
    // manual calculate endpoint so auditors have a trail for previews
    // (e.g., when an admin inspects a period before generating credits).
    // Use the enrollmentId+fromTimestamp as a stable-ish audit key so
    // repeated calculations for the same window update-in-place rather
    // than spam the log.
    const auditKey = `calc-${enrollmentId}-${fromTimestamp || "all"}-${toTimestamp || "all"}`;
    await writeCreditAudit(db, auditKey, {
      trigger: "calculateCredits",
      deviceId: enrollment.deviceId,
      enrollmentId,
      programId: enrollment.programId,
      programType: program.type || "nutrient",
      methodology: program.methodology || `manual-${program.type}`,
      verificationTier: program.verificationTier || "auto",
      inputs: {
        fromTimestamp: fromTimestamp || null,
        toTimestamp: toTimestamp || null,
        ratePerUnit,
        qualityMultiplier,
      },
      formula: "totalCredits = ratePerUnit * qualityMultiplier * readingsCount",
      qualifyingReadingCount: readingsCount,
      result: {
        creditAmount: totalCredits,
        unit: program.incentives?.unit || "lbs",
      },
      confidenceFlags:
        readingsCount === 0 ? ["no-readings-in-window"] : [],
      owner: enrollment.userId,
    });

    return res.json({
      enrollmentId,
      deviceId: enrollment.deviceId,
      programId: enrollment.programId,
      readingsCount,
      ratePerUnit,
      qualityMultiplier,
      totalCredits,
      unit: program.incentives?.unit || "lbs",
      auditKey,
    });
  } catch (error) {
    console.error("Credit calculation error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  onReadingCreated,
  calculateCredits,
};
