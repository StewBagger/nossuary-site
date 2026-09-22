// The admin portal's pure module in plain node — no browser, no dependencies.
//
//   node --test tests/
//
// What a regression here would quietly break: a token sent to an origin that is not the portal's,
// a dead session the page keeps pretending is alive, a queued command reported as succeeded merely
// because it was accepted, or a CSP/build stamp that disagrees with config.js so the real page
// silently fails to talk to the Worker.

import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(HERE, "..");
const api = await import(pathToFileURL(path.join(ROOT, "js", "admin", "api.js")).href);

const BASE = "https://portal.example";

function fakeFetch(steps) {
  const calls = [];
  const queue = [...steps];
  const impl = async (url, init = {}) => {
    calls.push({ url, method: init.method, headers: init.headers || {}, body: init.body });
    const next = queue.shift() || { status: 200, body: {} };
    return {
      ok: next.status >= 200 && next.status < 300,
      status: next.status,
      text: async () => (next.body === undefined ? "" : JSON.stringify(next.body)),
    };
  };
  impl.calls = calls;
  return impl;
}

// -- the base ---------------------------------------------------------------------

test("normalizeBase: https only, loopback aside, and nothing with credentials or a query", () => {
  assert.equal(api.normalizeBase("https://portal.example/"), "https://portal.example");
  assert.equal(api.normalizeBase("http://127.0.0.1:8787"), "http://127.0.0.1:8787");
  for (const bad of ["http://portal.example", "https://u:p@portal.example", "https://portal.example?x=1", "", null, "not a url"]) {
    assert.equal(api.normalizeBase(bad), null, String(bad));
  }
});

test("an unconfigured client never sends anything", async () => {
  const impl = fakeFetch([]);
  const client = api.createApi({ base: null, token: "t", fetchImpl: impl });
  assert.equal(client.configured, false);
  await assert.rejects(() => client.me(), (e) => e.code === "unconfigured");
  assert.equal(impl.calls.length, 0);
});

// -- the token --------------------------------------------------------------------

test("the token goes to the portal origin as a Bearer header, and never into a URL", async () => {
  const impl = fakeFetch([{ status: 200, body: { servers: [] } }]);
  await api.createApi({ base: BASE, token: "secret-token", fetchImpl: impl }).servers();
  const [call] = impl.calls;
  assert.equal(call.url, `${BASE}/v1/portal/servers`);
  assert.equal(call.headers.authorization, "Bearer secret-token");
  assert.ok(!call.url.includes("secret-token"));
});

test("a 401 drops the token, tells the page, and does not send it again", async () => {
  const impl = fakeFetch([{ status: 401, body: { error: "unauthorized" } }, { status: 200, body: { servers: [] } }]);
  let signedOut = 0;
  const client = api.createApi({ base: BASE, token: "dead", fetchImpl: impl, onSignedOut: () => { signedOut += 1; } });
  await assert.rejects(() => client.me(), (e) => e.status === 401);
  assert.equal(signedOut, 1);
  await client.servers();
  assert.equal(impl.calls[1].headers.authorization, undefined);
});

test("a network failure is a PortalError, not a thrown fetch error", async () => {
  const impl = async () => { throw new TypeError("nope"); };
  await assert.rejects(() => api.createApi({ base: BASE, token: "t", fetchImpl: impl }).me(),
    (e) => e.name === "PortalError" && e.status === 0 && e.code === "network");
});

// -- running a command ------------------------------------------------------------

test("run: omits delay_s and reason unless given, so the box decides its own courtesy", async () => {
  const impl = fakeFetch([{ status: 202, body: { id: "x", state: "queued" } }]);
  await api.createApi({ base: BASE, token: "t", fetchImpl: impl }).run("pz-stable", "restart");
  assert.deepEqual(JSON.parse(impl.calls[0].body), { server_key: "pz-stable", action: "restart" });
});

test("run: passes an explicit delay of zero rather than dropping it as falsy", async () => {
  const impl = fakeFetch([{ status: 202, body: { id: "x" } }]);
  await api.createApi({ base: BASE, token: "t", fetchImpl: impl }).run("pz-stable", "restart", { delaySeconds: 0 });
  assert.equal(JSON.parse(impl.calls[0].body).delay_s, 0);
});

