// /src/apis/creditsApi.js

/**
 * Realistic marketplace mock credits.
 * This gives you a complete dataset for listing & detail views.
 * Each credit includes coordinates and boundary GeoJSON for map display.
 */

/**
 * Generate an approximate rectangular boundary polygon from center point and acreage
 * @param {number} lat - Center latitude
 * @param {number} lng - Center longitude
 * @param {number} acreage - Property size in acres
 * @returns {Array} GeoJSON polygon coordinates [[[lng, lat], ...]]
 */
function generateBoundaryFromAcreage(lat, lng, acreage) {
  // 1 acre ≈ 4047 m²
  // At ~40° latitude: 1° lat ≈ 111km, 1° lng ≈ 85km
  const sqMeters = acreage * 4047;
  const sideLength = Math.sqrt(sqMeters); // meters

  // Convert to degrees (approximate)
  const latDelta = (sideLength / 111000) / 2;
  const lngDelta = (sideLength / 85000) / 2;

  // Create slightly irregular polygon for natural look
  return [[
    [lng - lngDelta * 1.1, lat - latDelta * 0.9],
    [lng + lngDelta * 0.95, lat - latDelta * 1.05],
    [lng + lngDelta * 1.05, lat + latDelta * 0.95],
    [lng - lngDelta * 0.9, lat + latDelta * 1.1],
    [lng - lngDelta * 1.1, lat - latDelta * 0.9], // Close the polygon
  ]];
}

const MOCK_CREDITS = [
  {
    id: "credit-1",
    name: "Alachua Row Crop Nitrogen Reduction",
    watershed: "Suwannee River Basin",
    pollutant: "N",
    quantityAvailable: 25000,
    unit: "lb N",
    pricePerUnit: 4.5,
    totalValueUsd: 112500,
    location: "Alachua County, FL",
    sellerName: "Lakeview Farms",
    sellerType: "Farmer",
    verificationStatus: "Verified",
    vintageYear: 2023,
    tags: ["BMP", "Row crops", "Cover cropping"],
    description:
      "Nitrogen load reductions from cover cropping and optimized fertilizer application on row crops in Alachua County.",
    methodology:
      "Modeled using approved BMP effectiveness factors and validated with periodic sampling.",
    // Geographic data
    lat: 29.6516,
    lng: -82.3248,
    acreage: 450,
    boundary: {
      type: "Polygon",
      coordinates: generateBoundaryFromAcreage(29.6516, -82.3248, 450)
    }
  },
  {
    id: "credit-2",
    name: "Wastewater Plant Phosphorus Upgrade",
    watershed: "Upper Mississippi",
    pollutant: "P",
    quantityAvailable: 8000,
    unit: "lb P",
    pricePerUnit: 9.25,
    totalValueUsd: 74000,
    location: "Dubuque, IA",
    sellerName: "Dubuque Water Utility",
    sellerType: "Utility",
    verificationStatus: "Verified",
    vintageYear: 2022,
    tags: ["Wastewater", "Technology upgrade"],
    description:
      "Phosphorus reductions from tertiary treatment upgrades at a municipal wastewater facility.",
    methodology:
      "Based on influent/effluent monitoring and regulatory-approved mass balance calculations.",
    // Geographic data - Wastewater facility site
    lat: 42.5006,
    lng: -90.6646,
    acreage: 25,
    boundary: {
      type: "Polygon",
      coordinates: generateBoundaryFromAcreage(42.5006, -90.6646, 25)
    }
  },
  {
    id: "credit-3",
    name: "Dairy Manure Management Cluster",
    watershed: "Chesapeake Bay",
    pollutant: "N",
    quantityAvailable: 15000,
    unit: "lb N",
    pricePerUnit: 6.75,
    totalValueUsd: 101250,
    location: "Lancaster County, PA",
    sellerName: "Keystone Dairy Co-op",
    sellerType: "Aggregator",
    verificationStatus: "Pending",
    vintageYear: 2024,
    tags: ["Dairy", "Manure management", "Aggregation"],
    description:
      "Nutrient reductions achieved through consolidated manure storage and improved application practices.",
    methodology:
      "Aggregation of farm-level nutrient plans with verification underway.",
    // Geographic data - Lancaster County dairy farm
    lat: 40.0379,
    lng: -76.3055,
    acreage: 280,
    boundary: {
      type: "Polygon",
      coordinates: generateBoundaryFromAcreage(40.0379, -76.3055, 280)
    }
  },
  {
    id: "credit-4",
    name: "Urban Stormwater Retrofit Portfolio",
    watershed: "Potomac",
    pollutant: "TSS",
    quantityAvailable: 54000,
    unit: "lb TSS",
    pricePerUnit: 1.8,
    totalValueUsd: 97200,
    location: "Arlington, VA",
    sellerName: "Metro Stormwater Partners",
    sellerType: "Industrial",
    verificationStatus: "Provisional",
    vintageYear: 2023,
    tags: ["Stormwater", "Retrofits"],
    description:
      "Sediment load reductions from green infrastructure improvements across commercial and municipal sites.",
    methodology:
      "Calculated using regional stormwater crediting protocols and approved design performance assumptions.",
    // Geographic data - Arlington urban area
    lat: 38.8799,
    lng: -77.1068,
    acreage: 12,
    boundary: {
      type: "Polygon",
      coordinates: generateBoundaryFromAcreage(38.8799, -77.1068, 12)
    }
  },
  {
    id: "credit-5",
    name: "Thermal Load Reduction – Cooling Water",
    watershed: "Columbia River",
    pollutant: "Temp",
    quantityAvailable: 120000,
    unit: "MMBTU avoided",
    pricePerUnit: 0.85,
    totalValueUsd: 102000,
    location: "Benton County, WA",
    sellerName: "Northwest Industrial Cooling",
    sellerType: "Industrial",
    verificationStatus: "Verified",
    vintageYear: 2021,
    tags: ["Thermal", "Industrial", "Cooling"],
    description:
      "Thermal load reductions due to upgraded cooling tower systems and optimized intake operations.",
    methodology:
      "Based on pre- and post-upgrade monitoring and state thermal crediting guidance.",
    // Geographic data - Benton County industrial site near Columbia River
    lat: 46.2396,
    lng: -119.2247,
    acreage: 85,
    boundary: {
      type: "Polygon",
      coordinates: generateBoundaryFromAcreage(46.2396, -119.2247, 85)
    }
  }
];

/** Delay helper */
function wait(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

/** Fetch all credits (marketplace list) */
export async function getCredits() {
  await wait(250);
  return [...MOCK_CREDITS];
}

/** Fetch a single credit by ID (detail page) */
export async function getCreditById(id) {
  await wait(200);
  const match = MOCK_CREDITS.find((c) => c.id === id);
  return match || null;
}
