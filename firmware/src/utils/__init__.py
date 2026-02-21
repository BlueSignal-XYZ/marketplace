"""WQM-1 utilities: structured logging, health diagnostics."""

from .logger import setup_logging
from .health import HealthCheck

__all__ = ["setup_logging", "HealthCheck"]
