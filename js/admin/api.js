// The admin portal API client (Worker contract v1). No DOM here, so it runs unchanged under
// node --test.
//
// The sign-in token is the FORUM'S: one Discord session, two Workers. It lives in localStorage
// under the same key and is only ever sent as a Bearer header to the one API base this client was
// built with — never in a URL, never to another origin.
//
// NOTHING THIS CLIENT CALLS TOUCHES A GAME SERVER. Every write is queued; Chamberlain polls the
// queue, re-checks the grant against its own store and acts. So a refusal can arrive twice: once
// from the Worker (you do not hold that level, per its derived copy) and once from the authority,
// in the command's `error` after the fact. The second is the one that decided anything.

export const TOKEN_KEY = "nossuary.forum.token";

// Used when config.js is missing the key. Keep in step with config.js and with connect-src in
// admin/index.html's CSP.
export const DEFAULT_API = "https://nossuary-portal.stewbagger.workers.dev";

/** Actions, and the one-word verb a button shows. */
export const ACTION_LABELS = Object.freeze({
  restart: "Restart",
  restart_cancel: "Cancel restart",
  start: "Start",
  stop: "Stop",
  skip_next_restart: "Skip next restart",
});

/** In-game commands, and the fields each one takes.
 *
 * Declared together so a control and its inputs cannot drift apart: adding a command
 * without saying what it needs draws a button that the Worker then refuses, which is
 * the failure the capability lists exist to prevent one layer down.
 *
 * `min`/`max` here are for the browser's own number input. They are a convenience,
 * not the rule -- the Worker checks types and sizes, and the game box decides what is
 * actually sensible for Project Zomboid. */
export const COMMAND_SPECS = Object.freeze({
  horde_spawn: {
    label: "Spawn horde",
    fields: [{ name: "count", kind: "number", label: "Zombies", min: 1, max: 200, value: 20, required: true }],
  },
  horde_stop: { label: "Stop horde", fields: [] },
  horde_night: { label: "Force horde night", fields: [] },
  horde_schedule: {
    label: "Reschedule horde night",
    fields: [{ name: "day", kind: "number", label: "World day", min: 1, max: 100000, required: true }],
  },
  airdrop: {
    label: "Air drop",
    fields: [
      { name: "player", kind: "text", label: "On player (optional)", placeholder: "anyone" },
      {
        name: "crate", kind: "choice", label: "Crate (optional)",
        choices: [["", "Random"], ["military", "Military"], ["medical", "Medical"],
          ["materials", "Materials"], ["fooddrink", "Food/Drink"],
          ["toolsmelee", "Tools/Melee"], ["literature", "Literature"]],
      },
    ],
  },
  supply_event: { label: "Supply event", fields: [] },
});

/** Which actions want a confirmation before they are sent. */
export const DESTRUCTIVE = Object.freeze(new Set(["stop", "start", "restart"]));

export class PortalError extends Error {
  constructor(status, code, detail = null) {
    super(describeError({ status, code, detail }));
    this.name = "PortalError";
    this.status = status;     // 0 = never reached the API
    this.code = code;
    this.detail = detail;
  }
}

const CODE_MESSAGES = {
  mfa_required: "Turn on two-factor authentication for your Discord account, then sign in again.",
  not_member: "The portal needs membership of the Null Ossuary Discord.",
  not_owner: "Only the owner can change who has access.",
  forbidden: "You don't have that level of access on this server.",
  unknown_server: "That server isn't configured.",
  unsupported: "This server can't do that.",
  restart_already_pending: "A restart is already scheduled for this server.",
  restart_in_progress: "That server is restarting already.",
  no_restart_pending: "There's no restart scheduled to cancel.",
  bridge_absent: "The server's in-game bridge isn't answering. Try again shortly.",
  unreachable: "Chamberlain couldn't reach that server.",
  queued_grants_disabled: "Grant changes through the website are switched off.",
};

/** One friendly sentence for any failure. Plain text: callers set it with textContent. */
export function describeError({ status, code, detail } = {}) {
  if (status === 0 || code === "network") return "Couldn't reach the portal. Check your connection and try again.";
  if (status === 401) return "Your portal session has expired. Sign in again.";
  if (status === 503) return "The portal isn't configured yet.";
  if (code && CODE_MESSAGES[code]) return CODE_MESSAGES[code];
  if (typeof detail === "string" && detail) return detail;
  return "Something went wrong. Try again.";
}

/** The API base with no trailing slash, or null. https only, except loopback for local testing. */
export function normalizeBase(value) {
  if (typeof value !== "string" || !value) return null;
  let url;
  try { url = new URL(value); } catch { return null; }
  const loopback = url.hostname === "127.0.0.1" || url.hostname === "localhost";
  if (url.protocol !== "https:" && !(url.protocol === "http:" && loopback)) return null;
  if (url.username || url.password || url.search || url.hash) return null;
  return `${url.origin}${url.pathname.replace(/\/+$/, "")}`;
}

