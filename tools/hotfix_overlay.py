#!/usr/bin/env python3
"""Server hotfixes, laid over the base client's tables before the spell index reads them.

build_spell_index.py reads wago.tools, which exports the client's FILES. Blizzard also
changes the game without shipping a file: a hotfix is a replacement table row the server
hands each client at login, and the client keeps what it was handed in `DBCache.bin`. Those
rows are in no wago table. On 2026-11-13 the index said Stormstrike strikes for 150% weapon
damage on a 6 second cooldown, build 70938's file, a day after the game had made it 100%
on 8 (Web-Development Landmines: "the base client can be wrong about what a player sees").

Raidbots publishes the cache its simulator runs on, merged from many clients, and lists the
files at CACHE_LIST. This module finds the newest one made for the SAME build as the base
tables, decodes it, and hands build_spell_index.table() the rows with the hotfixes in.

    python3 tools/hotfix_overlay.py 1.60.1.70938     # what the newest cache holds, per table

NOTHING HERE MAY TAKE THE INDEX DOWN. The index publishes unattended, and this is a second
upstream that moves several times a day. Every way of not having a usable cache -- the
listing unreachable, no file for this build, a file that does not parse, a table whose
layout cannot be established -- raises Unavailable or refuses that one table, and the
caller builds on the base client and says so.

THE RECORD LAYOUT IS SOLVED, NEVER ASSUMED. A cache record is one row's fields back to
back with no types and no column names. Rather than trust a published definition to match
this build, solve() fits the CSV's own columns to the bytes: most cached rows are ones a
later client file already absorbed, so they equal their base row, and the only arrangement
of widths and types that reproduces hundreds of known rows is the real one. What that
cannot settle is a column that is 0 in every cached row: its bytes are zeros whichever
way a run of them is cut. Such a column is "unproven", and a hotfix value that lands in
one is not applied (the row keeps the base value there, and the table's report counts it).
"""
from __future__ import annotations

import hashlib
import json
import struct
import sys
import urllib.error
import urllib.request
from collections import defaultdict

CACHE_LIST = "https://www.raidbots.com/api/dbcache/verified"
REALM = "forever"            # the listing's `version`; retail files share the list
UA = {"User-Agent": "nossuary-spell-index/1.0"}
MAX_BYTES = 64 * 1024 * 1024  # the file is ~7 MB; anything near this is not the file

VALID, REMOVED = 1, 2        # record status. 3 is "invalid" and 4 "not public": the client
                             # falls back to its own file for both, and so does this.

# How sure a layout has to be. A column must agree with the base on MATCH of the cached
# rows to be placed at all, and a table of any size must come out row-for-row equal to the
# base on IDENTICAL of them, or the fit is describing something other than this table.
# Tables with fewer than SMALL rows are exempt from the second test only because one real
# hotfix among three rows would fail it; they still pass the first, per column.
MATCH = 0.6
IDENTICAL = 0.8
SMALL = 10
SAMPLE = 400


class Unavailable(Exception):
    """No usable cache. The message is the reason, in words for a verdict line."""


_SSTR = (0x486E26EE, 0xDCAA16B3, 0xE1918EEF, 0x202DAFDB, 0x341C7DC7, 0x1C365303,
         0x40EF2D37, 0x65FD5E49, 0xD6057177, 0x904ECE93, 0x1C38024F, 0x98FD323B,
         0xE3061AE7, 0xA39B0FA1, 0x9797F25F, 0xE4444563)


def table_hash(name: str) -> int:
    """The id a cache record names its table by: Blizzard's SStrHash of the upper-cased name.

    Checked against ten tables whose hashes were first found the slow way, by matching
    record ids to CSV ids. The first audit used the wrong hash function and concluded the
    small lookup tables "could not be told apart"; with this one every table is named.
    """
    seed, shift = 0x7FED7FED, 0xEEEEEEEE
    for c in name.upper().encode():
        seed = ((_SSTR[c >> 4] - _SSTR[c & 0xF]) & 0xFFFFFFFF) ^ ((shift + seed) & 0xFFFFFFFF)
        shift = (c + seed + 33 * shift + 3) & 0xFFFFFFFF
    return seed or 1


def fetch(url: str, timeout: int = 120) -> bytes:
    if not url.startswith("https://"):
        raise Unavailable(f"the cache listing names a non-https file ({url[:60]!r})")
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=timeout) as r:
        blob = r.read(MAX_BYTES + 1)
    if len(blob) > MAX_BYTES:
        raise Unavailable("the cache file is larger than any real cache")
    return blob


def when(created: str) -> str:
    return f"{created[:16].replace('T', ' ')} UTC"


