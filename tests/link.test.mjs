// js/link.js, run in a VM context with a minimal page, sessionStorage and fetch stand-in.
//
//   node --test tests/
//
// No browser and no dependencies. What these pin down is the tab binding (js/link.js, TAB BINDING):
// link/done/ must never post a token this tab was not handed, link/discord/ must never trade a code
// whose state this tab was not handed, and link/ must ignore a ?t=. The end-to-end test drives the
// real Worker handler from the sibling Null_Ossuary checkout when it is present, and skips otherwise.

import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath, pathToFileURL } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SOURCE = fs.readFileSync(path.join(HERE, "..", "js", "link.js"), "utf8");
const WORKER_DIR = path.join(HERE, "..", "..", "Null_Ossuary", "deploy", "status-worker");
const SITE = "https://nossuary.com";

/** A sessionStorage for one tab. */
function tabStorage() {
  const data = new Map();
  return {
    data,
    setItem: (k, v) => void data.set(k, String(v)),
    getItem: (k) => (data.has(k) ? data.get(k) : null),
    removeItem: (k) => void data.delete(k),
  };
}

/**
 * Load one page and run link.js until it navigates away or renders a final state.
 * `respond(url, init)` answers the page's fetches; every fetch is recorded.
 */
async function runPage(step, href, { storage = tabStorage(), respond = async () => Response.json({}) } = {}) {
  const els = {};
  const el = (id) => (els[id] ??= { textContent: "", hidden: true });
  const fetches = [];
  let replaced = null;
  let settle;
  const finished = new Promise((resolve) => { settle = resolve; });
  const url = new URL(href);
  const stripped = [];
  const context = {
    window: {},
    document: {
      getElementById: el,
      documentElement: { classList: { remove() {} } },
      body: {
        dataset: { signinStep: step },
        classList: { remove() {}, add(name) { if (name !== "signin-pending") settle(name); } },
      },
      title: "",
    },
    location: { search: url.search, hash: url.hash, pathname: url.pathname, replace: (to) => { replaced = to; settle("navigated"); } },
    history: { replaceState: (_s, _t, to) => stripped.push(to) },
    sessionStorage: storage,
    fetch: async (target, init = {}) => {
      fetches.push({ url: String(target), init });
      return respond(String(target), init);
    },
    URL, URLSearchParams, JSON, Object, String, Response,
  };
  vm.runInNewContext(SOURCE, context);
  const outcome = await Promise.race([finished, new Promise((r) => setTimeout(() => r("timeout"), 2000))]);
  return { outcome, replaced, fetches, stripped, title: el("signin-title").textContent, storage };
}

const STATE_KEY = "ossuary.link.discordState";
const TOKEN_KEY = "ossuary.link.token";
const params = "openid.mode=id_res&openid.claimed_id=https%3A%2F%2Fsteamcommunity.com%2Fopenid%2Fid%2F76561198000000001";

test("done/ refuses a token this tab never stored, and calls nothing", async () => {
  const page = await runPage("done", `${SITE}/link/done/?t=someone-elses.token&${params}`);
  assert.equal(page.outcome, "signin-error");
  assert.equal(page.title, "This sign-in didn't start in this browser tab");
  assert.deepEqual(page.fetches, []);
  assert.deepEqual(page.stripped, ["/link/done/"]);          // the query is gone from the address bar first
});

test("done/ refuses a token that differs from the stored one, and the stored one is spent either way", async () => {
  const storage = tabStorage();
  storage.setItem(TOKEN_KEY, "this-tabs.token");
  for (const t of ["other.token", "this-tabs.tokenx", "this-tabs.toke", " this-tabs.token"]) {
    storage.setItem(TOKEN_KEY, "this-tabs.token");
    const page = await runPage("done", `${SITE}/link/done/?t=${encodeURIComponent(t)}&${params}`, { storage });
    assert.equal(page.title, "This sign-in didn't start in this browser tab", t);
    assert.deepEqual(page.fetches, [], t);
    assert.equal(storage.getItem(TOKEN_KEY), null, t);
  }
  const none = await runPage("done", `${SITE}/link/done/?${params}`, { storage });
  assert.equal(none.title, "This sign-in didn't start in this browser tab");
  assert.deepEqual(none.fetches, []);
});

