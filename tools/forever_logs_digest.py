#!/usr/bin/env python3
"""Digest Forever Logs' per-spec dungeon numbers for the WoW: Forever guides.

    python3 tools/forever_logs_digest.py

Nothing in this repo says how a spec actually performs on the realm, or whether that moved
since a guide was last read. foreverlogs.gg publishes that through a documented public read
API; this reads it and prints parses, median and p90 per spec, with the change since the
previous run.

PRIVATE BY DESIGN. The API's terms bar bulk redistribution and require a visible link back
on anything displayed, so nothing here writes API data into a repo. Snapshots live under
~/.local/state/nossuary/forever-logs/. A figure that reaches a page goes there by hand, with
the link. The key lives in ~/.config/nossuary/foreverlogs.key and is never printed.

A spec under 50 parses is marked as too thin to read. While only the Beta phase exists the figures are printed and labelled Beta, and each
snapshot compares only against one from the same phase.

Healers are derived, not listed. The spec keys change with the game's class model (Forever
has added Justicar and Gladiator), and `role` is not usable for healing metrics, which
return every spec. A healer is whatever has healing parses and is neither a dps-role nor a
tank-role spec. So a dps spec with no dps parses at all would land there, marked thin.

Landmine: the spec's default difficulty is `ascended`, which means nothing for dungeons, so
this asks for `all` by name.

Requests are spaced 30 seconds apart. Run by hand; nothing schedules it.

ALWAYS ENDS WITH ONE VERDICT LINE beginning `forever-logs:` (AI-Infra DR-0093).
"""
from __future__ import annotations

import datetime
import json
import os
import pathlib
import sys
import time
import urllib.error
import urllib.parse
import urllib.request

API = "https://foreverlogs.gg/api/public/v1"
SITE = "https://foreverlogs.gg"
KEY_FILE = pathlib.Path.home() / ".config" / "nossuary" / "foreverlogs.key"
STATE = pathlib.Path.home() / ".local" / "state" / "nossuary" / "forever-logs"
UA = "nossuary.com guide checks"

LOCATION = "All Dungeons"
THIN = 50
GAP = 30  # seconds between requests

_sent = False


class NoRedirect(urllib.request.HTTPRedirectHandler):
    """urllib carries Authorization across a redirect, to whichever host it names."""

    def redirect_request(self, *args, **kwargs):
        return None


OPENER = urllib.request.build_opener(NoRedirect)


class ApiError(Exception):
    pass


def get(key: str, path: str, **query):
    global _sent
    if _sent:
        time.sleep(GAP)
    _sent = True
    url = f"{API}{path}"
    if query:
        url += "?" + urllib.parse.urlencode(query)
    req = urllib.request.Request(url, headers={"Authorization": f"Bearer {key}", "User-Agent": UA})
    try:
        with OPENER.open(req, timeout=30) as r:
            data = json.load(r)
    except urllib.error.HTTPError as e:
        try:
            code = json.loads(e.read()).get("error", "")
        except (ValueError, AttributeError):
            code = ""
        wait = e.headers.get("Retry-After")
        raise ApiError(f"{path} returned HTTP {e.code} {code}"
                       f"{f', retry after {wait}s' if wait else ''}".strip()) from None
    except (urllib.error.URLError, TimeoutError, ValueError) as e:
        raise ApiError(f"{path} could not be read: {e}") from None
    if not data.get("success"):
        raise ApiError(f"{path} answered without success: {data.get('error')}")
    return data


def pick_phase(phases: list) -> tuple[dict | None, str]:
    """The phase to read, and a plain sentence when it is not a live one."""
    active = [p for p in phases if p.get("is_active")]
    live = [p for p in active if "beta" not in p["name"].lower()]
    newest = lambda rows: max(rows, key=lambda p: p["phase_number"]) if rows else None
    if live:
        return newest(live), ""
    if all("beta" in p["name"].lower() for p in phases):
        return newest(active), "Only the Beta phase exists: there is no live phase to read."
    return newest(active), "Phases exist beyond Beta but none is active."


def spec_rows(data: dict) -> dict:
    """{"Class/Spec": {parses, median, p90}} from a /statistics answer."""
    rows = {}
    for cls, body in data["statistics"].items():
        for spec, s in body["specs"].items():
            rows[f"{cls}/{spec}"] = {"parses": s["total_parses"], "median": s["median"],
                                     "p90": s["percentiles"]["p90"]}
    return rows


def change(row: dict, old: dict | None) -> str:
    if old is None:
        return "new"
    return (f"parses {row['parses'] - old['parses']:+d}, "
            f"median {row['median'] - old['median']:+.1f}, "
            f"p90 {row['p90'] - old['p90']:+.1f}")


