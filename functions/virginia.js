/**
 * Virginia Nutrient Credit Exchange Cloud Functions
 *
 * Handles Virginia-specific credit operations:
 * - Basin management
 * - Project CRUD
 * - Credit calculation and generation
 * - Credit trading with basin restrictions
 */

const admin = require("firebase-admin");

// Virginia basins data (duplicated for server-side use)
const VIRGINIA_BASINS = {
  ES: {
    code: 'ES',
    name: 'Eastern Shore',
    nitrogenDeliveryFactor: 1.0,
    phosphorusDeliveryFactor: 1.0,
    canAcquireFrom: ['POT', 'RAP'],
    exchangeRatios: { POT: 1.0, RAP: 1.3 },
  },
  JAM: {
    code: 'JAM',
    name: 'James River',
    nitrogenDeliveryFactor: 0.92,
    phosphorusDeliveryFactor: 0.92,
    canAcquireFrom: [],
    exchangeRatios: {},
  },
  POT: {
    code: 'POT',
    name: 'Potomac River',
    nitrogenDeliveryFactor: 0.58,
    phosphorusDeliveryFactor: 0.70,
    canAcquireFrom: [],
    exchangeRatios: {},
  },
  RAP: {
    code: 'RAP',
    name: 'Rappahannock River',
    nitrogenDeliveryFactor: 0.78,
    phosphorusDeliveryFactor: 0.92,
    canAcquireFrom: [],
    exchangeRatios: {},
  },
  YOR: {
    code: 'YOR',
    name: 'York River',
    nitrogenDeliveryFactor: 0.90,
    phosphorusDeliveryFactor: 0.99,
    canAcquireFrom: [],
    exchangeRatios: {},
  },
};

const UNCERTAINTY_RATIOS = {
  point_source: 1.0,
  nonpoint_source: 2.0,
};

const OFFSET_FUND_PRICES = {
  nitrogen: 5.08,
  phosphorus: 11.15,
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Verify authentication and return user ID
 */
const verifyAuth = async (req) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  try {
    const token = authHeader.split("Bearer ")[1];
    const decodedToken = await admin.auth().verifyIdToken(token);
    return decodedToken.uid;
  } catch (error) {
    return null;
  }
};

/**
 * Generate project ID
 */
const generateProjectId = () => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 7);
  return `VA-PROJ-${timestamp}-${random}`.toUpperCase();
};

/**
 * Generate credit serial number
 */
const generateCreditSerial = (basinCode, year, nutrientType, sequence) => {
  const nutrientCode = nutrientType === 'nitrogen' ? 'N' : 'P';
  const serial = String(sequence).padStart(6, '0');
  return `VA-${basinCode}-${year}-${nutrientCode}-${serial}`;
};

/**
 * Get next credit sequence number
 */
const getNextCreditSequence = async (db, basinCode, year, nutrientType) => {
  const nutrientCode = nutrientType === 'nitrogen' ? 'N' : 'P';
  const prefix = `VA-${basinCode}-${year}-${nutrientCode}`;

  const snapshot = await db.ref('virginia/credits')
    .orderByChild('serialNumber')
    .startAt(prefix)
    .endAt(prefix + '\uf8ff')
    .once('value');

  const credits = snapshot.val();
  if (!credits) return 1;

  let maxSeq = 0;
  Object.values(credits).forEach(credit => {
    const match = credit.serialNumber.match(/-(\d{6})$/);
    if (match) {
      const seq = parseInt(match[1], 10);
      if (seq > maxSeq) maxSeq = seq;
    }
  });

  return maxSeq + 1;
};

// =============================================================================
// BASIN ENDPOINTS
// =============================================================================

/**
 * Get all Virginia basins
 */
const getBasins = async (req, res) => {
  res.json({
    basins: Object.values(VIRGINIA_BASINS),
    offsetFundPrices: OFFSET_FUND_PRICES,
    uncertaintyRatios: UNCERTAINTY_RATIOS,
  });
};

/**
 * Get a specific basin
 */
