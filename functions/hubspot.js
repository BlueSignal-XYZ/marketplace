/**
 * HubSpot Integration Module
 *
 * Handles all HubSpot CRM API interactions:
 * - Contacts (customers)
 * - Deals (orders)
 * - Custom Device objects
 * - Webhook processing
 */

const axios = require("axios");
const admin = require("firebase-admin");

// HubSpot API base URL
const HUBSPOT_API_BASE = "https://api.hubapi.com";

// Deal stage mapping (matches HubSpot pipeline configuration)
const ORDER_STATUS_TO_DEAL_STAGE = {
  draft: "lead",
  quoted: "quoted",
  approved: "qualified",
  paid: "closedwon",
  processing: "closedwon",
  shipped: "closedwon",
  fulfilled: "fulfilled",
  cancelled: "closedlost",
};

// Get HubSpot access token from Firebase secrets
const getAccessToken = () => {
  return process.env.HUBSPOT_ACCESS_TOKEN;
};

// Create axios instance for HubSpot API
const getHubSpotClient = () => {
  const token = getAccessToken();
  return axios.create({
    baseURL: HUBSPOT_API_BASE,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
};

// =============================================================================
// CONTACT ENDPOINTS (HTTP handlers)
// =============================================================================

exports.createContact = async (req, res) => {
  try {
    const { contactData } = req.body;
    const client = getHubSpotClient();

    const response = await client.post("/crm/v3/objects/contacts", {
      properties: {
        email: contactData.email,
        firstname: contactData.firstname,
        lastname: contactData.lastname,
        phone: contactData.phone,
        company: contactData.company,
        customer_type: contactData.customer_type,
        bluesignal_customer_id: contactData.bluesignal_customer_id,
      },
    });

    res.json({ id: response.data.id, properties: response.data.properties });
  } catch (error) {
    console.error("Error creating contact:", error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: error.response?.data?.message || error.message,
    });
  }
};

exports.updateContact = async (req, res) => {
  try {
    const { hubspotId, contactData } = req.body;
    const client = getHubSpotClient();

    const response = await client.patch(`/crm/v3/objects/contacts/${hubspotId}`, {
      properties: contactData,
    });

    res.json({ id: response.data.id, properties: response.data.properties });
  } catch (error) {
    console.error("Error updating contact:", error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: error.response?.data?.message || error.message,
    });
  }
};

exports.getContact = async (req, res) => {
  try {
    const { hubspotId } = req.body;
    const client = getHubSpotClient();

    const response = await client.get(`/crm/v3/objects/contacts/${hubspotId}`);
    res.json(response.data);
  } catch (error) {
    console.error("Error getting contact:", error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: error.response?.data?.message || error.message,
    });
  }
};

exports.getContactByEmail = async (req, res) => {
  try {
    const { email } = req.body;
    const client = getHubSpotClient();

    const response = await client.post("/crm/v3/objects/contacts/search", {
      filterGroups: [
        {
          filters: [
            {
              propertyName: "email",
              operator: "EQ",
              value: email,
            },
          ],
        },
      ],
    });

    const contact = response.data.results?.[0] || null;
    res.json(contact);
  } catch (error) {
    console.error("Error searching contact by email:", error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: error.response?.data?.message || error.message,
    });
  }
};

exports.searchContacts = async (req, res) => {
  try {
    const { query } = req.body;
    const client = getHubSpotClient();

    const response = await client.post("/crm/v3/objects/contacts/search", {
      query,
      limit: 20,
    });

    res.json(response.data.results);
  } catch (error) {
    console.error("Error searching contacts:", error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: error.response?.data?.message || error.message,
    });
  }
};

// =============================================================================
// DEAL ENDPOINTS (HTTP handlers)
// =============================================================================

exports.createDeal = async (req, res) => {
  try {
    const { dealData } = req.body;
    const client = getHubSpotClient();

    const response = await client.post("/crm/v3/objects/deals", {
      properties: {
        dealname: dealData.dealname,
        amount: dealData.amount?.toString(),
        dealstage: dealData.dealstage || "lead",
        pipeline: dealData.pipeline || "default",
        order_id: dealData.order_id || dealData.bluesignal_order_id,
        device_count: dealData.device_count?.toString(),
        payment_status: dealData.payment_status,
      },
    });

    res.json({ id: response.data.id, properties: response.data.properties });
  } catch (error) {
    console.error("Error creating deal:", error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: error.response?.data?.message || error.message,
    });
  }
};

exports.updateDeal = async (req, res) => {
  try {
    const { hubspotId, dealData } = req.body;
    const client = getHubSpotClient();

    const response = await client.patch(`/crm/v3/objects/deals/${hubspotId}`, {
      properties: dealData,
    });

    res.json({ id: response.data.id, properties: response.data.properties });
  } catch (error) {
    console.error("Error updating deal:", error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: error.response?.data?.message || error.message,
    });
  }
};