def locate(build: str) -> dict:
    """The newest verified cache for exactly this client build, from the listing alone.

    NEVER A CACHE FROM ANOTHER BUILD. A record is a whole row in that build's layout, laid
    over that build's file; carried to a different build it can restore a value the new
    file deliberately changed, or decode against columns that have moved.
    """
    try:
        number = int(build.rsplit(".", 1)[-1])
    except ValueError:
        raise Unavailable(f"client build {build!r} has no build number to match a cache to")
    try:
        rows = json.loads(fetch(CACHE_LIST, timeout=30))["data"]
        ours = [x for x in rows if x.get("version") == REALM and x.get("verified", True)]
        same = [x for x in ours if int(x["build"]) == number]
        if not same:
            if not ours:
                raise Unavailable("Raidbots lists no Forever hotfix cache")
            newest = max(int(x["build"]) for x in ours)
            raise Unavailable(f"Raidbots' cache list has none for client build {number} "
                              f"(its newest Forever cache is for build {newest})")
        top = max(same, key=lambda x: x["created"])
        return {"build": number, "pushes": int(top["pushIds"]), "records": int(top["entries"]),
                "created": str(top["created"]), "url": str(top["url"])}
    except Unavailable:
        raise
    except (urllib.error.URLError, TimeoutError, OSError) as e:
        raise Unavailable(f"Raidbots' cache list is unreachable ({e})")
    except (ValueError, KeyError, TypeError, AttributeError) as e:
        raise Unavailable(f"Raidbots' cache list does not read as expected "
                          f"({e.__class__.__name__}: {e})")


def parse(blob: bytes) -> tuple[int, list[dict]]:
    """A DBCache.bin as (client build, records). Raises Unavailable on anything unexpected.

    Header: "XFTH", a format version, the client build, and a 32-byte digest. Then records,
    each "XFTH", region, push id, a unique id, the table's hash, the row id, the payload
    size and a status byte padded to four, followed by the payload.
    """
    try:
        magic, version, build = struct.unpack_from("<4sII", blob, 0)
        if magic != b"XFTH":
            raise Unavailable("the cache file does not start with a DBCache header")
        at, records = 44, []
        while at < len(blob):
            magic, _region, push, _uniq, table, row, size, status = struct.unpack_from(
                "<4siiIIiIB", blob, at)
            at += 32
            if magic != b"XFTH" or at + size > len(blob):
                raise Unavailable(f"the cache file (format {version}) stops reading as "
                                  f"records at byte {at - 32}")
            records.append({"push": push, "table": table, "id": row, "status": status,
                            "data": blob[at:at + size]})
            at += size
    except struct.error:
        raise Unavailable("the cache file is truncated")
    if not records:
        raise Unavailable("the cache file holds no records")
    return build, records


def _number(s) -> float | None:
    try:
        return float(s)
    except (ValueError, TypeError):
        return None


def _same(a: str, b: str) -> bool:
    fa, fb = _number(a), _number(b)
    if fa is not None and fb is not None:
        return abs(fa - fb) <= 1e-4 * max(1.0, abs(fa))
    return (a or "").replace("\r\n", "\n") == (b or "").replace("\r\n", "\n")


# (name, struct format, width, lowest and highest value it can hold; None for a float)
KINDS = (("i4", "<i", 4, -2**31, 2**31 - 1), ("u4", "<I", 4, 0, 2**32 - 1),
         ("f4", "<f", 4, None, None),
         ("i2", "<h", 2, -2**15, 2**15 - 1), ("u2", "<H", 2, 0, 2**16 - 1),
         ("i1", "<b", 1, -2**7, 2**7 - 1), ("u1", "<B", 1, 0, 2**8 - 1),
         ("i8", "<q", 8, -2**63, 2**63 - 1), ("u8", "<Q", 8, 0, 2**64 - 1))


