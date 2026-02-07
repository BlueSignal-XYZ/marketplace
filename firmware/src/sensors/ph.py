"""
pH Sensor Driver

Reads pH from a BNC-connected pH probe via the OPA340 buffer amplifier
on ADC channel 3 of the ADS1115.

Calibration: Two-point calibration using pH 4.0 and pH 7.0 buffer solutions.
The probe outputs a voltage proportional to pH, centered around ~2.5V at pH 7
(with the OPA340 level-shifting circuit). The relationship is linear:

    pH = slope * voltage + offset

where slope and offset are determined during calibration.
"""

import logging

logger = logging.getLogger(__name__)

# Default calibration values (typical for a standard pH probe + OPA340 buffer)
# These should be overridden by calibration data from config.yaml
DEFAULT_PH7_VOLTAGE = 2.50   # Voltage at pH 7.0
DEFAULT_PH4_VOLTAGE = 3.04   # Voltage at pH 4.0
DEFAULT_SLOPE = -5.556        # pH units per volt (negative: higher V = lower pH)
DEFAULT_OFFSET = 20.89        # pH at 0V (from linear fit)

# ADC channel for pH probe
PH_ADC_CHANNEL = 3


class PHSensor:
    """
    pH sensor connected via BNC to OPA340 buffer on ADS1115 channel 3.

    Usage:
        ph = PHSensor(adc_reader)
        ph.initialize()
        value = ph.read()  # returns pH value (0-14)
    """

    def __init__(self, adc_reader, channel=PH_ADC_CHANNEL, calibration=None):
        self.adc = adc_reader
        self.channel = channel
        self.slope = DEFAULT_SLOPE
        self.offset = DEFAULT_OFFSET

        if calibration:
            self._apply_calibration(calibration)

    def _apply_calibration(self, cal):
        """
        Apply two-point calibration from config.

        Args:
            cal: dict with keys 'ph4_voltage', 'ph7_voltage' or 'slope', 'offset'
        """
        if "slope" in cal and "offset" in cal:
            self.slope = cal["slope"]
            self.offset = cal["offset"]
            logger.info("pH calibration loaded: slope=%.4f, offset=%.4f",
                        self.slope, self.offset)
        elif "ph4_voltage" in cal and "ph7_voltage" in cal:
            v4 = cal["ph4_voltage"]
            v7 = cal["ph7_voltage"]
            if abs(v4 - v7) < 0.01:
                logger.warning("pH calibration voltages too close, using defaults")
                return
            self.slope = (4.0 - 7.0) / (v4 - v7)
            self.offset = 7.0 - self.slope * v7
            logger.info(
                "pH two-point calibration: V4=%.3f, V7=%.3f -> slope=%.4f, offset=%.4f",
                v4, v7, self.slope, self.offset,
            )
        else:
            logger.warning("Invalid pH calibration data, using defaults")

    def initialize(self):
        """Initialize pH sensor (ADC must already be initialized)."""
        logger.info("pH sensor initialized on ADC channel %d", self.channel)
        return True

    def read(self):
        """
        Read current pH value.

        Returns:
            float: pH value (0.0 - 14.0), or None on error.
        """
        voltage = self.adc.read_voltage(self.channel)
        if voltage is None:
            logger.error("Failed to read pH: ADC returned None")
            return None

        ph_value = self.slope * voltage + self.offset

        # Clamp to valid pH range
        ph_value = max(0.0, min(14.0, ph_value))

        logger.debug("pH: voltage=%.4fV -> pH=%.2f", voltage, ph_value)
        return round(ph_value, 2)

    def read_voltage(self):
        """Read raw voltage from pH probe (for calibration)."""
        return self.adc.read_voltage(self.channel)

    def calibrate(self, ph4_voltage, ph7_voltage):
        """
        Perform two-point calibration.

        Args:
            ph4_voltage: Voltage reading in pH 4.0 buffer
            ph7_voltage: Voltage reading in pH 7.0 buffer

        Returns:
            dict: Calibration parameters {slope, offset, ph4_voltage, ph7_voltage}
        """
        if abs(ph4_voltage - ph7_voltage) < 0.01:
            logger.error("Calibration failed: voltages too close")
            return None

        self.slope = (4.0 - 7.0) / (ph4_voltage - ph7_voltage)
        self.offset = 7.0 - self.slope * ph7_voltage

        cal_data = {
            "slope": self.slope,
            "offset": self.offset,
            "ph4_voltage": ph4_voltage,
            "ph7_voltage": ph7_voltage,
        }

        logger.info("pH calibration complete: %s", cal_data)
        return cal_data
