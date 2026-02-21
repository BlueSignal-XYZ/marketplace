"""Turbidity sensor: ADC voltage -> NTU.

Reads from ADS1115 U1 (0x48), AIN2. IR 850 nm LED + OPA380 TIA.
Polynomial conversion maps voltage to NTU.
"""

import logging

log = logging.getLogger("wqm.turbidity")

DEFAULT_COEFF_A = -1120.4
DEFAULT_COEFF_B = 5742.3
DEFAULT_COEFF_C = -4352.9


class TurbiditySensor:
    def __init__(self, adc, config: dict, calibration: dict = None):
        self.adc = adc
        self.channel = config.get("adc_channel", 2)
        self.gain = config.get("gain", 1)
        self.samples = config.get("averaging_samples", 5)

        cal = calibration or {}
        self.coeff_a = cal.get("coeff_a", DEFAULT_COEFF_A)
        self.coeff_b = cal.get("coeff_b", DEFAULT_COEFF_B)
        self.coeff_c = cal.get("coeff_c", DEFAULT_COEFF_C)

    def read(self) -> float:
        """Read turbidity in NTU."""
        voltage = self.adc.read_channel(self.channel, self.gain, self.samples)
        ntu = self.coeff_a * voltage * voltage + self.coeff_b * voltage + self.coeff_c
        ntu = max(0.0, min(4000.0, ntu))
        log.debug("Turbidity: voltage=%.4fV, ntu=%.1f", voltage, ntu)
        return round(ntu, 1)
