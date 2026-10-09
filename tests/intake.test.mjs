// The deep intake page's pure module in plain node — no browser, no dependencies.
//
//   node --test tests/
//
// What a regression here would quietly break:
//   * a question drawn from a copy in this repo rather than from the Worker, which ORPHANS an
//     answer on the far side instead of replacing it (the question text is the storage key);
//   * a per-answer count that disagrees with the Worker's, so a member writes 1,400 characters,
//     presses send and silently loses 200 of them;
//   * a 403/500/503 shown as "something went wrong", when each one has a different remedy and one
//     of them ("a set is already waiting") is not even an error;
//   * a CSP or build stamp that disagrees with config.js, so the real page cannot reach the Worker
//     or runs a stale module;
//   * any free text from the API reaching the page as HTML. The questions, their helper lines and
//     the consent text are all the Worker's to choose, and this page is where they are drawn.

import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath, pathToFileURL } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(HERE, "..");
const mod = (name) => import(pathToFileURL(path.join(ROOT, "js", "forum", name)).href);

// Imported with NO global document, which is the point of the guard at the foot of page-intake.js:
// everything above main() is pure, so the module can be imported here without the page running.
assert.equal(typeof globalThis.document, "undefined", "page-intake.js must be imported document-free");
const page = await mod("page-intake.js");
const { createApi, ApiError, TOKEN_KEY } = await mod("api.js");

const BASE = "https://nossuary-forum.stewbagger.workers.dev";

/** What GET /v1/intake actually answers (deploy/forum-worker/src/intake.js::getIntake). */
const PAYLOAD = Object.freeze({
  questions: [
    { question: "An object you would be interred with", helper: "A pocket watch, a bad map, a crystal." },
    { question: "Off limits", helper: "ANYTHING THE CHAMBERLAIN MUST NEVER JOKE ABOUT." },
  ],
  max_answer_chars: 1200,
  pending: null,
  consent: { required: true, text: "These answers are used to write lore about you. …/forgetme." },
});

// --- The limit the Worker enforces ------------------------------------------------------------

test("answerLimit: the Worker's figure is used, and a missing or silly one falls back to 1200", () => {
  assert.equal(page.MAX_ANSWER_FALLBACK, 1200, "must track MAX_ANSWER in src/intake.js");
  assert.equal(page.answerLimit(PAYLOAD), 1200);
  assert.equal(page.answerLimit({ max_answer_chars: 400 }), 400);
  for (const bad of [{}, null, { max_answer_chars: 0 }, { max_answer_chars: -5 }, { max_answer_chars: "1200" }, { max_answer_chars: 1.5 }]) {
    assert.equal(page.answerLimit(bad), 1200, JSON.stringify(bad));
  }
  // A Worker claiming a megabyte is not a reason to offer a megabyte-sized box.
  assert.equal(page.answerLimit({ max_answer_chars: 10 ** 9 }), 10000);
});

// --- The questions come from the Worker, and only from the Worker -----------------------------

test("questionList: whatever the Worker sends, with nothing unusable and nothing repeated", () => {
  assert.deepEqual(page.questionList(PAYLOAD), [
    { question: "An object you would be interred with", helper: "A pocket watch, a bad map, a crystal." },
    { question: "Off limits", helper: "ANYTHING THE CHAMBERLAIN MUST NEVER JOKE ABOUT." },
  ]);
  // A blank or non-string question is dropped: an unlabelled box cannot be answered, and the Worker
  // would drop an answer under an unrecognised key anyway.
  assert.deepEqual(page.questionList({ questions: [{ question: "  " }, { question: 7 }, {}, null, "Off limits"] }), []);
  assert.deepEqual(page.questionList({ questions: [{ question: " Off limits " }] }), [{ question: "Off limits", helper: "" }]);
  assert.deepEqual(page.questionList({ questions: [{ question: "A", helper: 9 }] }), [{ question: "A", helper: "" }]);
  assert.deepEqual(page.questionList({ questions: [{ question: "A" }, { question: "A" }] }).length, 1);
  for (const bad of [{}, null, { questions: "no" }, { questions: {} }]) assert.deepEqual(page.questionList(bad), []);
  assert.equal(page.questionList({ questions: Array.from({ length: 200 }, (_, i) => ({ question: `q${i}` })) }).length, page.MAX_QUESTIONS);
});

