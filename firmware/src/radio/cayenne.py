"""Cayenne Low Power Payload encoder for TTN integration.

Channel assignment:
  1 = Temperature (LPP Temperature, 0.1 C)
  2 = pH          (LPP Analog Input, 0.01)
  3 = TDS ppm     (LPP Analog Input, 0.01)
  4 = Turbidity   (LPP Analog Input, 0.01)
  5 = ORP mV      (LPP Analog Input, 0.01)
  6 = GPS         (LPP GPS Location)
"""

import struct

TEMPERATURE = 0x67
ANALOG_INPUT = 0x02
GPS_LOCATION = 0x88


class CayenneLPP:
    @staticmethod
    def encode(reading: dict) -> bytes:
        buf = bytearray()

        if reading.get("temperature_c") is not None:
            val = int(reading["temperature_c"] * 10)
            buf.append(1)
            buf.append(TEMPERATURE)
            buf += struct.pack(">h", val)

        if reading.get("ph") is not None:
            val = int(reading["ph"] * 100)
            buf.append(2)
            buf.append(ANALOG_INPUT)
            buf += struct.pack(">h", val)

        if reading.get("tds_ppm") is not None:
            val = int(min(reading["tds_ppm"], 327.0) * 100)
            buf.append(3)
            buf.append(ANALOG_INPUT)
            buf += struct.pack(">h", val)

        if reading.get("turbidity_ntu") is not None:
            val = int(min(reading["turbidity_ntu"], 327.0) * 100)
            buf.append(4)
            buf.append(ANALOG_INPUT)
            buf += struct.pack(">h", val)

        if reading.get("orp_mv") is not None:
            val = int(max(-327.0, min(327.0, reading["orp_mv"])) * 100)
            buf.append(5)
            buf.append(ANALOG_INPUT)
            buf += struct.pack(">h", val)

        if reading.get("latitude") is not None and reading.get("longitude") is not None:
            lat = int(reading["latitude"] * 10000)
            lon = int(reading["longitude"] * 10000)
            alt = int(reading.get("altitude_m", 0) * 100)
            buf.append(6)
            buf.append(GPS_LOCATION)
            buf += struct.pack(">i", lat)[1:]
            buf += struct.pack(">i", lon)[1:]
            buf += struct.pack(">i", alt)[1:]

        return bytes(buf)
