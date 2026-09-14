// The forum's pure modules in plain node — no browser, no dependencies.
//
//   node --test tests/
//
// markdown.js is the XSS boundary for post bodies, so most of this file is there: it renders into a
// stand-in document that serialises the way a browser would, and the output is checked for anything
// that could run. Then the sign-in callback's tab binding and return-path check (auth.js), the API
// client's handling of 401/429/network failures (api.js), and the build-stamp/CSP consistency of the
// forum pages.

import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath, pathToFileURL } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(HERE, "..");
const mod = (name) => import(pathToFileURL(path.join(ROOT, "js", "forum", name)).href);

const { parseMarkdown, parseInline, renderMarkdown, safeUrl } = await mod("markdown.js");
const { createApi, ApiError, describeError, normalizeBase, TOKEN_KEY } = await mod("api.js");
const { safeReturnPath, completeSignIn, beginSignIn, postingNote, STATE_KEY, RETURN_KEY } = await mod("auth.js");
const { relativeTime, postPermissions, pageList, avatarSrc, workshopHref, validSlug, validId, threadHref } = await mod("render.js");
const { createFakeApi } = await import(pathToFileURL(path.join(HERE, "fixtures", "fake-forum-api.mjs")).href);

// --- A stand-in document --------------------------------------------------------
// Only what markdown.js is allowed to use. Anything else (innerHTML, insertAdjacentHTML, ...) is absent,
// so a call to it throws. Serialisation escapes like a browser does.

