// The admin page: sign in with the forum's session, list your servers, act on one.
//
// Everything the API returns is written with textContent. Nothing is ever inserted as HTML —
// server names and error detail both come from outside this page.
//
// The page never claims a command succeeded because it was accepted. Accepting only means it is
// queued; the outcome arrives when Chamberlain has re-checked the grant and acted, and the button
// stays busy until then.
import {
  ACTION_LABELS, ADMIN_SPECS, COMMAND_SPECS, DEFAULT_API, DESTRUCTIVE, TOKEN_KEY,
  awaitOutcome, createApi, describeError, describeStatus,
} from "./api.js?v=20260922-1";

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
  if (Array.isArray(server.commands) && server.commands.length) {
    box.append(commandSection(api, box, server));
  }
  if (Array.isArray(server.admin) && server.admin.length) {
    box.append(adminSection(api, box, server));
  }
  return box;
}

/** The commands the box refuses without a typed phrase.
 *
 * Visually separated and last, because they are not things you reach for. Each shows
 * what it will do, what to type, and an input that starts EMPTY and stays empty until
 * a person fills it. Prefilling it would make the page perform the confirmation
 * instead of the admin, which is the whole point of there being one. */
function adminSection(api, box, server) {
  const wrap = el("section", "admin-danger");
  wrap.append(el("h3", "admin-danger-title", "Careful"));
  for (const name of server.admin) {
    const spec = ADMIN_SPECS[name];
    if (!spec) continue;
    const form = el("form", "admin-command admin-command--danger");
    const head = el("div", "admin-danger-head");
    head.append(el("span", "admin-command-name", spec.label));
    head.append(el("span", "admin-warning", spec.warning));
    form.append(head);

    const inputs = new Map();
    for (const field of spec.fields) {
      const id = `adm-${server.server_key}-${name}-${field.name}`;
      const label = el("label", "admin-field");
      label.htmlFor = id;
      label.append(el("span", "admin-field-label", field.label));
      let input;
      if (field.kind === "choice") {
        input = document.createElement("select");
        for (const [value, text] of field.choices) {
          const option = document.createElement("option");
          option.value = value;
          option.textContent = text;
          input.append(option);
        }
      } else {
        input = document.createElement("input");
        input.type = "text";
        input.required = true;
      }
      input.id = id;
      input.className = "admin-input";
      label.append(input);
      inputs.set(field.name, { input, field });
      form.append(label);
    }

    const confirmLabel = el("label", "admin-field admin-field--confirm");
    const cid = `adm-${server.server_key}-${name}-confirm`;
    confirmLabel.htmlFor = cid;
    confirmLabel.append(el("span", "admin-field-label",
      spec.phraseIsPlayer ? "Retype the player's name" : `Type: ${spec.phrase}`));
    const confirm = document.createElement("input");
    confirm.type = "text";
    confirm.id = cid;
    confirm.className = "admin-input admin-input--confirm";
    confirm.required = true;
    confirm.autocomplete = "off";
    // No placeholder carrying the phrase and no value: the box must be filled by a
    // person, not by the page being helpful.
    confirmLabel.append(confirm);
    form.append(confirmLabel);

    if (spec.preview) {
      const look = el("button", "admin-action", "Show what would go");
      look.type = "button";
      look.addEventListener("click", () => preview(api, box, server, spec.preview, wrap));
      form.append(look);
    }
    const go = el("button", "admin-action admin-action--danger", spec.label);
    go.type = "submit";
    form.append(go);
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      runDangerous(api, box, form, server, name, spec, inputs, confirm);
    });
    wrap.append(form);
  }
  return wrap;
}

async function preview(api, box, server, command, wrap) {
  const outcome = $(".admin-outcome", box);
  outcome.textContent = "Checking…";
  outcome.className = "admin-outcome admin-outcome--pending";
  try {
    const { id } = await api.runCommand(server.server_key, command, {});
    const done = await awaitOutcome(api, id);
    const list = done.result && Array.isArray(done.result.unused) ? done.result.unused : null;
    if (!done.ok) {
      outcome.textContent = describeError({ status: 200, code: done.error });
      outcome.className = "admin-outcome admin-outcome--error";
      return;
    }
    const old = $(".admin-preview", wrap);
    if (old) old.remove();
    const panel = el("p", "admin-preview");
    if (!list || !list.length) {
      panel.textContent = "Nothing unused — there is nothing to delete.";
    } else {
      const n = done.result.count ?? list.length;
      panel.append(el("span", "admin-preview-count", `${n} folder${n === 1 ? "" : "s"} would go: `));
      panel.append(el("span", null, list.join(", ")));
    }
    wrap.append(panel);
    outcome.textContent = "";
    outcome.className = "admin-outcome";
  } catch (err) {
    outcome.textContent = describeError(err);
    outcome.className = "admin-outcome admin-outcome--error";
  }
}

