"""
Turbidity Sensor Driver

Reads turbidity from an analog turbidity sensor on ADC channel 1 of the ADS1115.
Converts voltage to NTU (Nephelometric Turbidity Units).

Typical analog turbidity sensors output higher voltage for clearer water:
  - ~4.2V = 0 NTU (clear water)
  - ~2.5V = ~1000 NTU (very turbid)

The voltage-to-NTU relationship is approximately:
    NTU = -1120.4 * voltage^2 + 5742.3 * voltage - 4352.9

Or a simpler linear approximation can be used with calibration.
"""

import logging

logger = logging.getLogger(__name__)

# ADC channel for turbidity sensor
TURBIDITY_ADC_CHANNEL = 1

# Default polynomial coefficients for voltage -> NTU conversion
# Based on common SEN0189-type turbidity sensors
DEFAULT_COEFF_A = -1120.4
DEFAULT_COEFF_B = 5742.3
DEFAULT_COEFF_C = -4352.9


class TurbiditySensor:
    """
    Turbidity sensor on ADS1115 channel 1.

    Usage:
        turb = TurbiditySensor(adc_reader)
        turb.initialize()
        value = turb.read()  # returns NTU
    """

    def __init__(self, adc_reader, channel=TURBIDITY_ADC_CHANNEL, calibration=None):
        self.adc = adc_reader
        self.channel = channel
        self.coeff_a = DEFAULT_COEFF_A
        self.coeff_b = DEFAULT_COEFF_B
        self.coeff_c = DEFAULT_COEFF_C

        if calibration:
            self.coeff_a = calibration.get("coeff_a", DEFAULT_COEFF_A)
            self.coeff_b = calibration.get("coeff_b", DEFAULT_COEFF_B)
            self.coeff_c = calibration.get("coeff_c", DEFAULT_COEFF_C)
            logger.info(
                "Turbidity calibration loaded: a=%.2f, b=%.2f, c=%.2f",
                self.coeff_a, self.coeff_b, self.coeff_c,
            )

    def initialize(self):
        """Initialize turbidity sensor (ADC must already be initialized)."""
        logger.info("Turbidity sensor initialized on ADC channel %d", self.channel)
        return True

    def read(self):
        """
        Read turbidity in NTU.

        Returns:
            float: Turbidity in NTU (0-1000+), or None on error.
        """
        voltage = self.adc.read_voltage(self.channel)
        if voltage is None:
            logger.error("Failed to read turbidity: ADC returned None")
            return None

        # Polynomial conversion: voltage -> NTU
        ntu = (
            self.coeff_a * voltage * voltage
            + self.coeff_b * voltage
            + self.coeff_c
        )

        # Clamp to valid range
        ntu = max(0.0, min(4000.0, ntu))

        logger.debug("Turbidity: voltage=%.4fV -> %.1f NTU", voltage, ntu)
        return round(ntu, 1)

    def read_voltage(self):
        """Read raw voltage from turbidity sensor (for calibration)."""
        return self.adc.read_voltage(self.channel)
