/**
 * BlueSignal Credit Generation from Device Readings
 * 
 * When an enrolled device submits qualifying readings, this module:
 * 1. Checks if the device has any active enrollments in trading programs
 * 2. Validates readings meet program requirements
 * 3. Generates credit records in /credits/
 * 4. Updates enrollment counters
 * 5. Creates notification for the user
 */

const functions = require("firebase-functions");
const admin = require("firebase-admin");

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
    const totalCredits = readingsCount * ratePerUnit;

    return res.json({
      enrollmentId,
      deviceId: enrollment.deviceId,
      programId: enrollment.programId,
      readingsCount,
      ratePerUnit,
      totalCredits,
      unit: program.incentives?.unit || "lbs",
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