test("done/ posts to /verify only for exactly the stored token, once", async () => {
  const storage = tabStorage();
  storage.setItem(TOKEN_KEY, "this-tabs.token");
  const respond = async () => Response.json({ ok: true });
  const page = await runPage("done", `${SITE}/link/done/?t=this-tabs.token&${params}`, { storage, respond });
  assert.equal(page.outcome, "signin-ok");
  assert.equal(page.fetches.length, 1);
  assert.match(page.fetches[0].url, /\/link\/steam\/verify$/);
  assert.equal(JSON.parse(page.fetches[0].init.body).t, "this-tabs.token");
  assert.equal(storage.getItem(TOKEN_KEY), null);
  // Reloading the same address (history, a copied link) finds nothing stored.
  const again = await runPage("done", `${SITE}/link/done/?t=this-tabs.token&${params}`, { storage, respond });
  assert.equal(again.title, "This sign-in didn't start in this browser tab");
  assert.deepEqual(again.fetches, []);
});

test("link/ ignores ?t= and always starts at Discord, keeping the state in the tab", async () => {
  const state = "signed.state";
  const respond = async () => Response.json({ ok: true, url: `https://discord.com/oauth2/authorize?client_id=1&state=${state}` });
  const page = await runPage("start", `${SITE}/link/?t=someone-elses.token`, { respond });
  assert.equal(page.outcome, "navigated");
  assert.equal(new URL(page.replaced).origin, "https://discord.com");
  assert.deepEqual(page.fetches.map((f) => new URL(f.url).pathname), ["/link/discord/start"]);
  assert.ok(page.fetches.every((f) => !f.url.includes("someone-elses")));
  assert.equal(page.storage.getItem(STATE_KEY), state);
  assert.equal(page.storage.getItem(TOKEN_KEY), null);
});

test("link/ goes nowhere but discord.com, whatever the Worker answers", async () => {
  const respond = async () => Response.json({ ok: true, url: "https://evil.example/oauth2/authorize?state=x" });
  const page = await runPage("start", `${SITE}/link/`, { respond });
  assert.equal(page.outcome, "signin-error");
  assert.equal(page.replaced, null);
});

test("discord/ refuses a state this tab was not handed, and trades nothing", async () => {
  const storage = tabStorage();
  storage.setItem(STATE_KEY, "mine");
  const page = await runPage("discord", `${SITE}/link/discord/?code=abc&state=theirs`, { storage });
  assert.equal(page.title, "That sign-in didn't check out");
  assert.deepEqual(page.fetches, []);
  assert.equal(storage.getItem(STATE_KEY), null);
});

test("discord/ stores the token it was handed before going to Steam", async () => {
  const storage = tabStorage();
  storage.setItem(STATE_KEY, "mine");
  const respond = async () => Response.json({ ok: true, t: "fresh.token" });
  const page = await runPage("discord", `${SITE}/link/discord/?code=abc&state=mine`, { storage, respond });
  assert.equal(page.outcome, "navigated");
  const steam = new URL(page.replaced);
  assert.equal(steam.origin, "https://steamcommunity.com");
  assert.equal(steam.searchParams.get("openid.return_to"), `${SITE}/link/done/?t=fresh.token`);
  assert.equal(storage.getItem(TOKEN_KEY), "fresh.token");
});

