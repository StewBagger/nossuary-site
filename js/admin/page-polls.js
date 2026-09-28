// The poll authoring page (/admin/polls/).
//
// WHAT THIS PAGE IS FOR
// Chamberlain already owns polls and `/poll create` works without any of this. What a
// form adds is AUTHORING: a textarea instead of a 4000-character slash-command string,
// one field per option with reordering, and a theme picker beside a preview of the
// splash art. It does not widen what a poll can be -- Discord renders the same embed
// and the same buttons whichever surface asked for it.
//
// NOTHING HERE POSTS ANYTHING. Every write is queued; Chamberlain polls the queue,
// re-checks whether this member may open a poll AT ALL against the live guild member,
// and acts (Discord-Automation DR-0010). So a refusal can arrive twice: once from the
// Worker, and once from the authority in the command's `error` after the fact. The
// second is the one that decided anything.
//
// EVERYTHING THE API RETURNS IS WRITTEN WITH textContent. A poll question is typed by
// a person and an option label is typed by a person; neither is ever inserted as HTML,
// and tests/admin.test.mjs fails the build if this file learns how.
//
// THE PREVIEW IS AN APPROXIMATION AND SAYS SO. The real card is drawn by Pillow on
// Chamberlain (chamberlain/poll_card.py) and there is no way to ask for one from here
// -- nothing at home accepts inbound connections (Web-Development DR-0002). So the
// preview reproduces the theme's accent, label and typography in CSS and is labelled
// as a likeness, rather than quietly implying it is the artwork.

import {
  DEFAULT_API, POLL_MAX_OPTIONS, TOKEN_KEY, awaitOutcome, checkPollOptions,
  createApi, describeError, describePoll, tallyRows,
} from "./api.js?v=20260928-3";

const state = {
  api: null,
  catalogue: null,
  optionCount: 2,
  limits: { max_options: POLL_MAX_OPTIONS },
};

const $ = (id) => document.getElementById(id);

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined && text !== null) node.textContent = String(text);
  return node;
}

function clear(node) {
  while (node.firstChild) node.removeChild(node.firstChild);
}

function status(message, kind = "") {
  const box = $("admin-status");
  if (!box) return;
  box.textContent = message || "";
  box.className = `forum-status admin-status${kind ? ` admin-outcome--${kind}` : ""}`;
  box.hidden = !message;
}

function gate(reason) {
  const box = $("admin-gate");
  const why = $("admin-gate-reason");
  if (why) why.textContent = reason;
  if (box) box.hidden = false;
  const main = $("admin-main");
  if (main) {
    clear(main);
    main.removeAttribute("aria-busy");
  }
}

// -- the compose form ------------------------------------------------------

/** One option row: a letter, a field, and the two buttons that move it.
 *
 * Reordering is the whole reason this is a form and not a slash command, so it is
 * buttons rather than drag-and-drop: a drag target is unusable by keyboard and
 * invisible to a screen reader, and these lists are never longer than ten rows. */
function optionRow(index, value = "") {
  const row = el("div", "poll-option");
  const letter = el("span", "poll-option-letter", "ABCDEFGHIJKLMNOPQRSTUVWXY"[index] || "?");
  const input = el("input", "admin-input poll-option-input");
  input.type = "text";
  input.maxLength = 70;
  input.value = value;
  input.placeholder = index < 2 ? "Required" : "Optional";
  input.setAttribute("aria-label", `Option ${letter.textContent}`);
  input.addEventListener("input", renderPreview);

  const up = el("button", "admin-action poll-move", "↑");
  up.type = "button";
  up.title = "Move up";
  up.addEventListener("click", () => swapOption(index, index - 1));
  const down = el("button", "admin-action poll-move", "↓");
  down.type = "button";
  down.title = "Move down";
  down.addEventListener("click", () => swapOption(index, index + 1));
  const drop = el("button", "admin-action poll-move", "×");
  drop.type = "button";
  drop.title = "Remove";
  drop.addEventListener("click", () => removeOption(index));

  row.append(letter, input, up, down, drop);
  return row;
}