test("awaitOutcome: waits for the authority rather than treating acceptance as success", async () => {
  const impl = fakeFetch([
    { status: 200, body: { id: "x", state: "claimed" } },
    { status: 200, body: { id: "x", state: "done", ok: true, result: { seconds_remaining: 300 } } },
  ]);
  const client = api.createApi({ base: BASE, token: "t", fetchImpl: impl });
  const out = await api.awaitOutcome(client, "x", { sleep: async () => {} });
  assert.equal(out.state, "done");
  assert.equal(out.ok, true);
  assert.equal(impl.calls.length, 2);
});

test("awaitOutcome: giving up watching is not reported as the command failing", async () => {
  const impl = fakeFetch(Array.from({ length: 5 }, () => ({ status: 200, body: { id: "x", state: "queued" } })));
  const client = api.createApi({ base: BASE, token: "t", fetchImpl: impl });
  const out = await api.awaitOutcome(client, "x", { timeoutMs: -1, sleep: async () => {} });
  assert.equal(out.timedOut, true);
  assert.notEqual(out.state, "done");
  assert.equal(out.ok, undefined);
});

// -- messages ---------------------------------------------------------------------

test("every refusal the authority can produce has a sentence a human can act on", () => {
  for (const code of ["mfa_required", "forbidden", "restart_already_pending", "bridge_absent",
                      "unreachable", "unsupported", "queued_grants_disabled", "not_owner"]) {
    const text = api.describeError({ status: 200, code });
    assert.ok(text.length > 10, code);
    assert.ok(!text.includes("_"), `${code} leaked a machine code to the reader`);
  }
});

test("an unknown code falls back without leaking it", () => {
  assert.equal(api.describeError({ status: 200, code: "kaboom_42" }), "Something went wrong. Try again.");
});

test("destructive actions are the ones that end with the server down or churned", () => {
  assert.ok(api.DESTRUCTIVE.has("stop"));
  assert.ok(api.DESTRUCTIVE.has("restart"));
  assert.ok(!api.DESTRUCTIVE.has("skip_next_restart"));
});

// -- the page's wiring ------------------------------------------------------------

const page = fs.readFileSync(path.join(ROOT, "admin", "index.html"), "utf8");
const configJs = fs.readFileSync(path.join(ROOT, "js", "config.js"), "utf8");
const apiJs = fs.readFileSync(path.join(ROOT, "js", "admin", "api.js"), "utf8");
const pageJs = fs.readFileSync(path.join(ROOT, "js", "admin", "page.js"), "utf8");

test("the CSP names the portal origin from config.js, and nothing else may be connected to", () => {
  const configured = /portalApiUrl:\s*"([^"]+)"/.exec(configJs)[1];
  const origin = new URL(configured).origin;
  const csp = /content="([^"]*default-src[^"]*)"/.exec(page)[1];
  const connect = /connect-src ([^;]+)/.exec(csp)[1].trim();
  assert.equal(connect, origin);
  assert.match(csp, /object-src 'none'/);
  assert.match(csp, /base-uri 'none'/);
  assert.equal(api.DEFAULT_API, configured, "api.js's fallback disagrees with config.js");
});