test("end to end against the real Worker: one tab links; the same token in another tab does nothing", async (t) => {
  const index = path.join(WORKER_DIR, "src", "index.js");
  if (!fs.existsSync(index)) return t.skip("Null_Ossuary checkout not found beside this repo");
  const { default: worker } = await import(pathToFileURL(index).href);
  const { makeEnv } = await import(pathToFileURL(path.join(WORKER_DIR, "test", "support", "fake-env.js")).href);
  const { verifyToken } = await import(pathToFileURL(path.join(WORKER_DIR, "src", "steam.js")).href);

  const KEY = "site-test-key-0123456789abcdef0123456789";
  const env = makeEnv({ PUBLISH_TOKEN: "p", LINK_SIGNING_KEY: KEY, DISCORD_CLIENT_ID: "1548103089586839673", DISCORD_CLIENT_SECRET: "s" });
  const outbound = async (url) => {
    if (url.endsWith("/oauth2/token")) return Response.json({ access_token: "a", token_type: "Bearer" });
    if (url.endsWith("/users/@me")) return Response.json({ id: "151000000000000009" });
    if (url.startsWith("https://steamcommunity.com/")) return new Response("is_valid:true\n");
    return Response.json({});
  };
  const respond = (url, init) => worker.fetch(new Request(url, { ...init, headers: { origin: SITE, ...(init.headers || {}) } }), env, {}, outbound);

  const tab = tabStorage();
  const start = await runPage("start", `${SITE}/link/`, { storage: tab, respond });
  const state = new URL(start.replaced).searchParams.get("state");
  const back = await runPage("discord", `${SITE}/link/discord/?code=abc&state=${encodeURIComponent(state)}`, { storage: tab, respond });
  const returnTo = new URL(new URL(back.replaced).searchParams.get("openid.return_to"));
  const token = returnTo.searchParams.get("t");
  assert.equal((await verifyToken(token, KEY, Math.floor(Date.now() / 1000))).discordId, "151000000000000009");

  const claimed = "https://steamcommunity.com/openid/id/76561198000000001";
  const steamAnswer = new URLSearchParams({
    "openid.ns": "http://specs.openid.net/auth/2.0", "openid.mode": "id_res", "openid.op_endpoint": "https://steamcommunity.com/openid/login",
    "openid.claimed_id": claimed, "openid.identity": claimed, "openid.return_to": returnTo.toString(),
    "openid.response_nonce": "2026-09-13T12:00:00Zx", "openid.assoc_handle": "1",
    "openid.signed": "signed,op_endpoint,claimed_id,identity,return_to,response_nonce,assoc_handle", "openid.sig": "c2ln",
  });
  const doneUrl = `${returnTo.toString()}&${steamAnswer}`;

  // The fixation attempt: the same address opened in a different browser (empty storage).
  const victim = await runPage("done", doneUrl, { storage: tabStorage(), respond });
  assert.equal(victim.title, "This sign-in didn't start in this browser tab");
  assert.equal(victim.fetches.length, 0);
  assert.equal(env._claims.size > 0 && [...env._claims.keys()].some((k) => k.startsWith("claim:")), false);

  // The tab that started it links.
  const mine = await runPage("done", doneUrl, { storage: tab, respond });
  assert.equal(mine.outcome, "signin-ok");
  assert.equal([...env._claims.keys()].filter((k) => k.startsWith("claim:")).length, 1);
});

// -- Link Battle.net (Discord-Automation DR-0024) ------------------------------------------

const TARGET_KEY = "ossuary.link.target";
const BNET_STATE_KEY = "ossuary.link.bnetState";

test("link/ keeps ?to=battlenet in the tab and still ignores ?t=; anything else is Steam", async () => {
  const respond = async () => Response.json({ ok: true, url: "https://discord.com/oauth2/authorize?client_id=1&state=s" });
  const page = await runPage("start", `${SITE}/link/?to=battlenet&t=someone-elses.token`, { respond });
  assert.equal(page.outcome, "navigated");
  assert.equal(page.storage.getItem(TARGET_KEY), "battlenet");
  assert.ok(page.fetches.every((f) => !f.url.includes("someone-elses")));
  for (const href of [`${SITE}/link/`, `${SITE}/link/?to=steam`, `${SITE}/link/?to=evil`, `${SITE}/link/?to=BATTLENET`]) {
    const other = await runPage("start", href, { respond });
    assert.equal(other.storage.getItem(TARGET_KEY), "steam", href);
  }
});

