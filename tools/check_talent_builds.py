#!/usr/bin/env python3
"""Replay the guides' published talent builds against Raidbots' Forever talent trees.

    python3 tools/check_talent_builds.py

The 2026-10-31 audit found 43 critical defects, most of them builds a reader cannot enter:
a talent that moved up a tier, lost ranks or left the tree. Nothing caught them, because
`check_guides.py` verifies links and icons, and a chip resolves happily for a talent nobody
can reach. wago.tools' Talent.db2 cannot answer this (see Landmines); Raidbots publishes the
real tree, with tiers, rank caps and point gates, at a stable public URL.

ADVISORY. `nightly_publish.py` runs it and records the verdict, and it can never block a
publish. Raidbots regenerates its data on its own schedule and it can trail the client, so a finding may mean
the file is behind, which is why the verdict states both builds. `talents.json` is built
from the client alone, so it misses server hotfixes. Those are in Raidbots' merged game cache
(`CACHE_LIST`, a public list of `DBCache.bin` files), whose newest file the verdict names:
when its push count has moved past what these pages were read against, a green replay here
proves less than it says. wowsims/gamedata publishes a readable diff of each hotfix.

Build lines are prose, so this reads what it can: a line opening `**Level N` starts a
build, and on that line and the list under it each talent followed by its points counts.
A name the tree does not hold is reported, not assumed removed: check for a rename first.

ALWAYS ENDS WITH ONE VERDICT LINE beginning `check-talents:` (AI-Infra DR-0093).
"""
from __future__ import annotations

import json
import pathlib
import re
import sys
import urllib.error
import urllib.request

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = ROOT / "guides" / "_src"
INDEX = ROOT / "guides" / "_data" / "spells.json"
API = "https://www.raidbots.com/static/data/forever"
CACHE_LIST = "https://www.raidbots.com/api/dbcache/verified"
UA = {"User-Agent": "nossuary.com guide checks"}

CLASSES = ("warrior", "paladin", "hunter", "rogue", "priest",
           "shaman", "mage", "warlock", "druid")

LEVEL_RE = re.compile(r"^\*\*Level (\d+)\b")
ITEM_RE = re.compile(r"^\d+\. ")
BUILD_RE = re.compile(r"^\*\*Build\b")
# `Cruelty`, 5 points / **`Piercing Howl`**, 1 point / `Unholy Power` 5 / [[Death Wish]] 1.
# A running total ("`Camouflage` 5/5") restates points already counted; a name with no
# number in an arrow list ("-> [[Stormstrike]] ->") is a one-point milestone.
PICK_RE = re.compile(r"(?:`([^`]+)`|\[\[([^\]]+)\]\])\*{0,2}"
                     r"(?:(?:,| x|:)? ?(\d+)(?!/)(?: points?)?\b|(?= (?:→|->))|(?=\.?$))")
# Prose after these words describes another build, not this one.
ASIDE_RE = re.compile(r"\b(?:alternative|alternatively|second reading|or swap|instead of|swaps?)\b",
                      re.IGNORECASE)


def fetch(name: str):
    req = urllib.request.Request(f"{API}/{name}.json", headers=UA)
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.load(r)


def newest_cache() -> str:
    """Raidbots' newest live-realm hotfix cache, in words for the verdict."""
    req = urllib.request.Request(CACHE_LIST, headers=UA)
    with urllib.request.urlopen(req, timeout=30) as r:
        rows = [x for x in json.load(r)["data"] if x.get("version") == "forever"]
    if not rows:
        return "no forever hotfix cache listed"
    top = max(rows, key=lambda x: (int(x["build"]), x["created"]))
    return (f"hotfix cache build {top['build']}, {top['pushIds']} pushes, "
            f"{top['created'][:16].replace('T', ' ')} UTC")


def load_trees(data) -> dict:
    """{class: {talent name: (tree, max ranks, points the tree must hold first)}}"""
    out = {}
    for cls in data:
        talents = {}
        for tree in cls["trees"]:
            for node in tree["nodes"]:
                talents[node["name"]] = (tree["name"], node["maxRanks"], node.get("reqPoints") or 0)
        out[cls["className"].lower()] = talents
    return out


def builds_in(text: str):
    """Yield (line number, level, [(name, points), ...]) for each build on a page."""
    level = line_no = None
    picks: list[tuple[str, int]] = []
    for n, line in enumerate(text.splitlines(), 1):
        head = LEVEL_RE.match(line)
        variant = BUILD_RE.match(line)
        if head or variant or line.startswith("#"):
            if picks:
                yield line_no, level, picks
            picks, line_no = [], n
            if head:
                level = int(head.group(1))
            elif not variant:
                level = None
        if level is None or not (head or variant or ITEM_RE.match(line)):
            continue
        for a, b, pts in PICK_RE.findall(ASIDE_RE.split(line)[0]):
            if pts or "→" in line or "->" in line:
                picks.append((a or b, int(pts or 1)))
    if picks:
        yield line_no, level, picks


def replay(level: int, picks, talents) -> list[str]:
    """What is wrong with these picks, taken in the order the page gives them."""
    problems, spent, total = [], {}, 0
    for name, pts in picks:
        total += pts
        row = talents.get(name)
        if row is None:
            if pts > 1:  # An unnumbered name may be a spell the sentence merely mentions.
                problems.append(f"`{name}` is not in the tree")
            continue
        tree, cap, gate = row
        if pts > cap:
            problems.append(f"`{name}` {pts} points, the cap is {cap}")
        if spent.get(tree, 0) < gate:
            problems.append(f"`{name}` needs {gate} points in {tree}, the page has {spent.get(tree, 0)}")
        spent[tree] = spent.get(tree, 0) + pts
    if total > level - 9:
        problems.append(f"{total} points spent, level {level} has {level - 9}")
    return problems


def verdict(line: str) -> None:
    print(f"check-talents: {line}")
    sys.exit(0)


def main() -> None:
    try:
        meta = fetch("metadata")
        trees = load_trees(fetch("talents"))
    except (urllib.error.URLError, TimeoutError, ValueError, KeyError) as e:
        verdict(f"FAIL -- could not read Raidbots' Forever data: {e}")
    client = json.loads(INDEX.read_text(encoding="utf-8")).get("build", "?")
    behind = "" if meta["wowBuild"] == client else f", which is not the index's {client}"

    checked = flagged = 0
    for cls in CLASSES:
        talents = trees.get(cls)
        if not talents:
            verdict(f"FAIL -- Raidbots' data has no {cls} tree")
        for md in sorted(SRC.glob(f"{cls}*.md")):
            for line_no, level, picks in builds_in(md.read_text(encoding="utf-8")):
                checked += 1
                problems = replay(level, picks, talents)
                if problems:
                    flagged += 1
                    print(f"{md.name}:{line_no} level {level}: " + "; ".join(problems))

    try:
        cache = newest_cache()
    except (urllib.error.URLError, TimeoutError, ValueError, KeyError) as e:
        cache = f"hotfix cache unread: {e}"
    state = "OK" if not flagged else "REVIEW"
    verdict(f"{state} -- {flagged} of {checked} build(s) flagged against Raidbots' "
            f"{meta['wowBuild']} ({meta['generatedAt'][:10]}){behind}; {cache}")


if __name__ == "__main__":
    main()
