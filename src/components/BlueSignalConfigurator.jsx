// /src/components/BlueSignalConfigurator.jsx
// BlueSignal Product Configurator - Water Quality Hardware
import React, { useState } from "react";
import styled from "styled-components";

// ============================================================================
// PRODUCT DATA
// ============================================================================

const PRODUCTS = {
  "s-ac": {
    id: "s-ac",
    name: "S-AC",
    subtitle: "Shore AC-Powered",
    price: 599,
    tagline: "Entry-level algae control for sites with AC power",
    deployment: "Shore-mounted",
    power: { type: "AC", voltage: "120V AC", watts: null },
    ultrasonic: { enabled: true, watts: 100, frequency: "28kHz", units: 1 },
    sensors: 3,
    sensorList: ["Temperature", "pH", "Dissolved Oxygen"],
    battery: null,
    solar: null,
    autonomy: "N/A (AC powered)",
    weight: "8 lbs",
    floatCost: 0,
    features: [
      "100W ultrasonic algae control",
      "3 basic water quality sensors",
      "Pi Zero 2W controller",
      "LTE Cat-1 connectivity",
      "Real-time cloud dashboard",
    ],
    bom: [
      { item: "Pi Zero 2W", qty: 1, cost: 15, category: "Compute" },
      { item: "Waveshare SIM7670G Cat-1 HAT", qty: 1, cost: 45, category: "Connectivity" },
      { item: "ADS1115 16-bit ADC", qty: 1, cost: 12, category: "Sensing" },
      { item: "DS18B20 Temperature Probe", qty: 1, cost: 8, category: "Sensing" },
      { item: "Analog pH Sensor", qty: 1, cost: 35, category: "Sensing" },
      { item: "Analog DO Sensor", qty: 1, cost: 45, category: "Sensing" },
      { item: "BQLZR 100W 28kHz Ultrasonic Transducer", qty: 1, cost: 65, category: "Ultrasonic" },
      { item: "100W Ultrasonic Driver Board", qty: 1, cost: 35, category: "Ultrasonic" },
      { item: "Mean Well 24V/5A Power Supply", qty: 1, cost: 28, category: "Power" },
      { item: "5V 3A Buck Converter", qty: 1, cost: 6, category: "Power" },
      { item: "IP67 Enclosure (Medium)", qty: 1, cost: 45, category: "Housing" },
      { item: "Cable Glands, Wiring, Connectors", qty: 1, cost: 25, category: "Hardware" },
      { item: "SIM Card + 1yr Data Plan", qty: 1, cost: 60, category: "Service" },
    ],
    gpio: {
      i2c: ["ADS1115 ADC (0x48)"],
      oneWire: ["DS18B20 Temperature"],
      uart: ["SIM7670G HAT"],
      gpio: ["Ultrasonic Enable (GPIO17)", "Status LED (GPIO27)"],
    },
    powerTable: [
      { component: "Pi Zero 2W", voltage: 5, current: 0.3, duty: 100, avgWatts: 1.5 },
      { component: "SIM7670G HAT", voltage: 5, current: 0.4, duty: 30, avgWatts: 0.6 },
      { component: "Sensors (ADC)", voltage: 5, current: 0.05, duty: 100, avgWatts: 0.25 },
      { component: "Ultrasonic System", voltage: 24, current: 4.2, duty: 50, avgWatts: 50 },
    ],
  },
  "s-sol": {
    id: "s-sol",
    name: "S-SOL",
    subtitle: "Shore Solar-Powered",
    price: 1499,
    tagline: "Off-grid algae control with 4.6-day autonomy",
    deployment: "Shore-mounted",
    power: { type: "Solar + Battery", voltage: "24V DC", watts: 200 },
    ultrasonic: { enabled: true, watts: 100, frequency: "28kHz", units: 1 },
    sensors: 4,
    sensorList: ["Temperature", "pH", "Dissolved Oxygen", "Turbidity"],
    battery: { type: "LiFePO4", voltage: 24, capacity: 50, wh: 1200 },
    solar: { watts: 200, panels: 1 },
    autonomy: "4.6 days",
    weight: "45 lbs",
    floatCost: 0,
    features: [
      "200W solar array",
      "24V 50Ah LiFePO4 battery (1.2kWh)",
      "100W ultrasonic algae control",
      "4 water quality sensors",
      "Victron MPPT charge controller",
      "4.6 days autonomy without sun",
    ],
    bom: [
      { item: "Pi Zero 2W", qty: 1, cost: 15, category: "Compute" },
      { item: "Waveshare SIM7670G Cat-1 HAT", qty: 1, cost: 45, category: "Connectivity" },
      { item: "ADS1115 16-bit ADC", qty: 1, cost: 12, category: "Sensing" },
      { item: "DS18B20 Temperature Probe", qty: 1, cost: 8, category: "Sensing" },
      { item: "Analog pH Sensor", qty: 1, cost: 35, category: "Sensing" },
      { item: "Analog DO Sensor", qty: 1, cost: 45, category: "Sensing" },
      { item: "Analog Turbidity Sensor", qty: 1, cost: 25, category: "Sensing" },
      { item: "BQLZR 100W 28kHz Ultrasonic Transducer", qty: 1, cost: 65, category: "Ultrasonic" },
      { item: "100W Ultrasonic Driver Board", qty: 1, cost: 35, category: "Ultrasonic" },
      { item: "200W Monocrystalline Solar Panel", qty: 1, cost: 120, category: "Power" },
      { item: "Victron SmartSolar 100/20 MPPT", qty: 1, cost: 145, category: "Power" },
      { item: "24V 50Ah LiFePO4 Battery", qty: 1, cost: 280, category: "Power" },
      { item: "Victron Smart BatteryProtect 65A", qty: 1, cost: 55, category: "Power" },
      { item: "5V 5A Buck Converter", qty: 1, cost: 8, category: "Power" },
      { item: "IP67 Enclosure (Large)", qty: 1, cost: 75, category: "Housing" },
      { item: "Solar Panel Mounting Hardware", qty: 1, cost: 45, category: "Hardware" },
      { item: "Cable Glands, Wiring, Connectors", qty: 1, cost: 35, category: "Hardware" },
      { item: "SIM Card + 1yr Data Plan", qty: 1, cost: 60, category: "Service" },
    ],
    gpio: {
      i2c: ["ADS1115 ADC (0x48)", "Victron VE.Direct (via adapter)"],
      oneWire: ["DS18B20 Temperature"],
      uart: ["SIM7670G HAT"],
      gpio: ["Ultrasonic Enable (GPIO17)", "Status LED (GPIO27)", "Battery Monitor (GPIO22)"],
    },
    powerTable: [
      { component: "Pi Zero 2W", voltage: 5, current: 0.3, duty: 100, avgWatts: 1.5 },
      { component: "SIM7670G HAT", voltage: 5, current: 0.4, duty: 30, avgWatts: 0.6 },
      { component: "Sensors (ADC)", voltage: 5, current: 0.06, duty: 100, avgWatts: 0.3 },
      { component: "Victron MPPT", voltage: 24, current: 0.02, duty: 100, avgWatts: 0.5 },
      { component: "Ultrasonic System", voltage: 24, current: 4.2, duty: 40, avgWatts: 40 },
    ],
  },
  "s-mon": {
    id: "s-mon",
    name: "S-MON",
    subtitle: "Shore Monitoring Only",
    price: 849,
    tagline: "Solar-powered monitoring without ultrasonic",
    deployment: "Shore-mounted",
    power: { type: "Solar + Battery", voltage: "12V DC", watts: 100 },
    ultrasonic: { enabled: false },
    sensors: 4,
    sensorList: ["Temperature", "pH", "Dissolved Oxygen", "Turbidity"],
    battery: { type: "LiFePO4", voltage: 12, capacity: 25, wh: 300 },
    solar: { watts: 100, panels: 1 },
    autonomy: "8+ days",
    weight: "22 lbs",
    floatCost: 0,
    features: [
      "100W solar panel",
      "12V 25Ah LiFePO4 battery (300Wh)",
      "NO ultrasonic (monitoring only)",
      "4 water quality sensors",
      "8+ days autonomy",
      "Lowest power consumption",
    ],
    bom: [
      { item: "Pi Zero 2W", qty: 1, cost: 15, category: "Compute" },
      { item: "Waveshare SIM7670G Cat-1 HAT", qty: 1, cost: 45, category: "Connectivity" },
      { item: "ADS1115 16-bit ADC", qty: 1, cost: 12, category: "Sensing" },
      { item: "DS18B20 Temperature Probe", qty: 1, cost: 8, category: "Sensing" },
      { item: "Analog pH Sensor", qty: 1, cost: 35, category: "Sensing" },
      { item: "Analog DO Sensor", qty: 1, cost: 45, category: "Sensing" },
      { item: "Analog Turbidity Sensor", qty: 1, cost: 25, category: "Sensing" },
      { item: "100W Monocrystalline Solar Panel", qty: 1, cost: 65, category: "Power" },
      { item: "Victron SmartSolar 75/15 MPPT", qty: 1, cost: 95, category: "Power" },
      { item: "12V 25Ah LiFePO4 Battery", qty: 1, cost: 140, category: "Power" },
      { item: "Victron Smart BatteryProtect 12/24V 65A", qty: 1, cost: 55, category: "Power" },
      { item: "5V 3A Buck Converter", qty: 1, cost: 6, category: "Power" },
      { item: "IP67 Enclosure (Medium)", qty: 1, cost: 55, category: "Housing" },
      { item: "Solar Panel Mounting Hardware", qty: 1, cost: 35, category: "Hardware" },
      { item: "Cable Glands, Wiring, Connectors", qty: 1, cost: 25, category: "Hardware" },
      { item: "SIM Card + 1yr Data Plan", qty: 1, cost: 60, category: "Service" },
    ],
    gpio: {
      i2c: ["ADS1115 ADC (0x48)"],
      oneWire: ["DS18B20 Temperature"],
      uart: ["SIM7670G HAT"],
      gpio: ["Status LED (GPIO27)", "Battery Monitor (GPIO22)"],
    },
    powerTable: [
      { component: "Pi Zero 2W", voltage: 5, current: 0.3, duty: 100, avgWatts: 1.5 },
      { component: "SIM7670G HAT", voltage: 5, current: 0.4, duty: 20, avgWatts: 0.4 },
      { component: "Sensors (ADC)", voltage: 5, current: 0.06, duty: 100, avgWatts: 0.3 },
      { component: "Victron MPPT", voltage: 12, current: 0.02, duty: 100, avgWatts: 0.24 },
    ],
  },
  "smart-buoy": {
    id: "smart-buoy",
    name: "Smart Buoy",
    subtitle: "Floating Platform",
    price: 2499,
    tagline: "Floating algae control for ponds and lakes",
    deployment: "Floating",
    power: { type: "Solar + Battery", voltage: "24V DC", watts: 50 },
    ultrasonic: { enabled: true, watts: 100, frequency: "28kHz", units: 1 },
    sensors: 5,
    sensorList: ["Temperature", "pH", "Dissolved Oxygen", "Turbidity", "Conductivity"],
    battery: { type: "LiFePO4", voltage: 24, capacity: 20, wh: 480 },
    solar: { watts: 50, panels: 1 },
    autonomy: "2.2 days",
    weight: "22 lbs",
    floatCost: 628,
    floatDetails: "Marine-grade float platform",
    features: [
      "Floating buoy deployment",
      "50W integrated solar panel",
      "24V 20Ah LiFePO4 battery (480Wh)",
      "100W ultrasonic algae control",
      "5 water quality sensors",
      "Marine-grade float ($628)",
      "GPS position tracking",
    ],
    bom: [
      { item: "Pi Zero 2W", qty: 1, cost: 15, category: "Compute" },
      { item: "Waveshare SIM7670G Cat-1 HAT", qty: 1, cost: 45, category: "Connectivity" },
      { item: "ADS1115 16-bit ADC", qty: 2, cost: 24, category: "Sensing" },
      { item: "DS18B20 Temperature Probe", qty: 1, cost: 8, category: "Sensing" },
      { item: "Analog pH Sensor", qty: 1, cost: 35, category: "Sensing" },
      { item: "Analog DO Sensor", qty: 1, cost: 45, category: "Sensing" },
      { item: "Analog Turbidity Sensor", qty: 1, cost: 25, category: "Sensing" },
      { item: "Analog Conductivity Sensor", qty: 1, cost: 40, category: "Sensing" },
      { item: "BQLZR 100W 28kHz Ultrasonic Transducer", qty: 1, cost: 65, category: "Ultrasonic" },
      { item: "100W Ultrasonic Driver Board", qty: 1, cost: 35, category: "Ultrasonic" },
      { item: "50W Marine Solar Panel", qty: 1, cost: 85, category: "Power" },
      { item: "Victron SmartSolar 75/15 MPPT", qty: 1, cost: 95, category: "Power" },
      { item: "24V 20Ah LiFePO4 Battery", qty: 1, cost: 165, category: "Power" },
      { item: "Victron Smart BatteryProtect 65A", qty: 1, cost: 55, category: "Power" },
      { item: "5V 5A Buck Converter", qty: 1, cost: 8, category: "Power" },
      { item: "GPS Module (u-blox NEO-6M)", qty: 1, cost: 12, category: "Navigation" },
      { item: "Marine Float Platform", qty: 1, cost: 628, category: "Float" },
      { item: "IP68 Enclosure (Buoy)", qty: 1, cost: 95, category: "Housing" },
      { item: "Anchor, Chain, Swivel Kit", qty: 1, cost: 85, category: "Hardware" },
      { item: "Cable Glands, Wiring, Connectors", qty: 1, cost: 40, category: "Hardware" },
      { item: "SIM Card + 1yr Data Plan", qty: 1, cost: 60, category: "Service" },
    ],
    gpio: {
      i2c: ["ADS1115 ADC #1 (0x48)", "ADS1115 ADC #2 (0x49)"],
      oneWire: ["DS18B20 Temperature"],
      uart: ["SIM7670G HAT", "GPS NEO-6M"],
      gpio: ["Ultrasonic Enable (GPIO17)", "Status LED (GPIO27)", "Battery Monitor (GPIO22)"],
    },
    powerTable: [
      { component: "Pi Zero 2W", voltage: 5, current: 0.3, duty: 100, avgWatts: 1.5 },
      { component: "SIM7670G HAT", voltage: 5, current: 0.4, duty: 25, avgWatts: 0.5 },
      { component: "Sensors (2x ADC)", voltage: 5, current: 0.1, duty: 100, avgWatts: 0.5 },
      { component: "GPS Module", voltage: 3.3, current: 0.04, duty: 100, avgWatts: 0.13 },
      { component: "Victron MPPT", voltage: 24, current: 0.02, duty: 100, avgWatts: 0.5 },
      { component: "Ultrasonic System", voltage: 24, current: 4.2, duty: 20, avgWatts: 20 },
    ],
  },
  "smart-buoy-xl": {
    id: "smart-buoy-xl",
    name: "Smart Buoy XL",
    subtitle: "Research-Grade Platform",
    price: 19999,
    tagline: "Professional research platform with Atlas Scientific sensors",
    deployment: "Floating",
    power: { type: "Solar + Battery", voltage: "24V DC", watts: 300 },
    ultrasonic: { enabled: true, watts: 200, frequency: "28kHz", units: 2 },
    sensors: 8,
    sensorList: [
      "Atlas Temp (PT-1000)",
      "Atlas pH",
      "Atlas Dissolved Oxygen",
      "Atlas Conductivity/TDS",
      "Atlas ORP",
      "Atlas Turbidity",
      "Chlorophyll-a",
      "Blue-Green Algae (Phycocyanin)",
    ],
    battery: { type: "LiFePO4", voltage: 24, capacity: 100, wh: 2400 },
    solar: { watts: 300, panels: 2 },
    autonomy: "5+ days",
    weight: "265 lbs",
    floatCost: 3897,
    floatDetails: "3× research-grade floats ($1,299 each)",
    features: [
      "Research-grade platform",
      "300W solar array (2 panels)",
      "24V 100Ah LiFePO4 (2.4kWh)",
      "2× 100W ultrasonic transducers",
      "8 Atlas Scientific sensors",
      "Lab-grade accuracy",
      "3× research floats ($3,897)",
      "Modbus/SDI-12 expansion",
      "Edge computing capability",
    ],
    bom: [
      { item: "Raspberry Pi 4 (4GB)", qty: 1, cost: 55, category: "Compute" },
      { item: "Waveshare SIM7670G Cat-1 HAT", qty: 1, cost: 45, category: "Connectivity" },
      { item: "Atlas Scientific EZO pH Kit", qty: 1, cost: 185, category: "Sensing" },
      { item: "Atlas Scientific EZO DO Kit", qty: 1, cost: 245, category: "Sensing" },
      { item: "Atlas Scientific EZO EC Kit", qty: 1, cost: 215, category: "Sensing" },
      { item: "Atlas Scientific EZO ORP Kit", qty: 1, cost: 175, category: "Sensing" },
      { item: "Atlas Scientific EZO RTD Kit", qty: 1, cost: 125, category: "Sensing" },
      { item: "Turner C3 Turbidity Sensor", qty: 1, cost: 850, category: "Sensing" },
      { item: "Turner Chlorophyll-a Sensor", qty: 1, cost: 1200, category: "Sensing" },
      { item: "Turner Phycocyanin (BGA) Sensor", qty: 1, cost: 1400, category: "Sensing" },
      { item: "Whitebox Labs Tentacle T3 (8ch)", qty: 1, cost: 95, category: "Interface" },
      { item: "BQLZR 100W 28kHz Ultrasonic Transducer", qty: 2, cost: 130, category: "Ultrasonic" },
      { item: "100W Ultrasonic Driver Board", qty: 2, cost: 70, category: "Ultrasonic" },
      { item: "150W Monocrystalline Solar Panel", qty: 2, cost: 180, category: "Power" },
      { item: "Victron SmartSolar 100/30 MPPT", qty: 1, cost: 195, category: "Power" },
      { item: "24V 100Ah LiFePO4 Battery", qty: 1, cost: 650, category: "Power" },
      { item: "Victron Smart BatteryProtect 100A", qty: 1, cost: 75, category: "Power" },
      { item: "5V 10A Buck Converter", qty: 1, cost: 15, category: "Power" },
      { item: "GPS Module (u-blox NEO-M9N)", qty: 1, cost: 45, category: "Navigation" },
      { item: "Research Float Platform", qty: 3, cost: 3897, category: "Float" },
      { item: "IP68 Research Enclosure", qty: 1, cost: 350, category: "Housing" },
      { item: "Heavy Duty Anchor System", qty: 1, cost: 250, category: "Hardware" },
      { item: "Stainless Mounting Hardware", qty: 1, cost: 180, category: "Hardware" },
      { item: "Marine Cable Assemblies", qty: 1, cost: 120, category: "Hardware" },
      { item: "SIM Card + 1yr Data Plan (Priority)", qty: 1, cost: 120, category: "Service" },
    ],
    gpio: {
      i2c: [
        "Whitebox Tentacle T3 (0x66)",
        "Atlas EZO pH (0x63)",
        "Atlas EZO DO (0x61)",
        "Atlas EZO EC (0x64)",
        "Atlas EZO ORP (0x62)",
        "Atlas EZO RTD (0x66)",
      ],
      uart: ["SIM7670G HAT", "GPS NEO-M9N", "Turner Sensors (RS-232)"],
      gpio: [
        "Ultrasonic #1 Enable (GPIO17)",
        "Ultrasonic #2 Enable (GPIO18)",
        "Status LED (GPIO27)",
        "Battery Monitor (GPIO22)",
        "Alert Beacon (GPIO23)",
      ],
      sdi12: ["SDI-12 Bus (future expansion)"],
    },
    powerTable: [
      { component: "Raspberry Pi 4", voltage: 5, current: 0.85, duty: 100, avgWatts: 4.25 },
      { component: "SIM7670G HAT", voltage: 5, current: 0.4, duty: 30, avgWatts: 0.6 },
      { component: "Atlas Sensors (8ch)", voltage: 5, current: 0.4, duty: 100, avgWatts: 2.0 },
      { component: "Turner Optical Sensors", voltage: 12, current: 0.5, duty: 50, avgWatts: 3.0 },
      { component: "GPS Module", voltage: 3.3, current: 0.05, duty: 100, avgWatts: 0.17 },
      { component: "Victron MPPT", voltage: 24, current: 0.02, duty: 100, avgWatts: 0.5 },
      { component: "Ultrasonic System (2×)", voltage: 24, current: 8.4, duty: 30, avgWatts: 60 },
    ],
  },
};