def solve(columns: list[str], rows: dict[int, dict], sample: list[dict]):
    """Fit the CSV's columns, in file order, to the cached records. Returns a layout or None.

    A layout is [(column, kind)], kind being one of KINDS, "str" for a zero-terminated
    string, or "" for the id where the record does not repeat it (the header carries it).
    Among the arrangements that consume every record exactly, the one reproducing the most
    non-zero base values wins: zeros agree with anything, so they are not evidence.
    """
    text, span = set(), {}
    for c in columns:
        low = high = 0.0
        whole, blank = True, True
        for r in rows.values():
            v = _number(r.get(c))
            if v is None:
                if r.get(c):
                    text.add(c)
                    break
                continue
            blank = False
            low, high = min(low, v), max(high, v)
            whole = whole and v == int(v)
        # A column with nothing in it anywhere is a string nobody filled in (SkillLine's
        # NeutralDisplayName): a number column prints 0, not nothing.
        if c.endswith("_lang") or blank:
            text.add(c)
        span[c] = (low, high, whole)

    def fits(c: str, lo, hi) -> bool:
        low, high, whole = span[c]
        return lo is None or (whole and lo <= low and high <= hi)

    size = [len(r["data"]) for r in sample]
    need = MATCH * len(sample)
    best: dict = {"score": -1, "layout": None}
    seen: dict[tuple[int, int], int] = {}

    def walk(k: int, fixed: int, at: list[int], layout: list, score: int) -> None:
        if seen.get((k, fixed), -1) >= score:
            return
        seen[(k, fixed)] = score
        if k == len(columns):
            done = sum(1 for a, n in zip(at, size) if a == n)
            if done >= need and score > best["score"]:
                best["score"], best["layout"] = score, list(layout)
            return
        c = columns[k]
        if c in text:
            nxt, ok, proof = [], 0, 0
            for r, a in zip(sample, at):
                end = r["data"].find(b"\0", a) if a >= 0 else -1
                if end < 0:
                    nxt.append(-1)
                    continue
                nxt.append(end + 1)
                want = rows[r["id"]].get(c) or ""
                if _same(r["data"][a:end].decode("utf-8", "replace"), want):
                    ok += 1
                    proof += bool(want)
            if ok >= need:
                walk(k + 1, fixed, nxt, layout + [(c, "str")], score + proof)
            return
        if c == "ID":
            walk(k + 1, fixed, at, layout + [(c, "")], score)
        for kind, fmt, width, lo, hi in KINDS:
            if not fits(c, lo, hi):
                continue
            ok = proof = 0
            for r, a in zip(sample, at):
                if a < 0 or a + width > len(r["data"]):
                    continue
                got = struct.unpack_from(fmt, r["data"], a)[0]
                want = float(r["id"]) if c == "ID" else _number(rows[r["id"]].get(c) or 0)
                if want is not None and abs(got - want) <= 1e-4 * max(1.0, abs(want)):
                    ok += 1
                    proof += want != 0
            if ok >= need:
                walk(k + 1, fixed + width, [a + width if a >= 0 else a for a in at],
                     layout + [(c, kind)], score + proof)

    walk(0, 0, [0] * len(sample), [], 0)
    return best["layout"]


def decode(data: bytes, layout: list[tuple[str, str]]) -> dict[str, str] | None:
    """One record as CSV-style strings, or None if the bytes do not fit the layout."""
    out, at = {}, 0
    formats = {k[0]: (k[1], k[2]) for k in KINDS}
    try:
        for column, kind in layout:
            if kind == "":
                continue
            if kind == "str":
                end = data.index(b"\0", at)
                out[column] = data[at:end].decode("utf-8")
                at = end + 1
                continue
            fmt, width = formats[kind]
            v = struct.unpack_from(fmt, data, at)[0]
            at += width
            if kind == "f4":
                if v != v or abs(v) > 1e15:
                    return None
                s = repr(round(v, 6))
                out[column] = "0" if s in ("-0.0", "0.0") else (s[:-2] if s.endswith(".0") else s)
            else:
                out[column] = str(v)
    except (ValueError, struct.error, UnicodeDecodeError):
        return None
    return out if at == len(data) else None


