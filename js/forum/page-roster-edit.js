// /roster/edit/ — a member's own WoW: Forever roster registration, added and EDITED here.
//
// WHY THIS PAGE EXISTS. Registering is a Discord select-menu flow (chamberlain/cogs/roster.py):
// one choice per step, and a member who wants to change the professions on their second character
// walks the whole flow again from the faction. A form shows the whole registration at once and can
// be edited, which is the half Discord cannot do. /roster/ is the public, read-only view of the
// result; this is where a member changes their own row.
//
// ============================================================================================
// THIS PAGE CARRIES NO WOW GAME DATA. NOT ONE CLASS, RACE, FACTION, PROFESSION OR TREE NAME.
// ============================================================================================
// Every menu is built from the `options` document GET /v1/roster/me serves, and nothing here
// judges whether a choice is legal. chamberlain/wow_forever.py is the single validator
// (Discord-Automation DR-0017) and the forum Worker's src/roster.js declines the same bet one
// layer down: the professions, the two-primary ceiling, the specializations and the 27 tree names
// are all DATAMINED from a beta that ends 2026-10-21, and names have already drifted once between
// announcement and client. A copy in this file would be a third place to get it wrong, in the
// layer where fixing it costs a deploy. So the page offers what it was told to offer, sends it
// unjudged, and lets the authority answer in a real sentence naming the race and class it
// refused, which this page could not write even if it wanted to.
//
// What that costs, and why it is worth it: a member CAN build a registration this page will
// happily send and the Chamberlain will refuse. That is the deliberate trade — the alternative is
// a form that refuses a legal character the week after a patch, with no way to argue.
//
// DEPENDENT MENUS ARE DRIVEN BY `options`, NOT BY KNOWLEDGE. If the document says which classes a
// (faction, race) pair may be, the class menu narrows to them; if it does not, the menu offers all
// of them. Narrowing from the served document is reading, not validating — and the fallback
// direction matters: an absent key must never be able to leave a member with no choices.
//
// `options: null` MEANS THE PICK-LISTS ARE NOT PUBLISHED YET. It is an honest, recoverable state
// and not an error (the Worker returns 200, deliberately not a 503). The form cannot be built, so
// the page says so in words instead of drawing empty menus.
//
// A SUBMISSION IS ASYNCHRONOUS AND THIS PAGE NEVER CLAIMS OTHERWISE. POST /v1/roster/me answers
// 202 {queued: true}: the row is in a queue Chamberlain polls, validates and applies moments
// later. Until then the member's registration is UNCHANGED. Saying "saved" on a 202 would be a lie
// the next page load exposes, so every success word here is "queued". While a submission is queued
// the Worker answers 409 `submission_pending` to a second one — refused rather than replaced,
// because a roster edit is a considered change and a second one in flight is nearly always a
// double-click or a stale second tab. The page disables its own send for that reason and prints
// the Worker's 409 `detail` unaltered if one gets through anyway.
//
// Everything above main() is pure and document-free, so tests/roster-edit.test.mjs can import this
// module under `node --test`. Every string from the API reaches the page through el()'s `text`
// (textContent) — nothing is ever inserted as HTML.
//
// SIGN-IN IS NOT OFFERED HERE, deliberately, as on /intake/ and /admin/: auth.js::safeReturnPath
// only honours a same-origin path under /forums/, so a sign-in started here would land the member
// on the forums anyway. The gate says so and links there.
import { boot } from "./boot.js?v=20261008-1";
import { describeError } from "./api.js?v=20261008-1";
import { el, mount, showStatus, emptyState, timeEl, FORUMS } from "./render.js?v=20261008-1";

// --- Pure -----------------------------------------------------------------------------------

/** Where the public, read-only roster lives. The one link this page needs that is not /forums/. */
export const ROSTER = "/roster/";

/** src/roster.js MAX_TEXT, used only when `limits` does not name it. */
export const MAX_TEXT_FALLBACK = 300;

/** src/roster.js MAX_BODY, used only when `limits` does not name it. */
export const MAX_BODY_FALLBACK = 8 * 1024;

/**
 * A ceiling on characters when `options` names none — a response to distrust, not to render, and
 * NOT a statement about the game. How many characters a member may register is Chamberlain's to
 * say; this only stops an unbounded "add another" button when the figure did not arrive.
 */
export const MAX_CHARACTERS_CAP = 10;

/** More entries in one menu than any honest pick-list has. Same reasoning. */
export const MAX_MENU_ITEMS = 200;

/** The page's own words for the pending state, for the pre-check. The 409's own detail wins. */
export const PENDING_SENTENCE =
  "Your last roster change has not been saved yet. Give it a minute and try again.";

const DEFAULT_PUBLISH_LABEL = "Show my name on the public roster";
const DEFAULT_PUBLISH_HELP =
  "Off means you are counted but not named — that is the default, and you can change it whenever you like.";

const str = (v) => (typeof v === "string" ? v.trim() : "");
const listOf = (v) => (Array.isArray(v) ? v : []);
const isDoc = (v) => Boolean(v) && typeof v === "object" && !Array.isArray(v);
const positive = (v) => (Number.isInteger(v) && v > 0 ? v : null);

/** Code points, not UTF-16 units: the Worker counts `[...v].length`, so a name of emoji is short. */
export const textLength = (v) => (typeof v === "string" ? [...v].length : 0);

/**
 * One menu entry from whatever shape the pick-lists use: a bare string, or an object that names
 * itself. `value` is what travels back to the authority and `label` is only ever drawn.
 *
 * THE TWO HALVES ARE NOT INTERCHANGEABLE, and races are the sharpest case:
 * build_options_document publishes `{race, display}`, and for the one race playable on both
 * factions the display carries the faction's order in brackets while the `race` does not. Sending
 * the display string back would be refused by check_identity, so the value is the bare name and
 * the label is the decorated one. Classes are the same split the other way round: a lower-case
 * key travels and a display name is drawn.
 *
 * Every key the real publisher uses is read — `race` and `profession` as well as `value`, `key`
 * and `name` — because a value this reader cannot find is a menu ENTRY SILENTLY DROPPED, and a
 * whole table read this way is a menu with nothing in it.
 */