test("the page holds NO copy of the question set: the text is a storage key on the far side", () => {
  const src = fs.readFileSync(path.join(ROOT, "js", "forum", "page-intake.js"), "utf8");
  const html = fs.readFileSync(path.join(ROOT, "intake", "index.html"), "utf8");
  // Two of the canonical seventeen, in their exact stored form. Either one appearing outside a
  // comment would mean a third copy of a storage key, which is a third chance to drift.
  for (const q of ["An object you would be interred with", "Something you refuse to throw away", "How you would like him to address you"]) {
    assert.ok(!src.includes(q), `page-intake.js names the question ${JSON.stringify(q)}`);
    assert.ok(!html.includes(q), `intake/index.html names the question ${JSON.stringify(q)}`);
  }
  // Nor the consent text, which the Worker serves with them for the same reason.
  assert.ok(!src.includes("/forgetme") && !html.includes("off limits is removed"), "the consent text is the Worker's copy");
});

test("consentOf: the Worker's words, and a silent response still means consent is required", () => {
  assert.deepEqual(page.consentOf(PAYLOAD), { required: true, text: PAYLOAD.consent.text });
  assert.deepEqual(page.consentOf({}), { required: true, text: "" });
  assert.deepEqual(page.consentOf({ consent: { text: "  words  " } }), { required: true, text: "words" });
  assert.deepEqual(page.consentOf({ consent: { required: "no", text: "x" } }), { required: true, text: "x" });
  // Only an explicit false switches the gate off; nothing else is read as "no consent needed".
  assert.deepEqual(page.consentOf({ consent: { required: false, text: "x" } }), { required: false, text: "x" });
});

// --- The answer the Worker will actually store ------------------------------------------------

test("normalizeAnswer: exactly what src/intake.js stores — whitespace collapsed, trimmed, then cut", () => {
  // The Worker does answer.replace(/\s+/g, " ").trim().slice(0, MAX_ANSWER). Computed here so the
  // count under the box is the count the Worker will apply.
  assert.equal(page.normalizeAnswer("  a   brass\n\npocket   watch \n"), "a brass pocket watch");
  assert.equal(page.normalizeAnswer("line one\nline two"), "line one line two", "a typed paragraph break becomes a space");
  assert.equal(page.normalizeAnswer("\t\n  "), "");
  assert.equal(page.normalizeAnswer("abcdef", 3), "abc");
  for (const bad of [undefined, null, 7, {}]) assert.equal(page.normalizeAnswer(bad), "");

  assert.equal(page.overLimit("x".repeat(1200)), false);
  assert.equal(page.overLimit("x".repeat(1201)), true);
  // Collapsing happens BEFORE the measure, so whitespace alone never puts anyone over.
  assert.equal(page.overLimit(`${"x".repeat(1190)}${" ".repeat(50)}`), false);
  assert.equal(page.overLimit("x".repeat(40), 20), true);

  assert.equal(page.countLabel("", 1200), "0 / 1,200");
  assert.equal(page.countLabel("a  b", 1200), "3 / 1,200");
  // Over the limit it keeps counting up rather than sticking at the cap, so the member can see by
  // how much they are over.
  assert.equal(page.countLabel("x".repeat(1500), 1200), "1,500 / 1,200");
});

test("collect: [[question, answer], ...] in the Worker's shape, blanks left out", () => {
  const qs = page.questionList(PAYLOAD);
  assert.deepEqual(page.collect(qs, (i) => ["  a watch ", "my love   life"][i]),
    [["An object you would be interred with", "a watch"], ["Off limits", "my love life"]]);
  // Nobody has to answer all seventeen, and a blank sent as "" would be counted in `queued`.
  assert.deepEqual(page.collect(qs, (i) => (i === 1 ? "my love life" : "   ")), [["Off limits", "my love life"]]);
  assert.deepEqual(page.collect(qs, () => ""), []);
  // The question travels back EXACTLY as it arrived: it is the storage key, not a label.
  assert.deepEqual(page.collect(qs, () => "x").map(([q]) => q), qs.map((q) => q.question));
  assert.deepEqual(page.collect(qs, () => "y".repeat(50), 10), qs.map((q) => [q.question, "y".repeat(10)]));
});

test("submitProblem: consent and at least one answer, said before the Worker has to refuse", () => {
  const some = [["Off limits", "x"]];
  assert.match(page.submitProblem(some, { consented: false }), /Tick the box/);
  assert.match(page.submitProblem([], { consented: true }), /at least one question/);
  assert.equal(page.submitProblem(some, { consented: true }), null);
  // Consent not required (the Worker said so) still needs an answer, and needs no tick.
  assert.equal(page.submitProblem(some, { consentRequired: false, consented: false }), null);
  assert.match(page.submitProblem([], {}), /Tick the box/, "the tick is reported first");
  assert.match(page.submitProblem([]), /Tick the box/, "and consent is required by default");
});

