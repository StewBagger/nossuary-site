# Nossuary Site

The public website for **Null Ossuary** at `nossuary.com`. Plain static HTML/CSS/JS — no build
step — served from GitHub Pages.

Intent, decisions and open threads live in the vault
(`Vaults/JeevesVault/Web-Development/`, DR-0001 and DR-0002). This tree owns the code.

## Layout

| Path | What |
|---|---|
| `index.html` | the page |
| `css/style.css` | all styling; palette from `Projects/Null_Ossuary/branding` |
| `js/config.js` | **the only file most changes need**: Discord invite, servers, status URL, contact endpoint, links |
| `js/main.js` | rendering, live status polling, contact form |
| `assets/` | web-sized derivatives of the Null Ossuary branding set |
| `CNAME` | custom domain for GitHub Pages (`nossuary.com`) — removing it breaks the domain; the apex A records in No-IP point at GitHub |

## Preview locally

```
python3 -m http.server 8765 --bind 127.0.0.1
```

then open http://127.0.0.1:8765/.

## Rules

- **Nothing secret goes in this repo.** It is public. A Discord webhook URL in `config.js` would be
  scraped and abused within hours — the contact form posts to a relay, never to Discord directly.
- **No port opens at home** for the site, the form, or live status (Web-Development DR-0002).
  Status is *pushed out* from home as JSON; the browser never queries a game server.
- **Deploying is owner-run.** Pushing to the Pages branch publishes to the world.
- **Unknown is not offline.** The status UI shows grey "unavailable" when it cannot read status,
  never red.

## Regenerating assets

From `Projects/Null_Ossuary/branding` with ImageMagick, e.g.
`magick splash_davinci_1920x1080.png -strip -resize 1920x -quality 72 assets/hero-1920.webp`.
The splash's left third is deliberately empty shadow — the hero copy sits there; do not recentre.
