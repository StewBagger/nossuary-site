// Shared DOM building for the forum pages. Every string from the API goes in through textContent
// (the `text` attribute of el()) or into an attribute this file names — never through innerHTML.
// The pure helpers at the top (times, URLs, validation of ids) take no document and are unit-tested.

export const FORUMS = "/forums/";

// --- Pure helpers ----------------------------------------------------------------

const SLUG = /^[a-z0-9][a-z0-9_-]{0,63}$/i;
const ID = /^[A-Za-z0-9_-]{1,64}$/;

export const validSlug = (v) => typeof v === "string" && SLUG.test(v);
export const validId = (v) => (typeof v === "string" || typeof v === "number") && ID.test(String(v));

/** ?page=N as a positive integer, defaulting to 1. */
export function pageParam(value) {
  const n = Number(value);
  return Number.isInteger(n) && n > 0 && n < 100000 ? n : 1;
}

export function boardHref(slug, page = 1) {
  const q = new URLSearchParams({ b: slug });
  if (page > 1) q.set("page", String(page));
  return `${FORUMS}board/?${q}`;
}

export function threadHref(id, page = 1, postId = null) {
  const q = new URLSearchParams({ t: String(id) });
  if (page > 1) q.set("page", String(page));
  return `${FORUMS}thread/?${q}${postId != null && validId(postId) ? `#p-${postId}` : ""}`;
}

export const newThreadHref = (slug) => `${FORUMS}new/?${new URLSearchParams({ b: slug })}`;

const storeId = (id) =>
  (typeof id === "string" || typeof id === "number") && /^\d{1,20}$/.test(String(id)) ? String(id) : null;

export function workshopHref(id) {
  const n = storeId(id);
  return n ? `https://steamcommunity.com/sharedfiles/filedetails/?id=${n}` : null;
}

/** The Vintage Story ModDB, by numeric asset id. The alias URL is prettier but an
 * alias can be changed by whoever owns the mod page; the asset id cannot. */
export function moddbHref(id) {
  const n = storeId(id);
  return n ? `https://mods.vintagestory.at/show/mod/${n}` : null;
}

/**
 * Where a mod board's "↗" chip points, or null for a board that is not about a
 * published mod. A board carries at most one store id (the seed generator refuses
 * both), so this returns one link and never has to choose between two.
 */
export function storeLink(board) {
  const ws = workshopHref(board?.workshop_id);
  if (ws) return { href: ws, short: "Workshop ↗", long: "View on Steam Workshop ↗", where: "Steam Workshop" };
  const md = moddbHref(board?.moddb_id);
  if (md) return { href: md, short: "ModDB ↗", long: "View on the Vintage Story ModDB ↗", where: "the Vintage Story ModDB" };
  return null;
}

/** Only Discord's CDN over https — anything else is not shown (the page CSP would refuse it anyway). */
export function avatarSrc(url) {
  if (typeof url !== "string") return null;
  try {
    const u = new URL(url);
    return u.protocol === "https:" && u.hostname === "cdn.discordapp.com" ? u.href : null;
  } catch {
    return null;
  }
}

