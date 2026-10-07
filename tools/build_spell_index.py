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
TABLES = ("SpellName", "SpellMisc", "SpellLevels", "SkillLineAbility", "ItemSparse", "Item")

# Spot-checks against the guides' own prose. A rank rule that breaks these is wrong.
# These are not decoration: the first rule tried here (lowest non-zero BaseLevel) put
# Consecration at level 1, because Forever ships a second id family for it that includes
# a level-1 row no Paladin can train. These caught that before it reached a page.
VERIFY = {"Holy Strike": 6, "Consecration": 20, "Ice Lance": 20, "Shadow Bolt": 1}

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
    for r in table("SkillLineAbility", build):
        try:
            learnable.add(int(r["Spell"]))
        except (ValueError, TypeError, KeyError):
            continue

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

    report = {
        "total": len(names),
        "matched": len(entries),
        "unmatched": unmatched,
        "spells": sum(1 for e in entries.values() if e["kind"] == "spell"),
        "items": sum(1 for e in entries.values() if e["kind"] == "item"),
        "talents": sum(1 for e in entries.values() if e["kind"] == "talent"),
        "levelled": sum(1 for e in entries.values() if e["level"]),
        "icons": {e["icon"] for e in entries.values() if e["icon"]},
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
          f"{rep['levelled']} with a level")
    if rep["unmatched"]:
        print(f"unmatched ({len(rep['unmatched'])}): {', '.join(rep['unmatched'])}")
    if failed:
        print(f"icons that would not convert ({len(failed)}): {failed}")
    verdict(f"REBUILT -- {rep['matched']} entr(ies), {len(rep['icons'])} icon(s) "
            f"({written} new) from build {build}; stamp {stamp}")


if __name__ == "__main__":
    main()
