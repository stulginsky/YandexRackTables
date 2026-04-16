/* Prototype: sortable + filterable table (vanilla JS) */

const COLUMNS = [
  { key: "incident", label: "Incident", type: "bool" },
  { key: "commonName", label: "Common name", type: "text" },
  { key: "type", label: "Type", type: "text" },
  { key: "visibleLabel", label: "Visible label", type: "text" },
  { key: "assetTag", label: "Asset tag", type: "text" },
  { key: "location", label: "Row/Rack or Container", type: "text" },
];

/** @type {Array<{id:string, commonName:string, type:string, visibleLabel:string, assetTag:string, location:string, tags:string[]}>} */
const BASE_DATA = [
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

function pick(arr, i) {
  return arr[i % arr.length];
}

function pad3(n) {
  return String(n).padStart(3, "0");
}

function generateDemoObjects(count, offset) {
  /** @type {Array<{id:string, commonName:string, type:string, visibleLabel:string, assetTag:string, location:string, tags:string[]}>} */
  const out = [];

  const sites = ["london", "frankfurt", "amsterdam", "warsaw", "helsinki", "stockholm"];
  const rows = ["Row 1", "Row 2", "Row 3", "Row A", "Row B"];
  const racks = ["L01", "L02", "L03", "L04", "R01", "R02", "T01", "T02"];
  const tags = ["production", "testing", "medium network", "load balancer"];

  const typeDefs = [
    { type: "Server", prefix: "srv", names: ["compute", "db", "app", "storage", "monitor", "ci"] },
    { type: "Network switch", prefix: "sw", names: ["core", "dist", "access", "leaf", "spine"] },
    { type: "Router", prefix: "rt", names: ["edge", "wan", "peering"] },
    { type: "Firewall", prefix: "fw", names: ["perimeter", "dmz"] },
    { type: "Load balancer", prefix: "lb", names: ["public", "internal"] },
    { type: "DiskArray", prefix: "san", names: ["array", "shelf", "pool"] },
    { type: "PDU", prefix: "pdu", names: ["apc", "eaton"] },
    { type: "PatchPanel", prefix: "pp", names: ["copper", "fiber"] },
    { type: "UPS", prefix: "ups", names: ["apc", "vertiv"] },
  ];

  for (let i = 0; i < count; i++) {
    const idx = offset + i + 1;
    const def = pick(typeDefs, idx);
    const site = pick(sites, idx);
    const namePart = pick(def.names, idx);

    const deviceNum = (idx % 999) + 1;
    const commonName =
      def.type === "Server"
        ? `${site}-${namePart}-${pad3(deviceNum)}`
        : `${site}-${def.prefix}-${namePart}-${pad3(deviceNum)}`;

    const visibleLabel =
      def.type === "Server"
        ? `${site.slice(0, 2)}${namePart.slice(0, 2)}${pad3(deviceNum)}`
        : namePart;

    const assetTag =
      def.type === "Server"
        ? `srv${500 + (idx % 900)}`
        : def.type === "Network switch" || def.type === "Router" || def.type === "Firewall" || def.type === "Load balancer"
          ? `net${1000 + (idx % 2000)}`
          : def.type === "DiskArray"
            ? `stor${200 + (idx % 800)}`
            : def.type === "UPS"
              ? `ups${100 + (idx % 500)}`
              : def.type === "PDU"
                ? `pdu${100 + (idx % 900)}`
                : "";

    const location = `${pick(rows, idx)}/${pick(racks, idx)}`;

    const rowTags = [];
    if (idx % 4 === 0) rowTags.push("production");
    if (idx % 11 === 0) rowTags.push("testing");
    if (def.type === "Load balancer" || (def.type === "Network switch" && idx % 7 === 0)) rowTags.push("load balancer");
    if ((def.type === "Router" || def.type === "Firewall") && idx % 3 === 0) rowTags.push("medium network");
    // keep tags limited to known set
    const finalTags = [...new Set(rowTags)].filter((t) => tags.includes(t));

    out.push({
      id: `o${21 + i}`,
      commonName,
      type: def.type,
      visibleLabel,
      assetTag,
      location,
      tags: finalTags,
    });
  }

  return out;
}

/** @type {Array<{id:string, commonName:string, type:string, visibleLabel:string, assetTag:string, location:string, tags:string[]}>} */
const DATA = [...BASE_DATA, ...generateDemoObjects(750, BASE_DATA.length)];

const INCIDENT_IDS = new Set(["o14", "o33", "o58", "o121", "o219"]);

const state = {
  // default: incident rows first
  sort: /** @type {{key:string, dir:"asc"|"desc"}|null} */ ({ key: "incident", dir: "desc" }),
  columnFilter: { key: COLUMNS[0].key, query: "" },
  sidebarColumnFilter: { key: COLUMNS[0].key, query: "" },
  globalQuery: "",
  searchScopeEnabled: true,
  quickFilters: /** @type {Record<string,string>} */ (Object.create(null)),
  tags: { mode: "and", selected: /** @type {Set<string>} */ (new Set()) },
  selectedRowId: /** @type {string|null} */ (null),
};

function normalize(str) {
  return String(str ?? "").trim().toLowerCase();
}

function compareValues(a, b) {
  const an = normalize(a);
  const bn = normalize(b);
  const aNum = Number(an);
  const bNum = Number(bn);
  const aIsNum = an !== "" && Number.isFinite(aNum);
  const bIsNum = bn !== "" && Number.isFinite(bNum);
  if (aIsNum && bIsNum) return aNum - bNum;
  return an.localeCompare(bn, "ru", { numeric: true, sensitivity: "base" });
}

function matchesQuery(value, query) {
  if (!query) return true;
  return normalize(value).includes(normalize(query));
}

function tagsMatch(row) {
  const selected = [...state.tags.selected];
  if (selected.length === 0) return true;
  const rowTags = new Set(row.tags || []);
  if (state.tags.mode === "and") {
    return selected.every((t) => rowTags.has(t));
  }
  return selected.some((t) => rowTags.has(t));
}

function getVisibleRows() {
  const colKey = state.columnFilter.key;
  const colQuery = state.columnFilter.query;
  const sidebarColKey = state.sidebarColumnFilter.key;
  const sidebarColQuery = state.sidebarColumnFilter.query;

  return DATA.filter((row) => {
    if (!tagsMatch(row)) return false;
    if (state.searchScopeEnabled && !matchesQuery(Object.values(row).join(" "), state.globalQuery)) return false;
    if (colKey === "incident") {
      if (!incidentMatches(row, colQuery)) return false;
    } else if (!matchesQuery(row[colKey], colQuery)) return false;

    if (sidebarColKey === "incident") {
      if (!incidentMatches(row, sidebarColQuery)) return false;
    } else if (!matchesQuery(row[sidebarColKey], sidebarColQuery)) return false;
    for (const col of COLUMNS) {
      const q = state.quickFilters[col.key] || "";
      if (col.key === "incident") {
        if (!incidentMatches(row, q)) return false;
      } else if (!matchesQuery(row[col.key], q)) return false;
    }
    return true;
  });
}

function sortRows(rows) {
  if (!state.sort) return rows;
  const { key, dir } = state.sort;
  const mult = dir === "asc" ? 1 : -1;
  return [...rows].sort((ra, rb) => {
    const aVal = key === "incident" ? (INCIDENT_IDS.has(ra.id) ? 1 : 0) : ra[key];
    const bVal = key === "incident" ? (INCIDENT_IDS.has(rb.id) ? 1 : 0) : rb[key];
    const primary = mult * compareValues(aVal, bVal);
    if (primary !== 0) return primary;
    return compareValues(ra.commonName, rb.commonName);
  });
}

function incidentMatches(row, query) {
  const isIncident = INCIDENT_IDS.has(row.id);
  if (query === "true") return isIncident;
  if (query === "false") return !isIncident;
  return true; // any / empty
}

function el(id) {
  const node = document.getElementById(id);
  if (!node) throw new Error(`Missing element #${id}`);
  return node;
}

function getRowById(id) {
  return DATA.find((row) => row.id === id) || null;
}

function isIncidentRow(row) {
  return INCIDENT_IDS.has(row.id);
}

function makeHostLabel(row) {
  if (row.visibleLabel) return row.visibleLabel;
  return normalize(row.commonName).replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || row.id;
}

function makeInterfaceLabel(row) {
  const type = normalize(row.type);
  if (type.includes("server")) return "eth0";
  if (type.includes("switch")) return "xe-0/0/1";
  if (type.includes("router")) return "ge-0/0/0";
  if (type.includes("firewall")) return "port1";
  if (type.includes("pdu")) return "feed-a";
  return "port-1";
}

function makePeerConnections(row) {
  const peers = [];
  if (row.location) peers.push(`${row.location} gateway`);
  if (row.tags?.includes("production")) peers.push("production aggregation");
  if (row.tags?.includes("testing")) peers.push("testing segment");
  if (row.tags?.includes("medium network")) peers.push("medium network core");
  if (row.tags?.includes("load balancer")) peers.push("load balancer tier");
  if (row.assetTag) peers.push(row.assetTag);
  return peers.slice(0, 4);
}

function makeNetworkPath(row) {
  const parts = [
    row.location || "Unknown rack",
    row.type || "Object",
    row.tags?.length ? row.tags.join(" / ") : "general segment",
  ];
  return parts.join(" -> ");
}

function makeObjectIp(row) {
  const numericId = Number(row.id.replace(/\D+/g, "")) || 1;
  const thirdOctet = 10 + (numericId % 20);
  const fourthOctet = 10 + (numericId % 200);
  return `10.200.${thirdOctet}.${fourthOctet}`;
}

function makeAlertTarget(row) {
  if (isIncidentRow(row)) return `${makeObjectIp(row)}:80`;
  return "No active alerts";
}

function makeNatTranslation(row) {
  const targetIp = makeObjectIp(row);
  const numericId = Number(row.id.replace(/\D+/g, "")) || 1;
  const translatedPort = 8000 + (numericId % 1000);
  if (isIncidentRow(row)) return `${targetIp}:${translatedPort} ${makeInterfaceLabel(row)}`;
  return `${targetIp}:${translatedPort} ${makeInterfaceLabel(row)}`;
}

function renderDrawerRackGrid(row) {
  const host = document.getElementById("drawerRackGrid");
  if (!host) return;
  host.textContent = "";
  const baseUnit = (row.commonName.length % 16) + 10;
  for (let unit = 24; unit >= 9; unit--) {
    const cell = document.createElement("div");
    cell.className = "rackMiniUnit";
    const unitLabel = document.createElement("span");
    unitLabel.className = "rackMiniUnitLabel";
    unitLabel.textContent = String(unit);
    cell.appendChild(unitLabel);

    if (unit >= baseUnit && unit < baseUnit + 2) {
      cell.classList.add("isActive");
      const objectLabel = document.createElement("span");
      objectLabel.className = "rackMiniObjectLabel";
      objectLabel.textContent = row.commonName;
      cell.appendChild(objectLabel);
    }

    host.appendChild(cell);
  }
}

function syncDrawerSelection() {
  for (const rowEl of document.querySelectorAll("#tbody tr")) {
    rowEl.classList.toggle("isSelected", rowEl.dataset.id === state.selectedRowId);
  }
}

function closeDrawer() {
  state.selectedRowId = null;
  const drawer = document.getElementById("objectDrawer");
  if (drawer) {
    drawer.classList.remove("isOpen");
    drawer.setAttribute("aria-hidden", "true");
  }
  syncDrawerSelection();
}

function openDrawerForRow(row) {
  state.selectedRowId = row.id;
  const drawer = el("objectDrawer");
  const hasIncident = isIncidentRow(row);
  el("drawerTitle").textContent = row.commonName;
  el("drawerAlertBox").className = `drawerAlertRow ${hasIncident ? "isIncident" : "isOk"}`;
  el("drawerNatBox").className = `drawerAlertRow ${hasIncident ? "isIncident" : "isOk"}`;
  el("drawerAlertValue").textContent = makeAlertTarget(row);
  el("drawerNatValue").textContent = makeNatTranslation(row);
  el("drawerNetworkPath").textContent = makeNetworkPath(row);
  el("drawerInterfaceText").textContent = `${makeInterfaceLabel(row)} -> ${row.type || "object"} link`;

  const peerList = el("drawerPeerList");
  peerList.textContent = "";
  const peers = makePeerConnections(row);
  if (!peers.length) {
    const empty = document.createElement("div");
    empty.className = "drawerListItem";
    empty.textContent = "No peer details available";
    peerList.appendChild(empty);
  } else {
    for (const peer of peers) {
      const item = document.createElement("div");
      item.className = "drawerListItem";
      item.textContent = peer;
      peerList.appendChild(item);
    }
  }

  el("drawerRackLocation").textContent = row.location || "Unknown rack location";
  el("drawerHostLabel").textContent = makeHostLabel(row);
  el("drawerCommonName").textContent = row.commonName || "-";
  el("drawerObjectType").textContent = row.type || "-";
  el("drawerVisibleLabel").textContent = row.visibleLabel || "-";
  el("drawerAssetTag").textContent = row.assetTag || "-";
  el("drawerRackSummary").textContent = row.location || "-";
  renderDrawerRackGrid(row);

  drawer.classList.add("isOpen");
  drawer.setAttribute("aria-hidden", "false");
  syncDrawerSelection();
}

function toggleDrawer(row) {
  if (state.selectedRowId === row.id) {
    closeDrawer();
    return;
  }
  openDrawerForRow(row);
}

function openSelectedObjectInNewWindow() {
  if (!state.selectedRowId) return;
  const next = new URL(window.location.href);
  next.searchParams.set("object", state.selectedRowId);
  window.open(next.toString(), "_blank", "noopener");
}

function renderHeader() {
  const headerRow = el("headerRow");
  headerRow.textContent = "";

  for (const col of COLUMNS) {
    const th = document.createElement("th");
    th.className = "sortable";
    th.classList.add(`col-${col.key}`);
    th.dataset.key = col.key;
    th.tabIndex = 0;
    th.setAttribute("role", "button");
    th.setAttribute("aria-label", `Sort by ${col.label}`);

    const label = document.createElement("span");
    label.textContent = col.label;
    th.appendChild(label);

    const mark = document.createElement("span");
    mark.className = "sortMark";
    mark.textContent = "";
    th.appendChild(mark);

    th.addEventListener("click", () => toggleSort(col.key));
    th.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggleSort(col.key);
      }
    });

    headerRow.appendChild(th);
  }
}

