// A stand-in for the forum Worker (API v1), for previewing forums/ locally and for tests. In-memory,
// realistic sample data; not the real backend and not shipped anywhere but this repo.
//
//   node tests/fixtures/fake-forum-api.mjs [port]      (default 8788)
//
// Sign-in without Discord: put one of these in localStorage "nossuary.forum.token" —
//   fake-staff  fake-member  fake-nonmember  fake-screening  fake-timeout
// GET /v1/auth/start answers a discord.com URL like the real one would; nothing there works offline.

import http from "node:http";
import { pathToFileURL } from "node:url";

const HOUR = 3600_000;
const ago = (ms) => new Date(Date.now() - ms).toISOString();

const USERS = {
  "fake-staff": { id: "100", name: "Stew", avatar_url: null, is_staff: true, can_post: true, reason: null },
  "fake-member": { id: "200", name: "Dr. Marrow", avatar_url: null, is_staff: false, can_post: true, reason: null },
  "fake-nonmember": { id: "300", name: "wanderer_77", avatar_url: null, is_staff: false, can_post: false, reason: "not_member" },
  "fake-screening": { id: "400", name: "NewBones", avatar_url: null, is_staff: false, can_post: false, reason: "screening" },
  "fake-timeout": { id: "500", name: "LoudLarry", avatar_url: null, is_staff: false, can_post: false, reason: "timeout" },
};
const person = (u) => ({ id: u.id, name: u.name, avatar_url: u.avatar_url, is_staff: u.is_staff });
const STEW = person(USERS["fake-staff"]);
const MARROW = person(USERS["fake-member"]);
const RUST = { id: "210", name: "RustyNail", avatar_url: null, is_staff: false };
const KNOX = { id: "220", name: "knox_county_survivor", avatar_url: null, is_staff: false };
const EVIL = { id: "666", name: "<img src=x onerror=alert(1)>", avatar_url: "javascript:alert(1)", is_staff: false };

const MODS = [
  ["claims", "Jeeve's Claims", "3674013419", "Property, vehicle and animal ownership with faction sharing."],
  ["zones", "Jeeve's Zones", "3739941052", "Paint regions onto the map with their own rules."],
  ["hordes", "Jeeve's Hordes", "3672042113", "Horde night events."],
  ["drops", "Jeeve's Drops", "3672451284", "Airdrops and supply events."],
];

