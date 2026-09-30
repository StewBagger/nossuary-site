// The WoW: Forever roster's pure module in plain node — no browser, no dependencies.
//
//   node --test tests/
//
// What a regression here would quietly break: a member who asked not to be named dropped from
// a count, a profession nobody has taken vanishing from the page instead of reading as a gap,
// a stale document presented as current, a colour from the feed reaching a CSS property
// unchecked, or a CSP/build stamp that disagrees with config.js so the real page silently
// fails to read the roster at all.

import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(HERE, "..");
const roster = await import(pathToFileURL(path.join(ROOT, "js", "roster.js")).href);

// A document in the published shape: both factions, an unnamed member, an undecided spec,
// a character that does not exist yet, and a profession nobody has taken.
const CLASSES = [
  { key: "shaman", name: "Shaman", colour: "#3e9bff", guide: "/guides/wow-forever/shaman/" },
  { key: "mage", name: "Mage", colour: "#69ccf0", guide: "/guides/wow-forever/mage/" },
  { key: "priest", name: "Priest", colour: "#ffffff", guide: "/guides/wow-forever/priest/" },
];

const PROFESSIONS = {
  primary: ["Alchemy", "Blacksmithing", "Enchanting", "Engineering", "Herbalism",
    "Leatherworking", "Mining", "Skinning", "Tailoring"],
  secondary: ["Cooking", "First Aid", "Fishing"],
};

function ch(over = {}) {
  return {
    name: "Stew", slot: 1, priority: "primary", faction: "Horde", race: "Troll",
    race_display: "Troll", class: "shaman", class_name: "Shaman", colour: "#3e9bff",
    trees: ["Restoration"], roles: ["Healer"], ruleset: "Normal", char_name: null,
    primary: ["Alchemy", "Herbalism"], secondary: ["Cooking"],
    ...over,
  };
}

const DOC = {
  generated: "2026-09-30T12:00:00+00:00",
  launch: "2026-11-04",
  classes: CLASSES,
  professions: PROFESSIONS,
  totals: {
    members: 3, characters: 4,
    by_faction: { Alliance: { members: 1, characters: 1 }, Horde: { members: 2, characters: 3 } },
  },
  characters: [
    ch(),
    ch({ name: null, slot: 1, priority: "tertiary", class: "mage", class_name: "Mage",
         colour: "#69ccf0", trees: [], roles: ["Ranged"], char_name: null,
         primary: ["Tailoring"], secondary: [] }),
    ch({ name: "Ash", slot: 2, priority: "secondary", class: "shaman", roles: ["Melee"],
         trees: ["Enhancement"], char_name: "Ashfall", primary: ["Mining"], secondary: ["Fishing"] }),
    ch({ name: "Rook", faction: "Alliance", race: "Human", race_display: "Human",
         class: "priest", class_name: "Priest", colour: "#ffffff", trees: ["Holy"],
         roles: ["Healer"], primary: ["Enchanting"], secondary: ["First Aid"] }),
  ],
};

// A published document with nobody in it yet: the class list and the professions are known,
// there is simply no one on them.
const EMPTY = { generated: DOC.generated, launch: DOC.launch, classes: CLASSES,
  professions: PROFESSIONS,
  totals: { members: 0, characters: 0, by_faction: { Alliance: { members: 0, characters: 0 },
    Horde: { members: 0, characters: 0 } } },
  characters: [] };

// What GET /v1/roster actually returns BEFORE anything is ever published — a 200, not a 404.
// `generated` and `launch` are null, there is no class list, and `by_faction` is bare. This is
// the shape the page is in for most of the time before launch, so it is the shape most worth
// a test.
const UNPUBLISHED = {
  generated: null, launch: null, classes: [],
  professions: { primary: [], secondary: [] },
  totals: { members: 0, characters: 0, by_faction: {} },
  characters: [],
};

// -- staleness --------------------------------------------------------------------

const AT = Date.parse("2026-09-30T12:00:00Z");

test("ageInfo: fresh under fifteen minutes, stale past it", () => {
  assert.equal(roster.ageInfo(DOC.generated, AT + 60_000).stale, false);
  assert.equal(roster.ageInfo(DOC.generated, AT + 14 * 60_000).stale, false);
  assert.equal(roster.ageInfo(DOC.generated, AT + 16 * 60_000).stale, true);
});