export function menuItem(raw) {
  if (typeof raw === "string") {
    const s = raw.trim();
    return s ? { value: s, label: s } : null;
  }
  if (!isDoc(raw)) return null;
  const value = str(raw.value) || str(raw.key) || str(raw.name) || str(raw.race)
    || str(raw.profession) || str(raw.tree) || str(raw.id);
  if (!value) return null;
  return { value, label: str(raw.label) || str(raw.display) || str(raw.name) || value };
}

/** A whole menu, de-duplicated by value, in the order the document gave. */
export function menuItems(raw) {
  const out = [];
  const seen = new Set();
  for (const row of listOf(raw).slice(0, MAX_MENU_ITEMS)) {
    const item = menuItem(row);
    if (!item || seen.has(item.value)) continue;
    seen.add(item.value);
    out.push(item);
  }
  return out;
}

/**
 * Talent trees, which carry the jobs a character investing in them can cover. The roles are drawn
 * as a hint beside the menu and nothing keys on them — a tree is an INTENT, not an entity
 * (wow_forever.py's Tree), so this page never turns one into a claim about a character.
 */
function treeItems(raw) {
  const out = [];
  const seen = new Set();
  for (const row of listOf(raw).slice(0, MAX_MENU_ITEMS)) {
    const item = menuItem(row);
    if (!item || seen.has(item.value)) continue;
    seen.add(item.value);
    // Walked rather than mapped over menuItems(): that drops unreadable and repeated entries, so an
    // index into it no longer lines up with the document and the roles would land on another tree.
    out.push({ ...item, roles: (isDoc(row) ? listOf(row.roles) : []).map(str).filter(Boolean) });
  }
  return out;
}

const pairKey = (faction, race) => `${faction}|${race}`;

/**
 * (faction, race) -> the class keys that pair may be, from any of the three shapes a publisher
 * would reasonably choose for a table that wow_forever.py keys on a TUPLE:
 *   {faction: {race: [...]}}  ·  {"faction|race": [...]}  ·  [{faction, race, classes}]
 * An unreadable entry is skipped, which leaves the pair unconstrained rather than empty.
 */
function classesByRace(raw) {
  const out = {};
  const put = (faction, race, list) => {
    const keys = menuItems(list).map((i) => i.value);
    if (faction && race && keys.length) out[pairKey(faction, race)] = keys;
  };
  if (Array.isArray(raw)) {
    for (const row of raw) {
      if (isDoc(row)) put(str(row.faction), str(row.race), row.classes ?? row.class_keys);
    }
    return out;
  }
  if (!isDoc(raw)) return out;
  for (const [key, value] of Object.entries(raw)) {
    if (Array.isArray(value)) {
      const [faction, race] = String(key).split("|");
      put(str(faction), str(race), value);
    } else if (isDoc(value)) {
      for (const [race, list] of Object.entries(value)) put(str(key), str(race), list);
    }
  }
  return out;
}

/**
 * The character slots, from `slots` as a list or as a {number: label} map. The slot NUMBER is
 * positional — it is this page's index, not a fact about the game — and the label is only drawn.
 */
function slotItems(raw) {
  const rows = Array.isArray(raw)
    ? raw
    : isDoc(raw) ? Object.entries(raw).map(([k, label]) => ({ slot: Number(k), label })) : [];
  const out = [];
  for (const row of rows.slice(0, MAX_CHARACTERS_CAP)) {
    if (typeof row === "string") {
      out.push({ slot: out.length + 1, label: row.trim() });
      continue;
    }
    if (!isDoc(row)) continue;
    const slot = Number(row.slot ?? row.value ?? out.length + 1);
    if (!Number.isInteger(slot) || slot < 1) continue;
    out.push({ slot, label: str(row.label) || str(row.name) });
  }
  return out;
}

/**
 * The pick-lists as this page reads them, or null when there are none to read.
 *
 * Every field is optional and every absence has a direction that cannot strand a member: a missing
 * table widens the menu it would have narrowed, and a missing count removes a cap rather than
 * setting it to zero.
 */
export function normalizeOptions(options) {
  if (!isDoc(options)) return null;

  const factions = menuItems(options.factions);
  const rulesets = menuItems(options.rulesets ?? options.ruleset);

  const rawClasses = listOf(options.classes).slice(0, MAX_MENU_ITEMS);
  const classes = menuItems(rawClasses).map((item, i) => {
    const row = rawClasses[i];
    return { ...item, trees: isDoc(row) ? treeItems(row.trees ?? row.talents) : [] };
  });

  // races: {faction: [...]} as wow_forever.py's RACES_BY_FACTION is shaped, or one flat list used
  // for every faction. A race is NOT keyed on faction alone there — one race is playable on BOTH
  // factions and its class list differs between them — which is why this is read per faction.
  const raceSource = options.races_by_faction ?? options.races;
  const racesByFaction = {};
  let racesFlat = [];
  if (Array.isArray(raceSource)) racesFlat = menuItems(raceSource);
  else if (isDoc(raceSource)) {
    for (const [faction, list] of Object.entries(raceSource)) racesByFaction[faction] = menuItems(list);
  }

  // professions: {primary, secondary} as build_roster_document publishes them. A FLAT list names
  // no kind, so it is offered as one group and sent as `primary` for the authority to judge.
  const p = options.professions;
  const primary = Array.isArray(p) ? menuItems(p) : menuItems(p?.primary);
  const secondary = Array.isArray(p) ? [] : menuItems(p?.secondary);

  // The specializations, from EITHER place the document can carry them: a top-level map keyed by
  // profession, or nested in each profession entry the way build_options_document publishes them
  // (`{name, gathering, specializations}`). Both are read because the shape is the publisher's to
  // choose, and a specialization this page cannot find is a menu that never appears at all — the
  // member could then never register one through the form. The nested copy wins, being the one
  // that travels with the profession it belongs to.
  const specializations = {};
  const addSpecs = (profession, list) => {
    const items = menuItems(list);
    if (profession && items.length) specializations[profession] = items;
  };
  const specSource = options.specializations ?? options.profession_specializations;
  if (isDoc(specSource)) {
    for (const [profession, list] of Object.entries(specSource)) {
      addSpecs(str(profession) || String(profession), list);
    }
  }
  for (const row of [...listOf(p), ...listOf(p?.primary), ...listOf(p?.secondary)]) {
    if (!isDoc(row)) continue;
    addSpecs(menuItem(row)?.value, row.specializations ?? row.specialisations);
  }

  const slots = slotItems(options.slots);
  const named = positive(Number(options.max_characters));
  const maxCharacters = Math.min(named || slots.length || MAX_CHARACTERS_CAP, MAX_CHARACTERS_CAP);

  return {
    factions,
    rulesets,
    classes,
    racesByFaction,
    racesFlat,
    classesByRace: classesByRace(options.classes_by_race),
    professions: { primary, secondary },
    specializations,
    slots,
    maxCharacters,
    // A HINT ONLY, printed beside the profession boxes and never enforced. "Two primaries" is a
    // game rule and this page does not hold game rules.
    maxPrimary: positive(Number(options.max_primary_professions)),
    // Whether `max_characters` was actually stated, so the page can say it was not.
    countStated: Boolean(named || slots.length),
  };
}

