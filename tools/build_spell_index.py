#!/usr/bin/env python3
"""Resolve the guides' [[ability chips]] against the WoW: Forever client, and fetch their icons.

The guides mark abilities, spells and items as [[Chip Name]]. This turns those names into
real client data -- spell/item id, the level you learn it, and an icon -- so build_guides.py
can render each chip as a link with its art instead of a styled span.

    python3 tools/build_spell_index.py            # rebuild if the client build moved, else no-op
    python3 tools/build_spell_index.py --status   # report and change nothing
    python3 tools/build_spell_index.py --force    # rebuild an unchanged index

WHERE THE DATA COMES FROM. wago.tools reads the retail/classic CASC and exposes each DB2
table as CSV. Forever ships under the product label `wow_cn_beta` -- NOT one of the
`wow_classic*` labels, which is the single least guessable fact in this file. The guides'
other client-sourced readings come through foreverchanges.pro, which reads the same place.

THE RANK PROBLEM is the reason this is not a dictionary lookup. 336 of 433 chip names map
to more than one spell id, because every rank is its own spell -- `Shadow Bolt` has 77.
Rows whose BaseLevel is 0 are NPC/tooltip/internal variants, not something a player trains.
Filtering those out and taking the lowest remaining level reproduces the guides' own prose:
Holy Strike 6, Consecration 20. If that rule ever changes, the spot-checks in VERIFY below
are what catch it.

ICON ART is Blizzard's, used under their Fan Content Policy (owner's decision, 2026-10-07).
It is converted to WebP and committed, never hotlinked: the guide pages ship img-src 'self',
so a remote icon would be blocked by our own CSP even if we wanted one.

This file writes two things and owns both:
    guides/_data/spells.json      build-time input for build_guides.py, never served
                                  (no .nojekyll here, so _underscore paths 404 on Pages)
    assets/spell-icons/<fdid>.webp   served art, one file per distinct icon
"""
from __future__ import annotations

import argparse
import csv
import hashlib
import io
import json
import re
import sys
import urllib.error
import urllib.request
from collections import defaultdict
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "guides" / "_src"
DATA = ROOT / "guides" / "_data" / "spells.json"
ICONS = ROOT / "assets" / "spell-icons"

PRODUCT = "wow_cn_beta"  # Forever. See module docstring -- not a wow_classic* label.
API = "https://wago.tools"
TABLES = ("SpellName", "SpellMisc", "SpellLevels", "SkillLineAbility", "ItemSparse",
          "Item", "Talent", "Spell", "SpellEffect", "SpellCastTimes", "SpellPower",
          "SpellRange", "SpellCooldowns", "SpellDuration", "SpellRadius",
          "SpellAuraOptions", "SpellTargetRestrictions")

# Spot-checks against the guides' own prose. A rank rule that breaks these is wrong.
# These are not decoration: the first rule tried here (lowest non-zero BaseLevel) put
# Consecration at level 1, because Forever ships a second id family for it that includes
# a level-1 row no Paladin can train. These caught that before it reached a page.
VERIFY = {"Holy Strike": 6, "Consecration": 20, "Ice Lance": 20, "Shadow Bolt": 1}

# The same idea applied to the description resolver. A tooltip that quietly prints a
# wrong number is worse than one that prints nothing, so a resolved description has to
# reproduce a figure the guides already state in prose. Holy Strike is "25% of weapon
# damage at the rank you train at 6" on paladin-retribution.md.
#
# One entry per token form the resolver understands, each naming a spell where the
# rendered sentence can be checked against something outside the client: a figure the
# guides state in prose, or a value the sentence makes self-evident. There is no
# authoritative documentation for this templating language -- every reading below is an
# inference from data, and these are what catch a wrong inference before it ships.
VERIFY_DESC = {
    "Holy Strike": "25",                       # $mN   paladin-retribution.md: 25% weapon damage
    "Shadow Word: Pain": "over 18 sec",        # $oN   30 damage over 18 sec, rank 1 to the letter
    "Fireball": "2 Fire damage over 4 sec",    # $oN   rank 1's own "additional 2 over 4 sec"
    "Bloodrage": "10 rage",                    # $/N;  rage is stored x10: 100 -> 10
    "Battle Shout": "20 yards",                # $aN   radius index 9 is 20.0 yd
    "Drain Life": "every 1 second",            # $tN   the template's own singular "second"
    "Blessing of Wisdom": "every 5 seconds",   # $tN   5000 ms period
    "Multi-Shot": "3 targets",                 # $xN   EffectChainTargets 3
    "Rebirth": "700",                          # $qN   400 health / 700 mana, rank 1 to the letter
    "Holy Shield": "4 charges",                # $n    ProcCharges 4, and 4 blocks is rank 1
    "Blackout": "2%",                          # $h    ProcChance ladder 2/4/6/8 across the ranks
    "Thunder Clap": "up to 4 targets",         # $i    MaxTargets 4
    "Frostbite": "Freeze the target for 5 sec",  # $<id>d  the freeze aura's own 5000 ms
    "Improved Counterspell": "4 sec",          # ${}   mage-arcane.md: "rank 2 for 4" seconds
    "Soul Siphon": "36",                       # ${}   warlock-affliction.md: "up to 36%"
    "Distract": "1 level lower",               # $l..; singular, because the number is 1
    "Improved Distract": "2 levels",           # $l..; plural, because the number is 2
}

# Two spells whose template resolves to a figure the guides directly contradict. Both
# read $sN/$mN off an effect whose aura is the engine's dummy (4) and whose base points
# are a flag rather than a measurement -- Flurry's rank row carries 1 where the buff it
# applies carries 30, and Forever's own Flurry row 15088 proves it by shipping a
# hardcoded "by 30%" against the same base points of 1. A general rule for this does not
# exist: Anger Management ("Generates 1 Rage every 3 sec", warrior-arms.md) and Magic
# Absorption ("restore 1% of your total mana") read the same shape and are correct. So
# these are named, with their evidence, rather than guessed at by a heuristic.
DESC_WRONG = {
    "Flurry": "warrior-fury.md: 25% total attack speed (30% before the nerf), not 1%",
    "Shatter": "mage-frost.md: 50% crit at 3/3, so rank 1 is ~17%, not 1%",
    # The other direction of the same defect: base points of 100 where the sentence makes
    # 100 absurd on its own terms. Forever ships ONE spell row per talent and the ranks
    # the guides list (mage-arcane.md walks Arcane Concentration 1 to 5) are nowhere in
    # it, so the figure is a placeholder, not rank 5's reading. 100 is a real percentage
    # elsewhere -- Moonkin Form "doubles your Omen of Clarity proc rate" (druid.md) is
    # base points of 100 and correct -- which is why these are named, not filtered.
    "Arcane Concentration": "a 100% chance of Clearcasting would make every mage spell free",
    "Naturalist": "its own rank-1 cast-time cut of 0.1 sec against +100% to all damage",
}

