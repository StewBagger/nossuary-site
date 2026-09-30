// The WoW: Forever guild roster (/roster/). One JSON document, fetched the way js/main.js
// fetches live status: `cache: "no-store"`, a failure is a degraded state and never an empty
// page, and a document older than ROSTER_STALE_MS says so instead of pretending to be current.
//
// Everything above `boot()` is DOM-free on purpose so `node --test tests/` can reach it
// (the arrangement js/forum/api.js uses). Nothing here is inserted as HTML: every value from
// the document reaches the page as textContent, or as a validated colour set through the CSSOM.
//
// THE DOCUMENT. Published from home, never queried from a browser:
// { "generated": "2026-09-30T12:00:00+00:00", "launch": "2026-11-04",
//   "classes":     [{key,name,colour,guide}],
//   "professions": {"primary": [...9], "secondary": [...3]},
//   "totals":      {members, characters, by_faction: {Alliance: {members, characters}, ...}},
//   "characters":  [{name|null, slot, priority, faction, race, race_display, class, class_name,
//                    colour, trees[], roles[], ruleset, char_name|null, primary[], secondary[]}] }
//
// `name` is the MEMBER, null when they chose not to be listed; `char_name` is the in-game
// character, null until it exists. A null name is never dropped and never given a name —
// it is counted and shown as ANON_NAME.

// A browser holding a cached config.js that predates `rosterUrl` still gets a roster.
// Keep in step with js/config.js (tests/roster.test.mjs fails if they disagree).
export const DEFAULT_ROSTER = "https://nossuary-status.stewbagger.workers.dev/v1/roster";

export const ROSTER_STALE_MS = 15 * 60_000; // older than this and the document is not current
export const ROSTER_REFRESH_MS = 5 * 60_000; // a roster changes slowly; poll gently

export const FACTIONS = ["Alliance", "Horde"];
export const ROLES = ["Tank", "Healer", "Melee", "Ranged"];
export const PRIORITIES = ["primary", "secondary", "tertiary"];
export const PRIORITY_LABELS = { primary: "1st pick", secondary: "2nd pick", tertiary: "3rd pick" };
export const ANON_NAME = "a member";

// The page's OWN copy of the launch date, and the one the static markup states. The document's
// `launch` is an override when it has one — it is null until the roster is first published, and
// a page that could only get the date from the feed would have nothing to say before then.
export const LAUNCH_DATE = "2026-11-04";
export const NO_CHARACTER = "not rolled yet";
export const MONTHS = ["January", "February", "March", "April", "May", "June", "July",
  "August", "September", "October", "November", "December"];

// --- Pure logic -------------------------------------------------------------------

// The accent arrives in the document, so it is untrusted input for a CSS custom property.
// Only a plain hex triplet is allowed through; anything else falls back to the site accent.
export function safeColour(value) {
  const v = typeof value === "string" ? value.trim() : "";
  return /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i.test(v) ? v : null;
}

// The member, not the character. Never invents a name and never omits the row.
export function displayName(ch) {
  const raw = ch && typeof ch.name === "string" ? ch.name.trim() : "";
  return raw ? { label: raw, anonymous: false } : { label: ANON_NAME, anonymous: true };
}

// The in-game character, which does not exist yet for most of the roster.
export function charName(ch) {
  const raw = ch && typeof ch.char_name === "string" ? ch.char_name.trim() : "";
  return raw || null;
}

export function priorityKey(value) {
  const v = String(value ?? "").trim().toLowerCase();
  return PRIORITIES.includes(v) ? v : "";
}

export function priorityRank(value) {
  const i = PRIORITIES.indexOf(priorityKey(value));
  return i === -1 ? PRIORITIES.length : i;
}

// Primary is the default and carries no marker; a weaker intention is marked in words,
// so "quieter" never means "colour only" and never means hidden.
export function priorityLabel(value) {
  const k = priorityKey(value);
  return k && k !== "primary" ? PRIORITY_LABELS[k] : "";
}

// The priority column, which states every intention including the firmest one. Same words as
// the marker on a name chip, so the legend explains both at once.
export function priorityBadge(value) {
  return PRIORITY_LABELS[priorityKey(value)] || "unstated";
}

function list(value) {
  return Array.isArray(value) ? value.filter((x) => typeof x === "string" && x.trim()) : [];
}