function renderQuickFilters() {
  const row = el("quickFilterRow");
  row.textContent = "";

  for (const col of COLUMNS) {
    const th = document.createElement("th");
    if (col.key === "incident") {
      const select = document.createElement("select");
      select.className = "quickIncident";
      select.innerHTML = `
        <option value="">any</option>
        <option value="true">true</option>
        <option value="false">false</option>
      `;
      select.value = state.quickFilters[col.key] || "";
      select.addEventListener("change", () => {
        state.quickFilters[col.key] = select.value;
        render();
      });
      th.appendChild(select);
    } else {
      const input = document.createElement("input");
      input.type = "search";
      input.placeholder = "filter…";
      input.autocomplete = "off";
      input.value = state.quickFilters[col.key] || "";
      input.addEventListener("input", () => {
        state.quickFilters[col.key] = input.value;
        render();
      });
      th.appendChild(input);
    }
    row.appendChild(th);
  }
}

function renderSortMarks() {
  const ths = [...document.querySelectorAll("#headerRow th")];
  for (const th of ths) {
    const key = th.dataset.key;
    const mark = th.querySelector(".sortMark");
    if (!mark) continue;
    if (!state.sort || state.sort.key !== key) {
      mark.textContent = "";
      th.setAttribute("aria-sort", "none");
      continue;
    }
    th.setAttribute("aria-sort", state.sort.dir === "asc" ? "ascending" : "descending");
    mark.textContent = state.sort.dir === "asc" ? "▲" : "▼";
  }
}

