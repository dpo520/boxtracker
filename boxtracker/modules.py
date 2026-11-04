"""Finds modules by scanning modules/*/manifest.json.

A module is just a folder. Adding one never requires editing another.
"""
import json
from pathlib import Path

MODULES_DIR = Path(__file__).resolve().parent.parent / "modules"


def load_all() -> list[dict]:
    found = []
    for manifest in sorted(MODULES_DIR.glob("*/manifest.json")):
        data = json.loads(manifest.read_text())
        data["id"] = manifest.parent.name
        data["has_screen"] = (manifest.parent / "screen.js").exists()
        found.append(data)
    return sorted(found, key=lambda m: m.get("order", 100))


def with_availability(modules: list[dict], regions: list[str]) -> list[dict]:
    out = []
    for m in modules:
        needs = m.get("regions", ["GLOBAL"])
        available = "GLOBAL" in needs or any(r in regions for r in needs)
        out.append({**m, "available": available})
    return out
