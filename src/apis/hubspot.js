/**
 * HubSpot API Client
 *
 * Handles integration with HubSpot CRM for:
 * - Contact management (customers)
 * - Deal management (orders)
 * - Custom object management (devices)
 * - Webhook handling for inbound updates
 *
 * Note: All HubSpot API calls should go through the backend server
 * to protect API keys. This client calls our Cloud Functions which
 * then communicate with HubSpot.
 */

import axios from 'axios';
import configs from '../../configs';

// HubSpot deal stages mapped to our order statuses
export const HUBSPOT_DEAL_STAGES = {
  lead: 'Lead',
  qualified: 'Qualified',
  quoted: 'Quoted',
  closed_won: 'Closed Won',
  fulfilled: 'Fulfilled',
  cancelled: 'Cancelled',
};

// Map our order status to HubSpot deal stage
export const ORDER_STATUS_TO_DEAL_STAGE = {
  draft: 'Lead',
  quoted: 'Quoted',
  approved: 'Qualified',
  paid: 'Closed Won',
  processing: 'Closed Won',
  shipped: 'Closed Won',
  fulfilled: 'Fulfilled',
  cancelled: 'Cancelled',
};

// HubSpot Contact API
const createContact = async (contactData) => {
  try {
    const response = await axios.post(
      `${configs.server_url}/hubspot/contacts/create`,
      { contactData }
    );
    return response?.data;
  } catch (error) {
    console.error('Error creating HubSpot contact:', error);
    throw error;
  }
};

const updateContact = async (hubspotId, contactData) => {
  try {
    const response = await axios.post(
      `${configs.server_url}/hubspot/contacts/update`,
      { hubspotId, contactData }
    );
    return response?.data;
  } catch (error) {
    console.error('Error updating HubSpot contact:', error);
    throw error;
  }
};

const getContactByEmail = async (email) => {
  try {
    const response = await axios.post(
      `${configs.server_url}/hubspot/contacts/get-by-email`,
      { email }
    );
    return response?.data;
  } catch (error) {
    console.error('Error fetching HubSpot contact by email:', error);
    throw error;
  }
};

const getContact = async (hubspotId) => {
  try {
    const response = await axios.post(
      `${configs.server_url}/hubspot/contacts/get`,
      { hubspotId }
    );
    return response?.data;
  } catch (error) {
    console.error('Error fetching HubSpot contact:', error);
    throw error;
  }
};

const searchContacts = async (query) => {
  try {
    const response = await axios.post(
      `${configs.server_url}/hubspot/contacts/search`,
      { query }
    );
    return response?.data;
  } catch (error) {
    console.error('Error searching HubSpot contacts:', error);
    throw error;
  }
};

// HubSpot Deal API
const createDeal = async (dealData) => {
  try {
    const response = await axios.post(
      `${configs.server_url}/hubspot/deals/create`,
      { dealData }
    );
    return response?.data;
  } catch (error) {
    console.error('Error creating HubSpot deal:', error);
    throw error;
  }
};

const updateDeal = async (hubspotId, dealData) => {
  try {
    const response = await axios.post(
      `${configs.server_url}/hubspot/deals/update`,
      { hubspotId, dealData }
    );
    return response?.data;
  } catch (error) {
    console.error('Error updating HubSpot deal:', error);
    throw error;
  }
};

const updateDealStage = async (hubspotId, stage) => {
  try {
    const response = await axios.post(
      `${configs.server_url}/hubspot/deals/update-stage`,
      { hubspotId, stage }
    );
    return response?.data;
  } catch (error) {
    console.error('Error updating HubSpot deal stage:', error);
    throw error;
  }
};

const getDeal = async (hubspotId) => {
  try {
    const response = await axios.post(
      `${configs.server_url}/hubspot/deals/get`,
      { hubspotId }
    );
    return response?.data;
  } catch (error) {
    console.error('Error fetching HubSpot deal:', error);
    throw error;
  }
};

const searchDeals = async (query) => {
  try {
    const response = await axios.post(
      `${configs.server_url}/hubspot/deals/search`,
      { query }
    );
    return response?.data;
  } catch (error) {
    console.error('Error searching HubSpot deals:', error);
    throw error;
  }
};

