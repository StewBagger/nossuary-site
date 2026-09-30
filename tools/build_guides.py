#!/usr/bin/env python3
"""Render the WoW: Forever class guides from guides/_src/*.md into guides/wow-forever/.

The site has no build step and that stays true: this is a one-off generator whose OUTPUT is
committed, the same arrangement as branding/*/src/render.sh. Run it after editing a source
file, then commit the generated HTML.

    python3 tools/build_guides.py

Markdown support is deliberately small -- headings, paragraphs, lists, tables, blockquotes,
bold/italic/code and links. That is everything the guides use. It is NOT a general renderer
and it does not escape HTML in a security-relevant way, because the only input is this repo's
own source files. Never point it at anything a user can write.
"""
import html
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = ROOT / "guides" / "_src"
OUT = ROOT / "guides" / "wow-forever"
STAMP = "20260930-1"

# slug -> (display name, accent hex, one-line hook for the hub cards)
# slug -> (display name, accent hex, roles, one-line hook)
# The hook is written for someone who has never played -- the hub is the entry point, so
# it says what the class IS, not what Forever changed about it.
CLASSES = [
    ("warrior", "Warrior", "#c79c6e", "Tank \u00b7 Melee",
     "Plate-armoured fighter. Tanks or deals damage, and heals nobody. Hard early, formidable late."),
    ("paladin", "Paladin", "#f58cba", "Tank \u00b7 Healer \u00b7 Melee",
     "Plate hybrid that can do all three jobs. Very hard to kill, historically slow at killing."),
    ("hunter", "Hunter", "#abd473", "Ranged",
     "Ranged weapons and a pet that fights for you. The easiest class to level alone."),
    ("rogue", "Rogue", "#fff569", "Melee",
     "Stealth, daggers and burst damage. Kills fast, dies fast, and picks its fights."),
    ("priest", "Priest", "#ffffff", "Healer \u00b7 Ranged",
     "The archetypal healer \u2014 and a shadow caster if you would rather deal the damage."),
    ("shaman", "Shaman", "#3e9bff", "Healer \u00b7 Ranged \u00b7 Melee",
     "Elemental hybrid built around totems: short-lived objects that buff everyone near them."),
    ("mage", "Mage", "#69ccf0", "Ranged",
     "The highest burst damage and the thinnest body in the game. Conjures its own food and water."),
    ("warlock", "Warlock", "#9482c9", "Ranged",
     "A demon fights beside you while curses kill slowly. Trades its own health for mana."),
    ("druid", "Druid", "#ff7d0a", "Tank \u00b7 Healer \u00b7 Ranged \u00b7 Melee",
     "The shapeshifter \u2014 bear, cat and caster forms. The most flexible class in the game."),
]
NAMES = {s: n for s, n, _, _, _ in CLASSES}
ACCENTS = {s: a for s, _, a, _, _ in CLASSES}

INLINE = [
    (re.compile(r"\[([^\]]+)\]\(([^)]+)\)"), r'<a href="\2" rel="noopener">\1</a>'),
    (re.compile(r"\*\*(.+?)\*\*"), r"<strong>\1</strong>"),
    (re.compile(r"(?<![*\w])\*([^*]+)\*(?!\*)"), r"<em>\1</em>"),
    (re.compile(r"`([^`]+)`"), r"<code>\1</code>"),
]


def inline(text):
    text = html.escape(text, quote=False)
    for pat, rep in INLINE:
        text = pat.sub(rep, text)
    return text


