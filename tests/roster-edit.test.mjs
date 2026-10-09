// The roster registration form's pure module in plain node — no browser, no dependencies.
//
//   node --test tests/
//
// What a regression here would quietly break:
//   * a class, race, faction, profession or talent-tree name written into this repo, which is a
//     SECOND copy of unratified game data: every one of those names is datamined from a beta that
//     ends 2026-10-21, chamberlain/wow_forever.py is the single validator (Discord-Automation
//     DR-0017), and a copy here is one that drifts in the layer where fixing it costs a deploy;
//   * a legality check done in the browser, which refuses a character the game allows the week
//     after a patch and gives the member nobody to argue with;
//   * `options: null` drawn as a form with empty menus, instead of said out loud — it is an honest
//     recoverable state and the Worker deliberately answers 200 for it, not a 503;
//   * a 202 reported as "saved". The submission is ENQUEUED; Chamberlain validates and applies it
//     moments later, and the one outcome a member needs to know about (a refusal) arrives after
//     the page has already said yes;
//   * the 409 `submission_pending` shown as a bare reason code, when its `detail` is written to be
//     printed unaltered;
//   * a 300-character or 8 KB refusal that the member only learns about from a 413 naming no field;
//   * the publish-my-name opt-in defaulting ON for a new registration (Discord-Automation DR-0015:
//     counted by default, named only on opt-in);
//   * a CSP or build stamp that disagrees with config.js, so the real page cannot reach the Worker
//     or runs a stale module;
//   * any free text from the API reaching the page as HTML. Every menu label on this page is a
//     string Chamberlain chose, and this page is where they are all drawn.

import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath, pathToFileURL } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(HERE, "..");
const mod = (name) => import(pathToFileURL(path.join(ROOT, "js", "forum", name)).href);

// Imported with NO global document, which is the point of the guard at the foot of the module:
// everything above main() is pure, so it can be imported here without the page running.
assert.equal(typeof globalThis.document, "undefined", "page-roster-edit.js must be imported document-free");
const page = await mod("page-roster-edit.js");
const { createApi, ApiError, TOKEN_KEY } = await mod("api.js");

const BASE = "https://nossuary-forum.stewbagger.workers.dev";

// Stand-in pick-lists, in the EXACT SHAPE chamberlain/roster_web.py::build_options_document
// publishes — `races` as {faction: [{race, display}]}, `classes_by_race` keyed "<faction>|<race>",
// professions as [{name, gathering, specializations}] with the specializations NESTED, `slots` as
// [{slot, name}], and the two per-field text limits. Every NAME here is invented, so a passing
// test proves the page draws whatever it is handed rather than that it happens to know the game;
// the SHAPE is real, because reading a key the publisher does not emit is how a menu ends up
// empty and a limit ends up unenforced.
const OPTIONS = Object.freeze({
  max_level: 30,
  max_characters: 3,
  max_primary_professions: 2,
  char_name_max: 48,
  note_max: 140,
  slots: [{ slot: 1, name: "Main" }, { slot: 2, name: "Second" }, { slot: 3, name: "Third" }],
  factions: ["Gleam", "Murk"],
  rulesets: ["Ordinary", "Duelling"],
  roles: ["Guard", "Mender", "Reach"],
  // The display differs from the race for the one race playable on both factions, exactly as
  // display_race() decorates it. The VALUE must be the bare name: the decorated one would be
  // refused by check_identity.
  races: {
    Gleam: [{ race: "Tallfolk", display: "Tallfolk" }, { race: "Driftborn", display: "Driftborn (Lantern)" }],
    Murk: [{ race: "Stonekin", display: "Stonekin" }, { race: "Driftborn", display: "Driftborn (Ember)" }],
  },
  classes: [
    { key: "shepherd", name: "Shepherd", colour: "#aabbcc", guide: "/guides/x/shepherd/", trees: [
      { name: "Crook", roles: ["Guard"] }, { name: "Pasture", roles: ["Mender"] }] },
    { key: "tinker", name: "Tinker", colour: "#ccbbaa", guide: "/guides/x/tinker/", trees: [
      { name: "Sprocket", roles: ["Reach", "Guard"] }] },
    { key: "warden", name: "Warden", colour: "#bbccaa", guide: "/guides/x/warden/", trees: [] },
  ],
  classes_by_race: {
    "Gleam|Tallfolk": ["shepherd", "tinker"],
    "Gleam|Driftborn": ["warden"],
    "Murk|Stonekin": ["tinker"],
  },
  professions: {
    primary: [
      { name: "Potting", gathering: true, specializations: [] },
      { name: "Smelting", gathering: false, specializations: ["Platesmith", "Edgesmith"] },
    ],
    secondary: [
      { name: "Baking", gathering: false, specializations: [] },
      { name: "Angling", gathering: false, specializations: [] },
    ],
  },
  skyborne_order: { Gleam: "Lantern", Murk: "Ember" },
});

/** What GET /v1/roster/me answers for a member who is already registered. */
const REGISTERED = Object.freeze({
  registered: true,
  registration: {
    publish_name: true,
    characters: [{
      slot: 1,
      faction: "Murk",
      race: "Stonekin",
      class: "tinker",
      ruleset: "Ordinary",
      character_name: "Gravebeard",
      note: "happy to mend",
      trees: ["Sprocket"],
      professions: [
        { profession: "Smelting", kind: "primary", specialization: "Edgesmith" },
        { profession: "Baking", kind: "secondary", specialization: null },
      ],
    }],
  },
  updated_at: 1760000000000,
  pending: null,
  options: OPTIONS,
  options_updated_at: 1759900000000,
  limits: { max_body_bytes: 8192, max_text_chars: 300 },
});

/** The empty state, which is the EXPECTED state for most members. */
const EMPTY = Object.freeze({
  registered: false, registration: null, updated_at: null, pending: null,
  options: OPTIONS, options_updated_at: 1759900000000,
  limits: { max_body_bytes: 8192, max_text_chars: 300 },
});

/** The other empty state: Chamberlain has not published the pick-lists. A 200, not an error. */
const UNPUBLISHED = Object.freeze({
  registered: false, registration: null, updated_at: null, pending: null,
  options: null, options_updated_at: null,
  limits: { max_body_bytes: 8192, max_text_chars: 300 },
});

// --- The limits the Worker enforces -----------------------------------------------------------

test("textLimit and bodyLimit: the Worker's own figures, with a fallback for a silent response", () => {
  assert.equal(page.MAX_TEXT_FALLBACK, 300, "must track MAX_TEXT in src/roster.js");
  assert.equal(page.MAX_BODY_FALLBACK, 8192, "must track MAX_BODY in src/roster.js");
  assert.equal(page.textLimit(REGISTERED), 300);
  assert.equal(page.bodyLimit(REGISTERED), 8192);
  assert.equal(page.textLimit({ limits: { max_text_chars: 120 } }), 120);
  assert.equal(page.bodyLimit({ limits: { max_body_bytes: 4096 } }), 4096);
  for (const bad of [{}, null, { limits: {} }, { limits: { max_text_chars: 0 } },
    { limits: { max_text_chars: "300" } }, { limits: { max_text_chars: 1.5 } }]) {
    assert.equal(page.textLimit(bad), 300, JSON.stringify(bad));
  }
  for (const bad of [{}, null, { limits: {} }, { limits: { max_body_bytes: 8 } },
    { limits: { max_body_bytes: "8192" } }]) {
    assert.equal(page.bodyLimit(bad), 8192, JSON.stringify(bad));
  }
  // A Worker claiming a megabyte text field is not a reason to offer one.
  assert.equal(page.textLimit({ limits: { max_text_chars: 10 ** 9 } }), 10000);
  assert.equal(page.bodyLimit({ limits: { max_body_bytes: 10 ** 9 } }), 1024 * 1024);
});

// --- Menus are built from the document, whatever shape it chose -------------------------------

test("menuItem: a bare string, or an object that names itself any of the usual ways", () => {
  assert.deepEqual(page.menuItem("Gleam"), { value: "Gleam", label: "Gleam" });
  assert.deepEqual(page.menuItem("  Gleam  "), { value: "Gleam", label: "Gleam" });
  // A class entry: the KEY travels back to the authority, the NAME is drawn.
  assert.deepEqual(page.menuItem({ key: "tinker", name: "Tinker", colour: "#ccbbaa" }),
    { value: "tinker", label: "Tinker" });
  assert.deepEqual(page.menuItem({ value: "x", label: "X" }), { value: "x", label: "X" });
  assert.deepEqual(page.menuItem({ name: "Baking" }), { value: "Baking", label: "Baking" });
  assert.deepEqual(page.menuItem({ id: "7", display: "Seven" }), { value: "7", label: "Seven" });
  for (const bad of ["", "   ", null, undefined, 7, [], {}, { key: "  " }]) {
    assert.equal(page.menuItem(bad), null, JSON.stringify(bad));
  }
});

test("menuItems: order kept, repeats and rubbish dropped, and a ceiling on the whole menu", () => {
  assert.deepEqual(page.menuItems(["b", "a", "b", ""]).map((i) => i.value), ["b", "a"]);
  for (const bad of [null, undefined, {}, "no", 7]) assert.deepEqual(page.menuItems(bad), []);
  assert.equal(page.menuItems(Array.from({ length: 500 }, (_, i) => `p${i}`)).length, page.MAX_MENU_ITEMS);
});

