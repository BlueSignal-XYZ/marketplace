"""
ADS1115 16-bit ADC Reader via I2C

The ADS1115 on the BlueSignal carrier board reads four analog channels:
  - Channel 0: TDS/conductivity probe
  - Channel 1: Turbidity sensor
  - Channel 2: Reserved (ORP or additional sensor)
  - Channel 3: pH probe (via OPA340 buffer amplifier, BNC connector)

Hardware: ADS1115 at I2C address 0x48 on I2C bus 1 (GPIO2=SDA, GPIO3=SCL)
"""

import logging
import time

logger = logging.getLogger(__name__)

# Default I2C address for ADS1115
ADS1115_ADDRESS = 0x48
I2C_BUS = 1

# ADS1115 gain settings: maps gain enum to voltage range
GAIN_MAP = {
    "2/3": 6.144,  # +/- 6.144V (default, never exceeds VDD+0.3V)
    "1": 4.096,     # +/- 4.096V
    "2": 2.048,     # +/- 2.048V
    "4": 1.024,     # +/- 1.024V
    "8": 0.512,     # +/- 0.512V
    "16": 0.256,    # +/- 0.256V
}

# Data rate settings (samples per second)
DATA_RATES = {
    8: 0x0000,
    16: 0x0020,
    32: 0x0040,
    64: 0x0060,
    128: 0x0080,   # Default
    250: 0x00A0,
    475: 0x00C0,
    860: 0x00E0,
}


class ADCReader:
    """
    Reads the ADS1115 16-bit ADC over I2C.

    Usage:
        adc = ADCReader()
        voltage = adc.read_voltage(channel=0)
        raw = adc.read_raw(channel=3)
    """

    def __init__(self, address=ADS1115_ADDRESS, bus=I2C_BUS, gain="2/3"):
        self.address = address
        self.bus_num = bus
        self.gain = gain
        self.voltage_range = GAIN_MAP.get(gain, 6.144)
        self._i2c = None
        self._ads = None

    def initialize(self):
        """Initialize the I2C bus and ADS1115."""
        try:
            import board
            import busio
            import adafruit_ads1x15.ads1115 as ADS
            from adafruit_ads1x15.analog_in import AnalogIn

            self._i2c = busio.I2C(board.SCL, board.SDA)
            self._ads = ADS.ADS1115(self._i2c, address=self.address)

            # Set gain
            gain_values = {
                "2/3": ADS.P_ADS1115_CONFIG_PGA.PGA_6_144V
                if hasattr(ADS, "P_ADS1115_CONFIG_PGA")
                else 0,
                "1": 1,
                "2": 2,
                "4": 4,
                "8": 8,
                "16": 16,
            }
            # adafruit_ads1x15 uses numeric gain values
            numeric_gain = {
                "2/3": 2 / 3,
                "1": 1,
                "2": 2,
                "4": 4,
                "8": 8,
                "16": 16,
            }
            self._ads.gain = numeric_gain.get(self.gain, 2 / 3)
            self._ads.data_rate = 128  # 128 SPS default

            logger.info(
                "ADS1115 initialized at 0x%02X, gain=%s, range=+/-%.3fV",
                self.address,
                self.gain,
                self.voltage_range,
            )
            return True

        except Exception as e:
            logger.error("Failed to initialize ADS1115: %s", e)
            return False

    def read_raw(self, channel):
        """
        Read raw ADC value from a single-ended channel (0-3).

        Returns:
            int: Raw 16-bit signed value (-32768 to 32767), or None on error.
        """
        if self._ads is None:
            logger.error("ADS1115 not initialized")
            return None

        try:
            from adafruit_ads1x15.analog_in import AnalogIn
            import adafruit_ads1x15.ads1115 as ADS

            channel_pins = {
                0: ADS.P0,
                1: ADS.P1,
                2: ADS.P2,
                3: ADS.P3,
            }
            if channel not in channel_pins:
                logger.error("Invalid ADC channel: %d (must be 0-3)", channel)
                return None

            analog = AnalogIn(self._ads, channel_pins[channel])
            return analog.value

        except Exception as e:
            logger.error("ADC read error on channel %d: %s", channel, e)
            return None

    def read_voltage(self, channel):
        """
        Read voltage from a single-ended channel (0-3).

        Returns:
            float: Voltage in volts, or None on error.
        """
        if self._ads is None:
            logger.error("ADS1115 not initialized")
            return None

        try:
            from adafruit_ads1x15.analog_in import AnalogIn
            import adafruit_ads1x15.ads1115 as ADS

            channel_pins = {
                0: ADS.P0,
                1: ADS.P1,
                2: ADS.P2,
                3: ADS.P3,
            }
            if channel not in channel_pins:
                logger.error("Invalid ADC channel: %d (must be 0-3)", channel)
                return None

            analog = AnalogIn(self._ads, channel_pins[channel])
            return analog.voltage

        except Exception as e:
            logger.error("ADC voltage read error on channel %d: %s", channel, e)
            return None

    def read_all_channels(self):
        """
        Read voltage from all four channels.

        Returns:
            dict: {0: voltage, 1: voltage, 2: voltage, 3: voltage}
        """
        results = {}
        for ch in range(4):
            results[ch] = self.read_voltage(ch)
            time.sleep(0.01)  # Small delay between channel reads
        return results

    def shutdown(self):
        """Release I2C resources."""
        if self._i2c is not None:
            try:
                self._i2c.deinit()
            except Exception:
                pass
            self._i2c = None
            self._ads = None
            logger.info("ADS1115 shutdown complete")
