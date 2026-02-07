"""
Cayenne LPP (Low Power Payload) Encoder

Encodes sensor data into compact binary format recognized by TTN v3's
built-in Cayenne LPP decoder. This minimizes LoRaWAN airtime.

Reference: https://docs.mydevices.com/docs/lorawan/cayenne-lpp

Data Types Used:
  - 0x67: Temperature (0.1°C resolution, 2 bytes signed)
  - 0x02: Analog Input (0.01 resolution, 2 bytes signed) -- used for pH, turbidity, TDS
  - 0x88: GPS Location (lat/lon: 0.0001° resolution, alt: 0.01m resolution)
  - 0x03: Analog Output (0.01 resolution) -- used for battery voltage
"""

import struct
import logging

logger = logging.getLogger(__name__)

# Cayenne LPP Data Type IDs
LPP_DIGITAL_INPUT = 0x00
LPP_DIGITAL_OUTPUT = 0x01
LPP_ANALOG_INPUT = 0x02
LPP_ANALOG_OUTPUT = 0x03
LPP_LUMINOSITY = 0x65
LPP_PRESENCE = 0x66
LPP_TEMPERATURE = 0x67
LPP_HUMIDITY = 0x68
LPP_BAROMETER = 0x73
LPP_GPS = 0x88


class CayenneLPP:
    """
    Cayenne LPP payload encoder.

    Usage:
        lpp = CayenneLPP()
        lpp.add_temperature(1, 22.5)
        lpp.add_analog_input(2, 7.21)   # pH
        lpp.add_analog_input(3, 15.5)   # turbidity NTU
        lpp.add_analog_input(4, 245.0)  # TDS ppm
        lpp.add_gps(5, 39.5, -79.3, 0)
        payload = lpp.get_bytes()
    """

    def __init__(self, max_size=51):
        """
        Args:
            max_size: Maximum payload size in bytes.
                      LoRaWAN DR0 (SF12) allows 51 bytes max.
                      DR3+ (SF9) allows 115+ bytes.
        """
        self._buffer = bytearray()
        self.max_size = max_size

    def reset(self):
        """Clear the payload buffer."""
        self._buffer = bytearray()

    def get_bytes(self):
        """
        Get the encoded payload as bytes.

        Returns:
            bytes: The Cayenne LPP encoded payload.
        """
        return bytes(self._buffer)

    def get_size(self):
        """Get current payload size in bytes."""
        return len(self._buffer)

    def _check_size(self, additional_bytes):
        """Check if adding bytes would exceed max payload size."""
        if len(self._buffer) + additional_bytes > self.max_size:
            logger.warning(
                "Payload overflow: current=%d, adding=%d, max=%d",
                len(self._buffer), additional_bytes, self.max_size,
            )
            return False
        return True

    def add_temperature(self, channel, celsius):
        """
        Add temperature reading.

        Args:
            channel: LPP channel number (1-255)
            celsius: Temperature in degrees Celsius (-327.68 to 327.67)
        """
        if not self._check_size(4):
            return False

        value = int(round(celsius * 10))
        value = max(-32768, min(32767, value))

        self._buffer.append(channel)
        self._buffer.append(LPP_TEMPERATURE)
        self._buffer.extend(struct.pack(">h", value))

        logger.debug("LPP: ch%d temperature %.1f°C (%d raw)", channel, celsius, value)
        return True

    def add_analog_input(self, channel, value):
        """
        Add analog input reading (0.01 resolution).

        Used for pH, turbidity, TDS, and other sensor values.

        Args:
            channel: LPP channel number (1-255)
            value: Sensor value (-327.68 to 327.67)
        """
        if not self._check_size(4):
            return False

        raw = int(round(value * 100))
        raw = max(-32768, min(32767, raw))

        self._buffer.append(channel)
        self._buffer.append(LPP_ANALOG_INPUT)
        self._buffer.extend(struct.pack(">h", raw))

        logger.debug("LPP: ch%d analog_input %.2f (%d raw)", channel, value, raw)
        return True

    def add_analog_output(self, channel, value):
        """
        Add analog output reading (0.01 resolution).

        Args:
            channel: LPP channel number (1-255)
            value: Value (-327.68 to 327.67)
        """
        if not self._check_size(4):
            return False

        raw = int(round(value * 100))
        raw = max(-32768, min(32767, raw))

        self._buffer.append(channel)
        self._buffer.append(LPP_ANALOG_OUTPUT)
        self._buffer.extend(struct.pack(">h", raw))

        logger.debug("LPP: ch%d analog_output %.2f (%d raw)", channel, value, raw)
        return True

    def add_digital_input(self, channel, value):
        """
        Add digital input (0 or 1).

        Args:
            channel: LPP channel number (1-255)
            value: 0 or 1
        """
        if not self._check_size(3):
            return False

        self._buffer.append(channel)
        self._buffer.append(LPP_DIGITAL_INPUT)
        self._buffer.append(1 if value else 0)

        return True

    def add_gps(self, channel, latitude, longitude, altitude=0):
        """
        Add GPS location.

        Args:
            channel: LPP channel number (1-255)
            latitude: Latitude in decimal degrees (-90 to 90)
            longitude: Longitude in decimal degrees (-180 to 180)
            altitude: Altitude in meters (-327.68 to 327.67)
        """
        if not self._check_size(11):
            return False

        lat = int(round(latitude * 10000))
        lon = int(round(longitude * 10000))
        alt = int(round(altitude * 100))

        lat = max(-8388608, min(8388607, lat))
        lon = max(-8388608, min(8388607, lon))
        alt = max(-8388608, min(8388607, alt))

        self._buffer.append(channel)
        self._buffer.append(LPP_GPS)

        # Latitude: 3 bytes signed (big-endian, 24-bit)
        lat_bytes = lat.to_bytes(3, byteorder="big", signed=True)
        self._buffer.extend(lat_bytes)

        # Longitude: 3 bytes signed
        lon_bytes = lon.to_bytes(3, byteorder="big", signed=True)
        self._buffer.extend(lon_bytes)

        # Altitude: 3 bytes signed
        alt_bytes = alt.to_bytes(3, byteorder="big", signed=True)
        self._buffer.extend(alt_bytes)

        logger.debug(
            "LPP: ch%d GPS lat=%.4f, lon=%.4f, alt=%.1fm",
            channel, latitude, longitude, altitude,
        )
        return True

    def add_humidity(self, channel, percent):
        """
        Add relative humidity.

        Args:
            channel: LPP channel number (1-255)
            percent: Relative humidity (0-100, 0.5% resolution)
        """
        if not self._check_size(3):
            return False

        raw = int(round(percent * 2))
        raw = max(0, min(255, raw))

        self._buffer.append(channel)
        self._buffer.append(LPP_HUMIDITY)
        self._buffer.append(raw)

        return True