test("ageInfo: a timestamp in the future or unreadable is stale, not fresh", () => {
  assert.equal(roster.ageInfo(DOC.generated, AT - 60_000).stale, true);
  const bad = roster.ageInfo("not a date", AT);
  assert.equal(bad.published, true);
  assert.equal(bad.stale, true);
  assert.equal(bad.ms, null);
  assert.match(bad.label, /unknown/);
});

test("a null generated is 'not published yet', and raises no staleness warning", () => {
  for (const value of [null, undefined, ""]) {
    const age = roster.ageInfo(value, AT);
    assert.equal(age.published, false, `${JSON.stringify(value)} must read as unpublished`);
    assert.equal(age.stale, false, "the pre-launch normal is not a fault");
    assert.equal(age.ms, null);
    assert.match(age.label, /not published/);
  }
});

test("ageLabel reads in plain words at every scale", () => {
  assert.equal(roster.ageLabel(20_000), "just now");
  assert.equal(roster.ageLabel(60_000), "1 minute ago");
  assert.equal(roster.ageLabel(7 * 60_000), "7 minutes ago");
  assert.equal(roster.ageLabel(3 * 3600_000), "3 hours ago");
  assert.equal(roster.ageLabel(50 * 3600_000), "2 days ago");
});

// -- the launch date --------------------------------------------------------------

test("formatDate is locale-independent", () => {
  assert.equal(roster.formatDate("2026-11-04"), "4 November 2026");
  assert.equal(roster.formatDate("2026-09-30T12:00:00+00:00"), "30 September 2026");
  assert.equal(roster.formatDate("nope"), null);
});

test("launchLine counts down to launch and then stops counting", () => {
  const day = 24 * 3600_000;
  const launch = Date.parse("2026-11-04T00:00:00Z");
  assert.equal(roster.launchLine("2026-11-04", launch - 35 * day), "Launches 4 November 2026 — 35 days to go");
  assert.equal(roster.launchLine("2026-11-04", launch - day), "Launches 4 November 2026 — tomorrow");
  assert.equal(roster.launchLine("2026-11-04", launch + 3600_000), "Launches 4 November 2026 — today");
  assert.equal(roster.launchLine("2026-11-04", launch + 5 * day), "Launched 4 November 2026");
  assert.equal(roster.launchLine(null, launch), null);
});

// -- a member who is not named ----------------------------------------------------

test("an unnamed member is shown as a member, never dropped and never given a name", () => {
  const anon = DOC.characters[1];
  assert.deepEqual(roster.displayName(anon), { label: roster.ANON_NAME, anonymous: true });
  assert.deepEqual(roster.displayName(ch({ name: "  " })), { label: roster.ANON_NAME, anonymous: true });
  assert.deepEqual(roster.displayName(ch()), { label: "Stew", anonymous: false });
});

test("an unnamed member is counted in the faction totals and appears in all three views", () => {
  const horde = roster.factionTotals(DOC, "Horde");
  assert.equal(horde.characters, 3);
  assert.equal(horde.anonymous, 1);

  const mage = roster.classRows(DOC, "Horde").find((r) => r.key === "mage");
  assert.equal(mage.count, 1);
  assert.equal(roster.displayName(mage.characters[0]).anonymous, true);

  const tailoring = roster.professionRows(DOC, "Horde").find((r) => r.name === "Tailoring");
  assert.equal(tailoring.count, 1);
  assert.equal(tailoring.takers[0].class, "mage");

  const ranged = roster.roleRows(DOC, "Horde").find((r) => r.name === "Ranged");
  assert.equal(ranged.count, 1);
});

test("overall totals come from the document, which alone knows how many MEMBERS there are", () => {
  assert.deepEqual(roster.overallTotals(DOC), { members: 3, characters: 4, anonymous: 1 });
  // No totals block: the character rows still give a character count, and members is unknown
  // rather than wrong — an anonymous row cannot be attributed to a member.
  assert.deepEqual(roster.overallTotals({ characters: DOC.characters }),
    { members: null, characters: 4, anonymous: 1 });
});

// -- the faction split ------------------------------------------------------------

test("each faction sees only its own people", () => {
  assert.equal(roster.charactersFor(DOC, "Horde").length, 3);
  assert.equal(roster.charactersFor(DOC, "Alliance").length, 1);
  assert.equal(roster.charactersFor(DOC, "Alliance")[0].name, "Rook");
});