function optionInputs() {
  return Array.from(document.querySelectorAll(".poll-option-input"));
}

function optionValues() {
  return optionInputs().map((i) => i.value);
}

function renderOptions(values) {
  const box = $("poll-options");
  if (!box) return;
  const list = values.slice(0, state.limits.max_options);
  while (list.length < 2) list.push("");
  clear(box);
  list.forEach((value, i) => box.append(optionRow(i, value)));
  const add = $("poll-add-option");
  if (add) add.disabled = list.length >= state.limits.max_options;
  renderPreview();
}

function swapOption(from, to) {
  const values = optionValues();
  if (to < 0 || to >= values.length) return;
  [values[from], values[to]] = [values[to], values[from]];
  renderOptions(values);
}

function removeOption(index) {
  const values = optionValues();
  if (values.length <= 2) {
    // Two is the floor, so the button empties the field instead of removing a row
    // the form would immediately have to put back.
    values[index] = "";
  } else {
    values.splice(index, 1);
  }
  renderOptions(values);
}

/** The theme currently chosen, from the pushed catalogue. */
function currentTheme() {
  const key = $("poll-theme") ? $("poll-theme").value : "none";
  const themes = (state.catalogue && state.catalogue.themes) || [];
  return themes.find((t) => t.key === key) || themes[0] || { key: "none", name: "No game", accent: "#7b847f", label: "" };
}

/** Redraw the likeness of the splash card. Never the artwork -- see the header. */
function renderPreview() {
  const card = $("poll-preview-card");
  if (!card) return;
  const theme = currentTheme();
  const question = ($("poll-question") ? $("poll-question").value : "").trim();
  const multi = $("poll-multi") && $("poll-multi").checked;
  const hoursField = $("poll-hours");
  const hours = hoursField && hoursField.value !== "" ? Number(hoursField.value) : null;

  card.style.setProperty("--poll-accent", theme.accent || "#7b847f");
  clear(card);
  if (theme.label) {
    const rule = el("span", "poll-preview-rule");
    rule.setAttribute("aria-hidden", "true");
    card.append(rule, el("p", "poll-preview-label", theme.label));
  }
  card.append(el("p", "poll-preview-question", question || "Your question appears here."));
  const how = multi ? "Pick as many as you like" : "One choice";
  const when = hours === null ? "closes on Chamberlain's default"
    : hours === 0 ? "closes when an admin closes it"
      : `closes in ${hours} hour${hours === 1 ? "" : "s"}`;
  card.append(el("p", "poll-preview-footer", `${how} · ${when}`));
}

function formValues() {
  const question = $("poll-question").value.trim();
  const checked = checkPollOptions(optionValues(), state.limits.max_options);
  if (!question) return { ok: false, message: "The question is empty." };
  if (!checked.ok) return checked;
  const hoursField = $("poll-hours").value;
  const body = {
    question,
    options: checked.options,
    theme: $("poll-theme").value,
  };
  if ($("poll-multi").checked) body.multi = true;
  if ($("poll-hide").checked) body.hide_results = true;
  if (hoursField !== "") body.hours = Number(hoursField);
  const role = $("poll-role").value.trim();
  if (role) body.role_id = role;
  return { ok: true, body };
}

// -- sending ---------------------------------------------------------------

/**
 * Queue one verb and watch for the authority's answer.
 *
 * ACCEPTANCE IS NOT SUCCESS. A 202 means the row was written, nothing more; the page
 * waits for Chamberlain to write an outcome, and reports the outcome. Treating the
 * 202 as done is the one mistake this whole architecture makes easy.
 */
