"""Thin wrapper to avoid circular imports in storage.sync."""

from .radio.cayenne import CayenneLPP


def encode_reading(reading: dict) -> bytes:
    return CayenneLPP.encode(reading)
