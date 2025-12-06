// Wire Colors, Connectors, and Fuse Specifications

export const WIRE_COLORS = {
  power: {
    batteryPositive: { hex: "#dc2626", name: "Red", gauge: "10-12 AWG" },
    batteryNegative: { hex: "#1f2937", name: "Black", gauge: "10-12 AWG" },
    solarPositive: { hex: "#dc2626", name: "Red", gauge: "10 AWG", connector: "MC4" },
    solarNegative: { hex: "#1f2937", name: "Black", gauge: "10 AWG", connector: "MC4" },
  },
  dcRails: {
    rail24V: { hex: "#dc2626", name: "Red", gauge: "14 AWG" },
    rail12V: { hex: "#f97316", name: "Orange", gauge: "18 AWG" },
    rail5V: { hex: "#22c55e", name: "Green", gauge: "22 AWG" },
    rail3V3: { hex: "#eab308", name: "Yellow", gauge: "24 AWG" },
    ground: { hex: "#1f2937", name: "Black", gauge: "Match positive" },
  },
  signals: {
    i2cSDA: { hex: "#7c3aed", name: "Purple", gauge: "24 AWG" },
    i2cSCL: { hex: "#6366f1", name: "Blue", gauge: "24 AWG" },
    gpioControl: { hex: "#22c55e", name: "Green", gauge: "22 AWG" },
  },
  sensors: {
    tdsSignal: { hex: "#0891b2", name: "Cyan", gauge: "24 AWG" },
    turbiditySignal: { hex: "#0d9488", name: "Teal", gauge: "24 AWG" },
    phSignal: { hex: "#db2777", name: "Pink", gauge: "24 AWG" },
  },
  ac: {
    acHot: { hex: "#1f2937", name: "Black", gauge: "14-16 AWG" },
    acNeutral: { hex: "#f3f4f6", name: "White", gauge: "14-16 AWG" },
    acGround: { hex: "#22c55e", name: "Green", gauge: "14-16 AWG" },
  },
  ultrasonic: {
    ultrasonicPair: { hex: "#7c3aed", name: "Shielded twisted pair", gauge: "16 AWG" },
  },
};

export const CONNECTORS = {
  batteryToMPPT: "Anderson SB50 (45A red)",
  mpptToLVD: "Anderson SB50 or screw terminal",
  lvdToLoads: "Screw terminal block",
  solarToMPPT: "MC4 (pre-wired on panel)",
  buckInput: "Screw terminal",
  buckOutput: "Screw terminal or JST-XH",
  piGPIO: "DuPont 2.54mm female",
  hatStacking: "40-pin stacking header",
  relayControl: "DuPont or JST-XH",
  relayLoad: "Screw terminal (up to 10A)",
  sensorPower: "JST-XH 2-pin",
  sensorSignal: "JST-XH 3-pin (V+, Signal, GND)",
  adcToSensors: "JST-XH or screw terminal",
  phProbe: "BNC female on module",
  ultrasonicDriver: "Screw terminal (AC input)",
  transducer: "Screw terminal (shielded cable)",
  acMains: "3-position terminal block (L/N/G)",
};

export const FUSES = {
  batteryMain: { rating: "60A ANL", location: "Positive terminal", products: ["s-sol", "smart-buoy", "smart-buoy-xl"] },
  inverterInput: { rating: "30A ANL", location: "Inverter positive lead", products: ["s-sol", "smart-buoy", "smart-buoy-xl"] },
  acInput: { rating: "5A 250V", location: "After terminal block", products: ["s-ac"] },
  dcBranch: { rating: "10A ATC", location: "Each major branch", products: "all" },
};

export default { WIRE_COLORS, CONNECTORS, FUSES };
