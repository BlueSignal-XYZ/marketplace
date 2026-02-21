"""Status LED on GPIO 25. Single LED with multiple blink patterns.

Patterns:
  solid       — LED on continuously
  blink_slow  — 1 Hz (0.5s on, 0.5s off)
  blink_fast  — 5 Hz (0.1s on, 0.1s off)
  sos         — ... --- ... (SOS in Morse)
  double_blink— two quick blinks then pause
  off         — LED off
"""

import logging
import time
import threading

log = logging.getLogger("wqm.led")

try:
    import RPi.GPIO as GPIO
except ImportError:
    GPIO = None


SOS_PATTERN = [
    0.15, 0.1, 0.15, 0.1, 0.15, 0.3,
    0.4, 0.1, 0.4, 0.1, 0.4, 0.3,
    0.15, 0.1, 0.15, 0.1, 0.15, 1.0,
]


class StatusLED:
    def __init__(self, config: dict):
        self.pin = config.get("gpio_pin", 25)
        self._pattern = "off"
        self._running = False
        self._thread = None
        if GPIO:
            GPIO.setmode(GPIO.BCM)
            GPIO.setup(self.pin, GPIO.OUT, initial=GPIO.LOW)
        log.info("LED initialized on GPIO %d", self.pin)

    def set_pattern(self, pattern: str):
        """Change the LED blink pattern."""
        if pattern == self._pattern:
            return
        self._stop_thread()
        self._pattern = pattern

        if pattern == "off":
            self._led_off()
        elif pattern == "solid" or pattern == "boot":
            self._led_on()
        else:
            self._start_thread(pattern)

    def _led_on(self):
        if GPIO:
            GPIO.output(self.pin, GPIO.HIGH)

    def _led_off(self):
        if GPIO:
            GPIO.output(self.pin, GPIO.LOW)

    def off(self):
        self.set_pattern("off")

    def _stop_thread(self):
        self._running = False
        if self._thread and self._thread.is_alive():
            self._thread.join(timeout=3.0)
        self._thread = None

    def _start_thread(self, pattern: str):
        self._running = True
        self._thread = threading.Thread(
            target=self._blink_loop, args=(pattern,), daemon=True
        )
        self._thread.start()

    def _blink_loop(self, pattern: str):
        while self._running:
            if pattern == "blink_slow":
                self._led_on()
                self._sleep(0.5)
                self._led_off()
                self._sleep(0.5)
            elif pattern == "blink_fast" or pattern == "transmitting":
                self._led_on()
                self._sleep(0.1)
                self._led_off()
                self._sleep(0.1)
            elif pattern == "sos" or pattern == "error":
                for i, duration in enumerate(SOS_PATTERN):
                    if not self._running:
                        break
                    if i % 2 == 0:
                        self._led_on()
                    else:
                        self._led_off()
                    self._sleep(duration)
            elif pattern == "double_blink" or pattern == "no_link":
                self._led_on()
                self._sleep(0.1)
                self._led_off()
                self._sleep(0.1)
                self._led_on()
                self._sleep(0.1)
                self._led_off()
                self._sleep(1.0)
            elif pattern == "sampling":
                self._led_on()
                self._sleep(0.5)
                self._led_off()
                self._sleep(0.5)
            else:
                self._sleep(1.0)

    def _sleep(self, duration: float):
        end = time.time() + duration
        while self._running and time.time() < end:
            time.sleep(min(0.05, end - time.time()))

    def cleanup(self):
        self._stop_thread()
        self._led_off()
        if GPIO:
            GPIO.cleanup(self.pin)
