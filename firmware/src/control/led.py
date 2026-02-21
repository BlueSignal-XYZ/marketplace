"""Priority-based LED state machine on GPIO 25.

Uses PWM for breathing effects. Multiple services can request LED states;
the highest-priority active state always renders.

Priority order (highest first):
  1 FAULT          — fast flash 2Hz
  2 UPDATING       — rapid pulse 4Hz
  3 COMMISSIONING  — breathing slow 0.5Hz
  4 LORA_JOINING   — double blink every 2s
  5 LORA_FAILED    — slow flash 1Hz
  6 JOIN_SUCCESS   — solid 3s (transient, auto-releases)
  7 NORMAL         — breathing very slow 0.1Hz
  8 SLEEPING       — off
"""

import math
import logging
import time
import threading

log = logging.getLogger("wqm.led")

try:
    import RPi.GPIO as GPIO
except ImportError:
    GPIO = None

# State definitions: name → priority (lower number = higher priority)
LED_STATES = {
    "FAULT": 1,
    "UPDATING": 2,
    "COMMISSIONING": 3,
    "LORA_JOINING": 4,
    "LORA_FAILED": 5,
    "JOIN_SUCCESS": 6,
    "NORMAL": 7,
    "SLEEPING": 8,
}

# Backwards-compatible aliases from old pattern names
PATTERN_ALIASES = {
    "error": "FAULT",
    "sos": "FAULT",
    "boot": "NORMAL",
    "solid": "NORMAL",
    "blink_slow": "NORMAL",
    "blink_fast": "UPDATING",
    "transmitting": "UPDATING",
    "double_blink": "LORA_JOINING",
    "no_link": "LORA_FAILED",
    "sampling": "NORMAL",
    "off": "SLEEPING",
}

PWM_FREQ = 50  # Hz — base PWM frequency


class StatusLED:
    """Priority-based LED controller with PWM breathing effects."""

    def __init__(self, config: dict):
        self.pin = config.get("gpio_pin", 25)
        self._active_states = set()  # Set of currently active state names
        self._running = False
        self._thread = None
        self._pwm = None
        self._lock = threading.Lock()

        if GPIO:
            GPIO.setwarnings(False)
            GPIO.setmode(GPIO.BCM)
            GPIO.setup(self.pin, GPIO.OUT, initial=GPIO.LOW)
            self._pwm = GPIO.PWM(self.pin, PWM_FREQ)
            self._pwm.start(0)

        log.info("LED initialized on GPIO %d (PWM)", self.pin)

    def request_state(self, state: str):
        """Request an LED state. Highest priority active state renders."""
        state = state.upper()
        if state not in LED_STATES:
            log.warning("Unknown LED state: %s", state)
            return

        with self._lock:
            self._active_states.add(state)
            self._ensure_thread()

        # JOIN_SUCCESS auto-releases after 3 seconds
        if state == "JOIN_SUCCESS":
            threading.Timer(3.0, self.release_state, args=["JOIN_SUCCESS"]).start()

    def release_state(self, state: str):
        """Release an LED state. Next highest priority takes over."""
        state = state.upper()
        with self._lock:
            self._active_states.discard(state)

    def set_pattern(self, pattern: str):
        """Backwards-compatible: map old pattern names to priority states.

        This replaces all current states with the single mapped state,
        maintaining compatibility with existing code that calls
        led.set_pattern("sampling") etc.
        """
        state = PATTERN_ALIASES.get(pattern, pattern.upper())
        if state not in LED_STATES:
            state = "NORMAL"

        with self._lock:
            self._active_states.clear()
            self._active_states.add(state)
            self._ensure_thread()

    def off(self):
        """Turn LED off and clear all states."""
        with self._lock:
            self._active_states.clear()
            self._active_states.add("SLEEPING")
        self._set_duty(0)

    def _get_current_state(self) -> str:
        """Return highest-priority active state."""
        with self._lock:
            if not self._active_states:
                return "SLEEPING"
            return min(self._active_states, key=lambda s: LED_STATES.get(s, 99))

    def _ensure_thread(self):
        """Start render thread if not running."""
        if self._running:
            return
        self._running = True
        self._thread = threading.Thread(target=self._render_loop, daemon=True)
        self._thread.start()

    def _render_loop(self):
        """Main render loop — checks active state and renders pattern."""
        while self._running:
            state = self._get_current_state()

            try:
                if state == "FAULT":
                    self._flash(on_time=0.25, off_time=0.25)  # 2Hz
                elif state == "UPDATING":
                    self._flash(on_time=0.125, off_time=0.125)  # 4Hz
                elif state == "COMMISSIONING":
                    self._breathe(period=2.0)  # 0.5Hz
                elif state == "LORA_JOINING":
                    self._double_blink()
                elif state == "LORA_FAILED":
                    self._flash(on_time=0.5, off_time=0.5)  # 1Hz
                elif state == "JOIN_SUCCESS":
                    self._set_duty(100)
                    self._sleep(0.1)
                elif state == "NORMAL":
                    self._breathe(period=10.0)  # 0.1Hz
                elif state == "SLEEPING":
                    self._set_duty(0)
                    self._sleep(0.5)
                else:
                    self._sleep(1.0)
            except Exception as e:
                log.debug("LED render error: %s", e)
                self._sleep(1.0)

    def _breathe(self, period: float):
        """Smooth sine-wave breathing effect using PWM duty cycle."""
        steps = 50
        step_time = period / steps

        for i in range(steps):
            if not self._running or self._get_current_state() != self._get_current_state():
                return
            # Sine wave: 0→100→0 over one period
            duty = (math.sin(2 * math.pi * i / steps - math.pi / 2) + 1) / 2 * 100
            self._set_duty(duty)
            self._sleep(step_time)

    def _flash(self, on_time: float, off_time: float):
        """Simple on/off flash pattern."""
        self._set_duty(100)
        self._sleep(on_time)
        self._set_duty(0)
        self._sleep(off_time)

    def _double_blink(self):
        """Two quick blinks then a pause (LoRa joining indicator)."""
        self._set_duty(100)
        self._sleep(0.1)
        self._set_duty(0)
        self._sleep(0.1)
        self._set_duty(100)
        self._sleep(0.1)
        self._set_duty(0)
        self._sleep(1.7)  # Total cycle ~2s

    def _set_duty(self, duty: float):
        """Set PWM duty cycle (0-100)."""
        if self._pwm:
            self._pwm.ChangeDutyCycle(max(0, min(100, duty)))
        elif GPIO:
            GPIO.output(self.pin, GPIO.HIGH if duty > 50 else GPIO.LOW)

    def _sleep(self, duration: float):
        """Interruptible sleep."""
        end = time.time() + duration
        while self._running and time.time() < end:
            time.sleep(min(0.05, max(0, end - time.time())))

    def cleanup(self):
        """Stop thread and release GPIO."""
        self._running = False
        if self._thread and self._thread.is_alive():
            self._thread.join(timeout=3.0)
        self._set_duty(0)
        if self._pwm:
            self._pwm.stop()
        if GPIO:
            GPIO.cleanup(self.pin)
        log.info("LED cleanup complete")
