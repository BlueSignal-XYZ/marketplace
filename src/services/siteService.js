/**
 * Site Service
 *
 * Business logic for deployment site management:
 * - Site CRUD operations
 * - Device binding
 * - Location management
 */

import { SiteAPI, DeviceAPI, CustomerAPI } from '../scripts/back_door';

// Generate unique site ID
const generateSiteId = () => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 7);
  return `SITE-${timestamp}-${random}`.toUpperCase();
};

/**
 * Create a new site
 */
export const createSite = async (siteData) => {
  try {
    const siteId = generateSiteId();
    const now = new Date().toISOString();

    // Validate customer exists
    if (siteData.customerId) {
      const customer = await CustomerAPI.get(siteData.customerId);
      if (!customer) {
        throw new Error('Customer not found');
      }
    }

    const site = {
      id: siteId,
      customerId: siteData.customerId,
      name: siteData.name,
      address: siteData.address || '',
      coordinates: siteData.coordinates || { lat: 0, lng: 0 },
      type: siteData.type || 'residential',
      waterBodyType: siteData.waterBodyType || null,
      waterBodyName: siteData.waterBodyName || '',
      accessNotes: siteData.accessNotes || '',
      contactName: siteData.contactName || '',
      contactPhone: siteData.contactPhone || '',
      deviceIds: [],
      createdAt: now,
      updatedAt: now,
    };

    const result = await SiteAPI.create(site);
    return result;
  } catch (error) {
    console.error('Error creating site:', error);
    throw error;
  }
};

/**
 * Update an existing site
 */
export const updateSite = async (siteId, updates) => {
  try {
    updates.updatedAt = new Date().toISOString();
    const result = await SiteAPI.update(siteId, updates);
    return result;
  } catch (error) {
    console.error('Error updating site:', error);
    throw error;
  }
};

/**
 * Get site with all devices
 */
export const getSiteWithDevices = async (siteId) => {
  try {
    const site = await SiteAPI.get(siteId);
    if (!site) return null;

    // Fetch all devices at this site
    const devices = await DeviceAPI.getBySite(siteId);

    // Get customer info
    let customer = null;
    if (site.customerId) {
      customer = await CustomerAPI.get(site.customerId);
    }

    return {
      ...site,
      customer,
      devices: devices || [],
      deviceCount: devices?.length || 0,
      activeDevices: devices?.filter(d => d.status === 'online').length || 0,
    };
  } catch (error) {
    console.error('Error fetching site with devices:', error);
    throw error;
  }
};

/**
 * Add a device to a site
 */
export const addDeviceToSite = async (siteId, deviceId) => {
  try {
    const site = await SiteAPI.get(siteId);
    if (!site) throw new Error('Site not found');

    const device = await DeviceAPI.getDeviceDetails(deviceId);
    if (!device) throw new Error('Device not found');

    // Update site's device list
    const deviceIds = [...(site.deviceIds || [])];
    if (!deviceIds.includes(deviceId)) {
      deviceIds.push(deviceId);
    }

    await SiteAPI.update(siteId, {
      deviceIds,
      updatedAt: new Date().toISOString(),
    });

    // Update device with site info
    await DeviceAPI.editDevice(deviceId, {
      siteId,
      siteName: site.name,
      customerId: site.customerId,
    });

    return { success: true };
  } catch (error) {
    console.error('Error adding device to site:', error);
    throw error;
  }
};

/**
 * Remove a device from a site
 */
export const removeDeviceFromSite = async (siteId, deviceId) => {
  try {
    const site = await SiteAPI.get(siteId);
    if (!site) throw new Error('Site not found');

    // Update site's device list
    const deviceIds = (site.deviceIds || []).filter(id => id !== deviceId);

    await SiteAPI.update(siteId, {
      deviceIds,
      updatedAt: new Date().toISOString(),
    });

    // Clear site info from device
    await DeviceAPI.editDevice(deviceId, {
      siteId: null,
      siteName: null,
    });

    return { success: true };
  } catch (error) {
    console.error('Error removing device from site:', error);
    throw error;
  }
};

/**
 * Get all sites for a customer
 */
export const getCustomerSites = async (customerId) => {
  try {
    const sites = await SiteAPI.listByCustomer(customerId);

    // Enrich with device counts
    const enrichedSites = await Promise.all(
      (sites || []).map(async (site) => {
        const devices = await DeviceAPI.getBySite(site.id);
        return {
          ...site,
          deviceCount: devices?.length || 0,
          activeDevices: devices?.filter(d => d.status === 'online').length || 0,
        };
      })
    );

    return enrichedSites;
  } catch (error) {
    console.error('Error fetching customer sites:', error);
    throw error;
  }
};