export function characterList(doc) {
  return Array.isArray(doc?.characters) ? doc.characters.filter(Boolean) : [];
}

export function sameFaction(a, b) {
  return String(a ?? "").trim().toLowerCase() === String(b ?? "").trim().toLowerCase();
}

export function charactersFor(doc, faction) {
  return characterList(doc).filter((c) => sameFaction(c.faction, faction));
}

// A faction value that is neither Alliance nor Horde would otherwise vanish from a page whose
// whole job is that nobody is left out. Counted and reported rather than silently dropped.
export function unplacedCharacters(doc) {
  return characterList(doc).filter((c) => !FACTIONS.some((f) => sameFaction(c.faction, f)));
}

export function classOrder(doc) {
  const order = new Map();
  (Array.isArray(doc?.classes) ? doc.classes : []).forEach((c, i) => {
    if (c && typeof c.key === "string") order.set(c.key, i);
  });
  return order;
}

// Class order from the document, then intention, then the member's name, then their own slot
// ordering. Anonymous entries sort together at the end of their class rather than at the top.
export function sortCharacters(doc, chars) {
  const order = classOrder(doc);
  const at = (c) => (order.has(c.class) ? order.get(c.class) : order.size + 1);
  return [...chars].sort((a, b) =>
    at(a) - at(b) ||
    priorityRank(a.priority) - priorityRank(b.priority) ||
    Number(displayName(a).anonymous) - Number(displayName(b).anonymous) ||
    displayName(a).label.localeCompare(displayName(b).label) ||
    (Number(a.slot) || 0) - (Number(b.slot) || 0));
}

// Every class in the document, whether or not this faction has one — a class nobody has
// picked is information. A class that appears only in the character data is appended, so a
// document whose `classes` list is short still shows all of its people.
export function classRows(doc, faction) {
  const chars = charactersFor(doc, faction);
  const rows = (Array.isArray(doc?.classes) ? doc.classes : [])
    .filter((c) => c && typeof c.key === "string")
    .map((c) => ({
      key: c.key,
      name: typeof c.name === "string" && c.name.trim() ? c.name.trim() : c.key,
      colour: safeColour(c.colour),
      guide: typeof c.guide === "string" && c.guide.startsWith("/") ? c.guide : null,
      characters: [],
      known: true,
    }));
  const byKey = new Map(rows.map((r) => [r.key, r]));
  for (const ch of sortCharacters(doc, chars)) {
    let row = byKey.get(ch.class);
    if (!row) {
      row = {
        key: ch.class || "",
        name: (typeof ch.class_name === "string" && ch.class_name.trim()) || ch.class || "Unknown",
        colour: safeColour(ch.colour),
        guide: null,
        characters: [],
        known: false,
      };
      byKey.set(row.key, row);
      rows.push(row);
    }
    row.characters.push(ch);
  }
  return rows.map((r) => ({ ...r, count: r.characters.length, gap: r.characters.length === 0 }));
}

// The coverage question, and the reason this page exists. Every profession the document names
// gets a row whether or not anybody is taking it: a profession with nobody on it is a GAP, and
// an omitted row is a gap nobody can see.
export function professionRows(doc, faction) {
  const chars = sortCharacters(doc, charactersFor(doc, faction));
  const rows = [];
  const byName = new Map();
  const add = (name, kind, known) => {
    const key = name.toLowerCase();
    if (byName.has(key)) return byName.get(key);
    const row = { name, kind, known, takers: [] };
    byName.set(key, row);
    rows.push(row);
    return row;
  };
  for (const kind of ["primary", "secondary"]) {
    for (const name of list(doc?.professions?.[kind])) add(name.trim(), kind, true);
  }
  for (const ch of chars) {
    for (const kind of ["primary", "secondary"]) {
      for (const name of list(ch[kind])) add(name.trim(), kind, false).takers.push(ch);
    }
  }
  return rows.map((r) => ({ ...r, count: r.takers.length, gap: r.takers.length === 0 }));
}

