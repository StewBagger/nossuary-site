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
    [[Ability]]         an ability chip. Named in guides/_data/spells.json: a link to the
                        ability with its icon and a CSS-only tooltip. Not named there: the
                        plain styled chip it has always been, so a removed ability or a
                        pet name never becomes a dead link.
    `Talent`            a talent. Linked from the same index and given the same tooltip,
                        but it keeps its <code> look and takes no icon -- the guides draw
                        a real line between an ability and a talent, and flattening the
                        two into one appearance would erase it. Unknown terms (a stat
                        string, a macro) stay plain <code>, which is why the index is
                        allowed to not know things.

Everything a player executes -- rotation, stat priority, talent order -- must be a
numbered list with one action per line, never a paragraph. That is the single most common
defect in a hand-written guide.
"""
import html
import json
import pathlib
import re
import sys
from datetime import date

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = ROOT / "guides" / "_src"
OUT = ROOT / "guides" / "wow-forever"
DATA = ROOT / "guides" / "_data"
STAMP = "20261007-2"

# ---- ability chips: where a chip points, and where its icon comes from ----------
# The exact Wowhead Forever URL shape is UNCONFIRMED. These two templates are the only
# place it is written down: change them here and every one of the ~1500 chips follows,
# or set either to "" to stop linking that kind -- the chip then still renders with its
# icon and tooltip, as a focusable span rather than an anchor. {id} is the only field.
SPELL_URL = "https://www.wowhead.com/forever/spell={id}"
ITEM_URL = "https://www.wowhead.com/forever/item={id}"
# Icons are served from our own origin: these pages run img-src 'self', so a wago.tools
# or Wowhead URL here is not a slow image, it is a blocked one.
ICON_URL = "/assets/spell-icons/{icon}.webp"
ICON_DIR = ROOT / "assets" / "spell-icons"
KIND_LABEL = {"spell": "Spell", "item": "Item", "talent": "Talent"}

# Filled by load_spells() from guides/_data/spells.json before anything renders. Empty is
# a supported state and the only one there was before 2026-10-07: every chip falls back
# to the plain styled span.
SPELLS = {}
CHIP_STATS = {"linked": 0, "plain": 0, "noicon": 0, "code_linked": 0, "code_plain": 0,
              "lost_icon": set(), "unknown": set()}

# slug -> (display name, accent hex, roles, one-line hook for the hub cards)
CLASSES = [
    ("warrior", "Warrior", "#c79c6e", "Tank · Melee",
     "Plate-armoured fighter that runs on Rage. Tanks or deals damage, and heals nobody."),
    ("paladin", "Paladin", "#f58cba", "Tank · Healer · Melee",
     "Plate hybrid that trains for all three roles. Runs on mana, and heals itself in every spec."),
    ("hunter", "Hunter", "#abd473", "Ranged",
     "Ranged weapons and a pet that holds the target while you shoot it."),
    ("rogue", "Rogue", "#fff569", "Melee",
     "Stealth, daggers and energy. Leather armour, no heals, and it chooses when a fight starts."),
    ("priest", "Priest", "#ffffff", "Healer · Ranged",
     "Cloth healer — and a shadow caster if you would rather deal the damage."),
    ("shaman", "Shaman", "#3e9bff", "Healer · Ranged · Melee",
     "Elemental hybrid built around totems: short-lived objects that buff everyone near them."),
    ("mage", "Mage", "#69ccf0", "Ranged",
     "Cloth caster with arcane, fire and frost trees. Conjures its own food and water."),
    ("warlock", "Warlock", "#9482c9", "Ranged",
     "A demon fights beside you while damage-over-time curses tick. Trades its own health for mana."),
    ("druid", "Druid", "#ff7d0a", "Tank · Healer · Ranged · Melee",
     "The shapeshifter — bear, cat and caster forms, and the only class that covers all four roles."),
]


# Professions. A parallel section to the classes: its own hub at /professions/ and one
# page each. Gathering and crafting are split because the first question a new player
# actually asks is "which two do I pick", and the answer turns on that pairing.
PROFESSIONS = [
    ("mining", "Mining", "Gathering", "Ore and stone, and the only feed for Blacksmithing and Engineering."),
    ("herbalism", "Herbalism", "Gathering", "Herbs, and the only feed for Alchemy."),
    ("skinning", "Skinning", "Gathering", "Leather off things you already killed \u2014 no nodes to find and no ore to buy."),
    ("blacksmithing", "Blacksmithing", "Crafting", "Plate and mail armour, and weapons. Eats ore."),
    ("leatherworking", "Leatherworking", "Crafting", "Leather and mail armour. Eats hides."),
    ("tailoring", "Tailoring", "Crafting", "Cloth armour and bags, from drops rather than a gathering profession."),
    ("engineering", "Engineering", "Crafting", "Bombs, gadgets, goggles and a mount, built from ore and scavenged parts."),
    ("enchanting", "Enchanting", "Crafting", "Permanent bonuses on gear, funded by destroying gear."),
    ("alchemy", "Alchemy", "Crafting", "Potions, elixirs and flasks \u2014 raid consumables."),
    ("cooking", "Cooking", "Secondary", "Food buffs, and in Forever a +5% experience buff while you level."),
    ("first-aid", "First Aid", "Secondary", "Bandages. For several classes this is the only self-heal for a long time."),
    ("fishing", "Fishing", "Secondary", "Slow, peaceful, and it feeds Cooking."),
    ("camping", "Camping", "System", "New in Forever. Every profession places camp objects that buff the group for an hour."),
    ("merchants-favor", "Merchant's Favor", "System", "New in Forever. A second currency and 317 recipes no trainer teaches."),
]

# class slug -> [(spec slug, spec name, role)]
# Every established guide site splits a class guide by specialisation -- Wowhead runs a
# separate guide per spec, Icy Veins uses role tabs, classicwow.gg has an overview plus
# per-spec children. A single page per class can only ever describe one spec's build and
# rotation, which is the defect this structure fixes.
# Druid's Feral tree does two genuinely different jobs from one build, so bear and cat
# get separate pages and both say the talents are shared.
SPECS = {
    "warrior": [("arms", "Arms", "Melee DPS"), ("fury", "Fury", "Melee DPS"),
                ("protection", "Protection", "Tank")],
    "paladin": [("holy", "Holy", "Healer"), ("protection", "Protection", "Tank"),
                ("retribution", "Retribution", "Melee DPS")],
    "hunter": [("beast-mastery", "Beast Mastery", "Ranged DPS"),
               ("marksmanship", "Marksmanship", "Ranged DPS"),
               ("survival", "Survival", "Melee DPS")],
    "rogue": [("assassination", "Assassination", "Melee DPS"),
              ("combat", "Combat", "Melee DPS"), ("subtlety", "Subtlety", "Melee DPS")],
    "priest": [("discipline", "Discipline", "Healer"), ("holy", "Holy", "Healer"),
               ("shadow", "Shadow", "Ranged DPS")],
    "shaman": [("elemental", "Elemental", "Ranged DPS"),
               ("enhancement", "Enhancement", "Melee DPS"),
               ("restoration", "Restoration", "Healer")],
    "mage": [("arcane", "Arcane", "Ranged DPS"), ("fire", "Fire", "Ranged DPS"),
             ("frost", "Frost", "Ranged DPS")],
    "warlock": [("affliction", "Affliction", "Ranged DPS"),
                ("demonology", "Demonology", "Ranged DPS"),
                ("destruction", "Destruction", "Ranged DPS")],
    "druid": [("balance", "Balance", "Ranged DPS"), ("feral-bear", "Feral \u2014 Bear", "Tank"),
              ("feral-cat", "Feral \u2014 Cat", "Melee DPS"),
              ("restoration", "Restoration", "Healer")],
}

# The "new to this?" box label. Classes were the only section when this was
# written; professions reuse the same block with a different noun.
NEWBOX = ["New to this class?"]

def load_spells():
    """Load the chip index. Build-time input only: this file is never served.

    guides/_data/spells.json is generated by tools/build_spell_index.py. Its absence is
    not an error -- it only means no chip can be linked -- so the miss is silent and the
    pages still build, byte-identical to how they looked before chips were linkable.
    An underscore directory is not served by GitHub Pages (there is no .nojekyll here),
    which is exactly why the data lives in one and nothing in the generated HTML ever
    refers to this path.

    There is deliberately NO partial fallback. A fixture standing in for the real index
    would publish pages where a handful of chips link and four hundred do not, which
    looks fine and is wrong; all-or-nothing is the only degradation worth having.
    """
    for name in ("spells.json",):
        path = DATA / name
        if not path.exists():
            continue
        try:
            doc = json.loads(path.read_text(encoding="utf-8"))
            entries = doc["entries"]
        except (OSError, ValueError, KeyError, TypeError) as exc:
            # Unreadable is worth saying out loud -- unlike absent, it is a mistake.
            print(f"  ! {name}: {exc.__class__.__name__}: {exc} -- chips stay plain")
            return
        SPELLS.update({k: v for k, v in entries.items() if isinstance(v, dict)})
        print(f"  chips: {len(SPELLS)} entries from guides/_data/{name}"
              f" (build {doc.get('build', '?')})")
        return


def talent(m):
    """A `backtick` term, linked when the index knows it.

    Talents keep their <code> styling rather than becoming chips: the guides draw a
    deliberate line between an ability and a talent, and collapsing the two into one
    look would erase information the prose is relying on. So the anchor goes INSIDE
    the <code>, and carries no icon.
    """
    raw = html.unescape(m.group(1))
    name = html.escape(raw, quote=False)
    entry = SPELLS.get(raw)
    ident = entry.get("id") if entry else None
    if not entry or not isinstance(ident, int):
        CHIP_STATS["code_plain"] += 1
        return f"<code>{name}</code>"

    kind = str(entry.get("kind") or "talent").lower()
    template = ITEM_URL if kind == "item" else SPELL_URL
    if not template:
        CHIP_STATS["code_plain"] += 1
        return f"<code>{name}</code>"

    tip = [raw]
    if isinstance(entry.get("level"), int):
        tip.append(f"Level {entry['level']}")
    tip.append(KIND_LABEL.get(kind, kind.title()))
    tip = html.escape(" \u00b7 ".join(tip), quote=True)
    href = html.escape(template.format(id=ident), quote=True)
    CHIP_STATS["code_linked"] += 1
    return (f'<code><a class="tl" href="{href}" target="_blank" rel="noopener"'
            f' data-tip="{tip}">{name}</a></code>')


def chip(m):
    """Render one [[Ability]] chip.

    With an entry: an anchor carrying the icon, the visible name, the link and a
    data-tip. WITHOUT an entry: byte-for-byte what this generator emitted before the
    index existed. 8 of the 433 chips are abilities Forever removed, plus pet names, and
    a dead link or a broken image is worse than a chip that is merely not clickable.

    The tooltip text goes in an ATTRIBUTE, never in a span. The Chamberlain's brain index
    chunks the generated HTML of these pages, and tooltip text that is DOM text would be
    duplicated into the retrieval corpus 1500 times over. css/guides.css draws it with
    content: attr(data-tip) on a pseudo-element, which is not text content.
    """
    raw = html.unescape(m.group(1))          # inline() escaped it before we got here
    name = html.escape(raw, quote=False)     # ... so put it back exactly as it was
    entry = SPELLS.get(raw)
    if not entry:
        CHIP_STATS["plain"] += 1
        if SPELLS:
            CHIP_STATS["unknown"].add(raw)
        return f'<span class="ab">{name}</span>'

    kind = str(entry.get("kind") or "spell").lower()
    ident = entry.get("id")
    template = ITEM_URL if kind == "item" else SPELL_URL
    href = template.format(id=ident) if template and isinstance(ident, int) else ""

    # Short on purpose: it is a tooltip, not a paragraph. Level is omitted when unknown
    # rather than printed as "Level None".
    tip = [raw]
    if isinstance(entry.get("level"), int):
        tip.append(f"Level {entry['level']}")
    tip.append(KIND_LABEL.get(kind, kind.title()))
    tip = html.escape(" · ".join(tip), quote=True)

    icon, img = entry.get("icon"), ""
    if isinstance(icon, int):
        if not (ICON_DIR / f"{icon}.webp").exists():
            CHIP_STATS["lost_icon"].add(icon)
        img = (f'<img class="ab-icon" src="{ICON_URL.format(icon=icon)}"'
               ' alt="" width="18" height="18" loading="lazy" decoding="async">')
    else:
        CHIP_STATS["noicon"] += 1

    CHIP_STATS["linked"] += 1
    if href:
        return (f'<a class="ab" href="{html.escape(href, quote=True)}"'
                f' target="_blank" rel="noopener" data-tip="{tip}">{img}{name}</a>')
    # Linking turned off for this kind: keep the icon and the tooltip, and keep it
    # keyboard-reachable so :focus-visible can still open the tooltip.
    return f'<span class="ab" tabindex="0" data-tip="{tip}">{img}{name}</span>'


INLINE = [
    (re.compile(r"\[\[([^\]]+)\]\]"), chip),
    (re.compile(r"\[([^\]]+)\]\(([^)]+)\)"), r'<a href="\2" rel="noopener">\1</a>'),
    (re.compile(r"\*\*(.+?)\*\*"), r"<strong>\1</strong>"),
    (re.compile(r"(?<![*\w])\*([^*]+)\*(?!\*)"), r"<em>\1</em>"),
    (re.compile(r"`([^`]+)`"), talent),
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
        headings.append(("new-to-this-class", NEWBOX[0]))
        return ('<aside class="guide-newbox" id="new-to-this-class">'
                f'<p class="eyebrow">{NEWBOX[0]}</p>' + body + "</aside>")
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


def specnav(class_slug, class_name, active_spec=None):
    """The spec bar, repeated identically on the class overview and every spec page.

    Every site studied repeats one navigation bar across all of a class's pages, so the
    split reads as one guide rather than several. Without it a spec page is a dead end.
    """
    if class_slug not in SPECS:
        return ""
    base = f"/guides/wow-forever/{class_slug}"
    items = [(f"{base}/", "Overview", active_spec is None)]
    items += [(f"{base}/{sl}/", nm, sl == active_spec)
              for sl, nm, _ in SPECS[class_slug]]
    li = "".join(
        f'<li><a href="{h}"{" class=\"on\"" if on else ""}>{html.escape(t)}</a></li>'
        for h, t, on in items)
    return (f'<nav class="spec-nav" aria-label="{html.escape(class_name)} guide sections">'
            f"<ul>{li}</ul></nav>")


def contents(headings):
    if len(headings) < 3:
        return ""
    items = "".join(f'<li><a href="#{s}">{html.escape(re.sub("<[^>]+>", "", t))}</a></li>'
                    for s, t in headings)
    return ('<nav class="guide-toc" aria-labelledby="toc-h">'
            '<p class="eyebrow" id="toc-h">On this page</p>'
            f"<ul>{items}</ul></nav>")


def nav():
    # The primary nav is duplicated in index.html and roster/index.html. A new top-level page
    # must be added in every one of them, or the guides' nav and the rest of the site disagree.
    items = [("/#play", "Play"), ("/#mods", "Mods"), ("/forums/", "Forums"),
             ("/guides/", "Guides"), ("/roster/", "Roster"),
             ("/#support", "Support"), ("/#work", "Workshop"), ("/#contact", "Contact")]
    return "\n        ".join(
        f'<li><a href="{h}"{" aria-current=\"page\"" if l == "Guides" else ""}>{l}</a></li>'
        for h, l in items)


def sectionnav(active):
    if active is None:
        return ""
    """Classes / Professions switcher. Repeated on every guide page, because a
    prose link on the hub is not a route anyone finds."""
    items = [("classes", "/guides/wow-forever/", "Class guides"),
             ("professions", "/guides/wow-forever/professions/", "Profession guides")]
    out = "".join(
        f'<a class="sec-item{" on" if k == active else ""}" href="{h}">{l}</a>'
        for k, h, l in items)
    return f'<nav class="sec-nav" aria-label="Guide sections">{out}</nav>'


def profnav(active=None):
    """The profession bar, repeated identically on the hub and every profession page."""
    out = [f'<a class="sn-item{"" if active else " on"}" '
           f'href="/guides/wow-forever/professions/">All professions</a>']
    for slug, name, kind, _ in PROFESSIONS:
        on = " on" if slug == active else ""
        out.append(f'<a class="sn-item{on}" '
                   f'href="/guides/wow-forever/professions/{slug}/">{html.escape(name)}</a>')
    return '<nav class="spec-nav" aria-label="Professions">' + "".join(out) + "</nav>"


# ---- Sources -----------------------------------------------------------------
# Front matter carries them:  sources: Wowhead|https://... ;; Icy Veins|https://...
# A guide that cites nothing is indistinguishable from a guide that invented its
# numbers, and these pages make claims a reader will act on for a hundred hours.
# Three majors only -- Wowhead, Icy Veins and ClassicWoW.gg. Forum and reseller
# posts are deliberately not cited: they are downstream of these, when they are not
# simply wrong.
SOURCE_NOTE = ("Compiled from the three major Forever guide sites and cross-checked against "
               "each other. Where Blizzard has published an official class deep dive, that post "
               "outranks all three and the page is written from it. Everything else \u2014 talent "
               "ranks, tooltip values, what exists in the tree at all \u2014 is settled against the "
               "client itself, read through "
               "<a href=\"https://foreverchanges.pro\" rel=\"noopener\">foreverchanges.pro</a> "
               "and <a href=\"https://wago.tools\" rel=\"noopener\">wago.tools</a>. Where the "
               "guides disagree with each other, this page says which said what.")


def sources_block(meta, headings):
    raw = (meta or {}).get("sources", "").strip()
    items = []
    for part in raw.split(";;"):
        part = part.strip()
        if "|" not in part:
            continue
        name, url = part.split("|", 1)
        url = url.strip()
        if not url.startswith("https://"):
            continue
        items.append(f'<li><a href="{html.escape(url, quote=True)}" '
                     f'rel="noopener nofollow" target="_blank">{inline(name.strip())}</a></li>')
    if not items:
        return ""
    headings.append(("sources", "Sources"))
    return ('\n        <section class="guide-sources"><h2 id="sources">Sources</h2>'
            f'<p>{SOURCE_NOTE}</p><ul>' + "".join(items) + "</ul></section>")


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
         accent=None, meta=None, parent=None, sn="", role=None, section="classes"):
    meta = meta or {}
    # NOTE: no inline style attribute anywhere on these pages. The CSP is
    # style-src 'self', which blocks style="" outright -- an inline custom property is
    # silently dropped and every accent falls back to the site default. Per-class accents
    # live in css/guides.css keyed off this class instead.
    # The accent is a CLASS colour, so it keys off the class slug -- on a spec page that
    # is the parent, not this page's own slug. Deriving it from `slug` gave every spec
    # page a class name like guide-shaman-enhancement, which matches no rule, so all 28
    # of them silently fell back to the site default green.
    style = f" guide-{parent[0] if parent else slug}" if accent else ""
    crumbs = ""
    if crumb:
        trail = ['<li><a href="/">Home</a></li>',
                 '<li><a href="/guides/">Guides</a></li>',
                 '<li><a href="/guides/wow-forever/">WoW: Forever</a></li>']
        if parent:
            pslug, pname = parent
            trail.append(f'<li><a href="/guides/wow-forever/{pslug}/">{html.escape(pname)}</a></li>')
        trail.append(f'<li aria-current="page">{html.escape(crumb)}</li>')
        crumbs = ('<nav class="crumbs" aria-label="Breadcrumb"><ol>'
                  + "".join(trail) + "</ol></nav>")
    # A section may not have art yet (professions did not, at first). Emit the crest
    # only when the file is actually on disk -- a missing webp is a broken image on
    # every page of that section, and a placeholder would have to be maintained.
    crest_img = ""
    if crest and (ROOT / "assets" / "guides" / "wow-forever" / f"{crest}-256.webp").exists():
        crest_img = (f'<img class="guide-crest" src="/assets/guides/wow-forever/{crest}-256.webp"'
                     ' alt="" width="128" height="128">')
    stamped = meta.get("updated", date.today().isoformat())
    build = meta.get("build", "")
    bits = [f'<span class="gm-ver">WoW: Forever</span>']
    if role:
        bits.append(f'<span class="gm-role">{html.escape(role)}</span>')
    bits += [
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
        {crest_img}
        <div>
          <p class="eyebrow">WoW: Forever</p>
          <h1 id="guide-title">{html.escape(title.split(' · ')[0])}</h1>
          <p class="lede">{standfirst}</p>
        </div>
      </div>
    </section>

    <div class="wrap forum-wrap" id="guide-main">
      {sectionnav(section)}
      {crumbs}
      {sn}
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
    load_spells()  # before anything renders: inline() reads SPELLS on every chip
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
        body = (scope + "\n        " + contents(headings) + "\n        " + body
                + sources_block(meta, headings))
        d = OUT / slug
        d.mkdir(parents=True, exist_ok=True)
        (d / "index.html").write_text(page(
            slug, f"{name} \u00b7 WoW: Forever \u00b7 Null Ossuary", hook, standfirst,
            body, slug, f"https://nossuary.com/guides/wow-forever/{slug}/",
            name, accent, meta, sn=specnav(slug, name)))
        written.append(slug)
        print(f"  wrote {slug}/")

        for sslug, sname, role in SPECS.get(slug, []):
            smd = SRC / f"{slug}-{sslug}.md"
            if not smd.exists():
                print(f"    skip {slug}/{sslug} (no source yet)")
                continue
            smeta, stext = frontmatter(smd.read_text())
            slines = stext.split("\n")
            sstand = inline(slines[0].strip())
            sh = []
            sbody = blocks("\n".join(slines[1:]), sh)
            sscope, sbody = hoist_scope(sbody)
            sbody = (sscope + "\n        " + contents(sh) + "\n        " + sbody
                     + sources_block(smeta or meta, sh))
            sd = d / sslug
            sd.mkdir(parents=True, exist_ok=True)
            (sd / "index.html").write_text(page(
                f"{slug}-{sslug}",
                f"{sname} {name} \u00b7 WoW: Forever \u00b7 Null Ossuary",
                f"{sname} {name} levelling guide for WoW: Forever \u2014 {role}.",
                sstand, sbody, slug,
                f"https://nossuary.com/guides/wow-forever/{slug}/{sslug}/",
                sname, accent, smeta or meta, parent=(slug, name),
                sn=specnav(slug, name, sslug), role=role))
            written.append(f"{slug}/{sslug}")
            print(f"    wrote {slug}/{sslug}/")

    # ---- professions: a hub at /professions/ plus one page each ----
    NEWBOX[0] = "New to professions?"
    prof_written = []
    pd = OUT / "professions"
    for slug, name, kind, hook in PROFESSIONS:
        md = SRC / f"prof-{slug}.md"
        if not md.exists():
            print(f"  skip professions/{slug} (no source yet)")
            continue
        meta, text = frontmatter(md.read_text())
        lines = text.split("\n")
        standfirst = inline(lines[0].strip())
        headings = []
        body = blocks("\n".join(lines[1:]), headings)
        scope, body = hoist_scope(body)
        body = (scope + "\n        " + contents(headings) + "\n        " + body
                + sources_block(meta, headings))
        d = pd / slug
        d.mkdir(parents=True, exist_ok=True)
        (d / "index.html").write_text(page(
            f"prof-{slug}", f"{name} \u00b7 WoW: Forever \u00b7 Null Ossuary",
            f"{name} guide for WoW: Forever \u2014 {hook}",
            standfirst, body, "professions",
            f"https://nossuary.com/guides/wow-forever/professions/{slug}/",
            name, None, meta, parent=("professions", "Professions"),
            sn=profnav(slug), role=kind, section="professions"))
        prof_written.append(f"professions/{slug}")
        print(f"  wrote professions/{slug}/")

    if prof_written:
        pcards = []
        for slug, name, kind, hook in PROFESSIONS:
            live = (pd / slug / "index.html").exists()
            tag = "a" if live else "div"
            attr = (f' href="/guides/wow-forever/professions/{slug}/"' if live
                    else ' aria-disabled="true"')
            soon = "" if live else '<span class="guide-soon">coming soon</span>'
            pcards.append(
                f'<{tag} class="guide-card guide-card--plain"{attr}>'
                f'<span class="guide-card-name">{html.escape(name)}{soon}</span>'
                f'<span class="guide-card-roles">{html.escape(kind)}</span>'
                f'<span class="guide-card-hook">{inline(hook)}</span></{tag}>')
        phub_md = SRC / "prof-index.md"
        pmeta, ptext = frontmatter(phub_md.read_text()) if phub_md.exists() else ({}, "")
        plines = ptext.split("\n")
        pstand = inline(plines[0].strip()) if plines else ""
        ph = []
        pintro = blocks("\n".join(plines[1:]), ph) if phub_md.exists() else ""
        pscope, pintro = hoist_scope(pintro)
        pbody = (pscope + "\n        " + contents(ph)
                 + f'\n        <div class="guide-grid">{"".join(pcards)}</div>\n        '
                 + pintro
                 + sources_block(pmeta, ph))
        pd.mkdir(parents=True, exist_ok=True)
        (pd / "index.html").write_text(page(
            "prof-index", "Profession guides \u00b7 WoW: Forever \u00b7 Null Ossuary",
            "Profession guides for World of Warcraft: Forever.",
            pstand, pbody, "professions",
            "https://nossuary.com/guides/wow-forever/professions/",
            "Professions", None, pmeta, sn=profnav(), section="professions"))
        print("  wrote professions/index.html")

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
            + f'\n        <div class="guide-grid">{"".join(cards)}</div>\n        ' + intro
            + sources_block(meta, headings))
    OUT.mkdir(parents=True, exist_ok=True)
    (OUT / "index.html").write_text(page(
        "index", "WoW: Forever class guides · Null Ossuary",
        "Levelling guides for all nine classes in World of Warcraft: Forever.",
        standfirst, body, "index",
        "https://nossuary.com/guides/wow-forever/", None, None, meta))
    print("  wrote guides/wow-forever/index.html")
    # ---- /guides/ : the landing page, so "Guides" is not a synonym for
    # "class guides". Both sections hang off it as equals.
    SECTIONS = [
        ("/guides/wow-forever/", "Class guides",
         f"All nine classes, {sum(len(v) for v in SPECS.values())} specialisation pages",
         "Talent order at 20 and 30, a rotation, stat priority, and what each tree does "
         "differently in Forever."),
        ("/guides/wow-forever/professions/", "Profession guides",
         f"{len(PROFESSIONS)} pages, every profession",
         "Nine primaries, three secondary skills, and the two systems Forever added: "
         "Camping and Merchant's Favor."),
    ]
    seccards = "".join(
        f'<a class="guide-card guide-card--plain" href="{h}">'
        f'<span class="guide-card-name">{html.escape(n)}</span>'
        f'<span class="guide-card-roles">{html.escape(r)}</span>'
        f'<span class="guide-card-hook">{inline(k)}</span></a>'
        for h, n, r, k in SECTIONS)

    land_md = SRC / "landing.md"
    lmeta, ltext = frontmatter(land_md.read_text()) if land_md.exists() else ({}, "")
    llines = ltext.split("\n")
    lstand = inline(llines[0].strip()) if llines else ""
    lh = []
    lintro = blocks("\n".join(llines[1:]), lh) if land_md.exists() else ""
    lscope, lintro = hoist_scope(lintro)
    lbody = (lscope + f'\n        <div class="guide-grid">{seccards}</div>\n        '
             + contents(lh) + "\n        " + lintro
             + sources_block(lmeta, lh))
    land_dir = ROOT / "guides"
    (land_dir / "index.html").write_text(page(
        "landing", "Guides \u00b7 Null Ossuary",
        "Class and profession guides for World of Warcraft: Forever.",
        lstand, lbody, "index", "https://nossuary.com/guides/",
        None, None, lmeta, section=None))
    print("  wrote guides/index.html")

    print(f"\n{len(written)} class page(s) + {len(prof_written)} profession page(s) + hubs")

    # Chips, as a line you can read rather than a grep you have to remember. None of
    # this fails the build: a chip with no data is a supported outcome, and the icons
    # land in a separate commit from the index that names them.
    print(f"chips: {CHIP_STATS['linked']} linked, {CHIP_STATS['plain']} plain"
          f", {CHIP_STATS['noicon']} linked without an icon")
    print(f"talents: {CHIP_STATS['code_linked']} linked, {CHIP_STATS['code_plain']} plain"
          " (a stat string or a macro is supposed to stay plain)")
    for key, label in (("unknown", "chip name(s) with no entry in the index"),
                       ("lost_icon", "icon id(s) the index names but assets/spell-icons/"
                                     " has not got")):
        names = sorted(CHIP_STATS[key], key=str)
        if names:
            shown = ", ".join(str(n) for n in names[:10])
            more = f" (+{len(names) - 10} more)" if len(names) > 10 else ""
            print(f"  {len(names)} {label}: {shown}{more}")


if __name__ == "__main__":
    main()