const getBasin = async (req, res) => {
  const { basinCode } = req.body;

  if (!basinCode) {
    return res.status(400).json({ error: "Basin code is required" });
  }

  const basin = VIRGINIA_BASINS[basinCode.toUpperCase()];
  if (!basin) {
    return res.status(404).json({ error: "Basin not found" });
  }

  res.json({ basin });
};

// =============================================================================
// PROJECT ENDPOINTS
// =============================================================================

/**
 * Create a new Virginia project
 */
const createProject = async (req, res) => {
  const uid = await verifyAuth(req);
  if (!uid) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { projectData } = req.body;
  if (!projectData) {
    return res.status(400).json({ error: "Project data is required" });
  }

  // Validate required fields
  const required = ['name', 'basinCode', 'sourceType', 'practiceType'];
  const missing = required.filter(f => !projectData[f]);
  if (missing.length > 0) {
    return res.status(400).json({ error: `Missing required fields: ${missing.join(', ')}` });
  }

  // Validate basin
  const basin = VIRGINIA_BASINS[projectData.basinCode.toUpperCase()];
  if (!basin) {
    return res.status(400).json({ error: "Invalid basin code" });
  }

  const db = admin.database();
  const now = Date.now();
  const projectId = generateProjectId();

  const project = {
    id: projectId,
    organizationId: uid,
    basinCode: basin.code,
    name: projectData.name,
    description: projectData.description || '',
    sourceType: projectData.sourceType,
    practiceType: projectData.practiceType,
    baselineNitrogenLoad: Number(projectData.baselineNitrogenLoad) || 0,
    baselinePhosphorusLoad: Number(projectData.baselinePhosphorusLoad) || 0,
    baselineEstablishedAt: projectData.baselineEstablishedAt || new Date().toISOString(),
    acreage: Number(projectData.acreage) || 0,
    latitude: Number(projectData.latitude) || 0,
    longitude: Number(projectData.longitude) || 0,
    address: projectData.address || '',
    county: projectData.county || '',
    verificationTier: projectData.verificationTier || 'self_reported',
    status: 'draft',
    deviceIds: projectData.deviceIds || [],
    siteId: projectData.siteId || null,
    createdAt: now,
    updatedAt: now,
    createdBy: uid,
  };

  try {
    await db.ref(`virginia/projects/${projectId}`).set(project);

    // Log activity
    await db.ref(`users/${uid}/activity`).push({
      type: 'virginia_project_created',
      timestamp: now,
      metadata: { projectId, basinCode: basin.code },
    });

    res.json({ success: true, projectId, project });
  } catch (error) {
    console.error("Failed to create project:", error);
    res.status(500).json({ error: "Failed to create project" });
  }
};

/**
 * Get a project by ID
 */
const getProject = async (req, res) => {
  const uid = await verifyAuth(req);
  if (!uid) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { projectId } = req.body;
  if (!projectId) {
    return res.status(400).json({ error: "Project ID is required" });
  }

  const db = admin.database();

  try {
    const snapshot = await db.ref(`virginia/projects/${projectId}`).once('value');
    if (!snapshot.exists()) {
      return res.status(404).json({ error: "Project not found" });
    }

    const project = snapshot.val();

    // Get basin info
    const basin = VIRGINIA_BASINS[project.basinCode];

    // Get associated credits count
    const creditsSnapshot = await db.ref('virginia/credits')
      .orderByChild('projectId')
      .equalTo(projectId)
      .once('value');

    const credits = creditsSnapshot.val() || {};
    const creditCount = Object.keys(credits).length;

    res.json({
      project,
      basin,
      creditCount,
    });
  } catch (error) {
    console.error("Failed to get project:", error);
    res.status(500).json({ error: "Failed to get project" });
  }
};

/**
 * Update a project
 */