async function runDangerous(api, box, form, server, name, spec, inputs, confirm) {
  const outcome = $(".admin-outcome", box);
  const params = {};
  for (const [key, { input, field }] of inputs) {
    const raw = input.value.trim();
    if (!raw && field.required) {
      outcome.textContent = `${field.label} is needed.`;
      outcome.className = "admin-outcome admin-outcome--error";
      return;
    }
    if (raw) params[key] = raw;
  }
  // Sent exactly as typed. The box decides whether it is right; this page does not
  // check, trim or complete it.
  params.confirm = confirm.value;
  if (!params.confirm.trim()) {
    outcome.textContent = "Type the confirmation to continue.";
    outcome.className = "admin-outcome admin-outcome--error";
    return;
  }
  const buttons = form.querySelectorAll("button");
  for (const b of buttons) b.disabled = true;
  outcome.textContent = `${spec.label}: queued — waiting for Chamberlain…`;
  outcome.className = "admin-outcome admin-outcome--pending";
  try {
    const { id } = await api.runAdmin(server.server_key, name, params);
    const done = await awaitOutcome(api, id, { timeoutMs: 90000 });
    if (done.timedOut) {
      outcome.textContent = "Still waiting. It may still be running — reload to check.";
      outcome.className = "admin-outcome admin-outcome--pending";
    } else if (done.ok) {
      outcome.textContent = describeDangerous(name, done.result, spec);
      outcome.className = "admin-outcome admin-outcome--ok";
      confirm.value = "";
    } else {
      outcome.textContent = describeError({ status: 200, code: done.error });
      outcome.className = "admin-outcome admin-outcome--error";
    }
  } catch (err) {
    outcome.textContent = describeError(err);
    outcome.className = "admin-outcome admin-outcome--error";
  } finally {
    for (const b of buttons) b.disabled = false;
  }
}

function describeDangerous(name, result, spec) {
  if (name === "clean_mods") {
    const n = (result && result.count) || 0;
    return n ? `Deleted ${n} unused mod folder${n === 1 ? "" : "s"}.` : "Nothing was unused.";
  }
  if (name === "update_server") return "Update started. The server will restart when it finishes.";
  if (name === "set_access_level") {
    const who = result && result.player;
    const lvl = result && result.level;
    const power = result && result.privileged ? " — that is real power in game." : "";
    return `${who} is now ${lvl}.${power}`;
  }
  return `${spec.label}: done.`;
}

/** In-game commands: things done IN the world rather than to the server.
 *
 * Their own section, below the lifecycle row, because they are a different kind of
 * act and because most of them take a value. Each is its own little form so one
 * pending command does not lock the others -- spawning a horde and scheduling one
 * are unrelated, and a shared busy state would imply otherwise. */
function commandSection(api, box, server) {
  const wrap = el("section", "admin-commands");
  wrap.append(el("h3", "admin-commands-title", "In game"));
  for (const name of server.commands) {
    const spec = COMMAND_SPECS[name];
    // A command the page has no spec for is skipped rather than drawn bare: the
    // server said it can do it, but this page would not know what to ask for.
    if (!spec) continue;
    const form = el("form", "admin-command");
    form.append(el("span", "admin-command-name", spec.label));
    const inputs = new Map();
    for (const field of spec.fields) {
      const id = `cmd-${server.server_key}-${name}-${field.name}`;
      const label = el("label", "admin-field");
      label.htmlFor = id;
      label.append(el("span", "admin-field-label", field.label));
      let input;
      if (field.kind === "choice") {
        input = document.createElement("select");
        for (const [value, text] of field.choices) {
          const option = document.createElement("option");
          option.value = value;
          option.textContent = text;
          input.append(option);
        }
      } else {
        input = document.createElement("input");
        input.type = field.kind === "number" ? "number" : "text";
        if (field.min !== undefined) input.min = String(field.min);
        if (field.max !== undefined) input.max = String(field.max);
        if (field.value !== undefined) input.value = String(field.value);
        if (field.placeholder) input.placeholder = field.placeholder;
        if (field.required) input.required = true;
      }
      input.id = id;
      input.className = "admin-input";
      label.append(input);
      inputs.set(field.name, { input, field });
      form.append(label);
    }
    const go = el("button", "admin-action", "Run");
    go.type = "submit";
    form.append(go);
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      runCommand(api, box, form, server, name, spec, inputs);
    });
    wrap.append(form);
  }
  return wrap;
}

async function runCommand(api, box, form, server, name, spec, inputs) {
  const outcome = $(".admin-outcome", box);
  const params = {};
  for (const [key, { input, field }] of inputs) {
    const raw = input.value.trim();
    if (!raw) {
      if (field.required) {
        outcome.textContent = `${field.label} is needed.`;
        outcome.className = "admin-outcome admin-outcome--error";
        return;
      }
      continue;   // omitted, not sent empty: the box treats absent as "you choose"
    }
    params[key] = field.kind === "number" ? Number(raw) : raw;
  }
  const buttons = form.querySelectorAll("button");
  for (const b of buttons) b.disabled = true;
  outcome.textContent = `${spec.label}: queued — waiting for Chamberlain…`;
  outcome.className = "admin-outcome admin-outcome--pending";
  try {
    const { id } = await api.runCommand(server.server_key, name, params);
    const done = await awaitOutcome(api, id);
    if (done.timedOut) {
      outcome.textContent = "Still waiting. The command may still run — reload to check.";
      outcome.className = "admin-outcome admin-outcome--pending";
    } else if (done.ok) {
      outcome.textContent = `${spec.label}: done.`;
      outcome.className = "admin-outcome admin-outcome--ok";
    } else {
      outcome.textContent = describeError({ status: 200, code: done.error });
      outcome.className = "admin-outcome admin-outcome--error";
    }
  } catch (err) {
    outcome.textContent = describeError(err);
    outcome.className = "admin-outcome admin-outcome--error";
  } finally {
    for (const b of buttons) b.disabled = false;
  }
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