// Benchmark competitors
const COMPETITORS = {
  enterprise: {
    name: "Enterprise Algae Control",
    priceRange: "$30,000 - $100,000",
    minPrice: 30000,
    maxPrice: 100000,
    features: ["Industrial ultrasonic systems", "Professional installation required", "Annual service contracts", "Limited monitoring"],
    limitations: ["No water quality sensors", "Proprietary systems", "High maintenance costs", "Long lead times"],
  },
  proSondes: {
    name: "Professional Multi-Parameter Sondes",
    priceRange: "$6,000 - $12,000",
    minPrice: 6000,
    maxPrice: 12000,
    features: ["Lab-grade accuracy", "Multiple parameters", "Established brands (YSI, Hach, In-Situ)"],
    limitations: ["NO algae control", "Monitoring only", "Expensive calibration", "No integrated connectivity"],
  },
};

// ============================================================================
// STYLED COMPONENTS
// ============================================================================

const ConfiguratorWrapper = styled.div`
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  background: linear-gradient(135deg, #0c1929 0%, #1a365d 100%);
  min-height: 100vh;
  padding: 24px;
  box-sizing: border-box;
  color: #e2e8f0;

  *, *::before, *::after {
    box-sizing: border-box;
  }
`;

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 32px;
`;

const Logo = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: #60a5fa;
  margin: 0 0 8px;
  letter-spacing: -0.02em;

  span {
    color: #38bdf8;
  }
`;