/** The per-value text ceiling the Worker will enforce, from its own response. */
export function textLimit(payload) {
  const n = Number(payload?.limits?.max_text_chars);
  if (!Number.isInteger(n) || n < 1) return MAX_TEXT_FALLBACK;
  return Math.min(n, 10000);
}

/** The whole-body ceiling the Worker will enforce, from its own response. */
export function bodyLimit(payload) {
  const n = Number(payload?.limits?.max_body_bytes);
  if (!Number.isInteger(n) || n < 64) return MAX_BODY_FALLBACK;
  return Math.min(n, 1024 * 1024);
}

/**
 * The per-field text limits: {charName, note}.
 *
 * ================================================================================
 * TWO SIDES REFUSE FREE TEXT, AND ONLY THE TIGHTER ONE CAN BE REPORTED TO A MEMBER.
 * ================================================================================
 * The Worker's `limits.max_text_chars` (300) applies to EVERY string in a submission and is a
 * hard ceiling — it answers 413 and the page never sends past it. Chamberlain's
 * roster_web.py::parse_registration refuses a character name over CHAR_NAME_MAX (48) and a note
 * over NOTE_MAX (140), and publishes both as `char_name_max` and `note_max` for this page to use.
 *
 * IGNORING THEM IS THE WORST FAILURE THIS PAGE CAN HAVE, because it looks like success: a
 * 200-character name counts as "200 / 300", the Worker accepts it and answers 202, this page says
 * "Queued", and Chamberlain then refuses the whole submission minutes later. The contract has NO
 * rejected state, so that refusal reaches the member nowhere at all — their edit is gone and the
 * only trace is a WARNING line in a log they cannot read. A limit that is enforced where the
 * member can still see what they typed is the only place it can be enforced usefully.
 *
 * THE CLAMPING RULE, in one sentence: each field's limit is Chamberlain's figure when it is a
 * positive integer, never above the Worker's ceiling, and the Worker's ceiling when it is absent
 * or unusable. So the two sides compose rather than contradicting — the tighter limit always wins,
 * and a published figure LARGER than the Worker's ceiling cannot widen what the Worker will take.
 * An absent key is "only the Worker's limit applies", which is the same direction every other
 * absence takes in this module: it must not strand the member.
 */
export function fieldLimits(payload) {
  const ceiling = textLimit(payload);
  const options = payload?.options;
  const from = (key) => {
    // The value is taken as it arrived, NOT coerced: JSON from the publisher gives a real number,
    // so a string or a float is a publisher bug, and guessing what "48" meant is how a limit ends
    // up enforced at a figure nobody chose. Unusable is read as absent, which means only the
    // Worker's ceiling applies — the direction that cannot strand a member.
    const n = positive(isDoc(options) ? options[key] : undefined);
    return n === null ? ceiling : Math.min(n, ceiling);
  };
  return { charName: from("char_name_max"), note: from("note_max") };
}

/** A per-field limit pair from either a pair or a single number, so one figure still works. */
function asFieldLimits(value) {
  if (isDoc(value)) {
    return {
      charName: positive(Number(value.charName)) || MAX_TEXT_FALLBACK,
      note: positive(Number(value.note)) || MAX_TEXT_FALLBACK,
    };
  }
  const n = positive(Number(value)) || MAX_TEXT_FALLBACK;
  return { charName: n, note: n };
}

/**
 * Why the form cannot be drawn, or null. `null` options is the documented and expected case; a
 * document that arrived but names no factions or no classes is the same problem for the member,
 * and is reported as such rather than as empty menus.
 */
export function optionsProblem(payload) {
  if (!Object.prototype.hasOwnProperty.call(payload || {}, "options") || payload.options === null) {
    return "The Chamberlain hasn't published the WoW: Forever choices yet, so this form can't be built. "
      + "Nothing is wrong with your registration — come back shortly, or register in the Discord in the meantime.";
  }
  const opts = normalizeOptions(payload.options);
  if (!opts) {
    return "The choices the Chamberlain published can't be read, so this form can't be built. "
      + "Nothing is wrong with your registration — try again shortly, or register in the Discord.";
  }
  if (!opts.factions.length || !opts.classes.length) {
    return "The choices the Chamberlain published are incomplete, so this form can't be built yet. "
      + "Nothing is wrong with your registration — try again shortly, or register in the Discord.";
  }
  return null;
}

/** The races to offer for a faction: that faction's list, the flat list, or every race known. */
export function racesFor(opts, faction) {
  if (!opts) return [];
  const own = opts.racesByFaction[faction];
  if (Array.isArray(own) && own.length) return own;
  if (opts.racesFlat.length) return opts.racesFlat;
  // No per-faction table and no flat list: every race the document mentioned anywhere, so a
  // missing key widens the menu instead of emptying it.
  const seen = new Set();
  const out = [];
  for (const list of Object.values(opts.racesByFaction)) {
    for (const item of list) {
      if (seen.has(item.value)) continue;
      seen.add(item.value);
      out.push(item);
    }
  }
  return out;
}

/**
 * The classes to offer for a (faction, race): the pair's own list when the document has one, else
 * every class. Narrowing is reading what was served; it is not a legality check, and a pair the
 * document says nothing about is offered everything rather than nothing.
 */
export function classesFor(opts, faction, race) {
  if (!opts) return [];
  const keys = opts.classesByRace[pairKey(faction, race)];
  if (!Array.isArray(keys) || !keys.length) return opts.classes;
  const allowed = new Set(keys);
  const narrowed = opts.classes.filter((c) => allowed.has(c.value));
  // A key naming a class the class table does not carry is the document disagreeing with itself.
  // Offering nothing would strand the member, so the whole list stands.
  return narrowed.length ? narrowed : opts.classes;
}