test("a character with neither faction is reported, not silently dropped", () => {
  const doc = { ...DOC, characters: [...DOC.characters, ch({ faction: "Neutral", name: "Pan" })] };
  assert.equal(roster.charactersFor(doc, "Horde").length, 3);
  assert.equal(roster.unplacedCharacters(doc).length, 1);
  assert.equal(roster.unplacedCharacters(DOC).length, 0);
});

// -- by class ---------------------------------------------------------------------

test("classRows keeps the document's class order and carries the guide link and accent", () => {
  const rows = roster.classRows(DOC, "Horde");
  assert.deepEqual(rows.map((r) => r.key), ["shaman", "mage", "priest"]);
  assert.equal(rows[0].guide, "/guides/wow-forever/shaman/");
  assert.equal(rows[0].colour, "#3e9bff");
});

test("a class nobody in this faction took is a row with a zero, not an omission", () => {
  const priest = roster.classRows(DOC, "Horde").find((r) => r.key === "priest");
  assert.equal(priest.count, 0);
  assert.equal(priest.gap, true);
});

test("a class the document's class list forgot still shows its people", () => {
  const doc = { ...DOC, classes: CLASSES.slice(0, 1) };
  const rows = roster.classRows(doc, "Horde");
  const mage = rows.find((r) => r.key === "mage");
  assert.ok(mage, "a class present only in the character data must still appear");
  assert.equal(mage.known, false);
  assert.equal(mage.name, "Mage");
  assert.equal(mage.guide, null);
});

test("within a class, a firmer intention sorts first and a weaker one is never hidden", () => {
  const shaman = roster.classRows(DOC, "Horde").find((r) => r.key === "shaman");
  assert.deepEqual(shaman.characters.map((c) => c.priority), ["primary", "secondary"]);
  assert.equal(roster.priorityRank("primary") < roster.priorityRank("tertiary"), true);
  assert.equal(roster.priorityLabel("primary"), "");
  assert.equal(roster.priorityLabel("tertiary"), "3rd pick");
  assert.equal(roster.priorityLabel("nonsense"), "");
});

test("every row states its priority in words, including the firmest and the missing one", () => {
  assert.equal(roster.priorityBadge("primary"), "1st pick");
  assert.equal(roster.priorityBadge("secondary"), "2nd pick");
  assert.equal(roster.priorityBadge("tertiary"), "3rd pick");
  assert.equal(roster.priorityBadge(null), "unstated");
  assert.equal(roster.priorityBadge("nonsense"), "unstated");
});

// -- by profession ----------------------------------------------------------------

test("every configured profession gets a row, and an untaken one is a visible gap", () => {
  const rows = roster.professionRows(DOC, "Horde");
  assert.equal(rows.filter((r) => r.kind === "primary").length, 9);
  assert.equal(rows.filter((r) => r.kind === "secondary").length, 3);
  const bs = rows.find((r) => r.name === "Blacksmithing");
  assert.equal(bs.count, 0);
  assert.equal(bs.gap, true);
  const alchemy = rows.find((r) => r.name === "Alchemy");
  assert.equal(alchemy.count, 1);
  assert.equal(alchemy.gap, false);
});

test("professions keep the document's order, primaries before secondaries", () => {
  const rows = roster.professionRows(DOC, "Horde");
  assert.deepEqual(rows.slice(0, 9).map((r) => r.name), PROFESSIONS.primary);
  assert.deepEqual(rows.slice(9, 12).map((r) => r.name), PROFESSIONS.secondary);
});

test("a profession a member names that the document did not list is appended, not lost", () => {
  const doc = { ...DOC, characters: [...DOC.characters, ch({ name: "Vex", primary: ["Poisons"] })] };
  const row = roster.professionRows(doc, "Horde").find((r) => r.name === "Poisons");
  assert.ok(row, "an unlisted profession must still be shown");
  assert.equal(row.known, false);
  assert.equal(row.count, 1);
});

test("professions are counted per faction, not across the guild", () => {
  assert.equal(roster.professionRows(DOC, "Alliance").find((r) => r.name === "Alchemy").count, 0);
  assert.equal(roster.professionRows(DOC, "Alliance").find((r) => r.name === "Enchanting").count, 1);
});

