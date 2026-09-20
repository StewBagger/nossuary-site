// Site configuration. Everything a non-developer should need to change lives here.
// A value left null hides or disables the thing it drives rather than showing a broken link.
window.OSSUARY = {
  // Permanent invite to the Null Ossuary Discord, landing in #welcome. Created by Chamberlain
  // 2026-09-13 with max_age 0 (never expires, unlimited uses) — checked against the Discord API.
  discordInvite: "https://discord.gg/PtMaTp385b",

  // Server ID for the live Discord panel (public, not a secret). The panel reads Discord's widget
  // feed, which only answers while "Enable Server Widget" is on. null = no panel.
  discordGuildId: "1548053028240752670",

  // Projects shown under "In the niches". `status` is free text; `url` null = no link.
  // PUBLIC SITE: nothing employer/customer-related, no internal hostnames, IPs or security posture.
  projects: [
    {
      name: "AI engineering workbench",
      kind: "AI development",
      status: "In daily use",
      blurb: "The setup this site was built with: AI agents working through custom MCP tool servers, a git-backed knowledge vault they read and write, subagents for search and review, and hooks and health checks that enforce the rules instead of hoping they're remembered.",
      tags: ["MCP", "Agents", "Python", "Node"],
      url: null,
    },
    {
      name: "JeevesBot",
      kind: "Automation",
      status: "Open source",
      blurb: "A Discord bot that runs a Project Zomboid dedicated server: lifecycle control, scheduled restarts, mod update detection, chat relay, player tracking and event control. Windows and Linux; the public repo is the exact build running the live servers.",
      tags: ["Python", "Discord", "RCON"],
      url: "https://github.com/StewBagger/Jeeves",
    },
    {
      name: "Chamberlain",
      kind: "Automation",
      status: "In development",
      blurb: "A self-hosted Discord community bot: anti-raid onboarding, moderation, activity-based ranks, and plugins that bridge Discord to game servers in both directions.",
      tags: ["Discord", "Python", "Self-hosted"],
      url: null,
    },
    {
      name: "Jeeves Ecosystem",
      kind: "Code",
      status: "Live on Steam Workshop",
      blurb: "A family of Project Zomboid mods — claims, zones, hordes, airdrops, in-game computers and more — shipped through an experimental-to-stable pipeline with automated pre-release audits.",
      tags: ["Lua", "Modding", "CI gates"],
      url: "#mods",
    },
    {
      name: "Unattended routines",
      kind: "Automation",
      status: "Running nightly",
      blurb: "Scheduled agents that work overnight — sweeping player feedback against the actual code and triaging what's real — then report their own verdict in the morning.",
      tags: ["Scheduling", "Agents", "Triage"],
      url: null,
    },
    {
      name: "nossuary.com",
      kind: "Web",
      status: "You're looking at it",
      blurb: "A static site with no build step and no open ports at home, deployed from git. Live server status is pushed out through a Cloudflare Worker; a contact relay is next.",
      tags: ["HTML", "CSS", "GitHub Pages"],
      url: null,
    },
  ],

  // Game servers. Naming: "Null" + the kind of place the game is set in. `game` shows as a tag on the
  // card and in the hero's live strip. `ip` and `port` are shown as separate copy fields (Project
  // Zomboid's Add Server form takes them apart); `id` keys into the status document.
  servers: [
    {
      id: "pz-stable",
      game: "Project Zomboid",
      name: "Null County",
      subtitle: "Build 42 · declared null and void",
      ip: "play.nossuary.com",
      port: "16261",
      tag: "Stable",
    },
    {
      id: "pz-experimental",
      game: "Project Zomboid",
      name: "Null County Proving Grounds",
      subtitle: "Experimental · new mod builds land here first",
      ip: "play.nossuary.com",
      port: "16263",
      tag: "Experimental",
    },
  ],

  // Live status JSON: Chamberlain pushes it to a Cloudflare Worker (outbound only; see README).
  // null = show addresses without live status.
  statusUrl: "https://nossuary-status.stewbagger.workers.dev/v1/status",

  // Sign in with Steam (link/, link/discord/ and link/done/, js/link.js). The pages call this
  // Worker's /link/discord/start and /exchange (Discord says who is signing in) and
  // /link/steam/verify. No secret is involved on this side: link tokens are signed and checked by
  // the Worker. null = sign-in pages say linking is
  // unavailable. js/link.js holds a copy of this value and siteOrigin as defaults, for a browser
  // with a stale cached config.js — change them there too.
  linkWorkerUrl: "https://nossuary-status.stewbagger.workers.dev",
  // Steam is told to return to <siteOrigin>/link/done/ with realm <siteOrigin>/. MUST equal the
  // Worker's SITE_ORIGIN (deploy/status-worker/wrangler.toml), or every sign-in is refused.
  siteOrigin: "https://nossuary.com",

  // Forum API (forums/, js/forum/*): the forum Worker in Projects/Null_Ossuary/deploy/forum-worker.
  // Reading needs nothing; posting sends the member's sign-in token to this origin and no other.
  // null = the forum pages say the forum is unavailable. Changing it means changing connect-src in
  // the CSP of every forums/**/index.html too (tests/forum.test.mjs checks), and the DEFAULT_API copy
  // in js/forum/boot.js (used when a cached config.js predates this key).
  forumApiUrl: "https://nossuary-forum.stewbagger.workers.dev",

  // Endpoint of the contact-form relay (a serverless function that forwards to a
  // private Discord channel). null = the form points people to Discord instead.
  // NEVER put a Discord webhook URL here: this file is public.
  contactEndpoint: null,

  // Published mods, one entry per mod that a visitor can actually go and get.
  //
  // `store` picks where `id` points: "steam" is a Workshop item id (from each stable mod's
  // workshop.txt in Projects/Jeeves_Ecosystem) and "moddb" is a Vintage Story ModDB ASSET id.
  // The asset id, not the mod's url alias -- an alias can be changed by whoever owns the mod
  // page, and none of the Null mods has one set, so show/mod/<assetid> is their only address.
  //
  // Experimental builds are unlisted, and so is any mod without a store entry: Null Cartography
  // and Null Smithy are finished but unpublished, and a card with nowhere to go is worse than no
  // card. `game` groups the list, one heading per game in first-seen order.
  //
  // Names and blurbs here MUST match the forum board for the same mod -- forum-worker's
  // test/seed.test.js asserts it across the two repos.
  mods: [
    { game: "Project Zomboid", store: "steam", name: "Jeeve's Claims", id: "3674013419", blurb: "Property, vehicle and animal ownership with faction sharing and expiry — replaces vanilla safehouses." },
    { game: "Project Zomboid", store: "steam", name: "Jeeve's Zones", id: "3739941052", blurb: "Paint regions onto the map and give each its own rules: loot, zombie population, PvP." },
    { game: "Project Zomboid", store: "steam", name: "Jeeve's Hordes", id: "3672042113", blurb: "Unpredictable horde night events that keep every player on edge." },
    { game: "Project Zomboid", store: "steam", name: "Jeeve's Drops", id: "3672451284", blurb: "Randomised airdrops and large supply events with loot worth fighting over." },
    { game: "Project Zomboid", store: "steam", name: "Jeeve's Journals", id: "3674452315", blurb: "Write your progress into a journal and recover XP, recipes and map knowledge after death." },
    { game: "Project Zomboid", store: "steam", name: "Jeeve's Personal Computer", id: "3693550188", blurb: "Working computers and a PDA: arcade games, training disks, printing, hacking." },
    { game: "Project Zomboid", store: "steam", name: "Jeeve's Solar Arrays", id: "3737412008", blurb: "Solar panels, inverters and batteries to run your base off-grid." },
    { game: "Project Zomboid", store: "steam", name: "Jeeve's Build", id: "3705530591", blurb: "Craft recipes for walls, frames, fences, stairs, floors and props from loaded tile packs." },
    { game: "Project Zomboid", store: "steam", name: "Jeeve's QoL", id: "3687487317", blurb: "Quality-of-life improvements for Build 42, all-in-one or as individual sub-mods." },
    { game: "Project Zomboid", store: "steam", name: "Jeeve's Patches", id: "3684025083", blurb: "Compatibility patches and vanilla Build 42 bug fixes. No configuration needed." },
    { game: "Project Zomboid", store: "steam", name: "Jeeve's Integration", id: "3660924327", blurb: "The shared framework the ecosystem builds on, plus the optional Discord bridge." },
    { game: "Project Zomboid", store: "steam", name: "Jeeve's NPC", id: "3805072153", blurb: "Living, talking survivors that hold a post, deal, and fight for their lives - the framework Traders and Events build on." },
    { game: "Project Zomboid", store: "steam", name: "Jeeve's Traders", id: "3805072419", blurb: "Staffed, guarded trading posts with a finite currency you have to go out and find." },
    { game: "Project Zomboid", store: "steam", name: "Jeeve's Events", id: "3805071987", blurb: "World events planned out of sight and found rather than announced: convoys, holdouts, hordes, a wandering merchant." },
    { game: "Vintage Story", store: "moddb", name: "Null Compass", id: "69456", blurb: "Three compasses and the temporal beacon they point at. Bearings, never positions." },
    { game: "Vintage Story", store: "moddb", name: "Null Lockdown", id: "69462", blurb: "Hardcore navigation: no world map, no coordinate readouts, and the server-side leaks closed too." },
    { game: "Vintage Story", store: "moddb", name: "Null Claims", id: "69465", blurb: "Land claiming without commands: one hotkey opens a window that drives vanilla's own claim system." },
  ],

  // Games with a Null server planned but nothing to join yet, shown under the servers as "Coming soon".
  // null or [] = no row.
  comingSoon: [
    { game: "Enshrouded" },
    { game: "Vintage Story" },
  ],

  // Ko-fi page for the Support section and its nav link. null = no Support section.
  kofiUrl: "https://ko-fi.com/kronosmedia",

  // Outbound links. Entries with a null url are not shown.
  links: [
    { label: "GitHub", detail: "Open-source code, starting with JeevesBot", url: "https://github.com/StewBagger" },
    { label: "Steam group", detail: "Server invites and events", url: null },
  ],
};
