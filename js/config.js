// Site configuration. Everything a non-developer should need to change lives here.
// A value left null hides or disables the thing it drives rather than showing a broken link.
window.OSSUARY = {
  // Permanent invite to the Null Ossuary Discord, e.g. "https://discord.gg/abc123".
  // The current link EXPIRES 2026-10-13 (checked against the Discord API 2026-09-13) —
  // replace it with a never-expiring invite before then or every Discord button dies.
  discordInvite: "https://discord.gg/V5wTM8ChA",

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

  // Outbound links. Entries with a null url are not shown.
  links: [
    { label: "Steam Workshop", detail: "The mods these servers run", url: null },
    { label: "Steam group", detail: "Server invites and events", url: null },
  ],
};