# SkillRaceClassInfo.ClassMask, the only table that says which CLASS a skill line
# belongs to. Needed because the display names collide: skill lines 257 and 267 are
# BOTH called "Protection" -- Warrior's and Paladin's. Resolving a chip by name alone
# is what made every guide that mentions `Deflection` link to the WARRIOR's copy,
# including the Hunter and Paladin pages (reported by a reader, 2026-10-07).
CLASS_BY_MASK = {1: "warrior", 2: "paladin", 4: "hunter", 8: "rogue", 16: "priest",
                 64: "shaman", 128: "mage", 256: "warlock", 1024: "druid"}

# A chip on a class's page must resolve to THAT class's spell. Verified against the
# reported failure: `Deflection` is a talent in four trees at once.
# The guides discuss a maxed talent ("`Shield Specialization` 5/5 returns 5 Rage per
# block") while the client's row is rank 1, so a reader saw "5/5" in the prose and "1%"
# in the tooltip and reasonably concluded one was wrong (reported 2026-10-07).
#
# THE FIX IS TO LABEL THE RANK, NOT TO SHOW A HIGHER ONE. Resolving to max rank was
# tried and is wrong here: these are levelling guides capped at level 30, and a spell's
# higher ranks are level-gated content a reader cannot have. The assertions caught it --
# Holy Shield's max rank deals 221 damage where paladin-protection.md says 110, because
# 110 is the rank that exists at the cap. So the shown rank is unchanged and now says
# which rank it is; where the client records no rank, it stays silent.
RANK_RE = re.compile(r"^Rank (\d+)$")

VERIFY_CLASS = {("Deflection", "hunter"): 19295, ("Deflection", "paladin"): 20060,
                ("Deflection", "warrior"): 16462, ("Deflection", "rogue"): 13713,
                # Five per-class copies sharing racial skill line 753, told apart only
                # by SkillLineAbility.ClassMask. Before that column was read, every
                # class resolved to the rogue's copy and a Mage page described Energy.
                ("Eureka!", "mage"): 1259817, ("Eureka!", "warrior"): 1259813,
                ("Eureka!", "rogue"): 1259812, ("Eureka!", "priest"): 1259823,
                ("Eureka!", "warlock"): 1259821}

# WHERE THE NAME IS AMBIGUOUS AND THE TABLES CANNOT SETTLE IT. Rank and trainable level
# pick between same-named rows; neither knows which row carries the CURRENT text. Each
# id below was read out of build 1.60.1.70245 by hand and matches what the guides say.
#
# `Hack and Slash` is the clearest case: Forever renamed the three old weapon-spec slots
# to that one name and applied the merge to only one of them, so the client holds three
# spells called `Hack and Slash` and the merged tooltip -- axe/sword extra attack, dagger
# /fist crit, mace armour ignore -- is on 13960 alone. 13706 is the ex-Dagger slot and
# describes a fraction of the talent. The others resolved to an empty row, a creature's
# ability, or a differently-named spell's record (all found 2026-10-08).
FORCE_ID: dict[object, int] = {
    "Hack and Slash": 13960,          # merged row; 13706 is the ex-Dagger slot
    "Quietus": 1310728,               # 1231651 is a collision, not placeholder junk
    "Cutthroat": 462708,              # 424980 carries no usable text
    ("Berserk", "druid"): 417141,     # 23397 is a creature's 30-second Shadow aura
    ("Lacerate", "druid"): 414644,    # 414647 is empty and stamped level 1
    # 53672 is the WRATH-ERA talent and it was winning on id order: "next Flash of
    # Light by 0.75 sec OR next Holy Light crit by 10%". Forever's own 426065 reads
    # "Holy Shock AND Flash of Light crits reduce your next Holy Light cast", which is
    # what paladin-holy.md says. A provenance audit read the stale record and reported
    # the PAGE as wrong; the page was right and the tooltip beside it was not.
    "Infusion of Light": 426065,
    # 48108 is the WOTLK talent and it names Living Bomb, a spell Forever does not
    # have. Forever's 400624 reads the way Blizzard's own dive describes it: a
    # non-periodic Fire crit shortening the next Pyroblast.
    "Hot Streak": 400624,
}
# HOW THESE WERE FOUND, so the next one is cheaper: Classic's spell ids run below
# roughly 30,000 and Forever's own authored content sits above 400,000, so a name
# resolving to anything in between is usually a later expansion's copy of the same
# name. Three of the four defects above were caught by that one filter. It is worth
# re-running after any build bump:
#   chosen id in 30k..400k, while a >400k candidate with a description exists.

SCHOOLS = {1: "Physical", 2: "Holy", 4: "Fire", 8: "Nature",
           16: "Frost", 32: "Shadow", 64: "Arcane"}

# Blizzard's tooltip templating, as far as this file reads it. An optional spell id in
# front of the letter means "that spell's", not this one's, and an omitted trailing index
# means effect 1. Anything still carrying a $ after the passes below is NOT shown: a
# half-resolved string on a public page is the failure this guards against.
#
#   per effect     $sN $mN $MN $SN base points   $oN total over the duration
#                  $aN radius      $tN tick period   $xN chain targets   $qN misc value
#   per spell      $d duration  $n proc charges  $h proc chance  $i max targets
#   directives     ${...} arithmetic   $/N;<ref> divide   $lone:many;   $gmale:female;
#                  ${...}.N -- print the expression to N decimal places
#
# Left deliberately unresolved, each for a reason in resolve_desc: $?...[a][b] (runtime
# state), $@spelldesc<id> (another tooltip), $<mult> and friends (named client variables),
# $b $bh $bc $rap $AP (spell-power and attack-power scaling), $u $e $z $c $r $p (one or
# two spells each, and no value to check them against).
EFFECT_TOKENS = "smMSoatxq"   # $<letter>N -- indexed on one of the spell's effects
SPELL_TOKENS = "dnhi"         # $<letter>  -- a property of the whole spell, never indexed
DUMMY_AURA = 4               # the engine's scripted-talent aura; its base points are a flag

