// /intake/ — the Chamberlain's deep intake: seventeen questions, answered on the site.
//
// WHY THE QUESTIONS ARE NOT IN THIS FILE. The question text IS the storage key on the far side
// (chamberlain/brain/intake.py::DEEP_QUESTIONS, copied into the Worker's src/intake.js and checked
// against the Python by a test). A question reworded by one character does not rename an answer —
// it ORPHANS it and starts a second row. A third copy here would be a third chance to drift, so the
// page renders whatever GET /v1/intake sends and sends the same strings back untouched.
//
// THE CONSENT TEXT COMES FROM THE WORKER for the same reason: the basis a member agreed to and the
// words they were shown cannot drift apart if there is only one copy of the words.
//
// Everything above main() is pure and document-free, so tests/intake.test.mjs can import this
// module under `node --test`. Every string from the API reaches the page through el()'s `text`
// (textContent) — nothing is ever inserted as HTML.
//
// SIGN-IN IS NOT OFFERED HERE, deliberately. js/forum/auth.js::safeReturnPath only honours a
// same-origin path under /forums/, so a sign-in started from /intake/ would land the member back on
// the forums anyway. The gate says so and links there, as admin/ does.
import { boot } from "./boot.js?v=20261008-1";
import { describeError } from "./api.js?v=20261008-1";
import { el, mount, showStatus, emptyState, timeEl, FORUMS } from "./render.js?v=20261008-1";

// --- Pure -----------------------------------------------------------------------------------

/** The Worker's MAX_ANSWER, used only when a response does not name it. */
export const MAX_ANSWER_FALLBACK = 1200;

/** More questions than the Worker has ever had is a response to distrust, not to render. */
export const MAX_QUESTIONS = 40;

/** The per-answer ceiling the Worker will actually enforce, from its own response. */
export function answerLimit(payload) {
  const n = Number(payload?.max_answer_chars);
  if (!Number.isInteger(n) || n < 1) return MAX_ANSWER_FALLBACK;
  return Math.min(n, 10000);
}

/**
 * The questions to draw, as {question, helper}. A question with no usable text is dropped rather
 * than rendered blank: an unlabelled box cannot be answered, and an answer under an empty key would
 * be dropped by the Worker anyway.
 */
export function questionList(payload) {
  const raw = Array.isArray(payload?.questions) ? payload.questions : [];
  const out = [];
  const seen = new Set();
  for (const row of raw.slice(0, MAX_QUESTIONS)) {
    const question = typeof row?.question === "string" ? row.question.trim() : "";
    if (!question || seen.has(question)) continue;
    seen.add(question);
    out.push({ question, helper: typeof row?.helper === "string" ? row.helper.trim() : "" });
  }
  return out;
}

/**
 * The consent block: {required, text}. `required` defaults to TRUE when the response is silent —
 * a missing field must not be read as "no consent needed".
 */
export function consentOf(payload) {
  const c = payload?.consent;
  const text = typeof c?.text === "string" ? c.text.trim() : "";
  return { required: c?.required !== false, text };
}

/**
 * What the Worker will store for this answer, computed here so the member is shown the same number
 * the Worker counts. It collapses every run of whitespace to one space, trims, then cuts to the
 * limit (src/intake.js), so a typed paragraph break does NOT survive — hence the hint on the form.
 */
export function normalizeAnswer(text, limit = MAX_ANSWER_FALLBACK) {
  if (typeof text !== "string") return "";
  return text.replace(/\s+/g, " ").trim().slice(0, Math.max(1, limit));
}

/** True when normalising would have to cut this answer, i.e. the member is over the limit. */
export function overLimit(text, limit = MAX_ANSWER_FALLBACK) {
  if (typeof text !== "string") return false;
  return text.replace(/\s+/g, " ").trim().length > Math.max(1, limit);
}

/** "412 / 1,200" under a box. */
export function countLabel(text, limit = MAX_ANSWER_FALLBACK) {
  const n = normalizeAnswer(text, Number.MAX_SAFE_INTEGER).length;
  return `${n.toLocaleString("en-GB")} / ${limit.toLocaleString("en-GB")}`;
}

/**
 * The [[question, answer], ...] to send. `read(index)` hands back the raw text of a box.
 *
 * Blank answers are LEFT OUT rather than sent empty. The Worker would accept them and count them
 * in `queued`, which would then report a number the member did not recognise; and nobody has to
 * answer all seventeen.
 */
export function collect(questions, read, limit = MAX_ANSWER_FALLBACK) {
  const out = [];
  questions.forEach((q, i) => {
    const answer = normalizeAnswer(read(i), limit);
    if (answer) out.push([q.question, answer]);
  });
  return out;
}

