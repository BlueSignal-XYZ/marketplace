"""Threshold-based automation rules for relay control.

Each rule watches a sensor value and triggers the relay when a
condition is met. Rules support duration (auto-off) and cooldown
(minimum time between triggers).
"""

import logging
import time

log = logging.getLogger("wqm.rules")

OPERATORS = {
    ">": lambda v, t: v > t,
    "<": lambda v, t: v < t,
    ">=": lambda v, t: v >= t,
    "<=": lambda v, t: v <= t,
    "==": lambda v, t: v == t,
}

SENSOR_KEYS = {
    "ph": "ph",
    "tds": "tds_ppm",
    "turbidity": "turbidity_ntu",
    "orp": "orp_mv",
    "temperature": "temperature_c",
}


class RuleEngine:
    def __init__(self, rules_config: list, relay):
        self.relay = relay
        self.rules = []
        self._last_trigger = {}
        self._auto_off_time = None

        for r in (rules_config or []):
            name = r.get("name", "unnamed")
            sensor = r.get("sensor")
            condition = r.get("condition")
            threshold = r.get("threshold")
            if sensor and condition and threshold is not None:
                self.rules.append(r)
                self._last_trigger[name] = 0
                log.info("Rule loaded: %s (%s %s %s)", name, sensor, condition, threshold)

    def evaluate(self, reading: dict):
        """Evaluate all rules against a sensor reading."""
        if not self.relay or not self.rules:
            return

        now = time.time()

        if self._auto_off_time and now >= self._auto_off_time:
            self.relay.off()
            self._auto_off_time = None
            log.info("Auto-off: relay turned off after duration expired")

        for rule in self.rules:
            name = rule["name"]
            sensor_key = SENSOR_KEYS.get(rule["sensor"], rule["sensor"])
            value = reading.get(sensor_key)
            if value is None:
                continue

            op = OPERATORS.get(rule["condition"])
            if op is None:
                continue

            cooldown = rule.get("cooldown_seconds", 0)
            if now - self._last_trigger.get(name, 0) < cooldown:
                continue

            if op(value, rule["threshold"]):
                action = rule.get("action", "on")
                duration = rule.get("duration_seconds", 0)

                if action == "on":
                    self.relay.on()
                    if duration > 0:
                        self._auto_off_time = now + duration
                elif action == "off":
                    self.relay.off()
                    self._auto_off_time = None

                self._last_trigger[name] = now
                log.info("Rule triggered: %s (%s=%s %s %s)",
                         name, rule["sensor"], value,
                         rule["condition"], rule["threshold"])
