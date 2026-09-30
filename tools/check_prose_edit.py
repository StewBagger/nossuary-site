#!/usr/bin/env python3
"""Guard a prose-only edit: prove the facts survived.

A copy-editing pass must not change what the guides SAY. This diffs every
source file against a git ref and fails on anything that is not prose:
numbers, [[ability chips]], `talent names`, table shape, headings, and the
count of list items. Run it before committing a rewrite.

    python3 tools/check_prose_edit.py [git-ref]
"""
import re, subprocess, sys, pathlib

REF = sys.argv[1] if len(sys.argv) > 1 else "HEAD"
SRC = pathlib.Path("guides/_src")

def facts(text):
    return {
        # Every number, with its decimal point and percent sign.
        "numbers": sorted(re.findall(r"\d+(?:[.,]\d+)?%?", text)),
        # Presence, not repetition: a copy-edit may legitimately turn a second
        # mention into "which". Losing a name altogether is what must fail.
        "chips": sorted(set(re.findall(r"\[\[([^\]]+)\]\]", text))),
        "code": sorted(set(re.findall(r"`([^`]+)`", text))),
        "headings": [l.strip() for l in text.split("\n") if l.startswith("##")],
        "directives": [l.strip() for l in text.split("\n") if l.startswith(":::")],
        # Table shape: the pipe count of every table row, in order.
        "table_shape": [l.count("|") for l in text.split("\n") if l.startswith("|")],
        "list_items": len([l for l in text.split("\n")
                           if re.match(r"^\s*(?:\d+\.|[-*]) ", l)]),
    }

fails = 0
for p in sorted(SRC.glob("*.md")):
    try:
        before = subprocess.run(["git", "show", f"{REF}:{p}"], capture_output=True,
                                text=True, check=True).stdout
    except subprocess.CalledProcessError:
        print(f"  NEW  {p.name} (not in {REF}, skipped)")
        continue
    a, b = facts(before), facts(p.read_text())
    for k in a:
        if a[k] != b[k]:
            fails += 1
            print(f"FAIL {p.name}: {k} changed")
            if k in ("numbers", "chips", "code"):
                lost = sorted(set(a[k]) - set(b[k]))
                added = sorted(set(b[k]) - set(a[k]))
                if lost:  print(f"       lost:  {lost[:8]}")
                if added: print(f"       added: {added[:8]}")
            else:
                print(f"       before: {str(a[k])[:120]}")
                print(f"       after:  {str(b[k])[:120]}")
print(f"\n{fails} fact-level difference(s)")
sys.exit(1 if fails else 0)
