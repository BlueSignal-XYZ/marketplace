/**
 * BlueSignal Marketplace Cloud Functions
 * Handles credit listings, purchases, and transactions
 */

const functions = require("firebase-functions");
const admin = require("firebase-admin");

/**
 * Create a new credit listing
 */
const createListing = async (req, res) => {
  const { creditId, quantity, pricePerUnit, minPurchase = 1, expiresInDays = 30 } = req.body;

  if (!creditId || !quantity || !pricePerUnit) {
    return res.status(400).json({ error: "Missing required fields: creditId, quantity, pricePerUnit" });
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = authHeader.split("Bearer ")[1];
  const db = admin.database();

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    const uid = decodedToken.uid;

    // Verify credit exists and user owns it
    const creditSnapshot = await db.ref(`credits/${creditId}`).once("value");
    if (!creditSnapshot.exists()) {
      return res.status(404).json({ error: "Credit not found" });
    }

    const credit = creditSnapshot.val();
    if (credit.ownership?.currentOwner !== uid) {
      return res.status(403).json({ error: "You don't own this credit" });
    }

    if (credit.status !== "verified") {
      return res.status(400).json({ error: "Credit must be verified before listing" });
    }

    // Get site info for location data
    let locationData = {};
    if (credit.origin?.siteId) {
      const siteSnapshot = await db.ref(`sites/${credit.origin.siteId}`).once("value");
      if (siteSnapshot.exists()) {
        const site = siteSnapshot.val();
        locationData = {
          watershed: site.location?.watershed || "",
          state: site.location?.state || "",
          siteId: credit.origin.siteId,
          coordinates: site.location?.coordinates || null,
        };
      }
    }

    // Create listing
    const listingId = db.ref("listings").push().key;
    const now = Date.now();
    const expiresAt = now + expiresInDays * 24 * 60 * 60 * 1000;

    const listing = {
      creditId,
      sellerId: uid,
      details: {
        creditType: credit.type,
        quantity: Number(quantity),
        pricePerUnit: Number(pricePerUnit),
        totalPrice: Number(quantity) * Number(pricePerUnit),
        currency: "USD",
        minPurchase: Math.min(Number(minPurchase), Number(quantity)),
      },
      location: locationData,
      status: "active",
      timestamps: {
        created: now,
        updated: now,
        expires: expiresAt,
        sold: null,
      },
      metadata: {
        views: 0,
        inquiries: 0,
        featured: false,
      },
    };

    // Save listing and update credit status
    const updates = {
      [`listings/${listingId}`]: listing,
      [`credits/${creditId}/status`]: "listed",
      [`credits/${creditId}/listing`]: {
        listingId,
        price: Number(pricePerUnit),
        listedAt: now,
      },
    };

    await db.ref().update(updates);

    // Log activity
    await db.ref(`users/${uid}/activity`).push({
      type: "credit_listed",
      timestamp: now,
      metadata: { listingId, creditId, pricePerUnit },
    });

    res.json({ success: true, listingId, listing });
  } catch (error) {
    console.error("Failed to create listing:", error);
    res.status(500).json({ error: "Failed to create listing" });
  }
};

/**
 * Get a listing by ID
 */
const getListing = async (req, res) => {
  const { listingId } = req.body;

  if (!listingId) {
    return res.status(400).json({ error: "Missing listingId" });
  }

  const db = admin.database();

  try {
    const snapshot = await db.ref(`listings/${listingId}`).once("value");
    if (!snapshot.exists()) {
      return res.status(404).json({ error: "Listing not found" });
    }

    const listing = snapshot.val();

    // Increment view count
    await db.ref(`listings/${listingId}/metadata/views`).transaction((views) => {
      return (views || 0) + 1;
    });

    res.json({ listingId, listing });
  } catch (error) {
    console.error("Failed to get listing:", error);
    res.status(500).json({ error: "Failed to get listing" });
  }
};

/**
 * Search and filter listings
 */