TOKEN_RE = re.compile(r"""\$(?:
      \{[^{}]*\}(?:\.\d)?          # ${ $m1*3 } -- arithmetic, optionally to N decimals
    | /\d+;\d*[a-zA-Z]\d*          # $/1000;S1 -- divide the reference that follows
    | [lL][^:;$\s]*:[^;$]*;        # $lpoint:points; -- singular:plural
    | g[^:;$\s]*:[^;$]*;           # $ghis:her; -- male:female
    | <[^>]*>                      # $<mult> -- a named client variable
    | \d*[a-zA-Z]\d*               # $s1  $m2  $12536s1  $d  $n
)""", re.X)

# $lone:many; is settled after the numbers are in, because which form is right depends on
# the number that ends up in front of it.
PLURAL_RE = re.compile(r"\$[lL]([^:;$\s]*):([^;$]*);")

CHIP_RE = re.compile(r"\[\[([^\]]+)\]\]")
TICK_RE = re.compile(r"`([^`]+)`")
csv.field_size_limit(10_000_000)


def verdict(line: str) -> None:
    """Print the closing line a routine is judged by (AI-Infra DR-0093), then exit."""
    print(f"spell-index: {line}")
    sys.exit(0)


def fetch(url: str, timeout: int = 300) -> bytes:
    req = urllib.request.Request(url, headers={"User-Agent": "nossuary-spell-index/1.0"})
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return r.read()


def latest_build() -> str:
    builds = json.loads(fetch(f"{API}/api/builds", timeout=60))
    if PRODUCT not in builds or not builds[PRODUCT]:
        raise RuntimeError(f"wago.tools lists no builds for product {PRODUCT!r}")
    return builds[PRODUCT][0]["version"]


def table(name: str, build: str) -> list[dict]:
    raw = fetch(f"{API}/db2/{name}/csv?build={build}").decode("utf-8", "replace")
    return list(csv.DictReader(io.StringIO(raw)))


def norm(s: str) -> str:
    return re.sub(r"\s+", " ", s.strip().lower())


def number(row: dict, field: str) -> float:
    """One DB2 column as a float. A missing or unparseable column reads as 0."""
    try:
        return float(row.get(field) or 0)
    except (ValueError, TypeError):
        return 0.0


def chips() -> tuple[dict[str, int], set[str]]:
    """Every name the guides mark up, with how often, and which are written as talents.

    The sources mark two populations and mean different things by them: `[[Holy Strike]]`
    is an ability, `` `Reverence` `` is a talent. They are comparable in size -- 433 chips
    against 530 backtick terms -- and the distinction is deliberate, so it is carried
    through to the label rather than flattened. The client cannot make it for us: a talent
    IS a spell in SpellName, so asking the client would call every talent a spell.

    A name used both ways is treated as an ability; the chip form is the stronger signal.
    """
    counts: dict[str, int] = defaultdict(int)
    chip_names: set[str] = set()
    tick_names: set[str] = set()
    for md in sorted(SRC.glob("*.md")):
        text = md.read_text(encoding="utf-8")
        for m in CHIP_RE.finditer(text):
            name = m.group(1).strip()
            counts[name] += 1
            chip_names.add(name)
        for m in TICK_RE.finditer(text):
            name = m.group(1).strip()
            counts[name] += 1
            tick_names.add(name)
    return dict(counts), tick_names - chip_names


def load_details(build: str) -> dict:
    """Everything a tooltip shows beyond name and icon, keyed for lookup by spell id."""
    # Radii are indirected the same way durations and cast times are: the effect holds an
    # index into SpellRadius, not a number of yards.
    radius_of: dict[int, float] = {}
    for r in table("SpellRadius", build):
        try:
            radius_of[int(r["ID"])] = float(r["Radius"] or 0)
        except (ValueError, TypeError, KeyError):
            continue

    # Per effect, every field a $ token can read. Base points alone were enough while the
    # resolver only understood $sN; $oN needs the tick period, $aN the radius.
    effects: dict[int, dict[int, dict]] = defaultdict(dict)
    for r in table("SpellEffect", build):
        try:
            sid, idx = int(r["SpellID"]), int(r["EffectIndex"])
        except (ValueError, TypeError, KeyError):
            continue

        effects[sid][idx] = {
            "base": number(r, "EffectBasePointsF"),
            "aura": int(number(r, "EffectAura")),
            "period": number(r, "EffectAuraPeriod"),
            "radius": radius_of.get(int(number(r, "EffectRadiusIndex_0")), 0.0),
            "chain": int(number(r, "EffectChainTargets")),
            "misc": int(number(r, "EffectMiscValue_0")),
        }

    # Charges and proc chance are per spell, not per effect, and live on their own table.
    charges: dict[int, int] = {}
    chance: dict[int, int] = {}
    for r in table("SpellAuraOptions", build):
        try:
            sid = int(r["SpellID"])
        except (ValueError, TypeError, KeyError):
            continue
        if sid not in charges:
            charges[sid] = int(number(r, "ProcCharges"))
            chance[sid] = int(number(r, "ProcChance"))

    targets: dict[int, int] = {}
    for r in table("SpellTargetRestrictions", build):
        try:
            sid = int(r["SpellID"])
        except (ValueError, TypeError, KeyError):
            continue
        targets.setdefault(sid, int(number(r, "MaxTargets")))

    desc: dict[int, str] = {}
    for r in table("Spell", build):
        try:
            sid = int(r["ID"])
        except (ValueError, TypeError, KeyError):
            continue
        d = (r.get("Description_lang") or "").strip()
        if d:
            desc[sid] = d

    cast_ms = {int(r["ID"]): float(r["Base"] or 0)
               for r in table("SpellCastTimes", build) if r.get("ID", "").isdigit()}
    dur_ms = {int(r["ID"]): float(r["Duration"] or 0)
              for r in table("SpellDuration", build) if r.get("ID", "").isdigit()}
    rng: dict[int, float] = {}
    for r in table("SpellRange", build):
        if r.get("ID", "").isdigit():
            try:
                rng[int(r["ID"])] = max(float(r.get("RangeMax_0") or 0),
                                        float(r.get("RangeMax_1") or 0))
            except (ValueError, TypeError):
                continue

    cost: dict[int, int] = {}
    for r in table("SpellPower", build):
        try:
            sid, mana = int(r["SpellID"]), int(float(r.get("ManaCost") or 0))
        except (ValueError, TypeError, KeyError):
            continue
        if mana > 0:
            cost.setdefault(sid, mana)

    cd: dict[int, float] = {}
    for r in table("SpellCooldowns", build):
        try:
            sid = int(r["SpellID"])
            ms = max(float(r.get("RecoveryTime") or 0),
                     float(r.get("CategoryRecoveryTime") or 0))
        except (ValueError, TypeError, KeyError):
            continue
        if ms > 0:
            cd.setdefault(sid, ms)

    misc: dict[int, dict] = {}
    for r in table("SpellMisc", build):
        try:
            sid = int(r["SpellID"])
        except (ValueError, TypeError, KeyError):
            continue
        misc.setdefault(sid, {
            "cast": cast_ms.get(int(r.get("CastingTimeIndex") or 0), 0.0),
            "dur": dur_ms.get(int(r.get("DurationIndex") or 0), 0.0),
            "rng": rng.get(int(r.get("RangeIndex") or 0), 0.0),
            "school": int(r.get("SchoolMask") or 0),
        })

    return {"effects": effects, "desc": desc, "cost": cost, "cd": cd, "misc": misc,
            "charges": charges, "chance": chance, "targets": targets}