def read_previous(today: str, phase: int) -> tuple[dict | None, str]:
    """The newest earlier snapshot to compare with, and how to describe the comparison."""
    earlier = sorted(p for p in STATE.glob("????-??-??.json") if p.stem < today)
    if not earlier:
        return None, "first snapshot, no change to report"
    try:
        prev = json.loads(earlier[-1].read_text(encoding="utf-8"))
        if prev["phase"] != phase:
            return None, f"{earlier[-1].stem} was phase {prev['phase']}, not compared"
        prev["metrics"]
    except (ValueError, KeyError, TypeError) as e:
        return None, f"{earlier[-1].name} is unreadable, not compared: {e!r}"
    return prev, f"against {earlier[-1].stem}"


def write_snapshot(today: str, snapshot: dict) -> None:
    for d in (STATE.parent, STATE):
        d.mkdir(mode=0o700, parents=True, exist_ok=True)
    fd = os.open(STATE / f"{today}.json", os.O_WRONLY | os.O_CREAT | os.O_TRUNC, 0o600)
    with os.fdopen(fd, "w", encoding="utf-8") as f:
        json.dump(snapshot, f, indent=1, sort_keys=True)


def report(title: str, unit: str, rows: dict, old: dict | None) -> int:
    """Print one role's table. Returns how many specs are too thin to read."""
    print(f"\n{title} ({unit})")
    print(f"  {'spec':<28}{'parses':>7}{'median':>9}{'p90':>9}  change")
    thin = 0
    for name, row in sorted(rows.items(), key=lambda kv: -kv[1]["median"]):
        mark = ""
        if row["parses"] < THIN:
            thin += 1
            mark = "  [too thin to read]"
        delta = "" if old is None else change(row, old.get(name))
        print(f"  {name:<28}{row['parses']:>7}{row['median']:>9.1f}{row['p90']:>9.1f}  {delta}{mark}")
    for name in sorted(set(old or ()) - set(rows)):
        print(f"  {name:<28}gone since the previous snapshot")
    return thin


def verdict(line: str) -> None:
    print(f"forever-logs: {line}")
    sys.exit(0)


def main() -> None:
    try:
        key = KEY_FILE.read_text(encoding="utf-8").strip()
    except OSError as e:
        verdict(f"FAIL -- could not read the API key file: {e.strerror}")
    if not key:
        verdict(f"FAIL -- {KEY_FILE} is empty")

    try:
        phases = get(key, "/phases")["phases"]
        phase, caveat = pick_phase(phases)
        if phase is None:
            verdict(f"FAIL -- none of {len(phases)} phase(s) is active")
        number = phase["phase_number"]
        ask = dict(phase=number, location=LOCATION, difficulty="all")
        dps = spec_rows(get(key, "/statistics", metric="avg_dps", role="dps", **ask))
        tanks = spec_rows(get(key, "/statistics", metric="avg_dtps", role="tank", **ask))
        healing = spec_rows(get(key, "/statistics", metric="avg_hps", **ask))
    except ApiError as e:
        verdict(f"FAIL -- {e}")
    except (KeyError, TypeError, AttributeError) as e:
        verdict(f"FAIL -- the API's answer has changed shape: {e!r}")

    healers = {k: v for k, v in healing.items() if k not in dps and k not in tanks}
    metrics = {"dps": dps, "hps": healers, "dtps": tanks}
    empty = [m for m, rows in metrics.items() if not rows]
    if empty:
        verdict(f"FAIL -- no specs for {', '.join(empty)} in {LOCATION}, phase {number}; "
                "no snapshot written")

    today = datetime.date.today().isoformat()
    prev, compared = read_previous(today, number)
    print(f"Forever Logs, phase {number} \"{phase['name']}\", {LOCATION}. Source: {SITE}")
    if caveat:
        print(caveat + f" The figures below are {phase['name']} figures.")
    print(f"Change: {compared}.")

    thin = 0
    for title, unit, metric in (("Damage", "avg_dps, role dps", "dps"),
                                ("Healing", "avg_hps, healer specs", "hps"),
                                ("Tanking", "avg_dtps, role tank", "dtps")):
        old = prev["metrics"].get(metric, {}) if prev else None
        thin += report(title, unit, metrics[metric], old)

    specs = sum(len(r) for r in metrics.values())
    try:
        write_snapshot(today, {"date": today, "phase": number, "phase_name": phase["name"],
                               "location": LOCATION, "metrics": metrics})
    except OSError as e:
        verdict(f"FAIL -- snapshot not written: {e.strerror}")

    state = "OK" if not caveat else "BETA ONLY" if "Only the Beta" in caveat else "REVIEW"
    verdict(f"{state} -- phase {number} \"{phase['name']}\", {specs} spec(s) read from "
            f"foreverlogs.gg, {thin} too thin to read (under {THIN} parses); {compared}")


if __name__ == "__main__":
    main()
