// /src/components/BlueSignalConfigurator.jsx
// BlueSignal Product Configurator - Water Quality Hardware
import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import styled, { css, keyframes } from "styled-components";

// ============================================================================
// PRODUCT DATA
// ============================================================================

const PRODUCTS = {
  "s-ac": {
    id: "s-ac",
    sku: "WQM-S-AC",
    name: "Shore Monitor AC",
    subtitle: "AC-Powered Algae Control",
    price: 599,
    tagline: "Entry-level algae control for sites with AC power",
    deployment: "Shore-mounted",
    power: { type: "AC", voltage: "120V AC Mains", watts: null },
    ultrasonic: { enabled: true, watts: 100, frequency: "28kHz", units: 1 },
    sensors: 3,
    sensorList: ["TDS", "Turbidity", "pH"],
    battery: null,
    solar: null,
    autonomy: "N/A (grid powered)",
    weight: "~15 lbs",
    dimensions: { length: "12.6\"", width: "18.1\"", height: "6.4\"" },
    enclosure: "NEMA 4X (IP66)",
    floatCost: 0,
    features: [
      "100W ultrasonic algae control @ 28kHz",
      "3 water quality sensors (TDS, Turbidity, pH)",
      "Pi Zero 2W controller with pre-soldered headers",
      "LTE Cat-1 connectivity (Hologram IoT)",
      "Real-time cloud dashboard",
      "NEMA 4X weatherproof enclosure",
    ],
    bom: [
      { item: "Raspberry Pi Zero 2 W (SC0510)", qty: 1, cost: 30.99, category: "Compute" },
      { item: "Waveshare SIM7670G Cat-1/GNSS HAT", qty: 1, cost: 37.99, category: "Connectivity" },
      { item: "MicroSD Card (SanDisk Industrial 32GB)", qty: 1, cost: 12, category: "Compute" },
      { item: "Hologram Global IoT SIM", qty: 1, cost: 5, category: "Connectivity" },
      { item: "SMA External 4G/LTE Antenna", qty: 1, cost: 8, category: "Connectivity" },
      { item: "ADS1115 16-bit I2C ADC", qty: 1, cost: 5, category: "Sensing" },
      { item: "CQRobot Ocean TDS Meter", qty: 1, cost: 11.99, category: "Sensing" },
      { item: "DFRobot SEN0189 Turbidity Sensor", qty: 1, cost: 11.90, category: "Sensing" },
      { item: "PH-4502C Module + BNC Electrode", qty: 1, cost: 28.79, category: "Sensing" },
      { item: "pH Calibration Kit (4.0 + 7.0 buffers)", qty: 1, cost: 10, category: "Sensing" },
      { item: "BQLZR 100W 28kHz Ultrasonic Kit", qty: 1, cost: 68.99, category: "Ultrasonic" },
      { item: "Transducer Cable (16AWG Shielded 10ft)", qty: 1, cost: 8, category: "Ultrasonic" },
      { item: "Mean Well 12V DC Power Supply", qty: 1, cost: 28, category: "Power" },
      { item: "12V to 5V Buck Converter", qty: 1, cost: 6, category: "Power" },
      { item: "4-Channel Relay Module", qty: 1, cost: 8, category: "Power" },
      { item: "40mm Cooling Fan", qty: 1, cost: 6, category: "Power" },
      { item: "NEMA 4X Enclosure (IP66)", qty: 1, cost: 45, category: "Housing" },
      { item: "DIN Rail + Mounting Hardware", qty: 1, cost: 15, category: "Housing" },
      { item: "Cable Glands (PG9/PG11/PG13.5)", qty: 1, cost: 12, category: "Hardware" },
      { item: "Wiring, Terminals, Connectors", qty: 1, cost: 20, category: "Hardware" },
    ],
    gpio: {
      i2c: ["ADS1115 ADC (0x48) - GPIO2 SDA, GPIO3 SCL"],
      uart: ["SIM7670G HAT (GPIO14 TX, GPIO15 RX) - Reserved"],
      gpio: [
        "GPIO17 → Relay 1 → Ultrasonic Driver (Active-LOW)",
        "GPIO23 → Relay 4 → Cooling Fan (Active-LOW)",
        "GPIO24 → Status LED (via 330Ω)",
        "GPIO27 → Relay 2 → Spare (Active-LOW)",
        "GPIO22 → Relay 3 → Spare (Active-LOW)",
      ],
    },
    powerTable: [
      { component: "Pi Zero 2 W + HAT", voltage: 5, current: 0.5, duty: 100, avgWatts: 2.5, notes: "Always on" },
      { component: "Sensors (3×)", voltage: 5, current: 0.05, duty: 100, avgWatts: 0.25, notes: "Continuous sampling" },
      { component: "ADS1115 ADC", voltage: 3.3, current: 0.003, duty: 100, avgWatts: 0.01, notes: "I2C polling" },
      { component: "Relay Coils (avg)", voltage: 5, current: 0.08, duty: 10, avgWatts: 0.4, notes: "Switching events" },
      { component: "Cooling Fan", voltage: 12, current: 0.1, duty: 20, avgWatts: 1.2, notes: "40-45°C hysteresis" },
      { component: "Status LED", voltage: 3.3, current: 0.02, duty: 50, avgWatts: 0.02, notes: "Heartbeat blink" },
      { component: "Ultrasonic Driver (AC Load)", voltage: 120, current: 0.83, duty: 4.2, avgWatts: 4.2, notes: "15 min every 6 hrs" },
    ],
    dailyWh: 185,
  },
  "s-sol": {
    id: "s-sol",
    sku: "WQM-S-SOL",
    name: "Shore Monitor Solar",
    subtitle: "Solar-Powered Algae Control",
    price: 1499,
    tagline: "Off-grid algae control with 4.6-day autonomy",
    deployment: "Shore-mounted",
    power: { type: "Solar + Battery", voltage: "24V DC", watts: 200 },
    ultrasonic: { enabled: true, watts: 100, frequency: "28kHz", units: 1, inverterLoss: "18%" },
    sensors: 3,
    sensorList: ["TDS", "Turbidity", "pH"],
    battery: { type: "LiFePO4", voltage: 24, capacity: 50, wh: 1280 },
    solar: { watts: 200, panels: 1 },
    autonomy: "4.6 days",
    weight: "~35 lbs",
    dimensions: { length: "16\"", width: "20\"", height: "8\"" },
    enclosure: "NEMA 4X (IP66)",
    floatCost: 0,
    features: [
      "200W Renogy monocrystalline solar panel",
      "24V 50Ah LiFePO4 battery (1.28kWh)",
      "100W ultrasonic algae control @ 28kHz",
      "3 water quality sensors (TDS, Turbidity, pH)",
      "Victron SmartSolar 100/20 MPPT",
      "Victron BatteryProtect 65A LVD",
      "Pure sine inverter for ultrasonic",
      "4.6 days autonomy without sun",
      "NEMA 4X weatherproof enclosure",
    ],
    bom: [
      { item: "Raspberry Pi Zero 2 W (SC0510)", qty: 1, cost: 30.99, category: "Compute" },
      { item: "Waveshare SIM7670G Cat-1/GNSS HAT", qty: 1, cost: 37.99, category: "Connectivity" },
      { item: "MicroSD Card (SanDisk Industrial 32GB)", qty: 1, cost: 12, category: "Compute" },
      { item: "Hologram Global IoT SIM", qty: 1, cost: 5, category: "Connectivity" },
      { item: "SMA External 4G/LTE Antenna", qty: 1, cost: 8, category: "Connectivity" },
      { item: "ADS1115 16-bit I2C ADC", qty: 1, cost: 5, category: "Sensing" },
      { item: "CQRobot Ocean TDS Meter", qty: 1, cost: 11.99, category: "Sensing" },
      { item: "DFRobot SEN0189 Turbidity Sensor", qty: 1, cost: 11.90, category: "Sensing" },
      { item: "PH-4502C Module + BNC Electrode", qty: 1, cost: 28.79, category: "Sensing" },
      { item: "pH Calibration Kit (4.0 + 7.0 buffers)", qty: 1, cost: 10, category: "Sensing" },
      { item: "BQLZR 100W 28kHz Ultrasonic Kit", qty: 1, cost: 68.99, category: "Ultrasonic" },
      { item: "Transducer Cable (16AWG Shielded 10ft)", qty: 1, cost: 8, category: "Ultrasonic" },
      { item: "Renogy 200W 24V Monocrystalline Panel", qty: 1, cost: 189, category: "Power" },
      { item: "Victron SmartSolar 100/20 MPPT", qty: 1, cost: 125, category: "Power" },
      { item: "24V 50Ah LiFePO4 Battery w/ BMS (1280Wh)", qty: 1, cost: 269, category: "Power" },
      { item: "Victron BatteryProtect 65A LVD", qty: 1, cost: 45, category: "Power" },
      { item: "Pure Sine Inverter 300W 24VDC→120VAC", qty: 1, cost: 65, category: "Power" },
      { item: "24V to 12V Buck Converter", qty: 1, cost: 8, category: "Power" },
      { item: "12V to 5V Buck Converter", qty: 1, cost: 6, category: "Power" },
      { item: "4-Channel Relay Module", qty: 1, cost: 8, category: "Power" },
      { item: "60mm Cooling Fan", qty: 1, cost: 8, category: "Power" },
      { item: "NEMA 4X Enclosure (IP66) Large", qty: 1, cost: 75, category: "Housing" },
      { item: "DIN Rail + Mounting Hardware", qty: 1, cost: 20, category: "Housing" },
      { item: "Solar Panel Mounting Hardware", qty: 1, cost: 45, category: "Hardware" },
      { item: "Cable Glands (PG9/PG11/PG13.5)", qty: 1, cost: 15, category: "Hardware" },
      { item: "Wiring, Terminals, Connectors", qty: 1, cost: 25, category: "Hardware" },
    ],
    gpio: {
      i2c: ["ADS1115 ADC (0x48) - GPIO2 SDA, GPIO3 SCL"],
      uart: ["SIM7670G HAT (GPIO14 TX, GPIO15 RX) - Reserved"],
      gpio: [
        "GPIO17 → Relay 1 → Ultrasonic Driver (Active-LOW)",
        "GPIO23 → Relay 4 → Cooling Fan (Active-LOW)",
        "GPIO24 → Status LED (via 330Ω)",
        "GPIO27 → Relay 2 → Spare (Active-LOW)",
        "GPIO22 → Relay 3 → Spare (Active-LOW)",
      ],
    },
    powerTable: [
      { component: "Pi Zero 2 W + HAT", voltage: 5, current: 0.5, duty: 100, avgWatts: 2.5, notes: "Always on" },
      { component: "Sensors (3×)", voltage: 5, current: 0.05, duty: 100, avgWatts: 0.25, notes: "Continuous sampling" },
      { component: "MPPT Controller", voltage: 24, current: 0.0125, duty: 100, avgWatts: 0.3, notes: "Standby draw" },
      { component: "LVD (BatteryProtect)", voltage: 24, current: 0.008, duty: 100, avgWatts: 0.2, notes: "Monitoring" },
      { component: "Relay Coils (avg)", voltage: 5, current: 0.08, duty: 10, avgWatts: 0.4, notes: "Switching events" },
      { component: "Cooling Fan", voltage: 12, current: 0.1, duty: 20, avgWatts: 1.2, notes: "40-45°C hysteresis" },
      { component: "Ultrasonic (via Inverter)", voltage: 24, current: 4.92, duty: 4.2, avgWatts: 4.96, notes: "100W + 18% inverter loss" },
    ],
    dailyWh: 223,
  },
  "s-mon": {
    id: "s-mon",
    sku: "WQM-S-MON",
    name: "Shore Monitor Lite",
    subtitle: "Monitoring Only (No Ultrasonic)",
    price: 849,
    tagline: "Solar-powered monitoring without ultrasonic treatment",
    deployment: "Shore-mounted",
    power: { type: "Solar + Battery", voltage: "12V DC", watts: 100 },
    ultrasonic: { enabled: false },
    sensors: 3,
    sensorList: ["TDS", "Turbidity", "pH"],
    battery: { type: "LiFePO4", voltage: 12, capacity: 25, wh: 320 },
    solar: { watts: 100, panels: 1 },
    autonomy: "3.3 days",
    weight: "~20 lbs",
    dimensions: { length: "10\"", width: "12\"", height: "6\"" },
    enclosure: "NEMA 4X (IP66)",
    floatCost: 0,
    features: [
      "100W monocrystalline solar panel",
      "12V 25Ah LiFePO4 battery (320Wh)",
      "NO ultrasonic (monitoring only)",
      "3 water quality sensors (TDS, Turbidity, pH)",
      "3.3 days autonomy without sun",
      "Lowest power consumption",
      "Passive cooling (no fan)",
      "NEMA 4X weatherproof enclosure",
    ],
    bom: [
      { item: "Raspberry Pi Zero 2 W (SC0510)", qty: 1, cost: 30.99, category: "Compute" },
      { item: "Waveshare SIM7670G Cat-1/GNSS HAT", qty: 1, cost: 37.99, category: "Connectivity" },
      { item: "MicroSD Card (SanDisk Industrial 32GB)", qty: 1, cost: 12, category: "Compute" },
      { item: "Hologram Global IoT SIM", qty: 1, cost: 5, category: "Connectivity" },
      { item: "SMA External 4G/LTE Antenna", qty: 1, cost: 8, category: "Connectivity" },
      { item: "ADS1115 16-bit I2C ADC", qty: 1, cost: 5, category: "Sensing" },
      { item: "CQRobot Ocean TDS Meter", qty: 1, cost: 11.99, category: "Sensing" },
      { item: "DFRobot SEN0189 Turbidity Sensor", qty: 1, cost: 11.90, category: "Sensing" },
      { item: "PH-4502C Module + BNC Electrode", qty: 1, cost: 28.79, category: "Sensing" },
      { item: "pH Calibration Kit (4.0 + 7.0 buffers)", qty: 1, cost: 10, category: "Sensing" },
      { item: "100W Monocrystalline Solar Panel", qty: 1, cost: 85, category: "Power" },
      { item: "MPPT Controller (small)", qty: 1, cost: 35, category: "Power" },
      { item: "12V 25Ah LiFePO4 Battery w/ BMS (320Wh)", qty: 1, cost: 149, category: "Power" },
      { item: "Low Voltage Disconnect (12V)", qty: 1, cost: 25, category: "Power" },
      { item: "12V to 5V Buck Converter", qty: 1, cost: 6, category: "Power" },
      { item: "2-Channel Relay Module", qty: 1, cost: 5, category: "Power" },
      { item: "NEMA 4X Enclosure (IP66) Compact", qty: 1, cost: 45, category: "Housing" },
      { item: "DIN Rail + Mounting Hardware", qty: 1, cost: 12, category: "Housing" },
      { item: "Solar Panel Mounting Hardware", qty: 1, cost: 30, category: "Hardware" },
      { item: "Cable Glands (PG9/PG11)", qty: 1, cost: 10, category: "Hardware" },
      { item: "Wiring, Terminals, Connectors", qty: 1, cost: 15, category: "Hardware" },
    ],
    gpio: {
      i2c: ["ADS1115 ADC (0x48) - GPIO2 SDA, GPIO3 SCL"],
      uart: ["SIM7670G HAT (GPIO14 TX, GPIO15 RX) - Reserved"],
      gpio: [
        "GPIO24 → Status LED (via 330Ω)",
        "GPIO27 → Relay 1 → Spare (Active-LOW)",
        "GPIO22 → Relay 2 → Spare (Active-LOW)",
      ],
    },
    powerTable: [
      { component: "Pi Zero 2 W + HAT", voltage: 5, current: 0.5, duty: 100, avgWatts: 2.5, notes: "Always on" },
      { component: "Sensors (3×)", voltage: 5, current: 0.05, duty: 100, avgWatts: 0.25, notes: "Continuous sampling" },
      { component: "MPPT Controller", voltage: 12, current: 0.021, duty: 100, avgWatts: 0.25, notes: "Standby" },
      { component: "LVD", voltage: 12, current: 0.0125, duty: 100, avgWatts: 0.15, notes: "Monitoring" },
      { component: "Relay Coils (avg)", voltage: 5, current: 0.04, duty: 5, avgWatts: 0.2, notes: "Minimal switching" },
    ],
    dailyWh: 78,
  },
  "smart-buoy": {
    id: "smart-buoy",
    sku: "BS-BUOY-01",
    name: "Smart Buoy",
    subtitle: "Floating Algae Control Platform",
    price: 2499,
    tagline: "Floating algae control for ponds and lakes",
    deployment: "Floating",
    power: { type: "Solar + Battery", voltage: "24V DC", watts: 50 },
    ultrasonic: { enabled: true, watts: 100, frequency: "28kHz", units: 1, inverterLoss: "15%" },
    sensors: 5,
    sensorList: ["TDS", "Turbidity", "pH", "Dissolved Oxygen", "Temperature"],
    battery: { type: "LiFePO4", voltage: 24, capacity: 20, wh: 480 },
    solar: { watts: 50, panels: 1 },
    autonomy: "3.0 days",
    weight: "22 lbs",
    dimensions: { length: "20.87\"", width: "20.87\"", height: "26.38\"" },
    enclosure: "HDPE Hull + IP68 Electronics Bay",
    floatCost: 628,
    floatDetails: "HDPE Cylindrical 21\" Blue Float",
    features: [
      "Floating buoy deployment",
      "~50W integrated solar panel",
      "24V 20Ah LiFePO4 battery (480Wh)",
      "100W ultrasonic algae control @ 28kHz",
      "5 water quality sensors (TDS, Turbidity, pH, DO, Temp)",
      "HDPE cylindrical float hull ($628)",
      "GPS position tracking",
      "SS 316 perforated sensor cage",
      "IP68 sealed electronics bay",
      "3.0 days autonomy without sun",
    ],
    bom: [
      { item: "Raspberry Pi Zero 2 W (SC0510)", qty: 1, cost: 30.99, category: "Compute" },
      { item: "Waveshare SIM7670G Cat-1/GNSS HAT", qty: 1, cost: 37.99, category: "Connectivity" },
      { item: "MicroSD Card (SanDisk Industrial 32GB)", qty: 1, cost: 12, category: "Compute" },
      { item: "Hologram Global IoT SIM", qty: 1, cost: 5, category: "Connectivity" },
      { item: "SMA External 4G/LTE Antenna", qty: 1, cost: 8, category: "Connectivity" },
      { item: "ADS1115 16-bit I2C ADC", qty: 1, cost: 5, category: "Sensing" },
      { item: "CQRobot Ocean TDS Meter", qty: 1, cost: 11.99, category: "Sensing" },
      { item: "DFRobot SEN0189 Turbidity Sensor", qty: 1, cost: 11.90, category: "Sensing" },
      { item: "PH-4502C Module + BNC Electrode", qty: 1, cost: 28.79, category: "Sensing" },
      { item: "pH Calibration Kit (4.0 + 7.0 buffers)", qty: 1, cost: 10, category: "Sensing" },
      { item: "Atlas Scientific EZO-DO Kit", qty: 1, cost: 89, category: "Sensing" },
      { item: "DS18B20 Waterproof Temperature Probe", qty: 1, cost: 8, category: "Sensing" },
      { item: "BQLZR 100W 28kHz Ultrasonic Kit", qty: 1, cost: 68.99, category: "Ultrasonic" },
      { item: "Transducer Cable (16AWG Shielded 10ft)", qty: 1, cost: 8, category: "Ultrasonic" },
      { item: "50W Marine Solar Panel", qty: 1, cost: 95, category: "Power" },
      { item: "MPPT Controller (marine)", qty: 1, cost: 55, category: "Power" },
      { item: "24V 20Ah LiFePO4 Battery w/ BMS (480Wh)", qty: 1, cost: 185, category: "Power" },
      { item: "Low Voltage Disconnect (24V)", qty: 1, cost: 35, category: "Power" },
      { item: "Pure Sine Inverter 150W 24VDC→120VAC", qty: 1, cost: 45, category: "Power" },
      { item: "24V to 5V Buck Converter", qty: 1, cost: 8, category: "Power" },
      { item: "4-Channel Relay Module", qty: 1, cost: 8, category: "Power" },
      { item: "HDPE Cylindrical Float Body 21\" Blue", qty: 1, cost: 628, category: "Float" },
      { item: "IP68 Sealed Electronics Bay", qty: 1, cost: 125, category: "Housing" },
      { item: "SS 316 Perforated Sensor Cage", qty: 1, cost: 85, category: "Housing" },
      { item: "Aluminum Frame + Solar Mount", qty: 1, cost: 65, category: "Hardware" },
      { item: "Mooring Anchor (25-50 lbs)", qty: 1, cost: 45, category: "Hardware" },
      { item: "Anchor Chain, Line, Swivel Kit", qty: 1, cost: 55, category: "Hardware" },
      { item: "Marine Cable Glands + Connectors", qty: 1, cost: 35, category: "Hardware" },
    ],
    gpio: {
      i2c: [
        "ADS1115 ADC (0x48) - GPIO2 SDA, GPIO3 SCL",
        "Atlas EZO-DO (0x61) - I2C Bus",
      ],
      oneWire: ["DS18B20 Temperature - GPIO4"],
      uart: ["SIM7670G HAT (GPIO14 TX, GPIO15 RX) - Reserved"],
      gpio: [
        "GPIO17 → Relay 1 → Ultrasonic Driver (Active-LOW)",
        "GPIO23 → Relay 4 → Spare (Active-LOW)",
        "GPIO24 → Status LED (via 330Ω)",
        "GPIO27 → Relay 2 → Spare (Active-LOW)",
        "GPIO22 → Relay 3 → Spare (Active-LOW)",
      ],
    },
    powerTable: [
      { component: "Pi Zero 2 W + HAT", voltage: 5, current: 0.5, duty: 100, avgWatts: 2.5, notes: "Always on" },
      { component: "Sensors (5× standard suite)", voltage: 5, current: 0.09, duty: 100, avgWatts: 0.45, notes: "Continuous sampling" },
      { component: "MPPT Controller", voltage: 24, current: 0.01, duty: 100, avgWatts: 0.25, notes: "Standby" },
      { component: "LVD", voltage: 24, current: 0.006, duty: 100, avgWatts: 0.15, notes: "Monitoring" },
      { component: "Relay Coils (avg)", voltage: 5, current: 0.07, duty: 10, avgWatts: 0.35, notes: "Switching" },
      { component: "Ultrasonic (via Inverter)", voltage: 24, current: 4.79, duty: 4.2, avgWatts: 4.83, notes: "100W + 15% inverter loss" },
    ],
    dailyWh: 130,
  },
  "smart-buoy-xl": {
    id: "smart-buoy-xl",
    sku: "BS-BUOY-XL",
    name: "Smart Buoy XL",
    subtitle: "Research-Grade Platform",
    price: 19999,
    tagline: "Professional research platform with Atlas Scientific sensors",
    deployment: "Floating",
    power: { type: "Solar + Battery", voltage: "24V DC", watts: 300 },
    ultrasonic: { enabled: true, watts: 200, frequency: "28kHz", units: 2, inverterLoss: "17.5%" },
    sensors: 8,
    sensorList: [
      "TDS/Conductivity (Atlas EZO-EC)",
      "Turbidity (Optical Nephelometer)",
      "pH (Atlas EZO-pH)",
      "Dissolved Oxygen (Atlas EZO-DO)",
      "Temperature (PT1000 Marine)",
      "ORP (Atlas EZO-ORP)",
      "Chlorophyll-a (Fluorometer)",
      "Phycocyanin/BGA (Cyanobacteria)",
    ],
    battery: { type: "LiFePO4", voltage: 24, capacity: 100, wh: 2400 },
    solar: { watts: 300, panels: 3 },
    autonomy: "7.5 days",
    weight: "264.6 lbs",
    dimensions: { length: "39.37\"", width: "39.37\"", height: "32.68\"" },
    enclosure: "Triple HDPE Float + IP68 Electronics Bay",
    floatCost: 3897,
    floatDetails: "3× HDPE Teardrop 24\" Blue Floats ($1,299 each)",
    features: [
      "Research-grade platform",
      "~300W solar array (3× 100W panels)",
      "24V 100Ah LiFePO4 battery (2.4kWh)",
      "2× 100W ultrasonic transducers @ 28kHz",
      "8+ Atlas Scientific pro sensors",
      "Lab-grade accuracy",
      "Triple HDPE teardrop floats ($3,897)",
      "Pi CM4 edge computing",
      "Navigation light (dusk-dawn)",
      "Heavy-duty SS 316 sensor cage",
      "7.5 days autonomy without sun",
    ],
    bom: [
      { item: "Raspberry Pi Compute Module 4 (4GB)", qty: 1, cost: 65, category: "Compute" },
      { item: "CM4 IO Board", qty: 1, cost: 35, category: "Compute" },
      { item: "MicroSD Card (SanDisk Industrial 64GB)", qty: 1, cost: 18, category: "Compute" },
      { item: "Waveshare SIM7670G Cat-1/GNSS HAT", qty: 1, cost: 37.99, category: "Connectivity" },
      { item: "Hologram Global IoT SIM", qty: 1, cost: 5, category: "Connectivity" },
      { item: "SMA External 4G/LTE Antenna", qty: 1, cost: 8, category: "Connectivity" },
      { item: "Atlas Scientific EZO-EC Kit (TDS/Conductivity)", qty: 1, cost: 165, category: "Sensing" },
      { item: "Optical Nephelometer (Turbidity)", qty: 1, cost: 75, category: "Sensing" },
      { item: "Atlas Scientific EZO-pH Kit", qty: 1, cost: 145, category: "Sensing" },
      { item: "Atlas Scientific EZO-DO Kit", qty: 1, cost: 178, category: "Sensing" },
      { item: "PT1000 Marine Temperature Probe", qty: 1, cost: 28, category: "Sensing" },
      { item: "Atlas Scientific EZO-ORP Kit", qty: 1, cost: 145, category: "Sensing" },
      { item: "Chlorophyll-a Fluorometer Module", qty: 1, cost: 420, category: "Sensing" },
      { item: "Phycocyanin (BGA) Cyanobacteria Detector", qty: 1, cost: 380, category: "Sensing" },
      { item: "BQLZR 100W 28kHz Ultrasonic Kit", qty: 2, cost: 137.98, category: "Ultrasonic" },
      { item: "Transducer Cable (16AWG Shielded 10ft)", qty: 2, cost: 16, category: "Ultrasonic" },
      { item: "100W Monocrystalline Solar Panel", qty: 3, cost: 225, category: "Power" },
      { item: "Aluminum Tri-Mount Solar Frame", qty: 1, cost: 85, category: "Power" },
      { item: "Victron SmartSolar 100/30 MPPT", qty: 1, cost: 165, category: "Power" },
      { item: "24V 100Ah LiFePO4 Battery w/ BMS (2400Wh)", qty: 1, cost: 549, category: "Power" },
      { item: "Victron BatteryProtect 100A LVD", qty: 1, cost: 65, category: "Power" },
      { item: "Pure Sine Inverter 500W 24VDC→120VAC", qty: 1, cost: 95, category: "Power" },
      { item: "24V to 12V Buck Converter (10A)", qty: 1, cost: 15, category: "Power" },
      { item: "12V to 5V Buck Converter (5A)", qty: 1, cost: 10, category: "Power" },
      { item: "8-Channel Relay Module", qty: 1, cost: 12, category: "Power" },
      { item: "Marine Navigation Light (LED)", qty: 1, cost: 45, category: "Navigation" },
      { item: "HDPE Teardrop Float Body 24\" Blue", qty: 3, cost: 3897, category: "Float" },
      { item: "Aluminum Structural Center Frame", qty: 1, cost: 285, category: "Float" },
      { item: "IP68 Large Electronics Bay", qty: 1, cost: 295, category: "Housing" },
      { item: "Heavy-Duty SS 316 Sensor Cage", qty: 1, cost: 165, category: "Housing" },
      { item: "Dual Transducer Mounting Pockets", qty: 1, cost: 85, category: "Housing" },
      { item: "Mooring Anchor (100-150 lbs)", qty: 1, cost: 125, category: "Hardware" },
      { item: "Heavy-Duty Anchor Chain + Line", qty: 1, cost: 95, category: "Hardware" },
      { item: "Marine Cable Glands + Assemblies", qty: 1, cost: 75, category: "Hardware" },
      { item: "Stainless Mounting Hardware Kit", qty: 1, cost: 65, category: "Hardware" },
    ],
    gpio: {
      i2c: [
        "Atlas EZO-pH (0x63) - I2C Bus",
        "Atlas EZO-DO (0x61) - I2C Bus",
        "Atlas EZO-EC (0x64) - I2C Bus",
        "Atlas EZO-ORP (0x62) - I2C Bus",
        "Atlas EZO-RTD (0x66) - I2C Bus",
      ],
      uart: [
        "SIM7670G HAT (GPIO14 TX, GPIO15 RX) - Reserved",
        "Fluorometer/BGA Sensors (RS-232 via adapter)",
      ],
      gpio: [
        "GPIO17 → Relay 1 → Ultrasonic #1 (Active-LOW)",
        "GPIO18 → Relay 2 → Ultrasonic #2 (Active-LOW)",
        "GPIO23 → Relay 5 → Navigation Light (Active-LOW)",
        "GPIO24 → Status LED (via 330Ω)",
        "GPIO27 → Relay 3 → Spare (Active-LOW)",
        "GPIO22 → Relay 4 → Spare (Active-LOW)",
      ],
      sdi12: ["SDI-12 Bus (future expansion)"],
    },
    powerTable: [
      { component: "Pi CM4 + IO Board", voltage: 5, current: 0.7, duty: 100, avgWatts: 3.5, notes: "Always on" },
      { component: "Sensors (8× pro suite)", voltage: 5, current: 0.36, duty: 100, avgWatts: 1.8, notes: "Pro suite" },
      { component: "MPPT + Monitor", voltage: 24, current: 0.033, duty: 100, avgWatts: 0.8, notes: "Active monitoring" },
      { component: "LVD", voltage: 24, current: 0.008, duty: 100, avgWatts: 0.2, notes: "Protection" },
      { component: "Relay Coils (avg)", voltage: 5, current: 0.12, duty: 15, avgWatts: 0.6, notes: "More switching" },
      { component: "Navigation Light", voltage: 12, current: 0.125, duty: 50, avgWatts: 1.5, notes: "Dusk-dawn" },
      { component: "Ultrasonics ×2 (via Inverter)", voltage: 24, current: 9.79, duty: 4.2, avgWatts: 9.87, notes: "200W + 17.5% inverter loss" },
    ],
    dailyWh: 260,
  },
};