function renderBody(rows) {
  const tbody = el("tbody");
  tbody.textContent = "";

  for (const row of rows) {
    const tr = document.createElement("tr");
    tr.dataset.id = row.id;
    tr.tabIndex = 0;
    tr.classList.add("tableRowInteractive");
    if (INCIDENT_IDS.has(row.id)) tr.classList.add("rowHighlight");
    if (state.selectedRowId === row.id) tr.classList.add("isSelected");
    tr.addEventListener("click", () => toggleDrawer(row));
    tr.addEventListener("keydown", (e) => {
      if (e.key !== "Enter" && e.key !== " ") return;
      e.preventDefault();
      toggleDrawer(row);
    });

    for (const col of COLUMNS) {
      const td = document.createElement("td");
      td.classList.add(`col-${col.key}`);
      const value = col.key === "incident" ? (INCIDENT_IDS.has(row.id) ? "•" : "") : (row[col.key] ?? "");

      if (col.key === "incident") {
        td.className = "incidentCell";
        td.textContent = value;
        td.setAttribute("aria-label", INCIDENT_IDS.has(row.id) ? "Incident" : "No incident");
      } else if (col.key === "commonName") {
        const a = document.createElement("a");
        a.href = "#";
        a.textContent = value;
        a.addEventListener("click", (e) => e.preventDefault());
        td.appendChild(a);
      } else if (col.key === "location") {
        const a = document.createElement("a");
        a.href = "#";
        a.textContent = value;
        a.addEventListener("click", (e) => e.preventDefault());
        td.appendChild(a);
      } else {
        td.textContent = value;
      }

      tr.appendChild(td);
    }
    tbody.appendChild(tr);
  }
}