def secs(ms: float) -> str:
    return f"{ms / 1000:g}"


def figure(v: float) -> str:
    """One resolved number as a tooltip prints it, with -0.0 normalised away."""
    v = round(v, 4)
    return f"{v if v else 0.0:g}"


def arithmetic(expr: str) -> float | None:
    """Compute a fully-substituted ${...} body, or None if it is not pure arithmetic.

    Parsed and computed, never eval()'d: the body is client data, and nothing here is
    worth handing an expression evaluator the whole interpreter for.
    """
    toks = [t for t in re.findall(r"\d+\.\d+|\d+|[-+*/()]|.", expr) if not t.isspace()]
    if not toks or any(not (re.fullmatch(r"\d+(?:\.\d+)?", t) or t in "+-*/()")
                       for t in toks):
        return None
    at = 0

    def peek() -> str | None:
        return toks[at] if at < len(toks) else None

    def expression() -> float | None:
        nonlocal at
        v = term()
        while v is not None and peek() in ("+", "-"):
            op = toks[at]
            at += 1
            r = term()
            if r is None:
                return None
            v = v + r if op == "+" else v - r
        return v

    def term() -> float | None:
        nonlocal at
        v = unary()
        while v is not None and peek() in ("*", "/"):
            op = toks[at]
            at += 1
            r = unary()
            if r is None or (op == "/" and r == 0):
                return None
            v = v * r if op == "*" else v / r
        return v

    def unary() -> float | None:
        nonlocal at
        if peek() in ("+", "-"):
            neg = toks[at] == "-"
            at += 1
            v = unary()
            return None if v is None else (-v if neg else v)
        if peek() == "(":
            at += 1
            v = expression()
            if v is None or peek() != ")":
                return None
            at += 1
            return v
        if peek() is not None and re.fullmatch(r"\d+(?:\.\d+)?", toks[at]):
            at += 1
            return float(toks[at - 1])
        return None

    v = expression()
    return None if v is None or at != len(toks) else v


