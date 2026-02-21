"""SQLite WAL-mode storage for offline resilience.

All sensor readings are stored locally before uplink. WAL mode
provides crash-safe writes even on sudden power loss.
"""

import sqlite3
import json
import time
import logging
from pathlib import Path

log = logging.getLogger("wqm.db")


class ReadingsDB:
    def __init__(self, db_path: str):
        Path(db_path).parent.mkdir(parents=True, exist_ok=True)
        self.db_path = db_path
        self.conn = sqlite3.connect(db_path, check_same_thread=False, timeout=10)
        self.conn.execute("PRAGMA journal_mode=WAL")
        self.conn.execute("PRAGMA synchronous=NORMAL")
        self._create_tables()
        log.info("Database opened: %s", db_path)

    def _create_tables(self):
        self.conn.executescript("""
            CREATE TABLE IF NOT EXISTS readings (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                timestamp REAL NOT NULL,
                data TEXT NOT NULL,
                synced INTEGER DEFAULT 0,
                created_at TEXT DEFAULT (datetime('now'))
            );
            CREATE INDEX IF NOT EXISTS idx_readings_synced ON readings(synced);
            CREATE INDEX IF NOT EXISTS idx_readings_timestamp ON readings(timestamp);

            CREATE TABLE IF NOT EXISTS device_events (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                timestamp REAL NOT NULL,
                event_type TEXT NOT NULL,
                data TEXT,
                created_at TEXT DEFAULT (datetime('now'))
            );
        """)
        self.conn.commit()

    def insert(self, reading: dict):
        self.conn.execute(
            "INSERT INTO readings (timestamp, data) VALUES (?, ?)",
            (reading.get("timestamp", time.time()), json.dumps(reading))
        )
        self.conn.commit()

    def get_unsynced(self, limit: int = 50) -> list:
        cursor = self.conn.execute(
            "SELECT id, data FROM readings WHERE synced = 0 ORDER BY timestamp ASC LIMIT ?",
            (limit,)
        )
        return [(row[0], json.loads(row[1])) for row in cursor.fetchall()]

    def mark_synced(self, ids: list):
        if not ids:
            return
        placeholders = ",".join("?" * len(ids))
        self.conn.execute(
            f"UPDATE readings SET synced = 1 WHERE id IN ({placeholders})", ids
        )
        self.conn.commit()

    def prune(self, retention_days: int = 30):
        cutoff = time.time() - (retention_days * 86400)
        cursor = self.conn.execute(
            "DELETE FROM readings WHERE synced = 1 AND timestamp < ?", (cutoff,)
        )
        self.conn.commit()
        if cursor.rowcount > 0:
            log.info("Pruned %d old readings", cursor.rowcount)

    def log_event(self, event_type: str, data: dict = None):
        self.conn.execute(
            "INSERT INTO device_events (timestamp, event_type, data) VALUES (?, ?, ?)",
            (time.time(), event_type, json.dumps(data) if data else None)
        )
        self.conn.commit()

    def count(self) -> dict:
        total = self.conn.execute("SELECT COUNT(*) FROM readings").fetchone()[0]
        unsynced = self.conn.execute(
            "SELECT COUNT(*) FROM readings WHERE synced = 0"
        ).fetchone()[0]
        return {"total": total, "unsynced": unsynced}

    def close(self):
        self.conn.close()
        log.info("Database closed")
