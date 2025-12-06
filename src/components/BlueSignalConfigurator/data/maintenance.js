// Maintenance Schedules and LED Status Codes

export const MAINTENANCE = [
  { component: "pH probe", interval: "30 days", action: "2-point calibration (pH 4.0 & 7.0)", cost: null },
  { component: "pH probe", interval: "12-18 months", action: "Replace probe", cost: "$28.79" },
  { component: "DO membrane", interval: "14 days", action: "Atmospheric calibration", cost: null },
  { component: "DO membrane", interval: "12 months", action: "Replace cap + electrolyte", cost: "$25" },
  { component: "TDS sensor", interval: "90 days", action: "Single-point calibration (1000 ppm)", cost: null },
  { component: "Turbidity sensor", interval: "90 days", action: "Clean optical window, verify zero", cost: null },
  { component: "Solar panel", interval: "30 days", action: "Clean with soft cloth + water", cost: null },
  { component: "Buoy hull", interval: "30 days", action: "Scrub biofouling, inspect mooring", cost: null },
  { component: "Battery health", interval: "30 days", action: "Check via dashboard (no physical inspection)", cost: null },
  { component: "Mooring hardware", interval: "90 days", action: "Inspect for corrosion, check anchor holding", cost: null },
  { component: "Firmware", interval: "As released", action: "OTA update via dashboard", cost: null },
];

// LED Status Codes for Troubleshooting
export const LED_CODES = [
  { pattern: "1 blink → pause → 2 blinks", color: "Green", duration: "30-60 seconds", meaning: "Boot sequence - initializing cellular", action: null },
  { pattern: "Slow pulse 1Hz", color: "Green", duration: "Continuous", meaning: "Normal operation, cloud connected", action: null },
  { pattern: "Fast blink 2Hz", color: "Green", duration: "Up to 3 minutes", meaning: "Attempting cellular registration", action: null },
  { pattern: "Solid", color: "Amber", duration: "Continuous", meaning: "No cellular connection - logging locally", action: "Check antenna, verify coverage" },
  { pattern: "1 blink every 5 sec", color: "Red", duration: "Continuous", meaning: "Sensor communication error", action: "Check dashboard for specific sensor" },
  { pattern: "Rapid blink 4Hz", color: "Red", duration: "Continuous", meaning: "Critical system error", action: "Check dashboard, may need power cycle" },
  { pattern: "Slow blink 0.5Hz", color: "Amber", duration: "Continuous", meaning: "Battery <20%, not charging adequately", action: "Check solar panel for shading/soiling" },
  { pattern: "Solid", color: "Blue", duration: "15 minutes per cycle", meaning: "Ultrasonic treatment running", action: null },
  { pattern: "Alternating", color: "Green/Amber", duration: "While charging", meaning: "Battery charging (bulk/absorption)", action: null },
];

// LED Color mapping for UI
export const LED_COLORS = {
  Green: "#22c55e",
  Red: "#ef4444",
  Amber: "#f59e0b",
  Blue: "#3b82f6",
  "Green/Amber": "#64748b",
};

export default { MAINTENANCE, LED_CODES, LED_COLORS };