test("discord/ with a battlenet target asks the Worker for Blizzard's URL and goes only to oauth.battle.net", async () => {
  const storage = tabStorage();
  storage.setItem(STATE_KEY, "mine");
  storage.setItem(TARGET_KEY, "battlenet");
  const bnet = "https://oauth.battle.net/authorize?response_type=code&client_id=c&scope=openid%20wow.profile&state=bnet.state&redirect_uri=x";
  const respond = async (url) => (url.includes("/link/discord/exchange")
    ? Response.json({ ok: true, t: "fresh.token" })
    : Response.json({ ok: true, url: bnet }));
  const page = await runPage("discord", `${SITE}/link/discord/?code=abc&state=mine`, { storage, respond });
  assert.equal(page.outcome, "navigated");
  assert.equal(page.replaced, bnet);
  assert.deepEqual(page.fetches.map((f) => new URL(f.url).pathname), ["/link/discord/exchange", "/link/battlenet/start"]);
  assert.equal(new URL(page.fetches[1].url).searchParams.get("t"), "fresh.token");
  assert.equal(storage.getItem(TOKEN_KEY), "fresh.token");
  assert.equal(storage.getItem(BNET_STATE_KEY), "bnet.state");
  assert.equal(storage.getItem(TARGET_KEY), null);                          // spent with the state

  // Whatever the Worker answers, nowhere but Blizzard.
  storage.setItem(STATE_KEY, "mine");
  storage.setItem(TARGET_KEY, "battlenet");
  const evil = async (url) => (url.includes("/exchange")
    ? Response.json({ ok: true, t: "fresh.token" })
    : Response.json({ ok: true, url: "https://evil.example/authorize?state=x" }));
  const refused = await runPage("discord", `${SITE}/link/discord/?code=abc&state=mine`, { storage, respond: evil });
  assert.equal(refused.outcome, "signin-error");
  assert.equal(refused.replaced, null);
});

test("battlenet/ refuses a state this tab was not handed, or a tab with no token, and posts nothing", async () => {
  const cases = [
    [{ [BNET_STATE_KEY]: "mine", [TOKEN_KEY]: "this-tabs.token" }, "theirs"],
    [{ [TOKEN_KEY]: "this-tabs.token" }, "mine"],
    [{ [BNET_STATE_KEY]: "mine" }, "mine"],
  ];
  for (const [stored, state] of cases) {
    const storage = tabStorage();
    for (const [k, v] of Object.entries(stored)) storage.setItem(k, v);
    const page = await runPage("battlenet", `${SITE}/link/battlenet/?code=abc&state=${state}`, { storage });
    assert.equal(page.outcome, "signin-error", JSON.stringify(stored));
    assert.equal(page.title, "This link didn't start in this browser tab");
    assert.deepEqual(page.fetches, []);
    assert.equal(storage.getItem(BNET_STATE_KEY), null);
    assert.equal(storage.getItem(TOKEN_KEY), null);
    assert.deepEqual(page.stripped, ["/link/battlenet/"]);
  }
  const cancelled = await runPage("battlenet", `${SITE}/link/battlenet/?error=access_denied&state=x`);
  assert.equal(cancelled.title, "Battle.net sign-in was cancelled");
  assert.deepEqual(cancelled.fetches, []);
});

test("battlenet/ posts {code, state, t} once for this tab's state and confirms in place, never via Steam", async () => {
  const storage = tabStorage();
  storage.setItem(BNET_STATE_KEY, "mine");
  storage.setItem(TOKEN_KEY, "this-tabs.token");
  const page = await runPage("battlenet", `${SITE}/link/battlenet/?code=abc&state=mine`, { storage, respond: async () => Response.json({ ok: true }) });
  assert.equal(page.outcome, "signin-ok");
  assert.equal(page.title, "∅ Battle.net account confirmed");
  assert.equal(page.replaced, null);
  assert.deepEqual(page.fetches.map((f) => new URL(f.url).pathname), ["/link/battlenet/exchange"]);
  assert.deepEqual(JSON.parse(page.fetches[0].init.body), { code: "abc", state: "mine", t: "this-tabs.token" });
  // Reloading finds nothing stored.
  const again = await runPage("battlenet", `${SITE}/link/battlenet/?code=abc&state=mine`, { storage });
  assert.deepEqual(again.fetches, []);
  // A refusal reads the Worker's reason.
  storage.setItem(BNET_STATE_KEY, "mine");
  storage.setItem(TOKEN_KEY, "this-tabs.token");
  const used = await runPage("battlenet", `${SITE}/link/battlenet/?code=abc&state=mine`, { storage, respond: async () => Response.json({ ok: false, reason: "used" }) });
  assert.equal(used.title, "That link has already been used");
});