const associateDealWithContact = async (dealId, contactId) => {
  try {
    const response = await axios.post(
      `${configs.server_url}/hubspot/deals/associate-contact`,
      { dealId, contactId }
    );
    return response?.data;
  } catch (error) {
    console.error('Error associating HubSpot deal with contact:', error);
    throw error;
  }
};

// HubSpot Device Custom Object API
const createDevice = async (deviceData, dealId) => {
  try {
    const response = await axios.post(
      `${configs.server_url}/hubspot/devices/create`,
      { deviceData, dealId }
    );
    return response?.data;
  } catch (error) {
    console.error('Error creating HubSpot device:', error);
    throw error;
  }
};

const updateDevice = async (hubspotId, deviceData) => {
  try {
    const response = await axios.post(
      `${configs.server_url}/hubspot/devices/update`,
      { hubspotId, deviceData }
    );
    return response?.data;
  } catch (error) {
    console.error('Error updating HubSpot device:', error);
    throw error;
  }
};

const getDevice = async (hubspotId) => {
  try {
    const response = await axios.post(
      `${configs.server_url}/hubspot/devices/get`,
      { hubspotId }
    );
    return response?.data;
  } catch (error) {
    console.error('Error fetching HubSpot device:', error);
    throw error;
  }
};

const associateDeviceWithDeal = async (deviceId, dealId) => {
  try {
    const response = await axios.post(
      `${configs.server_url}/hubspot/devices/associate-deal`,
      { deviceId, dealId }
    );
    return response?.data;
  } catch (error) {
    console.error('Error associating HubSpot device with deal:', error);
    throw error;
  }
};

// HubSpot Sync Status API
const getSyncStatus = async (entityType, entityId) => {
  try {
    const response = await axios.post(
      `${configs.server_url}/hubspot/sync/status`,
      { entityType, entityId }
    );
    return response?.data;
  } catch (error) {
    console.error('Error fetching HubSpot sync status:', error);
    throw error;
  }
};

const syncEntity = async (entityType, entityId, forceSync = false) => {
  try {
    const response = await axios.post(
      `${configs.server_url}/hubspot/sync/entity`,
      { entityType, entityId, forceSync }
    );
    return response?.data;
  } catch (error) {
    console.error('Error syncing entity to HubSpot:', error);
    throw error;
  }
};

// Batch sync multiple entities
const batchSync = async (entities) => {
  try {
    const response = await axios.post(
      `${configs.server_url}/hubspot/sync/batch`,
      { entities }
    );
    return response?.data;
  } catch (error) {
    console.error('Error batch syncing to HubSpot:', error);
    throw error;
  }
};

// Get all sync errors
const getSyncErrors = async () => {
  try {
    const response = await axios.get(
      `${configs.server_url}/hubspot/sync/errors`
    );
    return response?.data;
  } catch (error) {
    console.error('Error fetching sync errors:', error);
    throw error;
  }
};

// Retry a failed sync
const retrySyncError = async (errorId) => {
  try {
    const response = await axios.post(
      `${configs.server_url}/hubspot/sync/retry`,
      { errorId }
    );
    return response?.data;
  } catch (error) {
    console.error('Error retrying sync:', error);
    throw error;
  }
};

// Get sync statistics
const getSyncStats = async () => {
  try {
    const response = await axios.get(
      `${configs.server_url}/hubspot/sync/stats`
    );
    return response?.data;
  } catch (error) {
    console.error('Error fetching sync stats:', error);
    throw error;
  }
};

// Utility: Create or update customer in HubSpot
const syncCustomerToHubSpot = async (customer) => {
  try {
    // Check if contact already exists
    const existingContact = await getContactByEmail(customer.email);

    const contactData = {
      email: customer.email,
      firstname: customer.name.split(' ')[0],
      lastname: customer.name.split(' ').slice(1).join(' ') || '',
      phone: customer.phone,
      company: customer.company,
      // Custom properties
      customer_type: customer.type,
      bluesignal_customer_id: customer.id,
    };

    if (existingContact?.id) {
      // Update existing contact
      return await updateContact(existingContact.id, contactData);
    } else {
      // Create new contact
      return await createContact(contactData);
    }
  } catch (error) {
    console.error('Error syncing customer to HubSpot:', error);
    throw error;
  }
};