def encode_sensor_reading(reading):
    """
    Convenience function: encode a full sensor reading into Cayenne LPP.

    Args:
        reading: dict with keys:
            - temperature: float (Celsius)
            - ph: float (0-14)
            - turbidity: float (NTU)
            - tds: float (ppm)
            - gps: dict with latitude, longitude, altitude (optional)
            - battery_voltage: float (optional)

    Returns:
        bytes: Cayenne LPP encoded payload.

    Channel assignment:
        1 = Temperature (LPP Temperature type)
        2 = pH (LPP Analog Input)
        3 = Turbidity NTU (LPP Analog Input)
        4 = TDS ppm (LPP Analog Input)
        5 = GPS (LPP GPS type)
        6 = Battery voltage (LPP Analog Output)
    """
    lpp = CayenneLPP(max_size=51)

    # Temperature (channel 1)
    if reading.get("temperature") is not None:
        lpp.add_temperature(1, reading["temperature"])

    # pH (channel 2) -- scale: pH is 0-14, fits in analog_input with 0.01 resolution
    if reading.get("ph") is not None:
        lpp.add_analog_input(2, reading["ph"])

    # Turbidity NTU (channel 3)
    if reading.get("turbidity") is not None:
        # Turbidity can be 0-1000+; analog_input max is 327.67
        # For values > 327, we scale down by 10 and TTN decoder must compensate
        turb = reading["turbidity"]
        if turb <= 327.0:
            lpp.add_analog_input(3, turb)
        else:
            # Use scaled value: turbidity / 10, decoder multiplies by 10
            lpp.add_analog_input(3, turb / 10.0)

    # TDS ppm (channel 4)
    if reading.get("tds") is not None:
        tds = reading["tds"]
        if tds <= 327.0:
            lpp.add_analog_input(4, tds)
        else:
            # Scale by 10 for values > 327
            lpp.add_analog_input(4, tds / 10.0)

    # GPS (channel 5)
    gps = reading.get("gps")
    if gps and gps.get("latitude") is not None and gps.get("longitude") is not None:
        lpp.add_gps(5, gps["latitude"], gps["longitude"], gps.get("altitude", 0))

    # Battery voltage (channel 6)
    if reading.get("battery_voltage") is not None:
        lpp.add_analog_output(6, reading["battery_voltage"])

    logger.debug("Encoded payload: %d bytes", lpp.get_size())
    return lpp.get_bytes()
