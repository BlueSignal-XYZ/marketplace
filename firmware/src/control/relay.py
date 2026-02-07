"""
Relay Controller for Ultrasonic Antifouling

Controls the optocoupler-isolated relay on GPIO17 that drives the
60W 28KHz ultrasonic transducer for algae prevention.

The relay operates on a configurable duty cycle:
  - Default: 30 seconds ON, 270 seconds OFF (10% duty cycle)
  - Adjustable via config.yaml

The relay output is active-high (GPIO17 HIGH = relay closed = transducer ON).
An optocoupler isolates the Pi GPIO from the relay coil to prevent
back-EMF damage.
"""

import logging
import time
import threading

logger = logging.getLogger(__name__)

# GPIO pin for relay control
RELAY_GPIO_PIN = 17

# Default duty cycle parameters
DEFAULT_ON_DURATION = 30      # seconds
DEFAULT_OFF_DURATION = 270    # seconds (total cycle = 5 minutes)


class RelayController:
    """
    Controls the antifouling ultrasonic relay.

    Usage:
        relay = RelayController()
        relay.initialize()
        relay.start_duty_cycle()  # starts background thread
        relay.stop_duty_cycle()
    """

    def __init__(self, pin=RELAY_GPIO_PIN, on_duration=DEFAULT_ON_DURATION,
                 off_duration=DEFAULT_OFF_DURATION):
        self.pin = pin
        self.on_duration = on_duration
        self.off_duration = off_duration
        self._gpio = None
        self._running = False
        self._thread = None
        self._relay_state = False

    def initialize(self):
        """
        Initialize GPIO for relay control.

        Returns:
            bool: True if GPIO setup succeeded.
        """
        try:
            import RPi.GPIO as GPIO

            self._gpio = GPIO
            GPIO.setmode(GPIO.BCM)
            GPIO.setup(self.pin, GPIO.OUT, initial=GPIO.LOW)

            self._relay_state = False
            logger.info(
                "Relay initialized on GPIO%d (duty: %ds ON / %ds OFF)",
                self.pin, self.on_duration, self.off_duration,
            )
            return True

        except ImportError:
            logger.error("RPi.GPIO not available (not running on Pi?)")
            return False
        except Exception as e:
            logger.error("Relay initialization failed: %s", e)
            return False

    def on(self):
        """Turn relay ON (activate ultrasonic transducer)."""
        if self._gpio:
            self._gpio.output(self.pin, self._gpio.HIGH)
            self._relay_state = True
            logger.debug("Relay ON (antifouling active)")

    def off(self):
        """Turn relay OFF (deactivate ultrasonic transducer)."""
        if self._gpio:
            self._gpio.output(self.pin, self._gpio.LOW)
            self._relay_state = False
            logger.debug("Relay OFF (antifouling idle)")

    def is_on(self):
        """Check if relay is currently ON."""
        return self._relay_state

    def start_duty_cycle(self):
        """Start the antifouling duty cycle in a background thread."""
        if self._running:
            logger.warning("Duty cycle already running")
            return

        self._running = True
        self._thread = threading.Thread(target=self._duty_cycle_loop, daemon=True)
        self._thread.start()
        logger.info("Antifouling duty cycle started")

    def stop_duty_cycle(self):
        """Stop the duty cycle and turn relay OFF."""
        self._running = False
        self.off()
        if self._thread and self._thread.is_alive():
            self._thread.join(timeout=5.0)
        logger.info("Antifouling duty cycle stopped")

    def _duty_cycle_loop(self):
        """Background thread: ON/OFF duty cycle."""
        while self._running:
            # ON phase
            self.on()
            self._interruptible_sleep(self.on_duration)

            if not self._running:
                break

            # OFF phase
            self.off()
            self._interruptible_sleep(self.off_duration)

    def _interruptible_sleep(self, duration):
        """Sleep that can be interrupted by stopping the duty cycle."""
        end_time = time.time() + duration
        while self._running and time.time() < end_time:
            time.sleep(0.5)

    def get_status(self):
        """Get relay status."""
        return {
            "relay_on": self._relay_state,
            "duty_cycle_running": self._running,
            "on_duration": self.on_duration,
            "off_duration": self.off_duration,
            "duty_percent": round(
                self.on_duration / (self.on_duration + self.off_duration) * 100, 1
            ),
        }

    def shutdown(self):
        """Stop duty cycle and cleanup GPIO."""
        self.stop_duty_cycle()
        if self._gpio:
            try:
                self._gpio.output(self.pin, self._gpio.LOW)
                self._gpio.cleanup(self.pin)
            except Exception:
                pass
        logger.info("Relay shutdown complete")
