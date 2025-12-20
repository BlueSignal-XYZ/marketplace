/**
 * BlueSignal Firebase Cloud Functions
 *
 * HubSpot CRM Integration Functions
 */

const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");

// Initialize Firebase Admin
admin.initializeApp();

// Import HubSpot functions
const hubspot = require("./hubspot");

// Create Express app for HTTP endpoints
const app = express();

// SECURITY: Restrict CORS to allowed origins only
const allowedOrigins = [
  'https://waterquality.trading',
  'https://www.waterquality.trading',
  'https://cloud.bluesignal.xyz',
  'https://sales.bluesignal.xyz',
  'https://waterquality-trading.web.app',
  'https://cloud-bluesignal.web.app',
  'https://sales-bluesignal.web.app',
  // Allow localhost for development
  'http://localhost:3000',
  'http://localhost:5173',
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`CORS blocked origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
app.use(express.json());

// =============================================================================
// HUBSPOT HTTP ENDPOINTS
// =============================================================================

// Contact endpoints
app.post("/hubspot/contacts/create", hubspot.createContact);
app.post("/hubspot/contacts/update", hubspot.updateContact);
app.post("/hubspot/contacts/get", hubspot.getContact);
app.post("/hubspot/contacts/get-by-email", hubspot.getContactByEmail);
app.post("/hubspot/contacts/search", hubspot.searchContacts);

// Deal endpoints
app.post("/hubspot/deals/create", hubspot.createDeal);
app.post("/hubspot/deals/update", hubspot.updateDeal);
app.post("/hubspot/deals/update-stage", hubspot.updateDealStage);
app.post("/hubspot/deals/get", hubspot.getDeal);
app.post("/hubspot/deals/search", hubspot.searchDeals);
app.post("/hubspot/deals/associate-contact", hubspot.associateDealWithContact);

// Device endpoints
app.post("/hubspot/devices/create", hubspot.createDevice);
app.post("/hubspot/devices/update", hubspot.updateDevice);
app.post("/hubspot/devices/get", hubspot.getDevice);
app.post("/hubspot/devices/associate-deal", hubspot.associateDeviceWithDeal);

// Sync endpoints
app.post("/hubspot/sync/status", hubspot.getSyncStatus);
app.post("/hubspot/sync/entity", hubspot.syncEntity);
app.post("/hubspot/sync/customer", hubspot.syncCustomer);
app.post("/hubspot/sync/order", hubspot.syncOrder);
app.post("/hubspot/sync/device", hubspot.syncDevice);
app.post("/hubspot/sync/batch", hubspot.batchSync);

// Webhook endpoints
app.post("/hubspot/webhooks/deal", hubspot.handleDealWebhook);
app.post("/hubspot/webhooks/contact", hubspot.handleContactWebhook);

// Export the Express app as a Cloud Function
exports.app = functions
  .runWith({
    secrets: ["HUBSPOT_ACCESS_TOKEN"],
    timeoutSeconds: 60,
    memory: "256MB",
  })
  .https.onRequest(app);

// =============================================================================
// DATABASE TRIGGERS - Auto-sync to HubSpot
// =============================================================================

/**
 * Trigger: Customer Created
 * Auto-sync new customer to HubSpot as Contact
 */
exports.onCustomerCreated = functions
  .runWith({ secrets: ["HUBSPOT_ACCESS_TOKEN"] })
  .database.ref("/customers/{customerId}")
  .onCreate(async (snapshot, context) => {
    const customer = snapshot.val();
    const customerId = context.params.customerId;

    console.log(`Customer created: ${customerId}`);

    try {
      const hubspotContactId = await hubspot.syncCustomerToHubSpot(customer);

      // Update customer with HubSpot ID
      if (hubspotContactId) {
        await snapshot.ref.update({
          hubspotContactId,
          hubspotSyncedAt: new Date().toISOString(),
        });
      }

      console.log(`Customer ${customerId} synced to HubSpot: ${hubspotContactId}`);
    } catch (error) {
      console.error(`Failed to sync customer ${customerId}:`, error);
      // Log sync failure
      await admin.database().ref(`/syncErrors/${customerId}`).set({
        type: "customer",
        entityId: customerId,
        error: error.message,
        timestamp: new Date().toISOString(),
      });
    }
  });

/**
 * Trigger: Customer Updated
 * Sync customer updates to HubSpot
 */
exports.onCustomerUpdated = functions
  .runWith({ secrets: ["HUBSPOT_ACCESS_TOKEN"] })
  .database.ref("/customers/{customerId}")
  .onUpdate(async (change, context) => {
    const before = change.before.val();
    const after = change.after.val();
    const customerId = context.params.customerId;

    // Skip if only hubspot fields changed (prevent infinite loop)
    const relevantFields = ["name", "email", "phone", "company", "type", "address"];
    const hasRelevantChange = relevantFields.some(
      (field) => JSON.stringify(before[field]) !== JSON.stringify(after[field])
    );

    if (!hasRelevantChange) {
      return null;
    }

    console.log(`Customer updated: ${customerId}`);

    try {
      const hubspotContactId = await hubspot.syncCustomerToHubSpot(after);

      if (hubspotContactId && hubspotContactId !== after.hubspotContactId) {
        await change.after.ref.update({
          hubspotContactId,
          hubspotSyncedAt: new Date().toISOString(),
        });
      }

      console.log(`Customer ${customerId} updated in HubSpot`);
    } catch (error) {
      console.error(`Failed to update customer ${customerId}:`, error);
    }
  });

/**
 * Trigger: Order Created
 * Auto-sync new order to HubSpot as Deal
 */
exports.onOrderCreated = functions
  .runWith({ secrets: ["HUBSPOT_ACCESS_TOKEN"] })
  .database.ref("/orders/{orderId}")
  .onCreate(async (snapshot, context) => {
    const order = snapshot.val();
    const orderId = context.params.orderId;

    console.log(`Order created: ${orderId}`);

    try {
      // Get customer for association
      let customer = null;
      if (order.customerId) {
        const customerSnapshot = await admin
          .database()
          .ref(`/customers/${order.customerId}`)
          .once("value");
        customer = customerSnapshot.val();
      }

      const hubspotDealId = await hubspot.syncOrderToHubSpot(order, customer);

      // Update order with HubSpot ID
      if (hubspotDealId) {
        await snapshot.ref.update({
          hubspotDealId,
          hubspotSyncedAt: new Date().toISOString(),
        });
      }

      console.log(`Order ${orderId} synced to HubSpot: ${hubspotDealId}`);
    } catch (error) {
      console.error(`Failed to sync order ${orderId}:`, error);
      await admin.database().ref(`/syncErrors/${orderId}`).set({
        type: "order",
        entityId: orderId,
        error: error.message,
        timestamp: new Date().toISOString(),
      });
    }
  });

/**
 * Trigger: Order Status Changed
 * Update HubSpot deal stage when order status changes
 */
exports.onOrderUpdated = functions
  .runWith({ secrets: ["HUBSPOT_ACCESS_TOKEN"] })
  .database.ref("/orders/{orderId}")
  .onUpdate(async (change, context) => {
    const before = change.before.val();
    const after = change.after.val();
    const orderId = context.params.orderId;

    // Check if status changed
    if (before.status === after.status) {
      return null;
    }

    console.log(`Order status changed: ${orderId} ${before.status} -> ${after.status}`);

    try {
      if (after.hubspotDealId) {
        await hubspot.updateDealStageFromStatus(after.hubspotDealId, after.status);
        await change.after.ref.update({
          hubspotSyncedAt: new Date().toISOString(),
        });
        console.log(`Order ${orderId} deal stage updated in HubSpot`);
      }
    } catch (error) {
      console.error(`Failed to update order ${orderId} deal stage:`, error);
    }
  });

/**
 * Trigger: Commission Completed
 * Update HubSpot deal with device/installation info
 */
exports.onCommissionCompleted = functions
  .runWith({ secrets: ["HUBSPOT_ACCESS_TOKEN"] })
  .database.ref("/commissions/{commissionId}")
  .onUpdate(async (change, context) => {
    const before = change.before.val();
    const after = change.after.val();
    const commissionId = context.params.commissionId;

    // Only trigger on completion (status changes to passed or failed)
    if (before.status === after.status) {
      return null;
    }

    if (after.status !== "passed" && after.status !== "failed") {
      return null;
    }

    console.log(`Commission completed: ${commissionId} with status ${after.status}`);

    try {
      // Get order to find HubSpot deal ID
      if (after.orderId) {
        const orderSnapshot = await admin
          .database()
          .ref(`/orders/${after.orderId}`)
          .once("value");
        const order = orderSnapshot.val();

        if (order?.hubspotDealId) {
          // Get device info
          const deviceSnapshot = await admin
            .database()
            .ref(`/devices/${after.deviceId}`)
            .once("value");
          const device = deviceSnapshot.val();

          // Update deal with commission info
          await hubspot.updateDealCommissionStatus(
            order.hubspotDealId,
            after,
            device
          );

          console.log(`Commission ${commissionId} synced to HubSpot deal`);
        }
      }
    } catch (error) {
      console.error(`Failed to sync commission ${commissionId}:`, error);
    }
  });

/**
 * Trigger: Device Activated
 * Update HubSpot deal when device becomes active
 */
exports.onDeviceActivated = functions
  .runWith({ secrets: ["HUBSPOT_ACCESS_TOKEN"] })
  .database.ref("/devices/{deviceId}")
  .onUpdate(async (change, context) => {
    const before = change.before.val();
    const after = change.after.val();
    const deviceId = context.params.deviceId;

    // Only trigger on lifecycle change to 'active'
    if (before.lifecycle === after.lifecycle || after.lifecycle !== "active") {
      return null;
    }

    console.log(`Device activated: ${deviceId}`);

    try {
      if (after.orderId) {
        const orderSnapshot = await admin
          .database()
          .ref(`/orders/${after.orderId}`)
          .once("value");
        const order = orderSnapshot.val();

        if (order?.hubspotDealId) {
          // Check if all devices in order are now active
          const allDevicesActive = await hubspot.checkAllOrderDevicesActive(after.orderId);

          if (allDevicesActive) {
            // Update deal stage to Fulfilled
            await hubspot.updateDealStageFromStatus(order.hubspotDealId, "fulfilled");
            console.log(`Order ${after.orderId} fulfilled - all devices active`);
          }

          // Update device serials on deal
          await hubspot.updateDealDeviceInfo(order.hubspotDealId, after.orderId);
        }
      }
    } catch (error) {
      console.error(`Failed to sync device activation ${deviceId}:`, error);
    }
  });

// =============================================================================
// HUBSPOT WEBHOOK RECEIVER
// =============================================================================

/**
 * HTTP Endpoint: HubSpot Webhook Receiver
 * Receives webhooks from HubSpot for deal/contact updates
 * SECURITY: Verifies HubSpot signature before processing
 */
const crypto = require("crypto");

// Verify HubSpot webhook signature
const verifyHubSpotSignature = (req, clientSecret) => {
  if (!clientSecret) {
    console.warn("HUBSPOT_CLIENT_SECRET not configured - signature verification skipped");
    return true; // Skip verification if secret not configured (for backwards compatibility)
  }

  const signature = req.headers["x-hubspot-signature-v3"] || req.headers["x-hubspot-signature"];
  if (!signature) {
    console.warn("No HubSpot signature found in request headers");
    return false;
  }

  try {
    // HubSpot v3 signature: HMAC SHA256 of request body
    const requestBody = typeof req.body === "string" ? req.body : JSON.stringify(req.body);
    const expectedHash = crypto
      .createHmac("sha256", clientSecret)
      .update(requestBody)
      .digest("hex");

    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedHash)
    );
  } catch (error) {
    console.error("Signature verification error:", error);
    return false;
  }
};

exports.hubspotWebhook = functions
  .runWith({
    secrets: ["HUBSPOT_ACCESS_TOKEN", "HUBSPOT_CLIENT_SECRET"],
    timeoutSeconds: 30,
  })
  .https.onRequest(async (req, res) => {
    // Only accept POST requests
    if (req.method !== "POST") {
      res.status(405).send("Method Not Allowed");
      return;
    }

    // SECURITY: Verify webhook signature
    const clientSecret = process.env.HUBSPOT_CLIENT_SECRET;
    if (!verifyHubSpotSignature(req, clientSecret)) {
      console.error("Invalid webhook signature - rejecting request");
      res.status(401).send("Invalid signature");
      return;
    }

    try {
      const events = req.body;

      // HubSpot sends array of events
      if (!Array.isArray(events)) {
        res.status(200).send("OK");
        return;
      }

      for (const event of events) {
        await hubspot.processWebhookEvent(event);
      }

      res.status(200).send("OK");
    } catch (error) {
      console.error("Webhook processing error");
      res.status(500).send("Error processing webhook");
    }
  });
