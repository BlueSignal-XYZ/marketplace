/**
 * v2 Market Data Endpoints
 * /v2/market/stats — Global market statistics
 * /v2/market/ticker — Real-time N and P credit prices
 *
 * DO NOT modify v1 endpoints. These are additive.
 */

const admin = require("firebase-admin");

/**
 * GET /v2/market/stats
 * Returns global market statistics for the WQT landing page snapshot bar.
 */
async function getMarketStats(req, res) {
  try {
    const db = admin.database();

    // Gather stats from multiple sources in parallel
    const [listingsSnap, creditsSnap, sensorsSnap] = await Promise.all([
      db.ref("marketplace/listings").once("value"),
      db.ref("certificates").once("value"),
      db.ref("devices").once("value"),
    ]);

    const listings = listingsSnap.val() || {};
    const certificates = creditsSnap.val() || {};
    const devices = sensorsSnap.val() || {};

    const listingArr = Object.values(listings);
    const certArr = Object.values(certificates);
    const deviceArr = Object.values(devices);

    // Calculate active sensors (devices with public sharing or online)
    const activeSensors = deviceArr.filter(
      (d) => d.status === "active" || d.onlineStatus === "online"
    ).length;

    // Calculate credit volumes
    const totalTraded = certArr.length;
    const totalRetired = certArr.filter((c) => c.status === "retired").length;
    const activeListings = listingArr.filter((l) => l.status === "active").length;

    // Price calculations from active listings
    const activeWithPrice = listingArr.filter(
      (l) => l.status === "active" && l.pricePerUnit
    );

    let avgNPrice = 0;
    let avgPPrice = 0;
    const nListings = activeWithPrice.filter(
      (l) => l.pollutant === "nitrogen" || l.nutrientType === "nitrogen"
    );
    const pListings = activeWithPrice.filter(
      (l) => l.pollutant === "phosphorus" || l.nutrientType === "phosphorus"
    );

    if (nListings.length > 0) {
      avgNPrice =
        nListings.reduce((sum, l) => sum + (l.pricePerUnit || 0), 0) /
        nListings.length;
    }
    if (pListings.length > 0) {
      avgPPrice =
        pListings.reduce((sum, l) => sum + (l.pricePerUnit || 0), 0) /
        pListings.length;
    }

    res.json({
      success: true,
      data: {
        totalCreditsTraded: totalTraded,
        totalCreditsRetired: totalRetired,
        activeSensors,
        activeListings,
        avgNitrogenPrice: Math.round(avgNPrice * 100) / 100,
        avgPhosphorusPrice: Math.round(avgPPrice * 100) / 100,
        nitrogenPriceChange24h: 0, // TODO(P3, Added 2026-04-05, Updated 2026-04-12): historical tracking
        phosphorusPriceChange24h: 0,
        last24hTransactions: 0,
        totalVolume: 0,
        last7dVolume: 0,
      },
    });
  } catch (error) {
    console.error("v2/market/stats error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to retrieve market statistics",
    });
  }
}

/**
 * GET /v2/market/ticker
 * Returns real-time price data for nitrogen and phosphorus credits.
 */
async function getMarketTicker(req, res) {
  try {
    const db = admin.database();
    const listingsSnap = await db.ref("marketplace/listings").once("value");
    const listings = listingsSnap.val() || {};
    const listingArr = Object.values(listings).filter(
      (l) => l.status === "active" && l.pricePerUnit
    );

    const buildTicker = (nutrientType) => {
      const filtered = listingArr.filter(
        (l) =>
          l.pollutant === nutrientType ||
          l.nutrientType === nutrientType
      );
      const prices = filtered.map((l) => l.pricePerUnit || 0);
      const avg =
        prices.length > 0
          ? prices.reduce((a, b) => a + b, 0) / prices.length
          : 0;
      const high = prices.length > 0 ? Math.max(...prices) : 0;
      const low = prices.length > 0 ? Math.min(...prices) : 0;

      return {
        nutrientType,
        price: Math.round(avg * 100) / 100,
        change24h: 0, // TODO(P3, Added 2026-04-05, Updated 2026-04-12): historical price tracking
        change7d: 0,
        volume24h: 0,
        high24h: Math.round(high * 100) / 100,
        low24h: Math.round(low * 100) / 100,
        sparkline7d: [], // TODO(P3, Added 2026-04-05, Updated 2026-04-12): historical data points
      };
    };

    res.json({
      success: true,
      data: [buildTicker("nitrogen"), buildTicker("phosphorus")],
    });
  } catch (error) {
    console.error("v2/market/ticker error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to retrieve market ticker",
    });
  }
}

module.exports = {
  getMarketStats,
  getMarketTicker,
};
