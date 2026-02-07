"""
BlueSignal BS-WQM-100 Sensor Drivers

Sensor suite on the Pi Zero 2W carrier board HAT:
- ADS1115 16-bit ADC (4 channels via I2C): pH, TDS, Turbidity, ORP/reserved
- DS18B20 digital temperature sensor (1-Wire)
- NEO-6M GPS module (UART)
"""

from .adc import ADCReader
from .ph import PHSensor
from .tds import TDSSensor
from .turbidity import TurbiditySensor
from .temperature import TemperatureSensor
from .gps import GPSSensor

__all__ = [
    "ADCReader",
    "PHSensor",
    "TDSSensor",
    "TurbiditySensor",
    "TemperatureSensor",
    "GPSSensor",
]