const updateProject = async (req, res) => {
  const uid = await verifyAuth(req);
  if (!uid) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { projectId, updateData } = req.body;
  if (!projectId || !updateData) {
    return res.status(400).json({ error: "Project ID and update data are required" });
  }

  const db = admin.database();

  try {
    const snapshot = await db.ref(`virginia/projects/${projectId}`).once('value');
    if (!snapshot.exists()) {
      return res.status(404).json({ error: "Project not found" });
    }

    const project = snapshot.val();

    // Verify ownership
    if (project.organizationId !== uid) {
      const userSnapshot = await db.ref(`users/${uid}/profile/role`).once('value');
      if (userSnapshot.val() !== 'admin') {
        return res.status(403).json({ error: "Not authorized" });
      }
    }

    // Don't allow updating certain fields
    delete updateData.id;
    delete updateData.organizationId;
    delete updateData.createdAt;
    delete updateData.createdBy;

    // Validate basin if being changed
    if (updateData.basinCode) {
      const basin = VIRGINIA_BASINS[updateData.basinCode.toUpperCase()];
      if (!basin) {
        return res.status(400).json({ error: "Invalid basin code" });
      }
      updateData.basinCode = basin.code;
    }

    updateData.updatedAt = Date.now();

    await db.ref(`virginia/projects/${projectId}`).update(updateData);

    res.json({ success: true });
  } catch (error) {
    console.error("Failed to update project:", error);
    res.status(500).json({ error: "Failed to update project" });
  }
};

/**
 * List projects for the authenticated user
 */
const listProjects = async (req, res) => {
  const uid = await verifyAuth(req);
  if (!uid) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { filters = {} } = req.body;
  const db = admin.database();

  try {
    const snapshot = await db.ref('virginia/projects')
      .orderByChild('organizationId')
      .equalTo(uid)
      .once('value');

    let projects = Object.entries(snapshot.val() || {}).map(([id, p]) => ({
      id,
      ...p,
      basin: VIRGINIA_BASINS[p.basinCode],
    }));

    // Apply filters
    if (filters.basinCode) {
      projects = projects.filter(p => p.basinCode === filters.basinCode);
    }
    if (filters.status) {
      projects = projects.filter(p => p.status === filters.status);
    }
    if (filters.sourceType) {
      projects = projects.filter(p => p.sourceType === filters.sourceType);
    }

    // Sort by creation date (newest first)
    projects.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

    res.json({ projects, count: projects.length });
  } catch (error) {
    console.error("Failed to list projects:", error);
    res.status(500).json({ error: "Failed to list projects" });
  }
};

/**
 * Link a device to a project
 */
const linkDevice = async (req, res) => {
  const uid = await verifyAuth(req);
  if (!uid) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { projectId, deviceId } = req.body;
  if (!projectId || !deviceId) {
    return res.status(400).json({ error: "Project ID and device ID are required" });
  }

  const db = admin.database();

  try {
    const snapshot = await db.ref(`virginia/projects/${projectId}`).once('value');
    if (!snapshot.exists()) {
      return res.status(404).json({ error: "Project not found" });
    }

    const project = snapshot.val();
    if (project.organizationId !== uid) {
      return res.status(403).json({ error: "Not authorized" });
    }

    // Verify device exists
    const deviceSnapshot = await db.ref(`devices/${deviceId}`).once('value');
    if (!deviceSnapshot.exists()) {
      return res.status(404).json({ error: "Device not found" });
    }

    // Add device if not already linked
    const deviceIds = project.deviceIds || [];
    if (!deviceIds.includes(deviceId)) {
      deviceIds.push(deviceId);
    }

    // Update verification tier if adding first device
    let verificationTier = project.verificationTier;
    if (project.verificationTier === 'self_reported' && deviceIds.length > 0) {
      verificationTier = 'sensor_backed';
    }

    await db.ref(`virginia/projects/${projectId}`).update({
      deviceIds,
      verificationTier,
      updatedAt: Date.now(),
    });

    res.json({ success: true, deviceIds, verificationTier });
  } catch (error) {
    console.error("Failed to link device:", error);
    res.status(500).json({ error: "Failed to link device" });
  }
};

/**
 * Unlink a device from a project
 */