/** The talent trees for a class, from that class's own entry. Absent is simply "none offered". */
export function treesFor(opts, classKey) {
  if (!opts) return [];
  return opts.classes.find((c) => c.value === classKey)?.trees || [];
}

/** The specializations for a profession, or [] — most professions have none, which is normal. */
export function specializationsFor(opts, profession) {
  if (!opts) return [];
  return opts.specializations[profession] || [];
}

/** Every profession offered, in one list, so a stored value can be found whatever its kind. */
export function allProfessions(opts) {
  if (!opts) return [];
  return [...opts.professions.primary, ...opts.professions.secondary];
}

/**
 * The opt-in to being NAMED on the public roster.
 *
 * Discord-Automation DR-0015: a member is COUNTED by default and NAMED only on opt-in, because
 * /roster/ is the open web and being listed and being identified are different questions.
 *
 * OFFERED UNLESS THE PUBLISHER SWITCHES IT OFF. `publish_name` is one of exactly two top-level
 * keys roster_web.py::parse_registration accepts, so it is part of the contract and not something
 * this page would be inventing. Gating it on a document happening to mention it meant a FIRST-TIME
 * member — no mirror yet, and `options` does not advertise the key — was never shown the choice at
 * all, which is the one case where being asked matters most: the Discord flow asks it on the first
 * registration precisely so the decision is visible rather than defaulted silently.
 *
 * DEFAULT OFF for a first-time registration, always. An existing opt-in is honoured; anything that
 * is not literally `true` is off. The key is sent only when the member was actually shown the
 * control, because an omitted `publish_name` means "leave their existing choice alone" on the far
 * side — so a form that cannot show the box cannot withdraw or grant consent either.
 */
export function publishNameState(payload) {
  const descriptor = isDoc(payload?.options) ? payload.options.publish_name : undefined;
  const registration = payload?.registration;
  const stored = isDoc(registration)
    && Object.prototype.hasOwnProperty.call(registration, "publish_name");
  // An explicit `false` in the pick-lists is the publisher saying "do not ask"; nothing else is.
  if (descriptor === false) return { offered: false, value: false, label: "", help: "" };
  const d = isDoc(descriptor) ? descriptor : {};
  return {
    offered: true,
    value: stored ? registration.publish_name === true : false,
    label: str(d.label) || DEFAULT_PUBLISH_LABEL,
    help: str(d.help) || str(d.detail) || DEFAULT_PUBLISH_HELP,
  };
}

/** A profession's kind, defaulting to primary: the secondaries are the ones a document names. */
const kindOf = (p) => (str(p?.kind) || "primary").toLowerCase();

function professionsOf(character, kind) {
  if (Array.isArray(character.professions)) {
    return character.professions
      .filter((p) => isDoc(p) && kindOf(p) === kind)
      .map((p) => str(p.profession) || str(p.name))
      .filter(Boolean);
  }
  // Chamberlain's own record shape: `primary` and `secondary` as two named lists
  // (cogs/roster.py's Draft, and build_roster_document). The mirror is pushed by the authority, so
  // its field names are the authority's and this page reads both spellings rather than guessing.
  return listOf(character[kind]).map(str).filter(Boolean);
}

function specializationsOf(character) {
  const out = {};
  for (const p of listOf(character.professions)) {
    if (!isDoc(p)) continue;
    const profession = str(p.profession) || str(p.name);
    const spec = str(p.specialization) || str(p.spec);
    if (profession && spec) out[profession] = spec;
  }
  return out;
}

/**
 * The mirrored registration as the form's own state, read TOLERANTLY.
 *
 * The mirror is whatever the authority pushed, and the authority's field names are its own: the
 * Worker's contract example sends `character_name` / `professions[{profession, kind}]`, while
 * Chamberlain's record carries `char_name` / `primary` / `secondary`. Both are read. What is NOT
 * read is `name`: in the PUBLIC roster document that field is the member's display name, and
 * pre-filling the character-name box with somebody's Discord name would be a small data leak into
 * a field that gets published.
 */
export function readCharacters(registration, maxCharacters = MAX_CHARACTERS_CAP) {
  const raw = listOf(registration?.characters).slice(0, Math.max(1, maxCharacters));
  const out = [];
  for (const c of raw) {
    if (!isDoc(c)) continue;
    const trees = listOf(c.trees).map(str).filter(Boolean);
    out.push({
      faction: str(c.faction),
      race: str(c.race),
      classKey: str(c.class) || str(c.class_key),
      ruleset: str(c.ruleset),
      charName: str(c.character_name) || str(c.char_name),
      note: str(c.note),
      tree: trees[0] || str(c.tree),
      primary: professionsOf(c, "primary"),
      secondary: professionsOf(c, "secondary"),
      specializations: specializationsOf(c),
    });
  }
  return out;
}

/** A character the form starts with: every menu unchosen, which is a legitimate thing to send. */
export const blankCharacter = () => ({
  faction: "", race: "", classKey: "", ruleset: "", charName: "", note: "",
  tree: "", primary: [], secondary: [], specializations: {},
});

/**
 * The document to POST under `registration`.
 *
 * `slot` is the card's position, renumbered from 1 on every send, so removing the first of three
 * characters cannot leave a gap the authority has to interpret. An empty `characters` array is a
 * legitimate submission — "I have cleared my characters" — and what that means is the authority's
 * to decide (README: the mirror is then DELETED, which is why clearing has to be reachable).
 *
 * An unchosen menu is OMITTED rather than sent as "". The authority whole-replaces, so an omitted
 * note is a cleared note, and a key with an empty string in it is a value nobody chose.
 */
export function buildRegistration(characters, publish = null) {
  const doc = {};
  if (publish?.offered) doc.publish_name = publish.value === true;
  doc.characters = listOf(characters).map((c, i) => {
    const out = { slot: i + 1 };
    if (c.faction) out.faction = c.faction;
    if (c.race) out.race = c.race;
    if (c.classKey) out.class = c.classKey;
    if (c.ruleset) out.ruleset = c.ruleset;
    if (c.charName) out.character_name = c.charName;
    if (c.note) out.note = c.note;
    out.trees = c.tree ? [c.tree] : [];
    const profession = (name, kind) => ({
      profession: name,
      kind,
      specialization: c.specializations?.[name] || null,
    });
    out.professions = [
      ...listOf(c.primary).map((n) => profession(n, "primary")),
      ...listOf(c.secondary).map((n) => profession(n, "secondary")),
    ];
    return out;
  });
  return doc;
}