def resolve_desc(sid: int, d: dict) -> str | None:
    """Render one spell's description, or None if any token is left unresolved.

    Blizzard's tooltip strings are templates: `$m2% weapon damage plus $s1 as Holy damage`.
    TOKEN_RE above lists the forms this reads and the forms it declines. It resolves what
    it can check and REFUSES the rest -- a tooltip reading "deals $s1 damage" on a live
    page is worse than a tooltip with no description, so a string that still contains a $
    after substitution is dropped, and so is one whose numbers would have to be guessed.

    Durations render in seconds, matching the duration row present() builds from the same
    field, so a tooltip never states a length two ways.
    """
    text = d["desc"].get(sid)
    if not text:
        return None

    def duration(spell: int) -> float | None:
        """A spell's duration in ms, or None when the field is not a length.

        -1 is the client's "lasts until cancelled" and 0 is "no duration row". Dividing
        the first by 1000 is how "-0.001 sec" reached 50 entries of the stat block
        (see present()); in prose it has no sensible rendering at all, so a $d on such a
        spell takes the whole description down with it rather than inventing wording.
        """
        ms = d["misc"].get(spell, {}).get("dur", 0.0)
        return None if ms <= 0 else ms

    def effect_value(spell: int, letter: str, n: int, signed: bool) -> float | None:
        e = d["effects"].get(spell, {}).get(n - 1)
        if e is None:
            return None
        if letter in "smMS":
            # 0 and "no such field" are the same byte in the CSV, and every description
            # that resolved a 0 here read as nonsense -- "a 0% chance to gain an extra
            # attack" (Reckoning), "Increases your dodge chance by 0%" (Natural Reaction).
            # Eight of those were live before this guard.
            if not e["base"]:
                return None
            return e["base"] if signed else abs(e["base"])
        if letter == "o":
            # The total a periodic effect deals over its whole duration: one tick's base
            # points times however many ticks fit. Bloodrage checks it exactly -- base 10
            # on a 1000 ms period over 10000 ms is 100, which its $/10; prefix prints as
            # the 10 rage it has always generated.
            ms = duration(spell)
            if not e["base"] or not e["period"] or ms is None:
                return None
            return abs(e["base"]) * (ms / e["period"])
        if letter == "a":
            return e["radius"] or None
        if letter == "t":
            return e["period"] / 1000.0 if e["period"] else None
        if letter == "x":
            return e["chain"] or None
        if letter == "q":
            return e["misc"] or None
        return None

    def spell_value(spell: int, letter: str) -> float | None:
        if letter == "d":
            ms = duration(spell)
            return None if ms is None else ms / 1000.0
        if letter == "n":
            return d["charges"].get(spell) or None
        if letter == "h":
            # 100 is the table's default, carried by every spell that has no chance of its
            # own, so it is not a readable percentage. The real ladders are small and
            # explicit: Blackout's ranks hold 2/4/6/8 and its fifth rank switches to $m1
            # with base points of 10, which is where this reading was confirmed.
            v = d["chance"].get(spell, 0)
            return v if 0 < v < 100 else None
        if letter == "i":
            return d["targets"].get(spell) or None
        return None

    def reference(tok: str, signed: bool = False) -> float | None:
        """The number behind one $[<id>]<letter>[N] token, or None if it is not readable."""
        m = re.fullmatch(r"\$(\d*)([a-zA-Z])(\d*)", tok)
        if not m:
            return None
        spell = int(m.group(1)) if m.group(1) else sid
        letter, idx = m.group(2), m.group(3)
        if letter in EFFECT_TOKENS:
            return effect_value(spell, letter, int(idx) if idx else 1, signed)
        if letter in SPELL_TOKENS and not idx:
            return spell_value(spell, letter)
        return None

    def one(m: re.Match) -> str:
        tok = m.group(0)

        expr = re.fullmatch(r"\$\{([^{}]*)\}(?:\.(\d))?", tok)
        if expr:
            # Signed values inside the braces: the template writes the sign into the
            # expression, so ${$m2/-1000} over base points of -30000 is the 30 second
            # cooldown cut Brutal Impact states, and abs() first would print -30.
            inner = TOKEN_RE.sub(one_signed, expr.group(1))
            if "$" in inner:
                return tok
            v = arithmetic(inner)
            # A negative result means the sign convention is not the one assumed here.
            # That is a guess rather than a reading, so it is left to drop the string.
            if v is None or v < 0:
                return tok
            # A trailing .N is a precision directive, not text. Printing it literally is
            # how seventeen templates read "0.1.1 sec"; Improved Healing Wave's -100 base
            # points over /-1000 is the 0.1 sec it has always cut, and Infusion of Light's
            # -750 is 0.75 -- one tagged .1 and the other .2, which is the whole proof.
            dp = expr.group(2)
            return f"{v:.{int(dp)}f}" if dp else figure(v)

        div = re.fullmatch(r"\$/(\d+);(\d*[a-zA-Z]\d*)", tok)
        if div:
            # $/1000;S1 -- the client stores milliseconds, tenths of rage and tenths of a
            # percent, and divides on the way out. Bane's -500 is the 0.5 sec it states.
            n, v = int(div.group(1)), reference("$" + div.group(2))
            return tok if not n or v is None else figure(abs(v) / n)

        gender = re.fullmatch(r"\$g([^:;$\s]*):([^;$]*);", tok)
        if gender:
            # The reader's own character decides this at runtime and a build cannot know
            # it. The first form -- he/his/himself -- is taken, uniformly.
            return gender.group(1)

        if PLURAL_RE.fullmatch(tok):
            return tok  # settled below, once the number in front of it is known

        v = reference(tok)
        if v is None:
            return tok
        if re.fullmatch(r"\$\d*d", tok):
            return f"{secs(v * 1000)} sec"
        return figure(v)

    def one_signed(m: re.Match) -> str:
        tok = m.group(0)
        if TOKEN_RE.fullmatch(tok) and re.fullmatch(r"\$\d*[a-zA-Z]\d*", tok):
            v = reference(tok, signed=True)
            return tok if v is None else figure(v)
        return one(m)

    out = TOKEN_RE.sub(one, text)
    # One more pass: ${$1280345m1*8} style arithmetic resolves only once its inner
    # references have. Anything still holding a $ is abandoned rather than guessed at.
    out = TOKEN_RE.sub(one, out)

    def plural(m: re.Match) -> str:
        """Pick the form the number in front of the directive calls for.

        Checked on a matched pair: Distract reduces detection "as if they were 1 level
        lower" and Improved Distract by "an additional 2 levels lower", from the same
        ${$m2/-5} over base points of -5 and -10.
        """
        before = re.search(r"(\d+(?:\.\d+)?)\s*$", m.string[:m.start()])
        if before is None:
            return m.group(0)  # nothing to agree with; let the $ drop the description
        return m.group(1) if float(before.group(1)) == 1 else m.group(2)

    out = PLURAL_RE.sub(plural, out)
    if "$" in out:
        return None
    # Client colour escapes: |cAARRGGBB ... |r, and |n for a line break. Blizzard uses
    # them to label the branches of a multi-weapon tooltip, so the one talent that needs
    # them most is `Hack and Slash` -- whose merged row published a literal
    # "|CFFFFFFFFAxe/Sword:|R" onto two Rogue pages until this stripped them.
    out = re.sub(r"\|[cC][0-9a-fA-F]{8}", "", out)
    out = re.sub(r"\|[rR]", "", out)
    out = re.sub(r"\|n", " ", out)
    return " ".join(out.split())


def present(sid: int, d: dict) -> dict:
    """The display strings a tooltip shows. Absent facts are simply absent."""
    m = d["misc"].get(sid, {})
    out: dict[str, str] = {}
    if m:
        cast = m.get("cast", 0.0)
        out["cast"] = "Instant" if not cast else f"{secs(cast)} sec cast"
        if m.get("rng"):
            r = m["rng"]
            out["range"] = "Melee" if r <= 5 else f"{r:g} yd range"
        dur = m.get("dur", 0.0)
        if dur < 0:
            # The client stores -1 for "lasts until you cancel it" -- every aura, form
            # and aspect. Dividing that by 1000 published "-0.001 sec" on 50 entries.
            out["duration"] = "Until cancelled"
        elif dur > 0:
            out["duration"] = f"{secs(dur)} sec"
        school = SCHOOLS.get(m.get("school", 0))
        if school:
            out["school"] = school
    if sid in d["cost"]:
        out["cost"] = f"{d['cost'][sid]} Mana"
    if sid in d["cd"]:
        out["cooldown"] = f"{secs(d['cd'][sid])} sec cooldown"
    desc = resolve_desc(sid, d)
    if desc:
        out["desc"] = desc
    return out


