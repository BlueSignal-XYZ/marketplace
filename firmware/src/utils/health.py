"""Self-diagnostics: I2C scan, SPI test, CPU temp, free disk space."""

import logging
import os
import shutil

log = logging.getLogger("wqm.health")


class HealthCheck:
    @staticmethod
    def run(adc1=None, adc2=None, lora=None, db=None) -> dict:
        """Run all health checks. Returns a status dict."""
        result = {}

        if adc1:
            result["adc1_0x48"] = adc1.scan()
        if adc2:
            result["adc2_0x49"] = adc2.scan()

        if lora:
            result["lora_joined"] = lora.is_joined()

        if db:
            result["db_counts"] = db.count()

        result["cpu_temp_c"] = HealthCheck.cpu_temperature()
        result["disk_free_mb"] = HealthCheck.disk_free_mb()
        result["mem_available_mb"] = HealthCheck.mem_available_mb()

        return result

    @staticmethod
    def cpu_temperature() -> float | None:
        try:
            with open("/sys/class/thermal/thermal_zone0/temp") as f:
                return round(int(f.read().strip()) / 1000.0, 1)
        except Exception:
            return None

    @staticmethod
    def disk_free_mb() -> float:
        try:
            usage = shutil.disk_usage("/")
            return round(usage.free / (1024 * 1024), 1)
        except Exception:
            return 0.0

    @staticmethod
    def mem_available_mb() -> float | None:
        try:
            with open("/proc/meminfo") as f:
                for line in f:
                    if line.startswith("MemAvailable:"):
                        return round(int(line.split()[1]) / 1024, 1)
        except Exception:
            pass
        return None

    @staticmethod
    def i2c_scan(bus_num: int = 1) -> list:
        """Scan I2C bus for responding devices."""
        found = []
        try:
            import smbus2
            bus = smbus2.SMBus(bus_num)
            for addr in range(0x03, 0x78):
                try:
                    bus.read_byte(addr)
                    found.append(hex(addr))
                except OSError:
                    pass
            bus.close()
        except ImportError:
            log.warning("smbus2 not available for I2C scan")
        except Exception as e:
            log.warning("I2C scan failed: %s", e)
        return found