test("normalizeOptions: the pick-lists as the form reads them, and null when there are none", () => {
  for (const bad of [null, undefined, "no", 7, []]) assert.equal(page.normalizeOptions(bad), null, JSON.stringify(bad));

  const o = page.normalizeOptions(OPTIONS);
  assert.deepEqual(o.factions.map((f) => f.value), ["Gleam", "Murk"]);
  assert.deepEqual(o.rulesets.map((r) => r.value), ["Ordinary", "Duelling"]);
  assert.deepEqual(o.classes.map((c) => [c.value, c.label]),
    [["shepherd", "Shepherd"], ["tinker", "Tinker"], ["warden", "Warden"]]);
  assert.deepEqual(o.classes[0].trees.map((t) => [t.value, t.roles]), [["Crook", ["Guard"]], ["Pasture", ["Mender"]]]);
  assert.deepEqual(o.racesByFaction.Gleam.map((r) => r.value), ["Tallfolk", "Driftborn"]);
  assert.deepEqual(o.professions.primary.map((p) => p.value), ["Potting", "Smelting"]);
  assert.deepEqual(o.professions.secondary.map((p) => p.value), ["Baking", "Angling"]);
  assert.deepEqual(o.specializations.Smelting.map((s) => s.value), ["Platesmith", "Edgesmith"]);
  assert.deepEqual(o.slots, [{ slot: 1, label: "Main" }, { slot: 2, label: "Second" }, { slot: 3, label: "Third" }]);
  assert.equal(o.maxCharacters, 3);
  assert.equal(o.maxPrimary, 2);
  assert.equal(o.countStated, true);

  // Trees keep their roles even when an entry before them is unreadable: the roles are walked with
  // the document, not indexed into a filtered copy, so they cannot land on the wrong tree.
  const shifted = page.normalizeOptions({
    factions: ["F"], classes: [{ key: "k", trees: [null, { name: "Second", roles: ["Mender"] }] }],
  });
  assert.deepEqual(shifted.classes[0].trees, [{ value: "Second", label: "Second", roles: ["Mender"] }]);
});

test("normalizeOptions: an absent key WIDENS a menu or drops a cap — it never empties one", () => {
  // The whole document is optional. Nothing here may throw, and nothing may come back as a menu
  // with no entries just because the publisher has not added that table yet.
  const bare = page.normalizeOptions({ factions: ["F"], classes: ["C"] });
  assert.deepEqual(bare.rulesets, []);
  assert.deepEqual(bare.professions, { primary: [], secondary: [] });
  assert.deepEqual(bare.specializations, {});
  assert.deepEqual(bare.classesByRace, {});
  assert.equal(bare.maxPrimary, null, "an unstated ceiling is not a ceiling of zero");
  assert.equal(bare.countStated, false);
  assert.equal(bare.maxCharacters, page.MAX_CHARACTERS_CAP, "no figure means the page's own cap, not 0");

  // max_characters is honoured, and clamped: a document claiming 10,000 does not get 10,000 cards.
  assert.equal(page.normalizeOptions({ max_characters: 2 }).maxCharacters, 2);
  assert.equal(page.normalizeOptions({ max_characters: 10 ** 6 }).maxCharacters, page.MAX_CHARACTERS_CAP);
  assert.equal(page.normalizeOptions({ max_characters: 0 }).maxCharacters, page.MAX_CHARACTERS_CAP);
  // slots alone names the count.
  assert.equal(page.normalizeOptions({ slots: ["Main", "Second"] }).maxCharacters, 2);
  assert.deepEqual(page.normalizeOptions({ slots: { 1: "Main", 2: "Second" } }).slots,
    [{ slot: 1, label: "Main" }, { slot: 2, label: "Second" }]);

  // A flat profession list names no kind, so it is offered as one group and sent as primary for
  // the authority to judge — rather than being silently halved or dropped.
  const flat = page.normalizeOptions({ professions: ["Potting", "Baking"] });
  assert.deepEqual(flat.professions.primary.map((p) => p.value), ["Potting", "Baking"]);
  assert.deepEqual(flat.professions.secondary, []);
  // Both spellings of the specialization table.
  assert.deepEqual(page.normalizeOptions({ profession_specializations: { Smelting: ["Edgesmith"] } })
    .specializations.Smelting.map((s) => s.value), ["Edgesmith"]);
});

test("the REAL publisher's shape is read: every key build_options_document actually emits", () => {
  // Each of these was a live defect. The page was reading keys the publisher does not emit, which
  // does not fail loudly — it produces an EMPTY MENU, and an empty menu is a form a member cannot
  // fill in at all.
  const o = page.normalizeOptions(OPTIONS);

  // `races` as {faction: [{race, display}]}. Read by `race`, not `name`/`key`/`value`.
  assert.deepEqual(o.racesByFaction.Gleam.map((r) => r.value), ["Tallfolk", "Driftborn"],
    "races are keyed `race`; reading only name/key/value empties every race menu");
  // The VALUE is the bare name and the LABEL is the decorated one. Sending the decorated string
  // back would be refused by check_identity, and the two differ only for the race that is playable
  // on both factions — so a reader that took the display would work until it did not.
  assert.deepEqual(o.racesByFaction.Gleam.map((r) => r.label), ["Tallfolk", "Driftborn (Lantern)"]);
  assert.deepEqual(o.racesByFaction.Murk.find((r) => r.value === "Driftborn").label, "Driftborn (Ember)");

  // `classes_by_race` keyed "<faction>|<race>", which is the shape the publisher uses.
  assert.deepEqual(page.classesFor(o, "Gleam", "Tallfolk").map((c) => c.value), ["shepherd", "tinker"]);
  assert.deepEqual(page.classesFor(o, "Gleam", "Driftborn").map((c) => c.value), ["warden"]);

  // Professions as [{name, gathering, specializations}] — the NAME is the value, and the
  // specializations are NESTED, not a top-level map. Reading only the top-level map meant the
  // specialization menu never appeared and a member could never register one.
  assert.deepEqual(o.professions.primary.map((p) => p.value), ["Potting", "Smelting"]);
  assert.deepEqual(o.professions.secondary.map((p) => p.value), ["Baking", "Angling"]);
  assert.deepEqual(page.specializationsFor(o, "Smelting").map((s) => s.value), ["Platesmith", "Edgesmith"]);
  assert.deepEqual(page.specializationsFor(o, "Potting"), [], "an empty nested list is not a menu");
  assert.deepEqual(page.specializationsFor(o, "Baking"), []);

  // `slots` as [{slot, name}] — the label is under `name`, and the count comes from it.
  assert.deepEqual(o.slots, [{ slot: 1, label: "Main" }, { slot: 2, label: "Second" }, { slot: 3, label: "Third" }]);
  assert.equal(o.maxCharacters, 3);

  // And the tolerant readings still work, so a publisher that changes shape does not break the
  // page: a flat races list, a nested classes_by_race, a top-level specializations map.
  const alt = page.normalizeOptions({
    factions: ["F"], classes: ["c"], races_by_faction: { F: ["R"] },
    classes_by_race: { F: { R: ["c"] } }, specializations: { c: ["s"] },
  });
  assert.deepEqual(page.racesFor(alt, "F").map((r) => r.value), ["R"]);
  assert.deepEqual(page.classesFor(alt, "F", "R").map((c) => c.value), ["c"]);
  assert.deepEqual(page.specializationsFor(alt, "c").map((s) => s.value), ["s"]);
});