def resolve(names: dict[str, int], talents: set[str], build: str) -> tuple[dict, dict]:
    """Map each marked-up name to one client record. Returns (entries, report)."""
    spell_ids: dict[str, list[int]] = defaultdict(list)
    spell_name_of: dict[int, str] = {}
    for r in table("SpellName", build):
        if r.get("Name_lang"):
            sid = int(r["ID"])
            spell_ids[norm(r["Name_lang"])].append(sid)
            spell_name_of[sid] = r["Name_lang"]

    item_ids: dict[str, list[int]] = defaultdict(list)
    for r in table("ItemSparse", build):
        if r.get("Display_lang"):
            item_ids[norm(r["Display_lang"])].append(int(r["ID"]))

    # BaseLevel 0 means "not a rank a player trains" -- see the rank note in the docstring.
    level: dict[int, int] = {}
    for r in table("SpellLevels", build):
        try:
            sid, base = int(r["SpellID"]), int(r["BaseLevel"] or 0)
        except (ValueError, TypeError, KeyError):
            continue
        if base > 0:
            level[sid] = min(base, level.get(sid, base))

    # A level alone is not enough. Forever ships duplicate id families for some spells,
    # and those include rows with a plausible-looking BaseLevel that no class can learn
    # -- Consecration has one at level 1 against its real rank 1 at 20. SkillLineAbility
    # is the table that says which spells a class actually trains, so it is the filter
    # that makes "lowest rank" mean "lowest rank a player can have".
    learnable: set[int] = set()
    skill_of: dict[int, set[int]] = defaultdict(set)
    class_mask_of: dict[int, int] = {}
    for r in table("SkillLineAbility", build):
        try:
            sid, line = int(r["Spell"]), int(r["SkillLine"] or 0)
        except (ValueError, TypeError, KeyError):
            continue
        learnable.add(sid)
        if line:
            skill_of[sid].add(line)
        try:
            mask = int(r.get("ClassMask") or 0)
        except (ValueError, TypeError):
            mask = 0
        if mask:
            class_mask_of[sid] = class_mask_of.get(sid, 0) | mask

    # skill line -> the classes that can train it. See CLASS_BY_MASK.
    classes_of_line: dict[int, set[str]] = defaultdict(set)
    for r in table("SkillRaceClassInfo", build):
        try:
            line, mask = int(r["SkillID"]), int(r["ClassMask"] or 0)
        except (ValueError, TypeError, KeyError):
            continue
        for bit, name in CLASS_BY_MASK.items():
            if mask & bit:
                classes_of_line[line].add(name)

    def classes_of(sid: int) -> set[str]:
        # SkillLineAbility's OWN ClassMask first, because a shared skill line cannot tell
        # per-class copies apart. Forever's `Eureka!` ships one spell per class, all five
        # on racial skill line 753, which SkillRaceClassInfo maps to all nine classes --
        # so every class resolved to whichever copy sorted first and a Mage page showed
        # the rogue's Energy wording. The per-row mask says 128 for the mage's copy.
        direct: set[str] = set()
        for bit, name in CLASS_BY_MASK.items():
            if class_mask_of.get(sid, 0) & bit:
                direct.add(name)
        if direct:
            return direct
        out: set[str] = set()
        for line in skill_of.get(sid, ()):
            out |= classes_of_line.get(line, set())
        return out

    icon: dict[int, int] = {}
    for r in table("SpellMisc", build):
        try:
            sid, fid = int(r["SpellID"]), int(r["SpellIconFileDataID"] or 0)
        except (ValueError, TypeError, KeyError):
            continue
        if fid:
            icon.setdefault(sid, fid)

    # Items carry their own icon, on Item rather than ItemSparse -- ItemSparse holds the
    # names, Item holds the art, and a chip needs both.
    item_icon: dict[int, int] = {}
    for r in table("Item", build):
        try:
            iid, fid = int(r["ID"]), int(r["IconFileDataID"] or 0)
        except (ValueError, TypeError, KeyError):
            continue
        if fid:
            item_icon.setdefault(iid, fid)

    # Talent.db2 gives a talent's rank-1 spell directly, which beats guessing at the
    # lowest id. It is NOT authoritative on its own -- it holds 433 rows and misses
    # Forever's new talents entirely (Reverence, Lone Wolf, Bloodthrill are all absent),
    # which is why SpellName stays the source and this is only a tie-breaker.
    talent_rank1: dict[str, int] = {}
    for r in table("Talent", build):
        ranks = [r.get(f"SpellRank_{i}") for i in range(9)]
        first = next((int(x) for x in ranks if x and x.isdigit() and int(x) > 0), 0)
        try:
            sid = int(r.get("SpellID") or 0) or first
        except (ValueError, TypeError):
            sid = first
        if sid and sid in spell_name_of:
            talent_rank1.setdefault(norm(spell_name_of[sid]), sid)

    entries: dict[str, dict] = {}
    unmatched: list[str] = []
    for name, uses in sorted(names.items()):
        key = norm(name)
        sids, iids = spell_ids.get(key, []), item_ids.get(key, [])

        # Prefer the spell when it is one a player actually learns; a consumable whose
        # name also exists as a spell (its on-use effect) has no trainable rank and
        # should resolve to the item instead.
        # A talent is not trained, so the rank rule that works for abilities does not
        # apply to it: prefer Talent.db2's own rank-1 spell, then fall through.
        if name in talents and key in talent_rank1:
            sid = talent_rank1[key]
            entries[name] = {"kind": "talent", "id": sid, "level": level.get(sid),
                             "icon": icon.get(sid), "uses": uses}
            continue

        trainable = sorted((level[i], i) for i in sids if i in level and i in learnable)
        if trainable and name not in talents:
            lv, sid = trainable[0]
            entries[name] = {"kind": "spell", "id": sid, "level": lv,
                             "icon": icon.get(sid), "uses": uses}
        elif iids and name not in talents:
            iid = min(iids)
            entries[name] = {"kind": "item", "id": iid, "level": None,
                             "icon": item_icon.get(iid), "uses": uses}
        elif sids:
            sid = min(sids)
            entries[name] = {"kind": "talent" if name in talents else "spell",
                             "id": sid, "level": level.get(sid) if name not in talents else None,
                             "icon": icon.get(sid), "uses": uses}
        else:
            unmatched.append(name)

    # RANK LADDERS. NameSubtext_lang carries "Rank N" where the client records one;
    # Forever's new talents (Deflection, Reverence, Shatter) carry none, and those stay
    # silent rather than claiming a rank we cannot see.
    rank_of: dict[int, int] = {}
    for r in table("Spell", build):
        try:
            sid = int(r["ID"])
        except (ValueError, TypeError, KeyError):
            continue
        m = RANK_RE.match((r.get("NameSubtext_lang") or "").strip())
        if m:
            rank_of[sid] = int(m.group(1))

    for name, e in entries.items():
        if e["kind"] == "item":
            continue
        ladder = sorted(((rank_of[i], i) for i in spell_ids.get(norm(name), [])
                         if i in rank_of))
        if not ladder:
            continue
        top = ladder[-1][0]
        # LINK RANK 1 WHERE RANK 1 EXISTS. The guides are levelling guides, so the first
        # rank is the one a reader meets, and a uniform rule is explicable where "lowest
        # trainable level" is not. It also corrects a stale pointer: for talents the
        # selection prefers Talent.db2's recorded rank-1 spell, and for Trueshot Aura
        # that id is rank 3 of the current ladder while rank 1 exists at level 25.
        # Some ladders genuinely start at rank 2 (Lightning Mastery, Monster Slaying);
        # those keep what they have and the label says which rank it is.
        if ladder[0][0] == 1 and ladder[0][1] in learnable:
            e["id"] = ladder[0][1]
            e["icon"] = icon.get(e["id"], e.get("icon"))
            e["level"] = level.get(e["id"])
        mine = rank_of.get(e["id"])
        if mine:
            e["rank"] = f"Rank {mine} of {top}" if top > mine else f"Rank {mine}"

    # PER-CLASS RESOLUTION. A name can be a different spell in each class's tree, so
    # one global answer is wrong wherever the trees collide. Each colliding name gets a
    # `by_class` map and the renderer picks the entry for the page it is drawing; names
    # that do not collide carry none, so the common case costs nothing.
    def pick(ids: list[int], kind: str) -> int | None:
        # Same split as the rank block above: a talent means its maxed rank, an ability
        # means the first rank you can train. Without this the per-class pass would
        # quietly put a colliding talent back on rank 1.
        if kind == "talent":
            ladder = sorted(((rank_of[i], i) for i in ids if i in rank_of))
            if ladder:
                return ladder[-1][1]
        ranked = sorted((level[i], i) for i in ids if i in level and i in learnable)
        if ranked:
            return ranked[0][1]
        return min(ids) if ids else None

    for name, e in entries.items():
        if e["kind"] == "item":
            continue
        cand = spell_ids.get(norm(name), [])
        by_cls: dict[str, list[int]] = defaultdict(list)
        for i in cand:
            for c in classes_of(i):
                by_cls[c].append(i)
        if len(by_cls) < 2:
            continue                      # one class or none -- the default entry is right
        per: dict[str, dict] = {}
        for c, ids in by_cls.items():
            sid = pick(ids, e["kind"])
            if sid is None:
                continue
            per[c] = {"id": sid, "level": level.get(sid), "icon": icon.get(sid)}
        if len(per) > 1:
            e["by_class"] = dict(sorted(per.items()))

    for (name, cls), want in VERIFY_CLASS.items():
        got = entries.get(name, {}).get("by_class", {}).get(cls, {}).get("id")
        if got != want:
            verdict(f"FAIL -- class resolution broke: {name} for {cls} resolved to "
                    f"{got}, expected {want}")

    # Enrich every spell and talent with what a tooltip shows. Items are skipped: their
    # facts live on different tables and the chip for one is a link, not a stat block.
    detail = load_details(build)
    for name, e in entries.items():
        if e["kind"] not in ("spell", "talent"):
            continue
        # FORCE_ID before enrichment, so the forced row's own text is what gets read.
        if name in FORCE_ID:
            e["id"] = FORCE_ID[name]
            e["icon"] = icon.get(e["id"], e.get("icon"))
            e["level"] = level.get(e["id"])
            e.pop("rank", None)
        for key, sid in FORCE_ID.items():
            # A forced class entry may be the FIRST by_class entry this name has: a name
            # that collides with a creature ability rather than another class carries no
            # map of its own, and `Berserk` is exactly that.
            if isinstance(key, tuple) and key[0] == name:
                e.setdefault("by_class", {})[key[1]] = {
                    "id": sid, "level": level.get(sid), "icon": icon.get(sid)}
        e.update(present(e["id"], detail))

        # A CANDIDATE WITH NO TEXT IS THE WRONG CANDIDATE. Selection goes by rank and
        # trainable level, neither of which knows whether the row carries a usable
        # description -- so a name with many candidates could land on an empty or
        # internal row and render a stat block with no body. Only entries that came out
        # with NO description are touched, so this cannot override a working pick.
        if not e.get("desc"):
            for alt in sorted(spell_ids.get(norm(name), []),
                              key=lambda i: (i not in learnable, level.get(i, 999),
                                             rank_of.get(i, 99))):
                if alt == e["id"]:
                    continue
                got = present(alt, detail)
                if got.get("desc"):
                    e["id"] = alt
                    e["icon"] = icon.get(alt, e.get("icon"))
                    e["level"] = level.get(alt)
                    e.update(got)
                    break
        if name in DESC_WRONG:
            e.pop("desc", None)  # see DESC_WRONG: the client figure contradicts the guides
        if e["kind"] == "talent":
            # A talent is not trained at a level and its school is the engine's default
            # rather than a fact about the talent. Both read as noise in a tooltip, and
            # "Level 1" on a talent is actively misleading.
            e["level"] = None
            e.pop("school", None)

        # THE SAME ENRICHMENT PER CLASS, and it is not optional. `by_class` used to
        # carry id/level/icon only, so for a colliding name the link and the art were
        # the page's own class while the tooltip TEXT fell back to the default entry.
        # The Paladin page linked spell=20111 and printed the Warrior's
        # "two-handed melee weapons by 1%" inside the tooltip, beside prose correctly
        # saying 2% -- one build after the LINK was made class-aware (2026-10-07), the
        # description was still global. A reader sees a page contradicting itself.
        ladder = sorted(((rank_of[i], i) for i in spell_ids.get(norm(name), [])
                         if i in rank_of))
        top = ladder[-1][0] if ladder else None
        for sub in (e.get("by_class") or {}).values():
            sid = sub.get("id")
            if not sid:
                continue
            sub.update(present(sid, detail))
            if name in DESC_WRONG:
                sub.pop("desc", None)
            mine = rank_of.get(sid)
            if mine and top:
                sub["rank"] = f"Rank {mine} of {top}" if top > mine else f"Rank {mine}"
            if e["kind"] == "talent":
                sub["level"] = None
                sub.pop("school", None)

    report = {
        "total": len(names),
        "matched": len(entries),
        "unmatched": unmatched,
        "spells": sum(1 for e in entries.values() if e["kind"] == "spell"),
        "items": sum(1 for e in entries.values() if e["kind"] == "item"),
        "talents": sum(1 for e in entries.values() if e["kind"] == "talent"),
        "levelled": sum(1 for e in entries.values() if e["level"]),
        # Per-class entries point at DIFFERENT spells, so they have their own icons.
        # Missing them left five chips naming a file that was never fetched -- caught by
        # build_guides.py's lost_icon notice, which is why that notice exists.
        "icons": ({e["icon"] for e in entries.values() if e.get("icon")}
                  | {d["icon"] for e in entries.values()
                     for d in (e.get("by_class") or {}).values() if d.get("icon")}),
        "described": sum(1 for e in entries.values() if e.get("desc")),
    }
    return entries, report


