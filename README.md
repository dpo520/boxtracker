# Boxtracker

A handheld Raspberry Pi gadget for kids who like spotting things that move:
planes, snowplows, satellites, rockets and the weather. A home screen of big
tiles opens one small feature (a "module") at a time. It works anywhere in the
world and greys out tiles that don't apply to where you are.

Inspired by [Flightscope](https://github.com/nathanmarlor/flightscope-public)
(MIT) and designed to borrow its hardware and provisioning ideas.

## Run it on a laptop

    python3 -m venv .venv && source .venv/bin/activate
    pip install -r requirements.txt
    uvicorn boxtracker.main:app --reload

Open http://localhost:8000. To pretend you're somewhere else:

    BOXTRACKER_LAT=51.5 BOXTRACKER_LON=-0.12 uvicorn boxtracker.main:app --reload

(London: the Plows tile greys out because it's Ontario-only.)

## Status

Launcher, location service and region-aware tiles work. The five modules are
placeholders ("Coming soon"). Next up: Planes.

See docs/ARCHITECTURE.md for how it fits together.
