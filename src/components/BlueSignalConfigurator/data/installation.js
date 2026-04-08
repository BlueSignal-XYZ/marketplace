// Installation Specifications, Checklists, and Test Points

export const INSTALLATION = {
  shore: {
    mountingHoles: 'Standard NEMA 4X pattern',
    torqueSpecs: { M6: '8-10 Nm', M4: '2-3 Nm' },
    cableGlands: 'Hand-tight + 1/4 turn',
    groundLug: 'Bottom left corner, 10-12 AWG ground wire',
    orientation: 'Vertical, cable glands at bottom',
    clearance: '12" minimum on all sides for airflow',
  },
  buoy: {
    sensorDepth: '6-12" below surface',
    transducerAngle: '15° downward into water',
    transducerDepth: '1-2" below surface',
    mooringScope: '3:1 minimum (line length : water depth)',
    anchorSizing: {
      standard: '25-50 lbs (soft bottom)',
      xl: '100-150 lbs',
    },
    waterDepth: 'Minimum 4ft, maximum limited by mooring line',
  },
  tools: [
    'Phillips screwdriver (PH2)',
    'Wire strippers (10-24 AWG)',
    'Multimeter',
    'Cable crimping tool',
    'Torque wrench (for anchor)',
    'Kayak or small boat (buoy deployment)',
  ],
};

// Voltage Test Points for Troubleshooting
export const TEST_POINTS = [
  {
    id: 'TP1',
    location: 'Battery terminals',
    expected: { '24V': '24.0-28.4V', '12V': '12.0-14.2V' },
    notes: 'Healthy LiFePO4 range',
  },
  {
    id: 'TP2',
    location: 'MPPT battery output',
    expected: 'Same as TP1',
    notes: 'Should match battery',
  },
  {
    id: 'TP3',
    location: 'LVD output',
    expected: '0V (tripped) or battery voltage',
    notes: 'Check LVD status LED',
  },
  {
    id: 'TP4',
    location: '12V rail (buck output)',
    expected: '11.8-12.2V',
    notes: 'Adjust pot if needed',
  },
  { id: 'TP5', location: '5V rail', expected: '4.95-5.10V', notes: 'Critical for Pi stability' },
  { id: 'TP6', location: 'Pi GPIO header Pin 2', expected: '4.9-5.1V', notes: 'Power reaching Pi' },
  { id: 'TP7', location: 'ADS1115 VDD', expected: '3.25-3.35V', notes: 'From Pi 3.3V rail' },
  {
    id: 'TP8',
    location: 'Solar panel OC',
    expected: '28-42V (24V panel)',
    notes: 'Disconnect from MPPT first',
  },
  { id: 'TP9', location: 'Inverter AC output', expected: '118-122V AC', notes: 'Use AC voltmeter' },
];