def render(md, headings=None):
    if headings is None:
        headings = []
    out, lines, i = [], md.split("\n"), 0
    while i < len(lines):
        line = lines[i]
        if not line.strip():
            i += 1
            continue
        if line.startswith("### "):
            out.append(f"<h3>{inline(line[4:])}</h3>")
            i += 1
        elif line.startswith("## "):
            text = line[3:]
            slug = re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")
            headings.append((slug, text))
            out.append(f'<h2 id="{slug}">{inline(text)}</h2>')
            i += 1
        elif line.startswith("> "):
            buf = []
            while i < len(lines) and lines[i].startswith("> "):
                buf.append(inline(lines[i][2:]))
                i += 1
            out.append("<blockquote><p>" + " ".join(buf) + "</p></blockquote>")
        elif line.startswith("|"):
            rows = []
            while i < len(lines) and lines[i].startswith("|"):
                rows.append([c.strip() for c in lines[i].strip().strip("|").split("|")])
                i += 1
            head, body = rows[0], [r for r in rows[2:]]
            t = ["<div class=\"guide-table\"><table><thead><tr>"]
            t += [f"<th>{inline(c)}</th>" for c in head]
            t.append("</tr></thead><tbody>")
            for r in body:
                t.append("<tr>" + "".join(f"<td>{inline(c)}</td>" for c in r) + "</tr>")
            t.append("</tbody></table></div>")
            out.append("".join(t))
        elif re.match(r"^\d+\. ", line) or line.startswith("- "):
            ordered = bool(re.match(r"^\d+\. ", line))
            tag = "ol" if ordered else "ul"
            items = []
            while i < len(lines) and (
                re.match(r"^\d+\. ", lines[i]) if ordered else lines[i].startswith("- ")
            ):
                items.append(inline(re.sub(r"^(\d+\. |- )", "", lines[i])))
                i += 1
            out.append(f"<{tag}>" + "".join(f"<li>{x}</li>" for x in items) + f"</{tag}>")
        else:
            # One source line is one paragraph. These sources never wrap a paragraph
            # across lines, so joining adjacent lines would silently weld separate
            # paragraphs into a wall of text.
            out.append("<p>" + inline(line) + "</p>")
            i += 1
    return "\n        ".join(out)


def contents(headings):
    """An on-page contents list. These guides run long and serve two audiences at once --
    someone new to the class and someone who only wants the Forever diff -- so the jump
    list is doing real work, not decoration."""
    if len(headings) < 3:
        return ""
    items = "".join(f'<li><a href="#{s}">{html.escape(t)}</a></li>' for s, t in headings)
    return ('<nav class="guide-toc" aria-labelledby="toc-h">'
            '<p class="eyebrow" id="toc-h">On this page</p>'
            f"<ul>{items}</ul></nav>")


def nav(active):
    items = [
        ("/#play", "Play"), ("/#mods", "Mods"), ("/forums/", "Forums"),
        ("/guides/wow-forever/", "Guides"), ("/#support", "Support"),
        ("/#work", "Workshop"), ("/#contact", "Contact"),
    ]
    li = []
    for href, label in items:
        cur = ' aria-current="page"' if label == "Guides" and active else ""
        li.append(f'<li><a href="{href}"{cur}>{label}</a></li>')
    return "\n        ".join(li)


def page(slug, title, desc, lede, body, crest, canonical, crumb=None, accent=None):
    style = f' style="--class-accent:{accent}"' if accent else ""
    crumbs = ""
    if crumb:
        crumbs = (
            '<nav class="crumbs" aria-label="Breadcrumb"><ol>'
            '<li><a href="/">Home</a></li>'
            '<li><a href="/guides/wow-forever/">WoW: Forever</a></li>'
            f'<li aria-current="page">{html.escape(crumb)}</li>'
            "</ol></nav>"
        )
    return f"""<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <!-- Generated by tools/build_guides.py from guides/_src/{slug}.md -- edit the source, not this file. -->
  <meta http-equiv="Content-Security-Policy" content="default-src 'self'; img-src 'self'; script-src 'none'; style-src 'self'; object-src 'none'; base-uri 'none'; form-action 'none'">
  <meta name="theme-color" content="#0b0d0c">
  <title>{html.escape(title)}</title>
  <meta name="description" content="{html.escape(desc)}">
  <link rel="canonical" href="{canonical}">
  <meta property="og:title" content="{html.escape(title)}">
  <meta property="og:description" content="{html.escape(desc)}">
  <meta property="og:image" content="https://nossuary.com/assets/guides/wow-forever/og-1200x630.jpg">
  <link rel="icon" type="image/png" sizes="32x32" href="/assets/favicon-32.png">
  <link rel="apple-touch-icon" href="/assets/apple-touch-icon.png">
  <link rel="stylesheet" href="/css/style.css?v=20260918-2">
  <link rel="stylesheet" href="/css/guides.css?v={STAMP}">
</head>
<body class="forum guide"{style}>
  <a class="skip" href="#guide-main">Skip to content</a>

  <header class="nav" id="top">
    <a class="brand" href="/" aria-label="Null Ossuary home">
      <img src="/assets/emblem-256.webp" alt="" width="36" height="36">
      <span>Null Ossuary</span>
    </a>
    <nav aria-label="Primary">
      <ul>
        {nav(True)}
        <li><a class="btn btn-sm" href="https://discord.gg/PtMaTp385b" target="_blank" rel="noopener">Join Discord</a></li>
      </ul>
    </nav>
  </header>

  <main class="forum-page">
    <section class="forum-hero guide-hero" aria-labelledby="guide-title">
      <div class="wrap guide-hero-inner">
        <img class="guide-crest" src="/assets/guides/wow-forever/{crest}-256.webp" alt="" width="128" height="128">
        <div>
          <p class="eyebrow">WoW: Forever</p>
          <h1 id="guide-title">{html.escape(title.split(' · ')[0])}</h1>
          <p class="lede">{lede}</p>
        </div>
      </div>
    </section>

    <div class="wrap forum-wrap" id="guide-main">
      {crumbs}
      <div class="section-head guide-body">
        {body}
      </div>
    </div>
  </main>

  <footer class="footer">
    <div class="wrap footer-inner">
      <span class="brand">
        <img src="/assets/emblem-256.webp" alt="" width="28" height="28" loading="lazy">
        <span>Null Ossuary</span>
      </span>
      <span class="muted small">WoW: Forever class guides · <a href="/">nossuary.com</a> · World of Warcraft is a trademark of Blizzard Entertainment; not affiliated.</span>
    </div>
  </footer>
</body>
</html>
"""


