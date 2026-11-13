#!/usr/bin/env python3
"""Rebuild the guides against the current Forever client and publish the result.

    tools/nightly_publish.py [work-dir]

This is the `spell-index` routine's pre-step (AI-Infra DR-0096). It replaces the
hand-run sequence the routine used to print for a person to type:

    build_spell_index.py  ->  build_guides.py  ->  check_guides.py  ->  commit  ->  push

WHY IT PUBLISHES. Until 2026-10-15 this routine only looked. It compared a build
stamp and, when it moved, told a person the chips "may be wrong" and to go run the
rebuild themselves. Two things were wrong with that. The alarm fires on Blizzard
shipping ANY build, not on anything in the guides changing -- and whether a chip
actually moved is answerable only BY rebuilding, which it refused to do. So every
alarm escalated to a person whose first act had to be the rebuild it declined.
On 2026-10-15 the 70338 -> 70374 alarm turned out to be a four-line metadata bump
with all 914 entries identical and all 69 tracked pages byte-identical.
Owner's decision, 2026-10-15: rebuild, commit and push unattended
(Web-Development DR-0014, superseding the commit-time gate of DR-0006).

VERDICT LINES, NOT EXIT CODES -- and here that is a publish-safety rule, not just a
reporting convention (AI-Infra DR-0093). `build_spell_index.py` and `check_guides.py`
both print `FAIL -- ...` and then `sys.exit(0)`: every failure mode they have, from an
unreachable wago.tools to a broken rank rule to a mislinked chip, exits zero. A script
that trusted the exit code would cheerfully publish a broken rebuild. Every tool below
is judged by its verdict line and nothing else.

THE HOTFIX OVERLAY HAS A LINE OF ITS OWN AND IT NEVER DECIDES ANYTHING HERE. Since
2026-11-13 `build_spell_index.py` lays Raidbots' server hotfix cache over the client
tables and prints `hotfix-overlay: APPLIED|SKIPPED|REFUSED -- ...` before its verdict.
That line is carried into `result.json` (`overlay_verdict`), the commit message and this
run's own closing line, so a night the cache was unreachable is visible, but the publish
is judged by `spell-index:` alone: SKIPPED beside REBUILT publishes the base client's
reading, and REFUSED only ever comes beside a `spell-index: FAIL`, which stops the run as
any other FAIL does. A chip the overlay moves is a moved chip, counted like any other.

WHAT IT REFUSES TO DO. It aborts before touching anything if the tree is not in a
state it can reason about:
  - local `main` not level with `origin/main`  -> someone has unpushed work; pushing
    on top of it is not this routine's call.
  - any owned path already dirty              -> someone is mid-edit; a rebuild would
    sweep their work into an unattended commit (AI-Infra DR-0081).
  - `check_guides.py` says FAIL               -> the build is broken. The tree is left
    dirty on purpose, so a person sees it, and NOTHING is committed or pushed.
It only ever stages the paths it generates. `guides/_src/` is hand-written prose and is
never staged, however dirty it is.
"""
from __future__ import annotations

import json
import pathlib
import re
import subprocess
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
PY = "/usr/bin/python3"

# Everything the two builders generate, and nothing else. A path here is staged;
# a path not here is left alone no matter what state it is in.
OWNED = [
    "guides/_data/spells.json",
    "guides/wow-forever",
    "guides/index.html",
    "assets/spell-icons",
]

work = pathlib.Path(sys.argv[1]) if len(sys.argv) > 1 else None
report: dict = {"steps": []}


def verdict(line: str, **extra) -> None:
    """Print the closing line this run is judged by, record it, and stop."""
    report.update(extra)
    report["verdict"] = line
    if work and work.is_dir():
        (work / "result.json").write_text(json.dumps(report, indent=2) + "\n")
    print(f"spell-publish: {line}")
    sys.exit(0)


def git(*args: str, check: bool = True) -> str:
    p = subprocess.run(("git", *args), cwd=ROOT, capture_output=True, text=True)
    if check and p.returncode != 0:
        verdict(f"FAIL -- git {' '.join(args)} exited {p.returncode}: "
                f"{(p.stderr or p.stdout).strip()[:300]}")
    return p.stdout.strip()