// Benchmark competitors with detailed specifications
const COMPETITORS = {
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
    name: "BlueSignal Smart Buoy",
    priceRange: "$2,499",
    minPrice: 2499,
    maxPrice: 2499,
    weight: "22 lbs (10 kg)",
    deployment: "1 person, kayak/waders sufficient",
    sensors: "5 parameters",
    algaeControl: true,
    coverage: "100m diameter",
    connectivity: "Cat-1 LTE + GPS (Hologram IoT)",
    annualCosts: "~$120 (cellular only)",
    targetMarket: "Farms, golf courses, small lakes, aquaculture",
    features: [
      "2-in-1 monitoring + control",
      "1-person deployment",
      "22 lbs lightweight",
      "Cat-1 LTE + GPS included",
      "$120/year cellular only",
    ],
    limitations: [],
    advantages: [
      "2-in-1 solution (monitoring + algae control)",
      "One-person deployment",
      "Lowest total cost of ownership",
    ],
  },
  bluesignalXL: {
    name: "BlueSignal Smart Buoy XL",
    priceRange: "$19,999",
    minPrice: 19999,
    maxPrice: 19999,
    weight: "264.6 lbs (120 kg)",
    deployment: "2-3 people, boat required",
    sensors: "8+ parameters (research-grade)",
    algaeControl: true,
    coverage: "200m diameter",
    connectivity: "Cat-1 LTE + GPS",
    annualCosts: "~$120 (cellular only)",
    targetMarket: "Reservoirs, research institutions, utilities",
    features: [
      "Research-grade 8+ sensors",
      "Dual 100W ultrasonic",
      "7.5 days autonomy",
      "200m coverage",
    ],
    limitations: [],
    advantages: [
      "Research-grade at fraction of enterprise cost",
      "No vendor lock-in (Pi-based)",
      "$120/year vs $5K-$15K enterprise",
    ],
  },
};

