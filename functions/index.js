/**
 * BlueSignal Firebase Cloud Functions
 *
 * Complete Backend Implementation including:
 * - HubSpot CRM Integration
 * - User Authentication & Profiles
 * - Device QR Code & Registration
 * - Device Commissioning Workflow
 * - Site Management & Geocoding
 * - Sensor Data Ingestion & Alerts
 * - Marketplace Listings & Purchases
 */

const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");

// Initialize Firebase Admin
admin.initializeApp();

// Import modules
const hubspot = require("./hubspot");
const auth = require("./auth");
const qrcode = require("./qrcode");
const commissioning = require("./commissioning");
const sites = require("./sites");
const readings = require("./readings");
const marketplace = require("./marketplace");
const virginia = require("./virginia");
const preorder = require("./preorder");

// Create Express app for HTTP endpoints
const app = express();

// SECURITY: Restrict CORS to allowed origins only
const allowedOrigins = [
  'https://waterquality.trading',
  'https://www.waterquality.trading',
  'https://cloud.bluesignal.xyz',
  'https://bluesignal.xyz',
  'https://www.bluesignal.xyz',
  'https://waterquality-trading.web.app',
  'https://cloud-bluesignal.web.app',
  'https://landing-bluesignal.web.app',
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

// =============================================================================
// USER PROFILE ENDPOINTS
// =============================================================================

app.post("/user/profile/get", auth.getUserProfile);
app.post("/user/profile/update", auth.updateUserProfile);
app.post("/user/role/update", auth.updateUserRole);
app.post("/user/onboarding/complete", auth.completeOnboarding);

// =============================================================================
// QR CODE & DEVICE REGISTRATION ENDPOINTS
// =============================================================================

app.post("/device/qr/generate", qrcode.generateDeviceQR);
app.post("/device/qr/generate-batch", qrcode.batchGenerateQR);
app.post("/device/qr/validate", qrcode.validateDeviceQR);
app.post("/device/register", qrcode.registerDevice);

// =============================================================================
// COMMISSIONING WORKFLOW ENDPOINTS
// =============================================================================

app.post("/commission/initiate", commissioning.initiateCommission);
app.post("/commission/update-step", commissioning.updateCommissionStep);
app.post("/commission/complete", commissioning.completeCommission);
app.post("/commission/get", commissioning.getCommission);
app.post("/commission/list", commissioning.listCommissions);
app.post("/commission/cancel", commissioning.cancelCommission);
app.post("/commission/run-tests", commissioning.runCommissionTests);

// =============================================================================
// SITE MANAGEMENT ENDPOINTS
// =============================================================================

app.post("/site/create", sites.createSite);
app.post("/site/get", sites.getSite);
app.post("/site/update", sites.updateSite);
app.post("/site/list", sites.listSites);
app.post("/site/delete", sites.deleteSite);
app.post("/site/add-device", sites.addDeviceToSite);
app.post("/site/remove-device", sites.removeDeviceFromSite);
app.post("/site/update-boundary", sites.updateSiteBoundary);
app.post("/geocode/address", sites.geocodeAddress);
app.post("/geocode/reverse", sites.reverseGeocode);

// =============================================================================
// SENSOR READINGS & ALERTS ENDPOINTS
// =============================================================================

app.post("/readings/get", readings.getDeviceReadings);
app.post("/readings/stats", readings.getDeviceStats);
app.post("/alerts/active", readings.getActiveAlerts);
app.post("/alerts/acknowledge", readings.acknowledgeAlert);
app.post("/alerts/resolve", readings.resolveAlert);
app.post("/device/thresholds/update", readings.updateAlertThresholds);

// =============================================================================
// MARKETPLACE ENDPOINTS
// =============================================================================

app.post("/marketplace/listing/create", marketplace.createListing);
app.post("/marketplace/listing/get", marketplace.getListing);
app.post("/marketplace/listing/update", marketplace.updateListing);
app.post("/marketplace/listing/cancel", marketplace.cancelListing);
app.post("/marketplace/listings/search", marketplace.searchListings);
app.post("/marketplace/purchase", marketplace.purchaseCredits);
app.post("/marketplace/purchase/complete", marketplace.completePurchase);
app.post("/marketplace/orders", marketplace.getOrders);
app.post("/marketplace/stats", marketplace.getMarketplaceStats);
app.post("/credits/create", marketplace.createCredit);
app.post("/credits/user", marketplace.getUserCredits);

// =============================================================================
// PRE-ORDER CAPTURE (Landing Page)
// =============================================================================

app.post("/preOrderCapture", preorder.capturePreOrder);

// =============================================================================
// VIRGINIA NUTRIENT CREDIT EXCHANGE ENDPOINTS
// =============================================================================

// Basins
app.get("/virginia/basins", virginia.getBasins);
app.post("/virginia/basins", virginia.getBasins);
app.post("/virginia/basin", virginia.getBasin);

// Projects
app.post("/virginia/projects/create", virginia.createProject);
app.post("/virginia/projects/get", virginia.getProject);
app.post("/virginia/projects/update", virginia.updateProject);
app.post("/virginia/projects/list", virginia.listProjects);
app.post("/virginia/projects/link-device", virginia.linkDevice);
app.post("/virginia/projects/unlink-device", virginia.unlinkDevice);

// Credits
app.post("/virginia/credits/calculate", virginia.calculateCredits);
app.post("/virginia/credits/generate", virginia.generateCredits);
app.post("/virginia/credits", virginia.getCredits);
app.post("/virginia/credits/validate-transfer", virginia.validateTransfer);

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

// =============================================================================
// AUTHENTICATION TRIGGERS
// =============================================================================

/**
 * Trigger: User Created in Firebase Auth
 * Creates user profile in database
 */
exports.onUserCreate = auth.onUserCreate;

/**
 * Trigger: User Deleted from Firebase Auth
 * Cleans up user data
 */
exports.onUserDelete = auth.onUserDelete;

// =============================================================================
// SENSOR DATA INGESTION
// =============================================================================

/**
 * HTTP Endpoint: Sensor Data Ingestion
 * Devices POST sensor readings here (API key auth)
 */
exports.ingestReading = functions
  .runWith({
    timeoutSeconds: 60,
    memory: "256MB",
  })
  .https.onRequest(readings.ingestReading);

// =============================================================================
// SCHEDULED FUNCTIONS
// =============================================================================

/**
 * Scheduled: Device Health Check
 * Runs every 15 minutes to monitor device connectivity
 */
exports.deviceHealthCheck = readings.deviceHealthCheck;

// =============================================================================
// TTN v3 LORAWAN WEBHOOK
// =============================================================================

/**
 * HTTP Endpoint: TTN v3 Webhook
 * Receives LoRaWAN uplinks from The Things Network.
 * Authenticates via shared secret (TTN_WEBHOOK_SECRET).
 * Separate Cloud Function -- not behind Express CORS/auth.
 */
exports.ttnWebhook = functions
  .runWith({
    secrets: ["TTN_WEBHOOK_SECRET"],
    timeoutSeconds: 30,
    memory: "256MB",
  })
  .https.onRequest(readings.ttnWebhook);