const searchListings = async (req, res) => {
  const { filters = {}, sort = "created", limit = 50 } = req.body;

  const db = admin.database();

  try {
    const snapshot = await db.ref("listings").once("value");
    const data = snapshot.val() || {};

    let listings = Object.entries(data)
      .map(([id, l]) => ({ id, ...l }))
      .filter((l) => l.status === "active");

    // Check for expired listings
    const now = Date.now();
    listings = listings.filter((l) => !l.timestamps?.expires || l.timestamps.expires > now);

    // Apply filters
    if (filters.creditType) {
      listings = listings.filter((l) => l.details?.creditType === filters.creditType);
    }
    if (filters.state) {
      listings = listings.filter((l) => l.location?.state === filters.state);
    }
    if (filters.watershed) {
      listings = listings.filter((l) =>
        l.location?.watershed?.toLowerCase().includes(filters.watershed.toLowerCase())
      );
    }
    if (filters.minQuantity) {
      listings = listings.filter((l) => l.details?.quantity >= filters.minQuantity);
    }
    if (filters.maxPrice) {
      listings = listings.filter((l) => l.details?.pricePerUnit <= filters.maxPrice);
    }
    if (filters.minPrice) {
      listings = listings.filter((l) => l.details?.pricePerUnit >= filters.minPrice);
    }

    // Sort
    switch (sort) {
      case "price_low":
        listings.sort((a, b) => (a.details?.pricePerUnit || 0) - (b.details?.pricePerUnit || 0));
        break;
      case "price_high":
        listings.sort((a, b) => (b.details?.pricePerUnit || 0) - (a.details?.pricePerUnit || 0));
        break;
      case "quantity":
        listings.sort((a, b) => (b.details?.quantity || 0) - (a.details?.quantity || 0));
        break;
      case "created":
      default:
        listings.sort((a, b) => (b.timestamps?.created || 0) - (a.timestamps?.created || 0));
    }

    // Apply limit
    listings = listings.slice(0, Math.min(limit, 100));

    res.json({
      listings,
      count: listings.length,
      filters,
      sort,
    });
  } catch (error) {
    console.error("Failed to search listings:", error);
    res.status(500).json({ error: "Failed to search listings" });
  }
};

/**
 * Update a listing
 */
const updateListing = async (req, res) => {
  const { listingId, updateData } = req.body;

  if (!listingId || !updateData) {
    return res.status(400).json({ error: "Missing listingId or updateData" });
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = authHeader.split("Bearer ")[1];
  const db = admin.database();

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    const uid = decodedToken.uid;

    const listingSnapshot = await db.ref(`listings/${listingId}`).once("value");
    if (!listingSnapshot.exists()) {
      return res.status(404).json({ error: "Listing not found" });
    }

    const listing = listingSnapshot.val();
    if (listing.sellerId !== uid) {
      return res.status(403).json({ error: "Not authorized" });
    }

    if (listing.status !== "active") {
      return res.status(400).json({ error: "Cannot update non-active listing" });
    }

    // Only allow updating specific fields
    const updates = { "timestamps/updated": Date.now() };

    if (updateData.pricePerUnit !== undefined) {
      updates["details/pricePerUnit"] = Number(updateData.pricePerUnit);
      updates["details/totalPrice"] = Number(updateData.pricePerUnit) * listing.details.quantity;
    }
    if (updateData.minPurchase !== undefined) {
      updates["details/minPurchase"] = Math.min(Number(updateData.minPurchase), listing.details.quantity);
    }
    if (updateData.expiresInDays !== undefined) {
      updates["timestamps/expires"] = Date.now() + updateData.expiresInDays * 24 * 60 * 60 * 1000;
    }

    await db.ref(`listings/${listingId}`).update(updates);

    res.json({ success: true });
  } catch (error) {
    console.error("Failed to update listing:", error);
    res.status(500).json({ error: "Failed to update listing" });
  }
};

/**
 * Cancel a listing
 */
