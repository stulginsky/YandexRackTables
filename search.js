/* Global search results page (static prototype) */

function el(id) {
  const node = document.getElementById(id);
  if (!node) throw new Error(`Missing element #${id}`);
  return node;
}

function normalize(str) {
  return String(str ?? "").trim().toLowerCase();
}

function matchesQuery(value, query) {
  if (!query) return true;
  return normalize(value).includes(normalize(query));
}

// Keep this file standalone: duplicate minimal demo data
const BASE_OBJECTS = [
  { id: "o1", commonName: "[PatchPanel]", type: "PatchPanel", visibleLabel: "", assetTag: "CF-4NY100", location: "Row A/T01", tags: ["production"] },
  { id: "o2", commonName: "[PatchPanel]", type: "PatchPanel", visibleLabel: "", assetTag: "", location: "Row 1/L03", tags: [] },
  { id: "o3", commonName: "[PDU]", type: "PDU", visibleLabel: "", assetTag: "CF-4NY100", location: "Row 1/L03", tags: [] },
  { id: "o4", commonName: "[PDU]", type: "PDU", visibleLabel: "", assetTag: "", location: "Row 1/L01", tags: ["production"] },
  { id: "o5", commonName: "[PDU]", type: "PDU", visibleLabel: "", assetTag: "CF-4NY101", location: "Row 1/L02", tags: ["testing"] },
  { id: "o6", commonName: "[Shelf]", type: "Shelf", visibleLabel: "", assetTag: "", location: "Row 1/L01", tags: [] },
  { id: "o7", commonName: "backup library", type: "TapeLibrary", visibleLabel: "backup", assetTag: "misc200", location: "Row 1/L03", tags: ["production"] },
  { id: "o8", commonName: "london LB", type: "Network switch", visibleLabel: "lb", assetTag: "net1000", location: "Row 1/L02", tags: ["load balancer", "production"] },
  { id: "o9", commonName: "london modem 1", type: "Modem", visibleLabel: "", assetTag: "", location: "[Shelf]", tags: ["medium network"] },
  { id: "o10", commonName: "london router", type: "Router", visibleLabel: "testing", assetTag: "net247", location: "Row 1/L02", tags: ["testing"] },
  { id: "o11", commonName: "London server 1", type: "Server", visibleLabel: "lserver01", assetTag: "srv500", location: "Row 1/L01", tags: ["production"] },
  { id: "o12", commonName: "London server 2", type: "Server", visibleLabel: "lserver02", assetTag: "srv501", location: "Row 1/L01", tags: ["production"] },
  { id: "o13", commonName: "London server 3", type: "Server", visibleLabel: "lserver03", assetTag: "srv502", location: "Row 1/L01", tags: ["production"] },
  { id: "o14", commonName: "London server 4", type: "Server", visibleLabel: "lserver04", assetTag: "srv503", location: "Row 1/L01", tags: ["production"] },
  { id: "o15", commonName: "London server 5", type: "Server", visibleLabel: "lserver05", assetTag: "srv504", location: "Row 1/L01", tags: ["production"] },
  { id: "o16", commonName: "London server 6", type: "Server", visibleLabel: "lserver06", assetTag: "srv505", location: "Row 1/L03", tags: ["production"] },
  { id: "o17", commonName: "London server 7", type: "Server", visibleLabel: "lserver07", assetTag: "srv506", location: "Row 1/L03", tags: ["production"] },
  { id: "o18", commonName: "london-NAS", type: "Router", visibleLabel: "", assetTag: "net1001", location: "Row 1/L02", tags: ["medium network"] },
  { id: "o19", commonName: "londonswitch1", type: "Network switch", visibleLabel: "", assetTag: "", location: "Row 1/L02", tags: ["production"] },
  { id: "o20", commonName: "lserver06 array", type: "DiskArray", visibleLabel: "lserver06 array", assetTag: "", location: "Row 1/L03", tags: [] },
];

function renderObjectsResults(q) {
  const host = el("objectsResults");
  host.textContent = "";

  const rows = BASE_OBJECTS.filter((o) => matchesQuery(Object.values(o).join(" "), q));
  for (const o of rows) {
    const row = document.createElement("a");
    row.className = "searchRow";
    row.href = "./index.html?q=" + encodeURIComponent(q);

    const what = document.createElement("div");
    what.className = "searchWhat";
    what.innerHTML = `<span class="searchIcon" aria-hidden="true"></span><strong>${o.commonName}</strong><div class="muted small">${o.type}</div>`;

    const why = document.createElement("div");
    why.className = "searchWhy";
    const whyParts = [];
    if (matchesQuery(o.commonName, q)) whyParts.push("name");
    if (matchesQuery(o.assetTag, q)) whyParts.push("asset tag");
    if (matchesQuery(o.visibleLabel, q)) whyParts.push("label");
    if (matchesQuery(o.location, q)) whyParts.push("location");
    why.innerHTML = `<div class="muted small">matched: ${whyParts.length ? whyParts.join(", ") : "text"}</div>`;

    row.appendChild(what);
    row.appendChild(why);
    host.appendChild(row);
  }

  return rows.length;
}

function renderSimpleCards(hostId, items, q) {
  const host = el(hostId);
  host.textContent = "";
  for (const item of items) {
    const a = document.createElement("a");
    a.className = "searchCard";
    a.href = "./index.html?q=" + encodeURIComponent(q);
    a.innerHTML = `<div class="searchCardTitle">${item.title}</div><div class="muted small">${item.subtitle}</div>`;
    host.appendChild(a);
  }
}

function initSearch() {
  const qs = new URLSearchParams(window.location.search);
  const q = (qs.get("q") || "").trim();

  const globalSearch = /** @type {HTMLInputElement} */ (el("globalSearch"));
  globalSearch.value = q;
  globalSearch.addEventListener("input", () => {
    if (!globalSearch.value.trim()) window.location.href = "./main.html";
  });
  globalSearch.addEventListener("keydown", (e) => {
    if (e.key !== "Enter") return;
    const next = globalSearch.value.trim();
    window.location.href = `./search.html?q=${encodeURIComponent(next)}`;
  });

  el("searchTitle").textContent = q ? `Results found for “${q}”` : "Search";
  const crumb = document.getElementById("searchCrumb");
  if (crumb) crumb.textContent = q ? `search results for “${q}”` : "search results";

  const objCount = q ? renderObjectsResults(q) : 0;

  // Lightweight, “looks like RackTables” sections
  const ipv4 = q
    ? [
        { title: "10.200.1.0/26", subtitle: `matched “${q}” in description` },
        { title: "10.200.1.64/26", subtitle: `matched “${q}” in comment` },
      ]
    : [];
  const locations = q
    ? [
        { title: "London", subtitle: `matched “${q}” in location name` },
        { title: "Row 1 / Rack L01", subtitle: `matched “${q}” in hierarchy` },
      ]
    : [];

  renderSimpleCards("ipv4Results", ipv4, q);
  renderSimpleCards("locationsResults", locations, q);

  // Hide empty sections if query is empty
  if (!q) {
    const o = document.getElementById("objectsSection");
    const i = document.getElementById("ipv4Section");
    const l = document.getElementById("locationsSection");
    if (o) o.style.display = "none";
    if (i) i.style.display = "none";
    if (l) l.style.display = "none";
  }

  // Update title count style in a minimal way
  if (q) document.title = `${objCount} result(s) for ${q}`;
}

document.addEventListener("DOMContentLoaded", initSearch);

