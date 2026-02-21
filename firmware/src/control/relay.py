"""Relay control via GPIO 23 N-MOSFET driver.

Active HIGH = relay energized. The relay can be used for dosing
pumps, alarms, or automated remediation based on threshold rules.
"""

import logging

log = logging.getLogger("wqm.relay")

try:
    import RPi.GPIO as GPIO
except ImportError:
    GPIO = None


class RelayController:
    def __init__(self, config: dict):
        self.pin = config.get("gpio_pin", 23)
        self.state = False
        if GPIO:
            GPIO.setmode(GPIO.BCM)
            GPIO.setup(self.pin, GPIO.OUT, initial=GPIO.LOW)
        default = config.get("default_state", "off")
        if default == "on":
            self.on()
        log.info("Relay initialized on GPIO %d, default=%s", self.pin, default)

    def on(self):
        if GPIO:
            GPIO.output(self.pin, GPIO.HIGH)
        self.state = True
        log.info("Relay ON")

    def off(self):
        if GPIO:
            GPIO.output(self.pin, GPIO.LOW)
        self.state = False
        log.info("Relay OFF")

    def is_on(self) -> bool:
        return self.state

    def cleanup(self):
        self.off()
        if GPIO:
            GPIO.cleanup(self.pin)