export function createApi({ base, token = null, fetchImpl = fetch, onSignedOut = () => {} } = {}) {
  const root = normalizeBase(base);
  let bearer = token;

  async function call(method, path, body) {
    if (!root) throw new PortalError(0, "unconfigured");
    const headers = {};
    if (bearer) headers.authorization = `Bearer ${bearer}`;
    if (body !== undefined) headers["content-type"] = "application/json";
    let res;
    try {
      res = await fetchImpl(root + path, {
        method, headers,
        body: body === undefined ? undefined : JSON.stringify(body),
      });
    } catch {
      throw new PortalError(0, "network");
    }
    let data = null;
    try {
      const text = await res.text();
      data = text ? JSON.parse(text) : null;
    } catch {
      data = null;
    }
    if (res.status === 401) {
      // The token is dead, or the portal's shorter window has passed. Either way the
      // page must stop pretending it is signed in.
      bearer = null;
      onSignedOut();
      throw new PortalError(401, data?.error || "unauthorized", data?.detail || null);
    }
    if (!res.ok) throw new PortalError(res.status, data?.reason || data?.error || "error", data?.detail || null);
    return data;
  }

  return {
    get configured() { return Boolean(root); },
    setToken(v) { bearer = v; },
    me: () => call("GET", "/v1/portal/me"),
    servers: () => call("GET", "/v1/portal/servers"),
    /** Queue one action. Returns {id, state}; the outcome arrives later via command(). */
    /** Queue an in-game command with its declared parameters. */
    runCommand: (serverKey, command, params = {}) =>
      call("POST", "/v1/portal/commands", { server_key: serverKey, action: command, ...params }),
    run: (serverKey, action, { delaySeconds = null, reason = null } = {}) => {
      const body = { server_key: serverKey, action };
      if (delaySeconds !== null && delaySeconds !== undefined) body.delay_s = delaySeconds;
      if (reason) body.reason = reason;
      return call("POST", "/v1/portal/commands", body);
    },
    command: (id) => call("GET", `/v1/portal/commands/${encodeURIComponent(id)}`),
    grants: () => call("GET", "/v1/portal/grants"),
    setGrant: (discordId, serverKey, level) =>
      call("POST", "/v1/portal/grants", { discord_id: discordId, server_key: serverKey, level }),
  };
}

/**
 * Poll one queued command until the authority writes an outcome.
 *
 * The queue is polled by Chamberlain every few seconds, so an answer normally lands almost at
 * once. `timeoutMs` is not a failure of the command — it is this page giving up on watching.
 * The command may still run, which is why the message says so rather than "it failed".
 */
export async function awaitOutcome(api, id, { timeoutMs = 45000, intervalMs = 1000, sleep = null } = {}) {
  const wait = sleep || ((ms) => new Promise((r) => setTimeout(r, ms)));
  const deadline = Date.now() + timeoutMs;
  for (;;) {
    const row = await api.command(id);
    if (row && row.state === "done") return row;
    if (Date.now() >= deadline) return { ...(row || { id }), state: "pending", timedOut: true };
    await wait(intervalMs);
  }
}

/** How long since Chamberlain's last push before a card is "not being heard from".
 *
 * Status is pushed every 60s by default, so five minutes is four missed pushes: long
 * enough that one slow tick is not an alarm, short enough that an admin is not shown a
 * player count from another era while deciding whether to restart. */
export const STATUS_SILENT_MS = 5 * 60 * 1000;

/**
 * One server's status as a line a person can read.
 *
 * `kind` drives the colour; `headline` is the sentence; `detail` is the supporting
 * line, or "" when there is nothing useful to add.
 *
 * SILENCE IS NOT OFFLINE, and this is the distinction the whole function exists for.
 * "The server is down" and "I have not heard about this server" call for completely
 * different actions -- restart the one, go and look at Chamberlain for the other --
 * and showing them the same way sends an admin to the wrong place.
 */
export function describeStatus(server, now = Date.now()) {
  const at = Number(server && server.status_at);
  const s = server && server.status;
  if (!s || !Number.isFinite(at)) {
    return { kind: "silent", headline: "No status yet", detail: "Chamberlain hasn't reported on this server." };
  }
  if (now - at > STATUS_SILENT_MS) {
    return { kind: "silent", headline: "Not being heard from", detail: `Last update ${ago(now - at)} ago.` };
  }
  const count = Number.isFinite(Number(s.player_count)) ? Number(s.player_count) : 0;
  const max = Number.isFinite(Number(s.max_players)) ? Number(s.max_players) : null;
  const who = count === 0 ? "nobody on" : `${count}${max ? `/${max}` : ""} on`;

  if (s.state === "restarting") return { kind: "busy", headline: "Restarting", detail: "" };
  if (s.state === "starting") return { kind: "busy", headline: "Starting", detail: "" };
  if (s.state === "unreachable") {
    return { kind: "silent", headline: "Chamberlain can't reach it", detail: "The server may be fine; the Warden isn't answering." };
  }
  if (!s.online) return { kind: "down", headline: "Offline", detail: "" };
  if (s.stale) {
    // The far side answered but its own view is old: up and quiet, not down.
    return { kind: "warn", headline: `Online, reporting late`, detail: who };
  }
  const pending = s.lifecycle && s.lifecycle.restart_pending;
  const secs = pending && Number(s.lifecycle.restart && s.lifecycle.restart.seconds_remaining);
  if (pending && Number.isFinite(secs) && secs > 0) {
    return { kind: "warn", headline: `Restart in ${ago(secs * 1000)}`, detail: who };
  }
  return { kind: "up", headline: "Online", detail: who };
}

function ago(ms) {
  const s = Math.max(1, Math.round(ms / 1000));
  if (s < 90) return `${s}s`;
  const m = Math.round(s / 60);
  if (m < 90) return `${m} minute${m === 1 ? "" : "s"}`;
  const h = Math.round(m / 60);
  return `${h} hour${h === 1 ? "" : "s"}`;
}