/**
 * The size of the request the Worker will weigh, in UTF-8 bytes, counted on the same thing it
 * counts: the whole `{registration: …}` body, not the registration alone. readJson counts the
 * stream and never trusts Content-Length, so this is the figure that decides a 413.
 */
export function bodyBytes(registration) {
  return new TextEncoder().encode(JSON.stringify({ registration })).length;
}

/** "1,204 / 8,192 bytes" under the form. */
export function sizeLabel(bytes, limit = MAX_BODY_FALLBACK) {
  return `${bytes.toLocaleString("en-GB")} / ${limit.toLocaleString("en-GB")} bytes`;
}

/** "41 / 300" under a text box. */
export function countLabel(text, limit = MAX_TEXT_FALLBACK) {
  return `${textLength(text).toLocaleString("en-GB")} / ${limit.toLocaleString("en-GB")}`;
}

export const overLimit = (text, limit = MAX_TEXT_FALLBACK) => textLength(text) > Math.max(1, limit);

/**
 * The first free-text value over the Worker's per-value limit, as {index, field, label}, or null.
 *
 * The Worker walks EVERY string in the submission and 413s on the first one over 300, so a member
 * who is over has to be told which box and which character before they press send — a 413 names no
 * field at all.
 */
export function tooLongText(characters, limits = MAX_TEXT_FALLBACK) {
  // Per field, because the two fields do NOT share a limit: Chamberlain takes 48 characters of
  // name and 140 of note. One figure for both would report the wrong number, and for the shorter
  // field it would not report at all.
  const max = asFieldLimits(limits);
  const fields = [["charName", "character name"], ["note", "note"]];
  const list = listOf(characters);
  for (let i = 0; i < list.length; i++) {
    for (const [field, label] of fields) {
      if (overLimit(list[i]?.[field], max[field])) {
        return { index: i, field, label, limit: max[field] };
      }
    }
  }
  return null;
}

/**
 * A reason this cannot be sent yet, or null. Every one of these is a SHAPE or SIZE reason, which
 * is the same division the Worker draws: nothing here is a judgement about the game, and an empty
 * or half-chosen registration is sendable because the authority is the one qualified to refuse it.
 */
export function submitProblem(characters, {
  pending = false, bytes = 0, bodyMax = MAX_BODY_FALLBACK, textLimits = MAX_TEXT_FALLBACK,
} = {}) {
  if (pending) return PENDING_SENTENCE;
  const long = tooLongText(characters, textLimits);
  if (long) {
    // The limit NAMED is the one actually hit, not the Worker's 300: a member told "over 300" when
    // the box takes 48 has been given a number that explains nothing about what to do.
    return `Character ${long.index + 1}'s ${long.label} is over ${long.limit.toLocaleString("en-GB")} `
      + `character${long.limit === 1 ? "" : "s"}. Shorten it and send again.`;
  }
  if (bytes > bodyMax) {
    return `This is ${bytes.toLocaleString("en-GB")} bytes and the most that can be sent in one go is `
      + `${bodyMax.toLocaleString("en-GB")}. Shorten the notes, or remove a character, and send again.`;
  }
  return null;
}