const cancelListing = async (req, res) => {
  const { listingId } = req.body;

  if (!listingId) {
    return res.status(400).json({ error: "Missing listingId" });
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = authHeader.split("Bearer ")[1];
  const db = admin.database();

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    const uid = decodedToken.uid;

    const listingSnapshot = await db.ref(`listings/${listingId}`).once("value");
    if (!listingSnapshot.exists()) {
      return res.status(404).json({ error: "Listing not found" });
    }

    const listing = listingSnapshot.val();
    if (listing.sellerId !== uid) {
      const userSnapshot = await db.ref(`users/${uid}/profile/role`).once("value");
      if (userSnapshot.val() !== "admin") {
        return res.status(403).json({ error: "Not authorized" });
      }
    }

    if (listing.status !== "active") {
      return res.status(400).json({ error: "Listing is not active" });
    }

    // Update listing status and revert credit
    const updates = {
      [`listings/${listingId}/status`]: "cancelled",
      [`listings/${listingId}/timestamps/updated`]: Date.now(),
      [`credits/${listing.creditId}/status`]: "verified",
      [`credits/${listing.creditId}/listing`]: null,
    };

    await db.ref().update(updates);

    res.json({ success: true });
  } catch (error) {
    console.error("Failed to cancel listing:", error);
    res.status(500).json({ error: "Failed to cancel listing" });
  }
};

/**
 * Purchase credits from a listing
 */
const purchaseCredits = async (req, res) => {
  const { listingId, quantity } = req.body;

  if (!listingId || !quantity) {
    return res.status(400).json({ error: "Missing listingId or quantity" });
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = authHeader.split("Bearer ")[1];
  const db = admin.database();

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    const buyerUid = decodedToken.uid;

    // Get listing
    const listingSnapshot = await db.ref(`listings/${listingId}`).once("value");
    if (!listingSnapshot.exists()) {
      return res.status(404).json({ error: "Listing not found" });
    }

    const listing = listingSnapshot.val();

    // Validations
    if (listing.status !== "active") {
      return res.status(400).json({ error: "Listing is not active" });
    }

    if (listing.sellerId === buyerUid) {
      return res.status(400).json({ error: "Cannot purchase your own listing" });
    }

    if (quantity > listing.details.quantity) {
      return res.status(400).json({ error: "Insufficient quantity available" });
    }

    if (quantity < listing.details.minPurchase) {
      return res.status(400).json({
        error: `Minimum purchase is ${listing.details.minPurchase} credits`,
      });
    }

    // Check if listing has expired
    if (listing.timestamps?.expires && listing.timestamps.expires < Date.now()) {
      return res.status(400).json({ error: "Listing has expired" });
    }

    // Get buyer and seller info
    const [buyerSnapshot, sellerSnapshot] = await Promise.all([
      db.ref(`users/${buyerUid}/profile`).once("value"),
      db.ref(`users/${listing.sellerId}/profile`).once("value"),
    ]);

    const buyerProfile = buyerSnapshot.val();
    const sellerProfile = sellerSnapshot.val();

    // Create order
    const orderId = db.ref("orders").push().key;
    const now = Date.now();
    const totalPrice = quantity * listing.details.pricePerUnit;

    const order = {
      type: "credit_purchase",
      status: "pending",
      buyer: {
        uid: buyerUid,
        email: buyerProfile?.email || "",
        company: buyerProfile?.company || "",
      },
      seller: {
        uid: listing.sellerId,
        email: sellerProfile?.email || "",
        company: sellerProfile?.company || "",
      },
      items: [
        {
          type: "credit",
          itemId: listing.creditId,
          listingId,
          quantity,
          unitPrice: listing.details.pricePerUnit,
          totalPrice,
          creditType: listing.details.creditType,
        },
      ],
      payment: {
        method: "stripe",
        stripePaymentIntentId: "",
        amount: totalPrice,
        currency: "USD",
        status: "pending",
      },
      timestamps: {
        created: now,
        updated: now,
        completed: null,
      },
    };

    await db.ref(`orders/${orderId}`).set(order);

    // Note: In production, you'd create a Stripe PaymentIntent here
    // For now, we'll return the order and let the frontend handle payment

    res.json({
      success: true,
      orderId,
      amount: totalPrice,
      currency: "USD",
      // In production, include Stripe clientSecret here
      // paymentIntent: { clientSecret: paymentIntent.client_secret }
    });
  } catch (error) {
    console.error("Failed to initiate purchase:", error);
    res.status(500).json({ error: "Failed to initiate purchase" });
  }
};

/**
 * Complete a purchase (after payment confirmed)
 */