export function makeData() {
  const categories = [
    { slug: "null-ossuary", name: "Null Ossuary", description: "Announcements, the site, the Discord and everything that isn't a game.", boards: [
      { slug: "announcements", name: "Announcements", description: "News from staff. Only staff start threads here; replies are open.", staff_only_threads: true },
      { slug: "lounge", name: "The Lounge", description: "AI tooling, code, automation and general talk." },
    ] },
    { slug: "project-zomboid", name: "Project Zomboid", description: "Build 42, our Null County servers and the Jeeves mods.", boards: [
      { slug: "pz-general", name: "General", description: "Anything Project Zomboid." },
      { slug: "null-county", name: "Null County servers", description: "Server questions, events, bug reports and appeals for Null County and the Proving Grounds." },
      ...MODS.map(([slug, name, workshop_id, description]) => ({ slug: `mod-${slug}`, name, description, workshop_id })),
    ] },
    { slug: "enshrouded", name: "Enshrouded", description: "Building, bosses and the Shroud.", boards: [
      { slug: "enshrouded", name: "Enshrouded", description: "Everything Enshrouded." },
    ] },
    { slug: "vintage-story", name: "Vintage Story", description: "Survival, smithing and temporal storms.", boards: [
      { slug: "vintage-story", name: "Vintage Story", description: "Everything Vintage Story." },
    ] },
  ];
  const boards = new Map();
  for (const c of categories) for (const b of c.boards) boards.set(b.slug, { ...b, category: { slug: c.slug, name: c.name } });

  const threads = new Map();
  const posts = new Map();
  let nextThread = 1000;
  let nextPost = 5000;
  const addThread = (board, title, author, bodies, { pinned = false, locked = false, startedAgo = 48 * HOUR } = {}) => {
    const id = String(nextThread++);
    const list = bodies.map(([a, body, at, extra = {}], i) => {
      const p = { id: String(nextPost++), thread_id: id, author: a, body, created_at: ago(at ?? startedAgo - i * HOUR), edited_at: null, deleted: false, ...extra };
      posts.set(p.id, p);
      return p.id;
    });
    threads.set(id, { id, board, title, pinned, locked, created_at: ago(startedAgo), author, posts: list });
    return id;
  };

  addThread("mod-claims", "Read first: how to report a Claims bug", STEW, [
    [STEW, "Before you post a bug:\n\n- Check you're on the **latest stable** upload — servers can only run the latest.\n- Include your server's `SandboxVars` claim settings if you changed them.\n- Say what you *expected* and what happened.\n\nLogs help most. Paste the relevant part in a code block:\n\n```\nERROR: JeevesClaims.onClaimTick: attempted index: owner of non-table\n  at Claims/Server/Tick.lua:212\n```\n\nThe Workshop page is https://steamcommunity.com/sharedfiles/filedetails/?id=3674013419.", 30 * 24 * HOUR],
  ], { pinned: true, locked: true, startedAgo: 30 * 24 * HOUR });

  const long = [
    "I've been running Claims on a 16-player server for a couple of weeks and the faction sharing is great, but I hit something odd with **vehicles**.",
    "",
    "Steps:",
    "- Claim a car as player A",
    "- Add player B to the faction",
    "- Player B can open the doors but *not* the trunk",
    "",
    "> Faction members should have the same access as the owner unless the owner restricts it.",
    "> — the mod description",
    "",
    "Is the trunk meant to be separate? Tried with `ClaimsVehicleShareTrunk = true` too.",
  ].join("\n");
  const t2 = addThread("mod-claims", "Faction members can't open a claimed car's trunk", MARROW, [
    [MARROW, long, 20 * HOUR],
    [RUST, "Same here. Doors fine, trunk says *This vehicle is claimed*.", 19 * HOUR],
    [STEW, "Reproduced — the trunk uses a different container check than the doors. Fixed in experimental; it'll reach stable with the next push.\n\nThanks for the clear steps, that made it a two-minute find.", 6 * HOUR, { edited_at: ago(5 * HOUR) }],
    [KNOX, "spam spam spam", 5 * HOUR, { deleted: true, body: "" }],
    [EVIL, "Trying to break things: <script>alert(1)</script> [click](javascript:alert(1)) **<b>bold</b>** https://example.com/\"><img src=x onerror=alert(2)>", 4 * HOUR],
    [MARROW, "Brilliant, thanks. Will test on the Proving Grounds tonight.", 25 * 60_000],
  ], { startedAgo: 20 * HOUR });
  for (let i = 0; i < 24; i++) {
    const p = { id: String(nextPost++), thread_id: t2, author: i % 2 ? RUST : KNOX, body: `Filler reply ${i + 1} to push the thread onto a second page.`, created_at: ago(20 * 60_000 - i * 30_000), edited_at: null, deleted: false };
    posts.set(p.id, p);
    threads.get(t2).posts.push(p.id);
  }
  addThread("mod-claims", "Can claims expire while I'm on holiday?", KNOX, [
    [KNOX, "Going away for two weeks. Will my base unclaim itself?", 3 * 24 * HOUR],
    [MARROW, "Depends on the server's expiry setting. On Null County it's 21 days of inactivity.", 3 * 24 * HOUR - HOUR],
  ], { startedAgo: 3 * 24 * HOUR });

  for (let i = 0; i < 26; i++) {
    addThread("pz-general", i === 0 ? "Best early-game base locations in Riverside?" : `General thread number ${i + 1} about surviving the Knox Event`, i % 3 ? RUST : MARROW,
      [[i % 3 ? RUST : MARROW, "What do you all think?", (i + 1) * 5 * HOUR]], { startedAgo: (i + 1) * 5 * HOUR, pinned: i === 3 });
  }
  addThread("announcements", "The forums are open", STEW, [[STEW, "Welcome to the **Null Ossuary forums**. Sign in with Discord to post.", 2 * HOUR]], { pinned: true, startedAgo: 2 * HOUR });
  return { categories, boards, threads, posts, next: () => String(nextPost++), nextThread: () => String(nextThread++) };
}

const THREADS_PER_PAGE = 20;
const POSTS_PER_PAGE = 20;