test("the admin page is not indexed", () => {
  assert.match(page, /name="robots" content="noindex/);
});

test("the build stamp agrees across the page and every admin import", () => {
  const stamps = new Set();
  for (const text of [page, apiJs, pageJs]) {
    for (const m of text.matchAll(/\?v=(\d{8}-\d+)/g)) stamps.add(m[1]);
  }
  assert.equal(stamps.size, 1, `stamps disagree: ${[...stamps].join(", ")}`);
});

test("the page inserts nothing as HTML", () => {
  assert.ok(!/innerHTML|outerHTML|insertAdjacentHTML|document\.write/.test(pageJs));
});

// -- live status ------------------------------------------------------------------

const stat = (over = {}, at = Date.now()) => ({
  server_key: "pz-stable", display_name: "Null County", level: "operate", actions: [],
  status_at: at,
  status: {
    state: "online", online: true, stale: false, player_count: 2, max_players: 32,
    players: ["Plume", "Abe"], observed_at: "2026-09-21T12:00:00+00:00", ...over,
  },
});

test("status: online reports who is on", () => {
  const v = api.describeStatus(stat());
  assert.equal(v.kind, "up");
  assert.equal(v.headline, "Online");
  assert.equal(v.detail, "2/32 on");
});

test("status: an empty server says so rather than showing a zero", () => {
  assert.equal(api.describeStatus(stat({ player_count: 0, players: [] })).detail, "nobody on");
});

test("status: silence is NOT offline, and they are different colours", () => {
  const never = api.describeStatus({ server_key: "x", status: null, status_at: null });
  assert.equal(never.kind, "silent");

  const old = api.describeStatus(stat({}, Date.now() - (api.STATUS_SILENT_MS + 1000)));
  assert.equal(old.kind, "silent");
  assert.match(old.detail, /Last update/);

  // The distinction that matters: a server genuinely down is a different kind.
  assert.equal(api.describeStatus(stat({ online: false, state: "offline" })).kind, "down");
});

test("status: unreachable blames the Warden, not the server", () => {
  const v = api.describeStatus(stat({ state: "unreachable", online: false }));
  assert.equal(v.kind, "silent");
  assert.match(v.detail, /may be fine/);
});

test("status: a pending restart shows the countdown, not just 'online'", () => {
  const v = api.describeStatus(stat({
    lifecycle: { restart_pending: true, restart: { seconds_remaining: 240 } },
  }));
  assert.equal(v.kind, "warn");
  assert.match(v.headline, /Restart in 4 minutes/);
});

test("status: stale means up and quiet, never down", () => {
  const v = api.describeStatus(stat({ stale: true }));
  assert.equal(v.kind, "warn");
  assert.notEqual(v.kind, "down");
});

test("status: restarting and starting are their own state, not offline", () => {
  assert.equal(api.describeStatus(stat({ state: "restarting" })).kind, "busy");
  assert.equal(api.describeStatus(stat({ state: "starting" })).kind, "busy");
});

// -- in-game commands -------------------------------------------------------------

test("every command the page can draw declares its own fields", () => {
  for (const [name, spec] of Object.entries(api.COMMAND_SPECS)) {
    assert.ok(spec.label && spec.label.length > 2, name);
    assert.ok(Array.isArray(spec.fields), name);
    for (const f of spec.fields) {
      assert.ok(f.name && f.label && f.kind, `${name}.${f.name}`);
      if (f.kind === "number") assert.ok(Number.isFinite(f.min) && Number.isFinite(f.max), name);
      if (f.kind === "choice") assert.ok(Array.isArray(f.choices) && f.choices.length, name);
    }
  }
});

test("the page's command list matches the Worker's", () => {
  // Drift here draws a button the Worker refuses, or hides one it would allow.
  assert.deepEqual(
    Object.keys(api.COMMAND_SPECS).sort(),
    ["airdrop", "horde_night", "horde_schedule", "horde_spawn", "horde_stop", "supply_event"],
  );
});

test("runCommand sends the parameters flat, as the Worker expects", async () => {
  const impl = fakeFetch([{ status: 202, body: { id: "x", state: "queued" } }]);
  await api.createApi({ base: BASE, token: "t", fetchImpl: impl })
    .runCommand("pz-stable", "horde_spawn", { count: 25 });
  assert.deepEqual(JSON.parse(impl.calls[0].body),
    { server_key: "pz-stable", action: "horde_spawn", count: 25 });
});

test("an airdrop with nothing chosen sends no parameters at all", async () => {
  const impl = fakeFetch([{ status: 202, body: { id: "x" } }]);
  await api.createApi({ base: BASE, token: "t", fetchImpl: impl })
    .runCommand("pz-stable", "airdrop", {});
  // Absent means "the mod chooses"; an empty string would be a name that matches
  // nobody, which the box would then refuse.
  assert.deepEqual(JSON.parse(impl.calls[0].body), { server_key: "pz-stable", action: "airdrop" });
});

test("the airdrop crate choices match what the game box accepts", () => {
  const crate = api.COMMAND_SPECS.airdrop.fields.find((f) => f.name === "crate");
  const values = crate.choices.map(([v]) => v).filter(Boolean);
  assert.deepEqual(values.sort(),
    ["fooddrink", "literature", "materials", "medical", "military", "toolsmelee"]);
});

// -- confirmation-required commands ------------------------------------------------

test("every dangerous command declares a warning and a phrase the reader can type", () => {
  for (const [name, spec] of Object.entries(api.ADMIN_SPECS)) {
    assert.ok(spec.label && spec.warning && spec.warning.length > 20, name);
    // Either a fixed phrase, or the one whose phrase is the player's own name.
    assert.ok(spec.phrase || spec.phraseIsPlayer, name);
  }
});

test("the page's dangerous list matches the Worker's", () => {
  assert.deepEqual(Object.keys(api.ADMIN_SPECS).sort(),
    ["clean_mods", "set_access_level", "update_server"]);
});

test("the fixed phrases match what the game box demands", () => {
  // Drift here shows an admin the wrong words to type and the box refuses them.
  assert.equal(api.ADMIN_SPECS.clean_mods.phrase, "DELETE UNUSED MODS");
  assert.equal(api.ADMIN_SPECS.update_server.phrase, "UPDATE SERVER");
});

test("the access-level phrase is the player's name, not a constant", () => {
  assert.equal(api.ADMIN_SPECS.set_access_level.phraseIsPlayer, true);
  assert.equal(api.ADMIN_SPECS.set_access_level.phrase, undefined);
});

test("runAdmin sends the phrase exactly as given, untrimmed", async () => {
  const impl = fakeFetch([{ status: 202, body: { id: "x" } }]);
  await api.createApi({ base: BASE, token: "t", fetchImpl: impl })
    .runAdmin("pz-stable", "clean_mods", { confirm: "  delete unused mods  " });
  assert.equal(JSON.parse(impl.calls[0].body).confirm, "  delete unused mods  ");
});

test("the page never carries a phrase in a value or placeholder attribute", () => {
  // The confirmation has to be typed by a person. A prefilled box, or one whose
  // placeholder is the answer, is the page performing it on the admin's behalf.
  const confirmBlock = pageJs.slice(pageJs.indexOf("admin-input--confirm") - 600,
    pageJs.indexOf("admin-input--confirm") + 600);
  assert.ok(!/confirm\.value\s*=\s*["'`](?!\s*["'`])/.test(confirmBlock),
    "the confirmation input is prefilled somewhere");
  assert.ok(!/placeholder\s*=\s*.*phrase/i.test(pageJs),
    "the phrase is offered as a placeholder");
});

test("access levels offered match what the game box accepts", () => {
  const level = api.ADMIN_SPECS.set_access_level.fields.find((f) => f.name === "level");
  assert.deepEqual(level.choices.map(([v]) => v).sort(),
    ["admin", "gm", "moderator", "none", "observer", "overseer"]);
});

// -- the Controls link ------------------------------------------------------------

const navJs = fs.readFileSync(path.join(ROOT, "js", "admin", "nav.js"), "utf8");
const forumsIndex = fs.readFileSync(path.join(ROOT, "forums", "index.html"), "utf8");

test("the Controls link is hidden in the markup, not revealed by CSS", () => {
  // Hidden in the HTML means a visitor with JS off, or a signed-out one, never sees
  // it — rather than seeing it flash and disappear.
  assert.match(forumsIndex, /<li id="nav-controls" hidden>/);
});

test("nav.js fails closed: every path that is not a confirmed yes leaves it hidden", () => {
  // No storage, no token, unconfigured API, an error, an empty list — all return
  // false, and only one line sets hidden = false.
  const reveals = navJs.match(/hidden\s*=\s*false/g) || [];
  assert.equal(reveals.length, 1, "more than one place reveals the link");
  assert.match(navJs, /servers\.length === 0\) return false/);
  assert.match(navJs, /catch\s*{[\s\S]*?return false/);
});

test("the link is gated on having a SERVER, not merely on being signed in", () => {
  // A member with a session but no grant sees nothing on /admin/, so offering them
  // the link would be a promise the page does not keep.
  assert.match(navJs, /api\.servers\(\)/);
  assert.ok(!/portal\/me/.test(navJs), "gated on identity rather than on access");
});

test("the grants call carries the owner's phrase and sends it untouched", async () => {
  const impl = fakeFetch([{ status: 202, body: { id: "x" } }]);
  await api.createApi({ base: BASE, token: "t", fetchImpl: impl })
    .setGrant("151000000000000042", "pz-stable", "operate", "  my phrase  ");
  const sent = JSON.parse(impl.calls[0].body);
  assert.equal(sent.confirm, "  my phrase  ");
  assert.equal(sent.level, "operate");
});

test("a revoke is a null level, not an empty string", () => {
  // The Worker distinguishes them: null revokes, "" is an unknown level.
  assert.match(pageJs, /what\.value === ""\s*\?\s*null\s*:\s*what\.value/);
});

test("the owner's phrase input is a password field and is never prefilled", () => {
  const block = pageJs.slice(pageJs.indexOf("Your phrase") - 200, pageJs.indexOf("Your phrase") + 300);
  assert.match(block, /type:\s*"password"/);
  assert.ok(!/value:\s*["'`][^"'`]/.test(block), "the phrase field is prefilled");
});
