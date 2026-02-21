"""TDS (Total Dissolved Solids) sensor: ADC voltage -> ppm.

Reads from ADS1115 U1 (0x48), AIN1. AC excitation circuit with
demodulated output. Temperature compensation uses the standard
0.02/degC coefficient.
"""

import logging

log = logging.getLogger("wqm.tds")

TEMP_COEFF = 0.02
REF_TEMP = 25.0
DEFAULT_FACTOR = 500.0
DEFAULT_OFFSET = 0.0


class TDSSensor:
    def __init__(self, adc, config: dict, calibration: dict = None):
        self.adc = adc
        self.channel = config.get("adc_channel", 1)
        self.gain = config.get("gain", 1)
        self.samples = config.get("averaging_samples", 5)
        self.temp_compensation = config.get("temperature_compensation", True)

        cal = calibration or {}
        self.factor = cal.get("factor", DEFAULT_FACTOR)
        self.offset = cal.get("offset", DEFAULT_OFFSET)
        log.info("TDS calibration: factor=%.2f, offset=%.2f", self.factor, self.offset)

    def read_voltage(self) -> float:
        """Read raw voltage from TDS probe (for calibration)."""
        return self.adc.read_channel(self.channel, self.gain, self.samples)

    def read(self, temperature_c: float = None) -> float:
        """Read TDS in ppm with optional temperature compensation."""
        voltage = self.read_voltage()
        tds_raw = self.factor * voltage + self.offset
        tds_raw = max(0.0, tds_raw)

        if self.temp_compensation and temperature_c is not None:
            compensation = 1.0 + TEMP_COEFF * (temperature_c - REF_TEMP)
            if compensation > 0:
                tds_raw = tds_raw / compensation

        tds_raw = max(0.0, min(5000.0, tds_raw))
        log.debug("TDS: voltage=%.4fV, ppm=%.1f, temp=%s", voltage, tds_raw, temperature_c)
        return round(tds_raw, 1)