async function send(action, params, { pending, done }) {
  status(pending, "pending");
  let queued;
  try {
    queued = await state.api.runPoll(action, params);
  } catch (err) {
    status(describeError(err), "error");
    return null;
  }
  const row = await awaitOutcome(state.api, queued.id);
  if (row.timedOut) {
    status("Queued, but Chamberlain hasn't answered yet. It may still run — reload in a moment.", "pending");
    return null;
  }
  if (!row.ok) {
    status(describeError({ status: 200, code: row.error, detail: row.result && row.result.detail }), "error");
    return null;
  }
  status(done(row.result || {}), "ok");
  await refresh();
  return row;
}

async function openPoll() {
  const form = formValues();
  if (!form.ok) {
    status(form.message, "error");
    return;
  }
  const channel = $("poll-channel").value;
  if (!channel) {
    status("Choose a channel to post it in.", "error");
    return;
  }
  await send("poll_open", { ...form.body, channel_id: channel }, {
    pending: "Queued. Waiting for Chamberlain to post it…",
    done: (r) => `Poll #${r.poll_id} is open.`,
  });
}

async function saveTemplate() {
  const name = $("poll-template-name").value.trim();
  if (!name) {
    status("Give the template a name.", "error");
    return;
  }
  const form = formValues();
  if (!form.ok) {
    status(form.message, "error");
    return;
  }
  await send("poll_template_save", { ...form.body, name }, {
    pending: "Saving the template…",
    done: (r) => `Template "${r.name}" saved with ${r.options} options.`,
  });
}

async function runTemplate(name) {
  const channel = $("poll-channel").value;
  if (!channel) {
    status("Choose a channel to post it in.", "error");
    return;
  }
  await send("poll_open", { template: name, channel_id: channel }, {
    pending: `Running "${name}"…`,
    done: (r) => `Poll #${r.poll_id} is open.`,
  });
}

async function deleteTemplate(name) {
  if (!window.confirm(`Delete the template "${name}"? Polls already run from it are unaffected.`)) return;
  await send("poll_template_delete", { name }, {
    pending: `Deleting "${name}"…`,
    done: () => `Template "${name}" deleted.`,
  });
}

async function deletePoll(id, question) {
  // Two sentences and a typed-out consequence, because this is the only button on
  // the page that destroys something. Close freezes a result the server can still
  // read; this throws the question, every vote and both posts away.
  if (!window.confirm(
    `Delete poll #${id} permanently?\n\n"${question}"\n\n`
    + "Its posts in Discord and every vote on it go too. This cannot be undone.")) return;
  await send("poll_delete", { poll_id: id }, {
    pending: `Deleting poll #${id}…`,
    done: (r) => `Poll #${id} deleted, along with ${r.posts} post${r.posts === 1 ? "" : "s"} and every vote on it.`,
  });
}

async function closePoll(id) {
  if (!window.confirm(`Close poll #${id} now? Its result is frozen at the moment it closes.`)) return;
  await send("poll_close", { poll_id: id }, {
    pending: `Closing poll #${id}…`,
    done: (r) => `Poll #${id} closed with ${r.votes} vote${r.votes === 1 ? "" : "s"} counted.`,
  });
}

async function extendPoll(id) {
  const typed = window.prompt(`Hours from now for poll #${id} to close. 0 removes the deadline.`, "24");
  if (typed === null) return;
  const hours = Number(typed);
  if (!Number.isInteger(hours) || hours < 0 || hours > 720) {
    status("That is not a whole number of hours between 0 and 720.", "error");
    return;
  }
  await send("poll_extend", { poll_id: id, hours }, {
    pending: `Changing poll #${id}'s deadline…`,
    // The deadline is drawn on a card that is never re-uploaded, so the reader is
    // TOLD the art disagrees rather than left to notice it later.
    done: (r) => (r.card_stale
      ? `Poll #${id} rescheduled. Its splash art still shows the old deadline — the text under it is the one that counts.`
      : `Poll #${id} rescheduled.`),
  });
}

// -- rendering the lists ---------------------------------------------------

