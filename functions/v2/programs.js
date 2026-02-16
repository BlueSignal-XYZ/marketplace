/**
 * v2 Programs Endpoints
 * GET  /v2/programs            — List all active programs
 * GET  /v2/programs/:id        — Get program details
 * POST /v2/programs/:id/calculate — Calculate credits for a program
 */

const admin = require("firebase-admin");

// Program definitions (server-side mirror of ProgramRegistry)
const PROGRAMS = {
  "va-nce": {
    id: "va-nce",
    name: "Virginia Nutrient Credit Exchange",
    shortName: "VA NCE",
    state: "Virginia",
    region: "Chesapeake Bay Watershed",
    description:
      "Virginia Nutrient Credit Exchange for Chesapeake Bay TMDL compliance.",
    regulatoryBody: "Virginia DEQ",
    supportedNutrients: ["nitrogen", "phosphorus"],
    active: true,
    baselines: { nitrogen: 5.0, phosphorus: 1.0 },
    tradingRatios: {
      nitrogen: {
        "sensor-verified": 1.0,
        "third-party": 0.85,
        "self-reported": 0.6,
      },
      phosphorus: {
        "sensor-verified": 1.0,
        "third-party": 0.9,
        "self-reported": 0.65,
      },
    },
    programFeePct: 0.05,
  },
};

async function listPrograms(req, res) {
  try {
    const programs = Object.values(PROGRAMS).filter((p) => p.active);
    res.json({ success: true, data: programs, total: programs.length });
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
      return res
        .status(404)
        .json({ success: false, error: "Program not found" });
    }
    res.json({ success: true, data: program });
  } catch (error) {
    console.error("v2/programs/:id error:", error);
    res
      .status(500)
      .json({ success: false, error: "Failed to get program details" });
  }
}

async function calculateCredits(req, res) {
  try {
    const { id } = req.params;
    const { nutrientType, removalKg, verificationLevel, vintage } = req.body;

    const program = PROGRAMS[id];
    if (!program) {
      return res
        .status(404)
        .json({ success: false, error: "Program not found" });
    }

    if (!nutrientType || !removalKg || !verificationLevel) {
      return res
        .status(400)
        .json({
          success: false,
          error: "Missing required fields: nutrientType, removalKg, verificationLevel",
        });
    }

    const baseline = program.baselines[nutrientType] || 0;
    const ratio =
      program.tradingRatios[nutrientType]?.[verificationLevel] || 0.5;
    const netRemoval = Math.max(0, removalKg - baseline);
    const rawCredits = netRemoval * ratio;
    const fee = rawCredits * program.programFeePct;
    const credits = Math.max(0, rawCredits - fee);

    res.json({
      success: true,
      data: {
        programId: id,
        credits: Math.round(credits * 100) / 100,
        unit: "kg",
        ratioApplied: ratio,
        baselineRemoval: baseline,
        netRemoval,
        programFee: Math.round(fee * 100) / 100,
        input: { nutrientType, removalKg, verificationLevel, vintage },
      },
    });
  } catch (error) {
    console.error("v2/programs/:id/calculate error:", error);
    res
      .status(500)
      .json({ success: false, error: "Failed to calculate credits" });
  }
}

module.exports = { listPrograms, getProgram, calculateCredits };