def pull_icons(fids: set[int], build: str) -> tuple[int, list[int]]:
    """Fetch each icon once and store it as WebP. Returns (written, failed)."""
    try:
        from PIL import Image
    except ImportError:
        raise RuntimeError("Pillow is required to decode BLP icons (pip install Pillow)")

    ICONS.mkdir(parents=True, exist_ok=True)
    written, failed = 0, []
    for fid in sorted(fids):
        out = ICONS / f"{fid}.webp"
        if out.exists():
            continue
        try:
            blp = fetch(f"{API}/api/casc/{fid}?version={build}", timeout=60)
            img = Image.open(io.BytesIO(blp)).convert("RGBA")
            img.save(out, "WEBP", quality=88, method=6)
            written += 1
        except (urllib.error.URLError, OSError, ValueError):
            failed.append(fid)
    return written, failed


def input_stamp(build: str, names: dict[str, int]) -> str:
    """Hash of everything that can change the output, computed WITHOUT downloading a table.

    The six DB2 tables are ~10 MB. A daily routine that pulls them only to discover nothing
    moved is the wrong shape, so the no-op path is decided from the client build and the
    chip list alone -- the only two inputs. Same reasoning as the brain index's stamp.
    """
    h = hashlib.sha256(build.encode())
    h.update("\0".join(sorted(names)).encode())
    return h.hexdigest()[:12]