// 5-Year TCO Comparison
const TCO_COMPARISON = {
  enterprise: { upfront: 50000, annual: 10000, fiveYear: 100000 },
  proMonitoring: { upfront: 8000, annual: 1500, fiveYear: 15500 },
  bluesignalBuoy: { upfront: 2499, annual: 120, fiveYear: 3099 },
  bluesignalXL: { upfront: 19999, annual: 120, fiveYear: 20599 },
};

// ============================================================================
// ANIMATIONS
// ============================================================================

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`;

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
// NEW USABILITY STYLED COMPONENTS
// ============================================================================

const FilterBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 24px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  align-items: center;
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const FilterLabel = styled.label`
  font-size: 11px;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const FilterSelect = styled.select`
  padding: 8px 12px;
  font-size: 13px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  color: #e2e8f0;
  cursor: pointer;
  min-width: 140px;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3);
  }

  option {
    background: #1e293b;
    color: #e2e8f0;
  }
`;

const SearchInput = styled.input`
  padding: 8px 12px;
  font-size: 13px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  color: #e2e8f0;
  min-width: 200px;

  &::placeholder {
    color: #64748b;
  }

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3);
  }
`;

const CompareButton = styled.button`
  padding: 8px 16px;
  font-size: 13px;
  font-weight: 600;
  background: ${({ active }) => (active ? "#3b82f6" : "rgba(59, 130, 246, 0.2)")};
  border: 1px solid #3b82f6;
  border-radius: 6px;
  color: #ffffff;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 6px;

  &:hover {
    background: ${({ active }) => (active ? "#2563eb" : "rgba(59, 130, 246, 0.3)")};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const CompareCheckbox = styled.input.attrs({ type: "checkbox" })`
  position: absolute;
  top: 10px;
  right: 10px;
  width: 20px;
  height: 20px;
  cursor: pointer;
  accent-color: #3b82f6;

  ${({ show }) => !show && css`
    display: none;
  `}
