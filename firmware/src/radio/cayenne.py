"""Cayenne Low Power Payload encoder for TTN integration.

Channel assignment (contract between firmware and cloud):
  1 = Temperature  (LPP Temperature 0x67, 0.1°C resolution)
  2 = pH           (LPP Analog Input 0x02, 0.01 resolution)
  3 = TDS ppm      (LPP Analog Input 0x02, 0.01 resolution)
  4 = Turbidity    (LPP Analog Input 0x02, 0.01 resolution)
  5 = ORP mV       (LPP Analog Input 0x02, 0.01 resolution)
  6 = GPS          (LPP GPS Location 0x88)
  7 = Relay state  (LPP Digital Output 0x01, 0=off 1=on)
  8 = Battery/Vin  (LPP Analog Input 0x02, 0.01V resolution)
  9 = Cal status   (LPP Digital Output 0x01, bitmask)

Full payload size: 38 bytes (without ch 9).
DR0 max payload: 11 bytes → requires splitting.
"""

import struct

# LPP type IDs
TEMPERATURE = 0x67
ANALOG_INPUT = 0x02
GPS_LOCATION = 0x88
DIGITAL_OUTPUT = 0x01

# Channel sizes (header=2 + data)
CHANNEL_SIZES = {
    1: 4,   # temp: 2h header + 2b data
    2: 4,   # pH
    3: 4,   # TDS
    4: 4,   # turbidity
    5: 4,   # ORP
    6: 11,  # GPS: 2b header + 3b lat + 3b lon + 3b alt
    7: 3,   # relay: 2b header + 1b data
    8: 4,   # battery
    9: 3,   # calibration status
}

# Priority channels fit DR0 (11 bytes): temp(4) + pH(4) + relay(3) = 11
PRIORITY_CHANNELS = [1, 2, 7]
# Secondary channels for DR1+ (up to 53 bytes)
SECONDARY_CHANNELS = [3, 4, 5, 6, 8, 9]


class CayenneLPP:
    """Cayenne Low Power Payload encoder with payload splitting."""

    @staticmethod
    def encode(reading: dict, channels=None) -> bytes:
        """Encode a reading dict into Cayenne LPP binary payload.

        Args:
            reading: Sensor reading dict with keys like temperature_c, ph, etc.
            channels: Optional list of channel numbers to include.
                      None = all available channels.
        Returns:
            bytes: Cayenne LPP encoded payload.
        """
        buf = bytearray()

        # Channel 1: Temperature (DS18B20)
        if (channels is None or 1 in channels) and reading.get("temperature_c") is not None:
            val = int(reading["temperature_c"] * 10)
            buf.append(1)
            buf.append(TEMPERATURE)
            buf += struct.pack(">h", val)

        # Channel 2: pH
        if (channels is None or 2 in channels) and reading.get("ph") is not None:
            val = int(reading["ph"] * 100)
            buf.append(2)
            buf.append(ANALOG_INPUT)
            buf += struct.pack(">h", val)

        # Channel 3: TDS (ppm)
        if (channels is None or 3 in channels) and reading.get("tds_ppm") is not None:
            val = int(min(reading["tds_ppm"], 327.0) * 100)
            buf.append(3)
            buf.append(ANALOG_INPUT)
            buf += struct.pack(">h", val)

        # Channel 4: Turbidity (NTU)
        if (channels is None or 4 in channels) and reading.get("turbidity_ntu") is not None:
            val = int(min(reading["turbidity_ntu"], 327.0) * 100)
            buf.append(4)
            buf.append(ANALOG_INPUT)
            buf += struct.pack(">h", val)

        # Channel 5: ORP (mV)
        if (channels is None or 5 in channels) and reading.get("orp_mv") is not None:
            val = int(max(-327.0, min(327.0, reading["orp_mv"])) * 100)
            buf.append(5)
            buf.append(ANALOG_INPUT)
            buf += struct.pack(">h", val)

        # Channel 6: GPS
        if (channels is None or 6 in channels):
            if reading.get("latitude") is not None and reading.get("longitude") is not None:
                lat = int(reading["latitude"] * 10000)
                lon = int(reading["longitude"] * 10000)
                alt = int(reading.get("altitude_m", 0) * 100)
                buf.append(6)
                buf.append(GPS_LOCATION)
                buf += struct.pack(">i", lat)[1:]
                buf += struct.pack(">i", lon)[1:]
                buf += struct.pack(">i", alt)[1:]

        # Channel 7: Relay state
        if (channels is None or 7 in channels) and reading.get("relay_state") is not None:
            buf.append(7)
            buf.append(DIGITAL_OUTPUT)
            buf.append(1 if reading["relay_state"] else 0)

        # Channel 8: Battery / input voltage
        if (channels is None or 8 in channels) and reading.get("battery_v") is not None:
            val = int(reading["battery_v"] * 100)
            buf.append(8)
            buf.append(ANALOG_INPUT)
            buf += struct.pack(">h", val)

        # Channel 9: Calibration status bitmask
        # Bit 0: pH calibrated, Bit 1: TDS, Bit 2: Turbidity, Bit 3: ORP
        # Bit 7: revenue_grade enabled
        if (channels is None or 9 in channels) and reading.get("calibration_status") is not None:
            buf.append(9)
            buf.append(DIGITAL_OUTPUT)
            buf.append(reading["calibration_status"] & 0xFF)

        return bytes(buf)

    @staticmethod
    def encode_split(reading: dict, max_payload_bytes: int) -> list:
        """Encode reading, splitting into multiple payloads if needed.

        If the full payload exceeds max_payload_bytes (e.g., DR0 = 11 bytes),
        split into priority and secondary payloads.

        Args:
            reading: Sensor reading dict.
            max_payload_bytes: Maximum allowed payload size for current data rate.

        Returns:
            List of bytes objects. Usually 1 element; 2 if splitting needed.
        """
        full = CayenneLPP.encode(reading)

        if len(full) <= max_payload_bytes:
            return [full]

        # Split: priority channels first, secondary next uplink cycle
        priority = CayenneLPP.encode(reading, channels=PRIORITY_CHANNELS)
        secondary = CayenneLPP.encode(reading, channels=SECONDARY_CHANNELS)

        payloads = []
        if priority:
            payloads.append(priority)
        if secondary:
            payloads.append(secondary)

        return payloads if payloads else [full]

    @staticmethod
    def max_payload_for_dr(data_rate: int) -> int:
        """Return max payload bytes for a US915 data rate."""
        limits = {0: 11, 1: 53, 2: 125, 3: 242, 4: 242}
        return limits.get(data_rate, 242)