const unlinkDevice = async (req, res) => {
  const uid = await verifyAuth(req);
  if (!uid) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { projectId, deviceId } = req.body;
  if (!projectId || !deviceId) {
    return res.status(400).json({ error: "Project ID and device ID are required" });
  }

  const db = admin.database();

  try {
    const snapshot = await db.ref(`virginia/projects/${projectId}`).once('value');
    if (!snapshot.exists()) {
      return res.status(404).json({ error: "Project not found" });
    }

    const project = snapshot.val();
    if (project.organizationId !== uid) {
      return res.status(403).json({ error: "Not authorized" });
    }

    const deviceIds = (project.deviceIds || []).filter(id => id !== deviceId);

    // Downgrade verification tier if no more devices
    let verificationTier = project.verificationTier;
    if (deviceIds.length === 0 && verificationTier === 'sensor_backed') {
      verificationTier = 'self_reported';
    }

    await db.ref(`virginia/projects/${projectId}`).update({
      deviceIds,
      verificationTier,
      updatedAt: Date.now(),
    });

    res.json({ success: true, deviceIds, verificationTier });
  } catch (error) {
    console.error("Failed to unlink device:", error);
    res.status(500).json({ error: "Failed to unlink device" });
  }
};

// =============================================================================
// CREDIT CALCULATION & GENERATION
// =============================================================================

/**
 * Calculate credits for a project (estimate without generating)
 */
const calculateCredits = async (req, res) => {
  const uid = await verifyAuth(req);
  if (!uid) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { projectId, complianceYear } = req.body;
  if (!projectId || !complianceYear) {
    return res.status(400).json({ error: "Project ID and compliance year are required" });
  }

  const db = admin.database();

  try {
    const snapshot = await db.ref(`virginia/projects/${projectId}`).once('value');
    if (!snapshot.exists()) {
      return res.status(404).json({ error: "Project not found" });
    }

    const project = snapshot.val();
    const basin = VIRGINIA_BASINS[project.basinCode];
    const uncertaintyRatio = UNCERTAINTY_RATIOS[project.sourceType];

    // Simplified calculation using practice-based efficiencies
    // In production, this would pull actual sensor data
    const practiceEfficiencies = {
      cover_crop: { nitrogen: 0.20, phosphorus: 0.10 },
      nutrient_management: { nitrogen: 0.15, phosphorus: 0.12 },
      forest_buffer: { nitrogen: 0.50, phosphorus: 0.45 },
      stream_restoration: { nitrogen: 0.30, phosphorus: 0.35 },
      urban_bmp: { nitrogen: 0.25, phosphorus: 0.30 },
      agricultural_bmp: { nitrogen: 0.35, phosphorus: 0.30 },
      land_conversion: { nitrogen: 0.60, phosphorus: 0.55 },
      oyster_aquaculture: { nitrogen: 0.08, phosphorus: 0.00 },
      septic_upgrade: { nitrogen: 0.50, phosphorus: 0.30 },
      wastewater_treatment: { nitrogen: 0.80, phosphorus: 0.85 },
    };

    const efficiency = practiceEfficiencies[project.practiceType] || { nitrogen: 0.1, phosphorus: 0.1 };

    // Calculate raw reductions
    const nitrogenRawReduction = project.baselineNitrogenLoad * efficiency.nitrogen;
    const phosphorusRawReduction = project.baselinePhosphorusLoad * efficiency.phosphorus;

    // Apply delivery factors and uncertainty ratios
    const nitrogenCredits = (nitrogenRawReduction * basin.nitrogenDeliveryFactor) / uncertaintyRatio;
    const phosphorusCredits = (phosphorusRawReduction * basin.phosphorusDeliveryFactor) / uncertaintyRatio;

    // Calculate estimated value
    const nitrogenValue = nitrogenCredits * OFFSET_FUND_PRICES.nitrogen;
    const phosphorusValue = phosphorusCredits * OFFSET_FUND_PRICES.phosphorus;

    res.json({
      projectId,
      complianceYear,
      basin: {
        code: basin.code,
        name: basin.name,
      },
      nitrogen: {
        rawReductionLbs: Math.round(nitrogenRawReduction * 100) / 100,
        deliveryFactor: basin.nitrogenDeliveryFactor,
        uncertaintyRatio,
        deliveredCreditsLbs: Math.round(nitrogenCredits * 100) / 100,
        estimatedValueUSD: Math.round(nitrogenValue * 100) / 100,
      },
      phosphorus: {
        rawReductionLbs: Math.round(phosphorusRawReduction * 100) / 100,
        deliveryFactor: basin.phosphorusDeliveryFactor,
        uncertaintyRatio,
        deliveredCreditsLbs: Math.round(phosphorusCredits * 100) / 100,
        estimatedValueUSD: Math.round(phosphorusValue * 100) / 100,
      },
      summary: {
        totalCreditsLbs: Math.round((nitrogenCredits + phosphorusCredits) * 100) / 100,
        totalEstimatedValue: Math.round((nitrogenValue + phosphorusValue) * 100) / 100,
        verificationTier: project.verificationTier,
        calculationMethod: project.deviceIds?.length > 0 ? 'sensor-based' : 'practice-based',
      },
    });
  } catch (error) {
    console.error("Failed to calculate credits:", error);
    res.status(500).json({ error: "Failed to calculate credits" });
  }
};