/** A reason this cannot be sent yet, or null. Mirrors the Worker so a refusal is not the first news. */
export function submitProblem(answers, { consentRequired = true, consented = false } = {}) {
  if (consentRequired && !consented) return "Tick the box to say you're happy for these to be used, then send.";
  if (!answers.length) return "Answer at least one question before sending.";
  return null;
}

/** "Sent. Three answers are waiting for the Chamberlain." */
export function sentLine(queued) {
  const n = Number(queued);
  const count = Number.isInteger(n) && n > 0 ? n : 0;
  return `Sent. ${count.toLocaleString("en-GB")} answer${count === 1 ? "" : "s"} are waiting for the Chamberlain, `
    + "and he collects them within a few minutes. Send again any time — a new set replaces one that is still waiting.";
}

/** The pending row's timestamp as an ISO string for <time>, or null. c.now is ms since the epoch. */
export function pendingTime(pending) {
  const ms = Number(pending?.created_at);
  if (!Number.isFinite(ms) || ms <= 0) return null;
  const iso = new Date(ms).toISOString();
  return iso === "Invalid Date" ? null : iso;
}

/**
 * One plain sentence for any failure of this form. Separate from describeError() because the
 * refusals here are not the forum's: the 403s are about consent and membership, a 500 is the
 * two-tabs race on the Worker's one-queued-row-per-member index, and a 503 means the route is not
 * switched on rather than that the forum is down.
 */
export function describeIntakeError(err) {
  const status = err?.status;
  const code = err?.code;
  const reason = err?.reason;
  if (status === 0 || code === "network") return "Couldn't reach the Ossuary. Nothing was sent — check your connection and try again.";
  if (status === 401) return "Your sign-in has run out. Sign in again on the forums, then come back to this page.";
  if (status === 403 && reason === "consent_required") return "Nothing was sent: the consent box has to be ticked first.";
  if (status === 403 && reason === "not_member") return "This form is for members of the Null Ossuary Discord. Join, finish the welcome, then come back.";
  if (status === 403) return "The Ossuary wouldn't accept that.";
  if (status === 413 || code === "too_large") return "That is more than the form can send in one go. Shorten the longest answers and send again.";
  if (status === 400) return "The Ossuary couldn't read that. Reload the page — the question list may have changed — and try again.";
  if (status === 503 || code === "unavailable") return "The deep intake isn't switched on at the moment. Try again later; nothing was sent.";
  if (status === 500) return "Something crossed on the way in. Reload the page: it will say whether a set of answers is already waiting.";
  if (status === 429) return describeError(err);
  return "The Ossuary is having trouble right now. Try again in a minute.";
}

// --- The page -------------------------------------------------------------------------------

/**
 * One question: label, helper, textarea, live count. Returns {root, textarea}.
 *
 * Exported for tests/intake.test.mjs, which renders it into a stand-in document that has no
 * innerHTML to call and serialises the way a browser would, with the question and helper replaced
 * by markup — the question text is the Worker's to choose, and this page is where it is drawn.
 */
export function questionField(index, q, limit = MAX_ANSWER_FALLBACK) {
  const id = `intake-q${index + 1}`;
  const hintId = `${id}-hint`;
  const countId = `${id}-count`;
  const textarea = el("textarea", {
    id,
    rows: 3,
    maxlength: limit,
    autocomplete: "off",
    spellcheck: "true",
    "aria-describedby": q.helper ? `${hintId} ${countId}` : countId,
  });
  const counter = el("span", { class: "composer-count", id: countId, "aria-live": "off", text: countLabel("", limit) });
  const update = () => {
    counter.textContent = countLabel(textarea.value, limit);
    counter.classList.toggle("over", overLimit(textarea.value, limit));
  };
  textarea.addEventListener("input", update);
  return {
    root: el("div", { class: "field intake-field" },
      el("label", { for: id, text: q.question }),
      q.helper ? el("p", { class: "intake-helper small muted", id: hintId, text: q.helper }) : null,
      textarea,
      el("p", { class: "composer-hint small" },
        el("span", { text: "Line breaks become spaces. Leave anything blank to skip it." }),
        counter)),
    textarea,
  };
}

/**
 * The consent block and its tickbox. The WORDS COME FROM THE WORKER (src/intake.js serves them with
 * the questions) so the basis a member agreed to and the text they were shown cannot drift apart;
 * this page only draws them, with textContent. Exported for the same XSS test as questionField.
 */