`;

const ProductCardWrapper = styled.div`
  position: relative;
`;

const ComparisonPanel = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(15, 23, 42, 0.98), rgba(15, 23, 42, 0.95));
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding: 16px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 100;
  animation: ${fadeIn} 0.3s ease;
  backdrop-filter: blur(8px);
`;

const ComparisonSelectedProducts = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

const ComparisonChip = styled.div`
  background: rgba(59, 130, 246, 0.2);
  border: 1px solid #3b82f6;
  border-radius: 20px;
  padding: 6px 12px;
  font-size: 13px;
  color: #60a5fa;
  display: flex;
  align-items: center;
  gap: 8px;

  button {
    background: none;
    border: none;
    color: #94a3b8;
    cursor: pointer;
    padding: 0;
    font-size: 16px;
    line-height: 1;

    &:hover {
      color: #f87171;
    }
  }
`;

const CompareNowButton = styled.button`
  padding: 10px 24px;
  font-size: 14px;
  font-weight: 600;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  border: none;
  border-radius: 8px;
  color: #ffffff;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const ComparisonModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  animation: ${fadeIn} 0.3s ease;
`;

const ComparisonContent = styled.div`
  background: linear-gradient(135deg, #0c1929 0%, #1a365d 100%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  max-width: 1200px;
  width: 100%;
  max-height: 90vh;
  overflow: auto;
  animation: ${fadeIn} 0.3s ease;
`;

const ComparisonHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  position: sticky;
  top: 0;
  background: rgba(15, 23, 42, 0.95);
  backdrop-filter: blur(8px);
  z-index: 10;
`;

const ComparisonTitle = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
`;

const CloseButton = styled.button`
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
  color: #94a3b8;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    color: #ffffff;
  }
`;

const ComparisonTable = styled.div`
  padding: 24px;
  overflow-x: auto;
`;

const ComparisonRow = styled.div`
  display: grid;
  grid-template-columns: 180px repeat(${({ cols }) => cols}, 1fr);
  gap: 16px;
  padding: 12px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);

  &:last-child {
    border-bottom: none;
  }
`;

const ComparisonLabel = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.03em;
`;

const ComparisonValue = styled.div`
  font-size: 14px;
  color: ${({ highlight }) => (highlight ? "#4ade80" : "#e2e8f0")};
  font-weight: ${({ highlight }) => (highlight ? "600" : "400")};
`;

const ComparisonProductHeader = styled.div`
  text-align: center;
  padding: 16px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
`;

const QuickActions = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const ActionButton = styled.button`
  padding: 8px 16px;
  font-size: 12px;
  font-weight: 600;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  color: #94a3b8;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 6px;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: #ffffff;
    border-color: rgba(255, 255, 255, 0.2);
  }
`;

const KeyboardHint = styled.div`
  font-size: 11px;
  color: #64748b;
  text-align: center;
  margin-top: 16px;

  kbd {
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 4px;
    padding: 2px 6px;
    font-family: monospace;
    margin: 0 2px;
  }
