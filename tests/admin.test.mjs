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
