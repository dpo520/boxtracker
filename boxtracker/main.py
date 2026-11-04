from pathlib import Path

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

from . import location, modules

ROOT = Path(__file__).resolve().parent.parent
app = FastAPI(title="Boxtracker")


class LatLon(BaseModel):
    lat: float
    lon: float


@app.get("/api/location")
def get_location():
    return location.describe(location.get_location())


@app.post("/api/location")
def set_location(body: LatLon):
    return location.describe(location.set_manual(body.lat, body.lon))


@app.get("/api/modules")
def list_modules():
    regions = location.describe(location.get_location())["regions"]
    return modules.with_availability(modules.load_all(), regions)


# Each module's own files (manifest.json, screen.js) are served as-is.
app.mount("/modules", StaticFiles(directory=ROOT / "modules"), name="modules")
app.mount("/", StaticFiles(directory=ROOT / "web", html=True), name="web")