const Tagline = styled.p`
  font-size: 16px;
  color: #94a3b8;
  margin: 0;
`;

const NavTabs = styled.nav`
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-bottom: 32px;
`;

const NavTab = styled.button`
  padding: 12px 32px;
  font-size: 14px;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;

  background: ${({ active }) => (active ? "#3b82f6" : "rgba(255,255,255,0.1)")};
  color: ${({ active }) => (active ? "#ffffff" : "#94a3b8")};

  &:hover {
    background: ${({ active }) => (active ? "#3b82f6" : "rgba(255,255,255,0.15)")};
  }
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
  margin-bottom: 32px;
`;

const ProductCard = styled.div`
  background: ${({ selected }) =>
    selected ? "linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%)" : "rgba(255,255,255,0.05)"};
  border: 2px solid ${({ selected }) => (selected ? "#3b82f6" : "rgba(255,255,255,0.1)")};
  border-radius: 16px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: ${({ selected }) => (selected ? "#3b82f6" : "rgba(255,255,255,0.3)")};
    transform: translateY(-2px);
  }
`;

const ProductName = styled.h3`
  font-size: 20px;
  font-weight: 700;
  margin: 0 0 4px;
  color: #ffffff;
`;

const ProductSubtitle = styled.p`
  font-size: 12px;
  color: #94a3b8;
  margin: 0 0 12px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const ProductPrice = styled.div`
  font-size: 28px;
  font-weight: 700;
  color: #38bdf8;
  margin-bottom: 8px;
