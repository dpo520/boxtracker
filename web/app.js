// Launcher + tiny router. Modules plug in through modules/<id>/screen.js.
const $ = (s) => document.querySelector(s);
const screen = $("#screen"), title = $("#title"), back = $("#back"), where = $("#where");

const ICONS = {
  planes: '<path d="M2 14l9-3V4a2 2 0 014 0v7l9 3v3l-9-2v4l3 2v2l-5-1-5 1v-2l3-2v-4l-9 2z"/>',
  weather: '<circle cx="9" cy="9" r="4"/><path d="M7 20a5 5 0 010-10 6 6 0 0111.5 1.5A4.5 4.5 0 0118 20z"/>',
  plows: '<path d="M2 15l6-9h10v9h4v4H2zM4 15h12V8H9z"/><circle cx="7" cy="20" r="2"/><circle cx="17" cy="20" r="2"/>',
  satellites: '<rect x="9" y="9" width="6" height="6" rx="1" transform="rotate(45 12 12)"/><path d="M3 9l5 5-3 3-5-5zM21 15l-5-5 3-3 5 5z" transform="translate(1 1)"/>',
  launches: '<path d="M12 1c4 3 5 8 4 13l2 3v4l-3-2h-6l-3 2v-4l2-3c-1-5 0-10 4-13zM12 8a2 2 0 100 4 2 2 0 000-4z"/>',
  settings: '<circle cx="12" cy="12" r="4"/><path d="M10 1h4l1 3 3 1 3-2 2 3-2 3 1 3 3 1v4l-3 1-1 3 2 3-3 2-3-2-3 1-1 3h-4l-1-3-3-1-3 2-2-3 2-3-1-3-3-1v-4l3-1 1-3-2-3 3-2 3 2 3-1z" transform="scale(.9) translate(1.3 1.3)"/>',
};
const icon = (id) => `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">${ICONS[id] || ""}</svg>`;

let state = { modules: [], location: null };

async function load() {
  const [modules, location] = await Promise.all([
    fetch("/api/modules").then((r) => r.json()),
    fetch("/api/location").then((r) => r.json()),
  ]);
  state = { modules, location };
  where.textContent = `${location.lat.toFixed(2)}, ${location.lon.toFixed(2)}`;
}

function home() {
  title.textContent = "Boxtracker";
  back.hidden = true;
  const tiles = state.modules.map((m) => {
    const off = !m.available;
    return `<button class="tile ${off ? "off" : ""}" ${off ? "" : `style="--c:${m.color}"`} data-id="${m.id}" ${off ? 'aria-disabled="true"' : ""}>
      ${icon(m.id)}
      <span><span class="name">${m.name}</span>${off ? `<div class="note">Not available here</div>` : ""}</span>
    </button>`;
  });
  tiles.push(`<button class="tile settings" data-id="settings">${icon("settings")}<span class="name">Settings</span></button>`);
  screen.innerHTML = `<div class="grid">${tiles.join("")}</div>`;
}

async function openModule(id) {
  const m = state.modules.find((x) => x.id === id);
  const name = m ? m.name : "Settings";
  title.textContent = name;
  back.hidden = false;
  if (m && m.has_screen) {
    const mod = await import(`/modules/${id}/screen.js`);
    screen.innerHTML = "";
    mod.render(screen, { location: state.location, module: m });
    return;
  }
  const text = m ? m.blurb : "Wi-Fi, location and display options will live here.";
  screen.innerHTML = `<div class="panel"><span class="pill">Coming soon</span><h2>${name}</h2><p>${text}</p></div>`;
}

function route() {
  const id = location.hash.replace("#/", "");
  id ? openModule(id) : home();
}

screen.addEventListener("click", (e) => {
  const t = e.target.closest(".tile");
  if (t && t.getAttribute("aria-disabled") !== "true") location.hash = `#/${t.dataset.id}`;
});
back.addEventListener("click", () => (location.hash = ""));
window.addEventListener("hashchange", route);
load().then(route);