// -- by role ----------------------------------------------------------------------

test("all four roles always appear, empty ones as gaps, in a fixed order", () => {
  const rows = roster.roleRows(DOC, "Horde");
  assert.deepEqual(rows.slice(0, 4).map((r) => r.name), roster.ROLES);
  assert.equal(rows.find((r) => r.name === "Tank").count, 0);
  assert.equal(rows.find((r) => r.name === "Tank").gap, true);
  assert.equal(rows.find((r) => r.name === "Healer").count, 1);
});

test("a role the document uses that this site does not know is appended", () => {
  const doc = { ...DOC, characters: [ch({ roles: ["Flex"] })] };
  const rows = roster.roleRows(doc, "Horde");
  assert.equal(rows.length, 5);
  assert.equal(rows[4].name, "Flex");
  assert.equal(rows[4].known, false);
});

// -- the empty roster -------------------------------------------------------------

test("an empty roster is a shape the page can draw, not an error", () => {
  assert.equal(roster.isEmpty(EMPTY), true);
  assert.equal(roster.isEmpty(DOC), false);
  assert.equal(roster.isEmpty({}), true);
  assert.equal(roster.classRows(EMPTY, "Horde").every((r) => r.gap), true);
  assert.equal(roster.professionRows(EMPTY, "Horde").length, 12);
  assert.equal(roster.professionRows(EMPTY, "Horde").every((r) => r.gap), true);
  assert.equal(roster.roleRows(EMPTY, "Alliance").length, 4);
  assert.deepEqual(roster.factionTotals(EMPTY, "Alliance"),
    { members: 0, characters: 0, anonymous: 0 });
});

test("the unpublished document the Worker serves renders as a page, not as a fault", () => {
  // Nothing about it is an error state: no stale warning, no invented counts, no blank rows.
  const age = roster.ageInfo(UNPUBLISHED.generated, AT);
  assert.equal(age.published, false);
  assert.equal(age.stale, false);

  // The launch date comes from the page's own copy when the document has none.
  assert.equal(roster.launchDate(UNPUBLISHED), roster.LAUNCH_DATE);
  assert.equal(roster.formatDate(roster.LAUNCH_DATE), "4 November 2026");
  assert.equal(roster.launchDate({ launch: "2026-12-01" }), "2026-12-01");

  // No class list means nothing class-specific to draw — not nine blank rows.
  assert.deepEqual(roster.classRows(UNPUBLISHED, "Alliance"), []);
  assert.deepEqual(roster.professionRows(UNPUBLISHED, "Horde"), []);

  // Both faction sections still have counts to show, and they are zero rather than unknown.
  for (const faction of roster.FACTIONS) {
    assert.deepEqual(roster.factionTotals(UNPUBLISHED, faction),
      { members: 0, characters: 0, anonymous: 0 }, `${faction} must read as zero, not "—"`);
  }
  assert.deepEqual(roster.overallTotals(UNPUBLISHED), { members: 0, characters: 0, anonymous: 0 });
  assert.equal(roster.isEmpty(UNPUBLISHED), true);

  // The four roles are this site's own list, so they survive an empty document.
  assert.deepEqual(roster.roleRows(UNPUBLISHED, "Alliance").map((r) => r.name), roster.ROLES);
  assert.equal(roster.roleRows(UNPUBLISHED, "Alliance").every((r) => r.gap), true);
});

test("a garbage document renders as empty rather than throwing", () => {
  for (const doc of [null, undefined, {}, { characters: null }, { characters: [null] }]) {
    assert.doesNotThrow(() => {
      roster.classRows(doc, "Horde");
      roster.professionRows(doc, "Horde");
      roster.roleRows(doc, "Horde");
      roster.overallTotals(doc);
    });
  }
});

// -- the colour from the feed -----------------------------------------------------

test("only a plain hex colour reaches a CSS property", () => {
  assert.equal(roster.safeColour("#3e9bff"), "#3e9bff");
  assert.equal(roster.safeColour("  #FFF "), "#FFF");
  assert.equal(roster.safeColour("red"), null);
  assert.equal(roster.safeColour("#3e9bff; background: url(x)"), null);
  assert.equal(roster.safeColour("url(javascript:alert(1))"), null);
  assert.equal(roster.safeColour(null), null);
  assert.equal(roster.classRows({ ...DOC, classes: [{ key: "shaman", name: "Shaman", colour: "expression(x)" }] },
    "Horde")[0].colour, null);
});