/**
 * Generate credits from a project
 */
const generateCredits = async (req, res) => {
  const uid = await verifyAuth(req);
  if (!uid) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { projectId, complianceYear } = req.body;
  if (!projectId || !complianceYear) {
    return res.status(400).json({ error: "Project ID and compliance year are required" });
  }

  const db = admin.database();

  try {
    const snapshot = await db.ref(`virginia/projects/${projectId}`).once('value');
    if (!snapshot.exists()) {
      return res.status(404).json({ error: "Project not found" });
    }

    const project = snapshot.val();

    // Verify ownership
    if (project.organizationId !== uid) {
      return res.status(403).json({ error: "Not authorized" });
    }

    // Verify project is active
    if (project.status !== 'active') {
      return res.status(400).json({ error: "Project must be active to generate credits" });
    }

    const basin = VIRGINIA_BASINS[project.basinCode];
    const uncertaintyRatio = UNCERTAINTY_RATIOS[project.sourceType];
    const now = Date.now();
    const yearEnd = `${complianceYear}-12-31T23:59:59Z`;

    // Calculate credits (same logic as calculateCredits)
    const practiceEfficiencies = {
      cover_crop: { nitrogen: 0.20, phosphorus: 0.10 },
      nutrient_management: { nitrogen: 0.15, phosphorus: 0.12 },
      forest_buffer: { nitrogen: 0.50, phosphorus: 0.45 },
      stream_restoration: { nitrogen: 0.30, phosphorus: 0.35 },
      urban_bmp: { nitrogen: 0.25, phosphorus: 0.30 },
      agricultural_bmp: { nitrogen: 0.35, phosphorus: 0.30 },
      land_conversion: { nitrogen: 0.60, phosphorus: 0.55 },
      oyster_aquaculture: { nitrogen: 0.08, phosphorus: 0.00 },
      septic_upgrade: { nitrogen: 0.50, phosphorus: 0.30 },
      wastewater_treatment: { nitrogen: 0.80, phosphorus: 0.85 },
    };

    const efficiency = practiceEfficiencies[project.practiceType] || { nitrogen: 0.1, phosphorus: 0.1 };
    const credits = [];

    // Generate nitrogen credit
    const nitrogenRaw = project.baselineNitrogenLoad * efficiency.nitrogen;
    const nitrogenDelivered = (nitrogenRaw * basin.nitrogenDeliveryFactor) / uncertaintyRatio;

    if (nitrogenDelivered > 0) {
      const nitrogenSeq = await getNextCreditSequence(db, basin.code, complianceYear, 'nitrogen');
      const nitrogenCredit = {
        serialNumber: generateCreditSerial(basin.code, complianceYear, 'nitrogen', nitrogenSeq),
        projectId,
        basinCode: basin.code,
        complianceYear,
        nutrientType: 'nitrogen',
        quantityLbs: Math.round(nitrogenDelivered * 100) / 100,
        rawQuantityLbs: Math.round(nitrogenRaw * 100) / 100,
        deliveryFactor: basin.nitrogenDeliveryFactor,
        uncertaintyRatio,
        generatedAt: now,
        expiresAt: yearEnd,
        verificationMethod: project.verificationTier,
        status: 'pending_verification',
        currentOwnerId: uid,
        originalOwnerId: uid,
        createdAt: now,
        updatedAt: now,
      };

      const creditId = db.ref('virginia/credits').push().key;
      await db.ref(`virginia/credits/${creditId}`).set(nitrogenCredit);
      credits.push({ id: creditId, ...nitrogenCredit });
    }

    // Generate phosphorus credit
    const phosphorusRaw = project.baselinePhosphorusLoad * efficiency.phosphorus;
    const phosphorusDelivered = (phosphorusRaw * basin.phosphorusDeliveryFactor) / uncertaintyRatio;

    if (phosphorusDelivered > 0) {
      const phosphorusSeq = await getNextCreditSequence(db, basin.code, complianceYear, 'phosphorus');
      const phosphorusCredit = {
        serialNumber: generateCreditSerial(basin.code, complianceYear, 'phosphorus', phosphorusSeq),
        projectId,
        basinCode: basin.code,
        complianceYear,
        nutrientType: 'phosphorus',
        quantityLbs: Math.round(phosphorusDelivered * 100) / 100,
        rawQuantityLbs: Math.round(phosphorusRaw * 100) / 100,
        deliveryFactor: basin.phosphorusDeliveryFactor,
        uncertaintyRatio,
        generatedAt: now,
        expiresAt: yearEnd,
        verificationMethod: project.verificationTier,
        status: 'pending_verification',
        currentOwnerId: uid,
        originalOwnerId: uid,
        createdAt: now,
        updatedAt: now,
      };

      const creditId = db.ref('virginia/credits').push().key;
      await db.ref(`virginia/credits/${creditId}`).set(phosphorusCredit);
      credits.push({ id: creditId, ...phosphorusCredit });
    }

    // Log activity
    await db.ref(`users/${uid}/activity`).push({
      type: 'virginia_credits_generated',
      timestamp: now,
      metadata: {
        projectId,
        complianceYear,
        creditCount: credits.length,
        totalLbs: credits.reduce((sum, c) => sum + c.quantityLbs, 0),
      },
    });

    res.json({
      success: true,
      credits,
      summary: {
        count: credits.length,
        totalLbs: credits.reduce((sum, c) => sum + c.quantityLbs, 0),
      },
    });
  } catch (error) {
    console.error("Failed to generate credits:", error);
    res.status(500).json({ error: "Failed to generate credits" });
  }
};