def tool(name: str, prefix: str, also: dict[str, str] | None = None) -> str:
    """Run one build tool; return its verdict line (the last line starting `prefix:`).

    `also` maps a second line prefix to the report key it is recorded under. Such a line
    is information: it is written into result.json before anything here can stop the run,
    and it never changes what the run does.
    """
    print(f"-- {name}", flush=True)
    p = subprocess.run((PY, f"tools/{name}"), cwd=ROOT, capture_output=True, text=True)
    out = (p.stdout or "") + (p.stderr or "")
    print(out, end="" if out.endswith("\n") else "\n", flush=True)
    for extra, key in (also or {}).items():
        found = [ln.strip() for ln in out.splitlines() if ln.strip().startswith(f"{extra}:")]
        report[key] = (found[-1][len(extra) + 1:].strip() if found
                       else f"{name} printed no {extra}: line")
    lines = [ln.strip() for ln in out.splitlines() if ln.strip().startswith(f"{prefix}:")]
    line = lines[-1][len(prefix) + 1:].strip() if lines else ""
    report["steps"].append({"tool": name, "exit": p.returncode, "verdict": line})
    if not line:
        # No verdict line at all: the tool died before reaching one (build_guides.py
        # has no verdict convention and sys.exit()s a string on a missing source dir).
        if p.returncode != 0:
            verdict(f"FAIL -- {name} exited {p.returncode}: {out.strip().splitlines()[-1][:200]}"
                    if out.strip() else f"FAIL -- {name} exited {p.returncode} silently")
        return ""
    return line


def advisory(name: str, prefix: str) -> None:
    """Run a check whose result is recorded and can never stop a publish."""
    print(f"-- {name} (advisory)", flush=True)
    try:
        p = subprocess.run((PY, f"tools/{name}"), cwd=ROOT, capture_output=True, text=True,
                           timeout=120)
    except (OSError, subprocess.SubprocessError) as e:
        report[prefix] = f"did not run: {e}"
        return
    print(p.stdout, end="", flush=True)
    lines = [ln.strip() for ln in p.stdout.splitlines() if ln.startswith(f"{prefix}:")]
    report[prefix] = lines[-1] if lines else f"no verdict line, exit {p.returncode}"


# `XY path`, where X or Y may be a space -- and where git()'s strip() may already
# have eaten a leading one. Anchored on the status pair, so the path survives either.
PORCELAIN = re.compile(r"^\s*\S{1,2}\s+(?:.*->\s+)?(.+)$")


def paths_of(out: str) -> list[str]:
    """Paths from `git status --porcelain` output, leading-space-tolerant."""
    found = []
    for ln in out.splitlines():
        if not ln.strip():
            continue
        m = PORCELAIN.match(ln)
        if m:
            found.append(m.group(1).strip().strip('"'))
    return found


def index_at(ref: str) -> dict:
    """The whole spells.json a commit holds, or {} if it has none that reads."""
    p = subprocess.run(("git", "show", f"{ref}:guides/_data/spells.json"),
                       cwd=ROOT, capture_output=True, text=True)
    if p.returncode != 0:
        return {}
    try:
        doc = json.loads(p.stdout)
        return doc if isinstance(doc, dict) else {}
    except ValueError:
        return {}


