// The admin page: sign in with the forum's session, list your servers, act on one.
//
// Everything the API returns is written with textContent. Nothing is ever inserted as HTML —
// server names and error detail both come from outside this page.
//
// The page never claims a command succeeded because it was accepted. Accepting only means it is
// queued; the outcome arrives when Chamberlain has re-checked the grant and acted, and the button
// stays busy until then.
import {
  ACTION_LABELS, DEFAULT_API, DESTRUCTIVE, TOKEN_KEY, awaitOutcome, createApi, describeError,
  describeStatus,
} from "./api.js?v=20260921-2";

const $ = (sel, root = document) => root.querySelector(sel);

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

let storage = null;
try { storage = window.localStorage; } catch { storage = null; }

function config() {
  const cfg = window.OSSUARY || {};
  return cfg.portalApiUrl === undefined ? DEFAULT_API : cfg.portalApiUrl;
}

function say(message, kind = "info") {
  const box = $("#admin-status");
  if (!box) return;
  box.textContent = message;
  box.className = `admin-status admin-status--${kind}`;
  box.hidden = !message;
}

function signedOut(reason) {
  const main = $("#admin-main");
  if (main) main.replaceChildren();
  const gate = $("#admin-gate");
  if (gate) {
    gate.hidden = false;
    $("#admin-gate-reason").textContent = reason;
  }
}

async function main() {
  document.documentElement.classList.remove("no-js");
  const token = storage ? storage.getItem(TOKEN_KEY) : null;
  const api = createApi({
    base: config(),
    token,
    onSignedOut: () => { if (storage) storage.removeItem(TOKEN_KEY); },
  });

  if (!api.configured) {
    signedOut("The portal isn't configured yet.");
    return;
  }
  if (!token) {
    // Sessions are the forum's, so signing in happens there. Sending people to a
    // second sign-in would mint a second session for the same account.
    signedOut("Sign in on the forums first — the portal uses the same sign-in.");
    return;
  }

  let me;
  try {
    me = await api.me();
  } catch (err) {
    signedOut(describeError(err));
    return;
  }
  $("#admin-gate").hidden = true;
  $("#admin-who").textContent = me.user.name;

  let servers;
  try {
    ({ servers } = await api.servers());
  } catch (err) {
    say(describeError(err), "error");
    return;
  }

  const main_ = $("#admin-main");
  main_.replaceChildren();
  if (!servers.length) {
    main_.append(el("p", "admin-empty",
      "You don't have access to any servers yet. The owner grants it per server."));
    return;
  }
  for (const server of servers) main_.append(card(api, server));
}

function card(api, server) {
  const box = el("section", "admin-card");
  const head = el("header", "admin-card-head");
  head.append(el("h2", null, server.display_name));
  head.append(el("span", "admin-level", server.level));
  box.append(head);
  box.append(statusBlock(server));

  if (!server.actions.length) {
    box.append(el("p", "admin-empty", "No actions available at your level."));
    return box;
  }
  const row = el("div", "admin-actions");
  for (const action of server.actions) {
    const button = el("button", "admin-action", ACTION_LABELS[action] || action);
    button.type = "button";
    button.dataset.action = action;
    button.addEventListener("click", () => act(api, box, row, server, action));
    row.append(button);
  }
  box.append(row);
  box.append(el("p", "admin-outcome"));
  return box;
}

/** The live state of one server: a headline, a supporting line, and who is on.
 *
 * Player names are here because "who is on right now" is most of what you want before
 * restarting something. The public status document on the front page deliberately
 * carries a count and no names; this is the same fact shown to someone holding a grant
 * on this server, not a widening of the public one. */
function statusBlock(server) {
  const wrap = el("div", "admin-status-block");
  const verdict = describeStatus(server);
  const line = el("p", `admin-state admin-state--${verdict.kind}`);
  line.append(el("span", "admin-dot", ""));
  line.append(el("span", null, verdict.headline));
  if (verdict.detail) line.append(el("span", "admin-state-detail", ` — ${verdict.detail}`));
  wrap.append(line);

  const s = server.status;
  if (s) {
    const bits = [];
    if (s.next_restart) bits.push(`Next restart ${s.next_restart}`);
    const w = s.world;
    if (w && Number.isFinite(Number(w.hour))) {
      const hh = String(w.hour).padStart(2, "0");
      const mm = String(w.minutes ?? 0).padStart(2, "0");
      bits.push(`In-game ${hh}:${mm}${w.weather ? `, ${w.weather}` : ""}`);
    }
    if (bits.length) wrap.append(el("p", "admin-substate", bits.join(" · ")));
    if (Array.isArray(s.players) && s.players.length) {
      const who = el("p", "admin-players");
      who.append(el("span", "admin-players-label", "On now: "));
      // textContent, like everything else here: these names come from the game.
      who.append(el("span", null, s.players.join(", ")));
      wrap.append(who);
    }
  }
  return wrap;
}

function busy(row, on) {
  for (const b of row.querySelectorAll("button")) b.disabled = on;
}

async function act(api, box, row, server, action) {
  const outcome = $(".admin-outcome", box);
  if (DESTRUCTIVE.has(action)) {
    const verb = (ACTION_LABELS[action] || action).toLowerCase();
    // A real confirmation naming the server: the whole reason this exists is that
    // people were firing commands at the wrong one.
    if (!window.confirm(`${verb.charAt(0).toUpperCase()}${verb.slice(1)} ${server.display_name}?`)) return;
  }
  busy(row, true);
  outcome.textContent = "Queued — waiting for Chamberlain…";
  outcome.className = "admin-outcome admin-outcome--pending";
  try {
    const { id } = await api.run(server.server_key, action);
    const done = await awaitOutcome(api, id);
    if (done.timedOut) {
      outcome.textContent = "Still waiting. The command may still run — reload to check.";
      outcome.className = "admin-outcome admin-outcome--pending";
    } else if (done.ok) {
      outcome.textContent = describeSuccess(action, done.result);
      outcome.className = "admin-outcome admin-outcome--ok";
    } else {
      outcome.textContent = describeError({ status: 200, code: done.error });
      outcome.className = "admin-outcome admin-outcome--error";
    }
  } catch (err) {
    outcome.textContent = describeError(err);
    outcome.className = "admin-outcome admin-outcome--error";
    if (err && err.status === 401) signedOut("Your portal session has expired. Sign in again on the forums.");
  } finally {
    busy(row, false);
  }
}

function describeSuccess(action, result) {
  const seconds = result && Number(result.seconds_remaining);
  if (action === "restart" && Number.isFinite(seconds) && seconds > 0) {
    const mins = Math.round(seconds / 60);
    return `Restart scheduled — players are being warned for about ${mins} minute${mins === 1 ? "" : "s"}.`;
  }
  if (action === "restart") return "Restarting now.";
  if (action === "restart_cancel") return "Restart cancelled.";
  if (action === "start") return result && result.started === false ? "Already online." : "Starting.";
  if (action === "stop") return "Stopping.";
  if (action === "skip_next_restart") return "The next scheduled restart will be skipped.";
  return "Done.";
}

main().catch(() => say("Something went wrong loading the portal.", "error"));