// Pre-Deployment Checklists
export const PRE_DEPLOYMENT_CHECKLISTS = {
  shore: [
    {
      id: 'site-power',
      text: 'Verify power source availability (AC outlet or solar mounting location)',
      category: 'Site',
    },
    {
      id: 'site-signal',
      text: 'Confirm cellular signal strength (-100 dBm or better)',
      category: 'Site',
    },
    {
      id: 'site-water',
      text: 'Identify water access point within 10ft of enclosure',
      category: 'Site',
    },
    {
      id: 'site-gps',
      text: 'Check for clear GPS sky view (no obstructions above 15°)',
      category: 'Site',
    },
    {
      id: 'site-mount',
      text: 'Verify mounting surface can support weight (15-35 lbs)',
      category: 'Site',
    },
    {
      id: 'site-access',
      text: 'Confirm site access for monthly maintenance visits',
      category: 'Site',
    },
    {
      id: 'sim-activate',
      text: 'Activate and test SIM card via Hologram dashboard',
      category: 'Connectivity',
    },
    {
      id: 'sim-data',
      text: 'Verify data plan is active (minimum 100MB/month)',
      category: 'Connectivity',
    },
    {
      id: 'battery-charge',
      text: 'Charge battery to 100% before deployment (solar units)',
      category: 'Power',
    },
    {
      id: 'sensors-cal',
      text: 'Calibrate pH sensor with fresh buffer solutions',
      category: 'Sensors',
    },
    {
      id: 'sensors-test',
      text: 'Verify all sensors reading in expected ranges',
      category: 'Sensors',
    },
    { id: 'firmware-update', text: 'Update to latest firmware version', category: 'Software' },
  ],
  buoy: [
    {
      id: 'site-depth',
      text: 'Verify water depth (minimum 4ft for standard, 6ft for XL)',
      category: 'Site',
    },
    {
      id: 'site-obstructions',
      text: 'Check for underwater obstructions (survey with pole or sonar)',
      category: 'Site',
    },
    { id: 'site-signal', text: 'Confirm cellular signal from shore location', category: 'Site' },
    {
      id: 'site-permits',
      text: 'Review local permits/regulations for floating equipment',
      category: 'Site',
    },
    {
      id: 'weather-check',
      text: 'Check weather forecast (wind <15 mph, waves <1ft for deployment)',
      category: 'Site',
    },
    {
      id: 'sim-activate',
      text: 'Activate and test SIM card via Hologram dashboard',
      category: 'Connectivity',
    },
    { id: 'battery-charge', text: 'Charge battery to 100%', category: 'Power' },
    {
      id: 'sensors-cal-ph',
      text: 'Calibrate pH sensor (2-point: pH 4.0 and 7.0)',
      category: 'Sensors',
    },
    {
      id: 'sensors-cal-do',
      text: 'Calibrate DO sensor (air saturation method)',
      category: 'Sensors',
    },
    {
      id: 'sensors-test',
      text: 'Verify all sensors reading in expected ranges',
      category: 'Sensors',
    },
    {
      id: 'hull-antifoul',
      text: 'Apply antifouling paint if operating in warm water',
      category: 'Hull',
    },
    {
      id: 'mooring-prep',
      text: 'Prepare mooring line (3x water depth + 10ft minimum)',
      category: 'Mooring',
    },
    { id: 'anchor-prep', text: 'Prepare anchor with chain and swivel', category: 'Mooring' },
    { id: 'firmware-update', text: 'Update to latest firmware version', category: 'Software' },
  ],
};

