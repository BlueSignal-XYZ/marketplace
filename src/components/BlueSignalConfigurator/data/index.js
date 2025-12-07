// Data Module Index - Re-exports all data

export { PRODUCTS, default as products } from './products';
export { COMPETITORS, TCO_COMPARISON } from './competitors';
export { GPIO_PINOUT, GPIO_TYPE_COLORS } from './gpio';
export { CALIBRATION } from './calibration';
export {
  INSTALLATION,
  TEST_POINTS,
  PRE_DEPLOYMENT_CHECKLISTS,
  COMMISSIONING_CHECKLISTS,
  REQUIRED_TOOLS,
  DEPLOYMENT_STEPS
} from './installation';
export { MAINTENANCE, LED_CODES, LED_COLORS } from './maintenance';
export { WIRE_COLORS, CONNECTORS, FUSES } from './wiring';

// New enhanced data modules
export { FULL_SPECS } from './fullSpecs';
export { ENHANCED_BOM, calculateBOMTotals } from './enhancedBom';
export { TROUBLESHOOTING, LED_STATUS_CODES, LED_COLORS_HEX } from './troubleshooting';

// Enclosure and wiring data
export { ENCLOSURE_COMPONENTS, CATEGORY_COLORS } from './enclosure';
export { WIRING_DIAGRAMS, WIRE_LEGEND } from './enhancedWiring';