/**
 * Search sites
 */
export const searchSites = async (query, filters = {}) => {
  try {
    const allFilters = {
      ...filters,
      search: query,
    };
    return await SiteAPI.list(allFilters);
  } catch (error) {
    console.error('Error searching sites:', error);
    throw error;
  }
};

/**
 * Get sites near a location
 */
export const getSitesNearLocation = async (lat, lng, radiusKm = 50) => {
  try {
    const allSites = await SiteAPI.list({});
    if (!allSites) return [];

    // Calculate distance using Haversine formula
    const getDistanceKm = (lat1, lng1, lat2, lng2) => {
      const R = 6371; // Earth radius in km
      const dLat = ((lat2 - lat1) * Math.PI) / 180;
      const dLng = ((lng2 - lng1) * Math.PI) / 180;
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
          Math.cos((lat2 * Math.PI) / 180) *
          Math.sin(dLng / 2) *
          Math.sin(dLng / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c;
    };

    const nearbySites = allSites
      .filter(site => site.coordinates?.lat && site.coordinates?.lng)
      .map(site => ({
        ...site,
        distanceKm: getDistanceKm(
          lat,
          lng,
          site.coordinates.lat,
          site.coordinates.lng
        ),
      }))
      .filter(site => site.distanceKm <= radiusKm)
      .sort((a, b) => a.distanceKm - b.distanceKm);

    return nearbySites;
  } catch (error) {
    console.error('Error getting sites near location:', error);
    throw error;
  }
};

/**
 * Delete a site
 * Only allowed if no active devices
 */
export const deleteSite = async (siteId) => {
  try {
    const site = await SiteAPI.get(siteId);
    if (!site) throw new Error('Site not found');

    // Check for active devices
    const devices = await DeviceAPI.getBySite(siteId);
    if (devices?.length > 0) {
      throw new Error('Cannot delete site with associated devices. Remove devices first.');
    }

    await SiteAPI.delete(siteId);
    return { success: true };
  } catch (error) {
    console.error('Error deleting site:', error);
    throw error;
  }
};

/**
 * Transfer site to another customer
 */
export const transferSite = async (siteId, newCustomerId) => {
  try {
    const site = await SiteAPI.get(siteId);
    if (!site) throw new Error('Site not found');

    const newCustomer = await CustomerAPI.get(newCustomerId);
    if (!newCustomer) throw new Error('Customer not found');

    const now = new Date().toISOString();

    // Update site
    await SiteAPI.update(siteId, {
      customerId: newCustomerId,
      updatedAt: now,
    });

    // Update all devices at this site
    const devices = await DeviceAPI.getBySite(siteId);
    for (const device of devices || []) {
      await DeviceAPI.editDevice(device.id, {
        customerId: newCustomerId,
      });
    }

    return { success: true };
  } catch (error) {
    console.error('Error transferring site:', error);
    throw error;
  }
};

/**
 * Get site status summary
 */
export const getSiteStatus = async (siteId) => {
  try {
    const site = await SiteAPI.get(siteId);
    if (!site) return null;

    const devices = await DeviceAPI.getBySite(siteId);
    if (!devices || devices.length === 0) {
      return {
        siteId,
        siteName: site.name,
        status: 'no_devices',
        deviceCount: 0,
        onlineCount: 0,
        warningCount: 0,
        offlineCount: 0,
        lastContact: null,
      };
    }

    const onlineDevices = devices.filter(d => d.status === 'online');
    const warningDevices = devices.filter(d => d.status === 'warning');
    const offlineDevices = devices.filter(d => d.status === 'offline');

    // Determine overall site status
    let status = 'online';
    if (offlineDevices.length === devices.length) {
      status = 'offline';
    } else if (offlineDevices.length > 0 || warningDevices.length > 0) {
      status = 'warning';
    }

    // Find most recent contact
    const lastContact = devices
      .filter(d => d.lastContact)
      .map(d => new Date(d.lastContact))
      .sort((a, b) => b - a)[0];

    return {
      siteId,
      siteName: site.name,
      status,
      deviceCount: devices.length,
      onlineCount: onlineDevices.length,
      warningCount: warningDevices.length,
      offlineCount: offlineDevices.length,
      lastContact: lastContact?.toISOString() || null,
    };
  } catch (error) {
    console.error('Error getting site status:', error);
    throw error;
  }
};

// Export service
const siteService = {
  createSite,
  updateSite,
  getSiteWithDevices,
  addDeviceToSite,
  removeDeviceFromSite,
  getCustomerSites,
  searchSites,
  getSitesNearLocation,
  deleteSite,
  transferSite,
  getSiteStatus,
  generateSiteId,
};

export default siteService;