export function createFakeApi(db = makeData()) {
  const json = (status, body, extra = {}) => ({ status, body, headers: extra });
  const err = (status, error, detail, extra = {}) => json(status, { error, detail, ...extra });

  const threadSummary = (t) => {
    const ps = t.posts.map((id) => db.posts.get(id));
    const last = ps[ps.length - 1];
    return { id: t.id, title: t.title, author: t.author, created_at: t.created_at, replies: ps.length - 1, last_post_at: last.created_at, last_author_name: last.author.name, pinned: t.pinned, locked: t.locked };
  };
  const boardThreads = (slug) => [...db.threads.values()].filter((t) => t.board === slug)
    .sort((a, b) => (b.pinned - a.pinned) || (Date.parse(threadSummary(b).last_post_at) - Date.parse(threadSummary(a).last_post_at)));
  const publicBoard = (b) => {
    const ts = boardThreads(b.slug);
    const latest = ts.map(threadSummary).sort((x, y) => Date.parse(y.last_post_at) - Date.parse(x.last_post_at))[0];
    return {
      slug: b.slug, name: b.name, description: b.description, threads: ts.length,
      posts: ts.reduce((n, t) => n + t.posts.length, 0),
      ...(b.workshop_id ? { workshop_id: b.workshop_id } : {}),
      ...(b.staff_only_threads ? { staff_only_threads: true } : {}),
      last: latest ? { thread_id: latest.id, title: latest.title, author_name: latest.last_author_name, at: latest.last_post_at } : null,
    };
  };
  const paged = (items, per, page) => {
    const pages = Math.max(1, Math.ceil(items.length / per));
    const p = Math.min(Math.max(1, page), pages);
    return { slice: items.slice((p - 1) * per, p * per), page: p, pages };
  };

  return async function handle(method, pathname, search, headers, body) {
    const auth = /^Bearer (.+)$/.exec(headers.authorization || "");
    const user = auth ? USERS[auth[1]] : null;
    if (auth && !user) return err(401, "unauthorized", "Sign in again.");
    const page = Number(new URLSearchParams(search).get("page")) || 1;
    const needUser = () => (user ? null : err(401, "unauthorized", "Sign in first."));
    const needPoster = () => needUser() || (user.can_post ? null : err(403, user.reason, "You can't post."));
    const needStaff = () => needUser() || (user.is_staff ? null : err(403, "forbidden", "Staff only."));
    let m;

    if (method === "GET" && pathname === "/v1/auth/start") return json(200, { url: "https://discord.com/oauth2/authorize?client_id=1&response_type=code&scope=identify&state=fake-state" });
    if (method === "POST" && pathname === "/v1/auth/exchange") return body?.code === "good" ? json(200, { token: "fake-member", user: USERS["fake-member"] }) : err(400, "invalid", "That sign-in didn't check out.");
    if (method === "GET" && pathname === "/v1/me") return needUser() || json(200, { user });
    if (method === "POST" && pathname === "/v1/auth/logout") return { status: 204 };

    if (method === "GET" && pathname === "/v1/categories") {
      return json(200, { categories: db.categories.map((c) => ({ slug: c.slug, name: c.name, description: c.description, boards: c.boards.map((b) => publicBoard(db.boards.get(b.slug))) })) });
    }
    if ((m = /^\/v1\/boards\/([^/]+)$/.exec(pathname)) && method === "GET") {
      const b = db.boards.get(decodeURIComponent(m[1]));
      if (!b) return err(404, "not_found", "No such board.");
      const { slice, page: p, pages } = paged(boardThreads(b.slug), THREADS_PER_PAGE, page);
      return json(200, { board: { slug: b.slug, name: b.name, description: b.description, ...(b.workshop_id ? { workshop_id: b.workshop_id } : {}), ...(b.staff_only_threads ? { staff_only_threads: true } : {}), category: b.category }, threads: slice.map(threadSummary), page: p, pages });
    }
    if ((m = /^\/v1\/boards\/([^/]+)\/threads$/.exec(pathname)) && method === "POST") {
      const b = db.boards.get(decodeURIComponent(m[1]));
      if (!b) return err(404, "not_found", "No such board.");
      const denied = needPoster();
      if (denied) return denied;
      if (b.staff_only_threads && !user.is_staff) return err(403, "staff_only", "Staff only.");
      const title = String(body?.title || "").trim();
      const text = String(body?.body || "");
      if (title.length < 3 || title.length > 120) return err(400, "invalid", "Titles need 3–120 characters.");
      if (!text.trim() || text.length > 10000) return err(400, "invalid", "Posts need 1–10000 characters.");
      const id = db.nextThread();
      const p = { id: db.next(), thread_id: id, author: person(user), body: text, created_at: new Date().toISOString(), edited_at: null, deleted: false };
      db.posts.set(p.id, p);
      db.threads.set(id, { id, board: b.slug, title, pinned: false, locked: false, created_at: p.created_at, author: person(user), posts: [p.id] });
      return json(201, { thread_id: id, post_id: p.id });
    }
    if ((m = /^\/v1\/threads\/([^/]+)$/.exec(pathname))) {
      const t = db.threads.get(decodeURIComponent(m[1]));
      if (!t) return err(404, "not_found", "No such thread.");
      if (method === "GET") {
        const b = db.boards.get(t.board);
        const { slice, page: p, pages } = paged(t.posts.map((id) => db.posts.get(id)), POSTS_PER_PAGE, page);
        return json(200, {
          thread: { id: t.id, title: t.title, pinned: t.pinned, locked: t.locked, created_at: t.created_at, board: { slug: b.slug, name: b.name }, category: b.category },
          posts: slice.map((x) => ({ id: x.id, author: x.author, body: x.deleted ? "" : x.body, created_at: x.created_at, edited_at: x.edited_at, deleted: x.deleted })),
          page: p, pages,
        });
      }
      if (method === "DELETE") { const d = needStaff(); if (d) return d; db.threads.delete(t.id); return { status: 204 }; }
    }
    if ((m = /^\/v1\/threads\/([^/]+)\/(posts|pin|unpin|lock|unlock|move)$/.exec(pathname)) && method === "POST") {
      const t = db.threads.get(decodeURIComponent(m[1]));
      if (!t) return err(404, "not_found", "No such thread.");
      if (m[2] === "posts") {
        const denied = needPoster();
        if (denied) return denied;
        if (t.locked && !user.is_staff) return err(403, "locked", "Locked.");
        const text = String(body?.body || "");
        if (!text.trim() || text.length > 10000) return err(400, "invalid", "Posts need 1–10000 characters.");
        if (text.includes("slow down")) return err(429, "rate_limited", "Too fast.", { retry_after: 42 });
        const p = { id: db.next(), thread_id: t.id, author: person(user), body: text, created_at: new Date().toISOString(), edited_at: null, deleted: false };
        db.posts.set(p.id, p);
        t.posts.push(p.id);
        return json(201, { post_id: p.id, page: Math.ceil(t.posts.length / POSTS_PER_PAGE) });
      }
      const d = needStaff();
      if (d) return d;
      if (m[2] === "move") {
        if (!db.boards.has(body?.board)) return err(400, "invalid", "No such board.");
        t.board = body.board;
      } else {
        t[m[2].replace(/^un/, "") === "pin" ? "pinned" : "locked"] = !m[2].startsWith("un");
      }
      return { status: 204 };
    }
    if ((m = /^\/v1\/posts\/([^/]+)(\/report)?$/.exec(pathname))) {
      const p = db.posts.get(decodeURIComponent(m[1]));
      if (!p || p.deleted) return err(404, "not_found", "No such post.");
      const denied = needUser();
      if (denied) return denied;
      if (m[2] && method === "POST") return String(body?.reason || "").trim() ? { status: 204 } : err(400, "invalid", "Give a reason.");
      const own = p.author.id === user.id;
      if (method === "PATCH") {
        if (!user.is_staff && !(own && Date.now() - Date.parse(p.created_at) < 24 * HOUR)) return err(403, "edit_window", "Too late to edit.");
        const text = String(body?.body || "");
        if (!text.trim() || text.length > 10000) return err(400, "invalid", "Posts need 1–10000 characters.");
        p.body = text;
        p.edited_at = new Date().toISOString();
        return json(200, { ok: true });
      }
      if (method === "DELETE") {
        if (!user.is_staff && !own) return err(403, "forbidden", "Not yours.");
        p.deleted = true;
        return { status: 204 };
      }
    }
    return err(404, "not_found", "No such route.");
  };
}