// --- Already waiting, and what was sent -------------------------------------------------------

test("pendingTime: the Worker's created_at is milliseconds, and anything else is no time at all", () => {
  assert.equal(page.pendingTime({ created_at: 1760000000000 }), new Date(1760000000000).toISOString());
  for (const bad of [null, undefined, {}, { created_at: 0 }, { created_at: -1 }, { created_at: "soon" }, { created_at: NaN }]) {
    assert.equal(page.pendingTime(bad), null, JSON.stringify(bad));
  }
});

test("sentLine: the COUNT only — the Worker echoes no answers and neither does the page", () => {
  assert.match(page.sentLine(1), /^Sent\. 1 answer are/);
  assert.match(page.sentLine(17), /^Sent\. 17 answers are/);
  assert.match(page.sentLine(undefined), /^Sent\. 0 answers are/);
  // Sending again is the supported way to change an answer, so the line has to say so.
  assert.match(page.sentLine(3), /replaces one that is still waiting/);
});

// --- Every refusal the contract can produce ---------------------------------------------------

test("describeIntakeError: each of the Worker's refusals gets its own remedy, in plain language", () => {
  const err = (status, code, reason = null) => Object.assign(new ApiError(status, code, "detail", null, reason));
  const said = (...args) => page.describeIntakeError(err(...args));

  // Never reached the API at all.
  assert.match(said(0, "network"), /Nothing was sent/);
  // requireSession / refreshMembership: unauthorized("sign in required" | "session ended").
  assert.match(said(401, "unauthorized"), /Sign in again on the forums/);
  // forbidden("consent_required") from submitIntake, and forbidden("not_member") from requireMember.
  assert.match(said(403, "forbidden", "consent_required"), /consent box/);
  assert.match(said(403, "forbidden", "not_member"), /members of the Null Ossuary Discord/);
  assert.match(said(403, "forbidden"), /wouldn't accept that/);
  // readJson: tooLarge past MAX_BODY (64 KiB), and badRequest for every validation failure.
  assert.match(said(413, "too_large"), /Shorten the longest answers/);
  assert.match(said(400, "bad_request"), /Reload the page/);
  // unavailable(): no DB binding, sign-in unconfigured, no usable member id — or the local
  // "unavailable" api.js raises when forumApiUrl is null.
  assert.match(said(503, "unavailable"), /isn't switched on/);
  assert.match(said(0, "unavailable"), /Nothing was sent/, "network is decided before the code");
  // The one-queued-row-per-member unique index, raced by two tabs: the Worker's INSERT throws and
  // index.js turns a non-HttpError into a 500. "Reload" is the remedy because the reload says
  // whether a set is now waiting.
  assert.match(said(500, "internal"), /Reload the page/);
  assert.match(said(502, "upstream"), /having trouble right now/);
  // Nothing in the contract rate-limits intake, but api.js can still raise one.
  assert.match(page.describeIntakeError(new ApiError(429, "rate_limited", null, 30)), /too often/);

  // Plain text, every time: these are set with textContent.
  for (const s of [said(0, "network"), said(401), said(403, "forbidden", "not_member"), said(500, "internal"), said(503, "unavailable")]) {
    assert.doesNotMatch(s, /[<>&]/, s);
  }
});

// --- The API client's two intake calls --------------------------------------------------------

function tabStorage(init = {}) {
  const data = new Map(Object.entries(init));
  return { data, setItem: (k, v) => void data.set(k, String(v)), getItem: (k) => (data.has(k) ? data.get(k) : null), removeItem: (k) => void data.delete(k) };
}

function fetchStub(responses) {
  const calls = [];
  const fn = async (url, init) => {
    calls.push({ url, init });
    const next = responses.shift();
    if (next instanceof Error) throw next;
    return next;
  };
  fn.calls = calls;
  return fn;
}

test("api: GET /v1/intake and POST /v1/intake, as Bearer, to the one configured origin", async () => {
  const fetch = fetchStub([Response.json(PAYLOAD), Response.json({ queued: 2 }, { status: 202 })]);
  const api = createApi({ base: BASE, fetch, storage: tabStorage({ [TOKEN_KEY]: "secret-token" }) });

  assert.deepEqual(await api.intake(), PAYLOAD);
  const answers = [["Off limits", "my love life"]];
  assert.deepEqual(await api.submitIntake(true, answers), { queued: 2 });

  const [get, post] = fetch.calls;
  assert.equal(get.url, `${BASE}/v1/intake`);
  assert.equal(get.init.method, "GET");
  assert.equal(post.url, `${BASE}/v1/intake`);
  assert.equal(post.init.method, "POST");
  // consent is a GATE, not a field the Worker infers: it has to be sent, as true.
  assert.deepEqual(JSON.parse(post.init.body), { consent: true, answers });
  for (const c of fetch.calls) {
    assert.equal(c.init.headers.authorization, "Bearer secret-token");
    assert.equal(c.init.credentials, "omit");
    assert.ok(!String(c.url).includes("secret-token"), "the token is never in a URL");
  }
});

test("api: a 401 on an intake call is not retried signed-out — both routes are member-only", async () => {
  const storage = tabStorage({ [TOKEN_KEY]: "stale" });
  const fetch = fetchStub([Response.json({ error: "unauthorized", detail: "session ended" }, { status: 401 })]);
  let signedOut = 0;
  const api = createApi({ base: BASE, fetch, storage, onSignedOut: () => { signedOut += 1; } });
  await assert.rejects(api.intake(), (e) => e.status === 401);
  assert.equal(fetch.calls.length, 1, "one request, not a pointless anonymous retry");
  assert.equal(storage.getItem(TOKEN_KEY), null, "the dead token is dropped");
  assert.equal(signedOut, 1);
});

test("api: the Worker's 403 `reason` survives as a field, without changing any forum message", async () => {
  const mk = (res) => createApi({ base: BASE, fetch: fetchStub([res]), storage: tabStorage({ [TOKEN_KEY]: "t" }) });
  await assert.rejects(
    mk(Response.json({ error: "forbidden", detail: "consent is required to submit answers", reason: "consent_required" }, { status: 403 })).submitIntake(false, []),
    (e) => e.reason === "consent_required" && e.code === "forbidden" && e.status === 403,
  );
  await assert.rejects(mk(Response.json({ error: "bad_request", detail: "no recognised answers" }, { status: 400 })).submitIntake(true, [["x", "y"]]),
    (e) => e.reason === null && e.message === "no recognised answers");
  // With forumApiUrl null nothing is sent anywhere.
  await assert.rejects(createApi({ base: null, fetch: fetchStub([]), storage: tabStorage() }).intake(), (e) => e.code === "unavailable");
});

// --- Nothing from the API is ever drawn as HTML -----------------------------------------------
//
// A stand-in document with only what render.js's el() and page-intake.js use. innerHTML,
// insertAdjacentHTML and document.write are ABSENT, so a call to one throws, and serialisation
// escapes the way a browser does.

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const escAttr = (s) => esc(s).replace(/"/g, "&quot;");

function standInDocument() {
  const created = [];
  class Element {
    constructor(tag) {
      this.tagName = tag;
      this.attributes = new Map();
      this.children = [];
      this.text = null;
      this.listeners = [];
      const classes = new Set();
      this.classList = { classes, toggle: (name, on) => (on ? classes.add(name) : classes.delete(name)) };
      created.push(this);
    }
    set className(v) { this.attributes.set("class", String(v)); }
    get className() { return this.attributes.get("class") || ""; }
    set textContent(v) { this.text = String(v); this.children = []; }
    get textContent() { return this.text === null ? this.children.map((c) => (typeof c === "string" ? c : c.textContent)).join("") : this.text; }
    setAttribute(k, v) { this.attributes.set(k, String(v)); }
    append(...nodes) { for (const n of nodes) this.children.push(n); }
    addEventListener(type, fn) { this.listeners.push([type, fn]); }
  }
  return { created, createElement: (tag) => new Element(tag) };
}

function serialize(node) {
  if (typeof node === "string") return esc(node);
  const attrs = [...node.attributes].map(([k, v]) => ` ${k}="${escAttr(v)}"`).join("");
  const inner = node.text === null ? node.children.map(serialize).join("") : esc(node.text);
  return `<${node.tagName}${attrs}>${inner}</${node.tagName}>`;
}

/** Render with a stand-in document installed, then take it away again. */
function withDocument(fn) {
  const doc = standInDocument();
  globalThis.document = doc;
  try {
    return { html: fn(), elements: doc.created };
  } finally {
    delete globalThis.document;
  }
}

const HOSTILE = '</textarea><img src=x onerror="alert(1)"><script>alert(2)</script>';

test("xss: a hostile question, helper and consent text are drawn as text, never as markup", () => {
  const { html, elements } = withDocument(() => {
    const field = page.questionField(0, { question: HOSTILE, helper: `helper ${HOSTILE}` }, 1200);
    const consent = page.consentCard({ required: true, text: `consent ${HOSTILE}` });
    return `${serialize(field.root)}${serialize(consent.root)}`;
  });

  // The text survives intact — it is shown, not stripped — and only ever escaped.
  assert.ok(html.includes(esc(HOSTILE)), "the question is shown");
  assert.equal((html.match(/&lt;script&gt;alert\(2\)&lt;\/script&gt;/g) || []).length, 3, "question, helper and consent text");
  assert.doesNotMatch(html, /<script/i);
  assert.doesNotMatch(html, /<img/i);
  // The one textarea in the output is the page's own, and it is empty: a question that closed it
  // early would show up as a second one, or as content inside it.
  assert.equal((html.match(/<textarea/gi) || []).length, 1);
  assert.match(html, /<textarea[^>]*><\/textarea>/);

  // No tag in the output carries an event handler or came from the payload.
  const tags = html.match(/<[a-z][^>]*>/gi) || [];
  assert.ok(tags.length > 0);
  for (const tag of tags) {
    assert.doesNotMatch(tag, /\son\w+=/i, `event handler attribute in ${tag}`);
  }
  const allowed = new Set(["div", "label", "p", "span", "textarea", "input"]);
  for (const e of elements) assert.ok(allowed.has(e.tagName), `unexpected <${e.tagName}>`);
});

test("xss: the box is capped at the Worker's limit and labelled with it, so a submit cannot fail on length", () => {
  const { elements } = withDocument(() => {
    page.questionField(2, { question: "Off limits", helper: "" }, 400);
    return "";
  });
  const textarea = elements.find((e) => e.tagName === "textarea");
  assert.equal(textarea.attributes.get("maxlength"), "400", "the browser stops typing at the Worker's limit");
  assert.equal(textarea.attributes.get("id"), "intake-q3");
  assert.equal(textarea.attributes.get("aria-describedby"), "intake-q3-count", "no helper, no helper reference");
  const counter = elements.find((e) => e.className.includes("composer-count"));
  assert.equal(counter.textContent, "0 / 400", "the limit is on the page before anything is typed");
  assert.deepEqual(textarea.listeners.map(([t]) => t), ["input"], "the count follows what is typed");
});

test("the module never parses a string as HTML or code", () => {
  const src = fs.readFileSync(path.join(ROOT, "js", "forum", "page-intake.js"), "utf8");
  assert.doesNotMatch(src, /\.(innerHTML|outerHTML)\s*=|insertAdjacentHTML|document\.write|\beval\(|new Function/);
});

// --- The page: stamp, CSP, robots, nav ---------------------------------------------------------

const readRoot = (...p) => fs.readFileSync(path.join(ROOT, ...p), "utf8");
const stampsIn = (text) => new Set([...text.matchAll(/\?v=([\w.-]+)/g)].map((m) => m[1]));

test("one ?v= build stamp across the intake page, its module and the forum surface it loads", () => {
  const surface = new Set([
    ...stampsIn(readRoot("intake", "index.html")),
    ...stampsIn(readRoot("js", "forum", "page-intake.js")),
  ]);
  assert.equal(surface.size, 1, `stamps disagree: ${[...surface].join(", ")}`);
  // The page loads js/forum modules, so its stamp is the FORUM surface's stamp, not a private one:
  // a page on 20261008-1 importing boot.js at an older stamp would run two copies of the bundle.
  const forum = stampsIn(readRoot("js", "forum", "boot.js"));
  assert.deepEqual([...surface], [...forum], "the intake stamp must equal the forum bundle's");

  // Every script and stylesheet the page loads carries it...
  for (const m of readRoot("intake", "index.html").matchAll(/(?:src|href)="(\/(?:js|css)\/[^"]+)"/g)) {
    assert.match(m[1], /\?v=[\w.-]+$/, `${m[1]} has no ?v= stamp`);
  }
  // ...and so does every relative import in the module, or a browser serves one from a stale cache.
  for (const m of readRoot("js", "forum", "page-intake.js").matchAll(/from\s+"(\.[^"]+)"/g)) {
    assert.match(m[1], /\?v=/, `page-intake.js imports ${m[1]}`);
  }
});

test("the CSP names config.js's forumApiUrl origin, and nothing else may be connected to", () => {
  const sandbox = { window: {} };
  vm.runInNewContext(readRoot("js", "config.js"), sandbox);
  const apiOrigin = new URL(sandbox.window.OSSUARY.forumApiUrl).origin;

  const html = readRoot("intake", "index.html");
  const csp = /http-equiv="Content-Security-Policy" content="([^"]+)"/.exec(html)?.[1];
  assert.ok(csp, "the page has a per-page CSP");
  const directives = Object.fromEntries(csp.split(";").map((d) => d.trim().split(/\s+/)).map(([k, ...v]) => [k, v]));
  assert.deepEqual(directives["default-src"], ["'self'"]);
  // Exactly the forum Worker. This page talks to one origin and should not be able to reach another.
  assert.deepEqual(directives["connect-src"], [apiOrigin]);
  // boot.js draws the member's Discord avatar in the header.
  assert.deepEqual(directives["img-src"], ["'self'", "https://cdn.discordapp.com", "data:"]);
  assert.deepEqual(directives["script-src"], ["'self'"]);
  assert.deepEqual(directives["style-src"], ["'self'"]);
  assert.deepEqual(directives["object-src"], ["'none'"]);
  assert.deepEqual(directives["base-uri"], ["'none'"]);
  assert.deepEqual(directives["form-action"], ["'self'"]);

  assert.doesNotMatch(html, /<script(?![^>]*\bsrc=)[^>]*>/, "no inline script");
  assert.doesNotMatch(html, /\son[a-z]+=/i, "no inline handlers");
  assert.doesNotMatch(html, /\sstyle="/i, "no inline style: this page runs style-src 'self'");
});

test("a member-only form is never indexed, and never in the sitemap", () => {
  assert.match(readRoot("intake", "index.html"), /<meta name="robots" content="noindex, nofollow">/);
  // The sitemap is for pages a stranger can use. robots.txt is deliberately not involved: a
  // Disallow line would advertise the path to everyone who reads it.
  assert.ok(!readRoot("sitemap.xml").includes("/intake/"), "sitemap.xml must not list /intake/");
  assert.ok(!readRoot("robots.txt").includes("intake"), "robots.txt must not name /intake/");
});

test("the page loads one stylesheet, as every forum-Worker surface does", () => {
  const sheets = [...readRoot("intake", "index.html").matchAll(/<link rel="stylesheet" href="([^"?]+)/g)].map((m) => m[1]);
  // forums/**/index.html and admin/ load css/style.css and nothing else; roster/ and guides/, which
  // are not Worker surfaces, are the ones with a second file. This is a forum-Worker surface.
  assert.deepEqual(sheets, ["/css/style.css"]);
  const css = readRoot("css", "style.css");
  for (const cls of ["intake-form", "intake-field", "intake-helper", "intake-waiting", "intake-consent", "intake-check", "intake-done"]) {
    assert.ok(css.includes(`.${cls}`), `css/style.css styles .${cls}`);
  }
});

