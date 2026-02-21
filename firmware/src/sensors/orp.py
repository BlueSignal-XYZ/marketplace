"""ORP (Oxidation-Reduction Potential) sensor: ADC voltage -> mV.

Reads from ADS1115 U2 (0x49), AIN0. OPA340 buffer with offset to
0-3.3 V range. The midpoint reference (offset_voltage) corresponds
to 0 mV ORP. Typical range: -2000 mV to +2000 mV.
"""

import logging

log = logging.getLogger("wqm.orp")

MV_PER_VOLT = 1000.0


class ORPSensor:
    def __init__(self, adc, config: dict, calibration: dict = None):
        self.adc = adc
        self.channel = config.get("adc_channel", 0)
        self.gain = config.get("gain", 1)
        self.offset_voltage = config.get("offset_voltage", 1.65)
        self.samples = config.get("averaging_samples", 5)

        cal = calibration or {}
        self.offset_mv = cal.get("offset_mv", 0.0)
        log.info("ORP: offset_voltage=%.3fV, cal_offset=%.1fmV",
                 self.offset_voltage, self.offset_mv)

    def read(self) -> float:
        """Read ORP in millivolts."""
        voltage = self.adc.read_channel(self.channel, self.gain, self.samples)
        orp_mv = (voltage - self.offset_voltage) * MV_PER_VOLT + self.offset_mv
        orp_mv = max(-2000.0, min(2000.0, orp_mv))
        log.debug("ORP: voltage=%.4fV, orp=%.1fmV", voltage, orp_mv)
        return round(orp_mv, 1)
