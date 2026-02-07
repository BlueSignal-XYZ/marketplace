"""
Local SQLite Database for Offline Buffering

Stores sensor readings locally when LoRaWAN uplink is unavailable.
Readings are timestamped and marked as synced/unsynced for drain logic.

Database location: /var/lib/bluesignal/readings.db (configurable)
"""

import sqlite3
import json
import time
import logging
import os

logger = logging.getLogger(__name__)

DEFAULT_DB_PATH = "/var/lib/bluesignal/readings.db"

# Schema version for future migrations
SCHEMA_VERSION = 1

CREATE_TABLE_SQL = """
CREATE TABLE IF NOT EXISTS readings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp REAL NOT NULL,
    device_id TEXT NOT NULL,
    sensors TEXT NOT NULL,
    metadata TEXT,
    gps_lat REAL,
    gps_lon REAL,
    gps_alt REAL,
    synced INTEGER DEFAULT 0,
    sync_attempts INTEGER DEFAULT 0,
    created_at REAL NOT NULL
);
"""

CREATE_INDEX_SQL = """
CREATE INDEX IF NOT EXISTS idx_readings_synced ON readings(synced);
CREATE INDEX IF NOT EXISTS idx_readings_timestamp ON readings(timestamp);
"""

CREATE_META_TABLE_SQL = """
CREATE TABLE IF NOT EXISTS meta (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
);
"""


