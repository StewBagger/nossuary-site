// The forum API client (Worker contract v1). No DOM here, so it runs unchanged under node --test.
//
// The sign-in token lives in localStorage under TOKEN_KEY and is only ever sent as a Bearer header to
// the one API base this client was built with — never in a URL, never to another origin. A 401 means
// the token is dead: it is removed, onSignedOut() is told, and a read is retried once without it so a
// page still loads for a signed-out visitor.

export const TOKEN_KEY = "nossuary.forum.token";

export const LIMITS = Object.freeze({ titleMin: 3, titleMax: 120, bodyMin: 1, bodyMax: 10000 });

export class ApiError extends Error {
  constructor(status, code, detail = null, retryAfter = null) {
    super(describeError({ status, code, detail, retryAfter }));
    this.name = "ApiError";
    this.status = status;       // 0 = never reached the API
    this.code = code;           // the API's `error`, or a local one: "network", "bad_response"
    this.detail = detail;
    this.retryAfter = retryAfter;
  }
}

/** The API base with no trailing slash, or null. https only, except a loopback host for local testing. */
export function normalizeBase(value) {
  if (typeof value !== "string" || !value) return null;
  let url;
  try {
    url = new URL(value);
  } catch {
    return null;
  }
  const loopback = url.hostname === "127.0.0.1" || url.hostname === "localhost";
  if (url.protocol !== "https:" && !(url.protocol === "http:" && loopback)) return null;
  if (url.username || url.password || url.search || url.hash) return null;
  return `${url.origin}${url.pathname.replace(/\/+$/, "")}`;
}

function secondsText(n) {
  const s = Math.max(1, Math.ceil(n));
  if (s < 90) return `${s} second${s === 1 ? "" : "s"}`;
  const m = Math.ceil(s / 60);
  return `${m} minute${m === 1 ? "" : "s"}`;
}

const CODE_MESSAGES = {
  not_member: "Posting needs membership of the Null Ossuary Discord.",
  screening: "Finish the rules screening in the Null Ossuary Discord, then you can post.",
  timeout: "You're timed out in the Null Ossuary Discord, so you can't post right now.",
  locked: "This thread is locked.",
  staff_only: "Only staff can start threads on this board.",
  edit_window: "Posts can only be edited for 24 hours after posting.",
};

/** One friendly sentence for any failure. Plain text: callers set it with textContent. */
export function describeError({ status, code, detail, retryAfter } = {}) {
  if (status === 0 || code === "network") return "Couldn't reach the forum. Check your connection and try again.";
  if (status === 429) {
    return Number.isFinite(retryAfter) && retryAfter > 0
      ? `You're doing that too often. Try again in ${secondsText(retryAfter)}.`
      : "You're doing that too often. Wait a moment and try again.";
  }
  if (status === 401) return "Your sign-in has expired. Sign in with Discord again.";
  if (code && Object.prototype.hasOwnProperty.call(CODE_MESSAGES, code)) return CODE_MESSAGES[code];
  const said = typeof detail === "string" && detail.trim() && detail.length <= 300 ? detail.trim() : null;
  if (status === 403) return said || "You don't have permission to do that.";
  if (status === 404) return said || "That couldn't be found. It may have been moved or deleted.";
  if (status >= 400 && status < 500) return said || "The forum couldn't accept that. Check it and try again.";
  return "The forum is having trouble right now. Try again in a minute.";
}

function safeStore(storage) {
  return {
    get() { try { return storage?.getItem(TOKEN_KEY) || null; } catch { return null; } },
    set(v) { try { storage.setItem(TOKEN_KEY, v); return storage.getItem(TOKEN_KEY) === v; } catch { return false; } },
    clear() { try { storage?.removeItem(TOKEN_KEY); } catch { /* blocked storage: nothing stored anyway */ } },
  };
}

const enc = encodeURIComponent;
const positive = (n) => (Number.isInteger(n) && n > 0 ? n : 1);

/**
 * createApi({ base, fetch, storage, onSignedOut })
 *   base     the forumApiUrl from config (validated by normalizeBase; null = every call fails "unavailable")
 *   fetch    window.fetch (or a fake)
 *   storage  localStorage (or a fake)
 */
export function createApi({ base, fetch: doFetch, storage, onSignedOut = () => {} }) {
  const root = normalizeBase(base);
  const token = safeStore(storage);

  async function request(method, path, { body, read = method === "GET" } = {}) {
    if (!root) throw new ApiError(503, "unavailable", "The forum isn't set up yet.");
    const bearer = token.get();
    const headers = { accept: "application/json" };
    if (bearer) headers.authorization = `Bearer ${bearer}`;
    if (body !== undefined) headers["content-type"] = "application/json";

    let res;
    try {
      res = await doFetch(`${root}${path}`, {
        method,
        headers,
        body: body === undefined ? undefined : JSON.stringify(body),
        cache: "no-store",
        credentials: "omit",
        referrerPolicy: "no-referrer",
      });
    } catch {
      throw new ApiError(0, "network");
    }

    if (res.status === 401 && bearer) {
      token.clear();
      try { onSignedOut(); } catch { /* the page's problem, not the request's */ }
      if (read) return request(method, path, { body, read: false });
    }

    if (res.status === 204) return null;
    let data = null;
    try {
      data = await res.json();
    } catch {
      data = null;
    }
    if (!res.ok) {
      let retry = Number(data?.retry_after);
      if (!Number.isFinite(retry)) retry = Number(res.headers?.get?.("retry-after"));
      throw new ApiError(res.status, typeof data?.error === "string" ? data.error : "http",
        typeof data?.detail === "string" ? data.detail : null, Number.isFinite(retry) ? retry : null);
    }
    if (!data || typeof data !== "object") throw new ApiError(res.status, "bad_response");
    return data;
  }

  return {
    base: root,
    token,

    authStart: () => request("GET", "/v1/auth/start"),
    authExchange: (code, state) => request("POST", "/v1/auth/exchange", { body: { code, state }, read: false }),
    me: () => request("GET", "/v1/me", { read: false }),
    logout: () => request("POST", "/v1/auth/logout", { read: false }),

    categories: () => request("GET", "/v1/categories"),
    board: (slug, page = 1) => request("GET", `/v1/boards/${enc(slug)}?page=${positive(page)}`),
    thread: (id, page = 1) => request("GET", `/v1/threads/${enc(id)}?page=${positive(page)}`),

    newThread: (slug, title, body) => request("POST", `/v1/boards/${enc(slug)}/threads`, { body: { title, body } }),
    reply: (id, body) => request("POST", `/v1/threads/${enc(id)}/posts`, { body: { body } }),
    editPost: (id, body) => request("PATCH", `/v1/posts/${enc(id)}`, { body: { body } }),
    deletePost: (id) => request("DELETE", `/v1/posts/${enc(id)}`),
    reportPost: (id, reason) => request("POST", `/v1/posts/${enc(id)}/report`, { body: { reason } }),

    threadAction: (id, action) => {
      if (!["pin", "unpin", "lock", "unlock"].includes(action)) throw new Error(`unknown thread action ${action}`);
      return request("POST", `/v1/threads/${enc(id)}/${action}`);
    },
    moveThread: (id, board) => request("POST", `/v1/threads/${enc(id)}/move`, { body: { board } }),
    deleteThread: (id) => request("DELETE", `/v1/threads/${enc(id)}`),
  };
}
