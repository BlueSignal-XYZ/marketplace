/**
 * v2 Credits Endpoints
 * POST /v2/credits/purchase   — Purchase credits
 * POST /v2/credits/submit     — Submit new credits for verification
 * POST /v2/credits/approve    — Approve submitted credits (admin)
 * POST /v2/credits/reject     — Reject submitted credits (admin)
 */

const admin = require("firebase-admin");

async function purchaseCredits(req, res) {
  try {
    const { listingId, quantity, paymentMethod, buyerUid } = req.body;

    if (!listingId || !quantity || !buyerUid) {
      return res
        .status(400)
        .json({ success: false, error: "Missing required fields" });
    }

    const db = admin.database();
    const listingSnap = await db
      .ref(`marketplace/listings/${listingId}`)
      .once("value");
    const listing = listingSnap.val();

    if (!listing || listing.status !== "active") {
      return res
        .status(404)
        .json({ success: false, error: "Listing not found or inactive" });
    }

    const available = listing.quantityAvailable || listing.quantity || 0;
    if (quantity > available) {
      return res
        .status(400)
        .json({ success: false, error: "Insufficient quantity available" });
    }

    // Create transaction record
    const txRef = db.ref("marketplace/transactions").push();
    const transaction = {
      id: txRef.key,
      listingId,
      buyerUid,
      sellerUid: listing.sellerUid || listing.uid,
      quantity,
      pricePerUnit: listing.pricePerUnit || listing.pricePerCredit,
      total: quantity * (listing.pricePerUnit || listing.pricePerCredit || 0),
      paymentMethod,
      status: "pending",
      createdAt: admin.database.ServerValue.TIMESTAMP,
    };
    await txRef.set(transaction);

    // Update listing quantity
    const newQty = available - quantity;
    const updates = { quantityAvailable: newQty };
    if (newQty <= 0) updates.status = "sold";
    await db.ref(`marketplace/listings/${listingId}`).update(updates);

    res.json({
      success: true,
      data: {
        transactionId: txRef.key,
        status: "pending",
        total: transaction.total,
      },
    });
  } catch (error) {
    console.error("v2/credits/purchase error:", error);
    res
      .status(500)
      .json({ success: false, error: "Failed to process purchase" });
  }
}

async function submitCredits(req, res) {
  try {
    const { sellerUid, nutrientType, quantity, region, programId, deviceId } =
      req.body;

    if (!sellerUid || !nutrientType || !quantity) {
      return res
        .status(400)
        .json({ success: false, error: "Missing required fields" });
    }

    const db = admin.database();
    const ref = db.ref("marketplace/submissions").push();
    const submission = {
      id: ref.key,
      sellerUid,
      nutrientType,
      quantity,
      region: region || "",
      programId: programId || "",
      deviceId: deviceId || "",
      verificationLevel: deviceId ? "sensor-verified" : "self-reported",
      status: "pending_review",
      submittedAt: admin.database.ServerValue.TIMESTAMP,
    };
    await ref.set(submission);

    res.json({
      success: true,
      data: { submissionId: ref.key, status: "pending_review" },
    });
  } catch (error) {
    console.error("v2/credits/submit error:", error);
    res
      .status(500)
      .json({ success: false, error: "Failed to submit credits" });
  }
}

async function approveCredits(req, res) {
  try {
    const { submissionId } = req.body;
    if (!submissionId) {
      return res
        .status(400)
        .json({ success: false, error: "Missing submissionId" });
    }

    const db = admin.database();
    const snap = await db
      .ref(`marketplace/submissions/${submissionId}`)
      .once("value");
    const submission = snap.val();
    if (!submission) {
      return res
        .status(404)
        .json({ success: false, error: "Submission not found" });
    }

    // Create listing from approved submission
    const listingRef = db.ref("marketplace/listings").push();
    const listing = {
      id: listingRef.key,
      sellerUid: submission.sellerUid,
      nutrientType: submission.nutrientType,
      quantity: submission.quantity,
      quantityAvailable: submission.quantity,
      region: submission.region,
      programId: submission.programId,
      deviceId: submission.deviceId,
      verificationLevel: submission.verificationLevel,
      status: "active",
      approvedAt: admin.database.ServerValue.TIMESTAMP,
    };
    await listingRef.set(listing);

    // Update submission status
    await db
      .ref(`marketplace/submissions/${submissionId}`)
      .update({ status: "approved", listingId: listingRef.key });

    res.json({
      success: true,
      data: { listingId: listingRef.key, status: "approved" },
    });
  } catch (error) {
    console.error("v2/credits/approve error:", error);
    res
      .status(500)
      .json({ success: false, error: "Failed to approve credits" });
  }
}

async function rejectCredits(req, res) {
  try {
    const { submissionId, reason } = req.body;
    if (!submissionId) {
      return res
        .status(400)
        .json({ success: false, error: "Missing submissionId" });
    }

    const db = admin.database();
    await db
      .ref(`marketplace/submissions/${submissionId}`)
      .update({ status: "rejected", rejectionReason: reason || "" });

    res.json({ success: true, data: { status: "rejected" } });
  } catch (error) {
    console.error("v2/credits/reject error:", error);
    res
      .status(500)
      .json({ success: false, error: "Failed to reject credits" });
  }
}

module.exports = {
  purchaseCredits,
  submitCredits,
  approveCredits,
  rejectCredits,
};