const ALLOWED_TAGS = new Set(["p", "br", "strong", "em", "code", "pre", "blockquote", "ul", "li", "a"]);
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const escAttr = (s) => esc(s).replace(/"/g, "&quot;");

function fakeDocument() {
  const created = [];
  class Node {
    constructor() { this.childNodes = []; }
    appendChild(n) { this.childNodes.push(n); return n; }
  }
  class Element extends Node {
    constructor(tag) { super(); this.tagName = tag; this.attributes = new Map(); created.push(this); }
    setAttribute(k, v) { this.attributes.set(k, String(v)); }
    get outerHTML() {
      const attrs = [...this.attributes].map(([k, v]) => ` ${k}="${escAttr(v)}"`).join("");
      return this.tagName === "br" ? "<br>" : `<${this.tagName}${attrs}>${this.childNodes.map(serialize).join("")}</${this.tagName}>`;
    }
  }
  const serialize = (n) => (n.text !== undefined ? esc(n.text) : n.outerHTML ?? n.childNodes.map(serialize).join(""));
  return {
    created,
    createElement: (tag) => new Element(tag),
    createTextNode: (text) => ({ text }),
    createDocumentFragment: () => new Node(),
    html: (frag) => frag.childNodes.map(serialize).join(""),
  };
}

function render(text) {
  const doc = fakeDocument();
  const html = doc.html(renderMarkdown(text, doc));
  return { html, elements: doc.created };
}

/** Nothing in the output can run or load: only allowed tags, only href/rel/target, only http(s) hrefs. */
function assertInert({ html, elements }) {
  for (const e of elements) {
    assert.ok(ALLOWED_TAGS.has(e.tagName), `unexpected tag <${e.tagName}>`);
    for (const [k, v] of e.attributes) {
      assert.ok(e.tagName === "a" && ["href", "rel", "target"].includes(k), `unexpected attribute ${k} on <${e.tagName}>`);
      if (k === "href") assert.match(v, /^https?:\/\/[^\s"<>]+$/i, `href ${v}`);
    }
    if (e.tagName === "a") {
      assert.equal(e.attributes.get("rel"), "noopener nofollow ugc");
      assert.equal(e.attributes.get("target"), "_blank");
    }
  }
  assert.doesNotMatch(html, /<(?!\/?(p|br|strong|em|code|pre|blockquote|ul|li|a)[ >])/i, `raw tag in ${html}`);
  // An "onerror=" can only matter inside a real tag; text is escaped, so check tags only.
  for (const tag of html.match(/<[a-z][^>]*>/gi) || []) {
    assert.doesNotMatch(tag, /\son\w+=/i, `event handler attribute in ${tag}`);
    assert.doesNotMatch(tag, /href="(?!https?:\/\/)/i, `non-http href in ${tag}`);
  }
}

// --- Markdown: what it renders ----------------------------------------------------

test("markdown: paragraphs, line breaks, bold, italic, inline code", () => {
  assert.equal(render("one\ntwo\n\nthree").html, "<p>one<br>two</p><p>three</p>");
  assert.equal(render("**bold** and *it* and `x < y`").html, "<p><strong>bold</strong> and <em>it</em> and <code>x &lt; y</code></p>");
  assert.equal(render("**bold with *italic* inside**").html, "<p><strong>bold with <em>italic</em> inside</strong></p>");
  assert.equal(render("`**not bold**`").html, "<p><code>**not bold**</code></p>");
  assert.equal(render("2 * 3 * 4 and a lone * star").html, "<p>2 * 3 * 4 and a lone * star</p>");
  assert.equal(render("** not bold**").html, "<p>** not bold**</p>");
});

test("markdown: fenced code, quotes, lists", () => {
  assert.equal(render("```lua\nlocal x = \"<b>\"\n  indented\n```\nafter").html,
    "<pre><code>local x = \"&lt;b&gt;\"\n  indented</code></pre><p>after</p>");
  assert.equal(render("```\nunclosed **not bold**").html, "<pre><code>unclosed **not bold**</code></pre>");
  assert.equal(render("> quoted **text**\n> more\n\nplain").html, "<blockquote><p>quoted <strong>text</strong><br>more</p></blockquote><p>plain</p>");
  assert.equal(render("> > nested").html, "<blockquote><blockquote><p>nested</p></blockquote></blockquote>");
  assert.equal(render("- one\n- *two*\n  continued\n\n- three").html, "<ul><li>one</li><li><em>two</em><br>continued</li></ul><ul><li>three</li></ul>");
  assert.equal(render("text\n- list right after").html, "<p>text</p><ul><li>list right after</li></ul>");
  assert.equal(render("-not a list").html, "<p>-not a list</p>");
});

test("markdown: links and bare URLs", () => {
  const { html } = render("see [the docs](https://example.com/a?b=1&c=2) or https://nossuary.com/forums/.");
  assert.equal(html, '<p>see <a href="https://example.com/a?b=1&amp;c=2" rel="noopener nofollow ugc" target="_blank">the docs</a> or '
    + '<a href="https://nossuary.com/forums/" rel="noopener nofollow ugc" target="_blank">https://nossuary.com/forums/</a>.</p>');
  assert.equal(render("(https://example.com/x)").html, '<p>(<a href="https://example.com/x" rel="noopener nofollow ugc" target="_blank">https://example.com/x</a>)</p>');
  assert.equal(render("https://en.wikipedia.org/wiki/Foo_(bar)").html,
    '<p><a href="https://en.wikipedia.org/wiki/Foo_(bar)" rel="noopener nofollow ugc" target="_blank">https://en.wikipedia.org/wiki/Foo_(bar)</a></p>');
  assert.equal(render("[plain http](http://example.com)").html, '<p><a href="http://example.com/" rel="noopener nofollow ugc" target="_blank">plain http</a></p>');
  // bare http:// is not auto-linked (https only), and link text never nests another link
  assert.equal(render("http://example.com").html, "<p>http://example.com</p>");
  assert.equal(render("[https://a.example](https://b.example)").html, '<p><a href="https://b.example/" rel="noopener nofollow ugc" target="_blank">https://a.example</a></p>');
  assert.equal(render("`https://in.code`").html, "<p><code>https://in.code</code></p>");
});

// --- Markdown: XSS ------------------------------------------------------------------

const VECTORS = [
  "<script>alert(1)</script>",
  "<img src=x onerror=alert(1)>",
  "<a href=\"javascript:alert(1)\">x</a>",
  "[x](javascript:alert(1))",
  "[x](JaVaScRiPt:alert(1))",
  "[x](javascript&#58;alert(1))",
  "[x]( javascript:alert(1))",
  "[x](java\tscript:alert(1))",
  "[x](data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==)",
  "[x](vbscript:msgbox(1))",
  "[x](//evil.example/)",
  "[x](/relative)",
  "[x](https://user:pass@evil.example/)",
  "[x](https://example.com\" onmouseover=\"alert(1))",
  "[x](https://example.com\"onmouseover=\"alert(1))",
  "[<img src=x onerror=alert(1)>](https://example.com)",
  "[x](https://example.com)\"><script>alert(1)</script>",
  "https://example.com/\"><img src=x onerror=alert(2)>",
  "https://example.com/'onmouseover='alert(1)'",
  "https://example.com/<script>",
  "**<b onclick=alert(1)>bold</b>**",
  "`<script>alert(1)</script>`",
  "```\n</code></pre><script>alert(1)</script>\n```",
  "> <iframe src=javascript:alert(1)>",
  "- <svg onload=alert(1)>",
  "![img](https://example.com/x.png)",
  "&lt;script&gt;alert(1)&lt;/script&gt;",
  " <script>alert(1)</script>",
  "[x](https://example.com/ javascript:alert(1))",
];

test("markdown XSS: every vector renders inert", () => {
  for (const v of VECTORS) assertInert(render(v));
});

test("markdown XSS: HTML is shown as the text that was typed", () => {
  assert.equal(render("<script>alert(1)</script>").html, "<p>&lt;script&gt;alert(1)&lt;/script&gt;</p>");
  assert.equal(render("&lt;b&gt;").html, "<p>&amp;lt;b&amp;gt;</p>");
  assert.equal(render("![img](https://example.com/x.png)").html,
    '<p>!<a href="https://example.com/x.png" rel="noopener nofollow ugc" target="_blank">img</a></p>');  // a link, never an image
});

test("markdown XSS: dangerous link targets are not links at all", () => {
  const dangerous = ["javascript:alert(1)", "JaVaScRiPt:alert(1)", "javascript&#58;alert(1)", " javascript:alert(1)", "java\tscript:alert(1)",
    "data:text/html;base64,PHNjcmlwdD4=", "vbscript:msgbox(1)", "//evil.example/", "/relative", "https://user:pass@evil.example/"];
  for (const target of dangerous) {
    const v = `[x](${target})`;
    const { elements } = render(v);
    assert.equal(elements.filter((e) => e.tagName === "a").length, 0, v);
  }
  // An attribute-breaking quote only ever ends up percent-encoded inside href.
  const { elements } = render("https://example.com/a\"b");
  assert.equal(elements.find((e) => e.tagName === "a").attributes.get("href"), "https://example.com/a");
  const quoted = render("[x](https://example.com/a\"onmouseover=alert(1))").elements.find((e) => e.tagName === "a");
  assert.ok(!quoted || !quoted.attributes.get("href").includes("\""));
});

test("markdown XSS: a hand-built tree with a bad href is refused at render time too", async () => {
  // renderMarkdown only takes text, but the DOM half re-checks every href anyway.
  assert.equal(safeUrl("javascript:alert(1)"), null);
  assert.equal(safeUrl("https://ok.example/"), "https://ok.example/");
  assert.equal(safeUrl("HTTPS://OK.EXAMPLE"), "https://ok.example/");
  assert.equal(safeUrl("https://ok.example/\n"), null);
  assert.equal(safeUrl("https:///nohost"), "https://nohost/");
  assert.equal(safeUrl("ftp://x.example"), null);
});

test("markdown: pathological input stays fast and bounded", () => {
  const t0 = Date.now();
  parseMarkdown("*".repeat(10000));
  parseMarkdown("**a".repeat(3000));
  parseMarkdown("[".repeat(10000));
  parseMarkdown(">".repeat(5000) + " deep");
  parseMarkdown("https://".repeat(1200));
  assert.ok(Date.now() - t0 < 2000, `took ${Date.now() - t0} ms`);
  const deep = render(">".repeat(50) + " x");
  assert.ok(deep.elements.filter((e) => e.tagName === "blockquote").length <= 4);
  assert.ok(parseInline("*".repeat(40) + "x" + "*".repeat(40)).length > 0);
});

// --- Sign-in: return path ------------------------------------------------------------

const ORIGIN = "https://nossuary.com";

test("return path: only same-origin paths under /forums/ (and never the callback)", () => {
  const ok = [
    ["/forums/", "/forums/"],
    ["/forums/thread/?t=1001&page=2#p-5003", "/forums/thread/?t=1001&page=2#p-5003"],
    ["/forums/board/?b=mod-claims", "/forums/board/?b=mod-claims"],
  ];
  for (const [input, want] of ok) assert.equal(safeReturnPath(input, ORIGIN), want, input);
  const bad = [
    null, undefined, "", 42, "forums/", "https://evil.example/forums/", "//evil.example/forums/",
    "/\\evil.example/forums/", "\\\\evil.example", "/forums\\..\\..\\x", "javascript:alert(1)", "/", "/link/done/",
    "/forums/auth/?code=x&state=y", "/forums/auth", "/forums/../link/", "/forums/%2e%2e/link/", "/forumsx/", "/forums",
    "/forums/\nx", "/forums/\tx", `/forums/${"a".repeat(700)}`, " /forums/",
  ];
  for (const input of bad) assert.equal(safeReturnPath(input, ORIGIN), "/forums/", String(input));
});

// --- Sign-in: tab binding --------------------------------------------------------------

function tabStorage(init = {}) {
  const data = new Map(Object.entries(init));
  return { data, setItem: (k, v) => void data.set(k, String(v)), getItem: (k) => (data.has(k) ? data.get(k) : null), removeItem: (k) => void data.delete(k) };
}

function fakeApiClient({ exchange = async () => ({ token: "tok-1", user: { name: "Dr. Marrow" } }), start } = {}) {
  const calls = [];
  const local = tabStorage();
  return {
    calls, local,
    authStart: start || (async () => ({ url: "https://discord.com/oauth2/authorize?client_id=1&state=st-1" })),
    authExchange: async (code, state) => { calls.push({ code, state }); return exchange(code, state); },
    token: { set: (v) => { local.setItem(TOKEN_KEY, v); return true; } },
  };
}

test("callback: trades the code only for the state this tab stored, and spends it", async () => {
  const session = tabStorage({ [STATE_KEY]: "st-1", [RETURN_KEY]: "/forums/thread/?t=7#p-9" });
  const api = fakeApiClient();
  const done = await completeSignIn({ query: new URLSearchParams("code=abc&state=st-1"), session, api, origin: ORIGIN });
  assert.deepEqual(done, { ok: true, returnTo: "/forums/thread/?t=7#p-9", user: { name: "Dr. Marrow" } });
  assert.deepEqual(api.calls, [{ code: "abc", state: "st-1" }]);
  assert.equal(api.local.getItem(TOKEN_KEY), "tok-1");
  assert.equal(session.getItem(STATE_KEY), null);
  assert.equal(session.getItem(RETURN_KEY), null);

  // The same address again (reload, history, a copied link): nothing stored, nothing traded.
  const again = await completeSignIn({ query: new URLSearchParams("code=abc&state=st-1"), session, api, origin: ORIGIN });
  assert.equal(again.reason, "tab");
  assert.equal(api.calls.length, 1);
});

test("callback: another tab's or another person's state trades nothing and stores no token", async () => {
  for (const stored of [undefined, "mine", "st-1x", " st-1"]) {
    const session = tabStorage(stored === undefined ? {} : { [STATE_KEY]: stored });
    const api = fakeApiClient();
    const res = await completeSignIn({ query: new URLSearchParams("code=abc&state=st-1"), session, api, origin: ORIGIN });
    assert.equal(res.ok, false, String(stored));
    assert.equal(res.reason, "tab");
    assert.deepEqual(api.calls, []);
    assert.equal(api.local.getItem(TOKEN_KEY), null);
    assert.equal(session.getItem(STATE_KEY), null, "spent either way");
  }
});

test("callback: cancel, missing params, API failure and a bad answer are all failures with a safe return path", async () => {
  const session = () => tabStorage({ [STATE_KEY]: "st-1", [RETURN_KEY]: "https://evil.example/" });
  const api = fakeApiClient();
  assert.deepEqual(await completeSignIn({ query: new URLSearchParams("error=access_denied&state=st-1"), session: session(), api, origin: ORIGIN }), { ok: false, reason: "cancelled", returnTo: "/forums/" });
  assert.equal((await completeSignIn({ query: new URLSearchParams("state=st-1"), session: session(), api, origin: ORIGIN })).reason, "missing");
  assert.deepEqual(api.calls, []);

  const failing = fakeApiClient({ exchange: async () => { throw new ApiError(400, "invalid", "That sign-in didn't check out."); } });
  const failed = await completeSignIn({ query: new URLSearchParams("code=abc&state=st-1"), session: session(), api: failing, origin: ORIGIN });
  assert.equal(failed.reason, "api");
  assert.equal(failed.error.message, "That sign-in didn't check out.");
  assert.equal(failing.local.getItem(TOKEN_KEY), null);

  const odd = fakeApiClient({ exchange: async () => ({ user: {} }) });
  assert.equal((await completeSignIn({ query: new URLSearchParams("code=abc&state=st-1"), session: session(), api: odd, origin: ORIGIN })).reason, "bad_response");
  assert.equal(odd.local.getItem(TOKEN_KEY), null);
});

test("sign-in click: stores state and a checked return path, and goes only to discord.com", async () => {
  const session = tabStorage();
  let went = null;
  const location = { origin: ORIGIN, assign: (u) => { went = u; } };
  const res = await beginSignIn({ api: fakeApiClient(), session, location, returnTo: "/forums/board/?b=lounge" });
  assert.equal(res.ok, true);
  assert.equal(new URL(went).origin, "https://discord.com");
  assert.equal(session.getItem(STATE_KEY), "st-1");
  assert.equal(session.getItem(RETURN_KEY), "/forums/board/?b=lounge");

  for (const url of ["https://evil.example/oauth2/authorize?state=x", "https://discord.com.evil.example/?state=x", "https://discord.com/oauth2/authorize", "javascript:alert(1)", undefined]) {
    const s = tabStorage();
    went = null;
    const r = await beginSignIn({ api: fakeApiClient({ start: async () => ({ url }) }), session: s, location, returnTo: "/forums/" });
    assert.equal(r.ok, false, String(url));
    assert.equal(went, null);
    assert.equal(s.getItem(STATE_KEY), null);
  }
  const offsite = tabStorage();
  await beginSignIn({ api: fakeApiClient(), session: offsite, location, returnTo: "//evil.example/" });
  assert.equal(offsite.getItem(RETURN_KEY), "/forums/");
});

test("posting note: says why a signed-in member can't post", () => {
  assert.equal(postingNote(null, "https://discord.gg/x"), null);
  assert.equal(postingNote({ can_post: true }, "https://discord.gg/x"), null);
  assert.deepEqual(postingNote({ can_post: false, reason: "not_member" }, "https://discord.gg/PtMaTp385b").link, { label: "Join the Discord", href: "https://discord.gg/PtMaTp385b" });
  assert.equal(postingNote({ can_post: false, reason: "not_member" }, "javascript:alert(1)").link, null);
  assert.match(postingNote({ can_post: false, reason: "screening" }).text, /screening/);
  assert.match(postingNote({ can_post: false, reason: "timeout" }).text, /timed out/);
  assert.ok(postingNote({ can_post: false, reason: null }).text);
});

// --- API client --------------------------------------------------------------------------

function fetchStub(responses) {
  const calls = [];
  const fn = async (url, init) => {
    calls.push({ url, init });
    const next = responses.shift();
    if (next instanceof Error) throw next;
    return typeof next === "function" ? next(url, init) : next;
  };
  fn.calls = calls;
  return fn;
}

const BASE = "https://nossuary-forum.stewbagger.workers.dev";

test("api: the token goes only to the configured base, as a Bearer header", async () => {
  const storage = tabStorage({ [TOKEN_KEY]: "secret-token" });
  const fetch = fetchStub([Response.json({ user: { id: "1" } }), Response.json({ thread_id: "9", post_id: "10" })]);
  const api = createApi({ base: `${BASE}/`, fetch, storage });
  await api.me();
  await api.newThread("mod-claims/../x", "Title", "Body");
  assert.equal(fetch.calls[0].url, `${BASE}/v1/me`);
  assert.equal(fetch.calls[0].init.headers.authorization, "Bearer secret-token");
  assert.equal(fetch.calls[0].init.credentials, "omit");
  assert.equal(fetch.calls[1].url, `${BASE}/v1/boards/mod-claims%2F..%2Fx/threads`);
  assert.deepEqual(JSON.parse(fetch.calls[1].init.body), { title: "Title", body: "Body" });
  for (const c of fetch.calls) {
    assert.ok(c.url.startsWith(`${BASE}/v1/`));
    assert.ok(!c.url.includes("secret-token"));
  }
});

test("api: base URL must be https (loopback http allowed for local testing)", () => {
  assert.equal(normalizeBase(`${BASE}/`), BASE);
  assert.equal(normalizeBase("http://127.0.0.1:8788"), "http://127.0.0.1:8788");
  for (const bad of ["http://nossuary-forum.example", "javascript:alert(1)", "", null, "https://u:p@x.example", "https://x.example/?q=1", "not a url"]) {
    assert.equal(normalizeBase(bad), null, String(bad));
  }
});

test("api: 401 on a write clears the token, tells the page, and fails with a sign-in message", async () => {
  const storage = tabStorage({ [TOKEN_KEY]: "stale" });
  let signedOut = 0;
  const fetch = fetchStub([Response.json({ error: "unauthorized", detail: "expired" }, { status: 401 })]);
  const api = createApi({ base: BASE, fetch, storage, onSignedOut: () => signedOut++ });
  await assert.rejects(api.reply("1001", "hello"), (err) => {
    assert.ok(err instanceof ApiError);
    assert.equal(err.status, 401);
    assert.equal(err.message, "Your sign-in has expired. Sign in with Discord again.");
    return true;
  });
  assert.equal(storage.getItem(TOKEN_KEY), null);
  assert.equal(signedOut, 1);
  assert.equal(fetch.calls.length, 1, "a write is never retried");
});

test("api: 401 on a read clears the token and retries once, signed out", async () => {
  const storage = tabStorage({ [TOKEN_KEY]: "stale" });
  const fetch = fetchStub([new Response("{}", { status: 401 }), Response.json({ categories: [] })]);
  const api = createApi({ base: BASE, fetch, storage });
  assert.deepEqual(await api.categories(), { categories: [] });
  assert.equal(fetch.calls.length, 2);
  assert.equal(fetch.calls[0].init.headers.authorization, "Bearer stale");
  assert.equal(fetch.calls[1].init.headers.authorization, undefined);
  assert.equal(storage.getItem(TOKEN_KEY), null);
});

test("api: 429 says when to try again, from the body or the Retry-After header", async () => {
  const api = (res) => createApi({ base: BASE, fetch: fetchStub([res]), storage: tabStorage({ [TOKEN_KEY]: "t" }) });
  await assert.rejects(api(Response.json({ error: "rate_limited", detail: "slow", retry_after: 42 }, { status: 429 })).reply("1", "x"),
    (e) => e.status === 429 && e.retryAfter === 42 && e.message === "You're doing that too often. Try again in 42 seconds.");
  await assert.rejects(api(new Response("", { status: 429, headers: { "retry-after": "300" } })).reply("1", "x"),
    (e) => e.message === "You're doing that too often. Try again in 5 minutes.");
  await assert.rejects(api(new Response("", { status: 429 })).reply("1", "x"),
    (e) => e.message === "You're doing that too often. Wait a moment and try again.");
  const kept = tabStorage({ [TOKEN_KEY]: "t" });
  await assert.rejects(createApi({ base: BASE, fetch: fetchStub([Response.json({}, { status: 429 })]), storage: kept }).reply("1", "x"));
  assert.equal(kept.getItem(TOKEN_KEY), "t", "a 429 is not a sign-out");
});

test("api: network failure, 5xx, non-JSON and no base all fail with plain messages", async () => {
  const mk = (r) => createApi({ base: BASE, fetch: fetchStub([r]), storage: tabStorage() });
  await assert.rejects(mk(new TypeError("Failed to fetch")).categories(), (e) => e.status === 0 && /Couldn't reach the forum/.test(e.message));
  await assert.rejects(mk(new Response("<html>", { status: 502 })).categories(), (e) => e.status === 502 && /having trouble/.test(e.message));
  await assert.rejects(mk(new Response("<html>", { status: 200 })).categories(), (e) => e.code === "bad_response");
  await assert.rejects(mk(Response.json({ error: "not_found", detail: "No such board." }, { status: 404 })).board("x"), (e) => e.message === "No such board.");
  await assert.rejects(mk(Response.json({ error: "screening" }, { status: 403 })).reply("1", "x"), (e) => /rules screening/.test(e.message));
  await assert.rejects(createApi({ base: null, fetch: fetchStub([]), storage: tabStorage() }).categories(), (e) => e.code === "unavailable");
  assert.equal(await mk(new Response(null, { status: 204 })).logout(), null);
  assert.equal(describeError({ status: 400, detail: "x".repeat(400) }), "The forum couldn't accept that. Check it and try again.");
});

test("api: works end to end against the fake Worker (contract shapes)", async () => {
  const handle = createFakeApi();
  const fetch = async (url, init) => {
    const u = new URL(url);
    const out = await handle(init.method, u.pathname, u.search, init.headers, init.body ? JSON.parse(init.body) : null);
    return out.body ? Response.json(out.body, { status: out.status }) : new Response(null, { status: out.status });
  };
  const storage = tabStorage();
  const api = createApi({ base: BASE, fetch, storage });
  const { categories } = await api.categories();
  assert.deepEqual(categories.map((c) => c.name), ["Null Ossuary", "Project Zomboid", "Enshrouded", "Vintage Story"]);
  const board = await api.board("mod-claims");
  assert.equal(board.board.workshop_id, "3674013419");
  await assert.rejects(api.reply(board.threads[0].id, "hi"), (e) => e.status === 401);
  storage.setItem(TOKEN_KEY, "fake-member");
  const t = await api.newThread("mod-claims", "A new thread", "**hello**");
  const read = await api.thread(t.thread_id);
  assert.equal(read.posts[0].body, "**hello**");
  await assert.rejects(api.reply(t.thread_id, "slow down"), (e) => e.status === 429 && e.retryAfter === 42);
  storage.setItem(TOKEN_KEY, "fake-nonmember");
  await assert.rejects(api.reply(t.thread_id, "hi"), (e) => e.status === 403 && /membership/.test(e.message));
  storage.setItem(TOKEN_KEY, "revoked");
  await api.categories();
  assert.equal(storage.getItem(TOKEN_KEY), null);
});

// --- Render helpers ------------------------------------------------------------------------

test("render helpers: times, permissions, pages, and what counts as a safe id/URL", () => {
  const now = Date.parse("2026-09-13T12:00:00Z");
  assert.equal(relativeTime("2026-09-13T11:59:40Z", now), "just now");
  assert.equal(relativeTime("2026-09-13T11:55:00Z", now), "5 min ago");
  assert.equal(relativeTime("2026-09-13T09:00:00Z", now), "3 h ago");
  assert.equal(relativeTime("2026-09-10T12:00:00Z", now), "3 days ago");
  assert.equal(relativeTime("nonsense", now), "");

  const me = { id: "200", can_post: true, is_staff: false };
  const post = (id, hoursAgo, extra = {}) => ({ id: "1", author: { id }, created_at: new Date(now - hoursAgo * 3600_000).toISOString(), deleted: false, ...extra });
  assert.deepEqual(postPermissions(me, post("200", 2), {}, now), { edit: true, delete: true, report: false });
  assert.deepEqual(postPermissions(me, post("200", 25), {}, now), { edit: false, delete: true, report: false });
  assert.deepEqual(postPermissions(me, post("999", 1), {}, now), { edit: false, delete: false, report: true });
  assert.deepEqual(postPermissions({ ...me, is_staff: true }, post("999", 100), {}, now), { edit: true, delete: true, report: true });
  assert.deepEqual(postPermissions(me, post("200", 1, { deleted: true }), {}, now), { edit: false, delete: false, report: false });
  assert.deepEqual(postPermissions(null, post("200", 1), {}, now), { edit: false, delete: false, report: false });

  assert.deepEqual(pageList(1, 1), [1]);
  assert.deepEqual(pageList(5, 10), [1, null, 4, 5, 6, null, 10]);
  assert.deepEqual(pageList(2, 4), [1, 2, 3, 4]);

  assert.equal(avatarSrc("https://cdn.discordapp.com/avatars/1/a.png"), "https://cdn.discordapp.com/avatars/1/a.png");
  for (const bad of ["javascript:alert(1)", "http://cdn.discordapp.com/a.png", "https://cdn.discordapp.com.evil.example/a.png", null]) assert.equal(avatarSrc(bad), null);
  assert.equal(workshopHref("3674013419"), "https://steamcommunity.com/sharedfiles/filedetails/?id=3674013419");
  assert.equal(workshopHref("1&x=<script>"), null);
  assert.ok(validSlug("mod-claims") && !validSlug("../x") && !validSlug("a b") && !validSlug(""));
  assert.ok(validId("1001") && validId(1001) && !validId("1 OR 1") && !validId("<x>"));
  assert.equal(threadHref("1001", 2, "5003"), "/forums/thread/?t=1001&page=2#p-5003");
});

// --- Pages: build stamps and CSP -----------------------------------------------------------

function walk(dir, pick) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) => {
    const full = path.join(dir, d.name);
    return d.isDirectory() ? walk(full, pick) : pick(full) ? [full] : [];
  });
}

test("pages: one ?v= build stamp across forum pages, forum modules and link pages", () => {
  const files = [
    ...walk(path.join(ROOT, "forums"), (f) => f.endsWith(".html")),
    ...walk(path.join(ROOT, "js", "forum"), (f) => f.endsWith(".js")),
    ...walk(path.join(ROOT, "link"), (f) => f.endsWith(".html")),
  ];
  const stamps = new Map();
  for (const f of files) {
    for (const m of fs.readFileSync(f, "utf8").matchAll(/\?v=([\w.-]+)/g)) {
      stamps.set(m[1], [...(stamps.get(m[1]) || []), path.relative(ROOT, f)]);
    }
  }
  assert.equal(stamps.size, 1, `stamps disagree: ${JSON.stringify(Object.fromEntries(stamps))}`);
  // Every relative import in a forum module carries it, so no module is ever served from a stale cache.
  for (const f of walk(path.join(ROOT, "js", "forum"), (x) => x.endsWith(".js"))) {
    for (const m of fs.readFileSync(f, "utf8").matchAll(/from\s+"(\.[^"]+)"/g)) assert.match(m[1], /\?v=/, `${path.relative(ROOT, f)} imports ${m[1]}`);
  }
});

test("pages: every forum page has the CSP, naming config.js's forumApiUrl origin; only new/ and auth/ are noindex", () => {
  const sandbox = { window: {} };
  vm.runInNewContext(fs.readFileSync(path.join(ROOT, "js", "config.js"), "utf8"), sandbox);
  const apiOrigin = new URL(sandbox.window.OSSUARY.forumApiUrl).origin;
  const boot = fs.readFileSync(path.join(ROOT, "js", "forum", "boot.js"), "utf8");
  assert.ok(boot.includes(`"${sandbox.window.OSSUARY.forumApiUrl}"`), "boot.js DEFAULT_API matches config.js");

  const pages = walk(path.join(ROOT, "forums"), (f) => f.endsWith("index.html"));
  assert.deepEqual(pages.map((p) => path.relative(ROOT, p)).sort(),
    ["forums/auth/index.html", "forums/board/index.html", "forums/index.html", "forums/new/index.html", "forums/thread/index.html"]);
  for (const p of pages) {
    const html = fs.readFileSync(p, "utf8");
    const rel = path.relative(ROOT, p);
    const csp = /http-equiv="Content-Security-Policy" content="([^"]+)"/.exec(html)?.[1];
    assert.ok(csp, `${rel} has a CSP`);
    const directives = Object.fromEntries(csp.split(";").map((d) => d.trim().split(/\s+/)).map(([k, ...v]) => [k, v]));
    assert.deepEqual(directives["default-src"], ["'self'"], rel);
    assert.deepEqual(directives["connect-src"], [apiOrigin], rel);
    assert.deepEqual(directives["img-src"], ["'self'", "https://cdn.discordapp.com", "data:"], rel);
    assert.deepEqual(directives["script-src"], ["'self'"], rel);
    assert.deepEqual(directives["object-src"], ["'none'"], rel);
    assert.deepEqual(directives["base-uri"], ["'none'"], rel);
    assert.deepEqual(directives["form-action"], ["'self'"], rel);
    assert.doesNotMatch(html, /<script(?![^>]*\bsrc=)[^>]*>/, `${rel} has no inline script`);
    assert.doesNotMatch(html, /\son[a-z]+=/i, `${rel} has no inline handlers`);
    const noindex = /<meta name="robots" content="noindex/.test(html);
    assert.equal(noindex, /forums\/(new|auth)\//.test(rel), `${rel} noindex`);
  }
  for (const f of walk(path.join(ROOT, "js", "forum"), (x) => x.endsWith(".js"))) {
    const src = fs.readFileSync(f, "utf8");
    assert.doesNotMatch(src, /\.(innerHTML|outerHTML)\s*=|insertAdjacentHTML|document\.write|\beval\(|new Function/, `${path.relative(ROOT, f)} never parses strings as HTML/code`);
  }
});