exports.updateDealStage = async (req, res) => {
  try {
    const { hubspotId, stage } = req.body;
    const client = getHubSpotClient();

    const response = await client.patch(`/crm/v3/objects/deals/${hubspotId}`, {
      properties: {
        dealstage: stage,
      },
    });

    res.json({ id: response.data.id, properties: response.data.properties });
  } catch (error) {
    console.error("Error updating deal stage:", error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: error.response?.data?.message || error.message,
    });
  }
};

exports.getDeal = async (req, res) => {
  try {
    const { hubspotId } = req.body;
    const client = getHubSpotClient();

    const response = await client.get(`/crm/v3/objects/deals/${hubspotId}`);
    res.json(response.data);
  } catch (error) {
    console.error("Error getting deal:", error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: error.response?.data?.message || error.message,
    });
  }
};

exports.searchDeals = async (req, res) => {
  try {
    const { query } = req.body;
    const client = getHubSpotClient();

    const response = await client.post("/crm/v3/objects/deals/search", {
      query,
      limit: 20,
    });

    res.json(response.data.results);
  } catch (error) {
    console.error("Error searching deals:", error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: error.response?.data?.message || error.message,
    });
  }
};

exports.associateDealWithContact = async (req, res) => {
  try {
    const { dealId, contactId } = req.body;
    const client = getHubSpotClient();

    await client.put(
      `/crm/v3/objects/deals/${dealId}/associations/contacts/${contactId}/deal_to_contact`
    );

    res.json({ success: true });
  } catch (error) {
    console.error("Error associating deal with contact:", error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: error.response?.data?.message || error.message,
    });
  }
};

// =============================================================================
// DEVICE ENDPOINTS (Custom Object - HTTP handlers)
// =============================================================================

exports.createDevice = async (req, res) => {
  try {
    const { deviceData, dealId } = req.body;
    const client = getHubSpotClient();

    // Note: Custom objects require enterprise HubSpot
    // For now, we'll store device info as deal properties
    if (dealId) {
      const response = await client.patch(`/crm/v3/objects/deals/${dealId}`, {
        properties: {
          device_serials: deviceData.device_serial,
          installation_status: deviceData.device_lifecycle,
        },
      });
      res.json({ id: response.data.id, properties: response.data.properties });
    } else {
      res.status(400).json({ error: "dealId is required" });
    }
  } catch (error) {
    console.error("Error creating device:", error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: error.response?.data?.message || error.message,
    });
  }
};

exports.updateDevice = async (req, res) => {
  try {
    const { hubspotId, deviceData } = req.body;
    const client = getHubSpotClient();

    // Update deal with device info
    const response = await client.patch(`/crm/v3/objects/deals/${hubspotId}`, {
      properties: {
        installation_status: deviceData.device_lifecycle || deviceData.commission_status,
      },
    });

    res.json({ id: response.data.id, properties: response.data.properties });
  } catch (error) {
    console.error("Error updating device:", error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: error.response?.data?.message || error.message,
    });
  }
};