test("every link page carries one build stamp, and link/battlenet/ is the battlenet step", () => {
  const pages = ["link/index.html", "link/discord/index.html", "link/done/index.html", "link/battlenet/index.html"];
  const stamps = new Set();
  for (const p of pages) {
    const text = fs.readFileSync(path.join(HERE, "..", p), "utf8");
    for (const m of text.matchAll(/\?v=(\d{8}-\d+)/g)) stamps.add(m[1]);
  }
  assert.equal(stamps.size, 1, [...stamps].join(", "));
  const bnet = fs.readFileSync(path.join(HERE, "..", "link/battlenet/index.html"), "utf8");
  assert.match(bnet, /data-signin-step="battlenet"/);
  assert.match(bnet, /js\/link\.js\?v=/);
});

test("end to end against the real Worker: Battle.net links from the tab that started it, and nowhere else", async (t) => {
  const index = path.join(WORKER_DIR, "src", "index.js");
  if (!fs.existsSync(path.join(WORKER_DIR, "src", "battlenet.js"))) return t.skip("Null_Ossuary checkout with battlenet.js not found beside this repo");
  const { default: worker } = await import(pathToFileURL(index).href);
  const { makeEnv } = await import(pathToFileURL(path.join(WORKER_DIR, "test", "support", "fake-env.js")).href);

  const KEY = "site-test-key-0123456789abcdef0123456789";
  const env = makeEnv({
    PUBLISH_TOKEN: "p", LINK_SIGNING_KEY: KEY, DISCORD_CLIENT_ID: "1548103089586839673", DISCORD_CLIENT_SECRET: "s",
    BNET_CLIENT_ID: "bnet-client", BNET_CLIENT_SECRET: "bnet-secret",
  });
  const outbound = async (url) => {
    if (url === "https://discord.com/api/oauth2/token") return Response.json({ access_token: "a", token_type: "Bearer" });
    if (url.endsWith("/users/@me")) return Response.json({ id: "151000000000000009" });
    if (url === "https://oauth.battle.net/token") return Response.json({ access_token: "b", token_type: "bearer" });
    if (url === "https://oauth.battle.net/userinfo") return Response.json({ id: 42, battletag: "Zug#1234" });
    if (url.startsWith("https://us.api.blizzard.com/")) return Response.json({ wow_accounts: [{ characters: [{ id: 7, name: "Zugzug", level: 12, playable_class: { id: 1 }, playable_race: { id: 2 }, faction: { type: "HORDE" } }] }] });
    return Response.json({}, { status: 404 });
  };
  const respond = (url, init) => worker.fetch(new Request(url, { ...init, headers: { origin: SITE, ...(init.headers || {}) } }), env, {}, outbound);

  const tab = tabStorage();
  const start = await runPage("start", `${SITE}/link/?to=battlenet`, { storage: tab, respond });
  const state = new URL(start.replaced).searchParams.get("state");
  const toBlizzard = await runPage("discord", `${SITE}/link/discord/?code=abc&state=${encodeURIComponent(state)}`, { storage: tab, respond });
  const authorize = new URL(toBlizzard.replaced);
  assert.equal(authorize.origin, "https://oauth.battle.net");
  assert.equal(authorize.searchParams.get("redirect_uri"), `${SITE}/link/battlenet/`);
  const back = `${SITE}/link/battlenet/?code=bnetcode&state=${encodeURIComponent(authorize.searchParams.get("state"))}`;

  // The same return opened in another browser (empty storage) sends nothing.
  const victim = await runPage("battlenet", back, { storage: tabStorage(), respond });
  assert.equal(victim.fetches.length, 0);

  const mine = await runPage("battlenet", back, { storage: tab, respond });
  assert.equal(mine.outcome, "signin-ok");
  const res = await worker.fetch(new Request("https://w.example/v1/battlenet-claims", { headers: { authorization: "Bearer p" } }), env, {}, outbound);
  const { claims } = await res.json();
  assert.equal(claims.length, 1);
  assert.equal(claims[0].battletag, "Zug#1234");
  assert.equal(claims[0].region, "us");
  assert.deepEqual(claims[0].characters, [{ id: 7, name: "Zugzug", level: 12, class_id: 1, race_id: 2, faction: "HORDE" }]);
});