// Tank / Healer / Melee / Ranged always appear, in that order; a role the document uses that
// this site does not know about is appended rather than dropped.
export function roleRows(doc, faction) {
  const chars = sortCharacters(doc, charactersFor(doc, faction));
  const rows = ROLES.map((name) => ({ name, known: true, takers: [] }));
  const byName = new Map(rows.map((r) => [r.name.toLowerCase(), r]));
  for (const ch of chars) {
    for (const role of list(ch.roles)) {
      const key = role.trim().toLowerCase();
      let row = byName.get(key);
      if (!row) {
        row = { name: role.trim(), known: false, takers: [] };
        byName.set(key, row);
        rows.push(row);
      }
      row.takers.push(ch);
    }
  }
  return rows.map((r) => ({ ...r, count: r.takers.length, gap: r.takers.length === 0 }));
}

function count(value) {
  return Number.isFinite(value) ? value : null;
}

// The document's own totals are authoritative — they know how many MEMBERS are behind the
// entries, which anonymous rows cannot tell us. Character counts fall back to the rows.
//
// `by_faction` is `{}` in the document the Worker serves before anything is published, and the
// faction names are deliberately not baked into it. A faction with no characters therefore has
// no members either, and reads as 0 — a real count, not "unknown". A faction that HAS
// characters but no members figure is "—": a made-up number would be worse than an admitted gap.
export function factionTotals(doc, faction) {
  const chars = charactersFor(doc, faction);
  const given = doc?.totals?.by_faction?.[faction] || {};
  return {
    members: count(given.members) ?? (chars.length ? null : 0),
    characters: count(given.characters) ?? chars.length,
    anonymous: chars.filter((c) => displayName(c).anonymous).length,
  };
}

export function overallTotals(doc) {
  const chars = characterList(doc);
  return {
    members: count(doc?.totals?.members) ?? (chars.length ? null : 0),
    characters: count(doc?.totals?.characters) ?? chars.length,
    anonymous: chars.filter((c) => displayName(c).anonymous).length,
  };
}

export function isEmpty(doc) {
  return characterList(doc).length === 0;
}

// Staleness, the way refreshStatus() treats it: a timestamp in the future is as untrustworthy
// as one too far in the past, and an unreadable one is stale. Unlike a live player count, a
// roster that is an hour old is still TRUE, so the page keeps showing it and says how old it is.
//
// `generated` is NULL until the first publish, and that is the pre-launch normal rather than a
// fault: it is reported as not published yet and raises no staleness warning. A `generated`
// that is present but unreadable IS a fault, and is treated as stale.
export function ageInfo(generated, now = Date.now()) {
  if (generated === null || generated === undefined || String(generated).trim() === "") {
    return { published: false, stale: false, ms: null, label: "not published yet" };
  }
  const at = Date.parse(generated);
  if (!Number.isFinite(at)) {
    return { published: true, stale: true, ms: null, label: "at an unknown time" };
  }
  const ms = now - at;
  return { published: true, stale: !(ms >= 0 && ms < ROSTER_STALE_MS), ms, label: ageLabel(ms) };
}

export function ageLabel(ms) {
  if (!Number.isFinite(ms)) return "at an unknown time";
  if (ms < 0) return "in the future";
  const mins = Math.floor(ms / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} minute${mins === 1 ? "" : "s"} ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
}

// Formatted here rather than through toLocaleDateString: this has to read the same in a test,
// in every browser and in every locale the page is served to.
export function formatDate(iso) {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(iso ?? "").trim());
  if (!m) return null;
  const [, y, mo, d] = m;
  const month = MONTHS[Number(mo) - 1];
  if (!month) return null;
  return `${Number(d)} ${month} ${y}`;
}

export function daysUntil(iso, now = Date.now()) {
  const at = Date.parse(`${String(iso ?? "").trim().slice(0, 10)}T00:00:00Z`);
  if (!Number.isFinite(at)) return null;
  const day = 24 * 60 * 60_000;
  return Math.ceil((at - Math.floor(now / day) * day) / day);
}

// The document's date when it has a usable one, this page's own otherwise.
export function launchDate(doc) {
  const given = String(doc?.launch ?? "").trim();
  return formatDate(given) ? given : LAUNCH_DATE;
}

// "Launches 4 November 2026 · 35 days to go". The date is the fixed point of the whole page:
// before it, an empty roster is expected rather than broken.
export function launchLine(iso, now = Date.now()) {
  const date = formatDate(iso);
  if (!date) return null;
  const days = daysUntil(iso, now);
  if (days === null) return `Launches ${date}`;
  if (days > 1) return `Launches ${date} — ${days} days to go`;
  if (days === 1) return `Launches ${date} — tomorrow`;
  if (days === 0) return `Launches ${date} — today`;
  return `Launched ${date}`;
}