const completePurchase = async (req, res) => {
  const { orderId, paymentIntentId } = req.body;

  if (!orderId) {
    return res.status(400).json({ error: "Missing orderId" });
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = authHeader.split("Bearer ")[1];
  const db = admin.database();

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    const uid = decodedToken.uid;

    const orderSnapshot = await db.ref(`orders/${orderId}`).once("value");
    if (!orderSnapshot.exists()) {
      return res.status(404).json({ error: "Order not found" });
    }

    const order = orderSnapshot.val();

    if (order.buyer.uid !== uid) {
      return res.status(403).json({ error: "Not authorized" });
    }

    if (order.status !== "pending") {
      return res.status(400).json({ error: "Order is not pending" });
    }

    // In production, verify payment with Stripe here
    // const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    // if (paymentIntent.status !== 'succeeded') { ... }

    const now = Date.now();
    const item = order.items[0]; // Single item for now

    // Update order status
    await db.ref(`orders/${orderId}`).update({
      status: "completed",
      "payment/status": "succeeded",
      "payment/stripePaymentIntentId": paymentIntentId || "manual",
      "timestamps/completed": now,
      "timestamps/updated": now,
    });

    // Update listing
    const listingSnapshot = await db.ref(`listings/${item.listingId}`).once("value");
    const listing = listingSnapshot.val();

    const remainingQuantity = listing.details.quantity - item.quantity;

    if (remainingQuantity <= 0) {
      // Listing fully sold
      await db.ref(`listings/${item.listingId}`).update({
        status: "sold",
        "details/quantity": 0,
        "timestamps/sold": now,
        "timestamps/updated": now,
      });

      // Update credit status
      await db.ref(`credits/${item.itemId}`).update({
        status: "sold",
        "ownership/currentOwner": uid,
        "ownership/transferHistory": admin.database.ServerValue.push({
          from: order.seller.uid,
          to: uid,
          date: now,
          price: item.totalPrice,
          orderId,
        }),
      });
    } else {
      // Partial sale - update quantity
      await db.ref(`listings/${item.listingId}`).update({
        "details/quantity": remainingQuantity,
        "details/totalPrice": remainingQuantity * listing.details.pricePerUnit,
        "timestamps/updated": now,
      });

      // In production, you'd split the credit here
      // For now, we'll just track the partial sale
    }

    // Log activity for both parties
    await Promise.all([
      db.ref(`users/${uid}/activity`).push({
        type: "credit_purchased",
        timestamp: now,
        metadata: { orderId, listingId: item.listingId, amount: item.totalPrice },
      }),
      db.ref(`users/${order.seller.uid}/activity`).push({
        type: "credit_sold",
        timestamp: now,
        metadata: { orderId, listingId: item.listingId, amount: item.totalPrice },
      }),
    ]);

    res.json({
      success: true,
      orderId,
      creditId: item.itemId,
      quantity: item.quantity,
    });
  } catch (error) {
    console.error("Failed to complete purchase:", error);
    res.status(500).json({ error: "Failed to complete purchase" });
  }
};

/**
 * Get user's orders (as buyer or seller)
 */
const getOrders = async (req, res) => {
  const { role = "buyer", status } = req.body;

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = authHeader.split("Bearer ")[1];
  const db = admin.database();

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    const uid = decodedToken.uid;

    const field = role === "seller" ? "seller/uid" : "buyer/uid";
    const snapshot = await db.ref("orders").orderByChild(field).equalTo(uid).once("value");

    let orders = Object.entries(snapshot.val() || {}).map(([id, o]) => ({ id, ...o }));

    if (status) {
      orders = orders.filter((o) => o.status === status);
    }

    orders.sort((a, b) => (b.timestamps?.created || 0) - (a.timestamps?.created || 0));

    res.json({ orders, count: orders.length });
  } catch (error) {
    console.error("Failed to get orders:", error);
    res.status(500).json({ error: "Failed to get orders" });
  }
};

/**
 * Get marketplace statistics
 */