function renderStatus(rows) {
  el("objectsCount").textContent = `(${rows.length})`;
  const hint = state.sort ? `sorted by “${colLabel(state.sort.key)}” (${state.sort.dir})` : "not sorted";
  const tags = state.tags.selected.size ? `, tags: ${[...state.tags.selected].join(", ")} (${state.tags.mode})` : "";
  el("statusLine").textContent = `${rows.length} rows shown, ${hint}${tags}`;
  el("sortHint").textContent = state.sort ? `Sorting: ${colLabel(state.sort.key)} (${state.sort.dir})` : "Click a column header to sort";
  const sidebarSortHint = document.getElementById("sidebarSortHint");
  if (sidebarSortHint) {
    sidebarSortHint.textContent = state.sort ? `Sorting: ${colLabel(state.sort.key)} (${state.sort.dir})` : "Click a column header to sort";
  }
}

function colLabel(key) {
  return COLUMNS.find((c) => c.key === key)?.label ?? key;
}

function toggleSort(key) {
  if (!state.sort || state.sort.key !== key) {
    state.sort = { key, dir: "asc" };
  } else if (state.sort.dir === "asc") {
    state.sort.dir = "desc";
  } else {
    state.sort = null;
  }
  render();
}

function renderColumnSelect() {
  const select = el("columnSelect");
  select.textContent = "";
  for (const col of COLUMNS) {
    const opt = document.createElement("option");
    opt.value = col.key;
    opt.textContent = col.label;
    if (col.key === state.columnFilter.key) opt.selected = true;
    select.appendChild(opt);
  }

  select.addEventListener("change", () => {
    state.columnFilter.key = select.value;
    // Avoid carrying incident true/false into text filters (and vice versa)
    state.columnFilter.query = "";
    updateTopFilterControl();
    render();
  });
}