class Overlay:
    """One parsed cache, applied table by table. See apply()."""

    def __init__(self, meta: dict, records: list[dict], tables: tuple[str, ...]):
        self.meta = meta
        self.tables: dict[str, dict] = {}      # per table: what apply() did, for the report
        self._done: dict[str, list[dict]] = {}
        wanted = {table_hash(t): t for t in tables}
        # THE HIGHEST PUSH ID IS THE LAST THING THE SERVER SAID about a row. Raidbots
        # merges many clients' caches, so file order is not push order (356 rows of the
        # 2026-11-13 file sit after an older push of themselves).
        latest: dict[str, dict[int, dict]] = defaultdict(dict)
        for r in records:
            name = wanted.get(r["table"])
            if not name or r["push"] <= 0:
                continue
            held = latest[name].get(r["id"])
            if held is None or r["push"] >= held["push"]:
                latest[name][r["id"]] = r
        self._latest = latest
        h = hashlib.sha256()
        for name in sorted(latest):
            for rid in sorted(latest[name]):
                r = latest[name][rid]
                h.update(f"{name}\0{rid}\0{r['status']}\0".encode())
                h.update(hashlib.sha256(r["data"]).digest())
        # What the index's "is the overlay current" test compares: only the rows of the
        # tables it reads. The file itself changes every half hour, on items and quests.
        self.digest = h.hexdigest()[:16]

    def apply(self, name: str, rows: list[dict]) -> list[dict]:
        """The base table with the cache's rows laid over it. `rows` is not modified."""
        if name in self._done:
            return self._done[name]
        out = self._done[name] = self._apply(name, rows)
        return out

    def _apply(self, name: str, rows: list[dict]) -> list[dict]:
        held = self._latest.get(name, {})
        info = self.tables[name] = {"records": len(held), "changed": 0, "added": 0,
                                    "removed": 0}
        if not held or not rows:
            return rows
        columns = list(rows[0].keys())
        if "ID" not in columns:
            info["refused"] = "the table has no ID column to match records to"
            return rows
        base: dict[int, dict] = {}
        for r in rows:
            try:
                base[int(r["ID"])] = r
            except (ValueError, TypeError):
                continue
        valid = [r for r in held.values() if r["status"] == VALID]
        known = [r for r in valid if r["id"] in base]
        layout = solve(columns, base, known[:SAMPLE]) if known else None
        if not layout:
            if valid:
                info["refused"] = ("its record layout could not be established from "
                                   f"{len(known)} cached row(s) the base client also holds")
                return rows
            layout = []

        # Proof per column, and the row-for-row test, over every known row.
        decoded = {r["id"]: decode(r["data"], layout) for r in valid}
        proof = {c: [0, 0] for c, kind in layout if kind}
        identical = 0
        for r in known:
            new = decoded[r["id"]]
            if new is None:
                continue
            same = True
            for c in proof:
                want = base[r["id"]].get(c) or ""
                hit = _same(new[c], want)
                same = same and hit
                if want and _number(want) != 0:
                    proof[c][0] += 1
                    proof[c][1] += hit
            identical += same
        if len(known) >= SMALL and identical < IDENTICAL * len(known):
            info["refused"] = (f"only {identical} of {len(known)} cached rows decode equal "
                               f"to the base client, so the layout is not trusted")
            return rows
        proven = {c for c, (seen, hit) in proof.items() if hit and hit * 2 >= seen}
        info["unproven"] = sorted(set(proof) - proven)

        out = dict(base)
        unreadable = ignored = 0
        for rid, r in held.items():
            if r["status"] == REMOVED:
                if out.pop(rid, None) is not None:
                    info["removed"] += 1
                continue
            if r["status"] != VALID:
                continue
            new = decoded[rid]
            if new is None:
                unreadable += 1
                continue
            old = base.get(rid)
            if old is None:
                # A row the file does not have. Nothing vouches for a value in a column
                # no known row has ever filled, so such a row is left out whole.
                if any(new[c] not in ("", "0") for c in proof if c not in proven):
                    ignored += 1
                    continue
                out[rid] = {**{c: "" for c in columns}, **new, "ID": str(rid)}
                info["added"] += 1
                continue
            moved = {c: new[c] for c in proof if not _same(new[c], old.get(c) or "")}
            ignored += any(c not in proven for c in moved)
            moved = {c: v for c, v in moved.items() if c in proven}
            if moved:
                out[rid] = {**old, **moved}
                info["changed"] += 1
        if unreadable:
            info["unreadable"] = unreadable
        if ignored:
            info["ignored"] = ignored
        if not (info["changed"] or info["added"] or info["removed"]):
            return rows
        return [out[rid] for rid in sorted(out)]

    def coverage(self) -> tuple[list[str], dict[str, str]]:
        """(tables overlaid, {table: why not}) over the tables apply() has seen."""
        return (sorted(t for t, i in self.tables.items() if "refused" not in i),
                {t: i["refused"] for t, i in sorted(self.tables.items()) if "refused" in i})


def load(meta: dict, tables: tuple[str, ...]) -> Overlay:
    """Download and parse the cache `locate()` found. Raises Unavailable."""
    try:
        blob = fetch(meta["url"])
    except (urllib.error.URLError, TimeoutError, OSError) as e:
        raise Unavailable(f"the cache file could not be downloaded ({e})")
    build, records = parse(blob)
    if build != meta["build"]:
        raise Unavailable(f"the cache file says it is for build {build}, "
                          f"its listing said {meta['build']}")
    return Overlay(meta, records, tables)


if __name__ == "__main__":
    import build_spell_index as index
    try:
        found = locate(sys.argv[1])
        overlay = load(found, index.OVERLAID)
    except Unavailable as e:
        print(f"hotfix-overlay: SKIPPED -- {e}")
        sys.exit(0)
    for t in index.OVERLAID:
        overlay.apply(t, index.base_table(t, sys.argv[1]))
        print(f"{t:30} {overlay.tables[t]}")
    print(f"hotfix-overlay: READ -- cache build {found['build']}, {found['pushes']} pushes, "
          f"{when(found['created'])}; digest {overlay.digest}")