def main():
    if not SRC.exists():
        sys.exit(f"no source directory: {SRC}")
    written = []

    for slug, name, accent, roles, hook in CLASSES:
        md = SRC / f"{slug}.md"
        if not md.exists():
            print(f"  skip {slug} (no source yet)")
            continue
        text = md.read_text()
        lede = text.split("\n")[0].lstrip("> ").strip()
        headings = []
        body = render("\n".join(text.split("\n")[1:]), headings)
        body = contents(headings) + "\n        " + body
        d = OUT / slug
        d.mkdir(parents=True, exist_ok=True)
        (d / "index.html").write_text(page(
            slug, f"{name} · WoW: Forever · Null Ossuary",
            hook, inline(lede), body, slug,
            f"https://nossuary.com/guides/wow-forever/{slug}/", name, accent))
        written.append(slug)
        print(f"  wrote guides/wow-forever/{slug}/index.html")

    # the hub
    cards = []
    for slug, name, accent, roles, hook in CLASSES:
        live = (OUT / slug / "index.html").exists()
        href = f"/guides/wow-forever/{slug}/" if live else None
        tag = "a" if live else "div"
        attr = f' href="{href}"' if live else ' aria-disabled="true"'
        soon = "" if live else '<span class="guide-soon">coming soon</span>'
        cards.append(
            f'<{tag} class="guide-card"{attr} style="--class-accent:{accent}">'
            f'<img src="/assets/guides/wow-forever/{slug}-256.webp" alt="" width="96" height="96" loading="lazy">'
            f'<span class="guide-card-name">{name}{soon}</span>'
            f'<span class="guide-card-roles">{html.escape(roles)}</span>'
            f'<span class="guide-card-hook">{inline(hook)}</span></{tag}>')
    hub_md = SRC / "index.md"
    intro = render("\n".join(hub_md.read_text().split("\n")[1:]), []) if hub_md.exists() else ""
    lede = hub_md.read_text().split("\n")[0].lstrip("> ").strip() if hub_md.exists() else ""
    body = f'<div class="guide-grid">{"".join(cards)}</div>\n        {intro}'
    OUT.mkdir(parents=True, exist_ok=True)
    (OUT / "index.html").write_text(page(
        "index", "WoW: Forever class guides · Null Ossuary",
        "Class guides for World of Warcraft: Forever, with every claim tagged by how well it is sourced.",
        inline(lede), body, "index",
        "https://nossuary.com/guides/wow-forever/"))
    print("  wrote guides/wow-forever/index.html")
    print(f"\n{len(written)} class page(s) + hub")


if __name__ == "__main__":
    main()