test("the primary nav agrees with the forum pages', and the page keeps the forum's landmarks", () => {
  const navItems = (html) => {
    const nav = /<nav aria-label="Primary">([\s\S]*?)<\/nav>/.exec(html)?.[1] || "";
    return [...nav.matchAll(/<a href="([^"]+)"[^>]*>([^<]+)<\/a>/g)].map((m) => `${m[2]} ${m[1]}`);
  };
  const intake = readRoot("intake", "index.html");
  assert.deepEqual(navItems(intake), navItems(readRoot("forums", "new", "index.html")));
  // /intake/ is not itself in the nav, so nothing on this page is the current page.
  assert.doesNotMatch(/<nav aria-label="Primary">[\s\S]*?<\/nav>/.exec(intake)[0], /aria-current/);

  // boot.js and render.js write into these by id; a renamed one fails silently in a browser.
  for (const id of ["forum-session", "forum-note", "forum-status", "forum-main"]) {
    assert.ok(intake.includes(`id="${id}"`), `the page has #${id} for boot.js/render.js`);
  }
  assert.match(intake, /<noscript>/, "the questions are fetched, so a no-JS visitor is told why the page is empty");
  // The gate and every dead end lead to /forums/, because auth.js::safeReturnPath only honours a
  // return path under /forums/ — a sign-in button here would strand the member there anyway.
  const src = readRoot("js", "forum", "page-intake.js");
  assert.ok(!src.includes("signInButton"), "no sign-in button on this page: it could not come back here");
  assert.ok(src.includes("FORUMS"), "the gate links to /forums/");
});