class LocalDatabase:
    """
    SQLite database for buffering sensor readings.

    Usage:
        db = LocalDatabase()
        db.initialize()
        db.store_reading(device_id, sensors, metadata, gps)
        unsynced = db.get_unsynced(limit=50)
        db.mark_synced([1, 2, 3])
    """

    def __init__(self, db_path=DEFAULT_DB_PATH):
        self.db_path = db_path
        self._conn = None

    def initialize(self):
        """
        Create/open the database and ensure schema exists.

        Returns:
            bool: True if database is ready.
        """
        try:
            # Ensure directory exists
            db_dir = os.path.dirname(self.db_path)
            if db_dir and not os.path.exists(db_dir):
                os.makedirs(db_dir, mode=0o755, exist_ok=True)

            self._conn = sqlite3.connect(
                self.db_path,
                check_same_thread=False,
                timeout=10,
            )
            self._conn.row_factory = sqlite3.Row

            # Enable WAL mode for better concurrent read/write
            self._conn.execute("PRAGMA journal_mode=WAL;")
            self._conn.execute("PRAGMA synchronous=NORMAL;")

            # Create tables
            self._conn.executescript(CREATE_TABLE_SQL)
            self._conn.executescript(CREATE_INDEX_SQL)
            self._conn.executescript(CREATE_META_TABLE_SQL)

            # Store schema version
            self._conn.execute(
                "INSERT OR REPLACE INTO meta (key, value) VALUES (?, ?)",
                ("schema_version", str(SCHEMA_VERSION)),
            )
            self._conn.commit()

            count = self._conn.execute(
                "SELECT COUNT(*) FROM readings WHERE synced = 0"
            ).fetchone()[0]

            logger.info(
                "Local database initialized at %s (%d unsynced readings)",
                self.db_path, count,
            )
            return True

        except Exception as e:
            logger.error("Database initialization failed: %s", e)
            return False

    def store_reading(self, device_id, sensors, metadata=None, gps=None):
        """
        Store a sensor reading in the local buffer.

        Args:
            device_id: Device identifier string
            sensors: dict of sensor readings {name: value}
            metadata: Optional dict of metadata (battery, signal, etc.)
            gps: Optional dict with latitude, longitude, altitude

        Returns:
            int: Row ID of inserted reading, or None on error.
        """
        if self._conn is None:
            logger.error("Database not initialized")
            return None

        try:
            now = time.time()
            cursor = self._conn.execute(
                """
                INSERT INTO readings
                    (timestamp, device_id, sensors, metadata,
                     gps_lat, gps_lon, gps_alt, synced, sync_attempts, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, 0, 0, ?)
                """,
                (
                    now,
                    device_id,
                    json.dumps(sensors),
                    json.dumps(metadata) if metadata else None,
                    gps.get("latitude") if gps else None,
                    gps.get("longitude") if gps else None,
                    gps.get("altitude") if gps else None,
                    now,
                ),
            )
            self._conn.commit()

            row_id = cursor.lastrowid
            logger.debug("Stored reading #%d for device %s", row_id, device_id)
            return row_id

        except Exception as e:
            logger.error("Failed to store reading: %s", e)
            return None

    def get_unsynced(self, limit=50):
        """
        Get unsynced readings ordered by timestamp (oldest first).

        Args:
            limit: Maximum number of readings to return.

        Returns:
            list: List of dicts with reading data.
        """
        if self._conn is None:
            return []

        try:
            rows = self._conn.execute(
                """
                SELECT id, timestamp, device_id, sensors, metadata,
                       gps_lat, gps_lon, gps_alt, sync_attempts
                FROM readings
                WHERE synced = 0
                ORDER BY timestamp ASC
                LIMIT ?
                """,
                (limit,),
            ).fetchall()

            results = []
            for row in rows:
                results.append({
                    "id": row["id"],
                    "timestamp": row["timestamp"],
                    "device_id": row["device_id"],
                    "sensors": json.loads(row["sensors"]),
                    "metadata": json.loads(row["metadata"]) if row["metadata"] else None,
                    "gps": {
                        "latitude": row["gps_lat"],
                        "longitude": row["gps_lon"],
                        "altitude": row["gps_alt"],
                    } if row["gps_lat"] is not None else None,
                    "sync_attempts": row["sync_attempts"],
                })

            return results

        except Exception as e:
            logger.error("Failed to get unsynced readings: %s", e)
            return []

    def mark_synced(self, reading_ids):
        """
        Mark readings as successfully synced.

        Args:
            reading_ids: List of reading row IDs to mark.
        """
        if self._conn is None or not reading_ids:
            return

        try:
            placeholders = ",".join("?" * len(reading_ids))
            self._conn.execute(
                f"UPDATE readings SET synced = 1 WHERE id IN ({placeholders})",
                reading_ids,
            )
            self._conn.commit()
            logger.debug("Marked %d readings as synced", len(reading_ids))

        except Exception as e:
            logger.error("Failed to mark readings synced: %s", e)

    def increment_sync_attempts(self, reading_ids):
        """Increment sync attempt counter for failed syncs."""
        if self._conn is None or not reading_ids:
            return

        try:
            placeholders = ",".join("?" * len(reading_ids))
            self._conn.execute(
                f"""UPDATE readings
                    SET sync_attempts = sync_attempts + 1
                    WHERE id IN ({placeholders})""",
                reading_ids,
            )
            self._conn.commit()

        except Exception as e:
            logger.error("Failed to increment sync attempts: %s", e)

    def get_unsynced_count(self):
        """Get count of unsynced readings."""
        if self._conn is None:
            return 0

        try:
            return self._conn.execute(
                "SELECT COUNT(*) FROM readings WHERE synced = 0"
            ).fetchone()[0]
        except Exception:
            return 0

    def cleanup_old_synced(self, max_age_days=30):
        """
        Remove old synced readings to save disk space.

        Args:
            max_age_days: Delete synced readings older than this many days.
        """
        if self._conn is None:
            return

        try:
            cutoff = time.time() - (max_age_days * 86400)
            cursor = self._conn.execute(
                "DELETE FROM readings WHERE synced = 1 AND timestamp < ?",
                (cutoff,),
            )
            self._conn.commit()

            if cursor.rowcount > 0:
                logger.info(
                    "Cleaned up %d old synced readings (older than %d days)",
                    cursor.rowcount, max_age_days,
                )

                # Reclaim disk space
                self._conn.execute("VACUUM;")

        except Exception as e:
            logger.error("Cleanup failed: %s", e)

    def get_stats(self):
        """Get database statistics."""
        if self._conn is None:
            return {}

        try:
            total = self._conn.execute("SELECT COUNT(*) FROM readings").fetchone()[0]
            unsynced = self._conn.execute(
                "SELECT COUNT(*) FROM readings WHERE synced = 0"
            ).fetchone()[0]
            synced = total - unsynced

            # Database file size
            db_size = os.path.getsize(self.db_path) if os.path.exists(self.db_path) else 0

            return {
                "total_readings": total,
                "unsynced": unsynced,
                "synced": synced,
                "db_size_bytes": db_size,
                "db_size_mb": round(db_size / (1024 * 1024), 2),
            }

        except Exception as e:
            logger.error("Failed to get stats: %s", e)
            return {}

    def shutdown(self):
        """Close the database connection."""
        if self._conn:
            try:
                self._conn.close()
            except Exception:
                pass
            self._conn = None
        logger.info("Local database shutdown complete")
