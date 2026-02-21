"""Store-and-forward: flush buffered readings when LoRaWAN link restores."""

import logging
import time

log = logging.getLogger("wqm.sync")

TX_INTERVAL = 3.0


class SyncManager:
    def __init__(self, db, lora, config: dict):
        self.db = db
        self.lora = lora
        self.batch_size = config.get("sync_batch_size", 50)

    def flush_buffered(self):
        """Send unsynced readings over LoRa. Returns count of readings sent."""
        if not self.lora or not self.lora.is_joined():
            return 0

        unsynced = self.db.get_unsynced(limit=self.batch_size)
        if not unsynced:
            return 0

        log.info("Flushing %d buffered readings", len(unsynced))
        sent_ids = []

        for row_id, reading in unsynced:
            from .._cayenne_helper import encode_reading
            payload = encode_reading(reading)

            if self.lora.send(payload, port=2):
                sent_ids.append(row_id)
            else:
                break

            time.sleep(TX_INTERVAL)

        if sent_ids:
            self.db.mark_synced(sent_ids)

        log.info("Flushed %d / %d readings", len(sent_ids), len(unsynced))
        return len(sent_ids)
