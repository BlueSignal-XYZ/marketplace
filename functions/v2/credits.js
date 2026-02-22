/**
 * v2 Credits Endpoints — aligned with src/services/types/credits.ts
 * POST /v2/credits/purchase   — PurchaseRequest → PurchaseResult
 * POST /v2/credits/submit     — CreditSubmission → { submissionId, status }
 * POST /v2/credits/approve    — CreditApprovalRequest
 * POST /v2/credits/reject     — CreditRejectionRequest
 */

const admin = require("firebase-admin");

async function purchaseCredits(req, res) {
  try {
    // PurchaseRequest shape
    const { listingId, quantity, paymentMethod, walletAddress, stripePaymentIntentId } = req.body;

    if (!listingId || !quantity || !paymentMethod) {
      return res
        .status(400)
        .json({ success: false, error: "Missing required fields: listingId, quantity, paymentMethod" });
    }

    // Auth: get buyer UID from Firebase token
    const buyerUid = req.user?.uid || req.body.buyerUid || null;

    const db = admin.database();
    const listingSnap = await db.ref(`marketplace/listings/${listingId}`).once("value");
    const listing = listingSnap.val();

    if (!listing || listing.status !== "active") {
      return res.status(404).json({ success: false, error: "Listing not found or inactive" });
    }

    const available = listing.quantityAvailable || listing.quantity || 0;
    if (quantity > available) {
      return res.status(400).json({ success: false, error: "Insufficient quantity available" });
    }

    const pricePerCredit = listing.pricePerCredit || listing.pricePerUnit || 0;
    const totalPrice = quantity * pricePerCredit;

    // Create transaction record
    const txRef = db.ref("marketplace/transactions").push();
    const now = new Date().toISOString();
    const transaction = {
      id: txRef.key,
      listingId,
      buyerUid,
      sellerUid: listing.sellerUid || listing.sellerId || listing.uid,
      quantity,
      pricePerCredit,
      totalPrice,
      paymentMethod,
      walletAddress: walletAddress || "",
      stripePaymentIntentId: stripePaymentIntentId || "",
      status: "pending",
      createdAt: now,
    };
    await txRef.set(transaction);

    // Update listing quantity
    const newQty = available - quantity;
    const updates = { quantityAvailable: newQty };
    if (newQty <= 0) updates.status = "sold";
    await db.ref(`marketplace/listings/${listingId}`).update(updates);

    // PurchaseResult shape
    res.json({
      success: true,
      data: {
        purchaseId: txRef.key,
        listingId,
        creditId: listing.creditId || listingId,
        quantity,
        totalPrice,
        paymentMethod,
        transactionHash: null,
        status: "pending",
        createdAt: now,
      },
    });
  } catch (error) {
    console.error("v2/credits/purchase error:", error);
    res.status(500).json({ success: false, error: "Failed to process purchase" });
  }
}