function renderSidebarColumnSelect() {
  const node = document.getElementById("sidebarColumnSelect");
  if (!node) return;
  const select = /** @type {HTMLSelectElement} */ (node);
  select.textContent = "";
  for (const col of COLUMNS) {
    const opt = document.createElement("option");
    opt.value = col.key;
    opt.textContent = col.label;
    if (col.key === state.sidebarColumnFilter.key) opt.selected = true;
    select.appendChild(opt);
  }
}

function wireControls() {
  const columnFilter = el("columnFilter");
  const incidentFilter = /** @type {HTMLSelectElement|null} */ (document.getElementById("incidentFilter"));
  columnFilter.value = state.columnFilter.query;
  columnFilter.addEventListener("input", () => {
    state.columnFilter.query = columnFilter.value;
    render();
  });
  if (incidentFilter) {
    incidentFilter.value = state.columnFilter.query;
    incidentFilter.addEventListener("change", () => {
      state.columnFilter.query = incidentFilter.value;
      render();
    });
  }

  const globalSearch = el("globalSearch");
  globalSearch.value = state.globalQuery;
  globalSearch.addEventListener("input", () => {
    state.globalQuery = globalSearch.value;
    render();
  });
  globalSearch.addEventListener("keydown", (e) => {
    if (e.key !== "Enter") return;
    if (state.searchScopeEnabled) return;
    const q = globalSearch.value.trim();
    window.location.href = `./search.html?q=${encodeURIComponent(q)}`;
  });

  const objectsScopeCrumb = document.getElementById("objectsScopeCrumb");
  if (objectsScopeCrumb) {
    objectsScopeCrumb.addEventListener("click", () => {
      state.searchScopeEnabled = !state.searchScopeEnabled;
      renderScopeCrumb();
      const q = (state.globalQuery || "").trim();
      if (!state.searchScopeEnabled && q) {
        window.location.href = `./search.html?q=${encodeURIComponent(q)}`;
        return;
      }
      render();
    });
  }

  el("clearFilter").addEventListener("click", () => {
    state.columnFilter.query = "";
    state.globalQuery = "";
    state.quickFilters = Object.create(null);
    state.tags.selected = new Set();
    state.tags.mode = "and";
    state.sidebarColumnFilter.query = "";
    state.searchScopeEnabled = true;

    columnFilter.value = "";
    globalSearch.value = "";
    for (const input of document.querySelectorAll("#quickFilterRow input")) input.value = "";
    for (const select of document.querySelectorAll("#quickFilterRow select")) /** @type {HTMLSelectElement} */ (select).value = "";
    for (const checkbox of document.querySelectorAll(".tagFilters .tag")) checkbox.checked = false;
    const andRadio = document.querySelector('input[name="tagMode"][value="and"]');
    if (andRadio) andRadio.checked = true;

    const sidebarColumnFilter = document.getElementById("sidebarColumnFilter");
    if (sidebarColumnFilter) /** @type {HTMLInputElement} */ (sidebarColumnFilter).value = "";
    const sidebarIncidentFilter = document.getElementById("sidebarIncidentFilter");
    if (sidebarIncidentFilter) /** @type {HTMLSelectElement} */ (sidebarIncidentFilter).value = "";
    if (incidentFilter) incidentFilter.value = "";

    renderScopeCrumb();
    render();
  });

  for (const radio of document.querySelectorAll('input[name="tagMode"]')) {
    radio.addEventListener("change", () => {
      const value = /** @type {HTMLInputElement} */ (radio).value;
      state.tags.mode = value === "or" ? "or" : "and";
      render();
    });
  }
  for (const checkbox of document.querySelectorAll(".tagFilters .tag")) {
    checkbox.addEventListener("change", () => {
      const cb = /** @type {HTMLInputElement} */ (checkbox);
      if (cb.checked) state.tags.selected.add(cb.value);
      else state.tags.selected.delete(cb.value);
      render();
    });
  }

  el("drawerCloseButton").addEventListener("click", () => {
    closeDrawer();
  });
  el("drawerOpenButton").addEventListener("click", () => {
    openSelectedObjectInNewWindow();
  });
}