// --- The page ---------------------------------------------------------------------

// Same helper as js/main.js: attributes, text and children, never a string of HTML.
function el(tag, attrs = {}, ...children) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v === null || v === undefined || v === false) continue;
    if (k === "class") node.className = v;
    else if (k === "text") node.textContent = v;
    else node.setAttribute(k, v === true ? "" : v);
  }
  node.append(...children.filter(Boolean));
  return node;
}

const $ = (sel, root = document) => root.querySelector(sel);

// A class name with its accent. The colour is set through the CSSOM, not a style attribute:
// this page runs style-src 'self', which drops an inline style outright. The NAME is always
// present, so the accent is decoration and never the only thing carrying the meaning.
function classTag(name, colour, href) {
  const dot = el("span", { class: "rs-dot", "aria-hidden": "true" });
  if (colour) dot.style.setProperty("--class-accent", colour);
  const label = href
    ? el("a", { class: "rs-class-name", href, text: name })
    : el("span", { class: "rs-class-name", text: name });
  return el("span", { class: "rs-class" }, dot, label);
}

// One person in a "who is taking this" list: member, class, and how strong the intention is.
function takerChip(ch) {
  const who = displayName(ch);
  const prio = priorityLabel(ch.priority);
  const colour = safeColour(ch.colour);
  const dot = el("span", { class: "rs-dot", "aria-hidden": "true" });
  if (colour) dot.style.setProperty("--class-accent", colour);
  const chip = el("span", { class: `rs-taker${prio ? " rs-quiet" : ""}` },
    dot,
    el("span", { class: who.anonymous ? "rs-anon" : null, text: who.label }),
    el("span", { class: "rs-taker-class", text: ch.class_name || ch.class || "" }),
    prio ? el("span", { class: "rs-prio", text: prio }) : null);
  return chip;
}

function takerList(takers) {
  if (!takers.length) return el("span", { class: "rs-gap", text: "Nobody yet" });
  return el("span", { class: "rs-takers" }, ...takers.map(takerChip));
}

function table(headings, rows, { minWidth = null } = {}) {
  const thead = el("thead", {}, el("tr", {}, ...headings.map((h) =>
    el("th", { scope: "col", text: h }))));
  const t = el("table", {}, thead, el("tbody", {}, ...rows));
  // Wide tables scroll rather than squash — the .guide-table arrangement in css/guides.css,
  // repeated here because this page does not load that stylesheet.
  const wrap = el("div", { class: "rs-table", tabindex: "0" }, t);
  if (minWidth) t.style.setProperty("min-width", minWidth);
  return wrap;
}

function emptyPanel(text) {
  return el("p", { class: "rs-empty muted", text });
}

function renderClassView(doc, faction) {
  const rows = classRows(doc, faction);
  const taken = rows.filter((r) => r.count);
  // The class list travels with the document. Before the first publish there isn't one, and a
  // spread of nine blank rows would be worse than no spread at all.
  const spread = rows.length
    ? el("ul", { class: "rs-spread" }, ...rows.map((r) =>
      el("li", { class: r.gap ? "rs-spread-gap" : null },
        classTag(r.name, r.colour, r.guide),
        el("span", { class: "rs-spread-count", text: r.gap ? "none" : String(r.count) }))))
    : null;

  if (!taken.length) {
    return el("div", {}, spread, emptyPanel("No characters on this side yet."));
  }

  const body = [];
  for (const row of taken) {
    for (const ch of row.characters) {
      const who = displayName(ch);
      const prio = priorityKey(ch.priority);
      const cname = charName(ch);
      body.push(el("tr", { class: prio === "tertiary" ? "rs-row-quiet" : null },
        el("th", { scope: "row" }, classTag(row.name, row.colour, row.guide)),
        el("td", {}, cname
          ? el("span", { text: cname })
          : el("span", { class: "rs-pending", text: NO_CHARACTER })),
        el("td", {}, el("span", { class: who.anonymous ? "rs-anon" : null, text: who.label })),
        el("td", { text: ch.race_display || ch.race || "—" }),
        el("td", { text: (Array.isArray(ch.trees) && ch.trees.length ? ch.trees.join(" / ") : "Undecided") }),
        el("td", { text: (Array.isArray(ch.roles) && ch.roles.length ? ch.roles.join(" / ") : "—") }),
        el("td", { text: ch.ruleset || "—" }),
        el("td", {}, el("span", { class: `rs-badge rs-badge-${prio || "unstated"}`,
          text: priorityBadge(ch.priority) }))));
    }
  }
  return el("div", {}, spread,
    table(["Class", "Character", "Member", "Race", "Talents", "Role", "Ruleset", "Priority"],
      body, { minWidth: "760px" }));
}

