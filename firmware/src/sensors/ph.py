"""pH sensor: ADC voltage -> pH value with Nernst temperature compensation.

Reads from ADS1115 U1 (0x48), AIN0. The OPA340 buffer shifts the probe
output to a 0-3.3 V range centered at offset_voltage (~1.65 V = pH 7).
"""

import logging

log = logging.getLogger("wqm.ph")

DEFAULT_CAL = {
    "point_low": {"ph": 4.01, "voltage": 1.05},
    "point_high": {"ph": 6.86, "voltage": 1.50},
}


class PHSensor:
    def __init__(self, adc, config: dict, calibration: dict = None):
        self.adc = adc
        self.channel = config.get("adc_channel", 0)
        self.gain = config.get("gain", 1)
        self.samples = config.get("averaging_samples", 5)

        cal = calibration if calibration and "point_low" in calibration else DEFAULT_CAL
        v_low = cal["point_low"]["voltage"]
        v_high = cal["point_high"]["voltage"]
        ph_low = cal["point_low"]["ph"]
        ph_high = cal["point_high"]["ph"]

        if abs(v_high - v_low) < 0.001:
            log.warning("pH calibration voltages too close, using defaults")
            v_low = DEFAULT_CAL["point_low"]["voltage"]
            v_high = DEFAULT_CAL["point_high"]["voltage"]
            ph_low = DEFAULT_CAL["point_low"]["ph"]
            ph_high = DEFAULT_CAL["point_high"]["ph"]

        self.slope = (ph_high - ph_low) / (v_high - v_low)
        self.intercept = ph_low - self.slope * v_low
        log.info("pH calibration: slope=%.4f, intercept=%.4f", self.slope, self.intercept)

    def read_voltage(self) -> float:
        """Read raw voltage from pH probe (for calibration)."""
        return self.adc.read_channel(self.channel, self.gain, self.samples)

    def read(self, temperature_c: float = None) -> float:
        """Read pH with optional Nernst temperature compensation."""
        voltage = self.read_voltage()
        ph = self.slope * voltage + self.intercept

        if temperature_c is not None:
            nernst_25 = 59.16
            nernst_t = ((temperature_c + 273.15) / 298.15) * nernst_25
            correction = (nernst_t - nernst_25) / nernst_25
            ph = ph * (1 + correction * (ph - 7.0) / 7.0)

        ph = max(0.0, min(14.0, ph))
        log.debug("pH: voltage=%.4fV, ph=%.2f, temp_comp=%s", voltage, ph, temperature_c)
        return round(ph, 2)

    def calibrate(self, ph_low_voltage, ph_high_voltage, ph_low=4.01, ph_high=6.86):
        """Two-point calibration. Returns calibration dict."""
        if abs(ph_high_voltage - ph_low_voltage) < 0.01:
            log.error("Calibration failed: voltages too close")
            return None

        self.slope = (ph_high - ph_low) / (ph_high_voltage - ph_low_voltage)
        self.intercept = ph_low - self.slope * ph_low_voltage

        return {
            "point_low": {"ph": ph_low, "voltage": round(ph_low_voltage, 4)},
            "point_high": {"ph": ph_high, "voltage": round(ph_high_voltage, 4)},
        }
