/**
 * v2 Programs Endpoints — aligned with src/services/types/programs.ts
 * GET  /v2/programs             — Program[]
 * GET  /v2/programs/:id         — Program
 * POST /v2/programs/:id/calculate — CreditCalculationRequest → CreditEstimate
 */

const admin = require("firebase-admin");

// Program definitions aligned with Program type
const PROGRAMS = {
  "va-nce": {
    id: "va-nce",
    name: "Virginia Nutrient Credit Exchange",
    shortName: "VA-NCE",
    description: "Virginia Nutrient Credit Exchange for Chesapeake Bay TMDL compliance.",
    status: "active",
    region: "Chesapeake Bay Watershed",
    state: "Virginia",
    country: "US",
    nutrientTypes: ["nitrogen", "phosphorus"],
    regulatoryBody: "Virginia Department of Environmental Quality (DEQ)",
    regulatoryUrl: "https://www.deq.virginia.gov",
    config: {
      regions: [
        { id: "james-river", name: "James River Basin", deliveryFactor: 1.0 },
        { id: "potomac", name: "Potomac River Basin", deliveryFactor: 0.95 },
        { id: "york", name: "York River Basin", deliveryFactor: 1.0 },
        { id: "rappahannock", name: "Rappahannock River Basin", deliveryFactor: 0.9 },
      ],
      hasDeliveryFactors: true,
      hasExchangeRatios: false,
      uncertaintyRatio: 0.95,
      minMonitoringPeriod: 90,
    },
    // Internal calculation data (not part of type, used by calculate handler)
    _baselines: { nitrogen: 5.0, phosphorus: 1.0 },
    _tradingRatios: {
      nitrogen: { "sensor-verified": 1.0, "third-party": 0.85, "self-reported": 0.6 },
      phosphorus: { "sensor-verified": 1.0, "third-party": 0.9, "self-reported": 0.65 },
    },
    _programFeePct: 0.05,
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2025-06-01T00:00:00.000Z",
  },
};

// Strip internal calc data before sending to client
function toPublicProgram(p) {
  const { _baselines, _tradingRatios, _programFeePct, ...pub } = p;
  return pub;
}

async function listPrograms(req, res) {
  try {
    const programs = Object.values(PROGRAMS)
      .filter((p) => p.status === "active" || p.status === "pilot")
      .map(toPublicProgram);
    res.json({ success: true, data: programs });
  } catch (error) {
    console.error("v2/programs error:", error);
    res.status(500).json({ success: false, error: "Failed to list programs" });
  }
}

async function getProgram(req, res) {
  try {
    const { id } = req.params;
    const program = PROGRAMS[id];
    if (!program) {
      return res.status(404).json({ success: false, error: "Program not found" });
    }
    res.json({ success: true, data: toPublicProgram(program) });
  } catch (error) {
    console.error("v2/programs/:id error:", error);
    res.status(500).json({ success: false, error: "Failed to get program details" });
  }
}

async function calculateCredits(req, res) {
  try {
    const { id } = req.params;
    // CreditCalculationRequest shape
    const { programId, deviceId, readings, regionId, nutrientType, startDate, endDate } = req.body;

    const program = PROGRAMS[id];
    if (!program) {
      return res.status(404).json({ success: false, error: "Program not found" });
    }

    if (!nutrientType || !regionId) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields: nutrientType, regionId",
      });
    }

    // Find region delivery factor
    const region = program.config.regions.find((r) => r.id === regionId);
    const deliveryFactor = region?.deliveryFactor || 1.0;
    const uncertaintyRatio = program.config.uncertaintyRatio || 1.0;

    // Calculate raw credits from readings or fallback to simple removal estimate
    let removalKg = 0;
    const readingCount = (readings || []).length;
    if (readingCount > 0) {
      // Sum up relevant readings as simple demonstration
      removalKg = readings.reduce((sum, r) => sum + (r.value || 0), 0) / Math.max(readingCount, 1);
    } else {
      removalKg = req.body.removalKg || 0;
    }

    const baseline = program._baselines[nutrientType] || 0;
    const verificationLevel = deviceId ? "sensor-verified" : "self-reported";
    const tradingRatio = program._tradingRatios[nutrientType]?.[verificationLevel] || 0.5;

    const netRemoval = Math.max(0, removalKg - baseline);
    const rawCredits = netRemoval * tradingRatio;
    const afterDelivery = rawCredits * deliveryFactor;
    const afterUncertainty = afterDelivery * uncertaintyRatio;
    const fee = afterUncertainty * program._programFeePct;
    const finalCredits = Math.round((afterUncertainty - fee) * 100) / 100;

    // CreditEstimate shape
    res.json({
      success: true,
      data: {
        programId: id,
        regionId,
        nutrientType,
        rawCredits: Math.round(rawCredits * 100) / 100,
        deliveryFactor,
        uncertaintyRatio,
        finalCredits,
        unit: "kg",
        breakdown: [
          { label: "Gross Removal", value: removalKg, unit: "kg", description: "Total nutrient removal measured" },
          { label: "Baseline Deduction", value: baseline, unit: "kg", description: "Minimum removal before credits" },
          { label: "Net Removal", value: netRemoval, unit: "kg", description: "Removal above baseline" },
          { label: "Trading Ratio", value: tradingRatio, unit: "x", description: `${verificationLevel} ratio` },
          { label: "Raw Credits", value: Math.round(rawCredits * 100) / 100, unit: "kg", description: "Before adjustments" },
          { label: "Delivery Factor", value: deliveryFactor, unit: "x", description: `Region: ${region?.name || regionId}` },
          { label: "Uncertainty Ratio", value: uncertaintyRatio, unit: "x", description: "Program uncertainty margin" },
          { label: "Program Fee", value: Math.round(fee * 100) / 100, unit: "kg", description: `${program._programFeePct * 100}% program fee` },
          { label: "Final Credits", value: finalCredits, unit: "kg", description: "Tradeable credits generated" },
        ],
        dataQuality: {
          readingCount,
          coveragePercent: readingCount > 0 ? Math.min(100, Math.round((readingCount / 288) * 100)) : 0,
          gapsDetected: 0,
          qualityScore: readingCount > 0 ? Math.min(100, Math.round((readingCount / 288) * 100)) : 0,
        },
      },
    });
  } catch (error) {
    console.error("v2/programs/:id/calculate error:", error);
    res.status(500).json({ success: false, error: "Failed to calculate credits" });
  }
}

module.exports = { listPrograms, getProgram, calculateCredits };