export function consentCard(consent) {
  const checkbox = el("input", { type: "checkbox", id: "intake-consent" });
  const root = el("div", { class: "card intake-consent" },
    el("p", { class: "eyebrow", text: "What happens to these" }),
    el("p", { text: consent?.text || "These answers are used to write lore about you." }),
    el("p", { class: "field intake-check" },
      checkbox,
      el("label", { for: "intake-consent", text: "I'm happy for my answers to be used this way." })));
  return { root, checkbox };
}

function gate(title, line, action = "Go to the forums") {
  return emptyState(title, line, el("a", { class: "btn btn-primary", href: FORUMS, text: action }));
}

async function main() {
  const ctx = await boot();
  if (!ctx.user) {
    mount(gate("Sign in to answer",
      "The deep intake is for members of the Null Ossuary Discord. Sign in on the forums, then come back to this page.",
      "Sign in on the forums"));
    return;
  }

  let payload;
  try {
    payload = await ctx.api.intake();
  } catch (err) {
    showStatus(describeIntakeError(err));
    if (err?.status === 403 && err.reason === "not_member") {
      mount(gate("Members only", "The deep intake is for members of the Null Ossuary Discord."));
    } else if (err?.status === 401) {
      mount(gate("Your sign-in has run out", "Sign in again on the forums, then come back to this page.", "Sign in on the forums"));
    } else {
      mount(gate("The deep intake couldn't be loaded", describeIntakeError(err), "Back to the forums"));
    }
    return;
  }

  const questions = questionList(payload);
  const limit = answerLimit(payload);
  const consent = consentOf(payload);
  if (!questions.length) {
    mount(gate("No questions right now", "The Chamberlain has nothing to ask at the moment. Try again later.", "Back to the forums"));
    return;
  }

  const head = el("header", { class: "board-head" },
    el("div", {},
      el("p", { class: "eyebrow", text: "The Chamberlain" }),
      el("h1", { text: "The deep intake" }),
      el("p", { class: "muted", text: `${questions.length} questions. Answer as many or as few as you like, up to `
        + `${limit.toLocaleString("en-GB")} characters each, and send them whenever you want.` })));

  // Already waiting: said plainly, and not a reason to be refused the form. The Worker replaces a
  // queued set rather than queueing two, so sending again is the supported way to change an answer.
  const waitingAt = pendingTime(payload.pending);
  const waiting = payload.pending
    ? el("div", { class: "card intake-waiting", role: "status" },
      el("p", {},
        el("strong", { text: "A set of your answers is already waiting." }),
        waitingAt ? el("span", { text: " Sent " }) : null,
        waitingAt ? timeEl(waitingAt) : null,
        el("span", { text: waitingAt ? "." : "" })),
      el("p", { class: "muted small", text: "The Chamberlain hasn't collected it yet. Sending again REPLACES it — "
        + "only the newest set is kept, so fill in the whole form, not just the part you want to change. "
        + "The answers themselves are never sent back to this page, so the boxes below start empty." }))
    : null;

  const fields = questions.map((q, i) => questionField(i, q, limit));

  const { root: consentBlock, checkbox: consentBox } = consentCard(consent);

  const send = el("button", { class: "btn btn-primary", type: "submit", text: "Send my answers" });
  const status = el("p", { class: "form-status small", role: "status", "aria-live": "polite" });
  const form = el("form", { class: "card form intake-form", novalidate: true },
    ...fields.map((f) => f.root),
    consentBlock,
    el("div", { class: "form-row" }, send, el("a", { class: "btn btn-ghost", href: FORUMS, text: "Back to the forums" })),
    status);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const answers = collect(questions, (i) => fields[i].textarea.value, limit);
    const problem = submitProblem(answers, { consentRequired: consent.required, consented: consentBox.checked });
    if (problem) {
      status.textContent = problem;
      (answers.length ? consentBox : fields[0].textarea).focus();
      return;
    }
    send.disabled = true;
    status.textContent = "Sending…";
    let result;
    try {
      result = await ctx.api.submitIntake(true, answers);
    } catch (err) {
      status.textContent = describeIntakeError(err);
      send.disabled = false;
      return;
    }
    showStatus("");
    mount(head, el("div", { class: "card intake-done" },
      el("p", { class: "eyebrow", text: "∅" }),
      el("h2", { text: "Thank you" }),
      el("p", { text: sentLine(result?.queued) }),
      el("p", { class: "cta" },
        el("a", { class: "btn btn-ghost", href: FORUMS, text: "Back to the forums" }))));
    window.scrollTo({ top: 0 });
  });

  mount(head, waiting, form);
}

// Guarded so `node --test tests/` can import everything above it. A browser always has a document.
if (typeof document !== "undefined") {
  main().catch(() => {
    showStatus("Something went wrong loading the deep intake.");
  });
}
