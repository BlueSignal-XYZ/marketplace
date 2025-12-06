// Installation Specifications and Test Points

export const INSTALLATION = {
  shore: {
    mountingHoles: "Standard NEMA 4X pattern",
    torqueSpecs: { M6: "8-10 Nm", M4: "2-3 Nm" },
    cableGlands: "Hand-tight + 1/4 turn",
    groundLug: "Bottom left corner, 10-12 AWG ground wire",
    orientation: "Vertical, cable glands at bottom",
    clearance: "12\" minimum on all sides for airflow",
  },
  buoy: {
    sensorDepth: "6-12\" below surface",
    transducerAngle: "15° downward into water",
    transducerDepth: "1-2\" below surface",
    mooringScope: "3:1 minimum (line length : water depth)",
    anchorSizing: {
      standard: "25-50 lbs (soft bottom)",
      xl: "100-150 lbs",
    },
    waterDepth: "Minimum 4ft, maximum limited by mooring line",
  },
  tools: [
    "Phillips screwdriver (PH2)",
    "Wire strippers (10-24 AWG)",
    "Multimeter",
    "Cable crimping tool",
    "Torque wrench (for anchor)",
    "Kayak or small boat (buoy deployment)",
  ],
};

// Voltage Test Points for Troubleshooting
export const TEST_POINTS = [
  { id: "TP1", location: "Battery terminals", expected: { "24V": "24.0-28.4V", "12V": "12.0-14.2V" }, notes: "Healthy LiFePO4 range" },
  { id: "TP2", location: "MPPT battery output", expected: "Same as TP1", notes: "Should match battery" },
  { id: "TP3", location: "LVD output", expected: "0V (tripped) or battery voltage", notes: "Check LVD status LED" },
  { id: "TP4", location: "12V rail (buck output)", expected: "11.8-12.2V", notes: "Adjust pot if needed" },
  { id: "TP5", location: "5V rail", expected: "4.95-5.10V", notes: "Critical for Pi stability" },
  { id: "TP6", location: "Pi GPIO header Pin 2", expected: "4.9-5.1V", notes: "Power reaching Pi" },
  { id: "TP7", location: "ADS1115 VDD", expected: "3.25-3.35V", notes: "From Pi 3.3V rail" },
  { id: "TP8", location: "Solar panel OC", expected: "28-42V (24V panel)", notes: "Disconnect from MPPT first" },
  { id: "TP9", location: "Inverter AC output", expected: "118-122V AC", notes: "Use AC voltmeter" },
];

export default { INSTALLATION, TEST_POINTS };