function renderProfessionView(doc, faction) {
  const rows = professionRows(doc, faction);
  if (!rows.length) return emptyPanel("No professions are configured in the roster document yet.");
  const out = [];
  for (const [kind, label] of [["primary", "Primary professions"], ["secondary", "Secondary professions"]]) {
    const group = rows.filter((r) => r.kind === kind);
    if (!group.length) continue;
    const gaps = group.filter((r) => r.gap).length;
    out.push(el("h4", { class: "rs-subhead" },
      el("span", { text: label }),
      el("span", { class: gaps ? "rs-gap-count" : "rs-covered-count",
        text: gaps ? `${gaps} of ${group.length} uncovered` : `all ${group.length} covered` })));
    out.push(table(["Profession", "Taken by", "Who"], group.map((r) =>
      el("tr", { class: r.gap ? "rs-row-gap" : null },
        el("th", { scope: "row" },
          el("span", { text: r.name }),
          r.known ? null : el("span", { class: "rs-extra", text: "not on the list" })),
        el("td", {}, r.gap
          ? el("span", { class: "rs-gap", text: "gap" })
          : el("span", { text: String(r.count) })),
        el("td", {}, takerList(r.takers)))), { minWidth: "560px" }));
  }
  return el("div", {}, ...out);
}

function renderRoleView(doc, faction) {
  const rows = roleRows(doc, faction);
  return table(["Role", "Filled by", "Who"], rows.map((r) =>
    el("tr", { class: r.gap ? "rs-row-gap" : null },
      el("th", { scope: "row" },
        el("span", { text: r.name }),
        r.known ? null : el("span", { class: "rs-extra", text: "not a standard role" })),
      el("td", {}, r.gap
        ? el("span", { class: "rs-gap", text: "gap" })
        : el("span", { text: String(r.count) })),
      el("td", {}, takerList(r.takers)))), { minWidth: "520px" });
}

const VIEWS = {
  class: renderClassView,
  profession: renderProfessionView,
  role: renderRoleView,
};

function renderFaction(section, doc) {
  const faction = section.dataset.faction;
  const totals = factionTotals(doc, faction);
  const set = (key, value) => {
    const node = $(`[data-count="${key}"]`, section);
    if (node) node.textContent = value;
  };
  set("members", totals.members === null ? "—" : String(totals.members));
  set("characters", String(totals.characters));

  const anon = $("[data-anon]", section);
  if (anon) {
    anon.hidden = totals.anonymous === 0;
    anon.textContent = totals.anonymous
      ? `Includes ${totals.anonymous} character${totals.anonymous === 1 ? "" : "s"} from members who chose not to be named.`
      : "";
  }

  const empty = charactersFor(doc, faction).length === 0;
  for (const [view, render] of Object.entries(VIEWS)) {
    const panel = $(`[data-view="${view}"]`, section);
    if (!panel) continue;
    panel.replaceChildren(empty
      ? emptyPanel(`Nobody has declared for the ${faction} yet. The tables fill in as members sign up.`)
      : render(doc, faction));
  }
}

// Tabs: arrow keys move between them, the panel is what gets focus, and none of it needs a
// page load. Written against the static markup so the switch works before any document lands.
function wireTabs(root = document) {
  for (const tablist of root.querySelectorAll('[role="tablist"]')) {
    const tabs = [...tablist.querySelectorAll('[role="tab"]')];
    const select = (tab, focus = true) => {
      for (const t of tabs) {
        const on = t === tab;
        t.setAttribute("aria-selected", on ? "true" : "false");
        t.tabIndex = on ? 0 : -1;
        const panel = document.getElementById(t.getAttribute("aria-controls"));
        if (panel) panel.hidden = !on;
      }
      if (focus) tab.focus();
    };
    tabs.forEach((tab, i) => {
      tab.addEventListener("click", () => select(tab, false));
      tab.addEventListener("keydown", (e) => {
        const step = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
        if (step) { e.preventDefault(); select(tabs[(i + step + tabs.length) % tabs.length]); }
        else if (e.key === "Home") { e.preventDefault(); select(tabs[0]); }
        else if (e.key === "End") { e.preventDefault(); select(tabs[tabs.length - 1]); }
      });
    });
  }
}

