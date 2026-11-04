"""Tiny region lookup so modules can say where they work.

Each region is a rough bounding box: (south, west, north, east).
Add more as modules need them. "GLOBAL" is always true.
"""

REGIONS = {
    "CA-ON": (41.6, -95.2, 56.9, -74.3),  # Ontario, rough box
}


def regions_for(lat: float, lon: float) -> list[str]:
    found = ["GLOBAL"]
    for code, (s, w, n, e) in REGIONS.items():
        if s <= lat <= n and w <= lon <= e:
            found.append(code)
    return found
