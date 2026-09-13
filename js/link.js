// Sign in with Steam — the site half. Drives link/ (data-signin-step="start"), link/discord/
// (data-signin-step="discord") and link/done/ (data-signin-step="done").
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
  // The state link/ was handed, kept for this tab only: link/discord/ refuses a return that does not
  // carry it, so a code+state link made by someone else cannot sign this browser in as them.
  const STATE_KEY = "ossuary.link.discordState";
  // The link token link/discord/ was handed; link/done/ refuses any other (see TAB BINDING).
  const TOKEN_KEY = "ossuary.link.token";
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

  const $ = (id) => document.getElementById(id);

  function render(state, eyebrow, title, line, { retry = false } = {}) {
    document.body.classList.remove("signin-pending", "signin-error", "signin-ok");
    document.body.classList.add(`signin-${state}`);
    $("signin-eyebrow").textContent = eyebrow;
    $("signin-title").textContent = title;
    $("signin-line").textContent = line;
    const again = $("signin-retry");
    if (again) again.hidden = !retry;
    document.title = `${title} · Null Ossuary`;
  }

  function failWith(table, reason) {
    const key = Object.prototype.hasOwnProperty.call(table, reason) ? reason : "error";
    const [eyebrow, title, line] = table[key];
    // Trying again cannot help while sign-in is switched off.
    render("error", eyebrow, title, line, { retry: key !== "unavailable" });
  }
  const fail = (reason) => failWith(MESSAGES, reason);

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

  /** link/: always starts at Discord. The query is not read at all -- a ?t= in it is ignored. */
  async function start() {
    if (!worker) return failWith(DISCORD_MESSAGES, "unavailable");
    const answer = await ask(`${worker}/link/discord/start`);
    if (!answer) return failWith(DISCORD_MESSAGES, "network");
    if (answer.ok !== true || typeof answer.url !== "string") return failWith(DISCORD_MESSAGES, answer.reason);
    let next;
    try {
      next = new URL(answer.url);
    } catch {
      return failWith(DISCORD_MESSAGES, "error");
    }
    const state = next.searchParams.get("state");
    // Only ever on to Discord, whatever the answer says.
    if (next.origin !== DISCORD_ORIGIN || !state) return failWith(DISCORD_MESSAGES, "error");
    try {
      sessionStorage.setItem(STATE_KEY, state);
    } catch {
      return failWith(DISCORD_MESSAGES, "storage");
    }
    progress("Connecting to Discord…", "Discord confirms who you are, then Steam's own sign-in page opens.");
    location.replace(next.toString());
  }

  /** link/discord/: Discord's answer, traded at the Worker for a link token, then Steam. */
  async function discord(query) {
    const expected = takeStored(STATE_KEY);   // one return per start
    if (query.has("error")) return failWith(DISCORD_MESSAGES, query.get("error") === "access_denied" ? "cancelled" : "error");
    const code = query.get("code");
    const state = query.get("state");
    if (!code || !state) return failWith(DISCORD_MESSAGES, "missing");
    if (state !== expected) return failWith(DISCORD_MESSAGES, "invalid");
    if (!worker) return fail("unavailable");

    const verdict = await postJson(`${worker}/link/discord/exchange`, { code, state });
    if (!verdict) return failWith(DISCORD_MESSAGES, "network");
    if (verdict.ok !== true || typeof verdict.t !== "string") return failWith(DISCORD_MESSAGES, verdict.reason);
    try {
      sessionStorage.setItem(TOKEN_KEY, verdict.t);
    } catch {
      return failWith(DISCORD_MESSAGES, "storage");
    }
    toSteam(verdict.t);
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
  // token, Discord's code, or Steam's signed answer. Keeps it out of history, bookmarks, screenshots
  // and any later Referer.
  const query = new URLSearchParams(location.search);
  if (location.search || location.hash) history.replaceState(null, "", location.pathname);

  const steps = { start, discord, done };
  (steps[document.body.dataset.signinStep] || start)(query);
})();