function loadIntoForm(t) {
  $("poll-question").value = t.question || "";
  $("poll-theme").value = t.theme || "none";
  $("poll-multi").checked = Boolean(t.multi);
  $("poll-hide").checked = Boolean(t.hide_results);
  $("poll-hours").value = t.duration_hours === null || t.duration_hours === undefined ? "" : String(t.duration_hours);
  $("poll-role").value = (t.vote_role_ids && t.vote_role_ids[0]) || "";
  $("poll-template-name").value = t.name || "";
  renderOptions(Array.isArray(t.options) ? t.options : []);
  status(`Loaded "${t.name}" into the form. Nothing is sent until you press a button.`, "ok");
}

function renderTemplates(templates) {
  const box = $("poll-templates");
  if (!box) return;
  clear(box);
  if (!templates.length) {
    box.append(el("p", "admin-empty", "No templates saved yet. Fill the form in and press “Save as template”."));
    return;
  }
  for (const t of templates) {
    const card = el("div", "admin-card poll-template");
    card.append(el("h3", "admin-card-head", t.name));
    card.append(el("p", "poll-template-question", t.question));
    const bits = [`${t.options.length} options`];
    if (t.multi) bits.push("multi-choice");
    if (t.hide_results) bits.push("hidden tally");
    bits.push(t.duration_hours ? `${t.duration_hours}h` : "no deadline");
    card.append(el("p", "admin-state-detail", bits.join(" · ")));

    const actions = el("div", "admin-actions");
    const run = el("button", "admin-action", "Run it");
    run.type = "button";
    run.addEventListener("click", () => runTemplate(t.name));
    const load = el("button", "admin-action", "Load into form");
    load.type = "button";
    load.addEventListener("click", () => loadIntoForm(t));
    const drop = el("button", "admin-action admin-action--danger", "Delete");
    drop.type = "button";
    drop.addEventListener("click", () => deleteTemplate(t.name));
    actions.append(run, load, drop);
    card.append(actions);
    box.append(card);
  }
}

function renderPolls(polls) {
  const box = $("poll-list");
  if (!box) return;
  clear(box);
  if (!polls.length) {
    box.append(el("p", "admin-empty", "No polls yet."));
    return;
  }
  const themes = (state.catalogue && state.catalogue.themes) || [];
  for (const poll of polls) {
    const card = el("div", "admin-card poll-card");
    // The bars take the poll's OWN accent, the same colour Chamberlain draws its
    // results card in. A page whose bars are always phosphor while Discord's are
    // rust makes the two look like different features.
    const accent = (themes.find((t) => t.key === poll.theme) || {}).accent;
    if (accent) card.style.setProperty("--poll-accent", accent);
    const head = el("div", "admin-card-head");
    head.append(el("span", "poll-number", `#${poll.id}`));
    head.append(el("span", "poll-question-text", poll.question));
    card.append(head);

    const shown = describePoll(poll);
    const line = el("p", `admin-state admin-state--${shown.kind}`);
    line.append(el("span", "admin-dot"));
    line.append(el("span", null, shown.headline));
    if (shown.detail) line.append(el("span", "admin-state-detail", ` ${shown.detail}`));
    card.append(line);

    const rows = el("ul", "poll-tally");
    for (const row of tallyRows(poll)) {
      const li = el("li", "poll-tally-row");
      li.append(el("span", "poll-option-letter", row.letter));
      li.append(el("span", "poll-tally-label", row.label));
      const bar = el("span", "poll-bar");
      // A hidden tally draws no bar at all. A zero-width one would be a claim about
      // a number nobody is allowed to see yet.
      if (row.share !== null) bar.style.setProperty("--poll-share", `${row.share}%`);
      li.append(bar);
      li.append(el("span", "poll-tally-count", row.count === null ? "—" : `${row.count} (${row.share}%)`));
      rows.append(li);
    }
    card.append(rows);
    if (poll.hide_results && !poll.closed_at) {
      card.append(el("p", "admin-state-detail", "The tally is hidden from everyone until this poll closes."));
    }

    const actions = el("div", "admin-actions");
    if (!poll.closed_at) {
      const close = el("button", "admin-action", "Close now");
      close.type = "button";
      close.addEventListener("click", () => closePoll(poll.id));
      const extend = el("button", "admin-action", "Reschedule");
      extend.type = "button";
      extend.addEventListener("click", () => extendPoll(poll.id));
      actions.append(close, extend);
    }
    // Offered on CLOSED polls too, and that is the point: clearing the history is
    // the reason this button exists, and a finished poll is exactly what needs
    // clearing. Close is no longer styled as the dangerous one -- next to a real
    // delete it is the mild option, and two red buttons teach nothing.
    const drop = el("button", "admin-action admin-action--danger", "Delete");
    drop.type = "button";
    drop.addEventListener("click", () => deletePoll(poll.id, poll.question));
    actions.append(drop);
    card.append(actions);
    box.append(card);
  }
}

