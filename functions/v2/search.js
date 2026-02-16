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
    const page_data = listings.slice(start, start + limit);

    // Project to ListingSummary shape (not full DB objects)
    const data = page_data.map((l) => ({
      id: l.id,
      creditId: l.creditId || l.id,
      nutrientType: l.nutrientType || l.pollutant || "nitrogen",
      quantity: l.quantity || l.quantityAvailable || 0,
      pricePerCredit: l.pricePerCredit || l.pricePerUnit || 0,
      region: l.region || l.location || "",
      verificationLevel: l.verificationLevel || "self-reported",
      sellerName: l.sellerName || l.seller || "",
      vintage: l.vintage || "",
      status: l.status || "active",
      createdAt: l.createdAt || l.listedAt || "",
    }));

    // Wrap in ApiResponse<PaginatedResponse<ListingSummary>> envelope
    res.json({
      success: true,
      data: {
        data,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
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

async function getListing(req, res) {
  try {
    const { id } = req.params;
    const db = admin.database();
    const snap = await db.ref(`marketplace/listings/${id}`).once("value");
    const val = snap.val();

    if (!val) {
      return res.status(404).json({ success: false, error: "Listing not found" });
    }

    // Return full Listing shape
    res.json({
      success: true,
      data: {
        id,
        creditId: val.creditId || id,
        sellerId: val.sellerUid || val.sellerId || "",
        sellerName: val.sellerName || val.seller || "",
        nutrientType: val.nutrientType || val.pollutant || "nitrogen",
        quantity: val.quantity || val.quantityAvailable || 0,
        pricePerCredit: val.pricePerCredit || val.pricePerUnit || 0,
        totalPrice: (val.quantity || 0) * (val.pricePerCredit || val.pricePerUnit || 0),
        region: val.region || val.location || "",
        watershed: val.watershed || "",
        vintage: val.vintage || "",
        verificationLevel: val.verificationLevel || "self-reported",
        status: val.status || "active",
        deviceId: val.deviceId || undefined,
        programId: val.programId || undefined,
        certificateId: val.certificateId || undefined,
        description: val.description || "",
        createdAt: val.createdAt || val.listedAt || "",
        updatedAt: val.updatedAt || "",
        expiresAt: val.expiresAt || undefined,
      },
    });
  } catch (error) {
    console.error("v2/market/listing error:", error);
    res.status(500).json({ success: false, error: "Failed to fetch listing" });
  }
}

module.exports = { searchListings, getListing };
