"""
Sync Manager - Drains buffered readings over LoRaWAN

Reads unsynced entries from the local SQLite database and transmits
them via LoRaWAN when connectivity is available. Handles retries
and backoff for failed transmissions.
"""

import logging
import time

logger = logging.getLogger(__name__)

# Max readings to drain per sync cycle
DEFAULT_BATCH_SIZE = 10

# Max sync attempts before giving up on a reading
MAX_SYNC_ATTEMPTS = 5

# Minimum delay between LoRa transmissions (seconds)
# LoRaWAN duty cycle compliance
TX_INTERVAL = 3.0


class SyncManager:
    """
    Manages draining buffered readings to the cloud via LoRaWAN.

    Usage:
        sync = SyncManager(local_db, lora, payload_encoder)
        sync.drain()  # Send unsynced readings
    """

    def __init__(self, local_db, lora, encode_fn, batch_size=DEFAULT_BATCH_SIZE):
        """
        Args:
            local_db: LocalDatabase instance
            lora: LoRaWAN instance
            encode_fn: Function to encode a reading dict into bytes
                       (e.g., comms.payload.encode_sensor_reading)
            batch_size: Max readings to send per drain cycle
        """
        self.db = local_db
        self.lora = lora
        self.encode_fn = encode_fn
        self.batch_size = batch_size

    def drain(self):
        """
        Send all unsynced readings via LoRaWAN.

        Returns:
            dict: {sent: int, failed: int, remaining: int}
        """
        if not self.lora.is_joined():
            logger.warning("Cannot drain: not joined to LoRaWAN network")
            return {"sent": 0, "failed": 0, "remaining": self.db.get_unsynced_count()}

        unsynced = self.db.get_unsynced(limit=self.batch_size)

        if not unsynced:
            logger.debug("No unsynced readings to drain")
            return {"sent": 0, "failed": 0, "remaining": 0}

        logger.info("Draining %d buffered readings...", len(unsynced))

        sent = 0
        failed = 0
        sent_ids = []
        failed_ids = []

        for reading in unsynced:
            # Skip readings that have failed too many times
            if reading["sync_attempts"] >= MAX_SYNC_ATTEMPTS:
                logger.warning(
                    "Reading #%d exceeded max sync attempts (%d), skipping",
                    reading["id"], MAX_SYNC_ATTEMPTS,
                )
                # Mark as synced to prevent infinite retries
                sent_ids.append(reading["id"])
                continue

            try:
                # Build the payload from the reading
                payload_data = {
                    "temperature": reading["sensors"].get("temperature"),
                    "ph": reading["sensors"].get("ph"),
                    "turbidity": reading["sensors"].get("turbidity"),
                    "tds": reading["sensors"].get("tds"),
                    "gps": reading.get("gps"),
                    "battery_voltage": (
                        reading["metadata"].get("battery_voltage")
                        if reading.get("metadata")
                        else None
                    ),
                }

                payload_bytes = self.encode_fn(payload_data)

                if self.lora.send(payload_bytes, port=2):  # Port 2 for buffered data
                    sent += 1
                    sent_ids.append(reading["id"])
                    logger.debug("Drained reading #%d", reading["id"])
                else:
                    failed += 1
                    failed_ids.append(reading["id"])
                    logger.warning("Failed to drain reading #%d", reading["id"])

                # Respect duty cycle
                time.sleep(TX_INTERVAL)

            except Exception as e:
                failed += 1
                failed_ids.append(reading["id"])
                logger.error("Error draining reading #%d: %s", reading["id"], e)

        # Update database
        if sent_ids:
            self.db.mark_synced(sent_ids)

        if failed_ids:
            self.db.increment_sync_attempts(failed_ids)

        remaining = self.db.get_unsynced_count()

        logger.info(
            "Drain complete: sent=%d, failed=%d, remaining=%d",
            sent, failed, remaining,
        )

        return {"sent": sent, "failed": failed, "remaining": remaining}

    def get_status(self):
        """Get sync status summary."""
        return {
            "unsynced_count": self.db.get_unsynced_count(),
            "lora_joined": self.lora.is_joined(),
            "db_stats": self.db.get_stats(),
        }
