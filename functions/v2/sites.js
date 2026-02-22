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

// ── HUC-12 Watershed Lookup ───────────────────────────────────────────
// Simplified lookup using Virginia basin data (pre-loaded).
// For v2: integrate EPA Watershed Boundary Dataset / USGS WBD API.

const VIRGINIA_WATERSHEDS = [
  { huc12: "020700100101", name: "Lower James River", state: "VA", lat: 37.54, lng: -77.43, impairments: ["nitrogen", "phosphorus"] },
  { huc12: "020700100102", name: "Upper James River", state: "VA", lat: 37.78, lng: -79.44, impairments: ["nitrogen"] },
  { huc12: "020801030601", name: "Rappahannock River", state: "VA", lat: 38.30, lng: -77.46, impairments: ["phosphorus", "sediment"] },
  { huc12: "020700081002", name: "Chesapeake Bay — Lynnhaven", state: "VA", lat: 36.89, lng: -76.10, impairments: ["nitrogen", "phosphorus"] },
  { huc12: "020600010101", name: "Potomac River", state: "VA", lat: 38.90, lng: -77.04, impairments: ["nitrogen", "phosphorus"] },
  { huc12: "030101010101", name: "Chowan River", state: "NC", lat: 36.25, lng: -76.72, impairments: ["nitrogen"] },
  { huc12: "020700060101", name: "York River", state: "VA", lat: 37.24, lng: -76.51, impairments: ["nitrogen", "phosphorus"] },
  { huc12: "020802010101", name: "Shenandoah River", state: "VA", lat: 38.95, lng: -78.18, impairments: ["sediment"] },
];

async function hucLookup(req, res) {
  try {
    const lat = parseFloat(req.query.lat);
    const lng = parseFloat(req.query.lng);

    if (isNaN(lat) || isNaN(lng)) {
      return res.status(400).json({ success: false, error: "Invalid lat/lng" });
    }

    // Find nearest watershed by distance
    let best = null;
    let bestDist = Infinity;

    for (const ws of VIRGINIA_WATERSHEDS) {
      const dist = Math.sqrt((lat - ws.lat) ** 2 + (lng - ws.lng) ** 2);
      if (dist < bestDist) {
        bestDist = dist;
        best = ws;
      }
    }

    if (!best || bestDist > 2.0) {
      // Too far from any known watershed — return generic
      return res.json({
        success: true,
        data: {
          huc12: null,
          name: "Unknown watershed",
          state: null,
          impairments: [],
          activeTmdl: false,
          tradingProgram: null,
          distance: bestDist,
          note: "Watershed not in database. Enter HUC-12 code manually or contact support.",
        },
      });
    }

    res.json({
      success: true,
      data: {
        huc12: best.huc12,
        name: best.name,
        state: best.state,
        impairments: best.impairments,
        activeTmdl: best.impairments.length > 0,
        tradingProgram: best.state === "VA" ? "VA Nutrient Credit Exchange" : null,
        distance: Math.round(bestDist * 111 * 10) / 10, // Rough km conversion
      },
    });
  } catch (error) {
    console.error("v2/sites/huc-lookup error:", error);
    res.status(500).json({ success: false, error: "Failed to lookup HUC" });
  }
}

module.exports = { listSites, createSite, hucLookup };