/**
 * Get Virginia credits for the authenticated user
 */
const getCredits = async (req, res) => {
  const uid = await verifyAuth(req);
  if (!uid) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { filters = {} } = req.body;
  const db = admin.database();

  try {
    const snapshot = await db.ref('virginia/credits')
      .orderByChild('currentOwnerId')
      .equalTo(uid)
      .once('value');

    let credits = Object.entries(snapshot.val() || {}).map(([id, c]) => ({
      id,
      ...c,
      basin: VIRGINIA_BASINS[c.basinCode],
    }));

    // Apply filters
    if (filters.basinCode) {
      credits = credits.filter(c => c.basinCode === filters.basinCode);
    }
    if (filters.complianceYear) {
      credits = credits.filter(c => c.complianceYear === filters.complianceYear);
    }
    if (filters.nutrientType) {
      credits = credits.filter(c => c.nutrientType === filters.nutrientType);
    }
    if (filters.status) {
      credits = credits.filter(c => c.status === filters.status);
    }

    // Sort by creation date (newest first)
    credits.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

    // Calculate totals
    const totals = {
      nitrogen: credits.filter(c => c.nutrientType === 'nitrogen')
        .reduce((sum, c) => sum + (c.quantityLbs || 0), 0),
      phosphorus: credits.filter(c => c.nutrientType === 'phosphorus')
        .reduce((sum, c) => sum + (c.quantityLbs || 0), 0),
    };

    res.json({
      credits,
      count: credits.length,
      totals,
    });
  } catch (error) {
    console.error("Failed to get credits:", error);
    res.status(500).json({ error: "Failed to get credits" });
  }
};

