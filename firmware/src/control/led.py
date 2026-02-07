"""
RGB Status LED Controller

Drives the common-cathode RGB LED for device status indication:
  - GREEN:  Normal operation, sensors reading, LoRa connected
  - YELLOW: Warning (sensor error, LoRa disconnected but buffering)
  - RED:    Fault (critical sensor failure, no GPS fix after timeout)
  - BLUE:   Initializing / joining network
  - OFF:    Deep sleep / powered down

GPIO pins:
  - GPIO24: Red
  - GPIO27: Green
  - GPIO18: Blue (PWM capable)
"""

import logging
import time
import threading

logger = logging.getLogger(__name__)

# GPIO pin assignments for RGB LED
LED_RED_PIN = 24
LED_GREEN_PIN = 27
LED_BLUE_PIN = 18


class StatusLED:
    """
    RGB LED status indicator.

    Usage:
        led = StatusLED()
        led.initialize()
        led.set_status("ok")      # solid green
        led.set_status("warning") # solid yellow
        led.set_status("error")   # solid red
        led.set_status("init")    # blinking blue
    """

    # Status -> color mapping
    STATUS_COLORS = {
        "ok": (0, 1, 0),          # Green
        "warning": (1, 1, 0),     # Yellow (red + green)
        "error": (1, 0, 0),       # Red
        "init": (0, 0, 1),        # Blue
        "sending": (0, 1, 1),     # Cyan (green + blue)
        "offline": (1, 0, 1),     # Magenta (red + blue)
        "off": (0, 0, 0),         # Off
    }

    def __init__(self, red_pin=LED_RED_PIN, green_pin=LED_GREEN_PIN,
                 blue_pin=LED_BLUE_PIN):
        self.pins = {
            "red": red_pin,
            "green": green_pin,
            "blue": blue_pin,
        }
        self._gpio = None
        self._current_status = "off"
        self._blink_thread = None
        self._blinking = False

    def initialize(self):
        """
        Initialize GPIO pins for LED control.

        Returns:
            bool: True if setup succeeded.
        """
        try:
            import RPi.GPIO as GPIO

            self._gpio = GPIO
            GPIO.setmode(GPIO.BCM)

            for pin in self.pins.values():
                GPIO.setup(pin, GPIO.OUT, initial=GPIO.LOW)

            logger.info(
                "Status LED initialized: R=GPIO%d, G=GPIO%d, B=GPIO%d",
                self.pins["red"], self.pins["green"], self.pins["blue"],
            )

            # Brief startup flash
            self._set_color(1, 1, 1)  # White
            time.sleep(0.2)
            self._set_color(0, 0, 0)  # Off

            return True

        except ImportError:
            logger.warning("RPi.GPIO not available -- LED disabled")
            return False
        except Exception as e:
            logger.error("LED initialization failed: %s", e)
            return False

    def set_status(self, status, blink=False):
        """
        Set LED to indicate device status.

        Args:
            status: One of "ok", "warning", "error", "init", "sending",
                    "offline", "off"
            blink: If True, blink the LED instead of solid
        """
        # Stop any existing blink
        self._stop_blink()

        self._current_status = status
        color = self.STATUS_COLORS.get(status, (0, 0, 0))

        if blink:
            self._start_blink(color)
        else:
            self._set_color(*color)

        logger.debug("LED status: %s (blink=%s)", status, blink)

    def get_status(self):
        """Get current LED status."""
        return self._current_status

    def _set_color(self, red, green, blue):
        """Set LED color (0 or 1 for each channel)."""
        if self._gpio is None:
            return

        try:
            self._gpio.output(self.pins["red"], self._gpio.HIGH if red else self._gpio.LOW)
            self._gpio.output(self.pins["green"], self._gpio.HIGH if green else self._gpio.LOW)
            self._gpio.output(self.pins["blue"], self._gpio.HIGH if blue else self._gpio.LOW)
        except Exception:
            pass

    def _start_blink(self, color, interval=0.5):
        """Start blinking in a background thread."""
        self._blinking = True
        self._blink_thread = threading.Thread(
            target=self._blink_loop, args=(color, interval), daemon=True
        )
        self._blink_thread.start()

    def _stop_blink(self):
        """Stop blinking."""
        self._blinking = False
        if self._blink_thread and self._blink_thread.is_alive():
            self._blink_thread.join(timeout=2.0)
        self._blink_thread = None

    def _blink_loop(self, color, interval):
        """Background thread for blinking."""
        while self._blinking:
            self._set_color(*color)
            time.sleep(interval)
            if not self._blinking:
                break
            self._set_color(0, 0, 0)
            time.sleep(interval)

    def shutdown(self):
        """Turn off LED and cleanup GPIO."""
        self._stop_blink()
        self._set_color(0, 0, 0)
        if self._gpio:
            try:
                for pin in self.pins.values():
                    self._gpio.cleanup(pin)
            except Exception:
                pass
        logger.info("Status LED shutdown complete")
