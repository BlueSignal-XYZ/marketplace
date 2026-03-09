// Competitor and TCO Comparison Data

export const COMPETITORS = {
  enterprise: {
    name: "Enterprise Algae Control (LG Sonic, WaterIQ, etc.)",
    priceRange: "$30,000 - $100,000+",
    minPrice: 30000,
    maxPrice: 100000,
    weight: "440+ lbs (200+ kg)",
    deployment: "3+ people, crane or boat with davit",
    sensors: "6 parameters typical",
    algaeControl: true,
    coverage: "500m diameter",
    connectivity: "Cellular/Radio with proprietary gateway",
    annualCosts: "$5,000 - $15,000 (service contracts)",
    targetMarket: "Utilities, large municipalities",
    features: [
      "Industrial ultrasonic systems",
      "Professional installation required",
      "500m coverage diameter",
      "6 parameter monitoring",
    ],
    limitations: [
      "High cost ($30K-$100K+)",
      "Heavy (440+ lbs)",
      "Requires crane/boat deployment",
      "Vendor lock-in",
      "$5K-$15K annual service contracts",
    ],
  },
  proSondes: {
    name: "Professional Sondes (YSI, Hach, In-Situ)",
    priceRange: "$6,000 - $12,000+",
    minPrice: 6000,
    maxPrice: 12000,
    weight: "35 lbs (buoy) or handheld",
    deployment: "1 person possible",
    sensors: "4-7 parameters",
    algaeControl: false,
    coverage: "Point monitoring only",
    connectivity: "Cellular or Bluetooth to phone",
    annualCosts: "$500 - $2,000 (calibration, sensors)",
    targetMarket: "Research, consulting, compliance",
    features: [
      "Lab-grade accuracy",
      "Multiple parameters (4-7)",
      "Established brands",
      "1-person deployment",
    ],
    limitations: [
      "NO algae control",
      "Monitoring only",
      "Expensive consumables",
      "$500-$2K annual calibration/sensors",
      "No integrated algae treatment",
    ],
  },
  bluesignal: {
    name: "BlueSignal WQM-1",
    priceRange: "$999",
    minPrice: 999,
    maxPrice: 999,
    weight: "< 1 lb (HAT only)",
    deployment: "1 person, plug-and-play",
    sensors: "6 parameters",
    algaeControl: false,
    coverage: "Point monitoring + LoRaWAN 15 km",
    connectivity: "LoRaWAN (Semtech SX1262, 15 km LOS)",
    annualCosts: "~$120 ($9.99/mo cloud monitoring)",
    targetMarket: "Farms, aquaculture, golf courses, small lakes, residential",
    features: [
      "6-channel monitoring (pH, TDS, Turbidity, ORP, Temp, GPS)",
      "LoRaWAN 15 km range",
      "Offline SQLite storage with auto-sync",
      "Relay output for automation",
      "1-person plug-and-play setup",
      "$9.99/mo cloud monitoring",
    ],
    limitations: [],
    advantages: [
      "Lowest entry cost ($999)",
      "6 parameters at consumer price point",
      "LoRaWAN long-range connectivity",
      "Open platform (Raspberry Pi based)",
      "Lowest total cost of ownership",
    ],
  },
};

// 5-Year TCO Comparison
export const TCO_COMPARISON = {
  enterprise: { upfront: 50000, annual: 10000, fiveYear: 100000 },
  proMonitoring: { upfront: 8000, annual: 1500, fiveYear: 15500 },
  bluesignalWQM1: { upfront: 999, annual: 120, fiveYear: 1599 },
};

export default { COMPETITORS, TCO_COMPARISON };