/** "just now", "5 min ago", "3 h ago", "2 days ago", then a date. */
export function relativeTime(iso, now = Date.now()) {
  const t = Date.parse(iso);
  if (!Number.isFinite(t)) return "";
  const s = Math.round((now - t) / 1000);
  if (s < 45) return "just now";
  const m = Math.round(s / 60);
  if (m < 60) return `${m} min ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h} h ago`;
  const d = Math.round(h / 24);
  if (d < 2) return "yesterday";
  if (d < 30) return `${d} days ago`;
  return new Date(t).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export function absoluteTime(iso) {
  const t = Date.parse(iso);
  if (!Number.isFinite(t)) return "";
  return new Date(t).toLocaleString(undefined, { dateStyle: "full", timeStyle: "short" });
}

export const EDIT_WINDOW_MS = 24 * 60 * 60 * 1000;

/** What this user may do to this post. The API enforces all of it; this only decides what to show. */
export function postPermissions(user, post, thread, now = Date.now()) {
  const none = { edit: false, delete: false, report: false };
  if (!user || !post || post.deleted) return none;
  const own = post.author && String(post.author.id) === String(user.id);
  const fresh = now - Date.parse(post.created_at) <= EDIT_WINDOW_MS;
  const staff = !!user.is_staff;
  return {
    edit: staff || (own && fresh && !!user.can_post && !thread?.locked),
    delete: staff || (own && !!user.can_post),
    report: !own,
  };
}

/** Page numbers to show: always first and last, a window round the current one, null for a gap. */
export function pageList(page, pages, around = 1) {
  const out = [];
  for (let n = 1; n <= pages; n++) {
    if (n === 1 || n === pages || Math.abs(n - page) <= around) out.push(n);
    else if (out[out.length - 1] !== null) out.push(null);
  }
  return out;
}

export const count = (n, one, many = `${one}s`) => `${Number.isFinite(n) ? n.toLocaleString("en-GB") : 0} ${n === 1 ? one : many}`;

// --- DOM -------------------------------------------------------------------------

export const $ = (sel, root = document) => root.querySelector(sel);

/** el("a", {class, text, href, ...}, ...children). `text` is textContent; other keys are attributes. */
export function el(tag, attrs = {}, ...children) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v === null || v === undefined || v === false) continue;
    if (k === "class") node.className = v;
    else if (k === "text") node.textContent = v;
    else node.setAttribute(k, v === true ? "" : String(v));
  }
  for (const c of children) if (c !== null && c !== undefined && c !== false) node.append(c);
  return node;
}

export function timeEl(iso, cls = "") {
  return el("time", { class: cls || null, datetime: iso, title: absoluteTime(iso), text: relativeTime(iso) });
}

/** A round avatar, or the name's initial when there is no usable image (or it fails to load). */
export function avatar(user, size = 40) {
  const initial = el("span", { class: "avatar avatar-initial", "aria-hidden": "true", text: (user?.name || "?").trim().charAt(0).toUpperCase() || "?" });
  const src = avatarSrc(user?.avatar_url);
  if (!src) return initial;
  const img = el("img", { class: "avatar", src, alt: "", width: size, height: size, loading: "lazy", referrerpolicy: "no-referrer" });
  img.addEventListener("error", () => img.replaceWith(initial), { once: true });
  return img;
}

export const staffBadge = () => el("span", { class: "badge badge-staff", text: "Staff" });

export function breadcrumb(parts) {
  const ol = el("ol");
  parts.forEach((p, i) => {
    const last = i === parts.length - 1;
    ol.append(el("li", {}, p.href && !last ? el("a", { href: p.href, text: p.label }) : el("span", { "aria-current": last ? "page" : null, text: p.label })));
  });
  return el("nav", { class: "crumbs", "aria-label": "Breadcrumb" }, ol);
}

export function pagination(page, pages, hrefFor) {
  if (!(pages > 1)) return null;
  const ul = el("ul");
  const item = (label, n, extra = {}) => ul.append(el("li", {},
    n ? el("a", { href: hrefFor(n), text: label, "aria-current": n === page && !extra.rel ? "page" : null, rel: extra.rel || null, "aria-label": extra.label || null })
      : el("span", { class: extra.cls || "pager-gap", text: label, "aria-hidden": extra.cls ? null : "true" })));
  item("← Prev", page > 1 ? page - 1 : null, { rel: "prev", cls: "pager-off", label: "Previous page" });
  for (const n of pageList(page, pages)) n === null ? item("…", null) : item(String(n), n);
  item("Next →", page < pages ? page + 1 : null, { rel: "next", cls: "pager-off", label: "Next page" });
  return el("nav", { class: "pager", "aria-label": "Pages" }, ul);
}

/** The page's main status line (role=alert region in the HTML). Empty text hides it. */
export function showStatus(message, kind = "error") {
  const box = $("#forum-status");
  if (!box) return;
  box.textContent = message || "";
  box.hidden = !message;
  box.className = `forum-status forum-status-${kind}`;
}

/** Replace the loading placeholder in #forum-main with nodes. */
export function mount(...nodes) {
  const main = $("#forum-main");
  main.replaceChildren(...nodes.filter(Boolean));
  main.setAttribute("aria-busy", "false");
}

export function emptyState(title, line, ...actions) {
  actions = actions.filter(Boolean);
  return el("div", { class: "card forum-empty" },
    el("p", { class: "eyebrow", text: "∅" }),
    el("h2", { text: title }),
    line ? el("p", { class: "muted", text: line }) : null,
    actions.length ? el("p", { class: "cta" }, ...actions) : null);
}