exports.getDevice = async (req, res) => {
  try {
    const { hubspotId } = req.body;
    const client = getHubSpotClient();

    const response = await client.get(`/crm/v3/objects/deals/${hubspotId}`, {
      params: {
        properties: "device_serials,installation_status",
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error("Error getting device:", error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: error.response?.data?.message || error.message,
    });
  }
};

exports.associateDeviceWithDeal = async (req, res) => {
  try {
    // Since we're storing device info on deals, this is a no-op
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// =============================================================================
// SYNC ENDPOINTS (HTTP handlers)
// =============================================================================

exports.getSyncStatus = async (req, res) => {
  try {
    const { entityType, entityId } = req.body;

    const snapshot = await admin
      .database()
      .ref(`/${entityType}s/${entityId}`)
      .once("value");
    const entity = snapshot.val();

    res.json({
      synced: !!entity?.hubspotContactId || !!entity?.hubspotDealId,
      hubspotId: entity?.hubspotContactId || entity?.hubspotDealId,
      lastSyncedAt: entity?.hubspotSyncedAt,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.syncEntity = async (req, res) => {
  try {
    const { entityType, entityId, forceSync } = req.body;

    const snapshot = await admin
      .database()
      .ref(`/${entityType}s/${entityId}`)
      .once("value");
    const entity = snapshot.val();

    if (!entity) {
      res.status(404).json({ error: "Entity not found" });
      return;
    }

    let hubspotId;
    if (entityType === "customer") {
      hubspotId = await exports.syncCustomerToHubSpot(entity);
    } else if (entityType === "order") {
      hubspotId = await exports.syncOrderToHubSpot(entity, null);
    }

    if (hubspotId) {
      const updateField =
        entityType === "customer" ? "hubspotContactId" : "hubspotDealId";
      await snapshot.ref.update({
        [updateField]: hubspotId,
        hubspotSyncedAt: new Date().toISOString(),
      });
    }

    res.json({ success: true, hubspotId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.syncCustomer = async (req, res) => {
  try {
    const { customer } = req.body;
    const hubspotId = await exports.syncCustomerToHubSpot(customer);
    res.json({ success: true, hubspotId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.syncOrder = async (req, res) => {
  try {
    const { order, customer } = req.body;
    const hubspotId = await exports.syncOrderToHubSpot(order, customer);
    res.json({ success: true, hubspotId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.syncDevice = async (req, res) => {
  try {
    const { device, dealId } = req.body;
    await exports.syncDeviceToHubSpot(device, dealId);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.batchSync = async (req, res) => {
  try {
    const { entities } = req.body;
    const results = [];

    for (const entity of entities) {
      try {
        let hubspotId;
        if (entity.type === "customer") {
          hubspotId = await exports.syncCustomerToHubSpot(entity.data);
        } else if (entity.type === "order") {
          hubspotId = await exports.syncOrderToHubSpot(entity.data, null);
        }
        results.push({ id: entity.id, success: true, hubspotId });
      } catch (error) {
        results.push({ id: entity.id, success: false, error: error.message });
      }
    }

    res.json({ results });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// =============================================================================
// WEBHOOK HANDLERS (HTTP handlers)
// =============================================================================

exports.handleDealWebhook = async (req, res) => {
  try {
    const { payload } = req.body;
    await exports.processWebhookEvent(payload);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.handleContactWebhook = async (req, res) => {
  try {
    const { payload } = req.body;
    await exports.processWebhookEvent(payload);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// =============================================================================
// INTERNAL SYNC FUNCTIONS (used by database triggers)
// =============================================================================

/**
 * Sync customer to HubSpot as Contact
 * @returns {string} HubSpot contact ID
 */
exports.syncCustomerToHubSpot = async (customer) => {
  const client = getHubSpotClient();

  // Check if contact already exists by email
  let existingContact = null;
  try {
    const searchResponse = await client.post("/crm/v3/objects/contacts/search", {
      filterGroups: [
        {
          filters: [
            {
              propertyName: "email",
              operator: "EQ",
              value: customer.email,
            },
          ],
        },
      ],
    });
    existingContact = searchResponse.data.results?.[0];
  } catch (error) {
    console.log("Contact search failed, will create new:", error.message);
  }

  const nameParts = (customer.name || "").split(" ");
  const contactData = {
    email: customer.email,
    firstname: nameParts[0] || "",
    lastname: nameParts.slice(1).join(" ") || "",
    phone: customer.phone || "",
    company: customer.company || "",
    customer_type: customer.type || "commercial",
    site_count: (customer.siteIds?.length || 0).toString(),
    device_count: (customer.deviceCount || 0).toString(),
  };

  if (existingContact) {
    // Update existing contact
    await client.patch(`/crm/v3/objects/contacts/${existingContact.id}`, {
      properties: contactData,
    });
    return existingContact.id;
  } else {
    // Create new contact
    const createResponse = await client.post("/crm/v3/objects/contacts", {
      properties: contactData,
    });
    return createResponse.data.id;
  }
};

/**
 * Sync order to HubSpot as Deal
 * @returns {string} HubSpot deal ID
 */
exports.syncOrderToHubSpot = async (order, customer) => {
  const client = getHubSpotClient();

  const dealStage = ORDER_STATUS_TO_DEAL_STAGE[order.status] || "lead";
  const deviceCount = order.lineItems?.reduce((sum, item) => sum + (item.quantity || 1), 0) || 0;

  const dealData = {
    dealname: `BlueSignal Order ${order.id}`,
    amount: (order.total || 0).toString(),
    dealstage: dealStage,
    pipeline: "default",
    order_id: order.id,
    device_count: deviceCount.toString(),
    payment_status: order.paymentStatus || "unpaid",
  };

  if (order.hubspotDealId) {
    // Update existing deal
    await client.patch(`/crm/v3/objects/deals/${order.hubspotDealId}`, {
      properties: dealData,
    });
    return order.hubspotDealId;
  } else {
    // Create new deal
    const createResponse = await client.post("/crm/v3/objects/deals", {
      properties: dealData,
    });
    const dealId = createResponse.data.id;

    // Associate with contact if available
    if (customer?.hubspotContactId) {
      try {
        await client.put(
          `/crm/v3/objects/deals/${dealId}/associations/contacts/${customer.hubspotContactId}/deal_to_contact`
        );
      } catch (error) {
        console.log("Failed to associate deal with contact:", error.message);
      }
    }

    return dealId;
  }
};

/**
 * Sync device info to HubSpot deal
 */
exports.syncDeviceToHubSpot = async (device, dealId) => {
  if (!dealId) return;

  const client = getHubSpotClient();

  await client.patch(`/crm/v3/objects/deals/${dealId}`, {
    properties: {
      device_serials: device.serialNumber || device.id,
      installation_status: device.lifecycle || device.commissionStatus || "pending",
    },
  });
};

/**
 * Update deal stage based on order status
 */
exports.updateDealStageFromStatus = async (hubspotDealId, orderStatus) => {
  const client = getHubSpotClient();
  const dealStage = ORDER_STATUS_TO_DEAL_STAGE[orderStatus] || "lead";

  await client.patch(`/crm/v3/objects/deals/${hubspotDealId}`, {
    properties: {
      dealstage: dealStage,
    },
  });
};

/**
 * Update deal with commission/installation info
 */
exports.updateDealCommissionStatus = async (hubspotDealId, commission, device) => {
  const client = getHubSpotClient();

  const installationStatus =
    commission.status === "passed" ? "commissioned" : "commission_failed";

  await client.patch(`/crm/v3/objects/deals/${hubspotDealId}`, {
    properties: {
      installation_status: installationStatus,
      installer_assigned: commission.installerId || "",
      device_serials: device?.serialNumber || device?.id || "",
    },
  });
};

/**
 * Check if all devices in an order are active
 */
exports.checkAllOrderDevicesActive = async (orderId) => {
  const orderSnapshot = await admin
    .database()
    .ref(`/orders/${orderId}`)
    .once("value");
  const order = orderSnapshot.val();

  if (!order?.deviceIds || order.deviceIds.length === 0) {
    return false;
  }

  for (const deviceId of order.deviceIds) {
    const deviceSnapshot = await admin
      .database()
      .ref(`/devices/${deviceId}`)
      .once("value");
    const device = deviceSnapshot.val();

    if (device?.lifecycle !== "active") {
      return false;
    }
  }

  return true;
};

/**
 * Update deal with all device serial numbers
 */
exports.updateDealDeviceInfo = async (hubspotDealId, orderId) => {
  const client = getHubSpotClient();

  const orderSnapshot = await admin
    .database()
    .ref(`/orders/${orderId}`)
    .once("value");
  const order = orderSnapshot.val();

  if (!order?.deviceIds) return;

  const serials = [];
  for (const deviceId of order.deviceIds) {
    const deviceSnapshot = await admin
      .database()
      .ref(`/devices/${deviceId}`)
      .once("value");
    const device = deviceSnapshot.val();
    if (device?.serialNumber) {
      serials.push(device.serialNumber);
    } else {
      serials.push(deviceId);
    }
  }

  await client.patch(`/crm/v3/objects/deals/${hubspotDealId}`, {
    properties: {
      device_serials: serials.join(", "),
    },
  });
};

/**
 * Process incoming HubSpot webhook event
 */
exports.processWebhookEvent = async (event) => {
  console.log("Processing HubSpot webhook event:", JSON.stringify(event));

  const { subscriptionType, objectId, propertyName, propertyValue } = event;

  if (subscriptionType === "deal.propertyChange") {
    // Deal property changed in HubSpot - sync back to Firebase
    if (propertyName === "dealstage") {
      // Find order by hubspotDealId
      const ordersSnapshot = await admin
        .database()
        .ref("/orders")
        .orderByChild("hubspotDealId")
        .equalTo(objectId.toString())
        .once("value");

      const orders = ordersSnapshot.val();
      if (orders) {
        const orderId = Object.keys(orders)[0];
        const order = orders[orderId];

        // Map HubSpot stage back to order status
        const stageToStatus = {
          lead: "draft",
          qualified: "approved",
          quoted: "quoted",
          closedwon: "paid",
          fulfilled: "fulfilled",
          closedlost: "cancelled",
        };

        const newStatus = stageToStatus[propertyValue] || order.status;

        if (newStatus !== order.status) {
          await admin.database().ref(`/orders/${orderId}`).update({
            status: newStatus,
            hubspotSyncedAt: new Date().toISOString(),
            lastModifiedSource: "hubspot",
          });
          console.log(`Order ${orderId} status updated from HubSpot: ${newStatus}`);
        }
      }
    }
  } else if (subscriptionType === "contact.propertyChange") {
    // Contact property changed in HubSpot - sync back to Firebase
    const customersSnapshot = await admin
      .database()
      .ref("/customers")
      .orderByChild("hubspotContactId")
      .equalTo(objectId.toString())
      .once("value");

    const customers = customersSnapshot.val();
    if (customers) {
      const customerId = Object.keys(customers)[0];
      console.log(`Customer ${customerId} updated in HubSpot`);
      // Optionally sync specific fields back
    }
  }
};