// Commissioning Checklists
export const COMMISSIONING_CHECKLISTS = {
  shore: [
    { id: 'mount-secure', text: 'All mounting hardware torqued and secure', category: 'Physical' },
    {
      id: 'glands-sealed',
      text: 'Cable glands sealed and tight (hand-tight + 1/4 turn)',
      category: 'Physical',
    },
    { id: 'power-led', text: 'Power LED illuminated', category: 'Power' },
    {
      id: 'status-led',
      text: 'Status LED showing "online" pattern (3 blinks/2 sec)',
      category: 'Status',
    },
    {
      id: 'cellular-connected',
      text: 'Cellular connection confirmed in dashboard',
      category: 'Connectivity',
    },
    {
      id: 'gps-accurate',
      text: 'GPS coordinates within 50m of actual location',
      category: 'Connectivity',
    },
    {
      id: 'sensors-reading',
      text: 'All sensor readings displaying in dashboard',
      category: 'Sensors',
    },
    {
      id: 'ultrasonic-test',
      text: 'Ultrasonic test cycle completed successfully',
      category: 'Ultrasonic',
    },
    { id: 'fan-test', text: 'Fan test completed (if equipped)', category: 'Thermal' },
    {
      id: 'photo-doc',
      text: 'Photo documentation taken (enclosure, sensors, site)',
      category: 'Documentation',
    },
    {
      id: 'schedule-set',
      text: 'Treatment schedule configured in dashboard',
      category: 'Software',
    },
    { id: 'alerts-set', text: 'Alert thresholds configured for sensors', category: 'Software' },
  ],
  buoy: [
    {
      id: 'float-level',
      text: 'Buoy floating level (no list to either side)',
      category: 'Physical',
    },
    { id: 'sensor-submerged', text: 'Sensor cage submerged minimum 6"', category: 'Physical' },
    { id: 'solar-clean', text: 'Solar panel clean and unobstructed', category: 'Power' },
    { id: 'status-led', text: 'Status LED showing "online" pattern', category: 'Status' },
    {
      id: 'gps-accurate',
      text: 'GPS coordinates match target location (±50ft)',
      category: 'Connectivity',
    },
    {
      id: 'cellular-signal',
      text: 'Cellular signal adequate (-100 dBm or better)',
      category: 'Connectivity',
    },
    { id: 'sensors-reading', text: 'All sensors reporting data in dashboard', category: 'Sensors' },
    {
      id: 'ultrasonic-test',
      text: 'Ultrasonic test completed (listen for hum)',
      category: 'Ultrasonic',
    },
    {
      id: 'nav-light',
      text: 'Navigation light functional (if equipped) - test at dusk',
      category: 'Safety',
    },
    { id: 'mooring-scope', text: 'Mooring scope adequate (3:1 minimum)', category: 'Mooring' },
    {
      id: 'anchor-holding',
      text: 'Anchor holding (no drift over 30 min observation)',
      category: 'Mooring',
    },
    {
      id: 'photo-doc',
      text: 'Deployment photos taken (GPS, site, buoy)',
      category: 'Documentation',
    },
    {
      id: 'schedule-set',
      text: 'Treatment schedule configured in dashboard',
      category: 'Software',
    },
    { id: 'alerts-set', text: 'Alert thresholds configured for sensors', category: 'Software' },
    { id: 'drift-alert', text: 'GPS drift alert configured (50m radius)', category: 'Software' },
  ],
};

// Required Tools by Deployment Type
export const REQUIRED_TOOLS = {
  shore: [
    { name: 'Cordless drill (18V)', purpose: 'Mounting holes', essential: true },
    {
      name: 'Drill bits (3/16" for masonry/wood)',
      purpose: 'Mounting surface prep',
      essential: true,
    },
    {
      name: 'Screwdriver set (Phillips #2, flathead 1/4")',
      purpose: 'Terminal connections',
      essential: true,
    },
    { name: 'Adjustable wrench (8")', purpose: 'Cable gland tightening', essential: true },
    { name: 'Wire strippers (10-22 AWG)', purpose: 'Wire termination', essential: true },
    { name: 'Multimeter', purpose: 'Voltage verification', essential: true },
    { name: 'Laptop with USB', purpose: 'Initial configuration', essential: true },
    { name: 'Zip ties (8" and 12")', purpose: 'Cable management', essential: false },
    { name: 'Marine silicone sealant', purpose: 'Additional weatherproofing', essential: false },
    { name: 'Tape measure (25ft)', purpose: 'Sensor cable routing', essential: false },
    { name: 'Level (9" torpedo)', purpose: 'Mounting alignment', essential: false },
    { name: 'Safety glasses + work gloves', purpose: 'Personal protection', essential: true },
  ],
  buoy: [
    { name: 'Boat or kayak (stable platform)', purpose: 'Water access', essential: true },
    { name: 'PFD/life jacket', purpose: 'Safety - REQUIRED', essential: true },
    { name: 'Mooring line (3/8" nylon, 2x depth + 10ft)', purpose: 'Anchoring', essential: true },
    { name: 'Anchor (size per product spec)', purpose: 'Anchoring', essential: true },
    { name: 'Shackles (stainless 5/16", qty 2)', purpose: 'Mooring connections', essential: true },
    { name: 'Swivel (stainless, 200lb rated)', purpose: 'Prevent line twist', essential: true },
    {
      name: 'Multimeter (waterproof preferred)',
      purpose: 'Electrical verification',
      essential: true,
    },
    { name: 'Laptop in dry bag', purpose: 'Configuration', essential: true },
    {
      name: 'Calibration solutions (pH + DO)',
      purpose: 'Final calibration check',
      essential: true,
    },
    { name: 'Distilled water (1 gallon)', purpose: 'Sensor rinsing', essential: true },
    { name: 'Clean lint-free rags', purpose: 'Cleaning', essential: false },
    { name: 'Sunscreen/hat', purpose: 'Sun protection', essential: false },
    { name: 'Radio or phone', purpose: 'Emergency communication', essential: true },
    { name: 'Anchor retrieval hook', purpose: 'Repositioning', essential: false },
  ],
};

