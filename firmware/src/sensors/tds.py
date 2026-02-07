"""
TDS (Total Dissolved Solids) / Conductivity Sensor Driver

Reads TDS from a conductivity probe on ADC channel 0 of the ADS1115.
Applies temperature compensation using the DS18B20 reading.

The probe outputs a voltage proportional to the dissolved solids concentration.
A conversion factor translates voltage to ppm (parts per million).

Temperature compensation formula:
    TDS_compensated = TDS_raw / (1.0 + 0.02 * (temperature - 25.0))
    where 0.02 is the standard compensation coefficient for most solutions.
"""

import logging

logger = logging.getLogger(__name__)

# ADC channel for TDS probe
TDS_ADC_CHANNEL = 0

# Default conversion: voltage to ppm
# This depends on the specific TDS probe and circuit gain.
# Typical analog TDS modules output 0-2.3V for 0-1000ppm.
DEFAULT_TDS_FACTOR = 500.0   # ppm per volt (adjustable per probe)
DEFAULT_TDS_OFFSET = 0.0     # ppm offset

# Temperature compensation coefficient
TEMP_COMPENSATION_COEFF = 0.02
REFERENCE_TEMPERATURE = 25.0  # Celsius


class TDSSensor:
    """
    TDS/conductivity sensor on ADS1115 channel 0.

    Usage:
        tds = TDSSensor(adc_reader)
        tds.initialize()
        value = tds.read(temperature=22.5)  # temperature-compensated
    """

    def __init__(self, adc_reader, channel=TDS_ADC_CHANNEL, calibration=None):
        self.adc = adc_reader
        self.channel = channel
        self.factor = DEFAULT_TDS_FACTOR
        self.offset = DEFAULT_TDS_OFFSET

        if calibration:
            self.factor = calibration.get("factor", DEFAULT_TDS_FACTOR)
            self.offset = calibration.get("offset", DEFAULT_TDS_OFFSET)
            logger.info("TDS calibration loaded: factor=%.2f, offset=%.2f",
                        self.factor, self.offset)

    def initialize(self):
        """Initialize TDS sensor (ADC must already be initialized)."""
        logger.info("TDS sensor initialized on ADC channel %d", self.channel)
        return True

    def read_raw(self):
        """
        Read raw TDS value without temperature compensation.

        Returns:
            float: TDS in ppm (uncorrected), or None on error.
        """
        voltage = self.adc.read_voltage(self.channel)
        if voltage is None:
            logger.error("Failed to read TDS: ADC returned None")
            return None

        tds_raw = self.factor * voltage + self.offset
        tds_raw = max(0.0, tds_raw)

        logger.debug("TDS raw: voltage=%.4fV -> %.1f ppm", voltage, tds_raw)
        return round(tds_raw, 1)

    def read(self, temperature=None):
        """
        Read temperature-compensated TDS value.

        Args:
            temperature: Water temperature in Celsius (from DS18B20).
                         If None, no compensation is applied.

        Returns:
            float: TDS in ppm (compensated), or None on error.
        """
        tds_raw = self.read_raw()
        if tds_raw is None:
            return None

        if temperature is not None:
            compensation = 1.0 + TEMP_COMPENSATION_COEFF * (
                temperature - REFERENCE_TEMPERATURE
            )
            if compensation > 0:
                tds_compensated = tds_raw / compensation
            else:
                tds_compensated = tds_raw
                logger.warning("Invalid temperature compensation, using raw value")
        else:
            tds_compensated = tds_raw

        tds_compensated = max(0.0, min(5000.0, tds_compensated))

        logger.debug(
            "TDS: raw=%.1f ppm, temp=%.1f°C -> compensated=%.1f ppm",
            tds_raw,
            temperature if temperature else 0,
            tds_compensated,
        )
        return round(tds_compensated, 1)

    def read_voltage(self):
        """Read raw voltage from TDS probe (for calibration)."""
        return self.adc.read_voltage(self.channel)