/**
 * Validate a credit transfer between basins
 */
const validateTransfer = async (req, res) => {
  const { creditId, buyerBasinCode, quantityLbs } = req.body;

  if (!creditId || !buyerBasinCode) {
    return res.status(400).json({ error: "Credit ID and buyer basin code are required" });
  }

  const db = admin.database();

  try {
    const snapshot = await db.ref(`virginia/credits/${creditId}`).once('value');
    if (!snapshot.exists()) {
      return res.status(404).json({ error: "Credit not found" });
    }

    const credit = snapshot.val();
    const sellerBasin = VIRGINIA_BASINS[credit.basinCode];
    const buyerBasin = VIRGINIA_BASINS[buyerBasinCode.toUpperCase()];

    if (!buyerBasin) {
      return res.status(400).json({ error: "Invalid buyer basin code" });
    }

    const errors = [];
    const warnings = [];

    // Check basin compatibility
    const sameBasin = credit.basinCode === buyerBasinCode.toUpperCase();
    const canTrade = sameBasin || buyerBasin.canAcquireFrom.includes(credit.basinCode);

    if (!canTrade) {
      errors.push(`Credits from ${sellerBasin.name} cannot be used in ${buyerBasin.name}`);
    }

    // Get exchange ratio
    const exchangeRatio = sameBasin ? 1.0 : (buyerBasin.exchangeRatios[credit.basinCode] || 0);
    if (!sameBasin && exchangeRatio > 1) {
      warnings.push(
        `Cross-basin trade requires ${exchangeRatio}:1 ratio. ` +
        `${quantityLbs || credit.quantityLbs} lbs purchased = ` +
        `${((quantityLbs || credit.quantityLbs) / exchangeRatio).toFixed(2)} lbs effective credit`
      );
    }

    // Check expiration
    const now = new Date();
    const expiresAt = new Date(credit.expiresAt);
    if (expiresAt < now) {
      errors.push('Credit has expired');
    } else if (expiresAt.getTime() - now.getTime() < 30 * 24 * 60 * 60 * 1000) {
      warnings.push('Credit expires within 30 days');
    }

    // Check status
    if (credit.status !== 'verified' && credit.status !== 'listed') {
      errors.push(`Credit status "${credit.status}" is not available for purchase`);
    }

    // Check quantity
    if (quantityLbs && quantityLbs > credit.quantityLbs) {
      errors.push(`Requested quantity (${quantityLbs}) exceeds available (${credit.quantityLbs})`);
    }

    res.json({
      valid: errors.length === 0,
      errors,
      warnings,
      exchangeRatio,
      effectiveCredits: (quantityLbs || credit.quantityLbs) / exchangeRatio,
      credit: {
        serialNumber: credit.serialNumber,
        basinCode: credit.basinCode,
        basinName: sellerBasin.name,
        nutrientType: credit.nutrientType,
        quantityLbs: credit.quantityLbs,
        expiresAt: credit.expiresAt,
        status: credit.status,
      },
      buyerBasin: {
        code: buyerBasin.code,
        name: buyerBasin.name,
      },
    });
  } catch (error) {
    console.error("Failed to validate transfer:", error);
    res.status(500).json({ error: "Failed to validate transfer" });
  }
};

// =============================================================================
// EXPORTS
// =============================================================================

module.exports = {
  // Basins
  getBasins,
  getBasin,
  // Projects
  createProject,
  getProject,
  updateProject,
  listProjects,
  linkDevice,
  unlinkDevice,
  // Credits
  calculateCredits,
  generateCredits,
  getCredits,
  validateTransfer,
};
