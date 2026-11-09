// Sign in with Steam and Link Battle.net — the site half. Drives link/ (data-signin-step="start"),
// link/discord/ (data-signin-step="discord"), link/done/ (data-signin-step="done") and link/battlenet/
// (data-signin-step="battlenet").
//
// One click from Discord: the #welcome button opens https://nossuary.com/link/. This page asks the
// Worker for Discord's authorize URL and goes there; Discord identifies the member (scope identify;
// no consent screen for anyone who has authorized before) and returns to link/discord/?code&state,
// which trades the code at the Worker for a signed link token naming that Discord account, then
// toSteam(TOKEN): Steam with nossuary.com as realm and return_to, so Steam's login page names this
// site. Steam returns to link/done/?t=TOKEN&openid.*, which posts all of that to the Worker; the
// Worker checks it with Steam and records the claim.
//
// TAB BINDING. Both hand-offs are tied to the browser tab that pressed the button, in
// sessionStorage: link/discord/ requires the state link/ was given, and link/done/ requires the
// token link/discord/ was given. Without that, a token (or a Discord return) minted for one person
// could be sent as a link to someone else, whose Steam sign-in would then link THEIR Steam account
// to the sender's Discord account (link fixation). For the same reason link/ ignores any ?t=.
//
// LINK BATTLE.NET (Discord-Automation DR-0024) shares the Discord step. The roster panel's button
// opens link/?to=battlenet; link/ keeps the target in the tab's sessionStorage, and once link/discord/
// has the token it goes to toBattleNet(t) instead of toSteam(t): the Worker answers Blizzard's
// authorize URL (a state bound to the token's Discord id), Blizzard returns to link/battlenet/?code&state,
// and that page posts {code, state, t} to the Worker, which reads the account and records the claim.
// The same tab binding applies: link/battlenet/ requires the state and the token this tab was handed.
// Without ?to=battlenet the target is Steam, so the #welcome button is unchanged.
//
// Every value from the address bar is treated as hostile: it goes into a URL or a JSON body, never
// into the page. All text shown is fixed text below, set with textContent.
(() => {
  "use strict";

  // Built-in defaults, used when config.js is missing a value (a browser still holding a cached
  // config.js from before these keys existed). An explicit null in config.js still switches
  // sign-in off. Keep in step with config.js.
  const DEFAULTS = {
    linkWorkerUrl: "https://nossuary-status.stewbagger.workers.dev",
    siteOrigin: "https://nossuary.com",
  };
  const cfg = window.OSSUARY || {};
  const setting = (key) => (cfg[key] === undefined ? DEFAULTS[key] : cfg[key]);

  const STEAM_OPENID = "https://steamcommunity.com/openid/login";
  const OPENID_NS = "http://specs.openid.net/auth/2.0";
  const IDENTIFIER_SELECT = "http://specs.openid.net/auth/2.0/identifier_select";
  const DISCORD_ORIGIN = "https://discord.com";
  const BNET_ORIGIN = "https://oauth.battle.net";
  // The state link/ was handed, kept for this tab only: link/discord/ refuses a return that does not
  // carry it, so a code+state link made by someone else cannot sign this browser in as them.
  const STATE_KEY = "ossuary.link.discordState";
  // The link token link/discord/ was handed; link/done/ refuses any other (see TAB BINDING).
  const TOKEN_KEY = "ossuary.link.token";
  // Where link/discord/ goes next: "steam" (the default) or "battlenet", set on link/ from ?to=.
  const TARGET_KEY = "ossuary.link.target";
  // The state toBattleNet was handed; link/battlenet/ refuses a return that does not carry it.
  const BNET_STATE_KEY = "ossuary.link.bnetState";
  const TARGETS = new Set(["steam", "battlenet"]);
  const AGAIN = "Press Sign in with Steam in Discord again for a fresh link.";
  const RETRY = "Press Try again, or Sign in with Steam in Discord.";

  // reason -> [eyebrow, heading, line]. Reasons are the Worker's (src/steam.js PUBLIC_REASONS and
  // src/discord.js) plus "network", "missing" and "storage"; anything unrecognised gets "error".
  const MESSAGES = {
    expired: ["∅ link expired", "This sign-in link has expired", `Sign-in links last 10 minutes. ${AGAIN}`],
    invalid: ["∅ not linked", "That sign-in link isn't valid", AGAIN],
    used: ["∅ already used", "That link has already been used", "Each sign-in link works once. If you still need to link, press Sign in with Steam in Discord again."],
    cancelled: ["∅ not linked", "Sign-in was cancelled", "Nothing was linked. Press Sign in with Steam in Discord to try again."],
    assertion: ["∅ not linked", "Steam's answer didn't check out", `Nothing was linked. ${AGAIN}`],
    steam: ["∅ not linked", "Steam didn't confirm the sign-in", "Nothing was linked. Try again in a minute."],
    busy: ["∅ busy", "Linking is busy", "Too many sign-ins are waiting to be processed. Try again in a few minutes."],
    unavailable: ["∅ unavailable", "Sign-in isn't set up yet", "Sign in with Steam isn't switched on yet. Please try again later."],
    network: ["∅ no connection", "Couldn't reach the sign-in service", "Check your connection, then press Sign in with Steam in Discord again."],
    tab: ["∅ not linked", "This sign-in didn't start in this browser tab", "Nothing was linked. Press Sign in with Steam in Discord again."],
    storage: ["∅ not linked", "This browser is blocking sign-in", "Sign-in needs this site's session storage for the trip to Discord and back. Allow it for nossuary.com, then try again."],
    error: ["∅ not linked", "Something went wrong", `Nothing was linked. ${AGAIN}`],
  };
  // The Discord leg says the same things in its own words.
  const DISCORD_MESSAGES = {
    ...MESSAGES,
    cancelled: ["∅ not linked", "Discord sign-in was cancelled", `Nothing was linked. ${RETRY}`],
    expired: ["∅ took too long", "This sign-in took too long", `Signing in has to be finished within 10 minutes. ${RETRY}`],
    invalid: ["∅ not linked", "That sign-in didn't check out", `Nothing was linked. ${RETRY}`],
    missing: ["∅ nothing to finish", "There's no sign-in to finish here", `This page completes a Discord sign-in. ${RETRY}`],
    network: ["∅ no connection", "Couldn't reach the sign-in service", `Check your connection. ${RETRY}`],
    error: ["∅ not linked", "Something went wrong", `Nothing was linked. ${RETRY}`],
  };
  // The Battle.net leg, and the Discord leg when the member came for Battle.net: the same reasons,
  // pointing at the button they actually pressed. Reasons are the Worker's (src/battlenet.js).
  const BNET_AGAIN = "Press Link Battle.net in Discord again for a fresh link.";
  const BNET_RETRY = "Press Try again, or Link Battle.net in Discord.";
  const BNET_MESSAGES = {
    ...MESSAGES,
    expired: ["∅ took too long", "This link took too long", `Linking has to be finished within 10 minutes. ${BNET_RETRY}`],
    invalid: ["∅ not linked", "That link didn't check out", `Nothing was linked. ${BNET_RETRY}`],
    used: ["∅ already used", "That link has already been used", `Each link works once. ${BNET_AGAIN}`],
    cancelled: ["∅ not linked", "Battle.net sign-in was cancelled", `Nothing was linked. ${BNET_RETRY}`],
    unavailable: ["∅ unavailable", "Linking isn't set up yet", "Linking Battle.net isn't switched on yet. Please try again later."],
    missing: ["∅ nothing to finish", "There's no link to finish here", `This page completes a Battle.net sign-in. ${BNET_RETRY}`],
    network: ["∅ no connection", "Couldn't reach the linking service", `Check your connection. ${BNET_RETRY}`],
    tab: ["∅ not linked", "This link didn't start in this browser tab", `Nothing was linked. ${BNET_AGAIN}`],
    storage: ["∅ not linked", "This browser is blocking linking", "Linking needs this site's session storage for the trip to Discord, Battle.net and back. Allow it for nossuary.com, then try again."],
    error: ["∅ not linked", "Something went wrong", `Nothing was linked. ${BNET_RETRY}`],
  };

  const $ = (id) => document.getElementById(id);

  // Set on the Battle.net leg, so Try again starts Battle.net over rather than Steam.
  let retryHref = null;

  function render(state, eyebrow, title, line, { retry = false } = {}) {
    document.body.classList.remove("signin-pending", "signin-error", "signin-ok");
    document.body.classList.add(`signin-${state}`);
    $("signin-eyebrow").textContent = eyebrow;
    $("signin-title").textContent = title;
    $("signin-line").textContent = line;
    const again = $("signin-retry");
    if (again) {
      again.hidden = !retry;
      if (retryHref) again.href = retryHref;
    }
    document.title = `${title} · Null Ossuary`;
  }

  function failWith(table, reason) {
    const key = Object.prototype.hasOwnProperty.call(table, reason) ? reason : "error";
    const [eyebrow, title, line] = table[key];
    // Trying again cannot help while sign-in is switched off.
    render("error", eyebrow, title, line, { retry: key !== "unavailable" });
  }
  const fail = (reason) => failWith(MESSAGES, reason);

  /** Re-label the page for the Battle.net leg: its eyebrow, and where Try again goes. */
  function battlenetLeg() {
    retryHref = "/link/?to=battlenet";
    $("signin-eyebrow").textContent = "Link Battle.net";
  }

  function progress(title, line) {
    $("signin-title").textContent = title;
    $("signin-line").textContent = line;
  }

  const base = (value) => (value ? String(value).replace(/\/+$/, "") : null);
  const worker = base(setting("linkWorkerUrl"));
  const siteOrigin = base(setting("siteOrigin")) || DEFAULTS.siteOrigin;

  /** fetch + JSON, or null on any transport or parse failure. Never sends a cookie or a Referer. */
  async function ask(url, init = {}) {
    try {
      const res = await fetch(url, { cache: "no-store", credentials: "omit", referrerPolicy: "no-referrer", ...init });
      const body = await res.json();
      return body && typeof body === "object" ? body : null;
    } catch {
      return null;
    }
  }

  const postJson = (url, body) => ask(url, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });

  /** The Steam hand-off, for a link token from either way in. Must match the Worker's
   *  siteReturnTo/siteRealm exactly (src/steam.js). */
  function toSteam(t) {
    const steam = new URL(STEAM_OPENID);
    steam.search = new URLSearchParams({
      "openid.ns": OPENID_NS,
      "openid.mode": "checkid_setup",
      "openid.return_to": `${siteOrigin}/link/done/?t=${encodeURIComponent(t)}`,
      "openid.realm": `${siteOrigin}/`,
      "openid.identity": IDENTIFIER_SELECT,
      "openid.claimed_id": IDENTIFIER_SELECT,
    }).toString();
    progress("Connecting to Steam…", "Handing you over to Steam…");
    location.replace(steam.toString());
  }

  /** The Battle.net hand-off: the Worker answers Blizzard's authorize URL for this token. */
  async function toBattleNet(t) {
    progress("Connecting to Battle.net…", "Handing you over to Battle.net…");
    const answer = await ask(`${worker}/link/battlenet/start?t=${encodeURIComponent(t)}`);
    if (!answer) return failWith(BNET_MESSAGES, "network");
    if (answer.ok !== true || typeof answer.url !== "string") return failWith(BNET_MESSAGES, answer.reason);
    let next;
    try {
      next = new URL(answer.url);
    } catch {
      return failWith(BNET_MESSAGES, "error");
    }
    const state = next.searchParams.get("state");
    // Only ever on to Blizzard, whatever the answer says.
    if (next.origin !== BNET_ORIGIN || !state) return failWith(BNET_MESSAGES, "error");
    try {
      sessionStorage.setItem(BNET_STATE_KEY, state);
    } catch {
      return failWith(BNET_MESSAGES, "storage");
    }
    location.replace(next.toString());
  }

  /** One-shot sessionStorage read: the value, then it is gone. null when absent or storage is blocked. */
  function takeStored(key) {
    try {
      const value = sessionStorage.getItem(key);
      sessionStorage.removeItem(key);
      return value;
    } catch {
      return null;
    }
  }

  /** link/: always starts at Discord. Only ?to= is read (steam | battlenet); a ?t= in particular is ignored. */
  async function start(query) {
    const target = TARGETS.has(query.get("to")) ? query.get("to") : "steam";
    const messages = target === "battlenet" ? BNET_MESSAGES : DISCORD_MESSAGES;
    if (target === "battlenet") battlenetLeg();
    if (!worker) return failWith(messages, "unavailable");
    const answer = await ask(`${worker}/link/discord/start`);
    if (!answer) return failWith(messages, "network");
    if (answer.ok !== true || typeof answer.url !== "string") return failWith(messages, answer.reason);
    let next;
    try {
      next = new URL(answer.url);
    } catch {
      return failWith(messages, "error");
    }
    const state = next.searchParams.get("state");
    // Only ever on to Discord, whatever the answer says.
    if (next.origin !== DISCORD_ORIGIN || !state) return failWith(messages, "error");
    try {
      sessionStorage.setItem(STATE_KEY, state);
      sessionStorage.setItem(TARGET_KEY, target);
    } catch {
      return failWith(messages, "storage");
    }
    progress("Connecting to Discord…", target === "battlenet"
      ? "Discord confirms who you are, then Battle.net's own sign-in page opens."
      : "Discord confirms who you are, then Steam's own sign-in page opens.");
    location.replace(next.toString());
  }

  /** link/discord/: Discord's answer, traded at the Worker for a link token, then Steam or Battle.net. */
  async function discord(query) {
    const expected = takeStored(STATE_KEY);   // one return per start
    const target = takeStored(TARGET_KEY) === "battlenet" ? "battlenet" : "steam";
    const messages = target === "battlenet" ? BNET_MESSAGES : DISCORD_MESSAGES;
    if (target === "battlenet") battlenetLeg();
    if (query.has("error")) return failWith(messages, query.get("error") === "access_denied" ? "cancelled" : "error");
    const code = query.get("code");
    const state = query.get("state");
    if (!code || !state) return failWith(messages, "missing");
    if (state !== expected) return failWith(messages, "invalid");
    if (!worker) return failWith(messages, "unavailable");

    const verdict = await postJson(`${worker}/link/discord/exchange`, { code, state });
    if (!verdict) return failWith(messages, "network");
    if (verdict.ok !== true || typeof verdict.t !== "string") return failWith(messages, verdict.reason);
    try {
      sessionStorage.setItem(TOKEN_KEY, verdict.t);
    } catch {
      return failWith(messages, "storage");
    }
    if (target === "battlenet") return toBattleNet(verdict.t);
    toSteam(verdict.t);
  }

  /** link/battlenet/: Blizzard's answer, posted with this tab's token -- only for the state this tab was handed. */
  async function battlenet(query) {
    battlenetLeg();
    const expected = takeStored(BNET_STATE_KEY);   // one return per hand-off
    const t = takeStored(TOKEN_KEY);
    if (query.has("error")) return failWith(BNET_MESSAGES, query.get("error") === "access_denied" ? "cancelled" : "error");
    const code = query.get("code");
    const state = query.get("state");
    if (!code || !state) return failWith(BNET_MESSAGES, "missing");
    // Exactly the stored state and a token from this tab, or nothing is sent anywhere (see TAB BINDING).
    if (!expected || state !== expected || !t) return failWith(BNET_MESSAGES, "tab");
    if (!worker) return failWith(BNET_MESSAGES, "unavailable");

    const verdict = await postJson(`${worker}/link/battlenet/exchange`, { code, state, t });
    if (!verdict) return failWith(BNET_MESSAGES, "network");
    if (verdict.ok !== true) return failWith(BNET_MESSAGES, verdict.reason);
    render("ok", "Link Battle.net", "∅ Battle.net account confirmed",
      "Head back to Discord — you can close this tab. Linking finishes within about half a minute; the Null Ossuary bot sends you a DM with the characters it found if your DMs are open.");
  }

  /** link/done/: Steam's answer, posted to the Worker -- only for the token this tab was handed. */
  async function done(query) {
    const t = query.get("t");
    const expected = takeStored(TOKEN_KEY);   // one return per sign-in
    // Exactly the stored token, or nothing is sent anywhere (see TAB BINDING).
    if (!t || !expected || t !== expected) return fail("tab");
    if (!worker) return fail("unavailable");

    const params = {};
    for (const [k, v] of query) if (k.startsWith("openid.")) params[k] = v;
    if (params["openid.mode"] === "cancel") return fail("cancelled");

    const verdict = await postJson(`${worker}/link/steam/verify`, { t, params });
    if (!verdict) return fail("network");
    if (verdict.ok !== true) return fail(verdict.reason);
    render("ok", "Sign in with Steam", "∅ Steam account confirmed",
      "Head back to Discord — you can close this tab. Linking finishes within about half a minute; the Null Ossuary bot sends you a DM if your DMs are open.");
  }

  document.documentElement.classList.remove("no-js");
  // Read the query, then take it out of the address bar before anything else happens: it holds the
  // token, Discord's or Blizzard's code, or Steam's signed answer. Keeps it out of history, bookmarks, screenshots
  // and any later Referer.
  const query = new URLSearchParams(location.search);
  if (location.search || location.hash) history.replaceState(null, "", location.pathname);

  const steps = { start, discord, done, battlenet };
  (steps[document.body.dataset.signinStep] || start)(query);
})();
