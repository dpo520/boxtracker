"""Where is the device? Every module asks this one service.

Order of preference (GPS comes later, via gpsd):
  1. a manually set location (settings screen, or POST /api/location)
  2. the BOXTRACKER_LAT / BOXTRACKER_LON environment variables (dev mode)
  3. a default home location
"""
import os
from dataclasses import dataclass

from .regions import regions_for

DEFAULT_LAT, DEFAULT_LON = 43.8971, -78.8658  # Oshawa, ON


@dataclass
class Location:
    lat: float
    lon: float
    source: str  # "manual" | "dev" | "default" (later: "gps")


_manual: Location | None = None


def get_location() -> Location:
    if _manual:
        return _manual
    lat, lon = os.getenv("BOXTRACKER_LAT"), os.getenv("BOXTRACKER_LON")
    if lat and lon:
        return Location(float(lat), float(lon), "dev")
    return Location(DEFAULT_LAT, DEFAULT_LON, "default")


def set_manual(lat: float, lon: float) -> Location:
    global _manual
    _manual = Location(lat, lon, "manual")
    return _manual


def describe(loc: Location) -> dict:
    return {
        "lat": loc.lat,
        "lon": loc.lon,
        "source": loc.source,
        "regions": regions_for(loc.lat, loc.lon),
    }