// Utility: Create or update order as deal in HubSpot
const syncOrderToHubSpot = async (order, customer) => {
  try {
    const dealStage = ORDER_STATUS_TO_DEAL_STAGE[order.status] || 'Lead';

    const dealData = {
      dealname: `BlueSignal Order ${order.id}`,
      amount: order.total,
      dealstage: dealStage,
      pipeline: 'default', // Or custom pipeline ID
      // Custom properties
      bluesignal_order_id: order.id,
      device_count: order.lineItems.reduce((sum, item) => sum + item.quantity, 0),
      payment_status: order.paymentStatus,
    };

    if (order.hubspotDealId) {
      // Update existing deal
      return await updateDeal(order.hubspotDealId, dealData);
    } else {
      // Create new deal
      const deal = await createDeal(dealData);

      // Associate with contact if customer has HubSpot ID
      if (customer?.hubspotContactId && deal?.id) {
        await associateDealWithContact(deal.id, customer.hubspotContactId);
      }

      return deal;
    }
  } catch (error) {
    console.error('Error syncing order to HubSpot:', error);
    throw error;
  }
};

// Utility: Sync device commission status to HubSpot
const syncDeviceToHubSpot = async (device, dealId) => {
  try {
    const deviceData = {
      device_serial: device.serialNumber,
      device_sku: device.sku,
      device_name: device.name,
      device_lifecycle: device.lifecycle,
      commission_status: device.commissionStatus,
      bluesignal_device_id: device.id,
    };

    if (device.hubspotDeviceId) {
      return await updateDevice(device.hubspotDeviceId, deviceData);
    } else if (dealId) {
      return await createDevice(deviceData, dealId);
    }
  } catch (error) {
    console.error('Error syncing device to HubSpot:', error);
    throw error;
  }
};

// HubSpot Webhook handling
const handleDealWebhook = async (payload) => {
  try {
    const response = await axios.post(
      `${configs.server_url}/hubspot/webhooks/deal`,
      { payload }
    );
    return response?.data;
  } catch (error) {
    console.error('Error handling HubSpot deal webhook:', error);
    throw error;
  }
};

const handleContactWebhook = async (payload) => {
  try {
    const response = await axios.post(
      `${configs.server_url}/hubspot/webhooks/contact`,
      { payload }
    );
    return response?.data;
  } catch (error) {
    console.error('Error handling HubSpot contact webhook:', error);
    throw error;
  }
};

// Export API objects
export const HubSpotContactsAPI = {
  create: createContact,
  update: updateContact,
  get: getContact,
  getByEmail: getContactByEmail,
  search: searchContacts,
};

export const HubSpotDealsAPI = {
  create: createDeal,
  update: updateDeal,
  updateStage: updateDealStage,
  get: getDeal,
  search: searchDeals,
  associateWithContact: associateDealWithContact,
};

export const HubSpotDevicesAPI = {
  create: createDevice,
  update: updateDevice,
  get: getDevice,
  associateWithDeal: associateDeviceWithDeal,
};

export const HubSpotSyncAPI = {
  getStatus: getSyncStatus,
  syncEntity: syncEntity,
  batchSync: batchSync,
  getErrors: getSyncErrors,
  retryError: retrySyncError,
  getStats: getSyncStats,
  syncCustomer: syncCustomerToHubSpot,
  syncOrder: syncOrderToHubSpot,
  syncDevice: syncDeviceToHubSpot,
};

export const HubSpotWebhooksAPI = {
  handleDeal: handleDealWebhook,
  handleContact: handleContactWebhook,
};

// Combined export
const HubSpotAPI = {
  contacts: HubSpotContactsAPI,
  deals: HubSpotDealsAPI,
  devices: HubSpotDevicesAPI,
  sync: HubSpotSyncAPI,
  webhooks: HubSpotWebhooksAPI,
  // Constants
  DEAL_STAGES: HUBSPOT_DEAL_STAGES,
  ORDER_STATUS_TO_STAGE: ORDER_STATUS_TO_DEAL_STAGE,
};

export default HubSpotAPI;