function note(message, kind = "warn") {
  const node = $("#roster-note");
  if (!node) return;
  node.hidden = !message;
  node.className = `forum-status ${kind === "warn" ? "forum-status-warn" : ""}`.trim();
  node.textContent = message || "";
}

function renderMeta(doc, now = Date.now()) {
  const updated = $("#roster-updated");
  const launch = $("#roster-launch");
  const age = ageInfo(doc?.generated, now);
  if (updated) {
    updated.textContent = !age.published ? "Not published yet"
      : age.ms === null ? "Last updated at an unknown time"
      : `Updated ${age.label}`;
    // The exact timestamp on hover; the line itself stays readable ("Updated 7 minutes ago").
    if (doc?.generated) updated.title = `Published ${String(doc.generated)}`;
  }
  if (launch) {
    const line = launchLine(launchDate(doc), now);
    if (line) launch.textContent = line;
  }
  return age;
}

function renderTotals(doc) {
  const totals = overallTotals(doc);
  const set = (key, value) => {
    for (const node of document.querySelectorAll(`#roster-totals [data-count="${key}"]`)) {
      node.textContent = value;
    }
  };
  set("members", totals.members === null ? "—" : String(totals.members));
  set("characters", String(totals.characters));

  const anon = $("#roster-anon");
  if (anon) {
    anon.textContent = totals.anonymous
      ? `${totals.anonymous} of those characters belong to members who chose not to be listed by name. They are counted everywhere on this page and shown as “${ANON_NAME}”; unnamed entries cannot be grouped together, so each is its own row.`
      : `Members who choose not to be listed by name still appear in every count and every table, as “${ANON_NAME}”.`;
  }

  const unplaced = unplacedCharacters(doc);
  const line = $("#roster-unplaced");
  if (line) {
    line.hidden = unplaced.length === 0;
    line.textContent = unplaced.length
      ? `${unplaced.length} character${unplaced.length === 1 ? " is" : "s are"} recorded without a faction and so appear in neither section below.`
      : "";
  }

  const empty = $("#roster-empty");
  if (empty) empty.hidden = !isEmpty(doc);
  const totalsBox = $("#roster-totals");
  if (totalsBox) totalsBox.hidden = isEmpty(doc);
}

function render(doc, now = Date.now()) {
  const age = renderMeta(doc, now);
  renderTotals(doc);
  for (const section of document.querySelectorAll("[data-faction]")) renderFaction(section, doc);
  // Shown, not blanked: unlike a live player count, a roster an hour old is still true.
  note(age.stale
    ? "This roster is out of date — the last publish is more than fifteen minutes old, so someone may have signed up since."
    : "");
}

async function refreshRoster() {
  const cfg = (typeof window !== "undefined" && window.OSSUARY) || {};
  const url = cfg.rosterUrl === undefined ? DEFAULT_ROSTER : cfg.rosterUrl;
  if (!url) {
    note(`The roster feed is not wired up yet. WoW: Forever launches ${formatDate(LAUNCH_DATE)} — sign up in the Discord.`);
    return;
  }
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    render(await res.json());
  } catch {
    // Unknown is not empty: say the roster could not be read, never draw a roster of nobody.
    note("Couldn't load the roster right now. It is published from home and will be back shortly — the Discord has the live list in the meantime.");
    const loading = document.querySelectorAll(".rs-loading");
    for (const node of loading) node.textContent = "Roster unavailable";
  }
}

function boot() {
  wireTabs();
  const launch = $("#roster-launch");
  if (launch) {
    // Before any document arrives the page still knows when WoW: Forever opens.
    const line = launchLine(LAUNCH_DATE);
    if (line) launch.textContent = line;
  }
  refreshRoster();
  setInterval(refreshRoster, ROSTER_REFRESH_MS);
}

if (typeof document !== "undefined") {
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
}