async function submitCredits(req, res) {
  try {
    // CreditSubmission shape
    const {
      nutrientType, quantity, region, watershed, vintage, programId,
      organizationName, organizationType, projectDescription,
      improvementType, location, evidence,
    } = req.body;

    const sellerUid = req.user?.uid || req.body.sellerUid || null;

    if (!nutrientType || !quantity || !region || !programId) {
      return res.status(400).json({ success: false, error: "Missing required fields" });
    }

    const db = admin.database();
    const ref = db.ref("marketplace/submissions").push();
    const submission = {
      id: ref.key,
      sellerUid,
      nutrientType,
      quantity,
      region,
      watershed: watershed || "",
      vintage: vintage || "",
      programId,
      organizationName: organizationName || "",
      organizationType: organizationType || "",
      projectDescription: projectDescription || "",
      improvementType: improvementType || "",
      location: location || null,
      evidence: evidence || [],
      verificationLevel: "self-reported",
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
    res.status(500).json({ success: false, error: "Failed to submit credits" });
  }
}

async function approveCredits(req, res) {
  try {
    // CreditApprovalRequest shape
    const { creditId, adminNotes } = req.body;
    if (!creditId) {
      return res.status(400).json({ success: false, error: "Missing creditId" });
    }

    const db = admin.database();
    const snap = await db.ref(`marketplace/submissions/${creditId}`).once("value");
    const submission = snap.val();
    if (!submission) {
      return res.status(404).json({ success: false, error: "Submission not found" });
    }

    const listingRef = db.ref("marketplace/listings").push();
    const listing = {
      id: listingRef.key,
      sellerUid: submission.sellerUid,
      nutrientType: submission.nutrientType,
      quantity: submission.quantity,
      quantityAvailable: submission.quantity,
      region: submission.region,
      programId: submission.programId,
      verificationLevel: submission.verificationLevel,
      status: "active",
      approvedAt: admin.database.ServerValue.TIMESTAMP,
    };
    await listingRef.set(listing);

    await db.ref(`marketplace/submissions/${creditId}`).update({
      status: "approved",
      listingId: listingRef.key,
      adminNotes: adminNotes || "",
    });

    res.json({
      success: true,
      data: { listingId: listingRef.key, status: "approved" },
    });
  } catch (error) {
    console.error("v2/credits/approve error:", error);
    res.status(500).json({ success: false, error: "Failed to approve credits" });
  }
}

async function rejectCredits(req, res) {
  try {
    // CreditRejectionRequest shape
    const { creditId, reason, adminNotes } = req.body;
    if (!creditId || !reason) {
      return res.status(400).json({ success: false, error: "Missing creditId or reason" });
    }

    const db = admin.database();
    await db.ref(`marketplace/submissions/${creditId}`).update({
      status: "rejected",
      rejectionReason: reason,
      adminNotes: adminNotes || "",
    });

    res.json({ success: true, data: { status: "rejected" } });
  } catch (error) {
    console.error("v2/credits/reject error:", error);
    res.status(500).json({ success: false, error: "Failed to reject credits" });
  }
}

async function getPortfolio(req, res) {
  try {
    const uid = req.user?.uid || req.query.userId;
    if (!uid) {
      return res.status(400).json({ success: false, error: "Missing userId" });
    }

    const db = admin.database();

    // Get user's transactions
    const txSnap = await db.ref("marketplace/transactions")
      .orderByChild("buyerUid").equalTo(uid).once("value");
    const txRaw = txSnap.val() || {};

    // Build holdings from transactions
    const holdingsMap = {};
    const transactions = [];

    Object.entries(txRaw).forEach(([txId, tx]) => {
      const creditId = tx.creditId || tx.listingId || txId;
      transactions.push({
        id: txId,
        type: "purchase",
        creditId,
        nutrientType: tx.nutrientType || "nitrogen",
        quantity: tx.quantity || 0,
        price: tx.totalPrice || 0,
        counterparty: tx.sellerName || "",
        transactionHash: tx.transactionHash || null,
        timestamp: tx.createdAt || "",
      });

      if (!holdingsMap[creditId]) {
        holdingsMap[creditId] = {
          creditId,
          nutrientType: tx.nutrientType || "nitrogen",
          quantity: 0,
          currentValue: 0,
          region: tx.region || "",
          vintage: tx.vintage || "",
          status: "minted",
          acquiredAt: tx.createdAt || "",
          listingId: tx.listingId || "",
        };
      }
      holdingsMap[creditId].quantity += tx.quantity || 0;
      holdingsMap[creditId].currentValue += tx.totalPrice || 0;
    });

    const holdings = Object.values(holdingsMap);
    const totalValue = holdings.reduce((s, h) => s + h.currentValue, 0);
    const totalN = holdings.filter(h => h.nutrientType === "nitrogen").reduce((s, h) => s + h.quantity, 0);
    const totalP = holdings.filter(h => h.nutrientType === "phosphorus").reduce((s, h) => s + h.quantity, 0);

    // Portfolio shape
    res.json({
      success: true,
      data: {
        userId: uid,
        holdings,
        totalValue,
        totalNitrogenRemoved: totalN,
        totalPhosphorusRemoved: totalP,
        summary: {
          activeCredits: holdings.filter(h => h.status !== "retired").length,
          listedCredits: holdings.filter(h => h.status === "listed").length,
          retiredCredits: holdings.filter(h => h.status === "retired").length,
          totalPurchases: transactions.filter(t => t.type === "purchase").length,
          totalSales: 0,
        },
        transactions,
      },
    });
  } catch (error) {
    console.error("v2/credits/portfolio error:", error);
    res.status(500).json({ success: false, error: "Failed to fetch portfolio" });
  }
}

module.exports = { purchaseCredits, submitCredits, approveCredits, rejectCredits, getPortfolio };