const getMarketplaceStats = async (req, res) => {
  const db = admin.database();

  try {
    const [listingsSnapshot, ordersSnapshot, creditsSnapshot] = await Promise.all([
      db.ref("listings").once("value"),
      db.ref("orders").once("value"),
      db.ref("credits").once("value"),
    ]);

    const listings = Object.values(listingsSnapshot.val() || {});
    const orders = Object.values(ordersSnapshot.val() || {});
    const credits = Object.values(creditsSnapshot.val() || {});

    const activeListings = listings.filter((l) => l.status === "active");
    const completedOrders = orders.filter((o) => o.status === "completed");

    // Calculate totals
    const totalVolume = completedOrders.reduce((sum, o) => sum + (o.payment?.amount || 0), 0);
    const totalCreditsTraded = completedOrders.reduce(
      (sum, o) => sum + (o.items?.[0]?.quantity || 0),
      0
    );

    // Credit types breakdown
    const creditTypeStats = {};
    activeListings.forEach((l) => {
      const type = l.details?.creditType || "unknown";
      if (!creditTypeStats[type]) {
        creditTypeStats[type] = { count: 0, totalQuantity: 0, avgPrice: 0, prices: [] };
      }
      creditTypeStats[type].count++;
      creditTypeStats[type].totalQuantity += l.details?.quantity || 0;
      creditTypeStats[type].prices.push(l.details?.pricePerUnit || 0);
    });

    // Calculate averages
    Object.keys(creditTypeStats).forEach((type) => {
      const prices = creditTypeStats[type].prices;
      creditTypeStats[type].avgPrice =
        prices.length > 0 ? prices.reduce((a, b) => a + b, 0) / prices.length : 0;
      delete creditTypeStats[type].prices;
    });

    res.json({
      activeListings: activeListings.length,
      totalListings: listings.length,
      completedTransactions: completedOrders.length,
      totalVolume,
      totalCreditsTraded,
      verifiedCredits: credits.filter((c) => c.status === "verified").length,
      creditTypeStats,
    });
  } catch (error) {
    console.error("Failed to get marketplace stats:", error);
    res.status(500).json({ error: "Failed to get marketplace stats" });
  }
};

/**
 * Create a credit (for testing/demo)
 */
const createCredit = async (req, res) => {
  const { creditData } = req.body;

  if (!creditData || !creditData.type || !creditData.quantity) {
    return res.status(400).json({ error: "Missing required credit data" });
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = authHeader.split("Bearer ")[1];
  const db = admin.database();

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    const uid = decodedToken.uid;

    // Validate credit type
    const validTypes = ["nitrogen", "phosphorus", "stormwater", "thermal"];
    if (!validTypes.includes(creditData.type)) {
      return res.status(400).json({ error: "Invalid credit type" });
    }

    const creditId = db.ref("credits").push().key;
    const now = Date.now();

    const credit = {
      type: creditData.type,
      status: "verified", // Auto-verify for demo
      origin: {
        siteId: creditData.siteId || null,
        deviceId: creditData.deviceId || null,
        watershed: creditData.watershed || "",
        generatedFrom: creditData.generatedFrom || now - 30 * 24 * 60 * 60 * 1000,
        generatedTo: creditData.generatedTo || now,
        methodology: creditData.methodology || "sensor-based",
      },
      quantity: {
        amount: Number(creditData.quantity),
        unit: creditData.unit || "lbs",
      },
      verification: {
        verifiedAt: now,
        certificateHash: null,
        transactionHash: null,
      },
      ownership: {
        currentOwner: uid,
        originalOwner: uid,
        transferHistory: [],
      },
      listing: null,
      createdAt: now,
    };

    await db.ref(`credits/${creditId}`).set(credit);

    res.json({ success: true, creditId, credit });
  } catch (error) {
    console.error("Failed to create credit:", error);
    res.status(500).json({ error: "Failed to create credit" });
  }
};

/**
 * Get user's credits
 */
const getUserCredits = async (req, res) => {
  const { status } = req.body;

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = authHeader.split("Bearer ")[1];
  const db = admin.database();

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    const uid = decodedToken.uid;

    const snapshot = await db.ref("credits")
      .orderByChild("ownership/currentOwner")
      .equalTo(uid)
      .once("value");

    let credits = Object.entries(snapshot.val() || {}).map(([id, c]) => ({ id, ...c }));

    if (status) {
      credits = credits.filter((c) => c.status === status);
    }

    res.json({ credits, count: credits.length });
  } catch (error) {
    console.error("Failed to get credits:", error);
    res.status(500).json({ error: "Failed to get credits" });
  }
};

module.exports = {
  createListing,
  getListing,
  searchListings,
  updateListing,
  cancelListing,
  purchaseCredits,
  completePurchase,
  getOrders,
  getMarketplaceStats,
  createCredit,
  getUserCredits,
};