`;

const StickyProductInfo = styled.div`
  position: sticky;
  top: 0;
  background: rgba(15, 23, 42, 0.95);
  backdrop-filter: blur(8px);
  padding: 12px 16px;
  margin: -24px -24px 24px -24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 10;
`;

const CurrentProductName = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #ffffff;

  span {
    color: #94a3b8;
    font-weight: 400;
    margin-left: 8px;
  }
`;

const TabNavigation = styled.div`
  display: flex;
  gap: 8px;
`;

const MiniNavButton = styled.button`
  background: none;
  border: none;
  color: ${({ disabled }) => (disabled ? "#475569" : "#60a5fa")};
  cursor: ${({ disabled }) => (disabled ? "default" : "pointer")};
  font-size: 18px;
  padding: 4px 8px;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    color: #93c5fd;
  }
`;

const NoResults = styled.div`
  text-align: center;
  padding: 48px 24px;
  color: #94a3b8;

  h4 {
    font-size: 18px;
    color: #e2e8f0;
    margin: 0 0 8px;
  }

  p {
    margin: 0;
  }
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
    {/* SKU Badge */}
    {product.sku && (
      <div style={{ marginBottom: 16 }}>
        <span style={{
          background: "rgba(59, 130, 246, 0.2)",
          border: "1px solid #3b82f6",
          borderRadius: 4,
          padding: "4px 12px",
          fontSize: 12,
          fontWeight: 600,
          color: "#60a5fa",
          fontFamily: "monospace"
        }}>
          SKU: {product.sku}
        </span>
      </div>
    )}

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
            <SpecValue>{product.ultrasonic.watts}W × {product.ultrasonic.units} @ {product.ultrasonic.frequency}</SpecValue>
          </SpecCard>
        )}
        {product.battery && (
          <SpecCard>
            <SpecLabel>Battery</SpecLabel>
            <SpecValue>{product.battery.voltage}V {product.battery.capacity}Ah ({product.battery.wh}Wh)</SpecValue>
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
        {product.dimensions && (
          <SpecCard>
            <SpecLabel>Dimensions (L×W×H)</SpecLabel>
            <SpecValue>{product.dimensions.length} × {product.dimensions.width} × {product.dimensions.height}</SpecValue>
          </SpecCard>
        )}
        {product.enclosure && (
          <SpecCard>
            <SpecLabel>Enclosure</SpecLabel>
            <SpecValue>{product.enclosure}</SpecValue>
          </SpecCard>
        )}
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
  const dailyWh = product.dailyWh || totalAvgWatts * 24;
  const batteryWh = product.battery?.wh || 0;
  const calculatedAutonomy = batteryWh > 0 ? (batteryWh / (dailyWh / 24)).toFixed(1) : "N/A";

  return (
    <div>
      <SectionTitle>Power Budget</SectionTitle>
      <div style={{ overflowX: "auto" }}>
        <Table>
          <thead>
            <tr>
              <Th>Component</Th>
              <Th>Voltage</Th>
              <Th>Current (A)</Th>
              <Th>Duty %</Th>
              <Th>Avg Watts</Th>
              <Th style={{ textAlign: "left" }}>Notes</Th>
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
                <Td style={{ textAlign: "left", color: "#94a3b8", fontSize: 12 }}>{row.notes || "—"}</Td>
              </tr>
            ))}
            <TotalRow>
              <Td colSpan={4}>Total Average Power</Td>
              <Td>{totalAvgWatts.toFixed(2)}W</Td>
              <Td></Td>
            </TotalRow>
          </tbody>
        </Table>
      </div>

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
            <SpecValue>{product.solar.watts}W ({product.solar.panels} panel{product.solar.panels > 1 ? "s" : ""})</SpecValue>
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
// COMPARISON VIEW COMPONENT
// ============================================================================

const ProductComparisonView = ({ products, onClose }) => {
  const comparisonFields = [
    { key: "price", label: "Price", format: (v) => `$${v.toLocaleString()}` },
    { key: "deployment", label: "Deployment" },
    { key: "power.type", label: "Power Type", path: true },
    { key: "sensors", label: "Sensors", format: (v) => `${v} parameters` },
    { key: "ultrasonic", label: "Ultrasonic", format: (v) => v?.enabled ? `${v.watts}W @ ${v.frequency}` : "None" },
    { key: "battery", label: "Battery", format: (v) => v ? `${v.voltage}V ${v.capacity}Ah (${v.wh}Wh)` : "N/A" },
    { key: "solar", label: "Solar", format: (v) => v ? `${v.watts}W` : "N/A" },
    { key: "autonomy", label: "Autonomy" },
    { key: "weight", label: "Weight" },
  ];

  const getValue = (product, field) => {
    if (field.path) {
      const keys = field.key.split(".");
      let val = product;
      for (const k of keys) val = val?.[k];
      return field.format ? field.format(val) : val;
    }
    const val = product[field.key];
    return field.format ? field.format(val) : val;
  };

  const findBestValue = (field) => {
    if (field.key === "price") {
      return Math.min(...products.map(p => p.price));
    }
    if (field.key === "sensors") {
      return Math.max(...products.map(p => p.sensors));
    }
    return null;
  };

  return (
    <ComparisonModal onClick={onClose}>
      <ComparisonContent onClick={(e) => e.stopPropagation()}>
        <ComparisonHeader>
          <ComparisonTitle>Product Comparison</ComparisonTitle>
          <CloseButton onClick={onClose}>Close (Esc)</CloseButton>
        </ComparisonHeader>
        <ComparisonTable>
          {/* Product headers */}
          <ComparisonRow cols={products.length}>
            <ComparisonLabel />
            {products.map((p) => (
              <ComparisonProductHeader key={p.id}>
                <ProductName style={{ marginBottom: 4 }}>{p.name}</ProductName>
                <ProductSubtitle style={{ marginBottom: 0 }}>{p.subtitle}</ProductSubtitle>
              </ComparisonProductHeader>
            ))}
          </ComparisonRow>

          {/* Comparison fields */}
          {comparisonFields.map((field) => {
            const bestValue = findBestValue(field);
            return (
              <ComparisonRow key={field.key} cols={products.length}>
                <ComparisonLabel>{field.label}</ComparisonLabel>
                {products.map((p) => {
                  const value = getValue(p, field);
                  const isBest = field.key === "price"
                    ? p.price === bestValue
                    : field.key === "sensors"
                    ? p.sensors === bestValue
                    : false;
                  return (
                    <ComparisonValue key={p.id} highlight={isBest}>
                      {value}
                    </ComparisonValue>
                  );
                })}
              </ComparisonRow>
            );
          })}

          {/* Sensor list */}
          <ComparisonRow cols={products.length}>
            <ComparisonLabel>Sensor List</ComparisonLabel>
            {products.map((p) => (
              <ComparisonValue key={p.id}>
                {p.sensorList.join(", ")}
              </ComparisonValue>
            ))}
          </ComparisonRow>

          {/* BOM Total */}
          <ComparisonRow cols={products.length}>
            <ComparisonLabel>BOM Cost</ComparisonLabel>
            {products.map((p) => {
              const bomTotal = p.bom.reduce((sum, item) => sum + item.cost, 0);
              return (
                <ComparisonValue key={p.id}>
                  ${bomTotal.toLocaleString()}
                </ComparisonValue>
              );
            })}
          </ComparisonRow>

          {/* Margin */}
          <ComparisonRow cols={products.length}>
            <ComparisonLabel>Margin</ComparisonLabel>
            {products.map((p) => {
              const bomTotal = p.bom.reduce((sum, item) => sum + item.cost, 0);
              const margin = ((p.price - bomTotal) / p.price * 100).toFixed(1);
              return (
                <ComparisonValue key={p.id} highlight={parseFloat(margin) >= 40}>
                  {margin}%
                </ComparisonValue>
              );
            })}
          </ComparisonRow>
        </ComparisonTable>
      </ComparisonContent>
    </ComparisonModal>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function BlueSignalConfigurator() {
  const [view, setView] = useState("products");
  const [selectedProduct, setSelectedProduct] = useState("s-ac");
  const [activeTab, setActiveTab] = useState("overview");

  // New state for enhanced features
  const [searchQuery, setSearchQuery] = useState("");
  const [deploymentFilter, setDeploymentFilter] = useState("all");
  const [priceFilter, setPriceFilter] = useState("all");
  const [compareMode, setCompareMode] = useState(false);
  const [compareProducts, setCompareProducts] = useState([]);
  const [showComparison, setShowComparison] = useState(false);

  const containerRef = useRef(null);
  const productIds = Object.keys(PRODUCTS);

  // URL hash sync for deep linking
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash && PRODUCTS[hash]) {
      setSelectedProduct(hash);
    }
  }, []);

  useEffect(() => {
    if (view === "products") {
      window.location.hash = selectedProduct;
    }
  }, [selectedProduct, view]);

  // Filtered products
  const filteredProducts = useMemo(() => {
    return Object.values(PRODUCTS).filter((p) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          p.name.toLowerCase().includes(query) ||
          p.subtitle.toLowerCase().includes(query) ||
          p.tagline.toLowerCase().includes(query) ||
          p.features.some(f => f.toLowerCase().includes(query)) ||
          p.sensorList.some(s => s.toLowerCase().includes(query));
        if (!matchesSearch) return false;
      }

      // Deployment filter
      if (deploymentFilter !== "all" && p.deployment.toLowerCase() !== deploymentFilter) {
        return false;
      }

      // Price filter
      if (priceFilter !== "all") {
        if (priceFilter === "under1000" && p.price >= 1000) return false;
        if (priceFilter === "1000to3000" && (p.price < 1000 || p.price > 3000)) return false;
        if (priceFilter === "over3000" && p.price <= 3000) return false;
      }

      return true;
    });
  }, [searchQuery, deploymentFilter, priceFilter]);

  const product = PRODUCTS[selectedProduct];

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "layout", label: "Layout" },
    { id: "wiring", label: "Wiring" },
    { id: "power", label: "Power" },
    { id: "gpio", label: "GPIO" },
    { id: "bom", label: "BOM" },
  ];

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Escape closes comparison modal
      if (e.key === "Escape") {
        if (showComparison) {
          setShowComparison(false);
          return;
        }
        if (compareMode) {
          setCompareMode(false);
          setCompareProducts([]);
          return;
        }
      }

      // Don't handle if typing in input
      if (e.target.tagName === "INPUT" || e.target.tagName === "SELECT") return;

      const currentIndex = productIds.indexOf(selectedProduct);
      const currentTabIndex = tabs.findIndex(t => t.id === activeTab);

      // Arrow keys for product navigation
      if (e.key === "ArrowLeft" && currentIndex > 0) {
        setSelectedProduct(productIds[currentIndex - 1]);
        setActiveTab("overview");
      } else if (e.key === "ArrowRight" && currentIndex < productIds.length - 1) {
        setSelectedProduct(productIds[currentIndex + 1]);
        setActiveTab("overview");
      }

      // Tab navigation with [ and ]
      if (e.key === "[" && currentTabIndex > 0) {
        setActiveTab(tabs[currentTabIndex - 1].id);
      } else if (e.key === "]" && currentTabIndex < tabs.length - 1) {
        setActiveTab(tabs[currentTabIndex + 1].id);
      }

      // Number keys for direct tab access
      const num = parseInt(e.key);
      if (num >= 1 && num <= tabs.length) {
        setActiveTab(tabs[num - 1].id);
      }

      // 'c' to toggle compare mode
      if (e.key === "c" && !e.ctrlKey && !e.metaKey) {
        setCompareMode(!compareMode);
        if (compareMode) setCompareProducts([]);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedProduct, activeTab, compareMode, showComparison, productIds, tabs]);

  // Toggle product in comparison
  const toggleCompareProduct = (productId) => {
    setCompareProducts((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId);
      }
      if (prev.length >= 4) {
        return prev; // Max 4 products
      }
      return [...prev, productId];
    });
  };

  // Export BOM as CSV
  const exportBomAsCsv = () => {
    const headers = ["Category", "Item", "Quantity", "Cost"];
    const rows = product.bom.map(item => [
      item.category,
      item.item,
      item.qty,
      item.cost
    ]);
    const total = product.bom.reduce((sum, item) => sum + item.cost, 0);
    rows.push(["", "TOTAL", "", total]);

    const csv = [headers, ...rows].map(row => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${product.name}-BOM.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Print specs
  const printSpecs = () => {
    const printWindow = window.open("", "_blank");
    const bomTotal = product.bom.reduce((sum, item) => sum + item.cost, 0);
    printWindow.document.write(`
      <html>
        <head>
          <title>${product.name} Specifications</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; padding: 24px; }
            h1 { color: #1e40af; }
            h2 { color: #374151; margin-top: 24px; }
            table { border-collapse: collapse; width: 100%; margin-top: 16px; }
            th, td { border: 1px solid #e5e7eb; padding: 8px 12px; text-align: left; }
            th { background: #f3f4f6; }
            .price { font-size: 24px; color: #059669; font-weight: bold; }
            ul { margin: 0; padding-left: 20px; }
          </style>
        </head>
        <body>
          <h1>${product.name} - ${product.subtitle}</h1>
          <p class="price">$${product.price.toLocaleString()}</p>
          <p><strong>${product.tagline}</strong></p>

          <h2>Features</h2>
          <ul>${product.features.map(f => `<li>${f}</li>`).join("")}</ul>

          <h2>Specifications</h2>
          <table>
            <tr><th>Deployment</th><td>${product.deployment}</td></tr>
            <tr><th>Power</th><td>${product.power.type}${product.solar ? ` (${product.solar.watts}W Solar)` : ""}</td></tr>
            <tr><th>Sensors</th><td>${product.sensors} parameters</td></tr>
            <tr><th>Autonomy</th><td>${product.autonomy}</td></tr>
            <tr><th>Weight</th><td>${product.weight}</td></tr>
          </table>

          <h2>Sensors</h2>
          <ul>${product.sensorList.map(s => `<li>${s}</li>`).join("")}</ul>

          <h2>Bill of Materials</h2>
          <table>
            <tr><th>Category</th><th>Item</th><th>Qty</th><th>Cost</th></tr>
            ${product.bom.map(item => `<tr><td>${item.category}</td><td>${item.item}</td><td>${item.qty}</td><td>$${item.cost}</td></tr>`).join("")}
            <tr><th colspan="3">Total</th><th>$${bomTotal.toLocaleString()}</th></tr>
          </table>

          <p style="margin-top: 24px; color: #6b7280; font-size: 12px;">
            Generated from BlueSignal Configurator on ${new Date().toLocaleDateString()}
          </p>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const clearFilters = () => {
    setSearchQuery("");
    setDeploymentFilter("all");
    setPriceFilter("all");
  };

  const currentProductIndex = productIds.indexOf(selectedProduct);
  const canGoPrev = currentProductIndex > 0;
  const canGoNext = currentProductIndex < productIds.length - 1;

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
    <ConfiguratorWrapper ref={containerRef}>
      <Container>
        <Header>
          <Logo>
            Blue<span>Signal</span>
          </Logo>
          <Tagline>Water Quality Hardware Configurator</Tagline>
        </Header>

        <NavTabs role="tablist" aria-label="Main navigation">
          <NavTab
            role="tab"
            aria-selected={view === "products"}
            active={view === "products"}
            onClick={() => setView("products")}
          >
            Products
          </NavTab>
          <NavTab
            role="tab"
            aria-selected={view === "benchmark"}
            active={view === "benchmark"}
            onClick={() => setView("benchmark")}
          >
            Benchmark
          </NavTab>
        </NavTabs>

        {view === "products" ? (
          <>
            {/* Filter Bar */}
            <FilterBar>
              <FilterGroup>
                <FilterLabel htmlFor="search">Search</FilterLabel>
                <SearchInput
                  id="search"
                  type="text"
                  placeholder="Search products, features..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label="Search products"
                />
              </FilterGroup>

              <FilterGroup>
                <FilterLabel htmlFor="deployment">Deployment</FilterLabel>
                <FilterSelect
                  id="deployment"
                  value={deploymentFilter}
                  onChange={(e) => setDeploymentFilter(e.target.value)}
                >
                  <option value="all">All Types</option>
                  <option value="shore-mounted">Shore-mounted</option>
                  <option value="floating">Floating</option>
                </FilterSelect>
              </FilterGroup>

              <FilterGroup>
                <FilterLabel htmlFor="price">Price Range</FilterLabel>
                <FilterSelect
                  id="price"
                  value={priceFilter}
                  onChange={(e) => setPriceFilter(e.target.value)}
                >
                  <option value="all">All Prices</option>
                  <option value="under1000">Under $1,000</option>
                  <option value="1000to3000">$1,000 - $3,000</option>
                  <option value="over3000">Over $3,000</option>
                </FilterSelect>
              </FilterGroup>

              <div style={{ flex: 1 }} />

              <CompareButton
                active={compareMode}
                onClick={() => {
                  setCompareMode(!compareMode);
                  if (compareMode) setCompareProducts([]);
                }}
                aria-pressed={compareMode}
              >
                {compareMode ? "Exit Compare" : "Compare Products"}
              </CompareButton>

              {(searchQuery || deploymentFilter !== "all" || priceFilter !== "all") && (
                <ActionButton onClick={clearFilters}>
                  Clear Filters
                </ActionButton>
              )}
            </FilterBar>

            {filteredProducts.length === 0 ? (
              <NoResults>
                <h4>No products match your filters</h4>
                <p>Try adjusting your search or filter criteria</p>
                <ActionButton onClick={clearFilters} style={{ marginTop: 16 }}>
                  Clear All Filters
                </ActionButton>
              </NoResults>
            ) : (
              <ProductGrid role="listbox" aria-label="Products">
                {filteredProducts.map((p) => (
                  <ProductCardWrapper key={p.id}>
                    <CompareCheckbox
                      show={compareMode}
                      checked={compareProducts.includes(p.id)}
                      onChange={() => toggleCompareProduct(p.id)}
                      aria-label={`Compare ${p.name}`}
                    />
                    <ProductCard
                      role="option"
                      aria-selected={selectedProduct === p.id}
                      selected={selectedProduct === p.id}
                      onClick={() => {
                        if (compareMode) {
                          toggleCompareProduct(p.id);
                        } else {
                          setSelectedProduct(p.id);
                          setActiveTab("overview");
                        }
                      }}
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          if (compareMode) {
                            toggleCompareProduct(p.id);
                          } else {
                            setSelectedProduct(p.id);
                            setActiveTab("overview");
                          }
                        }
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
                  </ProductCardWrapper>
                ))}
              </ProductGrid>
            )}

            <DetailPanel>
              <DetailTabs role="tablist" aria-label="Product details">
                {tabs.map((tab, index) => (
                  <DetailTab
                    key={tab.id}
                    role="tab"
                    aria-selected={activeTab === tab.id}
                    aria-controls={`tabpanel-${tab.id}`}
                    active={activeTab === tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    tabIndex={activeTab === tab.id ? 0 : -1}
                  >
                    <span style={{ opacity: 0.5, marginRight: 4 }}>{index + 1}</span>
                    {tab.label}
                  </DetailTab>
                ))}
              </DetailTabs>
              <DetailContent
                role="tabpanel"
                id={`tabpanel-${activeTab}`}
                aria-labelledby={activeTab}
              >
                {/* Sticky product info header */}
                <StickyProductInfo>
                  <CurrentProductName>
                    {product.name}
                    <span>{product.subtitle}</span>
                  </CurrentProductName>
                  <TabNavigation>
                    <MiniNavButton
                      disabled={!canGoPrev}
                      onClick={() => {
                        if (canGoPrev) {
                          setSelectedProduct(productIds[currentProductIndex - 1]);
                          setActiveTab("overview");
                        }
                      }}
                      aria-label="Previous product"
                      title="Previous product (Left Arrow)"
                    >
                      ←
                    </MiniNavButton>
                    <MiniNavButton
                      disabled={!canGoNext}
                      onClick={() => {
                        if (canGoNext) {
                          setSelectedProduct(productIds[currentProductIndex + 1]);
                          setActiveTab("overview");
                        }
                      }}
                      aria-label="Next product"
                      title="Next product (Right Arrow)"
                    >
                      →
                    </MiniNavButton>
                  </TabNavigation>
                </StickyProductInfo>

                {renderTabContent()}

                {/* Quick Actions */}
                <QuickActions>
                  <ActionButton onClick={printSpecs} title="Print product specifications">
                    Print Specs
                  </ActionButton>
                  <ActionButton onClick={exportBomAsCsv} title="Export BOM as CSV file">
                    Export BOM (CSV)
                  </ActionButton>
                  <ActionButton
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                    }}
                    title="Copy link to this product"
                  >
                    Copy Link
                  </ActionButton>
                </QuickActions>
              </DetailContent>
            </DetailPanel>

            <KeyboardHint>
              <kbd>←</kbd><kbd>→</kbd> Navigate products |
              <kbd>1</kbd>-<kbd>6</kbd> Switch tabs |
              <kbd>C</kbd> Compare mode |
              <kbd>Esc</kbd> Exit
            </KeyboardHint>
          </>
        ) : (
          <DetailPanel>
            <DetailContent>
              <BenchmarkView />
            </DetailContent>
          </DetailPanel>
        )}
      </Container>

      {/* Comparison Panel */}
      {compareMode && compareProducts.length > 0 && (
        <ComparisonPanel>
          <ComparisonSelectedProducts>
            <span style={{ color: "#94a3b8", fontSize: 13 }}>
              Comparing ({compareProducts.length}/4):
            </span>
            {compareProducts.map((id) => (
              <ComparisonChip key={id}>
                {PRODUCTS[id].name}
                <button onClick={() => toggleCompareProduct(id)} aria-label={`Remove ${PRODUCTS[id].name} from comparison`}>
                  ×
                </button>
              </ComparisonChip>
            ))}
          </ComparisonSelectedProducts>
          <CompareNowButton
            disabled={compareProducts.length < 2}
            onClick={() => setShowComparison(true)}
          >
            Compare {compareProducts.length} Products
          </CompareNowButton>
        </ComparisonPanel>
      )}

      {/* Comparison Modal */}
      {showComparison && (
        <ProductComparisonView
          products={compareProducts.map((id) => PRODUCTS[id])}
          onClose={() => setShowComparison(false)}
        />
      )}
    </ConfiguratorWrapper>
  );
}
