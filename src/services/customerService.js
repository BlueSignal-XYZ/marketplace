/**
 * Customer Service
 *
 * Business logic for customer management:
 * - Customer CRUD operations
 * - HubSpot sync
 * - Customer onboarding
 */

import { CustomerAPI, SiteAPI, OrderAPI, DeviceAPI } from '../scripts/back_door';
import HubSpotAPI from '../apis/hubspot';
import { auth } from '../apis/firebase';
import { sendSignInLinkToEmail } from 'firebase/auth';

// Generate unique customer ID
const generateCustomerId = () => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 7);
  return `CUS-${timestamp}-${random}`.toUpperCase();
};

/**
 * Create a new customer
 */
export const createCustomer = async (customerData, syncToHubSpot = true) => {
  try {
    const customerId = generateCustomerId();
    const now = new Date().toISOString();

    const customer = {
      id: customerId,
      name: customerData.name,
      email: customerData.email,
      phone: customerData.phone || '',
      company: customerData.company || '',
      address: customerData.address || {},
      type: customerData.type || 'residential',
      notes: customerData.notes || '',
      hubspotContactId: null,
      createdAt: now,
      updatedAt: now,
    };

    const result = await CustomerAPI.create(customer);

    // Sync to HubSpot
    if (syncToHubSpot) {
      try {
        const hubspotContact = await HubSpotAPI.sync.syncCustomer(customer);
        if (hubspotContact?.id) {
          await CustomerAPI.update(customerId, {
            hubspotContactId: hubspotContact.id,
          });
        }
      } catch (hubspotError) {
        console.warn('HubSpot sync failed (non-critical):', hubspotError);
      }
    }

    return result;
  } catch (error) {
    console.error('Error creating customer:', error);
    throw error;
  }
};

/**
 * Update an existing customer
 */
export const updateCustomer = async (customerId, updates, syncToHubSpot = true) => {
  try {
    updates.updatedAt = new Date().toISOString();
    const result = await CustomerAPI.update(customerId, updates);

    // Sync to HubSpot
    if (syncToHubSpot) {
      try {
        const customer = await CustomerAPI.get(customerId);
        if (customer) {
          await HubSpotAPI.sync.syncCustomer(customer);
        }
      } catch (hubspotError) {
        console.warn('HubSpot sync failed (non-critical):', hubspotError);
      }
    }

    return result;
  } catch (error) {
    console.error('Error updating customer:', error);
    throw error;
  }
};

/**
 * Get customer with all related data
 */
export const getCustomerWithDetails = async (customerId) => {
  try {
    const customer = await CustomerAPI.get(customerId);
    if (!customer) return null;

    const [sites, orders, devices] = await Promise.all([
      SiteAPI.listByCustomer(customerId),
      OrderAPI.getByCustomer(customerId),
      getCustomerDevices(customerId),
    ]);

    return {
      ...customer,
      sites: sites || [],
      orders: orders || [],
      devices: devices || [],
      stats: {
        siteCount: sites?.length || 0,
        orderCount: orders?.length || 0,
        deviceCount: devices?.length || 0,
        totalSpent: orders?.reduce((sum, o) => sum + (o.total || 0), 0) || 0,
      },
    };
  } catch (error) {
    console.error('Error fetching customer with details:', error);
    throw error;
  }
};

/**
 * Get all devices owned by a customer
 */
export const getCustomerDevices = async (customerId) => {
  try {
    // Get all orders for this customer
    const orders = await OrderAPI.getByCustomer(customerId);
    if (!orders || orders.length === 0) return [];

    // Collect all device IDs from orders
    const deviceIds = orders.flatMap(order =>
      order.lineItems?.flatMap(item => item.deviceIds || []) || []
    );

    if (deviceIds.length === 0) return [];

    // Fetch device details
    const devices = await Promise.all(
      deviceIds.map(id => DeviceAPI.getDeviceDetails(id))
    );

    return devices.filter(d => d !== null);
  } catch (error) {
    console.error('Error fetching customer devices:', error);
    throw error;
  }
};

/**
 * Find or create a customer by email
 */
export const findOrCreateCustomer = async (customerData) => {
  try {
    // Check if customer exists
    const existing = await CustomerAPI.getByEmail(customerData.email);
    if (existing) {
      return { customer: existing, created: false };
    }

    // Create new customer
    const customer = await createCustomer(customerData);
    return { customer, created: true };
  } catch (error) {
    console.error('Error finding or creating customer:', error);
    throw error;
  }
};

/**
 * Send onboarding invite to customer
 * Creates a Firebase auth invite for dashboard access
 */
