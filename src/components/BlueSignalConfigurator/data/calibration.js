// Sensor Calibration Formulas and Data

export const CALIBRATION = {
  tds: {
    name: "TDS (Total Dissolved Solids)",
    formula: "ppm = (voltage / 2.3) × 1000",
    voltageRange: "0-2.3V",
    outputRange: "0-1000 ppm",
    temperatureCompensation: "TDS_compensated = TDS_raw × (1 + 0.02 × (temp - 25))",
    calibrationPoints: [
      { standard: "500 ppm NaCl solution", expectedVoltage: "~1.15V" },
      { standard: "1000 ppm NaCl solution", expectedVoltage: "~2.3V" },
    ],
    interval: "90 days",
  },
  turbidity: {
    name: "Turbidity",
    formula: "NTU = -1120.4 × V² + 5742.3 × V - 4352.9",
    voltageRange: "0-4.5V (at 5V supply)",
    outputRange: "0-3000 NTU",
    notes: "Polynomial fit from DFRobot SEN0189 datasheet",
    calibrationPoints: [
      { standard: "0 NTU (distilled water)", expectedVoltage: "~4.1V" },
      { standard: "100 NTU standard", expectedVoltage: "~3.5V" },
    ],
    interval: "90 days",
  },
  ph: {
    name: "pH",
    formula: "pH = 7.0 + ((V_neutral - V_measured) / slope)",
    defaultSlope: "0.18 V/pH at 25°C",
    neutralVoltage: "2.5V at pH 7.0 (module dependent)",
    temperatureCompensation: "slope_adj = slope × (273.15 + temp) / 298.15",
    twoPointCalibration: "slope = (V_pH7 - V_pH4) / (7.0 - 4.0); pH = 7.0 + ((V_pH7 - V_measured) / slope)",
    calibrationPoints: [
      { standard: "pH 7.0 buffer", action: "Record as neutral voltage point" },
      { standard: "pH 4.0 buffer", action: "Calculate slope from difference" },
    ],
    interval: "30 days",
    probeReplacement: "12-18 months ($28.79)",
  },
  dissolvedOxygen: {
    name: "Dissolved Oxygen",
    formula: "DO_mg/L = (voltage / cal_voltage) × saturation_at_temp_pressure",
    saturationTable: {
      "15°C": "10.08 mg/L",
      "20°C": "9.09 mg/L",
      "25°C": "8.26 mg/L",
      "30°C": "7.56 mg/L",
    },
    pressureCompensation: "DO_corrected = DO_raw × (local_pressure / 101.325)",
    calibrationPoints: [
      { standard: "Air-saturated water", action: "Set 100% saturation point" },
      { standard: "Zero-oxygen solution (Na₂SO₃)", action: "Optional zero calibration" },
    ],
    interval: "14 days (membrane calibration)",
    membraneReplacement: "12 months ($25 cap + electrolyte)",
  },
  voltageMonitor: {
    name: "Battery Voltage Monitor",
    formula: "V_battery = V_adc × (R1 + R2) / R2",
    configurations: {
      "24V system": { R1: "20kΩ", R2: "3.3kΩ", ratio: "7.06×", maxInput: "28.4V → 4.02V ADC" },
      "12V system": { R1: "10kΩ", R2: "3.3kΩ", ratio: "4.03×", maxInput: "14.4V → 3.57V ADC" },
    },
    notes: "Use 1% tolerance resistors for accuracy",
  },
};

export default CALIBRATION;
