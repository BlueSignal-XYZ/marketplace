// /src/apis/creditsApi.js

/** 
 * Realistic marketplace mock credits.
 * This gives you a complete dataset for listing & detail views.
 */

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
      "Modeled using approved BMP effectiveness factors and validated with periodic sampling."
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
      "Based on influent/effluent monitoring and regulatory-approved mass balance calculations."
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
      "Aggregation of farm-level nutrient plans with verification underway."
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
      "Calculated using regional stormwater crediting protocols and approved design performance assumptions."
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
      "Based on pre- and post-upgrade monitoring and state thermal crediting guidance."
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