`;

const ProductTagline = styled.p`
  font-size: 13px;
  color: #cbd5e1;
  margin: 0 0 12px;
  line-height: 1.4;
`;

const ProductBadges = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

const Badge = styled.span`
  display: inline-block;
  padding: 4px 8px;
  font-size: 11px;
  font-weight: 600;
  border-radius: 4px;
  background: ${({ variant }) =>
    variant === "ultrasonic"
      ? "rgba(251, 146, 60, 0.2)"
      : variant === "solar"
      ? "rgba(74, 222, 128, 0.2)"
      : variant === "sensors"
      ? "rgba(96, 165, 250, 0.2)"
      : "rgba(255,255,255,0.1)"};
  color: ${({ variant }) =>
    variant === "ultrasonic"
      ? "#fb923c"
      : variant === "solar"
      ? "#4ade80"
      : variant === "sensors"
      ? "#60a5fa"
      : "#94a3b8"};
`;

const DetailPanel = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  overflow: hidden;
`;

const DetailTabs = styled.div`
  display: flex;
  flex-wrap: wrap;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(0, 0, 0, 0.2);
`;

const DetailTab = styled.button`
  padding: 14px 20px;
  font-size: 13px;
  font-weight: 600;
  border: none;
  background: ${({ active }) => (active ? "rgba(59, 130, 246, 0.2)" : "transparent")};
  color: ${({ active }) => (active ? "#60a5fa" : "#94a3b8")};
  cursor: pointer;
  border-bottom: 2px solid ${({ active }) => (active ? "#3b82f6" : "transparent")};
  transition: all 0.2s;

  &:hover {
    color: #ffffff;
    background: rgba(255, 255, 255, 0.05);
  }
`;

const DetailContent = styled.div`
  padding: 24px;
`;

const SectionTitle = styled.h4`
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 16px;
  color: #ffffff;
`;

const FeatureList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 8px;
`;

const FeatureItem = styled.li`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 14px;
  color: #cbd5e1;
  line-height: 1.5;

  &::before {
    content: "✓";
    color: #4ade80;
    font-weight: bold;
    flex-shrink: 0;
  }
`;

const SpecGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
`;

const SpecCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 16px;
`;

const SpecLabel = styled.div`
  font-size: 12px;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 4px;
`;

const SpecValue = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: #ffffff;
`;

const SvgContainer = styled.div`
  background: rgba(0, 0, 0, 0.3);
  border-radius: 12px;
  padding: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  overflow: auto;

  svg {
    max-width: 100%;
    height: auto;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
`;

const Th = styled.th`
  text-align: left;
  padding: 12px 16px;
  background: rgba(0, 0, 0, 0.3);
  color: #94a3b8;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 11px;
  letter-spacing: 0.05em;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);

  &:last-child {
    text-align: right;
  }
`;

const Td = styled.td`
  padding: 12px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  color: #e2e8f0;

  &:last-child {
    text-align: right;
    font-weight: 600;
  }
`;

const TotalRow = styled.tr`
  background: rgba(59, 130, 246, 0.1);

  td {
    font-weight: 700;
    color: #60a5fa;
    border-bottom: none;
  }
`;

const GpioSection = styled.div`
  margin-bottom: 20px;
`;

const GpioTitle = styled.h5`
  font-size: 14px;
  font-weight: 600;
  color: #60a5fa;
  margin: 0 0 8px;
`;

const GpioList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;

  li {
    font-size: 13px;
    color: #cbd5e1;
    padding: 6px 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    font-family: "SF Mono", Monaco, "Cascadia Code", monospace;

    &:last-child {
      border-bottom: none;
    }
  }
`;

const BenchmarkGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 24px;
`;

const BenchmarkCard = styled.div`
  background: ${({ highlight }) =>
    highlight ? "linear-gradient(135deg, #064e3b 0%, #065f46 100%)" : "rgba(255,255,255,0.05)"};
  border: 2px solid ${({ highlight }) => (highlight ? "#10b981" : "rgba(255,255,255,0.1)")};
  border-radius: 16px;
  padding: 24px;
`;

const BenchmarkName = styled.h4`
  font-size: 18px;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 8px;
`;

const BenchmarkPrice = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: ${({ highlight }) => (highlight ? "#4ade80" : "#fb923c")};
  margin-bottom: 16px;
`;

const BenchmarkSection = styled.div`
  margin-bottom: 12px;

  h5 {
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: #94a3b8;
    margin: 0 0 8px;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;

    li {
      font-size: 13px;
      color: #cbd5e1;
      padding: 4px 0;
      display: flex;
      align-items: center;
      gap: 8px;

      &::before {
        content: "${({ type }) => (type === "pro" ? "✓" : "✗")}";
        color: ${({ type }) => (type === "pro" ? "#4ade80" : "#f87171")};
      }
    }
  }
`;

const SavingsCallout = styled.div`
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.3);
  border-radius: 12px;
  padding: 20px;
  margin-top: 24px;
  text-align: center;

  h4 {
    font-size: 16px;
    color: #4ade80;
    margin: 0 0 8px;
  }

  p {
    font-size: 14px;
    color: #cbd5e1;
    margin: 0;
  }

  strong {
    color: #4ade80;
  }
`;

const MarginBadge = styled.span`
  display: inline-block;
  padding: 2px 6px;
  font-size: 10px;
  font-weight: 600;
  border-radius: 4px;
  background: ${({ good }) => (good ? "rgba(74, 222, 128, 0.2)" : "rgba(251, 146, 60, 0.2)")};
  color: ${({ good }) => (good ? "#4ade80" : "#fb923c")};
  margin-left: 8px;