def stamp_of(build: str, entries: dict) -> str:
    h = hashlib.sha256(build.encode())
    h.update(json.dumps(entries, sort_keys=True).encode())
    return h.hexdigest()[:12]


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--status", action="store_true", help="report, change nothing")
    ap.add_argument("--force", action="store_true", help="rebuild even if unchanged")
    ap.add_argument("--build", default="", help="pin a client build instead of the latest")
    args = ap.parse_args()

    if not SRC.is_dir():
        verdict(f"FAIL -- no guides/_src under {ROOT}")

    try:
        build = args.build or latest_build()
    except (urllib.error.URLError, RuntimeError, ValueError, KeyError) as e:
        verdict(f"FAIL -- could not reach wago.tools: {e}")

    prior = {}
    if DATA.exists():
        try:
            prior = json.loads(DATA.read_text())
        except json.JSONDecodeError:
            prior = {}

    names, talents = chips()
    print(f"product: {PRODUCT}")
    print(f"build:   {build}" + ("" if build != prior.get("build") else "  (unchanged)"))
    print(f"names:   {len(names)} distinct in guides/_src "
          f"({len(names) - len(talents)} abilities, {len(talents)} talents)")

    fresh = input_stamp(build, names)
    current = prior.get("inputs") == fresh

    if args.status:
        if current:
            verdict(f"OK -- already current at build {build}, {len(prior.get('entries', {}))} entries")
        why = ("client moved to " + build if prior.get("build") != build
               else "the chip list changed")
        verdict(f"STALE -- {why}; index was built at {prior.get('build') or 'none'}")

    if current and not args.force:
        verdict(f"OK -- already current at build {build}, {len(prior.get('entries', {}))} entries")

    try:
        entries, rep = resolve(names, talents, build)
    except (urllib.error.URLError, ValueError, KeyError) as e:
        verdict(f"FAIL -- rebuild failed, previous index still in place: {e}")

    for name, want in VERIFY.items():
        got = entries.get(name, {}).get("level")
        if got != want:
            verdict(f"FAIL -- rank rule broke: {name} resolved to level {got}, guides say {want}")

    for name, figure in VERIFY_DESC.items():
        got = entries.get(name, {}).get("desc")
        if got and figure not in got:
            verdict(f"FAIL -- description resolver broke: {name} rendered {got!r}, "
                    f"which does not contain {figure!r} as the guides state")

    stamp = stamp_of(build, entries)
    written, failed = pull_icons(rep["icons"], build)

    DATA.parent.mkdir(parents=True, exist_ok=True)
    DATA.write_text(json.dumps({
        "build": build,
        "product": PRODUCT,
        "generated": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "stamp": stamp,
        "inputs": fresh,
        "entries": {k: {kk: vv for kk, vv in v.items() if kk != "uses"}
                    for k, v in sorted(entries.items())},
    }, indent=1) + "\n", encoding="utf-8")

    pct = 100 * rep["matched"] / rep["total"]
    print(f"matched: {rep['matched']}/{rep['total']} ({pct:.1f}%) -- "
          f"{rep['spells']} spell, {rep['talents']} talent, {rep['items']} item, "
          f"{rep['levelled']} with a level, {rep['described']} with a description")
    if rep["unmatched"]:
        print(f"unmatched ({len(rep['unmatched'])}): {', '.join(rep['unmatched'])}")
    if failed:
        print(f"icons that would not convert ({len(failed)}): {failed}")
    verdict(f"REBUILT -- {rep['matched']} entr(ies), {len(rep['icons'])} icon(s) "
            f"({written} new) from build {build}; stamp {stamp}")


if __name__ == "__main__":
    main()
