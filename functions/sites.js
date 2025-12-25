/**
 * BlueSignal Site Management Cloud Functions
 * Handles site creation, geocoding, and management
 */

const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { Client } = require("@googlemaps/google-maps-services-js");

// Google Maps client
const mapsClient = new Client({});

/**
 * Get Google Maps API key from config
 */
const getMapsApiKey = () => {
  return process.env.GOOGLE_MAPS_API_KEY || functions.config().google?.maps_key;
};

/**
 * Parse address components from Google Geocoding response
 */
const parseAddressComponents = (components) => {
  const result = {};

  for (const comp of components) {
    if (comp.types.includes("street_number")) result.streetNumber = comp.long_name;
    if (comp.types.includes("route")) result.street = comp.long_name;
    if (comp.types.includes("locality")) result.city = comp.long_name;
    if (comp.types.includes("administrative_area_level_1")) {
      result.state = comp.short_name;
      result.stateFull = comp.long_name;
    }
    if (comp.types.includes("postal_code")) result.postalCode = comp.long_name;
    if (comp.types.includes("country")) {
      result.country = comp.short_name;
      result.countryFull = comp.long_name;
    }
  }

  return result;
};

/**
 * Geocode an address to coordinates
 */
const geocodeAddress = async (req, res) => {
  const { address } = req.body;

  if (!address) {
    return res.status(400).json({ error: "Missing address" });
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = authHeader.split("Bearer ")[1];
  try {
    await admin.auth().verifyIdToken(token);
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }

  const apiKey = getMapsApiKey();
  if (!apiKey) {
    return res.status(500).json({ error: "Maps API not configured" });
  }

  try {
    const response = await mapsClient.geocode({
      params: {
        address,
        key: apiKey,
      },
    });

    if (response.data.results.length === 0) {
      return res.status(404).json({ error: "Address not found" });
    }

    const result = response.data.results[0];
    const { lat, lng } = result.geometry.location;

    res.json({
      coordinates: { lat, lng },
      formattedAddress: result.formatted_address,
      components: parseAddressComponents(result.address_components),
      placeId: result.place_id,
      locationType: result.geometry.location_type,
    });
  } catch (error) {
    console.error("Geocoding failed:", error);
    res.status(500).json({ error: "Geocoding failed" });
  }
};

/**
 * Reverse geocode coordinates to address
 */
const reverseGeocode = async (req, res) => {
  const { lat, lng } = req.body;

  if (lat === undefined || lng === undefined) {
    return res.status(400).json({ error: "Missing lat or lng" });
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = authHeader.split("Bearer ")[1];
  try {
    await admin.auth().verifyIdToken(token);
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }

  const apiKey = getMapsApiKey();
  if (!apiKey) {
    return res.status(500).json({ error: "Maps API not configured" });
  }

  try {
    const response = await mapsClient.reverseGeocode({
      params: {
        latlng: { lat, lng },
        key: apiKey,
      },
    });

    if (response.data.results.length === 0) {
      return res.status(404).json({ error: "Location not found" });
    }

    const result = response.data.results[0];

    res.json({
      formattedAddress: result.formatted_address,
      components: parseAddressComponents(result.address_components),
      placeId: result.place_id,
    });
  } catch (error) {
    console.error("Reverse geocoding failed:", error);
    res.status(500).json({ error: "Reverse geocoding failed" });
  }
};

/**
 * Create a new site
 */
const createSite = async (req, res) => {
  const { siteData } = req.body;

  if (!siteData || !siteData.name || !siteData.type) {
    return res.status(400).json({ error: "Missing required site data (name, type)" });
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = authHeader.split("Bearer ")[1];
  let uid;
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    uid = decodedToken.uid;
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }

  // Validate site type
  const validTypes = ["farm", "lake", "river", "pond", "treatment_plant", "stormwater"];
  if (!validTypes.includes(siteData.type)) {
    return res.status(400).json({ error: "Invalid site type" });
  }

  const db = admin.database();
  const siteId = db.ref("sites").push().key;
  const now = Date.now();

  const site = {
    name: siteData.name,
    type: siteData.type,
    ownerId: uid,
    customerId: siteData.customerId || null,
    location: {
      address: siteData.address || "",
      city: siteData.city || "",
      state: siteData.state || "",
      country: siteData.country || "US",
      postalCode: siteData.postalCode || "",
      coordinates: siteData.coordinates || null,
      boundary: siteData.boundary || null,
      watershed: siteData.watershed || "",
    },
    metadata: {
      area: siteData.area || null,
      waterBodyType: siteData.waterBodyType || "",
      depth: siteData.depth || null,
      regulatoryId: siteData.regulatoryId || "",
    },
    devices: [],
    credits: {
      eligible: false,
      registryId: "",
      totalGenerated: 0,
    },
    createdAt: now,
    updatedAt: now,
  };

  try {
    await db.ref(`sites/${siteId}`).set(site);

    // Log activity
    await db.ref(`users/${uid}/activity`).push({
      type: "site_created",
      timestamp: now,
      metadata: { siteId, siteName: site.name },
    });

    res.json({ success: true, siteId, site });
  } catch (error) {
    console.error("Failed to create site:", error);
    res.status(500).json({ error: "Failed to create site" });
  }
};

/**
 * Get a site by ID
 */
const getSite = async (req, res) => {
  const { siteId } = req.body;

  if (!siteId) {
    return res.status(400).json({ error: "Missing siteId" });
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = authHeader.split("Bearer ")[1];
  let uid, role;
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    uid = decodedToken.uid;
    const db = admin.database();
    const userSnapshot = await db.ref(`users/${uid}/profile/role`).once("value");
    role = userSnapshot.val();
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }

  const db = admin.database();

  try {
    const snapshot = await db.ref(`sites/${siteId}`).once("value");
    if (!snapshot.exists()) {
      return res.status(404).json({ error: "Site not found" });
    }

    const site = snapshot.val();

    // Check authorization
    if (site.ownerId !== uid && role !== "admin") {
      return res.status(403).json({ error: "Not authorized to view this site" });
    }

    res.json({ siteId, site });
  } catch (error) {
    console.error("Failed to get site:", error);
    res.status(500).json({ error: "Failed to get site" });
  }
};

/**
 * Update a site
 */
const updateSite = async (req, res) => {
  const { siteId, updateData } = req.body;

  if (!siteId || !updateData) {
    return res.status(400).json({ error: "Missing siteId or updateData" });
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = authHeader.split("Bearer ")[1];
  let uid, role;
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    uid = decodedToken.uid;
    const db = admin.database();
    const userSnapshot = await db.ref(`users/${uid}/profile/role`).once("value");
    role = userSnapshot.val();
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }

  const db = admin.database();

  try {
    const snapshot = await db.ref(`sites/${siteId}`).once("value");
    if (!snapshot.exists()) {
      return res.status(404).json({ error: "Site not found" });
    }

    const site = snapshot.val();

    // Check authorization
    if (site.ownerId !== uid && role !== "admin") {
      return res.status(403).json({ error: "Not authorized to update this site" });
    }

    // Build updates
    const updates = { updatedAt: Date.now() };

    // Only allow updating specific fields
    const allowedFields = ["name", "type", "location", "metadata", "watershed"];
    for (const field of allowedFields) {
      if (updateData[field] !== undefined) {
        if (field === "location" || field === "metadata") {
          // Merge nested objects
          updates[field] = { ...site[field], ...updateData[field] };
        } else {
          updates[field] = updateData[field];
        }
      }
    }

    await db.ref(`sites/${siteId}`).update(updates);

    res.json({ success: true, siteId });
  } catch (error) {
    console.error("Failed to update site:", error);
    res.status(500).json({ error: "Failed to update site" });
  }
};

/**
 * List sites for a user
 */
const listSites = async (req, res) => {
  const { filters = {} } = req.body;

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = authHeader.split("Bearer ")[1];
  let uid, role;
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    uid = decodedToken.uid;
    const db = admin.database();
    const userSnapshot = await db.ref(`users/${uid}/profile/role`).once("value");
    role = userSnapshot.val();
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }

  const db = admin.database();

  try {
    let query;
    if (role === "admin") {
      query = db.ref("sites");
    } else {
      query = db.ref("sites").orderByChild("ownerId").equalTo(uid);
    }

    const snapshot = await query.once("value");
    const data = snapshot.val() || {};

    let sites = Object.entries(data).map(([id, s]) => ({
      id,
      ...s,
    }));

    // Apply filters
    if (filters.type) {
      sites = sites.filter((s) => s.type === filters.type);
    }
    if (filters.state) {
      sites = sites.filter((s) => s.location?.state === filters.state);
    }
    if (filters.customerId) {
      sites = sites.filter((s) => s.customerId === filters.customerId);
    }

    // Sort by name
    sites.sort((a, b) => (a.name || "").localeCompare(b.name || ""));

    res.json({ sites });
  } catch (error) {
    console.error("Failed to list sites:", error);
    res.status(500).json({ error: "Failed to list sites" });
  }
};

/**
 * Delete a site
 */
const deleteSite = async (req, res) => {
  const { siteId } = req.body;

  if (!siteId) {
    return res.status(400).json({ error: "Missing siteId" });
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = authHeader.split("Bearer ")[1];
  let uid, role;
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    uid = decodedToken.uid;
    const db = admin.database();
    const userSnapshot = await db.ref(`users/${uid}/profile/role`).once("value");
    role = userSnapshot.val();
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }

  const db = admin.database();

  try {
    const snapshot = await db.ref(`sites/${siteId}`).once("value");
    if (!snapshot.exists()) {
      return res.status(404).json({ error: "Site not found" });
    }

    const site = snapshot.val();

    // Check authorization
    if (site.ownerId !== uid && role !== "admin") {
      return res.status(403).json({ error: "Not authorized to delete this site" });
    }

    // Check for active devices
    if (site.devices && site.devices.length > 0) {
      return res.status(400).json({
        error: "Cannot delete site with active devices. Remove devices first.",
        deviceCount: site.devices.length,
      });
    }

    // Delete site
    await db.ref(`sites/${siteId}`).remove();

    res.json({ success: true });
  } catch (error) {
    console.error("Failed to delete site:", error);
    res.status(500).json({ error: "Failed to delete site" });
  }
};

/**
 * Add a device to a site
 */
const addDeviceToSite = async (req, res) => {
  const { siteId, deviceId } = req.body;

  if (!siteId || !deviceId) {
    return res.status(400).json({ error: "Missing siteId or deviceId" });
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = authHeader.split("Bearer ")[1];
  let uid, role;
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    uid = decodedToken.uid;
    const db = admin.database();
    const userSnapshot = await db.ref(`users/${uid}/profile/role`).once("value");
    role = userSnapshot.val();
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }

  const db = admin.database();

  try {
    // Verify site exists and user has access
    const siteSnapshot = await db.ref(`sites/${siteId}`).once("value");
    if (!siteSnapshot.exists()) {
      return res.status(404).json({ error: "Site not found" });
    }

    const site = siteSnapshot.val();
    if (site.ownerId !== uid && role !== "admin" && role !== "installer") {
      return res.status(403).json({ error: "Not authorized" });
    }

    // Verify device exists
    const deviceSnapshot = await db.ref(`devices/${deviceId}`).once("value");
    if (!deviceSnapshot.exists()) {
      return res.status(404).json({ error: "Device not found" });
    }

    // Add device to site
    const devices = site.devices || [];
    if (!devices.includes(deviceId)) {
      devices.push(deviceId);
      await db.ref(`sites/${siteId}/devices`).set(devices);
    }

    // Update device's site reference
    await db.ref(`devices/${deviceId}/installation/siteId`).set(siteId);

    res.json({ success: true });
  } catch (error) {
    console.error("Failed to add device to site:", error);
    res.status(500).json({ error: "Failed to add device to site" });
  }
};

/**
 * Remove a device from a site
 */
const removeDeviceFromSite = async (req, res) => {
  const { siteId, deviceId } = req.body;

  if (!siteId || !deviceId) {
    return res.status(400).json({ error: "Missing siteId or deviceId" });
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = authHeader.split("Bearer ")[1];
  let uid, role;
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    uid = decodedToken.uid;
    const db = admin.database();
    const userSnapshot = await db.ref(`users/${uid}/profile/role`).once("value");
    role = userSnapshot.val();
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }

  const db = admin.database();

  try {
    const siteSnapshot = await db.ref(`sites/${siteId}`).once("value");
    if (!siteSnapshot.exists()) {
      return res.status(404).json({ error: "Site not found" });
    }

    const site = siteSnapshot.val();
    if (site.ownerId !== uid && role !== "admin") {
      return res.status(403).json({ error: "Not authorized" });
    }

    // Remove device from site
    const devices = (site.devices || []).filter((id) => id !== deviceId);
    await db.ref(`sites/${siteId}/devices`).set(devices);

    // Clear device's site reference
    await db.ref(`devices/${deviceId}/installation/siteId`).set(null);

    res.json({ success: true });
  } catch (error) {
    console.error("Failed to remove device from site:", error);
    res.status(500).json({ error: "Failed to remove device from site" });
  }
};

/**
 * Update site boundary (polygon)
 */
const updateSiteBoundary = async (req, res) => {
  const { siteId, boundary } = req.body;

  if (!siteId || !boundary) {
    return res.status(400).json({ error: "Missing siteId or boundary" });
  }

  // Validate boundary is an array of coordinates
  if (!Array.isArray(boundary) || boundary.length < 3) {
    return res.status(400).json({ error: "Boundary must be an array of at least 3 coordinates" });
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = authHeader.split("Bearer ")[1];
  let uid, role;
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    uid = decodedToken.uid;
    const db = admin.database();
    const userSnapshot = await db.ref(`users/${uid}/profile/role`).once("value");
    role = userSnapshot.val();
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }

  const db = admin.database();

  try {
    const siteSnapshot = await db.ref(`sites/${siteId}`).once("value");
    if (!siteSnapshot.exists()) {
      return res.status(404).json({ error: "Site not found" });
    }

    const site = siteSnapshot.val();
    if (site.ownerId !== uid && role !== "admin") {
      return res.status(403).json({ error: "Not authorized" });
    }

    // Calculate area from boundary (rough approximation)
    // In production, you'd use a proper geodesic area calculation
    let area = 0;
    const n = boundary.length;
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n;
      area += boundary[i].lat * boundary[j].lng;
      area -= boundary[j].lat * boundary[i].lng;
    }
    area = Math.abs(area / 2);
    // Convert to approximate acres (very rough)
    const areaAcres = area * 3600 * 247.105; // degrees to sq miles to acres

    await db.ref(`sites/${siteId}`).update({
      "location/boundary": boundary,
      "metadata/area": Math.round(areaAcres * 100) / 100,
      updatedAt: Date.now(),
    });

    res.json({ success: true, estimatedArea: Math.round(areaAcres * 100) / 100 });
  } catch (error) {
    console.error("Failed to update site boundary:", error);
    res.status(500).json({ error: "Failed to update site boundary" });
  }
};

module.exports = {
  geocodeAddress,
  reverseGeocode,
  createSite,
  getSite,
  updateSite,
  listSites,
  deleteSite,
  addDeviceToSite,
  removeDeviceFromSite,
  updateSiteBoundary,
};
