#!/usr/bin/env python3
"""Render the WoW: Forever class guides from guides/_src/*.md into guides/wow-forever/.

The site has no build step and that stays true: this generator's OUTPUT is committed, the
same arrangement as branding/*/src/render.sh. Run it after editing a source file, then
commit the generated HTML.

    python3 tools/build_guides.py

SOURCE FORMAT. A small superset of markdown, shaped by how the established guide sites
actually build a class page:

    key: value          front matter, until the first blank line
    <blank>
    First line          the standfirst -- one or two sentences that carry information,
                        not "welcome to our guide"
    :::scope            the ONE uncertainty box. All hedging lives here. Body prose is
    ...                 written in the indicative; a genuinely shaky claim gets a single
    :::                 "seems" inside the sentence, never a hedging sentence.
    :::new              "New to this class?" -- bounded, ~80 words, four questions. The
    ...                 whole newcomer budget. Softening the entire page instead is what
    :::                 dilutes it for both audiences.
    :::strengths        three bullets, one line each
    :::weaknesses       three bullets, one line each
    ## Heading          normal sections; H2s get anchors and feed the contents list
    | a | b |           pipe tables
    1. / -              lists
    [[Ability]]         an ability chip -- styled, so a reader can scan for it

Everything a player executes -- rotation, stat priority, talent order -- must be a
numbered list with one action per line, never a paragraph. That is the single most common
defect in a hand-written guide.
"""
import html
import pathlib
import re
import sys
from datetime import date

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = ROOT / "guides" / "_src"
OUT = ROOT / "guides" / "wow-forever"
STAMP = "20260930-2"

# slug -> (display name, accent hex, roles, one-line hook for the hub cards)
CLASSES = [
    ("warrior", "Warrior", "#c79c6e", "Tank · Melee",
     "Plate-armoured fighter. Tanks or deals damage, and heals nobody. Hard early, formidable late."),
    ("paladin", "Paladin", "#f58cba", "Tank · Healer · Melee",
     "Plate hybrid that can do all three jobs. Very hard to kill, historically slow at killing."),
    ("hunter", "Hunter", "#abd473", "Ranged",
     "Ranged weapons and a pet that fights for you. The easiest class to level alone."),
    ("rogue", "Rogue", "#fff569", "Melee",
     "Stealth, daggers and burst damage. Kills fast, dies fast, and picks its fights."),
    ("priest", "Priest", "#ffffff", "Healer · Ranged",
     "The archetypal healer — and a shadow caster if you would rather deal the damage."),
    ("shaman", "Shaman", "#3e9bff", "Healer · Ranged · Melee",
     "Elemental hybrid built around totems: short-lived objects that buff everyone near them."),
    ("mage", "Mage", "#69ccf0", "Ranged",
     "The highest burst damage and the thinnest body in the game. Conjures its own food and water."),
    ("warlock", "Warlock", "#9482c9", "Ranged",
     "A demon fights beside you while curses kill slowly. Trades its own health for mana."),
    ("druid", "Druid", "#ff7d0a", "Tank · Healer · Ranged · Melee",
     "The shapeshifter — bear, cat and caster forms. The most flexible class in the game."),
]

