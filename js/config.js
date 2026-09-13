// Site configuration. Everything a non-developer should need to change lives here.
// A value left null hides or disables the thing it drives rather than showing a broken link.
window.OSSUARY = {
  // Permanent invite to the Null Ossuary Discord, e.g. "https://discord.gg/abc123".
  // The current link EXPIRES 2026-10-13 (checked against the Discord API 2026-09-13) —
  // replace it with a never-expiring invite before then or every Discord button dies.
  discordInvite: "https://discord.gg/V5wTM8ChA",

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
      status: "Open source · in production",
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
      blurb: "A static site with no build step and no open ports at home, deployed from git. Live server status and a contact relay are next.",
      tags: ["HTML", "CSS", "GitHub Pages"],
      url: null,
    },
  ],

  // Game servers. `address` is what players type in-game; `id` keys into status.json.
  servers: [
    {
      id: "pz-stable",
      game: "Project Zomboid",
      name: "PZ Reforged",
      subtitle: "Build 42 · Season 3 · “Patches on Patches”",
      address: "play.nossuary.com:16261",
      tag: "Stable",
    },
    {
      id: "pz-experimental",
      game: "Project Zomboid",
      name: "Skunk Works",
      subtitle: "Experimental · new mod builds land here first",
      address: "play.nossuary.com:16263",
      tag: "Experimental",
    },
  ],

  // URL of a JSON status document published from home (outbound only; see README).
  // null = show addresses without live status.
  statusUrl: null,

  // Endpoint of the contact-form relay (a serverless function that forwards to a
  // private Discord channel). null = the form points people to Discord instead.
  // NEVER put a Discord webhook URL here: this file is public.
  contactEndpoint: null,

  // Public Workshop mods. `id` is the Workshop item id from each stable mod's workshop.txt in
  // Projects/Jeeves_Ecosystem (experimental builds are unlisted and deliberately left out).
  mods: [
    { name: "Jeeve's Claims", id: "3674013419", blurb: "Property, vehicle and animal ownership with faction sharing and expiry — replaces vanilla safehouses." },
    { name: "Jeeve's Zones", id: "3739941052", blurb: "Paint regions onto the map and give each its own rules: loot, zombie population, PvP." },
    { name: "Jeeve's Hordes", id: "3672042113", blurb: "Unpredictable horde night events that keep every player on edge." },
    { name: "Jeeve's Drops", id: "3672451284", blurb: "Randomised airdrops and large supply events with loot worth fighting over." },
    { name: "Jeeve's Journals", id: "3674452315", blurb: "Write your progress into a journal and recover XP, recipes and map knowledge after death." },
    { name: "Jeeve's Personal Computer", id: "3693550188", blurb: "Working computers and a PDA: arcade games, training disks, printing, hacking." },
    { name: "Jeeve's Solar Arrays", id: "3737412008", blurb: "Solar panels, inverters and batteries to run your base off-grid." },
    { name: "Jeeve's Build", id: "3705530591", blurb: "Craft recipes for walls, frames, fences, stairs, floors and props from loaded tile packs." },
    { name: "Jeeve's QoL", id: "3687487317", blurb: "Quality-of-life improvements for Build 42, all-in-one or as individual sub-mods." },
    { name: "Jeeve's Patches", id: "3684025083", blurb: "Compatibility patches and vanilla Build 42 bug fixes. No configuration needed." },
    { name: "Jeeve's Integration", id: "3660924327", blurb: "The shared framework the ecosystem builds on, plus the optional Discord bridge." },
  ],

  // Outbound links. Entries with a null url are not shown.
  links: [
    { label: "GitHub", detail: "Open-source code, starting with JeevesBot", url: "https://github.com/StewBagger" },
    { label: "Steam group", detail: "Server invites and events", url: null },
  ],
};