`;

// ============================================================================
// SVG DIAGRAM COMPONENTS
// ============================================================================

const LayoutDiagram = ({ product }) => {
  const isFloating = product.deployment === "Floating";
  const hasUltrasonic = product.ultrasonic?.enabled;
  const hasSolar = product.solar !== null;
  const isXL = product.id === "smart-buoy-xl";

  return (
    <svg viewBox="0 0 600 450" style={{ width: "100%", maxWidth: 600 }}>
      <defs>
        <linearGradient id="waterGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#0369a1" stopOpacity="0.6" />
        </linearGradient>
        <linearGradient id="solarGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#1d4ed8" />
        </linearGradient>
        <linearGradient id="enclosureGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#64748b" />
          <stop offset="100%" stopColor="#475569" />
        </linearGradient>
      </defs>

      {/* Background */}
      <rect x="0" y="0" width="600" height="450" fill="#0f172a" />

      {isFloating ? (
        <>
          {/* Water */}
          <rect x="0" y="220" width="600" height="230" fill="url(#waterGrad)" />
          <path d="M0,220 Q75,210 150,220 T300,220 T450,220 T600,220 L600,230 Q525,240 450,230 T300,230 T150,230 T0,230 Z" fill="#38bdf8" opacity="0.2" />

          {/* Float Platform */}
          <ellipse cx="300" cy="220" rx={isXL ? 180 : 100} ry="25" fill="#f59e0b" opacity="0.8" />
          <ellipse cx="300" cy="215" rx={isXL ? 170 : 90} ry="20" fill="#fbbf24" />

          {/* Enclosure */}
          <rect x="250" y="140" width="100" height="70" rx="8" fill="url(#enclosureGrad)" />
          <text x="300" y="180" textAnchor="middle" fill="#e2e8f0" fontSize="10" fontWeight="600">ENCLOSURE</text>

          {/* Solar Panel */}
          {hasSolar && (
            <>
              <rect x="220" y="80" width="160" height="50" rx="4" fill="url(#solarGrad)" />
              <text x="300" y="110" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="600">
                {product.solar.watts}W SOLAR
              </text>
              {isXL && <rect x="390" y="80" width="80" height="50" rx="4" fill="url(#solarGrad)" />}
            </>
          )}

          {/* Ultrasonic Transducers */}
          {hasUltrasonic && (
            <>
              <rect x="270" y="250" width="60" height="30" rx="4" fill="#f97316" />
              <text x="300" y="270" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="600">ULTRASONIC</text>
              <line x1="300" y1="280" x2="300" y2="350" stroke="#f97316" strokeWidth="2" strokeDasharray="4" />
              <text x="300" y="370" textAnchor="middle" fill="#f97316" fontSize="10">28kHz waves</text>
              {isXL && (
                <>
                  <rect x="370" y="250" width="60" height="30" rx="4" fill="#f97316" />
                  <line x1="400" y1="280" x2="400" y2="350" stroke="#f97316" strokeWidth="2" strokeDasharray="4" />
                </>
              )}
            </>
          )}

          {/* Sensors */}
          <g transform="translate(180, 250)">
            <rect width="40" height="60" rx="4" fill="#22c55e" />
            <text x="20" y="35" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="600">SENSORS</text>
          </g>

          {/* Anchor */}
          <line x1="300" y1="240" x2="300" y2="420" stroke="#94a3b8" strokeWidth="2" />
          <polygon points="290,420 310,420 300,440" fill="#94a3b8" />
          <text x="300" y="445" textAnchor="middle" fill="#94a3b8" fontSize="10">ANCHOR</text>
        </>
      ) : (
        <>
          {/* Shore/Ground */}
          <rect x="0" y="280" width="300" height="170" fill="#78716c" opacity="0.3" />
          <rect x="300" y="320" width="300" height="130" fill="url(#waterGrad)" />
          <path d="M300,280 L300,320 Q350,340 300,360 L300,450" stroke="#78716c" strokeWidth="3" fill="none" />

          {/* Mounting Pole */}
          <rect x="140" y="100" width="20" height="180" fill="#94a3b8" />

          {/* Enclosure */}
          <rect x="100" y="120" width="100" height="70" rx="8" fill="url(#enclosureGrad)" />
          <text x="150" y="160" textAnchor="middle" fill="#e2e8f0" fontSize="10" fontWeight="600">ENCLOSURE</text>

          {/* Solar Panel */}
          {hasSolar && (
            <>
              <rect x="85" y="50" width="130" height="60" rx="4" fill="url(#solarGrad)" transform="rotate(-15, 150, 80)" />
              <text x="150" y="80" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="600" transform="rotate(-15, 150, 80)">
                {product.solar.watts}W SOLAR
              </text>
            </>
          )}

          {/* Cable to water */}
          <path d="M150,190 L150,250 Q150,300 200,320 L350,340" stroke="#475569" strokeWidth="4" fill="none" />

          {/* Ultrasonic in water */}
          {hasUltrasonic && (
            <>
              <rect x="330" y="330" width="60" height="30" rx="4" fill="#f97316" />
              <text x="360" y="350" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="600">ULTRASONIC</text>
              <line x1="360" y1="360" x2="360" y2="420" stroke="#f97316" strokeWidth="2" strokeDasharray="4" />
              <text x="360" y="440" textAnchor="middle" fill="#f97316" fontSize="10">28kHz waves</text>
            </>
          )}

          {/* Sensors in water */}
          <g transform="translate(420, 350)">
            <rect width="40" height="60" rx="4" fill="#22c55e" />
            <text x="20" y="35" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="600">SENSORS</text>
          </g>

          {/* AC Power */}
          {product.power.type === "AC" && (
            <>
              <line x1="50" y1="150" x2="100" y2="150" stroke="#fbbf24" strokeWidth="3" />
              <text x="30" y="155" textAnchor="middle" fill="#fbbf24" fontSize="10">AC</text>
            </>
          )}

          {/* Battery */}
          {product.battery && (
            <g transform="translate(220, 140)">
              <rect width="50" height="35" rx="4" fill="#4ade80" opacity="0.8" />
              <text x="25" y="22" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="600">BATTERY</text>
            </g>
          )}
        </>
      )}

      {/* Labels */}
      <text x="20" y="30" fill="#60a5fa" fontSize="14" fontWeight="700">{product.name}</text>
      <text x="20" y="48" fill="#94a3b8" fontSize="11">{product.deployment} Deployment</text>
    </svg>
  );
};

const WiringDiagram = ({ product }) => {
  const voltage = product.battery?.voltage || (product.power.type === "AC" ? 24 : 12);
  const hasSolar = product.solar !== null;
  const hasUltrasonic = product.ultrasonic?.enabled;
  const isXL = product.id === "smart-buoy-xl";

  return (
    <svg viewBox="0 0 700 500" style={{ width: "100%", maxWidth: 700 }}>
      <defs>
        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="#60a5fa" />
        </marker>
      </defs>

      {/* Background */}
      <rect x="0" y="0" width="700" height="500" fill="#0f172a" />

      {/* Title */}
      <text x="20" y="30" fill="#60a5fa" fontSize="14" fontWeight="700">{product.name} Wiring Diagram</text>

      {/* Voltage Rails */}
      <text x="20" y="60" fill="#94a3b8" fontSize="11" fontWeight="600">VOLTAGE RAILS:</text>

      {/* 24V/12V Rail */}
      <line x1="50" y1="80" x2="650" y2="80" stroke="#f97316" strokeWidth="4" />
      <text x="55" y="95" fill="#f97316" fontSize="10" fontWeight="600">{voltage}V DC</text>

      {/* 5V Rail */}
      <line x1="50" y1="110" x2="650" y2="110" stroke="#22c55e" strokeWidth="3" />
      <text x="55" y="125" fill="#22c55e" fontSize="10" fontWeight="600">5V DC</text>

      {/* 3.3V Rail */}
      <line x1="50" y1="135" x2="650" y2="135" stroke="#a855f7" strokeWidth="2" />
      <text x="55" y="150" fill="#a855f7" fontSize="10" fontWeight="600">3.3V DC</text>

      {/* GND Rail */}
      <line x1="50" y1="460" x2="650" y2="460" stroke="#64748b" strokeWidth="4" />
      <text x="55" y="475" fill="#64748b" fontSize="10" fontWeight="600">GND</text>

      {/* Power Source */}
      <g transform="translate(70, 180)">
        <rect width="100" height="80" rx="8" fill="rgba(251, 146, 60, 0.2)" stroke="#f97316" strokeWidth="2" />
        <text x="50" y="25" textAnchor="middle" fill="#f97316" fontSize="11" fontWeight="600">
          {product.power.type === "AC" ? "AC/DC PSU" : "SOLAR + MPPT"}
        </text>
        {hasSolar && (
          <>
            <text x="50" y="45" textAnchor="middle" fill="#cbd5e1" fontSize="9">{product.solar.watts}W Panel</text>
            <text x="50" y="60" textAnchor="middle" fill="#cbd5e1" fontSize="9">Victron MPPT</text>
          </>
        )}
        {product.power.type === "AC" && (
          <text x="50" y="50" textAnchor="middle" fill="#cbd5e1" fontSize="9">Mean Well 24V</text>
        )}
        <line x1="100" y1="20" x2="120" y2="20" stroke="#f97316" strokeWidth="2" markerEnd="url(#arrowhead)" />
        <line x1="50" y1="80" x2="50" y2="100" stroke="#64748b" strokeWidth="2" />
      </g>

      {/* Battery */}
      {product.battery && (
        <g transform="translate(200, 180)">
          <rect width="90" height="80" rx="8" fill="rgba(74, 222, 128, 0.2)" stroke="#4ade80" strokeWidth="2" />
          <text x="45" y="25" textAnchor="middle" fill="#4ade80" fontSize="11" fontWeight="600">BATTERY</text>
          <text x="45" y="45" textAnchor="middle" fill="#cbd5e1" fontSize="9">{product.battery.voltage}V {product.battery.capacity}Ah</text>
          <text x="45" y="60" textAnchor="middle" fill="#cbd5e1" fontSize="9">LiFePO4</text>
          <line x1="0" y1="20" x2="-20" y2="20" stroke="#f97316" strokeWidth="2" />
          <line x1="90" y1="20" x2="110" y2="20" stroke="#f97316" strokeWidth="2" markerEnd="url(#arrowhead)" />
        </g>
      )}

      {/* Buck Converter */}
      <g transform="translate(320, 180)">
        <rect width="80" height="60" rx="8" fill="rgba(34, 197, 94, 0.2)" stroke="#22c55e" strokeWidth="2" />
        <text x="40" y="22" textAnchor="middle" fill="#22c55e" fontSize="10" fontWeight="600">BUCK</text>
        <text x="40" y="38" textAnchor="middle" fill="#cbd5e1" fontSize="9">{voltage}V → 5V</text>
        <line x1="0" y1="20" x2="-20" y2="20" stroke="#f97316" strokeWidth="2" />
        <line x1="80" y1="20" x2="100" y2="20" stroke="#22c55e" strokeWidth="2" markerEnd="url(#arrowhead)" />
      </g>

      {/* Pi Zero / Pi 4 */}
      <g transform="translate(440, 170)">
        <rect width="120" height="90" rx="8" fill="rgba(96, 165, 250, 0.2)" stroke="#60a5fa" strokeWidth="2" />
        <text x="60" y="22" textAnchor="middle" fill="#60a5fa" fontSize="11" fontWeight="600">
          {isXL ? "Pi 4 (4GB)" : "Pi Zero 2W"}
        </text>
        <text x="60" y="42" textAnchor="middle" fill="#cbd5e1" fontSize="9">Controller</text>
        <text x="60" y="58" textAnchor="middle" fill="#94a3b8" fontSize="8">I2C / UART / GPIO</text>
        <line x1="0" y1="25" x2="-20" y2="25" stroke="#22c55e" strokeWidth="2" />

        {/* GPIO pins */}
        <rect x="105" y="30" width="10" height="40" fill="#1e293b" />
        {[0, 1, 2, 3].map((i) => (
          <circle key={i} cx="110" cy={35 + i * 10} r="3" fill="#60a5fa" />
        ))}
      </g>

      {/* SIM HAT */}
      <g transform="translate(580, 170)">
        <rect width="100" height="70" rx="8" fill="rgba(168, 85, 247, 0.2)" stroke="#a855f7" strokeWidth="2" />
        <text x="50" y="22" textAnchor="middle" fill="#a855f7" fontSize="10" fontWeight="600">SIM7670G</text>
        <text x="50" y="40" textAnchor="middle" fill="#cbd5e1" fontSize="9">LTE Cat-1 HAT</text>
        <text x="50" y="55" textAnchor="middle" fill="#94a3b8" fontSize="8">UART</text>
        <line x1="0" y1="25" x2="-20" y2="25" stroke="#22c55e" strokeWidth="2" />
      </g>

      {/* ADC */}
      <g transform="translate(320, 300)">
        <rect width="80" height="60" rx="8" fill="rgba(59, 130, 246, 0.2)" stroke="#3b82f6" strokeWidth="2" />
        <text x="40" y="22" textAnchor="middle" fill="#3b82f6" fontSize="10" fontWeight="600">ADS1115</text>
        <text x="40" y="38" textAnchor="middle" fill="#cbd5e1" fontSize="9">16-bit ADC</text>
        <text x="40" y="52" textAnchor="middle" fill="#94a3b8" fontSize="8">I2C 0x48</text>
        <line x1="40" y1="0" x2="500" y2="-40" stroke="#60a5fa" strokeWidth="1" strokeDasharray="3" />
      </g>

      {/* Sensors */}
      <g transform="translate(200, 320)">
        <rect width="100" height="80" rx="8" fill="rgba(34, 197, 94, 0.2)" stroke="#22c55e" strokeWidth="2" />
        <text x="50" y="22" textAnchor="middle" fill="#22c55e" fontSize="10" fontWeight="600">SENSORS</text>
        {product.sensorList.slice(0, 3).map((s, i) => (
          <text key={i} x="50" y={40 + i * 12} textAnchor="middle" fill="#cbd5e1" fontSize="8">{s}</text>
        ))}
        <line x1="100" y1="30" x2="120" y2="10" stroke="#3b82f6" strokeWidth="1" strokeDasharray="3" />
      </g>

      {/* Ultrasonic */}
      {hasUltrasonic && (
        <g transform="translate(450, 300)">
          <rect width="110" height="80" rx="8" fill="rgba(249, 115, 22, 0.2)" stroke="#f97316" strokeWidth="2" />
          <text x="55" y="22" textAnchor="middle" fill="#f97316" fontSize="10" fontWeight="600">ULTRASONIC</text>
          <text x="55" y="40" textAnchor="middle" fill="#cbd5e1" fontSize="9">{product.ultrasonic.watts}W @ 28kHz</text>
          <text x="55" y="55" textAnchor="middle" fill="#94a3b8" fontSize="8">Driver + Transducer</text>
          {isXL && <text x="55" y="70" textAnchor="middle" fill="#94a3b8" fontSize="8">(×2 units)</text>}
          <line x1="55" y1="0" x2="55" y2="-120" stroke="#f97316" strokeWidth="2" />
          <line x1="55" y1="80" x2="55" y2="100" stroke="#64748b" strokeWidth="2" />
        </g>
      )}

      {/* Legend */}
      <g transform="translate(20, 420)">
        <text fill="#94a3b8" fontSize="10" fontWeight="600">CONNECTIONS:</text>
        <line x1="100" y1="-5" x2="130" y2="-5" stroke="#f97316" strokeWidth="2" />
        <text x="135" y="-2" fill="#f97316" fontSize="9">{voltage}V Power</text>
        <line x1="200" y1="-5" x2="230" y2="-5" stroke="#22c55e" strokeWidth="2" />
        <text x="235" y="-2" fill="#22c55e" fontSize="9">5V Logic</text>
        <line x1="300" y1="-5" x2="330" y2="-5" stroke="#60a5fa" strokeWidth="1" strokeDasharray="3" />
        <text x="335" y="-2" fill="#60a5fa" fontSize="9">I2C/Data</text>
      </g>
    </svg>
  );
};

// ============================================================================
// TAB CONTENT COMPONENTS
// ============================================================================

const OverviewTab = ({ product }) => (
  <div>
    <SectionTitle>Features</SectionTitle>
    <FeatureList>
      {product.features.map((f, i) => (
        <FeatureItem key={i}>{f}</FeatureItem>
      ))}
    </FeatureList>

    <div style={{ marginTop: 24 }}>
      <SectionTitle>Specifications</SectionTitle>
      <SpecGrid>
        <SpecCard>
          <SpecLabel>Deployment</SpecLabel>
          <SpecValue>{product.deployment}</SpecValue>
        </SpecCard>
        <SpecCard>
          <SpecLabel>Power</SpecLabel>
          <SpecValue>
            {product.power.type}
            {product.solar && ` (${product.solar.watts}W)`}
          </SpecValue>
        </SpecCard>
        <SpecCard>
          <SpecLabel>Sensors</SpecLabel>
          <SpecValue>{product.sensors} parameters</SpecValue>
        </SpecCard>
        {product.ultrasonic?.enabled && (
          <SpecCard>
            <SpecLabel>Ultrasonic</SpecLabel>
            <SpecValue>{product.ultrasonic.watts}W × {product.ultrasonic.units}</SpecValue>
          </SpecCard>
        )}
        {product.battery && (
          <SpecCard>
            <SpecLabel>Battery</SpecLabel>
            <SpecValue>{product.battery.voltage}V {product.battery.capacity}Ah</SpecValue>
          </SpecCard>
        )}
        <SpecCard>
          <SpecLabel>Autonomy</SpecLabel>
          <SpecValue>{product.autonomy}</SpecValue>
        </SpecCard>
        <SpecCard>
          <SpecLabel>Weight</SpecLabel>
          <SpecValue>{product.weight}</SpecValue>
        </SpecCard>
      </SpecGrid>
    </div>

    <div style={{ marginTop: 24 }}>
      <SectionTitle>Sensor Suite</SectionTitle>
      <FeatureList>
        {product.sensorList.map((s, i) => (
          <FeatureItem key={i}>{s}</FeatureItem>
        ))}
      </FeatureList>
    </div>
  </div>
);

const LayoutTab = ({ product }) => (
  <div>
    <SectionTitle>Physical Layout</SectionTitle>
    <SvgContainer>
      <LayoutDiagram product={product} />
    </SvgContainer>
  </div>
);

const WiringTab = ({ product }) => (
  <div>
    <SectionTitle>Electrical Wiring</SectionTitle>
    <SvgContainer>
      <WiringDiagram product={product} />
    </SvgContainer>
  </div>
);

const PowerTab = ({ product }) => {
  const totalAvgWatts = product.powerTable.reduce((sum, row) => sum + row.avgWatts, 0);
  const dailyWh = totalAvgWatts * 24;
  const batteryWh = product.battery?.wh || 0;
  const calculatedAutonomy = batteryWh > 0 ? (batteryWh / totalAvgWatts / 24).toFixed(1) : "N/A";

  return (
    <div>
      <SectionTitle>Power Budget</SectionTitle>
      <Table>
        <thead>
          <tr>
            <Th>Component</Th>
            <Th>Voltage</Th>
            <Th>Current (A)</Th>
            <Th>Duty %</Th>
            <Th>Avg Watts</Th>
          </tr>
        </thead>
        <tbody>
          {product.powerTable.map((row, i) => (
            <tr key={i}>
              <Td>{row.component}</Td>
              <Td>{row.voltage}V</Td>
              <Td>{row.current}</Td>
              <Td>{row.duty}%</Td>
              <Td>{row.avgWatts.toFixed(2)}W</Td>
            </tr>
          ))}
          <TotalRow>
            <Td colSpan={4}>Total Average Power</Td>
            <Td>{totalAvgWatts.toFixed(2)}W</Td>
          </TotalRow>
        </tbody>
      </Table>

      <SpecGrid style={{ marginTop: 24 }}>
        <SpecCard>
          <SpecLabel>Daily Consumption</SpecLabel>
          <SpecValue>{dailyWh.toFixed(0)} Wh</SpecValue>
        </SpecCard>
        {product.battery && (
          <>
            <SpecCard>
              <SpecLabel>Battery Capacity</SpecLabel>
              <SpecValue>{product.battery.wh} Wh</SpecValue>
            </SpecCard>
            <SpecCard>
              <SpecLabel>Calculated Autonomy</SpecLabel>
              <SpecValue>{calculatedAutonomy} days</SpecValue>
            </SpecCard>
          </>
        )}
        {product.solar && (
          <SpecCard>
            <SpecLabel>Solar Input</SpecLabel>
            <SpecValue>{product.solar.watts}W peak</SpecValue>
          </SpecCard>
        )}
      </SpecGrid>
    </div>
  );
};

const GpioTab = ({ product }) => (
  <div>
    <SectionTitle>GPIO Pin Assignments</SectionTitle>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 20 }}>
      {product.gpio.i2c?.length > 0 && (
        <GpioSection>
          <GpioTitle>I2C Bus</GpioTitle>
          <GpioList>
            {product.gpio.i2c.map((pin, i) => (
              <li key={i}>{pin}</li>
            ))}
          </GpioList>
        </GpioSection>
      )}
      {product.gpio.uart?.length > 0 && (
        <GpioSection>
          <GpioTitle>UART</GpioTitle>
          <GpioList>
            {product.gpio.uart.map((pin, i) => (
              <li key={i}>{pin}</li>
            ))}
          </GpioList>
        </GpioSection>
      )}
      {product.gpio.oneWire?.length > 0 && (
        <GpioSection>
          <GpioTitle>1-Wire</GpioTitle>
          <GpioList>
            {product.gpio.oneWire.map((pin, i) => (
              <li key={i}>{pin}</li>
            ))}
          </GpioList>
        </GpioSection>
      )}
      {product.gpio.gpio?.length > 0 && (
        <GpioSection>
          <GpioTitle>Digital GPIO</GpioTitle>
          <GpioList>
            {product.gpio.gpio.map((pin, i) => (
              <li key={i}>{pin}</li>
            ))}
          </GpioList>
        </GpioSection>
      )}
      {product.gpio.sdi12?.length > 0 && (
        <GpioSection>
          <GpioTitle>SDI-12</GpioTitle>
          <GpioList>
            {product.gpio.sdi12.map((pin, i) => (
              <li key={i}>{pin}</li>
            ))}
          </GpioList>
        </GpioSection>
      )}
    </div>
  </div>
);

const BomTab = ({ product }) => {
  const totalCost = product.bom.reduce((sum, item) => sum + item.cost, 0);
  const margin = ((product.price - totalCost) / product.price * 100).toFixed(1);
  const marginGood = parseFloat(margin) >= 30;

  // Group by category
  const categories = [...new Set(product.bom.map((item) => item.category))];

  return (
    <div>
      <SectionTitle>
        Bill of Materials
        <MarginBadge good={marginGood}>{margin}% margin</MarginBadge>
      </SectionTitle>

      {categories.map((cat) => (
        <div key={cat} style={{ marginBottom: 24 }}>
          <h5 style={{ fontSize: 14, color: "#60a5fa", margin: "0 0 8px" }}>{cat}</h5>
          <Table>
            <thead>
              <tr>
                <Th>Item</Th>
                <Th>Qty</Th>
                <Th>Cost</Th>
              </tr>
            </thead>
            <tbody>
              {product.bom
                .filter((item) => item.category === cat)
                .map((item, i) => (
                  <tr key={i}>
                    <Td>{item.item}</Td>
                    <Td>{item.qty}</Td>
                    <Td>${item.cost.toLocaleString()}</Td>
                  </tr>
                ))}
            </tbody>
          </Table>
        </div>
      ))}

      <Table>
        <tbody>
          <tr style={{ background: "rgba(0,0,0,0.3)" }}>
            <Td><strong>BOM Total</strong></Td>
            <Td></Td>
            <Td><strong>${totalCost.toLocaleString()}</strong></Td>
          </tr>
          <TotalRow>
            <Td><strong>Retail Price</strong></Td>
            <Td></Td>
            <Td><strong>${product.price.toLocaleString()}</strong></Td>
          </TotalRow>
          <tr>
            <Td>Gross Profit</Td>
            <Td></Td>
            <Td>${(product.price - totalCost).toLocaleString()} ({margin}%)</Td>
          </tr>
        </tbody>
      </Table>
    </div>
  );
};

// ============================================================================
// BENCHMARK VIEW
// ============================================================================

const BenchmarkView = () => {
  const bluesignalProducts = Object.values(PRODUCTS);
  const avgPrice = bluesignalProducts.reduce((sum, p) => sum + p.price, 0) / bluesignalProducts.length;

  return (
    <div>
      <SectionTitle style={{ marginBottom: 24 }}>Market Comparison</SectionTitle>

      <BenchmarkGrid>
        {/* Enterprise Algae Control */}
        <BenchmarkCard>
          <BenchmarkName>{COMPETITORS.enterprise.name}</BenchmarkName>
          <BenchmarkPrice>{COMPETITORS.enterprise.priceRange}</BenchmarkPrice>
          <BenchmarkSection type="pro">
            <h5>Capabilities</h5>
            <ul>
              {COMPETITORS.enterprise.features.map((f, i) => (
                <li key={i}>{f}</li>
              ))}
            </ul>
          </BenchmarkSection>
          <BenchmarkSection type="con">
            <h5>Limitations</h5>
            <ul>
              {COMPETITORS.enterprise.limitations.map((l, i) => (
                <li key={i}>{l}</li>
              ))}
            </ul>
          </BenchmarkSection>
        </BenchmarkCard>

        {/* Pro Sondes */}
        <BenchmarkCard>
          <BenchmarkName>{COMPETITORS.proSondes.name}</BenchmarkName>
          <BenchmarkPrice>{COMPETITORS.proSondes.priceRange}</BenchmarkPrice>
          <BenchmarkSection type="pro">
            <h5>Capabilities</h5>
            <ul>
              {COMPETITORS.proSondes.features.map((f, i) => (
                <li key={i}>{f}</li>
              ))}
            </ul>
          </BenchmarkSection>
          <BenchmarkSection type="con">
            <h5>Limitations</h5>
            <ul>
              {COMPETITORS.proSondes.limitations.map((l, i) => (
                <li key={i}>{l}</li>
              ))}
            </ul>
          </BenchmarkSection>
        </BenchmarkCard>

        {/* BlueSignal */}
        <BenchmarkCard highlight>
          <BenchmarkName>BlueSignal Platform</BenchmarkName>
          <BenchmarkPrice highlight>$599 - $19,999</BenchmarkPrice>
          <BenchmarkSection type="pro">
            <h5>Capabilities</h5>
            <ul>
              <li>Integrated algae control + monitoring</li>
              <li>LTE connectivity included</li>
              <li>Cloud dashboard & alerts</li>
              <li>Solar-powered options</li>
              <li>Floating & shore deployments</li>
              <li>Open platform (Pi-based)</li>
            </ul>
          </BenchmarkSection>
          <BenchmarkSection type="pro">
            <h5>Unique Value</h5>
            <ul>
              <li>ONLY affordable option with both</li>
              <li>monitoring AND control</li>
            </ul>
          </BenchmarkSection>
        </BenchmarkCard>
      </BenchmarkGrid>

      <SavingsCallout>
        <h4>Cost Advantage</h4>
        <p>
          BlueSignal delivers <strong>algae control + water quality monitoring</strong> starting at{" "}
          <strong>$599</strong> — compared to <strong>$36,000+</strong> for equivalent enterprise
          solutions (ultrasonic system + multi-parameter sonde).
        </p>
        <p style={{ marginTop: 12 }}>
          <strong>That's up to 98% cost savings</strong> with integrated LTE connectivity and cloud
          dashboard included.
        </p>
      </SavingsCallout>

      {/* Product comparison table */}
      <div style={{ marginTop: 32 }}>
        <SectionTitle>BlueSignal Product Line</SectionTitle>
        <div style={{ overflowX: "auto" }}>
          <Table>
            <thead>
              <tr>
                <Th>Model</Th>
                <Th>Price</Th>
                <Th>Deployment</Th>
                <Th>Ultrasonic</Th>
                <Th>Sensors</Th>
                <Th>Autonomy</Th>
              </tr>
            </thead>
            <tbody>
              {bluesignalProducts.map((p) => (
                <tr key={p.id}>
                  <Td>
                    <strong>{p.name}</strong>
                    <br />
                    <span style={{ fontSize: 11, color: "#94a3b8" }}>{p.subtitle}</span>
                  </Td>
                  <Td style={{ color: "#38bdf8" }}>${p.price.toLocaleString()}</Td>
                  <Td>{p.deployment}</Td>
                  <Td>{p.ultrasonic?.enabled ? `${p.ultrasonic.watts}W` : "—"}</Td>
                  <Td>{p.sensors}</Td>
                  <Td>{p.autonomy}</Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function BlueSignalConfigurator() {
  const [view, setView] = useState("products"); // "products" | "benchmark"
  const [selectedProduct, setSelectedProduct] = useState("s-ac");
  const [activeTab, setActiveTab] = useState("overview");

  const product = PRODUCTS[selectedProduct];

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "layout", label: "Layout" },
    { id: "wiring", label: "Wiring" },
    { id: "power", label: "Power" },
    { id: "gpio", label: "GPIO" },
    { id: "bom", label: "BOM" },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return <OverviewTab product={product} />;
      case "layout":
        return <LayoutTab product={product} />;
      case "wiring":
        return <WiringTab product={product} />;
      case "power":
        return <PowerTab product={product} />;
      case "gpio":
        return <GpioTab product={product} />;
      case "bom":
        return <BomTab product={product} />;
      default:
        return <OverviewTab product={product} />;
    }
  };

  return (
    <ConfiguratorWrapper>
      <Container>
        <Header>
          <Logo>
            Blue<span>Signal</span>
          </Logo>
          <Tagline>Water Quality Hardware Configurator</Tagline>
        </Header>

        <NavTabs>
          <NavTab active={view === "products"} onClick={() => setView("products")}>
            Products
          </NavTab>
          <NavTab active={view === "benchmark"} onClick={() => setView("benchmark")}>
            Benchmark
          </NavTab>
        </NavTabs>

        {view === "products" ? (
          <>
            <ProductGrid>
              {Object.values(PRODUCTS).map((p) => (
                <ProductCard
                  key={p.id}
                  selected={selectedProduct === p.id}
                  onClick={() => {
                    setSelectedProduct(p.id);
                    setActiveTab("overview");
                  }}
                >
                  <ProductName>{p.name}</ProductName>
                  <ProductSubtitle>{p.subtitle}</ProductSubtitle>
                  <ProductPrice>${p.price.toLocaleString()}</ProductPrice>
                  <ProductTagline>{p.tagline}</ProductTagline>
                  <ProductBadges>
                    {p.ultrasonic?.enabled && (
                      <Badge variant="ultrasonic">{p.ultrasonic.watts}W Ultrasonic</Badge>
                    )}
                    {p.solar && <Badge variant="solar">{p.solar.watts}W Solar</Badge>}
                    <Badge variant="sensors">{p.sensors} Sensors</Badge>
                  </ProductBadges>
                </ProductCard>
              ))}
            </ProductGrid>

            <DetailPanel>
              <DetailTabs>
                {tabs.map((tab) => (
                  <DetailTab
                    key={tab.id}
                    active={activeTab === tab.id}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    {tab.label}
                  </DetailTab>
                ))}
              </DetailTabs>
              <DetailContent>{renderTabContent()}</DetailContent>
            </DetailPanel>
          </>
        ) : (
          <DetailPanel>
            <DetailContent>
              <BenchmarkView />
            </DetailContent>
          </DetailPanel>
        )}
      </Container>
    </ConfiguratorWrapper>
  );
}
