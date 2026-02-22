"""Relay control via GPIO 23 N-MOSFET driver.

Active HIGH = relay energized. Supports:
- Immediate on/off
- Timed pulse with auto-shutoff
- Maximum continuous on-time safety (default 30 min)
- Event logging to database

Sources that can trigger:
1. Local alert threshold rules (settings.json → relay_rules)
2. BLE command (characteristic 0x0013)
3. LoRaWAN downlink (channel 7, digital output)
4. Cloud command via TTN
"""

import time
import logging
import threading

log = logging.getLogger("wqm.relay")

try:
    import RPi.GPIO as GPIO
except ImportError:
    GPIO = None

DEFAULT_MAX_ON_SECONDS = 1800  # 30 minutes


class RelayController:
    """Relay controller with timed pulse and safety auto-shutoff."""

    def __init__(self, config: dict, db=None):
        """
        Args:
            config: Relay configuration dict from config.yaml/settings.json
            db: ReadingsDB instance for event logging (optional)
        """
        self.pin = config.get("gpio_pin", 23)
        self.max_on_seconds = config.get("max_on_seconds", DEFAULT_MAX_ON_SECONDS)
        self._state = False
        self._on_since = None
        self._pulse_timer = None
        self._safety_timer = None
        self._lock = threading.Lock()
        self._db = db

        if GPIO:
            GPIO.setwarnings(False)
            GPIO.setmode(GPIO.BCM)
            GPIO.setup(self.pin, GPIO.OUT, initial=GPIO.LOW)

        default = config.get("default_state", "off")
        if default == "on":
            self.on(source="default")

        log.info("Relay initialized on GPIO %d, max_on=%ds, default=%s",
                 self.pin, self.max_on_seconds, default)

    def on(self, source: str = "manual"):
        """Turn relay on. Starts safety timer."""
        with self._lock:
            if self._state:
                return  # Already on

            if GPIO:
                GPIO.output(self.pin, GPIO.HIGH)
            self._state = True
            self._on_since = time.time()

            # Cancel any existing pulse timer
            self._cancel_pulse_timer()

            # Start safety auto-shutoff timer
            self._start_safety_timer()

            self._log_event("relay_on", source=source)
            log.info("Relay ON (source: %s)", source)

    def off(self, source: str = "manual"):
        """Turn relay off."""
        with self._lock:
            if GPIO:
                GPIO.output(self.pin, GPIO.LOW)
            was_on = self._state
            self._state = False
            self._on_since = None

            self._cancel_pulse_timer()
            self._cancel_safety_timer()

            if was_on:
                self._log_event("relay_off", source=source)
                log.info("Relay OFF (source: %s)", source)

    def pulse(self, duration_seconds: float, source: str = "manual"):
        """Turn relay on for a specified duration, then auto-off.

        Args:
            duration_seconds: How long to keep relay on (seconds).
            source: What triggered this (manual, ble, lorawan, rule, cloud).
        """
        if duration_seconds <= 0:
            log.warning("Invalid pulse duration: %s", duration_seconds)
            return

        # Enforce max on time
        duration_seconds = min(duration_seconds, self.max_on_seconds)

        with self._lock:
            # Cancel any existing pulse timer
            self._cancel_pulse_timer()

            if GPIO:
                GPIO.output(self.pin, GPIO.HIGH)
            self._state = True
            self._on_since = time.time()

            # Schedule auto-off
            self._pulse_timer = threading.Timer(
                duration_seconds,
                self._pulse_off,
            )
            self._pulse_timer.daemon = True
            self._pulse_timer.start()

            # Reset safety timer
            self._cancel_safety_timer()
            self._start_safety_timer()

            self._log_event("relay_pulse", source=source,
                            duration=duration_seconds)
            log.info("Relay PULSE %ds (source: %s)", duration_seconds, source)

    def get_state(self) -> bool:
        """Return current relay state."""
        return self._state

    def is_on(self) -> bool:
        """Return True if relay is energized."""
        return self._state

    def get_on_duration(self) -> float:
        """Return seconds relay has been continuously on, or 0 if off."""
        if self._state and self._on_since:
            return time.time() - self._on_since
        return 0.0

    def _pulse_off(self):
        """Called by pulse timer to turn relay off."""
        self.off(source="pulse_timer")

    def _safety_shutoff(self):
        """Safety auto-shutoff after max continuous on time."""
        log.warning("Safety auto-shutoff: relay was on for %ds (max=%ds)",
                    self.max_on_seconds, self.max_on_seconds)
        self.off(source="safety_shutoff")

    def _start_safety_timer(self):
        """Start safety auto-shutoff timer."""
        self._cancel_safety_timer()
        self._safety_timer = threading.Timer(
            self.max_on_seconds,
            self._safety_shutoff,
        )
        self._safety_timer.daemon = True
        self._safety_timer.start()

    def _cancel_pulse_timer(self):
        if self._pulse_timer and self._pulse_timer.is_alive():
            self._pulse_timer.cancel()
        self._pulse_timer = None

    def _cancel_safety_timer(self):
        if self._safety_timer and self._safety_timer.is_alive():
            self._safety_timer.cancel()
        self._safety_timer = None

    def _log_event(self, event_type: str, source: str = None, **kwargs):
        """Log relay event to database."""
        if self._db:
            details = {"source": source}
            details.update(kwargs)
            try:
                self._db.log_event(event_type, details)
            except Exception as e:
                log.debug("Failed to log relay event: %s", e)

    def cleanup(self):
        """Clean shutdown: turn off and release GPIO."""
        self._cancel_pulse_timer()
        self._cancel_safety_timer()
        self.off(source="shutdown")
        if GPIO:
            GPIO.cleanup(self.pin)
        log.info("Relay cleanup complete")