export const sendOnboardingInvite = async (customerId, deviceIds = []) => {
  try {
    const customer = await CustomerAPI.get(customerId);
    if (!customer) throw new Error('Customer not found');

    // Firebase magic link settings
    const actionCodeSettings = {
      url: `${window.location.origin}/onboard?customerId=${customerId}&devices=${deviceIds.join(',')}`,
      handleCodeInApp: true,
    };

    await sendSignInLinkToEmail(auth, customer.email, actionCodeSettings);

    // Store pending invite
    await CustomerAPI.update(customerId, {
      inviteSentAt: new Date().toISOString(),
      invitePending: true,
    });

    return { success: true, email: customer.email };
  } catch (error) {
    console.error('Error sending onboarding invite:', error);
    throw error;
  }
};

/**
 * Complete customer onboarding
 * Links Firebase auth user to customer record
 */
export const completeOnboarding = async (customerId, userUid, deviceIds = []) => {
  try {
    const customer = await CustomerAPI.get(customerId);
    if (!customer) throw new Error('Customer not found');

    const now = new Date().toISOString();

    // Update customer with user link
    await CustomerAPI.update(customerId, {
      userUid,
      invitePending: false,
      onboardedAt: now,
      updatedAt: now,
    });

    // Activate devices for this customer
    for (const deviceId of deviceIds) {
      await DeviceAPI.updateLifecycle(deviceId, 'active', {
        activatedAt: now,
      });
      await DeviceAPI.editDevice(deviceId, {
        customerId,
        status: 'online',
      });
    }

    return { success: true };
  } catch (error) {
    console.error('Error completing onboarding:', error);
    throw error;
  }
};

/**
 * Search customers
 */
export const searchCustomers = async (query, filters = {}) => {
  try {
    const allFilters = {
      ...filters,
      search: query,
    };
    return await CustomerAPI.list(allFilters);
  } catch (error) {
    console.error('Error searching customers:', error);
    throw error;
  }
};

/**
 * Delete a customer
 * Only allowed if no active orders or devices
 */
export const deleteCustomer = async (customerId) => {
  try {
    // Check for active orders
    const orders = await OrderAPI.getByCustomer(customerId);
    const activeOrders = orders?.filter(o =>
      !['cancelled', 'fulfilled'].includes(o.status)
    );

    if (activeOrders?.length > 0) {
      throw new Error('Cannot delete customer with active orders');
    }

    // Check for active devices
    const devices = await getCustomerDevices(customerId);
    const activeDevices = devices?.filter(d =>
      ['active', 'commissioned'].includes(d.lifecycle)
    );

    if (activeDevices?.length > 0) {
      throw new Error('Cannot delete customer with active devices');
    }

    // Delete associated sites
    const sites = await SiteAPI.listByCustomer(customerId);
    for (const site of sites || []) {
      await SiteAPI.delete(site.id);
    }

    // Delete customer
    await CustomerAPI.delete(customerId);

    return { success: true };
  } catch (error) {
    console.error('Error deleting customer:', error);
    throw error;
  }
};

/**
 * Merge duplicate customers
 */
export const mergeCustomers = async (primaryId, duplicateId) => {
  try {
    const primary = await CustomerAPI.get(primaryId);
    const duplicate = await CustomerAPI.get(duplicateId);

    if (!primary || !duplicate) {
      throw new Error('One or both customers not found');
    }

    // Transfer sites to primary
    const sites = await SiteAPI.listByCustomer(duplicateId);
    for (const site of sites || []) {
      await SiteAPI.update(site.id, { customerId: primaryId });
    }

    // Transfer orders to primary
    const orders = await OrderAPI.getByCustomer(duplicateId);
    for (const order of orders || []) {
      await OrderAPI.update(order.id, { customerId: primaryId });
    }

    // Merge notes
    const mergedNotes = [
      primary.notes,
      `[Merged from ${duplicate.email}] ${duplicate.notes}`,
    ]
      .filter(Boolean)
      .join('\n');

    await CustomerAPI.update(primaryId, {
      notes: mergedNotes,
      updatedAt: new Date().toISOString(),
    });

    // Delete duplicate
    await CustomerAPI.delete(duplicateId);

    return { success: true };
  } catch (error) {
    console.error('Error merging customers:', error);
    throw error;
  }
};

// Export service
const customerService = {
  createCustomer,
  updateCustomer,
  getCustomerWithDetails,
  getCustomerDevices,
  findOrCreateCustomer,
  sendOnboardingInvite,
  completeOnboarding,
  searchCustomers,
  deleteCustomer,
  mergeCustomers,
  generateCustomerId,
};

export default customerService;