/** A millisecond timestamp as an ISO string for <time>, or null. */
export function msToIso(ms) {
  const n = Number(ms);
  if (!Number.isFinite(n) || n <= 0) return null;
  const date = new Date(n);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

export const pendingTime = (pending) => msToIso(pending?.created_at);

/**
 * What a member is told after a 202 — and the whole point of it is the word QUEUED.
 *
 * The Worker has written a row to a queue Chamberlain polls. The registration has NOT changed, and
 * will not until he claims it, validates it and pushes a new mirror back. A page that said "saved"
 * here would be contradicted by the next reload, and worse, would hide the one outcome a member
 * most needs to know about: a refusal that arrives in Discord rather than on this page.
 */
export function queuedLine() {
  return "Sent, and waiting — it is NOT saved yet. The Chamberlain collects submissions every few "
    + "minutes, checks them against the game's rules, and only then does this become your "
    + "registration. If something in it cannot be, he will say so where you registered. "
    + "Reload this page to see whether it has landed.";
}

/** The sentence above the form when a change is already queued. */
export function pendingLine() {
  return "The Chamberlain hasn't collected it yet, so it is not your registration yet, and a second "
    + "change cannot be sent until he has. That is on purpose: a roster edit is a considered change, "
    + "and a second one arriving while the first is in flight is almost always a double-click or "
    + "another tab. Give it a minute and reload.";
}

/** The line that says what state the member's registration is in, before they touch anything. */
export function standingLine(payload) {
  if (payload?.registered) {
    const iso = msToIso(payload.updated_at);
    return iso
      ? { text: "You are registered. Last change applied ", time: iso, tail: "." }
      : { text: "You are registered.", time: null, tail: "" };
  }
  return {
    text: "You are not registered yet. Fill this in and the Chamberlain will add you — "
      + "nothing is public until he has.",
    time: null,
    tail: "",
  };
}

const detailOf = (err) => {
  const said = str(err?.detail);
  return said && said.length <= 300 ? said : "";
};

/**
 * One plain sentence for any failure of this form. Separate from describeError() because the
 * refusals here are not the forum's, and one of them is not even a failure of the member's.
 *
 * THE 409 IS PRINTED UNALTERED. src/roster.js writes that detail to be shown to a member
 * ("Your last roster change has not been saved yet…") and documents it in the error table for
 * exactly that purpose; re-wording it here would make two copies of a sentence, and a page that
 * rendered the bare `reason` code would show "submission_pending" to a human.
 */
export function describeRosterError(err) {
  const status = err?.status;
  const code = err?.code;
  const reason = err?.reason;
  const said = detailOf(err);
  if (status === 0 || code === "network") {
    return "Couldn't reach the Ossuary. Nothing was sent — check your connection and try again.";
  }
  if (status === 401) return "Your sign-in has run out. Sign in again on the forums, then come back to this page.";
  if (status === 403 && reason === "not_member") {
    return "The roster is for members of the Null Ossuary Discord. Join, finish the welcome, then come back.";
  }
  if (status === 403) return "The Ossuary wouldn't accept that.";
  if (status === 409) return said || PENDING_SENTENCE;
  if (status === 413 || code === "too_large") {
    return "That is more than can be sent in one go. Shorten the notes, or remove a character, and send again.";
  }
  if (status === 400) {
    return said
      ? `The Ossuary couldn't accept that: ${said}`
      : "The Ossuary couldn't read that. Reload the page and try again.";
  }
  if (status === 503 || code === "unavailable") {
    return "The roster form isn't switched on at the moment. Try again later; nothing was sent.";
  }
  if (status === 500) {
    return "Something crossed on the way in. Reload the page: it will say whether a change of yours is already waiting.";
  }
  if (status === 429) return describeError(err);
  return "The Ossuary is having trouble right now. Try again in a minute.";
}

// --- The page -------------------------------------------------------------------------------
//
// The classes are `redit-*`. The read-only roster page's are `rs-*` in css/roster.css, which this
// page does not load: it is a forum-Worker surface and loads css/style.css only, as /intake/,
// /admin/ and forums/** do.

/** A <select> filled from menu items. `value` is selected even if the menu no longer offers it. */
function fillMenu(select, items, value, placeholder) {
  const options = [el("option", { value: "", text: placeholder })];
  let found = false;
  for (const item of items) {
    if (item.value === value) found = true;
    options.push(el("option", { value: item.value, text: item.label, selected: item.value === value }));
  }
  // A stored choice the pick-lists no longer carry is KEPT and marked, not silently dropped: the
  // member registered it, the game data moved, and losing it on a page load would be this page
  // deciding a question that is the authority's.
  if (value && !found) {
    options.push(el("option", { value, text: `${value} (no longer offered)`, selected: true }));
  }
  select.replaceChildren(...options);
  select.value = value || "";
  return select;
}

function menuField(id, label, items, value, placeholder, hint) {
  const select = el("select", { id, name: id });
  fillMenu(select, items, value, placeholder);
  return {
    select,
    root: el("div", { class: "field redit-field" },
      el("label", { for: id, text: label }),
      select,
      hint ? el("p", { class: "redit-hint small muted", text: hint }) : null),
  };
}

/** A text box with the Worker's own limit on it and a live count, so a 413 is never the first news. */
function textField(id, label, value, limit, { textarea = false, hint = "" } = {}) {
  const countId = `${id}-count`;
  const input = textarea
    ? el("textarea", { id, name: id, rows: 2, maxlength: limit, autocomplete: "off", "aria-describedby": countId })
    : el("input", { id, name: id, type: "text", maxlength: limit, autocomplete: "off", "aria-describedby": countId });
  input.value = value || "";
  const counter = el("span", { class: "composer-count", id: countId, "aria-live": "off", text: countLabel(value, limit) });
  const update = () => {
    counter.textContent = countLabel(input.value, limit);
    counter.classList.toggle("over", overLimit(input.value, limit));
  };
  input.addEventListener("input", update);
  return {
    input,
    root: el("div", { class: "field redit-field" },
      el("label", { for: id, text: label }),
      input,
      el("p", { class: "composer-hint small" },
        el("span", { text: hint }),
        counter)),
  };
}

/** A checkbox group of professions. Nothing is capped here — a ceiling is a game rule. */
function professionGroup(idBase, legend, items, chosen, hint, onChange) {
  const boxes = [];
  const rows = items.map((item, i) => {
    const id = `${idBase}-${i}`;
    const box = el("input", { type: "checkbox", id, value: item.value });
    box.checked = chosen.includes(item.value);
    box.addEventListener("change", onChange);
    boxes.push({ box, value: item.value });
    return el("p", { class: "redit-check" }, box, el("label", { for: id, text: item.label }));
  });
  return {
    read: () => boxes.filter((b) => b.box.checked).map((b) => b.value),
    root: items.length
      ? el("fieldset", { class: "redit-group" },
        el("legend", { text: legend }),
        hint ? el("p", { class: "redit-hint small muted", text: hint }) : null,
        ...rows)
      : null,
  };
}

/**
 * One character, as a card. Returns {root, read}.
 *
 * Choosing a faction CLEARS the race, the class and the tree, and choosing a race clears the class
 * and the tree — the rule cogs/roster.py's Draft gives: a character whose member switches faction
 * would otherwise be sent with the race and class of the faction they left, which is three
 * impossible things at once, and the authority would refuse the whole registration with no clue
 * which step was wrong.
 *
 * Exported for the XSS test: every label in here is a string the Chamberlain chose.
 */
export function characterCard(index, character, opts, {
  textLimits = MAX_TEXT_FALLBACK, onChange = () => {}, onRemove = null, slotLabel = "",
} = {}) {
  // Each box gets ITS OWN limit, which is what stops a member typing a name the far side will
  // refuse after the page has already said the submission is on its way.
  const max = asFieldLimits(textLimits);
  const n = index + 1;
  const id = (key) => `redit-c${n}-${key}`;
  const state = { ...blankCharacter(), ...(character || {}) };
  state.primary = [...listOf(state.primary)];
  state.secondary = [...listOf(state.secondary)];
  state.specializations = { ...(state.specializations || {}) };

  const faction = menuField(id("faction"), "Faction", opts.factions, state.faction, "Choose a faction");
  const race = menuField(id("race"), "Race", racesFor(opts, state.faction), state.race, "Choose a race");
  const klass = menuField(id("class"), "Class", classesFor(opts, state.faction, state.race), state.classKey, "Choose a class");
  const tree = menuField(id("tree"), "Talents", treesFor(opts, state.classKey), state.tree,
    state.classKey ? "Undecided" : "Choose a class first",
    "Where you mean to put most of your points. You can change your mind in game.");
  const ruleset = opts.rulesets.length
    ? menuField(id("ruleset"), "Ruleset", opts.rulesets, state.ruleset, "Choose a ruleset",
      "There is no grouping across rulesets, so the roster records it.")
    : null;

  // The jobs the chosen tree says it can cover, read out of `options` and nowhere else. A tree is
  // an INTENT and not a fact about a character (wow_forever.py's Tree), so this is drawn as what
  // the member means to do and is never sent: `roles` is not part of the submission.
  const roles = el("p", { class: "redit-roles small muted" });
  const showRoles = () => {
    const chosen = treesFor(opts, str(klass.select.value)).find((t) => t.value === str(tree.select.value));
    roles.textContent = chosen?.roles?.length ? `Can cover: ${chosen.roles.join(", ")}` : "";
  };
  tree.root.append(roles);

  const name = textField(id("name"), "Character name (optional)", state.charName, max.charName,
    { hint: "Leave it blank if you haven't decided." });
  const note = textField(id("note"), "Note (optional)", state.note, max.note,
    { textarea: true, hint: "One line for the guild — \"happy to heal\", \"levelling slowly\"." });

  const primary = professionGroup(id("primary"), "Primary professions", opts.professions.primary,
    state.primary,
    opts.maxPrimary ? `The Chamberlain allows up to ${opts.maxPrimary}. He checks it, not this page.` : "",
    () => refreshSpecs());
  const secondary = professionGroup(id("secondary"), "Secondary professions", opts.professions.secondary,
    state.secondary, "", () => refreshSpecs());

  // Specializations exist for a few professions only, and the list is rebuilt from `options` as the
  // professions are ticked — a dependent menu driven by the served document, not by knowledge of
  // which professions have one.
  const specs = el("div", { class: "redit-specs" });
  let specMenus = [];
  function refreshSpecs() {
    const chosen = [...primary.read(), ...secondary.read()];
    specMenus = [];
    const fields = [];
    for (const profession of chosen) {
      const items = specializationsFor(opts, profession);
      if (!items.length) continue;
      const field = menuField(id(`spec-${fields.length}`), `${profession} specialization`, items,
        state.specializations[profession] || "", "None yet");
      specMenus.push({ profession, select: field.select });
      fields.push(field.root);
    }
    specs.replaceChildren(...fields);
    onChange();
  }

  const read = () => {
    const specializations = {};
    for (const { profession, select } of specMenus) {
      const value = str(select.value);
      if (value) specializations[profession] = value;
    }
    return {
      faction: str(faction.select.value),
      race: str(race.select.value),
      classKey: str(klass.select.value),
      ruleset: ruleset ? str(ruleset.select.value) : state.ruleset,
      charName: name.input.value,
      note: note.input.value,
      tree: str(tree.select.value),
      primary: primary.read(),
      secondary: secondary.read(),
      specializations,
    };
  };

  faction.select.addEventListener("change", () => {
    state.faction = str(faction.select.value);
    state.race = "";
    state.classKey = "";
    state.tree = "";
    fillMenu(race.select, racesFor(opts, state.faction), "", "Choose a race");
    fillMenu(klass.select, classesFor(opts, state.faction, state.race), "", "Choose a class");
    fillMenu(tree.select, [], "", "Choose a class first");
    showRoles();
    onChange();
  });
  race.select.addEventListener("change", () => {
    state.race = str(race.select.value);
    state.classKey = "";
    state.tree = "";
    fillMenu(klass.select, classesFor(opts, state.faction, state.race), "", "Choose a class");
    fillMenu(tree.select, [], "", "Choose a class first");
    showRoles();
    onChange();
  });
  klass.select.addEventListener("change", () => {
    state.classKey = str(klass.select.value);
    state.tree = "";
    fillMenu(tree.select, treesFor(opts, state.classKey), "", "Undecided");
    showRoles();
    onChange();
  });
  tree.select.addEventListener("change", showRoles);
  for (const node of [tree.select, ruleset?.select, name.input, note.input]) {
    node?.addEventListener(node === name.input || node === note.input ? "input" : "change", onChange);
  }

  showRoles();
  refreshSpecs();

  const remove = onRemove
    ? el("button", { class: "btn btn-ghost btn-sm", type: "button", text: "Remove" })
    : null;
  if (remove) remove.addEventListener("click", () => onRemove(index));

  return {
    read,
    root: el("section", { class: "card redit-character" },
      el("header", { class: "redit-character-head" },
        el("h2", { text: slotLabel ? `${slotLabel} character` : `Character ${n}` }),
        remove),
      el("div", { class: "redit-grid" },
        faction.root, race.root, klass.root, tree.root,
        ruleset ? ruleset.root : null,
        name.root),
      note.root,
      primary.root || secondary.root
        ? el("div", { class: "redit-professions" }, primary.root, secondary.root, specs)
        : null),
  };
}

/** The opt-in to being named. Exported for the XSS test: its words can come from `options`. */
export function publishCard(state) {
  const checkbox = el("input", { type: "checkbox", id: "redit-publish" });
  checkbox.checked = state?.value === true;
  return {
    checkbox,
    root: el("div", { class: "card redit-publish" },
      el("p", { class: "eyebrow", text: "On the public roster" }),
      el("p", { class: "muted", text: state?.help || DEFAULT_PUBLISH_HELP }),
      el("p", { class: "field redit-check" },
        checkbox,
        el("label", { for: "redit-publish", text: state?.label || DEFAULT_PUBLISH_LABEL }))),
  };
}

/** "A change of yours is already waiting", with the time it was sent. */
export function pendingCard(pending) {
  const iso = pendingTime(pending);
  return el("div", { class: "card redit-pending", role: "status" },
    el("p", {},
      el("strong", { text: "A roster change of yours is already waiting." }),
      iso ? el("span", { text: " Sent " }) : null,
      iso ? timeEl(iso) : null,
      el("span", { text: iso ? "." : "" })),
    el("p", { class: "muted small", text: pendingLine() }));
}

/** What replaces the form after a 202. Says QUEUED, and never says saved. */
export function queuedPanel(createdAt) {
  const iso = msToIso(createdAt);
  return el("div", { class: "card redit-queued" },
    el("p", { class: "eyebrow", text: "∅" }),
    el("h2", { text: "Queued, not saved yet" }),
    el("p", {},
      el("span", { text: "Sent" }),
      iso ? el("span", { text: " " }) : null,
      iso ? timeEl(iso) : null,
      el("span", { text: "." })),
    el("p", { text: queuedLine() }),
    el("p", { class: "cta" },
      el("a", { class: "btn btn-primary", href: "/roster/edit/", text: "Reload this page" }),
      el("a", { class: "btn btn-ghost", href: ROSTER, text: "The public roster" })));
}

function gate(title, line, action = "Go to the forums", href = FORUMS) {
  return emptyState(title, line, el("a", { class: "btn btn-primary", href, text: action }));
}

async function main() {
  const ctx = await boot();
  if (!ctx.user) {
    mount(gate("Sign in to register",
      "The roster form is for members of the Null Ossuary Discord. Sign-in happens on the forums — "
      + "it is one Discord session for the whole site — so sign in there, then come back to this page.",
      "Sign in on the forums"));
    return;
  }

  let payload;
  try {
    payload = await ctx.api.roster();
  } catch (err) {
    showStatus(describeRosterError(err));
    if (err?.status === 403 && err.reason === "not_member") {
      mount(gate("Members only",
        "The WoW: Forever roster is for members of the Null Ossuary Discord. Join, finish the welcome, then come back."));
    } else if (err?.status === 401) {
      mount(gate("Your sign-in has run out",
        "Sign in again on the forums, then come back to this page.", "Sign in on the forums"));
    } else {
      mount(gate("Your registration couldn't be loaded", describeRosterError(err), "Back to the forums"));
    }
    return;
  }

  const standing = standingLine(payload);
  const head = el("header", { class: "board-head" },
    el("div", {},
      el("p", { class: "eyebrow", text: "WoW: Forever" }),
      el("h1", { text: "Your roster registration" }),
      el("p", { class: "muted" },
        el("span", { text: standing.text }),
        standing.time ? timeEl(standing.time) : null,
        el("span", { text: standing.tail }))));

  // The pick-lists are not published. An honest, recoverable state and not an error: the Worker
  // answered 200 and there is nothing wrong with the member's registration.
  const problem = optionsProblem(payload);
  if (problem) {
    mount(head,
      payload.pending ? pendingCard(payload.pending) : null,
      emptyState("The choices aren't published yet", problem,
        el("a", { class: "btn btn-primary", href: "/roster/edit/", text: "Try again" }),
        el("a", { class: "btn btn-ghost", href: ROSTER, text: "The public roster" })));
    return;
  }

  const opts = normalizeOptions(payload.options);
  // The Worker's ceiling, and the tighter per-field figures Chamberlain publishes inside it.
  const textLimits = fieldLimits(payload);
  const bodyMax = bodyLimit(payload);
  const publish = publishNameState(payload);
  const pending = Boolean(payload.pending);

  const existing = readCharacters(payload.registration, opts.maxCharacters);
  let characters = existing.length ? existing : [blankCharacter()];

  const cards = el("div", { class: "redit-characters" });
  const add = el("button", { class: "btn btn-ghost btn-sm", type: "button", text: "Add a character" });
  const clear = el("button", { class: "btn btn-ghost btn-sm", type: "button", text: "Remove every character" });
  const meter = el("span", { class: "composer-count", "aria-live": "off" });
  // Sending no characters at all is a legitimate submission — the authority DELETES the mirror for
  // it (README) — so it has to be reachable, and it has to be said out loud before it is sent.
  const clearNote = el("p", { class: "redit-clearing", role: "status", hidden: true,
    text: "There are no characters here. Sending this CLEARS your registration: you will be taken "
      + "off the roster entirely until you register again." });
  const send = el("button", {
    class: "btn btn-primary", type: "submit",
    text: payload.registered ? "Send my changes" : "Send my registration",
  });
  const status = el("p", { class: "form-status small", role: "status", "aria-live": "polite" });

  let views = [];
  const current = () => views.map((v) => v.read());

  function refresh() {
    const doc = buildRegistration(current(), publish.offered ? { ...publish, value: publishBox.checked } : null);
    const bytes = bodyBytes(doc);
    meter.textContent = sizeLabel(bytes, bodyMax);
    meter.classList.toggle("over", bytes > bodyMax);
    add.disabled = views.length >= opts.maxCharacters;
    clear.disabled = views.length === 0;
    clearNote.hidden = views.length > 0;
    send.disabled = pending;
  }

  function render(next) {
    characters = next;
    views = characters.map((c, i) => characterCard(i, c, opts, {
      textLimits,
      onChange: refresh,
      slotLabel: opts.slots.find((s) => s.slot === i + 1)?.label || "",
      onRemove: (index) => {
        const kept = current().filter((_, n) => n !== index);
        render(kept);
      },
    }));
    cards.replaceChildren(...views.map((v) => v.root));
    refresh();
  }

  const { root: publishBlock, checkbox: publishBox } = publishCard(publish);
  publishBox.addEventListener("change", refresh);

  add.addEventListener("click", () => render([...current(), blankCharacter()]));
  clear.addEventListener("click", () => render([]));

  const form = el("form", { class: "card form redit-form", novalidate: true },
    el("p", { class: "muted small", text: opts.countStated
      ? `Up to ${opts.maxCharacters} character${opts.maxCharacters === 1 ? "" : "s"}. `
        + "Everything except the faction, race and class is optional."
      : "The Chamberlain didn't say how many characters you may register, so this page doesn't "
        + "guess — add what you mean to play and he will tell you if it is too many." }),
    cards,
    clearNote,
    el("div", { class: "form-row redit-actions" }, add, clear),
    publish.offered ? publishBlock : null,
    el("div", { class: "form-row redit-send" },
      send,
      el("a", { class: "btn btn-ghost", href: ROSTER, text: "The public roster" }),
      el("span", { class: "composer-hint small redit-size" },
        el("span", { text: "Everything you send, measured as the Ossuary measures it: " }),
        meter)),
    status);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const built = current();
    const doc = buildRegistration(built, publish.offered ? { ...publish, value: publishBox.checked } : null);
    const problemNow = submitProblem(built, {
      pending, bytes: bodyBytes(doc), bodyMax, textLimits,
    });
    if (problemNow) {
      status.textContent = problemNow;
      return;
    }
    send.disabled = true;
    status.textContent = "Sending…";
    let result;
    try {
      result = await ctx.api.submitRoster(doc);
    } catch (err) {
      status.textContent = describeRosterError(err);
      // A 409 means a change of theirs is in flight after all: a second send would be refused too.
      send.disabled = err?.status === 409;
      return;
    }
    showStatus("");
    mount(head, queuedPanel(result?.created_at));
    window.scrollTo({ top: 0 });
  });

  render(characters);
  if (pending) status.textContent = PENDING_SENTENCE;
  mount(head, pending ? pendingCard(payload.pending) : null, form);
}

// Guarded so `node --test tests/` can import everything above it. A browser always has a document.
if (typeof document !== "undefined") {
  main().catch(() => {
    showStatus("Something went wrong loading your roster registration.");
  });
}
