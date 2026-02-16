/**
 * v2 Market Search Endpoint
 * POST /v2/market/search — Filtered listing search with pagination
 */

const admin = require("firebase-admin");

async function searchListings(req, res) {
  try {
    const {
      page = 1,
      limit = 20,
      nutrientType,
      region,
      watershed,
      priceMin,
      priceMax,
      vintage,
      verificationLevel,
      programId,
      query,
      sort,
    } = req.body;

    const db = admin.database();
    const snap = await db.ref("marketplace/listings").once("value");
    const raw = snap.val() || {};
    let listings = Object.entries(raw).map(([key, val]) => ({
      id: key,
      ...val,
    }));

    // Only active listings
    listings = listings.filter((l) => l.status === "active");

    // Filters
    if (nutrientType) {
      listings = listings.filter(
        (l) => l.nutrientType === nutrientType || l.pollutant === nutrientType
      );
    }
    if (region) {
      listings = listings.filter((l) =>
        (l.region || "").toLowerCase().includes(region.toLowerCase())
      );
    }
    if (watershed) {
      listings = listings.filter((l) =>
        (l.watershed || "").toLowerCase().includes(watershed.toLowerCase())
      );
    }
    if (priceMin !== undefined) {
      listings = listings.filter(
        (l) => (l.pricePerUnit || l.pricePerCredit || 0) >= priceMin
      );
    }
    if (priceMax !== undefined) {
      listings = listings.filter(
        (l) => (l.pricePerUnit || l.pricePerCredit || 0) <= priceMax
      );
    }
    if (vintage) {
      listings = listings.filter((l) => l.vintage === vintage);
    }
    if (verificationLevel) {
      listings = listings.filter(
        (l) => l.verificationLevel === verificationLevel
      );
    }
    if (programId) {
      listings = listings.filter((l) => l.programId === programId);
    }
    if (query) {
      const q = query.toLowerCase();
      listings = listings.filter(
        (l) =>
          (l.id || "").toLowerCase().includes(q) ||
          (l.creditId || "").toLowerCase().includes(q) ||
          (l.region || "").toLowerCase().includes(q) ||
          (l.sellerName || l.seller || "").toLowerCase().includes(q)
      );
    }

    // Sort
    if (sort && sort.field) {
      listings.sort((a, b) => {
        const aVal = a[sort.field] ?? "";
        const bVal = b[sort.field] ?? "";
        if (aVal < bVal) return sort.direction === "asc" ? -1 : 1;
        if (aVal > bVal) return sort.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    // Paginate
    const total = listings.length;
    const totalPages = Math.ceil(total / limit);
    const start = (page - 1) * limit;
    const data = listings.slice(start, start + limit);

    res.json({
      success: true,
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error("v2/market/search error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to search listings",
    });
  }
}

module.exports = { searchListings };
