# Architecture

    boxtracker/   Python backend (FastAPI): location, module discovery, API
    modules/      One folder per feature. Never edit one to add another.
    web/          The launcher: index.html, app.css, app.js

## Modules

A module is a folder in `modules/` with:

- `manifest.json` (required): name, tile color, order, blurb, and `regions`
  (where it works: `["GLOBAL"]` or codes like `["CA-ON"]`).
- `screen.js` (optional): `export function render(container, ctx)` draws the
  module's screen. Without it, the launcher shows a "Coming soon" panel.
  `ctx` holds `location` and the module's manifest.

To add a module: copy a folder, change the manifest, add a screen.

## Location

One service answers "where am I?" Order: manual setting, dev environment
variables, default home. GPS (via gpsd) plugs in at the top later. Modules
never talk to GPS directly.

## Regions

`boxtracker/regions.py` maps coordinates to region codes. A module whose
regions don't include the current location shows as "Not available here".

## Planned

- Data fetching and caching in the backend (polite polling, back-off).
- Shared map component, offline map packs per region.
- Provisioning scripts, kiosk mode, read-only filesystem (see Flightscope).
- Case design for the 3D printer.
