"""Hardware watchdog for BCM2835 on Pi Zero 2W.

If the main Python process hangs (I2C lockup, SPI contention, deadlock),
the watchdog reboots the Pi after the configured timeout. Without this,
a hung device in the field stays dead until physically power-cycled.

Requires dtparam=watchdog=on in /boot/firmware/config.txt.

Usage:
    wd = HardwareWatchdog(timeout=30)
    while running:
        do_work()
        wd.pet()  # must be called within timeout
    wd.close()    # magic close disables watchdog for clean shutdown
"""

import os
import logging

log = logging.getLogger("wqm.watchdog")

# ioctl constants for Linux watchdog
WDIOC_SETTIMEOUT = 0xC0045706
WDIOC_KEEPALIVE = 0x80045705


class HardwareWatchdog:
    """Linux hardware watchdog (/dev/watchdog) interface."""

    def __init__(self, timeout: int = 30):
        """Open watchdog device and set timeout.

        Args:
            timeout: Seconds before watchdog triggers reboot if not pet.
        """
        self._fd = None
        self._enabled = False

        try:
            self._fd = os.open("/dev/watchdog", os.O_WRONLY)
            self._set_timeout(timeout)
            self._enabled = True
            log.info("Hardware watchdog enabled (timeout=%ds)", timeout)
        except OSError as e:
            log.warning("Hardware watchdog unavailable: %s "
                        "(normal on non-Pi systems)", e)

    def _set_timeout(self, timeout: int):
        """Set watchdog timeout via ioctl."""
        if self._fd is None:
            return
        try:
            import fcntl
            import struct
            fcntl.ioctl(self._fd, WDIOC_SETTIMEOUT,
                        struct.pack("i", timeout))
        except Exception as e:
            log.warning("Failed to set watchdog timeout: %s", e)

    def pet(self):
        """Pet (kick) the watchdog. Must be called within timeout period."""
        if self._fd is not None and self._enabled:
            try:
                os.write(self._fd, b"\x00")
            except OSError as e:
                log.error("Watchdog pet failed: %s", e)

    def close(self):
        """Disable watchdog with magic close character 'V'.

        Writing 'V' before close tells the kernel to disable the
        watchdog timer, preventing reboot on clean shutdown.
        """
        if self._fd is not None:
            try:
                os.write(self._fd, b"V")
                os.close(self._fd)
                log.info("Hardware watchdog disabled (clean shutdown)")
            except OSError as e:
                log.warning("Watchdog close error: %s", e)
            finally:
                self._fd = None
                self._enabled = False

    @property
    def enabled(self) -> bool:
        return self._enabled
