/**
 * v2 Site Endpoints — aligned with src/services/types/devices.ts
 * GET  /v2/sites      — list user's monitoring sites
 * POST /v2/sites      — create a new site
 */

const admin = require("firebase-admin");

async function listSites(req, res) {
  try {
    const uid = req.query.userId || req.user?.uid;
    if (!uid) {
      return res.status(400).json({ success: false, error: "Missing userId" });
    }

    const db = admin.database();
    const snap = await db.ref("sites").orderByChild("ownerId").equalTo(uid).once("value");
    const raw = snap.val() || {};

    const sites = Object.entries(raw).map(([id, val]) => ({
      id,
      name: val.name || id,
      ownerId: val.ownerId || uid,
      location: {
        latitude: val.latitude || val.location?.latitude || 0,
        longitude: val.longitude || val.location?.longitude || 0,
        address: val.address || val.location?.address || "",
        city: val.city || val.location?.city || "",
        state: val.state || val.location?.state || "",
        country: val.country || val.location?.country || "US",
      },
      devices: val.devices || [],
      description: val.description || "",
      createdAt: val.createdAt || "",
      updatedAt: val.updatedAt || "",
    }));

    res.json({ success: true, data: sites });
  } catch (error) {
    console.error("v2/sites list error:", error);
    res.status(500).json({ success: false, error: "Failed to fetch sites" });
  }
}

async function createSite(req, res) {
  try {
    const { name, latitude, longitude, address, description } = req.body;
    const uid = req.user?.uid || req.body.userId;

    if (!uid) {
      return res.status(401).json({ success: false, error: "Authentication required" });
    }
    if (!name) {
      return res.status(400).json({ success: false, error: "Missing site name" });
    }

    const db = admin.database();
    const ref = db.ref("sites").push();
    const now = new Date().toISOString();

    const site = {
      id: ref.key,
      name,
      ownerId: uid,
      location: {
        latitude: parseFloat(latitude) || 0,
        longitude: parseFloat(longitude) || 0,
        address: address || "",
      },
      devices: [],
      description: description || "",
      createdAt: now,
      updatedAt: now,
    };

    await ref.set(site);

    res.json({ success: true, data: site });
  } catch (error) {
    console.error("v2/sites create error:", error);
    res.status(500).json({ success: false, error: "Failed to create site" });
  }
}

module.exports = { listSites, createSite };