function wireSidebarColumnFilterControls() {
  const nodeSelect = document.getElementById("sidebarColumnSelect");
  const nodeInput = document.getElementById("sidebarColumnFilter");
  const nodeIncident = document.getElementById("sidebarIncidentFilter");
  const nodeClear = document.getElementById("sidebarClearFilter");
  if (!nodeSelect || !nodeInput || !nodeClear) return;

  const select = /** @type {HTMLSelectElement} */ (nodeSelect);
  const input = /** @type {HTMLInputElement} */ (nodeInput);
  const incident = /** @type {HTMLSelectElement|null} */ (nodeIncident);
  const clearBtn = /** @type {HTMLButtonElement} */ (nodeClear);

  input.value = state.sidebarColumnFilter.query;
  if (incident) incident.value = state.sidebarColumnFilter.query;

  select.addEventListener("change", () => {
    state.sidebarColumnFilter.key = select.value;
    // Avoid carrying incident true/false into text filters (and vice versa)
    state.sidebarColumnFilter.query = "";
    updateSidebarFilterControl();
    render();
  });
  input.addEventListener("input", () => {
    state.sidebarColumnFilter.query = input.value;
    render();
  });
  if (incident) {
    incident.addEventListener("change", () => {
      state.sidebarColumnFilter.query = incident.value;
      render();
    });
  }
  clearBtn.addEventListener("click", () => {
    state.sidebarColumnFilter.query = "";
    input.value = "";
    if (incident) incident.value = "";
    render();
  });
}