function renderCatalogue(cat) {
  state.catalogue = cat;
  state.limits = cat.limits || { max_options: POLL_MAX_OPTIONS };

  const theme = $("poll-theme");
  clear(theme);
  for (const t of cat.themes) {
    const option = el("option", null, t.name);
    option.value = t.key;
    theme.append(option);
  }
  const channel = $("poll-channel");
  const chosen = channel.value;
  clear(channel);
  if (!cat.channels.length) {
    const none = el("option", null, "No channel Chamberlain can post in");
    none.value = "";
    channel.append(none);
  }
  for (const ch of cat.channels) {
    const option = el("option", null, ch.name);
    option.value = ch.id;
    channel.append(option);
  }
  if (chosen) channel.value = chosen;

  renderTemplates(cat.templates || []);
  renderPolls(cat.polls || []);
  renderPreview();
}

async function refresh() {
  const cat = await state.api.polls();
  renderCatalogue(cat);
  return cat;
}

// -- boot ------------------------------------------------------------------

function wire() {
  $("poll-add-option").addEventListener("click", () => {
    const values = optionValues();
    if (values.length >= state.limits.max_options) return;
    values.push("");
    renderOptions(values);
  });
  $("poll-open").addEventListener("click", openPoll);
  $("poll-save-template").addEventListener("click", saveTemplate);
  for (const id of ["poll-question", "poll-theme", "poll-multi", "poll-hours"]) {
    const node = $(id);
    if (node) node.addEventListener("input", renderPreview);
    if (node) node.addEventListener("change", renderPreview);
  }
}

export async function boot() {
  const main = $("admin-main");
  let token = null;
  try {
    token = window.localStorage.getItem(TOKEN_KEY);
  } catch {
    gate("This browser is blocking storage, so the portal cannot keep you signed in.");
    return;
  }
  if (!token) {
    gate("Sign in on the forums first — the portal uses the same Discord session.");
    return;
  }
  const cfg = window.OSSUARY || {};
  state.api = createApi({
    base: cfg.portalApiUrl === undefined ? DEFAULT_API : cfg.portalApiUrl,
    token,
    onSignedOut: () => gate("Your portal session has expired. Sign in again on the forums."),
  });
  if (!state.api.configured) {
    gate("The portal is not configured on this site yet.");
    return;
  }
  try {
    const cat = await state.api.polls();
    if (!cat.can_create) {
      gate("Only staff can open polls.");
      return;
    }
    if (main) main.hidden = false;
    if (main) main.removeAttribute("aria-busy");
    const form = $("poll-form-section");
    if (form) form.hidden = false;
    wire();
    renderOptions([]);
    renderCatalogue(cat);
  } catch (err) {
    gate(describeError(err));
  }
}

if (typeof document !== "undefined" && document.getElementById("poll-form-section")) boot();