// -- the page's wiring ------------------------------------------------------------

const page = fs.readFileSync(path.join(ROOT, "roster", "index.html"), "utf8");
const configJs = fs.readFileSync(path.join(ROOT, "js", "config.js"), "utf8");
const rosterJs = fs.readFileSync(path.join(ROOT, "js", "roster.js"), "utf8");
const indexHtml = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
const buildGuides = fs.readFileSync(path.join(ROOT, "tools", "build_guides.py"), "utf8");
const sitemap = fs.readFileSync(path.join(ROOT, "sitemap.xml"), "utf8");

test("the CSP names the roster origin from config.js, and nothing else may be connected to", () => {
  const configured = /rosterUrl:\s*"([^"]+)"/.exec(configJs)[1];
  const csp = /content="([^"]*default-src[^"]*)"/.exec(page)[1];
  assert.equal(/connect-src ([^;]+)/.exec(csp)[1].trim(), new URL(configured).origin);
  assert.match(csp, /object-src 'none'/);
  assert.match(csp, /base-uri 'none'/);
  assert.ok(!/unsafe-inline/.test(csp), "the roster page must not need unsafe-inline");
  assert.equal(roster.DEFAULT_ROSTER, configured, "roster.js's fallback disagrees with config.js");
});

test("the build stamp agrees across the page and its module", () => {
  const stamps = new Set();
  for (const text of [page, rosterJs]) {
    for (const m of text.matchAll(/\?v=(\d{8}-\d+)/g)) stamps.add(m[1]);
  }
  assert.equal(stamps.size, 1, `stamps disagree: ${[...stamps].join(", ")}`);
});

test("every script and stylesheet the page loads carries a cache-bust stamp", () => {
  for (const m of page.matchAll(/(?:src|href)="(\/(?:js|css)\/[^"]+)"/g)) {
    assert.match(m[1], /\?v=\d{8}-\d+$/, `${m[1]} has no ?v= stamp`);
  }
});

test("the page inserts nothing as HTML", () => {
  assert.ok(!/innerHTML|outerHTML|insertAdjacentHTML|document\.write/.test(rosterJs));
});

test("no inline style attribute: this page runs style-src 'self'", () => {
  assert.ok(!/\sstyle="/.test(page), "an inline style is dropped by the CSP without warning");
});

// The primary nav is written out in index.html AND generated by tools/build_guides.py. A page
// added to one and not the other gives the guides a different nav from the rest of the site.
test("the roster is in the primary nav in both places that hold one", () => {
  assert.match(indexHtml, /<li><a href="roster\/">Roster<\/a><\/li>/);
  assert.match(buildGuides, /\("\/roster\/", "Roster"\)/);
  const hub = fs.readFileSync(path.join(ROOT, "guides", "wow-forever", "index.html"), "utf8");
  assert.match(hub, /<li><a href="\/roster\/">Roster<\/a><\/li>/,
    "the generated guides are out of date — re-run python3 tools/build_guides.py");
});

test("the roster is in the sitemap", () => {
  assert.match(sitemap, /<loc>https:\/\/nossuary\.com\/roster\/<\/loc>\s*<lastmod>\d{4}-\d{2}-\d{2}<\/lastmod>/);
});

test("the page states what it is and when WoW: Forever launches, before any fetch", () => {
  assert.match(page, /4 November 2026/);
  assert.match(page, /<noscript>/);
  // Both factions are their own section in the markup, not drawn only when data arrives.
  assert.match(page, /data-faction="Alliance"/);
  assert.match(page, /data-faction="Horde"/);
});

test("every tab names the panel it controls, and every panel names its tab", () => {
  const tabs = [...page.matchAll(/role="tab"[^>]*aria-controls="([^"]+)"/g)].map((m) => m[1]);
  assert.equal(tabs.length, 6, "three views per faction");
  for (const id of tabs) {
    assert.ok(page.includes(`id="${id}"`), `no panel with id ${id}`);
    assert.match(page, new RegExp(`id="${id}"[^>]*role="tabpanel"|role="tabpanel"[^>]*id="${id}"`));
  }
});