INLINE = [
    (re.compile(r"\[\[([^\]]+)\]\]"), r'<span class="ab">\1</span>'),
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


def slugify(text):
    return re.sub(r"[^a-z0-9]+", "-", re.sub(r"<[^>]+>", "", text).lower()).strip("-")


def blocks(md, headings):
    """Render the source body. Returns HTML."""
    out, lines, i = [], md.split("\n"), 0
    while i < len(lines):
        line = lines[i]
        if not line.strip():
            i += 1
            continue

        m = re.match(r"^:::(scope|new|strengths|weaknesses)\s*$", line)
        if m:
            kind, buf = m.group(1), []
            i += 1
            while i < len(lines) and not lines[i].startswith(":::"):
                buf.append(lines[i])
                i += 1
            i += 1  # closing :::
            out.append(directive(kind, buf, headings))
            continue

        if line.startswith("### "):
            out.append(f"<h3>{inline(line[4:])}</h3>")
            i += 1
        elif line.startswith("## "):
            text = line[3:]
            slug = slugify(text)
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
            head, body = rows[0], rows[2:]
            t = ['<div class="guide-table"><table><thead><tr>']
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
            # across lines, so joining adjacent lines would weld separate paragraphs
            # into a wall of text.
            out.append("<p>" + inline(line) + "</p>")
            i += 1
    return "\n        ".join(out)


def directive(kind, buf, headings):
    body = blocks("\n".join(buf), [])
    if kind == "scope":
        return ('<aside class="guide-scope" aria-label="Scope and accuracy">'
                f"{body}</aside>")
    if kind == "new":
        headings.append(("new-to-this-class", "New to this class?"))
        return ('<aside class="guide-newbox" id="new-to-this-class">'
                '<p class="eyebrow">New to this class?</p>' + body + "</aside>")
    cls = "pros" if kind == "strengths" else "cons"
    label = "Strengths" if kind == "strengths" else "Weaknesses"
    return (f'<aside class="guide-sw {cls}"><p class="eyebrow">{label}</p>{body}</aside>')


SCOPE_RE = re.compile(r'(<aside class="guide-scope".*?</aside>)', re.S)


def hoist_scope(body):
    """Pull the scope box out of the body so it can sit ABOVE the contents list.

    Every guide site studied puts its one uncertainty notice immediately after the
    standfirst and before the first heading -- a reader must know what the page reflects
    before they start acting on it, not after scrolling past a table of contents.
    """
    m = SCOPE_RE.search(body)
    if not m:
        return "", body
    return m.group(1), body.replace(m.group(1), "", 1).strip()


def contents(headings):
    if len(headings) < 3:
        return ""
    items = "".join(f'<li><a href="#{s}">{html.escape(re.sub("<[^>]+>", "", t))}</a></li>'
                    for s, t in headings)
    return ('<nav class="guide-toc" aria-labelledby="toc-h">'
            '<p class="eyebrow" id="toc-h">On this page</p>'
            f"<ul>{items}</ul></nav>")


def nav():
    items = [("/#play", "Play"), ("/#mods", "Mods"), ("/forums/", "Forums"),
             ("/guides/wow-forever/", "Guides"), ("/#support", "Support"),
             ("/#work", "Workshop"), ("/#contact", "Contact")]
    return "\n        ".join(
        f'<li><a href="{h}"{" aria-current=\"page\"" if l == "Guides" else ""}>{l}</a></li>'
        for h, l in items)


def frontmatter(text):
    meta, body = {}, text
    if not text.startswith("---"):
        lines = text.split("\n")
        n = 0
        while n < len(lines) and re.match(r"^\w[\w-]*:\s", lines[n]):
            k, v = lines[n].split(":", 1)
            meta[k.strip()] = v.strip()
            n += 1
        if n:
            body = "\n".join(lines[n:]).lstrip("\n")
    return meta, body


def page(slug, title, desc, standfirst, body, crest, canonical, crumb=None,
         accent=None, meta=None):
    meta = meta or {}
    # NOTE: no inline style attribute anywhere on these pages. The CSP is
    # style-src 'self', which blocks style="" outright -- an inline custom property is
    # silently dropped and every accent falls back to the site default. Per-class accents
    # live in css/guides.css keyed off this class instead.
    style = f" guide-{slug}" if accent else ""
    crumbs = ""
    if crumb:
        crumbs = ('<nav class="crumbs" aria-label="Breadcrumb"><ol>'
                  '<li><a href="/">Home</a></li>'
                  '<li><a href="/guides/wow-forever/">WoW: Forever</a></li>'
                  f'<li aria-current="page">{html.escape(crumb)}</li></ol></nav>')
    stamped = meta.get("updated", date.today().isoformat())
    build = meta.get("build", "")
    bits = [f'<span class="gm-ver">WoW: Forever</span>',
            f'<span>Updated {html.escape(stamped)}</span>']
    if build:
        bits.append(f'<span>Beta build {html.escape(build)}</span>')
    bits.append('<span>Null Ossuary</span>')
    metaline = '<p class="guide-meta">' + " · ".join(bits) + "</p>"

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
<body class="forum guide{style}">
  <a class="skip" href="#guide-main">Skip to content</a>

  <header class="nav" id="top">
    <a class="brand" href="/" aria-label="Null Ossuary home">
      <img src="/assets/emblem-256.webp" alt="" width="36" height="36">
      <span>Null Ossuary</span>
    </a>
    <nav aria-label="Primary">
      <ul>
        {nav()}
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
          <p class="lede">{standfirst}</p>
        </div>
      </div>
    </section>

    <div class="wrap forum-wrap" id="guide-main">
      {crumbs}
      {metaline}
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
        meta, text = frontmatter(md.read_text())
        lines = text.split("\n")
        standfirst = inline(lines[0].strip())
        headings = []
        body = blocks("\n".join(lines[1:]), headings)
        scope, body = hoist_scope(body)
        body = scope + "\n        " + contents(headings) + "\n        " + body
        d = OUT / slug
        d.mkdir(parents=True, exist_ok=True)
        (d / "index.html").write_text(page(
            slug, f"{name} · WoW: Forever · Null Ossuary", hook, standfirst,
            body, slug, f"https://nossuary.com/guides/wow-forever/{slug}/",
            name, accent, meta))
        written.append(slug)
        print(f"  wrote guides/wow-forever/{slug}/index.html")

    cards = []
    for slug, name, accent, roles, hook in CLASSES:
        live = (OUT / slug / "index.html").exists()
        tag = "a" if live else "div"
        attr = f' href="/guides/wow-forever/{slug}/"' if live else ' aria-disabled="true"'
        soon = "" if live else '<span class="guide-soon">coming soon</span>'
        cards.append(
            f'<{tag} class="guide-card guide-{slug}"{attr}>'
            f'<img src="/assets/guides/wow-forever/{slug}-256.webp" alt="" width="96" height="96" loading="lazy">'
            f'<span class="guide-card-name">{name}{soon}</span>'
            f'<span class="guide-card-roles">{html.escape(roles)}</span>'
            f'<span class="guide-card-hook">{inline(hook)}</span></{tag}>')

    hub_md = SRC / "index.md"
    meta, text = frontmatter(hub_md.read_text()) if hub_md.exists() else ({}, "")
    lines = text.split("\n")
    standfirst = inline(lines[0].strip()) if lines else ""
    headings = []
    intro = blocks("\n".join(lines[1:]), headings) if hub_md.exists() else ""
    scope, intro = hoist_scope(intro)
    body = (scope + "\n        " + contents(headings)
            + f'\n        <div class="guide-grid">{"".join(cards)}</div>\n        ' + intro)
    OUT.mkdir(parents=True, exist_ok=True)
    (OUT / "index.html").write_text(page(
        "index", "WoW: Forever class guides · Null Ossuary",
        "Levelling guides for all nine classes in World of Warcraft: Forever.",
        standfirst, body, "index",
        "https://nossuary.com/guides/wow-forever/", None, None, meta))
    print("  wrote guides/wow-forever/index.html")
    print(f"\n{len(written)} class page(s) + hub")


if __name__ == "__main__":
    main()