def main() -> None:
    # ---- preconditions -------------------------------------------------------
    branch = git("rev-parse", "--abbrev-ref", "HEAD")
    if branch != "main":
        verdict(f"BLOCKED -- on branch {branch!r}, not main; nothing attempted")

    subprocess.run(("git", "fetch", "--quiet", "origin", "main"),
                   cwd=ROOT, capture_output=True, text=True)
    local, remote = git("rev-parse", "HEAD"), git("rev-parse", "origin/main")
    if local != remote:
        ahead = git("rev-list", "--count", "origin/main..HEAD")
        behind = git("rev-list", "--count", "HEAD..origin/main")
        verdict(f"BLOCKED -- local main is {ahead} ahead / {behind} behind origin/main; "
                f"someone has unpushed or unpulled work. Nothing attempted.")

    dirty = paths_of(git("status", "--porcelain", "--", *OWNED))
    if dirty:
        verdict(f"BLOCKED -- {len(dirty)} generated path(s) already dirty before this run, "
                f"so a rebuild would sweep someone else's work into an unattended commit: "
                f"{', '.join(dirty[:5])}"
                f"{' ...' if len(dirty) > 5 else ''}. Nothing attempted.",
                dirty=dirty)

    held = index_at("HEAD")
    before = held.get("entries") or {}
    advisory("check_talent_builds.py", "check-talents")

    # ---- rebuild the index ---------------------------------------------------
    v = tool("build_spell_index.py", "spell-index", also={"hotfix-overlay": "overlay_verdict"})
    report["index_verdict"] = v
    ov = f"hotfix-overlay: {report['overlay_verdict']}"
    if v.startswith("OK"):
        verdict(f"CURRENT -- nothing the index is built from has moved, so nothing was "
                f"rebuilt. {v}. {ov}")
    if v.startswith("FAIL"):
        verdict(f"FAIL -- the index rebuild failed and the previous index is still in "
                f"place, so the live site is unchanged. build_spell_index said: {v}. {ov}")
    if not v.startswith("REBUILT"):
        verdict(f"FAIL -- unrecognised verdict from build_spell_index.py: {v!r}")

    # ---- render and verify ---------------------------------------------------
    tool("build_guides.py", "guides")
    cv = tool("check_guides.py", "check-guides")
    report["check_verdict"] = cv
    if not cv.startswith("OK"):
        verdict(f"CHECK FAILED -- nothing committed, nothing pushed, and the rebuilt "
                f"files are left dirty in the tree on purpose so this is visible. "
                f"check_guides said: {cv or 'no verdict line'}")

    # ---- classify what actually changed -------------------------------------
    changed = paths_of(git("status", "--porcelain", "--", *OWNED))
    if not changed:
        verdict(f"CURRENT -- the index rebuilt but produced no change at all. {v}")

    try:
        built = json.loads((ROOT / "guides/_data/spells.json").read_text())
        after = built.get("entries", {})
    except (OSError, ValueError, AttributeError) as e:
        verdict(f"FAIL -- rebuilt spells.json is unreadable: {e}")
    # Which upstream this rebuild answered: a new client build, or the same build with
    # the server's hotfixes moved under it. Only the commit subject depends on it.
    now, was = built.get("overlay") or {}, held.get("overlay") or {}
    what = ("the client" if built.get("build") != held.get("build")
            else "the server's hotfixes" if now.get("state") == "applied" and now != was
            else "the base client alone, the hotfix cache being unreadable"
            if was.get("state") == "applied" and now.get("state") != "applied"
            else "the guides' own chip list")

    added = sorted(set(after) - set(before))
    removed = sorted(set(before) - set(after))
    moved = sorted(n for n in set(before) & set(after) if before[n] != after[n])
    other = [p for p in changed if p != "guides/_data/spells.json"]
    content = bool(added or removed or moved or other)
    report.update({"added": added, "removed": removed, "moved": moved,
                   "other_files": other, "content_change": content,
                   "changed_count": len(changed)})

    if content:
        bits = []
        if moved:
            bits.append(f"{len(moved)} chip(s) changed ({', '.join(moved[:8])}"
                        f"{' ...' if len(moved) > 8 else ''})")
        if added:
            bits.append(f"{len(added)} newly resolved ({', '.join(added[:8])}"
                        f"{' ...' if len(added) > 8 else ''})")
        if removed:
            bits.append(f"{len(removed)} no longer resolve ({', '.join(removed[:8])}"
                        f"{' ...' if len(removed) > 8 else ''})")
        icons = [p for p in other if p.startswith("assets/spell-icons")]
        pages = [p for p in other if p.startswith("guides/") and p.endswith(".html")]
        if icons:
            bits.append(f"{len(icons)} icon file(s)")
        if pages:
            bits.append(f"{len(pages)} page(s) re-rendered")
        summary = "; ".join(bits) or f"{len(changed)} file(s)"
        subject = f"guides: the spell index catches up to {what}, and the pages moved with it"
    else:
        summary = ("no entry, icon or page changed -- only the index's own metadata "
                   "header (build, generated, stamp, inputs, overlay)")
        subject = f"guides: the spell index catches up to {what}, and nothing else moved"
    report["summary"] = summary

    # ---- commit and push ----------------------------------------------------
    git("add", "--", *OWNED)
    body = (f"{subject}\n\n"
            f"Unattended `spell-index` routine. {v}\n"
            f"{ov}\n"
            f"check_guides: {cv}\n\n"
            f"What changed: {summary}.\n\n"
            f"Published unattended by the owner's decision of 2026-10-15\n"
            f"(Web-Development DR-0014, superseding DR-0006's commit-time gate).\n\n"
            f"Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>\n")
    git("commit", "--quiet", "-m", body, "--", *OWNED)
    sha = git("rev-parse", "--short", "HEAD")
    report["commit"] = sha

    p = subprocess.run(("git", "push", "origin", "main"), cwd=ROOT,
                       capture_output=True, text=True)
    print((p.stdout or "") + (p.stderr or ""), flush=True)
    if p.returncode != 0:
        verdict(f"COMMITTED BUT NOT PUSHED -- {sha} is committed locally and the push "
                f"failed, so the live site does not have it yet: "
                f"{(p.stderr or p.stdout).strip().splitlines()[-1][:200]}")
    report["pushed"] = True

    kind = "CONTENT" if content else "METADATA ONLY"
    verdict(f"PUBLISHED ({kind}) -- {sha} pushed to origin/main. {summary}. {v}. {ov}")


if __name__ == "__main__":
    main()
