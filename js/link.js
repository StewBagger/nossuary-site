// Sign in with Steam — the site half. Drives link/ (data-signin-step="start") and
// link/done/ (data-signin-step="done").
//
// Chamberlain hands a member https://nossuary.com/link/?t=TOKEN. This page asks the Worker whether
// the token is still usable, then sends the browser to Steam with nossuary.com as realm and
// return_to, so Steam's login page names this site. Steam returns to link/done/?t=TOKEN&openid.*,
// which posts all of that to the Worker; the Worker checks it with Steam and records the claim.
//
// Every value from the address bar is treated as hostile: it goes into a URL or a JSON body,
// never into the page. All text shown is fixed text below, set with textContent.
(() => {
  "use strict";

  const cfg = window.OSSUARY || {};
  const STEAM_OPENID = "https://steamcommunity.com/openid/login";
  const OPENID_NS = "http://specs.openid.net/auth/2.0";
  const IDENTIFIER_SELECT = "http://specs.openid.net/auth/2.0/identifier_select";
  const AGAIN = "Press Sign in with Steam in Discord again for a fresh link.";

  // reason -> [eyebrow, heading, line]. Reasons are the Worker's (src/steam.js PUBLIC_REASONS)
  // plus "network"; anything unrecognised gets the generic entry.
  const MESSAGES = {
    expired: ["∅ link expired", "This sign-in link has expired", `Sign-in links last 10 minutes. ${AGAIN}`],
    invalid: ["∅ not linked", "That sign-in link isn't valid", AGAIN],
    used: ["∅ already used", "That link has already been used", "Each sign-in link works once. If you still need to link, press Sign in with Steam in Discord again."],
    cancelled: ["∅ not linked", "Sign-in was cancelled", "Nothing was linked. Press Sign in with Steam in Discord to try again."],
    assertion: ["∅ not linked", "Steam's answer didn't check out", `Nothing was linked. ${AGAIN}`],
    steam: ["∅ not linked", "Steam didn't confirm the sign-in", "Nothing was linked. Try again in a minute."],
    busy: ["∅ busy", "Linking is busy", "Too many sign-ins are waiting to be processed. Try again in a few minutes."],
    unavailable: ["∅ unavailable", "Linking isn't available right now", "Steam sign-in is switched off. Use Link in game in Discord instead."],
    network: ["∅ no connection", "Couldn't reach the sign-in service", "Check your connection, then press Sign in with Steam in Discord again."],
    error: ["∅ not linked", "Something went wrong", `Nothing was linked. ${AGAIN}`],
  };

  const $ = (id) => document.getElementById(id);

  function render(state, eyebrow, title, line) {
    document.body.classList.remove("signin-pending", "signin-error", "signin-ok");
    document.body.classList.add(`signin-${state}`);
    $("signin-eyebrow").textContent = eyebrow;
    $("signin-title").textContent = title;
    $("signin-line").textContent = line;
    document.title = `${title} · Null Ossuary`;
  }

  function fail(reason) {
    const [eyebrow, title, line] = MESSAGES[reason] || MESSAGES.error;
    render("error", eyebrow, title, line);
  }

  const workerUrl = (path) => (cfg.linkWorkerUrl ? `${String(cfg.linkWorkerUrl).replace(/\/+$/, "")}${path}` : null);
  const siteOrigin = String(cfg.siteOrigin || "https://nossuary.com").replace(/\/+$/, "");

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

  async function start(query) {
    const t = query.get("t");
    const check = workerUrl("/link/steam/check");
    if (!check) return fail("unavailable");
    if (!t) return fail("invalid");

    const verdict = await ask(`${check}?t=${encodeURIComponent(t)}`);
    if (!verdict) return fail("network");
    if (verdict.ok !== true) return fail(verdict.reason);

    // Must match the Worker's siteReturnTo/siteRealm exactly (src/steam.js).
    const steam = new URL(STEAM_OPENID);
    steam.search = new URLSearchParams({
      "openid.ns": OPENID_NS,
      "openid.mode": "checkid_setup",
      "openid.return_to": `${siteOrigin}/link/done/?t=${encodeURIComponent(t)}`,
      "openid.realm": `${siteOrigin}/`,
      "openid.identity": IDENTIFIER_SELECT,
      "openid.claimed_id": IDENTIFIER_SELECT,
    }).toString();
    $("signin-line").textContent = "Handing you over to Steam…";
    location.replace(steam.toString());
  }

  async function done(query) {
    const t = query.get("t");
    const verify = workerUrl("/link/steam/verify");
    if (!verify) return fail("unavailable");
    if (!t) return fail("invalid");

    const params = {};
    for (const [k, v] of query) if (k.startsWith("openid.")) params[k] = v;
    if (params["openid.mode"] === "cancel") return fail("cancelled");

    const verdict = await ask(verify, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ t, params }),
    });
    if (!verdict) return fail("network");
    if (verdict.ok !== true) return fail(verdict.reason);
    render("ok", "Sign in with Steam", "∅ Steam account confirmed",
      "Head back to Discord — you can close this tab. The Null Ossuary bot finishes linking in a few seconds and tells you there.");
  }

  document.documentElement.classList.remove("no-js");
  // Read the query, then take it out of the address bar before anything else happens: it holds
  // the token (and, on done/, Steam's signed answer). Keeps it out of history, bookmarks,
  // screenshots and any later Referer.
  const query = new URLSearchParams(location.search);
  if (location.search || location.hash) history.replaceState(null, "", location.pathname);

  const step = document.body.dataset.signinStep;
  (step === "done" ? done : start)(query);
})();