/** Serve over HTTP with permissive CORS (the preview site runs on another port). */
export function serve(port = 8788, handle = createFakeApi()) {
  const server = http.createServer(async (req, res) => {
    const cors = { "access-control-allow-origin": "*", "access-control-allow-headers": "authorization, content-type", "access-control-allow-methods": "GET, POST, PATCH, DELETE, OPTIONS", "access-control-max-age": "600" };
    if (req.method === "OPTIONS") { res.writeHead(204, cors); res.end(); return; }
    let raw = "";
    for await (const chunk of req) raw += chunk;
    let body = null;
    try { body = raw ? JSON.parse(raw) : null; } catch { body = null; }
    const url = new URL(req.url, "http://fake");
    const out = await handle(req.method, url.pathname, url.search, req.headers, body);
    res.writeHead(out.status, { ...cors, ...(out.body ? { "content-type": "application/json" } : {}), ...(out.headers || {}) });
    res.end(out.body ? JSON.stringify(out.body) : undefined);
  });
  return new Promise((resolve) => server.listen(port, "127.0.0.1", () => resolve(server)));
}

if (import.meta.url === pathToFileURL(process.argv[1] || "").href) {
  const port = Number(process.argv[2]) || 8788;
  await serve(port);
  console.log(`fake forum API on http://127.0.0.1:${port}`);
}
