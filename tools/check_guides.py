#!/usr/bin/env python3
"""Check the built guides for the defects a reader found that our other checks could not.

    python3 tools/check_guides.py

Everything else guarding these pages verifies PROVENANCE or INTERNAL CONSISTENCY: the
description resolver refuses an unresolved token, the rank rule asserts against figures the
prose already states, `check_prose_edit.py` proves a copy-edit changed no facts. On
2026-10-08 a reader who plays the game found three defects, and **every one of them passed
every check we had** while being plainly wrong to him.

This file exists for that class. Each check below is a defect that actually shipped.

ALWAYS ENDS WITH ONE VERDICT LINE beginning `check-guides:` -- the routine convention on
this workspace is that a run is judged by its closing message, not its exit code
(AI-Infra DR-0093).
"""
from __future__ import annotations

import json
import pathlib
import re
import sys
from collections import defaultdict

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = ROOT / "guides" / "_src"
OUT = ROOT / "guides" / "wow-forever"
DATA = ROOT / "guides" / "_data" / "spells.json"
ICONS = ROOT / "assets" / "spell-icons"

CLASSES = ("warrior", "paladin", "hunter", "rogue", "priest",
           "shaman", "mage", "warlock", "druid")

# A page that is one changelog entry every N words is written for someone who played last
# patch, not for someone levelling the class. The complaint that produced these numbers was
# measured at 1-per-87 on paladin-retribution; the pass that answered it reached 1-per-110.
# FAIL is set below where it was when the reader objected, so the gate cannot be satisfied
# by regressing to the state he complained about. WARN is the standard to actually hold.
CHURN_FAIL = 90
CHURN_WARN = 120
CHURN_RE = re.compile(
    r"\(was [^)]*\)|was \*\*[^*]*\*\*|cut from|down from|raised from|lowered from"
    r"|up from|reduced from|increased to|September 24 build|October 1 build|October 2 build")

LINK_RE = re.compile(r'href="https://www\.wowhead\.com/forever/spell=(\d+)"[^>]*>(?:'
                     r'<img[^>]*>)?([^<]+)<')
ICON_RE = re.compile(r"/assets/spell-icons/(\d+)\.webp")


def load():
    try:
        return json.loads(DATA.read_text(encoding="utf-8"))["entries"]
    except (OSError, ValueError, KeyError):
        return {}


def class_links(entries) -> list[str]:
    """Every chip on a class's page must resolve to THAT class's spell.

    THE DEFECT THIS CATCHES, which shipped and was found by a reader rather than by us:
    the index was keyed by name alone, so `Deflection` -- a talent in four trees -- linked
    to the WARRIOR's copy on the Hunter and Paladin pages too. 110 chips across 28 pages.
    Four spot-assertions live in build_spell_index.py; this sweeps all of them, in the
    BUILT HTML, so a renderer bug that ignores the per-class entry is caught as well.
    """
    bad = []
    per_class = {n: e["by_class"] for n, e in entries.items() if e.get("by_class")}
    if not per_class:
        return bad
    for page in sorted(OUT.rglob("index.html")):
        rel = page.relative_to(OUT).parent.as_posix()
        cls = rel.split("/")[0]
        if cls not in CLASSES:
            continue                      # professions and the hub belong to no class
        html = page.read_text(encoding="utf-8")
        for sid, name in LINK_RE.findall(html):
            want = per_class.get(name.strip(), {}).get(cls)
            if want and int(sid) != want["id"]:
                bad.append(f"{rel or 'index'}: `{name.strip()}` links spell={sid}, "
                           f"but {cls}'s is {want['id']}")
    return bad


def churn() -> tuple[list[str], list[str]]:
    """How much of a page is "it used to be X" rather than what it is now."""
    fails, warns = [], []
    for md in sorted(SRC.glob("*.md")):
        if md.stem.startswith("prof-") or md.stem in ("index", "landing"):
            continue
        text = md.read_text(encoding="utf-8")
        # The one hedging box is allowed to carry the beta's own history.
        body = re.sub(r":::scope.*?:::", "", text, flags=re.S)
        hits = len(CHURN_RE.findall(body))
        words = len(body.split())
        if not hits:
            continue
        density = words // hits
        if density < CHURN_FAIL:
            fails.append(f"{md.name}: 1 changelog mention per {density} words ({hits} in {words})")
        elif density < CHURN_WARN:
            warns.append(f"{md.name}: 1 per {density} words ({hits} in {words})")
    return fails, warns


def icons() -> list[str]:
    """An icon named by a page but absent on disk is a broken image for every reader.

    Introduced on 2026-10-08 by the per-class fix: those entries point at DIFFERENT spells
    with DIFFERENT icons, and the first pass fetched only the default ones.
    """
    want = set()
    for page in OUT.rglob("index.html"):
        want |= set(ICON_RE.findall(page.read_text(encoding="utf-8")))
    return [f"{i}.webp referenced but not in assets/spell-icons/"
            for i in sorted(want) if not (ICONS / f"{i}.webp").exists()]


def main() -> None:
    if not OUT.is_dir():
        print("check-guides: FAIL -- no built guides; run tools/build_guides.py first")
        sys.exit(0)
    entries = load()
    if not entries:
        print("check-guides: FAIL -- guides/_data/spells.json missing or unreadable")
        sys.exit(0)

    mislinks = class_links(entries)
    churn_fail, churn_warn = churn()
    missing = icons()

    for label, rows in (("cross-class mislink", mislinks),
                        ("patch churn", churn_fail),
                        ("missing icon", missing)):
        for r in rows:
            print(f"  FAIL  {label}: {r}")
    for r in churn_warn:
        print(f"  warn  patch churn: {r}")

    bad = len(mislinks) + len(churn_fail) + len(missing)
    if bad:
        print(f"check-guides: FAIL -- {bad} problem(s): {len(mislinks)} mislink(s), "
              f"{len(churn_fail)} over the churn limit, {len(missing)} missing icon(s)")
        sys.exit(0)
    print(f"check-guides: OK -- no mislinks, no missing icons, "
          f"{len(churn_warn)} page(s) above the churn target")


if __name__ == "__main__":
    main()