function updateTopFilterControl() {
  const input = /** @type {HTMLInputElement|null} */ (document.getElementById("columnFilter"));
  const incident = /** @type {HTMLSelectElement|null} */ (document.getElementById("incidentFilter"));
  if (!input || !incident) return;
  const isIncident = state.columnFilter.key === "incident";
  input.style.display = isIncident ? "none" : "";
  incident.style.display = isIncident ? "" : "none";
  // keep UI in sync with state
  if (isIncident) {
    incident.value = state.columnFilter.query;
    input.value = "";
  } else {
    input.value = state.columnFilter.query;
    incident.value = "";
  }
}

function updateSidebarFilterControl() {
  const input = /** @type {HTMLInputElement|null} */ (document.getElementById("sidebarColumnFilter"));
  const incident = /** @type {HTMLSelectElement|null} */ (document.getElementById("sidebarIncidentFilter"));
  if (!input || !incident) return;
  const isIncident = state.sidebarColumnFilter.key === "incident";
  input.style.display = isIncident ? "none" : "";
  incident.style.display = isIncident ? "" : "none";
  if (isIncident) {
    incident.value = state.sidebarColumnFilter.query;
    input.value = "";
  } else {
    input.value = state.sidebarColumnFilter.query;
    incident.value = "";
  }
}

function renderScopeCrumb() {
  const node = document.getElementById("objectsScopeCrumb");
  if (!node) return;
  const btn = /** @type {HTMLButtonElement} */ (node);
  btn.classList.toggle("isOff", !state.searchScopeEnabled);
  btn.setAttribute("aria-pressed", state.searchScopeEnabled ? "true" : "false");
  btn.title = state.searchScopeEnabled ? "Search scoped to Objects" : "Search is global (Objects scope off)";
}

function render() {
  const visible = getVisibleRows();
  const sorted = sortRows(visible);
  if (state.selectedRowId && !sorted.some((row) => row.id === state.selectedRowId)) {
    closeDrawer();
  }
  renderSortMarks();
  renderBody(sorted);
  renderStatus(sorted);
}

function init() {
  // allow deep-links from main page search: index.html?q=...
  const qs = new URLSearchParams(window.location.search);
  const q = (qs.get("q") || "").trim();
  const objectId = (qs.get("object") || "").trim();
  if (q) state.globalQuery = q;
  if (objectId && getRowById(objectId)) state.selectedRowId = objectId;

  renderHeader();
  renderQuickFilters();
  renderColumnSelect();
  renderSidebarColumnSelect();
  wireControls();
  wireSidebarColumnFilterControls();
  updateTopFilterControl();
  updateSidebarFilterControl();
  renderScopeCrumb();
  const globalSearch = document.getElementById("globalSearch");
  if (globalSearch) /** @type {HTMLInputElement} */ (globalSearch).value = state.globalQuery;
  render();
  if (state.selectedRowId) {
    const row = getRowById(state.selectedRowId);
    if (row) openDrawerForRow(row);
  }
}

document.addEventListener("DOMContentLoaded", init);