// Deployment Steps (step-by-step guide)
export const DEPLOYMENT_STEPS = {
  shore: [
    {
      step: 1,
      title: 'Site Preparation',
      description:
        'Mark mounting hole locations using enclosure as template. Verify power availability within cable reach.',
    },
    {
      step: 2,
      title: 'Mount Enclosure',
      description:
        'Drill mounting holes and secure enclosure. Verify level and orientation (cables exit bottom).',
    },
    {
      step: 3,
      title: 'Route Cables',
      description:
        'Route sensor cables to water source. Install cable glands and ensure proper strain relief.',
    },
    {
      step: 4,
      title: 'Connect Power',
      description:
        'AC: Connect to dedicated circuit. Solar: Mount panel with clear southern exposure.',
    },
    {
      step: 5,
      title: 'Deploy Sensors',
      description: 'Position sensors in water. pH/TDS probes should be 6-12" below surface.',
    },
    {
      step: 6,
      title: 'Power On',
      description: 'Apply power and verify LED boot sequence. Wait for 3-blink pattern.',
    },
    {
      step: 7,
      title: 'Configure',
      description: 'Access dashboard, verify sensor readings, configure treatment schedule.',
    },
    {
      step: 8,
      title: 'Test',
      description: 'Run ultrasonic test cycle. Verify all functions operational.',
    },
    {
      step: 9,
      title: 'Document',
      description: 'Take photos, record GPS coordinates, note any site-specific considerations.',
    },
  ],
  buoy: [
    {
      step: 1,
      title: 'Shore Preparation',
      description:
        'Final sensor calibration, battery check, firmware update. Attach mooring hardware.',
    },
    {
      step: 2,
      title: 'Launch Preparation',
      description: 'Load buoy onto boat/kayak. Secure anchor and line. Check weather conditions.',
    },
    {
      step: 3,
      title: 'Navigate to Site',
      description: 'Proceed to deployment location. Verify GPS matches planned coordinates.',
    },
    {
      step: 4,
      title: 'Deploy Anchor',
      description: 'Lower anchor to bottom. Pay out line to achieve 3:1 scope minimum.',
    },
    {
      step: 5,
      title: 'Position Buoy',
      description: 'Lower buoy into water. Verify level float and sensor cage submersion.',
    },
    {
      step: 6,
      title: 'Connect Mooring',
      description: 'Attach mooring line to buoy bridle. Ensure swivel is installed.',
    },
    {
      step: 7,
      title: 'Verify Position',
      description: 'Wait 30 minutes and verify no drift. Re-anchor if necessary.',
    },
    {
      step: 8,
      title: 'Configure',
      description: 'Access dashboard via cellular. Verify all sensors reading. Set schedules.',
    },
    {
      step: 9,
      title: 'Document',
      description: 'Record final GPS position. Take photos. Set up drift alerts.',
    },
  ],
};

export default {
  INSTALLATION,
  TEST_POINTS,
  PRE_DEPLOYMENT_CHECKLISTS,
  COMMISSIONING_CHECKLISTS,
  REQUIRED_TOOLS,
  DEPLOYMENT_STEPS,
};
