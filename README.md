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
| `link/index.html` | Sign in with Steam, where the #welcome LINK button lands (`/link/`): asks the Worker's `/link/discord/start` and sends the member to Discord to confirm who they are. Ignores any query (a `?t=` is refused by design — see TAB BINDING in `js/link.js`). `noindex` |
| `link/discord/index.html` | Where Discord returns (`/link/discord/`, registered as the redirect URI of Chamberlain's Discord application): posts `code` + `state` to the Worker's `/link/discord/exchange`, then sends the browser to Steam with nossuary.com as realm. `noindex` |
| `link/done/index.html` | Where Steam returns (`/link/done/`): requires the `t` this tab was handed on `/link/discord/`, then posts Steam's answer to the Worker's `/link/steam/verify` and shows the result. `noindex` |
| `tests/` | `node --test tests/` — see Test |
| `js/link.js` | all three sign-in pages' logic; ties the Discord state and the link token to the browser tab in sessionStorage; strips the query from the address bar on load, never renders a URL value. Reads `linkWorkerUrl` and `siteOrigin` from `config.js`, falling back to built-in copies when a cached `config.js` lacks them — `siteOrigin` must match the Worker's `SITE_ORIGIN`. The three pages load `style.css`, `config.js` and `link.js` with a `?v=` build stamp: bump it in all three pages when any of those files changes |
| `forums/` | The native forum (`/forums/`, `board/?b=`, `thread/?t=&page=#p-`, `new/?b=`, `auth/`). Static shells: every board, thread and post comes from the forum Worker's API v1 (`forumApiUrl` in `config.js`; backend in `../Null_Ossuary/deploy/forum-worker`). Each page carries a CSP whose `connect-src` must name that API's origin. `new/` and `auth/` are `noindex`; `auth/` is where Discord returns and strips its query on load |
| `js/forum/` | ES modules for the forum: `api.js` (client; token in localStorage `nossuary.forum.token`, sent only to `forumApiUrl`; 401 clears it), `auth.js` (Sign in with Discord: state tied to the tab in sessionStorage, return path limited to `/forums/`), `markdown.js` (post bodies: RAW text to DOM nodes, the XSS boundary), `render.js`, `composer.js`, `boot.js` (header session area) and one `page-*.js` per route. Every page `<script>` and every relative `import` carries the same `?v=` stamp as the link pages — bump them all together (a test fails if they disagree) |
| `tests/fixtures/fake-forum-api.mjs` | In-memory stand-in for the forum API with sample data, for local preview: `node tests/fixtures/fake-forum-api.mjs 8788`, then serve a *copy* of the site whose `config.js` and forum CSPs point at `http://127.0.0.1:8788` (never commit that change). Tokens `fake-staff`, `fake-member`, `fake-nonmember`, `fake-screening`, `fake-timeout` in localStorage sign in without Discord |
| `assets/` | web-sized derivatives of the Null Ossuary branding set |
| `CNAME` | custom domain for GitHub Pages (`nossuary.com`) — removing it breaks the domain; the apex A records in No-IP point at GitHub |

## Preview locally

```
python3 -m http.server 8765 --bind 127.0.0.1
```

then open http://127.0.0.1:8765/.

## Test

```
node --test tests/
```

`tests/link.test.mjs` runs `js/link.js` in a VM with a stand-in page and sessionStorage: the tab
binding (link/done/ never posts a token this tab was not handed; link/ ignores `?t=`), plus one
end-to-end run against the real Worker handler from `../Null_Ossuary/deploy/status-worker` when that
checkout is present. `tests/forum.test.mjs` covers the forum's markdown renderer (including XSS vectors), the sign-in callback's tab binding and return-path check, the API client's 401/429/network handling, and that every forum page's CSP and build stamp agree with `config.js`. No dependencies.

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