test("optionsProblem: `options: null` is said in words, not drawn as empty menus", () => {
  const said = page.optionsProblem(UNPUBLISHED);
  assert.ok(said, "a null options document must stop the form being built");
  // It is not the member's problem and not a failure: the Worker answered 200 on purpose.
  assert.match(said, /hasn't published/);
  assert.match(said, /Nothing is wrong with your registration/);
  assert.doesNotMatch(said, /error|failed|sorry/i);

  // An absent key is the same situation as an explicit null.
  assert.ok(page.optionsProblem({ registered: false }));
  // Arrived but unreadable, or arrived without the two tables a form cannot be drawn without.
  assert.ok(page.optionsProblem({ options: "nonsense" }));
  assert.ok(page.optionsProblem({ options: {} }));
  assert.ok(page.optionsProblem({ options: { factions: ["F"] } }), "no classes, no class menu");
  assert.ok(page.optionsProblem({ options: { classes: ["C"] } }), "no factions, no faction menu");
  // And a usable document is no problem at all.
  assert.equal(page.optionsProblem(REGISTERED), null);
  assert.equal(page.optionsProblem(EMPTY), null);
});

// --- Dependent menus are READ from the document, never judged ---------------------------------

test("racesFor: the faction's own list, else a flat list, else every race mentioned anywhere", () => {
  const o = page.normalizeOptions(OPTIONS);
  assert.deepEqual(page.racesFor(o, "Gleam").map((r) => r.value), ["Tallfolk", "Driftborn"]);
  assert.deepEqual(page.racesFor(o, "Murk").map((r) => r.value), ["Stonekin", "Driftborn"]);
  // A faction the table says nothing about is offered every race, not none: an absent key must
  // never be able to leave a member with no choices.
  assert.deepEqual(page.racesFor(o, "Nowhere").map((r) => r.value), ["Tallfolk", "Driftborn", "Stonekin"]);
  assert.deepEqual(page.racesFor(o, "").map((r) => r.value), ["Tallfolk", "Driftborn", "Stonekin"]);

  const flat = page.normalizeOptions({ factions: ["F"], classes: ["C"], races: ["Tallfolk"] });
  assert.deepEqual(page.racesFor(flat, "anything").map((r) => r.value), ["Tallfolk"]);
  assert.deepEqual(page.racesFor(page.normalizeOptions({ classes: ["C"] }), "F"), []);
  assert.deepEqual(page.racesFor(null, "F"), []);
});

test("classesFor: narrowed by the (faction, race) table when there is one, else every class", () => {
  const o = page.normalizeOptions(OPTIONS);
  assert.deepEqual(page.classesFor(o, "Gleam", "Tallfolk").map((c) => c.value), ["shepherd", "tinker"]);
  assert.deepEqual(page.classesFor(o, "Gleam", "Driftborn").map((c) => c.value), ["warden"]);
  assert.deepEqual(page.classesFor(o, "Murk", "Stonekin").map((c) => c.value), ["tinker"]);
  // THE SAME RACE ON THE OTHER FACTION IS A DIFFERENT QUESTION, which is why the table is keyed on
  // the pair: wow_forever.py has a race playable on both factions whose class list differs.
  assert.deepEqual(page.classesFor(o, "Murk", "Driftborn").map((c) => c.value),
    ["shepherd", "tinker", "warden"], "a pair the table omits is offered everything, never nothing");
  assert.deepEqual(page.classesFor(o, "", "").map((c) => c.value), ["shepherd", "tinker", "warden"]);

  // A table naming a class the class list does not carry is the document disagreeing with itself.
  // The whole list stands rather than an empty menu.
  const odd = page.normalizeOptions({
    factions: ["F"], classes: ["a", "b"], classes_by_race: { F: { R: ["ghost"] } },
  });
  assert.deepEqual(page.classesFor(odd, "F", "R").map((c) => c.value), ["a", "b"]);
  assert.deepEqual(page.classesFor(null, "F", "R"), []);
});

test("classesFor: all three shapes a publisher could give a table keyed on a tuple", () => {
  const classes = ["a", "b", "c"];
  const nested = page.normalizeOptions({ factions: ["F"], classes, classes_by_race: { F: { R: ["a"] } } });
  const flatKey = page.normalizeOptions({ factions: ["F"], classes, classes_by_race: { "F|R": ["a"] } });
  const rows = page.normalizeOptions({ factions: ["F"], classes, classes_by_race: [{ faction: "F", race: "R", classes: ["a"] }] });
  for (const [name, o] of [["nested", nested], ["flat key", flatKey], ["rows", rows]]) {
    assert.deepEqual(page.classesFor(o, "F", "R").map((c) => c.value), ["a"], name);
    assert.deepEqual(page.classesFor(o, "F", "Other").map((c) => c.value), ["a", "b", "c"], name);
  }
});

test("treesFor and specializationsFor: from the entry that carries them, and [] is normal", () => {
  const o = page.normalizeOptions(OPTIONS);
  assert.deepEqual(page.treesFor(o, "shepherd").map((t) => t.value), ["Crook", "Pasture"]);
  assert.deepEqual(page.treesFor(o, "warden"), [], "a class with no trees published is not an error");
  assert.deepEqual(page.treesFor(o, "nobody"), []);
  assert.deepEqual(page.treesFor(o, ""), []);
  assert.deepEqual(page.treesFor(null, "shepherd"), []);

  assert.deepEqual(page.specializationsFor(o, "Smelting").map((s) => s.value), ["Platesmith", "Edgesmith"]);
  // Most professions have none, and that is the normal case, not a missing key to report.
  assert.deepEqual(page.specializationsFor(o, "Potting"), []);
  assert.deepEqual(page.specializationsFor(o, "Baking"), []);
  assert.deepEqual(page.specializationsFor(null, "Smelting"), []);

  assert.deepEqual(page.allProfessions(o).map((p) => p.value), ["Potting", "Smelting", "Baking", "Angling"]);
  assert.deepEqual(page.allProfessions(null), []);
});

test("the page holds NO game data: not a class, race, faction, profession or tree name", () => {
  // The whole reason this page fetches its menus. Every one of these names is datamined from a beta
  // that ends 2026-10-21 and wow_forever.py is the single validator (Discord-Automation DR-0017);
  // a copy here would be a copy to drift, in the layer where fixing it costs a deploy.
  const sources = {
    "js/forum/page-roster-edit.js": fs.readFileSync(path.join(ROOT, "js", "forum", "page-roster-edit.js"), "utf8"),
    "roster/edit/index.html": fs.readFileSync(path.join(ROOT, "roster", "edit", "index.html"), "utf8"),
  };
  const names = [
    // factions and races
    "Alliance", "Horde", "Dwarf", "Gnome", "Human", "Night Elf", "Skyborne", "Orc", "Tauren",
    "Troll", "Undead", "High Order", "Windshaper",
    // classes
    "Warrior", "Paladin", "Hunter", "Rogue", "Priest", "Shaman", "Mage", "Warlock", "Druid",
    // talent trees
    "Arms", "Fury", "Protection", "Holy", "Retribution", "Beast Mastery", "Marksmanship",
    "Survival", "Assassination", "Subtlety", "Discipline", "Shadow Magic", "Elemental Combat",
    "Enhancement", "Restoration", "Arcane", "Frost", "Affliction", "Demonology", "Destruction",
    "Balance", "Feral Combat",
    // professions, and the specializations
    "Alchemy", "Blacksmithing", "Enchanting", "Engineering", "Leatherworking", "Tailoring",
    "Herbalism", "Mining", "Skinning", "Cooking", "First Aid", "Fishing",
    "Armorsmith", "Weaponsmith", "Gnomish Engineering", "Dragonscale", "Tribal",
    // rulesets, roles, and the one number that is a game rule
    "PvP", "Hardcore", "Tank", "Healer", "Melee", "Ranged",
  ];
  for (const [where, src] of Object.entries(sources)) {
    for (const name of names) {
      assert.ok(!new RegExp(`\\b${name}\\b`).test(src), `${where} names ${JSON.stringify(name)}`);
    }
  }
  // Nor does it judge: no profession-count ceiling, no race/class matrix, no level cap in code.
  const js = sources["js/forum/page-roster-edit.js"];
  assert.ok(!/MAX_PRIMARY|maxPrimary\s*(?:&&|<|>|<=|>=)|primary\.length\s*[<>]/.test(js),
    "a two-primaries rule is wow_forever.py's, and must not be enforced here");
  assert.match(js, /maxPrimary \? /, "the ceiling is printed as a hint and nothing else");
});

// --- The opt-in to being named ----------------------------------------------------------------

test("publishNameState: offered only when something carries the flag, and OFF for a new member", () => {
  // Discord-Automation DR-0015: counted by default, named only on opt-in.
  const fromRegistration = page.publishNameState({ registration: { publish_name: true }, options: {} });
  assert.equal(fromRegistration.offered, true);
  assert.equal(fromRegistration.value, true, "an existing opt-in is honoured");

  const newMember = page.publishNameState({ registered: false, registration: null, options: { publish_name: true } });
  assert.equal(newMember.offered, true, "the options document describing the flag is enough to offer it");
  assert.equal(newMember.value, false, "DEFAULT OFF: the form makes the choice visible, it does not make it");

  // A stored flag that is not literally true is off. "yes", 1 and null are not consent.
  for (const stored of ["yes", 1, 0, null, undefined, {}]) {
    const s = page.publishNameState({ registration: { publish_name: stored } });
    assert.equal(s.offered, true, JSON.stringify(stored));
    assert.equal(s.value, false, JSON.stringify(stored));
  }
  const explicitlyOff = page.publishNameState({ registration: { publish_name: false } });
  assert.equal(explicitlyOff.offered, true);
  assert.equal(explicitlyOff.value, false);

  // A FIRST-TIME MEMBER IS ASKED. They have no mirror, and build_options_document does not
  // advertise the key, so gating on either one meant the one member who most needs to see the
  // choice never saw it — while `publish_name` is one of exactly two top-level keys
  // parse_registration accepts, so the page is not inventing a field.
  for (const payload of [{}, null, EMPTY, { options: OPTIONS, registration: { characters: [] } }]) {
    const s = page.publishNameState(payload);
    assert.equal(s.offered, true, `a new member must be asked: ${JSON.stringify(payload)}`);
    assert.equal(s.value, false, "and the answer starts at off");
  }

  // The one way to switch the question off is the publisher saying so.
  assert.deepEqual(page.publishNameState({ options: { publish_name: false } }),
    { offered: false, value: false, label: "", help: "" });
  // Switched off, the key is NOT sent — and an absent publish_name means "leave their existing
  // choice alone" on the far side, so a form that cannot ask cannot withdraw consent either.
  assert.equal("publish_name" in page.buildRegistration([], page.publishNameState({ options: { publish_name: false } })),
    false);

  // The words can come from the options document, and default to the page's own.
  const worded = page.publishNameState({ options: { publish_name: { label: "List me", help: "Up to you." } } });
  assert.deepEqual([worded.label, worded.help], ["List me", "Up to you."]);
  assert.match(page.publishNameState({ options: { publish_name: true } }).help, /counted but not named/);
});

// --- Reading the mirror, which is the authority's document in the authority's words ------------

test("readCharacters: the registration pre-fills the form, in either side's field names", () => {
  const o = page.normalizeOptions(OPTIONS);
  assert.deepEqual(page.readCharacters(REGISTERED.registration, o.maxCharacters), [{
    faction: "Murk",
    race: "Stonekin",
    classKey: "tinker",
    ruleset: "Ordinary",
    charName: "Gravebeard",
    note: "happy to mend",
    tree: "Sprocket",
    primary: ["Smelting"],
    secondary: ["Baking"],
    specializations: { Smelting: "Edgesmith" },
  }]);

  // Chamberlain's own record shape (cogs/roster.py's Draft, build_roster_document): char_name, a
  // single `tree`, and `primary`/`secondary` as two named lists. The mirror is whatever the
  // AUTHORITY pushed, so both spellings are read rather than one being guessed at.
  assert.deepEqual(page.readCharacters({ characters: [{
    faction: "Murk", race: "Stonekin", class_key: "tinker", char_name: "Gravebeard",
    tree: "Sprocket", primary: ["Smelting", "Potting"], secondary: ["Baking"],
  }] })[0], {
    faction: "Murk", race: "Stonekin", classKey: "tinker", ruleset: "", charName: "Gravebeard",
    note: "", tree: "Sprocket", primary: ["Smelting", "Potting"], secondary: ["Baking"],
    specializations: {},
  });

  // A profession with no `kind` is read as primary: the secondaries are the ones a document names.
  assert.deepEqual(page.readCharacters({ characters: [{ professions: [{ profession: "Potting" }] }] })[0].primary,
    ["Potting"]);

  // `name` is NOT the character's name. In the PUBLIC roster document that field is the MEMBER's
  // display name, and pre-filling it into a box that gets published would leak a Discord name into
  // a character name.
  assert.equal(page.readCharacters({ characters: [{ name: "SomeMember" }] })[0].charName, "");

  // Rubbish in the mirror is skipped rather than rendered as "undefined".
  assert.deepEqual(page.readCharacters(null), []);
  assert.deepEqual(page.readCharacters({}), []);
  assert.deepEqual(page.readCharacters({ characters: "no" }), []);
  assert.deepEqual(page.readCharacters({ characters: [null, 7, "x"] }), []);
  assert.deepEqual(page.readCharacters({ characters: [{ faction: 7, trees: "no", professions: {} }] })[0],
    { ...page.blankCharacter() });
  // More characters than are allowed are cut, so a stale mirror cannot draw an unbounded form.
  assert.equal(page.readCharacters({ characters: Array.from({ length: 50 }, () => ({})) }, 3).length, 3);
});

// --- What is sent ------------------------------------------------------------------------------

test("buildRegistration: the Worker's contract shape, and nothing invented", () => {
  const read = page.readCharacters(REGISTERED.registration, 3);
  const doc = page.buildRegistration(read, page.publishNameState(REGISTERED));
  // The shape in deploy/forum-worker/README.md's "Browser" example, exactly.
  assert.deepEqual(doc, {
    publish_name: true,
    characters: [{
      slot: 1,
      faction: "Murk",
      race: "Stonekin",
      class: "tinker",
      ruleset: "Ordinary",
      character_name: "Gravebeard",
      note: "happy to mend",
      trees: ["Sprocket"],
      professions: [
        { profession: "Smelting", kind: "primary", specialization: "Edgesmith" },
        { profession: "Baking", kind: "secondary", specialization: null },
      ],
    }],
  });

  // An unchosen menu is OMITTED, not sent as "". The authority whole-replaces, so an omitted note
  // is a cleared note, and a key holding "" is a value nobody chose.
  const blank = page.buildRegistration([page.blankCharacter()]);
  assert.deepEqual(blank, { characters: [{ slot: 1, trees: [], professions: [] }] });
  assert.ok(!("publish_name" in blank), "the opt-in is not invented when nothing offered it");

  // slot is the CARD'S POSITION, renumbered on every send: removing the first of three cannot
  // leave a gap for the authority to interpret.
  const three = page.buildRegistration([
    { ...page.blankCharacter(), faction: "A" },
    { ...page.blankCharacter(), faction: "B" },
  ]);
  assert.deepEqual(three.characters.map((c) => [c.slot, c.faction]), [[1, "A"], [2, "B"]]);

  // An empty characters array is a LEGITIMATE submission — "I have cleared my characters" — and
  // the authority DELETES the mirror for it. It has to be sendable.
  assert.deepEqual(page.buildRegistration([]), { characters: [] });
  assert.deepEqual(page.buildRegistration(null), { characters: [] });

  // A specialization is only ever attached to a profession that was actually chosen.
  const stray = page.buildRegistration([{ ...page.blankCharacter(), primary: ["Potting"], specializations: { Smelting: "Edgesmith" } }]);
  assert.deepEqual(stray.characters[0].professions, [{ profession: "Potting", kind: "primary", specialization: null }]);

  // publish_name is a boolean or it is absent; it is never a string the authority has to coerce.
  assert.equal(page.buildRegistration([], { offered: true, value: true }).publish_name, true);
  assert.equal(page.buildRegistration([], { offered: true, value: "yes" }).publish_name, false);
  assert.equal(page.buildRegistration([], { offered: false, value: true }).publish_name, undefined);
});

test("bodyBytes: the whole request, in UTF-8, the way readJson counts the stream", () => {
  // The Worker's 8 KB is counted on `{registration: …}`, not on the registration alone, and on
  // bytes rather than characters — so a note of emoji is bigger than its length suggests.
  assert.equal(page.bodyBytes({}), new TextEncoder().encode('{"registration":{}}').length);
  const ascii = page.bodyBytes({ characters: [{ note: "aaaa" }] });
  const wide = page.bodyBytes({ characters: [{ note: "💀💀💀💀" }] });
  assert.ok(wide > ascii, "four skulls are more bytes than four a's");
  assert.equal(wide - ascii, 4 * 3, "a four-byte code point is six more bytes than an ASCII one, in a JSON escape-free string");
  assert.equal(page.sizeLabel(1204, 8192), "1,204 / 8,192 bytes");
});

test("countLabel and overLimit: code points, as src/roster.js counts them", () => {
  assert.equal(page.textLength("abc"), 3);
  // [...v].length, not v.length: a character name of emoji is still a short name.
  assert.equal(page.textLength("💀💀"), 2);
  assert.equal("💀💀".length, 4, "the UTF-16 length the Worker deliberately does NOT use");
  assert.equal(page.textLength(null), 0);

  assert.equal(page.overLimit("x".repeat(300)), false);
  assert.equal(page.overLimit("x".repeat(301)), true);
  assert.equal(page.overLimit("💀".repeat(300)), false, "300 code points is 300 characters");
  assert.equal(page.overLimit("x".repeat(5), 3), true);
  assert.equal(page.overLimit(null), false);

  assert.equal(page.countLabel("", 300), "0 / 300");
  assert.equal(page.countLabel("abc", 300), "3 / 300");
  // Over the limit it keeps counting rather than sticking at the cap, so the member can see by how
  // much they are over.
  assert.equal(page.countLabel("x".repeat(1500), 300), "1,500 / 300");
});

test("tooLongText: the box and the character are NAMED, because a 413 names neither", () => {
  const long = { ...page.blankCharacter(), note: "x".repeat(301) };
  assert.deepEqual(page.tooLongText([page.blankCharacter(), long]),
    { index: 1, field: "note", label: "note", limit: 300 });
  assert.deepEqual(page.tooLongText([{ ...page.blankCharacter(), charName: "x".repeat(301) }]),
    { index: 0, field: "charName", label: "character name", limit: 300 });
  // The name is reported before the note on the same character, so the first box is the first told.
  assert.equal(page.tooLongText([{ charName: "x".repeat(301), note: "y".repeat(301) }]).field, "charName");
  assert.equal(page.tooLongText([page.blankCharacter()]), null);
  assert.equal(page.tooLongText([]), null);
  assert.equal(page.tooLongText(null), null);
  assert.equal(page.tooLongText([{ note: "x".repeat(301) }], 400), null, "the Worker's figure, not a fixed 300");
});

test("fieldLimits: Chamberlain's tighter figures, clamped inside the Worker's ceiling", () => {
  // THE DEFECT THIS CLOSES. parse_registration refuses a name over CHAR_NAME_MAX (48) and a note
  // over NOTE_MAX (140) and publishes both. The Worker's limit is 300 and it answers 202 for
  // anything under it, so a 200-character name was accepted, queued, reported as queued — and then
  // refused by Chamberlain, where the contract has no rejected state to tell the member with.
  assert.deepEqual(page.fieldLimits(REGISTERED), { charName: 48, note: 140 });
  assert.deepEqual(page.fieldLimits(EMPTY), { charName: 48, note: 140 });

  // CLAMPED: a published figure above the Worker's ceiling cannot widen what the Worker will take.
  assert.deepEqual(
    page.fieldLimits({ options: { char_name_max: 5000, note_max: 99999 }, limits: { max_text_chars: 300 } }),
    { charName: 300, note: 300 }, "the Worker's 300 is a hard upper bound on both");
  // And it clamps to the Worker's figure, not to a hardcoded 300.
  assert.deepEqual(
    page.fieldLimits({ options: { char_name_max: 5000, note_max: 99999 }, limits: { max_text_chars: 120 } }),
    { charName: 120, note: 120 });
  // A tighter Worker ceiling wins over a looser Chamberlain figure, and vice versa: the SMALLER of
  // the two always applies.
  assert.deepEqual(
    page.fieldLimits({ options: { char_name_max: 48, note_max: 140 }, limits: { max_text_chars: 100 } }),
    { charName: 48, note: 100 });

  // ABSENT means "only the Worker's limit applies" — the same direction every other absence takes
  // in this module. A missing key must not strand a member with a one-character box.
  assert.deepEqual(page.fieldLimits({ options: {}, limits: { max_text_chars: 300 } }), { charName: 300, note: 300 });
  assert.deepEqual(page.fieldLimits({ options: { char_name_max: 48 } }), { charName: 48, note: 300 },
    "one key present and one absent is read per field, not all-or-nothing");
  assert.deepEqual(page.fieldLimits(UNPUBLISHED), { charName: 300, note: 300 });
  assert.deepEqual(page.fieldLimits({}), { charName: 300, note: 300 });
  assert.deepEqual(page.fieldLimits(null), { charName: 300, note: 300 });

  // Unusable is the same as absent: zero, negative, fractional, a string, a null.
  for (const bad of [0, -1, 1.5, "48", null, true, [], {}, NaN, Infinity]) {
    assert.deepEqual(page.fieldLimits({ options: { char_name_max: bad, note_max: bad } }),
      { charName: 300, note: 300 }, JSON.stringify(bad));
  }
});

test("a name of 49 and a note of 141 are refused BEFORE send, naming the box and its real limit", () => {
  const limits = page.fieldLimits(REGISTERED);   // {charName: 48, note: 140}

  // 48 and 140 go through: the page must not be stricter than the side that judges.
  const atTheLimit = [{ ...page.blankCharacter(), charName: "x".repeat(48), note: "y".repeat(140) }];
  assert.equal(page.tooLongText(atTheLimit, limits), null);
  assert.equal(page.submitProblem(atTheLimit, { textLimits: limits }), null);

  // 49 is over, and the NAME is the field reported — not the note, which is well inside its own
  // larger limit. A single shared limit could not tell these two apart.
  const longName = [{ ...page.blankCharacter(), charName: "x".repeat(49), note: "y".repeat(140) }];
  assert.deepEqual(page.tooLongText(longName, limits),
    { index: 0, field: "charName", label: "character name", limit: 48 });
  const nameSaid = page.submitProblem(longName, { textLimits: limits });
  assert.match(nameSaid, /Character 1's character name is over 48 characters/);
  assert.doesNotMatch(nameSaid, /300/, "the number shown must be the one that refused, not the Worker's");

  // 141 is over for the note, on the second character, and the note is named.
  const longNote = [page.blankCharacter(), { ...page.blankCharacter(), note: "y".repeat(141) }];
  assert.deepEqual(page.tooLongText(longNote, limits),
    { index: 1, field: "note", label: "note", limit: 140 });
  assert.match(page.submitProblem(longNote, { textLimits: limits }),
    /Character 2's note is over 140 characters/);

  // THE FAILURE THIS PREVENTS: 200 characters of name was "200 / 300", accepted, queued, reported
  // as queued, and then silently dropped by Chamberlain with no route back to the member.
  const theOldBug = [{ ...page.blankCharacter(), charName: "x".repeat(200) }];
  assert.equal(page.submitProblem(theOldBug, { textLimits: 300 }), null, "what the page used to do");
  assert.match(page.submitProblem(theOldBug, { textLimits: limits }), /over 48 characters/,
    "and what it does now, before anything is sent");

  // Code points, not UTF-16 units, at the per-field limit too.
  assert.equal(page.tooLongText([{ charName: "💀".repeat(48) }], limits), null);
  assert.equal(page.tooLongText([{ charName: "💀".repeat(49) }], limits).limit, 48);
});

test("the counter, the maxlength and the pre-submit check all agree, per box", () => {
  // Three places hold a limit and they must be the same number, or a member types into a box that
  // says 300, is stopped at 48 by the browser, or is refused by a check they were not shown.
  const opts = page.normalizeOptions(OPTIONS);
  const limits = page.fieldLimits(REGISTERED);
  const { elements } = withDocument(() => page.characterCard(0, page.blankCharacter(), opts, { textLimits: limits }));
  const boxes = elements.filter((e) => ["input", "textarea"].includes(e.tagName) && e.attributes.get("maxlength"));
  const counters = elements.filter((e) => e.className.includes("composer-count"));

  assert.deepEqual(boxes.map((b) => Number(b.attributes.get("maxlength"))), [limits.charName, limits.note]);
  assert.deepEqual(counters.map((c) => c.textContent),
    [page.countLabel("", limits.charName), page.countLabel("", limits.note)]);
  // And the check uses the same pair, so nothing can be typed that the check would then reject.
  assert.equal(page.tooLongText([{ charName: "x".repeat(limits.charName), note: "y".repeat(limits.note) }], limits), null);

  // A single number still works everywhere, so a caller with one figure is not a crash.
  const one = withDocument(() => page.characterCard(0, page.blankCharacter(), opts, { textLimits: 120 }));
  assert.deepEqual(one.elements.filter((e) => e.attributes.get("maxlength")).map((b) => b.attributes.get("maxlength")),
    ["120", "120"]);
});

test("submitProblem: only SHAPE and SIZE — never a word about the game", () => {
  const ok = [page.blankCharacter()];
  assert.equal(page.submitProblem(ok), null);
  // A half-chosen registration is sendable. Judging it is wow_forever.py's job, and it can say
  // something useful about the refusal where this page could only shrug.
  assert.equal(page.submitProblem([{ ...page.blankCharacter(), faction: "Gleam" }]), null);
  // So is an empty one: that is how a member clears their registration.
  assert.equal(page.submitProblem([]), null);

  // The pending refusal is reported FIRST, because nothing else can be sent until it clears.
  assert.equal(page.submitProblem(ok, { pending: true }), page.PENDING_SENTENCE);
  assert.equal(page.submitProblem([], { pending: true, bytes: 99999 }), page.PENDING_SENTENCE);

  const long = page.submitProblem([{ ...page.blankCharacter(), note: "x".repeat(301) }]);
  assert.match(long, /Character 1's note is over 300 characters/);
  const big = page.submitProblem(ok, { bytes: 9000 });
  assert.match(big, /9,000 bytes/);
  assert.match(big, /8,192/);
  assert.match(big, /remove a character/);
  // At the limit exactly is fine: the Worker refuses past it, not at it.
  assert.equal(page.submitProblem(ok, { bytes: 8192 }), null);
  assert.equal(page.submitProblem(ok, { bytes: 4097, bodyMax: 4096 }) === null, false);

  // Plain text, every time: these are set with textContent.
  for (const s of [long, big, page.PENDING_SENTENCE]) assert.doesNotMatch(s, /[<>]/, s);
});

// --- Queued, not saved -------------------------------------------------------------------------

test("the page NEVER says a submission is saved: a 202 is a queue, not a write", () => {
  const queued = page.queuedLine();
  assert.match(queued, /NOT saved yet/);
  assert.match(queued, /waiting/);
  // The thing a member actually needs to know: the refusal, if any, comes later and elsewhere.
  assert.match(queued, /checks them against the game's rules/);
  assert.match(queued, /Reload this page/);
  // It may say what the submission WILL become; it may not say it already has.
  assert.doesNotMatch(queued, /\b(?:is|has been|was) (?:now )?saved\b/i);
  assert.doesNotMatch(queued, /\byou are (?:now )?registered\b/i);

  const pending = page.pendingLine();
  assert.match(pending, /not your registration yet/);
  assert.match(pending, /cannot be sent until/);

  // And the module as a whole does not have the word anywhere it could be mistaken for success.
  const src = fs.readFileSync(path.join(ROOT, "js", "forum", "page-roster-edit.js"), "utf8");
  assert.ok(!/text: "Saved|Saved\.|Your registration is saved/.test(src), "nothing on this page says saved");
});

test("standingLine: registered or not, said before the member touches anything", () => {
  const registered = page.standingLine(REGISTERED);
  assert.match(registered.text, /You are registered\./);
  assert.equal(registered.time, new Date(1760000000000).toISOString());
  const fresh = page.standingLine(EMPTY);
  assert.match(fresh.text, /not registered yet/);
  assert.equal(fresh.time, null);
  // registered: true with an unreadable timestamp still says the right thing, with no time.
  assert.equal(page.standingLine({ registered: true, updated_at: null }).time, null);
  assert.match(page.standingLine({ registered: true, updated_at: "soon" }).text, /You are registered\./);
  assert.match(page.standingLine(null).text, /not registered yet/);
});

test("msToIso and pendingTime: the Worker's times are milliseconds, and nothing else is a time", () => {
  assert.equal(page.msToIso(1760000600000), new Date(1760000600000).toISOString());
  assert.equal(page.pendingTime({ created_at: 1760000600000 }), new Date(1760000600000).toISOString());
  for (const bad of [null, undefined, 0, -1, "soon", NaN, Infinity, 10 ** 20]) {
    assert.equal(page.msToIso(bad), null, JSON.stringify(bad));
  }
  for (const bad of [null, undefined, {}, { created_at: 0 }, { created_at: "soon" }]) {
    assert.equal(page.pendingTime(bad), null, JSON.stringify(bad));
  }
});

// --- Every refusal the contract can produce ----------------------------------------------------

test("describeRosterError: each of the Worker's refusals gets its own remedy, in plain language", () => {
  const err = (status, code, detail = "detail", reason = null) => new ApiError(status, code, detail, null, reason);
  const said = (...args) => page.describeRosterError(err(...args));

  // Never reached the API at all.
  assert.match(said(0, "network"), /Nothing was sent/);
  // requireMember / refreshMembership: unauthorized("sign in required" | "session ended").
  assert.match(said(401, "unauthorized"), /Sign in again on the forums/);
  assert.match(said(403, "forbidden", "not a member of the Null Ossuary Discord", "not_member"),
    /members of the Null Ossuary Discord/);
  assert.match(said(403, "forbidden"), /wouldn't accept that/);
  // 413: readJson past MAX_BODY, or checkSubmission on a value over MAX_TEXT.
  assert.match(said(413, "too_large", "body exceeds 8192 bytes"), /Shorten the notes/);
  assert.match(said(413, "too_large", "a text value exceeds 300 characters"), /Shorten the notes/);
  // 400: every shape failure, and the Worker's detail is worth showing because it is specific.
  assert.match(said(400, "bad_request", "registration is nested more than 8 deep"), /nested more than 8 deep/);
  assert.match(said(400, "bad_request", null), /Reload the page/);
  // unavailable(): no DB binding, or the local "unavailable" api.js raises for a null forumApiUrl.
  assert.match(said(503, "unavailable"), /isn't switched on/);
  assert.match(said(0, "unavailable"), /Nothing was sent/, "network is decided before the code");
  assert.match(said(500, "internal"), /Reload the page/);
  assert.match(said(502, "upstream"), /having trouble right now/);
  assert.match(page.describeRosterError(new ApiError(429, "rate_limited", null, 30)), /too often/);

  // Plain text, every time: these are set with textContent.
  for (const s of [said(0, "network"), said(401), said(413, "too_large"), said(503, "unavailable")]) {
    assert.doesNotMatch(s, /[<>]/, s);
  }
});

test("the 409 submission_pending detail is printed UNALTERED, never as a reason code", () => {
  // src/roster.js writes that sentence to be shown to a member and documents it in README's error
  // table for exactly that purpose. Two copies of a sentence drift; a bare `reason` shows a human
  // the string "submission_pending".
  const WORKER_SENTENCE = "Your last roster change has not been saved yet. Give it a minute and try again.";
  const conflict = new ApiError(409, "conflict", WORKER_SENTENCE, null, "submission_pending");
  assert.equal(page.describeRosterError(conflict), WORKER_SENTENCE);
  // Whatever it says. If the Worker rewords it, the page shows the new words with no edit here.
  const reworded = new ApiError(409, "conflict", "Hold on — the Chamberlain still has your last one.", null, "submission_pending");
  assert.equal(page.describeRosterError(reworded), "Hold on — the Chamberlain still has your last one.");
  // A 409 with no detail falls back to the page's own copy rather than showing nothing.
  assert.equal(page.describeRosterError(new ApiError(409, "conflict", null, null, "submission_pending")),
    page.PENDING_SENTENCE);
  // And the code itself never reaches a member.
  for (const e of [conflict, reworded]) assert.doesNotMatch(page.describeRosterError(e), /submission_pending/);
  // An over-long or non-string detail is not printed: the page's own sentence is.
  assert.equal(page.describeRosterError(new ApiError(409, "conflict", "x".repeat(400), null, "submission_pending")),
    page.PENDING_SENTENCE);
});

// --- The API client's two roster calls ---------------------------------------------------------

function tabStorage(init = {}) {
  const data = new Map(Object.entries(init));
  return {
    data,
    setItem: (k, v) => void data.set(k, String(v)),
    getItem: (k) => (data.has(k) ? data.get(k) : null),
    removeItem: (k) => void data.delete(k),
  };
}

function fetchStub(responses) {
  const calls = [];
  const fn = async (url, init) => {
    calls.push({ url, init });
    const next = responses.shift();
    if (next instanceof Error) throw next;
    return next;
  };
  fn.calls = calls;
  return fn;
}

test("api: GET /v1/roster/me and POST /v1/roster/me, as Bearer, to the one configured origin", async () => {
  const fetch = fetchStub([
    Response.json(REGISTERED),
    Response.json({ queued: true, created_at: 1760000600000 }, { status: 202 }),
  ]);
  const api = createApi({ base: BASE, fetch, storage: tabStorage({ [TOKEN_KEY]: "secret-token" }) });

  assert.deepEqual(await api.roster(), REGISTERED);
  const doc = page.buildRegistration(page.readCharacters(REGISTERED.registration, 3), page.publishNameState(REGISTERED));
  assert.deepEqual(await api.submitRoster(doc), { queued: true, created_at: 1760000600000 });

  const [get, post] = fetch.calls;
  assert.equal(get.url, `${BASE}/v1/roster/me`);
  assert.equal(get.init.method, "GET");
  assert.equal(post.url, `${BASE}/v1/roster/me`);
  assert.equal(post.init.method, "POST");
  // ONE key. The Worker's onlyKeys(["registration"]) answers 400 `unknown field "…"` for anything
  // else, so nothing may be smuggled alongside it — and discord_id in particular comes from the
  // SESSION and is never read from the body.
  const body = JSON.parse(post.init.body);
  assert.deepEqual(Object.keys(body), ["registration"]);
  assert.deepEqual(body, { registration: doc });
  assert.ok(!("discord_id" in body) && !("discord_id" in body.registration));

  for (const c of fetch.calls) {
    assert.equal(c.init.headers.authorization, "Bearer secret-token");
    assert.equal(c.init.credentials, "omit");
    assert.ok(!String(c.url).includes("secret-token"), "the token is never in a URL");
  }
});

test("api: a 401 on a roster call is not retried signed-out — both routes are member-only", async () => {
  const storage = tabStorage({ [TOKEN_KEY]: "stale" });
  const fetch = fetchStub([Response.json({ error: "unauthorized", detail: "session ended" }, { status: 401 })]);
  let signedOut = 0;
  const api = createApi({ base: BASE, fetch, storage, onSignedOut: () => { signedOut += 1; } });
  await assert.rejects(api.roster(), (e) => e.status === 401);
  assert.equal(fetch.calls.length, 1, "one request, not a pointless anonymous retry");
  assert.equal(storage.getItem(TOKEN_KEY), null, "the dead token is dropped");
  assert.equal(signedOut, 1);
});

test("api: the 409's reason and detail both survive the client, and a null base sends nothing", async () => {
  const api = createApi({
    base: BASE,
    fetch: fetchStub([Response.json({
      error: "conflict", reason: "submission_pending",
      detail: "Your last roster change has not been saved yet. Give it a minute and try again.",
    }, { status: 409 })]),
    storage: tabStorage({ [TOKEN_KEY]: "t" }),
  });
  await assert.rejects(api.submitRoster({ characters: [] }), (e) =>
    e.status === 409 && e.code === "conflict" && e.reason === "submission_pending"
    && /has not been saved yet/.test(e.detail));

  await assert.rejects(createApi({ base: null, fetch: fetchStub([]), storage: tabStorage() }).roster(),
    (e) => e.code === "unavailable");
});

// --- Nothing from the API is ever drawn as HTML -------------------------------------------------
//
// A stand-in document with only what render.js's el() and this page use. innerHTML,
// insertAdjacentHTML and document.write are ABSENT, so a call to one throws, and serialisation
// escapes the way a browser does.

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const escAttr = (s) => esc(s).replace(/"/g, "&quot;");

function standInDocument() {
  const created = [];
  class Element {
    constructor(tag) {
      this.tagName = tag;
      this.attributes = new Map();
      this.children = [];
      this.text = null;
      this.listeners = [];
      const classes = new Set();
      this.classList = {
        classes,
        toggle: (name, on) => (on ? classes.add(name) : classes.delete(name)),
        contains: (name) => classes.has(name),
      };
      created.push(this);
    }
    set className(v) { this.attributes.set("class", String(v)); }
    get className() { return this.attributes.get("class") || ""; }
    set textContent(v) { this.text = String(v); this.children = []; }
    get textContent() {
      return this.text === null
        ? this.children.map((c) => (typeof c === "string" ? c : c.textContent)).join("")
        : this.text;
    }
    setAttribute(k, v) { this.attributes.set(k, String(v)); }
    append(...nodes) { for (const n of nodes) this.children.push(n); }
    replaceChildren(...nodes) { this.children = [...nodes]; this.text = null; }
    addEventListener(type, fn) { this.listeners.push([type, fn]); }
    fire(type) { for (const [t, fn] of this.listeners) if (t === type) fn({ preventDefault() {} }); }
  }
  return { created, createElement: (tag) => new Element(tag) };
}

function serialize(node) {
  if (typeof node === "string") return esc(node);
  const attrs = [...node.attributes].map(([k, v]) => ` ${k}="${escAttr(v)}"`).join("");
  const inner = node.text === null ? node.children.map(serialize).join("") : esc(node.text);
  return `<${node.tagName}${attrs}>${inner}</${node.tagName}>`;
}

/** Render with a stand-in document installed, then take it away again. */
function withDocument(fn) {
  const doc = standInDocument();
  globalThis.document = doc;
  try {
    return { value: fn(), elements: doc.created };
  } finally {
    delete globalThis.document;
  }
}

const HOSTILE = '</textarea><img src=x onerror="alert(1)"><script>alert(2)</script>';

/** Every game string in the pick-lists replaced by markup — every one of them is Chamberlain's. */
const HOSTILE_OPTIONS = Object.freeze({
  max_characters: 2,
  max_primary_professions: 2,
  factions: [`faction ${HOSTILE}`],
  rulesets: [`ruleset ${HOSTILE}`],
  races_by_faction: { [`faction ${HOSTILE}`]: [{ race: `race ${HOSTILE}`, display: `display ${HOSTILE}` }] },
  classes: [{ key: `class ${HOSTILE}`, name: `class name ${HOSTILE}`, trees: [{ name: `tree ${HOSTILE}`, roles: [`role ${HOSTILE}`] }] }],
  professions: { primary: [`primary ${HOSTILE}`], secondary: [`secondary ${HOSTILE}`] },
  specializations: { [`primary ${HOSTILE}`]: [`spec ${HOSTILE}`] },
  slots: [{ slot: 1, label: `slot ${HOSTILE}` }],
});

test("xss: every label, name and note is drawn as text, never as markup", () => {
  const opts = page.normalizeOptions(HOSTILE_OPTIONS);
  const { value: html, elements } = withDocument(() => {
    const card = page.characterCard(0, {
      ...page.blankCharacter(),
      faction: `faction ${HOSTILE}`,
      race: `race ${HOSTILE}`,
      classKey: `class ${HOSTILE}`,
      ruleset: `ruleset ${HOSTILE}`,
      charName: `name ${HOSTILE}`,
      note: `note ${HOSTILE}`,
      tree: `tree ${HOSTILE}`,
      primary: [`primary ${HOSTILE}`],
      secondary: [`secondary ${HOSTILE}`],
      specializations: { [`primary ${HOSTILE}`]: `spec ${HOSTILE}` },
    }, opts, { slotLabel: `slot ${HOSTILE}` });
    const publish = page.publishCard({ offered: true, value: false, label: `label ${HOSTILE}`, help: `help ${HOSTILE}` });
    const pending = page.pendingCard({ created_at: 1760000600000 });
    const queued = page.queuedPanel(1760000600000);
    return [card.root, publish.root, pending, queued].map(serialize).join("");
  });

  // The text survives intact — it is shown, not stripped — and only ever escaped.
  assert.ok(html.includes(esc(HOSTILE)), "the hostile string is shown as text");
  assert.doesNotMatch(html, /<script/i);
  assert.doesNotMatch(html, /<img/i);
  // The <option> elements and the <legend> are where a faction, race, class, tree and profession
  // name lands, and every one of them is a string the Chamberlain chose.
  assert.ok((html.match(/&lt;script&gt;alert\(2\)&lt;\/script&gt;/g) || []).length >= 10,
    "every menu label, the name, the note, the slot label and the opt-in words");

  // The one textarea in the output is the page's own note box, and its value is a PROPERTY, never
  // serialised content: a note that closed the tag early would otherwise escape it.
  assert.equal((html.match(/<textarea/gi) || []).length, 1);
  assert.match(html, /<textarea[^>]*><\/textarea>/);

  // No tag in the output carries an event handler, and nothing unexpected was created. Checked on
  // the parsed attribute NAMES as well as the serialised tags: an <option>'s `value` legitimately
  // carries the hostile string, and `onerror=&quot;` inside a quoted attribute is text — the thing
  // that would be an injection is an attribute actually CALLED on-something.
  for (const e of elements) {
    for (const key of e.attributes.keys()) {
      assert.doesNotMatch(key, /^on/i, `event handler attribute ${key} on <${e.tagName}>`);
    }
  }
  const tags = html.match(/<[a-z][^>]*>/gi) || [];
  assert.ok(tags.length > 0);
  for (const tag of tags) assert.doesNotMatch(tag, /\son\w+="/i, `event handler attribute in ${tag}`);
  const allowed = new Set(["section", "header", "h2", "div", "p", "label", "select", "option",
    "input", "textarea", "fieldset", "legend", "button", "span", "strong", "time", "a"]);
  for (const e of elements) assert.ok(allowed.has(e.tagName), `unexpected <${e.tagName}>`);
});

test("xss: a hostile option VALUE goes back to the authority unchanged, and is never markup", () => {
  // The value is the thing that travels; the label is the thing that is drawn. Both come from the
  // same document, and the submission must carry the value the pick-list gave, byte for byte.
  const opts = page.normalizeOptions(HOSTILE_OPTIONS);
  const doc = page.buildRegistration([{
    ...page.blankCharacter(),
    faction: opts.factions[0].value,
    classKey: opts.classes[0].value,
    primary: [opts.professions.primary[0].value],
  }]);
  assert.equal(doc.characters[0].faction, `faction ${HOSTILE}`);
  assert.equal(doc.characters[0].class, `class ${HOSTILE}`);
  assert.equal(doc.characters[0].professions[0].profession, `primary ${HOSTILE}`);
  // And it is JSON, so it cannot break out of the request either.
  assert.equal(JSON.parse(JSON.stringify({ registration: doc })).registration.characters[0].faction,
    `faction ${HOSTILE}`);
});

test("the form is built from `options` and carries the Worker's limits before anything is typed", () => {
  const opts = page.normalizeOptions(OPTIONS);
  const { elements } = withDocument(() => page.characterCard(0, {
    ...page.blankCharacter(), faction: "Gleam", race: "Tallfolk", classKey: "shepherd", tree: "Crook",
  }, opts, { textLimits: page.fieldLimits(REGISTERED) }));

  const selects = elements.filter((e) => e.tagName === "select");
  const options = (select) => select.children.map((o) => o.attributes.get("value"));
  // faction, race, class, talents, ruleset — and nothing is offered that `options` did not carry.
  assert.deepEqual(selects.map((s) => s.attributes.get("id")),
    ["redit-c1-faction", "redit-c1-race", "redit-c1-class", "redit-c1-tree", "redit-c1-ruleset"]);
  assert.deepEqual(options(selects[0]), ["", "Gleam", "Murk"]);
  assert.deepEqual(options(selects[1]), ["", "Tallfolk", "Driftborn"], "the chosen faction's races");
  assert.deepEqual(options(selects[2]), ["", "shepherd", "tinker"], "the (faction, race) pair's classes");
  assert.deepEqual(options(selects[3]), ["", "Crook", "Pasture"], "the chosen class's trees");

  // The roles a tree says it covers are drawn from the document, and never sent.
  const roles = elements.find((e) => e.className.includes("redit-roles"));
  assert.equal(roles.textContent, "Can cover: Guard");

  // Each box carries ITS OWN limit — Chamberlain's 48 for the name and 140 for the note, not the
  // Worker's 300 for both — so a member cannot type past the figure that will refuse them.
  const boxes = elements.filter((e) => ["input", "textarea"].includes(e.tagName) && e.attributes.get("maxlength"));
  assert.deepEqual(boxes.map((b) => b.attributes.get("maxlength")), ["48", "140"]);
  const counters = elements.filter((e) => e.className.includes("composer-count"));
  assert.deepEqual(counters.map((c) => c.textContent), ["0 / 48", "0 / 140"],
    "the limit is on the page before anything is typed");

  // The profession groups are checkbox lists with NO cap enforced: a ceiling is a game rule, and
  // the figure the document gave is printed as a hint instead.
  const boxesChecked = elements.filter((e) => e.attributes.get("type") === "checkbox");
  assert.equal(boxesChecked.length, 4, "two primaries and two secondaries offered");
  const hint = elements.find((e) => e.className.includes("redit-hint") && /allows up to/.test(e.textContent));
  assert.match(hint.textContent, /up to 2\. He checks it, not this page\./);
});

test("the form pre-fills from the registration and reads back what the member chose", () => {
  const opts = page.normalizeOptions(OPTIONS);
  const existing = page.readCharacters(REGISTERED.registration, opts.maxCharacters)[0];
  const { value: card, elements } = withDocument(() => page.characterCard(0, existing, opts, {}));

  const selected = (id) => {
    const select = elements.find((e) => e.tagName === "select" && e.attributes.get("id") === id);
    return select.children.find((o) => o.attributes.has("selected"))?.attributes.get("value") || "";
  };
  assert.equal(selected("redit-c1-faction"), "Murk");
  assert.equal(selected("redit-c1-race"), "Stonekin");
  assert.equal(selected("redit-c1-class"), "tinker");
  assert.equal(selected("redit-c1-tree"), "Sprocket");
  assert.equal(selected("redit-c1-ruleset"), "Ordinary");
  // The specialization menu appeared because the profession carrying one was ticked — a dependent
  // menu driven by the served document, not by knowing which professions have one.
  assert.equal(selected("redit-c1-spec-0"), "Edgesmith");

  // Reading the card back gives the same registration it was built from, so a member who changes
  // nothing and sends does not quietly lose a field.
  withDocument(() => {
    const built = page.buildRegistration([card.read()]);
    assert.deepEqual(built.characters[0], page.buildRegistration([existing]).characters[0]);
  });
});

test("a stored choice the pick-lists no longer offer is KEPT and marked, not silently dropped", () => {
  // The member registered it and the game data moved under them. Dropping it on a page load would
  // be this page deciding a question that is the authority's, and the next send would quietly
  // change their registration.
  const opts = page.normalizeOptions(OPTIONS);
  const { elements } = withDocument(() => page.characterCard(0, {
    ...page.blankCharacter(), faction: "Gleam", race: "Tallfolk", classKey: "retired",
  }, opts, {}));
  const select = elements.find((e) => e.tagName === "select" && e.attributes.get("id") === "redit-c1-class");
  const kept = select.children.find((o) => o.attributes.get("value") === "retired");
  assert.ok(kept, "the stored class is still in the menu");
  assert.match(kept.textContent, /no longer offered/);
  assert.ok(kept.attributes.has("selected"));
});

test("choosing a faction clears what depended on it, so three impossible things cannot be sent", () => {
  const opts = page.normalizeOptions(OPTIONS);
  withDocument(() => {
    const card = page.characterCard(0, {
      ...page.blankCharacter(), faction: "Murk", race: "Stonekin", classKey: "tinker", tree: "Sprocket",
    }, opts, {});
    const find = (key) => globalThis.document.created
      .find((e) => e.tagName === "select" && e.attributes.get("id") === `redit-c1-${key}`);
    const faction = find("faction");
    faction.value = "Gleam";
    faction.fire("change");
    const read = card.read();
    assert.equal(read.faction, "Gleam");
    assert.deepEqual([read.race, read.classKey, read.tree], ["", "", ""],
      "the race, class and tree of the faction they left are gone");
    // And the menus below it were refilled from the new faction.
    assert.deepEqual(find("race").children.map((o) => o.attributes.get("value")), ["", "Tallfolk", "Driftborn"]);
  });
});

test("the module never parses a string as HTML or code", () => {
  const src = fs.readFileSync(path.join(ROOT, "js", "forum", "page-roster-edit.js"), "utf8");
  assert.doesNotMatch(src, /\.(innerHTML|outerHTML)\s*=|insertAdjacentHTML|document\.write|\beval\(|new Function/);
});

// --- The page: stamp, CSP, robots, nav ----------------------------------------------------------

const readRoot = (...p) => fs.readFileSync(path.join(ROOT, ...p), "utf8");
const stampsIn = (text) => new Set([...text.matchAll(/\?v=(\d{8}-\d+)/g)].map((m) => m[1]));

test("the stamp is the FORUM bundle's, because this page loads forum modules", () => {
  const surface = new Set([
    ...stampsIn(readRoot("roster", "edit", "index.html")),
    ...stampsIn(readRoot("js", "forum", "page-roster-edit.js")),
  ]);
  assert.equal(surface.size, 1, `stamps disagree: ${[...surface].join(", ")}`);
  // THE POOL IS js/forum/*, NOT roster/. This page imports boot.js, api.js and render.js, so a page
  // on one stamp importing them at another would run two copies of the bundle. /roster/ is a
  // different surface for a good reason: it loads js/roster.js, reads the STATUS Worker, and shares
  // no code with this page at all — so it keeps its own stamp and this page does not follow it.
  const forum = stampsIn(readRoot("js", "forum", "boot.js"));
  assert.deepEqual([...surface], [...forum], "this page's stamp must equal the forum bundle's");
  assert.notDeepEqual([...surface], [...stampsIn(readRoot("roster", "index.html"))],
    "the public roster page is its own pool; sharing a stamp would hide a bump in either");

  // Every script and stylesheet the page loads carries it...
  for (const m of readRoot("roster", "edit", "index.html").matchAll(/(?:src|href)="(\/(?:js|css)\/[^"]+)"/g)) {
    assert.match(m[1], /\?v=\d{8}-\d+$/, `${m[1]} has no ?v= stamp`);
  }
  // ...and so does every relative import in the module, or a browser serves one from a stale cache.
  for (const m of readRoot("js", "forum", "page-roster-edit.js").matchAll(/from\s+"(\.[^"]+)"/g)) {
    assert.match(m[1], /\?v=/, `page-roster-edit.js imports ${m[1]}`);
  }
});

test("the public roster page's own stamp still agrees with itself after the link was added", () => {
  // roster/index.html gained the link to this page and references a changed css/roster.css, so its
  // own pool had to be bumped. tests/roster.test.mjs asserts it agrees; this asserts it moved.
  const stamps = stampsIn(readRoot("roster", "index.html"));
  assert.equal(stamps.size, 1, `the roster page's stamps disagree: ${[...stamps].join(", ")}`);
});

test("the CSP names config.js's forumApiUrl origin — the FORUM Worker, not the status one", () => {
  const sandbox = { window: {} };
  vm.runInNewContext(readRoot("js", "config.js"), sandbox);
  const apiOrigin = new URL(sandbox.window.OSSUARY.forumApiUrl).origin;
  const statusOrigin = new URL(sandbox.window.OSSUARY.rosterUrl).origin;

  const html = readRoot("roster", "edit", "index.html");
  const csp = /http-equiv="Content-Security-Policy" content="([^"]+)"/.exec(html)?.[1];
  assert.ok(csp, "the page has a per-page CSP");
  const directives = Object.fromEntries(csp.split(";").map((d) => d.trim().split(/\s+/)).map(([k, ...v]) => [k, v]));
  assert.deepEqual(directives["default-src"], ["'self'"]);
  // Exactly the forum Worker. /roster/ reads the STATUS Worker and this page must not be able to
  // reach it, nor it this one: they are different Workers with different gates.
  assert.deepEqual(directives["connect-src"], [apiOrigin]);
  assert.notEqual(apiOrigin, statusOrigin, "the two Workers are different origins, which is the point");
  assert.ok(!csp.includes(statusOrigin), "the status Worker has no business being reachable from here");
  // boot.js draws the member's Discord avatar in the header.
  assert.deepEqual(directives["img-src"], ["'self'", "https://cdn.discordapp.com", "data:"]);
  assert.deepEqual(directives["script-src"], ["'self'"]);
  assert.deepEqual(directives["style-src"], ["'self'"]);
  assert.deepEqual(directives["object-src"], ["'none'"]);
  assert.deepEqual(directives["base-uri"], ["'none'"]);
  assert.deepEqual(directives["form-action"], ["'self'"]);

  assert.doesNotMatch(html, /<script(?![^>]*\bsrc=)[^>]*>/, "no inline script");
  assert.doesNotMatch(html, /\son[a-z]+=/i, "no inline handlers");
  assert.doesNotMatch(html, /\sstyle="/i, "no inline style: this page runs style-src 'self'");

  // No URL is duplicated here: the module's only copy of the API base is boot.js's DEFAULT_API.
  const src = readRoot("js", "forum", "page-roster-edit.js");
  assert.ok(!/https:\/\/[a-z0-9.-]*workers\.dev/.test(src), "the module must not hold its own copy of the URL");
  assert.ok(!/DEFAULT_API|forumApiUrl/.test(src), "the base comes from boot.js's config(), not from here");
});

test("a member-only form is never indexed, and never in the sitemap", () => {
  assert.match(readRoot("roster", "edit", "index.html"), /<meta name="robots" content="noindex, nofollow">/);
  // The sitemap is for pages a stranger can use. robots.txt is deliberately not involved: a
  // Disallow line would advertise the path to everyone who reads it.
  assert.ok(!readRoot("sitemap.xml").includes("/roster/edit/"), "sitemap.xml must not list /roster/edit/");
  assert.ok(!readRoot("robots.txt").includes("edit"), "robots.txt must not name the form");
  // The PUBLIC roster is still in the sitemap, and adding the link did not touch that.
  assert.match(readRoot("sitemap.xml"), /<loc>https:\/\/nossuary\.com\/roster\/<\/loc>/);
});

test("the page loads one stylesheet, as every forum-Worker surface does", () => {
  const sheets = [...readRoot("roster", "edit", "index.html").matchAll(/<link rel="stylesheet" href="([^"?]+)/g)]
    .map((m) => m[1]);
  // forums/**, /intake/ and /admin/ load css/style.css and nothing else. /roster/ and /guides/,
  // which are not Worker surfaces, are the ones with a second file. This is a Worker surface.
  assert.deepEqual(sheets, ["/css/style.css"]);
  const css = readRoot("css", "style.css");
  for (const cls of ["redit-form", "redit-character", "redit-grid", "redit-field", "redit-hint",
    "redit-roles", "redit-group", "redit-specs", "redit-check", "redit-publish", "redit-pending",
    "redit-clearing", "redit-queued", "redit-professions", "redit-size"]) {
    assert.ok(css.includes(`.${cls}`), `css/style.css styles .${cls}`);
  }
  // The public roster's own classes are rs-* in css/roster.css, which this page does not load.
  assert.ok(!readRoot("js", "forum", "page-roster-edit.js").includes('"rs-'), "no rs-* class from the other page");
});

test("the primary nav agrees with the forum pages', and the page keeps the forum's landmarks", () => {
  const navItems = (html) => {
    const nav = /<nav aria-label="Primary">([\s\S]*?)<\/nav>/.exec(html)?.[1] || "";
    return [...nav.matchAll(/<a href="([^"]+)"[^>]*>([^<]+)<\/a>/g)].map((m) => `${m[2]} ${m[1]}`);
  };
  const html = readRoot("roster", "edit", "index.html");
  assert.deepEqual(navItems(html), navItems(readRoot("forums", "new", "index.html")));
  assert.deepEqual(navItems(html), navItems(readRoot("intake", "index.html")), "and with the other form");
  // /roster/edit/ is not itself in the nav, so nothing on this page is the current page.
  assert.doesNotMatch(/<nav aria-label="Primary">[\s\S]*?<\/nav>/.exec(html)[0], /aria-current/);

  // boot.js and render.js write into these by id; a renamed one fails silently in a browser.
  for (const id of ["forum-session", "forum-note", "forum-status", "forum-main"]) {
    assert.ok(html.includes(`id="${id}"`), `the page has #${id} for boot.js/render.js`);
  }
  assert.match(html, /<noscript>/, "the form is fetched, so a no-JS visitor is told why the page is empty");

  // The gate and every dead end lead to /forums/, because auth.js::safeReturnPath only honours a
  // return path under /forums/ — a sign-in button here would strand the member there anyway.
  const src = readRoot("js", "forum", "page-roster-edit.js");
  assert.ok(!src.includes("signInButton"), "no sign-in button on this page: it could not come back here");
  assert.ok(src.includes("FORUMS"), "the gate links to /forums/");
  assert.match(src, /Sign-in happens on the forums/, "and it says WHY sign-in is somewhere else");
});

test("the form is reachable: the public roster links to it", () => {
  // The page is noindex and absent from the sitemap, so this link is the only way in.
  const roster = readRoot("roster", "index.html");
  assert.match(roster, /href="\/roster\/edit\/"/, "roster/index.html must link to the form");
  // Outside the nav, which is shared with index.html and tools/build_guides.py: a member-only page
  // does not belong in the site's primary navigation.
  const nav = /<nav aria-label="Primary">[\s\S]*?<\/nav>/.exec(roster)[0];
  assert.ok(!nav.includes("/roster/edit/"), "a member-only form is not a primary nav item");
  // And this page links back, so the two are not a one-way trip.
  assert.ok(readRoot("js", "forum", "page-roster-edit.js").includes('ROSTER = "/roster/"'));
});
